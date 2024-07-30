<template>
  <mapBox
    :css-code="cssCode"
    :html-code="htmlCode"
    :javascript-code="javascriptCode"
  ></mapBox>
</template>

<script>
import mapBox from "@/components/mapBox";

export default {
  name: "SpreadCircle",
  components: {
    mapBox,
  },
  data() {
    return {
      cssCode: `.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}`,
      htmlCode: `<div :id="mapid" class="ktmap"></div>`,
      javascriptCode: `
	  import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";
import ModelInfo from '@/utils/modelInfo'

export default {
	name: "SpreadCircle",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()
		this.initData()

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
				},
				center: {
					lat: 32.100887,
					lng: 118.880971,
					alt: 12000,
					heading: 0,
					pitch: -90,
				},
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},

		initData() {
			const position = Cesium.Cartesian3.fromDegrees(118.880971, 32.100887, 200);
			let num = 0;
			const _heading = Cesium.Math.toRadians(num); //水平旋转
			const _pitch = Cesium.Math.toRadians(0.0);
			const _roll = Cesium.Math.toRadians(0.0);
			let _headingPitchRoll = new Cesium.HeadingPitchRoll(
				_heading,
				_pitch,
				_roll
			);
			let _orientation = Cesium.Transforms.headingPitchRollQuaternion(
				position,
				_headingPitchRoll
			);

			let model = this.map._viewer.entities.add({
				position: position,
				orientation: _orientation,
				model: {
					uri: ModelInfo.centerzhui,
					scale: 300,
				},
			});
			setInterval(() => {
				num += 4;
				if (num >= 360 || num <= -360) {
					num = 0;
				}
				model.orientation = Cesium.Transforms.headingPitchRollQuaternion(
					Cesium.Cartesian3.fromDegrees(118.880971, 32.100887, 200),
					new Cesium.HeadingPitchRoll(
						Cesium.Math.toRadians(num),
						Cesium.Math.toRadians(0),
						Cesium.Math.toRadians(0)
					)
				);
			}, 50);

			const options = [
				{ raius: 500,clockwise: false,color: "#ff000090"},
				{ raius: 1000, clockwise: true, color: "#ffa50090" },
				{ raius: 1500, clockwise: false, color: "#9acd3290" },
			];
			this.circle =new Speed.SpreadCircle(this.map._viewer)
			for (let index = 0; index < options.length; index++) {
				const option = options[index];
				this.circle.createCircle([118.880971, 32.100887, 100], option, options[index + 1]);
			}
			// this.circle.createSpreadCircle([118.880971, 32.100887, 100], 500);


		},

	}

}
	  `,
    };
  },
};
</script>

<style scoped></style>
