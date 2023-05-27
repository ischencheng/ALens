/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// import HttpHelper from "common/utils/axios_helper.js";
// import { timeThursdays } from "d3-time";
import axios from 'axios';
import * as color from 'd3-scale-chromatic';
let old_style='';
export default {
    components: { // 依赖组件
    },
    props: {
    },
    data() { // 本页面数据
        return {
            reference: [],
            refText: "",
            intro: [],
            isShow: false
        };
    },
    computed: {
    },
    methods: {
        post_route(data, route) {
            var total_url = 'http://127.0.0.1:5432/' + route;
            //console.log(total_url);
            return axios({
                method: 'post',
                url: total_url,
                params: {
                    data: data,
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },
        post_analyzeAllRef: function (ref) {
            return axios({
                method: 'post',
                url: 'http://127.0.0.1:5432/analyzeAllRef',
                params: {
                    text: ref,
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },
        showRef: function () {
            this.post_analyzeAllRef(this.refText)
                .then(res => {
                    console.log(res);
                    this.$myBus.emit('updateAnalyzeData_Ref_ev', res.data);
                });

            // console.log(this.isShow);
            this.isShow = true;
            this.$myBus.emit('showFlow_ev');
            let sentences = document.querySelectorAll('.sentence');
            sentences.forEach((s, i) => {
                s.setAttribute("class", s.getAttribute("class") + ' src-sen-' + i);
            })
            let abs_sens = document.querySelectorAll('#app-wrapper > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div > div.reference-div > p >span')

            console.log(abs_sens)
            for (let i = 0; i < abs_sens.length; ++i) {
                abs_sens[i].addEventListener("mouseenter", this.sapnMouseenter_sen);
                abs_sens[i].addEventListener("mouseleave", this.sapnMouseleave_sen);
                abs_sens[i].addEventListener('click', this.mouse_click);
            }
        },
        sapnMouseenter_sen(event) {
            let ref_sens=document.querySelectorAll('#app-wrapper > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div > div.reference-div > p > span');
            //console.log(ref_sens);
            for(let i=0;i<ref_sens.length;++i){
                ref_sens[i].style.backgroundColor='white';
            }
            //console.log(event.target)
            var abs_index = event.target.getAttribute("id");
            var abs_index_arr = abs_index.split('-');
            old_style=event.target.getAttribute('style')
            event.target.style.backgroundColor='rgba(235,52,52,0.5)';
            var paths = d3.selectAll('.flowmap svg .path-g path')
            paths.attr('opacity', 0);
            var path = d3.selectAll('.flowmap svg .path-g .path-' + abs_index_arr[2])
            path.attr('opacity', 0.2)
                .attr('stroke', '#79bbff')
                .attr('stroke-width', 10);
            this.post_route(+abs_index_arr[2], 'single_src_sen')
                .then(res => {
                    //console.log(res.data);
                    var data = res.data;
                    //console.log(data);
                    var refelection = function (x) {
                        return Math.tan(Math.PI / 2.4 * x )
                    }
                    var myColor = d3.interpolateLab("rgba(48, 153, 255, 0.8)", "rgba(255, 84, 48, 0.8)")
                    var max = Math.asin(Math.max.apply(null, data)>1 ? 1:Math.max.apply(null, data)), min = Math.asin(Math.min.apply(null, data))
                    var rects = document.querySelectorAll('#app-wrapper > div > div:nth-child(2) > div.el-col.el-col-2.is-guttered > div > div > svg > g > g.rect-g-src .rect-src')
                    // console.log(res);
                    for (var i = 0; i < rects.length; ++i) {
                        // console.log(data[i]);
                        // console.log(max);
                        // console.log(min);
                        // console.log(((data[i])-min)/(max-min))
                        rects[i].setAttribute('fill', myColor(((Math.asin(data[i])>1 ? 1:data[i]) - min) / (max - min)))
                            // .setAttribute('opacity', 0.5)
                    }
                    // d3.selectAll('#app-wrapper > div > div:nth-child(2) > div.el-col.el-col-2.is-guttered > div > div > svg > g > g:nth-child(2) .rect-src')
                    // .attr('fill', myColor((Math.log10(data[i])-min)/(max-min)))
                })
            this.post_route(+abs_index_arr[2], 'topk_abs_sen')
                .then(res => {
                    let src_sens=document.querySelectorAll("#rst-content > div.rstSection > div > .sentence");
                    //console.log(src_sens);
                    for(let i=0;i<src_sens.length;++i){
                        src_sens[i].style.backgroundColor='white';
                    }
                    let data = res.data;
                    // console.log(data[+abs_index_arr[2]]);
                    let topk = data[+abs_index_arr[2]];
                    let topk_tmp=[]
                    for(let i=0;i<topk.length;++i){
                        topk_tmp.push(topk[i][1]);
                    }
                    console.log(topk_tmp)
                    var max = Math.asin(Math.max.apply(null, topk_tmp)>1 ? 1:Math.max.apply(null, topk_tmp)), min = Math.asin(Math.min.apply(null, topk_tmp))
                    console.log(max)
                    console.log(min)
                    for (let i = 0; i < topk.length; ++i) {
                        //console.log(document.querySelector("#rst-content > div.rstSection > div > .sentence.src-sen-" + topk[i][0]))
                        let sen = document.querySelector("#rst-content > div.rstSection > div > .sentence.src-sen-" + topk[i][0])
                        // let sen_style = sen.getAttribute('style');
                        // console.log(sen_style);
                        //sen.setAttribute("style", sen_style + ";background:orange");
                        let myColor=d3.interpolateLab("rgba(48, 153, 255, 0.8)", "rgba(255, 84, 48, 0.8)")
                        sen.style.backgroundColor=myColor((Math.asin((topk_tmp[i])>1 ? 1:topk_tmp[i]) - min) / (max - min));

                    }
                })
            //this.line_chart(+abs_index_arr[2],'single_src_sen');


        },
        sapnMouseleave_sen(event) {
            var abs_index = event.target.getAttribute("id");
            //var abs_index_arr=abs_index.split('-');
            //event.target.setAttribute('style', '')
            //var paths=d3.selectAll('.flowmap svg .path-g path')
            //paths.attr('opacity',0.01)
            //.attr('stroke','black')
        },
        mouse_click(event){
            var abs_index = event.target.getAttribute("id");
            var abs_index_arr = abs_index.split('-');
            this.post_route(+abs_index_arr[2], 'topk_abs_sen')
                .then(res => {
                    let data = res.data;
                    let index=0;
                    let topk = data[+abs_index_arr[2]];
                    let max=0;
                    for(let i=0;i<topk.length;++i){
                        if(max<topk[i][1]){
                            max=topk[i][1];
                            index=i;
                        }
                    }
                    

                    this.scroll2top("#rst-content > div.rstSection > div > .sentence.src-sen-" + topk[index][0])

                })
            
        },
        scroll2top(selector){
            //console.log(document.querySelector(selector))
            document.querySelector(selector).scrollIntoView(true);
        },
        queryType: async function (data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/epiphacc/pubmed-20k-sign-sentence-classification",
                {
                    headers: { Authorization: "Bearer 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" },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            return result;
        },
    },
    created() {
        this.$myBus.on("reference_ev", () => {
            let that = this;
            fetch('http://127.0.0.1:5432/text_arr')
                .then(res => res.json())
                .then(function (data) {
                    var myColor = d3.scaleOrdinal()
                                .domain([0,1,2,3,4])
                                .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
                    // that.reference = data;
                    //console.log(data);
                    for(let i=0;i<data.length;++i){
                        that.reference.push('a');
                    }
                    for (let i=0;i<data.length;++i){
                        that.queryType({ "inputs": data[i],
                    "options":{"wait_for_model":true} })
                            .then((response) => {
                                // console.log(JSON.stringify(response));
                                let type = +response[0][0].label.split('_')[1];
                                //console.log(data[i]);
                                that.reference[i]={
                                    content: data[i],
                                    style: {
                                        'text-decoration': myColor(type) + ' underline',
                                        'text-decoration-thickness': '4px',
                                        "text-decoration-skip": "none",
                                        'text-underline-offset':'4px',
                                        'text-underline-opacity':'0.5'
                                        //'background-color': myColor(type)
                                    }
                                };
                            });
                        //this.intro = text.intro;
                    }
                    // data.forEach(s => {
                    //     that.queryType({ "inputs": s,
                    // "options":{"wait_for_model":true} })
                    //         .then((response) => {
                    //             // console.log(JSON.stringify(response));
                    //             let type = response[0][0].label;
                    //             console.log(s)
                    //             that.reference.push({
                    //                 content: s,
                    //                 style: {
                    //                     'text-decoration': myColor(type) + ' underline',
                    //                     'text-decoration-thickness': '4px',
                    //                     "text-decoration-skip": "none",
                    //                     'text-underline-offset':'4px',
                    //                     'text-underline-opacity':'0.5'
                    //                     //'background-color': myColor(type)
                    //                 }
                    //             });
                    //         });
                    //     //this.intro = text.intro;
                    // })
                    that.refText = data.join();
                    console.log('reference ready', that.reference, that.refText);
                });
        });
    },
    mounted() {
    },
    beforeDestroy() {
        this.$myBus.off("reference_ev");
    }
};