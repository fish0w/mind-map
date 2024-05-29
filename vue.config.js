const fs = require('fs');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/md_edit/' // 替换为你的子路径
    : '/',
  devServer: {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/gptall.online/privkey.pem'), // 替换为你的私钥文件路径
      cert: fs.readFileSync('/etc/letsencrypt/live/gptall.online/fullchain.pem'), // 替换为你的证书文件路径
    },
    host: '0.0.0.0',
    port: 8080,
  },
};