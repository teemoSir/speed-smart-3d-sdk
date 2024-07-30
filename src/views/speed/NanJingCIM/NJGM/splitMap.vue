<template>
    <div class="ktmap2">
        <div :id="mapidL" class="cesiumContainer1"></div>
        <div :id="mapidR" class="cesiumContainer2"></div>
    </div>
</template>

<script>
import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
export default {
    name: "splitMap",
    created() {
        this.mapidL = uuid.v4();
        this.mapidR = uuid.v4();
    },
    mounted() {
        this.initMapL()

        this.initMapR()

        let syncObj = new Speed.SyncViewer(this.mapL._viewer, this.mapR._viewer);
        syncObj.sync(true)
    },
    methods: {
        initMapL() {
            let data = {
                containID: this.mapidL,
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
                    },
                    {
                        id: 102,
                        name: "星图电子",
                        icon: "img/basemaps/tdt_vec.png",
                        tooltip: "星图电子地图服务",
                        type: "xt",
                        layer: "vec",

                    }
                ],
                baseLayerPicker: false, //底图切换按钮
                homeButton: false, //回到默认视域按钮
                sceneModePicker: false, //是否显示投影方式切换按钮
                fullscreenButton: false, //全屏按钮
                statusBar: {
                    show: true,
                    fps: false
                },
                navigationControl: {
                    compass: {
                        show: true,
                        style: { top: "50px", left: "5px" }
                    }
                }//导航球
            };
            this.speedMapL = new Speed.SpeedViewer()
            this.mapL = this.speedMapL.init(data);

            //加载模型
            let tileset = new Speed.TilesetLayer().loadTilesetLayer({
                url: "http://36.152.66.51:8088/3dtiles/江心洲/tileset.json",
            });
            this.speedMapL.addLayer(tileset._tileset)
            this.speedMapL.flyto(tileset._tileset)

        },
        initMapR() {

            let data = {
                containID: this.mapidR,
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
                    },
                    {
                        id: 102,
                        name: "星图电子",
                        icon: "img/basemaps/tdt_vec.png",
                        tooltip: "星图电子地图服务",
                        type: "xt",
                        layer: "vec",
                        show: "true"
                    }
                ],

                baseLayerPicker: true, //底图切换按钮
                homeButton: true, //回到默认视域按钮
                sceneModePicker: true, //是否显示投影方式切换按钮
                fullscreenButton: false, //全屏按钮
                statusBar: {
                    show: true,
                    fps: false
                },
                navigationControl: {
                    compass: {
                        show: true,
                        style: { top: "50px", left: "5px" }
                    }
                }//导航球
            };
            this.mspeedMapR = new Speed.SpeedViewer()
            this.mapR = this.mspeedMapR.init(data);

            //加载模型
            let tileset = new Speed.TilesetLayer().loadTilesetLayer({
                url: "http://36.152.66.51:8088/3dtiles/江心洲/tileset.json",
            });
            this.mspeedMapR.addLayer(tileset._tileset)
            this.mspeedMapR.flyto(tileset._tileset)
        }

    },
}
</script>

<style scoped>
.ktmap2 {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
}

.cesiumContainer1 {
    display: inline-block;
    width: 50%;
    height: 100%;
}

.cesiumContainer2 {
    display: inline-block;
    width: 50%;
    height: 100%;
}
</style>