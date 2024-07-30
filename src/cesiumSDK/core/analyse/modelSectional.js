import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import Validate from "../util/validate";

/**
 * 模型剖面
 */
class ModelSectional extends Analyse {


    /**
     * @member {Cesium.Viewer} viewer对象
     */
    _viewer;

    /**
    * 实例化剖面组件
    * @param {Cesium.Viewer} [viewer] - 3Dtileset模型对象
    * @example
    * 
    *  this.modelSectional = new Speed.ModelSectional(this.viewer);
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
    * 激活剖面组件
    * @param {Cesium.Cesium3DTileset} [tileset] - 3Dtileset模型对象
    * @param {Object} [options] - 属性对象
    * @param {Boolean} [options.mouseControl=true] - true：开启鼠标高度微调。false：关闭鼠标高度微调
    * @param {Number} [options.height=5] - 贴地地球到裁剪平面的高度，单位：米
    * @param {String} [options.color="rgba(255,255,255,0.3)"] - 裁剪平面的填充色
    * @param {String} [options.outlineColor="rgba(255,255,255,0.8)"] - 裁剪平面的边框色
    * @param {Array} [options.box] - 裁剪平面宽度与长度，单位米
    * 
    * @example
    * 
    *  this.modelSectional = this.modelSectional || new Speed.ModelSectional(this.viewer);
       this.modelSectional.activation(this.3Dtileset, {
           color: this.color,
           outlineColor: this.outlineColor,
           box: [100, 200],
           height: 20,
           mouseControl: true,
       });
    */
    activation (tileset, options) {
        this._destroy();


        if (!Cesium.defined(options)) {
            throw new Cesium.DeveloperError('参数缺失.');
        }
        if (!Cesium.defined(tileset) || !(tileset instanceof Cesium.Cesium3DTileset)) {
            throw new Cesium.DeveloperError('参数model异常.');
        }

        this.options = {
            mouseControl: Cesium.defaultValue(options.mouseControl, true),
            color: Cesium.defaultValue(options.color, "rgba(255,255,255,0.3)"),
            outlineColor: Cesium.defaultValue(options.outlineColor, "rgba(255,255,255,0.8)"),
            height: Cesium.defaultValue(options.height, 5),
        }


        let selectedPlane;
        tileset._clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1), 0.0)
            ],
            edgeWidth: 0.0,
            edgeColor: Cesium.Color.BLUE.withAlpha(0.2),
        });

        let plane = tileset._clippingPlanes.get(0);

        // 获取中心
        const boundingSphere = tileset.boundingSphere;
        const radius = boundingSphere.radius;
        const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);

        this.planeEntity = this._viewer.entities.add({
            position: surface,
            plane: {
                dimensions: new Cesium.CallbackProperty(() => {
                    var r = new Cesium.Cartesian2(radius * 2, radius * 2)
                    if (this.options.box) {
                        r = new Cesium.Cartesian2(this.options.box[0] || radius * 2, this.options.box[1] || radius * 2)
                    }
                    return r;
                }, false),
                //dimensions: new Cesium.Cartesian2( radius * 2,  radius * 2),
                material: Cesium.Color.fromCssColorString(this.options.color),
                plane: new Cesium.CallbackProperty(() => {
                    plane.distance = this.options.height;
                    return plane;
                }, false),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString(this.options.outlineColor),
            },
        });


        this.downHandler = this.downHandler || new Cesium.ScreenSpaceEventHandler(
            this._viewer.scene.canvas
        );
        this.downHandler.setInputAction((movement) => {
            if (this.options.mouseControl) {
                var pickedObject = this._viewer.scene.pick(movement.position);
                if (
                    Cesium.defined(pickedObject) &&
                    Cesium.defined(pickedObject.id) &&
                    Cesium.defined(pickedObject.id.plane)
                ) {
                    selectedPlane = pickedObject.id.plane;
                    selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.6);
                    selectedPlane.outlineColor = Cesium.Color.fromCssColorString("#2B99FD");
                    this._viewer.scene.screenSpaceCameraController.enableInputs = false;
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        this.downHandler.setInputAction(() => {
            if (Cesium.defined(selectedPlane) && this.options.mouseControl) {
                selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.3);
                selectedPlane.outlineColor = Cesium.Color.WHITE;
                selectedPlane = undefined;
            }

            this._viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.downHandler.setInputAction((movement) => {

            if (Cesium.defined(selectedPlane) && this.options.mouseControl) {
                var deltaY = movement.startPosition.y - movement.endPosition.y;

                this.options.height += deltaY;

            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    }


    /**
     * 销毁
     * @private
     */
    _destroy () {


        if (this.downHandler) {

            this._viewer.entities.remove(this.planeEntity);
            this.planeEntity = undefined;

            this.downHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.downHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            this.downHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);

            this.options = undefined;
        }
    }

    /**
     * 停止剖面组件
     */
    deactivation () {
        this._destroy();
    }

    /**
     * 属性更新
     * @param {String} [key] - 属性key
     * @param {String} [value] - 值
     * @example
     * 
     * this.modelSectional.setProperty("box",[100,200]);
     */
    setProperty (attribute, value) {
        if (Cesium.defined(attribute) && Cesium.defined(value)) {
            switch (attribute) {
                case "box":
                    this.options.box = value;
                    break;
                case "mouseControl":
                    this.options.mouseControl = value;
                    // this.activation(this.options);
                    break;
                case "height":
                    this.options.height = value;
                    break;
                default:
                    break;
            }
        }

    }

}

export default ModelSectional;
