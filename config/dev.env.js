var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  STOP_PERMIT: 'true',
  API_HOST: '"http://10.132.1.171:8080"'
  // API_HOST: '"/api"'
})
