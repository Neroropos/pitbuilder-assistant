module.exports = {
  //publicPath: process.env.NODE_ENV === 'production' ? '/pitbuilder-assistant/' : '/',
  devServer: {
    proxy: 'https://pitbuilder-assistant/'
  }
}
