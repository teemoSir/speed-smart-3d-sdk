import * as Cesium from 'cesium';

let polygonNum = 0;
let extrudedHeight;
let height;
/**
* Entity多面体实体
*/
class PolygonGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Array} parameter.clickPointH -多面体的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Cesium.Color}[parameter.entityColor] -16进制实体颜色，默认16进制#007acc
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @return {Cesium.Entity} -返回多面体实体
    * 
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        console.log(parameter.clickPointH, "-----")
        if (xy.length < 7) {
            alert('请绘制3个坐标以上的坐标')
        } else {
            let v = parameter.viewer;
            let id = '多面体' + (polygonNum == 0 ? '' : polygonNum);
            let height1 = parameter.height || 4;
            let elevation = (parameter.elevation != undefined ? parameter.elevation : 0);
            let show = parameter.show == undefined ? true : parameter.show;
            if ((parameter.heightClamp || Cesium.HeightReference.CLAMP_TO_GROUND) === Cesium.HeightReference.CLAMP_TO_GROUND) {
                extrudedHeight = height1 + elevation;
                height = elevation;
            } else {
                extrudedHeight = height1 + elevation + xy[2];
                height = elevation + xy[2];
            };
            console.log(
                height,
                extrudedHeight,parameter.heightClamp || Cesium.HeightReference.CLAMP_TO_GROUND)
            let polygon = new Cesium.Entity({
                id,
                polygon: {
                    show,
                    hierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(xy)),
                    // hierarchy: {
                    //     positions: Cesium.Cartesian3.fromDegreesArrayHeights(xy),
                    // },
                    // 多边形相对于椭球面的高度
                    height,
                    // 多边形的凸出面相对于椭球面的高度
                    extrudedHeight,
                    closeTop: true, // 如果为false，则将挤出的多边形顶部留空
                    closeBottom: true, // 如果为false，则将挤出的多边形的底部保留为开放状态
                    material: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
                    // material: Cesium.Color.RED.withAlpha(0.5),
                    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                    heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,
                }
            });
            polygonNum++;
            // 添加实体时新增删除下来列表，视图缩放至实体
            v.entities.add(polygon);
            if (parameter.zoomTo == undefined ? false : parameter.zoomTo) {
                v.zoomTo(polygon);
            };
            return polygon;
        }


    }
}
const Polygon = new PolygonGraphics();
export function drawPolygon(a) {
    let polygon = Polygon.draw(a);
    return polygon;
}