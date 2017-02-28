var visit = require('unist-util-visit')
var rule = require('unified-lint-rule')
var path = require('path')

function lintCode (ast, file, linters) {
  linters = linters || {}

  // Make sure linter functions are loaded
  Object.keys(linters).forEach(function (name) {
    if (linters[name] instanceof Linter) return
    linters[name] = Linter.from(linters[name])
  })

  // Visit code nodes and run corresponding linter, if available
  visit(ast, 'code', function (node) {
    var linter = linters[node.lang]
    if (linter) linter.call(node, file)
  })
}

function modOrString (mod) {
  return typeof mod === 'string' ? require(path.resolve(mod)) : mod
}

function Linter (handler) {
  this.handler = handler
}
Linter.prototype.call = function (node, file) {
  return this.handler(node, file)
}
Linter.from = function (mod) {
  var handler = mod
  var opts = {}

  if (typeof mod === 'object') {
    handler = mod.module
    if (mod.options) {
      opts = mod.options
    }
  }

  handler = modOrString(handler)
  if ( ! handler) {
    throw new Error('Unrecognized linter for ' + name)
  }

  return new Linter(handler(opts))
}

module.exports = rule('remark-lint:code', lintCode)
