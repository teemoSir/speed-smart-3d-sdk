
/**
* entity实体删除类
*/
class removeEntity {
    /**
    * 据entity（实体）对象删除方法
    * @param {Cesium.Viewer} viewer -地图主窗口
    * @param {Object} obj -entity实体对象
    */
    removeByObj(viewer, obj) {
        viewer.entities.remove(obj);
    }
    /**
    * 据entity（实体）对象id删除方法
    * @param {Cesium.Viewer} viewer -地图主窗口
    * @param {Object} id -entity实体对象id
    */
    removeById(viewer, id) {
        viewer.entities.removeById(id)
    }
    /**
    * 删除全部entity实体方法
    * @param {Cesium.Viewer} viewer -地图主窗口
    */
    removeAllEntity(viewer) {
        // 删除全部entity实体
        viewer.entities.removeAll()
    }
}
export default removeEntity