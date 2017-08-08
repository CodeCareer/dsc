// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //${tag-begin-assetsPublicPath}
    assetsPublicPath: 'http://cdn.wjs.com/1.2.1/resources/',
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
      '/api/thirdPartyData/': {
        target: 'http://192.168.221.8:8080',
        changeOrigin: true,
        pathRewrite: function(path, req) {
          return path.replace('/api/', '/')
        }
      },
      // '/api/thirdPartyData/vehicleManage/': {
      //   target: 'http://172.20.10.2:8080',
      //   changeOrigin: true,
      //   pathRewrite: function(path, req) {
      //     return path.replace('/api/', '/')
      //   }
      // },
      '/api/usermanage/': {
        target: 'http://192.168.221.9:9090',
        changeOrigin: true
      },
      '/api': {
        target: 'http://apidoc.wjs-dev.com/mockjsdata/61',
        changeOrigin: true,
        onProxyRes: function(proxyRes, req, res) {
          delete proxyRes.headers['set-cookie'] // 删除Rap上的cookie设置因为会影响到/api/usermanage的cookie设置
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
