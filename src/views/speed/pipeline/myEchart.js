import * as echarts from 'echarts';
let imgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAACQElEQVQ4jZXVz0vUYRDH8df6I8Uo9ZJRBhWZhJSdRIW6dwkSidLoUl66dLK/ISqILh2COgR5Coku3j2kUVBSSGhgYJkFkRLKpm7b4Tu7fl23sgcednf4zPuZZ56Z2Yx3eVtYmfj8pzjfStUfABkcxUV0ohmr+ISXeIg3ccimgypKYBVowhBGwnYdZ3AWt8I2Epqm8MmkOJugbRjDXER4ExP4HnsibJ34HNq2UmhVCrgLT3EDw6jDTtSmdGvIYiluMBU+XfhSSEUaehdPArgDDbEb0RK66Yh4AZWhbQnf3lJoe1zpakTYEPk6H/msC91yHDwUv3O4jefBeJXOab/kRdewPaB9Ya9rr+HINgLeF7shtGvh21/IaQHahVFURw4b0QP3dvN6P5MHku+xekJTGz6j6E5DM9iH2chTVeSp9lgNA/VFkIF62msIWEtoK8O3OVgbSmrTWivTP6tbaMAKyYvNRrQ5SY6mkZ1c4f7iuvjBIpMrSMpqOrS58P0YrGKkYzgpacWspGyG4fI8xz/QNsOl+SJ/ODTZ8DmBZ+lI4ZH111uS1OFQ7OzEzw0RFuwLoYULwQCZmFIVeIwZSUeVFv/h0E9ZL/4F/MAgDkqK/1d6SuVxBeN4H9fLRWQLkpyzsU2XJaXVK2mc4hOmoV9xWjKBDuEOvknqsDJ0uchhNa7hHE6FbxGaLqk83qIDeyPqQUn7NcZuD9t4aDrCZ0OhZcpM/tIh3Y09EeEcXvjLkM63loeWW//1d5LJ57cE/a/1G4PGrgJoCiHdAAAAAElFTkSuQmCC';
export function getEchartGl(datas, height, chart) {
    // 传入数据生成 option
    let option = getPie3D1(datas, 0.5, height);
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    let selectedIndex = '';
    let hoveredIndex = '';
    const myChart = echarts.init(chart);
    myChart.setOption(option);
    // 监听点击事件，实现选中效果（单选）
    myChart.on('click', function (params) {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
        let isSelected = !option.series[params.seriesIndex].pieStatus.selected;
        let isHovered = option.series[params.seriesIndex].pieStatus.hovered;
        let k = option.series[params.seriesIndex].pieStatus.k;
        let startRatio = option.series[params.seriesIndex].pieData.startRatio;
        let endRatio = option.series[params.seriesIndex].pieData.endRatio;
        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
            option.series[selectedIndex].parametricEquation = getParametricEquation1(option.series[selectedIndex].pieData.startRatio, option.series[selectedIndex].pieData.endRatio, false, false, k, option.series[selectedIndex].pieData.value);
            option.series[selectedIndex].pieStatus.selected = false;
        }
        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        option.series[params.seriesIndex].parametricEquation = getParametricEquation1(startRatio, endRatio, isSelected, isHovered, k, option.series[selectedIndex].pieData.value);
        option.series[params.seriesIndex].pieStatus.selected = isSelected;
        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        isSelected ? selectedIndex = params.seriesIndex : null;
        // 使用更新后的 option，渲染图表
        myChart.setOption(option);
    });
    // 监听 mouseover，近似实现高亮（放大）效果
    myChart.on('mouseover', function (params) {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
            return;
            // 否则进行高亮及必要的取消高亮操作
        } else {
            // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
            if (hoveredIndex !== '') {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
                isSelected = option.series[hoveredIndex].pieStatus.selected;
                isHovered = false;
                startRatio = option.series[hoveredIndex].pieData.startRatio;
                endRatio = option.series[hoveredIndex].pieData.endRatio;
                k = option.series[hoveredIndex].pieStatus.k;
                // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                option.series[hoveredIndex].parametricEquation = getParametricEquation1(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
                option.series[hoveredIndex].pieStatus.hovered = isHovered;
                // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                hoveredIndex = '';
            }
            // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
            if (params.seriesName !== 'mouseoutSeries') {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                isSelected = option.series[params.seriesIndex].pieStatus.selected;
                isHovered = true;
                startRatio = option.series[params.seriesIndex].pieData.startRatio;
                endRatio = option.series[params.seriesIndex].pieData.endRatio;
                k = option.series[params.seriesIndex].pieStatus.k;
                // 对当前点击的扇形，执行高亮操作（对 option 更新）
                option.series[params.seriesIndex].parametricEquation = getParametricEquation1(startRatio, endRatio, isSelected, isHovered, k, option.series[params.seriesIndex].pieData.value + 5);
                option.series[params.seriesIndex].pieStatus.hovered = isHovered;
                // 记录上次高亮的扇形对应的系列号 seriesIndex
                hoveredIndex = params.seriesIndex;
            }
            // 使用更新后的 option，渲染图表
            myChart.setOption(option);
        }
    });
    // 修正取消高亮失败的 bug
    myChart.on('globalout', function () {
        if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            let isSelected = option.series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            k = option.series[hoveredIndex].pieStatus.k;
            startRatio = option.series[hoveredIndex].pieData.startRatio;
            endRatio = option.series[hoveredIndex].pieData.endRatio;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            option.series[hoveredIndex].parametricEquation = getParametricEquation1(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
            option.series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = '';
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(option);
    });
};
// 3D饼图
function getParametricEquation1(startRatio, endRatio, isSelected, isHovered, k, h) {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;
    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;
    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
    }
    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== 'undefined' ? k : 1 / 3;
    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isHovered ? 1.05 : 1;
    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
        },
        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
        },
        x: function (u, v) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        y: function (u, v) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        z: function (u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                return Math.sin(u) * h * .1;
            }
            return Math.sin(v) > 0 ? 1 * h * .1 : -1;
        }
    };
}
// 生成模拟 3D 饼图的配置项
function getPie3D1(pieData, internalDiameterRatio, heigth) {
    let series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let legendData = [];
    let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;
    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;
        let seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false,
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k: k,
            },
            center: ['10%', '10%'],
        };

        if (typeof pieData[i].itemStyle != 'undefined') {
            let itemStyle = {};
            typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
            typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = 1 : 1;
            seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
    }
    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation1 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    let sum = 0;
    let per = 0;
    for (let i = 0; i < series.length; i++) {
        sum += series[i].pieData.value;
    }
    for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation1(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value);
        startValue = endValue;
        // 标注的后半部分数值
        per = (series[i].pieData.value / sum * 100).toFixed(2);
        series[i].name = series[i].name + "     " + series[i].pieData.value + "台";
        legendData.push(series[i].name);
    }
    // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
    series.push({
        name: 'mouseoutSeries',
        type: 'surface',
        parametric: true,
        wireframe: {
            show: false
        },
        itemStyle: {
            opacity: 0
        },
        parametricEquation: {
            u: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20
            },
            v: {
                min: 0,
                max: Math.PI,
                step: Math.PI / 20
            },
            x: function (u, v) {
                return Math.sin(v) * Math.sin(u) + Math.sin(u);
            },
            y: function (u, v) {
                return Math.sin(v) * Math.cos(u) + Math.cos(u);
            },
            z: function (u, v) {
                return Math.cos(v) > 0 ? 0.1 : -0.1;
            }
        }
    });
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    let option = {
        //animation: false,
        legend: {
            data: [{
                name: legendData[0],
                textStyle: {
                    color: '#17c9ad'
                },
            }, {
                name: legendData[1],
                textStyle: {
                    color: '#2c8efb'
                },
            }],
            // icon: 'Square',
            // itemHeight: 10, // 修改icon图形大小
            itemGap: 50, // 修改icon间距
            display: 'absolute',
            // orient: 'horizontal',//图例横向显示
            // 设置注释样式
            // left: '2%',
            top: '5%',
        },
        tooltip: {
            formatter: params => {
                if (params.seriesName !== 'mouseoutSeries') {
                    return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`;
                }
            }
        },
        xAxis3D: {
            min: -1,
            max: 1
        },
        yAxis3D: {
            min: -1,
            max: 1
        },
        zAxis3D: {
            min: -1,
            max: 1
        },
        grid3D: {
            show: false,
            boxHeight: heigth * 10,
            viewControl: {//3d效果可以放大、旋转等，请自己去查看官方配置
                // 圆心线与屏幕的夹角
                alpha: 30,
                // beta: 40,
                // 旋转
                rotateSensitivity: 0,
                // 缩放
                zoomSensitivity: 0,
                // 平移
                panSensitivity: 0,
                autoRotate: false
            },
            left: '0%',
            top: '8%',
            //后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
            postEffect: false,
            // light: {
            //     main: {
            //         color: "rgb(85, 84, 84)", // 主光源的颜色。
            //         shadow: true, // 主光源是否投射阴影
            //         alpha: 80, // 主光源绕 x 轴，即上下旋转的角度
            //     },
            // },
        },

        series: series
    };
    return option;
}
export function getEchartline1(x, y, chart) {
    const myChart = echarts.init(chart);
    var option = {
        grid: {
            show: false,
            top: '15%',
            right: '5%',
            bottom: '10%',
            left: '15%'
        },
        xAxis: {
            type: 'category',
            data: x,
            axisLabel: {
                color: '#a6d2e7',
            },
        },
        yAxis: {
            type: "value",
            // 网格横线设置为虚线
            splitLine: {
                lineStyle: {
                    type: 'dashed'//虚线
                },
                show: true //隐藏
            },
            axisLabel: {
                formatter: "{value}㎡",
                color: '#a6d2e7',
            },
        },
        series: [
            {
                name: '污水流量',
                type: 'bar',
                data: y,
                barWidth: '40%', //柱的宽度
                // 柱体标注
                label: {
                    show: true,	// 是否可见
                    rotate: 0, 	// 旋转角度
                    position: 'top', // 显示位置
                    color: '#a6d2e7',
                },
                itemStyle: {
                    barBorderRadius: [12, 12, 0, 0], //柱体圆角  
                    color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0, [{//只要修改前四个参数就ok
                            offset: 1,
                            color: '#5ec1f7'
                        }, //柱图渐变色
                        {
                            offset: 0,
                            color: '#034971'
                        }
                    ]
                    ),
                }
            }
        ],
        // 图标标注
        legend: {
            data: ['污水流量'],
            icon: 'rectangle',
            itemHeight: 10, // 修改icon图形大小
            itemGap: 50, // 修改icon间距
            display: 'absolute',
            // orient: 'horizontal',//图例横向显示
            // 设置注释样式
            left: '1%',
            top: '1%',
            textStyle: {
                color: '#cce1e5'
            },
        },
        // 弹窗
        tooltip: {
            axisPointer: {
                type: 'cross'
            }
        }

    }
    myChart.setOption(option);
}
export function getEchartline2(x, y, chart) {
    const myChart = echarts.init(chart);
    var option = {
        grid: {
            show: false,
            top: '15%',
            right: '5%',
            bottom: '10%',
            left: '15%'
        },
        xAxis: {
            type: 'category',
            data: x,
            axisLabel: {
                color: '#a6d2e7',
            },
        },
        yAxis: {
            type: "value",
            // 网格横线设置为虚线
            splitLine: {
                lineStyle: {
                    type: 'dashed'//虚线
                },
                show: true //隐藏
            },
            axisLabel: {
                formatter: "{value}mm",
                color: '#a6d2e7',
            },
        },
        series: [
            {
                name: '液位',
                type: 'line',
                data: y,
                barWidth: '50px', //柱的宽度
                symbol: 'circle',//形状
                symbolSize: [15, 15],//大小
                symbol: 'image://' + imgA, //上同
                // 折点标注
                label: {
                    show: true,	// 是否可见
                    rotate: 0, 	// 旋转角度
                    position: 'top', // 显示位置
                    color: '#a6d2e7',
                },
                itemStyle: {
                    barBorderRadius: [2, 2, 0, 0], //柱体圆角  
                    color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0, [{//只要修改前四个参数就ok
                            offset: 0,
                            color: '#005BEA'
                        }, //柱图渐变色
                        {
                            offset: 1,
                            color: '#00C6FB'
                        }
                    ]
                    ),
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#07526e'    //靠上方的透明颜色
                        },
                        {
                            offset: 1,
                            color: '#092039'    //靠下方的透明颜色
                        }
                    ])
                },
            }
        ],
        // 标注
        legend: {
            data: ['液位'],
            itemHeight: 15, // 修改icon图形大小
            itemGap: 50, // 修改icon间距
            display: 'absolute',
            // orient: 'horizontal',//图例横向显示
            // 设置注释样式
            left: '1%',
            top: '1%',
            textStyle: {
                color: '#cce1e5'
            },
        },
        // 弹窗
        tooltip: {
            axisPointer: {
                type: 'cross',
            }
        }

    }
    myChart.setOption(option);
}