<template>
  <div id="jscDrawer">
    <!-- <i @click="closeFn">x</i> -->
    <div class="topLap"></div>
    <div class="drawerContent">
      <a-collapse v-model:activeKey="activeKey" :bordered="false">
        <a-collapse-panel key="1" header="模型URL地址">
          <p>
            模型URL地址
            <a-input-search v-model:value="model.url" placeholder="模型地址" enter-button="定位" readonly
              @search="locateToModel" style="color: white" />
          </p>


          <a-button type="primary" @click="showModelTree">构件树</a-button>

          <div :class="{ 'modelTree': isModelTree }">
            <a-tree
            :tree-data="treeData"
            :field-names="fieldNames"
            > </a-tree>
          </div>

        </a-collapse-panel>
        <a-collapse-panel key="2" header="模型位置">
          <p>
            <a-form :model="model" name="modelPosition" autocomplete="off">
              <a-form-item label="经度" name="lat">
                <a-input-number v-model:value="model.position.lat" style="width: 100%" decimalSeparator min="0"
                  @change="valueChange" />
              </a-form-item>

              <a-form-item label="纬度" name="lng">
                <a-input-number v-model:value="model.position.lng" style="width: 100%" decimalSeparator min="0"
                  @change="valueChange" />
              </a-form-item>

              <a-form-item label="高程" name="alt">
                <a-input-number v-model:value="model.position.alt" controls style="width: 100%" decimalSeparator min="0"
                  @change="valueChange" />
              </a-form-item>
            </a-form>
          </p>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="模型方向">
          <p>
            <a-form :model="model" name="modelRotate" autocomplete="off">
              <a-form-item label="绕X轴旋转" name="rotateX">
                <a-input-number step="0.1" v-model:value="model.rotation.x" style="width: 100%" decimalSeparator min="0"
                  @change="valueChange" />
              </a-form-item>

              <a-form-item label="绕Y轴旋转" name="rotateY">
                <a-input-number step="0.1" v-model:value="model.rotation.y" style="width: 100%" decimalSeparator min="0"
                  @change="valueChange" />
              </a-form-item>

              <a-form-item label="绕Z轴旋转" name="rotateZ">
                <a-input-number step="0.1" v-model:value="model.rotation.z" controls style="width: 100%"
                  decimalSeparator min="0" @change="valueChange" />
              </a-form-item>
            </a-form>
          </p>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="其他参数">
          <p>
            透明度
            <a-slider id="transparency" v-model:value="model.opacity" :max="1" :min="0" :step="0.1"
              @change="valueChange" />

            <!-- 点击高亮构件:
            <a-switch v-model:checked="model.part" checked-children="开" un-checked-children="关" @change="valueChange"/>
            点击显示属性:
            <a-switch v-model:checked="model.popup" checked-children="开" un-checked-children="关" @change="valueChange"/> -->
          </p>

          <div style="text-align: center">
            <a-button type="primary" @click="saveFn">保存参数</a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import {Antd} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
window.app.use(Antd)
import { modelQuery, modelEdit } from "../../utils/model";
import { isTempData } from "../../utils/config";


export default {
  props: ["modelData"],
  watch: {
    modelData: {
      handler() {
        //TODO 实际情况取数据库最新的明细
        if (this.modelData.modelType == 2) {
          let newData = this.modelData
          if (isTempData == "false") {
            modelQuery({ id: this.modelData.id }).then((res) => {
              if (res.code == 200) {
                newData = res.data;

                this.model.id = newData.id;
                this.model.url = newData.url;
                this.model.position.lat = newData.positionLat;
                this.model.position.lng = newData.positionLng;
                this.model.position.alt = newData.positionAlt;
                this.model.rotation.x = newData.rotationX;
                this.model.rotation.y = newData.rotationY;
                this.model.rotation.z = newData.rotationZ;
                this.model.opacity = newData.opacity;
                this.model.part = newData.part;
                this.model.popup = newData.popup;
                this.model.modelType = newData.modelType;
              }
            });
          } else {
            this.model.id = this.modelData.id;
            this.model.url = this.modelData.url;
            this.model.position.lat = this.modelData.positionLat;
            this.model.position.lng = this.modelData.positionLng;
            this.model.position.alt = this.modelData.positionAlt;
            this.model.rotation.x = this.modelData.rotationX;
            this.model.rotation.y = this.modelData.rotationY;
            this.model.rotation.z = this.modelData.rotationZ;
            this.model.opacity = this.modelData.opacity;
            this.model.part = this.modelData.part;
            this.model.popup = this.modelData.popup;
            this.model.modelType = this.modelData.modelType;
          }


          this.$emit("updateModel",this.model)
        }
      },
      deep: true,
    },
    // model: {
    //   handler() {
    //     this.$emit("updateModel", this.model);
    //   },
    //   deep: true,
    // },
  },
  mounted() { },
  name: "jscDrawer",
  methods: {

    showModelTree(){
      this.isModelTree=true;
      this.$emit("showModelTree",this.model)
    },
    modifyModel(modelData){
      if (modelData.modelType == 2) {
          let newData =modelData;
          if (isTempData == "false") {
            modelQuery({ id: modelData.id }).then((res) => {
              if (res.code == 200) {
                newData = res.data;

                this.model.id = newData.id;
                this.model.url = newData.url;
                this.model.position.lat = newData.positionLat;
                this.model.position.lng = newData.positionLng;
                this.model.position.alt = newData.positionAlt;
                this.model.rotation.x = newData.rotationX;
                this.model.rotation.y = newData.rotationY;
                this.model.rotation.z = newData.rotationZ;
                this.model.opacity = newData.opacity;
                this.model.part = newData.part;
                this.model.popup = newData.popup;
                this.model.modelType = newData.modelType;
              }
            });
          } else {
            this.model.id = modelData.id;
            this.model.url = modelData.url;
            this.model.position.lat = modelData.positionLat;
            this.model.position.lng = modelData.positionLng;
            this.model.position.alt = modelData.positionAlt;
            this.model.rotation.x = modelData.rotationX;
            this.model.rotation.y =modelData.rotationY;
            this.model.rotation.z = modelData.rotationZ;
            this.model.opacity = modelData.opacity;
            this.model.part = modelData.part;
            this.model.popup = modelData.popup;
            this.model.modelType = modelData.modelType;
          }


          this.$emit("updateModel",this.model)
        }
        this.treeData=[];
        this.isModelTree=false;
    },
    saveFn() {
      let newModelData = {
        id: this.modelData.id,
        positionAlt: this.model.position.alt,
        positionLat: this.model.position.lat,
        positionLng: this.model.position.lng,
        rotationX: this.model.rotation.x,
        rotationY: this.model.rotation.y,
        rotationZ: this.model.rotation.z,
        opacity: this.model.opacity,
        part: this.model.part,
        popup: this.model.popup,
      }
      // console.log("11111", newModelData)
      modelEdit(newModelData).then((res) => {
        console.log("更新结果：", res)
      });
    },
    locateToModel() {
      this.$emit("locateToModel", this.model.id);
    },
    closeFn() {
      this.$emit("closeDrawer");
    },
    valueChange() {
      this.$emit("updateModel", this.model)
    }
  },
  data() {
    return {
      isModelTree:false,
      fieldNames: {
        children: "child",
        title: "name",
        key: "id",
      },

      treeData:[],
      model: {
        id: "",
        url: "http://192.168.6.39/江心洲/tileset.json",
        position: {
          lat: 1,
          lng: 1,
          alt: 1,
        },
        rotation: {
          x: 1,
          y: 1,
          z: 1,
        },

        opacity: 0.5,
        part: false,
        popup: true,
      },
      activeKey: [1, 2, 3, 4],
    };
  },
//   beforeDestroy() {
//     this.model = undefined;
//     this.activeKey = undefined;
//     this.treeData = undefined;
//     this.isModelTree=false;
//   },
};
</script>

<style scoped>
#jscDrawer {
  width: 15%;
  height: calc(100% - 10rem);
  position: absolute;
  background-color: rgba(23, 49, 71, 0.4) !important;
  color: white !important;
  z-index: 12;
  right: 1rem;
  top: 3.5em;
}

::v-deep input {
  background: none;
  color: white;
}

::v-deep .ant-input-number {
  background: none;
  color: white;
}

::v-deep .ant-form-item-label>label {
  color: white;
}

.drawerContent {
  height: 100%;
  width: 100%;
  padding: 0.4rem;
  overflow-y: auto;
}

::v-deep .ant-collapse {
  background: none;
  color: white;
}

::v-deep .ant-collapse-header {
  color: white !important;
}

::v-deep .ant-collapse-content {
  background: none;
  color: white;
}

.topLap {
  height: 10px;
  width: 100%;
  z-index: -1;
  position: absolute;
}

.drawerContent {
  height: 100%;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
}

#jscDrawer::after {
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  bottom: 0;
  right: 0;
  border-right: 2px solid rgba(255, 255, 255, 1);
  border-bottom: 2px solid rgba(255, 255, 255, 1);
}

#jscDrawer::before {
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  bottom: 0;
  left: 0;
  border-left: 2px solid rgba(255, 255, 255, 1);
  border-bottom: 2px solid rgba(255, 255, 255, 1);
}

.topLap::after {
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  bottom: 0;
  right: 0;
  border-right: 2px solid rgba(255, 255, 255, 1);
  border-top: 2px solid rgba(255, 255, 255, 1);
}

.topLap::before {
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  bottom: 0;
  left: 0;
  border-left: 2px solid rgba(255, 255, 255, 1);
  border-top: 2px solid rgba(255, 255, 255, 1);
}

i {
  font-style: normal;
  color: #fff;
  position: absolute;
  right: 8px;
  top: -2px;
  cursor: pointer;
}

.modelTree {
  height: 100px;
  width: 100%;
  padding: 0.4rem;
  overflow-y: auto;
}

::v-deep .ant-tree {
  background: none;
  color: white;
  height: 100%;
}



</style>
