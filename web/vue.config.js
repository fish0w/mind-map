const fs = require('fs');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const isLibrary = process.env.NODE_ENV === 'library'

const WebpackDynamicPublicPathPlugin = require('webpack-dynamic-public-path')

module.exports = {
  publicPath: isDev ? '' : './dist',
  outputDir: '../dist',
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: false,
  transpileDependencies: ['yjs', 'lib0'],
  chainWebpack: config => {
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 支持运行时设置public path
    if (!isDev) {
      config
        .plugin('dynamicPublicPathPlugin')
        .use(WebpackDynamicPublicPathPlugin, [
          { externalPublicPath: 'window.externalPublicPath' }
        ])
    }
    // 给插入html页面内的js和css添加hash参数
    if (!isLibrary) {
      config.plugin('html').tap(args => {
        args[0].hash = true
        return args
      })
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/')
      }
    }
  },
  // 添加devServer配置
  devServer: {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/shuitunai.cn/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/shuitunai.cn/fullchain.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/shuitunai.cn/fullchain.pem'), // 可选，如果需要单独的 CA 文件，通常可以省略
    },
    host: '0.0.0.0',
    port: 8080, // 可以根据需要修改端口
    headers: {
    'Access-Control-Allow-Origin': '*', // 允许所有域名的跨域请求
  },
  proxy: {
      '/ws': {
        target: 'ws://localhost:8080', // 代理 WebSocket 请求
        ws: true,
        changeOrigin: true,
      },
    },
    allowedHosts: [
  '.shuitunai.cn', // 允许的域名
],

  disableHostCheck: true, // 禁用 Host 检查
  public: 'shuitunai.cn:8080',

  }
}