import * as Cesium from 'cesium';

let pointNum = 0;
/**
* 文本+广告牌实体
*/
class BillboardLableGraphics {
    /**
    *加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Number} x -点广告牌实体的经度坐标
    * @param {Number} y -点广告牌实体的纬度坐标
    * @param {Number} z -广告牌实体下地表的高程
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {String}[parameter.entityColor] -16进制实体颜色，默认16进制'#007acc'
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米    
    * @param {Number}[parameter.pixelSize] -点广告牌实体的像素大小   
    * @param {String}[parameter.outlineColor] -控制边框线条颜色,默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度
    * @param {String}[parameter.labelText] -文本内容
    * @param {Number} [parameter.billboardWidth] -广告牌实体自身宽度（单位：米），默认20米
    * @param {Number} [parameter.billboardHeight] -广告牌实体自身高度（单位：米），默认20米
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOriginBoard] -广告牌水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOriginBoard] -广告牌垂直对齐方式，默认VerticalOrigin.TOP；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Cesium.Cartesian2} [parameter.pixelOffsetBoard] -广告牌像素偏移，默认[0,0]
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -文本水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -文本垂直对齐方式，默认VerticalOrigin.CENTER；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.pixelOffset] -文本像素偏移，默认[0,0]
    * @return {Cesium.Entity} -返回点广告牌实体
    */
    draw(parameter, x, y, z) {
        let v = parameter.viewer;
        let id = '广告牌文本' + (pointNum == 0 ? '' : pointNum);
        let show = parameter.show == undefined ? true : parameter.show;
        var pointlable = new Cesium.Entity({
            id,
            position: Cesium.Cartesian3.fromDegrees(x, y, z + (parameter.elevation!=undefined?parameter.elevation: 0)),
            billboard: {
                show,
                image: require('@/assets/entitypng/a.png'),
                width: parameter.billboardWidth||20,
                height: parameter.billboardHeight||20,
                horizontalOrigin: parameter.horizontalOriginBoard||Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: parameter.verticalOriginBoard||Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffsetBoard||[0,0])),
            },
            label: {
                show,
                text: parameter.labelText||'广告牌文本',
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
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) {
            v.zoomTo(pointlable)
        };
        return pointlable;
    }
}
const billboardLable = new BillboardLableGraphics();
export function darwBillboardLable(a, x, y, z) {
    let billboardlable = billboardLable.draw(a, x, y, z);
    return billboardlable;
}