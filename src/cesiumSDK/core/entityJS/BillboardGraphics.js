import * as Cesium from 'cesium';

let billboardNum = 0;
/**
* 广告牌实体
*/
class BillboardGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Number} x -广告牌实体的经度
    * @param {Number} y -广告牌实体的纬度
    * @param {Number} z -广告牌实体下地表的高程
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number} [parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为100米
    * @param {Number} [parameter.billboardWidth] -广告牌实体自身宽度（单位：米），默认20米
    * @param {Number} [parameter.billboardHeight] -广告牌实体自身高度（单位：米），默认20米
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -垂直对齐方式，默认VerticalOrigin.BOTTOM；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.pixelOffset] -像素偏移，默认[0,0]
    * @return {Cesium.Entity} -返回广告牌实体
    */
    draw(parameter, x, y, z, img) {
        let v = parameter.viewer;
        let id = '广告牌' + (billboardNum == 0 ? '' : billboardNum);
        let show = parameter.show == undefined ? true : parameter.show;
        let billboard = new Cesium.Entity({
            id,
            position: new Cesium.Cartesian3.fromDegrees(x, y, z + (parameter.elevation != undefined ? parameter.elevation : 0)),
            billboard: {
                show,
                image: require(`@/assets/speed/public/${img}`),
                width: parameter.billboardWidth || 20,
                height: parameter.billboardHeight || 20,
                horizontalOrigin: parameter.horizontalOrigin || Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: parameter.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffset||[0,0])),
            }
        });
        billboardNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(billboard);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(billboard) };
        return billboard;
    }

	_drawBillboard(parameter, viewer) {
		if (!Cesium.defined(parameter.longitude)) {
			throw new Cesium.DeveloperError("longitude parameter is required!");
		}
		if (!Cesium.defined(parameter.latitude)) {
			throw new Cesium.DeveloperError("latitude parameter is required!");
		}
		if (!Cesium.defined(parameter.image)) {
			throw new Cesium.DeveloperError("image parameter is required!");
		}
		const id = Cesium.defaultValue(parameter.id, undefined);
		const position = Cesium.Cartesian3.fromDegrees(
			parameter.longitude,
			parameter.latitude,
			Cesium.defaultValue(parameter.height, 0)
		);
		const verticalAlign = Cesium.defaultValue(parameter.verticalAlign, Cesium.VerticalOrigin.BOTTOM);
		return viewer.entities.add({
			id: id,
			position: position,
			billboard: {
				image: parameter.image,
				verticalOrigin: verticalAlign,
				width: Cesium.defaultValue(parameter.billboardWidth, 20),
				height: Cesium.defaultValue(parameter.billboardHeight, 20),
				scaleByDistance: Cesium.defaultValue(parameter.scaleByDistance, undefined),
			}
		})
	}
}
const billBoard = new BillboardGraphics();
export function darwBillBoard(a, x, y, z, img) {
    let billboard = billBoard.draw(a, x, y, z, img);
    return billboard
}

/**
 * 绘制Billboard
 *
 * @param {Object} parameter - 参数
 * @param {string} [parameter.id] - id
 * @param {number} parameter.longitude - 经度
 * @param {number} parameter.latitude - 纬度
 * @param {number} [parameter.height=0] - 高度，默认0
 * @param {number} [parameter.billboardWidth=20] - billboard宽度，默认20
 * @param {number} [parameter.billboardHeight=20] - billboard高度，默认20
 * @param {Cesium.Property|string|HTMLCanvasElement} parameter.image - billboard图片
 * @param {Cesium.Property|Cesium.VerticalOrigin} [parameter.verticalAlign=Cesium.VerticalOrigin.BOTTOM] - 垂直方向对齐方式，默认底部对齐
 * @param {Cesium.Property|Cesium.NearFarScalar} [parameter.scaleByDistance] - 根据距离缩放
 * @param {Cesium.Viewer} viewer - Viewer对象
 *
 * @return {Cesium.Entity} - billboard entity对象
 */
export function drawBillboard(parameter, viewer) {
	return billBoard._drawBillboard(parameter, viewer);
}
