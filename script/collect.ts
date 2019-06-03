#!/usr/bin/env ts-node

if (!process.env.GH_TOKEN || !process.env.CROWDIN_KEY) {
  require('dotenv-safe').load()
}

import * as del from 'del'
import * as fs from 'fs'
import * as got from 'got'
import { sync as mkdir } from 'make-dir'
import * as path from 'path'
import { execSync } from 'child_process'
import * as Octokit from '@octokit/rest';
const packageJson: Record<string, string[]> = require('../package.json')
const electronDocs = require('electron-docs')
const currentEnglishBasepath = path.join(__dirname, '..', 'content', 'current', 'en-US')
const englishBasepath = (version: string) => path.join(__dirname, '..', 'content', version, 'en-US')

const NUM_SUPPORTED_VERSIONS = 4

const github = new Octokit({
  auth: process.env.GH_TOKEN ? process.env.GH_TOKEN : ''
})

interface IResponse {
  tag_name: string
  assets: Octokit.ReposGetReleaseByTagResponseAssetsItem[]
}

interface IElectronDocsResponse {
  slug: string
  filename: string
  markdown_content: string
}

let release: IResponse

main().catch((err: Error) => {
  console.log('Something goes wrong. Error: ', err)
  process.exit(1)
})

async function delContent (branches: Array<string>) {
  console.log('Deleting content')

  console.log('  - Deleting current content')
  await del(currentEnglishBasepath)
  for (const branch of branches) {
    console.log(`  - Deleting content for ${branch}`)
    await del(englishBasepath(branch))
  }
}

async function main() {
  await getSupportedBranches()
  await delContent(packageJson.supportedVersions)
  await fetchRelease()
  await fetchAPIDocsFromLatestStableRelease()
  await fetchAPIDocsFromSupportedVersions()
  await fetchApiData()
  await getMasterBranchCommit()
  await fetchTutorialsFromMasterBranch()
  await fetchTutorialsFromSupportedBranch()
  await fetchWebsiteContent()
}

async function getSupportedBranches() {
  console.log(`Fetching latest ${NUM_SUPPORTED_VERSIONS} supported versions`)

  const resp = await github.repos.listBranches({
    owner: 'electron',
    repo: 'electron',
  })

  const branches = resp.data
    .filter(branch => {
      return branch.protected && branch.name.match(/[0-9]-[0-9]-x/)
    })
    .map(b => b.name)

  const filtered: Record<string, string> = {}
  branches.sort().forEach(branch => filtered[branch.charAt(0)]= branch)
  const filteredBranches = Object.values(filtered).slice(-NUM_SUPPORTED_VERSIONS)

  // TODO: remove current branch
  writeToPackageJSON('supportedVersions', filteredBranches)
  return Promise.resolve()
}

async function fetchRelease () {
  console.log(`Determining 'latest' version dist-tag on npm`)
  const version = execSync('npm show electron version').toString().trim()

  console.log(`   Fetching release data from GitHub`)

  const repo = {
    owner: 'electron',
    repo: 'electron',
    tag: `v${version}`
  }

  const res = await github.repos.getReleaseByTag(repo)
  release = res.data
}

async function fetchAPIDocsFromLatestStableRelease () {
  console.log(`Fetching API docs from electron/electron#${release.tag_name}`)

  writeToPackageJSON('electronLatestStableTag', release.tag_name)
  const docs = await electronDocs(release.tag_name)

  docs
    .filter((doc: IElectronDocsResponse) => doc.filename.startsWith('api/'))
    .forEach(writeDoc)

  return Promise.resolve()
}

async function fetchAPIDocsFromSupportedVersions () {
  for (const version of packageJson.supportedVersions) {
    if (version.includes('5-0-x')) continue
    console.log(`Fetching API docs from electron/electron#${version}`)
    const docs = await electronDocs(version)

    docs
      .filter((doc: IElectronDocsResponse) => doc.filename.startsWith('api/'))
      .forEach((doc: IElectronDocsResponse) => {
        writeOtherDoc(doc, version)
      })
  }

  return Promise.resolve()
}

async function fetchApiData () {
  console.log(`Fetching API definitions from electron/electron#${release.tag_name}`)

  const asset = release.assets.find(asset => asset.name === 'electron-api.json')

  if (!asset) {
    return Promise.reject(Error(`No electron-api.json asset found for ${release.tag_name}`))
  }

  const response = await got(asset.browser_download_url, { json: true })
  const apis = response.body
  const filename = path.join(currentEnglishBasepath, 'electron-api.json')
  mkdir(path.dirname(filename))
  console.log(`Writing ${path.relative(currentEnglishBasepath, filename)} (without changes)`)
  fs.writeFileSync(filename, JSON.stringify(apis, null, 2))
  return Promise.resolve(apis)
}

async function getMasterBranchCommit () {
  console.log(`Fetching Electron master branch commit SHA`)
  const master = await github.repos.getBranch({
    owner: 'electron',
    repo: 'electron',
    branch: 'master'
  })

  writeToPackageJSON('electronMasterBranchCommit', master.data.commit.sha)
}

async function fetchTutorialsFromMasterBranch () {
  console.log(`Fetching tutorial docs from electron/electron#master`)

  const docs = await electronDocs('master')

  docs
    .filter((doc: IElectronDocsResponse) => !doc.filename.startsWith('api/'))
    .filter((doc: IElectronDocsResponse) => !doc.filename.includes('images/'))
    .forEach(writeDoc)

  return Promise.resolve()
}

async function fetchTutorialsFromSupportedBranch () {
  for (const version of packageJson.supportedVersions) {
    if (version.includes('5-0-x')) continue
    console.log(`Fetching tutorial docs from electron/electron#${version}`)
    const docs = await electronDocs(version)

    docs
      .filter((doc: IElectronDocsResponse) => !doc.filename.startsWith('api/'))
      .filter((doc: IElectronDocsResponse) => !doc.filename.includes('images/'))
      .forEach((doc: IElectronDocsResponse) => {
        writeOtherDoc(doc, version)
      })
  }

  return Promise.resolve()
}

async function fetchWebsiteContent () {
  console.log(`Fetching locale.yml from electron/electronjs.org#master`)

  const url = 'https://rawgit.com/electron/electronjs.org/master/data/locale.yml'
  const response = await got(url)
  const content = response.body
  const websiteFile = path.join(currentEnglishBasepath, 'website', `locale.yml`)
  mkdir(path.dirname(websiteFile))
  console.log(`Writing ${path.relative(currentEnglishBasepath, websiteFile)}`)
  fs.writeFileSync(websiteFile, content)
  return Promise.resolve()
}

// Utility functions

function writeDoc (doc: IElectronDocsResponse) {
  const filename = path.join(currentEnglishBasepath, 'docs', doc.filename)
  mkdir(path.dirname(filename))
  fs.writeFileSync(filename, doc.markdown_content)
  // console.log('   ' + path.relative(englishBasepath, filename))
}

function writeOtherDoc (doc: IElectronDocsResponse, version: string) {
  const basepath = englishBasepath(version).toString()
  const filename = path.join(basepath, 'docs', doc.filename)
  mkdir(path.dirname(filename))
  fs.writeFileSync(filename, doc.markdown_content)
  // console.log('   ' + path.relative(englishBasepath('4-2-x'), filename))
}

function writeToPackageJSON (key: string, value: string | Array<string>) {
  const pkg = require('../package.json')
  pkg[key] = value
  fs.writeFileSync(
    require.resolve('../package.json'),
    JSON.stringify(pkg, null, 2)
  )
}
