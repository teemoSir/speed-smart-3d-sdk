import Analyse from "./base/analyse";
import * as Cesium from "cesium";

/**
 * 天际线
 */
class Skyline extends Analyse {


    /**
     * @member {Cesium.Viewer} viewer 对象
     */
    _viewer;


    /**
     * 实例化剖面组件
     * @param {Cesium.Viewer} [viewer] - 3Dtileset模型对象
     * @example
     * 
     *  this.skyline = new Speed.Skyline(this.viewer);
     */
    constructor(viewer) {
        super(viewer);
        this._viewer = viewer._viewer || viewer;
        this.init();
    }

    /**
     * 初始化
     * @private
     */
    init () {
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
    }

    /**
      * 激活
      * @private
      * @param {Object} options 属性
      * @param {String} [options.color="red"] 天际线线条颜色
      * @example
      * 
      * this.skyline = this.skyline || new Speed.Skyline(this.viewer);
        this.skyline.activation();
      */
    activation (options) {
        this.options = {
            color: "red"
        };

        if (options) {
            this.options = Cesium.defaultValue(options.color, "red")
        }
        if (this.skylineAnayStages) {
            this.silhouette.enabled = true;
            return;
        }
        this.skylineAnayStages = this._viewer.scene.postProcessStages;
        let edgeDetection = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        let postProccessStage = new Cesium.PostProcessStage({
            //此后处理阶段的唯一名称，供组合中其他阶段参考，如果未提供名称，将自动生成GUID
            fragmentShader:
                `uniform sampler2D colorTexture;
                uniform sampler2D depthTexture;
                varying vec2 v_textureCoordinates;
                void main(void)
                {
                    float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                    vec4 color = texture2D(colorTexture, v_textureCoordinates);
                    if(depth<1.0 - 0.000001){
                        gl_FragColor = color;
                    }
                    else{
                        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
                    }
                }`,
        });

        //PostProcessStage:要使用的片段着色器。默认sampler2D制服是colorTexture和depthTexture。
        let postProccesStage_1 = new Cesium.PostProcessStage({
            fragmentShader:
                `uniform sampler2D colorTexture;
                uniform sampler2D redTexture;
                uniform sampler2D silhouetteTexture;
                varying vec2 v_textureCoordinates;
                uniform vec4 COLOR;
                void main(void)
                {
                    vec4 redcolor=texture2D(redTexture, v_textureCoordinates);
                    vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);
                    vec4 color = texture2D(colorTexture, v_textureCoordinates);
                    if(redcolor.r == 1.0){
                        gl_FragColor = mix(color, COLOR, silhouetteColor.a);
                    }
                    else{
                        gl_FragColor = color;
                    }
                }`,
            uniforms: {
                redTexture: postProccessStage.name,
                silhouetteTexture: edgeDetection.name,
                COLOR: () => {
                    return new Cesium.Color.fromCssColorString(this.options.color)
                },
            },
        });

        //如果inputPreviousStageTexture 是 true，则每个阶段输入是场景渲染到的输出纹理或之前执行阶段的输出纹理
        //如果inputPreviousStageTexture是false，则合成中每个阶段的输入纹理都是相同的
        this.silhouette = new Cesium.PostProcessStageComposite({
            //PostProcessStage要按顺序执行 的 s 或组合的数组。
            stages: [edgeDetection, postProccessStage, postProccesStage_1],
            //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
            inputPreviousStageTexture: false,
            //后处理阶段制服的别名
            uniforms: edgeDetection.uniforms,
        });
        this.skylineAnayStages.add(this.silhouette);
    }

    /**
     * 停止天际线
     */
    deactivation () {
        if (this.skylineAnayStages) {
            this.silhouette.enabled = false;
        }
    }

    /**
     * 属性更新
     * @param {String} [key] - 属性key
     * @param {String} [value] - 值
     * @example
     * 
     * this.skyline.setProperty("color","yellow");
     */
    setProperty (attribute, value) {
        if (!Cesium.defined(attribute)) throw new Cesium.DeveloperError('attribute不存在.');
        if (!Cesium.defined(value)) throw new Cesium.DeveloperError('value不存在.');

        if (attribute == "color") {
            this.options.color = value;
        }
    }

}

export default Skyline;
