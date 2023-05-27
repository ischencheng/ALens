import {createApp} from 'vue';
import {createRouter, createWebHashHistory} from 'vue-router';
import routes from './routers';
import * as d3 from "d3";
import 'assets/css/main.less';
import ElementPlus, { menuItemEmits } from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios';
import mitt from 'mitt';
// import fetch from "node-fetch";



window.d3 = d3;
// window.d3 = d3;
// var d3lasso = require('d3-lasso');
// // var d3scale= require('d3-scale')
// // var d3interpolate=require('d3-interpolate')
// window.d3 = Object.assign(window.d3,
//     {
//         lasso: d3lasso.lasso
//     });
// var d3sankey = require('d3-sankey');
// window.d3 = Object.assign(window.d3,
//     {
//         sankey: d3sankey.sankey
//     });
// window.d3 = Object.assign(window.d3,
//     {
//         sankeyLinkHorizontal:d3sankey.sankeyLinkHorizontal
//     });

// window.d3 = Object.assign(window.d3,
//     {
//         sankeyCenter:d3sankey.sankeyCenter
//     });

// window.d3 = Object.assign(window.d3,
//     {
//         sankeyJustify:d3sankey.sankeyJustify
//     });

// window.d3 = Object.assign(window.d3,
//     {
//         scaleDiverging:d3scale.scaleDiverging
//     });

// window.d3 = Object.assign(window.d3,
//     {
//         interpolate:d3interpolate.interpolate
// });

const router = createRouter({
    history: createWebHashHistory(),
    routes
});
const myApp = createApp({
    el: '#app-wrapper',
});
myApp.config.globalProperties.axios=axios;
myApp.use(router);

myApp.use(ElementPlus);

myApp.mount("#app-wrapper");

myApp.config.globalProperties.$myBus = new mitt(); // myBus 是自定义总线属性名