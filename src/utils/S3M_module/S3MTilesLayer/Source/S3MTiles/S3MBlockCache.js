const _0x416f=['1624940ltVvbg','dequeue','61DUSPaL','1trKtyC','37062FExcEM','prototype','1285771SxmKtk','7OfsYMe','contains','_cache','set','_queue','_singleInstance','getSingleInstance','25PMoUUZ','1054391GRUJuD','byteLength','110021mnsvAg','Queue','defined','buffer','get','23967KZWbFU','1mVSqAu','399111VaoPRr'];function _0x1517(_0x9251e,_0x36cdee){_0x9251e=_0x9251e-0x6c;let _0x416fb0=_0x416f[_0x9251e];return _0x416fb0;}const _0x25116c=_0x1517;(function(_0x2df666,_0x51640d){const _0x35ccab=_0x1517;while(!![]){try{const _0x5f5c83=-parseInt(_0x35ccab(0x74))+-parseInt(_0x35ccab(0x76))*-parseInt(_0x35ccab(0x71))+parseInt(_0x35ccab(0x7a))*parseInt(_0x35ccab(0x72))+parseInt(_0x35ccab(0x7b))*-parseInt(_0x35ccab(0x6c))+parseInt(_0x35ccab(0x82))*-parseInt(_0x35ccab(0x78))+parseInt(_0x35ccab(0x77))*parseInt(_0x35ccab(0x73))+parseInt(_0x35ccab(0x83));if(_0x5f5c83===_0x51640d)break;else _0x2df666['push'](_0x2df666['shift']());}catch(_0xbdaa1e){_0x2df666['push'](_0x2df666['shift']());}}}(_0x416f,0xd6c07));function S3MBlockCache(){const _0x33598d=_0x1517;this['_cache']={},this[_0x33598d(0x7f)]=new Cesium[(_0x33598d(0x6d))]();}let _cacheSize=0x0;const _cacheSizeThrottle=0x64*0x400*0x400;S3MBlockCache[_0x25116c(0x79)][_0x25116c(0x7e)]=function(_0x17061b,_0x25129d,_0x107fc2){const _0x437771=_0x25116c;let _0x39f8c0=_0x17061b+'_'+_0x25129d;if(this[_0x437771(0x7d)][_0x39f8c0])return;this[_0x437771(0x7d)][_0x39f8c0]={'id':_0x39f8c0,'buffer':_0x107fc2},this['_queue']['enqueue'](_0x39f8c0),_cacheSize+=_0x107fc2['byteLength'];while(_cacheSize>_cacheSizeThrottle){let _0x598994=this[_0x437771(0x7f)][_0x437771(0x75)](),_0x1a252a=this[_0x437771(0x7d)][_0x598994];_cacheSize-=_0x1a252a[_0x437771(0x6f)][_0x437771(0x84)],delete this[_0x437771(0x7d)][_0x598994];}},S3MBlockCache[_0x25116c(0x79)][_0x25116c(0x70)]=function(_0x41f4b1,_0x51765a){const _0x2d489f=_0x25116c;let _0x2f3470=_0x41f4b1+'_'+_0x51765a,_0x34589f=this['_cache'][_0x2f3470];if(!_0x34589f)return undefined;return _0x34589f[_0x2d489f(0x6f)];},S3MBlockCache[_0x25116c(0x79)][_0x25116c(0x7c)]=function(_0x2e762e,_0x4d45eb){const _0x4cf3c9=_0x25116c;let _0x9e1f8b=_0x2e762e+'_'+_0x4d45eb;return Cesium[_0x4cf3c9(0x6e)](this[_0x4cf3c9(0x7d)][_0x9e1f8b]);},S3MBlockCache['_singleInstance']=undefined,S3MBlockCache[_0x25116c(0x81)]=function(){const _0x58d430=_0x25116c;return!S3MBlockCache[_0x58d430(0x80)]&&(S3MBlockCache[_0x58d430(0x80)]=new S3MBlockCache()),S3MBlockCache[_0x58d430(0x80)];};export default S3MBlockCache;