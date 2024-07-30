const menuCfg = {

    menu: [{
        name: 'home',
        path: '/home',
        meta: { title: '首页', 'icon': 'el-icon-eleme-filled', 'type': 'menu' },
        children: [{
            name: 'dashboard',
            path: '/dashboard',
            meta: { title: 'Welcome', 'icon': 'el-icon-menu', 'affix': true },
            component: 'home'
        }, {
            'path': '/other/about',
            'name': 'about',
            'meta': { 'title': '关于', 'icon': 'el-icon-info-filled', 'type': 'menu' },
            'component': 'other/about'
        }, {
            'path': 'http://172.16.30.14:9000/dist',
            'name': 'bigScreen',
            'meta': { title: '大屏', icon: 'el-icon-info-filled', type: 'iframe' },
        }]
    }, {
        name: 'demo',
        path: '/demo',
        meta: { title: '代码运行测试', 'icon': 'el-icon-eleme-filled', fullpage: true, type: 'menu', hidden: true },
        component: 'map/demo'
    }, {
        path: '/doc',
        name: 'list',
        meta: { 'title': '文档', 'icon': 'el-icon-fold', 'type': 'menu' },
        component: 'doc/container'
    }, {
        name: 'map',
        path: '/map',
        meta: { 'title': '示例', 'icon': 'el-icon-takeaway-box', 'type': 'menu' },
        children: [
            {
                path: '/map/base',
                name: 'baseMap',
                meta: { title: '创建地球', icon: 'sc-icon-map', fullpage: false, type: 'menu' },
                component: 'map/base'
            },
            {
                path: '/map/toolbar',
                name: 'toolbar',
                meta: { title: '控件', icon: 'el-icon-tools', type: 'menu' },
                children: [{
                    path: '/map/toolbar/toolbar',
                    name: 'toolbar',
                    meta: { title: '基础控件', type: 'menu' },
                    component: 'map/toolbar/toolbar'
                }, {
                    path: '/map/toolbar/statusBar',
                    name: 'statusBar',
                    meta: { title: '状态栏', type: 'menu' },
                    component: 'map/toolbar/statusBar'

                }, {
                    path: '/map/toolbar/mapCompare',
                    name: 'mapCompare',
                    meta: { title: '双屏对比', type: 'menu' },
                    component: 'map/toolbar/mapCompare'
                }, {
                    path: '/map/toolbar/mapSplit',
                    name: 'mapSplit',
                    meta: { title: '卷帘对比', type: 'menu' },
                    component: 'map/toolbar/mapSplit'
                }]
            },
            {
                path: '/map/3dtiles',
                name: '3dtiles',
                meta: { title: '三维模型', icon: 'el-icon-histogram', type: 'menu' },
                children: [{
                    path: '/map/3dtiles/3dtilesModel',
                    name: '3dtilesModel',
                    meta: { title: '三维模型編輯', type: 'menu' },
                    component: 'map/3dtiles/3dtilesModel.vue'
                },]
            },
            {
                path: '/map/drawCovering',
                name: 'entity',
                meta: { title: '矢量标绘', icon: 'el-icon-histogram', type: 'menu' },
                children: [{
                    path: '/map/drawCovering/showentity',
                    name: 'showentity',
                    meta: { title: '绘制实体', type: 'menu' },
                    component: 'map/drawCovering/showentity.vue'
                },]
            },
            {
                path: '/map/roam',
                name: 'entity',
                meta: { title: '地图漫游', icon: 'el-icon-histogram', type: 'menu' },
                children: [{
                    path: '/map/roam/roamMap',
                    name: 'roamMap',
                    meta: { title: '地图漫游', type: 'menu' },
                    component: 'map/roam/roamMap.vue'
                },]
            },
            {
                path: '/map/layer',
                name: 'layer',
                meta: { title: '矢量图层', icon: 'el-icon-map-location', type: 'menu' },
                children: [{
                    path: '/map/layer/mapServer',
                    name: 'mapServer',
                    meta: { title: '矢量数据图层服务', type: 'menu' },
                    component: 'map/layer/mapServer.vue'
                }, {
                    path: '/map/layer/loadShp',
                    name: 'loadShp',
                    meta: { title: '矢量数据图层（GeoJson、SHP）', type: 'menu' },
                    component: 'map/layer/loadShp.vue'
                },]
            },

            {
                path: '/map/analyse',
                name: 'analyse',
                meta: { title: '分析', icon: 'el-icon-histogram', type: 'menu' },
                children: [{
                    path: '/map/analyse/visiblity',
                    name: 'visiblity',
                    meta: { title: '通视分析', type: 'menu' },
                    component: 'map/analyse/visiblity'
                },
                {
                    path: '/map/analyse/flood',
                    name: 'flood',
                    meta: { title: '淹没分析', type: 'menu' },
                    component: 'map/analyse/flood'
                },

                {
                    path: '/map/analyse/fillCutVolume',
                    name: 'fillCutVolume',
                    meta: { title: '填挖方分析', type: 'menu' },
                    component: 'map/analyse/fillCutVolume'
                },
                {
                    path: '/map/analyse/terrainExcavation',
                    name: 'terrainExcavation',
                    meta: { title: '地形挖方', type: 'menu' },
                    component: 'map/analyse/terrainExcavation'
                },

                {
                    path: '/map/analyse/viewshed',
                    name: 'viewshed',
                    meta: { title: '可视域分析', type: 'menu' },
                    component: 'map/analyse/viewshed'
                },
                {
                    path: '/map/analyse/profileAnalysis',
                    name: 'profileAnalysis',
                    meta: { title: '剖面分析', type: 'menu' },
                    component: 'map/analyse/profileAnalysis.vue'
                },
                {
                    path: '/map/analyse/slopeAspect',
                    name: 'slopeAspect',
                    meta: { title: '坡度坡向分析', type: 'menu' },
                    component: 'map/analyse/slopeAspect.vue'
                },
                {
                    path: '/map/analyse/tilesetPlanClip',
                    name: 'tilesetPlanClip',
                    meta: { title: '模型平面剖切', type: 'menu' },
                    component: 'map/analyse/tilesetPlanClip.vue'
                },
                {
                    path: '/map/effect/videoProjection',
                    name: 'videoProjection',
                    meta: { title: 'videoProjection', type: 'menu' },
                    component: 'map/effect/videoProjection.vue'
                },
                {
                    path: '/map/analyse/measure',
                    name: 'measure',
                    meta: { title: '量算', type: 'menu' },
                    component: 'map/analyse/measure.vue'
                },
                {
                    path: '/map/effect/rain',
                    name: 'rain',
                    meta: { title: '雨', type: 'menu' },
                    component: 'map/effect/rain.vue'
                },
                {
                    path: '/map/effect/snow',
                    name: 'snow',
                    meta: { title: '雪', type: 'menu' },
                    component: 'map/effect/snow.vue'
                },
                {
                    path: '/map/effect/fog',
                    name: 'fog',
                    meta: { title: '雾', type: 'menu' },
                    component: 'map/effect/fog.vue'
                },
                {
                    path: '/map/effect/thunder',
                    name: 'thunder',
                    meta: { title: '雷', type: 'menu' },
                    component: 'map/effect/thunder.vue'
                },

                {
                    path: '/map/effect/skyline',
                    name: 'skyline',
                    meta: { title: '天际线', type: 'menu' },
                    component: 'map/effect/skyline.vue'
                },

                {
                    path: '/map/effect/modelSectional',
                    name: 'modelSectional',
                    meta: { title: '模型水平剖切', type: 'menu' },
                    component: 'map/effect/modelSectional.vue'
                },
                {
                    path: '/map/analyse/code_skyline',
                    name: 'code_skyline',
                    meta: { title: 'code_skyline', type: 'menu' },
                    component: 'map/analyse/code_skyline'
                },
                {
                    path: '/map/analyse/code_modelSectional',
                    name: 'code_modelSectional',
                    meta: { title: 'code_modelSectional', type: 'menu' },
                    component: 'map/analyse/code_modelSectional'
                },
                {
                    path: '/map/analyse/code_viewshed',
                    name: 'code_viewshed',
                    meta: { title: 'code_viewshed', type: 'menu' },
                    component: 'map/analyse/code_viewshed'
                },
                {
                    path: '/map/analyse/code_terrainExcavation',
                    name: 'code_terrainExcavation',
                    meta: { title: 'code_terrainExcavation', type: 'menu' },
                    component: 'map/analyse/code_terrainExcavation'
                },
                {
                    path: '/map/analyse/code_fillCutVolume',
                    name: 'code_fillCutVolume',
                    meta: { title: 'code_fillCutVolume', type: 'menu' },
                    component: 'map/analyse/code_fillCutVolume'
                },
                {
                    path: '/map/analyse/code_visiblity',
                    name: 'code_visiblity',
                    meta: { title: 'code_visiblity', type: 'menu' },
                    component: 'map/analyse/code_visiblity'
                },
                {
                    path: '/map/analyse/code_flood',
                    name: 'code_flood',
                    meta: { title: 'code_flood', type: 'menu' },
                    component: 'map/analyse/code_flood'
                },
                {
                    path: '/map/analyse/code_measure',
                    name: 'code_measure',
                    meta: { title: 'code_measure', type: 'menu' },
                    component: 'map/analyse/code_measure.vue'
                },
                {
                    path: '/map/analyse/code_fog',
                    name: 'code_fog',
                    meta: { title: 'code_fog', type: 'menu' },
                    component: 'map/analyse/code_fog.vue'
                },
                {
                    path: '/map/analyse/code_snow',
                    name: 'code_snow',
                    meta: { title: 'code_snow', type: 'menu' },
                    component: 'map/analyse/code_snow.vue'
                }, 
                 {
                    path: '/map/analyse/code_rain',
                    name: 'code_rain',
                    meta: { title: 'code_rain', type: 'menu' },
                    component: 'map/analyse/code_rain.vue'
                },
                {
                    path: '/map/effect/code_weather',
                    name: 'code_weather',
                    meta: { title: 'code_weather', type: 'menu' },
                    component: 'map/effect/code_weather.vue'
                },
                {
                    path: '/map/effect/code_mosaic',
                    name: 'code_mosaic',
                    meta: { title: 'code_mosaic', type: 'menu' },
                    component: 'map/effect/code_mosaic.vue'
                },
                {
                    path: '/map/effect/code_pbfVectorTile',
                    name: 'code_pbfVectorTile',
                    meta: { title: 'code_pbfVectorTile', type: 'menu' },
                    component: 'map/effect/code_pbfVectorTile.vue'
                },
                {
                    path: '/map/effect/code_videoMap',
                    name: 'code_videoMap',
                    meta: { title: 'code_videoMap', type: 'menu' },
                    component: 'map/effect/code_videoMap.vue'
                },
                {
                    path: '/map/effect/code_i3sLayer',
                    name: 'code_i3sLayer',
                    meta: { title: 'code_i3sLayer', type: 'menu' },
                    component: 'map/effect/code_i3sLayer.vue'
                },
                {
                    path: '/map/effect/i3sLayer',
                    name: 'i3sLayer',
                    meta: { title: 'i3sLayer', type: 'menu' },
                    component: 'map/effect/i3sLayer.vue'
                },
                {
                    path: '/map/effect/code_s3mLayer',
                    name: 'code_s3mLayer',
                    meta: { title: 'code_s3mLayer', type: 'menu' },
                    component: 'map/effect/code_s3mLayer.vue'
                },
                ]
            },
            // 	{
            // 	path: '/vab/mini',
            // 	name: 'minivab',
            // 	meta: {'title': '原子组件', 'icon': 'el-icon-magic-stick', 'type': 'menu'},
            // 	component: 'vab/mini'
            // },
            //{
            // 	path: '/vab/iconfont',
            // 	name: 'iconfont',
            // 	meta: {title: '扩展图标', icon: 'el-icon-orange', type: 'menu'},
            // 	component: 'vab/iconfont'
            // }, {
            // 	path: '/vab/data',
            // 	name: 'vabdata',
            // 	meta: {'title': 'Data 数据展示', 'icon': 'el-icon-histogram', 'type': 'menu'},
            // 	children: [{
            // 		'path': '/vab/chart',
            // 		'name': 'chart',
            // 		'meta': {'title': '图表 Echarts', 'type': 'menu'},
            // 		'component': 'vab/chart'
            // 	}, {
            // 		'path': '/vab/statistic',
            // 		'name': 'statistic',
            // 		'meta': {'title': '统计数值', 'type': 'menu'},
            // 		'component': 'vab/statistic'
            // 	}, {
            // 		'path': '/vab/video',
            // 		'name': 'scvideo',
            // 		'meta': {'title': '视频播放器', 'type': 'menu'},
            // 		'component': 'vab/video'
            // 	}, {
            // 		'path': '/vab/qrcode',
            // 		'name': 'qrcode',
            // 		'meta': {'title': '二维码', 'type': 'menu'},
            // 		'component': 'vab/qrcode'
            // 	}]
            // }, {
            // 	'path': '/vab/workflow',
            // 	'name': 'workflow',
            // 	'meta': {'title': '工作流设计器', 'icon': 'el-icon-share', 'type': 'menu'},
            // 	'component': 'vab/workflow'
            // }, {
            // 	'path': '/vab/formrender',
            // 	'name': 'formRender',
            // 	'meta': {'title': '动态表单(Beta)', 'icon': 'el-icon-message-box', 'type': 'menu'},
            // 	'component': 'vab/form'
            // }
        ]
    }],
    permissions: ['list.add', 'list.edit', 'list.delete', 'user.add', 'user.edit', 'user.delete']
};
export default menuCfg;
