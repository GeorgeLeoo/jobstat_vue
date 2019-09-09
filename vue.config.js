module.exports = {
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.3.25:4000/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}