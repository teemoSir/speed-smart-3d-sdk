<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "3dtilesModel",
	components: {
		mapBox
	},
	data(){
		return {
			cssCode:`.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}

.dialog {
	position: absolute;
	z-index: 111;
	right: 2rem;
	top: 1rem;
}

.modelView {
	color: white;
	padding-left: 30px;
	padding-right: 25px;
	max-height: 700px;
}


.modelInfo {
	position: absolute;
	z-index: 111;
	top: 1rem;
	right: 33rem;
	height: 88%;
	width: 250px;
	background-color: rgba(29 57 76 / 80%);
	color: white;
	border: 1px solid rgb(0 153 255);
	transition: all 1s;
	transform: translateX(300%);
}

.modelInfo[dialogVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

.property {
	position: absolute;
	z-index: 222;
	top: 3rem;
	left: 1rem;
	height: 88%;
	width: 15%;
	background-color: rgba(29 57 76 / 80%);
	color: white;
	border: 1px solid rgb(0 153 255);
	transition: all 1s;
	transform: translateX(-400%);
}

.property[showProperty="true"] {
	transform: translateX(0);
	opacity: 1;
}

.el-divider {
	margin-bottom: 0px;
	border-color: #14659e;
}

.title {
	color: white;
	margin-left: 20px;
	margin-top: 10px;

}

::v-deep .el-table,
.el-table__expanded-cell {
	background: transparent
}

/* 每行（表头除外） */
::v-deep .el-table tr {
	background: transparent
}

/* 表头 */
::v-deep .el-table__header th {
	background: transparent !important;
	color: white;
}

::v-deep .el-table__body td,
.el-table__header th,
.el-table .cell {
	background: transparent;

}

::v-deep .el-table .el-table__body-wrapper {
	background: #3a536200;
	color: white;
}

/* 鼠标经过单元格背景色透明 */
::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
	background-color: transparent;
}

.cancelBtn {
	margin-left: 20px;
	margin-bottom: 10px;
}

.treecontent {
	position: absolute;
	z-index: 1;
	height: 85%;
	width: 100%;
}


.scrollbar-demo-item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	margin: 10px;
	text-align: center;
	border-radius: 4px;
	background: var(--el-color-primary-light-9);
	color: var(--el-color-primary);
}

.el-tree {

	--el-fill-color-blank: #ffffff00;
	color: white;
	--el-tree-node-hover-bg-color: #2d547883;
}

::v-deep .el-collapse {
	--el-collapse-border-color: #0099ff70;
	--el-collapse-header-bg-color: none;
	--el-collapse-header-text-color: #ffffff;
	--el-collapse-content-bg-color: none;
	--el-collapse-content-text-color: #ffffff;
	--el-text-color-regular: #ffffff;
	--el-collapse-header-font-size: 18px;
	border-top: none;
	border-bottom: none;
}

::v-deep .el-input {
	--el-input-border-color: #ffffff;
	--el-input-bg-color: #ffffff00;
	--el-input-hover-border-color: #0f5e98;
}

::v-deep .el-input-number__decrease {
	background: #ffffff00;
}

::v-deep .el-input-number__increase {
	background-color: #ffffff00;
}

::v-deep .el-checkbox {
	--el-checkbox-checked-text-color: #ffffff;
}

::v-deep .el-checkbox__inner {
	background-color: #ffffff00;
}

.el-slider {
	padding-left: 10px;
	padding-right: 12px;
}`,
			htmlCode:`<div :id="mapid" class="ktmap">
		<speeddialog class="dialog">
			<div class="modelView">
				<el-form label-position="right">
					<el-collapse v-model="activeKey">
						<el-collapse-item name="1" title="模型地址">
							<el-form-item>
								<span>模型URL地址</span>
								<el-input v-model="model.url" placeholder="模型地址" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="loadModel(false)">加载模型</el-button>
								<el-button type="primary" @click="showModelTree">查看构件</el-button>
							</el-form-item>
						</el-collapse-item>

						<el-collapse-item name="2" title="模型位置">
							<el-form-item label="纬度" name="lat">
								<el-input-number v-model="model.lat" style="width: 100%" :precision="6" min="0.000001"
									:step="0.000001" @change="valueChange" />
							</el-form-item>

							<el-form-item label="经度" name="lng">
								<el-input-number v-model="model.lng" style="width: 100%" :precision="6" min="0.000001"
									:step="0.000001" @change="valueChange" />
							</el-form-item>

							<el-form-item label="高程" name="alt">
								<el-input-number v-model="model.alt" style="width: 100%" :precision="2" :step="0.1"
									@change="valueChange" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="locateToModel">定位至模型</el-button>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<el-checkbox v-model="depthTestAgainstTerrain"
									@change="updateDepthTest">深度检测</el-checkbox>
							</el-form-item>
						</el-collapse-item>

						<el-collapse-item name="3" title="模型方向">
							<el-form-item label="绕X轴旋转" name="rotateX">
								<el-input-number step="0.1" v-model="model.rotationX" style="width: 100%" :precision="2"
									@change="valueChange" />
							</el-form-item>

							<el-form-item label="绕Y轴旋转" name="rotateY">
								<el-input-number step="0.1" v-model="model.rotationY" style="width: 100%" :precision="2"
									@change="valueChange" />
							</el-form-item>

							<el-form-item label="绕Z轴旋转" name="rotateZ">
								<el-input-number step="0.1" v-model="model.rotationZ" style="width: 100%" :precision="2"
									@change="valueChange" />
							</el-form-item>
						</el-collapse-item>

						<el-collapse-item name="4" title="其他参数">
							<el-form-item label="缩放比例">
								<el-input-number step="0.1" v-model="model.scale" style="width: 100%" min="0.1"
									:precision="1" @change="valueChange" />
							</el-form-item>
							<el-form-item label="显示精度">
								<el-slider v-model="model.maximumScreenSpaceError" :max="30" :min="1"
									@change="valueChange" />
							</el-form-item>
							<el-form-item label="透明度">
								<el-slider v-model="model.opacity" :max="1" :min="0" :step="0.1"
									@change="valueChange" />
							</el-form-item>
							<el-form-item label="单击高亮构件">
								<el-switch v-model="model.highlightEnable" @change="highlightChangeEvent()" />
								&nbsp;&nbsp;&nbsp;&nbsp;
								<span>
									显示构件属性
									<el-switch v-model="model.propertyEnable" @change="propertyChange()" />
								</span>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</el-form>
			</div>
			<!-- </el-scrollbar> -->
		</speeddialog>

		<div class="modelInfo" :dialogVisible="dialogVisible">
			<h2 class="title">模型构件</h2>
			<el-divider />
			<div class="treecontent">
				<el-button class="cancelBtn" type="primary" v-show="cancelTree" size="small"
					@click="checkedTree">取消选中</el-button>
				<el-scrollbar>
					<el-tree class="tree" :data="treeData" node-key="id" @node-click="locationMesh"
						:default-expanded-keys="treeExpandData" />
				</el-scrollbar>
			</div>
		</div>

		<div class="property" :showProperty="showProperty">
			<h2 class="title">构件属性</h2>
			<el-divider />
			<el-table :data="property" height="670" :table-layout="auto" style="width: 90%; margin: 10px;">
				<el-table-column prop="key" label="名称" />
				<el-table-column prop="value" label="属性值" />
			</el-table>
		</div>

	</div>`,
			javascriptCode:`import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from 'cesium'
import axios from "axios"
import  ModelInfo from '@/utils/modelInfo'


let speedMap
let tilesetLayer
let tiles3dModel
const mesh = {}
let highlight
let feaProperty


export default {
	name: "3dtilesModel",
	data() {
		return {
			activeKey: ['1', '2', '3', '4'],
			model: {
				url: ModelInfo.ZHONGDANHUAGONG,
				lng: 119.933944,//经度
				lat: 32.137604,//纬度
				alt: 10,//高度
				rotationZ: -0.33,
				rotationX: 0.0,
				rotationY: 0.0,
				scale: 1,
				opacity: 1,
				maximumScreenSpaceError: 16,
				// type: 1,
				highlightEnable: false,
				propertyEnable: false

			},
			depthTestAgainstTerrain: false,
			dialogVisible: false,
			cancelTree: false,
			treeData: [],
			treeExpandData: [], //自己定义的用于接收tree树id的数组
			property: [],
			showProperty: false
		}
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()

		this.loadModel(true)

	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 17536414, heading: 0, pitch: -90 },
				baseLayerPicker: true, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮,
				navigationControl:true,//导航球、比例尺
				statusBar:true,//状态栏
				terrains: [
					{
						id: 201,
						type: "none",
						name: "无地形",
						tooltip: "WGS84标准球体",
						icon: "img/basemaps/Ellipsoid.png",
					},
					{
						id: 202,
						type: "xt",
						name: "星图地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "星图地球提供的地形服务",
						url: "https://tiles1.geovisearth.com/base/v1/terrain",
						show: true
					}
				],
				basemaps: [
					{
						id: 101,
						name: "星图影像",
						icon: "img/basemaps/google_img.png",
						type: "xt",
						tooltip: "星图影像地图服务",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
						show: true
					},
					{
						id: 102,
						name: "星图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "星图电子地图服务",
						type: "xt",
						layer: "vec"
					},
					{
						id: 201,
						name: "天地图影像(EPSG:3857)",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "天地图影像地图服务",
						type: "tdt",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
					},
					{
						id: 202,
						name: "天地图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "天地图电子地图服务",
						type: "tdt",
						layers: [
							{ name: "底图", layer: "vec_d" },
							{ name: "注记", layer: "vec_z" }
						],
					}
				],
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},
		loadModel(isInit) {
			if (this.tiles3dModel) {
				this.speedMap.removeLayer(this.tiles3dModel)
				this.tiles3dModel = null
			}
			if (!this.model.url) {
				console.log("请输入模型地址")
				return
			}
			this.tilesetLayer = new Speed.TilesetLayer()
			//加载模型
			let tileset = this.tilesetLayer.loadTilesetLayer({
				url: this.model.url,
				maximumScreenSpaceError: this.model.maximumScreenSpaceError,
			});
			this.tiles3dModel = tileset._tileset
			let that = this

			this.tiles3dModel.readyPromise.then(function (tiles3dModel) {
				if (isInit) {
					tiles3dModel = that.tilesetLayer.updateModel(
						tiles3dModel,
						{
							scale: that.model.scale,
							lng: that.model.lng,
							lat: that.model.lat,
							alt: that.model.alt,
							rotationX: that.model.rotationX,
							rotationY: that.model.rotationY,
							rotationZ: that.model.rotationZ,
							opacity: that.model.opacity,
							maximumScreenSpaceError: that.model.maximumScreenSpaceError
						}
					)
				} else {
					that.model.type = tiles3dModel.type
					that.model.alt = tiles3dModel.orginCenter.z
					that.model.lng = tiles3dModel.orginCenter.x
					that.model.lat = tiles3dModel.orginCenter.y
					that.model.rotationX = tiles3dModel.orginRotation.x
					that.model.rotationY = tiles3dModel.orginRotation.y
					that.model.rotationZ = tiles3dModel.orginRotation.z
				}
			})


			this.speedMap.addLayer(this.tiles3dModel)
			this.speedMap.flyto(this.tiles3dModel)

		},
		valueChange() {
			if (!this.tiles3dModel) return
			let that = this
			this.tiles3dModel.readyPromise.then(function (tiles3dModel) {
				tiles3dModel = that.tilesetLayer.updateModel(
					tiles3dModel,
					{
						scale: that.model.scale,
						lng: that.model.lng,
						lat: that.model.lat,
						alt: that.model.alt,
						rotationX: that.model.rotationX,
						rotationY: that.model.rotationY,
						rotationZ: that.model.rotationZ,
						opacity: that.model.opacity,
						// type: that.model.type,
						maximumScreenSpaceError: that.model.maximumScreenSpaceError
					}
				);
			})
		},
		highlightChangeEvent() {
			if (this.model.highlightEnable) {
				this.highlight = new Speed.highlightFeature({
					speedViewer: this.map._viewer,
					border: true
				})
			} else {
				this.highlight.destroy()
			}

		},
		propertyChange() {
			let that = this
			if (this.model.propertyEnable) {
				this.feaProperty = new Speed.featureProperty({
					viewer: this.map._viewer,
					success: function (data) {
						that.property = data
						that.showProperty = true
					}
				})

			} else {
				this.feaProperty.destroy()
				that.showProperty = false
				that.property = []

			}
		},
		locateToModel() {
			if (this.tiles3dModel) {
				this.speedMap.flyto(this.tiles3dModel)
			}
		},
		updateDepthTest() {
			this.speedMap.depthTestAgainstTerrain(this.depthTestAgainstTerrain)
		},
		showModelTree() {
			if (this.dialogVisible) {
				this.cancelTree = false
				this.tiles3dModel.style = undefined
			} else {
				let result = []
				const scenetree =
					this.model.url.substring(0, this.model.url.lastIndexOf("/") + 1) + "scenetree.json";

				axios.get(scenetree).then((res) => {
					if (res.status == 200) {
						let data = res.data
						let resdata = {}
						this.nextTree(data.scenes, resdata, true)
						result.push(resdata)
						this.treeData = result
						let provincialCenterId = this.treeData[0].id //默认展开第一个节点
						this.treeExpandData.push(provincialCenterId)
					}
				})
			}
			this.dialogVisible = !this.dialogVisible
		},
		locationMesh(event) {
			let node = event
			let marx = this.tiles3dModel.orgtransform
			if ("element" == node.type) {
				this.cancelTree = true
				let nodesphere = node.sphere;
				let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2])
				let orginMatrix = new Cesium.Matrix4.inverse(
					new Cesium.Matrix4.fromArray(marx),
					new Cesium.Matrix4()
				)
				if (orginMatrix) {
					var mat = new Cesium.Matrix4.multiply(
						this.tiles3dModel.root.transform,
						orginMatrix,
						new Cesium.Matrix4()
					);
					center = new Cesium.Matrix4.multiplyByPoint(mat, center, new Cesium.Cartesian3());
				}
				// 获取构件节点位置，现对于原始矩阵变化后的新位置
				const sphere = new Cesium.BoundingSphere(center, nodesphere[3])
				this.map._viewer.camera.flyToBoundingSphere(sphere, {
					offset: new Cesium.HeadingPitchRange(this.map._viewer.camera.heading, this.map._viewer.camera.pitch, nodesphere[3] * 1.5),
					duration: 0.5
				})
				this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
					color: {
						conditions: [
							["`+"${id}"+`==='" + node.id + "'", "rgb(255, 0, 0)"],
							["true", "rgba(255, 200, 200,0.1)"]
						]
					}
				})
			}
		},
		checkedTree() {
			this.cancelTree = false
			this.tiles3dModel.style = undefined
		},
		nextTree(data, nodeObj, root) {
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
	},
}`
		}
	}

}
</script>

<style scoped>

</style>
