# uygulama

> Uygulamanızın olay yaşam döngüsünü kontrol edin.

Süreç: [Ana](../glossary.md#main-process)

Aşağıdaki örnek, son pencere kapatıldığında uygulamadan nasıl çıkılacağını göstermektedir:

```javascript
const { app } = require('electron')
app.on('window-all-closed', () => {
  app.quit()
})
```

## Etkinlikler

`app` nesnesi aşağıdaki olaylarla ortaya çıkar:

### Olay: 'will-finish-launching'

Uygulama temel başlangıcını bitirdiği zaman ortaya çıkar. Windows ve Linux'ta, `bitiş başlatma` olayı, `hazır` etkinliği ile aynıdır; macOS'ta bu olay, `NSApplication` 'in `applicationWillFinishLaunching` bildirimini temsil eder. Genellikle, `açık dosya` ve `açık-url` olayları için dinleyicileri ayarlarsınız ve çökme muhabirini ve otomatik güncelleyiciyi başlatırsınız.

In most cases, you should do everything in the `ready` event handler.

### Etkinlik: 'hazır'

Dönüşler:

* `launchInfo` unknown *macOS*

Elektron başlatmayı bitirdiğinde ortaya çıkar. MacOS'ta, `launchInfo`, Bildirim Merkezi'nden başlatıldığı takdirde, uygulamayı açmak için kullanılan `NSUserNotification` öğesinin `kullanıcı bilgisi`'ni tutar. Bu etkinliğin zaten başlayıp başlamadığını kontrol etmek için `app.isReady()` 'i arayabilirsiniz.

### Olay: 'Tüm-pencereler-kapalı'

Tüm pencereler kapatıldığında ortaya çıkar.

Bu etkinliğe abone değilseniz ve tüm pencereler kapalıysa, varsayılan davranış, uygulamadan çıkmaktır; ancak, abone olursanız, uygulamanın sona erip ermeyeceğini kontrol edersiniz. Kullanıcı `Cmd + Q` tuşlarına basarsa veya geliştirici `app.quit()`'i çağırırsa, Electron önce tüm pencereleri kapatmaya ve ardından `will-quit` olayını yayınlamaya çalışacaktır ve bu durumda `Tüm-Pencereler-Kapalı` olayı yayınlanmayacaktır.

### Olay: 'çıkıştan-önce'

Dönüşler:

* `event` Event

Emitted before the application starts closing its windows. Calling `event.preventDefault()` will prevent the default behavior, which is terminating the application.

**Note:** If application quit was initiated by `autoUpdater.quitAndInstall()`, then `before-quit` is emitted *after* emitting `close` event on all windows and closing them.

**Note:** On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Etkinlik: 'çıkış-yapılacak'

Dönüşler:

* `event` Event

Tüm pencereler kapatıldığında ve uygulamadan çıkıldığında ortaya çıkar. `event.preventDefault()` öğesini çağırmak, uygulamayı sonlandıran varsayılan davranışı engelleyecektir.

Arasındaki farklar için `tüm-pencereler-kapalı` olayının açıklamasına bakın `will-quit` ve `tüm-pencereler-kapalı` olayları.

**Note:** On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Etkinlik: 'çıkış'

Dönüşler:

* `event` Olay
* `çıkışKodu` Tamsayı

Uygulama kesildiğinde ortaya çıkar.

**Note:** On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Etkinlik: 'open-file' *macOS*

Dönüşler:

* `event` Event
* `path` Dizgi

Kullanıcı uygulama ile bir dosya açmak istediğinde ortaya çıkar. `open-file` olayı genellikle uygulama zaten açık olduğunda ve OS dosyayı açmak için uygulamayı tekrar kullanmak istediğinde yayınlanır. Dock'a bir dosya düştüğünde ve uygulama henüz çalışmadığında da `open-file` yayınlanır. Bu olayı işlemek için (`hazır` olayı yayından önce bile olsa), uygulamanın başlangıç ​​işleminin çok erken bir aşamasında `açık dosya` olayını dinlediğinizden emin olun.

Bu olayla ilgilenmek isterseniz `event.preventDefault()`'i çağırmanız gerekir.

Windows'ta, dosya yolunu almak için (ana süreçte) `process.argv` ayrıştırmanız gerekir.

### Olay: 'open-url' *macOS*

Dönüşler:

* `event` Olay
* `url` String

Kullanıcı uygulama ile bir url açmak istediğinde ortaya çıkar. Your application's `Info.plist` file must define the URL scheme within the `CFBundleURLTypes` key, and set `NSPrincipalClass` to `AtomApplication`.

Bu olayla ilgilenmek isterseniz `event.preventDefault()`'i çağırmanız gerekir.

### Etkinlik: 'activate' *macOS*

Dönüşler:

* `event` Event
* `hasVisibleWindows` Boolean

Uygulama etkinleştirildiğinde ortaya çıkar. Uygulamayı ilk kez başlatmak, uygulamayı zaten çalıştırırken yeniden başlatmaya çalışmak veya uygulamanın yükleme istasyonu veya görev çubuğu simgesini tıklatmak gibi çeşitli eylemler bu olayı tetikleyebilir.

### Olay: 'continue-activity' *macOS*

Dönüşler:

* `event` Olay
* xxxx: Dize - Aktiviteyi tanımlayan bir dize. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType) olarak eşleştirilir.
* `userInfo` unknown - Contains app-specific state stored by the activity on another device.

Farklı bir cihazdan bir etkinlik sürdürmek istediğinde [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) sırasında ortaya çıkar. Bu olayla ilgilenmek isterseniz `event.preventDefault()`'i çağırmanız gerekir.

Bir kullanıcı etkinliği yalnızca, etkinliğin kaynak uygulamasıyla aynı geliştirici Ekip ID'si olan ve etkinliğin türünü destekleyen bir uygulamada devam edilebilir. Desteklenen etkinlik türleri, uygulamanın `Info.plist` öğesinde `NSUserActivityTypes` anahtarının altında belirtilir.

### Olay: 'will-continue-activity' *macOS*

Dönüşler:

* `event` Olay
* `type` String - Etkinliği tanımlayan bir dize. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType)'a haritalar.

Farklı bir cihazdan gelen bir etkinlik yeniden başlatılmadan önce [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) o esnada ortaya çıkar. Bu olayla ilgilenmek isterseniz `event.preventDefault()`'i çağırmanız gerekir.

### Olay: 'continue-activity-error' *macOS*

Dönüşler:

* `event` Olay
* `type` String - Etkinliği tanımlayan bir dize. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType)'a haritalar.
* `error` dize - hatanın yerelleştirilmiş açıklamasına sahip bir dizedir.

[Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) sırasında farklı bir cihazdaki bir etkinliğin başarısız olması durumunda ortaya çıkıyor.

### Etkinlk: 'activity-was-continued' *macOS*

Dönüşler:

* `event` Olay
* `type` String - Etkinliği tanımlayan bir dize. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType)'a haritalar.
* `userInfo` unknown - Contains app-specific state stored by the activity.

Bu cihazdan bir etkinlik başarıyla yürütüldüğünde [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) o sırada ortaya çıkıyor.

### Etkinlik: 'activate' *macOS*

Dönüşler:

* `event` Olay
* xxxx: Dize - Aktiviteyi tanımlayan bir dize. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType) olarak eşleştirilir.
* `userInfo` unknown - Contains app-specific state stored by the activity.

[Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) başka bir cihazda yeniden başlatılmaya çalışıldığında yayınlanır. If you need to update the state to be transferred, you should call `event.preventDefault()` immediately, construct a new `userInfo` dictionary and call `app.updateCurrentActiviy()` in a timely manner. Otherwise, the operation will fail and `continue-activity-error` will be called.

### Etkinlik: 'new-window-for-tab' *macOS*

Dönüşler:

* `event` Event

Kullanıcı yerel macOS yeni sekme düğmesini tıklattığında ortaya çıkar. Yeni sekme düğmesi, yalnızca geçerli `BrowserWindow` öğesinin bir `tabbingIdentifier`'ı varsa görünür olur

### Olay: 'browser-window-blur'

Dönüşler:

* `event` Olay
* `browserView` [BrowserView](browser-window.md)

Bir [borwserWindow](browser-window.md) bulanıklaştığında ortaya çıkar.

### Olay: 'tarayıcı-pencere-odak'

Dönüşler:

* `event` Event
* `browserView` [BrowserView](browser-window.md)

Bir [borwserWindow](browser-window.md)'a odaklanıldığında ortaya çıkar.

### Etkinlik: 'tarayıcı-penceresi-yaratıldı'

Dönüşler:

* `event` Event
* `browserView` [BrowserView](browser-window.md)

Yeni bir [borwserWindow](browser-window.md) oluşturulduğunda ortaya çıkar.

### Etkinlik: 'web-içerikleri-yaratıldı'

Dönüşler:

* `event` Event
* `webContents` [webİçerikleri](web-contents.md)

Yeni bir [webContents](web-contents.md) oluşturulduğunda ortaya çıkar.

### Etkinlik: 'sertifika-hatası'

Dönüşler:

* `event` Event
* `webContents` [webİçerikleri](web-contents.md)
* `url` Dize
* `error` Dizi - Hata Kodu
* `certificate` [sertifika](structures/certificate.md)
* `geri aramak` Function 
  * `isTrusted` Boolean - Sertifikanın güvenilir olup olmadığını göz önünde bulundur

Çıkarıldığında `url` için `certificate` doğrulama hatası oluştu, sertifikaya güvenmek için temel davranışın oluşmasını `event.preventDefault()` ile engelleyin ve `callback(true)` arayın.

```javascript
const { app } = require('electron')

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (url === 'https://github.com') {
    // Onaylama aşaması
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})
```

### Olay: 'select-client-certificate' 

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `url` URL
* `certificateList` [Sertifika[]](structures/certificate.md)
* `geri aramak` Function 
  * `certificate` [Sertifika](structures/certificate.md) (isteğe bağlı)

Bir istemci sertifikası talep edildiğinde yayılır.

`url`, istemci sertifikasını isteyen gezinme girişine karşılık gelir ve listeden filtrelenmiş bir girdi ile `callback` çağrılabilir. `event.preventDefault()` öğesinin kullanılması, uygulamanın mağazadaki ilk sertifikayı kullanmasını engeller.

```javascript
const { app } = require('electron')

app.on('select-client-certificate', (event, webContents, url, list, callback) => {
  event.preventDefault()
  callback(list[0])
})
```

### Etkinlik: 'giriş'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `istek` Nesne 
  * `method` String
  * `url` URL
  * `referrer` URL
* `authInfo` Nesne 
  * `isProxy` Boolean
  * `scheme` String
  * `host` Dizi
  * `port` Tamsayı
  * `realm` Dizi
* `geri aramak` Function 
  * `username` Dizi
  * `password` Dizi

`webContents` temel doğrulama yapmak istediğinde çıkarılır.

The default behavior is to cancel all authentications. To override this you should prevent the default behavior with `event.preventDefault()` and call `callback(username, password)` with the credentials.

```javascript
const { app } = require('electron')

app.on('login', (event, webContents, request, authInfo, callback) => {
  event.preventDefault()
  callback('username', 'secret')
})
```

### Event: 'gpu-info-update'

Emitted whenever there is a GPU info update.

### Olay: 'gpu-process-crashed' 

Dönüşler:

* `event` Event
* `killed` Boolean

Emitted when the GPU process crashes or is killed.

### Event: 'renderer-process-crashed'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `killed` Boolean

Emitted when the renderer process of `webContents` crashes or is killed.

### Etkinlik: 'erişilebilir-destek-değişti' *macOS* *Windows*

Dönüşler:

* `event` Olay
* `accessibilitySupportEnabled` Boolean - `true` Chrome'un ulaşılabilirlik desteği etkinken, o zaman `false`.

Chrome'un erişilebilirlik takviyesi değiştiğinde ortaya çıkar. Bu olay, ekran okuyucuları gibi yardımcı teknolojilerin etkinleştirilmesi veya devre dışı bırakılmasında tetiklenir. Daha detaylı bilgi için https://www.chromium.org/developers/design-documents/accessibility ziyaret edin.

### Event: 'session-created'

Dönüşler:

* `session` [Session](session.md)

Emitted when Electron has created a new `session`.

```javascript
const { app } = require('electron')

app.on('session-created', (event, session) => {
  console.log(session)
})
```

### Event: 'second-instance'

Dönüşler:

* `event` Olay
* `argv` Dizi[] - İkinci aşamanın komuta satırı argümanları sırası
* `workingDirectory` Dizi - İkinci aşamanın çalışma dizini

This event will be emitted inside the primary instance of your application when a second instance has been executed and calls `app.requestSingleInstanceLock()`.

`argv` is an Array of the second instance's command line arguments, and `workingDirectory` is its current working directory. Genellikle uygulama, ana penceresinin odağını küçültecek ve odaklaştıracak şekilde yanıtlar.

This event is guaranteed to be emitted after the `ready` event of `app` gets emitted.

**Note:** Extra command line arguments might be added by Chromium, such as `--original-process-start-time`.

### Event: 'desktop-capturer-get-sources'

Dönüşler:

* `event` Event
* `webContents` [webİçerikleri](web-contents.md)

Emitted when `desktopCapturer.getSources()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will make it return empty sources.

### Event: 'remote-require'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `moduleName` String

Emitted when `remote.require()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the module from being returned. Custom value can be returned by setting `event.returnValue`.

### Event: 'remote-get-global'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `globalName` String

Emitted when `remote.getGlobal()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the global from being returned. Custom value can be returned by setting `event.returnValue`.

### Event: 'remote-get-builtin'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `moduleName` String

Emitted when `remote.getBuiltin()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the module from being returned. Custom value can be returned by setting `event.returnValue`.

### Event: 'remote-get-current-window'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)

Emitted when `remote.getCurrentWindow()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the object from being returned. Custom value can be returned by setting `event.returnValue`.

### Event: 'remote-get-current-web-contents'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)

Emitted when `remote.getCurrentWebContents()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the object from being returned. Custom value can be returned by setting `event.returnValue`.

### Event: 'remote-get-guest-web-contents'

Dönüşler:

* `event` Olay
* `webContents` [webİçerikleri](web-contents.md)
* `guestWebContents` [WebContents](web-contents.md)

Emitted when `<webview>.getWebContents()` is called in the renderer process of `webContents`. Calling `event.preventDefault()` will prevent the object from being returned. Custom value can be returned by setting `event.returnValue`.

## Metodlar

`app` nesnesi aşağıdaki metodlara sahiptir:

**Not:** Bazı metodlar sadece belirli işletim sistemlerinde çalışmaktadır ve çalıştıkları işletim sisteminin adlarıyla işaretlenmiştir.

### `app.quit()`

Tüm pencereleri kapatmayı dener. İlk olarak `before-quit` olayı yayılacaktır. Eğer tüm pencereler başarıyla kapatılırsa, `will-quit` olayı yayılacaktır ve varsayılan olarak uygulama sonlandırılacaktır.

Bu metod tüm `beforeunload` ve `unload` olayları işleyicilerinin düzgün şekilde yürütüleceğini garanti eder. Bir pencerenin `beforeunload` olay işleyicisine `false` dönütünü vererek, çıkışı iptal etmesi mümkündür.

### `app.exit([exitCode])`

* `exitCode` Tamsayı (Seçimli)

Exits immediately with `exitCode`. `exitCode` defaults to 0.

All windows will be closed immediately without asking the user, and the `before-quit` and `will-quit` events will not be emitted.

### `app.relaunch([options])`

* `seçenekler` Obje (opsiyonel) 
  * `args` String[] (optional)
  * `execPath` Dizgi (Seçimli)

Yürürlükteki oluşum tamamlandığında uygulamayı yeniden başlatır (relaunch).

By default, the new instance will use the same working directory and command line arguments with current instance. `args` belirtildiğinde, `args` komut satırı değişkenlerinin yerini alır. `execPath` belirtildiğinde, yeniden başlatma yürürlükteki uygulama yerine `execPath` için uygulanır.

Bu metodun uygulandığında uygulamadan çıkış yapmadığını unutmayın, uygulamayı yeniden başlatmak (restart) için `app.relaunch`'u çağırdıktan sonra `app.quit`'i veya `app.exit`'ı çağırmanız mecburidir.

`app.relaunch` birden fazla kez çağırılırsa, yürürlükteki oluşum tamamlandıktan sonra, birden fazla oluşum başlatılır.

Yürürlükteki oluşumun yeniden başlatılmasının (restart) ve yeni oluşumuna yeni bir komut satırı değişkeni eklenmesinin bir örneği:

```javascript
const { app } = require('electron')

app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
app.exit(0)
```

### `app.isReady()`

Eğer Electron sıfırlamayı tamamladıysa `Boolean` - `true` dönütünü, tamamlamadıysa `false` dönütünü verir.

### `app.whenReady()`

Returns `Promise<void>` - fulfilled when Electron is initialized. May be used as a convenient alternative to checking `app.isReady()` and subscribing to the `ready` event if the app is not ready yet.

### `app.focus()`

Linux'ta görünebilen ilk pencereye odaklanır. macOS'ta uygulamayı aktif uygulama yapar. Windows'ta uygulamanın ilk penceresine odaklanır.

### `app.hide()` *macOS*

Tüm uygulama pencerelerini simge durumuna küçültmeden gizler.

### `app.show()` *macOS*

Gizlenmiş olan uygulama pencerelerini gösterir. Pencerelere otomatik olarak odaklanmaz.

### `app.setAppLogsPath([path])`

* `path` String (optional) - A custom path for your logs. Must be absolute.

Sets or creates a directory your app's logs which can then be manipulated with `app.getPath()` or `app.setPath(pathName, newPath)`.

Calling `app.setAppLogsPath()` without a `path` parameter will result in this directory being set to `~/Library/Logs/YourAppName` on *macOS*, and inside the `userData` directory on *Linux* and *Windows*.

### `app.getAppPath()`

`String` - olarak yürürlükteki uygulama dizini dönütünü verir.

### `app.getPath(isim)`

* `name` String - You can request the following paths by the name: 
  * `home` Kullanıcının ana dizgini.
  * `appData` Her bir kullanıcının uygulama verisinin bulunduğu veri dizgini, varsayılan olarak şunlara işaret eder: 
    * Windows'ta `%APPDATA%`
    * Linux'ta `$XDG_CONFIG_HOME` veya `~/.config`
    * macOS'ta `~/Library/Application Support`
  * `userData` Uygulamanızın , varsayılan olarak uygulamanızın ismiyle ilişkilendirilen `appData` dizini olan, konfigürasyon dosyalarını saklayan dizin.
  * `önbellek`
  * `temp` Geçici dizin.
  * `exe` Yürürlükteki yürütülebilir dosya.
  * `module` - `libchromiumcontent` kütüphanesi.
  * `dekstop` Yürürlükteki kullanıcının Masaüstü dizini.
  * `documents` Bir kullanıcının "Dökümanlarım" dizini.
  * `downloads` Bir kullanıcının "İndirilenler" dizini.
  * `Müzik`Bir kullanıcının "Müziklerim" dizini.
  * `pictures` Bir kullanıcının "Resimlerim" dizini.
  * `videos` Bir kullanıcının "Videolarım" dizini.
  * Uygulamanızın günlük klasörü için `logs` dizini.
  * `pepperFlashSystemPlugin` Full path to the system version of the Pepper Flash plugin.

Returns `String` - A path to a special directory or file associated with `name`. On failure, an `Error` is thrown.

If `app.getPath('logs')` is called without called `app.setAppLogsPath()` being called first, a default log directory will be created equivalent to calling `app.setAppLogsPath()` without a `path` parameter.

### `app.getFileIcon(path[, options])`

* dizi `yolu`
* `seçenekler` Obje (opsiyonel) 
  * `boyut` Dize 
    * `küçük` - 16x16
    * `normal` - 32x32
    * `büyük` - *Linux'ta* 48x48, *Windows'ta*32x32, *macOS'de* desteklenmemektedir.

Returns `Promise<NativeImage>` - fulfilled with the app's icon, which is a [NativeImage](native-image.md).

Bir dosya yolunun ilişkili ikonunu çeker.

*Windows*'ta 2 tip ikon bulunur:

* `.mp3`, `.png` v.b. gibi belirli dosya uzantıları ile ilişkilendirilmiş ikonlar
* `.exe`, `.dll`, `.ico` gibi, dosyanın kendi içindeki ikonlar

On *Linux* and *macOS*, icons depend on the application associated with file mime type.

### `app.setPath(isim, yol)`

* `name` Dizi
* dizi `yolu`

`name` ile ilişkilendirilen özel bir dizine veya dosyaya giden dosya yolunu (`path`) baştan tanımlar. If the path specifies a directory that does not exist, an `Error` is thrown. In that case, the directory should be created with `fs.mkdirSync` or similar.

Sadece `app.getPath`'da tanımlanmış olan `name`'lere ait dosya yollarını baştan tanımlayabilirsiniz.

Varsayılan olarak, internet sayfalarının çerezleri ve önbellekleri `userData` dizininde saklanır. Eğer bu konumu değiştirmek istiyorsanız, `app` biriminin `ready` olayı yayılmadan önce `userData` dosya yolunun baştan tanımlanması mecburidir.

### `app.getVersion()
`

Yüklenen uygulamanın sürümü `String` döndürür. Uygulamanın `package.json` dosyasında hiçbir sürüm bulunamazsa, geçerli paketin veya yürütülebilir dosyanın sürümü döndürülür.

### `app.getName()`

`String` Döndürür - Uygulamanın adını belirten geçerli uygulamanın adı ` package.json ` dosyası.

Usually the `name` field of `package.json` is a short lowercase name, according to the npm modules spec. Genel olarak `productName` belirtmelisiniz, bu da uygulamanızın üst karakterle yazılmış hali olmalıdır ve Electron'un belirlediği `isimden` çok tercih edilecektir.

**[Kullanımdan kaldırıldı](modernization/property-updates.md)**

### `app.setName(name)`

* `name` Dizi

Mevcut uygulamanın ismini geçersiz kılar.

**[Kullanımdan kaldırıldı](modernization/property-updates.md)**

### `app.getLocale()`

Returns `String` - The current application locale. Possible return values are documented [here](locales.md).

To set the locale, you'll want to use a command line switch at app startup, which may be found [here](https://github.com/electron/electron/blob/master/docs/api/chrome-command-line-switches.md).

** Not:** Paketli uygulamanızı dağıtırken, aynı zamanda ` yerel ayarlar` klasörü nakledilir.

**Note:** On Windows, you have to call it after the `ready` events gets emitted.

### `app.getLocaleCountryCode()`

Returns `String` - User operating system's locale two-letter [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) country code. The value is taken from native OS APIs.

**Note:** When unable to detect locale country code, it returns empty string.

### `app.addRecentDocument(yol)` *macOS* *Windows*

* dizi `yolu`

Son dokümanlar listesine `yol` ekler.

This list is managed by the OS. On Windows, you can visit the list from the task bar, and on macOS, you can visit it from dock menu.

### `app.clearRecentDocuments()` *macOS* *Windows*

Yakın zamandaki dokümentasyon listesini temizler.

### `app.setAsDefaultProtocolClient(protocol[, path, args])`

* 71/5000 `protokol` String - `://` olmadan protokolünüzün adı: Uygulamanızın `electron://` bağlantılarını işlemesini isterseniz, bu yöntemi parametre olarak `electron` ile çağırın.
* `path` Dizi (isteğe bağlı) *Windows* - Varsayılana çevirir `process.execPath`
* `args` Dizi[] (isteğe bağlı) *Windows* - Boş düzeni varsayılana ayarlar

`Boolean` 'ı geri getirir - Çağrı başarılı olduğunda.

Bu yöntem, geçerli yürütülebilir dosyayı bir protokol için varsayılan işleyici olarak ayarlar (aka URI düzeni). Uygulamanızı daha da derinleştirerek işletim sistemine entegre etmenizi sağlar. Kayıt olduktan sonra, `your-protocol://` adresine sahip tüm bağlantılar, ile açılır. Geçerli yürütülebilir. Protokol de dahil olmak üzere tüm bağlantı, uygulamanız bir parametre olarak geçilecek.

On Windows, you can provide optional parameters path, the path to your executable, and args, an array of arguments to be passed to your executable when it launches.

**Not**: MacOS üzerinde sadece senin app `info.plist`. eklenen protokolleri kaydedebilirsiniz. Uygulamanız çalışma zamanında değiştirilemez. Bununla birlikte oluşturma süresi boyunca dosyayı basit bir metin düzenleyicisi veya komut dosyası ile değiştirin. Ayrıntılar için [Apple'ın belgelerine](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/TP40009249-102207-TPXREF115) bakın.

**Note:** In a Windows Store environment (when packaged as an `appx`) this API will return `true` for all calls but the registry key it sets won't be accessible by other applications. In order to register your Windows Store application as a default protocol handler you must [declare the protocol in your manifest](https://docs.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-uap-protocol).

API dahili olarak Windows Kayıt Defteri ve LSSetDefaultHandlerForURLScheme kullanır.

### `app.removeAsDefaultProtocolClient(protocol[, path, args])` *macOS* *Windows*

* 71/5000 `protokol` String - `://` olmadan protokolünüzün adı:
* `path` Dizi (isteğe bağlı) *Windows* - Varsayılana çevirir `process.execPath`
* `args` Dizi[] (isteğe bağlı) *Windows* - Boş düzeni varsayılana ayarlar

`Boolean` 'ı geri getirir - Çağrı başarılı olduğunda.

Bu yöntem, geçerli yürütülebilir bir iletişim kuralı (aka URI şeması) için varsayılan işleyici olarak çalışıp çalışmadığını kontrol eder. Eğer öyleyse, varsayılan işleyici olarak uygulamayı kaldırır.

### `app.isDefaultProtocolClient(protocol[, path, args])`

* 71/5000 `protokol` String - `://` olmadan protokolünüzün adı:
* `path` Dizi (isteğe bağlı) *Windows* - Varsayılana çevirir `process.execPath`
* `args` Dizi[] (isteğe bağlı) *Windows* - Boş düzeni varsayılana ayarlar

`Boole Değeri` döndürür

Bu yöntem, geçerli yürütülebilir dosyanın bir protokol için varsayılan işleyici olup olmadığını kontrol eder (aka URI düzeni). Eğer öyleyse, doğru bulacaktır. Aksi takdirde, yanlışa döndürür.

**Not**: Mac işletim sisteminde, bu yöntemle uygulamanın başarılı olup olmadığını kontrol edebilirsiniz protokol için varsayılan protokol işleyicisi olarak kayıtlı. Ayrıca bunun için ` ~/Library/Preferences/com.apple.LaunchServices.plist` dosyasını kontrol ederek macOS makinede doğruyabilirsin. Bakınız [Apple'ın belgeleri](https://developer.apple.com/library/mac/documentation/Carbon/Reference/LaunchServicesReference/#//apple_ref/c/func/LSCopyDefaultHandlerForURLScheme) Ayrıntılar için.

API dahili olarak Windows Kayıt Defteri ve LSCopyDefaultHandlerForURLScheme kullanır.

### `app.setUserTasks(tasks)` *Windows*

* `görevler<code> <a href="structures/task.md">Görev []</a> - <0>Görev` nesnelerinin dizisi

Adds `tasks` to the [Tasks](https://msdn.microsoft.com/en-us/library/windows/desktop/dd378460(v=vs.85).aspx#tasks) category of the Jump List on Windows.

`tasks`, [`görevler`](structures/task.md) nesenelerinin bir sırasıdır.

`Boolean` 'ı geri getirir - Çağrı başarılı olduğunda.

**Not:** Eğer Jump List'i daha da çok özelleştirmek istiyorsanız yerine `app.setJumpList(categories)` kullanın.

### `app.getJumpListSettings()` *Windows*

`Object` 'i geri getirir:

* `minItems` Tamsayı - Listede gösterilecek minimum öğe sayısı Atlama Listesi (bu değerin daha ayrıntılı bir açıklaması için bkz. [MSDN dokümanları](https://msdn.microsoft.com/en-us/library/windows/desktop/dd378398(v=vs.85).aspx)).
* `removedItems` [JumpListItem[]](structures/jump-list-item.md) - Array of `JumpListItem` objects that correspond to items that the user has explicitly removed from custom categories in the Jump List. Bu öğeler, **sonraki** Atlama Listesine tekrar eklenemez `app.set JumpList()` öğesini çağırın. Herhangi bir özel kategoriden kaldırılan öğelerden herhangi birini içeren windows görüntülenmez.

### `app.setJumpList(categories)` *Windows*

* `categories` [JumpListCategory[]](structures/jump-list-category.md) | `null` - Array of `JumpListCategory` objects.

Uygulama için özel bir Atlama Listesi'ni ayarlar veya kaldırır ve aşağıdaki dizelerden birini geri döndürür:

* `ok` - Hiç bir şey yanlış gitmedi.
* `error` - Bir ya da birden fazla hata meydana geldi, muhtemel sebebi anlamak için çalışma zamanı günlüğünü etkinleştirin.
* `invalidSeparatorError` - Jump List içindeki özel kategoriye ayraç eklemeye çalışma girişimi. Ayraçlar sadece standart `Tasks` kategorisinde geçerlidir.
* `fileTypeRegistrationError` - Jump List'e uygulamanın kaldıramayacağı bir dosya bağlantısıyla dosya tipinin gönderilme girişimi.
* `customCategoryAccessDeniedError` - Özel kategoriler Jump List'e kullanıcı gizliliği ve grup ilkesi ayarları gereğince eklenemez.

`kategorileri` `boş` ise, önceden ayarlanmış Özel Geçiş Listesi (varsa) olacaktır. yerine uygulama için standart Git Listesi (Windows tarafından yönetilen) değiştirildi.

**Not:** Eğer bir `JumpListCategory` nesnesinin ne `type` ne de `name` özelliği ayarlanmamışsa `type` ının `tasks` olduğu varsayılır. Eğer `name` özelliği ayarlanmış fakat `type` göz ardı edilmişse yine `type` ın `custom` olduğu varsayılır.

**Not**: Kullanıcılar öğeleri özel kategorilerden kaldırabilir ve Windows kaldırılan bir öğe'nin **tekrar** olana kadar özel bir kategoriye eklenmesine izin verin bir sonraki başarılı çağrı: `app.setJumpList (categories)`. Herhangi bir girişim öğesi kaldırılmış, daha önce özel bir kategoriye yeniden eklemek, tüm özel kategorinin Jump Listesi'nden çıkarılmasıdır. Bu kaldırılan öğelerin listesini `app.getJumpListSettings()`. kullanarak elde edebilirsiniz.

Aşağıda özel bir Atlama Listesi oluşturmanın basit bir örneği verilmiştir:

```javascript
const { app } = require('electron')

app.setJumpList([
  {
    type: 'custom',
    name: 'Recent Projects',
    items: [
      { type: 'file', path: 'C:\\Projects\\project1.proj' },
      { type: 'file', path: 'C:\\Projects\\project2.proj' }
    ]
  },
  { // has a name so `type` is assumed to be "custom"
    name: 'Tools',
    items: [
      {
        type: 'task',
        title: 'Tool A',
        program: process.execPath,
        args: '--run-tool-a',
        icon: process.execPath,
        iconIndex: 0,
        description: 'Runs Tool A'
      },
      {
        type: 'task',
        title: 'Tool B',
        program: process.execPath,
        args: '--run-tool-b',
        icon: process.execPath,
        iconIndex: 0,
        description: 'Runs Tool B'
      }
    ]
  },
  { type: 'frequent' },
  { // has no name and no type so `type` is assumed to be "tasks"
    items: [
      {
        type: 'task',
        title: 'New Project',
        program: process.execPath,
        args: '--new-project',
        description: 'Create a new project.'
      },
      { type: 'separator' },
      {
        type: 'task',
        title: 'Recover Project',
        program: process.execPath,
        args: '--recover-project',
        description: 'Recover Project'
      }
    ]
  }
])
```

### `app.requestSingleInstanceLock()`

`Boole Değeri` döndürür

The return value of this method indicates whether or not this instance of your application successfully obtained the lock. If it failed to obtain the lock, you can assume that another instance of your application is already running with the lock and exit immediately.

I.e. This method returns `true` if your process is the primary instance of your application and your app should continue loading. It returns `false` if your process should immediately quit as it has sent its parameters to another instance that has already acquired the lock.

On macOS, the system enforces single instance automatically when users try to open a second instance of your app in Finder, and the `open-file` and `open-url` events will be emitted for that. However when users start your app in command line, the system's single instance mechanism will be bypassed, and you have to use this method to ensure single instance.

İkinci bir örnek başladığında, birincil örnek penceresi harekete geçirme örneği:

```javascript
const { app } = require('electron')
let myWindow = null

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {
  })
}
```

### `app.hasSingleInstanceLock()`

`Boole Değeri` döndürür

This method returns whether or not this instance of your app is currently holding the single instance lock. You can request the lock with `app.requestSingleInstanceLock()` and release with `app.releaseSingleInstanceLock()`

### `app.releaseSingleInstanceLock()`

Releases all locks that were created by `requestSingleInstanceLock`. This will allow multiple instances of the application to once again run side by side.

### `app.setUserActivity(type, userInfo[, webpageURL])` *macOS*

* `type` Dizi - Faaliyeti benzersiz bir şekilde tanımlar. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType)'a haritalar.
* `userInfo` any - App-specific state to store for use by another device.
* ` webpageURL </ 0> String (isteğe bağlı) - Uygun bir uygulama yoksa tarayıcıya yüklenecek web sayfası yeniden başlatma aygıtına bağlı bir şema olmalıdır <code> http </ 0> veya <code> https </ 0></li>
</ul>

<p><code> NSUserActivity </ 0> (kodunu)oluşturarak onu etkin olarak ayarlar. Diğer cihazlara yönelik bu etkinliği <a href="https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html">Handoff</a> seçebilirsiniz.</p>

<h3><code>app.getCurrentActivityType()` *macOS*</h3> 
  Döndür ` Dizgi </ 0> - Halen çalışan etkinliğin türü.</p>

<h3><code>app.invalidateCurrentActivity()` *macOS*</h3> 
  
  Geçerli [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) kullanıcı etkinliğini geçersiz kılar.
  
  ### `app.resignCurrentActivity()` *macOS*
  
  Marks the current [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) user activity as inactive without invalidating it.
  
  ### `systemPapp.updateCurrentActivity(type, userInfo)` *macOS*
  
  * `type` Dizi - Faaliyeti benzersiz bir şekilde tanımlar. [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType)'a haritalar.
  * `userInfo` any - App-specific state to store for use by another device.
  
  Türü `type` ile eşleşiyorsa geçerli etkinliği günceller, y`userInfo`'den girişleri geçerli `userInfo` sözlüğe birleştirir.
  
  ### `app.setAppUserModelId(id)` *Windows*
  
  * `kimlik` dizesi
  
  Daha fazla bilgi için [Windows Dokümanlarına](https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx) bakın.
  
  ### `app.importCertificate(options, callback)` *Linux*
  
  * `seçenekler` Nesne 
    * `sertifika` Dize - pkcs12 dosyasının yolunu girin.
    * `şifre` Dize - sertifika için parola.
  * `geri aramak` Function 
    * `sonuç` Tamsayı - sonuç alma
  
  Sertifika pkcs12 formatında platform sertifika deposuna kaydedilir. `callback` is called with the `result` of import operation, a value of `0` indicates success while any other value indicates failure according to Chromium [net_error_list](https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h).
  
  ### `app.disableHardwareAcceleration()`
  
  Mevcut uygulama için donanımsal hızlandırmayı iptal eder.
  
  Bu metod sadece uygulama hazır olmadan önce çağırılabilir.
  
  ### `app.disableDomainBlockingFor3DAPIs()`
  
  Varsayılan olarak Chromium, GPU işlemleri çok sık çökerse, her etki alanı için yeniden başlatılıncaya kadar 3D API'leri (ör. WebGL) devre dışı bırakır. Bu işlev, bu davranışı devre dışı bırakır.
  
  Bu metod sadece uygulama hazır olmadan önce çağırılabilir.
  
  ### `app.getAppMetrics( )`
  
  Returns [`ProcessMetric[]`](structures/process-metric.md): Array of `ProcessMetric` objects that correspond to memory and CPU usage statistics of all the processes associated with the app.
  
  ### `app.getGPUFeatureStatus()`
  
  ` GPU Özellik Durumu'nu döndürür</ 0> - Grafik Özellik Durumu <code> chrome: //gpu/`döndürür.</p> 
  
  **Note:** This information is only usable after the `gpu-info-update` event is emitted.
  
  ### `app.getGPUInfo(infoType)`
  
  * `infoType` String - Can be `basic` or `complete`.
  
  Returns `Promise<unknown>`
  
  For `infoType` equal to `complete`: Promise is fulfilled with `Object` containing all the GPU Information as in [chromium's GPUInfo object](https://chromium.googlesource.com/chromium/src/+/4178e190e9da409b055e5dff469911ec6f6b716f/gpu/config/gpu_info.cc). This includes the version and driver information that's shown on `chrome://gpu` page.
  
  For `infoType` equal to `basic`: Promise is fulfilled with `Object` containing fewer attributes than when requested with `complete`. Here's an example of basic response:
  
  ```js
  { auxAttributes:
     { amdSwitchable: true,
       canSupportThreadedTextureMailbox: false,
       directComposition: false,
       directRendering: true,
       glResetNotificationStrategy: 0,
       inProcessGpu: true,
       initializationTime: 0,
       jpegDecodeAcceleratorSupported: false,
       optimus: false,
       passthroughCmdDecoder: false,
       sandboxed: false,
       softwareRendering: false,
       supportsOverlays: false,
       videoDecodeAcceleratorFlags: 0 },
  gpuDevice:
     [ { active: true, deviceId: 26657, vendorId: 4098 },
       { active: false, deviceId: 3366, vendorId: 32902 } ],
  machineModelName: 'MacBookPro',
  machineModelVersion: '11.5' }
  ```
  
  Using `basic` should be preferred if only basic information like `vendorId` or `driverId` is needed.
  
  ### `app.setBadgeCount(count)<0><em>Linux</em><em>macOS</em></h3>

<ul>
<li><code>sayı` tam sayı</li> </ul> 
  
  `Boolean` 'ı geri getirir - Çağrı başarılı olduğunda.
  
  Sayaç rozet sayısı `0` olarak ayarlandığında uygulama için geçerli ayarlar rozeti gizler.
  
  On macOS, it shows on the dock icon. On Linux, it only works for Unity launcher.
  
  **Note:** Unity launcher requires the existence of a `.desktop` file to work, for more information please read [Desktop Environment Integration](../tutorial/desktop-environment-integration.md#unity-launcher).
  
  **[Kullanımdan kaldırıldı](modernization/property-updates.md)**
  
  ### `app.getBadgeCount()`Linux</em>*macOS*
  
  Karşı rozette görüntülenen geçerli değer, `Tamsayı` Döndürür.
  
  **[Kullanımdan kaldırıldı](modernization/property-updates.md)**
  
  ### `app.isUnityRunning()`*Linux*
  
  Geçerli masaüstü ortamı birlik başlatıcısı olup olmadığını `Boole değerine ` döndürür.
  
  ### `app.getloginItemSettings([options])`*macOS**Windows*
  
  * `seçenekler` Obje (opsiyonel) 
    * `yol`Dize(isteğe bağlı)*Windows* - karşılaştırmak için yürütebilir dosya yolu. Varsayılan olarak `process.execPath`.
    * `args` String [] (isteğe bağlı) *Windows<1> - karşılaştırılacak komut satırı değişkenleri karşısında. Varsayılan olarak boş bir dizi.</li> </ul></li> </ul> 
      
      If you provided `path` and `args` options to `app.setLoginItemSettings`, then you need to pass the same arguments here for `openAtLogin` to be set correctly.
      
      `Object` 'i geri getirir:
      
      * ` openAtLogin` Boole Değeri uygulama giriş yaparken açılırsa `doğru` olur.
      * `openAsHidden` Boolean *macOS* - `true` if the app is set to open as hidden at login. This setting is not available on [MAS builds](../tutorial/mac-app-store-submission-guide.md).
      * `wasOpenedAtLogin` Boolean *macOS* - `true` if the app was opened at login automatically. This setting is not available on [MAS builds](../tutorial/mac-app-store-submission-guide.md).
      * `wasOpenedAsHidden` Boolean *macOS* - `true` if the app was opened as a hidden login item. Bu, uygulamanın başlangıçta hiçbir pencereyi açmaması gerektiğini gösterir. This setting is not available on [MAS builds](../tutorial/mac-app-store-submission-guide.md).
      * `restoreState` Boolean *macOS* - `true` if the app was opened as a login item that should restore the state from the previous session. Bu, uygulama, uygulamanın son başlatılışında açık olan pencereleri geri yükleme kapalı. This setting is not available on [MAS builds](../tutorial/mac-app-store-submission-guide.md).
      
      ### `app.setLoginItemSettings(settings)` *macOS* *Windows*
      
      * `ayarlar` Nesne 
        * `openAtLogin` Boolean (isteğe bağlı) oturum açmak ve uygulamayı açmak için `doğru,` kaldırmak içinse `yanlış`. Bir giriş öğesi olarak uygulanır. Varsayılan olarak `yanlış`.
        * `openAsHidden` Boolean (optional) *macOS* - `true` to open the app as hidden. Varsayılan olarak değer `false`. The user can edit this setting from the System Preferences so `app.getLoginItemSettings().wasOpenedAsHidden` should be checked when the app is opened to know the current value. This setting is not available on [MAS builds](../tutorial/mac-app-store-submission-guide.md).
        * ` yolu` Dizi (isteğe bağlı) * Windows* Giriş sırasında başlatılacak yürütülebilir dosya. Varsayılan değer `process.execPath`.
        * `Yolu` Dizi [] (isteğe bağlı) *Windows* dosya geçmek için komut satırı değişkenleri yürütülebilir. Varsayılan olarak boş bir dizi. Yolları sarmaya tırnak işareti ile dikkat edin.
      
      Uygulamanın giriş seçeneklerini ayarlayın.
      
      [Sincap](https://github.com/Squirrel/Squirrel.Windows) kullanan Windows'ta Elektronlar `otomatik Güncelleştiri` ile çalışmak için, Update.exe için başlatma yolunu ayarlamak ve uygulamanızı belirten argümanları aktarmak isteyecektir. Örneğin:
      
      ```javascript
      const appFolder = path.dirname(process.execPath)
      const updateExe = path.resolve(appFolder, '..', 'Update.exe')
      const exeName = path.basename(process.execPath)
      
        app.setLoginItemSettings({
        openAtLogin: true,
        path: updateExe,
        args: [
          '--processStart', `"${exeName}"`,
          '--process-start-args', `"--hidden"`
        ]
      })
      ```
      
      ### `app.isAccessibilitySupportEnabled()<0> <em>macOS<em><1>Windows</em></h3>

<p><code>Boole Değeri<code> Chrome'un erişilebilirlik desteği etkinse <code>doğru` aksi halde yanlışa</code> çevirir. Bu API, `doğru` değerini geri döndürür. Yardımcı ekran okuyucuları gibi teknolojiler tespit edilir. Daha detaylar bilgi görmek için https://www.chromium.org/developers/design-documents/accessibility.</p> 
      
      **[Kullanımdan kaldırıldı](modernization/property-updates.md)**
      
      ### `app.setAccessibilitySupportEnabled(enabled)` *macOS* *Windows*
      
      * Mantıksal `enabled` [accessibility tree](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree) görüntülemeyi etkinleştirir veya devre dışı bırakır
      
      Manuel olarak Chrome'un erişilebilirlik desteğini etkinleştirir, erişilebilirlik anahtarını uygulama ayarlarındaki kullanıcılara göstermesine izin verir. See [Chromium's accessibility docs](https://www.chromium.org/developers/design-documents/accessibility) for more details. Varsayılan: Devre dışı.
      
      This API must be called after the `ready` event is emitted.
      
      **Note:** render erişilebilirlik ağacı uygulamanızın performansını önemli ölçüde etkileyebilir. Varsayılan olarak etkinleştirilmemelidir.<0>.
      
      **[Kullanımdan kaldırıldı](modernization/property-updates.md)**
      
      ### `app.showAboutPanel()` *macOS* *Linux*
      
      Show the app's about panel options. These options can be overridden with `app.setAboutPanelOptions(options)`.
      
      ### `app.setAboutPanelOptions(options)` *macOS* *Linux*
      
      * `seçenekler` Nesne 
        * ` applicationName` Dizi (isteğe bağlı) - Uygulamanın adı.
        * `applicationVersion` String (seçeneğe bağlı) - Uygulamanın sürümü.
        * `copyright` String (seçilebilir) - telif bilgisi.
        * `version` String (optional) *macOS* - The app's build version number.
        * `credits` String (optional) *macOS* - Credit information.
        * `authors` String[] (optional) *Linux* - List of app authors.
        * `website` String (optional) *Linux* - The app's website.
        * `iconPath` String (optional) *Linux* - Path to the app's icon. Will be shown as 64x64 pixels while retaining aspect ratio.
      
      Panelle ilgili seçenekleri ayarlayın. This will override the values defined in the app's `.plist` file on MacOS. Bakınız [Apple docs](https://developer.apple.com/reference/appkit/nsapplication/1428479-orderfrontstandardaboutpanelwith?language=objc) daha fazla detay için. On Linux, values must be set in order to be shown; there are no defaults.
      
      ### `app.isEmojiPanelSupported()`
      
      Returns `Boolean` - whether or not the current OS version allows for native emoji pickers.
      
      ### `app.showEmojiPanel()` *macOS* *Windows*
      
      Show the platform's native emoji picker.
      
      ### `app.startAccessingSecurityScopedResource(bookmarkData)` *mas*
      
      * `bookmarkData` String - The base64 encoded security scoped bookmark data returned by the `dialog.showOpenDialog` or `dialog.showSaveDialog` methods.
      
      Returns `Function` - This function **must** be called once you have finished accessing the security scoped file. If you do not remember to stop accessing the bookmark, [kernel resources will be leaked](https://developer.apple.com/reference/foundation/nsurl/1417051-startaccessingsecurityscopedreso?language=objc) and your app will lose its ability to reach outside the sandbox completely, until your app is restarted.
      
      ```js
      // Start accessing the file.
      const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(data)
      // You can now access the file outside of the sandbox 
      stopAccessingSecurityScopedResource()
      ```
      
      Start accessing a security scoped resource. With this method Electron applications that are packaged for the Mac App Store may reach outside their sandbox to access files chosen by the user. See [Apple's documentation](https://developer.apple.com/library/content/documentation/Security/Conceptual/AppSandboxDesignGuide/AppSandboxInDepth/AppSandboxInDepth.html#//apple_ref/doc/uid/TP40011183-CH3-SW16) for a description of how this system works.
      
      ### `app.enableSandbox()` *Experimental*
      
      Enables full sandbox mode on the app.
      
      Bu metod sadece uygulama hazır olmadan önce çağırılabilir.
      
      ### `app.isInApplicationsFolder()` *macOS*
      
      Returns `Boolean` - Whether the application is currently running from the systems Application folder. Use in combination with `app.moveToApplicationsFolder()`
      
      ### `app.moveToApplicationsFolder([options])` *macOS*
      
      * `seçenekler` Obje (opsiyonel) 
        * `conflictHandler` Function<boolean> (optional) - A handler for potential conflict in move failure. 
          * `conflictType` String - The type of move conflict encountered by the handler; can be `exists` or `existsAndRunning`, where `exists` means that an app of the same name is present in the Applications directory and `existsAndRunning` means both that it exists and that it's presently running.
      
      Returns `Boolean` - Whether the move was successful. Please note that if the move is successful, your application will quit and relaunch.
      
      No confirmation dialog will be presented by default. If you wish to allow the user to confirm the operation, you may do so using the [`dialog`](dialog.md) API.
      
      **NOTE:** Bu yöntem, kullanıcı haricindeki bir şeyin başarısız olmasına neden olursa hatalar atar. For instance if the user cancels the authorization dialog, this method returns false. If we fail to perform the copy, then this method will throw an error. Hata mesajı bilgilendirici olmalı ve neyin yanlış gittiğini size söylemeli.
      
      By default, if an app of the same name as the one being moved exists in the Applications directory and is *not* running, the existing app will be trashed and the active app moved into its place. If it *is* running, the pre-existing running app will assume focus and the the previously active app will quit itself. This behavior can be changed by providing the optional conflict handler, where the boolean returned by the handler determines whether or not the move conflict is resolved with default behavior. i.e. returning `false` will ensure no further action is taken, returning `true` will result in the default behavior and the method continuing.
      
      Örneğin:
      
      ```js
      app.moveToApplicationsFolder({
        conflictHandler: (conflictType) => {
          if (conflictType === 'exists') {
            return dialog.showMessageBoxSync({
              type: 'question',
              buttons: ['Halt Move', 'Continue Move'],
              defaultId: 0,
              message: 'An app of this name already exists'
            }) === 1
          }
        }
      })
      ```
      
      Would mean that if an app already exists in the user directory, if the user chooses to 'Continue Move' then the function would continue with its default behavior and the existing app will be trashed and the active app moved into its place.
      
      ## Özellikler
      
      ### `app.accessibilitySupportEnabled` *macOS* *Windows*
      
      A `Boolean` property that's `true` if Chrome's accessibility support is enabled, `false` otherwise. This property will be `true` if the use of assistive technologies, such as screen readers, has been detected. Setting this property to `true` manually enables Chrome's accessibility support, allowing developers to expose accessibility switch to users in application settings.
      
      See [Chromium's accessibility docs](https://www.chromium.org/developers/design-documents/accessibility) for more details. Disabled by default.
      
      This API must be called after the `ready` event is emitted.
      
      **Note:** render erişilebilirlik ağacı uygulamanızın performansını önemli ölçüde etkileyebilir. Varsayılan olarak etkinleştirilmemelidir.<0>.
      
      ### `app.applicationMenu`
      
      A `Menu | null` property that returns [`Menu`](menu.md) if one has been set and `null` otherwise. Users can pass a [Menu](menu.md) to set this property.
      
      ### `app.badgeCount` *Linux* *macOS*
      
      An `Integer` property that returns the badge count for current app. Setting the count to `0` will hide the badge.
      
      On macOS, setting this with any nonzero integer shows on the dock icon. On Linux, this property only works for Unity launcher.
      
      **Note:** Unity launcher requires the existence of a `.desktop` file to work, for more information please read [Desktop Environment Integration](../tutorial/desktop-environment-integration.md#unity-launcher).
      
      ### `app.commandLine` *Readonly*
      
      A [`CommandLine`](./command-line.md) object that allows you to read and manipulate the command line arguments that Chromium uses.
      
      ### `app.dock` *macOS* *Readonly*
      
      A [`Dock`](./dock.md) object that allows you to perform actions on your app icon in the user's dock on macOS.
      
      ### `app.isPackaged` *Readonly*
      
      A `Boolean` property that returns `true` if the app is packaged, `false` otherwise. For many apps, this property can be used to distinguish development and production environments.
      
      ### `app.name`
      
      A `String` property that indicates the current application's name, which is the name in the application's `package.json` file.
      
      Usually the `name` field of `package.json` is a short lowercase name, according to the npm modules spec. Genel olarak `productName` belirtmelisiniz, bu da uygulamanızın üst karakterle yazılmış hali olmalıdır ve Electron'un belirlediği `isimden` çok tercih edilecektir.
      
      ### `app.userAgentFallback`
      
      A `String` which is the user agent string Electron will use as a global fallback.
      
      This is the user agent that will be used when no user agent is set at the `webContents` or `session` level. It is useful for ensuring that your entire app has the same user agent. Set to a custom value as early as possible in your app's initialization to ensure that your overridden value is used.
      
      ### `app.allowRendererProcessReuse`
      
      A `Boolean` which when `true` disables the overrides that Electron has in place to ensure renderer processes are restarted on every navigation. The current default value for this property is `false`.
      
      The intention is for these overrides to become disabled by default and then at some point in the future this property will be removed. This property impacts which native modules you can use in the renderer process. For more information on the direction Electron is going with renderer process restarts and usage of native modules in the renderer process please check out this [Tracking Issue](https://github.com/electron/electron/issues/18397).