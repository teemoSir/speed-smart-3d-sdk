import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import Validate from "../util/validate";



/**
 * 可视域分析
 */
class ViewShed extends Analyse {

    /**
     * @member {Cesium.Viewer} - cesium的viewer对象
     * @memberof Visible
     */
    viewer;

    /** 
    * 可视域分析
    * @param {Cesium.Viewer} viewer Cesium三维视窗。
    * @param {Object} [options] 选项。
    * @param {Cesium.Cartesian3} [options.viewPosition] 观测点位置。
    * @param {Cesium.Cartesian3} [options.viewPositionEnd] 最远观测点位置（如果设置了观测距离，这个属性可以不设置）。
    * @param {Number} [options.viewDistance=100] 观测距离（单位`米`，默认值100）。
    * @param {Number} [options.viewHeading=0] 航向角（单位`度`，默认值0）。
    * @param {Number} [options.viewPitch=0] 俯仰角（单位`度`，默认值0）。
    * @param {Number} [options.horizontalViewAngle=90] 可视域水平夹角（单位`度`，默认值90）。
    * @param {Number} [options.verticalViewAngle=60] 可视域垂直夹角（单位`度`，默认值60）。
    * @param {String} [options.shadowVisibleColor="rgba(0,255,0,0.5)"] 可视区域颜色（默认值`绿色`）。
    * @param {String} [options.inshadowVisibleColor="rgba(255,0,0,0.5)"] 不可视区域颜色（默认值`红色`）。
    * @param {String} [options.coneFillColor="rgba(61,153,250,0.3)"] - 视锥体填充颜色
    * @param {String} [options.coneOutlineColor="rgba(61,153,250,0.8)"] - 视锥体轮廓线条颜色
    * @param {Boolean} [options.enabled] 阴影贴图是否可用。
    * @param {Boolean} [options.softShadows] 是否启用柔和阴影。
    * @param {Boolean} [options.size] 每个阴影贴图的大小。
    */
    constructor(viewer, options) {
        super();

        this.viewer = viewer._viewer || viewer;
        this.viewPosition = options.viewPosition;
        let buf = Object.assign({}, options.viewPosition);
        buf.y = buf.y + 2;
        buf.x = buf.x + 2;
        buf.z = buf.z + 2;
        this.viewPositionEnd = Cesium.Cartesian3.equals(options.viewPositionEnd,options.viewPosition) ? buf : options.viewPositionEnd;
        this.viewDistance = this.viewPositionEnd ? Cesium.Cartesian3.distance(this.viewPosition, this.viewPositionEnd) : (options.viewDistance || 100.0);
        this.viewHeading = this.viewPositionEnd ? this.getHeading(this.viewPosition, this.viewPositionEnd) : (options.viewHeading || 0.0);
        this.viewPitch = this.viewPositionEnd ? this.getPitch(this.viewPosition, this.viewPositionEnd) : (options.viewPitch || 0.0);
        this.horizontalViewAngle = options.horizontalViewAngle || 90.0;
        this.verticalViewAngle = options.verticalViewAngle || 60.0;
        this.shadowVisibleColor = options.shadowVisibleColor || "rgba(0,255,0,0.5)";
        this.inshadowVisibleColor = options.inshadowVisibleColor || "rgba(255,0,0,0.5)";
        this.coneFillColor = options.coneFillColor || "rgba(61,153,250,0.3)";
        this.coneOutlineColor = options.coneOutlineColor || "rgba(61,153,250,0.8)";

        this.enabled = (typeof options.enabled === "boolean") ? options.enabled : true;
        this.softShadows = (typeof options.softShadows === "boolean") ? options.softShadows : true;
        this.size = options.size || 2048;


        this.clear();
        this.createLightCamera();
        this.createShadowMap();
        this.createPostStage();
        this.drawFrustumOutline();
        this.drawSketch();
    }


    /** 
     * 更新方法。
     * @param {Object} [options] 选项。
     * @param {Cesium.Cartesian3} [options.viewPositionEnd] 最远观测点位置（如果设置了观测距离，这个属性可以不设置）。
     * @param {Number} [options.viewDistance=100] 观测距离（单位`米`，默认值100）。
     * @param {Number} [options.viewHeading=0] 航向角（单位`度`，默认值0）。
     * @param {Number} [options.viewPitch=0] 俯仰角（单位`度`，默认值0）。
     * @param {Number} [options.horizontalViewAngle=90] 可视域水平夹角（单位`度`，默认值90）。
     * @param {Number} [options.verticalViewAngle=60] 可视域垂直夹角（单位`度`，默认值60）。
     * @param {String} [options.shadowVisibleColor="rgba(0,255,0,0.5)"] 可视区域颜色（默认值`绿色`）。
     * @param {String} [options.inshadowVisibleColor="rgba(255,0,0,0.5)"] 不可视区域颜色（默认值`红色`）。
     * @param {String} [options.coneFillColor="rgba(61,153,250,0.3)"] - 视锥体填充颜色
     * @param {String} [options.coneOutlineColor="rgba(61,153,250,0.8)"] - 视锥体轮廓线条颜色
     * @param {Boolean} [options.enabled] 阴影贴图是否可用。
     * @param {Boolean} [options.softShadows] 是否启用柔和阴影。
     * @param {Boolean} [options.size] 每个阴影贴图的大小。
     */
    update (options) {

        this.viewPositionEnd = options.viewPositionEnd;
        this.viewDistance = this.viewPositionEnd ? Cesium.Cartesian3.distance(this.viewPosition, this.viewPositionEnd) : (options.viewDistance || 100.0);
        this.viewHeading = this.viewPositionEnd ? this.getHeading(this.viewPosition, this.viewPositionEnd) : (options.viewHeading || 0.0);
        this.viewPitch = this.viewPositionEnd ? this.getPitch(this.viewPosition, this.viewPositionEnd) : (options.viewPitch || 0.0);
        this.horizontalViewAngle = options.horizontalViewAngle || 90.0;
        this.verticalViewAngle = options.verticalViewAngle || 60.0;
        this.shadowVisibleColor = options.shadowVisibleColor || "rgba(0,255,0,0.5)";
        this.inshadowVisibleColor = options.inshadowVisibleColor || "rgba(255,0,0,0.5)";
        this.coneFillColor = options.coneFillColor || "rgba(61,153,250,0.3)";
        this.coneOutlineColor = options.coneOutlineColor || "rgba(255,255,255,0.8)";
        this.enabled = (typeof options.enabled === "boolean") ? options.enabled : true;
        this.softShadows = (typeof options.softShadows === "boolean") ? options.softShadows : true;
        this.size = options.size || 2048;
        //  console.log(options)
        this.createLightCamera();
        this.createShadowMap();
        this.createPostStage();

        return {
            viewPosition: this.viewPosition,
            viewPositionEnd: this.viewPositionEnd,
            viewDistance: this.viewDistance,
            viewHeading: this.viewHeading,
            viewPitch: this.viewPitch,
            horizontalViewAngle: this.horizontalViewAngle,
            verticalViewAngle: this.verticalViewAngle,
            shadowVisibleColor: this.shadowVisibleColor,
            inshadowVisibleColor: this.inshadowVisibleColor,
        }
    }



    /**
     * 清空
     */
    clear () {

        this.sketch && this.viewer.entities.remove(this.sketch);
        this.sketch && (this.sketch = undefined);


        this.frustumOutline && this.viewer.entities.remove(this.frustumOutline)
        this.frustumOutline && (this.frustumOutline = undefined);


        this.postStage && this.viewer.scene.postProcessStages.remove(this.postStage);
        this.postStage && (this.postStage = undefined);

        this.lightCamera && (this.lightCamera = undefined);
        this.shadowMap && (this.shadowMap = undefined);

    }


    /**
     * @private
     */
    createLightCamera () {



        this.lightCamera = this.lightCamera || new Cesium.Camera(this.viewer.scene);
        this.lightCamera.position = this.viewPosition;
        this.lightCamera.frustum.near = this.viewDistance * 0.00001;
        this.lightCamera.frustum.far = this.viewDistance;

        let hr = Cesium.Math.toRadians(this.horizontalViewAngle);
        let vr = Cesium.Math.toRadians(this.verticalViewAngle);
        // 视锥的宽度与高度的纵横比
        let aspectRatio =
            (this.viewDistance * Math.tan(hr / 2) * 2) /
            (this.viewDistance * Math.tan(vr / 2) * 2);
        this.lightCamera.frustum.aspectRatio = aspectRatio;
        this.lightCamera.frustum.fov = ((hr > vr) ? hr : vr);
        this.lightCamera.setView({
            destination: this.viewPosition,
            orientation: {
                heading: Cesium.Math.toRadians(this.viewHeading || 0),
                pitch: Cesium.Math.toRadians(this.viewPitch || 0),
                roll: 0
            }
        });

        // hr = undefined;
        // vr = undefined;
        // aspectRatio = undefined;


    }

    /**
     * @private
     */
    createShadowMap () {

        if (!this.shadowMap) {
            this.shadowMap = new Cesium.ShadowMap(
                {
                    context: (this.viewer.scene).context,
                    lightCamera: this.lightCamera,
                    enabled: this.enabled,
                    isPointLight: true,
                    pointLightRadius: this.viewDistance,
                    cascadesEnabled: false,
                    size: this.size,
                    softShadows: this.softShadows,
                    normalOffset: false,
                    fromLightSource: false
                });
            this.viewer.scene.shadowMap = this.shadowMap;
        } else {
            this.viewer.scene.shadowMap._pointLightRadius = this.viewDistance;
            this.viewer.scene.shadowMap._softShadows = this.softShadows;
            this.viewer.scene.shadowMap._enabled = this.enabled;
            this.viewer.scene.shadowMap._lightCamera = this.lightCamera;
        }
    }

    /**
     * @private
     */
    createPostStage () {
        let fs = `
        #define USE_CUBE_MAP_SHADOW true
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        varying vec2 v_textureCoordinates;
        //varying
        uniform mat4 camera_projection_matrix;
        uniform mat4 camera_view_matrix;
        uniform samplerCube shadowMap_textureCube;
        uniform mat4 shadowMap_matrix;
        uniform vec4 shadowMap_lightPositionEC;
        uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
        uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;
        uniform float helsing_viewDistance; 
        uniform vec4 helsing_shadowVisibleColor;
        uniform vec4 helsing_inshadowVisibleColor;
        
        struct zx_shadowParameters
        {
            vec3 texCoords;
            float depthBias;
            float depth;
            float nDotL;
            vec2 texelStepSize;
            float normalShadingSmooth;
            float darkness;
        };
        
        float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters)
        {
            float depthBias = shadowParameters.depthBias;
            float depth = shadowParameters.depth;
            float nDotL = shadowParameters.nDotL;
            float normalShadingSmooth = shadowParameters.normalShadingSmooth;
            float darkness = shadowParameters.darkness;
            vec3 uvw = shadowParameters.texCoords;
            depth -= depthBias;
            float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
            return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
        }
        
        vec4 getPositionEC(){
            return czm_windowToEyeCoordinates(gl_FragCoord);
        }
        
        vec3 getNormalEC(){
            return vec3(1.);
        }
        
        vec4 toEye(in vec2 uv,in float depth){
            vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
            vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
            posInCamera=posInCamera/posInCamera.w;
            return posInCamera;
        }
        
        vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point){
            vec3 v01=point-planeOrigin;
            float d=dot(planeNormal,v01);
            return(point-planeNormal*d);
        }
        
        float getDepth(in vec4 depth){
            float z_window=czm_unpackDepth(depth);
            z_window=czm_reverseLogDepth(z_window);
            float n_range=czm_depthRange.near;
            float f_range=czm_depthRange.far;
            return(2.*z_window-n_range-f_range)/(f_range-n_range);
        }
        
        float shadow(in vec4 positionEC){
            vec3 normalEC=getNormalEC();
            zx_shadowParameters shadowParameters;
            shadowParameters.texelStepSize=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
            shadowParameters.depthBias=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
            shadowParameters.normalShadingSmooth=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
            shadowParameters.darkness=shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
            vec3 directionEC=positionEC.xyz-shadowMap_lightPositionEC.xyz;
            float distance=length(directionEC);
            directionEC=normalize(directionEC);
            float radius=shadowMap_lightPositionEC.w;
            if(distance>radius)
            {
                return 2.0;
            }
            vec3 directionWC=czm_inverseViewRotation*directionEC;
            shadowParameters.depth=distance/radius-0.0003;
            shadowParameters.nDotL=clamp(dot(normalEC,-directionEC),0.,1.);
            shadowParameters.texCoords=directionWC;
            float visibility=czm_shadowVisibility(shadowMap_textureCube,shadowParameters);
            return visibility;
        }
        
        bool visible(in vec4 result)
        {
            result.x/=result.w;
            result.y/=result.w;
            result.z/=result.w;
            return result.x>=-1.&&result.x<=1.
            &&result.y>=-1.&&result.y<=1.
            &&result.z>=-1.&&result.z<=1.;
        }
        
        void main(){
            // 釉色 = 结构二维(颜色纹理, 纹理坐标)
            gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
            // 深度 = 获取深度(结构二维(深度纹理, 纹理坐标))
            float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));
            // 视角 = (纹理坐标, 深度)
            vec4 viewPos = toEye(v_textureCoordinates, depth);
            // 世界坐标
            vec4 wordPos = czm_inverseView * viewPos;
            // 虚拟相机中坐标
            vec4 vcPos = camera_view_matrix * wordPos;
            float near = .001 * helsing_viewDistance;
            float dis = length(vcPos.xyz);
            if(dis > near && dis < helsing_viewDistance){
                // 透视投影
                vec4 posInEye = camera_projection_matrix * vcPos;
                // 可视区颜色
                // vec4 helsing_shadowVisibleColor=vec4(0.,1.,0.,.5);
                // vec4 helsing_inshadowVisibleColor=vec4(1.,0.,0.,.5);
                if(visible(posInEye)){
                    float vis = shadow(viewPos);
                    if(vis > 0.3){
                        gl_FragColor = mix(gl_FragColor,helsing_shadowVisibleColor,.5);
                    } else{
                        gl_FragColor = mix(gl_FragColor,helsing_inshadowVisibleColor,.5);
                    }
                }
            }
        }`;
        this.postStage && this.viewer.scene.postProcessStages.remove(this.postStage);


        let uniforms = {
            shadowMap_textureCube: () => {
                this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                return Reflect.get(this.shadowMap, "_shadowMapTexture");
            },
            shadowMap_matrix: () => {
                this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                return Reflect.get(this.shadowMap, "_shadowMapMatrix");
            },
            shadowMap_lightPositionEC: () => {
                this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                return Reflect.get(this.shadowMap, "_lightPositionEC");
            },
            shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
                this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                const bias = this.shadowMap._pointBias;
                return Cesium.Cartesian4.fromElements(
                    bias.normalOffsetScale,
                    this.shadowMap._distance,
                    this.shadowMap.maximumDistance,
                    0.0,
                    new Cesium.Cartesian4()
                );
            },
            shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
                this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                const bias = this.shadowMap._pointBias;
                const scratchTexelStepSize = new Cesium.Cartesian2();
                const texelStepSize = scratchTexelStepSize;
                texelStepSize.x = 1.0 / this.shadowMap._textureSize.x;
                texelStepSize.y = 1.0 / this.shadowMap._textureSize.y;

                return Cesium.Cartesian4.fromElements(
                    texelStepSize.x,
                    texelStepSize.y,
                    bias.depthBias,
                    bias.normalShadingSmooth,
                    new Cesium.Cartesian4()
                );
            },
            camera_projection_matrix: this.lightCamera.frustum.projectionMatrix,
            camera_view_matrix: this.lightCamera.viewMatrix,
            helsing_viewDistance: () => {
                return this.viewDistance;
            },
            helsing_shadowVisibleColor: Cesium.Color.fromCssColorString(this.shadowVisibleColor),
            helsing_inshadowVisibleColor: Cesium.Color.fromCssColorString(this.inshadowVisibleColor),
        }

        const postStage = new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: uniforms
        });

        this.postStage = this.viewer.scene.postProcessStages.add(postStage);
    }


    /**
     * @private
     */
    drawFrustumOutline () {
        this.frustumOutline = this.viewer.entities.add({
            name: "frustumOutline",
            position: this.viewPosition,
            orientation: new Cesium.CallbackProperty(() => {
                return Cesium.Transforms.headingPitchRollQuaternion(
                    this.viewPosition,
                    Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading + 270, this.viewPitch, 0)
                )
            }, false),
            ellipsoid: {
                radii: new Cesium.CallbackProperty(() => {
                    return new Cesium.Cartesian3(
                        this.viewDistance,
                        this.viewDistance,
                        this.viewDistance)
                }, false),
                innerRadii: new Cesium.Cartesian3(1.0, 1.0, 1.0),
                minimumClock: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(-this.horizontalViewAngle / 2) }, false),
                maximumClock: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(this.horizontalViewAngle / 2) }, false),
                minimumCone: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(this.verticalViewAngle + 7.75) }, false),
                maximumCone: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(180 - this.verticalViewAngle - 7.75) }, false),
                material: Cesium.Color.GREEN.withAlpha(0),
                outline: true,
                outlineColor: new Cesium.CallbackProperty(() => { return Cesium.Color.fromCssColorString(this.coneOutlineColor) }, false),
            },
        });

    }


    /**
         * @private
         */
    drawSketch () {
        this.sketch = this.viewer.entities.add({
            name: "sketch",
            position: this.viewPosition,
            orientation: new Cesium.CallbackProperty(() => {
                return Cesium.Transforms.headingPitchRollQuaternion(
                    this.viewPosition,
                    Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading + 270, this.viewPitch, 0)
                )
            }, false),
            ellipsoid: {
                radii: new Cesium.CallbackProperty(() => {
                    return new Cesium.Cartesian3(this.viewDistance,
                        this.viewDistance,
                        this.viewDistance)
                }, false),
                minimumClock: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(-this.horizontalViewAngle / 2) }, false),
                maximumClock: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(this.horizontalViewAngle / 2) }, false),
                minimumCone: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(this.verticalViewAngle + 7.75) }, false),
                maximumCone: new Cesium.CallbackProperty(() => { return Cesium.Math.toRadians(180 - this.verticalViewAngle - 7.75) }, false),
                material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(this.coneFillColor)),
                outline: true,
                subdivisions: 64,
                stackPartitions: 32,
                slicePartitions: 32,
                outlineColor: new Cesium.CallbackProperty(() => { return Cesium.Color.fromCssColorString(this.coneOutlineColor) }, false),
            },
        });

    }

    /**
     * @private
     */
    getHeading (fromPosition, toPosition) {
        let finalPosition = new Cesium.Cartesian3();
        let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
        Cesium.Matrix4.inverse(matrix4, matrix4);
        Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
        Cesium.Cartesian3.normalize(finalPosition, finalPosition);
        return Cesium.Math.toDegrees(Math.atan2(finalPosition.x, finalPosition.y));
    }

    /**
     * @private
     */
    getPitch (fromPosition, toPosition) {
        let finalPosition = new Cesium.Cartesian3();
        let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
        Cesium.Matrix4.inverse(matrix4, matrix4);
        Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
        Cesium.Cartesian3.normalize(finalPosition, finalPosition);
        return Cesium.Math.toDegrees(Math.asin(finalPosition.z));
    }
}



export default ViewShed;
