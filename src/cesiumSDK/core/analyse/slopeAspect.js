import CreatePolygonOnGround from "../draw/CreatePolygonOnGround";
import CreateRemindertip from "../draw/ReminderTip.js";
import * as turf from "@turf/turf";
import * as Cesium from "cesium";


/**
 * 坡度坡向分析类
 */
class SlopeAspect {

  /**
   * 坡度坡向分析
   * @class
   * @param {Object|Cesium.Viewer} viewer - viewer实例
   */
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.result = []; //存储创建的坡度分析结果，primitive集合
    this.handler = undefined;
    this.toolTip = "";
    this.clicked = false;
    this.colors = []

  }
  /**
   * 开启Tip
   * @description  打开坡度坡向分析结果tip提示
   */
  openTip() {
    const $this = this;
    const viewer = this.viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this.handler.setInputAction(function (movement) {
      let endPos = movement.endPosition;
      var pick = viewer.scene.pick(endPos);
      if (pick && pick.id && pick.id.type === "SlopeAspect") {
        $this.toolTip = "坡度：" + pick.id.value[0].toFixed(2) + '°' + "<br /> " + '坡向：' + pick.id.value[1].toFixed(2) + '°';
        CreateRemindertip($this.toolTip, endPos, true);
      } else {
        $this.toolTip = "";
        CreateRemindertip($this.toolTip, endPos, false);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  /**
  * 关闭Tip
  * @description  关闭坡度坡向分析结果tip提示
  */
  closeTip() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = undefined;
    }
  }

  /**
  * 等距离切分
  * @description  等距离切分网格 按传入距离分割
  * @param { Number } distance 等距切分的距离
  * @param {Array} colors 分析区域色阶颜色
  */
  analysisByDistance(distance, colors) {
    this.colors = colors || []
    distance = distance || 0.05; //默认0.1km精度
    let width = distance * 200 > 35 ? 35 : distance * 200;
    this.arrowWidth = width < 15 ? 15 : width;
    const $this = this;
    const viewer = this.viewer;
    CreatePolygonOnGround(
      viewer,
      [],
      {
        color: Cesium.Color.RED.withAlpha(0.1),
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
      },
      function (polygon) {
        let degrees = $this.Cartesian3ListToWGS84(polygon.pottingPoint);
        viewer.entities.remove(polygon);
        let boundary = [];
        let minX = 10000,
          minY = 10000,
          maxX = -10000,
          maxY = -1000;
        for (let index = 0; index < degrees.length; index++) {
          const element = degrees[index];
          const x = element.lng;
          const y = element.lat;
          boundary.push([x, y]);
          minX = x < minX ? x : minX;
          minY = y < minY ? y : minY;
          maxX = x > maxX ? x : maxX;
          maxY = y > maxY ? y : maxY;
        }
        boundary.push(boundary[0]);
        let bbox = [minX, minY, maxX, maxY];
        let mask = turf.polygon([boundary]);
        let gridSquare = turf.squareGrid(bbox, distance, { mask: mask });
        $this.createEllipse(gridSquare);
      }
    );
  }
  /**
  * 等分切分
  * @description  等分切分网格，按传入个数切分成一个num*num的网格
  * @param { Number } num 等分切分的横纵个数
  * @param {Array} colors 分析区域色阶颜色
  */
  analysisByNum(num, colors) {
    this.colors = colors || []
    if (!this.clicked) {
      this.clicked = true;

      num = num || 20; //默认切分成一个20*20的网格
      const $this = this;
      const viewer = this.viewer;
      CreatePolygonOnGround(
        viewer,
        [],
        {
          color: Cesium.Color.RED.withAlpha(0.1),
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
        },
        function (polygon) {
          $this.clicked = false
          let degrees = $this.Cartesian3ListToWGS84(polygon.pottingPoint);
          viewer.entities.remove(polygon);
          let boundary = [];
          let minX = 10000,
            minY = 10000,
            maxX = -10000,
            maxY = -1000;
          for (let index = 0; index < degrees.length; index++) {
            const element = degrees[index];
            const x = element.lng;
            const y = element.lat;
            boundary.push([x, y]);
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
          }
          boundary.push(boundary[0]);
          let bbox = [minX, minY, maxX, maxY];
          let a = maxX - minX;
          let b = maxY - minY;
          b = b > a ? b : a;
          const step = b / num;
          let width = step * 2000 > 35 ? 35 : step * 2000;
          $this.arrowWidth = width < 15 ? 15 : width;
          let mask = turf.polygon([boundary]);
          let gridSquare = turf.squareGrid(bbox, step, {
            units: "degrees",
            mask: mask,
          });
          $this.createEllipse(gridSquare);
        }
      );
    }
  }
  /**
  * @private
  * @param {Object} gridSquare 切分成的网格geojson
  */
  createEllipse(gridSquare) {
    let boxResults = [];
    for (let index = 0; index < gridSquare.features.length; index++) {
      const feature = gridSquare.features[index];
      const coordinates = feature.geometry.coordinates[0];
      const centerdegree = [
        (coordinates[0][0] + coordinates[2][0]) / 2,
        (coordinates[0][1] + coordinates[2][1]) / 2,
      ];
      let centerCartographic = Cesium.Cartographic.fromDegrees(
        centerdegree[0],
        centerdegree[1]
      );
      boxResults.push(centerCartographic);
      for (let i = 0; i < coordinates.length; i++) {
        const coord = coordinates[i];
        let cartographic = Cesium.Cartographic.fromDegrees(coord[0], coord[1]);
        boxResults.push(cartographic);
        const coord1 = coordinates[i + 1];
        if (coord1) {
          let newCoord = [
            (coord[0] + coord1[0]) / 2,
            (coord[1] + coord1[1]) / 2,
          ];
          let newCartographic = Cesium.Cartographic.fromDegrees(
            newCoord[0],
            newCoord[1]
          );
          boxResults.push(newCartographic);
        }
      }
    }
    Cesium.sampleTerrainMostDetailed(
      this.viewer.scene.terrainProvider,
      boxResults
    ).then((updatePositions) => {
      let arrr = [];
      let ellipseResults = updatePositions.reduce(function (
        pre,
        item,
        index,
        updatePositions
      ) {
        var begin = index * 10;
        var end = begin + 10;
        var res = updatePositions.slice(begin, end);
        if (res.length != 0) {
          arrr[index] = res;
        }
        return arrr;
      },
        []);
      this.calculateSlope(ellipseResults);
    });
  }
  /**
  * 生成切分后的小网格实例
  * @private
  */
  createPolygonInsrance(points, color) {
    let positions = [];
    for (let index = 1; index < points.length - 1; index++) {
      const element = points[index];
      positions.push(Cesium.Cartographic.toCartesian(element));
    }
    let polygon = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(positions),
    });

    let polygonInstance = new Cesium.GeometryInstance({
      geometry: polygon,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.fromCssColorString(color)
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true), //显示或者隐藏
      },
    });
    return polygonInstance;
  }

  /**
   * 生成坡向箭头实例
   * @private
   */
  createArrowInstance(
    targetPoint,
    center,
    diagonalPoint,
    heightDifference,
    degSlope
  ) {
    let cartographic_0 = new Cesium.Cartographic(
      (targetPoint.longitude + center.longitude) / 2,
      (targetPoint.latitude + center.latitude) / 2,
      (targetPoint.height + center.height) / 2
    );
    let cartographic_1 = new Cesium.Cartographic(
      (diagonalPoint.longitude + center.longitude) / 2,
      (diagonalPoint.latitude + center.latitude) / 2,
      (diagonalPoint.height + center.height) / 2
    );
    //偏移的
    let positions1 =
      heightDifference > 0
        ? [
          Cesium.Cartographic.toCartesian(cartographic_0),
          Cesium.Cartographic.toCartesian(cartographic_1),
        ]
        : [
          Cesium.Cartographic.toCartesian(cartographic_1),
          Cesium.Cartographic.toCartesian(cartographic_0),
        ];
    let radius = this.getHeading(positions1[0], positions1[1]);
    let digital = radius * (180 / Math.PI);

    //箭头线
    const instance = new Cesium.GeometryInstance({
      id: {
        type: "SlopeAspect",
        value: [degSlope, digital],
      },
      geometry: new Cesium.GroundPolylineGeometry({
        positions: positions1,
        width: this.arrowWidth,
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.BLUE.withAlpha(0.6)
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true), //显示或者隐藏
      },
    });
    return instance;
  }

  /**
   * 根据两点获取朝向
   * @private
   */
  getHeading(pointA, pointB) {
    let heading = 0;
    if (!Cesium.Cartesian3.equals(pointA, pointB)) {
      //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
      let transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
      //向量AB
      let positionvector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
      //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
      //AB为世界坐标中的向量
      //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
      let vector = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()), positionvector, new Cesium.Cartesian3());
      if (!Cesium.Cartesian3.equals(new Cesium.Cartesian3(0, 0, 0), vector)) {
        //归一化
        let direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
        if (!Cesium.Cartesian3.equals(new Cesium.Cartesian3(0, 0, 0), direction)) {
          let a = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
          heading = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(a);
        }
      }
    }
    return heading;
  }
  /**
   * 计算坡度坡向
   * @private
   */
  calculateSlope(ellipseResults) {
    let instances = [];
    let polygonInstance = [];
    for (let index = 0; index < ellipseResults.length; index++) {
      const ellipse = ellipseResults[index];

      const center = ellipse[0];
      let heightDifference = 0;
      let maxIndex = 0;
      for (let i = 1; i < ellipse.length - 1; i++) {
        const point = ellipse[i];
        let curHD = point.height - center.height;
        if (Math.abs(curHD) > heightDifference) {
          heightDifference = curHD;
          maxIndex = i;
        }
      }
      let pos0 = new Cesium.Cartographic(center.longitude, center.latitude, 0);
      let pos1 = new Cesium.Cartographic(
        ellipse[maxIndex].longitude,
        ellipse[maxIndex].latitude,
        0
      );
      let distance = Cesium.Cartesian3.distance(
        Cesium.Cartographic.toCartesian(pos0),
        Cesium.Cartographic.toCartesian(pos1)
      );
      let curSlope = Math.abs(heightDifference / distance); //坡度的tan值
      let degSlope = Cesium.Math.toDegrees(Math.abs(heightDifference / distance))

      let curColor = this.calculateSlopeColor(curSlope);
      const curPolygonInstance = this.createPolygonInsrance(ellipse, curColor);
      polygonInstance.push(curPolygonInstance);

      let diagonalPoint =
        maxIndex > 4 ? ellipse[maxIndex - 4] : ellipse[maxIndex + 4]; //对角点
      let targetPoint = ellipse[maxIndex];

      const arrowInstance = this.createArrowInstance(
        targetPoint,
        center,
        diagonalPoint,
        heightDifference,
        degSlope
      );
      instances.push(arrowInstance);
    }
    const mapPrimitive = this.viewer.scene.primitives.add(
      new Cesium.GroundPrimitive({
        geometryInstances: polygonInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true, //false时透明度无效
          closed: false,
        }),
      })
    );
    const arrowPrimitive = this.viewer.scene.primitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: instances,
        appearance: new Cesium.PolylineMaterialAppearance({
          material: new Cesium.Material({
            fabric: {
              type: "PolylineArrow",
              uniforms: {
                color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
              },
            },
          }),
        }),
      })
    );
    this.result.push(arrowPrimitive, mapPrimitive);
  }

  /**
   * 清空分析
   */
  clear() {
    this.result.forEach((element) => {
      this.viewer.scene.primitives.remove(element);
    });
    this.result = [];
  }

  /**
   * 根据坡度值赋值颜色
   * @private
   */
  calculateSlopeColor(value) {
    // 0°～0.5°为平原0.00872686779075879,rgb(85,182,43)
    // 0.5°～2°为微斜坡0.03492076949174773,rgb(135,211,43)
    // 2°～5°为缓斜坡0.08748866352592401,rgb(204,244,44)
    // 5°～15°为斜坡0.2679491924311227,rgb(245,233,44)
    // 15°～35°为陡坡0.7002075382097097,rgb(255,138,43)
    // 35°～55°为峭坡1.4281480067421144,rgb(255,84,43)
    // 55°～90°为垂直壁,rgb(255,32,43)
    if (value < 0.00872686779075879) {
      return this.colors.length ? this.colors[0] : "rgba(85,182,43," + 0.4 + ")";
    } else if (value < 0.03492076949174773) {
      return this.colors.length ? this.colors[1] : "rgba(135,211,43," + 0.4 + ")";
    } else if (value < 0.08748866352592401) {
      return this.colors.length ? this.colors[2] : "rgba(204,244,44," + 0.4 + ")";
    } else if (value < 0.2679491924311227) {
      return this.colors.length ? this.colors[3] : "rgba(245,233,44," + 0.4 + ")";
    } else if (value < 0.7002075382097097) {
      return this.colors.length ? this.colors[4] : "rgba(255,138,43," + 0.4 + ")";
    } else if (value < 1.4281480067421144) {
      return this.colors.length ? this.colors[5] : "rgba(255,84,43," + 0.4 + ")";
    } else {
      return this.colors.length ? this.colors[6] : "rgba(255,32,43," + 0.4 + ")";
    }
  }
  /**
   * 笛卡尔坐标数组转WGS84
   * @private
   * @param {Array} cartesianList 笛卡尔坐标数组
   * @returns {Array} WGS84经纬度坐标数组
   */
  Cartesian3ListToWGS84(cartesianList) {
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    let result = [];
    for (let index = 0; index < cartesianList.length; index++) {
      const cartesian = cartesianList[index];
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      result.push({
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height,
      });
    }
    return result;
  }
}
export default SlopeAspect;
