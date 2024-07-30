import * as Cesium from 'cesium'

let wallNum = 0;
/**
* 墙实体
*/
class WallGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Array} parameter.clickPointH -墙体顶点经纬度高程坐标数组
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Number}[parameter.imgPath] -实体拉伸高度，默认为2000米
    * @return {Cesium.Entity} -返回墙实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let id = '墙实体' + (wallNum == 0 ? '' : wallNum);
        let bottom = [];
        for (let i = 2; i < xy.length; i = i + 3) {
            bottom.push(xy[i]);
        }
        let newXY = [];
        for (let i = 0, j = 0; i < xy.length; i = i + 3, j++) {
            newXY.push(...xy.slice(i, i + 2));
            newXY.push((parameter.height || 20) + bottom[j]);
        }
        let show = parameter.show == undefined ? true : parameter.show;
        let wall = new Cesium.Entity({
            id,
            wall: {
                show,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(newXY),
                // 用于墙底而不是地球表面的高度数组
                minimumHeights: bottom,
                material: new Cesium.ImageMaterialProperty({
                    image: require('../../../assets/entitypng/a.png'),
                    repeat: new Cesium.Cartesian2(52, 32)
                }),
            }
        });
        wallNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(wall);
        if (parameter.zoomTo ==undefined ? false : parameter.zoomTo) { v.zoomTo(wall) };
        return wall;
    }

	_drawColorizeWall(parameter, viewer) {
		if (!Cesium.defined(parameter.positions)) {
			throw new Cesium.DeveloperError("positions parameter is required!");
		}
		if (!Cesium.defined(parameter.maximumHeights)) {
			throw new Cesium.DeveloperError("maximumHeights parameter is required!");
		}
		if (!Cesium.defined(parameter.minimumHeights)) {
			throw new Cesium.DeveloperError("minimumHeights parameter is required!");
		}
		const id = Cesium.defaultValue(parameter.id, undefined);
		const color = Cesium.defaultValue(parameter.color, Cesium.Color.WHITE);

		return viewer.entities.add({
			id: id,
			wall: {
				positions: parameter.positions,
				maximumHeights: parameter.maximumHeights,
				minimumHeights: parameter.minimumHeights,
				material: new Cesium.ImageMaterialProperty({
					transparent: true,
					image: this._getColorRamp({
						0.0: color.withAlpha(1.0).toCssColorString().replace(")", ",1.0)"),
						0.045: color.withAlpha(0.8).toCssColorString(),
						0.1: color.withAlpha(0.6).toCssColorString(),
						0.15: color.withAlpha(0.4).toCssColorString(),
						0.37: color.withAlpha(0.2).toCssColorString(),
						0.54: color.withAlpha(0.1).toCssColorString(),
						1.0: color.withAlpha(0).toCssColorString()
					})
				}),
			}
		});
	}

	_getColorRamp(val) {
		if (val == null) {
			val = {0.0: "blue", 0.1: "cyan", 0.37: "lime", 0.54: "yellow", 1: "red"}
		}
		const ramp = document.createElement('canvas');
		ramp.width = 1;
		ramp.height = 100;
		const ctx = ramp.getContext("2d");
		const grd = ctx.createLinearGradient(0, 0, 0, 100);
		for (let key in val) {
			grd.addColorStop(1 - Number(key), val[key]);
		}
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 1, 100);
		return ramp;
	}
}
const Wall = new WallGraphics();
export function drawWall(a) {
    let wall = Wall.draw(a);
    return wall;
}

/**
 * 绘制带颜色变化的墙
 *
 * @param {Object} parameter - 参数
 * @param {string} [parameter.id] - id
 * @param {Cesium.Color} [parameter.color=Cesium.Color.WHITE] - 基准颜色，默认白色
 * @param {Cesium.Property|Cesium.Cartesian3[]} parameter.positions - 绘制点数组
 * @param {Cesium.Property|number[]} parameter.maximumHeights - 最大高度数组
 * @param {Cesium.Property|number[]} parameter.minimumHeights - 最小高度数组
 * @param {Cesium.Viewer} viewer - Viewer对象
 *
 * @return {Cesium.Entity} - 墙体entity对象
 */
export function drawGradientWall(parameter, viewer) {
	return Wall._drawColorizeWall(parameter, viewer);
}
