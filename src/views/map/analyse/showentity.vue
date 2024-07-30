<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>
<script>
import mapBox from '@/components/mapBox'
export default {
	name: "visiblity",
	components: {
		mapBox
	},
	data() {
		return {
			cssCode: `.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}

.btnGroup {
	position: absolute;
	left: 1rem;
	bottom: 4rem;
}`,
			htmlCode: `	<div :id="mapid" class="ktmap">
	</div>
	<div class="btnGroup">
		<el-button @click="click = !click">{{ btnText }}</el-button>
	</div>`,
			javascriptCode: `import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as token from '@/cesiumSDK/core/util/token'
import tdt_img from "@/assets/basemaps/tdt_img.png";
import {
	darwBillBoard,
	darwPoint,
	drawBox,
	drawPlane,
	drawEllipse,
	drawEllipsoid,
	drawLabel,
	drawModel,
	drawCylinder,
	drawPolyline,
	entityParameter,
	drawRectangle,
	drawWall,
	drawPolygon,
	drawPolylineVolume,
	drawCorridor,
	drawSector,
} from "@/cesiumSDK/core/entityJS/draw";
// import ktmap from '@/components/map'

export default {
	name: "ktmap",
	data() {
		return {
			click: false,
			btnText: "显示Entity"
		};
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
		// this.addEntity();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 17536414, heading: 0, pitch: -90 },
				terrain: {
					type: "xt",
					url: "https://tiles1.geovisearth.com/base/v1/terrain",
					key: token.xingtu,
				},
				basemaps: [
					{
						name: "星图影像",
						icon: tdt_img,
						type: "group",
						tooltip: "星图影像地图服务",
						layers: [
							{ name: "底图", type: "xt", layer: "img_d", key: token.xingtu },
							{ name: "注记", type: "xt", layer: "img_z", key: token.xingtu }
						],
						show: true
					},
					{
						name: "天地图影像(EPSG:3857)",
						icon: tdt_img,
						type: "tdt",
						tooltip: "天地图影像地图服务",
						layer: "img_d",
						key: token.tianditu
					},
				]
			}
			this.map = new Speed.SpeedViewer().init(data);
		},
		addEntity() {
			darwPoint(entityParameter, this.map);
			drawBox(entityParameter, this.map);
			drawPlane(entityParameter, this.map);
			drawEllipse(entityParameter, this.map);
			darwBillBoard(entityParameter, this.map);
			drawEllipsoid(entityParameter, this.map);
			drawLabel(entityParameter, this.map);
			drawModel(entityParameter, this.map);
			drawCylinder(entityParameter, this.map);
			drawPolyline(entityParameter, this.map);
			drawCorridor(entityParameter, this.map);
			drawPolygon(entityParameter, this.map);
			drawPolylineVolume(entityParameter, this.map);
			drawWall(entityParameter, this.map);
			drawRectangle(entityParameter, this.map);
			drawSector(entityParameter, this.map);
		}
	},
	watch: {
		click(a) {
			a ? (this.btnText = "隐藏Entity", this.addEntity()) : (this.btnText = "显示Entity", this.map.entities.removeAll());
		}
	}
}
`
		}
	}

}
</script>

<style scoped>

</style>
