import * as Cesium from 'cesium';
import computerAngle from '@/cesiumSDK/core/computer/angle';

let myAngle = new computerAngle();
let sectorNum = 0;
let extrudedHeight;
let height;
/**
* 扇形实体
*/
class SectorGraphics {
    /**
    *扇形实体参数计算方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Array} parameter.clickPointH -绘制扇形的3个坐标点
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @return {Cesium.Entity} -返回扇形实体    
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let height = [];
        for (let i = 2; i < xy.length; i = i + 3) {
            height.push(xy[i]);
        }
        let olon = xy[0];
        let olat = xy[1];
        let AB = xy.slice(0, 6);
        let AC = [...xy.slice(0, 3), ...xy.slice(6, 9)]
        // 计算扇形起始线的方位角
        let Pab = myAngle.angle(AB);
        // 计算扇形终点线角度AC
        let Pac = myAngle.angle(AC);
        Pab[0] > Pac[0] ? [Pab[0], Pac[0]] = [Pac[0], Pab[0]] : [];
        if ((xy[3] > xy[0] && xy[7] > xy[1] && xy[0] > xy[6]) || (xy[3] < xy[0] && xy[7] > xy[1] && xy[0] < xy[6])) {
            [Pab[0], Pac[0]] = [Pac[0], 360 + Pab[0]]
        }
        return this.drawNow(olon, olat, Pab[0], Pac[0], Pab[1], parameter, v, height)
    }
    drawNow(x, y, Pab, Pac, ac, p, v, h) {
        let id = '扇形' + (sectorNum == 0 ? '' : sectorNum);
        let points = [];
        // 地球两极稍扁，赤道略鼓
        // 计算椭球体中心到圆心的距离（纬度越接近极点，则使用短半径，否则使用长半径）
        let ec = 6356752 + (6378137 - 6356752) * (90 - y) / 90;
        // 计算圆心在赤道面的垂足投影长度（米）
        let ed = ec * Math.cos(y * Math.PI / 180);
        for (let i = Pab, j = 0; i <= Pac; i += 0.03, j++) {
            // 计算距离坐标点ac米，方位角为i处的坐标点和圆心的X，Y轴距离（米）
            let clon = ac * Math.sin(i * Math.PI / 180);
            let clat = ac * Math.cos(i * Math.PI / 180);
            let jlon = (clon / ed + x * Math.PI / 180) * 180 / Math.PI;
            let jlat = (clat / ec + y * Math.PI / 180) * 180 / Math.PI;
            points.push(jlon, jlat, h[j]);
        }
        points.push(x, y, h[0]);
        let height1 = p.height || 20;
        let elevation = p.elevation != undefined ? p.elevation : 0;
        if ((p.heightClamp || Cesium.HeightReference.CLAMP_TO_GROUND) === Cesium.HeightReference.CLAMP_TO_GROUND) {
            extrudedHeight = height1 + elevation;
            height = elevation;
        } else {
            extrudedHeight = height1 + elevation + xy[2];
            height = elevation + xy[2];
        };
        let show = p.show == undefined ? true : p.show;
        var sector = new Cesium.Entity({
            id,
            polygon: {
                show,
                hierarchy: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(points),
                },
                height,
                extrudedHeight,
                material: Cesium.Color.fromCssColorString(p.entityColor || '#007acc'),
                heightReference: p.heightClamp!= undefined ?p.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,
            },
        });
        sectorNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(sector);
        if (p.zoomTo == undefined ? false : p.zoomTo) { v.zoomTo(sector) };
        return sector;
    }
}
const Sector = new SectorGraphics();
export function drawSector(a) {
    let entity = Sector.draw(a);
    return entity
}


