const path = require('path')
const fs = require('fs') // 引入 fs 模块
const isDev = process.env.NODE_ENV === 'development'
const isLibrary = process.env.NODE_ENV === 'library'

const WebpackDynamicPublicPathPlugin = require('webpack-dynamic-public-path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/md_edit/' // 替换为你的子路径
    : '/',
  outputDir: '../dist',
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: false,
  transpileDependencies: ['yjs', 'lib0'],
  devServer: {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/gptall.online/privkey.pem'), // 替换为你的私钥文件路径
      cert: fs.readFileSync('/etc/letsencrypt/live/gptall.online/fullchain.pem'), // 替换为你的证书文件路径
    },
    host: '0.0.0.0',
    port: 8080,
  },
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
  }
}