import * as Cesium from "cesium";
import { waterNormalsSmall } from "../util/base64Image"
import * as uuid from "uuid"

class updateWater {

    constructor(viewer, options) {

        // 初始化参数
        this.clear();

        this.options = options;
        this.viewer = viewer;
        this._extrudedHeight = 0;
        this._primitive;
        this.extrudedHeight = 0;
        this.pauseState = true;

        Object.defineProperty(this, "extrudedHeight", {
            get () {
                return this._extrudedHeight;
            },
            set (val) {
                if (Object.prototype.toString.call(val) !== "[object Number]") return;
                if (this._primitive) {
                    this._primitive._state = 3; // 关键
                    this._primitive._appearance = undefined; // 关键
                    this._primitive.geometryInstances.geometry = this.getGeometry();
                    this._extrudedHeight = val;
                }
            }
        });
        this.init(); // 调用init函数

    }

    setPause (bool) {
        this.pauseState = bool;
    }
    getPauseState () {
        return this.pauseState;
    }

    getGeometry () {

        return new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(this.options.positions), // 多边形坐标
            height: this.options.minAltitude, // 底部高度
            extrudedHeight: this.options.minAltitude + this._extrudedHeight, // 水面高度 this._extrudedHeight
            //   vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
    }

    clear () {
        if (this._primitive_warter) {
            this.viewer.scene.primitives.remove(this._primitive_warter);
            this._primitive_warter = undefined;
        }
    }

    init () {
        this.clear();
        //console.log(this.options)
        let geometry = this.getGeometry();
        if (!geometry) return;
        this._primitive = new Cesium.Primitive({
            releaseGeometryInstances: false,
            geometryInstances: new Cesium.GeometryInstance({
                geometry
            }),
            asynchronous: false,
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                // aboveGround: true,
                material: new Cesium.Material({
                    fabric: {
                        type: 'Water',
                        uniforms: {
                            normalMap: waterNormalsSmall,
                            frequency: this.options.water.frequency,
                            animationSpeed: this.options.water.animationSpeed,
                            amplitude: this.options.water.amplitude,
                            baseWaterColor: Cesium.Color.fromCssColorString(this.options.water.baseWaterColor),
                            specularIntensity: this.options.water.specularIntensity,
                            // baseWaterColor: rgba颜色对象的水的基本颜色。
                            // blendColor:当从水混合到非水区域时使用的rgba颜色对象。
                            // specularMap:用于指示水域区域的单通道纹理。
                            // normalMap:水法线扰动的法线图。
                            // frequency:控制波数的数字。
                            // animationSpeed:控制水的动画速度的数字。
                            // amplitude:控制水波振幅的数字。
                            // specularIntensity:控制镜面反射强度的数值。
                        },

                    }
                }),
                fragmentShaderSource: `
                varying vec3 v_positionMC;
                varying vec3 v_positionEC;
                varying vec2 v_st;
                void main()
                {
                    czm_materialInput materialInput;
                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));
                    #ifdef FACE_FORWARD
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
                    #endif
                    materialInput.s = v_st.s;
                    materialInput.st = v_st;
                    materialInput.str = vec3(v_st, 0.0);
                    materialInput.normalEC = normalEC;
                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);
                    vec3 positionToEyeEC = -v_positionEC;
                    materialInput.positionToEyeEC = positionToEyeEC;
                    czm_material material = czm_getMaterial(materialInput);
                    #ifdef FLAT
                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
                    #else
                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
                    gl_FragColor.a=0.6;
                    #endif
                }
                `
            }),

        })

        this._primitive_warter = this.viewer.scene.primitives.add(this._primitive);

        //定时
        this.waterAnimation = () => {
            if (this.pauseState) {
                // 每秒更新
                if (seconds === 100) {
                    seconds = 0;
                    countTime++;
                }

                // 理论运行时间
                // let theorySeconds = this.options.maxHeight / this.options.speed;
                // 实际运行时间
                //  let actualSeconds = this.options.time;

                //   if (countTime <= actualSeconds && countTime <= theorySeconds) {
                if (this.extrudedHeight < this.options.maxHeight) {
                    requestAnimationFrame(this.waterAnimation);
                } else {
                    this._requestAnimationFrame_water && clearInterval(this._requestAnimationFrame_water)
                }
            }
        }
        let seconds = 0;
        let countTime = 0;
        this._requestAnimationFrame_water = setInterval(() => {
            if (this.pauseState) {
                this.extrudedHeight += this.options.speed / 100;
                //  console.log(this.extrudedHeight)
                seconds++;
            }
        }, 10);
        this.waterAnimation();
    }


    drawMarker (position, label = "") {

        let marker = {
            name: 'label',
            position: position,
            label: {
                text: label, // 文本，支持换行符\n
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -60), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.6)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE, // 字体颜色-白色
                style: Cesium.LabelStyle.FILL,
                font: '1vw sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                //   show: false

            },
            point: {
                color: Cesium.Color.WHITE, //点位颜色
                pixelSize: 3, //像素点大小
                // disableDepthTestDistance: 50000
            },
        }
        this._viewer._feature = this._viewer._feature || [];
        this._viewer._feature.push(this._viewer.entities.add(marker));
    }


    /**
     * @private
     * @param {*} frameState 
     */
    update (frameState) {

        if (this._primitive) {
            let primitive = this._primitive;
            primitive.update(frameState);
        }

    }
}








export default updateWater
