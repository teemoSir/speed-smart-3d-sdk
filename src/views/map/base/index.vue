<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "baseMap",
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
}`,
			htmlCode:`<div :id="mapid" class="ktmap"></div>`,
			javascriptCode:`import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'

export default {
	name: "ktmap",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
	},

	methods: {
		initMap() {
			this.map = new Speed.SpeedViewer().init({
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 17536414, heading: 0, pitch: -90 },
			});

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
