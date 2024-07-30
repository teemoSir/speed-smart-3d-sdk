import * as uuid from "uuid"
import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import axios from "axios"
import { formatPosition } from "../util/point";



/**
 * 模型图层对象
 */
class TilesetLayer extends SpeedLayer {


	/**
	 * 图层id
	 * @member {Number}
	 */
	id;

	/**
	 * 这是一个Cesium.Cesium3DTileset对像
	 * @member {Cesium.Cesium3DTileset}
	 */
	_tileset;

	/**
	 * 初始化模型
	 * @param {Object} option 初始化模型参数
	 * @param {String} option.id 唯一标识id
	 * @param {String} option.url 瓦片集JSON文件的url
	 * @param {Number}[option.maximumMemoryUsage=1024] 内存建议显存大小的50%左右，内存分配变小有利于倾斜摄影数据回收，提升性能体验, 单位MB
	 * @param {Number}[option.maximumScreenSpaceError=24] 数值加大，能让最终成像变模糊
	 * @param {Boolean}[option.show=true] 显示
	 * @param {Number}[option.dynamicScreenSpaceErrorDensity=1] 调整动态屏幕空间误差，类似于雾密度
	 * @param {Boolean}[option.dynamicScreenSpaceError=true] 优化选项。减少距离相机较远的图块的屏幕空间错误
	 * @param {Number}[option.cullRequestsWhileMovingMultiplier=80] 优化选项。移动时用于剔除请求的乘数。较大的是更积极的剔除，较小的较不积极的剔除
	 * @param {Boolean}[option.loadSiblings=true] 当 skipLevelOfDetail 为 true 时，确定是否始终在遍历期间下载可见瓦片的node节点
	 * @param {Boolean}[option.skipLevelOfDetail=true] 优化选项。确定是否应在遍历期间应用详细级别跳过
	 * @param {Boolean}[option.preferLeaves=true] show为false时，可选预加载图块。加载图块，就好像图块集可见但不渲染它们
	 * @param {Number}[option.dynamicScreenSpaceErrorFactor=1] 用于增加计算的动态屏幕空间误差的因素
	 * @param {Number}[option.progressiveResolutionHeightFraction= 0.5] 优化选项。如果在 (0.0, 0.5] 之间，屏幕空间错误或超过屏幕空间错误的图块将优先考虑降低的屏幕分辨率的 progressiveResolutionHeightFraction*screenHeight 。这有助于在继续加载全分辨率图块时快速降低图块层
	 * @returns {TilesetLayer} 模型图层对象
	 */
	loadTilesetLayer(option) {
		this.id = option.id == undefined ? uuid.v4() : option.id;
		this._tileset = new Cesium.Cesium3DTileset({
			url: option.url,
			maximumMemoryUsage:
				option.maximumMemoryUsage == undefined
					? 1024
					: option.maximumMemoryUsage,
			maximumScreenSpaceError:
				option.maximumScreenSpaceError == undefined
					? 24
					: option.maximumScreenSpaceError,
			show: option.show == undefined ? true : option.show,
			dynamicScreenSpaceErrorDensity:
				option.dynamicScreenSpaceErrorDensity == undefined
					? 1
					: option.dynamicScreenSpaceErrorDensity,
			dynamicScreenSpaceError:
				option.dynamicScreenSpaceError == undefined
					? true
					: option.dynamicScreenSpaceError,
			cullRequestsWhileMovingMultiplier:
				option.cullRequestsWhileMovingMultiplier == undefined
					? 80
					: option.cullRequestsWhileMovingMultiplier,
			loadSiblings:
				option.loadSiblings == undefined ? true : option.loadSiblings,
			skipLevelOfDetail:
				option.skipLevelOfDetail == undefined ? true : option.skipLevelOfDetail,
			preferLeaves:
				option.preferLeaves == undefined ? true : option.preferLeaves,
			preloadWhenHidden:
				option.preloadWhenHidden == undefined ? true : option.preloadWhenHidden,
			dynamicScreenSpaceErrorFactor:
				option.dynamicScreenSpaceErrorFactor == undefined
					? 1
					: option.dynamicScreenSpaceErrorFactor,
			progressiveResolutionHeightFraction:
				option.progressiveResolutionHeightFraction == undefined
					? 0.5
					: option.progressiveResolutionHeightFraction,

			cullWithChildrenBounds: option.cullWithChildrenBounds == undefined
				? false
				: option.cullWithChildrenBounds,
				customShader:option.customShader,
				backFaceCulling:option.backFaceCulling==undefined?true :option.backFaceCulling,
		})
		if(option.style){
			this._tileset.style = new Cesium.Cesium3DTileStyle(option.style)
		}
		let that = this
		this._tileset.readyPromise.then(function (tilesModel) {
			that._initData(tilesModel);
			// tilesModel.type = option.type || 1 //模型类型（1-BIM、白膜、2-倾斜）

			// const properties = tilesModel.properties
			// if (Cesium.defined(properties)) {
			// 	that.type = 1
			// 	option.type = 1
			// 	tilesModel.type = 1
			// } else {
			// 	that.type = 2
			// 	option.type = 2
			// 	tilesModel.type = 2
			// }
			tilesModel.orgtransform = tilesModel.root.transform;
			// //根据默认参数调整模型
			// that.updateModel(tilesModel, option)

		})
		return this
	}

	/**
	 * 加载并调整倾斜模型
	 * @param {Object} option 模型调整参数
	 * @param {Number} option.position.alt 目标高程
	 * @param {Number} option.opacity 模型透明度
	 * @param {Number} option.maximumScreenSpaceError 模型显示精细度  数值加大，能让最终成像变模糊
	 */
	loadQXTilesetLayer(option) {
		this.id = option.id == undefined ? uuid.v4() : option.id;
		this._tileset = new Cesium.Cesium3DTileset({
			url: option.url,
			maximumMemoryUsage:
				option.maximumMemoryUsage == undefined
					? 1024
					: option.maximumMemoryUsage,
			maximumScreenSpaceError:
				option.maximumScreenSpaceError == undefined
					? 24
					: option.maximumScreenSpaceError,
			show: option.show == undefined ? true : option.show,
			dynamicScreenSpaceErrorDensity:
				option.dynamicScreenSpaceErrorDensity == undefined
					? 1
					: option.dynamicScreenSpaceErrorDensity,
			dynamicScreenSpaceError:
				option.dynamicScreenSpaceError == undefined
					? true
					: option.dynamicScreenSpaceError,
			cullRequestsWhileMovingMultiplier:
				option.cullRequestsWhileMovingMultiplier == undefined
					? 80
					: option.cullRequestsWhileMovingMultiplier,
			loadSiblings:
				option.loadSiblings == undefined ? true : option.loadSiblings,
			skipLevelOfDetail:
				option.skipLevelOfDetail == undefined ? true : option.skipLevelOfDetail,
			preferLeaves:
				option.preferLeaves == undefined ? true : option.preferLeaves,
			preloadWhenHidden:
				option.preloadWhenHidden == undefined ? true : option.preloadWhenHidden,
			dynamicScreenSpaceErrorFactor:
				option.dynamicScreenSpaceErrorFactor == undefined
					? 1
					: option.dynamicScreenSpaceErrorFactor,
			progressiveResolutionHeightFraction:
				option.progressiveResolutionHeightFraction == undefined
					? 0.5
					: option.progressiveResolutionHeightFraction,

			cullWithChildrenBounds: option.cullWithChildrenBounds == undefined
				? false
				: option.cullWithChildrenBounds,
		})
		let that = this
		this._tileset.readyPromise.then(function (tilesModel) {
			that._initData(tilesModel);
			tilesModel.orgtransform = tilesModel.root.transform;
			//根据默认参数调整模型
			that.updateQXModel(tilesModel, option)
		})
		return this
	}

	/**
	 * 加载并调整BIM模型
	 * @param {Object} option 模型调整参数
	 * @param {Number} option.position.lng 目标经度
	 * @param {Number} option.position.lat 目标纬度
	 * @param {Number} option.position.alt 目标高程
	 * @param {Number} option.rotation.x X轴旋转
	 * @param {Number} option.rotation.y Y轴旋转
	 * @param {Number} option.rotation.z Z轴旋转
	 * @param {Number} option.opacity 模型透明度
	 * @param {Number} option.scale 模型缩放
	 * @param {Number} option.maximumScreenSpaceError 模型显示精细度  数值加大，能让最终成像变模糊
	 */
	loadBIMTilesetLayer(option) {

		this.id = option.id == undefined ? uuid.v4() : option.id;
		this._tileset = new Cesium.Cesium3DTileset({
			url: option.url,
			maximumMemoryUsage:
				option.maximumMemoryUsage == undefined
					? 1024
					: option.maximumMemoryUsage,
			maximumScreenSpaceError:
				option.maximumScreenSpaceError == undefined
					? 24
					: option.maximumScreenSpaceError,
			show: option.show == undefined ? true : option.show,
			dynamicScreenSpaceErrorDensity:
				option.dynamicScreenSpaceErrorDensity == undefined
					? 1
					: option.dynamicScreenSpaceErrorDensity,
			dynamicScreenSpaceError:
				option.dynamicScreenSpaceError == undefined
					? true
					: option.dynamicScreenSpaceError,
			cullRequestsWhileMovingMultiplier:
				option.cullRequestsWhileMovingMultiplier == undefined
					? 80
					: option.cullRequestsWhileMovingMultiplier,
			loadSiblings:
				option.loadSiblings == undefined ? true : option.loadSiblings,
			skipLevelOfDetail:
				option.skipLevelOfDetail == undefined ? true : option.skipLevelOfDetail,
			preferLeaves:
				option.preferLeaves == undefined ? true : option.preferLeaves,
			preloadWhenHidden:
				option.preloadWhenHidden == undefined ? true : option.preloadWhenHidden,
			dynamicScreenSpaceErrorFactor:
				option.dynamicScreenSpaceErrorFactor == undefined
					? 1
					: option.dynamicScreenSpaceErrorFactor,
			progressiveResolutionHeightFraction:
				option.progressiveResolutionHeightFraction == undefined
					? 0.5
					: option.progressiveResolutionHeightFraction,

			cullWithChildrenBounds: option.cullWithChildrenBounds == undefined
				? false
				: option.cullWithChildrenBounds,
		})
		let that = this
		this._tileset.readyPromise.then(function (tilesModel) {
			that._initData(tilesModel);

			tilesModel.orgtransform = tilesModel.root.transform;
			//根据默认参数调整模型
			that.updateBIMModel(tilesModel, option)
		})
		return this
	}


	//记录模型原始值
	_initData(tileset) {
		//记录模型原始的中心点
		this.orginPosition = Cesium.clone(this._tileset.boundingSphere.center);

		//原始矩阵
		this.orginMatrix = Cesium.Matrix4.inverse(
			Cesium.Matrix4.fromArray(tileset._root.transform),
			new Cesium.Matrix4()
		);

		//获取transform中的中心点
		var matrix = Cesium.Matrix4.fromArray(this._tileset._root.transform);
		var position = Cesium.Matrix4.getTranslation(matrix, new Cesium.Cartesian3());
		if (Cesium.defined(position) && Cesium.Cartographic.fromCartesian(position)) {
			this.orginPosition = position;

			//计算 orginRotation
			//取旋转矩阵
			var rotmat = Cesium.Matrix4.getMatrix3(matrix, new Cesium.Matrix3());
			//默认的旋转矩阵
			var defrotmat = Cesium.Matrix4.getMatrix3(
				Cesium.Transforms.eastNorthUpToFixedFrame(position),
				new Cesium.Matrix3()
			);

			//计算rotmat 的x轴，在defrotmat 上 旋转
			var xaxis = Cesium.Matrix3.getColumn(defrotmat, 0, new Cesium.Cartesian3());
			var yaxis = Cesium.Matrix3.getColumn(defrotmat, 1, new Cesium.Cartesian3());
			var zaxis = Cesium.Matrix3.getColumn(defrotmat, 2, new Cesium.Cartesian3());

			var dir = Cesium.Matrix3.getColumn(rotmat, 0, new Cesium.Cartesian3());

			dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
			dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
			dir = Cesium.Cartesian3.normalize(dir, dir);

			var heading = Cesium.Cartesian3.angleBetween(xaxis, dir);

			var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);

			if (ay > Math.PI * 0.5) {
				heading = 2 * Math.PI - heading;
			}
			//原始的旋转角度
			this.orginRotation = {
				x: 0,
				y: 0,
				z: Number(Cesium.Math.toDegrees(heading).toFixed(1))
			};
			this._tileset.orginRotation = this.orginRotation
		}
		this.orginCenter = formatPosition(this.orginPosition);
		this._tileset.orginCenter = this.orginCenter
		//console.log(" 模型原始中心为:" + JSON.stringify(this.orginCenter));

	}


	/**
	 * @param {Cesium.Cesium3DTileset} tileset Cesium.Cesium3DTileset对象
	 * @param {Object} option 模型调整参数
	 * @param {Number} option.position.lng 目标经度
	 * @param {Number} option.position.lat 目标纬度
	 * @param {Number} option.position.alt 目标高程
	 * @param {Number} option.rotation.x X轴旋转
	 * @param {Number} option.rotation.y Y轴旋转
	 * @param {Number} option.rotation.z Z轴旋转
	 * @param {Number} option.opacity 模型透明度
	 * @param {Number} option.scale 模型缩放
	 * @param {Number} option.maximumScreenSpaceError 模型显示精细度  数值加大，能让最终成像变模糊
	 * @returns {Cesium.Cesium3DTileset} Cesium.Cesium3DTileset对象
	 */
	updateModel(tileset, option) {
		// if (option.type == 1) {
			let longitude = option.lng || tileset.orginCenter.x;
			let latitude = option.lat || tileset.orginCenter.y;
			let height = option.alt;
			let x = option.rotationX || 0;
			let y = option.rotationY || 0;
			let z = option.rotationZ || 0;
			let hpr = new Cesium.Matrix3();
			let hprObj = new Cesium.HeadingPitchRoll(z, y, x);
			hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
			let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
				Cesium.Transforms.eastNorthUpToFixedFrame(
					Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
				),
				new Cesium.Cartesian3(),
				new Cesium.Matrix4()
			);
			Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);

			if (option.scale) {
				const _scale = Cesium.Matrix4.fromUniformScale(option.scale);
				Cesium.Matrix4.multiply(modelMatrix, _scale, modelMatrix);
			}
			tileset._root.transform = modelMatrix;
		// } else{
		// 	let cartographic = Cesium.Cartographic.fromCartesian(
		// 		tileset.boundingSphere.center
		// 	)
		// 	var surface = Cesium.Cartesian3.fromRadians(
		// 		cartographic.longitude,
		// 		cartographic.latitude,
		// 		0.0
		// 	);
		// 	var offset = Cesium.Cartesian3.fromRadians(
		// 		cartographic.longitude,
		// 		cartographic.latitude,
		// 		option.alt    //填高度差值
		// 	);
		// 	var translation = Cesium.Cartesian3.subtract(
		// 		offset,
		// 		surface,
		// 		new Cesium.Cartesian3()
		// 	);
		// 	tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		// }
		if (option.opacity) {
			tileset.style = new Cesium.Cesium3DTileStyle({
				// color: "color('rgba(255,255,255," + option.opacity + ")')",
				color: "color() *vec4(1,1,1," + option.opacity + ")"
			});
		}
		tileset.maximumScreenSpaceError = option.maximumScreenSpaceError || 16

		return tileset;
	}


	/**
	 * 调整BIM模型
	 * @param {*} tileset
	 * @param {Object} option 模型调整参数
	 * @param {Number} option.position.lng 目标经度
	 * @param {Number} option.position.lat 目标纬度
	 * @param {Number} option.position.alt 目标高程
	 * @param {Number} option.rotation.x X轴旋转
	 * @param {Number} option.rotation.y Y轴旋转
	 * @param {Number} option.rotation.z Z轴旋转
	 * @param {Number} option.opacity 模型透明度
	 * @param {Number} option.scale 模型缩放
	 * @param {Number} option.maximumScreenSpaceError 模型显示精细度  数值加大，能让最终成像变模糊
	 * @returns
	 */
	updateBIMModel(tileset, option) {
		let longitude = option.lng || tileset.orginCenter.x;
			let latitude = option.lat || tileset.orginCenter.y;
			let height = option.alt;
			let x = option.rotationX || 0;
			let y = option.rotationY || 0;
			let z = option.rotationZ || 0;
			let hpr = new Cesium.Matrix3();
			let hprObj = new Cesium.HeadingPitchRoll(z, y, x);
			hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
			let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
				Cesium.Transforms.eastNorthUpToFixedFrame(
					Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
				),
				new Cesium.Cartesian3(),
				new Cesium.Matrix4()
			);
			Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);

			if (option.scale) {
				const _scale = Cesium.Matrix4.fromUniformScale(option.scale);
				Cesium.Matrix4.multiply(modelMatrix, _scale, modelMatrix);
			}
			tileset._root.transform = modelMatrix;
		if (option.opacity) {
			tileset.style = new Cesium.Cesium3DTileStyle({
				// color: "color('rgba(255,255,255," + option.opacity + ")')",
				color: "color() *vec4(1,1,1," + option.opacity + ")"
			});
		}
		tileset.maximumScreenSpaceError = option.maximumScreenSpaceError || 16

		return tileset;
	}

	/**
	 * 调整倾斜模型
	 * @param {*} tileset
	 * @param {Object} option 模型调整参数
	 * @param {Number} option.position.alt 目标高程
	 * @param {Number} option.opacity 模型透明度
	 * @param {Number} option.maximumScreenSpaceError 模型显示精细度  数值加大，能让最终成像变模糊
	 * @returns
	 */
	updateQXModel(tileset, option) {
		let cartographic = Cesium.Cartographic.fromCartesian(
			tileset.boundingSphere.center
		)
		var surface = Cesium.Cartesian3.fromRadians(
			cartographic.longitude,
			cartographic.latitude,
			0.0
		);
		var offset = Cesium.Cartesian3.fromRadians(
			cartographic.longitude,
			cartographic.latitude,
			option.alt    //填高度差值
		);
		var translation = Cesium.Cartesian3.subtract(
			offset,
			surface,
			new Cesium.Cartesian3()
		);
		tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		if (option.opacity) {
			tileset.style = new Cesium.Cesium3DTileStyle({
				// color: "color('rgba(255,255,255," + option.opacity + ")')",
				color: "color() *vec4(1,1,1," + option.opacity + ")"
			});
		}
		tileset.maximumScreenSpaceError = option.maximumScreenSpaceError || 16

		return tileset;
	}

	async getTilesetScenetree(path) {
		let result = []
		await axios.get(path).then((res) => {
			if (res.status == 200) {
				let data = res.data
				let resdata = {}
				this.nextTree(data.scenes, resdata, true)
				result.push(resdata)
				return result
			}
		})
	}


	nextTree(data, nodeObj, root) {
		const mesh = {}
		for (let i = 0; i < data.length; i++) {
			let node = data[i]
			if (node.children != undefined && node.children) {
				if (root) {
					nodeObj.id = node.id
					nodeObj.label = node.name
					nodeObj.type = node.type
					nodeObj.sphere = node.sphere
					mesh[node.id] = node
					this.nextTree(node.children, nodeObj, false)
				} else {
					if (nodeObj.children == undefined) {
						nodeObj.children = []
					}
					nodeObj.children[i] = {
						id: node.id,
						label: node.name,
						type: node.type,
						sphere: node.sphere,
					};
					mesh[node.id] = node
					if ("element" == node.type) {
						// return nodeObj
					} else {
						this.nextTree(node.children, nodeObj.children[i], false)
					}
				}
			} else {
				if (nodeObj.children == undefined) {
					nodeObj.children = []
				}
				nodeObj.children[i] = {
					id: node.id,
					label: node.name,
					type: node.type,
					sphere: node.sphere,
				};
				mesh[node.id] = node
			}
		}
	}

	setTilesetStyle(tileset){
		tileset.readyPromise.then((tileset) => {
			let r = tileset.boundingSphere.radius
			if (tileset.boundingSphere.radius > 10000) {
			  r = tileset.boundingSphere.radius / 10
			}
			tileset.style = new Cesium.Cesium3DTileStyle({
			  color: 'vec4(0, 0.2, 1.0,1)'
			})
			// 注入 shader
			tileset.tileVisible.addEventListener((tile) => {
			  var content = tile.content
			  var featuresLength = content.featuresLength
			  for (var i = 0; i < featuresLength; i += 2) {
				const feature = content.getFeature(i)
				const model = feature.content._model
				if (model && model._sourcePrograms && model._rendererResources) {
				  Object.keys(model._sourcePrograms).forEach((key) => {
					const program = model._sourcePrograms[key]
					const fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader]
					let vPosition = ''
					if (fragmentShader.indexOf(' v_positionEC;') !== -1) {
					  vPosition = 'v_positionEC'
					} else if (fragmentShader.indexOf(' v_pos;') !== -1) {
					  vPosition = 'v_pos'
					}
					const color = `vec4(${feature.color.toString()})`
					// 自定义着色器
					model._rendererResources.sourceShaders[program.fragmentShader] = `
				  varying vec3 ${vPosition};// 相机坐标系的模型坐标
				  void main(void){
					/* 渐变效果 */
					vec4 v_helsing_position = czm_inverseModelView * vec4(${vPosition},1);// 解算出模型坐标
					float stc_pl = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
					float stc_sd = v_helsing_position.z / 60.0 + sin(stc_pl) * 0.1;
					gl_FragColor = ${color};// 基础颜色
					gl_FragColor *= vec4(stc_sd, stc_sd, stc_sd, 1.0);// 按模型高度进行颜色变暗处理
					/* 扫描线 */
					float glowRange = 250.0; // 光环的移动范围(高度)，最高到360米
					float stc_a13 = fract(czm_frameNumber / 360.0);// 计算当前着色器的时间，帧率/（6*60），即时间放慢6倍
					float stc_h = clamp(v_helsing_position.z / glowRange, 0.0, 1.0);
					stc_a13 = abs(stc_a13 - 0.5) * 2.0;
					float stc_diff = step(0.005, abs(stc_h - stc_a13));// 根据时间来计算颜色差异
					gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - stc_diff);// 原有颜色加上颜色差异值提高亮度
				  }
				`
				  })
				  // 让系统重新编译着色器
				  model._shouldRegenerateShaders = true
				}
			  }
			})
	  })
	}

}

export default TilesetLayer;
