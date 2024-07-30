<template>
    <div class="bg">
    </div>
    <div id="planningLeft">
        <div class="line"></div>
        <div class="allZone">
            <div v-for="(val, index) in zoneName" :class="{ zone: zoneShow != index, zone1: zoneShow == index }"
                @click="showZone(val, index)">
                <p>{{ val }}</p>
            </div>
        </div>
    </div>
    <div id="planningRight">
        <div @click="moveDiv = !moveDiv" :class="{ switch: !moveDiv, switch1: moveDiv }"></div>
        <div class="title">
            <p style="color:#0dffff; font-size:20px ;font-weight: bolder;text-align: center;padding-top: 3%;">
                南京市{{ zoneTitle }}城市规划图</p>
        </div>
        <div :class="{
            smallMap1: zoneShow == 0,
            smallMap2: zoneShow == 1,
            smallMap3: zoneShow == 2,
            smallMap4: zoneShow == 3,
            smallMap5: zoneShow == 4,
            smallMap6: zoneShow == 5,
            smallMap7: zoneShow == 6,
            smallMap8: zoneShow == 7,
            smallMap9: zoneShow == 8,
            smallMap10: zoneShow == 9,
            smallMap11: zoneShow == 10,
            smallMap12: zoneShow == 11,
        }"></div>
        <div class="legendTitle"></div>
        <div class="legend">
            <div class="div1">
                <div v-for="(val, index) in legend1">
                    <button :style="{ backgroundColor: val.color }">
                    </button>
                    <button class="myB">{{ val.name }}
                    </button>
                </div>
            </div>
            <div class="div1">
                <div v-for="(val, index) in legend1">
                    <button :style="{ backgroundColor: val.color }">
                    </button>
                    <button class="myB">{{ val.name }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
let div;
let longth;
let r;
let g;
let b;
export default ({
    name: 'planning',
    components: {},
    props: {},
    data() {
        return {
            zoneShow: 0,
            zoneName: ['玄武区', '秦淮区', '建邺区', '鼓楼区', '栖霞区', '雨花台区', '江宁区', '浦口区', '六合区', '溧水区', '高淳区'],
            moveDiv: false,
            zoneTitle: '玄武区',
            legend1: [{ name: '1234567', color: '' },
            { name: '12345678', color: '' },
            { name: "asdfdgdf", color: '' },
            { name: "公路", color: '' },
            { name: '12343243', color: '' },
            { name: '1234', color: '' },
            { name: '1234', color: '' },
            { name: '1234', color: '' },
            { name: '1234', color: '' },
            { name: '1234', color: '' },
            { name: '1234', color: '' },
            ]
        }
    },
    mounted() {
        div = document.getElementById('planningRight');
        longth = window.innerWidth * 0.21;
        this.color();
    },
    methods: {
        // 显示南京直辖区地图
        showZone(val, index) {
            this.zoneShow = index;
            this.zoneTitle = val;
            switch (val) {
                case '玄武区':

                    break;
                case '秦淮区':

                    break;
                case '建邺区':

                    break;
                case '鼓楼区':

                    break;
                case '栖霞区':

                    break;
                case '雨花台区':

                    break;
                case '江宁区':

                    break;
                case '六合区':

                    break;
                case '溧水区':

                    break;
                case '高淳区':

                    break;
            }
        },
        color() {
            for (let i = 0; i < this.legend1.length; i++) {
                r = Math.floor(Math.random() * 255);
                g = Math.floor(Math.random() * 255);
                b = Math.floor(Math.random() * 255);
                this.legend1[i].color = 'rgba(' + r + ',' + g + ',' + b + ',1)';
            }
        }
    },
    watch: {
        moveDiv(newVal) {
            newVal ? div.style.marginRight = -longth + 'px' : div.style.marginRight = 0 + 'px';
        }
    }
})
</script>
<style scoped>
@import './planning.css';
</style>
  
  