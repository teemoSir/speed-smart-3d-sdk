<template>
  <div :id="mapid" class="ktmap">
    <div class="vatool">
      <!--地形切换-->
      <el-row :gutter="10">
        <el-col :span="12" v-for="item in tabBtn" :key="item.id"
          ><div class="grid-content ep-bg-purple" />
          <el-button
            class="tabBtn"
            link
            :class="item.active == active ? 'tabBtnActive' : ''"
            @click="
              active = item.active;
              this.flyTo(item.fun);
            "
            >{{ item.name }}</el-button
          ></el-col
        >
      </el-row>

      <!--标题-->
      <el-row :gutter="10">
        <el-col :span="3"
          ><img src="img/speed3d/ic_ymfx@2x.png" style="width: 45px" alt=""
        /></el-col>
        <el-col :span="21" class="headerText"> 淹没分析</el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24"> <el-form-item label="淹没参数设置"> </el-form-item></el-col>
      </el-row>
      <!--表单-->
      <el-row :gutter="10" v-for="item in form" :key="item.id">
        <el-col :span="18">
          <el-form-item :label="item.name">
            <el-input v-model="item.val" />
          </el-form-item>
        </el-col>
        <el-col :span="6"> <el-form-item :label="item.unit"></el-form-item></el-col>
      </el-row>

      <!--开始，暂停，清空-->
      <el-row :gutter="10">
        <el-col :span="8" v-for="item in starClearBtn" :key="item.id"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn" link :class="item.class" @click="item.fun()">
            <img :src="item.url" style="height: 20px" alt="" />
            {{ item.name }}</el-button
          ></el-col
        >
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="6"></el-col>

        <el-col :span="12"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link>绘制淹没面</el-button></el-col
        >
        <el-col :span="6"></el-col>
      </el-row>

      <!--警告-->
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="background-color: rgba(34, 34, 34, 0)"
      >
        <p>左键开始绘制，左键结束绘制。</p>
      </el-alert>
    </div>
  </div>
</template>

<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import ModelInfo from "@/utils/modelInfo";

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;

export default {
  name: "flood",
  data() {
    return {
      active: 0,
      pauseFlood: true,
      tabBtn: [
        {
          id: 2,
          name: "定位模型",
          active: 0,
          fun: "model",
        },
        {
          id: 1,
          name: "定位山区",
          active: 1,
          fun: "terrain",
        },
      ],
      form: [
        { id: 1, name: "最大高度：", unit: "(m)", val: 200 },
        { id: 2, name: "淹没速度：", unit: "(m/s)", val: 5 },
        { id: 3, name: "推演时间：", unit: "(s)", val: 40 },
      ],
      starClearBtn: [
        {
          id: 1,
          name: "开始",
          class: "cscBtn",
          fun: this.run,
          url: "img/speed3d/ic_ks@2x.png",
        },
        {
          id: 2,
          name: "暂停",
          class: "cscBtn",
          fun: this.run,
          url: "img/speed3d/ic_zt@2x.png",
        },
        {
          id: 3,
          name: "清除",
          class: "cscBtn",
          fun: this.run,
          url: "img/speed3d/ic_qc@2x.png",
        },
      ],
    };
  },
  watch: {},
  created() {
    this.mapid = uuid.v4();
  },
  mounted() {
    this.initMap();
  },
  destroyed() {
    this.speedMap && this.speedMap.destory();
    this.speedMap = undefined;
  },
  methods: {
    initMap() {
      let option = {
        tiles3dModel: undefined,
        containID: this.mapid,
        flood: undefined,
        drawHandler: undefined,

        center: {
          lat: 32.0663951,
          lng: 118.839294,
          alt: 5000,
          heading: 0,
          pitch: -70,
        },
        scene: { FPS: true, depthTestTerrain: true }, //显示帧率
        terrains: [
          {
            id: 202,
            type: "xt",
            name: "星图地形",
            icon: "img/basemaps/terrain.png",
            tooltip: "星图地球提供的地形服务",
            url: "https://tiles1.geovisearth.com/base/v1/terrain",
            show: true,
          },
        ],
      };

      // 初始化实例
      this.speedMap = new Speed.SpeedViewer();
      this.viewer = this.speedMap.init(option);

      // 加载模型
      if (this.tiles3dModel) {
        this.speedMap.removeLayer(this.tiles3dModel);
        this.tiles3dModel = null;
      }
      this.tilesetLayer = new Speed.TilesetLayer();
      const tileset = this.tilesetLayer.loadTilesetLayer({
        url: ModelInfo.JIANGXINZHOU,
        type: 1,
      });
      this.tiles3dModel = tileset._tileset;
      this.speedMap.addLayer(this.tiles3dModel);
      this.speedMap.flyto(this.tiles3dModel);
    },

    flyTo(type) {
      if (type == "terrain") {
        this.speedMap.flyto({
          destination: Cesium.Cartesian3.fromDegrees(118.839294, 32.0663951, 5000),
        });
      } else if ("model") {
        this.speedMap.flyto(this.tiles3dModel);
      }
    },

    run() {
      var SnowBAK = `
uniform sampler2D colorTexture; 
    uniform sampler2D depthTexture;
  varying vec2 v_textureCoordinates;
//   uniform float snowSpeed;
// uniform float snowSize;
  
  float snow(vec2 uv,float scale)
  {
    
      float time = czm_frameNumber / snowSpeed;
      float w=smoothstep(10.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
      uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
      uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
     p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
     k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);
     return k*w;
 }
 
 void main(void){
     vec2 resolution = czm_viewport.zw;
     vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
     vec3 finalColor=vec3(0);
  
     float c = 0.0;
     c+=snow(uv,1.);
     c+=snow(uv,3.);
     c+=snow(uv,6.);
     c+=snow(uv,9.);
     c+=snow(uv,18.);
    // c+=snow(uv,36.);
     c+=snow(uv,72.);
     finalColor=(vec3(c)); 
      gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.4);     
}
  `;

      var snow_glsl = `
    #define BLIZZARD // Comment this out for a blizzard
    #ifdef LIGHT_SNOW
        #define LAYERS 50
        #define DEPTH .5
        #define WIDTH .3
        #define SPEED .6
    #else // BLIZZARD
        #define LAYERS 200
        #define DEPTH .1
        #define WIDTH .8
        #define SPEED 1.5
    #endif

    uniform sampler2D colorTexture; 
    varying vec2 v_textureCoordinates;

    void main(void)
    {
        float time = czm_frameNumber / SPEED;
        vec2 resolution=czm_viewport.zw;
        const mat3 p = mat3(3.323122,13.5112,21.71123,25.1212,50.7312,11.9312,21.8112,14.7212,80.3934);
        vec2 uv = resolution.xy + vec2(1.,resolution.y/resolution.x)*gl_FragCoord.xy / resolution.xy;
        vec3 acc = vec3(0.0);
        float dof = 5.*sin(time*.1);
        for (int i=0;i<int(LAYERS);i++) {
            float fi = float(i);
            vec2 q = uv*(1.+fi*DEPTH);
            q += vec2(q.y*(WIDTH*mod(fi*7.238917,1.)-WIDTH*.5),SPEED*time/(1.+fi*DEPTH*1.03));
            vec3 n = vec3(floor(q),31.189+fi);
            vec3 m = floor(n)*.00001 + fract(n);
            vec3 mp = (31415.9+m)/fract(p*m);
            vec3 r = fract(mp);
            vec2 s = abs(mod(q,1.)-.5+.9*r.xy-.45);
            s += .01*abs(2.*fract(10.*q.yx)-1.); 
            float d = .6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;
            float edge = .005+.05*min(.5*abs(fi-5.-dof),1.);
            acc += vec3(smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*DEPTH)));
        }
        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(vec3(acc),1.0), 0.4);     
    }
  `;

      var snow = new Cesium.PostProcessStage({
        name: "czm_snow",
        fragmentShader: snow_glsl,
      });

      this.viewer._viewer.scene.postProcessStages.add(snow);

      let snows_glsl = 
      `

      #extension GL_OES_standard_derivatives : enable
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        uniform float alpha;
        varying vec2 v_textureCoordinates;

        vec4 toEye(in vec2 uv, in float depth) {
            vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
            vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
            posInCamera = posInCamera / posInCamera.w;
            return posInCamera;
        }
        float getDepth(in vec4 depth) {
            float z_window = czm_unpackDepth(depth);
            z_window = czm_reverseLogDepth(z_window);
            float n_range = czm_depthRange.near;
            float f_range = czm_depthRange.far;
            return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
        }

        void main() {
            vec4 color = texture2D(colorTexture, v_textureCoordinates);
            vec4 currD = texture2D(depthTexture, v_textureCoordinates);
            if(currD.r >= 1.0) {
                gl_FragColor = color;
                return;
            }
            float depth = getDepth(currD);
            vec4 positionEC = toEye(v_textureCoordinates, depth);
            vec3 dx = dFdx(positionEC.xyz);
            vec3 dy = dFdy(positionEC.xyz);
            vec3 nor = normalize(cross(dx, dy));

            vec4 positionWC = normalize(czm_inverseView * positionEC);
            vec3 normalWC = normalize(czm_inverseViewRotation * nor);
            float dotNumWC = dot(positionWC.xyz, normalWC);
            if(dotNumWC <= 0.2) {
                gl_FragColor = mix(color, vec4(1.0), alpha * 0.2);
                return;
            }
            gl_FragColor = mix(color, vec4(1.0), dotNumWC * alpha);
        }


      `;

      var snows = new Cesium.PostProcessStage({
        name: "czm_snows",
        fragmentShader: snows_glsl,
        uniforms:{
            alpha: ()=>{
            return 0.8
          },
        },
      });

      this.viewer._viewer.scene.postProcessStages.add(snows);
    },
  },
};
</script>

<style scoped>
.ktmap {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
}
.vatool {
  position: absolute;
  z-index: 111;
  left: 4.5rem;
  top: 2.5rem;
  width: 400px;
  height: calc(100% - 4rem);
  background: url("../../../../public/img/speed3d/背景框@2x.png") no-repeat;
  padding: 50px 40px;
  background-size: 100% 100%;
}

.tabBtn {
  width: 100%;
  height: 36px;
  text-align: center;
  font-size: 16px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
}
.tabBtnActive {
  background: url("../../../../public/img/speed3d/tab@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}

.starClearBtn {
  width: 100%;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
}
.cscBtn {
  background: url("../../../../public/img/speed3d/bt_nor@2x.png") no-repeat;
  background-size: 100% 100%;
  color: #0099ff;
}

.addBtn {
  background: url("../../../../public/img/speed3d/bt_sel@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}

.el-row {
  margin-bottom: 20px;
}
.headerText {
  width: 100px;
  height: 45px;
  line-height: 45px;
  background: linear-gradient(0deg, #0099ff 0%, #ffffff 100%);
  font-size: 20px;
  font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
  font-weight: 700;
  font-style: italic;
  text-align: left;
  color: transparent;
  text-shadow: 0px 0px 10px 0px #00618b, 0px 0px 10px 0px #00618b;
  -webkit-background-clip: text;
}
.headerText img {
  width: 45px;
}

::v-deep .el-form-item__label {
  font-weight: 600;
}
::v-deep .el-input__inner {
  color: #0099ff;
}

::v-deep .el-input__wrapper {
  background-color: transparent;
  box-shadow: 0px 0px 10px 0px rgba(0, 153, 255, 0.7) inset;
  height: 40px;
}

::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 500;
  color: #f0f0f0;
}
</style>
