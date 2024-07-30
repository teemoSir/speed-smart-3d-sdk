import * as Cesium from 'cesium'

let labelNum = 0;
/**
* 标签文本
*/
class LabelGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} x -标签文本的经度
    * @param {Number} y -标签文本的纬度
    * @param {Number} z -广告牌实体下地表的高程
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {String}[parameter.labelText] -标签文本的文本内容
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.Color}[parameter.entityColor] -文本背景颜色，默认16进制#007acc
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -文本水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -文本垂直对齐方式，默认VerticalOrigin.CENTER；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.pixelOffset] -文本像素偏移，默认，默认[0,0]
    * @return {Cesium.Entity} -返回标签文本实体
    */
    draw(parameter, x, y, z) {
        let v = parameter.viewer;
        let id = '标签文本' + (labelNum == 0 ? '' : labelNum);
        let show = parameter.show == undefined ? true : parameter.show;
        let label = new Cesium.Entity({
            id,
            description: parameter.description || '',
            position: Cesium.Cartesian3.fromDegrees(x, y, z + (parameter.elevation!=undefined?parameter.elevation: 0)),
            label: {
                show,
                text: parameter.labelText||'文本内容',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                showBackground: true,
                font: '10pt Source Han Sans CN',    //字体样式
                backgroundColor: Cesium.Color.fromCssColorString(parameter.entityColor||'#007acc'),    //背景颜色
                horizontalOrigin: parameter.horizontalOrigin||Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: parameter.verticalOrigin||Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffset||[0,0])),
            },
        });
        labelNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(label);
        if (parameter.zoomTo ==undefined ? false : parameter.zoomTo) { v.zoomTo(label) };
        return label;
    }
}
const Label = new LabelGraphics();
export function drawLabel(a, x, y, z) {
    let label = Label.draw(a, x, y, z);
    return label;

}