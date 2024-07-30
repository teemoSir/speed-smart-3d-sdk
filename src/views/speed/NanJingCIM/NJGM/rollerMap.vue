<template>
    <div :id="mapid" class="ktmap4">
        <div id="slider"></div>
    </div>
</template>

<script>
import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";

export default {
    name: "rollerMap",
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
                fullscreenButton: false, //全屏按钮
                zoom: true, //缩放按钮,
                navigationControl: true,//导航球、比例尺
                statusBar: true,//状态栏
            };

            this.speedMap = new Speed.SpeedViewer()
            this.map = this.speedMap.init(data);

            this.slider = document.getElementById("slider");

            this._mapSplit = new Speed.mapSplit(this.map._viewer, {
                leftLayer: [
                    { name: "星图电子", type: "xt", layer: "vec_d" },
                ],
                rightLayer: [
                    { name: "星图影像", type: "xt", layer: "img_d" },

                ]
            }, this.slider)


            this.tilesetLayer = new Speed.TilesetLayer()
            //加载模型
            let tileset = this.tilesetLayer.loadTilesetLayer({
                url: "http://36.152.66.51:8088/3dtiles/江心洲/tileset.json",
            });
            this.speedMap.flyto(tileset._tileset)
            this.speedMap.addLayer(tileset._tileset)
            tileset._tileset.splitDirection = Cesium.SplitDirection.RIGHT;
        }
    },
}
</script>

<style scoped>
.ktmap4 {
    width: 100%;
    height: 100%;
    background-color: #000;
    position: absolute !important;
    z-index: 10;
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
}
</style>