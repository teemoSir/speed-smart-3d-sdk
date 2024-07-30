// /**
//  * 图层类处理
//  */
export function init3dTileLayer(option) {
	var tilesetModel = new Cesium.Cesium3DTileset({
	  url: option.url,
	  maximumMemoryUsage:
		option.maximumMemoryUsage == undefined ? 1024 : option.maximumMemoryUsage, // 【重要】内存建议显存大小的50%左右，内存分配变小有利于倾斜摄影数据回收，提升性能体验
	  maximumScreenSpaceError:
		option.maximumScreenSpaceError == undefined
		  ? 24
		  : option.maximumScreenSpaceError, // 【重要】数值加大，能让最终成像变模糊
	  show: option.show,

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
	  loadSiblings: option.loadSiblings == undefined ? true : option.loadSiblings,
	  skipLevelOfDetail:
		option.skipLevelOfDetail == undefined ? true : option.skipLevelOfDetail,
	  preferLeaves: option.preferLeaves == undefined ? true : option.preferLeaves,
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
	});
	return tilesetModel;
  }

  //调整模型位置
  export function modelMatrix(tileset, option) {
	var longitude = option.positionLng;
	var latitude = option.positionLat;
	var height = option.positionAlt;
	var x = option.x;
	var y = option.y;
	var z = option.z;
	// 1、旋转
	let hpr = new Cesium.Matrix3();
	// heading围绕负z轴的旋转。pitch是围绕负y轴的旋转。Roll是围绕正x轴的旋转
	console.log(x, y, z);
	let hprObj = new Cesium.HeadingPitchRoll(z, y, x);
	hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
	// 2、平移
	// 2.3储存平移的结果
	let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
	  // 2.1从以度为单位的经度和纬度值返回Cartesian3位置
	  // 2.2计算4x4变换矩阵
	  Cesium.Transforms.eastNorthUpToFixedFrame(
		Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
	  ),
	  new Cesium.Cartesian3(),
	  new Cesium.Matrix4()
	);
	/// 3、应用旋转
	// Cesium.Matrix4.multiplyByMatrix3 （矩阵，旋转，结果）
	Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);
	tileset._root.transform = modelMatrix;
	return tileset;
  }

  export function addExtrudedGeoJson(viewer, url) {
	const promise = new Cesium.GeoJsonDataSource.load(url);
	promise.then((datasource) => {
	  viewer.dataSources.add(datasource); // 加载这个geojson资源
	  const entities = datasource.entities.values;
	  for (let index = 0; index < entities.length; index++) {
		const entity = entities[index];
		entity.polygon.heightReference =
		  Cesium.HeightReference.RELATIVE_TO_GROUND; // 贴地
		entity.polygon.height = 0; // 距地高度0米
		entity.polygon.extrudedHeightReference =
		  Cesium.HeightReference.RELATIVE_TO_GROUND; //拉伸
		entity.polygon.extrudedHeight =
		  entity.properties.topHeight - entity.properties.bottomHeight; // 拉伸高度
		entity.polygon.outline = true;
		entity.polygon.outlineColor = Cesium.Color.BLACK;
	  }
	});
  }

  //创建拉伸的多边形对象
  export function createExtrudedPolygon(id, polygonGeometry, viewer) {
	return viewer.scene.primitives.add(
	  new Cesium.ClassificationPrimitive({
		geometryInstances: new Cesium.GeometryInstance({
		  geometry: Cesium.PolygonGeometry.createGeometry(polygonGeometry),
		  attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(
			  Cesium.Color.fromRandom({ alpha: 0.8 })
			),
			show: new Cesium.ShowGeometryInstanceAttribute(true),
		  },
		  id: id, //设置id有效 其他属性无效
		}),
		classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
	  })
	);
  }

  import axios from "axios";
  /**
   * 查询构件树
   * @param {*} data
   */
  export function showModelTree(data,that) {
	let result = [];
	const scenetree =
	  data.url.substring(0, data.url.lastIndexOf("/") + 1) + "scenetree.json";
	axios.get(scenetree).then((res) => {
	  if (res.status == 200) {
		let data = res.data;
		let resdata = {};
		nextTree(data.scenes, resdata, true);
		result.push(resdata);
		that.$emit("showModelTreeData",result);
	  }
	});
  }

  function nextTree(data, nodeObj, root) {
	for (let i = 0; i < data.length; i++) {
	  let node = data[i];
	  if (node.children != undefined && node.children) {
		if (root) {
		  nodeObj.id = node.id;
		  nodeObj.name = node.name;
		  nodeObj.type = node.type;
		  nextTree(node.children, nodeObj, false);
		} else {
		  if (nodeObj.child == undefined) {
			nodeObj.child = [];
		  }
		  nodeObj.child[i] = {
			id: node.id,
			name: node.name,
			type: node.type,
		  };

		  if ("element" == node.type) {
			// return nodeObj;
		  } else {
			nextTree(node.children, nodeObj.child[i], false);
		  }
		}
	  } else {
		if (nodeObj.child == undefined) {
		  nodeObj.child = [];
		}
		nodeObj.child[i] = {
		  id: node.id,
		  name: node.name,
		  type: node.type,
		};
	  }
	}
  }
