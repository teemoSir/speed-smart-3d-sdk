<template>
	<div>
		<speeddialog class="baseLayerPicker">
			<div class="mapbox">
				<p class="baseLayerPicker-sectionTitle">地图底图服务</p>
				<div class="baseLayerPicker-section-layers">
					<div class="imgli" v-for="item in basemaps" :key="item.id">
						<img class="image" :src="item.icon" @click="layerFn(item.id)" :class="{ selectimg: item.show }">
						<p class="layername">{{ item.name }}</p>
					</div>
				</div>

				<p class="baseLayerPicker-sectionTitle">地形服务</p>
				<div class="baseLayerPicker-section-terrain">
					<div class="imgli" v-for="item in terrains" :key="item.id">
						<img class="image" :src="item.icon" @click="terrainFn(item.id)"
							:class="{ selectimg: item.show }">
						<p>{{ item.name }}</p>
					</div>
				</div>
			</div>
		</speeddialog>
	</div>

</template>

<script>
import baseMapLayer from '@/cesiumSDK/core/layer/baseMapLayer.js';
import terrainLayer from '@/cesiumSDK/core/layer/terrainLayer.js';

export default {
	name: "baseMapSelector",
	props: {
		terrains: Array,
		basemaps: Array,
		viewer: Object
	},
	data() {
		return {
			mapViewer: this.viewer
		};
	},
	mounted() {
	},
	methods: {
		layerFn(layerid) {
			this.mapViewer = this.viewer
			let index = this.mapViewer.imageryLayers.length
			let showopt = this.basemaps.find(obj => obj.show == true)
			if (showopt == undefined)
				showopt = this.basemaps[0]
			if (showopt.type == "group") {
				if (index >= 2) {
					let showZJLayer = this.mapViewer.imageryLayers.get(1)
					let result = this.mapViewer.imageryLayers.remove(showZJLayer)
					let showLayer = this.mapViewer.imageryLayers.get(0)
					result = this.mapViewer.imageryLayers.remove(showLayer)
				}
			} else {
				if (index >= 1) {
					let showLayer = this.mapViewer.imageryLayers.get(0)
					let result = this.mapViewer.imageryLayers.remove(showLayer)
				}
			}
			this.basemaps.forEach(item => {
				if (item.id == layerid) {
					item.show = true
					var imgModel = baseMapLayer.getImageryLayer(item)
					if (imgModel.zjlayer) {
						this.mapViewer.imageryLayers.add(imgModel.zjlayer)
						this.mapViewer.imageryLayers.lowerToBottom(imgModel.zjlayer)
					}

					if (imgModel.layer) {
						this.mapViewer.imageryLayers.add(imgModel.layer)
						this.mapViewer.imageryLayers.lowerToBottom(imgModel.layer)
					}

				} else {
					item.show = false
				}
			});

		},

		terrainFn(terrainid) {
			this.terrains.forEach(item => {
				if (item.id == terrainid) {
					item.show = true
					this.mapViewer.terrainProvider = terrainLayer.getTerrainProvider(item)
				} else {
					item.show = false
				}
			});
		}
	}
}
</script>

<style scoped>
.image {
	border-radius: 12px;
	border: 1px solid #06223E;
	height: 66px;
	width: 66px;
}

.image:hover {
	box-shadow: 0 0 3px 3px rgb(255, 255, 255);
}

.selectimg {
	border: 2px solid rgb(255, 255, 255);
}

.imgli {
	list-style: none;
	display: inline-block;
	vertical-align: top;
	margin-top: 5px;
	margin-right: 15px;
	text-align: center;
}

.layername {
	width: 64px;
}


.baseLayerPicker {
	z-index: 999;
	position: absolute;
	left: 7rem;
	bottom: 5rem;
	color: white;
	border-radius: 15px;
}

.mapbox {
	color: white;
	padding-left: 15px;
	padding-right: 15px;
}

.baseLayerPicker-sectionTitle {
	color: white;
	font-size: large;
	text-align: left;
	padding-left: 15px;
	padding-bottom: 10px;
}

.baseLayerPicker-section-terrain,
.baseLayerPicker-section-layers {
	border-radius: 10px;
	padding-left: 15px;
	padding-bottom: 10px;
}
</style>
