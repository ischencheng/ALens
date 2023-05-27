/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// import HttpHelper from "common/utils/axios_helper.js";
// import { timeThursdays } from "d3-time";
export default {
    components: { // 依赖组件
    },
    props: {
        dataFromParent: {
            type: Object,
            required: true
        }
    },
    data() { // 本页面数据
        return {
            hideContent: false,
            Data: {},
            Sentences: [],
            Lines: [],
            Icons: [],
            Button: { style: {} },
            Rects: [],
        };
    },
    computed: {
        filteredSentences() {
            return this.hideContent
                ? this.Sentences.filter(s => !s.collapsible)
                : this.Sentences;
        },
        filteredLines() {
            return this.hideContent
                ? []
                : this.Lines;
        },
        filteredIcons() {
            return this.hideContent
                ? []
                : this.Icons;
        }
    },
    methods: {
        // 从父组件 rst Content 传入数据信息
        loadData: function () {
            this.Data = this.dataFromParent;
            // console.log(this.Data);
            // 根据最后一句话的 sentence-id 获取总共有多少句话
            this.Data['sentence_num'] = this.Data.text.slice(-1)[0]['sentence-id'] + 1;
            // console.log(this.Data.sentence_num)
        },
        // 画句子
        drawSentences: function () {
            var margin = 10;
            var that = this;

            // console.log(tree);
            var sentences = that.Data.text;

            // console.log(sentences);
            // console.log(lines);
            sentences.forEach((sentence, index) => {
                // console.log(that.Sentences);
                // console.log(sentence);
                // console.log(index);
                var content = sentence.content;
                var sentence_id = sentence["sentence-id"];
                var intend = sentence["indent(depth)"] - 2;
                var new_sentence =
                {
                    content: content,
                    id: 'sentence-' + sentence_id,
                    'sentence-index': sentence['sentence-index'],
                    style: {
                        position: 'relative',
                        left: 20 + 10 * intend + 'px',
                        width: 'auto',
                        margin: '10px 0px 10px 0px',
                        'margin-right': margin * 3 + 10 * intend + 'px',
                        'border-color': this.Data.color
                    },
                    isHidden: false
                };

                // 为可折叠元素添加标识
                if (index !== 0) new_sentence['collapsible'] = true;
                else new_sentence['collapsible'] = false;

                // console.log(new_sentence);
                that.Sentences.push(new_sentence);
            });
        },
        // 画线和图标
        drawLinesIconsButton: function () {
            var that = this;

            // nextTick 在页面渲染完毕后再执行传入后的回调函数
            // 因为此函数依赖 drawSentences 渲染的 <p> 元素定位
            var lines = that.Data.line;

            // console.log(sentences);
            // console.log(lines);
            lines.forEach((line, index) => {
                // console.log(index);
                var svg_width = 10;
                var begin_sentence_id = line['begin-id(firstTxtChildId)'];
                var begin_sentence = document.querySelector('#sentence-' + begin_sentence_id);

                var span = line['span(textChildNum)']; // 跨越多少段文本

                // 计算 svg 的高度
                function get_svg_height() {
                    if (span > 1) {
                        // console.log(span);
                        var svg_height = 0;
                        for (var i = 0; i < span; i++) {
                            var p_tmp = document.querySelector('#sentence-' + (begin_sentence_id + i));
                            // console.log(begin_sentence_id);
                            // console.log(p_tmp);
                            var p_height = p_tmp.offsetHeight;
                            // console.log(p_height);
                            svg_height += p_height;
                        }
                        svg_height += 10 * span;
                    }
                    else {
                        svg_height = 10; // 若只跨越一段则不需要线的空间, 只需要留 icon 的空间
                    }
                    return svg_height;
                }
                var svg_height = get_svg_height();

                // 计算 svg 左侧距离
                function get_svg_left() {
                    if (span > 1) {
                        return begin_sentence.offsetLeft - (10 + svg_width / 2);
                    } else {
                        return begin_sentence.offsetLeft - svg_width / 2;
                    }
                }

                // svg 的样式
                var svg_style = {
                    left: get_svg_left(),
                    top: begin_sentence.offsetTop - 10,
                    height: svg_height
                };
                // console.log(svg_style);

                // 添加图标
                console.log(line.rst_type);
                var rst_type = '';
                if (line.rst_type ===  "evaluation" ||line.rst_type === "elaboration"|| line.rst_type ===  "explanation" || line.rst_type === "topiccomment" ||line.rst_type ===   "enablement" ) {
                    rst_type = 'elaboration';
                } else if (line.rst_type ===  "background" || line.rst_type === "condition" ||  line.rst_type === "mannermeans" ||  line.rst_type === "summary" || line.rst_type ===  "topicchange") {
                    rst_type = 'background';
                } else if (line.rst_type === 'contrast') {
                    rst_type = 'contrast';
                } else if (line.rst_type === "joint" ||  line.rst_type === "comparison") {
                    rst_type = 'joint';
                } else if (line.rst_type === "temporal" || line.rst_type ===  "cause" ||  line.rst_type === "attribute") {
                    rst_type = 'sequence';
                } else {
                    rst_type = 'sequence';
                }

                var new_icon = {
                    // require()用来解析路径 否则路径传输后出错
                    src: require('../../assets/image/icons/' + rst_type + '.png'),
                    style: {
                        position: 'absolute',
                        left: svg_style.left + 'px',
                        top: svg_style.top + 'px',
                        width: 10 + 'px',
                        height: 10 + 'px'
                    },
                    // collapsible: true
                };

                // 加入数据
                // console.log(new_icon);
                that.Icons.push(new_icon);

                // 加入线
                var new_line = {
                    svg: {
                        style: {
                            position: 'absolute',
                            left: svg_style.left + 'px',
                            top: svg_style.top + 'px',
                            width: svg_width + 'px',
                            height: svg_style.height + 'px',
                            // "stroke-color": this.Data.color
                        }
                    },
                    line: {
                        x1: svg_width / 2 + 'px',
                        y1: 10 + 'px',
                        x2: svg_width / 2 + 'px',
                        y2: 10 + svg_style.height - 10 + 'px', // 起点 + svg高度 - icon高度
                        class: 'line p1',
                        style: { 'stroke': this.Data.color }
                    },
                    // collapsible: true
                };

                // 加入数据
                // console.log(new_line);
                that.Lines.push(new_line);

                // 添加 button 的位置
                if (index === 0) { // 仅依赖第一句话
                    var btn_offsetLeft = begin_sentence.offsetLeft + 5;
                    var btn_offsetTop = begin_sentence.offsetTop - begin_sentence.offsetHeight / 2 - 15;
                    that.Button.style = {
                        position: 'absolute',
                        left: btn_offsetLeft + 'px',
                        top: btn_offsetTop + 'px'
                    };
                }
            });
        },
        // 设置指示数量的 rects 的 style
        drawRects: function () {
            var lines = this.Data.line;
            // console.log(lines);
            var rst_total_num = Object.getOwnPropertyNames(lines).length - 1;
            // console.log(rst_total_num);
            var rst_type_num = { elaboration: 0, background: 0, sequence: 0, joint: 0, contrast: 0 };
            var rst_type_ratio = { elaboration: 0, background: 0, sequence: 0, joint: 0, contrast: 0 };

            lines.forEach((line, index) => {
                if (line.rst_type === 'elaboration') {
                    rst_type_num.elaboration += 1;
                }
                else if (line.rst_type === 'background') {
                    rst_type_num.background += 1;
                }
                else if (line.rst_type === 'sequence') {
                    rst_type_num.sequence += 1;
                }
                else if (line.rst_type === 'joint') {
                    rst_type_num.joint += 1;
                }
                else {
                    rst_type_num.contrast += 1;
                }
            });
            // console.log(rst_type_num);
            Object.keys(rst_type_ratio).forEach(rst_type => {
                rst_type_ratio[rst_type] = Math.max(rst_type_num[rst_type] / rst_total_num, 0.5);
            });
            // console.log(rst_type_ratio);


            var svg = { width: 36, height: 16, left: 80 };
            var begin_sentence = document.querySelector('#sentence-0');
            // console.log(begin_sentence);
            svg['top'] = begin_sentence.offsetHeight;

            for (var i = 0; i < 5; ++i) {
                var opacity = rst_type_ratio[Object.keys(rst_type_ratio)[i]];
                this.Rects.push({
                    style: {
                        position: 'absolute',
                        left: svg.left + i * 100 + 'px',
                        top: svg.top - 104 + 'px',
                        width: svg.width + 'px',
                        height: svg.height + 'px',
                        opacity: opacity,
                        fill: this.Data.color
                    }
                });
            }
        },
        // 设置指示结构的 rects 的 信息
        setStructureRects: function () {
            console.log(this.Data.line);
            var sentence_num = this.Data.sentence_num;
            var lines = this.Data.line;
            var last_top = 0;
            // lines.forEach( line, index => {

            // })
        },
        // 初始化
        my_initialize: function () {
            this.hideContent = false;
        },
        toggleHidden: function (sentence) {
            console.log(sentence);
            sentence.isHidden = !sentence.isHidden; // 切换透明度

            let mapped_sentence = document.querySelector('.introduction #myTabContent .active #src-sen-' + sentence['sentence-index']);
            // console.log(mapped_sentence);
            if (sentence.isHidden) {
                mapped_sentence.setAttribute('style', 'color: rgba(0,0,0,0.3)');
            } else { mapped_sentence.setAttribute('style', 'color: rgba(0,0,0,1)'); }
        },
    },
    watch: {},
    created() {
        this.loadData();
        this.drawSentences();
        // this.setStructureRects();
    },
    mounted() {
        this.drawLinesIconsButton();
        this.drawRects();
        this.my_initialize();
    },
};