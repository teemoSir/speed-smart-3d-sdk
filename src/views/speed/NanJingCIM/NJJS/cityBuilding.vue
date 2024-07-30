<template>
    <div id="buildLeftTop">
        <div class="input" @click="showSelect = !showSelect">
            <input v-model="selectValue" type="text">
        </div>
        <div class="list" v-show="showSelect">
            <ul>
                <li @click="getvalue(index, item)" v-for="(item, index) in tableData" :key="item.index">{{ item.name }}
                </li>
            </ul>
        </div>
        <div class="scenic1" v-for="(val, index) in scenic.slice(0, 2)" :style="{ marginTop: val.top }">
            <p style="cursor: default;">紫金山-xxx</p>
            <button class="scenicButton"></button>
            <button class="arrow"></button>
            <img :src=val.uri class="img2">
        </div>
    </div>
    <div id="buildLeftBottom">
        <button v-for="(val, index) in path" @click="pathSelect(index, val)"
            :class="{ pathSelect: showPath != index, pathSelect1: showPath == index }">
            <!-- :class="{ pathSelect: pathClick[index] != index, pathSelect1: pathClick[index] == index }"> -->
            <p>{{ val }}</p>
            &ensp;
        </button>
        <div class="simulation" @click="stortRoam"></div>
    </div>
    <div id="centerIcon"></div>
    <div id="buildRightTop">
        <div style="display: flex;width: 100%;height: 100%;">
            <div id="myEchart" ref="myEchart"></div>
            <div id="myButton">
                <div class="dailyFlow">
                    <button class="arrow1"></button>
                    <p class="text">日客流量</p>
                    <p class="sum1">2000人</p>
                </div>
                <div class="maxFlow">
                    <button class="arrow2"></button>
                    <p class="text">日最大承载客流量</p>
                    <p class="sum2">20000人</p>
                </div>
            </div>
        </div>
        <div class="buttomTime">
            <p>游客高峰预测:&ensp;</p>
            <p style="color:white;">13:00</p>
        </div>
    </div>
    <div id="buildRightBottom">
        <div class="scenic1" v-for="(val, index) in scenic1" :style="{ marginTop: val.top }">
            <p style="cursor: default;">紫金山-xxx</p>
            <button class="scenicButton"></button>
            <button class="arrow"></button>
            <img :src=val.uri class="img2">
        </div>
        <p class="mytext">
            紫金山位于南京市玄武区境内，又称钟山、蒋山、神烈山，是江南四大名山之一，有“金陵毓秀的美誉，是南京名胜古迹荟萃之地，世界文化遗产—明孝陵所在地，全国首批国家5A级旅游景区—钟山风景名胜区位于紫金山南麓。</p>
        <div class="price">
            <p style="color:#0dffff; font-size:20px ;font-weight: bolder;text-align: center;    margin-top: 4%;">
                票价:100</p>
        </div>
    </div>
    <div id="buildFoot">
        <div class="footIcon">
            <div @click="JQYL" :class="{ JQYL: !showJQYL, JQYL1: showJQYL }"></div>
            <div @click="LYLX" :class="{ LYLX: !showLYLX, LYLX1: showLYLX }"></div>
            <div @click="ZSP" :class="{ ZSP: !showZSP, ZSP1: showZSP }"></div>
            <div @click="YJTS" :class="{ YJTS: !showYJTS, YJTS1: showYJTS }"></div>
        </div>
    </div>
    <div class="aa1"></div>
    <div class="bb1"></div>
    <div class="cc1"></div>
    <div class="dd1"></div>
</template>
<script>
let pathClickSum = [0, 0, 0, 0];
let pathClickKey = [0, 1, 2, 3];
import { getEchart } from './echart'
export default ({
    name: 'cityBuilding',
    components: {},
    props: {},
    data() {
        return {
            showJQYL: false,
            showLYLX: false,
            showZSP: false,
            showYJTS: false,
            path: ['路线1', '路线2', '路线3', '路线4'],
            showPath: -1,
            pathClick: [5, 5, 5, 5],
            tableData: [
                {
                    'name': '紫金山1'
                },
                {
                    'name': '紫金山2'
                },
                {
                    'name': '紫金山3'
                }, {
                    'name': '紫金山4'
                }
            ],
            scenic: [{ uri: require("@/assets/speed/NanJingCIM/城市建设/风景图1.png"), top: 25 + '%' },
            { uri: require("@/assets/speed/NanJingCIM/城市建设/风景图2.png"), top: 5 + '%' }],
            scenic1: [{ uri: require("@/assets/speed/NanJingCIM/城市建设/风景图3.png"), top: 25 + '%' }],
            showSelect: false,
            selectValue: '紫金山'
        }
    },
    mounted() {
        getEchart(84, this.$refs.myEchart);
    },
    methods: {
        // 景区选择
        getvalue(index, item) {
            this.selectValue = item.name;
            this.showSelect = false;
        },
        // 模拟观景
        pathSelect(key, name) {
            this.showPath = key;
            // if (pathClickKey[key] == key) {
            //     // 统计点击次数
            //     pathClickSum[key]++;
            // }
            // // 第一次点击
            // if (pathClickSum[key] == 1) {
            //     switch (name) {
            //         case this.path[0]:
            //             break;
            //         case this.path[1]:
            //             break;
            //         case this.path[2]:
            //             break;
            //         case this.path[3]:
            //             break;
            //     }
            // } else if (pathClickSum[key] == 2) {
            //     // 第二次点击后重新统计点击次数
            //     pathClickSum[key] = 0;
            //     this.pathClick[key] = 5;
            //     switch (name) {
            //         case this.path[0]:
            //             break;
            //         case this.path[1]:
            //             break;
            //         case this.path[2]:
            //             break;
            //         case this.path[3]:
            //             break;
            //     }
            // }
        },
        // 开始漫游
        stortRoam() {

        },
        // 景区预览
        JQYL() {
            this.showJQYL = !this.showJQYL;
            if (this.showJQYL) {

            } else {

            }
        },
        // 旅游路线
        LYLX() {
            this.showLYLX = !this.showLYLX;
            if (this.showLYLX) {

            } else {

            }
        },
        // 指示牌
        ZSP() {
            this.showZSP = !this.showZSP;
            if (this.showZSP) {

            } else {

            }
        },
        // 应急逃生
        YJTS() {
            this.showYJTS = !this.showYJTS;
            if (this.showYJTS) {

            } else {

            }
        }
    },
    watch: {

    }
})
</script>
<style scoped>
@import './cityBuilding.css';
</style>
  
  