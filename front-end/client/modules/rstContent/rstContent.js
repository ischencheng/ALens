/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// import HttpHelper from "common/utils/axios_helper.js";
// import { timeThursdays } from "d3-time";
import rstSection from "../rstSection/rstSection.vue";
import rstData from "../../assets/json/rstData.json"; // 导入原始数据 (初步测试使用)
import axios from "axios";

export default {
    components: { // 依赖组件
        rstSection
    },
    data() { // 本页面数据
        return {
            dataForSection: [], // 使用导入的原始数据数组
            rst_type_total_num: {
                elaboration: 0,
                background: 0,
                sequence: 0,
                joint: 0,
                contrast: 0
            },
            rst_type_total_ration: {
                elaboration: 0,
                background: 0,
                sequence: 0,
                joint: 0,
                contrast: 0
            },
            rst_sum: 0,
            Svgs: [],
            Icons: [],
            colors: ['#B4CFEA', '#DCE1C3', '#997054', '#35674C', '#2B6C82'],
            text: {
                intro: "Timely access to cardiovascular health services is necessary to prevent heart damages . This study examined inequality in geographical distribution of cardiovascular health services in Iran. Thiis study is a cross - sectional study conducted using demographic data from all iranian provinces ( 31 provinces ) from 2012 census by the statistics center of iran ( sci ) . The gini coefficients of ccu beds and cardiologists were used to assess equality in access to cardiovascular health services in iran . MS excel software was used to calculate gini coefficients. The proportions of ccu bed and cardiologist per 100,000 population were 4,88 and 1,27 , respectively ; also the gini coefficients were 0,129 and 0,045 , respectively. Descriptive statistics showed a skewness in distribution of pubic cardiovascular health services in iran , though gini coefficient revealed no significant inequality . However , equal distribution of ccu beds and cardiovascular specialists does not mean they are sufficiently available in iran .",
            }
        };
    },
    computed: {
    },
    methods: {
        countRstTotalNum: function () {
            // 全部遍历 计算总数
            this.dataForSection.forEach(data => {
                var lines = data.line;
                // console.log(lines);
                lines.forEach(line => {
                    // console.log(line.rst_type);
                    let tmp_type = line.rst_type;
                    if (tmp_type === "evaluation"||tmp_type === "elaboration" || tmp_type === "explanation" || tmp_type === "topiccomment" || tmp_type === "enablement" ) {
                        this.rst_type_total_num['elaboration'] += 1;
                    }
                    else if (tmp_type === "background" || tmp_type === "condition" || tmp_type === "mannermeans" || tmp_type === "summary" || tmp_type === "topicchange") {
                        this.rst_type_total_num['background'] += 1;
                    }
                    else if (tmp_type === "temporal" || tmp_type === "cause" || tmp_type === "attribute") {
                        this.rst_type_total_num['sequence'] += 1;
                    }
                    else if (tmp_type === "joint" || tmp_type === "comparison") {
                        this.rst_type_total_num['joint'] += 1;
                    }
                    else if (tmp_type === "contrast" ) {
                        this.rst_type_total_num['contrast'] += 1;
                    }
                });
            });
            // console.log(this.rst_type_total_num);

            // 计算比率
            this.rst_sum = 0;
            Object.keys(this.rst_type_total_num).forEach(rst_type => {
                // console.log(this.rst_type_total_num[rst_type]);
                // console.log(this.rst_sum);
                this.rst_sum += this.rst_type_total_num[rst_type];
            });
            // console.log(this.rst_sum)
            Object.keys(this.rst_type_total_ration).forEach(rst_type => {
                this.rst_type_total_ration[rst_type] = this.rst_type_total_num[rst_type] / this.rst_sum;
            });
            // console.log(this.rst_type_total_ration);
        },
        setSvgStyle: function () {
            var svg_style = { width: 36, height: 80, left: 80 };
            for (var i = 0; i < 5; i++) {
                var svg_tmp = {
                    style: {
                        position: 'absolute',
                        left: svg_style.left + i * 100 + 'px',
                        // top: 10 + 'px',
                        width: svg_style.width + 'px',
                        height: svg_style.height * this.rst_type_total_ration[Object.keys(this.rst_type_total_ration)[i]] + 'px',
                        'border-radius': 4 + 'px',
                        fill: 'DDDDDD'
                    }
                };
                this.Svgs.push(svg_tmp);
            }
            // console.log(this.Svgs);
        },
        setIconAttr: function () {
            var rstRelation = ['elaboration', 'background', 'sequence', 'joint', 'contrast'];
            for (var i = 0; i < 5; i++) {
                var new_icon = {
                    src: require('../../assets/image/icons_h/' + rstRelation[i] + '-h.png'),
                    style: {
                        position: 'absolute',
                        left: 88 + 100 * i + 'px',
                        top: 85 + 'px',
                        width: '20px',
                        height: '20px'
                    }
                };
                this.Icons.push(new_icon);
            }
        },
        addColor: function () { // 将颜色值加入 dataForSection
            // console.log(this.dataForSection[0]);
            let colorScale = d3.scaleOrdinal().domain(['introduction', 'discussion', 'method', 'result', 'conclusion']).range(['#706FD3', '#33D9B2', '#FF793F', '#FFB142', '#34ACE0']);
            this.dataForSection.forEach((data, index) => {
                // console.log(data);
                data.color = colorScale(data.type);
                // console.log(data);
            });
            // this.dataForSection.forEach(element => {
            //     console.log(element);
            // });
        },
        testListen: function () {
            console.log('testListen function');
        },
        post_rst: function (filename) {
            return axios({
                method: 'post',
                url: 'http://127.0.0.1:5432/rstData',
                params: {
                    filename: filename,
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },
        loadData: function () { // 将本地数据导入 data
            let that = this;
            // 直接导入 assets 中的数据
            // this.dataForSection = rstData;
            // console.log(this.dataForSection);

            // 使用 flask 导入
            this.post_rst()
                .then(data => {
                    // console.log('data');
                    // console.log(this);
                    that.dataForSection = data.data;

                    // 执行后续操作
                    this.addColor();
                    this.countRstTotalNum();
                    // console.log(this.rst_type_total_ration);
                    this.setSvgStyle();
                    this.setIconAttr();
                });
        },
        // addClass: function() {
        //     let sentences = document.querySelectorAll('.sentence');
        //     console.log(sentences);
        // },
        uploadClickHandler: function () {
            this.uploadFile();
            this.loadData();
            // this.$nextTick( () => {
            //     this.addClass();
            // });
        },
        async uploadFile() {
            let formData = new FormData();
            let fileupload = document.querySelector('#fileupload');
            // console.log(fileupload.files[0]["name"]);
            formData.append("fileupload", fileupload.files[0]);
            //this.createTab(fileupload.files[0]["name"]);

            // 下面这段代码是没用的吗？
            await fetch('http://localhost:8888/upload', {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
        },
        post_analyzeRef: function (ref) {
            return axios({
                method: 'post',
                url: 'http://127.0.0.1:5432/analyzeRef',
                params: {
                    text: ref, // data 是当前的 reference
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },
    },
    watch: {},
    mounted() {
        this.$myBus.emit("prompt_ev", this.text.intro); // 传给 writing
        this.$myBus.emit("reference_ev", this.text); // 传给 reference
        this.post_analyzeRef(this.text.intro)
            .then(res => {
                // this.$myBus.emit('updateAnalyzeData_ev', res.data);
                this.$myBus.emit("evaluateRef_ev", res.data); // 将ref的评估结果传给 writing
            });
    }
};