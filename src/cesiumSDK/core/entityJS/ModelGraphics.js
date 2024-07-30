import * as Cesium from 'cesium';

import computerAngle from '@/cesiumSDK/core/computer/angle';
let myAngle = new computerAngle();
let modelNum = 0;
/**
* Entity3D模型
*/
class ModelGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Array} parameter.clickPointH -3D模型的经纬度高程坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {String}[parameter.modelPath] -模型路径
    * @param {Number}[parameter.minSize] -3D模型的最小显示像素大小
    * @param {Number}[parameter.maxSize] -3D模型的最大显示像素大小
    * @param {Number}[parameter.silhouetteSize] -3D模型的轮廓大小，默认为0
    * @param {Cesium.Color}[parameter.silhouetteColor] -3D模型的轮廓颜色，默认不设置
    * @param {Boolean}[parameter.modelShow] -是否显示模型，默认显示
    * @param {Number} [parameter.rotation] -模型绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @return {Cesium.Entity} -返回3D模型实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let id = '3D模型' + (modelNum == 0 ? '' : modelNum);
        let position = Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 0));
        // entity模型正东方为0度，顺时针为正方向
        let rotation = (parameter.rotation || -1) >= 0 ? (parameter.rotation || -1) - 90 : myAngle.angle(xy)[0] - 90;
        let show = parameter.show == undefined ? true : parameter.show;
        var model = new Cesium.Entity({
            id,
            position,
            model: {
                uri: parameter.modelPath != undefined ? parameter.modelPath : 'models/GroundVehicle/GroundVehicle.glb',
                show,
                // 模型最小刻度
                minimumPixelSize: parameter.minSize || 64,
                // 模型最大刻度
                maximumPixelSize: parameter.maxSize || 128,
                // 模型是否可见
                show: parameter.modelShow != undefined ? parameter.modelShow : true,
                // 模型轮廓颜色
                silhouetteColor: parameter.silhouetteColor || '',
                // 模型轮廓大小，单位px
                silhouetteSize: parameter.silhouetteSize || 0,
            },
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(rotation),
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(0)
                )
            ),
        });
        modelNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(model);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(model) };
        return model;
    }
}
const Model = new ModelGraphics();
export function drawEntityModel(a) {
    let model = Model.draw(a);
    return model;
}