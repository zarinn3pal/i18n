# Тестирование

Мы стремимся сохранить покрытие кода тестами на высоком уровне. Мы просим всех кто делает pull requests не только прогонять все существующие тесты, но также в идеале добавлять новые тесты на внесённые изменения и новые сценария тестирования. Ensuring that we capture as many code paths and use cases of Electron as possible ensures that we all ship apps with fewer bugs.

This repository comes with linting rules for both JavaScript and C++ – as well as unit and integration tests. To learn more about Electron's coding style, please see the [coding-style](coding-style.md) document.

## Linting

To ensure that your JavaScript is in compliance with the Electron coding style, run `npm run lint-js`, which will run `standard` against both Electron itself as well as the unit tests. If you are using an editor with a plugin/addon system, you might want to use one of the many [StandardJS addons](https://standardjs.com/#are-there-text-editor-plugins) to be informed of coding style violations before you ever commit them.

To run `standard` with parameters, run `npm run lint-js --` followed by arguments you want passed to `standard`.

To ensure that your C++ is in compliance with the Electron coding style, run `npm run lint-cpp`, which runs a `cpplint` script. We recommend that you use `clang-format` and prepared [a short tutorial](clang-format.md).

There is not a lot of Python in this repository, but it too is governed by coding style rules. `npm run lint-py` will check all Python, using `pylint` to do so.

## Unit Tests

To run all unit tests, run `npm run test`. The unit tests are an Electron app (surprise!) that can be found in the `spec` folder. Note that it has its own `package.json` and that its dependencies are therefore not defined in the top-level `package.json`.

To run only specific tests matching a pattern, run `npm run test --
-g=PATTERN`, replacing the `PATTERN` with a regex that matches the tests you would like to run. As an example: If you want to run only IPC tests, you would run `npm run test -- -g ipc`.

### Проверка на устройствах Windows 10

[На некоторых устройства на Windows 10](https://docs.microsoft.com/en-us/typography/fonts/windows_10_font_list) может быть не установлен шрифт Meriyo, что может привести к провалу fallback теста. Для того чтобы установить шрифт Meiryo:

1. Нажмите кнопку Windows и найдите *Управление дополнительными функциями*.
2. Нажмите *Добавить функцию*.
3. Выберите *Японские дополнительные шрифты* и нажмите *Установить*.

Some tests which rely on precise pixel measurements may not work correctly on devices with Hi-DPI screen settings due to floating point precision errors. To run these tests correctly, make sure the device is set to 100% scaling.

To configure display scaling:

1. Push the Windows key and search for *Display settings*.
2. Under *Scale and layout*, make sure that the device is set to 100%.