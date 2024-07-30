<template>
  <teleport to="body">
    <div id="boxx" v-show="hasMove" :style="{ left: floatLeft + 'px', top: floatTop + 'px' }">
      <p>{{ Math.round(distanceSum) }}米</p>
    </div>
  </teleport>
  <div id="AnalysisLeft1" v-show="myAnalysis == 1">
    <div class="myCancel" @click="(myAnalysis = 0), (floodSelected = false)"></div>
    <br />
    <p @click="submerge()">淹没分析：</p>
    <div class="hzym" @click="drowFloodArea"></div>
    <br />
    <p>参数设置：</p>
    <div style="margin-left: 25px">
      <p>最大高度：</p>
      <input type="text" v-model="maxHeight" />
      <p style="margin-left: 0px">(m)</p>
      <br />
      <p>淹没速度：</p>
      <input type="text" v-model="foolSpeed" />
      <p style="margin-left: 0px">(m/s)</p>
      <br />
      <p>推演时间：</p>
      <input type="text" v-model="deduceTime" />
      <p style="margin-left: 0px">(s)</p>
      <br />
    </div>
    <div class="AnalysisFoot">
      <button type="button" @click="startFlood" class="start"></button>
      <button type="button" @click="pauseFlood" class="stop"></button>
      <button type="button" @click="clearFlood" class="clean"></button>
    </div>
  </div>
  <div id="AnalysisLeft2" v-show="myAnalysis == 2">
    <div class="myCancel" @click="(myAnalysis = 0), (digSelected = false)"></div>
    <br />
    <p @click="submerge">开挖分析：</p>
    <div class="hzka" @click="drawTerrainExcavation"></div>
    <br />
    <p>参数设置：</p>
    <div style="margin-left: 25px">
      <p>开挖深度：</p>
      <input type="text" v-model="topHeight" />
      <p style="margin-left: 0px">(m)</p>
      <br />
    </div>
    <div class="AnalysisFoot">
      <button type="button" @click="startTerrainExcavation" class="start"></button>
      <button type="button" @click="clearTerrainExcavation" class="clean"></button>
    </div>
  </div>
  <div class="gncd" @click="rightShow = !rightShow"></div>
  <div id="AnalysisRight" v-show="rightShow">
    <div class="usually">
      <div>
        <button type="button" @click="drawPoint()"
          :class="{ drawPoint: !pointSelected, drawPoint1: pointSelected }"></button>
        <h5>点</h5>
      </div>
      <div>
        <button type="button" @click="drawLine()" :class="{ drawLine: !lineSelected, drawLine1: lineSelected }"></button>
        <h5>线</h5>
      </div>
      <div>
        <button type="button" @click="drawPolygon()"
          :class="{ drawM: !polygonSelected, drawM1: polygonSelected }"></button>
        <h5>面</h5>
      </div>
      <div>
        <button type="button" @click="(clickNum = '移除Entity'), (dxmSelected = 0)" class="uClean"></button>
        <h5>清除</h5>
      </div>
    </div>
    <div class="location">
      <div>
        <button type="button" @click="upMode(), (downUpSelected = 1)"
          :class="{ upMode: downUpSelected != 1, upMode1: downUpSelected == 1 }"></button>
        <h5>地上模式</h5>
      </div>
      <div>
        <button type="button" @click="downMode(), (downUpSelected = 2)"
          :class="{ downMode: downUpSelected != 2, downMode1: downUpSelected == 2 }"></button>
        <h5>地下模式</h5>
      </div>
    </div>
    <div class="myAnalysis">
      <div>
        <button type="button" @click="rzfx" :class="{ rzfx: !sunShowSelected, rzfx1: sunShowSelected }"></button>
        <h5>日照分析</h5>
      </div>
      <div>
        <button type="button" @click="ymfx" :class="{ ymfx: !floodSelected, ymfx1: floodSelected }"></button>
        <h5>淹没分析</h5>
      </div>
      <div>
        <button type="button" @click="kwfx()" :class="{ kwfx: !digSelected, kwfx1: digSelected }"></button>
        <h5>开挖分析</h5>
      </div>
    </div>
  </div>
  <timeSelected v-show="sunShowSelected"></timeSelected>
</template>
<script>
import * as Cesium from "cesium";
import { inject } from "vue";
import Parameter from "@/cesiumSDK/core/entityJS/defaultData";
import terrainModelClick from "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick";
import removeEntity from "@/cesiumSDK/core/entityJS/removeEntity";
import timeSelected from "@/views/speed/pipeline/timeSelect.vue";
import { darwPoint, drawPolyline, drawPolygon } from "@/cesiumSDK/core/entityJS/draw";
import * as Speed from "@/cesiumSDK/index";
let allEntity = [];
let removeE = new removeEntity();
let getTime1 = '';
let getTime2 = '';
export default {
  name: "ktmap",
  components: {
		timeSelected
	},
  data() {
    return {
      clickNum: "",
      clickWayNum: "entity",
      hasMove: false,
      distanceSum: 0,
      distance: 0,
      isShow: true,
      floatLeft: 0,
      floatTop: 0,
      myAnalysis: 0,
      sunAnalyst: false,
      rightShow: false,
      maxHeight: 200,
      foolSpeed: 5,
      deduceTime: 40,
      topHeight: 200,
      buttomHeight: "",
      digSpeed: "",
      pointSelected: false,
      lineSelected: false,
      polygonSelected: false,
      downUpSelected: 0,
      dxmSelected: 0,
      sunShowSelected: false,
      floodSelected: false,
      digSelected: false,
    };
  },
  created() { },
  mounted() {
    this.map = inject("map");
    this.tmClick = new terrainModelClick(this.map);
    this.loadWill();
    this.sun=new Speed.SunShadows(this.map);
  },

  methods: {
    // 绘制点
    drawPoint() {
      this.pointSelected = !this.pointSelected;
      // 取消常用功能鼠标点击事件
      this.tmClick.remove(terrainModelClick.EventType.LEFT_CLICK);
      this.clickNum = null;
      if (this.pointSelected) {
        this.clickNum = "点";
        this.lineSelected = false;
        this.polygonSelected = false;
      }
    },
    // 绘制线
    drawLine() {
      this.lineSelected = !this.lineSelected;
      // 取消常用功能鼠标点击事件
      this.tmClick.remove(terrainModelClick.EventType.LEFT_CLICK);
      this.clickNum = null;
      if (this.lineSelected) {
        this.clickNum = "线";
        this.pointSelected = false;
        this.polygonSelected = false;
      }
    },
    // 绘制面
    drawPolygon() {
      this.polygonSelected = !this.polygonSelected;
      // 取消常用功能鼠标点击事件
      this.tmClick.remove(terrainModelClick.EventType.LEFT_CLICK);
      this.clickNum = null;
      if (this.polygonSelected) {
        this.clickNum = "面";
        this.lineSelected = false;
        this.pointSelected = false;
      }
    },

    // 开始日照分析
    rzfx() {
      this.sunShowSelected = !this.sunShowSelected;
      this.sunAnalyst = !this.sunAnalyst;
      // if(!this.sunShowSelected){
      //   this.sun.clearOpenLight();
      // }
    },

    // 开始淹没分析
    ymfx() {
      this.floodSelected = !this.floodSelected;
      this.digSelected = false;
      if (this.floodSelected) {
        this.myAnalysis = 1;
      } else {
        this.myAnalysis = 0;
      }
    },
    // 开始开挖分析
    kwfx() {
      this.digSelected = !this.digSelected;
      this.floodSelected = false;
      if (this.digSelected) {
        this.myAnalysis = 2;
      } else {
        this.myAnalysis = 0;
      }
    },
    // 开启地下模式
    downMode() {
      new Speed.underground(this.map).openUnderground({ alphaVal: 0.5 });
    },
    // 关闭地下模式
    upMode() {
      new Speed.underground(this.map).closeUnderground();
    },
    // 鼠标绘制事件
    leftClickMethods(drawWay, drawKind) {
      // 存储每条线段的临时距离
      let distancetemp = 0;
      // 存储累计绘制直线距离
      let id = 0;
      let LineEntityId = 0;
      // 收集经纬度和高程坐标
      let clickPointH = [];
      let distanceSon = [];
      let clickPosition1;
      let clickPosition2;
      let cs = {};
      let that = this;
      window.addEventListener("mousemove", function (e) {
        that.floatLeft = e.pageX + 10;
        that.floatTop = e.pageY - 30;
        // 解决不同浏览器可视区域参数不统一的问题
        let width =
          e.view.innerWidth > e.view.outerWidth ? e.view.innerWidth : e.view.outerWidth;
        if (e.pageX > width - 100) {
          that.floatLeft = width - 100;
        }
        if (e.pageY < 20) {
          that.floatTop = e.pageY;
        }
        if (e.pageY > e.view.outerHeight - 10) {
          that.floatTop = e.view.outerHeight - 20;
        }
      });
      let viewer = this.map;

      Parameter.viewer = viewer;
      // 注册鼠标左键点击事件
      this.tmClick.click(terrainModelClick.EventType.LEFT_CLICK, (p) => {
        clickPointH.push(p.x, p.y, p.z);
        if (drawKind === "线" && drawWay === "entity" && drawWay === "entity") {
          LineEntityId++;
        } else {
          id++;
        }
        if (drawKind != "点") {
          // 注册鼠标移动事件
          that.tmClick.click(terrainModelClick.EventType.MOUSE_MOVE, (p1) => {
            // 坐标显示窗口打开
            that.hasMove = true;
            clickPosition1 = Cesium.Cartesian3.fromDegrees(p.x, p.y, p.z);
            clickPosition2 = Cesium.Cartesian3.fromDegrees(p1.x, p1.y, p1.z);
            // 计算两个点之间的距离
            distancetemp = Cesium.Cartesian3.distance(clickPosition1, clickPosition2);
            that.distanceSum = distancetemp + that.distance;
            // 删除上一次绘制的直线
            viewer.entities.removeById("直线" + id);
            if (drawKind) {
              cs = {
                // 直线
                polylinePointArray: [p.x, p.y, p.z, p1.x, p1.y, p1.z],
                i: true,
                id: "直线" + id,
              };
            }

            if (drawKind === "线" && drawWay === "entity") {
              viewer.entities.removeById("entity线" + LineEntityId);
              cs.id = "entity线" + LineEntityId;
              cs.i = false;
            }
            allEntity.push(drawPolyline(Parameter, cs));
          });
          // 存储累计距离
          that.distance = that.distanceSum;
          // 存储线段距离到数组中
          distanceSon.push(distancetemp);
          // 注册鼠标左键双击事件
          that.tmClick.click(terrainModelClick.EventType.LEFT_DOUBLE_CLICK, () => {
            // 取消鼠标浮动事件
            that.tmClick.remove(terrainModelClick.EventType.MOUSE_MOVE);
            that.otherSet();
            // 单击事件中id加了两次，为此要减去两次
            id -= 2;
            // 移除最后一个坐标
            clickPointH.splice(clickPointH.length - 3, 3);
            // 移除前后两个距离
            distanceSon.pop();
            distanceSon.shift();
            // 获取坐标
            Parameter.clickPointH = clickPointH;
            Parameter.radius = distanceSon[0];
            switch (drawKind) {
              case "面":
                allEntity.push(drawPolygon(Parameter));
                that.removeLine(id);
                break;
            }
            // 绘制完成之后情况坐标数组
            clickPointH = [];
            distanceSon = [];
          });
        } else if (drawKind === "点") {
          allEntity.push(darwPoint(Parameter, p.x, p.y, p.z));
          clickPointH = [];
        }
      });
    },
    otherSet() {
      // 坐标显示窗口关闭
      this.hasMove = false;
      // 完成绘制后距离清空
      this.distance = 0;
      this.distanceSum = 0;
    },
    removeLine(id) {
      // 去除全部的路径直线
      for (let i = 0; i <= id; i++) {
        this.map.entities.removeById("直线" + i);
      }
    },

    // 绘制填挖方区域
    drawTerrainExcavation() {
      // 实例化手绘工具

      // 清空
      this.clearTerrainExcavation();

      this.drawHandler = new Speed.DrawHandler(
        { _viewer: this.map },
        { autoFocus: false }
      );
      this.drawHandler.draw(Speed.DrawMode.Polygon, (result) => {
        // 返回值
        this.drawHandlerResult = result.positions;
      });
      // 取消常用功能鼠标点击事件
      this.tmClick.remove(terrainModelClick.EventType.LEFT_CLICK);
    },

    // 清空
    clearTerrainExcavation() {
      this.drawHandler && this.drawHandler.clear();
      this.drawHandler = undefined;

      // 清除
      this.terrainExcavation && this.terrainExcavation.clear();
      this.terrainExcavation = undefined;

      this.myAnalysis = 0;
      this.digSelected = false;
    },

    // 启动分析
    startTerrainExcavation() {
      if (!this.drawHandlerResult || this.drawHandlerResult.length < 3) {
        return;
      }
      // 实例化开挖效果

      this.terrainExcavation = new Speed.TerrainExcavation(
        { _viewer: this.map },
        {
          height: Number(this.topHeight),
          positions: this.drawHandlerResult,
          autoFocus: false,
        }
      );
    },

    // 绘制淹没区
    drowFloodArea() {
      // 实例化手绘工具
      this.drawHandler = new Speed.DrawHandler({ _viewer: this.map });
      this.drawHandler.draw(Speed.DrawMode.Polygon, (result) => {
        // 返回值
        console.info(result);
        this.drawHandlerResult = result.positions;
      });
      // 取消常用功能鼠标点击事件
      this.tmClick.remove(terrainModelClick.EventType.LEFT_CLICK);
    },

    // 启动淹没
    startFlood() {
      // 清空手绘工具图形
      this.drawHandler && this.drawHandler.clear();

      if (!this.drawHandlerResult || this.drawHandlerResult.length < 2) {
        return;
      }
      // 实例化淹没分析
      let floodOption = {
        maxHeight: this.maxHeight || 200,
        speed: this.foolSpeed || 5,
        time: this.deduceTime || 10,
        positions: this.drawHandlerResult,
        water: {
          frequency: 1000.0,
          animationSpeed: 0.01,
          amplitude: 10,
          baseWaterColor: "rgba(43,136,252,0.4)",
          specularIntensity: 0.9,
        },
      };
      this.flood = new Speed.Flood({ _viewer: this.map }, floodOption);

      // 开始淹没分析
      this.flood.start();
    },

    // 暂停淹没
    pauseFlood() {
      if (!this.flood) {
        return;
      }
      //获取当前状态
      let status = this.flood.getPauseState();
      // 设置状态
      this.flood.pause(!status);
      //this.starClearBtn[1].name = !status ? "暂停" : "继续";
    },

    // 清空淹没
    clearFlood() {
      // 清空手绘工具图形
      this.drawHandler && this.drawHandler.clear();
      // 开始淹没分析
      this.flood && this.flood.clear();
      this.myAnalysis = 0;
      this.floodSelected = false;
    },

    // 定制
    loadWill() {
      let arr = [
        { x: -2596780.998851807, y: 4742084.509087185, z: 3372438.8695849897 },
        { x: -2596864.346695576, y: 4742242.2412681, z: 3372154.7975951144 },
        { x: -2597187.1253169924, y: 4742066.269108077, z: 3372153.6849612542 },
        { x: -2597085.573042451, y: 4741912.188668826, z: 3372446.5817984124 },
        { x: -2596780.998851807, y: 4742084.509087185, z: 3372438.8695849897 },
      ];

      this.terrainExcavation = new Speed.TerrainExcavation(
        { _viewer: this.map },
        {
          height: 200,
          positions: arr,
          autoFocus: false,
        }
      );
    },
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
  computed: {
    // 用于同时监听多个响应式数据
    dataChange() {
      const { clickWayNum, clickNum } = this;
      return { clickWayNum, clickNum };
    },
  },
  watch: {
    dataChange: {
      handler(newval) {
        if (newval.clickNum != null && newval.clickNum != "移除Entity") {
          this.leftClickMethods(newval.clickWayNum, newval.clickNum);
        }
        if (newval.clickNum === "移除Entity") {
          // 清除所有绘制的对象
          for (let i = 0; i < allEntity.length; i++) {
            removeE.removeByObj(this.map, allEntity[i]);
          }
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
#boxx {
  height: 15px;
  width: fit-content;
  background-color: rgb(14, 231, 213);
  position: absolute;
}

@import "@/views/speed/pipeline/myAnalysis.css";
</style>
