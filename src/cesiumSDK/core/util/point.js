import * as Cesium from "cesium";
import { pick3DTileset } from "./tileset";


//格式化 数字 小数位数
export function formatNum(num, digits) {
	return Number(Number(num).toFixed(digits || 0));
}

//格式化坐标点为可显示的可理解格式（如：经度x:123.345345、纬度y:31.324324、高度z:123.1）。
export function formatPosition(position) {
	if (!position) return null;
	var carto = Cesium.Cartographic.fromCartesian(position);
	var result = {};
	result.y = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
	result.x = formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
	result.z = formatNum(carto.height, 2);
	return result;
}

//获取position的最终value值，因为cesium经常属性或绑定一层，通过该方法可以内部去判断是否有getValue或_value进行取最终value值。
export function getPositionValue(position, time) {
	if (!position) return position;

	var _position;
	if (position instanceof Cesium.Cartesian3) {
		_position = position;
	} else if (position._value && position._value instanceof Cesium.Cartesian3) {
		_position = position._value;
	} else if (typeof position.getValue == "function") {
		_position = position.getValue(time || currentTime());
	}

	return _position;
}

//格式化Rectangle
export function formatRectangle(rectangle) {
	var west = formatNum(Cesium.Math.toDegrees(rectangle.west), 6);
	var east = formatNum(Cesium.Math.toDegrees(rectangle.east), 6);
	var north = formatNum(Cesium.Math.toDegrees(rectangle.north), 6);
	var south = formatNum(Cesium.Math.toDegrees(rectangle.south), 6);

	return {
		xmin: west,
		xmax: east,
		ymin: south,
		ymax: north
	};
}

//获取坐标的边界
export function getRectangle(positions, isFormat) {
	//剔除null值的数据
	for (var i = positions.length - 1; i >= 0; i--) {
		if (!Cesium.defined(positions[i])) {
			positions.splice(i, 1);
		}
	}

	var rectangle = Cesium.Rectangle.fromCartesianArray(positions);
	if (isFormat) return formatRectangle(rectangle);
	else return rectangle;
}


//取当前时间，用于getValue传参
export function currentTime() {
	if (window.viewer) return window.viewer.clock.currentTime;
	else return Cesium.JulianDate.now();
}

/**
 * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
 * @param {Cesium.Scene} scene
 * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
 * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自己本身的拾取）
 */
export function getCurrentMousePosition(scene, position, noPickEntity) {
	var cartesian;

	//在模型上提取坐标
	var pickedObject;
	try {
		pickedObject = scene.pick(position, 5, 5);
	} catch (e) {
		console.log("scene.pick 拾取时异常", e);
	}

	if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
		//pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制

		var pcEntity = hasPickedModel(pickedObject, noPickEntity);
		if (pcEntity) {
			if (pcEntity.show) {
				pcEntity.show = false; //先隐藏被排除的noPickEntity对象
				cartesian = getCurrentMousePosition(scene, position, noPickEntity);
				pcEntity.show = true; //还原被排除的noPickEntity对象
				if (cartesian) {
					return cartesian;
				} else {
					console.log("拾取到被排除的noPickEntity模型", noPickEntity);
				}
			}
		} else {
			cartesian = scene.pickPosition(position);
			if (Cesium.defined(cartesian)) {
				let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				if (cartographic.height >= 0) return cartesian;

				//不是entity时，支持3dtiles地下
				if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) return cartesian;
				//console.log("scene.pickPosition 拾取模型时 高度值异常：" + cartographic.height);
			} else {
				//console.log("scene.pickPosition 拾取模型 返回为空");
			}
		}
	} else {
		//console.log("scene.pick 拾取位置 返回为空");
	}

	//超图s3m数据拾取
	// if (Cesium.defined(Cesium.S3MTilesLayer)) {
	// 	cartesian = scene.pickPosition(position);
	// 	if (Cesium.defined(cartesian)) {
	// 		return cartesian;
	// 	}
	// }

	//onlyPickModelPosition是在 ViewerEx 中定义的对外属性
	//通过 viewer.mars.onlyPickModelPosition 进行修改
	if (scene.onlyPickModelPosition) return cartesian; //只取模型上的时候，不继续读取了

	//测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
	//1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
	//2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
	//注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。

	//提取鼠标点的地理坐标
	if (scene.mode === Cesium.SceneMode.SCENE3D) {
		//三维模式下
		var pickRay = scene.camera.getPickRay(position);
		cartesian = scene.globe.pick(pickRay, scene);
	} else {
		//二维模式下
		cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
	}

	if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
		let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
		// console.log(cartographic.height);
		if (cartographic.height < -5000) return null; //屏蔽无效值
	}

	return cartesian;
}

function hasPickedModel(pickedObject, noPickEntity) {
	if (Cesium.defined(pickedObject.id)) {
		//entity
		var entity = pickedObject.id;
		if (entity._noMousePosition) return entity; //排除标识不拾取的对象
		if (noPickEntity && entity == noPickEntity) return entity;
	}

	if (Cesium.defined(pickedObject.primitive)) {
		//primitive
		var primitive = pickedObject.primitive;
		if (primitive._noMousePosition) return primitive; //排除标识不拾取的对象
		if (noPickEntity && primitive == noPickEntity) return primitive;
	}

	if (Cesium.defined(pickedObject.tileset)) {
		//tileset
		var tileset = pickedObject.tileset;
		if (tileset._noMousePosition) return tileset; //排除标识不拾取的对象
		if (noPickEntity && tileset == noPickEntity) return tileset;
	}

	return null;
}

//提取屏幕中心点坐标
export function getCenter(viewer, isToWgs) {
	var bestTarget = pickCenterPoint(viewer.scene);
	if (!Cesium.defined(bestTarget)) {
		bestTarget = setPositionSurfaceHeight(viewer, viewer.scene.camera.positionWC);
	}

	var result = formatPosition(bestTarget);
	if (isToWgs) result = viewer.mars.point2wgs(result); //坐标转换为wgs

	// 获取地球中心点世界位置  与  摄像机的世界位置  之间的距离
	// var distance = Cesium.Cartesian3.distance(bestTarget, viewer.scene.camera.positionWC);
	// result.cameraZ = distance;

	return result;
}

//取屏幕中心点坐标
export function pickCenterPoint(scene) {
	var canvas = scene.canvas;
	var center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);

	var ray = scene.camera.getPickRay(center);
	var target = scene.globe.pick(ray, scene);
	if (!target) target = scene.camera.pickEllipsoid(center);
	return target;
}

// 获取当前地图中心的经纬度
export function getCenterPosition(viewer) {
	let centerResult = viewer.camera.pickEllipsoid(
		new Cesium.Cartesian2(
			viewer.canvas.clientWidth / 2,
			viewer.canvas.clientHeight / 2,
		),
	)
	let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
	let curLongitude = (curPosition.longitude * 180) / Math.PI;
	let curLatitude = (curPosition.latitude * 180) / Math.PI;
	return {
		lon: curLongitude,
		lat: curLatitude,
	}
}


	/**
	* 设置坐标中海拔高度为贴地或贴模型的高度
	* opts支持:  是否在has3dtiles:true , 是否异步 asyn:true  异步回调方法callback
	*/
	export function setPositionSurfaceHeight(scene, position, opts) {
		if (!position) return position;

		opts = opts || {};
		var carto = Cesium.Cartographic.fromCartesian(position);

		var height = getSurfaceHeight(scene, position, opts);
		if (height != 0 || (Cesium.defined(opts.maxHeight) && height <= opts.maxHeight)) {
			if (opts.relativeHeight) height += carto.height; //Cesium.HeightReference.RELATIVE_TO_GROUND时
			var positionNew = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, height);
			return positionNew;
		}
		return position;
	}

	/**
	* 获取坐标的贴地(或贴模型)高度
	* opts支持:  是否在has3dtiles:true , 是否异步 asyn:true  异步回调方法callback
	*/
	export function getSurfaceHeight(scene, position, opts) {
		if (!position) return position;
		if (scene instanceof Cesium.Viewer)
			//兼容传入viewer
			scene = scene.scene;
		opts = opts || {};
		//是否在3ditiles上面
		var _has3dtiles = Cesium.defaultValue(
			opts.has3dtiles,
			Cesium.defined(pick3DTileset(scene, position))
		);
		if (_has3dtiles) {
			//求贴模型的高度
			return getSurface3DTilesHeight(scene, position, opts);
		} else {
			//求贴地形高度
			return getSurfaceTerrainHeight(scene, position, opts);
		}
	}

	/**
	* 获取坐标的 贴模型高度
	* opts支持:   是否异步 asyn:true  异步回调方法callback返回“新高度”和“原始的Cartographic坐标”
	*/
	export function getSurface3DTilesHeight(scene, position, opts) {
		opts = opts || {};
		//原始的Cartographic坐标
		opts.cartesian = opts.cartesian || Cesium.Cartographic.fromCartesian(position);
		var carto = opts.cartesian;
		var callback = opts.callback || opts.calback; //兼容不同参数名

		//是否异步求精确高度
		if (opts.asyn) {
			scene
				.clampToHeightMostDetailed([position], opts.objectsToExclude, 0.2)
				.then(function (clampedPositions) {
		debugger

					var clampedPt = clampedPositions[0];
					if (Cesium.defined(clampedPt)) {
						var cartiles = Cesium.Cartographic.fromCartesian(clampedPt);
						var heightTiles = cartiles.height;
						if (Cesium.defined(heightTiles) && heightTiles > -1000) {
							if (callback) callback(heightTiles, cartiles);
							return;
						}
					}
					//说明没在模型上，继续求地形上的高度
					getSurfaceTerrainHeight(scene, position, opts);
				});
		} else {
			//取贴模型高度
			var heightTiles = scene.sampleHeight(carto, opts.objectsToExclude, 0.2);
			if (Cesium.defined(heightTiles) && heightTiles > -1000) {
				if (callback) callback(heightTiles, carto);
				return heightTiles;
			}
		}

		return 0; //表示取值失败
	}




	/**
	 * 获取坐标的 贴地高度
	 * opts支持:   是否异步 asyn:true  异步回调方法callback
	 */
	export function getSurfaceTerrainHeight(scene, position, opts) {
		opts = opts || {};
		//原始的Cartographic坐标
		var carto = opts.cartesian || Cesium.Cartographic.fromCartesian(position);
		var callback = opts.callback || opts.calback; //兼容不同参数名

		var _hasTerrain = hasTerrain(scene); //是否有地形
		if (!_hasTerrain) {
			//不存在地形，直接返回
			if (callback) callback(carto.height, carto);
			return carto.height;
		}


		//是否异步求精确高度
		if (opts.asyn) {

			let promise = Cesium.sampleTerrainMostDetailed(scene.terrainProvider, [carto])
			Promise.resolve(promise).then(function (updatedPositions) {
				console.log(`updatedPositions为:${updatedPositions}`);
				var clampedCart = updatedPositions[0];
				var heightTerrain;
				if (Cesium.defined(clampedCart) && Cesium.defined(clampedCart.height)) {
					heightTerrain = clampedCart.height;
				} else {
					heightTerrain = scene.globe.getHeight(carto);
				}
				if (callback) callback(heightTerrain, carto);

			});
			// Cesium.Then(Cesium.sampleTerrainMostDetailed(scene.terrainProvider, [carto]), function (
			// 	samples
			// ) {
			// 	var clampedCart = samples[0];
			// 	var heightTerrain;
			// 	if (Cesium.defined(clampedCart) && Cesium.defined(clampedCart.height)) {
			// 		heightTerrain = clampedCart.height;
			// 	} else {
			// 		heightTerrain = scene.globe.getHeight(carto);
			// 	}
			// 	if (callback) callback(heightTerrain, carto);
			// });
		} else {
			var heightTerrain = scene.globe.getHeight(carto);
			if (Cesium.defined(heightTerrain) && heightTerrain > -1000) {
				if (callback) callback(heightTerrain, carto);
				return heightTerrain;
			}
		}
		return 0; //表示取值失败
	}

	    /**
     * 采集高度
     * @param {*} cartesians：笛卡尔坐标组成的数组
     * @param {*} type：'terrain' 获取地形高度，'model'获取模型高度
     * @returns 采集结果：笛卡尔坐标组成的数组
     */
		export function getHeightByType(cartesians, type) {
			if (type === 'model') {
				return new Promise(async resolve => {
					try {
						let promise = viewer.scene.clampToHeightMostDetailed(cartesians)
						promise.then(updatedCartesians => resolve(updatedCartesians))
					} catch (e) {
						resolve(false)
					}
				})
			} else if (type = 'terrain') {
				// 首先将cartesians转为positions
				let positions = []
				cartesians.forEach(cartesian => {
					positions.push(this.cartesianToCartographic(cartesian))
				})
				let terrain = viewer.terrainProvider
				return new Promise(async resolve => {
					try {
						// 当前场景中没有使用地形
						if (!terrain) resolve(false)
						const promise = Cesium.sampleTerrainMostDetailed(terrain, positions);
						promise.then(updatedPositions => {
							let resultCartesians = []
							updatedPositions.forEach(position => {
								if (position) {
									// 采集成功，转为笛卡尔坐标
									resultCartesians.push(this.cartographicToCartesian(position))
								} else {
									// postion为undefined时，说明该位置采集失败
									// resultCartesians.push(position)
								}
							})
							resolve(resultCartesians)
						  })
					} catch (e) {
						resolve(false)
					}
				})
			}
		}


	var _ellipsoid = new Cesium.EllipsoidTerrainProvider({
		ellipsoid: Cesium.Ellipsoid.WGS84
	});

	//是否无地形
	export function hasTerrain(viewer) {
		return !(
			viewer.terrainProvider == _ellipsoid ||
			viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
		);
	}
