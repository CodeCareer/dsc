var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  STOP_PERMIT: 'false',
  // API_HOST: '"http://10.132.1.171:8080"'
  API_HOST: '"https://kf-wdy.trunk.wjs-test.com/wdy"'
  // API_HOST: '"/api"'
})