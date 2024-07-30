//视角变换
let result = new Cesium.Matrix4();
export class followView {
    /**
    * 相机视角跟随模型方法
    * @param {Object} entity -模型对象
    * @param {String} time -跟踪模拟时钟的当前时间
    */
    setMatrix(entity, time) {
        let position = Cesium.Property.getValueOrUndefined(
            entity.position,
            time,
            new Cesium.Cartesian3()
        );
        if (!Cesium.defined(position)) {
            return undefined;
        }
        // 得到一个四元数,x,y,z,w
        let orientation = Cesium.Property.getValueOrUndefined(
            entity.orientation,
            time,
            new Cesium.Quaternion()
        );
        if (!Cesium.defined(orientation)) {
            result = Cesium.Transforms.eastNorthUpToFixedFrame(
                position,
                undefined,
                result
            );
        } else {
            // 从Matrix3计算代表旋转的Matrix4
            result = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()),
                position,
                result
            );
        }
        return result;
    }
}