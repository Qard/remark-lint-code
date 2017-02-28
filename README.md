# remark-lint-code

This is a pluggable [remark-lint](https://github.com/wooorm/remark-lint) rule
which allows various linters to be run against fenced code blocks in markdown
based on their language tag.

## Install

```console
npm install remark-lint-code
```

## Usage

### CLI

```console
remark -u lint -u lint-code="{\"js\":\"remark-lint-code-eslint\"}" file.md
```

### Programmatic

```js
var remark = require('remark')
var lint = require('remark-lint')
var lintCode = require('remark-lint-code')
var eslint = require('remark-lint-code-eslint')
var report = require('vfile-reporter')

remark()
  .use(lint)
  .use(lintCode, {js: eslint})
  .process('```js\nvar foo = "bar"\n```', function (err, file) {
    console.error(report(err || file));
  })
```

## Writing plugins

Plugins are very simple. Here's an example:

```js
// This verifies content matches expected value exactly
module.exports = function (options) {
  var expect = (options || {}).expect
  return function (node, file) {
    if (node.value !== expect) {
      file.message('"' + node.value + '" does not match "' + expect + '"', node)
    }
  }
}
```

The module exports a function which takes an `options` object which can be used
to configure the plugin, then it returns another function which receives the
AST node for the fenced code block and an object describing the file that is
currently being linted.

The text content of the AST node can be found in the
`value` property. To inform the user of warnings or errors, you can call
`file.message(message, node)` or `file.fail(message, node)`.

---

### Copyright (c) 2016 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
