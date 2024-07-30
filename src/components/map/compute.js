export function getHeight(tileset, viewer) {
  tileset.readyPromise.then(function (tileset) {
    var boundingSphere = tileset.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    let height = 0.0;
    let positions = boundingSphere.center;
    positions = Cesium.Cartographic.fromCartesian(positions);
    var promise = new Cesium.sampleTerrain(viewer.terrainProvider, 13, [
      positions,
    ]);
    promise = Cesium.sampleTerrainMostDetailed(
      viewer.terrainProvider,
      positions
    );
    Promise.resolve(promise).then(function (updatedPositions) {
      height = updatedPositions.height;
      var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      );
      var positions = [
        Cesium.Cartographic.fromRadians(
          cartographic.longitude,
          cartographic.latitude
        ),
      ];
      var promise = Cesium.sampleTerrainMostDetailed(
        viewer.terrainProvider,
        positions
      );
      Promise.resolve(promise).then(function (updatedPositions) {
        var terrainHeight = updatedPositions[0].height;
        var offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          terrainHeight
        );
        var translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      });
    });
  });
}
