import * as Cesium from 'cesium';
import computerAngle from '@/cesiumSDK/core/computer/angle';
let myAngle = new computerAngle();
let positions;
let xy;
let primitiveObject = [];
let show;
/**
* Primitive实体类
*/
class SpeedPrimitive {
    /**
    * 构造函数
    * @param {*} viewer -地图主窗口
    */
    constructor(viewer) {
        this.viewer = viewer;
        this.pointCollection = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
        this.billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
        this.labelCollection = viewer.scene.primitives.add(new Cesium.LabelCollection());
        this.polylineCollection = viewer.scene.primitives.add(new Cesium.PolylineCollection());
    }
    /**
    *Primitive点实体
    * @param {Object} parameter -primitive实体默认配置项 
    * @param {Array} [parameter.clickPointH] -点坐标数组（x,y,z）

    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.pixelSize] -点实体的像素大小,默认为10像素   
    * @param {String}[parameter.pointColor] -16进制实体颜色，默认16进制'#d3e2ec'
    * @param {String}[parameter.outlineColor] -16进制实体边框颜色，默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度,默认为2像素
    * @return {Cesium.Primitive} -返回单个点实体
    */
    PointCollection(parameter) {
        xy = parameter.clickPointH;
        show = parameter.show == undefined ? true : parameter.show;
        return this.pointCollection.add({
            // show,
            position: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 100)),
            pixelSize: parameter.pixelSize || 10.0,
            color: Cesium.Color.fromCssColorString(parameter.pointColor || '#007acc'),
            outlineColor: Cesium.Color.fromCssColorString(parameter.outlineColor || '#e74032'),
            outlineWidth: parameter.outlineWidth || 1,
        });
    }
    /**
    * Primitive广告牌实体
    * @param {Object} parameter -primitive实体默认配置项  
    * @param {Array} [parameter.clickPointH] -点坐标数组（x,y,z）

    * @param {Boolean}[parameter.img] -广告牌图片路径
    * @param {Number} [parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为100米
    * @param {Number} [parameter.billboardWidth] -广告牌实体自身宽度（单位：米），默认20米
    * @param {Number} [parameter.billboardHeight] -广告牌实体自身高度（单位：米），默认20米
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -垂直对齐方式，默认VerticalOrigin.BOTTOM；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.pixelOffset] -像素屏幕偏移，默认[0, 0]
    * @return {Cesium.Primitive} -返回单个广告牌实体
    */
    BillboardCollection(parameter) {
        xy = parameter.clickPointH;
        show = parameter.show == undefined ? true : parameter.show;
        return billboardCollection.add({
            // show,
            position: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 100)),
            image: require(`@/assets/speed/public/${parameter.img}`),
            width: parameter.billboardWidth || 20,
            height: parameter.billboardHeight || 20,
            horizontalOrigin: parameter.horizontalOrigin || Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: parameter.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffset || [0, 0])),
        });
    }
    /**
    * Primitive文本实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} [parameter.clickPointH] -点坐标数组（x,y,z）
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体

    * @param {String}[parameter.labelText] -标签文本的文本内容
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.Color}[parameter.backgroundColor] -文本背景颜色，默认16进制'#007acc'
    * @param {Cesium.HorizontalOrigin} [parameter.horizontalOrigin] -文本水平对齐方式，默认HorizontalOrigin.CENTER；CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    * @param {Cesium.verticalOrigin} [parameter.verticalOrigin] -文本垂直对齐方式，默认VerticalOrigin.CENTER；CENTER 原点位于BASELINE和TOP之间的垂直中心；BOTTOM 原点在对象的底部；BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    * @param {Array} [parameter.backgroundPadding] -文本内边距，默认[0,0]
    * @param {Array} [parameter.pixelOffset] -文本像素偏移，默认[0,0]
    * @param {String}[parameter.fillColor] -16进制文本颜色，默认16进制'#9cdcfe'
    * @param {String}[parameter.outlineColor] -16进制实体边框颜色，默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度,默认为2像素
    * @return {Cesium.Entity} -返回标签文本实体
    */
    LabelCollection(parameter) {
        xy = parameter.clickPointH;
        show = parameter.show == undefined ? true : parameter.show;
        return labelCollection.add({
            // show,
            position: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 100)),
            fillColor: Cesium.Color.fromCssColorString(parameter.fillColor || '#9cdcfe'),
            outlineColor: Cesium.Color.fromCssColorString(parameter.outlineColor || '#e74032'),
            outlineWidth: parameter.outlineWidth || 2,
            backgroundPadding: new Cesium.Cartesian2(...(parameter.backgroundPadding || [0, 0])),
            text: parameter.labelText || '文本内容',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            showBackground: true,
            font: '10pt Source Han Sans CN',    //字体样式
            backgroundColor: Cesium.Color.fromCssColorString(parameter.backgroundColor || '#007acc'),    //背景颜色
            horizontalOrigin: parameter.horizontalOrigin || Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: parameter.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(...(parameter.pixelOffset || [0, 0])),
        });
    }
    /**
    * Primitive线段集合方法
    * @param {Object} parameter -primitive实体默认配置项                       
    * @param {Array} [parameter.clickPointH] -点坐标数组（x,y,z）
    * @param {Cesium.Color}[parameter.LineColor] -16进制实体颜色，默认16进制'#9d3a3a'
    * @param {Number}[parameter.polylineWidth] 线实体宽度，默认5米
    * @return {Cesium.Entity} -返回单个线段实体
    */
    PolylineCollection(parameter) {
        show = parameter.show == undefined ? true : parameter.show;
        xy = parameter.clickPointH;
        return polylineCollection.add({
            position: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 100)),
            color: Cesium.Color.fromCssColorString(parameter.LineColor || '#9d3a3a'),
            // show,
            width: parameter.polylineWidth || 5,
        });
    }


    /**
    *Primitive矩形实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -矩形实体的对顶角两个坐标数组
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回矩形实体和对应轮廓线实体
    */
    RectangleGeometry(parameter) {
        xy = parameter.clickPointH;
        let x = Math.min(xy[3], xy[0]);
        let y = Math.min(xy[1], xy[4]);
        let x1 = Math.abs(xy[3] - xy[0]);
        let y1 = Math.abs(xy[4] - xy[1]);
        let rectangle = Cesium.Rectangle.fromDegrees(x, y, x + x1, y + y1);
        let [height, elevation] = this.heEle(parameter.height, parameter.elevation);
        // 1.矩形实体
        let rectangleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
                rectangle,
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
            }),
            id: 'RectangleGeometry',
        });
        // 矩形实体边界
        let rectangleOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleOutlineGeometry({
                rectangle,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(rectangleInstance, rectangleOutlineInstance, parameter.clampToGround || true);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive多边形实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -多边形实体的坐标数组
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回多边形实体和对应轮廓线实体
    */
    PolygonGeometry(parameter) {
        xy = parameter.clickPointH;
        positions = Cesium.Cartesian3.fromDegreesArrayHeights(xy);
        let [height, elevation] = this.heEle(parameter.height, parameter.elevation);
        let polygonInstance = new Cesium.GeometryInstance({
            geometry: Cesium.PolygonGeometry.fromPositions({
                positions,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            id: 'PolygonGeometry',
        });
        // 多边体边界
        let polygonOutlineInstance = new Cesium.GeometryInstance({
            geometry: Cesium.PolygonOutlineGeometry.fromPositions({
                positions,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(polygonInstance, polygonOutlineInstance, parameter.clampToGround || true);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive椭圆实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -椭圆长半轴线段两点的坐标数组
    * @param {Number} [parameter.radius] -椭圆长半轴半径(单位：米)
    * @param {Number} [parameter.rotation] -椭圆绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.sortR] -椭圆短半轴半径(单位：米)，短半轴默认为长半轴的一半
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回椭圆实体和对应轮廓线实体
    */
    EllipseGeometry(parameter) {
        xy = parameter.clickPointH;
        let r = parameter.radius;
        let semiMinorAxis = parameter.sortR ? parameter.sortR : (r / 2);
        let semiMajorAxis = r;
        let rotation = (parameter.rotation || -1) >= 0 ? Cesium.Math.toRadians(90 - (parameter.rotation || -1)) : Cesium.Math.toRadians(90 - myAngle.angle(xy)[0]);
        let [height, elevation] = this.heEle(parameter.height, parameter.elevation);
        // 3.椭圆
        let ellipseInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipseGeometry({
                center: Cesium.Cartesian3.fromDegrees(xy[0], xy[1]),
                semiMinorAxis,
                semiMajorAxis,
                rotation,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            id: 'EllipseGeometry',
        });
        // 椭圆边界
        let ellipseOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipseOutlineGeometry({
                center: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], elevation),
                semiMinorAxis,
                semiMajorAxis,
                rotation,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(ellipseInstance, ellipseOutlineInstance, parameter.clampToGround || true);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive圆形实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -圆点的坐标数组
    * @param {Number} [parameter.radius] -圆形的半径(单位：米)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回圆形实体和对应轮廓线实体
    */
    CircleGeometry(parameter) {
        xy = parameter.clickPointH;
        let r = parameter.radius;
        let [height, elevation] = this.heEle(parameter.height, parameter.elevation);
        let circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(xy[0], xy[1]),
                radius: r,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            id: 'CircleGeometry',
        });
        // 圆形边界
        let circleOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleOutlineGeometry({
                center: Cesium.Cartesian3.fromDegrees(xy[0], xy[1]),
                extrudedHeight: elevation + height + xy[2],
                height: elevation + xy[2],
                radius: r,
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(circleInstance, circleOutlineInstance, parameter.clampToGround || true);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive走廊实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -走廊实体的坐标数组
    * @param {Number}[parameter.corridorWidth] -走廊实体的宽度（单位：米）
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回走廊实体和对应轮廓线实体
    */
    CorridorGeometry(parameter) {
        xy = parameter.clickPointH;
        let corridorPositions = Cesium.Cartesian3.fromDegreesArrayHeights(xy);
        let width = parameter.zlWidth || 1000;
        let [height, elevation] = this.heEle(parameter.height, parameter.elevation);
        let CorridorGeometry = new Cesium.CorridorGeometry({
            positions: corridorPositions,
            width,
            height: elevation + xy[2],
            extrudedHeight: elevation + height + xy[2],
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });
        let CorridorInstance = new Cesium.GeometryInstance({
            geometry: CorridorGeometry,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            },
            id: 'CorridorGeometry',
        });
        //  走廊实体边界
        let CorridorOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CorridorOutlineGeometry({
                positions: corridorPositions,
                width,
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            },
        });
        let p = this.add(CorridorInstance, CorridorOutlineInstance, parameter.clampToGround || true);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive圆柱/圆锥实体
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} i -判断是否为圆锥，i等于true则上底面半径为0，i等于false则上底面半径等于下底面半径
    * @param {Array} parameter.clickPointH -底面圆点的坐标数组
    * @param {Number} [parameter.radius] -下底面圆的半径(单位：米)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @return {Cesium.Primitive} -返回圆柱/圆锥实体和对应轮廓线实体
    */
    CylinderGeometry(parameter, i) {
        xy = parameter.clickPointH;
        let l = parameter.radius;
        let topRadius = i ? 0 : l;
        let bottomRadius = l;
        let cylinderGeometry = new Cesium.CylinderGeometry({
            length: parameter.height || 20,
            topRadius: topRadius,
            bottomRadius: bottomRadius,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });
        let cylinderModelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2])),
            // 圆柱/圆锥实体高程为中心高程，为此高程要加上拉伸高度的一半
            new Cesium.Cartesian3(0.0, 0.0, (parameter.elevation || 0) + (parameter.height || 20) / 2),
            new Cesium.Matrix4()
        );
        let cylinderInstance = new Cesium.GeometryInstance({
            geometry: cylinderGeometry,
            modelMatrix: cylinderModelMatrix,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 1.0 }))
            },
            id: 'cylinderGeometry',
        });
        // 圆柱体边界
        let cylinderOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CylinderOutlineGeometry({
                length: parameter.height || 20,
                topRadius: topRadius,
                bottomRadius: bottomRadius,
            }),
            modelMatrix: cylinderModelMatrix,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(cylinderInstance, cylinderOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive立方体实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -立方体的坐标数组
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @return {Cesium.Primitive} -返回立方体实体和对应轮廓线实体
    */
    BoxGeometry(parameter) {
        xy = parameter.clickPointH;
        let A = Cesium.Cartesian3.fromDegrees(xy[0], xy[1]);
        let B = Cesium.Cartesian3.fromDegrees(xy[3], xy[4]);
        let C = Cesium.Cartesian3.fromDegrees(xy[3], xy[1]);
        let AC = Cesium.Cartesian3.distance(A, C);
        let BC = Cesium.Cartesian3.distance(B, C);
        let dimensions = new Cesium.Cartesian3(AC, BC, parameter.height || 20);
        let boxGeometry = Cesium.BoxGeometry.fromDimensions({
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            dimensions,
        });
        let boxModelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees((xy[0] + xy[3]) / 2, (xy[1] + xy[4]) / 2)),
            // 立方体实体高程为中心高程，为此高程要加上拉伸高度的一半
            new Cesium.Cartesian3(0.0, 0.0, xy[2] + (parameter.height || 20) / 2 + (parameter.elevation || 0)),
            new Cesium.Matrix4(),
        );
        let boxInstance = new Cesium.GeometryInstance({
            geometry: boxGeometry,
            modelMatrix: boxModelMatrix,
            attributes: { //指定顶点的颜色
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN)
            },
            id: 'BoxGeometry',
        });
        // 立方体边界
        let boxOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.BoxOutlineGeometry.fromDimensions({
                dimensions,
            }),
            modelMatrix: boxModelMatrix,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(boxInstance, boxOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive椭球体实体
    * @param {Object} parameter -primitive实体默认配置项 
    * @param {Array} parameter.clickPointH -椭球体长半轴线段两点的坐标数组
    * @param {Number} [parameter.radius] -椭球体长半轴半径(单位：米)
    * @param {Number} [parameter.rotation] -椭球体绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.sortR] -椭球体短半轴半径(单位：米)，默认为长半轴的一半
    * @param {Number}[parameter.heightR] -椭球体高度(单位：米)，默认为长半轴
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @return {Cesium.Primitive} -返回椭球体实体和对应轮廓线实体
    */
    EllipsoidGeometry(parameter) {
        xy = parameter.clickPointH;
        let r = parameter.radius;
        let sortR = parameter.sortR ? parameter.sortR : (r / 2);
        let heightR = parameter.heightR ? parameter.heightR : (r / 2);
        let position = Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2]);
        let rotation = (parameter.rotation || -1) >= 0 ? Cesium.Math.toRadians(90 - (parameter.rotation || -1)) : Cesium.Math.toRadians(90 - myAngle.angle(xy)[0]);
        let radii = new Cesium.Cartesian3(r, sortR, heightR / 2);
        let ellipsoidGeometry = new Cesium.EllipsoidGeometry({
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            rotation,
            radii,
        });
        let ellipsoidModelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(position),
            new Cesium.Cartesian3(0.0, 0.0, (parameter.elevation || 0) + heightR / 2),
            new Cesium.Matrix4()
        );
        // 设置绕Z轴旋转
        let rotationM = Cesium.Matrix3.fromRotationZ(rotation);
        let newMatrix4 = Cesium.Matrix4.multiplyByMatrix3(ellipsoidModelMatrix, rotationM, new Cesium.Matrix4());
        let ellipsoidInstance = new Cesium.GeometryInstance({
            geometry: ellipsoidGeometry,
            modelMatrix: newMatrix4,
            attributes: { //指定顶点的颜色
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN)
            },
            id: 'ellipsoidGeometry',
        });
        // 椭球体边界
        let ellipsoidOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipsoidOutlineGeometry({
                radii,
                rotation,
                // 控制线条
                stackPartitions: 6,
                slicePartitions: 5
            }),
            modelMatrix: newMatrix4,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(ellipsoidInstance, ellipsoidOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive球体实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -球体中心点的坐标数组
    * @param {Number} [parameter.radius] -球体半径(单位：米)
    * @param {Number}[parameter.elevation] -球心距离地平面的高度 ，默认为100米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @return {Cesium.Primitive} -返回球体实体和对应轮廓线实体
    */
    SphereGeometry(parameter) {
        xy = parameter.clickPointH;
        let r = parameter.radius;

        let sphereGeometry = new Cesium.SphereGeometry({
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            radius: r,
        });
        let sphereModelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2])),
            new Cesium.Cartesian3(0.0, 0.0, r + (parameter.elevation || 0)),
            new Cesium.Matrix4()
        );
        let sphereInstance = new Cesium.GeometryInstance({
            geometry: sphereGeometry,
            modelMatrix: sphereModelMatrix,
            attributes: { //指定顶点的颜色
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN)
            },
            id: 'SphereGeometry',
        });
        // 球体边界
        let sphereOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.SphereOutlineGeometry({
                radius: r,
                // 控制线条
                stackPartitions: 6,
                slicePartitions: 5
            }),
            modelMatrix: sphereModelMatrix,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(sphereInstance, sphereOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive墙体实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -墙体的坐标数组
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @return {Cesium.Primitive} -返回墙体实体和对应轮廓线实体
    */
    WallGeometry(parameter) {
        xy = parameter.clickPointH;

        let bottom = [];
        for (let i = 2; i < xy.length; i = i + 3) {
            bottom.push(xy[i]);
        }
        let newXY = [];
        for (let i = 0, j = 0; i < xy.length; i = i + 3, j++) {
            newXY.push(...xy.slice(i, i + 2));
            newXY.push((parameter.height || 20) + bottom[j]);
        }
        positions = Cesium.Cartesian3.fromDegreesArrayHeights(newXY);
        let WallGeometry = new Cesium.WallGeometry({
            positions: positions,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            minimumHeights: bottom,
        });
        let wallInstance = new Cesium.GeometryInstance({
            geometry: WallGeometry,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            },
            id: 'WallGeometry',
        });
        // 墙体边界
        let wallOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.WallOutlineGeometry({
                positions,
                minimumHeights: bottom,
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            }
        });
        let p = this.add(wallInstance, wallOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive管线实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -管线实体的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗
    * @param {Number}[parameter.gxWidth] -走廊实体的宽度（单位：米）,默认500米
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.Color}[parameter.primitiveColor] -轮廓线的十六进制颜色，默认白色
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @return {Cesium.Primitive} -返回管线实体和对应轮廓线实体
    */
    PolylineVolumeGeometry(parameter) {
        xy = parameter.clickPointH;
        let PolylineVolumePositions = Cesium.Cartesian3.fromDegreesArrayHeights(xy);
        let a = this.computeCircle(parameter.gxWidth || 500);
        let PolylineVolumeGeometry = new Cesium.PolylineVolumeGeometry({
            polylinePositions: PolylineVolumePositions,
            shapePositions: a, xy,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });
        let PolylineVolumeInstance = new Cesium.GeometryInstance({
            geometry: PolylineVolumeGeometry,
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            },
            id: 'PolylineVolumerGeometry',
        });
        //  管线实体边界
        let PolylineVolumeOutlineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineVolumeOutlineGeometry({
                polylinePositions: PolylineVolumePositions,
                width: 1000,
                height: parameter.elevation || 0,
                extrudedHeight: parameter.height || 20,
                shapePositions: a, xy,
            }),
            attributes: {
                color: this.primitiveColor(parameter.primitiveColor),
            },
        });
        let p = this.add(PolylineVolumeInstance, PolylineVolumeOutlineInstance);
        primitiveObject.push(p)
        return p;
    }
    /**
    *Primitive简单线条实体
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -线实体的坐标数组
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.polylineWidth] 线实体宽度，默认10米
    * @param {Boolean}[parameter.clampToGround] -实体是否紧贴地面，默认true
    * @return {Cesium.Primitive} -返回管线实体和对应轮廓线实体
    */
    SimplePolylineGeometry(parameter) {
        xy = parameter.clickPointH;
        let toGround = parameter.clampToGround != undefined ? parameter.clampToGround : true;
        let linePositions = [];
        let primitives = this.viewer.scene.primitives;
        for (let i = 0; i < xy.length; i = i + 3) {
            linePositions.push(Cesium.Cartesian3.fromDegrees(xy[i], xy[i + 1], xy[i + 2] + (parameter.elevation || 0)));
        }
        let primitive;
        if (toGround) {
            primitive = new Cesium.GroundPolylinePrimitive({//贴地primitive线
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.GroundPolylineGeometry({
                        positions: linePositions,
                        width: parameter.polylineWidth || 10,
                        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                    })
                }),
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType)
                })
            })
        } else {
            primitive = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: linePositions,
                        width: parameter.polylineWidth || 10,
                        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                    })
                }),
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType)
                })
            })
        }
        let a = primitives.add(primitive);
        primitiveObject.push(a);
        return a;
    }
    /**
    *Primitive3D模型
    * @param {Object} parameter -primitive实体默认配置项
    * @param {Array} parameter.clickPointH -3D模型的坐标数组
    * @param {String}[parameter.modelPath] -模型路径
    * @param {Number}[parameter.minSize] -3D模型的最小显示像素大小
    * @param {Number}[parameter.maxSize] -3D模型的最大显示像素大小
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.silhouetteSize] -3D模型的轮廓大小，默认为0
    * @param {Cesium.Color}[parameter.modelShow] -是否显示模型，默认显示
    * @param {Cesium.Color}[parameter.silhouetteColor] -3D模型的轮廓颜色，默认不设置
    * @param {Number} [parameter.rotation] -椭圆绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @return {Cesium.Entity} -返回3D模型实体
    */
    PrimitiveModel(parameter) {
        xy = parameter.clickPointH;
        let primitives = this.viewer.scene.primitives;
        if (parameter.modelShow != undefined) {
            show = parameter.modelShow;
        };
        let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(xy[0], xy[1], (parameter.elevation || 0) + xy[2])),
            new Cesium.Cartesian3(0.0, 0.0, 0),
            new Cesium.Matrix4()
        );
        // 设置绕Z轴旋转
        let rotation = (parameter.rotation || -1) >= 0 ? Cesium.Math.toRadians(90 - (parameter.rotation || -1)) : Cesium.Math.toRadians(90 - myAngle.angle(xy)[0]);
        let rotationM = Cesium.Matrix3.fromRotationZ(rotation);
        // 左侧的4*4矩阵乘以右侧的3*3矩阵
        let newMatrix4 = Cesium.Matrix4.multiplyByMatrix3(modelMatrix, rotationM, new Cesium.Matrix4());
        // 使用primitive方式加载模型
        let airplaneModel = primitives.add(
            Cesium.Model.fromGltf({
                url: parameter.modelPath || 'models/GroundVehicle/GroundVehicle.glb',
                modelMatrix: newMatrix4,
                // 模型最小刻度
                minimumPixelSize: parameter.minSize || 64,
                // 模型最大刻度
                maximumPixelSize: parameter.maxSize || 128,
                // 模型是否可见
                show,
                // 模型轮廓颜色
                silhouetteColor: parameter.silhouetteColor || '',
                // 模型轮廓大小，单位px
                silhouetteSize: parameter.silhouetteSize || 0,
            })
        )
        primitiveObject.push(airplaneModel);
        return airplaneModel;
    }
    primitiveColor(color) {
        let myColor = color || '#d3e2ec';
        return Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString(myColor));
    }
    heEle(height, elevation) {
        let height1 = height || 20;
        let elevation1 = (elevation != undefined ? elevation : 0);
        return [height1, elevation1];
    }
    /**
    *Primitive实体轮廓生成方法add()
    * @param {Object} instance -primitive实体容器
    * @param {Object} outInstance -primitive轮廓实体容器
    * @return {Cesium.Primitive} -返回管线实体和对应轮廓线实体
    */
    add(instance, outInstance, i = false) {
        let primitives = this.viewer.scene.primitives;
        let primitive;
        let outPrimitive
        if (i) {
            // 设置贴地
            primitive = new Cesium.GroundPrimitive({
                geometryInstances: instance,
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                    material: Cesium.Material.fromType('Stripe')
                })
            });
        } else {
            primitive = new Cesium.Primitive({
                geometryInstances: instance,
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                    material: Cesium.Material.fromType('Stripe')
                })
            });
            outPrimitive = new Cesium.Primitive({
                geometryInstances: outInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                    flat: true, //为true 无光照
                    translucent: false, //透明配置，false是不透明
                    renderState: {
                        lineWidth: Math.min(14.0, this.viewer.scene.maximumAliasedLineWidth)
                    }
                })
            });
            primitives.add(outPrimitive);
        }
        // 添加实体
        primitives.add(primitive);
        // 添加非实体(实体边界或者线条)
        return { primitive, outPrimitive }
    }
    /**
    *Primitive实体移除方法removeAll()
    */
    removeAll() {
        for (let i = 0; i < primitiveObject.length; i++) {
            // 移除实体及其轮廓线实体
            this.viewer.scene.primitives.remove(primitiveObject[i].primitive);
            this.viewer.scene.primitives.remove(primitiveObject[i].outPrimitive);
            // 移除线条（线条没有实体和轮廓线之分）
            this.viewer.scene.primitives.remove(primitiveObject[i]);
        }
    }
    /**
    *Primitive管线实体形状轮廓生成方法
    * @param {Object} radius -圆形的半径
    * @return {Array} -返回圆形的平面坐标系位置
    */
    computeCircle(radius) {
        let positions = [];
        for (let i = 0; i < 360; i += 9) {
            let radians = Cesium.Math.toRadians(i);
            positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return positions;
    }
}
export default SpeedPrimitive;