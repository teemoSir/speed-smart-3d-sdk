<template>
  <div id="AnalysisLeft3" v-show="sunShow">
    <div class="myCancel" @click="sunClose"></div>
    <p>日期选择:</p>
    <el-date-picker v-model="dateTime1" type="datetime" format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s"
      placeholder="开始时间" size="small" class="mystartTime" @change="setFirstTime">
    </el-date-picker>
    <el-date-picker v-model="dateTime2" type="datetime" format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s"
      placeholder="结束时间" size="small" class="myendTime">
    </el-date-picker>
    <br />
    <p>时间选择:</p>
    <el-slider v-model="setSelectDate" :min="0" :max="10" class="myslider" :show-tooltip="false" show-stops>
    </el-slider>
    <p>透明度选择:</p>
    <el-slider v-model="darkness" :min="0" :max="1" step=0.1 class="myslider" :show-tooltip="false" show-stops>
    </el-slider>
    <p style="font-size: larger;">当前时间: {{ newNowDate1 }}</p>
    <div class="AnalysisFoot">
      <button type="button" class="start" @click="play"></button>
      <button type="button" class="clean" @click="stopPlay"></button>
    </div>
  </div>
</template>

<script>
import * as Speed from "@/cesiumSDK/index";
import { inject } from "vue";
let getTime1 = '';
let getTime2 = '';
export default ({
  name: 'timeSelected',
  components: {},
  props: {},
  data() {
    return {
      dateTime1: "",
      dateTime2: "",
      setSelectDate: "",
      newNowDate: "",
      newNowDate1: "",
      max: '',
      min: '',
      darkness: '',
      sunShow: false,
    }
  },
  mounted() {
    this.map = inject("map");
    this.sun = new Speed.SunShadows(this.map);
  },
  methods: {
    // 开始日照分析
    setFirstTime() {
      this.newNowDate = new Date(this.dateTime1);
      this.newNowDate1 = this.timeFormat(this.newNowDate);
    },
    play() {
      if (this.dateTime1 == '' || this.dateTime2 == '') {
        window.alert("请输入开始和结束时间！");
      } else {
        let parameter = {
          startTime: this.newNowDate,
          stopTime: new Date(this.dateTime2),
          darkness: this.darkness
        }
        this.sun.startShadows(parameter);
      }
    },
    stopPlay() {
      this.sun.clearOpenLight();
    },
    // sunClose() {
    // 关闭日照分析功能和按钮
    // this.sun.clearOpenLight();
    // this.sunShow = false;
    // console.log(this.sunShow)
    // 时间清空
    // this.dateTime1 = '';
    // this.dateTime2 = '';
    // this.newNowDate1 = '';
    // },
    timeFormat(time) {
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = time.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = time.getHours();
      h = h < 10 ? ('0' + h) : h;
      let minute = time.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      let second = time.getSeconds();
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
  },
  watch: {
    setSelectDate(newval) {
      getTime1 = new Date(this.dateTime1).getTime();
      getTime2 = new Date(this.dateTime2).getTime();
      this.newNowDate = new Date((getTime2 - getTime1) * newval / 10 + getTime1);
      this.newNowDate1 = this.timeFormat(this.newNowDate);
    },
    darkness(newval) {
      this.darkness = newval;
    }
  },
})
</script>

<style >
#AnalysisLeft3 .myCancel {
  width: 5%;
  height: 5%;
  margin-top: 5%;
  margin-left: 90%;
  background: none !important;
  background-size: 100% 100%;
}

#AnalysisLeft3 {
  width: 18%;
  height: 38%;
  top: 15%;
  margin-left: 0%;
  position: absolute;
  z-index: 200;
  background: url("@/assets/speed/communityPNG/rzfx.png") no-repeat center center;
  background-size: 100% 100%;
}

#AnalysisLeft3 p {
  color: aliceblue;
  font-size: 10px;
  margin-left: 30px;
  line-height: 45px;
  display: inline;
}

.mystartTime {
  width: 10px;
  margin-left: 10%;
  position: relative;
  z-index: 200;
  display: block;
}

.myendTime {
  width: 10px;
  top: 5%;
  margin-left: 10%;
  position: relative;
  display: block;
  z-index: 200;
}

.el-date-editor {
  --el-date-editor-width: 150px;
}

.myslider {
  width: 200px;
  margin-top: -3%;
  margin-left: 12%;
  position: relative;
  z-index: 200;
}

#AnalysisLeft3 .AnalysisFoot {
  margin-top: -5%;
}

#AnalysisLeft3 .clean {
  background: url("@/assets/speed/communityPNG/bt_qc.png") no-repeat center center;
  background-size: 100% 100%;
  margin-left: 5%;
  margin-top: 5%;
}

#AnalysisLeft3 .start {
  margin-right: 5%;
}
</style>