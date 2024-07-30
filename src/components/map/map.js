import mapPNG from "@/assets/basemaps/tdt_img.png";
import DateBody from "ant-design-vue/lib/vc-picker/panels/DatePanel/DateBody";
import axios from 'axios'

export function baseMaps() {
    var imageProviderVMs = [];
    var img_tdt_yx = new Cesium.ProviderViewModel({
        name: "天地图影像",
        tooltip: "天地图影像",
        //显示切换的图标
        iconUrl: mapPNG,
        creationFunction: function () {
            var img_tdt = new Cesium.WebMapTileServiceImageryProvider({
                url: 'http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=e79bd7f79e49dbdd15eb24aca1fcb9ea',
                layer: 'img',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'w',
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                credit: new Cesium.Credit('天地图影像'),
            })
            return tdt_key;
        }
    });
    imageProviderVMs.push(img_tdt_yx);


    // var img_tdt_sl = new Cesium.ProviderViewModel({
    //     name: "天地图矢量",
    //     tooltip: "天地图矢量底图",
    //     iconUrl: mapPNG,
    //     creationFunction: function () {
    //         var tdt_key = "c1d6b49adb2ba817109873dbc13becb4";
    //         var img_tdt = new Cesium.WebMapTileServiceImageryProvider({
    //             url: "http://t0.tianditu.com/vec_w/wmts?tk=" + tdt_key,
    //             layer: 'vec',
    //             style: 'default',
    //             tileMatrixSetID: 'w',
    //             format: 'tiles',
    //             maximumLevel: 18
    //         });
    //         return img_tdt;
    //     }
    // });
    // imageProviderVMs.push(img_tdt_sl);

    let gaodeImageProvider = new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        subdomains: ["1", "2", "3", "4"],
    });
    var gaodeVM = new Cesium.ProviderViewModel({
        name: "高德矢量",
        iconUrl: Cesium.buildModuleUrl(
            "Widgets/Images/ImageryProviders/openStreetMap.png"
        ),
        tooltip: "高德矢量 地图服务",
        creationFunction: function () {
            return gaodeImageProvider;
        },
    });
    imageProviderVMs.push(gaodeVM);



    // //江苏影像
    // let jsImageProvider = new Cesium.ArcGisMapServerImageryProvider({
    //     url: "http://218.2.231.245/mapjs2/rest/services/MapJS/js_yxdt_latest/MapServer",
    // });
    // var jsVM = new Cesium.ProviderViewModel({
    //     name: "江苏影像",
    //     iconUrl: mapPNG,
    //     tooltip: "江苏影像地图服务",
    //     creationFunction: function () {
    //         return jsImageProvider;
    //     },
    // });
    // imageProviderVMs.push(jsVM);


    return imageProviderVMs;

}

// 加载楼栋Primitive
export function addLdPrimitive(lid, coordinates, index, bottomHeight, height) {
    let id = lid
    if (index == undefined) {
        id = lid
    } else {
        id = lid + "-" + (index + 1)
    }
    const primitive = new Cesium.ClassificationPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({

                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(coordinates)
                ),
                extrudedHeight: height,
                height: bottomHeight,
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                show: new Cesium.ShowGeometryInstanceAttribute(true), //确定是否显示几何实例
            },
            id: id
        }),
        classificationType: Cesium.ClassificationType.BOTH,
        // show:false
    })
    return primitive
}

var currentObjectId;
var currentPrimitive;
var attributes;
var currentColor;
var currentShow;

// 高亮元素
const hightLighted = {
    feautre: undefined,
    originalColor: new Cesium.Color(),
}

export function addClickEvent(handler, scene, that) {
    handler.setInputAction(function (movement) {
        // 清除之前的高亮元素
        if (Cesium.defined(hightLighted.feature)) {
            hightLighted.feature.color = hightLighted.originalColor;
            hightLighted.feature = undefined;
        }
        var pickedObject = scene.pick(movement.position);
        //TODO 改写点击属性弹出层  已完成
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
            const propertyIds = pickedObject.getPropertyIds();
            const length = propertyIds.length;
            let property = [];
            for (let i = 0; i < length; ++i) {
                let map = {};
                const propertyId = propertyIds[i];
                console.log(`{propertyId}: ${pickedObject.getProperty(propertyId)}`);
                map.value = pickedObject.getProperty(propertyId);
                map.key = propertyId;
                property.push(map)
            }
            that.peoperty(property);
        }
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            if (pickedObject.id === currentObjectId) {
                return;
            }
            if (Cesium.defined(currentObjectId)) {
                attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
                attributes.color = currentColor;
                attributes.show = currentShow;
                currentObjectId = undefined;
                currentPrimitive = undefined;
                currentColor = undefined;
                currentShow = undefined;
            }
        }

        // 存储选中要素的信息
        if (pickedObject != undefined) {
            hightLighted.feature = pickedObject;
            Cesium.Color.clone(
                pickedObject.color,
                hightLighted.originalColor
            );
            // 高亮选中元素
            pickedObject.color = Cesium.Color.YELLOW;
        }



        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)) {
            currentObjectId = pickedObject.id;
            currentPrimitive = pickedObject.primitive;
            attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
            currentColor = attributes.color;
            currentShow = attributes.show;
            if (!scene.invertClassification) {
                attributes.color = [255, 0, 255, 128];
            }
            attributes.show = [1];
            that.peoperty([{ key: 111, value: 222 }]);
        } else if (Cesium.defined(currentObjectId)) {
            attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
            attributes.color = currentColor;
            attributes.show = currentShow;
            currentObjectId = undefined;
            currentPrimitive = undefined;
            currentColor = undefined;
            //TODO 属性弹出层隐藏
        } else {
            //TODO 属性弹出层隐藏
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function loadJXZModel() {
    const ldCollection = new Cesium.PrimitiveCollection();
    axios.get('http://localhost:8060/%E6%B1%9F%E5%BF%83%E6%B4%B2.json').then((res) => {
        console.log('res.data = ', res.data)
        for (let i = 0; i < res.data.features.length; i++) {
            const entity = res.data.features[i];
            let temp = entity.geometry.coordinates[0].join(",")
            let coordinates = temp.split(',')
            ldCollection.add(
                addLdPrimitive(entity.id, coordinates, undefined, 7, entity.properties.Height)
            );
        }
    })
    return ldCollection
}



