import * as echarts from 'echarts';
export function getEchart(val, chart) {
    const myChart = echarts.init(chart);
    let gaugeData = [
        {
            value: val,
            name: '实时客流量',
            title: {
                // show:false,
                offsetCenter: ['0%', '30%']
            },
            detail: {
                // show: false,
                valueAnimation: true,
                offsetCenter: ['0%', '-10%']
            }
        },
    ];
    var option = {
        grid: {
            show: false,
            top: '0%',
            right: '0%',
            bottom: '0%',
            left: '0%'
        },
        series: [
            {
                name: '',
                type: 'pie',
                startAngle: 90,
                radius: '55%',
                animation: false,
                hoverAnimation: false,
                center: ['50%', '50%'],
                itemStyle: {
                    normal: {
                        labelLine: {
                            show: false,
                        },
                        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                            {
                                offset: 1,
                                color: 'rgba(124, 229, 255,1)',
                            },
                            {
                                offset: 0.9,
                                color: 'rgba(124, 229, 255,1)',
                            },
                            {
                                offset: 0.4,
                                color: 'rgba(131, 250, 255, 0)',
                            },
                            {
                                offset: 0,
                                color: 'rgba(131, 250, 255, 0)',
                            },
                        ]),
                        shadowBlur: 6,
                    },
                },
                data: [
                    {
                        value: 100,
                    },
                ],
            },
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        borderWidth: 0,
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0, [{//只要修改前四个参数就ok
                                offset: 1,
                                color: '#7ee5ff'
                            }, //柱图渐变色
                            {
                                offset: 0,
                                color: '#1acfff'
                            }
                        ]
                        ),
                    }
                },
                axisLine: {
                    lineStyle: {
                        // 圆环宽度
                        width: 10,
                        color: [
                            [1, '#02122e']
                        ]
                    }
                },
                splitLine: {
                    // 隐藏大刻度线
                    show: false,
                },
                axisTick: {
                    // 隐藏小刻度线
                    show: false
                },
                axisLabel: {
                    // 隐藏刻度值
                    show: false,
                },
                data: gaugeData,
                title: {
                    fontSize: 14,
                    color: 'white'
                },
                detail: {
                    // show:false,
                    // linewidth: 1,
                    // height: 1,
                    fontSize: 30,
                    color: 'white',
                    border: false,
                    // borderColor: 'inherit',
                    // borderRadius: 20,
                    // borderWidth: 1,
                    // formatter: '{value}%'
                }
            },
        ]
    };
    myChart.setOption(option);
}