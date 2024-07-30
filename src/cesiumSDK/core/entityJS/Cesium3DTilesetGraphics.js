import * as Cesium from 'cesium'

class TilesetGraphics {
    draw() {
        window.v.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "..//public/L15_001_test.json",
                // maximumScreenSpaceError: 2, //最大的屏幕空间误差
                // maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
            })
        );
    }
}
const Tileset = new TilesetGraphics();
export function drawTileset() {
    Tileset.draw();
}