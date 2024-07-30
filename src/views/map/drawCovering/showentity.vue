<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>
<script>
import mapBox from '@/components/mapBox'
export default {
	name: "showentity",
	components: {
		mapBox
	},
	data() {
		return {
			cssCode: `* {
	padding: 0;
	margin: 0;
}

.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}

.common-layout {
	position: absolute;
	width: 15%;
	height: 90%;
	margin-top: 3%;
	margin-left: 1%;
	background: url('/epbutton/bg box.png');
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	z-index: 10000;
}

.title {
	margin-top: 10%;
	margin-left: 6%;
	display: flex;
	margin-bottom: 5%;
}

.title img {
	width: 12%;
	height: 100%;
}

.title div {
	margin-top: 1%;
	font-size: larger;
	font-weight: bolder;
	color: #c5d9e7;
}

.chance {
	display: flex;
	width: 100%;
	height: 20px;
	margin-bottom: 5%;
	margin-left: 6%;
}

.default {
	width: 40%;
	text-align: center;
	font-size: medium;
	color: white;
	margin-left: 5%;
	border: none;
	background: none;
}

.onChance {
	background: url('/epbutton/tab.png');
	background-size: 100% 100%;
}

.mainButton {
	display: flex;
	flex-wrap: wrap;
}

.mainButton img {
	width: 20%;
	margin-left: 10%;
	margin-bottom: 3%;
}

.mainButton div {
	display: flex;
	width: 100%;
	margin-bottom: 5%;
}

.mainButton .point:hover {
	content: url('/epbutton/ic_d_sel.png');
}

.mainButton .polyLine:hover {
	content: url('/epbutton/ic_x_sel.png');
}

.mainButton .polyGon:hover {
	content: url('/epbutton/ic_m_sel.png');
}

.mainButton .box:hover {
	content: url('/epbutton/ic_lft_sel.png');
}

.mainButton .wall:hover {
	content: url('/epbutton/ic_qt_sel.png');
}

.mainButton .cylinder:hover {
	content: url('/epbutton/ic_yz_sel.png');
}

.mainButton .cone:hover {
	content: url('/epbutton/ic_yz_sel_1.png');
}

.mainButton .ellipsoid:hover {
	content: url('/epbutton/ic_tqt_sel.png');
}

.mainButton .circle:hover {
	content: url('/epbutton/ic_y_sel.png');
}

.mainButton .fan:hover {
	content: url('/epbutton/ic_sx_sel.png');
}

.mainButton .ellipse:hover {
	content: url('/epbutton/ic_ty_sel.png');
}

.mainButton .corridor:hover {
	content: url('/epbutton/ic_zl_sel.png');
}

.mainButton .polylineVolume:hover {
	content: url('/epbutton/ic_gx_sel.png');
}

.mainButton .text:hover {
	content: url('/epbutton/ic_wb_sel.png');
}

.mainButton .model:hover {
	content: url('/epbutton/ic_mx_sel.png');
}

.mainButton .plane:hover {
	content: url('/epbutton/ic_pm_sel.png');
}

.mainButton .board:hover {
	content: url('/epbutton/ic_ggp_sel.png');
}

.mainButton .sphere:hover {
	content: url('/epbutton/ic_qiuti_sel.png');
}

.mainButton .polygon:hover {
	content: url('/epbutton/ic_dbx_sel.png');
}
.mainButton .pointText:hover {
	content: url('/epbutton/ic_dwb_sel.png');
}
.mainButton .boardText:hover {
	content: url('/epbutton/ic_ggpwb_sel.png');
}

.mainButton h5 {
	margin-top: 0;
	text-align: center;
	width: 20%;
	margin-left: 10%;
	color: aliceblue;
}

.btOut {
	width: 30%;
	height: 4%;
	margin-left: 35%;
	margin-top: 10%;
	color: aliceblue;
	border: none;
	background: url(/epbutton/btnor.png);
	background-size: 100% 100%;
}

#box {
	height: 15px;
	width: fit-content;
	background-color: rgb(14, 231, 213);
	position: absolute;
}`,
			htmlCode: `
	<div :id="mapid" class="ktmap">
		<teleport to="body">
		<div id="box" v-show="hasMove" :style="{left:floatLeft+'px',top:floatTop+'px'}">
			<p>{{ Math.round(distanceSum)}}米</p>
		</div>
		</teleport>
		<div class="common-layout">
			<div class="title">
				<img src="/epbutton/ic_slbh.png" />
				<div>矢量标绘</div>
			</div>
			<div class="chance">
				<button class="default" @click="clickWayNum = 'entity'"
					:class="clickWayNum === 'entity' ? 'onChance' : ''">entity</button>
				<button class="default" @click="clickWayNum = 'primitive'"
					:class="clickWayNum === 'primitive' ? 'onChance' : ''">primitive</button>
			</div>
			<div class="mainButton">
				<img class="point" src="/epbutton/ic_d_nor.png" @click="clickNum = '点'"
					v-show="clickWayNum === 'entity'" />
				<img class="sphere" src="/epbutton/ic_qiuti_nor.png" @click="clickNum = '球体'"
					v-show="clickWayNum === 'primitive'" />
				<img class="polyLine" src="/epbutton/ic_x_nor.png" @click="clickNum = '线'" />
				<img class="polyGon" src="/epbutton/ic_m_nor.png" @click="clickNum = '面'" />
				<div>
					<h5 v-show="clickWayNum === 'entity'">点</h5>
					<h5 v-show="clickWayNum === 'primitive'">球体</h5>
					<h5>线</h5>
					<h5 v-show="clickWayNum === 'entity'">矩形</h5>
					<h5 v-show="clickWayNum === 'primitive'">矩形</h5>
				</div>
				<img class="box" src="/epbutton/ic_lft_nor.png" @click="clickNum = '立方体'" />
				<img class="wall" src="/epbutton/ic_qt_nor.png" @click="clickNum = '墙体'" />
				<img class="cylinder" src="/epbutton/ic_yz_nor.png" @click="clickNum = '圆柱'" />
				<div>
					<h5>立方体</h5>
					<h5>墙体</h5>
					<h5>圆柱</h5>
				</div>
				<img class="cone" src="/epbutton/ic_yz_nor_1.png" @click="clickNum = '圆锥'" />
				<img class="ellipsoid" src="/epbutton/ic_tqt_nor.png" @click="clickNum = '椭球体'" />
				<img class="circle" src="/epbutton/ic_y_nor.png" @click="clickNum = '圆'" />
				<div>
					<h5>圆锥</h5>
					<h5>椭球体</h5>
					<h5>圆</h5>
				</div>
				<img class="corridor" src="/epbutton/ic_zl_nor.png" @click="clickNum = '走廊'" />
				<img class="ellipse" src="/epbutton/ic_ty_nor.png" @click="clickNum = '椭圆'" />
				<img class="polylineVolume" src="/epbutton/ic_gx_nor.png" @click="clickNum = '管线'" />
				<div>
					<h5>走廊</h5>
					<h5>椭圆</h5>
					<h5>管线</h5>
				</div>

				<img class="model" src="/epbutton/ic_mx_nor.png" @click="clickNum = '模型'" />
				<img class="fan" src="/epbutton/ic_sx_nor.png" @click="clickNum = '扇形'"
					v-show="clickWayNum === 'entity'" />
				<img class="text" src="/epbutton/ic_wb_nor.png" @click="clickNum = '文本'"
					v-show="clickWayNum === 'entity'" />
				<img class="polygon" src="/epbutton/ic_dbx_nor.png" @click="clickNum = '多边体'"
					v-show="clickWayNum === 'primitive'" />
				<img class="polygon" src="/epbutton/ic_dbx_nor.png" @click="clickNum = '点集合'"
					v-show="clickWayNum === 'primitive'" />
				<div>
					<h5>模型</h5>
					<h5 v-show="clickWayNum === 'entity'">扇形</h5>
					<h5 v-show="clickWayNum === 'entity'">文本</h5>
					<h5 v-show="clickWayNum === 'primitive'">多边体</h5>
					<h5 v-show="clickWayNum === 'primitive'">点集合</h5>
				</div>
				<img class="plane" src="/epbutton/ic_pm_nor.png" @click="clickNum = '平面'"
					v-show="clickWayNum === 'entity'" />
				<img class="board" src="/epbutton/ic_ggp_nor.png" @click="clickNum = '广告牌'"
					v-show="clickWayNum === 'entity'" />
				<img class="polygon" src="/epbutton/ic_dbx_nor.png" @click="clickNum = '多边体'"
					v-show="clickWayNum === 'entity'" />
				<div v-show="clickWayNum === 'entity'">
					<h5>平面</h5>
					<h5>广告牌</h5>
					<h5>多边形</h5>
				</div>
				<img class="boardText" src="/epbutton/ic_ggpwb_nor.png" @click="clickNum = '广告牌文本'"
					v-show="clickWayNum === 'entity'" />
				<img class="pointText" src="/epbutton/ic_dwb_nor.png" @click="clickNum = '点文本'"
					v-show="clickWayNum === 'entity'" />
				<div v-show="clickWayNum === 'entity'">
					<h5>广告牌文本</h5>
					<h5>点文本</h5>
				</div>

			</div>
			<button class="btOut" @click="clickNum = '移除Entity'" v-show="clickWayNum === 'entity'">移除标绘</button>
			<button class="btOut" @click="clickNum = '移除Primitive'" v-show="clickWayNum === 'primitive'">移除标绘</button>
		</div>
	</div>`,
			javascriptCode: `import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";
import terrainModelClick from "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick";
import removeEntity from "@/cesiumSDK/core/entityJS/removeEntity";
import SpeedPrimitive from "@/cesiumSDK/core/primitiveJS/primitive";
import {
	darwBillBoard,
	darwPoint,
	drawBox,
	drawPlane,
	drawEllipse,
	drawEllipsoid,
	drawLabel,
	drawEntityModel,
	drawCylinder,
	drawPolyline,
	drawWall,
	drawPolygon,
	drawPolylineVolume,
	drawCorridor,
	drawSector,
	darwPointLable,
	darwBillboardLable,
	drawRectangle,
} from "@/cesiumSDK/core/entityJS/draw";
let myOption={};
let Parameter={};
export default {
	name: "ktmap",
	data() {
		return {
			clickNum: '',
			clickWayNum: 'entity',
			hasMove: false,
			distanceSum: 0,
			distance: 0,
			isShow: true,
			floatLeft: 0,
			floatTop: 0,
		};
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 30, lng: 122, alt: 40000, heading: 0, pitch: -90 },
				tiles3dModel: undefined,
				drawHandler: undefined,
				baseLayerPicker: true,
				scene:{
					depthTestAgainstTerrain:true,
				},
				terrains: [
					{
						id: 202,
						type: "xt",
						name: "星图地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "星图地球提供的地形服务",
						url: "https://tiles1.geovisearth.com/base/v1/terrain",
						show: true,
					},
				],
			}
			this.map = new Speed.SpeedViewer().init(data)._viewer;
			this.tmClick = new terrainModelClick(this.map);
			this.map.scene.globe.depthTestAgainstTerrain = true; 
		    this.priCover=new SpeedPrimitive(this.map);
		},
		leftClickMethods(drawWay, drawKind) {
			// 存储每条线段的临时距离
			let distancetemp = 0;
			// 存储累计绘制直线距离
			let id = 0;
			let LineEntityId = 0;
			// 收集经纬度和高程坐标
			let clickPointH = [];
			let distanceSon = [];
			let clickPosition1;
			let clickPosition2;
			let cs = {};
			let that = this;
			window.addEventListener("mousemove", function (e) {
				that.floatLeft = e.pageX + 10;
				that.floatTop = e.pageY - 30;
				// 解决不同浏览器可视区域参数不统一的问题
				let width = e.view.innerWidth > e.view.outerWidth ? e.view.innerWidth : e.view.outerWidth;
				if (e.pageX > width - 100) {
					that.floatLeft = width - 100;
				}
				if (e.pageY < 20) {
					that.floatTop = e.pageY;
				}
				if (e.pageY > e.view.outerHeight - 10) {
					that.floatTop = e.view.outerHeight - 20;
				}
			});
			let viewer = this.map;
			myOption.viewer = viewer;
			// 注册鼠标左键点击事件
			this.tmClick.click(terrainModelClick.EventType.LEFT_CLICK, (p) => {
				clickPointH.push(p.x, p.y, p.z);
				if (drawKind === '线' && drawWay === 'entity') {
					LineEntityId++;
				}
				else { id++ };
				if (drawKind != '点' && drawKind != '文本' && drawKind != '广告牌' && drawKind != '点文本' && drawKind != '广告牌文本') {
					if (drawKind != '立方体') {
						// 注册鼠标移动事件
						that.tmClick.click(terrainModelClick.EventType.MOUSE_MOVE, (p1) => {
							// 坐标显示窗口打开
							that.hasMove = true;
							clickPosition1 = Cesium.Cartesian3.fromDegrees(p.x, p.y, p.z);
							clickPosition2 = Cesium.Cartesian3.fromDegrees(p1.x, p1.y, p1.z);
							// 计算两个点之间的距离
							distancetemp = Cesium.Cartesian3.distance(clickPosition1, clickPosition2);
							that.distanceSum = distancetemp + that.distance;
							// 删除上一次绘制的直线
							viewer.entities.removeById("直线" + id);
							cs = {
								// 直线
								polylinePointArray: [p.x, p.y, p.z, p1.x, p1.y, p1.z],
								i: true,
								id: "直线" + id,
							}
							if (drawKind === '线' && drawWay === 'entity') {
								viewer.entities.removeById("entity线" + LineEntityId);
								cs.id = "entity线" + LineEntityId;
								cs.i=false;
							}
							drawPolyline(myOption, cs);
						})
					}
					// 存储累计距离
					that.distance = that.distanceSum;
					// 存储线段距离到数组中
					distanceSon.push(distancetemp);
					// 注册鼠标左键双击事件
					that.tmClick.click(terrainModelClick.EventType.LEFT_DOUBLE_CLICK, () => {
						// 取消鼠标浮动事件
						that.tmClick.remove(terrainModelClick.EventType.MOUSE_MOVE);
						that.otherSet();
						// 单击事件中id加了两次，为此要减去两次
						id -= 2;
						// 移除最后一个坐标
						clickPointH.splice(clickPointH.length - 3, 3);
						// 移除前后两个距离
						distanceSon.pop();
						distanceSon.shift();
						myOption.clickPointH = clickPointH;
						myOption.radius = distanceSon[0];
						Parameter.clickPointH = clickPointH;
						Parameter.radius = distanceSon[0];
						switch (drawKind) {
							case '面':
								drawWay === 'entity' ?
								    drawRectangle(myOption):
									this.priCover.RectangleGeometry(Parameter);
								that.removeLine(id);
								break;
							case '圆柱':
								drawWay === 'entity' ?
									drawCylinder(myOption, false) :
									this.priCover.CylinderGeometry(Parameter, false);
								viewer.entities.removeById("直线" + id);
								break;
							case '圆锥':
								drawWay === 'entity' ?
									drawCylinder(myOption, true) :
									this.priCover.CylinderGeometry(Parameter, true);
								viewer.entities.removeById("直线" + id);
								break;
							case '立方体':
								drawWay === 'entity' ?
									drawBox(myOption) :
									this.priCover.BoxGeometry(Parameter);
								break;
							case '圆':
								drawWay === 'entity' ?
									drawEllipse(myOption, true) :
									this.priCover.CircleGeometry(Parameter);
								viewer.entities.removeById("直线" + id);
								break;
							case '平面':
								drawPlane(myOption);
								viewer.entities.removeById("直线" + id);
								break;
							case '多边体':
							    drawWay === 'entity' ?
							    drawPolygon(myOption):
							    this.priCover.PolygonGeometry(Parameter);
								that.removeLine(id);
								break;
							case '扇形':
								drawSector(myOption);
								viewer.entities.removeById("直线" + id);
								viewer.entities.removeById("直线" + (id - 1));
								break;
							case '椭圆':
								drawWay === 'entity' ?
									drawEllipse(myOption, false) :
									this.priCover.EllipseGeometry(Parameter);
								viewer.entities.removeById("直线" + id);
								break;
							case '球体':
							this.priCover.SphereGeometry(Parameter);
								viewer.entities.removeById("直线" + id);
								break; H
							case '椭球体':
								drawWay === 'entity' ?
									drawEllipsoid(myOption) :
									this.priCover.EllipsoidGeometry(Parameter);
								viewer.entities.removeById("直线" + id);
								break;
							case '模型':
								drawWay === 'entity' ?
									drawEntityModel(myOption) :
									this.priCover.PrimitiveModel(Parameter);
								viewer.entities.removeById("直线" + id);
								break;
							case '线':
								LineEntityId -= 2;
								id += 2;
								drawWay === 'primitive' ?
								    this.priCover.SimplePolylineGeometry(Parameter) :'';
									that.removeLine(id);
								break;
							case '管线':
								drawWay === 'entity' ?
									drawPolylineVolume(myOption) :
									this.priCover.PolylineVolumeGeometry(Parameter);
								that.removeLine(id);
								break;
							case '走廊':
								drawWay === 'entity' ?
									drawCorridor(myOption) :
									this.priCover.CorridorGeometry(Parameter);
								that.removeLine(id);
								break;
							case '墙体':
								drawWay === 'entity' ?
									drawWall(myOption) :
									this.priCover.WallGeometry(Parameter);
								that.removeLine(id);
								break;
						}
						// 绘制完成之后情况坐标数组
						clickPointH = [];
						distanceSon = [];
					})
				}
				else if (drawKind === '点') {
					let as={
                       viewer:this.map,
                       zoomTo:false,
					   entityColor:'#8dbc36',
					   pixelSize:20,
					   elevation:100,
					   outlineColor:'#007acc',
					   outlineWidth:3,
					};
					darwPoint(as, p.x, p.y, p.z);
					clickPointH = [];
				}
				else if (drawKind === '文本') {
					drawLabel(myOption, p.x, p.y, p.z);
					clickPointH = [];
				}
				else if (drawKind === '广告牌') {
					darwBillBoard(myOption, p.x, p.y, p.z,'a.png');
					clickPointH = [];
				}
				else if (drawKind === '点文本') {
					darwPointLable(myOption, p.x, p.y, p.z);
					clickPointH = [];
				}
				else if (drawKind === '广告牌文本') {
					darwBillboardLable(myOption, p.x, p.y, p.z);
					clickPointH = [];
				}
			})
		},
		otherSet() {
			// 坐标显示窗口关闭
			this.hasMove = false;
			// 完成绘制后距离清空
			this.distance = 0;
			this.distanceSum = 0;
		},
		removeLine(id) {
			// 去除全部的路径直线
			for (let i = 0; i <= id; i++) {
				this.map.entities.removeById("直线" + i);
			}
		}
	},
	computed: {
		// 用于同时监听多个响应式数据
		dataChange() {
			const { clickWayNum, clickNum } = this;
			return { clickWayNum, clickNum };
		}
	},
	watch: {
		dataChange: {
			handler(newval) {
				if (newval.clickNum != null) {
					console.log(newval.clickWayNum, newval.clickNum, '+++++')
					this.leftClickMethods(newval.clickWayNum, newval.clickNum);
				}
				if (newval.clickNum === '移除Entity') {
					new removeEntity().removeAllEntity(this.map);
				}
				else if (newval.clickNum === '移除Primitive') {
					this.priCover.removeAll();
				}
			},
			deep: true
		}
	}
}`
		}
	}

}
</script>

<style scoped></style>
