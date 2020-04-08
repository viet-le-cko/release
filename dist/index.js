
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./release.cjs.production.min.js')
} else {
  module.exports = require('./release.cjs.development.js')
}
