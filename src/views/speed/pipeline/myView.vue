<template>
    <div id="left">
        <div class="left-top">
            <div id="leftTop" ref="chartTop"></div>
        </div>
        <div class="left-center">
            <div id="leftCenter" ref="chartCenter"></div>
        </div>
        <div class="left-bottom">
            <div id="leftBottom" ref="chartBottom"></div>
            <div class="echartBottom"></div>
        </div>
    </div>
    <div id="right">
        <div class="right-top">
            <div id="tab">
                <button v-for="(val, index) in item1" @click="changes1(index)"
                    :class="{ active: index == num1, noActive: index != num1 }">{{ val }}
                    {{ dataNum[index] }}</button>
            </div>
            <div id="rightTop">
                <div class="rightTopItem1">
                    <div id="tab1">
                        <p>日期</p>
                        <p>设备名称</p>
                        <p style="padding-left: 15px;">设备状态</p>
                        <p>紧急度</p>
                        <p style="padding-left:5px;">处理人</p>
                        <p style="padding-left:0;">状态</p>
                    </div>
                </div>
                <div v-for="(val, index) in data" v-show="index == num1" class="myTopItem">
                    <template v-for="(val1, index1) in val" :key=index1>
                        <div class="rightTopItem">
                            <p>{{ val1.data }}</p>
                            <div class="deviceName">
                                <p :title=val1.name style="margin-top: 0px;">{{ val1.name }}</p>
                            </div>
                            <p style="padding-right: 20px;">
                            <p :style="{ color: (val1.eqState == '在线' ? 'cyan' : 'red') }">•</p>{{
                                val1.eqState
                            }}</p>
                            <p style="padding-left: 30px;padding-right: 30px;">{{ val1.urgent }}</p>
                            <p style="padding-right: 15px;">{{ val1.man }}</p>
                            <p
                                :style="{ color: (val1.state == '未处理' ? 'red' : (val1.state == '处理中' ? '#ffb142' : '#17c8ad')) }">
                                {{
                                    val1.state
                                }}</p>
                        </div>
                    </template>
                </div>
            </div>

        </div>
        <div class="right-bottom">
            <div id="rightBottom">
                <div :class="[val.class]" v-for="(val,index) in classes">
                    <p class="rightBottomVal">{{ eqName[index] }}</p>
                    <p class="rightBottomVal1">{{ eqSum[index] }}</p>
                </div>
            </div>
        </div>
    </div>
    <div id="foot">
        <div style="position: relative;bottom:30px;">
            <button type="button" @click="cadPopover = !cadPopover"
                :class="{ cad: !cadPopover, cad1: cadPopover }"></button>
            <button type="button" @click="showEquipment" :class="{ equipment: !eqPopover, equipment1: eqPopover }"></button>
            <button type="button" @click="showWarn" :class="{ warn: !warnPopover, warn1: warnPopover }"></button>
        </div>
    </div>
    <!-- 设备弹窗 -->
    <div class="eqPopover" v-show="eqPopover">
        <button v-for="(val, index) in item2" @click="changes2(index, val)">
            &emsp;
            <input :class="{ sel: click3[index] == index, sel1: click3[index] != index }" type="button">
            &ensp;{{ val }}
        </button>
    </div>
    <div class="warnPopover" v-show="warnPopover">
        <button v-for="(val, index) in item3" @click="changes3(index, val)">
            &emsp;
            <input :class="{ sel: click4[index] == index, sel1: click4[index] != index }" type="button">
            &ensp;{{ val }}
        </button>
    </div>
    <div id="tooltip-view">
        <p class="id">编号：{{ myPopup.id }}</p>
        <p class="name">类别：</p>
        <p class="content">{{ myPopup.category }}</p>
        <br>
        <p class="name">采样时间：</p>
        <p class="content">{{ myPopup.time }}</p>
        <br>
        <p class="name">采样数据：</p>
        <p class="content">{{ myPopup.data }}</p>
        <br>
        <p class="name">设备状态：</p>
        <p class="content">
        <p class="content" :style="{ color: (myPopup.state == '在线' ? 'cyan' : 'red') }">•</p>{{ myPopup.state }}</p>
    </div>
</template>

<script>
import './echarts-gl';
import { getEchartGl, getEchartline1, getEchartline2 } from '@/views/speed/pipeline/myEchart';
import removeEntity from "@/cesiumSDK/core/entityJS/removeEntity";
import * as Speed from "@/cesiumSDK/index";
import http from '@/utils/request';
import tool from '@/utils/tool';
import ModelInfo from '@/utils/modelInfo';
import getData1 from './axiosToken';
import md5 from 'js-md5';
import { sha256 } from 'js-sha256';
import {
    darwBillBoard
} from "@/cesiumSDK/core/entityJS/draw";
let myTiles = new Speed.TilesetLayer();
let Parameter = {};
let eqKey = [0, 1, 2, 3, 4];
let warnKey = [0, 1];
let keyNum1 = [0, 0, 0, 0, 0];
let keyNum2 = [0, 0];
let znjg = [
    [118.70664305645086, 32.127311426997586, -90.0039440947253],
    [118.70775467915045, 32.12712917797271, -90.0038761790121],
    [118.70815240848957, 32.12657375461996, -90.00370189279],
    [118.70822379024293, 32.126096439562374, -90.0034028145294]];

let ywj = [
    [118.70685722452437, 32.12606173164028, -90.004399851856],
    [118.7075982226423, 32.12599388156514, -91.42717785186386],
    [118.7064110986318, 32.12601973492544, -100.00073617616275]];

let llj = [
    [118.70620453334024, 32.12644358074091, -90.0041790561606],
    [118.70867253103896, 32.12706842005944, -90.0023922960448]];

let szy = [
    [118.70714277663726, 32.12682543455558, -90.0039800608381],
    [118.70709722992534, 32.12590603854019, -89.6897502438756],
    [118.70650028200238, 32.12679939832155, -90.003833749161]];

let ylj = [
    [118.70642276397463, 32.126260306423006, -91.20048864186852],
    [118.70852974865129, 32.126825425213276, -90.0015229390594]];

let entity = [[], [], [], [], []];
let entityWeb = [[], [], [], [], []];
let dealed = [];
let dealIng = [];
let noDeal = [];
let allData = [];
let removeE;
let curlon = undefined
let curlat = undefined
let palaceTileset;
// 当前时间戳
let requestTs = (new Date()).valueOf();
let appId = '728bda9fb4af4203b2913a853e7540e4';
let secret = 'axpN687MW0a45093ftYr';
// 加密
let code = sha256(md5(appId + requestTs + secret));
// 获取token的参数
let axiosToken = {
    url: 'http://36.152.21.206:30080/openapi/1.0/appAccess/getAccessToken',
    data: {
        "appId": "728bda9fb4af4203b2913a853e7540e4",
        "requestTs": requestTs,
        "code": code,
    }
}
// 获取告警列表数据
let axiosData1 = {
    url: 'http://36.152.21.206:30080/openapi/1.0/threeDimensional/getAlarmLog/728bda9fb4af4203b2913a853e7540e4',
    data: {
        "dateTime": [],
        "deviceId": "",
        "page": 1,
        "productId": "",
        "size": 90,
        "status": "",
    },
}
// 获取设备统计列表数据
let axiosData2 = 'http://36.152.21.206:30080/openapi/1.0/threeDimensional/getDeviceStatis/728bda9fb4af4203b2913a853e7540e4';
// 获取温度数据
let axiosData3 = 'http://36.152.21.206:30080/openapi/1.0/dataAnalysis/getDetail/1614470294566821890';
// 获取设备网络状态数据
let axiosData4 = 'http://36.152.21.206:30080/openapi/1.0/threeDimensional/getDeviceOnline/728bda9fb4af4203b2913a853e7540e4';
// 分别获取摄氏度和华氏度数据
let temperature1 = {
    url: 'http://36.152.21.206:30080/openapi/1.0/dataAnalysis/getChartData',
    data: {
        "dateTime": ["2023-02-20T16:00:00.000Z", "2023-02-21T02:55:58.639Z"],
        "deviceIds": [
            "542de401e5914994b5dd830ea2347813",
            "e258b1b049e140ef8dbc62047e51e510",
            "1b88f38ff4bb4d4893f5cb3c0908ee92",
            "888eb08228444020b7f0b6dffc0206ca",
            "5550fa5f19254956a1030b1be6b6a310",
            "6bdfb2a0f7864100bbd061deca3f3915",
            "22cd9fb4765542c4b8313c674e83bf19",
            "953d00eb95e0421ea915ead66f15f546"
        ],
        "propertyIds": [
            "4c412515d01d4b52b51539cbc7148cec", "ef12c58604e74e5f9f63698c9e1edb5c"
        ],
        "timeType": "按小时"
    },
};
let temperature2 = {
    url: temperature1.url,
    data: {
        "dateTime": ["2023-02-20T16:00:00.000Z", "2023-02-21T02:55:58.639Z"],
        "deviceIds": [
            "542de401e5914994b5dd830ea2347813",
            "e258b1b049e140ef8dbc62047e51e510",
            "1b88f38ff4bb4d4893f5cb3c0908ee92",
            "888eb08228444020b7f0b6dffc0206ca",
            "5550fa5f19254956a1030b1be6b6a310",
            "6bdfb2a0f7864100bbd061deca3f3915",
            "22cd9fb4765542c4b8313c674e83bf19",
            "953d00eb95e0421ea915ead66f15f546"
        ],
        "propertyIds": [
            "4c412515d01d4b52b51539cbc7148cec", "ef12c58604e74e5f9f63698c9e1edb5c"
        ],
        "timeType": "按小时"
    },
};
import { inject } from 'vue';
export default ({
    name: 'myView',
    components: {},
    props: {},
    data() {
        return {
            click1: 1,
            click3: [5, 5, 5, 5, 5],
            click4: [2, 2],
            buttonAnalysis: false,
            cadPopover: false,
            eqPopover: false,
            warnPopover: false,
            item1: ['全部', '未处理', '处理中', "已完成"],
            item2: ['智能井盖', '液位计', '流量计', "水质仪", "雨量计"],
            item3: ['在线', '离线'],
            num1: 0,
            data: [],
            dataNum: [],
            classes:[
                {class:'rightBottomItem1'},
                {class:'rightBottomItem2'},
                {class:'rightBottomItem3'},
                {class:'rightBottomItem4'},
                {class:'rightBottomItem5'},
        ],
            eqSum: [],
            eqName: [],
            onLine: '',
            outLine: '',
            tempF: [],
            timeF: [],
            tempC: [],
            timeC: [],
            myPopup: [{ id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
            ],
            znjg1: [[
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
            ], [
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '离线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '离线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '离线' },
            ], [
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '离线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '离线' },
            ], [
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
            ], [
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
                { id: 'JG001', category: '智能井盖', time: '2023-03-02 10:00:00', data: '1m³/d', state: '在线' },
            ]]

        }
    },
    mounted() {
        this.map = inject("map");
        Parameter.viewer = this.map;
        Parameter.billboardWidth = 20;
        Parameter.billboardHeight = 25;
        Parameter.elevation = 0;
        removeE = new removeEntity();
        palaceTileset = myTiles.loadBIMTilesetLayer({
            url: ModelInfo.DIXIAGUANXIAN,
            maximumScreenSpaceError: 16,
            lat: 32.148,
            lng: 118.728,
            alt: -100,
            show: true,
        })._tileset;
        this.map.scene.primitives.add(palaceTileset);
        let token = http.post(axiosToken.url, axiosToken.data).then((value) => {
            tool.cookie.set('mytoken', 'bearer ' + value.data.token)
        });
        // 获取登录token
        token.then(() => {
            // 获取告警列表数据
            http.post(axiosData1.url, axiosData1.data).then((value) => {
                let newValue = getData1(value.data.records);
                dealed = newValue.eqDone;
                noDeal = newValue.eqNodo;
                dealIng = newValue.eqDoing;
                this.addData();
            });
            // 获取设备统计列表数据
            http.get(axiosData2).then((value) => {
                let Ol = Object.keys(value.data);
                for (let i = 0; i < Ol.length; i++) {
                    this.eqName[i] = Ol[i];
                    this.eqSum[i] = Object.values(value.data)[i];
                }
            });
            // 获取温度数据
            let pro = http.get(axiosData3).then((value) => {
                temperature1.data.propertyIds = value.data.propertys[0];
                temperature1.data.deviceIds = value.data.deviceId;
                temperature2.data.propertyIds = value.data.propertys[1];
                temperature2.data.deviceIds = value.data.deviceId;
            });
            pro.then(
                http.post(temperature1.url, temperature1.data).then((value) => {
                    let a = value.data.chartLine.times;
                    let b = value.data.chartLine.data[0].data;
                    for (let i = 0; i < 8; i++) {
                        this.timeF[i] = a[i].substring(11, 13) + '点';
                        this.tempF[i] = b[i];
                    }
                    getEchartline2(this.timeF, this.tempF, this.$refs.chartTop);
                }),
                http.post(temperature2.url, temperature2.data).then((value) => {
                    let a = value.data.chartLine.times;
                    let b = value.data.chartLine.data[1].data;
                    for (let i = 0; i < 8; i++) {
                        this.timeC[i] = a[i].substring(11, 13) + '点';
                        this.tempC[i] = b[i];
                    }
                    getEchartline1(this.timeC, this.tempC, this.$refs.chartCenter);
                }),
            );
            // 获取设备网络状态数据
            http.get(axiosData4).then((value) => {
                this.onLine = value.data.online;
                this.outLine = value.data.offline;
                let sd = [{ name: '在线', value: this.onLine, itemStyle: { color: '#13cdff' } },
                { name: '离线', value: this.outLine, itemStyle: { color: '#33ffcc' } },];
                getEchartGl(sd, 1, this.$refs.chartBottom);
            });
        })
    },
    methods: {
        // 添加设备点数据
        addData() {
            allData.push(...dealed);
            allData.push(...dealIng);
            allData.push(...noDeal);
            this.dataNum = [allData.length, noDeal.length, dealIng.length, dealed.length];
            this.data = [allData, noDeal, dealIng, dealed];
            this.popup();
        },
        // 告警切换方法
        changes1(key) {
            this.num1 = key;
        },
        // 点击设备弹窗方法
        popup() {
            let that = this;
            const handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
            handler.setInputAction(function (movement) {
                const pickedObject = that.map.scene.pick(movement.position);
                if (Cesium.defined(pickedObject)) {
                    if (pickedObject.id == undefined) {
                        that.closePopup()
                        curlon = undefined
                        curlat = undefined
                    } else {
                        for (let i = 0; i < entity.length; i++) {
                            for (let j = 0; j < entity[i].length; j++) {
                                if (entity[i][j]._id === pickedObject.id._id) {
                                    that.myPopup = that.znjg1[i][j];
                                    // 世界坐标转换为弧度
                                    let ellipsoid = that.map.scene.globe.ellipsoid;
                                    let cartographic = ellipsoid.cartesianToCartographic(entity[i][j]._position._value);
                                    // 弧度转换为经纬度
                                    let lng = Cesium.Math.toDegrees(cartographic.longitude);  // 经度
                                    let lat = Cesium.Math.toDegrees(cartographic.latitude);   // 纬度
                                    let alt = cartographic.height;	// 高度
                                    var obj = {
                                        lng: lng,
                                        lat: lat,
                                        height: alt
                                    };
                                    // 再次点击图标关闭弹窗
                                    if (curlon === lng && curlat === lat) {
                                        console.log('关闭弹窗')
                                        that.closePopup()
                                        curlon = undefined
                                        curlat = undefined
                                        // 第一次点击图标打开弹窗
                                    } else {
                                        that.addPopup(obj);
                                        curlon = lng
                                        curlat = lat
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    that.closePopup()
                    curlon = undefined;
                    curlat = undefined;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        addPopup(obj) {
            let that = this
            let popupHtml = document.getElementById("tooltip-view");
            popupHtml.style.display = "block";
            let result = new Cesium.Cartesian2();
            this.map.scene.preRender.addEventListener(function () {
                // 经纬度坐标-笛卡尔-屏幕坐标系
                let position = Cesium.Cartesian3.fromDegrees(obj.lng, obj.lat, obj.height);
                let canvasPosition = that.map.scene.cartesianToCanvasCoordinates(
                    position,
                    result
                );
                if (Cesium.defined(canvasPosition)) {
                    popupHtml.style.position = "fixed"
                    popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight - 30 + "px";
                    popupHtml.style.left = canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
                }
            });
        },
        closePopup() {
            let popupHtml = document.getElementById("tooltip-view");
            popupHtml.style.display = 'none';
        },
        // 设备列表点击方法
        changes2(key) {
            this.click3[key] = key;
            if (eqKey[key] == key) {
                keyNum1[key]++;
            }
            // 第一次点击的时候显示poi点
            if (keyNum1[key] == 1) {
                switch (key) {
                    case 0:
                        for (let i = 0; i < znjg.length; i++) {
                            entity[0].push(darwBillBoard(Parameter, ...znjg[i], 'bt_jg.png'));
                        }
                        break;
                    case 1:
                        for (let i = 0; i < ywj.length; i++) {
                            entity[1].push(darwBillBoard(Parameter, ...ywj[i], 'bt_ywj.png'));
                        }
                        break;
                    case 2:
                        for (let i = 0; i < llj.length; i++) {
                            entity[2].push(darwBillBoard(Parameter, ...llj[i], 'bt_llj.png'));
                        }
                        break;
                    case 3:
                        for (let i = 0; i < szy.length; i++) {
                            entity[3].push(darwBillBoard(Parameter, ...szy[i], 'bt_szy.png'));
                        }
                        break;
                    case 4:
                        for (let i = 0; i < ylj.length; i++) {
                            entity[4].push(darwBillBoard(Parameter, ...ylj[i], 'bt_ylj.png'));
                        }
                        break;
                }
            }
            // 第二次点击的时候取消poi点的显示
            if (keyNum1[key] == 2) {
                this.click3[key] = -1;
                keyNum1[key] = 0;
                switch (key) {
                    case 0:
                        for (let i = 0; i < entity[0].length; i++) {
                            removeE.removeByObj(this.map, entity[0][i]);
                        }
                        entity[0] = [];
                        break;
                    case 1:
                        for (let i = 0; i < entity[1].length; i++) {
                            removeE.removeByObj(this.map, entity[1][i]);
                        }
                        entity[1] = [];
                        break;
                    case 2:
                        for (let i = 0; i < entity[2].length; i++) {
                            removeE.removeByObj(this.map, entity[2][i]);
                        }
                        entity[2] = [];
                        break;
                    case 3:
                        for (let i = 0; i < entity[3].length; i++) {
                            removeE.removeByObj(this.map, entity[3][i]);
                        }
                        entity[3] = [];
                        break;
                    case 4:
                        for (let i = 0; i < entity[4].length; i++) {
                            removeE.removeByObj(this.map, entity[4][i]);
                        }
                        entity[4] = [];
                        break;
                }
            }
        },
        // 离线/在线设备点击方法
        changes3(key, name) {
            this.click4[key] = key;
            if (warnKey[key] == key) {
                keyNum2[key]++;
            }
            // 第一次点击的时候显示poi点
            if (keyNum2[key] == 1) {
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < entity[i].length; j++) {
                        removeE.removeByObj(this.map, entity[i][j]);
                    }
                }
                if (name == '在线') {
                    for (let i = 0; i < ywj.length; i++) {
                        entityWeb[1].push(darwBillBoard(Parameter, ...ywj[i], 'bt_ywj.png'));
                    }
                    for (let i = 0; i < llj.length; i++) {
                        entityWeb[2].push(darwBillBoard(Parameter, ...llj[i], 'bt_llj.png'));
                    }
                    for (let i = 0; i < szy.length; i++) {
                        entityWeb[3].push(darwBillBoard(Parameter, ...szy[i], 'bt_szy.png'));
                    }
                }
                if (name == '离线') {
                    for (let i = 0; i < ylj.length; i++) {
                        entityWeb[4].push(darwBillBoard(Parameter, ...ylj[i], 'bt_ylj.png'));
                    }
                    for (let i = 0; i < znjg.length; i++) {
                        entityWeb[0].push(darwBillBoard(Parameter, ...znjg[i], 'bt_jg.png'));
                    }
                };
            };
            if (keyNum2[key] == 2) {
                this.click4[key] = -1;
                keyNum2[key] = 0;
                if (name == '在线') {
                    for (let i = 0; i < entityWeb[1].length; i++) {
                        removeE.removeByObj(this.map, entityWeb[1][i]);
                    }
                    for (let i = 0; i < entityWeb[2].length; i++) {
                        removeE.removeByObj(this.map, entityWeb[2][i]);
                    }
                    for (let i = 0; i < entityWeb[3].length; i++) {
                        removeE.removeByObj(this.map, entityWeb[3][i]);
                    }
                    entityWeb[1] = [];
                    entityWeb[2] = [];
                    entityWeb[3] = [];
                }
                if (name == '离线') {
                    for (let i = 0; i < entityWeb[4].length; i++) {
                        removeE.removeByObj(this.map, entityWeb[4][i]);
                    }
                    for (let i = 0; i < entityWeb[0].length; i++) {
                        removeE.removeByObj(this.map, entityWeb[0][i]);
                    }
                    entityWeb[0] = [];
                    entityWeb[4] = [];
                };
            }
        },
        // 警告按钮
        showEquipment() {
            this.eqPopover = !this.eqPopover;
        },
        // 设备按钮
        showWarn() {
            this.warnPopover = !this.warnPopover;
        },
    },
    watch: {
        cadPopover(newval) {
            newval ? palaceTileset.show = true : palaceTileset.show = false
        }
    }
})
</script>
<style scoped>
@import '@/views/speed/pipeline/myView.css'
</style>