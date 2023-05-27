import * as color from 'd3-scale-chromatic';
import axios from 'axios';
import modal from '../modal/modal.vue';


export default {
    data() {
        return {
            // 标签页
            editableTabsValue2: '1', // 标签总数
            editableTabs2: [
                {   // 修改以下内容需要同步修改 addTab 函数
                    title: 'Draft 1',
                    name: '1', // index
                    content: "",
                    analyzed: false,
                    classifiedS: [],
                    finalTip: []
                    // 修改以下内容需要同步修改 addTab 函数
                },
            ],
            tabIndex: 1,

            // 字数统计
            wordNum: 0,

            // 提示
            prompt: "",

            // 弹窗
            showModal: false,

            // reference 评估结果
            ref_evaluation: {},
        };
    },
    components: {
        modal // 弹窗组件
    },
    created() {
        // from rstContent.js
        this.$myBus.on("prompt_ev", intro => {
            this.getPrompt(intro);
        });
        this.$myBus.on("evaluateRef_ev", data => {
            this.ref_evaluation = data;
            console.log('reference radar data ready:', this.ref_evaluation);
        });
    },
    mounted() {
    },
    beforeDestroy() {
        this.$myBus.off("prompt_ev");
        this.$myBus.off("evaluateRef_ev");
    },
    methods: {
        // 标签页
        addTab(targetName) {
            // 复制上一版的内容
            let lastText = this.editableTabs2[parseInt(this.editableTabsValue2) - 1].content;

            let newTabName = ++this.tabIndex + '';
            this.editableTabs2.push({
                title: 'Draft ' + newTabName,
                name: newTabName,
                content: lastText,
                analyzed: false,
                classifiedS: [],
                finalTip: []
            });
            this.editableTabsValue2 = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.editableTabs2;
            let activeName = this.editableTabsValue2;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }

            this.editableTabsValue2 = activeName;
            this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
        },

        // 点击 prompt 给提示
        queryPrompt: async function (data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/Blaise-g/led_pubmed_sumpubmed_1",
                {
                    headers: { Authorization: "Bearer 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" },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            return result;
        },
        getPrompt: function (intro) {
            this.queryPrompt({
                "inputs": intro,
                "parameters": { "min_length": 128, "max_length": 256 },
                "options": { "wait_for_model": true }
            })
                .then(response => {
                    // console.log(JSON.stringify(response));
                    this.prompt = response[0]["summary_text"];
                    console.log("prompt ready: ", this.prompt)
                })
                .catch(error => console.log('error is', error));
        },
        showPrompt: function () {
            this.editableTabs2[0].content = this.prompt;
            this.editableTabs2[0].title = 'Prompt';
        },

        // analyze 相关
        post_analyze: function (data) {
            return axios({
                method: 'post',
                url: 'http://127.0.0.1:5432/analyze',
                params: {
                    text: data, // data 是当前的 draft
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },

        getType: function (s) {
            return 'background';
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
        analyze: function () {
            let tabID = parseInt(document.querySelector(".el-tabs__content .el-tab-pane[aria-hidden=false] textarea").getAttribute('id'));
            console.log(tabID)
            if (this.editableTabs2[tabID - 1].analyzed === false) {
                this.editableTabs2[tabID - 1].analyzed = true; // 切换显示
                // 选择当前显示的标签页 并取其值
                let text = document.querySelector(".el-tabs__content .el-tab-pane[aria-hidden=false] textarea").value;

                // 后端分析并把数据传给 evaluation
                this.post_analyze(text)
                    .then(res => {
                        //console.log(res.data);
                        this.$myBus.emit('updateAnalyzeData_ev', res.data);
                        console.log(res.data['radar']);
                        let tmpRadar = res.data['radar']['portrait']
                        tmpRadar.forEach((idx, i) => {
                            if (i === 0) {
                                if (idx.value > this.ref_evaluation['portrait'][i].value) {
                                    this.editableTabs2[tabID - 1].finalTip.push("Quite understandable! You have succeeded in making your abstract easy to understand.")
                                } else {
                                    this.editableTabs2[tabID - 1].finalTip.push("You should try to make your abstract more understandable. Try to replace some complex word and break long sentences to shorter ones.")
                                }
                            } 
                            else if (i === 1) {
                                if (idx.value > this.ref_evaluation['portrait'][i].value) {
                                    this.editableTabs2[tabID - 1].finalTip.push("Well done! your abstract is consistent with the original text!")
                                } else {
                                    this.editableTabs2[tabID - 1].finalTip.push("Try to check your abstract whether there is additional information that is not included in your paper. Maybe you should read the text again.")
                                }
                            }
                            else if (i === 2) {
                                if (idx.value > this.ref_evaluation['portrait'][i].value) {
                                    this.editableTabs2[tabID - 1].finalTip.push("Good job! Your abstract is fluent and comfortable to read!")
                                } else {
                                    this.editableTabs2[tabID - 1].finalTip.push("Not fluent yet. Maybe more connectives are needed.")
                                }
                            }
                            else if (i === 3) {
                                if (idx.value > this.ref_evaluation['portrait'][i].value) {
                                    this.editableTabs2[tabID - 1].finalTip.push("Nice abstract! You have already rephrased sentences.")
                                } else {
                                    this.editableTabs2[tabID - 1].finalTip.push("Your abstract is lack of word diversity. You can avoid copying sentences or words directly from original text.")
                                }
                            }
                            else if (i === 4) {
                                if (idx.value > this.ref_evaluation['portrait'][i].value) {
                                    this.editableTabs2[tabID - 1].finalTip.push("Excellent! Your abstract is quite concise!")
                                } else {
                                    this.editableTabs2[tabID - 1].finalTip.push("Not concise enough. Maybe some sentences are too long to read.")
                                }
                            }
                            // console.log(this.editableTabs2[tabID - 1])
                            // this.editableTabs2[tabID - 1].finalTip.push("The " + idx.key + " of your abstract is " + (idx.value > this.ref_evaluation['portrait'][i].value ? 'better' : 'worse') + ' than that of the reference. ');
                        });
                        // this.editableTabs2[tabID - 1].finalTip.push("The overall score of your abstract is " + (res.data['radar']['score'] > this.ref_evaluation['score'] ? 'higher' : 'lower') + ' than that of the reference.')
                        // console.log(this.editableTabs2[tabID - 1].finalTip)
                    });

                // 分类
                text = text.split('.'); // 只考虑句号
                // 去除空格
                text.map((t, i) => {
                    if (t === ' ') {
                        text.splice(i, 1);
                    }
                })
                var myColor = d3.scaleOrdinal()
                                .domain([0,1,2,3,4])
                                .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
                for(let i=0;i<text.length;++i){
                    this.editableTabs2[tabID - 1].classifiedS.push('a')
                }
                for(let i=0;i<text.length;++i){
                    //console.log(text[i])
                    this.queryType({
                        "inputs": text[i],
                        "options": { "wait_for_model": true }
                    }).then((response) => {
                        console.log(text[i])
                        console.log(response);
                        // console.log(JSON.stringify(response));
                        let type = +response[0][0].label.split('_')[1];
                        console.log(type)
                        console.log(myColor(4));
                        this.editableTabs2[tabID - 1].classifiedS[i]={
                            content: text[i] + '. ',
                            style: {
                                'text-decoration': myColor(type) + ' underline',
                                'text-decoration-thickness': '4px',
                                "text-decoration-skip": "none",
                                'text-underline-offset': '4px'
                            }
                        }
                    });
                }
                // text.forEach(s => {
                //     this.queryType({
                //         "inputs": s,
                //         "options": { "wait_for_model": true }
                //     }).then((response) => {
                //         // console.log(JSON.stringify(response));
                //         let type = response[0][0].label;
                //         this.editableTabs2[tabID - 1].classifiedS.push({
                //             content: s + '. ',
                //             style: {
                //                 'text-decoration': myColor(type) + ' underline',
                //                 'text-decoration-thickness': '4px',
                //                 "text-decoration-skip": "none",
                //                 'text-underline-offset': '4px'
                //             }
                //         })
                //     });
                // })
            }
        },

        // 字数统计
        wordCount(text) {
            this.wordNum = text.split(" ").length - 1;
        },

        // 清除标签页
        clearContent: function (item) { // 清除当前 item 内容
            item.content = "";
        }
    }
};