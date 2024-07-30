import * as Cesium from 'cesium'
/**
* entity材料纹理类
*/
class Material {
    /**
    * cesium颜色对象
    */
    static newColor = Cesium.Color;
    /**
    *获取随机颜色
    * @param {Number} value -透明度（0-1）
    * @return {Cesium.Color} -返回随机颜色
    */
    randomColor(value) {
        return Cesium.Color.fromRandom().withAlpha(value);
    }
    /**
    *获取固定颜色
    * @param {Cesium.Color} color -指定的颜色
    * @param {Number} value -透明度（0-1）
    * @return {Cesium.Color} -返回指定颜色
    */
    defineColor(color, value) {
        return color.withAlpha(value);
    }
    /**
    *获取图片纹理
    * @param {String} img -图片路径
    * @param {Cesium.Color} bgColor -指定的背景颜色
    * @param {Array} array -横竖图片排列重复次数
    * @return {Cesium.ImageMaterialProperty} -返回图片纹理
    */
    imageMaterial(img, bgColor, array) {
        return new Cesium.ImageMaterialProperty({
            image: img,
            color: bgColor,
            repeat: new Cesium.Cartesian2(...array)
        });
    }
    /**
    *获取棋盘纹理
    * @param {Cesium.Color} evenColor -颜色1
    * @param {Cesium.Color} oddColor -颜色2
    * @param {Array} array -横竖棋盘排列重复次数
    * @return {Cesium.CheckerboardMaterialProperty} -返回棋盘纹理
    */
    checkerBoardMaterial(evenColor, oddColor, array) {
        return new Cesium.CheckerboardMaterialProperty({
            evenColor,
            oddColor,
            repeat: new Cesium.Cartesian2(...array)
        });
    }
    /**
    *获取条纹纹理
    * @param {Cesium.Color} evenColor -条纹颜色1
    * @param {Cesium.Color} oddColor -条纹颜色2
    * @param {Number} repeat -条纹重复次数
    * @param {Number} offset -偏移量
    * @param {Boolean} orientation -条纹放置方向，true:水平，false:垂直,默认水平放置
    * @return {Cesium.StripeMaterialProperty} -返回条纹纹理
    */
    StripeMaterial(evenColor, oddColor, repeat, offset, orientation = true) {
        let ori;
        if (orientation) {
            ori = Cesium.StripeOrientation.VERTICAL;
        } else {
            ori = Cesium.StripeOrientation.HORIZONTAL;
        }
        return new Cesium.StripeMaterialProperty({
            evenColor,
            oddColor,
            repeat,
            offset,
            orientation: ori
        });
    }
    /**
    *获取网格纹理
    * @param {Cesium.Color} color - 网格颜色
    * @param {Number} cellAlpha -单元格透明度（0-1）
    * @param {Array} lineCount -行列重复个数
    * @param {Array} lineThickness -横线竖线宽度大小
    * @param {Number} ineOffset -网格线偏移量
    * @return {Cesium.GridMaterialProperty} -返回网格纹理
    */
    GridMaterial(color, cellAlpha, lineCount, lineThickness, ineOffset) {
        return new Cesium.GridMaterialProperty({
            color,
            cellAlpha,
            lineCount: new Cesium.Cartesian2(...lineCount),
            lineThickness: new Cesium.Cartesian2(...lineThickness),
            ineOffset,
        });
    }
    /**
    *边缘发光线条
    * @param {Cesium.Color} color - 线条边缘颜色
    * @param {Number} glowPower -发光强度，以总线宽的百分比表示
    * @return {Cesium.PolylineGlowMaterialProperty} -返回边缘发光线条
    */
    polylineGlow(color, glowPower) {
        return new Cesium.PolylineGlowMaterialProperty({
            glowPower,
            color,
        });
    }
    /**
    * 轮廓线条
    * @param {Cesium.Color} color - 线条颜色
    * @param {Cesium.Color} outlineColor - 线条轮廓颜色
    * @param {Number} outlineWidth -轮廓宽度，单位：像素
    * @return {Cesium.PolylineOutlineMaterialProperty} -返回轮廓线条
    */
    polylineOutline(color, outlineColor,outlineWidth) {
        return new Cesium.PolylineOutlineMaterialProperty({
            color,
            outlineWidth,
            outlineColor,
        });
    }
}
export default Material;