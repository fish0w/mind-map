const fs = require('fs');

module.exports = {
  publicPath: '/md_edit/',  // 设置为代理路径
  devServer: {
    headers: {
    'Access-Control-Allow-Origin': '*',
  },
  allowedHosts: 'all',
  client: {
    webSocketURL: 'wss://shuitunai.cn/sockjs-node',  // 设置正确的 WebSocket 地址，使用 wss 协议
  },
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/shuitunai.cn/privkey.pem'), // 替换为你的私钥文件路径
      cert: fs.readFileSync('/etc/letsencrypt/live/shuitunai.cn/fullchain.pem'), // 替换为你的证书文件路径
    },

    host: '0.0.0.0',
    port: 8080,
  },
};