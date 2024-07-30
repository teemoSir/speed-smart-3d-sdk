import * as Cesium from 'cesium'
import Effect from "./base/effect";
import WeatherMode from '../util/weatherMode';


class Weather extends Effect {

    /**
       * @typedef {Object} Viewer - cesium的viewer对象
       */
    _viewer;



    /**
     * 特效模式
     * @typedef {enum} WeatherMode 特效模式枚举
     * @property {Number} WeatherMode.SNOW - 雪天
     * @property {Number} WeatherMode.SNOWCOVER - 积雪
     * @property {Number} WeatherMode.RAIN - 雨天
     * @property {Number} WeatherMode.FOG - 雾天
     * @property {Number} WeatherMode.THUNDER - 雷电
     */


    /**
     * 天气特效
     * @constructs Weather 构造函数
     * @description 激活天气特效，默认特效雪天与积雪
     * @param {Viewer} [viewer] - viewer实例
     * @param {Array.<WeatherMode>} [mode=[WeatherMode.SNOW, WeatherMode.SNOWCOVER]] - 特效模式，可多重模式叠加，例如：mode=[WeatherMode.SNOW, WeatherMode.SNOWCOVER]，雪天与雪地同时生效。
     * @example
     *      
// 简单的使用，开启默认特效
let weather = new Speed.Weather(this.viewer);

// 开启特定多种特效
let mode = [
    Speed.WeatherMode.SNOW,
    Speed.WeatherMode.SNOWCOVER,
    Speed.WeatherMode.FOG,
];
let weather = new Speed.Weather(this.viewer,mode);

     * 
     */
    constructor(viewer, mode = [WeatherMode.SNOW, WeatherMode.SNOWCOVER]) {
        super(viewer);
        this.init(viewer);
        this.activate(mode);
    }


    /**
         * 初始化
         * @private
         * @property
         * @param {*} viewer 
         */
    init (viewer) {
        this._viewer = viewer._viewer || viewer;
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
    }

    /**
     * 切换特效模式
     * @param {Array.<WeatherMode> | WeatherMode} [mode] - 特效模式，可多重模式叠加
     * @example
     * 
     // 初始化，开启默认特效
     let weather = new Speed.Weather(this.viewer,[WeatherMode.RAIN]);

     // 激活单一特效模式，并且立即启动
     weather.activate(WeatherMode.RAIN)

     // 激活多个特效模式，并且立即启动
     // weather.activate([WeatherMode.RAIN,WeatherMode.FOG])
     * 
     */
    activate (mode) {

        // 初始化默认参数
        this.property = {
            snow: {
                speed: 60,
                angle: 1,
                level: 50,
            },
            rain: {
                speed: 60,
                angle: 1,
                level: 50,
            },
            snowCover: {
                opacity: 50
            },
            fog: {
                level: 50,
                color: "rgba(200,200,200,0.5)"
            },
            thunder: {
                level: 60,
                alpha: 40
            }
        };

        // 重置
        this.deactivate();

        if (mode) {
            if (mode instanceof Array) {
                mode.includes(WeatherMode.SNOW) && this.snow();
                mode.includes(WeatherMode.SNOWCOVER) && this.snowCover();
                mode.includes(WeatherMode.RAIN) && this.rain();
                mode.includes(WeatherMode.FOG) && this.fog();
                mode.includes(WeatherMode.THUNDER) && this.thunder();

            } else if (mode instanceof Number) {
                switch (mode) {
                    case WeatherMode.SNOW:
                        this.snow();
                        break;
                    case WeatherMode.SNOWCOVER:
                        this.snowCover();
                        break;
                    case WeatherMode.THUNDER:
                        this.thunder();
                        break;
                    case WeatherMode.RAIN:
                        this.rain();
                        break;
                    case WeatherMode.FOG:
                        this.fog();
                        break;
                    default:
                        break;
                }
            }

        }


    }

    /**
     * 关闭特效
     * @description - 销毁特效，默认销毁所有特效，只销毁特定的特效，mode入参特定销毁
     * @param {Array.<WeatherMode> | WeatherMode} [mode] - 该参数为空，默认清除所有特效 
     * @example
     * 
     // 初始化，开启默认特效
     let weather = new Speed.Weather(this.viewer);
    
     // 关闭单个特效
     // weather.deactivate([WeatherMode.RAIN,WeatherMode.FOG])
     
     // 关闭多个特效
     // weather.deactivate(WeatherMode.RAIN)
    
     // 关闭全部特效
     weather.deactivate()
     * 
     */
    deactivate (mode) {
        if (!mode) {
            this.snowDestroy(); this.rainDestroy(); this.fogDestroy(); this.thunderDestroy(); this.snowCoverDestroy();
        }
        else {
            if (mode instanceof Array) {
                if (mode.includes(WeatherMode.SNOW)) {
                    this.snowDestroy();
                }
                if (mode.includes(WeatherMode.SNOWCOVER)) {
                    this.snowCoverDestroy();
                }
                if (mode.includes(WeatherMode.RAIN)) {
                    this.rainDestroy();
                }
                if (mode.includes(WeatherMode.FOG)) {
                    this.fogDestroy();
                }
                if (mode.includes(WeatherMode.THUNDER)) {
                    this.thunderDestroy();
                }

            } else if (mode instanceof Number) {
                if (mode == WeatherMode.SNOW) {
                    this.snowDestroy();
                }
                if (mode == WeatherMode.SNOWCOVER) {
                    this.snowCoverDestroy();
                }
                if (mode == WeatherMode.RAIN) {
                    this.rainDestroy();
                }
                if (mode == WeatherMode.FOG) {
                    this.fogDestroy();
                }
                if (mode == WeatherMode.THUNDER) {
                    this.thunderDestroy();
                }
            } else {
                this.snowDestroy(); this.rainDestroy(); this.fogDestroy(); this.thunderDestroy(); this.snowCoverDestroy();
            }
        }
    }





    /**
    * 特效属性设置
    * @param {WeatherMode} mode - 特效属性类型
    * @param {Object} [property] - 特效参数对象，包含速度，颜色等属性
    * @param {Object} [property.snow] - WeatherMode.SNOW 雪天 激活使用该属性赋值
    * @param {Number} [property.snow.angle=1] - 下雪方向0度垂直，范围[-90至90]
    * @param {Number} [property.snow.speed=60] - 下雪速度，范围[0至100]
    * @param {Number} [property.snow.level=50] - 下雪等级，范围[0至100]
    * @param {Object} [property.snowCover] - WeatherMode.SNOWCOVER 积雪 激活使用该属性赋值
    * @param {Number} [property.snowCover.opacity=50] - 积雪透明度，[0至100]
    * @param {Object} [property.rain] - WeatherMode.RAIN 雨天 激活使用该属性赋值
    * @param {Number} [property.rain.level=50] - 下雨等级，范围[0至100]
    * @param {Number} [property.rain.speed=60] - 下雨速度，范围[0至100]
    * @param {Object} [property.rain.angle=1] - 下雨方向0度垂直，范围[-90至90]
    * @param {Number} [property.fog] - WeatherMode.FOG 雾天 激活使用该属性赋值
    * @param {Number} [property.fog.level=50] - 大雾等级，范围[0至100]
    * @param {Number} [property.fog.color="rgba(200,200,200,0.5)"] - 大雾透明度，范围[0至100]
    * @param {Number} [property.thunder] - WeatherMode.THUNDER 雷电 激活使用该属性赋值
    * @param {Number} [property.thunder.level=50] - 雷电等级，范围[0至100]
    * @param {Number} [property.thunder.alpha=50] - 环境透明度，范围[0至100]
    * @description - 天气特效属性更新
    * @example
    *      
    *  let weather = new Speed.Weather(this.viewer);
     
        let mode = [
                Speed.WeatherMode.SNOW,
                Speed.WeatherMode.SNOWCOVER,
                Speed.WeatherMode.FOG,
            ];
        weather.activate(mode);
            
        weather.setProperty(Speed.WeatherMode.SNOW, {
            level: 50,
            angle: 1,
            speed: 50
        });
     * 
     */
    setProperty (mode, property) {
        if (mode && property) {
            switch (mode) {
                case WeatherMode.SNOW:
                    if (Cesium.defined(property.angle)) {
                        this.property.snow.angle = property.angle;
                    }
                    if (Cesium.defined(property.speed)) {
                        this.property.snow.speed = property.speed;
                    }
                    if (Cesium.defined(property.level)) {
                        this.property.snow.level = property.level;
                    }
                    break;
                case WeatherMode.SNOWCOVER:
                    if (Cesium.defined(property.opacity)) {
                        this.property.snowCover.opacity = property.opacity;
                    }
                    break;
                case WeatherMode.RAIN:
                    if (Cesium.defined(property.angle)) {
                        this.property.rain.angle = property.angle;
                    }
                    if (Cesium.defined(property.speed)) {
                        this.property.rain.speed = property.speed;
                    }
                    if (Cesium.defined(property.level)) {
                        this.property.rain.level = property.level;
                    }
                    break;
                case WeatherMode.FOG:
                    if (Cesium.defined(property.color)) {
                        this.property.fog.color = property.color;
                    }
                    if (Cesium.defined(property.level)) {
                        this.property.fog.level = property.level;
                    }
                    break;
                case WeatherMode.THUNDER:
                    if (Cesium.defined(property.level)) {
                        this.property.thunder.level = property.level;
                    }
                    if (Cesium.defined(property.alpha)) {
                        this.property.thunder.alpha = property.alpha;
                    }
                    break;
            }
        }
    }


    /**
     * 雪天
     * @private
     */
    snow () {
        let fs = `
        // #define BLIZZARD 
        // #ifdef LIGHT_SNOW
        //     #define LAYERS 50
        //     #define DEPTH .5
        //     #define WIDTH .3
        //     #define SPEED .6
        // #else // BLIZZARD
        //     #define LAYERS 200
        //     #define DEPTH .1
        //     #define WIDTH .8
        //     #define SPEED 1.5
        // #endif

        #define LAYERS 300

        uniform float DEPTH;
        uniform float WIDTH;
        uniform float SPEED;
        uniform float ANGLE;
    
        uniform sampler2D colorTexture; 
        varying vec2 v_textureCoordinates;
    
        void main(void)
        {
            float time = czm_frameNumber / SPEED;
            vec2 resolution=czm_viewport.zw;
            //const mat3 p = mat3(3.323122,13.5112,21.71123,25.1212,50.7312,11.9312,21.8112,14.7212,80.3934); // bug
            const mat3 p = mat3(2.,14.,22.,26.,60.,10.,20.,16.,80.);
            vec2 uv = resolution.xy + vec2(1.,resolution.y/resolution.x)*gl_FragCoord.xy / resolution.xy;
            vec3 acc = vec3(0.0);
            float dof = 5.*sin(time*.1);
            for (float i=1.0;i<=float(LAYERS);i+=1.0)  {
                float fi = float(i);
                vec2 q = uv*(1.+fi*DEPTH);
                q += vec2(q.y*(WIDTH*mod(fi*7.238917,ANGLE)-WIDTH*.5),SPEED*time/(1.+fi*DEPTH*1.03));//7.238917,
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
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(vec3(acc),1.0), 0.5);     
        }
        `;

        if (!this.snow_pps) {
            this.snow_pps = new Cesium.PostProcessStage({
                name: "speed_cn_snow",
                fragmentShader: fs,
                uniforms: {
                    DEPTH: () => {
                        // 0.5-0.1
                        return (50 - (this.property.snow.level / 2)) * 0.01 + 0.001 || 0.5;
                    },
                    WIDTH: () => {
                        // 0.3-0.8
                        return (this.property.snow.level / 2) * 0.01 + 0.301 || 0.3;
                    },
                    SPEED: () => {
                        // 0.6-1.5
                        return (this.property.snow.speed * 0.001) || 0.1;
                    },
                    ANGLE: () => {
                        // -90  90
                        return (this.property.snow.angle + 0.01) || 1.0;
                    }
                }
            });
            this._viewer.scene.postProcessStages.add(this.snow_pps);
        }
    }

    /**
     * 雪天移除
     * @private
     */
    snowDestroy () {
        if (this.snow_pps) {

            this._viewer.scene.postProcessStages.remove(this.snow_pps);
            this.snow_pps = undefined;

        }
    }

    /**
     * 积雪
     * @private
     */
    snowCover () {
        let fs = `
       
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
        let index = 0;
        if (!this.snow_cover_pps) {
            this.snow_cover_pps = new Cesium.PostProcessStage({
                name: "speed_cn_snow_cover",
                fragmentShader: fs,
                uniforms: {
                    alpha: () => {
                        if (index < 1000) {
                            index++;
                        }
                        return (index * 0.001) * this.property.snowCover.opacity * 0.01;
                    },
                },
            });

            this._viewer.scene.postProcessStages.add(this.snow_cover_pps);
        }
    }

    /**
    * 积雪移除
    * @private
    */
    snowCoverDestroy () {
        if (this.snow_cover_pps) {

            this._viewer.scene.postProcessStages.remove(this.snow_cover_pps);
            this.snow_cover_pps = undefined;

        }
    }



    /**
    * 雨天
    * @private
    */
    rain () {
        let fs = `
        // #define BLIZZARD 
        // #ifdef LIGHT_SNOW
        //     #define LAYERS 50
        //     #define DEPTH .5
        //     #define WIDTH .3
        //     #define SPEED .6
        // #else // BLIZZARD
        //     #define LAYERS 200
        //     #define DEPTH .1
        //     #define WIDTH .8
        //     #define SPEED 1.5
        // #endif

        #define LAYERS 300

        uniform float DEPTH;
        uniform float WIDTH;
        uniform float SPEED;
        uniform float ANGLE;
    
        uniform sampler2D colorTexture; 
        varying vec2 v_textureCoordinates;
    
        void main(void)
        {
            float time = czm_frameNumber / SPEED;
            vec2 resolution=czm_viewport.zw;
            //const mat3 p = mat3(3.323122,13.5112,21.71123,25.1212,50.7312,11.9312,21.8112,14.7212,80.3934); // bug
            const mat3 p = mat3(2.,14.,22.,26.,60.,10.,20.,16.,80.);
            vec2 uv = resolution.xy + vec2(16.,resolution.y/resolution.x)*gl_FragCoord.xy / resolution.xy;
            vec3 acc = vec3(0.0);
            float dof = 5.*sin(time*.1);
            for (float i=1.0;i<=float(LAYERS);i+=1.0)  {
                float fi = float(i);
                vec2 q = uv*(1.+fi*DEPTH);
                q += vec2(q.y*(WIDTH*mod(fi*7.238917,ANGLE)-WIDTH*.5),SPEED*time/(1.+fi*DEPTH*1.03));//7.238917,
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
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(vec3(acc),1.0), 0.5);     
        }
        `;

        if (!this.rain_pps) {
            this.rain_pps = new Cesium.PostProcessStage({
                name: "speed_cn_rain",
                fragmentShader: fs,
                uniforms: {
                    DEPTH: () => {
                        // 0.5-0.1
                        return (50 - (this.property.rain.level / 2)) * 0.01 + 0.001 || 0.5;
                    },
                    WIDTH: () => {
                        // 0.3-0.8
                        return (this.property.rain.level / 2) * 0.01 + 0.301 || 0.3;
                    },
                    SPEED: () => {
                        // 0.6-1.5
                        return (this.property.rain.speed * 0.001) || 0.1;
                    },
                    ANGLE: () => {
                        // -90  90
                        return (this.property.rain.angle + 0.01) || 1.0;
                    }
                }
            });
            this._viewer.scene.postProcessStages.add(this.rain_pps);
        }
    }

    /**
     * 雨天
     * @private
     */
    rains () {
        let fs = `
       
        uniform sampler2D colorTexture;//in image
        varying vec2 v_textureCoordinates;

        uniform float tiltAngle;
        uniform float rainSize;
        uniform float rainSpeed;
        uniform float rainColor;
        
        float hash(float x){
            return fract(sin(x*133.3)*13.13);
        }
        
        void main(void){
        
            float time = czm_frameNumber / rainSpeed;
            vec2 resolution = czm_viewport.zw;
        
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
            vec3 c=vec3(.6,.7,.8);
        
            float a=tiltAngle;
            float si=sin(a),co=cos(a);
            uv*=mat2(co,-si,si,co);
            uv*=length(uv+vec2(0,4.9))*rainSize+1.;
        
            float v=1.-sin(hash(floor(uv.x*100.))*2.);
            float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
            c*=v*b; //color
        
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); 
        }

        `;

        if (!this.rain_pps) {
            this.rain_pps = new Cesium.PostProcessStage({
                name: "speed_cn_rain",
                fragmentShader: fs,
                uniforms: {
                    tiltAngle: () => {
                        return 0.6;
                    },
                    rainSize: () => {
                        return 0.3;
                    },
                    rainSpeed: () => {
                        return 60.0;
                    },
                    rainColor: () => {
                        return new Cesium.Color(0.8, 0.8, 0.8, 0.5);
                    }
                },
            });

            this._viewer.scene.postProcessStages.add(this.rain_pps);
        }
    }

    /**
    * 雨天移除
    * @private
    */
    rainDestroy () {
        if (this.rain_pps) {

            this._viewer.scene.postProcessStages.remove(this.rain_pps);
            this.rain_pps = undefined;

        }
    }


    /**
     * 雾天
     * @private
     */
    fog () {
        let fs = `
       
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        uniform float visibility;
        uniform vec4 fogColor;
        varying vec2 v_textureCoordinates;
        void main(void)
        {
            vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);
            //vec4 fogcolor=vec4(0.8,0.8,0.8,0.5);
      
            float depth = czm_readDepth(depthTexture, v_textureCoordinates);
            vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);
      
            float f=visibility*(depthcolor.r-0.22)/0.6;
            if(f<0.0) f=0.0;
            else if(f>1.0) f=1.0;
            gl_FragColor = mix(origcolor,fogColor,f);
         }

        `;

        if (!this.fog_pps) {
            this.fog_pps = new Cesium.PostProcessStage({
                name: "speed_cn_fog",
                fragmentShader: fs,
                uniforms: {
                    visibility: () => {
                        return this.property.fog.level * 0.01 || 0.5;
                    },
                    fogColor: () => {
                        return new Cesium.Color.fromCssColorString(this.property.fog.color);
                    },
                },
            });
            this._viewer.scene.postProcessStages.add(this.fog_pps);
        }
    }

    /**
    * 雾天移除
    * @private
    */
    fogDestroy () {
        if (this.fog_pps) {
            this._viewer.scene.postProcessStages.remove(this.fog_pps);
            this.fog_pps = undefined;

        }
    }



    /**
     * 雷电
     * @private
     */
    thunder () {
        let fs = `


        // 雷电
        vec2 resolution=czm_viewport.zw;
        uniform sampler2D colorTexture;
        uniform float SPEED;
        uniform float ALPHA;
        float iTime = czm_frameNumber / SPEED;
        varying vec2 v_textureCoordinates;
    
        float rand(float x)
        {
            return fract(sin(x)*75154.32912);
        }
        
        float rand3d(vec3 x)
        {
            return fract(375.10297 * sin(dot(x, vec3(103.0139,227.0595,31.05914))));
        }
        
        float noise(float x)
        {
            float i = floor(x);
            float a = rand(i), b = rand(i+1.);
            float f = x - i;
            return mix(a,b,f);
        }
        
        float perlin(float x)
        {
            float r=0.,s=1.,w=1.;
            for (int i=0; i<6; i++) {
                s *= 2.0;
                w *= 0.5;
                r += w * noise(s*x);
            }
            return r;
        }
        
        float noise3d(vec3 x)
        {
            vec3 i = floor(x);
            float i000 = rand3d(i+vec3(0.,0.,0.)), i001 = rand3d(i+vec3(0.,0.,1.));
            float i010 = rand3d(i+vec3(0.,1.,0.)), i011 = rand3d(i+vec3(0.,1.,1.));
            float i100 = rand3d(i+vec3(1.,0.,0.)), i101 = rand3d(i+vec3(1.,0.,1.));
            float i110 = rand3d(i+vec3(1.,1.,0.)), i111 = rand3d(i+vec3(1.,1.,1.));
            vec3 f = x - i;
            return mix(mix(mix(i000,i001,f.z), mix(i010,i011,f.z), f.y),
                       mix(mix(i100,i101,f.z), mix(i110,i111,f.z), f.y), f.x);
        }
        
        float perlin3d(vec3 x)
        {
            float r = 0.0;
            float w = 1.0, s = 1.0;
            for (int i=0; i<5; i++) {
                w *= 0.5;
                s *= 2.0;
                r += w * noise3d(s * x);
            }
            return r;
        }
        
        float f(float y)
        {
            float w = 0.4; // width of strike
            return w * (perlin(2. * y) - 0.5);
        }
        
        float plot(vec2 p, float d, bool thicker)
        {
            if (thicker) d += 5. * abs(f(p.y + 0.001) - f(p.y));
            return smoothstep(d, 0., abs(f(p.y) - p.x));
        }
        
        float cloud(vec2 uv, float speed, float scale, float cover)
        {
            float c = perlin3d(vec3(uv * scale, iTime * speed * 2.));
            return max(0., c - (1. - cover));
        }
        
        float mountain(vec2 uv, float scale, float offset, float h1, float h2)
        {
            float h = h1 + perlin(scale*uv.x + offset) * (h2 - h1);
            return smoothstep(h, h+0.01, uv.y);
        }
        
        vec3 render(vec2 uv)
        {
            float x = iTime + 0.1;
        
            float m = 0.25; // max duration of strike
            float i = floor(x/m);
            float f = x/m - i;
            float k = 0.4; // frequency of strikes
            float n = noise(i);
            float t = ceil(n-k); // occurrence
            float d = max(0., n-k) / (1.-k); // duration
            float o = ceil(t - f - (1. - d)); // occurrence with duration
            float gt = 0.1; // glare duration
            float go = ceil(t - f - (1. - gt)); // glare occurrence
            
            float lightning = 0.;
            float light = 0.;
            float glare = 0.;
            
            if (o == 1.) {
                vec2 uv2 = uv;
                uv2.y += i * 2.; // select type of lightning
                float p = (noise(i+10.) - 0.5) * 2.; // position of lightning
                uv2.x -= p;
                
                float strike = plot(uv2, 0.01, true);
                float glow = plot(uv2, 0.04, false);
                float glow2 = plot(uv2, 1.5, false);
        
                lightning = strike * 0.4 + glow * 0.15;
        
                float h = noise(i+5.); // height
                lightning *= smoothstep(h, h+0.05, uv.y + perlin(1.2*uv.x + 4.*h)*0.03);
                lightning += glow2 * 0.3;
                light = smoothstep(5., 0., abs(uv.x - p));
                glare = go * light;
            }
            
            vec3 clouds =
                vec3(0.5,0.7,1.) * mix(0.6, 0.9, cloud(uv, 0.2, 0.1, 1.0)) +
                vec3(0.7,0.8,1.) * 0.6 * cloud(uv*vec2(0.5,1.), 0.06, 0.8, 0.8) +
                vec3(0.9,0.9,1.) * 0.3 * cloud(uv*vec2(0.1,1.), 0.08, 5.5, 0.6) +
                vec3(1.,1.,1.) * 0.4 * cloud(uv*vec2(0.1,1.), 0.07, 10., 0.5);
            
            float horizon = mountain(uv, 0.8, 9., 0.3, 0.6);
            vec3 terrain = mix(vec3(0.25,0.3,0.3)*0.5, 1.5*vec3(0.15,0.2,0.3),
                1. - (1. - mountain(uv, 0.8, 3., 0.2, 0.4)) * 0.5 - 
                (1. - mountain(uv, 0.8, 17.5, 0.05, 0.25)) * 0.5);
            
            vec3 background = mix(terrain, clouds, horizon);
            background *= (0.2 + light * 0.5);
            return vec3( lightning );
        }
        
        void main(void)
        {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            uv.x = 2. * uv.x - 1.;
            uv.x *= resolution.x / resolution.y;
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(render(uv),1.0), ALPHA); 
        }
  
        `;

        if (!this.thunder_pps) {
            this.thunder_pps = new Cesium.PostProcessStage({
                name: "speed_cn_thunder",
                fragmentShader: fs,
                uniforms: {
                    SPEED: () => {
                        return 1000 - (this.property.thunder.level * 10 - 1);
                    },
                    ALPHA: () => {
                        return this.property.thunder.alpha * 0.01;
                    }
                },
            });
            this._viewer.scene.postProcessStages.add(this.thunder_pps);
        }

    }

    /**
    * 雷电移除
    * @private
    */
    thunderDestroy () {
        if (this.thunder_pps) {
            this._viewer.scene.postProcessStages.remove(this.thunder_pps);
            this.thunder_pps = undefined;

        }
    }
}

export default Weather;

