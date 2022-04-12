const path = require('path');
const webpack=require("webpack");
const webpackDevServer=require("webpack-dev-server");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLPlugin=require("html-webpack-plugin");

module.exports = {
    target: 'web',
    node: {
        fs: "empty",
      },
    entry:{
        'client':['webpack/hot/dev-server','webpack-dev-server/client?http://localhost:8080'],
        'mainframe':'./src/mainframe.js',
        // 'mainframe2':'./src/mainframe2.js',
        'loading':'./src/loadingframe.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'static'),
        //publicPath: '/static/'
    },
    mode:"development",
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    devServer: {
        host:"localhost",
        port: 8080,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        // before: require('./mock/mock-server.js')
        proxy: {
            '/api': {
                target: "http://39.104.83.137:8081/",
                changeOrigin: true,
                headers: {
                    "Connection": "keep-alive"
                },
                pathRewrite:{
                    ['^/api']:''
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new HTMLPlugin({ //输出html文件1
            title: 'Loading',   //生成html文件的标题
            // favicon: './favicon.png',   //生成html文件的favicon的路径
            filename: 'loading.html',     //生成html文件的文件名，默认是index.html
            // template: './src/html/jeditor_ju.html',     //本地html文件模板的地址
            hash: true,
            chunks: ['loading']
        }),
        new HTMLPlugin({ //输出html文件1
            title: 'Editor',   //生成html文件的标题
            // favicon: './favicon.png',   //生成html文件的favicon的路径
            filename: 'index.html',     //生成html文件的文件名，默认是index.html
            // template: './src/html/jeditor_ju.html',     //本地html文件模板的地址
            hash: true,
            // chunks: ['client','mainframe'], //dev
            chunks: ['mainframe'],

        }),
        // new HTMLPlugin({ //输出html文件1
        //     title: 'Relation',   //生成html文件的标题
        //     // favicon: './favicon.png',   //生成html文件的favicon的路径
        //     filename: 'relation.html',     //生成html文件的文件名，默认是index.html
        //     // template: './src/html/jeditor_ju.html',     //本地html文件模板的地址
        //     hash: true,
        //     chunks: ['client','mainframe2']
        // }),

    ],
    module: {
        rules: [
        {
            test: /\.(css|less)$/,
            use: [
            'style-loader',
            'css-loader',
            ]
        },
        {
            test: /\.scss$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ]
          },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
                'url-loader'
            ]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        },
        {
            test:/\.vue$/,
            loader:'vue-loader'
        },
        // {
        //     test: require.resolve('scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic.js'),
        //     loader: 'imports-loader?define=>false'
        //   }, {
        //     test: require.resolve('scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
        //     loader: 'imports-loader?define=>false'
        //   }
        ]
    }
};
