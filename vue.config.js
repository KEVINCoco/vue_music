let path = require('path')
module.exports = {
    // 公共路径
    publicPath: './',
    // 配置webpack http 服务 devServer
    devServer: {
        // 在指定的dist目录开启http服务
        contentBase: path.resolve(__dirname, "dist"),
        // 端口
        port: 8080,
        // 自动打开浏览器
        open: true,
        // 代理服务器地址
        // 数据接口地址：
        // 例如： 
        // 原来访问： http://127.0.0.1:3000/example
        // 现在访问： http://127.0.0.1:8080/api/example
        proxy: {
            //代理api
            '/': {
                // 代理接口(服务器地址)
                target: 'http://192.168.1.103:3000',
                //是否跨域
                changeOrigin: true,
                //重写路径
                pathRewrite: {
                    //代理路径
                    '^/api': ''
                }
            }
        }
    }
}