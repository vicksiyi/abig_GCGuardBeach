module.exports = {
    //axios域代理，解决axios跨域问题
    baseUrl: '/',
    devServer: {
        proxy: {
            '': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {

                }
            }
        }
    }
}