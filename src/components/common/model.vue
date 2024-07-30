<template>
  <div id="modelDiv">
    <div id="model">
      <i @click="closeFn">x</i>
      <div class="topLap"></div>
      <div class="modelContent">
        <a-tree
          checkable
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          v-model:checkedKeys="checkedKeys"
          :tree-data="treeData"
          :field-names="fieldNames"
          @check="checkEvent"
          @select="selectEvent"
        >
          <template #title="{ name, key }">
            <span v-if="key === '0-0-1'" style="color: #1890ff">{{
              name
            }}</span>
            <template v-else>{{ name }}</template>
          </template>
        </a-tree>
      </div>
    </div>

    <div
      :class="['modelPropertity', { modelEditShow: modelEditShow }]"
      :modelPropertity="modelPropertity"
    >
      <div class="topLap"></div>
      <div class="modelPropertityContent">
        <p class="closepro"><i @click="closeFn2">X</i></p>
        <a-table
          class="poropertyTable"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { modelQuery } from "../../utils/model";
import { Model_URL, isTempData } from "../../utils/config";
import eventBus from "../../utils/eventBus";

export default {
  name: "model",
  mounted() {
    let that = this;
    that.expandedKeys = [];
    if (isTempData == "false") {
      modelQuery({ isList: true }).then((res) => {
        if (res.code == 200) {
          that.treeData = res.data;
          that.expandedKeys = [];
          that.treeData.forEach((item, index) => {
            that.expandedKeys.push(item.key);

            if (
              item.name == "倾斜摄影" ||
              item.name == "BIM" ||
              item.name == "点云" ||
              item.name == "地图底图" ||
              item.name == "城市白膜"
            ) {
              item.disableCheckbox = true;
            }

            if (item.name === "地图底图") {
              item.child.forEach((it, i) => {
                that.checkedKeys.push(it.key);
              });
            }
          });
        }
      });
    } else {
      that.treeData.forEach((item, index) => {
        that.expandedKeys.push(item.key);
      });
    }
  },

  methods: {
    closeFn2() {
      this.modelPropertity = false;
    },
    property(data) {
      this.modelPropertity = true;
      // this.propertyArr = data;
      this.dataSource = data;
    },
    selectEvent(selectKey, event) {
      this.modelPropertity = false;
      let node = event.node;
      let modelData = node.dataRef;
      if (modelData.modelType == 2 && event.node.checked) {
        this.modelEditShow = false;
      } else {
        this.modelEditShow = true;
      }
      this.$emit("selectEvent", event);
    },
    checkEvent(checkKey, event) {
      this.modelPropertity = false;
      let node = event.node;
      let modelData = node.dataRef;
      if (modelData.modelType == 2) {
        this.modelEditShow = false;
      } else {
        this.modelEditShow = true;
      }
      this.$emit("checkEvent", event);
    },
    closeFn() {
      this.$emit("closeModel");
    },
  },

  data() {
    return {
      modelEditShow: false,
      columns: [
        { title: "属性", dataIndex: "key", key: "key" },
        { title: "属性值", dataIndex: "value", key: "value" },
      ],

      dataSource: [],

      modelPropertity: false,
      propertyArr: [],
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: ["1-4-1", "1-4-2"],
      fieldNames: {
        children: "child",
        title: "name",
        key: "key",
      },
      treeData: [
        {
          name: "倾斜摄影",
          key: "1-1",
          child: [
            {
              id: "1",
              name: "江心洲",
              key: "1-1-1",
              url: Model_URL + "/江心洲/tileset.json",
            },
            {
              id: "2",
              name: "贾裕南",
              key: "1-1-2",
              url: Model_URL + "/nan/tileset.json",
            },
            {
              id: "3",
              name: "江西",
              key: "1-1-3",
              url: Model_URL + "/江西村/tileset.json",
            },
            {
              id: "45",
              name: "九龙",
              key: "1-1-5",
              url: Model_URL + "/jl/tileset.json",
            },
          ],
        },
        {
          name: "城市白膜",
          key: "1-11",
          child: [
            {
              id: "4",
              name: "新泰市",
              key: "1-11-4",
              url: Model_URL + "/white4/tileset.json",
              positionLng: "117.76",
              positionLat: "35.86",
              positionAlt: "3000",
              modelType: 4,
            },
            {
              id: "46",
              name: "南京市",
              key: "1-11-6",
              url: Model_URL + "/njbm/tileset.json",
              positionLng: "118.78",
              positionLat: "32.00",
              positionAlt: "5000",
              modelType: 4,
            },
          ],
        },
        {
          name: "BIM",
          key: "1-2",
          child: [
            {
              id: "5",
              name: "管线",
              key: "1-2-1",
              url: Model_URL + "/管线/tileset.json",
              positionLng: "119.027686",
              positionLat: "33.760803",
              positionAlt: "6",
              rotationX: "0",
              rotationY: "0",
              rotationZ: "0",
              opacity: "1",
              part: "true",
              popup: "true",
              modelType: 2,
            },
            {
              id: "6",
              name: "楼宇",
              key: "1-2-2",
              url: Model_URL + "/1/tileset.json",
              positionLng: 118.681122,
              positionLat: 32.003938,
              positionAlt: 6,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              opacity: "1",
              part: "true",
              popup: "true",
              modelType: 2,
            },
            {
              id: "8",
              name: "大坝",
              key: "1-2-4",
              url: Model_URL + "/loddaba/all/tileset.json",
              positionLng: 118.681122,
              positionLat: 32.003938,
              positionAlt: 6,
              modelType: 2,
              rotationX: "0",
              rotationY: "0",
              rotationZ: "0",
              opacity: "1",
              part: "true",
              popup: "true",
			  //modelType: 2,
            },
            {
              id: "10",
              name: "常州变电站",
              key: "1-2-5",
              url: Model_URL + "/cz001/tileset.json",
              positionLng: "119.024892",
              positionLat: "33.720062",
              positionAlt: "6",
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              opacity: "1",
              part: "true",
              popup: "true",
              modelType: 2,
            },
          ],
        },
        {
          name: "点云",
          key: "1-3",
          child: [
            {
              id: "9",
              name: "杆塔",
              key: "1-3-1",
              url: Model_URL + "/las001/tileset.json",
              positionLng: "119.027686",
              positionLat: "33.760803",
              positionAlt: "6",
            },
          ],
        },
        {
          name: "地图底图",
          key: "1-4",
          child: [
            {
              id: "45",
              name: "注记",
              key: "1-4-2",
              modelType: 999,
            },
            {
              id: "44",
              name: "影像",
              key: "1-4-1",
              modelType: 999,
            },
          ],
        },
      ],
    };
  },

//   beforeDestroy() {
//     this.expandedKeys = undefined;
//     this.selectedKeys = undefined;
//     this.checkedKeys = undefined;
//     this.fieldNames = undefined;
//     this.treeData = undefined;
//     this.modelPropertity = false;
//   },
  created() {
    eventBus.$on("isShow", () => {
      this.$emit("isShowModel");
    });
  },
};
</script>

<style scoped>
#model {
  width: 15%;
  height: calc(100% - 10rem);
  position: absolute;
  background-color: rgba(23, 49, 71, 0.4) !important;
  color: white !important;
  z-index: 10;
  left: 1rem;
  top: 4em;
}

::v-deep .ant-table {
  background:  none;
    /* rgba(23, 49, 72, 0.1) !important; */
  color: white !important;
}

::v-deep .ant-table-cell {
  padding: 0.3rem !important;
}

::v-deep .ant-table-thead > tr > th {
  background:  none;
  color: white !important;
}

::v-deep table:hover,
tr:hover,
thead:hover {
  background: none;
}

::v-deep .ant-table-tbody > tr.ant-table-row:hover > td {
  background:  none;
}

.modelPropertity {
  width: 15%;
  height: calc(100% - 10rem);
  position: absolute;
  background-color: rgba(23, 49, 71, 0.4) !important;
  color: white !important;
  z-index: 10;
  right: 16%;
  top: 3.5em;
  transition: all 0.5s;
  transform: translateX(200%);
  opacity: 0;
}

.modelEditShow {
  right: 0;
}

.modelPropertity[modelPropertity="true"] {
  transform: translateX(0);
  opacity: 1;
}

::v-deep .ant-tree {
  background: none;
  color: white;
  height: 100%;
}

.topLap {
  height: 10px;
  width: 100%;
  z-index: -1;
  position: absolute;
}

.modelContent {
  height: 100%;
  width: 100%;
  padding: 0.4rem;
  overflow-y: auto;
}

.modelPropertityContent {
  height: 100%;
  width: 100%;
  padding: 0.4rem;
  overflow-y: auto;
}

.closepro {
  display: block;
  position: relative;
}

.modelPropertity::after {
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

#model::after {
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

.modelPropertity::before {
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

#model::before {
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
</style>
