import config from "@/config"

//系统路由
const routes = [
	{
		name: "layout",
		path: "/",
		component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
		redirect: config.DASHBOARD_URL || '/speed',
		children: []
	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/demo",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/demo'),
		meta: {
			title: "demo"
		}
	},

	{
		path: "/map/analyse/visiblity",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/analyse/visiblity'),
		meta: {
			title: "通视分析"
		}
	},

	{
		path: "/map/base/index",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/base/index'),
		meta: {
			title: "创建地球"
		}
	},
	{
		path: "/map/toolbar/toolbar",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/toolbar/toolbar'),
		meta: {
			title: "基础控件"
		}
	},
	{
		path: "/map/toolbar/statusBar",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/toolbar/statusBar'),
		meta: {
			title: "状态栏"
		}
	},
	{
		path: "/map/toolbar/mapCompare",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/toolbar/mapCompare'),
		meta: {
			title: "双屏对比"
		}
	},
	{
		path: "/map/toolbar/mapSplit",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/toolbar/mapSplit'),
		meta: {
			title: "卷帘对比"
		}
	},
	{
		path: "/map/layer/mapServer",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/layer/mapServer'),
		meta: {
			title: "地图服务"
		}
	},
	{
		path: "/map/layer/loadShp",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/layer/loadShp'),
		meta: {
			title: "矢量图层"
		}
	},
	{
		path: "/map/3dtiles/3dtilesModel",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/3dtilesModel'),
		meta: {
			title: "三维模型编辑"
		}
	},
	{
		path: "/map/3dtiles/OSMBuildings",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/OSMBuildings'),
		meta: {
			title: "全球城市建筑白膜（OSM在线）"
		}
	},
	{
		path: "/map/3dtiles/Buildings",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/Buildings'),
		meta: {
			title: "建筑白膜"
		}
	},
	{
		path: "/map/3dtiles/3dtilesDTH",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/3dtilesDTH'),
		meta: {
			title: "三维模型单体化"
		}
	},
	{
		path: "/map/3dtiles/edit3dtilesDTH",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/edit3dtilesDTH'),
		meta: {
			title: "单体化编辑"
		}
	},
	{
		path: "/map/model/editModel",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/model/editModel'),
		meta: {
			title: "GLB/GLTF模型编辑"
		}
	},
	{
		path: "/map/3dtiles/DTHsample",
		component: () => import(/* webpackChunkName: "login" */ '@/views/map/3dtiles/DTHsample'),
		meta: {
			title: "分层分户"
		}
	},
	{
		path: "/map/analyse/measure",
		component: () => import(/* webpackChunkName: "measure" */ '@/views/map/analyse/measure'),
		meta: {
			title: "量算"
		}
	},
    {
		path: "/map/analyse/profileAnalysis",
		component: () => import(/* webpackChunkName: "profileAnalysis" */ '@/views/map/analyse/profileAnalysis'),
		meta: {
			title: "剖面分析"
		}
	},
	{
		path: "/map/analyse/slopeAspect",
		component: () => import(/* webpackChunkName: "slopeAspect" */ '@/views/map/analyse/slopeAspect'),
		meta: {
			title: "坡度坡向分析"
		}
	},
	{
		path: "/map/analyse/tilesetPlanClip",
		component: () => import(/* webpackChunkName: "slopeAspect" */ '@/views/map/analyse/tilesetPlanClip'),
		meta: {
			title: "模型平面剖切"
		}
	},
	{
		path: "/map/analyse/flood",
		component: () => import(/* webpackChunkName: "flood" */ '@/views/map/analyse/flood'),
		meta: {
			title: "淹没分析"
		}
	},
	{
		path: "/map/analyse/fillCutVolume",
		component: () => import(/* webpackChunkName: "fillCutVolume" */ '@/views/map/analyse/fillCutVolume'),
		meta: {
			title: "填挖方分析"
		}
	},
	{
		path: "/map/analyse/terrainExcavation",
		component: () => import(/* webpackChunkName: "terrainExcavation" */ '@/views/map/analyse/terrainExcavation'),
		meta: {
			title: "地形开挖"
		}
	},
	{
		path: "/map/analyse/visiblity",
		component: () => import(/* webpackChunkName: "visiblity" */ '@/views/map/analyse/visiblity'),
		meta: {
			title: "通视分析"
		}
	},
	{
		path: "/map/analyse/viewshed",
		component: () => import(/* webpackChunkName: "viewshed" */ '@/views/map/analyse/viewshed'),
		meta: {
			title: "可视域分析"
		}
	},
    {
		path: "/map/analyse/modelSectional",
		component: () => import(/* webpackChunkName: "modelSectional" */ '@/views/map/analyse/modelSectional'),
		meta: {
			title: "模型水平剖切"
		}
	},
    {
		path: "/map/analyse/skyline",
		component: () => import(/* webpackChunkName: "skyline" */ '@/views/map/analyse/skyline'),
		meta: {
			title: "天际线"
		}
	},
    {
		path: "/map/effect/rain",
		component: () => import(/* webpackChunkName: "rain" */ '@/views/map/effect/rain'),
		meta: {
			title: "雨天"
		}
	},
    {
		path: "/map/effect/snow",
		component: () => import(/* webpackChunkName: "snow" */ '@/views/map/effect/snow'),
		meta: {
			title: "雪天"
		}
	},
    {
		path: "/map/effect/fog",
		component: () => import(/* webpackChunkName: "fog" */ '@/views/map/effect/fog'),
		meta: {
			title: "雾天"
		}
	},
    {
		path: "/map/effect/thunder",
		component: () => import(/* webpackChunkName: "thunder" */ '@/views/map/effect/thunder'),
		meta: {
			title: "雷电"
		}
	},
	{
		path: "/map/effect/SpreadCircle",
		component: () => import(/* webpackChunkName: "thunder" */ '@/views/map/effect/SpreadCircle'),
		meta: {
			title: "动态扩散范围"
		}
	},
	{
		path: "/map/effect/WaveCircle",
		component: () => import(/* webpackChunkName: "thunder" */ '@/views/map/effect/WaveCircle'),
		meta: {
			title: "波动圆"
		}
	},
	{
		path: "/map/effect/LightSource",
		component: () => import(/* webpackChunkName: "thunder" */ '@/views/map/effect/LightSource'),
		meta: {
			title: "光源"
		}
	},
    {
		path: "/map/effect/i3sLayer",
		component: () => import(/* webpackChunkName: "i3sLayer" */ '@/views/map/effect/i3sLayer'),
		meta: {
			title: "i3s三维模型"
		}
	},
    {
		path: "/map/effect/videoMap",
		component: () => import(/* webpackChunkName: "videoMap" */ '@/views/map/effect/videoMap'),
		meta: {
			title: "视频贴图"
		}
	},
    {
		path: "/map/effect/mosaic",
		component: () => import(/* webpackChunkName: "mosaic" */ '@/views/map/effect/mosaic'),
		meta: {
			title: "马赛克"
		}
	},
    {
		path: "/map/effect/videoProjection",
		component: () => import(/* webpackChunkName: "thunder" */ '@/views/map/effect/videoProjection'),
		meta: {
			title: "视频投影"
		}
	},
	{
		path: "/map/drawCovering/showentity",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/map/drawCovering/showentity'),
		meta: {
			title: "矢量绘制"
		}
	},
	{
		path: "/map/roam/roamMap",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/map/roam/roamMap'),
		meta: {
			title: "地图漫游"
		}
	},
	{
		path: "/user_register",
		component: () => import(/* webpackChunkName: "userRegister" */ '@/views/login/userRegister'),
		meta: {
			title: "注册"
		}
	},
	{
		path: "/reset_password",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/login/resetPassword'),
		meta: {
			title: "重置密码"
		}
	},


	{
		path: "/speed/case/village",
		component: () => import(/* webpackChunkName: "login" */ '@/views/speed/case/village/index'),
		meta: {
			title: "智慧乡村"
		}
	},
	{
		path: "/case/village",
		component: () => import(/* webpackChunkName: "login" */ '@/views/speed/case/village2/index'),
		meta: {
			title: "智慧乡村"
		}
	},
	{
		path: "/speed",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/index'),
		meta: {
			title: "宣传页"
		},
		redirect: "/speed/home",
		children: [
			{
				path: "/speed/home",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/home/home'),
				meta: {
					title: "主页",
					show: true,
					show1: true,
				},
			},
			{
				path: "/speed/function",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/example/function'),
				meta: {
					title: "功能样例",
					show: true,
					show1: false,
				},
			},
			{
				path: "/speed/solution/building",
				name: "园区与建筑",
				component: () => import("@/views/speed/solution/building/index.vue"),
				meta: {
					title: "园区与建筑",
					show: true,
					show1: true,
				},
			},
			{
				path: "/speed/solution/city",
				name: "城市与新区",
				component: () => import("@/views/speed/solution/city/index.vue"),
				meta: {
					title: "城市与新区",
					show: true,
					show1: true,
				},
			},
			{
				path: "/speed/scene",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/scene'),
				meta: {
					title: "解决方案",
					show: true,
					show1: true,
				},
			},
			{
				path: "/speed/start",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/start/dev'),
				meta: {
					title: "快速开始",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/server",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/start/server'),
				meta: {
					title: "数据服务",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/dev",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/start/dev'),
				meta: {
					title: "开发者",
					show1: true,
					 show: true,
				},
			},
			{
				path: "/speed/api",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/start/api'),
				meta: {
					title: "Speed3DAPI",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/lightweight",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/start/lightweight'),
				meta: {
					title: "轻量化",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/pipeline",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/pipeline/pipeline'),
				meta: {
					title: "智慧管线",
					// show: false,
				},
			},
			{
				path: "/speed/NanJingCIM",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/NanJingCIM/index'),
				meta: {
					title: "南京CIM",
					// show: false,
				},
			},
			{
				path: "/speed/smartCity",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/functionSample/smartCity'),
				meta: {
					title: "智慧城市",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/smartCommunity",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/functionSample/smartCommunity'),
				meta: {
					title: "智慧社区",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/smartPark",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/functionSample/smartPark'),
				meta: {
					title: "智慧园区",
					show1: true,
					show: true,
				},
			},
			{
				path: "/speed/smartFactory",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/functionSample/smartFactory'),
				meta: {
					title: "智慧工厂",
					show1: true,
					show: true,
				},
			}
		]
	},


	{
		path: "/case/civil",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/index'),
		meta: {
			title: "乡村地名信息服务应用一张图"
		},
		redirect: "/case/civil/earth",
		children: [
			{
				path: "/case/civil/earth",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/earth/earth'),
				meta: {
					title: "乡村地名信息服务应用一张图",
					show: true,
					id:0,
				},
			},
			{
				path: "/case/civil/address",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/address/address'),
				meta: {
					title: "乡村地名信息服务应用一张图-地名地址",
					show: true,
					id:6,
				},
			},
			{
				path: "/case/civil/community",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/community/community'),
				meta: {
					title: "乡村地名信息服务应用一张图-智慧社区",
					show: true,
					id:5,
				},
			},
			{
				path: "/case/civil/countryside",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/countryside/countryside'),
				meta: {
					title: "乡村地名信息服务应用一张图-智慧乡村",
					show: true,
					id:1,
				},
			},
			{
				path: "/case/civil/security",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/security/security'),
				meta: {
					title: "乡村地名信息服务应用一张图-社会保障",
					show: true,
					id:2,
				},
			},{
				path: "/case/civil/doorplate",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/doorplate/doorplate'),
				meta: {
					title: "乡村地名信息服务应用一张图-道路门牌",
					show: true,
					id:3,
				},
			},{
				path: "/case/civil/tourism",
				component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/speed/case/civil/tourism/tourism'),
				meta: {
					title: "乡村地名信息服务应用一张图-文化旅游",
					show: true,
					id:4,
				},
			},

		]
	},
	{
		path: "/speed/case/factory/zhongdan",
		component: () => import("@/views/speed/case/factory/zhongdan/index"),
		meta: {
			title: "中丹化工数字运维系统"
		},
		redirect: "/speed/case/factory/zhongdan/enterprise",
		children: [
			{
				path: "/speed/case/factory/zhongdan/enterprise",
				component: () => import("@/views/speed/case/factory/zhongdan/enterprise/enterprise.vue"),
				meta: {
					title: "中丹化工数字运维系统-企业看板"
				}
			},
			{
				path: "/speed/case/factory/zhongdan/factoryarea",
				component: () => import("@/views/speed/case/factory/zhongdan/factoryarea/factoryarea.vue"),
				meta: {
					title: "中丹化工数字运维系统-厂区看板"
				}
			},
			{
				path: "/speed/case/factory/zhongdan/workshop",
				component: () => import("@/views/speed/case/factory/zhongdan/workshop/workshop.vue"),
				meta: {
					title: "中丹化工数字运维系统-车间看板"
				}
			},
			{
				path: "/speed/case/factory/zhongdan/productionline",
				component: () => import("@/views/speed/case/factory/zhongdan/productionline/productionline.vue"),
				meta: {
					title: "中丹化工数字运维系统-产线看板"
				}
			}
		]
	}

]

export default routes;
