import * as vue from "vue";
import * as ElementPlus from "element-plus";
import ktmap from '@/components/map';
import Measure from '@/components/map/measure';

import * as Speed from '@/cesiumSDK/index'
import * as token from '@/utils/token'
import * as uuid from "uuid"
import axios from "axios"
import * as Cesium from 'cesium'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import terrainModelClick from "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick";
import Parameter from "@/cesiumSDK/core/entityJS/defaultData";
import removeEntity from "@/cesiumSDK/core/entityJS/removeEntity";

import keyboardRoam from "@/cesiumSDK/core/roam/keyboardRoam";
import firstRoam from "@/cesiumSDK/core/roam/firstRoam";
import pathRoam from "@/cesiumSDK/core/roam/pathRoam";
import modelRoam from "@/cesiumSDK/core/roam/modelRoam";
import ModelInfo from "@/utils/modelInfo";

import ServerInfo from "@/utils/serverInfo";


import SpeedPrimitive from "@/cesiumSDK/core/primitiveJS/primitive";
import {
    darwBillBoard,
    darwPoint,
    drawBox,
    drawPlane,
    drawEllipse,
    drawEllipsoid,
    drawLabel,
    drawEntityModel,
    drawCylinder,
    drawPolyline,
    drawWall,
    drawPolygon,
    drawPolylineVolume,
    drawCorridor,
    drawSector,
    darwPointLable,
    darwBillboardLable,
    drawRectangle,
} from "@/cesiumSDK/core/entityJS/draw";

const libs = {
    vue,

    'element-plus': ElementPlus,
    '@/components/map': ktmap,
    '@/components/map/measure': Measure,
    "@/cesiumSDK/index": { ...Speed },
    '@/utils/token': { ...token },
    '@/utils/modelInfo': { ...ModelInfo },
    '@/utils/serverInfo': { ...ServerInfo },
    "uuid": { ...uuid },
    "axios": axios,
    "cesium": { ...Cesium },
	"ElementPlusIconsVue":ElementPlusIconsVue,

    "@/cesiumSDK/core/entityJS/defaultData": Parameter,
    "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick": terrainModelClick,
    "@/cesiumSDK/core/entityJS/removeEntity": removeEntity,
    "@/cesiumSDK/core/entityJS/draw": {
        darwBillBoard,
        darwPoint,
        drawBox,
        drawPlane,
        drawEllipse,
        drawEllipsoid,
        drawLabel,
        drawEntityModel,
        drawCylinder,
        drawPolyline,
        drawWall,
        drawPolygon,
        drawPolylineVolume,
        drawCorridor,
        drawSector,
        darwPointLable,
        darwBillboardLable,
        drawRectangle,
    },
    "@/cesiumSDK/core/primitiveJS/primitive":SpeedPrimitive,
    "@/cesiumSDK/core/roam/keyboardRoam": keyboardRoam,
    "@/cesiumSDK/core/roam/firstRoam": firstRoam,
    "@/cesiumSDK/core/roam/pathRoam": pathRoam,
    "@/cesiumSDK/core/roam/modelRoam": modelRoam,
}

window.___ktmap__import__ = function (lib, name) {
    if (Object.prototype.toString.call(libs[lib]) != '[object Module]' && name == '*') {
        return libs[lib]
    }
    return (libs[lib] || {})[name]
}
