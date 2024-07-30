import * as Cesium from 'cesium'
import Effect from "./base/effect";
import * as uuid from "uuid";

class VideoMap extends Effect {

    /**
       * @typedef {Object} Viewer - cesium的viewer对象
       */
    _viewer;





    /**
     * 视频贴图
    * @param {Viewer} viewer 地图viewer实例
    */
    constructor(viewer) {
        super(viewer);
        this.init(viewer);
    }



    /**
    * @private
    */
    init (viewer) {
        this._viewer = viewer._viewer || viewer;
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在');



    }

    /**
     * 添加
    * @param {Object} [options] 入参对象
    * @param {Array} [options.positions] 笛卡尔地球坐标系数组坐标
    * @param {String} [options.url] 笛卡尔地球坐标系数组坐标
    * @param {Boolean} [options.autoplay=true] 笛卡尔地球坐标系数组坐标
    * @param {Boolean} [options.loop=true] 笛卡尔地球坐标系数组坐标
    * @param {Number} [options.angle=0] 视频旋转默认0°，正北顺时针360°旋转
    */
    add (options) {
        this.options = options;
        if (!this.options) {
            throw new Cesium.DeveloperError('options不存在');
        }
        if (!this.options.positions) {
            throw new Cesium.DeveloperError('options.positons参数必填');
        }
        if (!this.options.url) {
            throw new Cesium.DeveloperError('options.url参数必填');
        }

        this.options.loop = Cesium.defaultValue(this.options.loop, true);
        this.options.autoplay = Cesium.defaultValue(this.options.autoplay, true);
        this.options.angle = Cesium.defaultValue(this.options.angle, 0);

        this.addVDom();
        this.addVideoEntitie();
        return this.polygon_entitie;
    }

    /**
       * @private
       */
    addVDom () {
        !this.dom_video && (this.dom_video = []);

        let dom_video = document.createElement("video");
        dom_video.autoplay = this.options.autoplay;
        dom_video.loop = this.options.loop;
        dom_video.id = uuid.v4();
        dom_video.crossorigin = true;
        dom_video.controls = true;
        dom_video.style.display = "none";
        dom_video.innerHTML = `
            <source src="${this.options.url}" type="video/mp4"></source>
       
        `;

        (document.getElementsByTagName("body")[0]).appendChild(dom_video);
        this.dom_video.push(dom_video);

    }
    /**
       * @private
       */
    removeDom () {
        

        if (this.dom_video.length > 0) {
            for (let ssv in this.dom_video) {
                this.dom_video[ssv].remove();
            }

            this.dom_video = [];
        }
    }

    /**
     * 播放
     */
    play () {
        for (let ssv in this.dom_video) {
            this.dom_video[ssv].play();
        }
    }

    /**
     * 暂停
     */
    pause () {
        for (let ssv in this.dom_video) {
            this.dom_video[ssv].pause();
        }
    }

    /**
     * 清空
     */
    clear () {

        this.removeVideoEntitie();

        this.removeDom();
    }

    setProperty (property, value) {
        if (!Cesium.defined(property) || !Cesium.defined(value)) {
            throw new Cesium.DeveloperError('参数异常');
        }
        switch (property) {
            case "loop":
                this.options.loop = value;
                break;
            case "autoplay":
                this.options.autoplay = value;
                break;
            case "angle":
                this.options.angle = value;
                break;
            default:
                break;
        }

        for (let ssv in this.dom_video) {
            this.dom_video[ssv].loop = this.options.loop;
            this.dom_video[ssv].autoplay = this.options.autoplay;
        }
    }

    addVideoEntitie () {
        !this.polygon_entitie && (this.polygon_entitie = []);

        this._viewer.showRenderLoopErrors = false;
        this._viewer.shouldAnimate = true;

        let polygon = this._viewer.entities.add({

            polygon: {
                hierarchy: this.options.positions,
                material: this.dom_video[this.dom_video.length - 1],
                clampToGround: true,
                stRotation: new Cesium.CallbackProperty(() => {
                    if (this.options.angle >= 360 || this.options.angle <= -360) {
                        this.options.angle = 0;
                    }
                    return Cesium.Math.toRadians(this.options.angle);
                }, false),
            },
        });


        this.polygon_entitie.push(polygon);

        // 自动播放
        this.options.autoplay && this.dom_video[this.dom_video.length - 1].play();
    }

    /**
     * @private
     */
    removeVideoEntitie () {
        if (this.polygon_entitie) {
            for (let i in this.polygon_entitie) {
                this._viewer.entities.remove(this.polygon_entitie[i]);
            }
        }

        this.polygon_entitie = [];
    }


}

export default VideoMap;

