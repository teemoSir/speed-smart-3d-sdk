<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "edit3dtilesDTH",
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
				right: 1%;
				top: 1%;
			}

			.drawdialog {
				position: absolute;
				z-index: 2;
				right: 1%;
				top: 45%;
			}


			.content1,
			.content {
				margin-left: 25px;
				margin-right: 25px;
				color: white;
			}

			.content1 {
				height: 280px;
			}

			.title {
				font-size: 20px;
				font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold;
				font-weight: 700;
				font-style: italic;
				text-align: left;
				color: #eff7ff;
				text-shadow: 0px 0px 10px 0px #00618b, 0px 0px 10px 0px #00618b;

			}

			.el-form {
				margin-top: 15px;
			}

			.addBtn {
				margin-left: 20px;
				margin-bottom: 10px;
				display: block
			}

			::v-deep .el-form-item__label {
				color: white;

			}

			::v-deep .el-input__wrapper {
				background-color: transparent;
				box-shadow: 0px 0px 10px 0px rgba(0, 153, 255, 0.7) inset;
			}

			::v-deep .el-input {
				--el-input-text-color: #ffffff;
				--el-input-hover-border-color: #0f5e98;
			}

			::v-deep .el-input-number__decrease {
				background: #ffffff00;
			}

			::v-deep .el-input-number__increase {
				background-color: #ffffff00;
			}


			.roomTable {
				height: 200px;
				margin-bottom: 10px;
				--el-table-border-color: #0099ff;
			}

			::v-deep .el-table,
			.el-table__expanded-cell {
				background: transparent;
				/* --el-table-border-color: #0099ff; */
			}

			::v-deep .el-table tr {
				background: transparent
			}

			::v-deep .el-table__header th {
				/* background: transparent !important; */
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
					<el-button class="addBtn" type="primary" @click="showAddDataPannel = true"
						:disabled="showAddDataPannel">新增</el-button>
					<el-table class="roomTable" :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
						style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
						:cell-style="{ 'text-align': 'center' }">
						<el-table-column prop="roomType" label="户型" width="60px" />
						<el-table-column prop="floorCount" label="总层数" width="65px" />
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
								<el-button type="primary" size="small" title="编辑" @click="editRoom(scope.row)">
									<svg t="1678961034368" class="icon" viewBox="0 0 1024 1024" version="1.1"
										xmlns="http://www.w3.org/2000/svg" p-id="2780" width="16" height="16">
										<path
											d="M775.84 392.768l-155.2-172.352L160.768 643.264l-38.368 187.936 190.56-12.832zM929.952 229.952l-131.2-150.944-0.288-0.32a16 16 0 0 0-22.592-0.96l-131.168 120.576 155.168 172.352 128.832-118.464a15.936 15.936 0 0 0 1.248-22.24zM96 896h832v64H96z"
											p-id="2781" fill="#ffffff"></path>
									</svg>
								</el-button>
								<el-button type="primary" size="small" title="删除" @click="deleteRoom(scope.row)">
									<svg t="1678961060318" class="icon" viewBox="0 0 1024 1024" version="1.1"
										xmlns="http://www.w3.org/2000/svg" p-id="3905" width="16" height="16">
										<path
											d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
											fill="#ffffff" p-id="3906"></path>
									</svg>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background small layout="prev, pager, next" @size-change="handleSizeChange"
						@current-change="handleCurrentChange" :page-size="pagesize" :total="total" />
				</div>
			</speeddialog>

			<speeddialog class="drawdialog" v-show="showAddDataPannel">
				<div class="content1">
					<span class="title">新增分层分户单体化</span>
					<el-form label-width="80px">
						<el-form-item label="建筑边界">
							<el-col :span="7">
								<span>{{ !dthData.positions || !dthData.positions.length ? "无" : "已绘制" }}</span>
							</el-col>
							<el-col :span="14">
								<el-button @click="drawPolygon" type="primary" :disabled="isEditing || hasDraw">绘制</el-button>
								<el-button @click="clearPolygon" type="primary" :disabled="isEditing">清除</el-button>
							</el-col>
						</el-form-item>
						<!-- <el-form-item label="幢号">
							<el-col :span="15">
								<el-input v-model="dthData.buildNum"></el-input>
							</el-col>
						</el-form-item> -->
						<el-form-item label="底部高度">
							<el-col :span="16">
								<el-input-number v-model="dthData.bottomHeight" :precision="2" :step="1" :min="0" :max="800"
									controls-position="right"></el-input-number>
							</el-col>
							<el-col :span="6">
								<el-button type="primary" @click="getBottomHeight">拾取</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="顶部高度">
							<el-col :span="16">
								<el-input-number v-model="dthData.topHeight" :precision="2" :step="1" :min="0" :max="2000"
									controls-position="right"></el-input-number>
							</el-col>
							<el-col :span="6">
								<el-button type="primary" @click="getTopHeight">拾取</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="层数">
							<el-col :span="16">
								<el-input-number v-model="dthData.floorCount" :precision="0" :step="1" :min="0" :max="200"
									controls-position="right"></el-input-number>
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="createDTH">生成</el-button>
							<el-button type="primary" @click="closePanel">退出</el-button>

						</el-form-item>
					</el-form>
				</div>
			</speeddialog>
			`,
			javascriptCode:`
			import * as uuid from "uuid"
			import * as Speed from '@/cesiumSDK/index'
			import ModelInfo from '@/utils/modelInfo'
			import * as Cesium from "cesium";
			import terrainModelClick from "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick";
			import { ElMessage } from 'element-plus'

			let roomTypeCount = 0
			let lastGraphicArrId = []
			let lastRoomTypeId=undefined
			export default {
				name: "FCFH",
				data() {
					return {
						modelHeight: 0,
						tableData: [],
						currentPage: 1,
						pagesize: 5,
						total: 0,
						dthData: {
							buildNum: 1,
							bottomHeight: 0,
							topHeight: 0,
							floorCount: 1,
							positions: []
						},
						isEditing: false, // 正在编辑
						hasDraw: false, // 已经绘制
						showAddDataPannel: false
					}
				},
				created() {
					this.mapid = uuid.v4();
				},
				mounted() {
					this.initMap()
					//加載模型
					this.loadModel()

					this.handerClick = new terrainModelClick(this.map._viewer);
					this.drawTool = new Speed.DrawTool(this.map._viewer);
					this.newDTHLayer = new Cesium.PrimitiveCollection()
					this.speedMap.addLayer(this.newDTHLayer)
					this.graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)

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
									style: { top: "580px", left: "1px" }
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
					},
					handleSizeChange(val) {
						this.pagesize = val;
					},
					handleCurrentChange(val) {
						this.currentPage = val;
					},
					zoomtoRoom(row) {
						const heading = Cesium.Math.toRadians(25.0);
						const pitch = Cesium.Math.toRadians(-30.0);
						const range = 80.0;
						let points = []
						for (let index = 0; index < row.positions.length; index++) {
							const element = row.positions[index];
							let c = Cesium.Cartesian3.fromDegrees(element.lng, element.lat, element.alt)
							points.push(c)
						}
						this.map._viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(points),
							{
								offset: new Cesium.HeadingPitchRange(heading, pitch, range)
							})
					},
					editRoom(row) {
						this.isEditing = true
						let positions = []
						for (let index = 0; index < row.positions.length; index++) {
							const element = row.positions[index];
							let cartesian = Cesium.Cartesian3.fromDegrees(element.lng, element.lat, element.alt)
							positions.push(cartesian)
						}

						this.dthData = {
							topHeight: row.topHeight,
							bottomHeight: row.bottomHeight,
							floorCount: row.floorCount,
							positions: positions
						}
						lastRoomTypeId = row.lastRoomTypeId
						this.showAddDataPannel = true
						lastGraphicArrId = row.graphicIdArr;
					},
					deleteRoom(row) {
						for (let index = 0; index < row.graphicIdArr.length; index++) {
							const graphicID = row.graphicIdArr[index];
							for (let index = 0; index < this.newDTHLayer._primitives.length; index++) {
								const primitive = this.newDTHLayer._primitives[index];
								if (primitive.id === graphicID) {
									this.newDTHLayer.remove(primitive)
									break
								}
							}
							const roomTypeCount = row.roomTypeCount
							this.tableData = this.tableData.filter(item => item.roomTypeCount != roomTypeCount)
						}
					},
					getBottomHeight() {
						this.map._viewer._container.style.cursor = "crosshair";

						let that = this
						this.handerClick.click(terrainModelClick.EventType.LEFT_CLICK, (point) => {
							that.dthData.bottomHeight = point.z.toFixed(2) || 0
							that.handerClick.remove(terrainModelClick.EventType.LEFT_CLICK);
							that.map._viewer._container.style.cursor = "default";
						})

					},
					getTopHeight() {
						this.map._viewer._container.style.cursor = "crosshair";
						let that = this
						this.handerClick.click(terrainModelClick.EventType.LEFT_CLICK, (point) => {
							that.dthData.topHeight = point.z.toFixed(2) || 0
							that.handerClick.remove(terrainModelClick.EventType.LEFT_CLICK);
							that.map._viewer._container.style.cursor = "default";

						})
					},
					drawPolygon() {
						this.map._viewer._container.style.cursor = "crosshair";

						this.drawTool.activate("polygon", (result) => {
							this.dthData.positions = result;
							this.hasDraw = true
						});
						// this.mp = new Speed.MilitaryPlotting(this.map._viewer);
						// this.mp.DrawPolygon({}, (result) => {
						// 	// console.info(result);
						// 	this.dthData.positions = result;
						// 	this.hasDraw = true
						// })
					},
					clearPolygon() {
						this.map._viewer._container.style.cursor = "default";
						this.drawTool.clearAll();
						this.hasDraw = false
						this.dthData.positions = []
						lastGraphicArrId = []
					},
					closePanel() {
						this.map._viewer._container.style.cursor = "default";
						this.drawTool.clearAll();
						this.showAddDataPannel = false
						this.hasDraw = false
						this.isEditing = false
						this.dthData = {
							buildNum: 1,
							bottomHeight: 0,
							topHeight: 0,
							floorCount: 1,
							positions: []
						}
						lastGraphicArrId = []
					},
					createDTH() {
						if (!this.hasDraw && this.dthData.positions.length === 0) {
							ElMessage({
								message: '请先绘制单体化区域',
								type: 'warning',
							})
							return
						} else if (this.dthData.floorCount === 0) {
							ElMessage({
								message: '楼层不能为0 ！',
								type: 'warning',
							})
							return
						} else if (this.dthData.bottomHeight === 0) {
							ElMessage({
								message: '底部高度不能为0 ！',
								type: 'warning',
							})
							return
						} else if (this.dthData.topHeight === 0) {
							ElMessage({
								message: '顶部高度不能为0 ！',
								type: 'warning',
							})
							return
						} else if (this.dthData.topHeight <= this.dthData.bottomHeight) {
							ElMessage({
								message: '顶部高度不能小于等于底部高度 ！',
								type: 'warning',
							})
							return
						}
						//清除对应id的单体化数据
						if (lastGraphicArrId.length > 0) {
							for (let i = 0; i < lastGraphicArrId.length; i++) {
								const graphic = lastGraphicArrId[i];
								for (let index = 0; index < this.newDTHLayer._primitives.length; index++) {
									const primitive = this.newDTHLayer._primitives[index];
									if (primitive.id === graphic) {
										this.newDTHLayer.remove(primitive)
										break
									}
								}
							}

							lastGraphicArrId.splice(0, lastGraphicArrId.length);
							this.tableData = this.tableData.filter(item => item.lastRoomTypeId != lastRoomTypeId)
						}
						roomTypeCount++
						lastGraphicArrId = []
						lastRoomTypeId=undefined
						let graphicIdArr = []
						const floorHeight = (this.dthData.topHeight - this.dthData.bottomHeight) / this.dthData.floorCount
						for (let i = 0; i < this.dthData.floorCount; i++) {
							const height = this.dthData.bottomHeight * 1 + floorHeight * i
							const extrudedHeight = this.dthData.bottomHeight * 1 + floorHeight * (i + 1)
							const attr = {
								name: i + 1,
								thisFloor: i + 1,
								roomType: \``+"${roomTypeCount}"+`号\`,
								floorHeight: floorHeight.toFixed(2),
								allFloor: this.dthData.floorCount,
								positions: this.dthData.positions,
								minHeight: this.dthData.bottomHeight,
								maxHeight: this.dthData.topHeight,
								roomTypeCount: roomTypeCount
							}
							let dthGracphic = this.graphicLayer.createDTHGraphics({
								name: "分层分户单体化",
								positions: this.dthData.positions,
								modelHeight: this.modelHeight,
								buildings: {
									buttomheight: height,
									height: extrudedHeight,
								},
								symbol: {
									highlight: {
										type: "LEFT_CLICK",
										color: "rgba(255,255,0,0.4)"
									}
								},
								attr,
								popup: [
									{ field: "thisFloor", name: "楼层" },
									{ field: "name", name: "户号" }
								]
							})
							this.newDTHLayer.add(dthGracphic)
							graphicIdArr.push(dthGracphic.id)
							lastGraphicArrId.push(dthGracphic.id)
						}
						lastRoomTypeId=uuid.v4()

						this.isEditing = true
						this.hasDraw = false
						this.drawTool.clearAll();


						let positions = []
						for (let index = 0; index < this.dthData.positions.length; index++) {
							const element = this.dthData.positions[index];
							let result = Speed.CoordTransform.Cartesian3ToWGS84(element)
							result.alt = Number(this.dthData.topHeight)
							positions.push(result)
						}

						this.tableData.push({
							roomType: roomTypeCount + "号",
							roomTypeCount: roomTypeCount,
							floorCount: this.dthData.floorCount,
							graphicIdArr: graphicIdArr,
							lastRoomTypeId:lastRoomTypeId,
							...this.dthData,
							positions: positions,
						})

					}
				},

			}
			`
		}
	}

}
</script>

<style scoped>

</style>
