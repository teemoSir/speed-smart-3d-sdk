import SpeedLayer from './base/speedLayer'
import * as Cesium from "cesium";
import * as util from "../util/util";
import * as uuid from "uuid"
import { formatPosition } from "../util/point";
import popWindow from "@/cesiumSDK/widgets/PopupTool/PopupWindow";


class GeoJsonLayer extends SpeedLayer {
	constructor(viewer) {
		super(viewer)
		this.viewer = viewer

	}

	classifyHandler = undefined; //动态单体化专属handler处理
	selected; primitive; color; show; attribute; //动态单体化鼠标移动事件相关对象
	pickSelected; pickPrimitive; pickColor; pickShow; pickAttribute; //动态单体化鼠标点击事件相关对象


	colors = ["#99CCCC1A", "#66FF661A", "#FF66661A", "#00CCFF1A", "#00FF331A", "#CC00001A", "#CC00CC1A", "#CCFF001A", "#0000FF1A"]
	gridcolors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]


	async loadGeoJson(options) {
		let that = this
		if (options.symbol.highlight) {
			this.classifyHandlerOn(options,"JSON")
		}
		if (options.type == "polygon") {
			let promise = Cesium.GeoJsonDataSource.load(options.url, {
				clampToGround: options.clampToGround || false
			})
			promise.then((datasource) => {
				datasource.name = options.name || "";
				let entities = datasource.entities.values;
				for (let index = 0; index < entities.length; index++) {
					let entity = entities[index];
					entity.nameID = index;
					let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
					let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
					polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
					let orginCenter = formatPosition(polyCenter);
					if(options.label && options.label.height){
					polyCenter=Cesium.Cartesian3.fromDegrees(orginCenter.x,orginCenter.y,options.label.height)
					}

					let height = 3.5
					let floor = 1
					let floorheight = 3.5
					let buttomheight = 0
					let keys = Object.values(entity.properties.propertyNames)
					if (options.buildings) {
						if (options.buildings.height) {
							if (typeof (options.buildings.height) == "number") {
								floorheight = options.buildings.height
							} else {
								for (let index = 0; index < keys.length; index++) {
									if (options.buildings.height == keys[index]) {
										floorheight = entity.properties[keys[index]].getValue()
										break
									}
								}
							}
						}
						if (options.buildings.floor) {
							if (typeof (options.buildings.floor) == "number") {
								floor = options.buildings.floor
							} else {
								for (let index = 0; index < keys.length; index++) {
									if (options.buildings.floor == keys[index]) {
										floor = entity.properties[keys[index]].getValue()
										break
									}
								}
							}
							height = floor * floorheight
						} else {
							height = floorheight
						}

						if (options.buildings.buttomheight) {
							if (typeof (options.buildings.buttomheight) == "number") {
								buttomheight = options.buildings.buttomheight
							} else {
								for (let index = 0; index < keys.length; index++) {
									if (options.buildings.buttomheight == keys[index]) {
										buttomheight = entity.properties[keys[index]].getValue()
										break
									}
								}
							}
						}

						// console.log(height,"height")
						// console.log(buttomheight,"buttomheight")
						entity.polygon.extrudedHeight = buttomheight + height; // 拉伸高度
						entity.polygon.height = buttomheight;  // 距地高度
						// entity.polygon.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;  // 贴地
						// entity.polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND; //拉伸

					}
					let color = Cesium.Color.PINK
					if (options.symbol.color) {
						color = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.symbol.color), options.symbol.opacity || 0.8)
					} else if (options.symbol.randomColor) {
						color = Cesium.Color.fromRandom({ alpha: options.symbol.opacity || 0.8 });
					}

					entity.polygon.fill = options.symbol.fill || true;
					entity.polygon.material =color;
					entity.polygon.outline = options.symbol.outline;
					if (options.symbol.outlineColor) {
						entity.polygon.outlineColor = Cesium.Color.fromCssColorString(options.symbol.outlineColor)
					} else {
						entity.polygon.outlineColor = Cesium.Color.YELLOW;
					}
					entity.polygon.outlineWidth = options.symbol.outlineWidth || 1;
					entity.polygon.classificationType = Cesium.ClassificationType.BOTH
					entity.polygon.show=options.symbol.show

					if(options.symbol.outline){
						entity.polyline= {
							positions: polyPositions,
							clampToGround: true,
							width: options.symbol.outlineWidth,
							material: Cesium.Color.AQUAMARINE
						}
					}

					if (options.label) {
						let label = ""
						if (options.label.text) {
							label = options.label.text
							if (label.indexOf("{") != -1 && label.indexOf("}") != -1) {
								let text = label.substring(label.indexOf("{") + 1, label.indexOf("}"))
								for (let index = 0; index < keys.length; index++) {
									if (text == keys[index]) {
										label = entity.properties[keys[index]].getValue()
										break
									}
								}
							}
						}
						entity.position = polyCenter
						let style = Cesium.LabelStyle.FILL_AND_OUTLINE
						if (options.label.style) {
							if (options.label.style == "FILL") {
								style = Cesium.LabelStyle.FILL
							} else if (options.label.style == "FILL_AND_OUTLINE") {
								style = Cesium.LabelStyle.FILL_AND_OUTLINE
							} else if (options.label.style == "OUTLINE ") {
								style = Cesium.LabelStyle.OUTLINE
							}

						}
						let backgroundColor = new Cesium.Color(0.165, 0.165, 0.165, 0.8)
						if (options.label.backgroundColor) {
							backgroundColor = Cesium.Color.fromCssColorString(options.label.backgroundColor).withAlpha(options.label.backgroundOpacity || 0.8)
						}

						let text=label
						if(options.label.addtext){
							text=label+options.label.addtext
						}
						if(!options.label.outlineColor){
							options.label.outlineColor="#ffffff"
						}

						let fontcolor=Cesium.Color.YELLOW
						if(options.label.color){
							fontcolor=new Cesium.Color.fromCssColorString(options.label.color)
						}

						entity.label = {
							text: text,
							font:  options.label.font || "16px sans-serif",
							style: style,
							scale: options.label.scale || 1,
							showBackground: options.label.background || false,
							backgroundColor: backgroundColor,
							fillColor: fontcolor, // 字体填充色
							outlineWidth: options.label.outlineWidth || 1,  // 字体外圈线宽度（同样也有颜色可设置）
							outlineColor: new Cesium.Color.fromCssColorString(options.label.outlineColor) ,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直位置
							pixelOffset: new Cesium.Cartesian2(0, 15),  // 中心位置
							disableDepthTestDistance: Number.POSITIVE_INFINITY,
							// attr:111222
						}
					}

				}
			})
			promise.name = options.name;
			return promise
		} else if (options.type == "polygonP" || options.type == "polylineP") {
			let primitiveData
			await Cesium.Resource.fetchJson(options.url).then((result) => {
				let features = result.features
				const instances = [];
				for (let i = 0; i < features.length; i++) {
					for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
						let polygonArr = features[i].geometry.coordinates[j].toString().split(',');
						let positionArray = []
						// 将字符串数组转换为数字数组
						for (let item of polygonArr) {
							positionArray.push(Number(item));
						}
						let geometry
						if (options.type == "polygonP") {
							let polygon = new Cesium.PolygonGeometry({
								polygonHierarchy: new Cesium.PolygonHierarchy(
									Cesium.Cartesian3.fromDegreesArray(positionArray)
								),
								vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
							});
							geometry = Cesium.PolygonGeometry.createGeometry(polygon);
						} else if (options.type == "polylineP") {
							let polyline = new Cesium.PolylineGeometry({
								positions: Cesium.Cartesian3.fromDegreesArray(positionArray),
								width: options.symbol.width || 2,
							});

							geometry = Cesium.PolylineGeometry.createGeometry(polyline);
						}
						instances.push(new Cesium.GeometryInstance({
							geometry: geometry,
							attributes: {
								color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })),
							},
							id: uuid.v4()
						}));
					}
				}
				if (options.type == "polygonP") {
					primitiveData = new Cesium.Primitive({
						geometryInstances: instances,
						appearance: new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
							translucent: true,
							closed: false
						}),
						asynchronous: false,  // 确定基元是异步创建还是阻塞直到准备就绪
					});
					return primitiveData
				} else if (options.type == "polylineP") {
					primitiveData = new Cesium.Primitive({
						geometryInstances: instances,
						appearance: new Cesium.PolylineMaterialAppearance({
							translucent: true,
							closed: false
						}),
						asynchronous: false,
					});
					return primitiveData
				}
			})
			return primitiveData
		} else if (options.type == "wall") {
			let primitive
			await Cesium.Resource.fetchJson(options.url).then((result) => {
				let features = result.features
				const instances = [];
				let color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.PALEGREEN)
				if (options.symbol.color) {
					color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.symbol.color), options.symbol.opacity || 0.8))
				}
				let k = 0;
				for (let i = 0; i < features.length; i++) {
					for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
						const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
						let positionArray = []
						// 将字符串数组转换为数字数组
						for (let item of polygonArr) {
							positionArray.push(Number(item));
						}
						const cartesian3 = Cesium.Cartesian3.fromDegreesArray(positionArray)

						const geometry = new Cesium.WallGeometry({
							positions: cartesian3,
							// 设置高度
							maximumHeights: new Array(cartesian3.length).fill(options.symbol.height || 2000),
							minimunHeights: new Array(cartesian3.length).fill(options.symbol.buttomheight || 0),
						})
						instances.push(new Cesium.GeometryInstance({
							geometry: geometry,
							attributes: {
								color: color,
							},
						}));
					}
				}
				// 合并单个geometry,提高渲染效率
				primitive = new Cesium.Primitive({
					geometryInstances: instances,
					// PerInstanceColorAppearance：使用每个实例自定义的颜色着色
					appearance: new Cesium.PerInstanceColorAppearance(),
				});
			})
			return primitive
		}
	}

	createCallback(entity) {
		var colorProperty = new Cesium.CallbackProperty(function (time, result) {
			if (this.highlightedEntity === entity) {
				return Cesium.Color.clone(this.highlightColor, result);
			}
			return Cesium.Color.clone(this.normalColor, result);
		}, false);

		return new Cesium.ColorMaterialProperty(colorProperty);
	}

	/**
	 * 倾斜整栋单体化
	 * @param {*} options
	 * @returns
	 */
	loadJsonByClassification(options) {
		if (options.symbol.highlight) {
			this.classifyHandlerOn(options,"DTH")
		}
		let color = util.handleColorType(options.symbol.color)
		let ldCollection = new Cesium.PrimitiveCollection();
		Cesium.Resource.fetchJson(options.url).then((result) => {
			let features = result.features
			for (let index = 0; index < features.length; index++) {
				let positionArray = [];
				for (let j = 0; j < features[index].geometry.coordinates.length; j++) {
					const polygonArr = features[index].geometry.coordinates[j].toString().split(',');
					// 将字符串数组转换为数字数组
					for (let item of polygonArr) {
						positionArray.push(Number(item));
					}
				}
				const primitive = new Cesium.ClassificationPrimitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: new Cesium.PolygonGeometry({
							polygonHierarchy: new Cesium.PolygonHierarchy(
								Cesium.Cartesian3.fromDegreesArrayHeights(positionArray)
							),
							height: 0,
							extrudedHeight: 100,
							vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
						}),
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
							show: new Cesium.ShowGeometryInstanceAttribute(true), //确定是否显示几何实例
						},
						id: uuid.v4()
					}),
					// classificationType: Cesium.ClassificationType.BOTH,
				})
				ldCollection.add(primitive)
			}

		});

		return ldCollection
	}

	/**
	 * 倾斜单体化，支持整栋、分层、分户
	 * @param {*} options
	 * @param {String} option.url -单体化数据json地址
	 * @param {String} option.postions -单体化数据坐标集合（url和postions二选一）
	 * @param {Number} option.modelHeight -倾斜模型高度
	 * @param {Object} option.buildings -倾斜单体化（必填）
	 * @param {Number|String} option.buildings.buttomheight -楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
	 * @param {Number|String} option.buildings.height -楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
	 * @param {Number|String} option.buildings.floor -楼层数，可填数值（默认1）或属性字段名称。如果输入floor,则默认楼高为height*floor
	 * @param {Object} option.symbol -单体化样式
	 * @param {String} option.symbol.color -单体化对象颜色
	 * @param {Object} option.symbol.highlight -单体化高亮样式
	 * @param {String} option.symbol.highlight.type -单体化高亮方式（鼠标左键单击：LEFT_CLICK,或鼠标移入：MOUSE_MOVE）
	 * @param {Object} option.symbol.highlight.color -单体化高亮颜色
	 * @returns {PrimitiveCollection} 单体化对象
	 */
	createDTHGraphics(options) {
		if (options.symbol.highlight) {
			this.classifyHandlerOn(options,"DTH")
		}
		if (Cesium.defined(options.popup)) {
			let popObj = new popWindow(this.viewer, options)
		}
		let color
		if (options.symbol && options.symbol.color) {
			color = util.handleColorType(options.symbol.color)
		}
		if (options.url) {
			let ldCollection = new Cesium.PrimitiveCollection();
			Cesium.Resource.fetchJson(options.url).then((result) => {
				let features = result.features
				for (let index = 0; index < features.length; index++) {
					let positionArray = [];
					let coordinates
					for (let j = 0; j < features[index].geometry.coordinates.length; j++) {
						coordinates = features[index].geometry.coordinates[j]
						for (let index = 0; index < coordinates.length; index++) {
							const coor = coordinates[index];
							if (coor.length === 2) {
								// coor.pop()
								coor.push(0)
							}
						}
						const polygonArr = coordinates.toString().split(',');
						// 将字符串数组转换为数字数组
						for (let item of polygonArr) {
							positionArray.push(Number(item));
						}
					}

					let sumheight = 3.5
					let floor = 1
					let floorheight = 3.5
					let buttomheight = 0
					let keys = Object.keys(features[index].properties)
					let obj = features[index].properties
					obj.position = positionArray
					if (options.buildings) {
						if (options.buildings.height) {
							if (typeof (options.buildings.height) == "number") {
								floorheight = options.buildings.height
							} else {
								for (let index = 0; index < keys.length; index++) {
									const item = keys[index];
									if (options.buildings.height.toLowerCase() === item.toLowerCase()) {
										floorheight = obj[item]
										break
									}
								}
							}
						}

						if (options.buildings.buttomheight) {
							if (typeof (options.buildings.buttomheight) == "number") {
								buttomheight = options.buildings.buttomheight
							} else {
								for (let index = 0; index < keys.length; index++) {
									const item = keys[index];
									if (options.buildings.buttomheight.toLowerCase() === item.toLowerCase()) {
										buttomheight = obj[item]
										break
									}
								}
							}
						}

						if (options.buildings.floor) {
							if (typeof (options.buildings.floor) == "number") {
								floor = options.buildings.floor
							} else {
								for (let index = 0; index < keys.length; index++) {
									const item = keys[index];
									if (options.buildings.floor.toLowerCase() === item.toLowerCase()) {
										floor = obj[item]
										break
									}
								}
							}
							sumheight = floor * floorheight

							//如果传入的是楼层数，需计算每层楼的底部高度
							buttomheight=buttomheight+sumheight-floorheight
						} else {
							sumheight = floorheight
						}


					}

					if (!options.symbol || !options.symbol.color) {
						let num = Math.floor(Math.random() * 8);
						let temp = this.colors[num]
						color = Cesium.Color.fromCssColorString(temp)
					}

					sumheight = sumheight + (options.modelHeight || 0)
					buttomheight = buttomheight + (options.modelHeight || 0)
					for (let index = 2; index < obj.position.length; index = index + 3) {
						const zz = obj.position[index];
						obj.position[index] = sumheight
					}
					positionArray = Cesium.Cartesian3.fromDegreesArrayHeights(positionArray)
					console.log("拉伸高度",sumheight)
					console.log("底部高度",buttomheight)

					const primitive = this.createDTHPrimitive(positionArray, sumheight, buttomheight, color, obj, options)
					ldCollection.add(primitive)
				}
			})
			return ldCollection

		} else if (options.positions) {
			let positionArray = []
			for (let index = 0; index < options.positions.length; index++) {
				const positions = options.positions[index];
				positionArray.push(positions)
			}
			if (!options.symbol || !options.symbol.color) {
				let num = Math.floor(Math.random() * 8);
				let temp = this.colors[num]
				color = Cesium.Color.fromCssColorString(temp)
			}
			const primitive = this.createDTHPrimitive(positionArray, options.buildings.height, options.buildings.buttomheight, color, options.attr, options)
			return primitive
		}
	}

	createDTHPrimitive(positionArray, height, buttomheight, color, properties, options) {
		const primitive = new Cesium.ClassificationPrimitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: new Cesium.PolygonGeometry({
					polygonHierarchy: new Cesium.PolygonHierarchy(
						positionArray
						// Cesium.Cartesian3.fromDegreesArrayHeights(positionArray)
						// Cesium.Cartesian3.fromDegreesArray(positionArray)
					),
					extrudedHeight: height,
					height: buttomheight,
					vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
				}),
				attributes: {
					color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
					show: new Cesium.ShowGeometryInstanceAttribute(true), //确定是否显示几何实例
				},
				id: uuid.v4()
			}),
			classificationType: Cesium.ClassificationType.BOTH,
		})
		primitive.id = uuid.v4()
		primitive.properties = properties//把geojson数据属性传给图元
		primitive.popup = options.popup
		primitive.type = "DTH"

		var polyCenter = Cesium.BoundingSphere.fromPoints(positionArray).center;//中心点
		primitive.position = polyCenter;
		return primitive
	}


	/**
	 * 倾斜单体化鼠标事件（鼠标移入或左键单击高亮）
	 * @param {*} options
	 */
	classifyHandlerOn(options,type) {
		let color = Cesium.Color.AQUAMARINE
		if (options.symbol.highlight.color) {
			color = util.handleColorType(options.symbol.highlight.color)
		}
		if (!this.classifyHandler)
			// this.classifyHandler.destroy();
			this.classifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
		let that = this
		if (options.symbol.highlight.type == "MOUSE_MOVE") {
			//鼠标移动
			this.classifyHandler.setInputAction((move) => {
				let pick = that.viewer.scene.pick(move.endPosition);
				// if(type==undefined || pick.primitive==undefined || pick.primitive.type==undefined || pick.primitive.type.toUpperCase()!=type.toUpperCase()){
				// 	return
				// }
				if (Cesium.defined(pick) && Cesium.defined(pick.id)) {
					if (that.selected === pick.id || pick.id === that.pickSelected) {
						return;
					}
					if (Cesium.defined(that.selected)) {
						that.attribute = that.primitive.getGeometryInstanceAttributes(that.selected);
						that.attribute.color = that.color;
						that.attribute.show = that.show;
						that.selected = void 0;
						that.primitive = void 0;
						that.color = void 0;
						that.show = void 0;
					}
					if (Cesium.defined(pick.primitive) &&Cesium.defined(pick.primitive.getGeometryInstanceAttributes)) {
						that.selected = pick.id;
						that.primitive = pick.primitive; // 映射对象
						that.attribute = that.primitive.getGeometryInstanceAttributes(that.selected); // 对象属性
						that.color = that.attribute.color; // 颜色属性
						that.show = that.attribute.show; // 显示属性
						that.viewer.scene.invertClassification = true;
						that.attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(color);
						that.attribute.show = Cesium.ShowGeometryInstanceAttribute.toValue(true);
					}
				} else {
					if (Cesium.defined(that.selected)) {
						that.attribute = that.primitive.getGeometryInstanceAttributes(that.selected);
						that.attribute.color = that.color;
						that.attribute.show = that.show;
						that.selected = void 0;
						that.primitive = void 0;
						that.color = void 0;
						that.show = void 0;
					}
				}
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		}
		if (options.symbol.highlight.type == "LEFT_CLICK") {
			//鼠标点击
			this.classifyHandler.setInputAction((pick) => {
				let pickedObj = that.viewer.scene.pick(pick.position);
				// if(type==undefined || pickedObj.primitive==undefined || pickedObj.primitive.type==undefined || pickedObj.primitive.type.toUpperCase()!=type.toUpperCase()){
				// 	return
				// }

				if (Cesium.defined(pickedObj) && Cesium.defined(pickedObj.id)) {
					if (Cesium.defined(that.pickSelected)) {
						if (that.pickPrimitive) {
							that.pickAttribute =
								that.pickPrimitive.getGeometryInstanceAttributes(that.pickSelected);
						}
						that.pickAttribute.color = that.pickColor;
						that.pickAttribute.show = that.pickShow;
						that.pickPrimitive = void 0;
						that.pickColor = void 0;
						that.pickSelected = void 0;
						that.pickShow = void 0;
					}
					if (Cesium.defined(pickedObj.primitive) && Cesium.defined(pickedObj.primitive.getGeometryInstanceAttributes)) {
						that.pickSelected = pickedObj.id;
						that.pickPrimitive = pickedObj.primitive; // 映射对象
						that.pickAttribute =
							that.pickPrimitive.getGeometryInstanceAttributes(that.pickSelected); // 对象属性
						that.pickColor = that.pickAttribute.color; // 颜色属性
						that.pickShow = that.pickAttribute.show; // 显示属性
						that.viewer.scene.invertClassification = true;
						// that.pickAttribute.color = color;
						// that.pickAttribute.show = [1];
						that.pickAttribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(color);
						that.pickAttribute.show = Cesium.ShowGeometryInstanceAttribute.toValue(true);
					}
				} else {
					if (Cesium.defined(that.pickSelected)) {
						if (that.pickAttribute) {
							that.pickAttribute =
								that.pickPrimitive.getGeometryInstanceAttributes(that.pickSelected);
						}
						that.pickAttribute.color = that.pickColor;
						that.pickAttribute.show = that.pickShow;
						that.pickSelected = void 0;
						that.pickPrimitive = void 0;
						that.pickColor = void 0;
						that.pickShow = void 0;
					}
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}

	}



	destory() {
		if (this.classifyHandler) {
			this.classifyHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
			this.classifyHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			// this.classifyHandler.destroy();
			this.classifyHandler = undefined;
			if (Cesium.defined(this.pickSelected)) {
				this.pickAttribute =
					this.pickPrimitive.getGeometryInstanceAttributes(this.pickSelected);
				this.pickAttribute.color = this.pickColor;
				this.pickAttribute.show = this.pickShow;
				this.pickPrimitive = void 0;
				this.pickColor = void 0;
				this.pickSelected = void 0;
				this.pickShow = void 0;
			}
		}
	}


}
export default GeoJsonLayer
