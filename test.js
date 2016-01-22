var remark = require('remark')
var lint = require('remark-lint')
var tap = require('tap')

var lintCode = require('./index')

var processor = remark.use(lint, {
  'final-newline': false,
  external: [lintCode],
  'lint-code': {
    js: function () {
      return function (node, file) {
        if (node.value !== code) {
          file.warn('does not match')
        }
      }
    }
  }
})

var code = 'var foo = "bar"'

tap.test('should pass when matching', function (t) {
  processor.process('```js\n' + code + '\n```', function (err, file, res) {
    t.equal(file.messages.length, 0, 'should have passed')
    t.end()
  })
})

tap.test('should fail when not matching', function (t) {
  var res = processor.process('```js\nnope\n```', function (err, file, res) {
    t.equal(file.messages[0].reason, 'does not match', 'should have failed')
    t.end()
  })
})
