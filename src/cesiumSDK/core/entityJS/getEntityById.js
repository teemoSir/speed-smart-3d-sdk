/**
* 获取entity实体对象类
*/
class getEntityById {
    /**
    * 据entity的id获取方法
    * @param {Cesium.Viewer} viewer -地图主窗口
    * @param {Object} id -entity实体对象id
    * @return {Cesium.Entity} -返回entity实体对象
    */
    get(viewer,id) {
        return viewer.entities.getById(id)
    }
}
export default getEntityById;