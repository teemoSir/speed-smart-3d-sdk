<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "3dtilesDTH",
	components: {
		mapBox
	},
	data(){
		return {
			cssCode:`
			.ktmap {
				width: 100%;
				height: 100%;
				background-color: #000;
				position: relative;
			}
			.dialog {
				position: absolute;
				z-index: 2;
				right: 2%;
				top: 1%;
			}
			.content {
				margin-left: 25px;
				margin-right: 25px;
				max-height: 800px;
				color: white;
			}
			.roomTable {
				margin-bottom: 10px;
				--el-table-border-color: #0099ff;
			}

			::v-deep .el-table,
			.el-table__expanded-cell {
				background: transparent;
			}

			::v-deep .el-table tr {
				background: transparent
			}

			::v-deep .el-table__header th {
				background-color: rgb(10 50 80 / 80%);
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
			`,
			htmlCode:`
			<div :id="mapid" class="ktmap">
			</div>
			<speeddialog class="dialog">
				<div class="content">
					<el-table class="roomTable" :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
						style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
						:cell-style="{ 'text-align': 'center' }">
						<el-table-column prop="building" label="楼栋" />
						<el-table-column prop="name" label="房号" />
						<el-table-column label="操作">
							<template #default="scope">
								<el-button type="primary" size="small" title="定位" @click="zoomtoRoom(scope.row)">
									<svg t="1678427365158" class="icon" viewBox="0 0 1024 1024" version="1.1"
										xmlns="http://www.w3.org/2000/svg" p-id="2786" width="16" height="16">
										<path
											d="M874.048 533.333333C863.424 716.629333 716.629333 863.424 533.333333 874.048V917.333333a21.333333 21.333333 0 0 1-42.666666 0v-43.285333C307.370667 863.424 160.576 716.629333 149.952 533.333333H106.666667a21.333333 21.333333 0 0 1 0-42.666666h43.285333C160.576 307.370667 307.370667 160.576 490.666667 149.952V106.666667a21.333333 21.333333 0 0 1 42.666666 0v43.285333c183.296 10.624 330.090667 157.418667 340.714667 340.714667h42.816a21.333333 21.333333 0 1 1 0 42.666666H874.026667z m-42.752 0h-127.786667a21.333333 21.333333 0 0 1 0-42.666666h127.786667C820.778667 330.922667 693.056 203.221333 533.333333 192.704V320a21.333333 21.333333 0 0 1-42.666666 0V192.704C330.922667 203.221333 203.221333 330.944 192.704 490.666667H320a21.333333 21.333333 0 0 1 0 42.666666H192.704c10.517333 159.744 138.24 287.445333 297.962667 297.962667V704a21.333333 21.333333 0 0 1 42.666666 0v127.296c159.744-10.517333 287.445333-138.24 297.962667-297.962667zM512 554.666667a42.666667 42.666667 0 1 1 0-85.333334 42.666667 42.666667 0 0 1 0 85.333334z"
											fill="#ffffff" p-id="2787" data-spm-anchor-id="a313x.7781069.0.i0" class="selected">
										</path>
									</svg>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background small layout="sizes,prev, pager, next" @size-change="handleSizeChange"
						@current-change="handleCurrentChange" :page-sizes="[10, 15, 20]" :page-size="pagesize" :total="total" />
				</div>
			</speeddialog>
			`,
			javascriptCode:`
			import * as uuid from "uuid"
			import * as Speed from '@/cesiumSDK/index'
			import ModelInfo from '@/utils/modelInfo'
			import * as Cesium from "cesium";

			export default {
	name: "DTH",
	data() {
		return {
			modelHeight: 0,
			tableData: [],
			currentPage: 1,
			pagesize: 15,
			total: 0,
			dthData: {
				buildNum: 1,
				bottomHeight: 0,
				topHeight: 0,
				floorCount: 1,
				positions: []
			},

		}
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()
		//加載模型
		this.loadModel()
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
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
						name: "天地图影像(EPSG:4326)",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "天地图影像地图服务",
						type: "tdt",
						crs: "EPSG:4326",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
					},


				],
				center: { lat: 37.531970, lng: 116.324362, alt: 150, heading: 0, pitch: -35 },
				baseLayerPicker: true, //底图切换
				homeButton: true, //回到默认视域
				sceneModePicker: true, //是否显示投影方式控件
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮
				navigationControl: {
					compass: {
						show: true,
						style: { bottom: "270px", left: "1px" }
					},
					legend: {
						show: false,
						style: { left: "5px", bottom: "1px" }
					}
				},//导航球、比例尺
				statusBar: true,//状态栏
				toolBar: {
					style: { bottom: "5%", left: "25px" }
				},//基础工具
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},
		loadModel() {
			this.tilesetLayer = new Speed.TilesetLayer()
			let tileset = this.tilesetLayer.loadQXTilesetLayer({
				url: ModelInfo.SHUIYUNHUATING,
				alt: 15,
			});

			this.tiles3dModel = tileset._tileset
			this.speedMap.addLayer(this.tiles3dModel)
			let that = this
			this.tiles3dModel.readyPromise.then(function (tilesModel) {
				if (tilesModel.orginCenter) {
					that.modelHeight = tilesModel.orginCenter.z
					that.addDTH()
				}
			})
		},

		addDTH() {
			this.graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)
			let dthGracphics = this.graphicLayer.createDTHGraphics({
				name: "水韵华庭单体化",
				url: ModelInfo.SYHT_DTH,
				modelHeight: this.modelHeight,//模型高度
				buildings: {
					buttomheight: "minHeight",//楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
					height: "maxHeight",// 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
					// floor:"floor"//楼层数，可填数值（默认1）或属性字段名称。如果输入floor,则默认楼高为height*floor
				},
				symbol: {
					// color: "rgba(255, 255, 255, 0.1)",
					// 鼠标单击后高亮的样式
					highlight: {
						type: "LEFT_CLICK",
						color: "rgba(255,255,0,0.4)"
					}
				},
				popup: [
					{ field: "building", name: "楼栋" },
					{ field: "thisFloor", name: "楼层" },
					{ field: "name", name: "户号" }
				]
			})
			this.speedMap.addLayer(dthGracphics)
			this.timer = setInterval(() => {
				for (let index = 0; index < dthGracphics._primitives.length; index++) {
					const primitive = dthGracphics._primitives[index];
					this.tableData.push(primitive.properties)
				}
				this.total = this.tableData.length
				clearInterval(this.timer)

			}, 2000)
		},
		handleSizeChange(val) {
			this.pagesize = val;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
		},
		zoomtoRoom(row) {
			this.map._viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(Cesium.Cartesian3.fromDegreesArrayHeights(row.position)),
				{
					offset: {
						heading: Cesium.Math.toRadians(25),
						pitch: Cesium.Math.toRadians(-25),
						roll: Cesium.Math.toRadians(10)
					}
				})

		},

	},

}

			`
		}
	}

}
</script>

<style scoped>

</style>
