
const ArcServer = "http://36.152.66.51:6080/arcgis";
const GeoServer = "http://36.152.66.51:7000/geoserver";

export default class ServerInfo{
	/**
	 * ArcGIS服务
	 * @static
	 * @memberof ServerInfo
	 */
	static arcCYQ_WMS = ArcServer+"/rest/services/朝阳区/MapServer"
	static arcCYQ_WMTS = ArcServer+"/rest/services/%E6%9C%9D%E9%98%B3%E5%8C%BA_84/MapServer/WMTS/tile/1.0.0/朝阳区_84/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
	static arcCYQ_WMTS2000 = ArcServer+"/rest/services/%E6%9C%9D%E9%98%B3%E5%8C%BA_2000/MapServer/WMTS/tile/1.0.0/朝阳区_2000/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"


	/**
	 * GeoServer服务
	 * @static
	 * @memberof ModelInfo
	 */
	static geoserverWMS = GeoServer+"/zhkt/wms"
	static geoserverWMTS = GeoServer+"/gwc/service/wmts"
	static geoserverWFS = GeoServer+"/zhkt/wfs"



}
