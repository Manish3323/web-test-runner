# @web/test-runner

VSCode plugin for triggering WTR tests.

## Features

Simple way to run or debug a specific test.

Run & Debug your WTR Tests from

- Context-Menu
- CodeLens
- Command Palette (cmd+shift+p)

## Requirements

`@web/test-runner` must be installed in your project.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `test-runner.codeLensSelector`: CodeLens will be shown on files matching the specified pattern.

Default is set to : "**/*.{test,spec}.{js,jsx,ts,tsx}"

## Supports

- Mocha framework's BDD & TDD style syntax
