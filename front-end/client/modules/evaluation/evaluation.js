import * as color from 'd3-scale-chromatic';
import * as echarts from 'echarts';
import axios from "axios";


export default {
    data() {
        return {
            dataRadar: [
                // {
                //     'group': 0,
                //     'portrait': [
                //         { key: 'school', value: 4 },
                //         { key: 'grade', value: 20 },
                //         { key: 'bindcash', value: 4000000 },
                //         { key: 'deltatime', value: 12423514 },
                //         { key: 'combatscore', value: 234532 },
                //         { key: 'sex', value: 2 }
                //     ],
                //     'score': 60
                // },
                // {
                //     'group': 1,
                //     'portrait': [
                //         { key: 'school', value: 8 },
                //         { key: 'grade', value: 34 },
                //         { key: 'bindcash', value: 2546000 },
                //         { key: 'deltatime', value: 1234514 },
                //         { key: 'combatscore', value: 2552 },
                //         { key: 'sex', value: 2 }
                //     ],
                //     'score': 75
                // },
                // {
                //     'group': 2,
                //     'portrait': [
                //         { key: 'school', value: 6 },
                //         { key: 'grade', value: 23 },
                //         { key: 'bindcash', value: 34500040 },
                //         { key: 'deltatime', value: 3542314 },
                //         { key: 'combatscore', value: 253255 },
                //         { key: 'sex', value: 1 }
                //     ],
                //     'score': 95
                // }
            ],
            dataClass: [
                // { group: "D1", variable: "S1", value: "background" },
                // { group: "D1", variable: "S2", value: "background" },
                // { group: "D1", variable: "S3", value: "background" },
                // { group: "D1", variable: "S4", value: "method" },
                // { group: "D1", variable: "S5", value: "method" },
                // { group: "D1", variable: "S6", value: "purpose" },
                // { group: "D1", variable: "S7", value: "purpose" },
                // { group: "D1", variable: "S8", value: "result" },
                // { group: "D1", variable: "S9", value: "result" },
                // { group: "D1", variable: "S10", value: "conclusion" },
                // { group: "D2", variable: "S1", value: "background" },
                // { group: "D2", variable: "S2", value: "background" },
                // { group: "D2", variable: "S3", value: "method" },
                // { group: "D2", variable: "S4", value: "method" },
                // { group: "D2", variable: "S5", value: "purpose" },
                // { group: "D2", variable: "S6", value: "result" },
                // { group: "D2", variable: "S7", value: "conclusion" },
                // { group: "D2", variable: "S8", value: "conclusion" },
                // { group: "D3", variable: "S1", value: "background" },
                // { group: "D3", variable: "S2", value: "method" },
                // { group: "D3", variable: "S3", value: "method" },
                // { group: "D3", variable: "S4", value: "purpose" },
                // { group: "D3", variable: "S5", value: "purpose" },
                // { group: "D3", variable: "S6", value: "purpose" },
                // { group: "D3", variable: "S7", value: "conclusion" },
                // { group: "D3", variable: "S8", value: "result" },
                // { group: "D3", variable: "S9", value: "conclusion" },
                // { group: "D3", variable: "S10", value: "conclusion" },
                // { group: "D2", variable: "S9", value: "conclusion" },
                // { group: "D2", variable: "S10", value: "conclusion" },
            ],
            dataBar: [],
            draftNum: 0, // 写作版本数，
            indexNum: 5 // 评价指标数
        };
    },
    created() {
        this.$myBus.on("updateAnalyzeData_ev", (analyzeRes) => {
            this.draftNum += 1;
            // analyzeRes 是从 writing 组件传来的文本分析数据
            //analyzeRes=JSON.parse(analyzeRes);
            console.log('data from writing: ', analyzeRes);
            //console.log(typeof(analyzeRes));
            //console.log(analyzeRes['radar']);

            // 更新 radar 数据
            this.dataRadar.push(
                {
                    'group': this.dataRadar.length,
                    'portrait': analyzeRes.radar.portrait,
                    'score': analyzeRes.radar.score
                }
            );

            // 更新 class 数据
            let newDraft = analyzeRes.class;

            newDraft.forEach(sentence => {
                sentence.group += this.draftNum;
                this.dataClass.push(sentence);
            })

            // 更新 bar 数据
            this.dataBar = analyzeRes.bar;
        });
        this.$myBus.on('updateAnalyzeData_Ref_ev', (analyzeRes) => {
            this.draftNum += 1;
            // analyzeRes 是从 writing 组件传来的文本分析数据
            console.log('ref analyze data from reference: ', analyzeRes);

            // 更新 radar 数据
            this.dataRadar.push(
                {
                    'group': this.dataRadar.length,
                    'portrait': analyzeRes.radar.portrait,
                    'score': analyzeRes.radar.score
                }
            );

            // 更新 class 数据
            let newDraft = analyzeRes.class;
            newDraft.forEach(sentence => {
                sentence.group += this.draftNum;
                this.dataClass.push(sentence);
            })

            // 更新 bar 数据
            this.dataBar = analyzeRes.bar;
        });
    },
    mounted: function () {
        // this.drawRadar();
        this.post_resetBar();
        this.drawClassLegend();
        // this.drawClass();
        // this.drawBars();
    },
    beforeDestroy: function () {
        this.$myBus.off("updateAnalyzeData_ev");
        this.$myBus.off("updateAnalyzeData_Ref_ev");
    },
    watch: {
        dataRadar: {
            handler(newData, oldData) {
                console.log('dataRadar changed')
                this.drawRadar();
            },
            deep: true,
        },
        dataClass: {
            handler(newData, oldData) {
                console.log('dataClass changed')
                this.drawClass();
            },
            deep: true,
        },
        dataBar: {
            handler(newData, oldData) {
                console.log('dataBar changed')
                this.drawBars();
            },
            deep: true,
        }
    },
    methods: {
        post_resetBar: function () {
            return axios({
                method: 'post',
                url: 'http://127.0.0.1:5432/resetBar',
                params: {
                    // text: ref, // data 是当前的 reference
                },
                heads: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        },
        drawRadar: function () {
            //data
            var data = this.dataRadar;


            //get max values in each dim
            function maxValues(da) {
                let new_vals = [];
                for (var i = 0; i < data[0].portrait.length; i++) {
                    new_vals.push(d3.max(data.map(d => {
                        return d.portrait[i].value;
                    })));
                }
                return new_vals;
            }
            var max_val = maxValues(data);
            console.log(max_val);


            const width = 600, height = 300;
            document.querySelector('.radar').innerHTML = "";
            const svg = d3.select('.radar');
            // const svg = this.$refs.radar;

            const radius = 40, dotRadius = 3;
            const num_circle = 5, num_dim = 5;
            const angleSlice = 2 * Math.PI / num_dim;
            const axisCircles = 2, axisLabelFactor = 1.2;
            const port_group = ['understandability', 'consistency', 'fluency', 'diversity', 'conciseness'];

            var x = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return d.group; }))
                .range([100, width - 100]);
            // svg.append("g")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.score; })])
                .range([height, 0]);
            // svg.append("g")
            //     .call(d3.axisLeft(y))
            //     .attr("transform", "translate(30, 50)");

            //scale each dim, return a list
            var rScale = max_val.map(el => d3.scaleLinear().domain([0, el]).range([0, radius]));

            //get line for each dim
            var radarLine = d3.lineRadial()
                .curve(d3.curveCardinalClosed)
                .radius((d, i) => rScale[i](d))
                .angle((d, i) => i * angleSlice);

            var point_list = [];

            var portrait = svg.append('g')
                .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr("transform", (d, i) => {
                    point_list.push([x(d.group), y(d.score) + 50]);
                    return `translate(${x(d.group)},${y(d.score) + 50})`;
                })
                .attr("class", (_, i) => "portrait" + i);

            var bgCircle = portrait
                .selectAll('.levels')
                .data(d3.range(1, (axisCircles + 1)).reverse())//[2,1]
                .enter()
                .append('circle')
                .attr('class', 'bgCircle')
                .attr('r', (d, i) => radius / axisCircles * d)
                .style("fill", "#79bbff")
                .style("stroke", "#79bbff")
                .style("fill-opacity", 0.5);

            var axis = portrait.selectAll('g.axis')
                .data(port_group)
                .enter()
                .append('g')
                .attr('class', 'axis');

            var axis_line = axis
                .append('line')
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", (d, i) => {
                    return radius * 1.1 * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("y2", (d, i) => radius * 1.1 * Math.sin(angleSlice * i - Math.PI / 2))
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "2px");

            var axis_text = axis
                .append("text")
                .attr("class", "legend")
                .style("font-size", "10px")
                .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("dy", "0.35em")
                .attr("x", (d, i) => radius * axisLabelFactor * Math.cos(angleSlice * i - Math.PI / 2))
                .attr("y", (d, i) => radius * axisLabelFactor * Math.sin(angleSlice * i - Math.PI / 2))
                .text(d => d);

            var polygon = portrait.append('g')
                .append('path')
                .attr("d", d => radarLine(d.portrait.map(v => v.value)))
                .attr("fill", (d, i) => '#79bbff')
                .attr("fill-opacity", 0.5)
                .attr("stroke", (d, i) => '#79bbff')
                .attr("stroke-width", 1);

            var dot = portrait.append('g')
                .selectAll('circle')
                .data(d => {
                    // console.log(d.portrait)
                    return d.portrait;
                })
                .enter()
                .append('circle')
                .attr('r', dotRadius)
                .attr("cx", (d, i) => rScale[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2))
                .attr("cy", (d, i) => rScale[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2))
                .attr("fill", (d, i) => {
                    return '#79bbff';
                })
                .style("fill-opacity", 0.9);

            var link_list = [];
            for (let i = 0; i < point_list.length - 1; ++i) {
                var pos_list = {};
                var first_x = point_list[i][0],
                    first_y = point_list[i][1];

                var last_x = point_list[i + 1][0],
                    last_y = point_list[i + 1][1];
                pos_list.sourcePos = [first_x, first_y];
                pos_list.targetPos = [last_x, last_y];
                link_list.push(pos_list);
            }

            //draw links
            var line = svg.append('g');
            for (var i = 0; i < link_list.length; i++) {
                line.append('path')
                    .attr('d', d3.linkVertical()({
                        source: link_list[i].sourcePos,
                        target: link_list[i].targetPos,
                    }))
                    .attr('fill', 'none')
                    .attr('stroke', "#79bbff")
                    .attr('stroke-width', 3)
                    .attr('stroke-opacity', 0.5);
            }


        },
        drawClass: function () {
            var margin = { top: 10, right: 10, bottom: 30, left: 30 },
                width = 618 - margin.left - margin.right,
                height = 100 - margin.top - margin.bottom,
                radius = 4;

            // 先清空
            document.querySelector("div.classification").innerHTML = "";

            // append the svg object to the body of the page
            var svg = d3.select(".classification")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var data = this.dataClass;

            // Labels of row and columns
            var myGroupSet = new Set(),
                myVarSet = new Set();
            data.forEach(s => {
                myGroupSet.add(s.group);
                myVarSet.add(s.variable);
            });
            var myGroups = [...myGroupSet].sort();
            var myVars = [...myVarSet];
            // Build X scales and axis:
            var x = d3.scaleBand()
                .range([0, width])
                .domain(myVars)
                .padding(0.1);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .call(g => g.select(".domain").remove());

            // Build X scales and axis:
            var y = d3.scaleBand()
                .range([height, 0])
                .domain(myGroups)
                .padding(0.1);
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(0))
                .call(g => g.select(".domain").remove());

            // Build color scale
            var myColor = d3.scaleOrdinal()
                                .domain([0,1,2,3,4])
                                .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])

            //Read the data
            console.log(data);
            svg.selectAll()
                .data(data, function (d) { return d.group + ':' + d.variable; })
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.variable); })
                .attr("y", function (d) { return y(d.group); })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d) { 
                    console.log(d.value);
                    return myColor(+d.value); })
                .attr('opacity', .5);

        },
        drawClassLegend() {
            var width = 300;
            var margin = { top: 5, right: 0, bottom: 10, left: 210 };
            const size = 20;
            const border_padding = 15;
            const item_padding = 5;
            const text_offset = 80;

            const line_color = "#00acc1";
            const rect_start_color = "#DCF4F6";
            const rect_end_color = "#34BDCE";

            var domains = ["background", "objective", "methods", "results", "conclusion"];
            var colorScale = d3.scaleOrdinal(color.schemeCategory10);
            // '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'

            var svg = d3.select("#class_legend");
            var legend = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

            //#region legend 1     
            // Boxes
            legend.selectAll("boxes")
                .data(domains)
                .enter()
                .append("rect")
                .attr("x", (d, i) => (i * (size + text_offset + 2 * item_padding)))
                .attr("transform", "translate(-150,0)")
                .attr("y", 0)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", size)
                .attr("height", size)
                .style("fill", (d) => colorScale(d))
                .attr('opacity', .5);

            // Labels
            legend.selectAll("labels")
                .data(domains)
                .enter()
                .append("text")
                .attr("x", (d, i) => size + item_padding + (i * (size + text_offset + 2 * item_padding)))
                .attr("transform", "translate(-150,0)")
                .attr("y", size / 2 + 1)
                // .style("fill", (d) => color(d))
                .text((d) => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");
            //#endregion
        },
        drawBar: function (selector, indicator, data) {
            var app = {};

            var chartDom = selector;
            var myChart = echarts.init(chartDom);
            var option;

            const posList = [
                'left',
                'right',
                'top',
                'bottom',
                'inside',
                'insideTop',
                'insideLeft',
                'insideRight',
                'insideBottom',
                'insideTopLeft',
                'insideTopRight',
                'insideBottomLeft',
                'insideBottomRight'
            ];
            app.configParameters = {
                rotate: {
                    min: -90,
                    max: 90
                },
                align: {
                    options: {
                        left: 'left',
                        center: 'center',
                        right: 'right'
                    }
                },
                verticalAlign: {
                    options: {
                        top: 'top',
                        middle: 'middle',
                        bottom: 'bottom'
                    }
                },
                position: {
                    options: posList.reduce(function (map, pos) {
                        map[pos] = pos;
                        return map;
                    }, {})
                },
                distance: {
                    min: 0,
                    max: 100
                }
            };
            app.config = {
                rotate: 45,
                align: 'left',
                verticalAlign: 'middle',
                position: 'insideBottom',
                distance: 0,
                onChange: function () {
                    const labelOption = {
                        rotate: app.config.rotate,
                        align: app.config.align,
                        verticalAlign: app.config.verticalAlign,
                        position: app.config.position,
                        distance: app.config.distance,
                    };
                    myChart.setOption({
                        series: [
                            {
                                label: labelOption
                            },
                            {
                                label: labelOption
                            },
                            {
                                label: labelOption
                            },
                            {
                                label: labelOption
                            }
                        ]
                    });
                }
            };
            const labelOption = {
                show: false,
                position: app.config.position,
                distance: app.config.distance,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                rotate: app.config.rotate,
                formatter: '{c}  {name|{a}}',
                fontSize: 16,
                rich: {
                    name: {}
                }
            };

            // legend
            option = {
                color: [
                    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: data.legend
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: false, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar', 'stack'] },
                        restore: { show: false },
                        saveAsImage: { show: false }
                    }
                },
                title: {
                    text: indicator,
                    left: 'center',
                    bottom: "15%",
                    textStyle: {
                        fontSize: 28,
                        fontStyle: 'light'
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: data.draft
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    // {
                    //     name: 'S1',
                    //     type: 'bar',
                    //     barGap: 0,
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [320, 332, 301]
                    // },
                    // {
                    //     name: 'S2',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [220, 182, 191]
                    // },
                    // {
                    //     name: 'S3',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [150, 232, 201]
                    // },
                    // {
                    //     name: 'S4',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [98, 77, 101]
                    // },
                    // {
                    //     name: 'S5',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [98, 77, 101]
                    // },
                    // {
                    //     name: 'S6',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [98, 77, 101]
                    // },
                    // {
                    //     name: 'S7',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [98, 77, 101]
                    // },
                    // {
                    //     name: 'S8',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [98, 77, 101]
                    // },
                    // {
                    //     name: 'S9',
                    //     type: 'bar',
                    //     label: labelOption,
                    //     emphasis: {
                    //         focus: 'series'
                    //     },
                    //     data: [0, 98, 0]
                    // }
                ]
            };

            // 加入数据
            data.series.forEach(el => {
                option.series.push({
                    name: el.name,
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: el.data,
                    itemStyle: {
                        opacity: 0.5
                    }
                });
            });

            option && myChart.setOption(option);
            // option && myChart.setOption(option);
        },
        drawBars: function () {
            this.drawBar(document.getElementById('index-0'), 'understandability', this.dataBar[0]);
            this.drawBar(document.getElementById('index-1'), 'consistency', this.dataBar[1]);
            this.drawBar(document.getElementById('index-2'), 'fluency', this.dataBar[2]);
            this.drawBar(document.getElementById('index-3'), 'diversity', this.dataBar[3]);
            this.drawBar(document.getElementById('index-4'), 'conciseness', this.dataBar[4]);
        }
    }
};