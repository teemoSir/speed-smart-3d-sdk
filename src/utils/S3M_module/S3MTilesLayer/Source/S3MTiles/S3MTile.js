const _0x4307=['sphere','updateVisibility','pixel','LOADING','ready','11804xTPaxa','parent','length','defineProperties','fileName','dot','FAILED','Request','distanceToTile','80226SnCAov','UNLOADED','relativePath','cacheNode','boundingVolume','updatedVisibilityFrame','rootName','RequestType','_cache','isChildBlock','foveatedFactor','rangeDataList','EPSILON7','fromCornerPoints','add','state','Pixel','normalize','selectedFrame','center','destroy','parse','tan','updatePriority','s3m','CullingVolume','parseBuffer','freeBlock','BoundingSphere','then','requestedFrame','pow','defined','finalResolution','priorityHolder','Cartesian3','blockKey','_minimumPriority','distanceToTileCenter','s3mb','geoMap','push','distanceToCamera','visibility','7fiQcDp','ancestorMap','magnitude','TileBoundingSphere','shouldSelect','getBaseUri','contentReadyPromise','destroyObject','MASK_INDETERMINATE','camera','update','replace','reject','selected','radius','fetchArrayBuffer','priority','box','data/path/','getExtensionFromUri','getPixel','READY','visibilityPlaneMask','_baseResource','subtract','Matrix4','serverKey','isAncestorBlock','layer','computeVisibilityWithPlaneMask','when','request','_basePath','fileExtension','lodRangeMode','modelMatrix','multiplyByPoint','getUrlComponent','processFrame','baseUri','contentResource','wasMinPriorityChild','directionWC','3fgVTzL','RequestScheduler','contentState','positionWC','min','isDestroyed','max','197859QOcorL','isLeafTile','visibleDistanceMax','maximumComponent','createBoundingVolume','119674qeEehc','prototype','rootBatchIdMap','112954ibXxul','children','visible','free','rangeMode','pop','drawingBufferHeight','247531YoaVTI','resolve','cullingVolume','Math','getDerivedResource','createIfNeeded','indexOf','Resource','MASK_OUTSIDE','_isS3MBlock','lodRangeData','clone','defer','multiplyByScalar','defaultValue','350813LNyMFT','TILES3D','renderEntities','MAX_VALUE','distance','isRootTile','requestContent','5CmBDSU'];const _0x522866=_0x5057;(function(_0x59fc4a,_0x48d3a2){const _0x500020=_0x5057;while(!![]){try{const _0x1593d4=-parseInt(_0x500020(0x212))*-parseInt(_0x500020(0x26f))+-parseInt(_0x500020(0x278))*parseInt(_0x500020(0x269))+-parseInt(_0x500020(0x24c))+parseInt(_0x500020(0x262))+parseInt(_0x500020(0x244))+-parseInt(_0x500020(0x23d))*-parseInt(_0x500020(0x249))+-parseInt(_0x500020(0x253));if(_0x1593d4===_0x48d3a2)break;else _0x59fc4a['push'](_0x59fc4a['shift']());}catch(_0x1851be){_0x59fc4a['push'](_0x59fc4a['shift']());}}}(_0x4307,0x37d63));import _0xbeb8bb from'./Enum/ContentState.js';import _0x2c7f97 from'./S3ModelParser.js';import _0x395f9c from'./S3ModelOldParser.js';import _0x12a7c5 from'./S3MBlockParser.js';import _0x59c98f from'./S3MContentParser.js';import _0x5d7d04 from'./S3MBlockContentParser.js';import _0x2dbcfe from'./Enum/RangeMode.js';function S3MTile(_0x346f97,_0x129371,_0x23adbd,_0x3e316c,_0x3aaa43,_0x2615e4){const _0x21f42c=_0x5057;this[_0x21f42c(0x22e)]=_0x346f97,this[_0x21f42c(0x270)]=_0x129371;let _0x37c9ec=_0x3e316c[_0x21f42c(0x21d)](/\\/g,'/');this['fileExtension']=Cesium[_0x21f42c(0x225)](_0x3e316c),this[_0x21f42c(0x27a)]=getUrl(_0x37c9ec,_0x346f97),this[_0x21f42c(0x273)]=_0x3e316c,this['isLeafTile']=_0x3aaa43===0x0,this[_0x21f42c(0x267)]=![],this[_0x21f42c(0x27c)]=this[_0x21f42c(0x248)](_0x23adbd,_0x346f97[_0x21f42c(0x235)]);let _0x3e1a0a=Cesium[_0x21f42c(0x25a)][_0x21f42c(0x258)](_0x346f97[_0x21f42c(0x229)]);if(Cesium['defined'](_0x129371))this['baseUri']=_0x129371[_0x21f42c(0x239)];else{let _0x7d766e=new Cesium[(_0x21f42c(0x25a))](_0x37c9ec);this[_0x21f42c(0x239)]=_0x7d766e[_0x21f42c(0x217)]();}this[_0x21f42c(0x23a)]=_0x3e1a0a[_0x21f42c(0x257)]({'url':this['relativePath']}),this['serverKey']=Cesium[_0x21f42c(0x23e)]['getServerKey'](this[_0x21f42c(0x23a)][_0x21f42c(0x237)]()),this['request']=undefined,this[_0x21f42c(0x27b)]=undefined,this['distanceToCamera']=0x0,this['centerZDepth']=0x0,this[_0x21f42c(0x26c)]=0x0,this['depth']=_0x129371?_0x129371['depth']+0x1:0x0,this['visibilityPlaneMask']=0x0,this[_0x21f42c(0x24e)]=![],this['children']=[],this['renderEntities']=[],this[_0x21f42c(0x25d)]=Cesium[_0x21f42c(0x261)](_0x3aaa43,0x10),this[_0x21f42c(0x234)]=Cesium[_0x21f42c(0x261)](_0x2615e4,_0x2dbcfe[_0x21f42c(0x1f6)]),this['contentState']=this[_0x21f42c(0x245)]?_0xbeb8bb['READY']:_0xbeb8bb[_0x21f42c(0x279)],this['touchedFrame']=0x0,this[_0x21f42c(0x204)]=0x0,this[_0x21f42c(0x238)]=0x0,this[_0x21f42c(0x1f8)]=0x0,this[_0x21f42c(0x1eb)]=0x0,this[_0x21f42c(0x1f0)]=0x0,this[_0x21f42c(0x222)]=0x0,this['priorityHolder']=this,this[_0x21f42c(0x23b)]=![],this[_0x21f42c(0x216)]=![],this[_0x21f42c(0x21f)]=![],this[_0x21f42c(0x207)]=!![],this['refines']=![],this[_0x21f42c(0x1ec)]=!_0x129371?this[_0x21f42c(0x273)]:_0x129371['rootName'],this[_0x21f42c(0x20a)]='',this[_0x21f42c(0x22d)]=![],this[_0x21f42c(0x1ef)]=![],this['rootBatchIdMap']={},this[_0x21f42c(0x213)]={};}Object[_0x522866(0x272)](S3MTile[_0x522866(0x24a)],{'renderable':{'get':function(){const _0x3f3806=_0x522866;let _0x264897=this[_0x3f3806(0x264)],_0x489955=_0x264897['length'];if(_0x489955===0x0)return![];for(let _0x16c608=0x0;_0x16c608<_0x489955;_0x16c608++){if(!_0x264897[_0x16c608][_0x3f3806(0x26e)])return![];}return!![];}}});let scratchScale=new Cesium[(_0x522866(0x209))]();function createSphere(_0x1d7897,_0x16e06d){const _0x1dcd66=_0x522866;let _0x47f036=Cesium[_0x1dcd66(0x209)]['clone'](_0x1d7897[_0x1dcd66(0x1f9)]),_0x486ceb=_0x1d7897[_0x1dcd66(0x220)];_0x47f036=Cesium['Matrix4'][_0x1dcd66(0x236)](_0x16e06d,_0x47f036,_0x47f036);let _0x5d7838=Cesium[_0x1dcd66(0x22b)]['getScale'](_0x16e06d,scratchScale),_0x7a756f=Cesium[_0x1dcd66(0x209)]['maximumComponent'](_0x5d7838);return _0x486ceb*=_0x7a756f,new Cesium['TileBoundingSphere'](_0x47f036,_0x486ceb);}function getUrl(_0x4acfb8,_0x88e9e1){const _0x1effaa=_0x522866;_0x4acfb8=_0x4acfb8['replace'](/\+/g,'%2B');let _0x5a82bb=_0x88e9e1[_0x1effaa(0x232)],_0x2ac884=_0x88e9e1[_0x1effaa(0x232)][_0x1effaa(0x259)]('realspace')>-0x1;if(!_0x2ac884)return _0x4acfb8;let _0x16bd6d=_0x5a82bb['replace'](/(.*realspace)/,''),_0x45d42c=_0x5a82bb[_0x1effaa(0x21d)](/\/rest\/realspace/g,'')[_0x1effaa(0x21d)](_0x16bd6d,'');return _0x45d42c+'/rest/realspace'+_0x16bd6d+_0x1effaa(0x224)+_0x4acfb8[_0x1effaa(0x21d)](/^\.*/,'')['replace'](/^\//,'')['replace'](/\/$/,'');}function createBoundingBox(_0x588259,_0x3a11cf){const _0x2a2c80=_0x522866;let _0x9d620a=new Cesium[(_0x2a2c80(0x209))](_0x588259[_0x2a2c80(0x241)]['x'],_0x588259[_0x2a2c80(0x241)]['y'],_0x588259[_0x2a2c80(0x241)]['z']);Cesium[_0x2a2c80(0x22b)][_0x2a2c80(0x236)](_0x3a11cf,_0x9d620a,_0x9d620a);let _0x36b49c=new Cesium['Cartesian3'](_0x588259[_0x2a2c80(0x243)]['x'],_0x588259['max']['y'],_0x588259[_0x2a2c80(0x243)]['z']);Cesium[_0x2a2c80(0x22b)]['multiplyByPoint'](_0x3a11cf,_0x36b49c,_0x36b49c);let _0x520465=Cesium[_0x2a2c80(0x202)][_0x2a2c80(0x1f3)](_0x9d620a,_0x36b49c,new Cesium[(_0x2a2c80(0x202))]()),_0x146a4c=_0x520465['center'],_0x411aef=_0x520465[_0x2a2c80(0x220)],_0x3b6220=Cesium[_0x2a2c80(0x22b)]['getScale'](_0x3a11cf,scratchScale),_0x1af10a=Cesium[_0x2a2c80(0x209)][_0x2a2c80(0x247)](_0x3b6220);return _0x411aef*=_0x1af10a,new Cesium[(_0x2a2c80(0x215))](_0x146a4c,_0x411aef);}S3MTile[_0x522866(0x24a)][_0x522866(0x248)]=function(_0x324dfc,_0x5c6796){const _0x30dda1=_0x522866;if(Cesium[_0x30dda1(0x206)](_0x324dfc[_0x30dda1(0x26a)]))return createSphere(_0x324dfc[_0x30dda1(0x26a)],_0x5c6796);else{if(Cesium[_0x30dda1(0x206)](_0x324dfc[_0x30dda1(0x223)]))return createBoundingBox(_0x324dfc['box'],_0x5c6796);}return undefined;},S3MTile['prototype']['canTraverse']=function(){const _0x467803=_0x522866;if(this[_0x467803(0x24d)]['length']===0x0||this[_0x467803(0x245)])return![];if(!Cesium[_0x467803(0x206)](this[_0x467803(0x25d)]))return!![];return this[_0x467803(0x26c)]>this[_0x467803(0x25d)];};function _0x5057(_0x29515b,_0x411f9a){_0x29515b=_0x29515b-0x1eb;let _0x4307c3=_0x4307[_0x29515b];return _0x4307c3;}function getBoundingVolume(_0x13fb1e,_0x235f7c){const _0x3016c8=_0x522866;return _0x13fb1e[_0x3016c8(0x27c)];}S3MTile[_0x522866(0x24a)]['getPixel']=function(_0x29742c){const _0x2b654c=_0x522866;let _0x1f8151=this[_0x2b654c(0x27c)],_0x52d45e=_0x1f8151[_0x2b654c(0x220)],_0x3f7f2a=_0x1f8151['center'],_0x271217=Cesium[_0x2b654c(0x209)][_0x2b654c(0x266)](_0x29742c[_0x2b654c(0x21b)]['positionWC'],_0x3f7f2a),_0x182865=_0x29742c['context'][_0x2b654c(0x252)],_0x1bfab1=_0x29742c[_0x2b654c(0x21b)]['frustum']['_fovy']*0.5,_0x56a944=_0x182865*0.5,_0xaeec13=_0x56a944/Math[_0x2b654c(0x1fc)](_0x1bfab1);return _0xaeec13*_0x52d45e/_0x271217;},S3MTile['prototype'][_0x522866(0x277)]=function(_0x4b1bf7){const _0x23d691=_0x522866;let _0x507312=getBoundingVolume(this,_0x4b1bf7);return _0x507312[_0x23d691(0x210)](_0x4b1bf7);};let scratchToTileCenter=new Cesium[(_0x522866(0x209))]();S3MTile[_0x522866(0x24a)][_0x522866(0x20c)]=function(_0x226933){const _0x2c3fd7=_0x522866,_0x64ce23=getBoundingVolume(this,_0x226933),_0x454ac7=Cesium[_0x2c3fd7(0x209)][_0x2c3fd7(0x22a)](_0x64ce23[_0x2c3fd7(0x1f9)],_0x226933[_0x2c3fd7(0x21b)][_0x2c3fd7(0x240)],scratchToTileCenter);return Cesium[_0x2c3fd7(0x209)][_0x2c3fd7(0x274)](_0x226933[_0x2c3fd7(0x21b)][_0x2c3fd7(0x23c)],_0x454ac7);},S3MTile[_0x522866(0x24a)][_0x522866(0x211)]=function(_0xb9f2ba,_0x4fd4a1){const _0x51d674=_0x522866;let _0x1676e7=getBoundingVolume(this,_0xb9f2ba);return _0xb9f2ba[_0x51d674(0x255)][_0x51d674(0x22f)](_0x1676e7,_0x4fd4a1);};let scratchCartesian=new Cesium['Cartesian3']();function priorityDeferred(_0x1cd2dc,_0x5cfb1e){const _0x206fbc=_0x522866;let _0x5bfdc7=_0x5cfb1e[_0x206fbc(0x21b)],_0x478a7c=_0x1cd2dc[_0x206fbc(0x27c)],_0x1bb6df=_0x478a7c['radius'],_0x5e159c=Cesium[_0x206fbc(0x209)][_0x206fbc(0x260)](_0x5bfdc7[_0x206fbc(0x23c)],_0x1cd2dc['centerZDepth'],scratchCartesian),_0xa9f714=Cesium[_0x206fbc(0x209)][_0x206fbc(0x1f4)](_0x5bfdc7[_0x206fbc(0x240)],_0x5e159c,scratchCartesian),_0x40b72d=Cesium[_0x206fbc(0x209)][_0x206fbc(0x22a)](_0xa9f714,_0x478a7c[_0x206fbc(0x1f9)],scratchCartesian),_0x4e197a=Cesium['Cartesian3'][_0x206fbc(0x214)](_0x40b72d),_0x222469=_0x4e197a>_0x1bb6df;if(_0x222469){let _0x3f87b9=Cesium[_0x206fbc(0x209)][_0x206fbc(0x1f7)](_0x40b72d,scratchCartesian),_0x1f6864=Cesium[_0x206fbc(0x209)]['multiplyByScalar'](_0x3f87b9,_0x1bb6df,scratchCartesian),_0xe12b7b=Cesium[_0x206fbc(0x209)][_0x206fbc(0x1f4)](_0x478a7c[_0x206fbc(0x1f9)],_0x1f6864,scratchCartesian),_0x477924=Cesium[_0x206fbc(0x209)][_0x206fbc(0x22a)](_0xe12b7b,_0x5bfdc7[_0x206fbc(0x240)],scratchCartesian),_0x460ed4=Cesium[_0x206fbc(0x209)][_0x206fbc(0x1f7)](_0x477924,scratchCartesian);_0x1cd2dc[_0x206fbc(0x1f0)]=0x1-Math['abs'](Cesium[_0x206fbc(0x209)][_0x206fbc(0x274)](_0x5bfdc7[_0x206fbc(0x23c)],_0x460ed4));}else _0x1cd2dc[_0x206fbc(0x1f0)]=0x0;}S3MTile[_0x522866(0x24a)][_0x522866(0x26b)]=function(_0x4fe5d0,_0x3badd6){const _0xeffc1b=_0x522866;let _0x4cab6d=this[_0xeffc1b(0x270)],_0x58c4d7=Cesium[_0xeffc1b(0x206)](_0x4cab6d)?_0x4cab6d[_0xeffc1b(0x228)]:Cesium[_0xeffc1b(0x1ff)][_0xeffc1b(0x21a)];this['distanceToCamera']=this[_0xeffc1b(0x277)](_0x4fe5d0),this['centerZDepth']=this['distanceToTileCenter'](_0x4fe5d0),this[_0xeffc1b(0x26c)]=this[_0xeffc1b(0x226)](_0x4fe5d0),this[_0xeffc1b(0x228)]=this[_0xeffc1b(0x211)](_0x4fe5d0,_0x58c4d7),this[_0xeffc1b(0x24e)]=this[_0xeffc1b(0x228)]!==Cesium[_0xeffc1b(0x1ff)][_0xeffc1b(0x25b)]&&this[_0xeffc1b(0x210)]>=_0x3badd6['visibleDistanceMin']&&this[_0xeffc1b(0x210)]<=_0x3badd6[_0xeffc1b(0x246)],this['priorityDeferred']=priorityDeferred(this,_0x4fe5d0);};function createPriorityFunction(_0x3237a4){return function(){const _0x331bb1=_0x5057;return _0x3237a4[_0x331bb1(0x222)];};}function getContentFailedFunction(_0x19333f){return function(_0x36f136){const _0x5edee4=_0x5057;_0x19333f[_0x5edee4(0x23f)]=_0xbeb8bb[_0x5edee4(0x275)],_0x19333f[_0x5edee4(0x218)][_0x5edee4(0x21e)](_0x36f136);};}function createChildren(_0x73cad8,_0x37aaff){const _0x7e3ea7=_0x522866;let _0x3b4d58=_0x73cad8['layer'],_0x2be7d9=_0x37aaff[_0x7e3ea7(0x271)],_0x303617=Number[_0x7e3ea7(0x265)],_0x52eeb9=0x0,_0x7198c4=_0x2dbcfe[_0x7e3ea7(0x1f6)];for(let _0x3673a1=0x0;_0x3673a1<_0x2be7d9;_0x3673a1++){let _0x22302d=_0x37aaff[_0x3673a1],_0x5b1f61=_0x22302d[_0x7e3ea7(0x27c)],_0xe38e9d=_0x22302d[_0x7e3ea7(0x1f1)];_0xe38e9d=_0x73cad8['baseUri']+_0xe38e9d;let _0x3b15e0=_0x22302d['rangeList'],_0x1223b1=_0x22302d[_0x7e3ea7(0x250)],_0x5e162a=_0x22302d[_0x7e3ea7(0x20e)];if(_0x3b15e0!==0x0){let _0x420c83=new S3MTile(_0x3b4d58,_0x73cad8,_0x5b1f61,_0xe38e9d,_0x3b15e0,_0x1223b1);_0x73cad8[_0x7e3ea7(0x24d)][_0x7e3ea7(0x20f)](_0x420c83),_0x3b4d58[_0x7e3ea7(0x1ee)]['add'](_0x420c83);}for(let _0x39fe08 in _0x5e162a){_0x5e162a['hasOwnProperty'](_0x39fe08)&&_0x73cad8['renderEntities'][_0x7e3ea7(0x20f)](_0x5e162a[_0x39fe08]);}_0x303617=Math[_0x7e3ea7(0x241)](_0x303617,_0x3b15e0),_0x52eeb9=Math[_0x7e3ea7(0x243)](_0x52eeb9,_0x3b15e0),_0x7198c4=_0x1223b1;}_0x73cad8[_0x7e3ea7(0x267)]&&(_0x73cad8['lodRangeData']=_0x7198c4===_0x2dbcfe['Pixel']?_0x303617/0x2:_0x52eeb9*0x2,_0x73cad8[_0x7e3ea7(0x234)]=_0x7198c4);}function parseChildGroup(_0xc7e246,_0x185274,_0x19049c){const _0x123e08=_0x522866;let _0x46b663=_0x185274[_0x19049c['fileName']];if(!_0x46b663)return;_0x19049c['blockKey']=_0x19049c[_0x123e08(0x273)],_0x19049c[_0x123e08(0x22d)]=!![];let _0x2e64e1=_0x5d7d04[_0x123e08(0x1fb)](_0xc7e246,_0x19049c,_0x46b663);createChildren(_0x19049c,_0x2e64e1);let _0x66d36a=[_0x19049c];while(_0x66d36a['length']){let _0x364911=_0x66d36a[_0x123e08(0x251)](),_0x37d4d0=_0x364911['children'];for(let _0x4e3660=0x0,_0x533f96=_0x37d4d0[_0x123e08(0x271)];_0x4e3660<_0x533f96;_0x4e3660++){let _0x134005=_0x37d4d0[_0x4e3660],_0xe9758=_0x134005[_0x123e08(0x273)];if(_0xe9758==='')continue;_0x134005['rootBatchIdMap']=_0x46b663[_0x123e08(0x24b)],_0x134005[_0x123e08(0x213)]=_0x46b663[_0x123e08(0x213)];let _0x276364=_0x185274[_0x134005[_0x123e08(0x273)]];if(_0x276364){_0x134005['contentState']=_0xbeb8bb[_0x123e08(0x227)],_0x134005[_0x123e08(0x20a)]=_0x364911[_0x123e08(0x20a)],_0x134005['isChildBlock']=!![];let _0x7001ea=_0x5d7d04['parse'](_0xc7e246,_0x134005,_0x276364);createChildren(_0x134005,_0x7001ea),_0x66d36a[_0x123e08(0x20f)](_0x134005);}else _0x134005[_0x123e08(0x22d)]=!![],_0x134005[_0x123e08(0x20a)]=_0x134005[_0x123e08(0x273)];}}}function contentReadyFunction(_0x4349a6,_0x5cf7c3,_0x4ca839){const _0x52f652=_0x522866;_0x4349a6[_0x52f652(0x1ee)][_0x52f652(0x1f4)](_0x5cf7c3);if(_0x4349a6[_0x52f652(0x25c)]){let _0x5ddb70=_0x12a7c5[_0x52f652(0x200)](_0x4ca839,_0x5cf7c3);parseChildGroup(_0x4349a6,_0x5ddb70,_0x5cf7c3),_0x5cf7c3[_0x52f652(0x1f8)]=0x0,_0x5cf7c3[_0x52f652(0x23f)]=_0xbeb8bb[_0x52f652(0x227)],_0x5cf7c3[_0x52f652(0x218)][_0x52f652(0x254)](!![]);return;}let _0x5e3d7e;if(_0x5cf7c3[_0x52f652(0x233)]===_0x52f652(0x20d))_0x5e3d7e=_0x2c7f97[_0x52f652(0x200)](_0x4ca839);else _0x5cf7c3[_0x52f652(0x233)]===_0x52f652(0x1fe)&&(_0x5e3d7e=_0x395f9c[_0x52f652(0x200)](_0x4ca839));if(!_0x5e3d7e){_0x5cf7c3[_0x52f652(0x23f)]=_0xbeb8bb[_0x52f652(0x275)],_0x5cf7c3[_0x52f652(0x218)][_0x52f652(0x21e)]();return;}let _0x297af8=_0x59c98f[_0x52f652(0x1fb)](_0x4349a6,_0x5e3d7e,_0x5cf7c3);createChildren(_0x5cf7c3,_0x297af8),_0x5cf7c3[_0x52f652(0x1f8)]=0x0,_0x5cf7c3['contentState']=_0xbeb8bb[_0x52f652(0x227)],_0x5cf7c3[_0x52f652(0x218)][_0x52f652(0x254)](_0x5e3d7e);}S3MTile[_0x522866(0x24a)][_0x522866(0x268)]=function(){const _0x385bc8=_0x522866;let _0x5ed17c=this,_0x4f96fe=this[_0x385bc8(0x22e)];if(_0x4f96fe['_isS3MBlock']&&_0x4f96fe['_blockCache']['contains'](_0x4f96fe['id'],this[_0x385bc8(0x20a)])){let _0x263a38=_0x4f96fe['_blockCache']['get'](_0x4f96fe['id'],this[_0x385bc8(0x20a)]);return this[_0x385bc8(0x218)]=Cesium[_0x385bc8(0x230)][_0x385bc8(0x25f)](),contentReadyFunction(_0x4f96fe,this,_0x263a38),!![];}let _0x48a8a8=this[_0x385bc8(0x23a)][_0x385bc8(0x25e)](),_0x1094ff=new Cesium[(_0x385bc8(0x276))]({'throttle':!![],'throttleByServer':!![],'type':Cesium[_0x385bc8(0x1ed)][_0x385bc8(0x263)],'priorityFunction':createPriorityFunction(this),'serverKey':this[_0x385bc8(0x22c)]});this['request']=_0x1094ff,_0x48a8a8[_0x385bc8(0x231)]=_0x1094ff;let _0x5de9ac=_0x48a8a8[_0x385bc8(0x221)]();if(!Cesium[_0x385bc8(0x206)](_0x5de9ac))return![];this[_0x385bc8(0x23f)]=_0xbeb8bb[_0x385bc8(0x26d)],this[_0x385bc8(0x218)]=Cesium[_0x385bc8(0x230)][_0x385bc8(0x25f)]();let _0x21ec1a=getContentFailedFunction(this);return _0x5de9ac[_0x385bc8(0x203)](function(_0x4158fb){const _0x47b059=_0x385bc8;if(_0x5ed17c[_0x47b059(0x242)]()){_0x21ec1a();return;}contentReadyFunction(_0x4f96fe,_0x5ed17c,_0x4158fb);})['otherwise'](function(_0x507a58){const _0x3bd0fe=_0x385bc8;if(_0x1094ff[_0x3bd0fe(0x1f5)]===Cesium['RequestState']['CANCELLED']){_0x5ed17c['contentState']=_0xbeb8bb[_0x3bd0fe(0x279)];return;}_0x21ec1a(_0x507a58);}),!![];};function priorityNormalizeAndClamp(_0x4b9401,_0x21c53f,_0x3ffa10){const _0x3fc4e6=_0x522866;return Math[_0x3fc4e6(0x243)](Cesium[_0x3fc4e6(0x256)][_0x3fc4e6(0x1f7)](_0x4b9401,_0x21c53f,_0x3ffa10)-Cesium[_0x3fc4e6(0x256)][_0x3fc4e6(0x1f2)],0x0);}function isolateDigits(_0x5529b0,_0x180892,_0x5ba5fa){const _0x232337=_0x522866;let _0x315a2c=_0x5529b0*Math[_0x232337(0x205)](0xa,_0x180892),_0x5b3951=parseInt(_0x315a2c);return _0x5b3951*Math[_0x232337(0x205)](0xa,_0x5ba5fa);}S3MTile[_0x522866(0x24a)][_0x522866(0x1fd)]=function(_0x52cc98,_0x5baa95){const _0x5b4d11=_0x522866;let _0x437093=_0x52cc98[_0x5b4d11(0x20b)],_0x2ae801=_0x52cc98['_maximumPriority'],_0x5b898c=0x4,_0xa432f7=0x4,_0x3110b7=priorityNormalizeAndClamp(this[_0x5b4d11(0x1f0)],_0x437093[_0x5b4d11(0x1f0)],_0x2ae801[_0x5b4d11(0x1f0)]),_0x46efe7=isolateDigits(_0x3110b7,_0xa432f7,_0x5b898c);_0x5b898c=0x8;let _0x7d5590=priorityNormalizeAndClamp(this[_0x5b4d11(0x26c)],_0x437093[_0x5b4d11(0x26c)],_0x2ae801[_0x5b4d11(0x26c)]),_0x35ae4e=isolateDigits(0x1-_0x7d5590,_0xa432f7,_0x5b898c);_0x5b898c=0x0;let _0x63f9b9=priorityNormalizeAndClamp(this[_0x5b4d11(0x210)],_0x437093[_0x5b4d11(0x266)],_0x2ae801[_0x5b4d11(0x266)]),_0x1fb7f6=isolateDigits(_0x63f9b9,_0xa432f7,_0x5b898c);this[_0x5b4d11(0x222)]=_0x46efe7+_0x35ae4e+_0x1fb7f6;},S3MTile[_0x522866(0x24a)]['update']=function(_0x35efba,_0xbfca04){const _0x26818c=_0x522866;for(let _0x1f6f07=0x0,_0x344459=this[_0x26818c(0x264)][_0x26818c(0x271)];_0x1f6f07<_0x344459;_0x1f6f07++){this[_0x26818c(0x264)][_0x1f6f07][_0x26818c(0x21c)](_0x35efba,_0xbfca04);}},S3MTile[_0x522866(0x24a)][_0x522866(0x24f)]=function(){const _0x18ea28=_0x522866;this['contentState']=_0xbeb8bb['UNLOADED'],this[_0x18ea28(0x231)]=undefined,this['cacheNode']=undefined,this[_0x18ea28(0x208)]=undefined,this[_0x18ea28(0x218)]=undefined,this[_0x18ea28(0x208)]=undefined;for(let _0x162feb=0x0,_0x57ab33=this['renderEntities']['length'];_0x162feb<_0x57ab33;_0x162feb++){this[_0x18ea28(0x264)][_0x162feb][_0x18ea28(0x1fa)]();}this[_0x18ea28(0x264)]['length']=0x0,this[_0x18ea28(0x24d)][_0x18ea28(0x271)]=0x0;},S3MTile[_0x522866(0x24a)]['freeBlock']=function(){const _0x5cdb54=_0x522866;this['contentState']=_0xbeb8bb[_0x5cdb54(0x279)],this['request']=undefined,this[_0x5cdb54(0x27b)]=undefined,this[_0x5cdb54(0x208)]=undefined,this[_0x5cdb54(0x218)]=undefined,this[_0x5cdb54(0x208)]=undefined;for(let _0x624bd4=0x0,_0x853b19=this[_0x5cdb54(0x264)][_0x5cdb54(0x271)];_0x624bd4<_0x853b19;_0x624bd4++){this['renderEntities'][_0x624bd4][_0x5cdb54(0x1fa)]();}this['renderEntities']['length']=0x0;for(let _0x4facc1=0x0,_0x2dc50b=this['children'][_0x5cdb54(0x271)];_0x4facc1<_0x2dc50b;_0x4facc1++){let _0x26e1b3=this[_0x5cdb54(0x24d)][_0x4facc1];!_0x26e1b3[_0x5cdb54(0x22d)]&&_0x26e1b3[_0x5cdb54(0x201)]();}this[_0x5cdb54(0x24d)][_0x5cdb54(0x271)]=0x0;},S3MTile[_0x522866(0x24a)]['isDestroyed']=function(){return![];},S3MTile[_0x522866(0x24a)]['destroy']=function(){const _0xcda874=_0x522866;return this[_0xcda874(0x24f)](),Cesium[_0xcda874(0x219)](this);};export default S3MTile;