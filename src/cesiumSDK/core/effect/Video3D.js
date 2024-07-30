import ECEF from './CoordinateTranslate';
import MyVideo from './Video';
import * as Cesium from "cesium";
let videoShed3dShader =
    "\r\n\r\n\r\n\r\nuniform float mixNum;\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D stcshadow; \r\nuniform sampler2D videoTexture;\r\nuniform sampler2D depthTexture;\r\nuniform mat4 _shadowMap_matrix; \r\nuniform vec4 shadowMap_lightPositionEC; \r\nuniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness; \r\nuniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth; \r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nfloat _czm_sampleShadowMap(sampler2D shadowMap, vec2 uv){\r\n    return texture2D(shadowMap, uv).r;\r\n}\r\nfloat _czm_shadowDepthCompare(sampler2D shadowMap, vec2 uv, float depth){\r\n    return step(depth, _czm_sampleShadowMap(shadowMap, uv));\r\n}\r\nfloat _czm_shadowVisibility(sampler2D shadowMap, czm_shadowParameters shadowParameters){\r\n    float depthBias = shadowParameters.depthBias;\r\n    float depth = shadowParameters.depth;\r\n    float nDotL = shadowParameters.nDotL;\r\n    float normalShadingSmooth = shadowParameters.normalShadingSmooth;\r\n    float darkness = shadowParameters.darkness;\r\n    vec2 uv = shadowParameters.texCoords;\r\n    depth -= depthBias;\r\n    vec2 texelStepSize = shadowParameters.texelStepSize;\r\n    float radius = 1.0;\r\n    float dx0 = -texelStepSize.x * radius;\r\n    float dy0 = -texelStepSize.y * radius;\r\n    float dx1 = texelStepSize.x * radius;\r\n    float dy1 = texelStepSize.y * radius;\r\n    float visibility = \r\n    (\r\n    _czm_shadowDepthCompare(shadowMap, uv, depth)\r\n    +_czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy1), depth)\r\n    ) * (1.0 / 9.0)\r\n    ;\r\n    return visibility;\r\n}\r\nvec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\r\n    vec3 v01 = point -planeOrigin;\r\n    float d = dot(planeNormal, v01) ;\r\n    return (point - planeNormal * d);\r\n}\r\nfloat ptm(vec3 pt){\r\n    return sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z);\r\n}\r\nvoid main() \r\n{ \r\n    const float PI = 3.141592653589793;\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    \r\n    float depth = getDepth(currD);\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 normalEC = vec3(1.0);\r\n    czm_shadowParameters shadowParameters; \r\n    shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy; \r\n    shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z; \r\n    shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w; \r\n    shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w; \r\n    shadowParameters.depthBias *= max(depth * 0.01, 1.0); \r\n    vec3 directionEC = normalize(positionEC.xyz - shadowMap_lightPositionEC.xyz); \r\n    float nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); \r\n    vec4 shadowPosition = _shadowMap_matrix * positionEC; \r\n    shadowPosition /= shadowPosition.w; \r\n    if (any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) \r\n    { \r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    shadowParameters.texCoords = shadowPosition.xy; \r\n    shadowParameters.depth = shadowPosition.z; \r\n    shadowParameters.nDotL = nDotL; \r\n    float visibility = _czm_shadowVisibility(stcshadow, shadowParameters); \r\n\r\n    vec4 videoColor = texture2D(videoTexture,shadowPosition.xy);\r\n    if(visibility==1.0){\r\n        gl_FragColor = mix(color,vec4(videoColor.xyz,1.0),mixNum*videoColor.a);\r\n    }else{\r\n        if(abs(shadowPosition.z-0.0)<0.01){\r\n            return;\r\n        }\r\n        gl_FragColor = color;\r\n    }\r\n} ";

let Video3D = (function () {

    let videoShed3d = function (viewer, param) {

        this.ECEF = new ECEF();
        this.param = param;
        let option = this._initCameraParam();
        this.optionType = {
            Color: 1,
            Image: 2,
            Video: 3,
        };
        this._positinInLonLatHeight = { ...param.position };
        this.near = option.near ? option.near : 0.1;
        // eslint-disable-next-line
        if (
            (option || (option = {}),
                (this.viewer = viewer),
                (this._cameraPosition = option.cameraPosition),
                (this._position = option.position),
                (this.type = option.type),
                (this._alpha = option.alpha || 1),
                (this.url = option.url),
                (this._gradientBandWidth = param.gradientBandWidth || 0.1), //模糊环的半径，0-1之间
                (this._outerWidth = param.outerWidth || 0.43), //模糊环的半径，0-1之间
                (this._sideOuterWidth = param.sideOuterWidth || [0.0, 0.0, 0.0, 0.0]), //模糊环的半径，0-1之间
                (this._clipPositions = param.clipPositions && param.clipPositions.length ? param.clipPositions : [[1, 1, 1]]), //裁剪区域的点，默认为空数组，长度小于3默认不裁剪
                (this._clipEnabled = typeof param.clipEnabled !== 'undefined' ? param.clipEnabled : true), //是否开启裁剪。默认开启
                (this._clipKeepOut = typeof param.clipKeepOut !== 'undefined' ? param.clipKeepOut : true), //裁剪内部的，保留外部的，默认保留外部的
                (this.color = option.color),
                (this._debugFrustum = Cesium.defaultValue(option.debugFrustum, !0)),
                (this._aspectRatio = option.aspectRatio || this._getWinWidHei()),
                (this._camerafov = option.fov || Cesium.Math.toDegrees(this.viewer.scene.camera.frustum.fov)),
                (this.texture =
                    option.texture ||
                    new Cesium.Texture({
                        context: this.viewer.scene.context,
                        source: {
                            width: 1,
                            height: 1,
                            arrayBufferView: new Uint8Array([255, 255, 255, 255]),
                        },
                        flipY: !1,
                    })),
                (this._videoPlay = Cesium.defaultValue(option.videoPlay, !0)),
                (this.defaultShow = Cesium.defaultValue(option.show, !0)),
                !this.cameraPosition || !this.position)
        )
            return void console.log('初始化失败：请确认相机位置与视点位置正确!');
        switch (this.type) {
            default:
            case this.optionType.Video:
                this.activeVideo(this.url);
                break;
            case this.optionType.Image:
                this.activePicture(this.url);
                this.deActiveVideo();
                break;
            case this.optionType.Color:
                this.activeColor(this.color);
                this.deActiveVideo();
        }
        this._createShadowMap();
        this._getOrientation();
        this._addCameraFrustum();
        this._addPostProcess();
        this.viewer.scene.primitives.add(this);
    };
    Object.defineProperties(videoShed3d.prototype, {
        alpha: {
            get: function () {
                return this._alpha;
            },
            set: function (e) {
                return (this._alpha = e);
            },
        },
        //设置裁剪区域
        clipPositions: {
            get: function () {
                return this._clipPositions;
            },
            set: function (e) {
                this._clipPositions = e.length === 0 ? [[1, 1, 1]] : e;
                this.viewer.scene.postProcessStages.remove(this.postProcess);
                this._addPostProcess();
            },
        },
        clipEnabled: {
            get: function () {
                return this._clipEnabled;
            },
            set: function (e) {
                this._clipEnabled = e;
            },
        },
        sideOuterWidth: {
            get: function () {
                return this._sideOuterWidth;
            },
            set: function (e) {
                this._sideOuterWidth = e;
            },
        },
        clipKeepOut: {
            get: function () {
                return this._clipKeepOut;
            },
            set: function (e) {
                this._clipKeepOut = e;
            },
        },
        gradientBandWidth: {
            get: function () {
                return this._gradientBandWidth;
            },
            set: function (e) {
                this._gradientBandWidth = e;
            },
        },
        outerWidth: {
            get: function () {
                return this._outerWidth;
            },
            set: function (e) {
                return (this._outerWidth = e);
            },
        },
        aspectRatio: {
            get: function () {
                return this._aspectRatio;
            },
            set: function (e) {
                this._aspectRatio = e;
                this._changeVideoWidHei();
            },
        },
        debugFrustum: {
            get: function () {
                return this._debugFrustum;
            },
            set: function (e) {
                this._debugFrustum = e;
                this.cameraFrustum.show = e;
            },
        },
        fov: {
            get: function () {
                return this._camerafov;
            },
            set: function (e) {
                this._camerafov = e;
                this._changeCameraFov();
            },
        },
        cameraPosition: {
            get: function () {
                return this._cameraPosition;
            },
            set: function (e) {
                if (e) {
                    this._cameraPosition = e;
                    this._changeCameraPos();
                }
            },
        },
        position: {
            get: function () {
                return this._position;
            },
            set: function (e) {
                if (e) {
                    this._position = e;
                    this._changeViewPos();
                }
            },
        },
        videoPlay: {
            get: function () {
                return this._videoPlay;
            },
            set: function (e) {
                this._videoPlay = Boolean(e);
                this._videoEle && (this.videoPlay ? this._videoEle.play() : this._videoEle.pause());
            },
        },
        myParams: {
            get: function () {
                return {
                    url: this.url,
                    position: this._positinInLonLatHeight,
                    fov: this.fov,
                    debugFrustum: this.debugFrustum,
                    rotation: this.param.rotation,
                    far: this.param.far,
                    near: this.near,
                    show: this.show,
                    videoPlay: this.videoPlay,
                    outerWidth: Math.max(this.outerWidth, 0),
                    clipEnabled: this.clipEnabled,
                    sideOuterWidth: this.sideOuterWidth,
                    gradientBandWidth: this.gradientBandWidth,
                    clipKeepOut: this.clipKeepOut,
                    clipPositions: this.clipPositions.length == 1 ? [] : [...this.clipPositions],
                };
            },
        },
        params: {
            get: function () {
                let t = {};
                // eslint-disable-next-line
                return (
                    (t.type = this.type),
                    this.type === this.optionType.Color ? (t.color = this.color) : (t.url = this.url),
                    (t.position = this.position),
                    (t.cameraPosition = this.cameraPosition),
                    (t.fov = this.fov),
                    (t.aspectRatio = this.aspectRatio),
                    (t.alpha = this.alpha),
                    (t.debugFrustum = this.debugFrustum),
                    (t.rotation = this.rotation),
                    (t.far = this.far),
                    (t.near = this.near),
                    (t.show = this.show),
                    (t.videoPlay = this.videoPlay),
                    (t.outerWidth = this.outerWidth),
                    (t.clipEnabled = this.clipEnabled),
                    (t.clipKeepOut = this.clipKeepOut),
                    (t.clipPositions = [...this.clipPositions]),
                    t
                );
            },
        },
        show: {
            get: function () {
                return this.defaultShow;
            },
            set: function (e) {
                this.defaultShow = Boolean(e);
                this._switchShow();
            },
        },
    });
    videoShed3d.prototype._initCameraParam = function () {
        let viewPoint = this.ECEF.enu_to_ecef(
            {
                longitude: this.param.position.x * 1,
                latitude: this.param.position.y * 1,
                altitude: this.param.position.z * 1,
            },
            {
                distance: this.param.far,
                azimuth: this.param.rotation.y * 1,
                elevation: this.param.rotation.x * 1,
            }
        );

        let position = Cesium.Cartesian3.fromDegrees(viewPoint.longitude, viewPoint.latitude, viewPoint.altitude);
        let cameraPosition = Cesium.Cartesian3.fromDegrees(this.param.position.x * 1, this.param.position.y * 1, this.param.position.z * 1);

        return {
            type: 3,
            url: this.param.url,
            cameraPosition: cameraPosition,
            position: position,
            alpha: this.param.alpha,
            near: this.param.near,
            fov: this.param.fov,
            debugFrustum: this.param.debugFrustum,
        };
    };
    /**
     * 旋转
     */
    videoShed3d.prototype._changeRotation = function (e) {
        if (e) {
            this.param.rotation = e;
            let option = this._initCameraParam();
            this.position = option.position;
        }
    };
    /**
     * 相机位置
     */
    videoShed3d.prototype._changeCameraPosition = function (e) {
        if (e) {
            this.param.position = e;
            this._positinInLonLatHeight = { ...e };
            let option = this._initCameraParam();
            this.cameraPosition = option.cameraPosition;
        }
    };
    videoShed3d.prototype._changeFar = function (e) {
        if (e) {
            this.param.far = e;
            let option = this._initCameraParam();
            this.position = option.position;
        }
    };
    videoShed3d.prototype._changeNear = function (e) {
        if (e) {
            this.param.near = e;
            this.near = this.param.near;
            this._changeCameraPos();
        }
    };
    /**获取三维地图容器像素大小
     */
    videoShed3d.prototype._getWinWidHei = function () {
        let viewer = this.viewer.scene;
        return viewer.canvas.clientWidth / viewer.canvas.clientHeight;
    };
    videoShed3d.prototype._changeCameraFov = function () {
        this.viewer.scene.postProcessStages.remove(this.postProcess);
        this.viewer.scene.primitives.remove(this.cameraFrustum);
        this._createShadowMap(this.cameraPosition, this.position);
        this._getOrientation();
        this._addCameraFrustum();
        this._addPostProcess();
    };
    videoShed3d.prototype._changeVideoWidHei = function () {
        this.viewer.scene.postProcessStages.remove(this.postProcess);
        this.viewer.scene.primitives.remove(this.cameraFrustum);
        this._createShadowMap(this.cameraPosition, this.position);
        this._getOrientation();
        this._addCameraFrustum();
        this._addPostProcess();
    };
    videoShed3d.prototype._changeCameraPos = function () {
        this.viewer.scene.postProcessStages.remove(this.postProcess);
        this.viewer.scene.primitives.remove(this.cameraFrustum);
        this.viewShadowMap.destroy();
        // this.cameraFrustum.destroy();
        this._createShadowMap(this.cameraPosition, this.position);
        this._getOrientation();
        this._addCameraFrustum();
        this._addPostProcess();
    };
    videoShed3d.prototype._changeViewPos = function () {
        this.viewer.scene.postProcessStages.remove(this.postProcess);
        this.viewer.scene.primitives.remove(this.cameraFrustum);
        this.viewShadowMap.destroy();
        // this.cameraFrustum.destroy();
        this._createShadowMap(this.cameraPosition, this.position);
        this._getOrientation();
        this._addCameraFrustum();
        this._addPostProcess();
    };
    videoShed3d.prototype._switchShow = function () {
        if (this.show) {
            !this.postProcess && this._addPostProcess();
        } else {
            this.viewer.scene.postProcessStages.remove(this.postProcess);
            delete this.postProcess;
            this.postProcess = null;
        }
        this.cameraFrustum.show = this.show;
    };
    /** 创建视频Element
     * @param {String} url 视频地址
     **/
    videoShed3d.prototype._createVideoEle = function (url) {
        this.videoId = 'visualDomId';
        // const myVideo = new MyVideo({ src: url, id: this.videoId })
        this._videoEle = new MyVideo({ src: url, id: this.videoId });
        return this._videoEle;
    };
    /** 视频投射
     * @param {String} url 视频地址
     */
    videoShed3d.prototype.activeVideo = function (url) {
        const video = this._createVideoEle(url);
        const that = this;
        const { viewer } = that;
        if (video) {
            this.type = that.optionType.Video;
            if (!this.activeVideoListener) {
                this.activeVideoListener = function () {
                    that.videoTexture && that.videoTexture.destroy();
                    that.videoTexture = new Cesium.Texture({
                        context: viewer.scene.context,
                        source: video.videoElement,
                        width: 1,
                        height: 1,
                        pixelFormat: Cesium.PixelFormat.RGBA,
                        pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                    });
                };
            }
            viewer.clock.onTick.addEventListener(this.activeVideoListener);
        }
    };
    videoShed3d.prototype.deActiveVideo = function () {
        if (this.activeVideoListener) {
            this.viewer.clock.onTick.removeEventListener(this.activeVideoListener);
            delete this.activeVideoListener;
        }
    };
    /** 图片投放
     * @param {String} url 图片地址
     **/
    videoShed3d.prototype.activePicture = function (url) {
        this.videoTexture = this.texture;
        let that = this,
            img = new Image();
        img.onload = function () {
            that.type = that.optionType.Image;
            that.videoTexture = new Cesium.Texture({
                context: that.viewer.scene.context,
                source: img,
            });
        };
        img.onerror = function () {
            console.log('图片加载失败:' + url);
        };
        img.src = url;
    };
    videoShed3d.prototype.locate = function () {
        let cameraPosition = Cesium.clone(this.cameraPosition),
            position = Cesium.clone(this.position);
        this.viewer.Camera.position = cameraPosition;
        this.viewer.camera.direction = Cesium.Cartesian3.subtract(position, cameraPosition, new Cesium.Cartesian3(0, 0, 0));
        this.viewer.camera.up = Cesium.Cartesian3.normalize(cameraPosition, new Cesium.Cartesian3(0, 0, 0));
    };
    videoShed3d.prototype.update = function (e) {
        this.viewShadowMap && this.viewer.scene.frameState.shadowMaps.push(this.viewShadowMap); // *重点* 多投影
    };
    videoShed3d.prototype.destroy = function () {
        this.viewer.scene.postProcessStages.remove(this.postProcess);
        this.viewer.scene.primitives.remove(this.cameraFrustum);
        //this._videoEle && this._videoEle.parentNode.removeChild(this._videoEle),
        // this.activeVideoListener && this.viewer.clock.onTick.removeEventListener(this.activeVideoListener),
        // this.activeVideoListener && delete this.activeVideoListener,
        if (this.activeVideoListener) this.viewer.clock.onTick.removeEventListener(this.activeVideoListener);
        if (this.activeVideoListener) delete this.activeVideoListener;
        delete this.postProcess;
        delete this.viewShadowMap;
        delete this.color;
        delete this.viewDis;
        delete this.cameraPosition;
        delete this.position;
        delete this.alpha;
        delete this._camerafov;
        delete this._cameraPosition;
        delete this.videoTexture;
        delete this.cameraFrustum;
        this._videoEle.destroy();
        delete this._debugFrustum;
        delete this._position;
        delete this._aspectRatio;
        delete this.url;
        delete this.orientation;
        delete this.texture;
        delete this.videoId;
        delete this.type;
        this.viewer.scene.primitives.remove(this);
        delete this.viewer;
    };
    // 创建shadowmap
    videoShed3d.prototype._createShadowMap = function () {
        let e = this.cameraPosition,
            t = this.position,
            i = this.viewer.scene,
            a = new Cesium.Camera(i);
        a.position = e;
        a.direction = Cesium.Cartesian3.subtract(t, e, new Cesium.Cartesian3(0, 0, 0)); //计算两个笛卡尔的组分差异。
        a.up = Cesium.Cartesian3.normalize(e, new Cesium.Cartesian3(0, 0, 0)); // 归一化
        let n = Cesium.Cartesian3.distance(t, e);
        this.viewDis = n;
        a.frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(this.fov),
            aspectRatio: this.aspectRatio,
            near: this.near,
            far: n,
        });
        this.viewShadowMap = new Cesium.ShadowMap({
            lightCamera: a,
            enable: !1,
            isPointLight: !1,
            isSpotLight: !0,
            cascadesEnabled: !1,
            context: i.context,
            pointLightRadius: n,
            darkness: 0.8,
            softShadows: true,
        });
    };
    // 获取shadowmap位置
    videoShed3d.prototype._getOrientation = function () {
        let e = this.cameraPosition,
            t = this.position,
            i = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(t, e, new Cesium.Cartesian3()), new Cesium.Cartesian3()),
            a = Cesium.Cartesian3.normalize(e, new Cesium.Cartesian3()),
            n = new Cesium.Camera(this.viewer.scene);
        n.position = e;
        n.direction = i;
        n.up = a;
        i = n.directionWC;
        a = n.upWC;
        let r = n.rightWC,
            o = new Cesium.Cartesian3(),
            l = new Cesium.Matrix3(),
            u = new Cesium.Quaternion();
        r = Cesium.Cartesian3.negate(r, o);
        let d = l;
        Cesium.Matrix3.setColumn(d, 0, r, d);
        Cesium.Matrix3.setColumn(d, 1, a, d);
        Cesium.Matrix3.setColumn(d, 2, i, d);
        let c = Cesium.Quaternion.fromRotationMatrix(d, u);

        return (this.orientation = c), c;
    };
    videoShed3d.prototype.creacteGeometry = function (width, height) {
        let hwidth = width / 2.0;
        let hheigt = height / 2.0;
        let positions = new Float64Array([hwidth, 0.0, hheigt, -hwidth, 0.0, hheigt, -hwidth, 0.0, -hheigt, hwidth, 0.0, -hheigt]);
        let sts = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
        let indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        let ge = this._createGeometry(positions, sts, indices);
        return ge;
    };
    videoShed3d.prototype._createGeometry = function (positions, sts, indices) {
        /* let Cesium = this.Cesium;*/
        return new Cesium.Geometry({
            attributes: {
                position: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions,
                }),
                normal: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 3,
                    values: new Float32Array([255.0, 0.0, 0.0, 255.0, 0.0, 0.0, 255.0, 0.0, 0.0, 255.0, 0.0, 0.0]),
                    // values: new Float32Array([0.0, 0.0, 0.0,0.0, 0.0, 0.0,0.0, 0.0, 0.0,0.0, 0.0, 0.0])
                }),
                st: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 2,
                    values: sts,
                }),
            },
            indices: indices,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            vertexFormat: new Cesium.VertexFormat({
                position: true,
                color: true,
            }),
            boundingSphere: Cesium.BoundingSphere.fromVertices(positions),
        });
    };
    //创建视锥
    videoShed3d.prototype._addCameraFrustum = function () {
        let e = this;
        this.cameraGeometry = new Cesium.FrustumOutlineGeometry({
            origin: e.cameraPosition,
            orientation: e.orientation,
            frustum: this.viewShadowMap._lightCamera.frustum,
            _drawNearPlane: !0,
        });
        this.cameraFrustum = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: this.cameraGeometry,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0, 0.5, 0.5)),
                },
            }),
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: !1,
                flat: !0,
            }),
            asynchronous: !1,
            show: this.debugFrustum && this.show,
        });
        this.viewer.scene.primitives.add(this.cameraFrustum);
    };
    videoShed3d.prototype._addPostProcess = function () {
        let e = this,
            i = e.viewShadowMap._isPointLight ? e.viewShadowMap._pointBias : e.viewShadowMap._primitiveBias;
        const fragmentShader = videoShed3dShader;
        const _blurStep = new Cesium.Cartesian2();
        const render = new Cesium.PostProcessStage({
            fragmentShader: fragmentShader,
            uniforms: {
                mixNum: function () {
                    return e.alpha;
                },
                outerWidth: function () {
                    return e.outerWidth;
                },
                stcshadow: function () {
                    return e.viewShadowMap._shadowMapTexture;
                },
                videoTexture: function () {
                    return e.videoTexture;
                },
                _shadowMap_matrix: function () {
                    return e.viewShadowMap._shadowMapMatrix;
                },
                shadowMap_lightPositionEC: function () {
                    return e.viewShadowMap._lightPositionEC;
                },
                shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: function () {
                    let t = new Cesium.Cartesian2();
                    // eslint-disable-next-line
                    return (
                        (t.x = 1 / e.viewShadowMap._textureSize.x),
                        (t.y = 1 / e.viewShadowMap._textureSize.y),
                        Cesium.Cartesian4.fromElements(t.x, t.y, 0.003 || i.depthBias, i.normalShadingSmooth, this.combinedUniforms1)
                    );
                },
                shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: function () {
                    return Cesium.Cartesian4.fromElements(
                        i.normalOffsetScale,
                        e.viewShadowMap._distance,
                        e.viewShadowMap.maximumDistance,
                        e.viewShadowMap._darkness,
                        this.combinedUniforms2
                    );
                },
                clipPositions: function () {
                    let points = e.clipPositions
                        .map((point) => {
                            let encodedCartesian3 = Cesium.EncodedCartesian3.fromCartesian(new Cesium.Cartesian3(...point));
                            return [encodedCartesian3.high, encodedCartesian3.low];
                        })
                        .flat();
                    return points;
                },
                clipEnabled: function () {
                    return e.clipEnabled;
                },
                clipKeepOut: function () {
                    return e.clipKeepOut;
                },
                sideOuterWidth: function () {
                    return new Cesium.Cartesian4(...e.sideOuterWidth);
                },
                gradientBandWidth: function () {
                    return e.gradientBandWidth;
                },
            },
        });
        this.postProcess = new Cesium.PostProcessStageComposite({
            stages: [render],
            name: 'videoShed3d',
        });
        this.viewer.scene.postProcessStages.add(this.postProcess);
    };
    return videoShed3d;
})();

export default Video3D;
