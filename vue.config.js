// yarn add -D webpack-bundle-analyzer

// webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // webpack-bundle-analyzer
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  },
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://139.159.201.22:4000/', //对应自己的接口
        // target: 'http://192.168.3.25:4000/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}