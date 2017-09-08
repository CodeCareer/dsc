// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var https = require('https')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //${tag-begin-assetsPublicPath}
    assetsPublicPath: '/',
    //${tag-end-assetsPublicPath}
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api/thirdPartyData/vehicleManage': {
      //   target: 'http://10.132.1.218:8080',
      //   changeOrigin: true,
      //   pathRewrite: function(path, req) {
      //     return path.replace('/api/', '/')
      //   }
      // },
      // '/api/thirdPartyData/gpsManage/': {
      //   target: 'http://10.132.1.115:8080',
      //   changeOrigin: true,
      //   pathRewrite: function(path, req) {
      //     return path.replace('/api/', '/')
      //   }
      // },
      // '/api/api/usermanage/': {
      //   target: 'http://10.132.1.171:9093',
      //   changeOrigin: true,
      //   pathRewrite: function(path, req) {
      //     return path.replace('/api/api/', '/api/')
      //   }
      // },
      '/api': {
        target: 'https://kf-wdy.trunk.wjs-test.com/wdy',
        secure: false,
        agent: https.globalAgent,
        changeOrigin: true,
        onProxyRes: function(proxyRes, req, res) {
          // proxyRes.headers['x-auth-token'] = 'adfa-adsfaf-asf'
          // delete proxyRes.headers['set-cookie'] // 删除Rap上的cookie设置因为会影响到/api/usermanage的cookie设置
        },
        pathRewrite: function(path, req) {
          return path.replace('/api/', '/')
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  }
}