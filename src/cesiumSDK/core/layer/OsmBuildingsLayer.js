import SpeedLayer from './base/speedLayer'
import * as Cesium from "cesium"


class OsmBuildingsLayer extends SpeedLayer {


	/**
	 * osm建筑物，这是一个Cesium3DTileset对象
	 */
	_osmBuildingsLayer;

	/**
	 * 加载OSM在线全球建筑白膜
	 * @param {*} options
	 * @returns
	 */
	loadOsmBuildingLayer(options){
		this.id = options==undefined ||options.id == undefined ? Cesium.createGuid() : options.id;
		this._osmBuildingsLayer = new Cesium.createOsmBuildings({
			style: options==undefined ||options.style == undefined ? undefined :options.style,
			defaultColor:options==undefined ||options.defaultColor == undefined ? Cesium.Color.WHITE : options.defaultColor,
			showOutline:options==undefined ||options.showOutline == undefined ? true : options.showOutline,
		})
		return this
	}
}
export default OsmBuildingsLayer
