import * as Cesium from 'cesium'

let pointNum = 0;
/**
* Entity点文本实体
*/
class PointLableGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} x -点文本实体的经度坐标
    * @param {Number} y -点文本实体的纬度坐标
    * @param {Number} z -广告牌实体下地表的高程
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {String}[parameter.entityColor] -16进制实体颜色，默认16进制'#007acc'
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米    
    * @param {Number}[parameter.pixelSize] -点文本实体的像素大小   
    * @param {String}[parameter.outlineColor] -控制边框线条颜色,默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度
    * @param {String}[parameter.labelText] -标签文本的文本内容
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -文本水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -文本垂直对齐方式，默认VerticalOrigin.CENTER；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.pixelOffset] -文本像素偏移，默认，默认[0,0]
    * @return {Cesium.Entity} -返回点文本实体
    */
    draw(parameter, x, y, z) {
        let v = parameter.viewer;
        let id = '点文本' + (pointNum == 0 ? '' : pointNum);
        let show = parameter.show == undefined ? true : parameter.show;
        var pointlable = new Cesium.Entity({
            id,
            position: Cesium.Cartesian3.fromDegrees(x, y, z + (parameter.elevation!=undefined?parameter.elevation: 0)),
            point: {
                show,
                // 像素大小
                pixelSize: parameter.pixelSize||10,
                outlineColor: Cesium.Color.fromCssColorString(parameter.outlineColor || '#e74032'),
                color: Cesium.Color.fromCssColorString(parameter.entityColor||'#007acc'),
                outlineWidth: parameter.outlineWidth||1,
            },
            label: {
                show,
                text: parameter.labelText||'点文本内容',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                showBackground: true,
                font: '10pt Source Han Sans CN',    //字体样式
                backgroundColor: Cesium.Color.fromCssColorString(parameter.entityColor||'#007acc'),    //背景颜色
                horizontalOrigin: parameter.horizontalOrigin||Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: parameter.verticalOrigin||Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffset||[0,0])),
            },
        });
        pointNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(pointlable);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(pointlable) };
        return pointlable;
    }
}
const pointLable = new PointLableGraphics();
export function darwPointLable(a, x, y, z) {
    let pointlable = pointLable.draw(a, x, y, z);
    return pointlable;
}