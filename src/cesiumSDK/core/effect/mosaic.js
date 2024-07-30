import * as Cesium from 'cesium'
import Effect from "./base/effect";



class Mosaic extends Effect {

    /**
       * @member {Cesium.Viewer} - cesium的viewer对象
       * @memberof Visible
       */
    _viewer;

    /**
      * 马赛克特效
      * @class
      * @param {Object|Cesium.Viewer} viewer - viewer实例
      */
    constructor(viewer) {
        super(viewer);
        this._viewer = viewer._viewer || viewer;
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
    }




    /**
     * 激活特效
     * @param {Object} [type="cube"] 特效默认为'cube'方块形式，'diamond' 为菱形
     * @param {Object} [options] 属性参数
     * @param {Number} [property.x=10] 马赛克像素块宽度
     * @param {Number} [property.y=10] 马赛克像素块高度
     * @example
     *      let weather = new Speed.Weather(this.viewer);
            let mode = [
                    Speed.WeatherMode.SNOW,
                    Speed.WeatherMode.SNOWCOVER,
                    Speed.WeatherMode.FOG,
                ];
            weather.activate(mode);
     * 
     */
    activate (type, options) {

        this.options = {
            x: 10,
            y: 10
        }

        if (options) {
            this.options = {
                x: Cesium.defaultValue(Number(options.x), 10),
                y: Cesium.defaultValue(Number(options.y), 10)
            }
        }


        if (type) {
            type == "cube" ? this.cube() : this.diamond();
        } else {
            this.cube();
        }

    }

    /**
     * 移除特效
     * @description - 移除所有特效
     */
    deactivate () {
        this.cube_pps && this.cubeDestroy();
        this.diamond_pps && this.diamondDestroy();
    }


    /**
     * 属性更新
     * @param {*} property width 马赛克像素宽度，height 马赛克像素高度
     * @param {*} value 
     */
    setProperty (property, value) {
        if (Cesium.defined(property) && Cesium.defined(value)) {
            this.options[property] = value;
        }
    }



    /**
     * 方形马赛克
     * @private
     */
    cube () {
        let fs = `
            uniform float TX;
            uniform float TY;
            vec2 resolution=czm_viewport.zw;
            vec2 tile_num = vec2(resolution.x/TX,resolution.y/TY);
            uniform sampler2D colorTexture;
            void main(void)
            {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
            // uv.y = (1.0-uv.y);
                uv = floor(uv*tile_num)/tile_num;
                gl_FragColor = texture2D( colorTexture, uv );
            }

            // 黑白特效
            // vec2 resolution=czm_viewport.zw;
            // uniform sampler2D colorTexture;
            // float getChannel(int channel, sampler2D tex, vec2 uv)
            // {
            //     return dot(texture2D(tex, uv), vec4(channel==0, channel==1, channel==2, channel==3));
            // }

            // void main(void)
            // {
            //     vec2 uv = gl_FragCoord.xy / resolution.xy;
            //     float channel = getChannel(2, colorTexture, uv);
            //     gl_FragColor = vec4(vec3(channel), 1.0);
            // }



            // fire
            // vec2 resolution=czm_viewport.zw;
            // uniform sampler2D colorTexture;
            // float iTime = czm_frameNumber/ 60.0;

            // float rand(vec2 n) {
            //     return fract(sin(cos(dot(n, vec2(12.9898,12.1414)))) * 83758.5453);
            // }

            // float noise(vec2 n) {
            //     const vec2 d = vec2(0.0, 1.0);
            //     vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
            //     return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
            // }

            // float fbm(vec2 n) {
            //     float total = 0.0, amplitude = 1.0;
            //     for (int i = 0; i <5; i++) {
            //         total += noise(n) * amplitude;
            //         n += n*1.7;
            //         amplitude *= 0.47;
            //     }
            //     return total;
            // }

            // void main(void) {

            //     const vec3 c1 = vec3(0.5, 0.0, 0.1);
            //     const vec3 c2 = vec3(0.9, 0.1, 0.0);
            //     const vec3 c3 = vec3(0.2, 0.1, 0.7);
            //     const vec3 c4 = vec3(1.0, 0.9, 0.1);
            //     const vec3 c5 = vec3(0.1);
            //     const vec3 c6 = vec3(0.9);

            //     vec2 speed = vec2(0.1, 0.9);
            //     float shift = 1.327+sin(iTime*2.0)/2.4;
            //     float alpha = 0.1;
                
            //     float dist = 3.5-sin(iTime*0.4)/1.89;
                
            //     vec2 uv = gl_FragCoord.xy / resolution.xy;
            //     vec2 p = gl_FragCoord.xy * dist / resolution.xx;
            //     p += sin(p.yx*4.0+vec2(.2,-.3)*iTime)*0.04;
            //     p += sin(p.yx*8.0+vec2(.6,+.1)*iTime)*0.01;
                
            //     p.x -= iTime/1.1;
            //     float q = fbm(p - iTime * 0.3+1.0*sin(iTime+0.5)/2.0);
            //     float qb = fbm(p - iTime * 0.4+0.1*cos(iTime)/2.0);
            //     float q2 = fbm(p - iTime * 0.44 - 5.0*cos(iTime)/2.0) - 6.0;
            //     float q3 = fbm(p - iTime * 0.9 - 10.0*cos(iTime)/15.0)-4.0;
            //     float q4 = fbm(p - iTime * 1.4 - 20.0*sin(iTime)/14.0)+2.0;
            //     q = (q + qb - .4 * q2 -2.0*q3  + .6*q4)/3.8;
            //     vec2 r = vec2(fbm(p + q /2.0 + iTime * speed.x - p.x - p.y), fbm(p + q - iTime * speed.y));
            //     vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
            //     vec3 color = vec3(1.0/(pow(c+1.61,vec3(4.0))) * cos(shift * gl_FragCoord.y / resolution.y));
                
            //     color=vec3(1.0,.2,.05)/(pow((r.y+r.y)* max(.0,p.y)+0.1, 4.0));;
            //     color += (texture2D(colorTexture,uv*0.6+vec2(.5,.1)).xyz*0.01*pow((r.y+r.y)*.65,5.0)+0.055)*mix( vec3(.9,.4,.3),vec3(.7,.5,.2), uv.y);
            //     color = color/(1.0+max(vec3(0),color));
            //     gl_FragColor = vec4(color.x, color.y, color.z, alpha);
            // }
   
        `;

        if (!this.cube_pps) {
            this.cube_pps = new Cesium.PostProcessStage({
                name: "speed_cn_cube",
                fragmentShader: fs,
                uniforms: {
                    TX: () => {
                        return this.options.x
                    },
                    TY: () => {
                        return this.options.y
                    },

                },
            });

            this._viewer.scene.postProcessStages.add(this.cube_pps);
        }
    }

    /**
   * 方形马赛克移除
   * @private
   */
    cubeDestroy () {
        if (this.cube_pps) {
            this._viewer.scene.postProcessStages.remove(this.cube_pps);
            this.cube_pps = undefined;

        }
    }

    /**
    * 菱形形马赛克
    * @private
    */
    diamond () {

        let fs = `
        // 菱形马赛克
        uniform float TX;
        uniform float TY;
        vec2 resolution=czm_viewport.zw;
        vec2 tile_num = vec2(resolution.x/TX,resolution.y/TY);
        uniform sampler2D colorTexture;
        void main(void)
        {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec2 uv2 = floor(uv*tile_num)/tile_num;
            uv -= uv2;
            uv *= tile_num;
            gl_FragColor = texture2D( colorTexture, uv2 + vec2(step(1.0-uv.y,uv.x)/(2.0*tile_num.x),step(uv.x,uv.y)/(2.0*tile_num.y)));
        } 

    `;

        if (!this.diamond_pps) {
            this.diamond_pps = new Cesium.PostProcessStage({
                name: "speed_cn_diamond",
                fragmentShader: fs,
                uniforms: {
                    TX: () => {
                        return this.options.x
                    },
                    TY: () => {
                        return this.options.y
                    },

                },
            });

            this._viewer.scene.postProcessStages.add(this.diamond_pps);
        }

    }
    /**
   * 菱形形马赛克移除
   * @private
   */
    diamondDestroy () {
        if (this.diamond_pps) {
            this._viewer.scene.postProcessStages.remove(this.diamond_pps);
            this.diamond_pps = undefined;

        }
    }
}

export default Mosaic;

