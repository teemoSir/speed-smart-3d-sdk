import SpeedLayer from './base/speedLayer'
import * as Cesium from "cesium"
import axios from 'axios'


class WFSLayer extends SpeedLayer {

	constructor(viewer, options) {
		super(viewer, options)
		this.viewer = viewer
		this.opts = options
	}

	/**
	 * 视角更新前加载的数据
	 */
	oldCollection = []

	cameraChange

	loadWFSServer() {
		let that = this
		this.viewer.scene.globe.depthTestAgainstTerrain = false
		this.cameraChange = function cameraChangeExecution() {
			//屏幕所在经纬度范围
			let newRectangle = that.convertToSameLevel()
			let collection = new Cesium.PrimitiveCollection()
			// that.viewer.scene.primitives.removeAll()

			for (let index = 0; index < newRectangle.length; index++) {
				const bbox = [newRectangle[index].minx, newRectangle[index].miny, newRectangle[index].maxx, newRectangle[index].maxy].join(',')
				//请求的wfs参数
				let parameters = {
					service: "WFS",
					request: "GetFeature",
					typeName: that.opts.layer || that.opts.typeName,
					version: "1.0.0",
					outputFormat: "application/json",
					bbox: bbox,
					srsName: "EPSG:4326"
				};
				//其他可选参数
				if (Cesium.defined(that.opts.parameters)) {
					for (var key in that.opts.parameters) {
						parameters[key] = that.opts.parameters[key];
					}
				}
				let url = that.opts.url
					+ "?service=" + parameters.service
					+ "&request=" + parameters.request
					+ "&typeName=" + parameters.typeName
					+ "&version=" + parameters.version
					+ "&outputFormat=" + parameters.outputFormat
					+ "&srsName=" + parameters.srsName
					+ "&bbox=" + parameters.bbox
					+ "&maxFeatures=" + parameters.maxFeatures
				axios.get(url).then(
					success => {
						if (success.data.features != undefined) {
							let primitive = that.getWFSData(success.data.features)
							primitive.level = newRectangle[index].level
							primitive.x = newRectangle[index].x
							primitive.y = newRectangle[index].y
							collection.add(primitive)
							if (index == newRectangle.length - 1) {
								collection.type = "WFS"
								that.viewer.scene.primitives.add(collection);
								that.oldCollection = collection
							}
						}
					},
					error => {
						console.log('请求失败！', error)
					}
				)
			}
			return 1;
		}
		this.viewer.camera.changed.addEventListener(this.cameraChange)

		// this.viewer.camera.changed.addEventListener(() => {
		// 	//屏幕所在经纬度范围
		// 	let newRectangle=this.convertToSameLevel()
		// 	let collection = new Cesium.PrimitiveCollection()
		// 	this.viewer.scene.primitives.removeAll()
		// 	for (let index = 0; index < newRectangle.length; index++) {
		// 		const bbox = [newRectangle[index].minx, newRectangle[index].miny, newRectangle[index].maxx, newRectangle[index].maxy].join(',')
		// 		//请求的wfs参数
		// 		let parameters = {
		// 			service: "WFS",
		// 			request: "GetFeature",
		// 			typeName: this.opts.layer || this.opts.typeName,
		// 			version: "1.0.0",
		// 			outputFormat: "application/json",
		// 			bbox: bbox,
		// 			srsName: "EPSG:4326"
		// 		};

		// 		//其他可选参数
		// 		if (Cesium.defined(this.opts.parameters)) {
		// 			for (var key in this.opts.parameters) {
		// 				parameters[key] = this.opts.parameters[key];
		// 			}
		// 		}
		// 		let url = this.opts.url
		// 			+ "?service=" + parameters.service
		// 			+ "&request=" + parameters.request
		// 			+ "&typeName=" + parameters.typeName
		// 			+ "&version=" + parameters.version
		// 			+ "&outputFormat=" + parameters.outputFormat
		// 			+ "&srsName=" + parameters.srsName
		// 			+ "&bbox=" + parameters.bbox
		// 			+ "&maxFeatures=" + parameters.maxFeatures
		// 		axios.get(url).then(
		// 			success => {
		// 				if (success.data.features != undefined) {
		// 					let primitive = this.getWFSData(success.data.features)
		// 					primitive.level = newRectangle[index].level
		// 					primitive.x = newRectangle[index].x
		// 					primitive.y = newRectangle[index].y
		// 					collection.add(primitive)
		// 					if(index == newRectangle.length-1){
		// 						collection.type="WFS"
		// 						this.viewer.scene.primitives.add(collection);
		// 						that.oldCollection=collection
		// 					}
		// 				}
		// 			},
		// 			error => {
		// 				console.log('请求失败！', error)
		// 			}
		// 		)
		// 	}

		// })
	}

	removeLayer() {

		let primitives = this.viewer.scene.primitives
		if (primitives != undefined && primitives._primitives != undefined) {
			for (let index = 0; index < primitives._primitives.length; index++) {
				if (primitives._primitives[index] instanceof Cesium.PrimitiveCollection && primitives._primitives[index].type === "WFS") {
					this.viewer.scene.primitives.remove(primitives._primitives[index])
				}
			}
		}
		this.viewer.camera.changed.removeEventListener(this.cameraChange);
	}

	removeListener() {
		this.viewer.camera.changed.removeEventListener(this.cameraChange);
	}

	hideLayer(isShow) {
		let primitives = this.viewer.scene.primitives
		if (primitives != undefined && primitives._primitives != undefined) {
			for (let index = 0; index < primitives._primitives.length; index++) {
				if (primitives._primitives[index] instanceof Cesium.PrimitiveCollection && primitives._primitives[index].type === "WFS") {
					primitives._primitives[index].show = isShow
				}
			}
		}
	}

	/**
	 * 释放老数据 添加新数据
	 */
	destroyWFSData() {

	}

	getWFSData(features) {
		const instances = [];
		for (let i = 0; i < features.length; i++) {
			for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
				const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
				let positionArray = [];
				// 将字符串数组转换为数字数组
				for (let item of polygonArr) {
					positionArray.push(Number(item));
				}

				let height = 3.5
				if (this.opts.buildings.height) {
					let keys = Object.keys(features[i].properties)
					for (let index = 0; index < keys.length; index++) {
						if (this.opts.buildings.height == keys[index]) {
							height = features[i].properties[keys[index]]
						}
					}
				} else if (this.opts.buildings.floor) {
					let keys = Object.keys(features[i].properties)
					for (let index = 0; index < keys.length; index++) {
						if (this.opts.buildings.floor == keys[index]) {
							height = features[i].properties[keys[index]] * 3.5
						}
					}
				}
				const polygon = new Cesium.PolygonGeometry({
					polygonHierarchy: new Cesium.PolygonHierarchy(
						Cesium.Cartesian3.fromDegreesArray(positionArray)
					),
					height : 0,  // 距地高度0米
					extrudedHeight: height,
					vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
					heightReference : Cesium.HeightReference.CLAMP_TO_GROUND // 贴地

				})

				const geometry = Cesium.PolygonGeometry.createGeometry(polygon);

				instances.push(new Cesium.GeometryInstance({
					geometry: geometry,
					attributes: {
						color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW),
					},
				}))
			}
		}
		const primitive = new Cesium.Primitive({
			geometryInstances: instances,
			appearance: new Cesium.PerInstanceColorAppearance(),
			asynchronous: false,  // 确定基元是异步创建还是阻塞直到准备就绪
		});
		primitive.type = "WFS"
		return primitive

	}


	convertToSameLevel() {
		let tilesToRender = this.viewer.scene._globe._surface._tilesToRender
		if (!tilesToRender) return

		let rectangle = []
		for (let i = 0; i < tilesToRender.length; i++) {
			if (tilesToRender[i]._level >= this.opts.minimumLevel) {
				let params = {}
				params.maxx = Cesium.Math.toDegrees(tilesToRender[i]._rectangle.east)
				params.maxy = Cesium.Math.toDegrees(tilesToRender[i]._rectangle.north)
				params.minx = Cesium.Math.toDegrees(tilesToRender[i]._rectangle.west)
				params.miny = Cesium.Math.toDegrees(tilesToRender[i]._rectangle.south)
				params.level = tilesToRender[i]._level
				params.x = tilesToRender[i]._x
				params.y = tilesToRender[i]._y
				rectangle.push(params)
			}
		}
		return rectangle
	}

}

export default WFSLayer
