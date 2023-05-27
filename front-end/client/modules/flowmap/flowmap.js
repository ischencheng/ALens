export default {
    data() {
        return {};
    },
    methods: {
        drawFlow: function (text) {
            var len0, len1; // len0 是 intro长度, len1 是 refer 长度
            fetch('http://127.0.0.1:5432/len')
                .then(res=>res.json())
                .then(function(data){
                    console.log(data)
                    len0=data.len0
                    len1=data.len1

                    var margin = { top: 30, right: 10, bottom: 10, left: 10 };
                    let width = 200 - margin.left - margin.right, height = 1430 - margin.top - margin.bottom;
                    var y0 = d3.scaleLinear()
                        .domain([0, len0])
                        .range([0, height]);
                    var y1 = d3.scaleLinear()
                        .domain([0, len1])
                        .range([0, 500]);
        
                    //generate nodes
                    document.querySelector(".flowmap").innerHTML = '';
                    let svg = d3.select(".flowmap")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        
                    var myColor = d3.interpolateLab("rgba(48, 153, 255, 0.8)", "rgba(255, 84, 48, 0.8)")
        
                    //append rect
                    // right
                    fetch('http://127.0.0.1:5432/topk_avg_abs_sen')
                        .then(res => res.json())
                        .then(function (data) {
                            var max = Math.asin(Math.max.apply(null, data)), min = Math.asin(Math.min.apply(null, data));
        
                            //console.log(myColor0(0.5));
                            var rect_g_abs = svg.append('g').attr('class', 'rect-g-abs');
                            for (var j = 0; j < data.length; ++j) {
                                rect_g_abs.append('rect')
                                    .attr('x', width)
                                    .attr('y', y1(j))
                                    //.attr('rx', 1)
                                    .attr('width', 12)
                                    .attr('height', 3*(y1(2) - y1(1)) /4)
                                    .attr("transform", "translate(0," + 800 + ")")
                                    .attr('fill', myColor(((data[j]) - min) / (max - min)))
                                    .attr('id', 'rect-abs-' + j);
                            }
                        });
        
                    // left
                    fetch('http://127.0.0.1:5432/topk_avg_src_sen')
                        .then(res => res.json())
                        .then(function (data) {
                            var max = Math.asin(Math.max.apply(null, data)), min = Math.asin(Math.min.apply(null, data))
        
                            var rect_g_src = svg.append('g').attr('class', 'rect-g-src');
        
                            for (let i = 0; i < data.length; ++i) {
                                rect_g_src.append('rect')
                                    .attr('x', 0 - margin.left)
                                    .attr('y', y0(i))
                                    //.attr('rx', 4)
                                    .attr('width', 12)
                                    .attr('height', 3*(y0(2) - y0(1)) /4)
                                    .attr('fill', myColor((Math.asin(data[i]) - min) / (max - min)))
                                    .attr('id', 'rect-src-' + i)
                                    .attr("class", 'rect-src');
        
                                document.querySelector("#rect-src-" + i).onclick = function () {
                                    document.querySelectorAll("#myTabContent .tab-pane.fade.in.active > p > span")[i].scrollIntoView(true);
                                }
                            }
                        });
        
                    //append path
                    fetch('http://127.0.0.1:5432/topk_abs_sen')
                        .then(res => res.json())
                        .then(function (data) {
                            ///console.log(data);
                            function path(d) {
                                //console.log(d)
                                return d3.linkHorizontal()({
                                    source: [d.x0, d.y0],
                                    target: [d.x1, d.y1+800]
                                })
                            }
        
                            // console.log(len0)
                            // console.log(len1)
                            var path_g = svg.append('g').attr('class', 'path-g');
                            for (var j = 0; j < len1; ++j) {
                                for (var k = 0; k < data[0].length; ++k) {
                                    path_g.append('path')
                                        .attr('d', path({ x0: 0, y0: y0(data[j][k][0]), x1: width, y1: y1(j)}))
                                        .attr('class', 'path-' + j)
                                        .attr('stroke', 'black')
                                        .attr('opacity', 0.1)
                                        .attr('fill', 'none')
                                        .attr('stroke-width', 2);
                                }
                            }
                        })
                })
            


        }
    },
    created() {
        this.$myBus.on("showFlow_ev", () => {
            this.drawFlow();
        });
    },
    mounted() {
        // this.drawFlow();
    },
    beforeDestroy() {
        this.$myBus.off("showFlow_ev");
    },
};