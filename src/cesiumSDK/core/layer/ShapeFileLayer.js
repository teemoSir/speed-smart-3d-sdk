import SpeedLayer from './base/speedLayer'
import * as shapefile from './shapefile';
import * as Cesium from "cesium";


class ShapeFileLayer extends SpeedLayer {

	async createAndLoadShp(shpData, dbfData, options) {
		var myFeatures = [];
		var _shpLayer;
		await shapefile
			.open(shpData, dbfData, options)
			.then((source) =>
				source.read().then(function log(result) {
					if (result.done) {
						let _mGeoJson = {
							type: "FeatureCollection",
							features: myFeatures,
						};

						 _shpLayer = Cesium.GeoJsonDataSource.load(_mGeoJson, {
							clampToGround: options.clampToGround,
							stroke: options.borderColor,
							fill: options.fillColor,
							strokeWidth: options.width
						})
						return _shpLayer;
					} else {
						var _result = result.value;
						var _curFeature = {
							type: _result.type,
							geometry: {
								type: _result.geometry.type,
								coordinates: _result.geometry.coordinates,
							},
							properties: _result.properties,
						};
						myFeatures.push(_curFeature);
						return source.read().then(log);
					}
				})
			)
			.catch((error) => console.error(error.stack));


			return _shpLayer;
	}

}
export default ShapeFileLayer
