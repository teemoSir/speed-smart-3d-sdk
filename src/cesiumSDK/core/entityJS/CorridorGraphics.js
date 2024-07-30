import * as Cesium from 'cesium';

let corridorNum = 0;
let extrudedHeight;
let height;
/**
* 走廊实体
*/
class corridorGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                      
    * @param {Array} parameter.clickPointH -走廊实体的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.corridorWidth] -走廊实体的宽度（单位：米）
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Number}[parameter.zlWidth] -走廊实体宽度
    * @param {Cesium.Color}[parameter.entityColor] -16进制实体颜色，默认16进制#007acc
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @param {Cesium.CornerType}[parameter.cornerType] -走廊实体拐角样式；ROUNDED	角有光滑的边缘；MITERED	拐角点是相邻边的交点；BEVELED 角被修剪
    * @return {Cesium.Entity} -返回走廊实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let id = '走廊实体' + (corridorNum == 0 ? '' : corridorNum);
        let height1 = parameter.height || 20;
        let elevation = (parameter.elevation != undefined ? parameter.elevation : 0);
        if ((parameter.heightClamp || Cesium.HeightReference.CLAMP_TO_GROUND) === Cesium.HeightReference.CLAMP_TO_GROUND) {
            extrudedHeight = height1 + elevation;
            height = elevation;
        } else {
            extrudedHeight = height1 + elevation + xy[2];
            height = elevation + xy[2];
        };
        let show = parameter.show == undefined ? true : parameter.show;
        let corridor = new Cesium.Entity({
            id,
            show,
            name: 'entityCorridor0',
            corridor: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(xy),
                width: parameter.zlWidth || 1000,
                material: new Cesium.ImageMaterialProperty({
                    //可以设置贴图
                    // image: 'static/image/corridor.png',
                    color: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
                    // repeat: new Cesium.Cartesian2(32, 32)
                    // transparent: true
                }),
                height,
                extrudedHeight,
                // 拐角的样式  type:CornerType  default:CornerType.ROUNDED
                // ROUNDED	角有光滑的边缘；MITERED	拐角点是相邻边的交点；BEVELED	角被修剪
                cornerType: parameter.cornerType || Cesium.CornerType.ROUNDED,
               heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,

            }
        });
        corridorNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(corridor);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(corridor) };
        return corridor;
    }
}
const Corridor = new corridorGraphics();
export function drawCorridor(a) {
    let corridor = Corridor.draw(a);
    return corridor;

}