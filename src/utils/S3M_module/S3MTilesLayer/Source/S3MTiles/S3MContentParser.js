const _0x34d0=['1PuCUmh','modelMatrix','length','boundingVolume','fileName','424428hqJuZp','instanceIndex','byteLength','bTransparentSorting','Matrix4','compressOptions','Cartesian3','isTexBlock','rangeMode','material','transparentsorting','skeletonNames','groupNode','arrayBufferView','buffer','fromBoundingSpheres','materialCode','verticesCount','REPEAT','push','diffuse','geoPackage','texturePackage','instanceBounds','47892OASRID','multiply','textures','wrapT','9rMqgPd','vertCompressConstant','CLAMP_TO_EDGE','geoMap','radius','fromArray','materials','addressmode','matrix','wrapS','typedArray','textureCache','101cKZBse','BoundingSphere','specularColor','pickInfo','distance','ambient','rangeList','4EdtKiP','specular','pageLods','addTexture','transform','Color','byteOffset','Carteisan3','childTile','225439hILCKR','lerp','rangeDataList','unpack','alphaMode','getTexture','fileType','shininess','context','7ypcYLn','center','TextureWrap','hasOwnProperty','clone','199246dBTMCa','sphere','37487eRiRkG','2314isIMWT','texmodmatrix','parse','fromPoints','diffuseColor','defined','ambientColor','vertexAttributes','45999Lffxpo','keys','minVerticesValue','componentsPerAttribute','boundingSphere','arrIndexPackage','SVC_Vertex'];const _0x469ad7=_0x2c10;(function(_0x37d09c,_0x2cb3a9){const _0x5e5cfc=_0x2c10;while(!![]){try{const _0x42f030=-parseInt(_0x5e5cfc(0x1d7))*parseInt(_0x5e5cfc(0x20c))+-parseInt(_0x5e5cfc(0x201))+parseInt(_0x5e5cfc(0x218))+-parseInt(_0x5e5cfc(0x213))*-parseInt(_0x5e5cfc(0x1f3))+parseInt(_0x5e5cfc(0x1ea))*parseInt(_0x5e5cfc(0x1d3))+-parseInt(_0x5e5cfc(0x1e3))*parseInt(_0x5e5cfc(0x204))+-parseInt(_0x5e5cfc(0x1fc))*-parseInt(_0x5e5cfc(0x203));if(_0x42f030===_0x2cb3a9)break;else _0x37d09c['push'](_0x37d09c['shift']());}catch(_0x590d2e){_0x37d09c['push'](_0x37d09c['shift']());}}}(_0x34d0,0x3eb7d));import _0x10f861 from'./DDSTexture.js';import _0x366ba1 from'./MaterialPass.js';import _0x2fd856 from'./Factory/S3MContentFactory.js';import _0x13a811 from'./Enum/VertexCompressOption.js';function S3MContentParser(){}function parseMaterial(_0x1d18da,_0x59c6b3,_0x10be11){const _0x244428=_0x2c10;let _0x31bf26={},_0x148024=_0x59c6b3[_0x244428(0x1dd)][_0x244428(0x1c4)];for(let _0x379eca=0x0,_0x2d3e82=_0x148024[_0x244428(0x215)];_0x379eca<_0x2d3e82;_0x379eca++){let _0x5b61bb=_0x148024[_0x379eca][_0x244428(0x1c4)],_0x275deb=_0x5b61bb['id'],_0xb7f550=new _0x366ba1();_0x31bf26[_0x275deb]=_0xb7f550;let _0x5ac69e=_0x5b61bb[_0x244428(0x1e8)];_0xb7f550[_0x244428(0x20a)]=new Cesium[(_0x244428(0x1ef))](_0x5ac69e['r'],_0x5ac69e['g'],_0x5ac69e['b'],_0x5ac69e['a']);let _0x196258=_0x5b61bb[_0x244428(0x1cf)];_0xb7f550[_0x244428(0x208)]=new Cesium[(_0x244428(0x1ef))](_0x196258['r'],_0x196258['g'],_0x196258['b'],_0x196258['a']);let _0x3de302=_0x5b61bb[_0x244428(0x1eb)];_0xb7f550[_0x244428(0x1e5)]=new Cesium[(_0x244428(0x1ef))](_0x3de302['r'],_0x3de302['g'],_0x3de302['b'],_0x3de302['a']),_0xb7f550[_0x244428(0x1fa)]=_0x5b61bb[_0x244428(0x1fa)],_0xb7f550[_0x244428(0x21b)]=_0x5b61bb[_0x244428(0x1c5)],_0xb7f550[_0x244428(0x1f7)]=_0x5b61bb[_0x244428(0x1f7)];let _0x2524ff=_0x5b61bb['textureunitstates'],_0x1ed253=_0x2524ff[_0x244428(0x215)];for(let _0x2bf70f=0x0;_0x2bf70f<_0x1ed253;_0x2bf70f++){let _0x3b10e3=_0x2524ff[_0x2bf70f]['textureunitstate'],_0x4f4b5e=_0x3b10e3['id'],_0x4ddfc4=_0x3b10e3[_0x244428(0x1de)]['u']===0x0?Cesium[_0x244428(0x1fe)][_0x244428(0x1cd)]:Cesium['TextureWrap'][_0x244428(0x1d9)],_0x1faadc=_0x3b10e3[_0x244428(0x1de)]['v']===0x0?Cesium[_0x244428(0x1fe)]['REPEAT']:Cesium[_0x244428(0x1fe)][_0x244428(0x1d9)];_0xb7f550['texMatrix']=Cesium[_0x244428(0x21c)][_0x244428(0x1f6)](_0x3b10e3[_0x244428(0x205)]);let _0x36884b=_0x59c6b3[_0x244428(0x1d1)][_0x4f4b5e];if(Cesium[_0x244428(0x209)](_0x36884b)&&_0x36884b[_0x244428(0x1c8)][_0x244428(0x21a)]>0x0){_0x36884b[_0x244428(0x1e0)]=_0x4ddfc4,_0x36884b[_0x244428(0x1d6)]=_0x1faadc;let _0x5809c3=_0x10be11[_0x244428(0x217)]+_0x4f4b5e,_0x4711e0=_0x1d18da[_0x244428(0x1e2)][_0x244428(0x1f8)](_0x5809c3);!Cesium[_0x244428(0x209)](_0x4711e0)&&(_0x36884b[_0x244428(0x1c2)]=![],_0x4711e0=new _0x10f861(_0x1d18da,_0x4f4b5e,_0x36884b),_0x1d18da[_0x244428(0x1e2)][_0x244428(0x1ed)](_0x5809c3,_0x4711e0)),_0xb7f550[_0x244428(0x1d5)]['push'](_0x4711e0);}}}return _0x31bf26;}function calcBoundingVolumeForNormal(_0x3a09cd,_0xb1ab1d){const _0x7a65c8=_0x2c10;let _0x151e59=new Cesium[(_0x7a65c8(0x1e4))](),_0x424e28=new Cesium[(_0x7a65c8(0x1c1))](),_0x34770f=_0x3a09cd[_0x7a65c8(0x20b)][0x0],_0x41539c=_0x34770f[_0x7a65c8(0x20f)],_0x3216c4=Cesium['defined'](_0x3a09cd[_0x7a65c8(0x1c0)])&&(_0x3a09cd[_0x7a65c8(0x1c0)]&_0x13a811[_0x7a65c8(0x212)])===_0x13a811[_0x7a65c8(0x212)],_0x23145b=0x1,_0x4fa587,_0x1926e0;_0x3216c4?(_0x23145b=_0x3a09cd[_0x7a65c8(0x1d8)],_0x4fa587=new Cesium[(_0x7a65c8(0x1c1))](_0x3a09cd[_0x7a65c8(0x20e)]['x'],_0x3a09cd[_0x7a65c8(0x20e)]['y'],_0x3a09cd[_0x7a65c8(0x20e)]['z']),_0x1926e0=new Uint16Array(_0x34770f[_0x7a65c8(0x1e1)]['buffer'],_0x34770f[_0x7a65c8(0x1e1)][_0x7a65c8(0x1f0)],_0x34770f[_0x7a65c8(0x1e1)][_0x7a65c8(0x21a)]/0x2)):_0x1926e0=new Float32Array(_0x34770f[_0x7a65c8(0x1e1)][_0x7a65c8(0x1c9)],_0x34770f['typedArray']['byteOffset'],_0x34770f['typedArray'][_0x7a65c8(0x21a)]/0x4);let _0x5b5bd0=[];for(let _0x92b39d=0x0;_0x92b39d<_0x3a09cd[_0x7a65c8(0x1cc)];_0x92b39d++){Cesium[_0x7a65c8(0x1c1)][_0x7a65c8(0x1dc)](_0x1926e0,_0x41539c*_0x92b39d,_0x424e28),_0x3216c4&&(_0x424e28=Cesium[_0x7a65c8(0x1c1)]['multiplyByScalar'](_0x424e28,_0x23145b,_0x424e28),_0x424e28=Cesium[_0x7a65c8(0x1c1)]['add'](_0x424e28,_0x4fa587,_0x424e28)),_0x5b5bd0[_0x7a65c8(0x1ce)](Cesium['Cartesian3'][_0x7a65c8(0x200)](_0x424e28));}return Cesium[_0x7a65c8(0x1e4)][_0x7a65c8(0x207)](_0x5b5bd0,_0x151e59),Cesium[_0x7a65c8(0x1e4)][_0x7a65c8(0x1ee)](_0x151e59,_0xb1ab1d,_0x151e59),_0x5b5bd0['length']=0x0,_0x151e59;}let scratchCenter=new Cesium[(_0x469ad7(0x1c1))]();function calcBoundingVolumeForInstance(_0x295fd2){const _0x4f94e2=_0x469ad7;let _0xbd1e99=new Cesium[(_0x4f94e2(0x1e4))](),_0x8ce48b=_0x295fd2[_0x4f94e2(0x1d2)];if(!Cesium[_0x4f94e2(0x209)](_0x8ce48b))return _0xbd1e99;let _0x4307c4=new Cesium[(_0x4f94e2(0x1c1))](_0x8ce48b[0x0],_0x8ce48b[0x1],_0x8ce48b[0x2]),_0x15f8f9=new Cesium[(_0x4f94e2(0x1f1))](_0x8ce48b[0x3],_0x8ce48b[0x4],_0x8ce48b[0x5]),_0xf1e3be=new Cesium['Cartesian3'][(_0x4f94e2(0x1f4))](_0x4307c4,_0x15f8f9,0.5,scratchCenter),_0x4fc825=new Cesium[(_0x4f94e2(0x1c1))][(_0x4f94e2(0x1e7))](_0xf1e3be,_0x4307c4);return _0xbd1e99[_0x4f94e2(0x1fd)]=_0xf1e3be,_0xbd1e99[_0x4f94e2(0x1db)]=_0x4fc825,_0xbd1e99;}function calcBoundingVolume(_0x3560de,_0x38ebe1){const _0x34ac4a=_0x469ad7;if(_0x3560de[_0x34ac4a(0x219)]>-0x1)return calcBoundingVolumeForInstance(_0x3560de);return calcBoundingVolumeForNormal(_0x3560de,_0x38ebe1);}function parseGeodes(_0x2a62f4,_0x2f720b,_0x2742b7,_0x341479,_0x384f21){const _0x363aa6=_0x469ad7;let _0x7df980={},_0xcd8078=_0x341479['geodes'];for(let _0x4ec909=0x0,_0xe0cb1b=_0xcd8078[_0x363aa6(0x215)];_0x4ec909<_0xe0cb1b;_0x4ec909++){let _0x6075cd=_0xcd8078[_0x4ec909],_0x7cac13=_0x6075cd[_0x363aa6(0x1df)],_0x10d651=Cesium[_0x363aa6(0x21c)][_0x363aa6(0x1d4)](_0x2a62f4[_0x363aa6(0x214)],_0x7cac13,new Cesium[(_0x363aa6(0x21c))]()),_0x646f03;Cesium[_0x363aa6(0x209)](_0x384f21[_0x363aa6(0x216)])&&(_0x646f03=new Cesium[(_0x363aa6(0x1e4))](_0x384f21[_0x363aa6(0x216)][_0x363aa6(0x202)][_0x363aa6(0x1fd)],_0x384f21['boundingVolume'][_0x363aa6(0x202)]['radius']),Cesium['BoundingSphere'][_0x363aa6(0x1ee)](_0x646f03,_0x2a62f4[_0x363aa6(0x214)],_0x646f03));let _0x4106a2=_0x6075cd[_0x363aa6(0x1c6)];for(let _0x2a6b06=0x0,_0x2d3914=_0x4106a2[_0x363aa6(0x215)];_0x2a6b06<_0x2d3914;_0x2a6b06++){let _0x43354d=_0x4106a2[_0x2a6b06],_0xe37508=_0x2f720b[_0x363aa6(0x1d0)][_0x43354d],_0x1cb0dc=_0xe37508['vertexPackage'],_0x290db2=_0xe37508[_0x363aa6(0x211)],_0x396e45=_0xe37508[_0x363aa6(0x1e6)],_0x47dcfd;_0x290db2[_0x363aa6(0x215)]>0x0&&(_0x47dcfd=_0x2742b7[_0x290db2[0x0][_0x363aa6(0x1cb)]]);let _0x4c23d4=Cesium[_0x363aa6(0x209)](_0x646f03)?_0x646f03:calcBoundingVolume(_0x1cb0dc,_0x10d651);_0x7df980[_0x43354d]=_0x2fd856[_0x2a62f4[_0x363aa6(0x1f9)]]({'layer':_0x2a62f4,'vertexPackage':_0x1cb0dc,'arrIndexPackage':_0x290db2,'pickInfo':_0x396e45,'modelMatrix':_0x10d651,'geoMatrix':_0x7cac13,'boundingVolume':_0x4c23d4,'material':_0x47dcfd,'edgeGeometry':_0xe37508['edgeGeometry'],'geoName':_0x43354d});}}if(Object[_0x363aa6(0x20d)](_0x7df980)['length']<0x1)return;if(!Cesium[_0x363aa6(0x209)](_0x384f21['boundingVolume'])){let _0x5d5699=[];for(let _0x499f64 in _0x7df980){_0x7df980[_0x363aa6(0x1ff)](_0x499f64)&&_0x5d5699[_0x363aa6(0x1ce)](_0x7df980[_0x499f64][_0x363aa6(0x216)]);}_0x384f21[_0x363aa6(0x216)]={'sphere':Cesium[_0x363aa6(0x1e4)][_0x363aa6(0x1ca)](_0x5d5699)};}_0x384f21[_0x363aa6(0x1da)]=_0x7df980;}function _0x2c10(_0x434de3,_0x2064c4){_0x434de3=_0x434de3-0x1c0;let _0x34d00=_0x34d0[_0x434de3];return _0x34d00;}function parsePagelods(_0x473170,_0x3c8170,_0x2adddf){const _0x5efa4e=_0x469ad7;let _0xf4bf2e=_0x3c8170[_0x5efa4e(0x1c7)],_0x4b55f1=[];for(let _0x39266e=0x0,_0x4058ec=_0xf4bf2e['pageLods'][_0x5efa4e(0x215)];_0x39266e<_0x4058ec;_0x39266e++){let _0x2cdda2={},_0x23ca4f=_0xf4bf2e[_0x5efa4e(0x1ec)][_0x39266e];_0x2cdda2[_0x5efa4e(0x1c3)]=_0x23ca4f[_0x5efa4e(0x1c3)],_0x2cdda2[_0x5efa4e(0x1f5)]=_0x23ca4f[_0x5efa4e(0x1f2)],_0x2cdda2[_0x5efa4e(0x1e9)]=_0x23ca4f[_0x5efa4e(0x1e9)];let _0x5417e7=_0x23ca4f[_0x5efa4e(0x210)][_0x5efa4e(0x1fd)],_0x2b4842=_0x23ca4f[_0x5efa4e(0x210)][_0x5efa4e(0x1db)];_0x2cdda2[_0x5efa4e(0x1f5)]!==''?_0x2cdda2['boundingVolume']={'sphere':{'center':new Cesium[(_0x5efa4e(0x1c1))](_0x5417e7['x'],_0x5417e7['y'],_0x5417e7['z']),'radius':_0x2b4842}}:_0x2cdda2['isLeafTile']=!![],parseGeodes(_0x473170,_0x3c8170,_0x2adddf,_0x23ca4f,_0x2cdda2),Cesium['defined'](_0x2cdda2[_0x5efa4e(0x1da)])&&_0x4b55f1[_0x5efa4e(0x1ce)](_0x2cdda2);}return _0x4b55f1;}S3MContentParser[_0x469ad7(0x206)]=function(_0x37c21e,_0x3ecbbd,_0x9dc8a8){const _0xeef471=_0x469ad7;if(!Cesium[_0xeef471(0x209)](_0x3ecbbd))return;let _0x53a424=parseMaterial(_0x37c21e[_0xeef471(0x1fb)],_0x3ecbbd,_0x9dc8a8),_0x4fdfca=parsePagelods(_0x37c21e,_0x3ecbbd,_0x53a424);return _0x4fdfca;};export default S3MContentParser;