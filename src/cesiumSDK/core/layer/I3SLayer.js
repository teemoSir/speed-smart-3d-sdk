import * as uuid from "uuid"
import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'




/**
 * I3S三维模型
 */
class I3SLayer extends SpeedLayer {

    /**
     * 加载模型
     * @param {Object} option 参数
     * @param {String} option.id 唯一标识id
     * @param {String} option.url i3s瓦片url
     * @param {Boolean}[option.show=true] 显示
     * @param {Boolean} [option.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域
     * @param {Boolean} [option.backFaceCulling=true] 是否剔除面向背面的几何图形。当为真时，背面剔除由glTF材质的双面属性决定;当为false时，禁用背面剔除
     * @param {Cesium.Cartesian3} [option.lightColor] 光的颜色当遮光模型。当undefined场景的浅色被使用代替。表示，rgb的倍数，new Cesium.Cartesian3(100.0,100.0, 100.0)表示白光增强到100倍。对Pbrt材质有效，倾斜摄影不生效
     * @param {Cesium.ClippingPlaneCollection} [option.clippingPlanes] Cesium.ClippingPlaneCollection用于选择性地禁用tile集的渲染
     * @param {Number} [option.skipLevels=1] 当skipLevelOfDetail是true，一个常量定义了加载tiles时要跳过的最小级别数。当它为0时，不会跳过任何级别。与skipScreenSpaceErrorFactor一起使用，以决定加载哪些贴图
     * @param {Function} [option.shadows] 模型准备完成回调方法
     * @param {Function} [option.load] 模型准备完成回调方法
     * @returns {TilesetLayer} 模型图层对象
     */
    loadI3SLayer (option) {

        if (!Cesium.defined(option)) throw new Cesium.DeveloperError('option 参数缺失');
        if (!Cesium.defined(option.url)) throw new Cesium.DeveloperError('option.url 参数缺失');

        this.options = {
            id: !option.id ? uuid.v4() : option.id,
            url: option.url,
            ready: option.ready ? option.ready : undefined
        }
        this._i3sData = new Cesium.I3SDataProvider({
            url: this.options.url,
            show: this.options.show,
            traceFetches: false,
            cesium3dTilesetOptions: {
                style: new Cesium.Cesium3DTileStyle({
                    "show" : "true",
                    "color" : "color('#ffffff')"
                })
            }
        });


        this._i3sData.readyPromise.then((data) => {
            this.options.ready && this.options.ready(data);

            //console.log(data.layers)

            // for (let i in data.layers) {
            //     data.layers[i].tileset.shadows = Cesium.ShadowMode.ENABLED;
            //     data.layers[i].tileset.showOutline  = true;
            //     data.layers[i].tileset.outlineColor  = Cesium.Color.WHITE;
            //     data.layers[i].tileset.style  = new Cesium.Cesium3DTileStyle({
            //         "show" : "true",
            //         "color" : "color('#ffffff')"
            //     });
            // }
        })
        return this._i3sData;
    }

}

export default I3SLayer;
