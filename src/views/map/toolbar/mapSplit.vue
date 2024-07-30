<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "mapSplit",
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

#slider {
	position: absolute;
	left: 50%;
	top: 0px;
	background-color: white;
	width: 5px;
	height: 100%;
	z-index: 9999;
}

#slider:hover {
	cursor: ew-resize;
}`,
			htmlCode:`<div :id="mapid" class="ktmap">
		<div id="slider"></div>
	</div>`,
			javascriptCode:`import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";
import  ModelInfo from '@/utils/modelInfo'

export default {
	name: "mapCompare",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				baseLayerPicker: false, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮,
				navigationControl:true,//导航球、比例尺
				statusBar:true,//状态栏
				loadBaseMap:false
			};

			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);

			this.slider = document.getElementById("slider");

			this._mapSplit = new Speed.mapSplit(this.map._viewer,{
				leftLayer: [
					{ name: "天地图电子", type: "tdt", layer: "vec_d" },
				],
				rightLayer: [
					{ name: "天地图影像", type: "tdt", layer: "img_d" },
				]
			},this.slider)


			this.tilesetLayer = new Speed.TilesetLayer()
			//加载模型
			let tileset = this.tilesetLayer.loadTilesetLayer({
				url: ModelInfo.JIANGXINZHOU,
			});
			this.speedMap.flyto(tileset._tileset)
			this.speedMap.addLayer(tileset._tileset)
			tileset._tileset.splitDirection = Cesium.SplitDirection.RIGHT;

		}
	},
}`
		}
	}

}
</script>

<style scoped>

</style>
