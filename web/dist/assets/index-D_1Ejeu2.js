(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var ah={exports:{}},Po={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var B0;function jS(){if(B0)return Po;B0=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(s,l,c){var f=null;if(c!==void 0&&(f=""+c),l.key!==void 0&&(f=""+l.key),"key"in l){c={};for(var d in l)d!=="key"&&(c[d]=l[d])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:f,ref:l!==void 0?l:null,props:c}}return Po.Fragment=t,Po.jsx=i,Po.jsxs=i,Po}var I0;function ZS(){return I0||(I0=1,ah.exports=jS()),ah.exports}var Dt=ZS(),sh={exports:{}},me={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var H0;function KS(){if(H0)return me;H0=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),f=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.for("react.activity"),x=Symbol.iterator;function y(O){return O===null||typeof O!="object"?null:(O=x&&O[x]||O["@@iterator"],typeof O=="function"?O:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,M={};function v(O,K,ft){this.props=O,this.context=K,this.refs=M,this.updater=ft||T}v.prototype.isReactComponent={},v.prototype.setState=function(O,K){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,K,"setState")},v.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function P(){}P.prototype=v.prototype;function U(O,K,ft){this.props=O,this.context=K,this.refs=M,this.updater=ft||T}var D=U.prototype=new P;D.constructor=U,C(D,v.prototype),D.isPureReactComponent=!0;var L=Array.isArray;function I(){}var F={H:null,A:null,T:null,S:null},q=Object.prototype.hasOwnProperty;function b(O,K,ft){var Et=ft.ref;return{$$typeof:r,type:O,key:K,ref:Et!==void 0?Et:null,props:ft}}function w(O,K){return b(O.type,K,O.props)}function V(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function nt(O){var K={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(ft){return K[ft]})}var it=/\/+/g;function dt(O,K){return typeof O=="object"&&O!==null&&O.key!=null?nt(""+O.key):K.toString(36)}function rt(O){switch(O.status){case"fulfilled":return O.value;case"rejected":throw O.reason;default:switch(typeof O.status=="string"?O.then(I,I):(O.status="pending",O.then(function(K){O.status==="pending"&&(O.status="fulfilled",O.value=K)},function(K){O.status==="pending"&&(O.status="rejected",O.reason=K)})),O.status){case"fulfilled":return O.value;case"rejected":throw O.reason}}throw O}function B(O,K,ft,Et,Rt){var Q=typeof O;(Q==="undefined"||Q==="boolean")&&(O=null);var ct=!1;if(O===null)ct=!0;else switch(Q){case"bigint":case"string":case"number":ct=!0;break;case"object":switch(O.$$typeof){case r:case t:ct=!0;break;case g:return ct=O._init,B(ct(O._payload),K,ft,Et,Rt)}}if(ct)return Rt=Rt(O),ct=Et===""?"."+dt(O,0):Et,L(Rt)?(ft="",ct!=null&&(ft=ct.replace(it,"$&/")+"/"),B(Rt,K,ft,"",function(qt){return qt})):Rt!=null&&(V(Rt)&&(Rt=w(Rt,ft+(Rt.key==null||O&&O.key===Rt.key?"":(""+Rt.key).replace(it,"$&/")+"/")+ct)),K.push(Rt)),1;ct=0;var Ut=Et===""?".":Et+":";if(L(O))for(var Vt=0;Vt<O.length;Vt++)Et=O[Vt],Q=Ut+dt(Et,Vt),ct+=B(Et,K,ft,Q,Rt);else if(Vt=y(O),typeof Vt=="function")for(O=Vt.call(O),Vt=0;!(Et=O.next()).done;)Et=Et.value,Q=Ut+dt(Et,Vt++),ct+=B(Et,K,ft,Q,Rt);else if(Q==="object"){if(typeof O.then=="function")return B(rt(O),K,ft,Et,Rt);throw K=String(O),Error("Objects are not valid as a React child (found: "+(K==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":K)+"). If you meant to render a collection of children, use an array instead.")}return ct}function H(O,K,ft){if(O==null)return O;var Et=[],Rt=0;return B(O,Et,"","",function(Q){return K.call(ft,Q,Rt++)}),Et}function $(O){if(O._status===-1){var K=O._result;K=K(),K.then(function(ft){(O._status===0||O._status===-1)&&(O._status=1,O._result=ft)},function(ft){(O._status===0||O._status===-1)&&(O._status=2,O._result=ft)}),O._status===-1&&(O._status=0,O._result=K)}if(O._status===1)return O._result.default;throw O._result}var yt=typeof reportError=="function"?reportError:function(O){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var K=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof O=="object"&&O!==null&&typeof O.message=="string"?String(O.message):String(O),error:O});if(!window.dispatchEvent(K))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",O);return}console.error(O)},xt={map:H,forEach:function(O,K,ft){H(O,function(){K.apply(this,arguments)},ft)},count:function(O){var K=0;return H(O,function(){K++}),K},toArray:function(O){return H(O,function(K){return K})||[]},only:function(O){if(!V(O))throw Error("React.Children.only expected to receive a single React element child.");return O}};return me.Activity=_,me.Children=xt,me.Component=v,me.Fragment=i,me.Profiler=l,me.PureComponent=U,me.StrictMode=s,me.Suspense=m,me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,me.__COMPILER_RUNTIME={__proto__:null,c:function(O){return F.H.useMemoCache(O)}},me.cache=function(O){return function(){return O.apply(null,arguments)}},me.cacheSignal=function(){return null},me.cloneElement=function(O,K,ft){if(O==null)throw Error("The argument must be a React element, but you passed "+O+".");var Et=C({},O.props),Rt=O.key;if(K!=null)for(Q in K.key!==void 0&&(Rt=""+K.key),K)!q.call(K,Q)||Q==="key"||Q==="__self"||Q==="__source"||Q==="ref"&&K.ref===void 0||(Et[Q]=K[Q]);var Q=arguments.length-2;if(Q===1)Et.children=ft;else if(1<Q){for(var ct=Array(Q),Ut=0;Ut<Q;Ut++)ct[Ut]=arguments[Ut+2];Et.children=ct}return b(O.type,Rt,Et)},me.createContext=function(O){return O={$$typeof:f,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null},O.Provider=O,O.Consumer={$$typeof:c,_context:O},O},me.createElement=function(O,K,ft){var Et,Rt={},Q=null;if(K!=null)for(Et in K.key!==void 0&&(Q=""+K.key),K)q.call(K,Et)&&Et!=="key"&&Et!=="__self"&&Et!=="__source"&&(Rt[Et]=K[Et]);var ct=arguments.length-2;if(ct===1)Rt.children=ft;else if(1<ct){for(var Ut=Array(ct),Vt=0;Vt<ct;Vt++)Ut[Vt]=arguments[Vt+2];Rt.children=Ut}if(O&&O.defaultProps)for(Et in ct=O.defaultProps,ct)Rt[Et]===void 0&&(Rt[Et]=ct[Et]);return b(O,Q,Rt)},me.createRef=function(){return{current:null}},me.forwardRef=function(O){return{$$typeof:d,render:O}},me.isValidElement=V,me.lazy=function(O){return{$$typeof:g,_payload:{_status:-1,_result:O},_init:$}},me.memo=function(O,K){return{$$typeof:p,type:O,compare:K===void 0?null:K}},me.startTransition=function(O){var K=F.T,ft={};F.T=ft;try{var Et=O(),Rt=F.S;Rt!==null&&Rt(ft,Et),typeof Et=="object"&&Et!==null&&typeof Et.then=="function"&&Et.then(I,yt)}catch(Q){yt(Q)}finally{K!==null&&ft.types!==null&&(K.types=ft.types),F.T=K}},me.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},me.use=function(O){return F.H.use(O)},me.useActionState=function(O,K,ft){return F.H.useActionState(O,K,ft)},me.useCallback=function(O,K){return F.H.useCallback(O,K)},me.useContext=function(O){return F.H.useContext(O)},me.useDebugValue=function(){},me.useDeferredValue=function(O,K){return F.H.useDeferredValue(O,K)},me.useEffect=function(O,K){return F.H.useEffect(O,K)},me.useEffectEvent=function(O){return F.H.useEffectEvent(O)},me.useId=function(){return F.H.useId()},me.useImperativeHandle=function(O,K,ft){return F.H.useImperativeHandle(O,K,ft)},me.useInsertionEffect=function(O,K){return F.H.useInsertionEffect(O,K)},me.useLayoutEffect=function(O,K){return F.H.useLayoutEffect(O,K)},me.useMemo=function(O,K){return F.H.useMemo(O,K)},me.useOptimistic=function(O,K){return F.H.useOptimistic(O,K)},me.useReducer=function(O,K,ft){return F.H.useReducer(O,K,ft)},me.useRef=function(O){return F.H.useRef(O)},me.useState=function(O){return F.H.useState(O)},me.useSyncExternalStore=function(O,K,ft){return F.H.useSyncExternalStore(O,K,ft)},me.useTransition=function(){return F.H.useTransition()},me.version="19.2.4",me}var G0;function Vd(){return G0||(G0=1,sh.exports=KS()),sh.exports}var ee=Vd(),rh={exports:{}},zo={},oh={exports:{}},lh={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var V0;function JS(){return V0||(V0=1,(function(r){function t(B,H){var $=B.length;B.push(H);t:for(;0<$;){var yt=$-1>>>1,xt=B[yt];if(0<l(xt,H))B[yt]=H,B[$]=xt,$=yt;else break t}}function i(B){return B.length===0?null:B[0]}function s(B){if(B.length===0)return null;var H=B[0],$=B.pop();if($!==H){B[0]=$;t:for(var yt=0,xt=B.length,O=xt>>>1;yt<O;){var K=2*(yt+1)-1,ft=B[K],Et=K+1,Rt=B[Et];if(0>l(ft,$))Et<xt&&0>l(Rt,ft)?(B[yt]=Rt,B[Et]=$,yt=Et):(B[yt]=ft,B[K]=$,yt=K);else if(Et<xt&&0>l(Rt,$))B[yt]=Rt,B[Et]=$,yt=Et;else break t}}return H}function l(B,H){var $=B.sortIndex-H.sortIndex;return $!==0?$:B.id-H.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var f=Date,d=f.now();r.unstable_now=function(){return f.now()-d}}var m=[],p=[],g=1,_=null,x=3,y=!1,T=!1,C=!1,M=!1,v=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,U=typeof setImmediate<"u"?setImmediate:null;function D(B){for(var H=i(p);H!==null;){if(H.callback===null)s(p);else if(H.startTime<=B)s(p),H.sortIndex=H.expirationTime,t(m,H);else break;H=i(p)}}function L(B){if(C=!1,D(B),!T)if(i(m)!==null)T=!0,I||(I=!0,nt());else{var H=i(p);H!==null&&rt(L,H.startTime-B)}}var I=!1,F=-1,q=5,b=-1;function w(){return M?!0:!(r.unstable_now()-b<q)}function V(){if(M=!1,I){var B=r.unstable_now();b=B;var H=!0;try{t:{T=!1,C&&(C=!1,P(F),F=-1),y=!0;var $=x;try{e:{for(D(B),_=i(m);_!==null&&!(_.expirationTime>B&&w());){var yt=_.callback;if(typeof yt=="function"){_.callback=null,x=_.priorityLevel;var xt=yt(_.expirationTime<=B);if(B=r.unstable_now(),typeof xt=="function"){_.callback=xt,D(B),H=!0;break e}_===i(m)&&s(m),D(B)}else s(m);_=i(m)}if(_!==null)H=!0;else{var O=i(p);O!==null&&rt(L,O.startTime-B),H=!1}}break t}finally{_=null,x=$,y=!1}H=void 0}}finally{H?nt():I=!1}}}var nt;if(typeof U=="function")nt=function(){U(V)};else if(typeof MessageChannel<"u"){var it=new MessageChannel,dt=it.port2;it.port1.onmessage=V,nt=function(){dt.postMessage(null)}}else nt=function(){v(V,0)};function rt(B,H){F=v(function(){B(r.unstable_now())},H)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(B){B.callback=null},r.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<B?Math.floor(1e3/B):5},r.unstable_getCurrentPriorityLevel=function(){return x},r.unstable_next=function(B){switch(x){case 1:case 2:case 3:var H=3;break;default:H=x}var $=x;x=H;try{return B()}finally{x=$}},r.unstable_requestPaint=function(){M=!0},r.unstable_runWithPriority=function(B,H){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var $=x;x=B;try{return H()}finally{x=$}},r.unstable_scheduleCallback=function(B,H,$){var yt=r.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?yt+$:yt):$=yt,B){case 1:var xt=-1;break;case 2:xt=250;break;case 5:xt=1073741823;break;case 4:xt=1e4;break;default:xt=5e3}return xt=$+xt,B={id:g++,callback:H,priorityLevel:B,startTime:$,expirationTime:xt,sortIndex:-1},$>yt?(B.sortIndex=$,t(p,B),i(m)===null&&B===i(p)&&(C?(P(F),F=-1):C=!0,rt(L,$-yt))):(B.sortIndex=xt,t(m,B),T||y||(T=!0,I||(I=!0,nt()))),B},r.unstable_shouldYield=w,r.unstable_wrapCallback=function(B){var H=x;return function(){var $=x;x=H;try{return B.apply(this,arguments)}finally{x=$}}}})(lh)),lh}var k0;function QS(){return k0||(k0=1,oh.exports=JS()),oh.exports}var ch={exports:{}},Nn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X0;function $S(){if(X0)return Nn;X0=1;var r=Vd();function t(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)p+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,p,g){var _=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:_==null?null:""+_,children:m,containerInfo:p,implementation:g}}var f=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Nn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Nn.createPortal=function(m,p){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(t(299));return c(m,p,null,g)},Nn.flushSync=function(m){var p=f.T,g=s.p;try{if(f.T=null,s.p=2,m)return m()}finally{f.T=p,s.p=g,s.d.f()}},Nn.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(m,p))},Nn.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Nn.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var g=p.as,_=d(g,p.crossOrigin),x=typeof p.integrity=="string"?p.integrity:void 0,y=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;g==="style"?s.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:_,integrity:x,fetchPriority:y}):g==="script"&&s.d.X(m,{crossOrigin:_,integrity:x,fetchPriority:y,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Nn.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var g=d(p.as,p.crossOrigin);s.d.M(m,{crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(m)},Nn.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var g=p.as,_=d(g,p.crossOrigin);s.d.L(m,g,{crossOrigin:_,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Nn.preloadModule=function(m,p){if(typeof m=="string")if(p){var g=d(p.as,p.crossOrigin);s.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(m)},Nn.requestFormReset=function(m){s.d.r(m)},Nn.unstable_batchedUpdates=function(m,p){return m(p)},Nn.useFormState=function(m,p,g){return f.H.useFormState(m,p,g)},Nn.useFormStatus=function(){return f.H.useHostTransitionStatus()},Nn.version="19.2.4",Nn}var W0;function ty(){if(W0)return ch.exports;W0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),ch.exports=$S(),ch.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var q0;function ey(){if(q0)return zo;q0=1;var r=QS(),t=Vd(),i=ty();function s(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function f(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(c(e)!==e)throw Error(s(188))}function p(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(s(188));return n!==e?null:e}for(var a=e,o=n;;){var u=a.return;if(u===null)break;var h=u.alternate;if(h===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===h.child){for(h=u.child;h;){if(h===a)return m(u),e;if(h===o)return m(u),n;h=h.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=h;else{for(var S=!1,A=u.child;A;){if(A===a){S=!0,a=u,o=h;break}if(A===o){S=!0,o=u,a=h;break}A=A.sibling}if(!S){for(A=h.child;A;){if(A===a){S=!0,a=h,o=u;break}if(A===o){S=!0,o=h,a=u;break}A=A.sibling}if(!S)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:n}function g(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=g(e),n!==null)return n;e=e.sibling}return null}var _=Object.assign,x=Symbol.for("react.element"),y=Symbol.for("react.transitional.element"),T=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),M=Symbol.for("react.strict_mode"),v=Symbol.for("react.profiler"),P=Symbol.for("react.consumer"),U=Symbol.for("react.context"),D=Symbol.for("react.forward_ref"),L=Symbol.for("react.suspense"),I=Symbol.for("react.suspense_list"),F=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),b=Symbol.for("react.activity"),w=Symbol.for("react.memo_cache_sentinel"),V=Symbol.iterator;function nt(e){return e===null||typeof e!="object"?null:(e=V&&e[V]||e["@@iterator"],typeof e=="function"?e:null)}var it=Symbol.for("react.client.reference");function dt(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===it?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case C:return"Fragment";case v:return"Profiler";case M:return"StrictMode";case L:return"Suspense";case I:return"SuspenseList";case b:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case T:return"Portal";case U:return e.displayName||"Context";case P:return(e._context.displayName||"Context")+".Consumer";case D:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case F:return n=e.displayName||null,n!==null?n:dt(e.type)||"Memo";case q:n=e._payload,e=e._init;try{return dt(e(n))}catch{}}return null}var rt=Array.isArray,B=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,$={pending:!1,data:null,method:null,action:null},yt=[],xt=-1;function O(e){return{current:e}}function K(e){0>xt||(e.current=yt[xt],yt[xt]=null,xt--)}function ft(e,n){xt++,yt[xt]=e.current,e.current=n}var Et=O(null),Rt=O(null),Q=O(null),ct=O(null);function Ut(e,n){switch(ft(Q,n),ft(Rt,e),ft(Et,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?o0(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=o0(n),e=l0(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}K(Et),ft(Et,e)}function Vt(){K(Et),K(Rt),K(Q)}function qt(e){e.memoizedState!==null&&ft(ct,e);var n=Et.current,a=l0(n,e.type);n!==a&&(ft(Rt,e),ft(Et,a))}function ye(e){Rt.current===e&&(K(Et),K(Rt)),ct.current===e&&(K(ct),Uo._currentValue=$)}var Ue,fe;function gt(e){if(Ue===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Ue=n&&n[1]||"",fe=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ue+e+fe}var At=!1;function Mt(e,n){if(!e||At)return"";At=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var _t=function(){throw Error()};if(Object.defineProperty(_t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(_t,[])}catch(lt){var st=lt}Reflect.construct(e,[],_t)}else{try{_t.call()}catch(lt){st=lt}e.call(_t.prototype)}}else{try{throw Error()}catch(lt){st=lt}(_t=e())&&typeof _t.catch=="function"&&_t.catch(function(){})}}catch(lt){if(lt&&st&&typeof lt.stack=="string")return[lt.stack,st.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var h=o.DetermineComponentFrameRoot(),S=h[0],A=h[1];if(S&&A){var G=S.split(`
`),et=A.split(`
`);for(u=o=0;o<G.length&&!G[o].includes("DetermineComponentFrameRoot");)o++;for(;u<et.length&&!et[u].includes("DetermineComponentFrameRoot");)u++;if(o===G.length||u===et.length)for(o=G.length-1,u=et.length-1;1<=o&&0<=u&&G[o]!==et[u];)u--;for(;1<=o&&0<=u;o--,u--)if(G[o]!==et[u]){if(o!==1||u!==1)do if(o--,u--,0>u||G[o]!==et[u]){var pt=`
`+G[o].replace(" at new "," at ");return e.displayName&&pt.includes("<anonymous>")&&(pt=pt.replace("<anonymous>",e.displayName)),pt}while(1<=o&&0<=u);break}}}finally{At=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?gt(a):""}function Bt(e,n){switch(e.tag){case 26:case 27:case 5:return gt(e.type);case 16:return gt("Lazy");case 13:return e.child!==n&&n!==null?gt("Suspense Fallback"):gt("Suspense");case 19:return gt("SuspenseList");case 0:case 15:return Mt(e.type,!1);case 11:return Mt(e.type.render,!1);case 1:return Mt(e.type,!0);case 31:return gt("Activity");default:return""}}function z(e){try{var n="",a=null;do n+=Bt(e,a),a=e,e=e.return;while(e);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var ie=Object.prototype.hasOwnProperty,Gt=r.unstable_scheduleCallback,se=r.unstable_cancelCallback,Nt=r.unstable_shouldYield,N=r.unstable_requestPaint,E=r.unstable_now,W=r.unstable_getCurrentPriorityLevel,ut=r.unstable_ImmediatePriority,St=r.unstable_UserBlockingPriority,ht=r.unstable_NormalPriority,Qt=r.unstable_LowPriority,Ot=r.unstable_IdlePriority,Jt=r.log,le=r.unstable_setDisableYieldValue,Tt=null,Ct=null;function Yt(e){if(typeof Jt=="function"&&le(e),Ct&&typeof Ct.setStrictMode=="function")try{Ct.setStrictMode(Tt,e)}catch{}}var kt=Math.clz32?Math.clz32:X,Pt=Math.log,_e=Math.LN2;function X(e){return e>>>=0,e===0?32:31-(Pt(e)/_e|0)|0}var Ft=256,wt=262144,Xt=4194304;function bt(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function vt(e,n,a){var o=e.pendingLanes;if(o===0)return 0;var u=0,h=e.suspendedLanes,S=e.pingedLanes;e=e.warmLanes;var A=o&134217727;return A!==0?(o=A&~h,o!==0?u=bt(o):(S&=A,S!==0?u=bt(S):a||(a=A&~e,a!==0&&(u=bt(a))))):(A=o&~h,A!==0?u=bt(A):S!==0?u=bt(S):a||(a=o&~e,a!==0&&(u=bt(a)))),u===0?0:n!==0&&n!==u&&(n&h)===0&&(h=u&-u,a=n&-n,h>=a||h===32&&(a&4194048)!==0)?n:u}function Lt(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function he(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ie(){var e=Xt;return Xt<<=1,(Xt&62914560)===0&&(Xt=4194304),e}function Ce(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function Un(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gi(e,n,a,o,u,h){var S=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var A=e.entanglements,G=e.expirationTimes,et=e.hiddenUpdates;for(a=S&~a;0<a;){var pt=31-kt(a),_t=1<<pt;A[pt]=0,G[pt]=-1;var st=et[pt];if(st!==null)for(et[pt]=null,pt=0;pt<st.length;pt++){var lt=st[pt];lt!==null&&(lt.lane&=-536870913)}a&=~_t}o!==0&&ol(e,o,0),h!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=h&~(S&~n))}function ol(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var o=31-kt(n);e.entangledLanes|=n,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function Vr(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var o=31-kt(a),u=1<<o;u&n|e[o]&n&&(e[o]|=n),a&=~u}}function Ls(e,n){var a=n&-n;return a=(a&42)!==0?1:kr(a),(a&(e.suspendedLanes|n))!==0?0:a}function kr(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Os(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Xr(){var e=H.p;return e!==0?e:(e=window.event,e===void 0?32:U0(e.type))}function wi(e,n){var a=H.p;try{return H.p=e,n()}finally{H.p=a}}var ai=Math.random().toString(36).slice(2),on="__reactFiber$"+ai,Sn="__reactProps$"+ai,_i="__reactContainer$"+ai,Ps="__reactEvents$"+ai,zs="__reactListeners$"+ai,ll="__reactHandles$"+ai,Wr="__reactResources$"+ai,ns="__reactMarker$"+ai;function qr(e){delete e[on],delete e[Sn],delete e[Ps],delete e[zs],delete e[ll]}function ya(e){var n=e[on];if(n)return n;for(var a=e.parentNode;a;){if(n=a[_i]||a[on]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=m0(e);e!==null;){if(a=e[on])return a;e=m0(e)}return n}e=a,a=e.parentNode}return null}function Ma(e){if(e=e[on]||e[_i]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function is(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(s(33))}function Ea(e){var n=e[Wr];return n||(n=e[Wr]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function R(e){e[ns]=!0}var Y=new Set,ot={};function at(e,n){J(e,n),J(e+"Capture",n)}function J(e,n){for(ot[e]=n,e=0;e<n.length;e++)Y.add(n[e])}var zt=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),jt={},It={};function Zt(e){return ie.call(It,e)?!0:ie.call(jt,e)?!1:zt.test(e)?It[e]=!0:(jt[e]=!0,!1)}function $t(e,n,a){if(Zt(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function oe(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function te(e,n,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+o)}}function ce(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Oe(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Je(e,n,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,h=o.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(S){a=""+S,h.call(this,S)}}),Object.defineProperty(e,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(S){a=""+S},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function je(e){if(!e._valueTracker){var n=Oe(e)?"checked":"value";e._valueTracker=Je(e,n,""+e[n])}}function Be(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return e&&(o=Oe(e)?e.checked?"true":"false":e.value),e=o,e!==a?(n.setValue(e),!0):!1}function ae(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Pe=/[\n"\\]/g;function de(e){return e.replace(Pe,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function yn(e,n,a,o,u,h,S,A){e.name="",S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"?e.type=S:e.removeAttribute("type"),n!=null?S==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+ce(n)):e.value!==""+ce(n)&&(e.value=""+ce(n)):S!=="submit"&&S!=="reset"||e.removeAttribute("value"),n!=null?Mn(e,S,ce(n)):a!=null?Mn(e,S,ce(a)):o!=null&&e.removeAttribute("value"),u==null&&h!=null&&(e.defaultChecked=!!h),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?e.name=""+ce(A):e.removeAttribute("name")}function qi(e,n,a,o,u,h,S,A){if(h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"&&(e.type=h),n!=null||a!=null){if(!(h!=="submit"&&h!=="reset"||n!=null)){je(e);return}a=a!=null?""+ce(a):"",n=n!=null?""+ce(n):a,A||n===e.value||(e.value=n),e.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=A?e.checked:!!o,e.defaultChecked=!!o,S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"&&(e.name=S),je(e)}function Mn(e,n,a){n==="number"&&ae(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function si(e,n,a,o){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&o&&(e[a].defaultSelected=!0)}else{for(a=""+ce(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,o&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function He(e,n,a){if(n!=null&&(n=""+ce(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+ce(a):""}function En(e,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(rt(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=ce(n),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),je(e)}function dn(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var Tn=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bn(e,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":o?e.setProperty(n,a):typeof a!="number"||a===0||Tn.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Fs(e,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&bn(e,u,o)}else for(var h in n)n.hasOwnProperty(h)&&bn(e,h,n[h])}function vi(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Xv=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Wv=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cl(e){return Wv.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Yi(){}var tu=null;function eu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Bs=null,Is=null;function rp(e){var n=Ma(e);if(n&&(e=n.stateNode)){var a=e[Sn]||null;t:switch(e=n.stateNode,n.type){case"input":if(yn(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+de(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==e&&o.form===e.form){var u=o[Sn]||null;if(!u)throw Error(s(90));yn(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===e.form&&Be(o)}break t;case"textarea":He(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&si(e,!!a.multiple,n,!1)}}}var nu=!1;function op(e,n,a){if(nu)return e(n,a);nu=!0;try{var o=e(n);return o}finally{if(nu=!1,(Bs!==null||Is!==null)&&(Kl(),Bs&&(n=Bs,e=Is,Is=Bs=null,rp(n),e)))for(n=0;n<e.length;n++)rp(e[n])}}function Yr(e,n){var a=e.stateNode;if(a===null)return null;var o=a[Sn]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var ji=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),iu=!1;if(ji)try{var jr={};Object.defineProperty(jr,"passive",{get:function(){iu=!0}}),window.addEventListener("test",jr,jr),window.removeEventListener("test",jr,jr)}catch{iu=!1}var Ta=null,au=null,ul=null;function lp(){if(ul)return ul;var e,n=au,a=n.length,o,u="value"in Ta?Ta.value:Ta.textContent,h=u.length;for(e=0;e<a&&n[e]===u[e];e++);var S=a-e;for(o=1;o<=S&&n[a-o]===u[h-o];o++);return ul=u.slice(e,1<o?1-o:void 0)}function fl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function hl(){return!0}function cp(){return!1}function In(e){function n(a,o,u,h,S){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=h,this.target=S,this.currentTarget=null;for(var A in e)e.hasOwnProperty(A)&&(a=e[A],this[A]=a?a(h):h[A]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?hl:cp,this.isPropagationStopped=cp,this}return _(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=hl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=hl)},persist:function(){},isPersistent:hl}),n}var as={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},dl=In(as),Zr=_({},as,{view:0,detail:0}),qv=In(Zr),su,ru,Kr,pl=_({},Zr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Kr&&(Kr&&e.type==="mousemove"?(su=e.screenX-Kr.screenX,ru=e.screenY-Kr.screenY):ru=su=0,Kr=e),su)},movementY:function(e){return"movementY"in e?e.movementY:ru}}),up=In(pl),Yv=_({},pl,{dataTransfer:0}),jv=In(Yv),Zv=_({},Zr,{relatedTarget:0}),ou=In(Zv),Kv=_({},as,{animationName:0,elapsedTime:0,pseudoElement:0}),Jv=In(Kv),Qv=_({},as,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),$v=In(Qv),tx=_({},as,{data:0}),fp=In(tx),ex={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ix={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ax(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=ix[e])?!!n[e]:!1}function lu(){return ax}var sx=_({},Zr,{key:function(e){if(e.key){var n=ex[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=fl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?nx[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lu,charCode:function(e){return e.type==="keypress"?fl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?fl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),rx=In(sx),ox=_({},pl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hp=In(ox),lx=_({},Zr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lu}),cx=In(lx),ux=_({},as,{propertyName:0,elapsedTime:0,pseudoElement:0}),fx=In(ux),hx=_({},pl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),dx=In(hx),px=_({},as,{newState:0,oldState:0}),mx=In(px),gx=[9,13,27,32],cu=ji&&"CompositionEvent"in window,Jr=null;ji&&"documentMode"in document&&(Jr=document.documentMode);var _x=ji&&"TextEvent"in window&&!Jr,dp=ji&&(!cu||Jr&&8<Jr&&11>=Jr),pp=" ",mp=!1;function gp(e,n){switch(e){case"keyup":return gx.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _p(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Hs=!1;function vx(e,n){switch(e){case"compositionend":return _p(n);case"keypress":return n.which!==32?null:(mp=!0,pp);case"textInput":return e=n.data,e===pp&&mp?null:e;default:return null}}function xx(e,n){if(Hs)return e==="compositionend"||!cu&&gp(e,n)?(e=lp(),ul=au=Ta=null,Hs=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return dp&&n.locale!=="ko"?null:n.data;default:return null}}var Sx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function vp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Sx[e.type]:n==="textarea"}function xp(e,n,a,o){Bs?Is?Is.push(o):Is=[o]:Bs=o,n=ic(n,"onChange"),0<n.length&&(a=new dl("onChange","change",null,a,o),e.push({event:a,listeners:n}))}var Qr=null,$r=null;function yx(e){e0(e,0)}function ml(e){var n=is(e);if(Be(n))return e}function Sp(e,n){if(e==="change")return n}var yp=!1;if(ji){var uu;if(ji){var fu="oninput"in document;if(!fu){var Mp=document.createElement("div");Mp.setAttribute("oninput","return;"),fu=typeof Mp.oninput=="function"}uu=fu}else uu=!1;yp=uu&&(!document.documentMode||9<document.documentMode)}function Ep(){Qr&&(Qr.detachEvent("onpropertychange",Tp),$r=Qr=null)}function Tp(e){if(e.propertyName==="value"&&ml($r)){var n=[];xp(n,$r,e,eu(e)),op(yx,n)}}function Mx(e,n,a){e==="focusin"?(Ep(),Qr=n,$r=a,Qr.attachEvent("onpropertychange",Tp)):e==="focusout"&&Ep()}function Ex(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ml($r)}function Tx(e,n){if(e==="click")return ml(n)}function bx(e,n){if(e==="input"||e==="change")return ml(n)}function Ax(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Yn=typeof Object.is=="function"?Object.is:Ax;function to(e,n){if(Yn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!ie.call(n,u)||!Yn(e[u],n[u]))return!1}return!0}function bp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ap(e,n){var a=bp(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=n&&o>=n)return{node:a,offset:n-e};e=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=bp(a)}}function Rp(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Rp(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Cp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=ae(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=ae(e.document)}return n}function hu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var Rx=ji&&"documentMode"in document&&11>=document.documentMode,Gs=null,du=null,eo=null,pu=!1;function wp(e,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;pu||Gs==null||Gs!==ae(o)||(o=Gs,"selectionStart"in o&&hu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),eo&&to(eo,o)||(eo=o,o=ic(du,"onSelect"),0<o.length&&(n=new dl("onSelect","select",null,n,a),e.push({event:n,listeners:o}),n.target=Gs)))}function ss(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var Vs={animationend:ss("Animation","AnimationEnd"),animationiteration:ss("Animation","AnimationIteration"),animationstart:ss("Animation","AnimationStart"),transitionrun:ss("Transition","TransitionRun"),transitionstart:ss("Transition","TransitionStart"),transitioncancel:ss("Transition","TransitionCancel"),transitionend:ss("Transition","TransitionEnd")},mu={},Dp={};ji&&(Dp=document.createElement("div").style,"AnimationEvent"in window||(delete Vs.animationend.animation,delete Vs.animationiteration.animation,delete Vs.animationstart.animation),"TransitionEvent"in window||delete Vs.transitionend.transition);function rs(e){if(mu[e])return mu[e];if(!Vs[e])return e;var n=Vs[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in Dp)return mu[e]=n[a];return e}var Up=rs("animationend"),Np=rs("animationiteration"),Lp=rs("animationstart"),Cx=rs("transitionrun"),wx=rs("transitionstart"),Dx=rs("transitioncancel"),Op=rs("transitionend"),Pp=new Map,gu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");gu.push("scrollEnd");function xi(e,n){Pp.set(e,n),at(n,[e])}var gl=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ri=[],ks=0,_u=0;function _l(){for(var e=ks,n=_u=ks=0;n<e;){var a=ri[n];ri[n++]=null;var o=ri[n];ri[n++]=null;var u=ri[n];ri[n++]=null;var h=ri[n];if(ri[n++]=null,o!==null&&u!==null){var S=o.pending;S===null?u.next=u:(u.next=S.next,S.next=u),o.pending=u}h!==0&&zp(a,u,h)}}function vl(e,n,a,o){ri[ks++]=e,ri[ks++]=n,ri[ks++]=a,ri[ks++]=o,_u|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function vu(e,n,a,o){return vl(e,n,a,o),xl(e)}function os(e,n){return vl(e,null,null,n),xl(e)}function zp(e,n,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var u=!1,h=e.return;h!==null;)h.childLanes|=a,o=h.alternate,o!==null&&(o.childLanes|=a),h.tag===22&&(e=h.stateNode,e===null||e._visibility&1||(u=!0)),e=h,h=h.return;return e.tag===3?(h=e.stateNode,u&&n!==null&&(u=31-kt(a),e=h.hiddenUpdates,o=e[u],o===null?e[u]=[n]:o.push(n),n.lane=a|536870912),h):null}function xl(e){if(50<To)throw To=0,Cf=null,Error(s(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Xs={};function Ux(e,n,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(e,n,a,o){return new Ux(e,n,a,o)}function xu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Zi(e,n){var a=e.alternate;return a===null?(a=jn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Fp(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function Sl(e,n,a,o,u,h){var S=0;if(o=e,typeof e=="function")xu(e)&&(S=1);else if(typeof e=="string")S=zS(e,a,Et.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case b:return e=jn(31,a,n,u),e.elementType=b,e.lanes=h,e;case C:return ls(a.children,u,h,n);case M:S=8,u|=24;break;case v:return e=jn(12,a,n,u|2),e.elementType=v,e.lanes=h,e;case L:return e=jn(13,a,n,u),e.elementType=L,e.lanes=h,e;case I:return e=jn(19,a,n,u),e.elementType=I,e.lanes=h,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case U:S=10;break t;case P:S=9;break t;case D:S=11;break t;case F:S=14;break t;case q:S=16,o=null;break t}S=29,a=Error(s(130,e===null?"null":typeof e,"")),o=null}return n=jn(S,a,n,u),n.elementType=e,n.type=o,n.lanes=h,n}function ls(e,n,a,o){return e=jn(7,e,o,n),e.lanes=a,e}function Su(e,n,a){return e=jn(6,e,null,n),e.lanes=a,e}function Bp(e){var n=jn(18,null,null,0);return n.stateNode=e,n}function yu(e,n,a){return n=jn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Ip=new WeakMap;function oi(e,n){if(typeof e=="object"&&e!==null){var a=Ip.get(e);return a!==void 0?a:(n={value:e,source:n,stack:z(n)},Ip.set(e,n),n)}return{value:e,source:n,stack:z(n)}}var Ws=[],qs=0,yl=null,no=0,li=[],ci=0,ba=null,Di=1,Ui="";function Ki(e,n){Ws[qs++]=no,Ws[qs++]=yl,yl=e,no=n}function Hp(e,n,a){li[ci++]=Di,li[ci++]=Ui,li[ci++]=ba,ba=e;var o=Di;e=Ui;var u=32-kt(o)-1;o&=~(1<<u),a+=1;var h=32-kt(n)+u;if(30<h){var S=u-u%5;h=(o&(1<<S)-1).toString(32),o>>=S,u-=S,Di=1<<32-kt(n)+u|a<<u|o,Ui=h+e}else Di=1<<h|a<<u|o,Ui=e}function Mu(e){e.return!==null&&(Ki(e,1),Hp(e,1,0))}function Eu(e){for(;e===yl;)yl=Ws[--qs],Ws[qs]=null,no=Ws[--qs],Ws[qs]=null;for(;e===ba;)ba=li[--ci],li[ci]=null,Ui=li[--ci],li[ci]=null,Di=li[--ci],li[ci]=null}function Gp(e,n){li[ci++]=Di,li[ci++]=Ui,li[ci++]=ba,Di=n.id,Ui=n.overflow,ba=e}var An=null,Ze=null,Re=!1,Aa=null,ui=!1,Tu=Error(s(519));function Ra(e){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw io(oi(n,e)),Tu}function Vp(e){var n=e.stateNode,a=e.type,o=e.memoizedProps;switch(n[on]=e,n[Sn]=o,a){case"dialog":Ee("cancel",n),Ee("close",n);break;case"iframe":case"object":case"embed":Ee("load",n);break;case"video":case"audio":for(a=0;a<Ao.length;a++)Ee(Ao[a],n);break;case"source":Ee("error",n);break;case"img":case"image":case"link":Ee("error",n),Ee("load",n);break;case"details":Ee("toggle",n);break;case"input":Ee("invalid",n),qi(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":Ee("invalid",n);break;case"textarea":Ee("invalid",n),En(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||s0(n.textContent,a)?(o.popover!=null&&(Ee("beforetoggle",n),Ee("toggle",n)),o.onScroll!=null&&Ee("scroll",n),o.onScrollEnd!=null&&Ee("scrollend",n),o.onClick!=null&&(n.onclick=Yi),n=!0):n=!1,n||Ra(e,!0)}function kp(e){for(An=e.return;An;)switch(An.tag){case 5:case 31:case 13:ui=!1;return;case 27:case 3:ui=!0;return;default:An=An.return}}function Ys(e){if(e!==An)return!1;if(!Re)return kp(e),Re=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||kf(e.type,e.memoizedProps)),a=!a),a&&Ze&&Ra(e),kp(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=p0(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=p0(e)}else n===27?(n=Ze,Ga(e.type)?(e=jf,jf=null,Ze=e):Ze=n):Ze=An?hi(e.stateNode.nextSibling):null;return!0}function cs(){Ze=An=null,Re=!1}function bu(){var e=Aa;return e!==null&&(kn===null?kn=e:kn.push.apply(kn,e),Aa=null),e}function io(e){Aa===null?Aa=[e]:Aa.push(e)}var Au=O(null),us=null,Ji=null;function Ca(e,n,a){ft(Au,n._currentValue),n._currentValue=a}function Qi(e){e._currentValue=Au.current,K(Au)}function Ru(e,n,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),e===a)break;e=e.return}}function Cu(e,n,a,o){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var h=u.dependencies;if(h!==null){var S=u.child;h=h.firstContext;t:for(;h!==null;){var A=h;h=u;for(var G=0;G<n.length;G++)if(A.context===n[G]){h.lanes|=a,A=h.alternate,A!==null&&(A.lanes|=a),Ru(h.return,a,e),o||(S=null);break t}h=A.next}}else if(u.tag===18){if(S=u.return,S===null)throw Error(s(341));S.lanes|=a,h=S.alternate,h!==null&&(h.lanes|=a),Ru(S,a,e),S=null}else S=u.child;if(S!==null)S.return=u;else for(S=u;S!==null;){if(S===e){S=null;break}if(u=S.sibling,u!==null){u.return=S.return,S=u;break}S=S.return}u=S}}function js(e,n,a,o){e=null;for(var u=n,h=!1;u!==null;){if(!h){if((u.flags&524288)!==0)h=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var S=u.alternate;if(S===null)throw Error(s(387));if(S=S.memoizedProps,S!==null){var A=u.type;Yn(u.pendingProps.value,S.value)||(e!==null?e.push(A):e=[A])}}else if(u===ct.current){if(S=u.alternate,S===null)throw Error(s(387));S.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Uo):e=[Uo])}u=u.return}e!==null&&Cu(n,e,a,o),n.flags|=262144}function Ml(e){for(e=e.firstContext;e!==null;){if(!Yn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function fs(e){us=e,Ji=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Rn(e){return Xp(us,e)}function El(e,n){return us===null&&fs(e),Xp(e,n)}function Xp(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Ji===null){if(e===null)throw Error(s(308));Ji=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Ji=Ji.next=n;return a}var Nx=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},Lx=r.unstable_scheduleCallback,Ox=r.unstable_NormalPriority,ln={$$typeof:U,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function wu(){return{controller:new Nx,data:new Map,refCount:0}}function ao(e){e.refCount--,e.refCount===0&&Lx(Ox,function(){e.controller.abort()})}var so=null,Du=0,Zs=0,Ks=null;function Px(e,n){if(so===null){var a=so=[];Du=0,Zs=Of(),Ks={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Du++,n.then(Wp,Wp),n}function Wp(){if(--Du===0&&so!==null){Ks!==null&&(Ks.status="fulfilled");var e=so;so=null,Zs=0,Ks=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function zx(e,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var qp=B.S;B.S=function(e,n){wg=E(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&Px(e,n),qp!==null&&qp(e,n)};var hs=O(null);function Uu(){var e=hs.current;return e!==null?e:Ye.pooledCache}function Tl(e,n){n===null?ft(hs,hs.current):ft(hs,n.pool)}function Yp(){var e=Uu();return e===null?null:{parent:ln._currentValue,pool:e}}var Js=Error(s(460)),Nu=Error(s(474)),bl=Error(s(542)),Al={then:function(){}};function jp(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Zp(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Yi,Yi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Jp(e),e;default:if(typeof n.status=="string")n.then(Yi,Yi);else{if(e=Ye,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=n,e.status="pending",e.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Jp(e),e}throw ps=n,Js}}function ds(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ps=a,Js):a}}var ps=null;function Kp(){if(ps===null)throw Error(s(459));var e=ps;return ps=null,e}function Jp(e){if(e===Js||e===bl)throw Error(s(483))}var Qs=null,ro=0;function Rl(e){var n=ro;return ro+=1,Qs===null&&(Qs=[]),Zp(Qs,e,n)}function oo(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function Cl(e,n){throw n.$$typeof===x?Error(s(525)):(e=Object.prototype.toString.call(n),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Qp(e){function n(j,k){if(e){var tt=j.deletions;tt===null?(j.deletions=[k],j.flags|=16):tt.push(k)}}function a(j,k){if(!e)return null;for(;k!==null;)n(j,k),k=k.sibling;return null}function o(j){for(var k=new Map;j!==null;)j.key!==null?k.set(j.key,j):k.set(j.index,j),j=j.sibling;return k}function u(j,k){return j=Zi(j,k),j.index=0,j.sibling=null,j}function h(j,k,tt){return j.index=tt,e?(tt=j.alternate,tt!==null?(tt=tt.index,tt<k?(j.flags|=67108866,k):tt):(j.flags|=67108866,k)):(j.flags|=1048576,k)}function S(j){return e&&j.alternate===null&&(j.flags|=67108866),j}function A(j,k,tt,mt){return k===null||k.tag!==6?(k=Su(tt,j.mode,mt),k.return=j,k):(k=u(k,tt),k.return=j,k)}function G(j,k,tt,mt){var re=tt.type;return re===C?pt(j,k,tt.props.children,mt,tt.key):k!==null&&(k.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===q&&ds(re)===k.type)?(k=u(k,tt.props),oo(k,tt),k.return=j,k):(k=Sl(tt.type,tt.key,tt.props,null,j.mode,mt),oo(k,tt),k.return=j,k)}function et(j,k,tt,mt){return k===null||k.tag!==4||k.stateNode.containerInfo!==tt.containerInfo||k.stateNode.implementation!==tt.implementation?(k=yu(tt,j.mode,mt),k.return=j,k):(k=u(k,tt.children||[]),k.return=j,k)}function pt(j,k,tt,mt,re){return k===null||k.tag!==7?(k=ls(tt,j.mode,mt,re),k.return=j,k):(k=u(k,tt),k.return=j,k)}function _t(j,k,tt){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return k=Su(""+k,j.mode,tt),k.return=j,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case y:return tt=Sl(k.type,k.key,k.props,null,j.mode,tt),oo(tt,k),tt.return=j,tt;case T:return k=yu(k,j.mode,tt),k.return=j,k;case q:return k=ds(k),_t(j,k,tt)}if(rt(k)||nt(k))return k=ls(k,j.mode,tt,null),k.return=j,k;if(typeof k.then=="function")return _t(j,Rl(k),tt);if(k.$$typeof===U)return _t(j,El(j,k),tt);Cl(j,k)}return null}function st(j,k,tt,mt){var re=k!==null?k.key:null;if(typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint")return re!==null?null:A(j,k,""+tt,mt);if(typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case y:return tt.key===re?G(j,k,tt,mt):null;case T:return tt.key===re?et(j,k,tt,mt):null;case q:return tt=ds(tt),st(j,k,tt,mt)}if(rt(tt)||nt(tt))return re!==null?null:pt(j,k,tt,mt,null);if(typeof tt.then=="function")return st(j,k,Rl(tt),mt);if(tt.$$typeof===U)return st(j,k,El(j,tt),mt);Cl(j,tt)}return null}function lt(j,k,tt,mt,re){if(typeof mt=="string"&&mt!==""||typeof mt=="number"||typeof mt=="bigint")return j=j.get(tt)||null,A(k,j,""+mt,re);if(typeof mt=="object"&&mt!==null){switch(mt.$$typeof){case y:return j=j.get(mt.key===null?tt:mt.key)||null,G(k,j,mt,re);case T:return j=j.get(mt.key===null?tt:mt.key)||null,et(k,j,mt,re);case q:return mt=ds(mt),lt(j,k,tt,mt,re)}if(rt(mt)||nt(mt))return j=j.get(tt)||null,pt(k,j,mt,re,null);if(typeof mt.then=="function")return lt(j,k,tt,Rl(mt),re);if(mt.$$typeof===U)return lt(j,k,tt,El(k,mt),re);Cl(k,mt)}return null}function Kt(j,k,tt,mt){for(var re=null,Ne=null,ne=k,ve=k=0,Ae=null;ne!==null&&ve<tt.length;ve++){ne.index>ve?(Ae=ne,ne=null):Ae=ne.sibling;var Le=st(j,ne,tt[ve],mt);if(Le===null){ne===null&&(ne=Ae);break}e&&ne&&Le.alternate===null&&n(j,ne),k=h(Le,k,ve),Ne===null?re=Le:Ne.sibling=Le,Ne=Le,ne=Ae}if(ve===tt.length)return a(j,ne),Re&&Ki(j,ve),re;if(ne===null){for(;ve<tt.length;ve++)ne=_t(j,tt[ve],mt),ne!==null&&(k=h(ne,k,ve),Ne===null?re=ne:Ne.sibling=ne,Ne=ne);return Re&&Ki(j,ve),re}for(ne=o(ne);ve<tt.length;ve++)Ae=lt(ne,j,ve,tt[ve],mt),Ae!==null&&(e&&Ae.alternate!==null&&ne.delete(Ae.key===null?ve:Ae.key),k=h(Ae,k,ve),Ne===null?re=Ae:Ne.sibling=Ae,Ne=Ae);return e&&ne.forEach(function(qa){return n(j,qa)}),Re&&Ki(j,ve),re}function ue(j,k,tt,mt){if(tt==null)throw Error(s(151));for(var re=null,Ne=null,ne=k,ve=k=0,Ae=null,Le=tt.next();ne!==null&&!Le.done;ve++,Le=tt.next()){ne.index>ve?(Ae=ne,ne=null):Ae=ne.sibling;var qa=st(j,ne,Le.value,mt);if(qa===null){ne===null&&(ne=Ae);break}e&&ne&&qa.alternate===null&&n(j,ne),k=h(qa,k,ve),Ne===null?re=qa:Ne.sibling=qa,Ne=qa,ne=Ae}if(Le.done)return a(j,ne),Re&&Ki(j,ve),re;if(ne===null){for(;!Le.done;ve++,Le=tt.next())Le=_t(j,Le.value,mt),Le!==null&&(k=h(Le,k,ve),Ne===null?re=Le:Ne.sibling=Le,Ne=Le);return Re&&Ki(j,ve),re}for(ne=o(ne);!Le.done;ve++,Le=tt.next())Le=lt(ne,j,ve,Le.value,mt),Le!==null&&(e&&Le.alternate!==null&&ne.delete(Le.key===null?ve:Le.key),k=h(Le,k,ve),Ne===null?re=Le:Ne.sibling=Le,Ne=Le);return e&&ne.forEach(function(YS){return n(j,YS)}),Re&&Ki(j,ve),re}function qe(j,k,tt,mt){if(typeof tt=="object"&&tt!==null&&tt.type===C&&tt.key===null&&(tt=tt.props.children),typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case y:t:{for(var re=tt.key;k!==null;){if(k.key===re){if(re=tt.type,re===C){if(k.tag===7){a(j,k.sibling),mt=u(k,tt.props.children),mt.return=j,j=mt;break t}}else if(k.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===q&&ds(re)===k.type){a(j,k.sibling),mt=u(k,tt.props),oo(mt,tt),mt.return=j,j=mt;break t}a(j,k);break}else n(j,k);k=k.sibling}tt.type===C?(mt=ls(tt.props.children,j.mode,mt,tt.key),mt.return=j,j=mt):(mt=Sl(tt.type,tt.key,tt.props,null,j.mode,mt),oo(mt,tt),mt.return=j,j=mt)}return S(j);case T:t:{for(re=tt.key;k!==null;){if(k.key===re)if(k.tag===4&&k.stateNode.containerInfo===tt.containerInfo&&k.stateNode.implementation===tt.implementation){a(j,k.sibling),mt=u(k,tt.children||[]),mt.return=j,j=mt;break t}else{a(j,k);break}else n(j,k);k=k.sibling}mt=yu(tt,j.mode,mt),mt.return=j,j=mt}return S(j);case q:return tt=ds(tt),qe(j,k,tt,mt)}if(rt(tt))return Kt(j,k,tt,mt);if(nt(tt)){if(re=nt(tt),typeof re!="function")throw Error(s(150));return tt=re.call(tt),ue(j,k,tt,mt)}if(typeof tt.then=="function")return qe(j,k,Rl(tt),mt);if(tt.$$typeof===U)return qe(j,k,El(j,tt),mt);Cl(j,tt)}return typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint"?(tt=""+tt,k!==null&&k.tag===6?(a(j,k.sibling),mt=u(k,tt),mt.return=j,j=mt):(a(j,k),mt=Su(tt,j.mode,mt),mt.return=j,j=mt),S(j)):a(j,k)}return function(j,k,tt,mt){try{ro=0;var re=qe(j,k,tt,mt);return Qs=null,re}catch(ne){if(ne===Js||ne===bl)throw ne;var Ne=jn(29,ne,null,j.mode);return Ne.lanes=mt,Ne.return=j,Ne}finally{}}}var ms=Qp(!0),$p=Qp(!1),wa=!1;function Lu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ou(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Da(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ua(e,n,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(ze&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=xl(e),zp(e,null,a),n}return vl(e,o,n,a),xl(e)}function lo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,Vr(e,a)}}function Pu(e,n){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,h=null;if(a=a.firstBaseUpdate,a!==null){do{var S={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};h===null?u=h=S:h=h.next=S,a=a.next}while(a!==null);h===null?u=h=n:h=h.next=n}else u=h=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:h,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var zu=!1;function co(){if(zu){var e=Ks;if(e!==null)throw e}}function uo(e,n,a,o){zu=!1;var u=e.updateQueue;wa=!1;var h=u.firstBaseUpdate,S=u.lastBaseUpdate,A=u.shared.pending;if(A!==null){u.shared.pending=null;var G=A,et=G.next;G.next=null,S===null?h=et:S.next=et,S=G;var pt=e.alternate;pt!==null&&(pt=pt.updateQueue,A=pt.lastBaseUpdate,A!==S&&(A===null?pt.firstBaseUpdate=et:A.next=et,pt.lastBaseUpdate=G))}if(h!==null){var _t=u.baseState;S=0,pt=et=G=null,A=h;do{var st=A.lane&-536870913,lt=st!==A.lane;if(lt?(be&st)===st:(o&st)===st){st!==0&&st===Zs&&(zu=!0),pt!==null&&(pt=pt.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});t:{var Kt=e,ue=A;st=n;var qe=a;switch(ue.tag){case 1:if(Kt=ue.payload,typeof Kt=="function"){_t=Kt.call(qe,_t,st);break t}_t=Kt;break t;case 3:Kt.flags=Kt.flags&-65537|128;case 0:if(Kt=ue.payload,st=typeof Kt=="function"?Kt.call(qe,_t,st):Kt,st==null)break t;_t=_({},_t,st);break t;case 2:wa=!0}}st=A.callback,st!==null&&(e.flags|=64,lt&&(e.flags|=8192),lt=u.callbacks,lt===null?u.callbacks=[st]:lt.push(st))}else lt={lane:st,tag:A.tag,payload:A.payload,callback:A.callback,next:null},pt===null?(et=pt=lt,G=_t):pt=pt.next=lt,S|=st;if(A=A.next,A===null){if(A=u.shared.pending,A===null)break;lt=A,A=lt.next,lt.next=null,u.lastBaseUpdate=lt,u.shared.pending=null}}while(!0);pt===null&&(G=_t),u.baseState=G,u.firstBaseUpdate=et,u.lastBaseUpdate=pt,h===null&&(u.shared.lanes=0),za|=S,e.lanes=S,e.memoizedState=_t}}function tm(e,n){if(typeof e!="function")throw Error(s(191,e));e.call(n)}function em(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)tm(a[e],n)}var $s=O(null),wl=O(0);function nm(e,n){e=oa,ft(wl,e),ft($s,n),oa=e|n.baseLanes}function Fu(){ft(wl,oa),ft($s,$s.current)}function Bu(){oa=wl.current,K($s),K(wl)}var Zn=O(null),fi=null;function Na(e){var n=e.alternate;ft(sn,sn.current&1),ft(Zn,e),fi===null&&(n===null||$s.current!==null||n.memoizedState!==null)&&(fi=e)}function Iu(e){ft(sn,sn.current),ft(Zn,e),fi===null&&(fi=e)}function im(e){e.tag===22?(ft(sn,sn.current),ft(Zn,e),fi===null&&(fi=e)):La()}function La(){ft(sn,sn.current),ft(Zn,Zn.current)}function Kn(e){K(Zn),fi===e&&(fi=null),K(sn)}var sn=O(0);function Dl(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||qf(a)||Yf(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var $i=0,ge=null,Xe=null,cn=null,Ul=!1,tr=!1,gs=!1,Nl=0,fo=0,er=null,Fx=0;function en(){throw Error(s(321))}function Hu(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!Yn(e[a],n[a]))return!1;return!0}function Gu(e,n,a,o,u,h){return $i=h,ge=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,B.H=e===null||e.memoizedState===null?Hm:nf,gs=!1,h=a(o,u),gs=!1,tr&&(h=sm(n,a,o,u)),am(e),h}function am(e){B.H=mo;var n=Xe!==null&&Xe.next!==null;if($i=0,cn=Xe=ge=null,Ul=!1,fo=0,er=null,n)throw Error(s(300));e===null||un||(e=e.dependencies,e!==null&&Ml(e)&&(un=!0))}function sm(e,n,a,o){ge=e;var u=0;do{if(tr&&(er=null),fo=0,tr=!1,25<=u)throw Error(s(301));if(u+=1,cn=Xe=null,e.updateQueue!=null){var h=e.updateQueue;h.lastEffect=null,h.events=null,h.stores=null,h.memoCache!=null&&(h.memoCache.index=0)}B.H=Gm,h=n(a,o)}while(tr);return h}function Bx(){var e=B.H,n=e.useState()[0];return n=typeof n.then=="function"?ho(n):n,e=e.useState()[0],(Xe!==null?Xe.memoizedState:null)!==e&&(ge.flags|=1024),n}function Vu(){var e=Nl!==0;return Nl=0,e}function ku(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function Xu(e){if(Ul){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Ul=!1}$i=0,cn=Xe=ge=null,tr=!1,fo=Nl=0,er=null}function Fn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return cn===null?ge.memoizedState=cn=e:cn=cn.next=e,cn}function rn(){if(Xe===null){var e=ge.alternate;e=e!==null?e.memoizedState:null}else e=Xe.next;var n=cn===null?ge.memoizedState:cn.next;if(n!==null)cn=n,Xe=e;else{if(e===null)throw ge.alternate===null?Error(s(467)):Error(s(310));Xe=e,e={memoizedState:Xe.memoizedState,baseState:Xe.baseState,baseQueue:Xe.baseQueue,queue:Xe.queue,next:null},cn===null?ge.memoizedState=cn=e:cn=cn.next=e}return cn}function Ll(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ho(e){var n=fo;return fo+=1,er===null&&(er=[]),e=Zp(er,e,n),n=ge,(cn===null?n.memoizedState:cn.next)===null&&(n=n.alternate,B.H=n===null||n.memoizedState===null?Hm:nf),e}function Ol(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return ho(e);if(e.$$typeof===U)return Rn(e)}throw Error(s(438,String(e)))}function Wu(e){var n=null,a=ge.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=ge.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Ll(),ge.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),o=0;o<e;o++)a[o]=w;return n.index++,a}function ta(e,n){return typeof n=="function"?n(e):n}function Pl(e){var n=rn();return qu(n,Xe,e)}function qu(e,n,a){var o=e.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=e.baseQueue,h=o.pending;if(h!==null){if(u!==null){var S=u.next;u.next=h.next,h.next=S}n.baseQueue=u=h,o.pending=null}if(h=e.baseState,u===null)e.memoizedState=h;else{n=u.next;var A=S=null,G=null,et=n,pt=!1;do{var _t=et.lane&-536870913;if(_t!==et.lane?(be&_t)===_t:($i&_t)===_t){var st=et.revertLane;if(st===0)G!==null&&(G=G.next={lane:0,revertLane:0,gesture:null,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null}),_t===Zs&&(pt=!0);else if(($i&st)===st){et=et.next,st===Zs&&(pt=!0);continue}else _t={lane:0,revertLane:et.revertLane,gesture:null,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null},G===null?(A=G=_t,S=h):G=G.next=_t,ge.lanes|=st,za|=st;_t=et.action,gs&&a(h,_t),h=et.hasEagerState?et.eagerState:a(h,_t)}else st={lane:_t,revertLane:et.revertLane,gesture:et.gesture,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null},G===null?(A=G=st,S=h):G=G.next=st,ge.lanes|=_t,za|=_t;et=et.next}while(et!==null&&et!==n);if(G===null?S=h:G.next=A,!Yn(h,e.memoizedState)&&(un=!0,pt&&(a=Ks,a!==null)))throw a;e.memoizedState=h,e.baseState=S,e.baseQueue=G,o.lastRenderedState=h}return u===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Yu(e){var n=rn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var o=a.dispatch,u=a.pending,h=n.memoizedState;if(u!==null){a.pending=null;var S=u=u.next;do h=e(h,S.action),S=S.next;while(S!==u);Yn(h,n.memoizedState)||(un=!0),n.memoizedState=h,n.baseQueue===null&&(n.baseState=h),a.lastRenderedState=h}return[h,o]}function rm(e,n,a){var o=ge,u=rn(),h=Re;if(h){if(a===void 0)throw Error(s(407));a=a()}else a=n();var S=!Yn((Xe||u).memoizedState,a);if(S&&(u.memoizedState=a,un=!0),u=u.queue,Ku(cm.bind(null,o,u,e),[e]),u.getSnapshot!==n||S||cn!==null&&cn.memoizedState.tag&1){if(o.flags|=2048,nr(9,{destroy:void 0},lm.bind(null,o,u,a,n),null),Ye===null)throw Error(s(349));h||($i&127)!==0||om(o,n,a)}return a}function om(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=ge.updateQueue,n===null?(n=Ll(),ge.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function lm(e,n,a,o){n.value=a,n.getSnapshot=o,um(n)&&fm(e)}function cm(e,n,a){return a(function(){um(n)&&fm(e)})}function um(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!Yn(e,a)}catch{return!0}}function fm(e){var n=os(e,2);n!==null&&Xn(n,e,2)}function ju(e){var n=Fn();if(typeof e=="function"){var a=e;if(e=a(),gs){Yt(!0);try{a()}finally{Yt(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:e},n}function hm(e,n,a,o){return e.baseState=a,qu(e,Xe,typeof o=="function"?o:ta)}function Ix(e,n,a,o,u){if(Bl(e))throw Error(s(485));if(e=n.action,e!==null){var h={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(S){h.listeners.push(S)}};B.T!==null?a(!0):h.isTransition=!1,o(h),a=n.pending,a===null?(h.next=n.pending=h,dm(n,h)):(h.next=a.next,n.pending=a.next=h)}}function dm(e,n){var a=n.action,o=n.payload,u=e.state;if(n.isTransition){var h=B.T,S={};B.T=S;try{var A=a(u,o),G=B.S;G!==null&&G(S,A),pm(e,n,A)}catch(et){Zu(e,n,et)}finally{h!==null&&S.types!==null&&(h.types=S.types),B.T=h}}else try{h=a(u,o),pm(e,n,h)}catch(et){Zu(e,n,et)}}function pm(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){mm(e,n,o)},function(o){return Zu(e,n,o)}):mm(e,n,a)}function mm(e,n,a){n.status="fulfilled",n.value=a,gm(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,dm(e,a)))}function Zu(e,n,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,gm(n),n=n.next;while(n!==o)}e.action=null}function gm(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function _m(e,n){return n}function vm(e,n){if(Re){var a=Ye.formState;if(a!==null){t:{var o=ge;if(Re){if(Ze){e:{for(var u=Ze,h=ui;u.nodeType!==8;){if(!h){u=null;break e}if(u=hi(u.nextSibling),u===null){u=null;break e}}h=u.data,u=h==="F!"||h==="F"?u:null}if(u){Ze=hi(u.nextSibling),o=u.data==="F!";break t}}Ra(o)}o=!1}o&&(n=a[0])}}return a=Fn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:_m,lastRenderedState:n},a.queue=o,a=Fm.bind(null,ge,o),o.dispatch=a,o=ju(!1),h=ef.bind(null,ge,!1,o.queue),o=Fn(),u={state:n,dispatch:null,action:e,pending:null},o.queue=u,a=Ix.bind(null,ge,u,h,a),u.dispatch=a,o.memoizedState=e,[n,a,!1]}function xm(e){var n=rn();return Sm(n,Xe,e)}function Sm(e,n,a){if(n=qu(e,n,_m)[0],e=Pl(ta)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=ho(n)}catch(S){throw S===Js?bl:S}else o=n;n=rn();var u=n.queue,h=u.dispatch;return a!==n.memoizedState&&(ge.flags|=2048,nr(9,{destroy:void 0},Hx.bind(null,u,a),null)),[o,h,e]}function Hx(e,n){e.action=n}function ym(e){var n=rn(),a=Xe;if(a!==null)return Sm(n,a,e);rn(),n=n.memoizedState,a=rn();var o=a.queue.dispatch;return a.memoizedState=e,[n,o,!1]}function nr(e,n,a,o){return e={tag:e,create:a,deps:o,inst:n,next:null},n=ge.updateQueue,n===null&&(n=Ll(),ge.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,n.lastEffect=e),e}function Mm(){return rn().memoizedState}function zl(e,n,a,o){var u=Fn();ge.flags|=e,u.memoizedState=nr(1|n,{destroy:void 0},a,o===void 0?null:o)}function Fl(e,n,a,o){var u=rn();o=o===void 0?null:o;var h=u.memoizedState.inst;Xe!==null&&o!==null&&Hu(o,Xe.memoizedState.deps)?u.memoizedState=nr(n,h,a,o):(ge.flags|=e,u.memoizedState=nr(1|n,h,a,o))}function Em(e,n){zl(8390656,8,e,n)}function Ku(e,n){Fl(2048,8,e,n)}function Gx(e){ge.flags|=4;var n=ge.updateQueue;if(n===null)n=Ll(),ge.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function Tm(e){var n=rn().memoizedState;return Gx({ref:n,nextImpl:e}),function(){if((ze&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function bm(e,n){return Fl(4,2,e,n)}function Am(e,n){return Fl(4,4,e,n)}function Rm(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Cm(e,n,a){a=a!=null?a.concat([e]):null,Fl(4,4,Rm.bind(null,n,e),a)}function Ju(){}function wm(e,n){var a=rn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&Hu(n,o[1])?o[0]:(a.memoizedState=[e,n],e)}function Dm(e,n){var a=rn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&Hu(n,o[1]))return o[0];if(o=e(),gs){Yt(!0);try{e()}finally{Yt(!1)}}return a.memoizedState=[o,n],o}function Qu(e,n,a){return a===void 0||($i&1073741824)!==0&&(be&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Ug(),ge.lanes|=e,za|=e,a)}function Um(e,n,a,o){return Yn(a,n)?a:$s.current!==null?(e=Qu(e,a,o),Yn(e,n)||(un=!0),e):($i&42)===0||($i&1073741824)!==0&&(be&261930)===0?(un=!0,e.memoizedState=a):(e=Ug(),ge.lanes|=e,za|=e,n)}function Nm(e,n,a,o,u){var h=H.p;H.p=h!==0&&8>h?h:8;var S=B.T,A={};B.T=A,ef(e,!1,n,a);try{var G=u(),et=B.S;if(et!==null&&et(A,G),G!==null&&typeof G=="object"&&typeof G.then=="function"){var pt=zx(G,o);po(e,n,pt,$n(e))}else po(e,n,o,$n(e))}catch(_t){po(e,n,{then:function(){},status:"rejected",reason:_t},$n())}finally{H.p=h,S!==null&&A.types!==null&&(S.types=A.types),B.T=S}}function Vx(){}function $u(e,n,a,o){if(e.tag!==5)throw Error(s(476));var u=Lm(e).queue;Nm(e,u,n,$,a===null?Vx:function(){return Om(e),a(o)})}function Lm(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:$,baseState:$,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:$},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function Om(e){var n=Lm(e);n.next===null&&(n=e.alternate.memoizedState),po(e,n.next.queue,{},$n())}function tf(){return Rn(Uo)}function Pm(){return rn().memoizedState}function zm(){return rn().memoizedState}function kx(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=$n();e=Da(a);var o=Ua(n,e,a);o!==null&&(Xn(o,n,a),lo(o,n,a)),n={cache:wu()},e.payload=n;return}n=n.return}}function Xx(e,n,a){var o=$n();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Bl(e)?Bm(n,a):(a=vu(e,n,a,o),a!==null&&(Xn(a,e,o),Im(a,n,o)))}function Fm(e,n,a){var o=$n();po(e,n,a,o)}function po(e,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Bl(e))Bm(n,u);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=n.lastRenderedReducer,h!==null))try{var S=n.lastRenderedState,A=h(S,a);if(u.hasEagerState=!0,u.eagerState=A,Yn(A,S))return vl(e,n,u,0),Ye===null&&_l(),!1}catch{}finally{}if(a=vu(e,n,u,o),a!==null)return Xn(a,e,o),Im(a,n,o),!0}return!1}function ef(e,n,a,o){if(o={lane:2,revertLane:Of(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Bl(e)){if(n)throw Error(s(479))}else n=vu(e,a,o,2),n!==null&&Xn(n,e,2)}function Bl(e){var n=e.alternate;return e===ge||n!==null&&n===ge}function Bm(e,n){tr=Ul=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function Im(e,n,a){if((a&4194048)!==0){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,Vr(e,a)}}var mo={readContext:Rn,use:Ol,useCallback:en,useContext:en,useEffect:en,useImperativeHandle:en,useLayoutEffect:en,useInsertionEffect:en,useMemo:en,useReducer:en,useRef:en,useState:en,useDebugValue:en,useDeferredValue:en,useTransition:en,useSyncExternalStore:en,useId:en,useHostTransitionStatus:en,useFormState:en,useActionState:en,useOptimistic:en,useMemoCache:en,useCacheRefresh:en};mo.useEffectEvent=en;var Hm={readContext:Rn,use:Ol,useCallback:function(e,n){return Fn().memoizedState=[e,n===void 0?null:n],e},useContext:Rn,useEffect:Em,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,zl(4194308,4,Rm.bind(null,n,e),a)},useLayoutEffect:function(e,n){return zl(4194308,4,e,n)},useInsertionEffect:function(e,n){zl(4,2,e,n)},useMemo:function(e,n){var a=Fn();n=n===void 0?null:n;var o=e();if(gs){Yt(!0);try{e()}finally{Yt(!1)}}return a.memoizedState=[o,n],o},useReducer:function(e,n,a){var o=Fn();if(a!==void 0){var u=a(n);if(gs){Yt(!0);try{a(n)}finally{Yt(!1)}}}else u=n;return o.memoizedState=o.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},o.queue=e,e=e.dispatch=Xx.bind(null,ge,e),[o.memoizedState,e]},useRef:function(e){var n=Fn();return e={current:e},n.memoizedState=e},useState:function(e){e=ju(e);var n=e.queue,a=Fm.bind(null,ge,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:Ju,useDeferredValue:function(e,n){var a=Fn();return Qu(a,e,n)},useTransition:function(){var e=ju(!1);return e=Nm.bind(null,ge,e.queue,!0,!1),Fn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var o=ge,u=Fn();if(Re){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),Ye===null)throw Error(s(349));(be&127)!==0||om(o,n,a)}u.memoizedState=a;var h={value:a,getSnapshot:n};return u.queue=h,Em(cm.bind(null,o,h,e),[e]),o.flags|=2048,nr(9,{destroy:void 0},lm.bind(null,o,h,a,n),null),a},useId:function(){var e=Fn(),n=Ye.identifierPrefix;if(Re){var a=Ui,o=Di;a=(o&~(1<<32-kt(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Nl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=Fx++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:tf,useFormState:vm,useActionState:vm,useOptimistic:function(e){var n=Fn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=ef.bind(null,ge,!0,a),a.dispatch=n,[e,n]},useMemoCache:Wu,useCacheRefresh:function(){return Fn().memoizedState=kx.bind(null,ge)},useEffectEvent:function(e){var n=Fn(),a={impl:e};return n.memoizedState=a,function(){if((ze&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},nf={readContext:Rn,use:Ol,useCallback:wm,useContext:Rn,useEffect:Ku,useImperativeHandle:Cm,useInsertionEffect:bm,useLayoutEffect:Am,useMemo:Dm,useReducer:Pl,useRef:Mm,useState:function(){return Pl(ta)},useDebugValue:Ju,useDeferredValue:function(e,n){var a=rn();return Um(a,Xe.memoizedState,e,n)},useTransition:function(){var e=Pl(ta)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:ho(e),n]},useSyncExternalStore:rm,useId:Pm,useHostTransitionStatus:tf,useFormState:xm,useActionState:xm,useOptimistic:function(e,n){var a=rn();return hm(a,Xe,e,n)},useMemoCache:Wu,useCacheRefresh:zm};nf.useEffectEvent=Tm;var Gm={readContext:Rn,use:Ol,useCallback:wm,useContext:Rn,useEffect:Ku,useImperativeHandle:Cm,useInsertionEffect:bm,useLayoutEffect:Am,useMemo:Dm,useReducer:Yu,useRef:Mm,useState:function(){return Yu(ta)},useDebugValue:Ju,useDeferredValue:function(e,n){var a=rn();return Xe===null?Qu(a,e,n):Um(a,Xe.memoizedState,e,n)},useTransition:function(){var e=Yu(ta)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:ho(e),n]},useSyncExternalStore:rm,useId:Pm,useHostTransitionStatus:tf,useFormState:ym,useActionState:ym,useOptimistic:function(e,n){var a=rn();return Xe!==null?hm(a,Xe,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Wu,useCacheRefresh:zm};Gm.useEffectEvent=Tm;function af(e,n,a,o){n=e.memoizedState,a=a(o,n),a=a==null?n:_({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var sf={enqueueSetState:function(e,n,a){e=e._reactInternals;var o=$n(),u=Da(o);u.payload=n,a!=null&&(u.callback=a),n=Ua(e,u,o),n!==null&&(Xn(n,e,o),lo(n,e,o))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var o=$n(),u=Da(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ua(e,u,o),n!==null&&(Xn(n,e,o),lo(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=$n(),o=Da(a);o.tag=2,n!=null&&(o.callback=n),n=Ua(e,o,a),n!==null&&(Xn(n,e,a),lo(n,e,a))}};function Vm(e,n,a,o,u,h,S){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,h,S):n.prototype&&n.prototype.isPureReactComponent?!to(a,o)||!to(u,h):!0}function km(e,n,a,o){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==e&&sf.enqueueReplaceState(n,n.state,null)}function _s(e,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(e=e.defaultProps){a===n&&(a=_({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function Xm(e){gl(e)}function Wm(e){console.error(e)}function qm(e){gl(e)}function Il(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function Ym(e,n,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function rf(e,n,a){return a=Da(a),a.tag=3,a.payload={element:null},a.callback=function(){Il(e,n)},a}function jm(e){return e=Da(e),e.tag=3,e}function Zm(e,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var h=o.value;e.payload=function(){return u(h)},e.callback=function(){Ym(n,a,o)}}var S=a.stateNode;S!==null&&typeof S.componentDidCatch=="function"&&(e.callback=function(){Ym(n,a,o),typeof u!="function"&&(Fa===null?Fa=new Set([this]):Fa.add(this));var A=o.stack;this.componentDidCatch(o.value,{componentStack:A!==null?A:""})})}function Wx(e,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&js(n,a,u,!0),a=Zn.current,a!==null){switch(a.tag){case 31:case 13:return fi===null?Jl():a.alternate===null&&nn===0&&(nn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Al?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),Uf(e,o,u)),!1;case 22:return a.flags|=65536,o===Al?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),Uf(e,o,u)),!1}throw Error(s(435,a.tag))}return Uf(e,o,u),Jl(),!1}if(Re)return n=Zn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==Tu&&(e=Error(s(422),{cause:o}),io(oi(e,a)))):(o!==Tu&&(n=Error(s(423),{cause:o}),io(oi(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,o=oi(o,a),u=rf(e.stateNode,o,u),Pu(e,u),nn!==4&&(nn=2)),!1;var h=Error(s(520),{cause:o});if(h=oi(h,a),Eo===null?Eo=[h]:Eo.push(h),nn!==4&&(nn=2),n===null)return!0;o=oi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=rf(a.stateNode,o,e),Pu(a,e),!1;case 1:if(n=a.type,h=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(Fa===null||!Fa.has(h))))return a.flags|=65536,u&=-u,a.lanes|=u,u=jm(u),Zm(u,e,a,o),Pu(a,u),!1}a=a.return}while(a!==null);return!1}var of=Error(s(461)),un=!1;function Cn(e,n,a,o){n.child=e===null?$p(n,null,a,o):ms(n,e.child,a,o)}function Km(e,n,a,o,u){a=a.render;var h=n.ref;if("ref"in o){var S={};for(var A in o)A!=="ref"&&(S[A]=o[A])}else S=o;return fs(n),o=Gu(e,n,a,S,h,u),A=Vu(),e!==null&&!un?(ku(e,n,u),ea(e,n,u)):(Re&&A&&Mu(n),n.flags|=1,Cn(e,n,o,u),n.child)}function Jm(e,n,a,o,u){if(e===null){var h=a.type;return typeof h=="function"&&!xu(h)&&h.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=h,Qm(e,n,h,o,u)):(e=Sl(a.type,null,o,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(h=e.child,!mf(e,u)){var S=h.memoizedProps;if(a=a.compare,a=a!==null?a:to,a(S,o)&&e.ref===n.ref)return ea(e,n,u)}return n.flags|=1,e=Zi(h,o),e.ref=n.ref,e.return=n,n.child=e}function Qm(e,n,a,o,u){if(e!==null){var h=e.memoizedProps;if(to(h,o)&&e.ref===n.ref)if(un=!1,n.pendingProps=o=h,mf(e,u))(e.flags&131072)!==0&&(un=!0);else return n.lanes=e.lanes,ea(e,n,u)}return lf(e,n,a,o,u)}function $m(e,n,a,o){var u=o.children,h=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(h=h!==null?h.baseLanes|a:a,e!==null){for(o=n.child=e.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~h}else o=0,n.child=null;return tg(e,n,h,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&Tl(n,h!==null?h.cachePool:null),h!==null?nm(n,h):Fu(),im(n);else return o=n.lanes=536870912,tg(e,n,h!==null?h.baseLanes|a:a,a,o)}else h!==null?(Tl(n,h.cachePool),nm(n,h),La(),n.memoizedState=null):(e!==null&&Tl(n,null),Fu(),La());return Cn(e,n,u,a),n.child}function go(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function tg(e,n,a,o,u){var h=Uu();return h=h===null?null:{parent:ln._currentValue,pool:h},n.memoizedState={baseLanes:a,cachePool:h},e!==null&&Tl(n,null),Fu(),im(n),e!==null&&js(e,n,o,!0),n.childLanes=u,null}function Hl(e,n){return n=Vl({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function eg(e,n,a){return ms(n,e.child,null,a),e=Hl(n,n.pendingProps),e.flags|=2,Kn(n),n.memoizedState=null,e}function qx(e,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(Re){if(o.mode==="hidden")return e=Hl(n,o),n.lanes=536870912,go(null,e);if(Iu(n),(e=Ze)?(e=d0(e,ui),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:ba!==null?{id:Di,overflow:Ui}:null,retryLane:536870912,hydrationErrors:null},a=Bp(e),a.return=n,n.child=a,An=n,Ze=null)):e=null,e===null)throw Ra(n);return n.lanes=536870912,null}return Hl(n,o)}var h=e.memoizedState;if(h!==null){var S=h.dehydrated;if(Iu(n),u)if(n.flags&256)n.flags&=-257,n=eg(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(s(558));else if(un||js(e,n,a,!1),u=(a&e.childLanes)!==0,un||u){if(o=Ye,o!==null&&(S=Ls(o,a),S!==0&&S!==h.retryLane))throw h.retryLane=S,os(e,S),Xn(o,e,S),of;Jl(),n=eg(e,n,a)}else e=h.treeContext,Ze=hi(S.nextSibling),An=n,Re=!0,Aa=null,ui=!1,e!==null&&Gp(n,e),n=Hl(n,o),n.flags|=4096;return n}return e=Zi(e.child,{mode:o.mode,children:o.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Gl(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function lf(e,n,a,o,u){return fs(n),a=Gu(e,n,a,o,void 0,u),o=Vu(),e!==null&&!un?(ku(e,n,u),ea(e,n,u)):(Re&&o&&Mu(n),n.flags|=1,Cn(e,n,a,u),n.child)}function ng(e,n,a,o,u,h){return fs(n),n.updateQueue=null,a=sm(n,o,a,u),am(e),o=Vu(),e!==null&&!un?(ku(e,n,h),ea(e,n,h)):(Re&&o&&Mu(n),n.flags|=1,Cn(e,n,a,h),n.child)}function ig(e,n,a,o,u){if(fs(n),n.stateNode===null){var h=Xs,S=a.contextType;typeof S=="object"&&S!==null&&(h=Rn(S)),h=new a(o,h),n.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,h.updater=sf,n.stateNode=h,h._reactInternals=n,h=n.stateNode,h.props=o,h.state=n.memoizedState,h.refs={},Lu(n),S=a.contextType,h.context=typeof S=="object"&&S!==null?Rn(S):Xs,h.state=n.memoizedState,S=a.getDerivedStateFromProps,typeof S=="function"&&(af(n,a,S,o),h.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(S=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),S!==h.state&&sf.enqueueReplaceState(h,h.state,null),uo(n,o,h,u),co(),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(e===null){h=n.stateNode;var A=n.memoizedProps,G=_s(a,A);h.props=G;var et=h.context,pt=a.contextType;S=Xs,typeof pt=="object"&&pt!==null&&(S=Rn(pt));var _t=a.getDerivedStateFromProps;pt=typeof _t=="function"||typeof h.getSnapshotBeforeUpdate=="function",A=n.pendingProps!==A,pt||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(A||et!==S)&&km(n,h,o,S),wa=!1;var st=n.memoizedState;h.state=st,uo(n,o,h,u),co(),et=n.memoizedState,A||st!==et||wa?(typeof _t=="function"&&(af(n,a,_t,o),et=n.memoizedState),(G=wa||Vm(n,a,G,o,st,et,S))?(pt||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount()),typeof h.componentDidMount=="function"&&(n.flags|=4194308)):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=et),h.props=o,h.state=et,h.context=S,o=G):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{h=n.stateNode,Ou(e,n),S=n.memoizedProps,pt=_s(a,S),h.props=pt,_t=n.pendingProps,st=h.context,et=a.contextType,G=Xs,typeof et=="object"&&et!==null&&(G=Rn(et)),A=a.getDerivedStateFromProps,(et=typeof A=="function"||typeof h.getSnapshotBeforeUpdate=="function")||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(S!==_t||st!==G)&&km(n,h,o,G),wa=!1,st=n.memoizedState,h.state=st,uo(n,o,h,u),co();var lt=n.memoizedState;S!==_t||st!==lt||wa||e!==null&&e.dependencies!==null&&Ml(e.dependencies)?(typeof A=="function"&&(af(n,a,A,o),lt=n.memoizedState),(pt=wa||Vm(n,a,pt,o,st,lt,G)||e!==null&&e.dependencies!==null&&Ml(e.dependencies))?(et||typeof h.UNSAFE_componentWillUpdate!="function"&&typeof h.componentWillUpdate!="function"||(typeof h.componentWillUpdate=="function"&&h.componentWillUpdate(o,lt,G),typeof h.UNSAFE_componentWillUpdate=="function"&&h.UNSAFE_componentWillUpdate(o,lt,G)),typeof h.componentDidUpdate=="function"&&(n.flags|=4),typeof h.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=lt),h.props=o,h.state=lt,h.context=G,o=pt):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=1024),o=!1)}return h=o,Gl(e,n),o=(n.flags&128)!==0,h||o?(h=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:h.render(),n.flags|=1,e!==null&&o?(n.child=ms(n,e.child,null,u),n.child=ms(n,null,a,u)):Cn(e,n,a,u),n.memoizedState=h.state,e=n.child):e=ea(e,n,u),e}function ag(e,n,a,o){return cs(),n.flags|=256,Cn(e,n,a,o),n.child}var cf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function uf(e){return{baseLanes:e,cachePool:Yp()}}function ff(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=Qn),e}function sg(e,n,a){var o=n.pendingProps,u=!1,h=(n.flags&128)!==0,S;if((S=h)||(S=e!==null&&e.memoizedState===null?!1:(sn.current&2)!==0),S&&(u=!0,n.flags&=-129),S=(n.flags&32)!==0,n.flags&=-33,e===null){if(Re){if(u?Na(n):La(),(e=Ze)?(e=d0(e,ui),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:ba!==null?{id:Di,overflow:Ui}:null,retryLane:536870912,hydrationErrors:null},a=Bp(e),a.return=n,n.child=a,An=n,Ze=null)):e=null,e===null)throw Ra(n);return Yf(e)?n.lanes=32:n.lanes=536870912,null}var A=o.children;return o=o.fallback,u?(La(),u=n.mode,A=Vl({mode:"hidden",children:A},u),o=ls(o,u,a,null),A.return=n,o.return=n,A.sibling=o,n.child=A,o=n.child,o.memoizedState=uf(a),o.childLanes=ff(e,S,a),n.memoizedState=cf,go(null,o)):(Na(n),hf(n,A))}var G=e.memoizedState;if(G!==null&&(A=G.dehydrated,A!==null)){if(h)n.flags&256?(Na(n),n.flags&=-257,n=df(e,n,a)):n.memoizedState!==null?(La(),n.child=e.child,n.flags|=128,n=null):(La(),A=o.fallback,u=n.mode,o=Vl({mode:"visible",children:o.children},u),A=ls(A,u,a,null),A.flags|=2,o.return=n,A.return=n,o.sibling=A,n.child=o,ms(n,e.child,null,a),o=n.child,o.memoizedState=uf(a),o.childLanes=ff(e,S,a),n.memoizedState=cf,n=go(null,o));else if(Na(n),Yf(A)){if(S=A.nextSibling&&A.nextSibling.dataset,S)var et=S.dgst;S=et,o=Error(s(419)),o.stack="",o.digest=S,io({value:o,source:null,stack:null}),n=df(e,n,a)}else if(un||js(e,n,a,!1),S=(a&e.childLanes)!==0,un||S){if(S=Ye,S!==null&&(o=Ls(S,a),o!==0&&o!==G.retryLane))throw G.retryLane=o,os(e,o),Xn(S,e,o),of;qf(A)||Jl(),n=df(e,n,a)}else qf(A)?(n.flags|=192,n.child=e.child,n=null):(e=G.treeContext,Ze=hi(A.nextSibling),An=n,Re=!0,Aa=null,ui=!1,e!==null&&Gp(n,e),n=hf(n,o.children),n.flags|=4096);return n}return u?(La(),A=o.fallback,u=n.mode,G=e.child,et=G.sibling,o=Zi(G,{mode:"hidden",children:o.children}),o.subtreeFlags=G.subtreeFlags&65011712,et!==null?A=Zi(et,A):(A=ls(A,u,a,null),A.flags|=2),A.return=n,o.return=n,o.sibling=A,n.child=o,go(null,o),o=n.child,A=e.child.memoizedState,A===null?A=uf(a):(u=A.cachePool,u!==null?(G=ln._currentValue,u=u.parent!==G?{parent:G,pool:G}:u):u=Yp(),A={baseLanes:A.baseLanes|a,cachePool:u}),o.memoizedState=A,o.childLanes=ff(e,S,a),n.memoizedState=cf,go(e.child,o)):(Na(n),a=e.child,e=a.sibling,a=Zi(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,e!==null&&(S=n.deletions,S===null?(n.deletions=[e],n.flags|=16):S.push(e)),n.child=a,n.memoizedState=null,a)}function hf(e,n){return n=Vl({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Vl(e,n){return e=jn(22,e,null,n),e.lanes=0,e}function df(e,n,a){return ms(n,e.child,null,a),e=hf(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function rg(e,n,a){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n),Ru(e.return,n,a)}function pf(e,n,a,o,u,h){var S=e.memoizedState;S===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:h}:(S.isBackwards=n,S.rendering=null,S.renderingStartTime=0,S.last=o,S.tail=a,S.tailMode=u,S.treeForkCount=h)}function og(e,n,a){var o=n.pendingProps,u=o.revealOrder,h=o.tail;o=o.children;var S=sn.current,A=(S&2)!==0;if(A?(S=S&1|2,n.flags|=128):S&=1,ft(sn,S),Cn(e,n,o,a),o=Re?no:0,!A&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&rg(e,a,n);else if(e.tag===19)rg(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&Dl(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),pf(n,!1,u,a,h,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&Dl(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}pf(n,!0,a,null,h,o);break;case"together":pf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function ea(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),za|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(js(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(s(153));if(n.child!==null){for(e=n.child,a=Zi(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=Zi(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function mf(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&Ml(e)))}function Yx(e,n,a){switch(n.tag){case 3:Ut(n,n.stateNode.containerInfo),Ca(n,ln,e.memoizedState.cache),cs();break;case 27:case 5:qt(n);break;case 4:Ut(n,n.stateNode.containerInfo);break;case 10:Ca(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Iu(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Na(n),n.flags|=128,null):(a&n.child.childLanes)!==0?sg(e,n,a):(Na(n),e=ea(e,n,a),e!==null?e.sibling:null);Na(n);break;case 19:var u=(e.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(js(e,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return og(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ft(sn,sn.current),o)break;return null;case 22:return n.lanes=0,$m(e,n,a,n.pendingProps);case 24:Ca(n,ln,e.memoizedState.cache)}return ea(e,n,a)}function lg(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)un=!0;else{if(!mf(e,a)&&(n.flags&128)===0)return un=!1,Yx(e,n,a);un=(e.flags&131072)!==0}else un=!1,Re&&(n.flags&1048576)!==0&&Hp(n,no,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(e=ds(n.elementType),n.type=e,typeof e=="function")xu(e)?(o=_s(e,o),n.tag=1,n=ig(null,n,e,o,a)):(n.tag=0,n=lf(null,n,e,o,a));else{if(e!=null){var u=e.$$typeof;if(u===D){n.tag=11,n=Km(null,n,e,o,a);break t}else if(u===F){n.tag=14,n=Jm(null,n,e,o,a);break t}}throw n=dt(e)||e,Error(s(306,n,""))}}return n;case 0:return lf(e,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=_s(o,n.pendingProps),ig(e,n,o,u,a);case 3:t:{if(Ut(n,n.stateNode.containerInfo),e===null)throw Error(s(387));o=n.pendingProps;var h=n.memoizedState;u=h.element,Ou(e,n),uo(n,o,null,a);var S=n.memoizedState;if(o=S.cache,Ca(n,ln,o),o!==h.cache&&Cu(n,[ln],a,!0),co(),o=S.element,h.isDehydrated)if(h={element:o,isDehydrated:!1,cache:S.cache},n.updateQueue.baseState=h,n.memoizedState=h,n.flags&256){n=ag(e,n,o,a);break t}else if(o!==u){u=oi(Error(s(424)),n),io(u),n=ag(e,n,o,a);break t}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Ze=hi(e.firstChild),An=n,Re=!0,Aa=null,ui=!0,a=$p(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(cs(),o===u){n=ea(e,n,a);break t}Cn(e,n,o,a)}n=n.child}return n;case 26:return Gl(e,n),e===null?(a=x0(n.type,null,n.pendingProps,null))?n.memoizedState=a:Re||(a=n.type,e=n.pendingProps,o=ac(Q.current).createElement(a),o[on]=n,o[Sn]=e,wn(o,a,e),R(o),n.stateNode=o):n.memoizedState=x0(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return qt(n),e===null&&Re&&(o=n.stateNode=g0(n.type,n.pendingProps,Q.current),An=n,ui=!0,u=Ze,Ga(n.type)?(jf=u,Ze=hi(o.firstChild)):Ze=u),Cn(e,n,n.pendingProps.children,a),Gl(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&Re&&((u=o=Ze)&&(o=ES(o,n.type,n.pendingProps,ui),o!==null?(n.stateNode=o,An=n,Ze=hi(o.firstChild),ui=!1,u=!0):u=!1),u||Ra(n)),qt(n),u=n.type,h=n.pendingProps,S=e!==null?e.memoizedProps:null,o=h.children,kf(u,h)?o=null:S!==null&&kf(u,S)&&(n.flags|=32),n.memoizedState!==null&&(u=Gu(e,n,Bx,null,null,a),Uo._currentValue=u),Gl(e,n),Cn(e,n,o,a),n.child;case 6:return e===null&&Re&&((e=a=Ze)&&(a=TS(a,n.pendingProps,ui),a!==null?(n.stateNode=a,An=n,Ze=null,e=!0):e=!1),e||Ra(n)),null;case 13:return sg(e,n,a);case 4:return Ut(n,n.stateNode.containerInfo),o=n.pendingProps,e===null?n.child=ms(n,null,o,a):Cn(e,n,o,a),n.child;case 11:return Km(e,n,n.type,n.pendingProps,a);case 7:return Cn(e,n,n.pendingProps,a),n.child;case 8:return Cn(e,n,n.pendingProps.children,a),n.child;case 12:return Cn(e,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Ca(n,n.type,o.value),Cn(e,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,fs(n),u=Rn(u),o=o(u),n.flags|=1,Cn(e,n,o,a),n.child;case 14:return Jm(e,n,n.type,n.pendingProps,a);case 15:return Qm(e,n,n.type,n.pendingProps,a);case 19:return og(e,n,a);case 31:return qx(e,n,a);case 22:return $m(e,n,a,n.pendingProps);case 24:return fs(n),o=Rn(ln),e===null?(u=Uu(),u===null&&(u=Ye,h=wu(),u.pooledCache=h,h.refCount++,h!==null&&(u.pooledCacheLanes|=a),u=h),n.memoizedState={parent:o,cache:u},Lu(n),Ca(n,ln,u)):((e.lanes&a)!==0&&(Ou(e,n),uo(n,null,null,a),co()),u=e.memoizedState,h=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Ca(n,ln,o)):(o=h.cache,Ca(n,ln,o),o!==u.cache&&Cu(n,[ln],a,!0))),Cn(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function na(e){e.flags|=4}function gf(e,n,a,o,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Pg())e.flags|=8192;else throw ps=Al,Nu}else e.flags&=-16777217}function cg(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!T0(n))if(Pg())e.flags|=8192;else throw ps=Al,Nu}function kl(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Ie():536870912,e.lanes|=n,rr|=n)}function _o(e,n){if(!Re)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ke(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=o,e.childLanes=a,n}function jx(e,n,a){var o=n.pendingProps;switch(Eu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(n),null;case 1:return Ke(n),null;case 3:return a=n.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),Qi(ln),Vt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Ys(n)?na(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,bu())),Ke(n),null;case 26:var u=n.type,h=n.memoizedState;return e===null?(na(n),h!==null?(Ke(n),cg(n,h)):(Ke(n),gf(n,u,null,o,a))):h?h!==e.memoizedState?(na(n),Ke(n),cg(n,h)):(Ke(n),n.flags&=-16777217):(e=e.memoizedProps,e!==o&&na(n),Ke(n),gf(n,u,e,o,a)),null;case 27:if(ye(n),a=Q.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}e=Et.current,Ys(n)?Vp(n):(e=g0(u,o,a),n.stateNode=e,na(n))}return Ke(n),null;case 5:if(ye(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}if(h=Et.current,Ys(n))Vp(n);else{var S=ac(Q.current);switch(h){case 1:h=S.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:h=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":h=S.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":h=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":h=S.createElement("div"),h.innerHTML="<script><\/script>",h=h.removeChild(h.firstChild);break;case"select":h=typeof o.is=="string"?S.createElement("select",{is:o.is}):S.createElement("select"),o.multiple?h.multiple=!0:o.size&&(h.size=o.size);break;default:h=typeof o.is=="string"?S.createElement(u,{is:o.is}):S.createElement(u)}}h[on]=n,h[Sn]=o;t:for(S=n.child;S!==null;){if(S.tag===5||S.tag===6)h.appendChild(S.stateNode);else if(S.tag!==4&&S.tag!==27&&S.child!==null){S.child.return=S,S=S.child;continue}if(S===n)break t;for(;S.sibling===null;){if(S.return===null||S.return===n)break t;S=S.return}S.sibling.return=S.return,S=S.sibling}n.stateNode=h;t:switch(wn(h,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&na(n)}}return Ke(n),gf(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(e=Q.current,Ys(n)){if(e=n.stateNode,a=n.memoizedProps,o=null,u=An,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}e[on]=n,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||s0(e.nodeValue,a)),e||Ra(n,!0)}else e=ac(e).createTextNode(o),e[on]=n,n.stateNode=e}return Ke(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(o=Ys(n),a!==null){if(e===null){if(!o)throw Error(s(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[on]=n}else cs(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),e=!1}else a=bu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(Kn(n),n):(Kn(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Ke(n),null;case 13:if(o=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=Ys(n),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[on]=n}else cs(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),u=!1}else u=bu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(Kn(n),n):(Kn(n),null)}return Kn(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),h=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(h=o.memoizedState.cachePool.pool),h!==u&&(o.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),kl(n,n.updateQueue),Ke(n),null);case 4:return Vt(),e===null&&Bf(n.stateNode.containerInfo),Ke(n),null;case 10:return Qi(n.type),Ke(n),null;case 19:if(K(sn),o=n.memoizedState,o===null)return Ke(n),null;if(u=(n.flags&128)!==0,h=o.rendering,h===null)if(u)_o(o,!1);else{if(nn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(h=Dl(e),h!==null){for(n.flags|=128,_o(o,!1),e=h.updateQueue,n.updateQueue=e,kl(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Fp(a,e),a=a.sibling;return ft(sn,sn.current&1|2),Re&&Ki(n,o.treeForkCount),n.child}e=e.sibling}o.tail!==null&&E()>jl&&(n.flags|=128,u=!0,_o(o,!1),n.lanes=4194304)}else{if(!u)if(e=Dl(h),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,kl(n,e),_o(o,!0),o.tail===null&&o.tailMode==="hidden"&&!h.alternate&&!Re)return Ke(n),null}else 2*E()-o.renderingStartTime>jl&&a!==536870912&&(n.flags|=128,u=!0,_o(o,!1),n.lanes=4194304);o.isBackwards?(h.sibling=n.child,n.child=h):(e=o.last,e!==null?e.sibling=h:n.child=h,o.last=h)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=E(),e.sibling=null,a=sn.current,ft(sn,u?a&1|2:a&1),Re&&Ki(n,o.treeForkCount),e):(Ke(n),null);case 22:case 23:return Kn(n),Bu(),o=n.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ke(n),n.subtreeFlags&6&&(n.flags|=8192)):Ke(n),a=n.updateQueue,a!==null&&kl(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),e!==null&&K(hs),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Qi(ln),Ke(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function Zx(e,n){switch(Eu(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Qi(ln),Vt(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return ye(n),null;case 31:if(n.memoizedState!==null){if(Kn(n),n.alternate===null)throw Error(s(340));cs()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(Kn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(s(340));cs()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return K(sn),null;case 4:return Vt(),null;case 10:return Qi(n.type),null;case 22:case 23:return Kn(n),Bu(),e!==null&&K(hs),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Qi(ln),null;case 25:return null;default:return null}}function ug(e,n){switch(Eu(n),n.tag){case 3:Qi(ln),Vt();break;case 26:case 27:case 5:ye(n);break;case 4:Vt();break;case 31:n.memoizedState!==null&&Kn(n);break;case 13:Kn(n);break;case 19:K(sn);break;case 10:Qi(n.type);break;case 22:case 23:Kn(n),Bu(),e!==null&&K(hs);break;case 24:Qi(ln)}}function vo(e,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&e)===e){o=void 0;var h=a.create,S=a.inst;o=h(),S.destroy=o}a=a.next}while(a!==u)}}catch(A){Ve(n,n.return,A)}}function Oa(e,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var h=u.next;o=h;do{if((o.tag&e)===e){var S=o.inst,A=S.destroy;if(A!==void 0){S.destroy=void 0,u=n;var G=a,et=A;try{et()}catch(pt){Ve(u,G,pt)}}}o=o.next}while(o!==h)}}catch(pt){Ve(n,n.return,pt)}}function fg(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{em(n,a)}catch(o){Ve(e,e.return,o)}}}function hg(e,n,a){a.props=_s(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){Ve(e,n,o)}}function xo(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(u){Ve(e,n,u)}}function Ni(e,n){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Ve(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ve(e,n,u)}else a.current=null}function dg(e){var n=e.type,a=e.memoizedProps,o=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Ve(e,e.return,u)}}function _f(e,n,a){try{var o=e.stateNode;_S(o,e.type,a,n),o[Sn]=n}catch(u){Ve(e,e.return,u)}}function pg(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Ga(e.type)||e.tag===4}function vf(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||pg(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Ga(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function xf(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Yi));else if(o!==4&&(o===27&&Ga(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(xf(e,n,a),e=e.sibling;e!==null;)xf(e,n,a),e=e.sibling}function Xl(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(o!==4&&(o===27&&Ga(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Xl(e,n,a),e=e.sibling;e!==null;)Xl(e,n,a),e=e.sibling}function mg(e){var n=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);wn(n,o,a),n[on]=e,n[Sn]=a}catch(h){Ve(e,e.return,h)}}var ia=!1,fn=!1,Sf=!1,gg=typeof WeakSet=="function"?WeakSet:Set,_n=null;function Kx(e,n){if(e=e.containerInfo,Gf=fc,e=Cp(e),hu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,h=o.focusNode;o=o.focusOffset;try{a.nodeType,h.nodeType}catch{a=null;break t}var S=0,A=-1,G=-1,et=0,pt=0,_t=e,st=null;e:for(;;){for(var lt;_t!==a||u!==0&&_t.nodeType!==3||(A=S+u),_t!==h||o!==0&&_t.nodeType!==3||(G=S+o),_t.nodeType===3&&(S+=_t.nodeValue.length),(lt=_t.firstChild)!==null;)st=_t,_t=lt;for(;;){if(_t===e)break e;if(st===a&&++et===u&&(A=S),st===h&&++pt===o&&(G=S),(lt=_t.nextSibling)!==null)break;_t=st,st=_t.parentNode}_t=lt}a=A===-1||G===-1?null:{start:A,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(Vf={focusedElem:e,selectionRange:a},fc=!1,_n=n;_n!==null;)if(n=_n,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,_n=e;else for(;_n!==null;){switch(n=_n,h=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&h!==null){e=void 0,a=n,u=h.memoizedProps,h=h.memoizedState,o=a.stateNode;try{var Kt=_s(a.type,u);e=o.getSnapshotBeforeUpdate(Kt,h),o.__reactInternalSnapshotBeforeUpdate=e}catch(ue){Ve(a,a.return,ue)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)Wf(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Wf(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=n.sibling,e!==null){e.return=n.return,_n=e;break}_n=n.return}}function _g(e,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:sa(e,a),o&4&&vo(5,a);break;case 1:if(sa(e,a),o&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(S){Ve(a,a.return,S)}else{var u=_s(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(S){Ve(a,a.return,S)}}o&64&&fg(a),o&512&&xo(a,a.return);break;case 3:if(sa(e,a),o&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{em(e,n)}catch(S){Ve(a,a.return,S)}}break;case 27:n===null&&o&4&&mg(a);case 26:case 5:sa(e,a),n===null&&o&4&&dg(a),o&512&&xo(a,a.return);break;case 12:sa(e,a);break;case 31:sa(e,a),o&4&&Sg(e,a);break;case 13:sa(e,a),o&4&&yg(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=sS.bind(null,a),bS(e,a))));break;case 22:if(o=a.memoizedState!==null||ia,!o){n=n!==null&&n.memoizedState!==null||fn,u=ia;var h=fn;ia=o,(fn=n)&&!h?ra(e,a,(a.subtreeFlags&8772)!==0):sa(e,a),ia=u,fn=h}break;case 30:break;default:sa(e,a)}}function vg(e){var n=e.alternate;n!==null&&(e.alternate=null,vg(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&qr(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Qe=null,Hn=!1;function aa(e,n,a){for(a=a.child;a!==null;)xg(e,n,a),a=a.sibling}function xg(e,n,a){if(Ct&&typeof Ct.onCommitFiberUnmount=="function")try{Ct.onCommitFiberUnmount(Tt,a)}catch{}switch(a.tag){case 26:fn||Ni(a,n),aa(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:fn||Ni(a,n);var o=Qe,u=Hn;Ga(a.type)&&(Qe=a.stateNode,Hn=!1),aa(e,n,a),Co(a.stateNode),Qe=o,Hn=u;break;case 5:fn||Ni(a,n);case 6:if(o=Qe,u=Hn,Qe=null,aa(e,n,a),Qe=o,Hn=u,Qe!==null)if(Hn)try{(Qe.nodeType===9?Qe.body:Qe.nodeName==="HTML"?Qe.ownerDocument.body:Qe).removeChild(a.stateNode)}catch(h){Ve(a,n,h)}else try{Qe.removeChild(a.stateNode)}catch(h){Ve(a,n,h)}break;case 18:Qe!==null&&(Hn?(e=Qe,f0(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),pr(e)):f0(Qe,a.stateNode));break;case 4:o=Qe,u=Hn,Qe=a.stateNode.containerInfo,Hn=!0,aa(e,n,a),Qe=o,Hn=u;break;case 0:case 11:case 14:case 15:Oa(2,a,n),fn||Oa(4,a,n),aa(e,n,a);break;case 1:fn||(Ni(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&hg(a,n,o)),aa(e,n,a);break;case 21:aa(e,n,a);break;case 22:fn=(o=fn)||a.memoizedState!==null,aa(e,n,a),fn=o;break;default:aa(e,n,a)}}function Sg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{pr(e)}catch(a){Ve(n,n.return,a)}}}function yg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{pr(e)}catch(a){Ve(n,n.return,a)}}function Jx(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new gg),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new gg),n;default:throw Error(s(435,e.tag))}}function Wl(e,n){var a=Jx(e);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=rS.bind(null,e,o);o.then(u,u)}})}function Gn(e,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],h=e,S=n,A=S;t:for(;A!==null;){switch(A.tag){case 27:if(Ga(A.type)){Qe=A.stateNode,Hn=!1;break t}break;case 5:Qe=A.stateNode,Hn=!1;break t;case 3:case 4:Qe=A.stateNode.containerInfo,Hn=!0;break t}A=A.return}if(Qe===null)throw Error(s(160));xg(h,S,u),Qe=null,Hn=!1,h=u.alternate,h!==null&&(h.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Mg(n,e),n=n.sibling}var Si=null;function Mg(e,n){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Gn(n,e),Vn(e),o&4&&(Oa(3,e,e.return),vo(3,e),Oa(5,e,e.return));break;case 1:Gn(n,e),Vn(e),o&512&&(fn||a===null||Ni(a,a.return)),o&64&&ia&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Si;if(Gn(n,e),Vn(e),o&512&&(fn||a===null||Ni(a,a.return)),o&4){var h=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){t:{o=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(o){case"title":h=u.getElementsByTagName("title")[0],(!h||h[ns]||h[on]||h.namespaceURI==="http://www.w3.org/2000/svg"||h.hasAttribute("itemprop"))&&(h=u.createElement(o),u.head.insertBefore(h,u.querySelector("head > title"))),wn(h,o,a),h[on]=e,R(h),o=h;break t;case"link":var S=M0("link","href",u).get(o+(a.href||""));if(S){for(var A=0;A<S.length;A++)if(h=S[A],h.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&h.getAttribute("rel")===(a.rel==null?null:a.rel)&&h.getAttribute("title")===(a.title==null?null:a.title)&&h.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){S.splice(A,1);break e}}h=u.createElement(o),wn(h,o,a),u.head.appendChild(h);break;case"meta":if(S=M0("meta","content",u).get(o+(a.content||""))){for(A=0;A<S.length;A++)if(h=S[A],h.getAttribute("content")===(a.content==null?null:""+a.content)&&h.getAttribute("name")===(a.name==null?null:a.name)&&h.getAttribute("property")===(a.property==null?null:a.property)&&h.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&h.getAttribute("charset")===(a.charSet==null?null:a.charSet)){S.splice(A,1);break e}}h=u.createElement(o),wn(h,o,a),u.head.appendChild(h);break;default:throw Error(s(468,o))}h[on]=e,R(h),o=h}e.stateNode=o}else E0(u,e.type,e.stateNode);else e.stateNode=y0(u,o,e.memoizedProps);else h!==o?(h===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):h.count--,o===null?E0(u,e.type,e.stateNode):y0(u,o,e.memoizedProps)):o===null&&e.stateNode!==null&&_f(e,e.memoizedProps,a.memoizedProps)}break;case 27:Gn(n,e),Vn(e),o&512&&(fn||a===null||Ni(a,a.return)),a!==null&&o&4&&_f(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Gn(n,e),Vn(e),o&512&&(fn||a===null||Ni(a,a.return)),e.flags&32){u=e.stateNode;try{dn(u,"")}catch(Kt){Ve(e,e.return,Kt)}}o&4&&e.stateNode!=null&&(u=e.memoizedProps,_f(e,u,a!==null?a.memoizedProps:u)),o&1024&&(Sf=!0);break;case 6:if(Gn(n,e),Vn(e),o&4){if(e.stateNode===null)throw Error(s(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(Kt){Ve(e,e.return,Kt)}}break;case 3:if(oc=null,u=Si,Si=sc(n.containerInfo),Gn(n,e),Si=u,Vn(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{pr(n.containerInfo)}catch(Kt){Ve(e,e.return,Kt)}Sf&&(Sf=!1,Eg(e));break;case 4:o=Si,Si=sc(e.stateNode.containerInfo),Gn(n,e),Vn(e),Si=o;break;case 12:Gn(n,e),Vn(e);break;case 31:Gn(n,e),Vn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Wl(e,o)));break;case 13:Gn(n,e),Vn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Yl=E()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Wl(e,o)));break;case 22:u=e.memoizedState!==null;var G=a!==null&&a.memoizedState!==null,et=ia,pt=fn;if(ia=et||u,fn=pt||G,Gn(n,e),fn=pt,ia=et,Vn(e),o&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||G||ia||fn||vs(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){G=a=n;try{if(h=G.stateNode,u)S=h.style,typeof S.setProperty=="function"?S.setProperty("display","none","important"):S.display="none";else{A=G.stateNode;var _t=G.memoizedProps.style,st=_t!=null&&_t.hasOwnProperty("display")?_t.display:null;A.style.display=st==null||typeof st=="boolean"?"":(""+st).trim()}}catch(Kt){Ve(G,G.return,Kt)}}}else if(n.tag===6){if(a===null){G=n;try{G.stateNode.nodeValue=u?"":G.memoizedProps}catch(Kt){Ve(G,G.return,Kt)}}}else if(n.tag===18){if(a===null){G=n;try{var lt=G.stateNode;u?h0(lt,!0):h0(G.stateNode,!1)}catch(Kt){Ve(G,G.return,Kt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Wl(e,a))));break;case 19:Gn(n,e),Vn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Wl(e,o)));break;case 30:break;case 21:break;default:Gn(n,e),Vn(e)}}function Vn(e){var n=e.flags;if(n&2){try{for(var a,o=e.return;o!==null;){if(pg(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,h=vf(e);Xl(e,h,u);break;case 5:var S=a.stateNode;a.flags&32&&(dn(S,""),a.flags&=-33);var A=vf(e);Xl(e,A,S);break;case 3:case 4:var G=a.stateNode.containerInfo,et=vf(e);xf(e,et,G);break;default:throw Error(s(161))}}catch(pt){Ve(e,e.return,pt)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Eg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;Eg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function sa(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)_g(e,n.alternate,n),n=n.sibling}function vs(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:Oa(4,n,n.return),vs(n);break;case 1:Ni(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&hg(n,n.return,a),vs(n);break;case 27:Co(n.stateNode);case 26:case 5:Ni(n,n.return),vs(n);break;case 22:n.memoizedState===null&&vs(n);break;case 30:vs(n);break;default:vs(n)}e=e.sibling}}function ra(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=e,h=n,S=h.flags;switch(h.tag){case 0:case 11:case 15:ra(u,h,a),vo(4,h);break;case 1:if(ra(u,h,a),o=h,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(et){Ve(o,o.return,et)}if(o=h,u=o.updateQueue,u!==null){var A=o.stateNode;try{var G=u.shared.hiddenCallbacks;if(G!==null)for(u.shared.hiddenCallbacks=null,u=0;u<G.length;u++)tm(G[u],A)}catch(et){Ve(o,o.return,et)}}a&&S&64&&fg(h),xo(h,h.return);break;case 27:mg(h);case 26:case 5:ra(u,h,a),a&&o===null&&S&4&&dg(h),xo(h,h.return);break;case 12:ra(u,h,a);break;case 31:ra(u,h,a),a&&S&4&&Sg(u,h);break;case 13:ra(u,h,a),a&&S&4&&yg(u,h);break;case 22:h.memoizedState===null&&ra(u,h,a),xo(h,h.return);break;case 30:break;default:ra(u,h,a)}n=n.sibling}}function yf(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&ao(a))}function Mf(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&ao(e))}function yi(e,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)Tg(e,n,a,o),n=n.sibling}function Tg(e,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:yi(e,n,a,o),u&2048&&vo(9,n);break;case 1:yi(e,n,a,o);break;case 3:yi(e,n,a,o),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&ao(e)));break;case 12:if(u&2048){yi(e,n,a,o),e=n.stateNode;try{var h=n.memoizedProps,S=h.id,A=h.onPostCommit;typeof A=="function"&&A(S,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(G){Ve(n,n.return,G)}}else yi(e,n,a,o);break;case 31:yi(e,n,a,o);break;case 13:yi(e,n,a,o);break;case 23:break;case 22:h=n.stateNode,S=n.alternate,n.memoizedState!==null?h._visibility&2?yi(e,n,a,o):So(e,n):h._visibility&2?yi(e,n,a,o):(h._visibility|=2,ir(e,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&yf(S,n);break;case 24:yi(e,n,a,o),u&2048&&Mf(n.alternate,n);break;default:yi(e,n,a,o)}}function ir(e,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var h=e,S=n,A=a,G=o,et=S.flags;switch(S.tag){case 0:case 11:case 15:ir(h,S,A,G,u),vo(8,S);break;case 23:break;case 22:var pt=S.stateNode;S.memoizedState!==null?pt._visibility&2?ir(h,S,A,G,u):So(h,S):(pt._visibility|=2,ir(h,S,A,G,u)),u&&et&2048&&yf(S.alternate,S);break;case 24:ir(h,S,A,G,u),u&&et&2048&&Mf(S.alternate,S);break;default:ir(h,S,A,G,u)}n=n.sibling}}function So(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,o=n,u=o.flags;switch(o.tag){case 22:So(a,o),u&2048&&yf(o.alternate,o);break;case 24:So(a,o),u&2048&&Mf(o.alternate,o);break;default:So(a,o)}n=n.sibling}}var yo=8192;function ar(e,n,a){if(e.subtreeFlags&yo)for(e=e.child;e!==null;)bg(e,n,a),e=e.sibling}function bg(e,n,a){switch(e.tag){case 26:ar(e,n,a),e.flags&yo&&e.memoizedState!==null&&FS(a,Si,e.memoizedState,e.memoizedProps);break;case 5:ar(e,n,a);break;case 3:case 4:var o=Si;Si=sc(e.stateNode.containerInfo),ar(e,n,a),Si=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=yo,yo=16777216,ar(e,n,a),yo=o):ar(e,n,a));break;default:ar(e,n,a)}}function Ag(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Mo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];_n=o,Cg(o,e)}Ag(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Rg(e),e=e.sibling}function Rg(e){switch(e.tag){case 0:case 11:case 15:Mo(e),e.flags&2048&&Oa(9,e,e.return);break;case 3:Mo(e);break;case 12:Mo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,ql(e)):Mo(e);break;default:Mo(e)}}function ql(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];_n=o,Cg(o,e)}Ag(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Oa(8,n,n.return),ql(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,ql(n));break;default:ql(n)}e=e.sibling}}function Cg(e,n){for(;_n!==null;){var a=_n;switch(a.tag){case 0:case 11:case 15:Oa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:ao(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,_n=o;else t:for(a=e;_n!==null;){o=_n;var u=o.sibling,h=o.return;if(vg(o),o===a){_n=null;break t}if(u!==null){u.return=h,_n=u;break t}_n=h}}}var Qx={getCacheForType:function(e){var n=Rn(ln),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Rn(ln).controller.signal}},$x=typeof WeakMap=="function"?WeakMap:Map,ze=0,Ye=null,Me=null,be=0,Ge=0,Jn=null,Pa=!1,sr=!1,Ef=!1,oa=0,nn=0,za=0,xs=0,Tf=0,Qn=0,rr=0,Eo=null,kn=null,bf=!1,Yl=0,wg=0,jl=1/0,Zl=null,Fa=null,pn=0,Ba=null,or=null,la=0,Af=0,Rf=null,Dg=null,To=0,Cf=null;function $n(){return(ze&2)!==0&&be!==0?be&-be:B.T!==null?Of():Xr()}function Ug(){if(Qn===0)if((be&536870912)===0||Re){var e=wt;wt<<=1,(wt&3932160)===0&&(wt=262144),Qn=e}else Qn=536870912;return e=Zn.current,e!==null&&(e.flags|=32),Qn}function Xn(e,n,a){(e===Ye&&(Ge===2||Ge===9)||e.cancelPendingCommit!==null)&&(lr(e,0),Ia(e,be,Qn,!1)),Un(e,a),((ze&2)===0||e!==Ye)&&(e===Ye&&((ze&2)===0&&(xs|=a),nn===4&&Ia(e,be,Qn,!1)),Li(e))}function Ng(e,n,a){if((ze&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Lt(e,n),u=o?nS(e,n):Df(e,n,!0),h=o;do{if(u===0){sr&&!o&&Ia(e,n,0,!1);break}else{if(a=e.current.alternate,h&&!tS(a)){u=Df(e,n,!1),h=!1;continue}if(u===2){if(h=n,e.errorRecoveryDisabledLanes&h)var S=0;else S=e.pendingLanes&-536870913,S=S!==0?S:S&536870912?536870912:0;if(S!==0){n=S;t:{var A=e;u=Eo;var G=A.current.memoizedState.isDehydrated;if(G&&(lr(A,S).flags|=256),S=Df(A,S,!1),S!==2){if(Ef&&!G){A.errorRecoveryDisabledLanes|=h,xs|=h,u=4;break t}h=kn,kn=u,h!==null&&(kn===null?kn=h:kn.push.apply(kn,h))}u=S}if(h=!1,u!==2)continue}}if(u===1){lr(e,0),Ia(e,n,0,!0);break}t:{switch(o=e,h=u,h){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ia(o,n,Qn,!Pa);break t;case 2:kn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=Yl+300-E(),10<u)){if(Ia(o,n,Qn,!Pa),vt(o,0,!0)!==0)break t;la=n,o.timeoutHandle=c0(Lg.bind(null,o,a,kn,Zl,bf,n,Qn,xs,rr,Pa,h,"Throttled",-0,0),u);break t}Lg(o,a,kn,Zl,bf,n,Qn,xs,rr,Pa,h,null,-0,0)}}break}while(!0);Li(e)}function Lg(e,n,a,o,u,h,S,A,G,et,pt,_t,st,lt){if(e.timeoutHandle=-1,_t=n.subtreeFlags,_t&8192||(_t&16785408)===16785408){_t={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Yi},bg(n,h,_t);var Kt=(h&62914560)===h?Yl-E():(h&4194048)===h?wg-E():0;if(Kt=BS(_t,Kt),Kt!==null){la=h,e.cancelPendingCommit=Kt(Gg.bind(null,e,n,h,a,o,u,S,A,G,pt,_t,null,st,lt)),Ia(e,h,S,!et);return}}Gg(e,n,h,a,o,u,S,A,G)}function tS(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],h=u.getSnapshot;u=u.value;try{if(!Yn(h(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ia(e,n,a,o){n&=~Tf,n&=~xs,e.suspendedLanes|=n,e.pingedLanes&=~n,o&&(e.warmLanes|=n),o=e.expirationTimes;for(var u=n;0<u;){var h=31-kt(u),S=1<<h;o[h]=-1,u&=~S}a!==0&&ol(e,a,n)}function Kl(){return(ze&6)===0?(bo(0),!1):!0}function wf(){if(Me!==null){if(Ge===0)var e=Me.return;else e=Me,Ji=us=null,Xu(e),Qs=null,ro=0,e=Me;for(;e!==null;)ug(e.alternate,e),e=e.return;Me=null}}function lr(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,SS(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),la=0,wf(),Ye=e,Me=a=Zi(e.current,null),be=n,Ge=0,Jn=null,Pa=!1,sr=Lt(e,n),Ef=!1,rr=Qn=Tf=xs=za=nn=0,kn=Eo=null,bf=!1,(n&8)!==0&&(n|=n&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=n;0<o;){var u=31-kt(o),h=1<<u;n|=e[u],o&=~h}return oa=n,_l(),a}function Og(e,n){ge=null,B.H=mo,n===Js||n===bl?(n=Kp(),Ge=3):n===Nu?(n=Kp(),Ge=4):Ge=n===of?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,Jn=n,Me===null&&(nn=1,Il(e,oi(n,e.current)))}function Pg(){var e=Zn.current;return e===null?!0:(be&4194048)===be?fi===null:(be&62914560)===be||(be&536870912)!==0?e===fi:!1}function zg(){var e=B.H;return B.H=mo,e===null?mo:e}function Fg(){var e=B.A;return B.A=Qx,e}function Jl(){nn=4,Pa||(be&4194048)!==be&&Zn.current!==null||(sr=!0),(za&134217727)===0&&(xs&134217727)===0||Ye===null||Ia(Ye,be,Qn,!1)}function Df(e,n,a){var o=ze;ze|=2;var u=zg(),h=Fg();(Ye!==e||be!==n)&&(Zl=null,lr(e,n)),n=!1;var S=nn;t:do try{if(Ge!==0&&Me!==null){var A=Me,G=Jn;switch(Ge){case 8:wf(),S=6;break t;case 3:case 2:case 9:case 6:Zn.current===null&&(n=!0);var et=Ge;if(Ge=0,Jn=null,cr(e,A,G,et),a&&sr){S=0;break t}break;default:et=Ge,Ge=0,Jn=null,cr(e,A,G,et)}}eS(),S=nn;break}catch(pt){Og(e,pt)}while(!0);return n&&e.shellSuspendCounter++,Ji=us=null,ze=o,B.H=u,B.A=h,Me===null&&(Ye=null,be=0,_l()),S}function eS(){for(;Me!==null;)Bg(Me)}function nS(e,n){var a=ze;ze|=2;var o=zg(),u=Fg();Ye!==e||be!==n?(Zl=null,jl=E()+500,lr(e,n)):sr=Lt(e,n);t:do try{if(Ge!==0&&Me!==null){n=Me;var h=Jn;e:switch(Ge){case 1:Ge=0,Jn=null,cr(e,n,h,1);break;case 2:case 9:if(jp(h)){Ge=0,Jn=null,Ig(n);break}n=function(){Ge!==2&&Ge!==9||Ye!==e||(Ge=7),Li(e)},h.then(n,n);break t;case 3:Ge=7;break t;case 4:Ge=5;break t;case 7:jp(h)?(Ge=0,Jn=null,Ig(n)):(Ge=0,Jn=null,cr(e,n,h,7));break;case 5:var S=null;switch(Me.tag){case 26:S=Me.memoizedState;case 5:case 27:var A=Me;if(S?T0(S):A.stateNode.complete){Ge=0,Jn=null;var G=A.sibling;if(G!==null)Me=G;else{var et=A.return;et!==null?(Me=et,Ql(et)):Me=null}break e}}Ge=0,Jn=null,cr(e,n,h,5);break;case 6:Ge=0,Jn=null,cr(e,n,h,6);break;case 8:wf(),nn=6;break t;default:throw Error(s(462))}}iS();break}catch(pt){Og(e,pt)}while(!0);return Ji=us=null,B.H=o,B.A=u,ze=a,Me!==null?0:(Ye=null,be=0,_l(),nn)}function iS(){for(;Me!==null&&!Nt();)Bg(Me)}function Bg(e){var n=lg(e.alternate,e,oa);e.memoizedProps=e.pendingProps,n===null?Ql(e):Me=n}function Ig(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=ng(a,n,n.pendingProps,n.type,void 0,be);break;case 11:n=ng(a,n,n.pendingProps,n.type.render,n.ref,be);break;case 5:Xu(n);default:ug(a,n),n=Me=Fp(n,oa),n=lg(a,n,oa)}e.memoizedProps=e.pendingProps,n===null?Ql(e):Me=n}function cr(e,n,a,o){Ji=us=null,Xu(n),Qs=null,ro=0;var u=n.return;try{if(Wx(e,u,n,a,be)){nn=1,Il(e,oi(a,e.current)),Me=null;return}}catch(h){if(u!==null)throw Me=u,h;nn=1,Il(e,oi(a,e.current)),Me=null;return}n.flags&32768?(Re||o===1?e=!0:sr||(be&536870912)!==0?e=!1:(Pa=e=!0,(o===2||o===9||o===3||o===6)&&(o=Zn.current,o!==null&&o.tag===13&&(o.flags|=16384))),Hg(n,e)):Ql(n)}function Ql(e){var n=e;do{if((n.flags&32768)!==0){Hg(n,Pa);return}e=n.return;var a=jx(n.alternate,n,oa);if(a!==null){Me=a;return}if(n=n.sibling,n!==null){Me=n;return}Me=n=e}while(n!==null);nn===0&&(nn=5)}function Hg(e,n){do{var a=Zx(e.alternate,e);if(a!==null){a.flags&=32767,Me=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){Me=e;return}Me=e=a}while(e!==null);nn=6,Me=null}function Gg(e,n,a,o,u,h,S,A,G){e.cancelPendingCommit=null;do $l();while(pn!==0);if((ze&6)!==0)throw Error(s(327));if(n!==null){if(n===e.current)throw Error(s(177));if(h=n.lanes|n.childLanes,h|=_u,gi(e,a,h,S,A,G),e===Ye&&(Me=Ye=null,be=0),or=n,Ba=e,la=a,Af=h,Rf=u,Dg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,oS(ht,function(){return qg(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=B.T,B.T=null,u=H.p,H.p=2,S=ze,ze|=4;try{Kx(e,n,a)}finally{ze=S,H.p=u,B.T=o}}pn=1,Vg(),kg(),Xg()}}function Vg(){if(pn===1){pn=0;var e=Ba,n=or,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=B.T,B.T=null;var o=H.p;H.p=2;var u=ze;ze|=4;try{Mg(n,e);var h=Vf,S=Cp(e.containerInfo),A=h.focusedElem,G=h.selectionRange;if(S!==A&&A&&A.ownerDocument&&Rp(A.ownerDocument.documentElement,A)){if(G!==null&&hu(A)){var et=G.start,pt=G.end;if(pt===void 0&&(pt=et),"selectionStart"in A)A.selectionStart=et,A.selectionEnd=Math.min(pt,A.value.length);else{var _t=A.ownerDocument||document,st=_t&&_t.defaultView||window;if(st.getSelection){var lt=st.getSelection(),Kt=A.textContent.length,ue=Math.min(G.start,Kt),qe=G.end===void 0?ue:Math.min(G.end,Kt);!lt.extend&&ue>qe&&(S=qe,qe=ue,ue=S);var j=Ap(A,ue),k=Ap(A,qe);if(j&&k&&(lt.rangeCount!==1||lt.anchorNode!==j.node||lt.anchorOffset!==j.offset||lt.focusNode!==k.node||lt.focusOffset!==k.offset)){var tt=_t.createRange();tt.setStart(j.node,j.offset),lt.removeAllRanges(),ue>qe?(lt.addRange(tt),lt.extend(k.node,k.offset)):(tt.setEnd(k.node,k.offset),lt.addRange(tt))}}}}for(_t=[],lt=A;lt=lt.parentNode;)lt.nodeType===1&&_t.push({element:lt,left:lt.scrollLeft,top:lt.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<_t.length;A++){var mt=_t[A];mt.element.scrollLeft=mt.left,mt.element.scrollTop=mt.top}}fc=!!Gf,Vf=Gf=null}finally{ze=u,H.p=o,B.T=a}}e.current=n,pn=2}}function kg(){if(pn===2){pn=0;var e=Ba,n=or,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=B.T,B.T=null;var o=H.p;H.p=2;var u=ze;ze|=4;try{_g(e,n.alternate,n)}finally{ze=u,H.p=o,B.T=a}}pn=3}}function Xg(){if(pn===4||pn===3){pn=0,N();var e=Ba,n=or,a=la,o=Dg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?pn=5:(pn=0,or=Ba=null,Wg(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Fa=null),Os(a),n=n.stateNode,Ct&&typeof Ct.onCommitFiberRoot=="function")try{Ct.onCommitFiberRoot(Tt,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=B.T,u=H.p,H.p=2,B.T=null;try{for(var h=e.onRecoverableError,S=0;S<o.length;S++){var A=o[S];h(A.value,{componentStack:A.stack})}}finally{B.T=n,H.p=u}}(la&3)!==0&&$l(),Li(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===Cf?To++:(To=0,Cf=e):To=0,bo(0)}}function Wg(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,ao(n)))}function $l(){return Vg(),kg(),Xg(),qg()}function qg(){if(pn!==5)return!1;var e=Ba,n=Af;Af=0;var a=Os(la),o=B.T,u=H.p;try{H.p=32>a?32:a,B.T=null,a=Rf,Rf=null;var h=Ba,S=la;if(pn=0,or=Ba=null,la=0,(ze&6)!==0)throw Error(s(331));var A=ze;if(ze|=4,Rg(h.current),Tg(h,h.current,S,a),ze=A,bo(0,!1),Ct&&typeof Ct.onPostCommitFiberRoot=="function")try{Ct.onPostCommitFiberRoot(Tt,h)}catch{}return!0}finally{H.p=u,B.T=o,Wg(e,n)}}function Yg(e,n,a){n=oi(a,n),n=rf(e.stateNode,n,2),e=Ua(e,n,2),e!==null&&(Un(e,2),Li(e))}function Ve(e,n,a){if(e.tag===3)Yg(e,e,a);else for(;n!==null;){if(n.tag===3){Yg(n,e,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Fa===null||!Fa.has(o))){e=oi(a,e),a=jm(2),o=Ua(n,a,2),o!==null&&(Zm(a,o,n,e),Un(o,2),Li(o));break}}n=n.return}}function Uf(e,n,a){var o=e.pingCache;if(o===null){o=e.pingCache=new $x;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Ef=!0,u.add(a),e=aS.bind(null,e,n,a),n.then(e,e))}function aS(e,n,a){var o=e.pingCache;o!==null&&o.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Ye===e&&(be&a)===a&&(nn===4||nn===3&&(be&62914560)===be&&300>E()-Yl?(ze&2)===0&&lr(e,0):Tf|=a,rr===be&&(rr=0)),Li(e)}function jg(e,n){n===0&&(n=Ie()),e=os(e,n),e!==null&&(Un(e,n),Li(e))}function sS(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),jg(e,a)}function rS(e,n){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),jg(e,a)}function oS(e,n){return Gt(e,n)}var tc=null,ur=null,Nf=!1,ec=!1,Lf=!1,Ha=0;function Li(e){e!==ur&&e.next===null&&(ur===null?tc=ur=e:ur=ur.next=e),ec=!0,Nf||(Nf=!0,cS())}function bo(e,n){if(!Lf&&ec){Lf=!0;do for(var a=!1,o=tc;o!==null;){if(e!==0){var u=o.pendingLanes;if(u===0)var h=0;else{var S=o.suspendedLanes,A=o.pingedLanes;h=(1<<31-kt(42|e)+1)-1,h&=u&~(S&~A),h=h&201326741?h&201326741|1:h?h|2:0}h!==0&&(a=!0,Qg(o,h))}else h=be,h=vt(o,o===Ye?h:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(h&3)===0||Lt(o,h)||(a=!0,Qg(o,h));o=o.next}while(a);Lf=!1}}function lS(){Zg()}function Zg(){ec=Nf=!1;var e=0;Ha!==0&&xS()&&(e=Ha);for(var n=E(),a=null,o=tc;o!==null;){var u=o.next,h=Kg(o,n);h===0?(o.next=null,a===null?tc=u:a.next=u,u===null&&(ur=a)):(a=o,(e!==0||(h&3)!==0)&&(ec=!0)),o=u}pn!==0&&pn!==5||bo(e),Ha!==0&&(Ha=0)}function Kg(e,n){for(var a=e.suspendedLanes,o=e.pingedLanes,u=e.expirationTimes,h=e.pendingLanes&-62914561;0<h;){var S=31-kt(h),A=1<<S,G=u[S];G===-1?((A&a)===0||(A&o)!==0)&&(u[S]=he(A,n)):G<=n&&(e.expiredLanes|=A),h&=~A}if(n=Ye,a=be,a=vt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===n&&(Ge===2||Ge===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&se(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Lt(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(o!==null&&se(o),Os(a)){case 2:case 8:a=St;break;case 32:a=ht;break;case 268435456:a=Ot;break;default:a=ht}return o=Jg.bind(null,e),a=Gt(a,o),e.callbackPriority=n,e.callbackNode=a,n}return o!==null&&o!==null&&se(o),e.callbackPriority=2,e.callbackNode=null,2}function Jg(e,n){if(pn!==0&&pn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if($l()&&e.callbackNode!==a)return null;var o=be;return o=vt(e,e===Ye?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Ng(e,o,n),Kg(e,E()),e.callbackNode!=null&&e.callbackNode===a?Jg.bind(null,e):null)}function Qg(e,n){if($l())return null;Ng(e,n,!0)}function cS(){yS(function(){(ze&6)!==0?Gt(ut,lS):Zg()})}function Of(){if(Ha===0){var e=Zs;e===0&&(e=Ft,Ft<<=1,(Ft&261888)===0&&(Ft=256)),Ha=e}return Ha}function $g(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:cl(""+e)}function t0(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function uS(e,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var h=$g((u[Sn]||null).action),S=o.submitter;S&&(n=(n=S[Sn]||null)?$g(n.formAction):S.getAttribute("formAction"),n!==null&&(h=n,S=null));var A=new dl("action","action",null,o,u);e.push({event:A,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Ha!==0){var G=S?t0(u,S):new FormData(u);$u(a,{pending:!0,data:G,method:u.method,action:h},null,G)}}else typeof h=="function"&&(A.preventDefault(),G=S?t0(u,S):new FormData(u),$u(a,{pending:!0,data:G,method:u.method,action:h},h,G))},currentTarget:u}]})}}for(var Pf=0;Pf<gu.length;Pf++){var zf=gu[Pf],fS=zf.toLowerCase(),hS=zf[0].toUpperCase()+zf.slice(1);xi(fS,"on"+hS)}xi(Up,"onAnimationEnd"),xi(Np,"onAnimationIteration"),xi(Lp,"onAnimationStart"),xi("dblclick","onDoubleClick"),xi("focusin","onFocus"),xi("focusout","onBlur"),xi(Cx,"onTransitionRun"),xi(wx,"onTransitionStart"),xi(Dx,"onTransitionCancel"),xi(Op,"onTransitionEnd"),J("onMouseEnter",["mouseout","mouseover"]),J("onMouseLeave",["mouseout","mouseover"]),J("onPointerEnter",["pointerout","pointerover"]),J("onPointerLeave",["pointerout","pointerover"]),at("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),at("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),at("onBeforeInput",["compositionend","keypress","textInput","paste"]),at("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),at("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),at("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),dS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ao));function e0(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],u=o.event;o=o.listeners;t:{var h=void 0;if(n)for(var S=o.length-1;0<=S;S--){var A=o[S],G=A.instance,et=A.currentTarget;if(A=A.listener,G!==h&&u.isPropagationStopped())break t;h=A,u.currentTarget=et;try{h(u)}catch(pt){gl(pt)}u.currentTarget=null,h=G}else for(S=0;S<o.length;S++){if(A=o[S],G=A.instance,et=A.currentTarget,A=A.listener,G!==h&&u.isPropagationStopped())break t;h=A,u.currentTarget=et;try{h(u)}catch(pt){gl(pt)}u.currentTarget=null,h=G}}}}function Ee(e,n){var a=n[Ps];a===void 0&&(a=n[Ps]=new Set);var o=e+"__bubble";a.has(o)||(n0(n,e,2,!1),a.add(o))}function Ff(e,n,a){var o=0;n&&(o|=4),n0(a,e,o,n)}var nc="_reactListening"+Math.random().toString(36).slice(2);function Bf(e){if(!e[nc]){e[nc]=!0,Y.forEach(function(a){a!=="selectionchange"&&(dS.has(a)||Ff(a,!1,e),Ff(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[nc]||(n[nc]=!0,Ff("selectionchange",!1,n))}}function n0(e,n,a,o){switch(U0(n)){case 2:var u=GS;break;case 8:u=VS;break;default:u=$f}a=u.bind(null,n,a,e),u=void 0,!iu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function If(e,n,a,o,u){var h=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var S=o.tag;if(S===3||S===4){var A=o.stateNode.containerInfo;if(A===u)break;if(S===4)for(S=o.return;S!==null;){var G=S.tag;if((G===3||G===4)&&S.stateNode.containerInfo===u)return;S=S.return}for(;A!==null;){if(S=ya(A),S===null)return;if(G=S.tag,G===5||G===6||G===26||G===27){o=h=S;continue t}A=A.parentNode}}o=o.return}op(function(){var et=h,pt=eu(a),_t=[];t:{var st=Pp.get(e);if(st!==void 0){var lt=dl,Kt=e;switch(e){case"keypress":if(fl(a)===0)break t;case"keydown":case"keyup":lt=rx;break;case"focusin":Kt="focus",lt=ou;break;case"focusout":Kt="blur",lt=ou;break;case"beforeblur":case"afterblur":lt=ou;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":lt=up;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":lt=jv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":lt=cx;break;case Up:case Np:case Lp:lt=Jv;break;case Op:lt=fx;break;case"scroll":case"scrollend":lt=qv;break;case"wheel":lt=dx;break;case"copy":case"cut":case"paste":lt=$v;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":lt=hp;break;case"toggle":case"beforetoggle":lt=mx}var ue=(n&4)!==0,qe=!ue&&(e==="scroll"||e==="scrollend"),j=ue?st!==null?st+"Capture":null:st;ue=[];for(var k=et,tt;k!==null;){var mt=k;if(tt=mt.stateNode,mt=mt.tag,mt!==5&&mt!==26&&mt!==27||tt===null||j===null||(mt=Yr(k,j),mt!=null&&ue.push(Ro(k,mt,tt))),qe)break;k=k.return}0<ue.length&&(st=new lt(st,Kt,null,a,pt),_t.push({event:st,listeners:ue}))}}if((n&7)===0){t:{if(st=e==="mouseover"||e==="pointerover",lt=e==="mouseout"||e==="pointerout",st&&a!==tu&&(Kt=a.relatedTarget||a.fromElement)&&(ya(Kt)||Kt[_i]))break t;if((lt||st)&&(st=pt.window===pt?pt:(st=pt.ownerDocument)?st.defaultView||st.parentWindow:window,lt?(Kt=a.relatedTarget||a.toElement,lt=et,Kt=Kt?ya(Kt):null,Kt!==null&&(qe=c(Kt),ue=Kt.tag,Kt!==qe||ue!==5&&ue!==27&&ue!==6)&&(Kt=null)):(lt=null,Kt=et),lt!==Kt)){if(ue=up,mt="onMouseLeave",j="onMouseEnter",k="mouse",(e==="pointerout"||e==="pointerover")&&(ue=hp,mt="onPointerLeave",j="onPointerEnter",k="pointer"),qe=lt==null?st:is(lt),tt=Kt==null?st:is(Kt),st=new ue(mt,k+"leave",lt,a,pt),st.target=qe,st.relatedTarget=tt,mt=null,ya(pt)===et&&(ue=new ue(j,k+"enter",Kt,a,pt),ue.target=tt,ue.relatedTarget=qe,mt=ue),qe=mt,lt&&Kt)e:{for(ue=pS,j=lt,k=Kt,tt=0,mt=j;mt;mt=ue(mt))tt++;mt=0;for(var re=k;re;re=ue(re))mt++;for(;0<tt-mt;)j=ue(j),tt--;for(;0<mt-tt;)k=ue(k),mt--;for(;tt--;){if(j===k||k!==null&&j===k.alternate){ue=j;break e}j=ue(j),k=ue(k)}ue=null}else ue=null;lt!==null&&i0(_t,st,lt,ue,!1),Kt!==null&&qe!==null&&i0(_t,qe,Kt,ue,!0)}}t:{if(st=et?is(et):window,lt=st.nodeName&&st.nodeName.toLowerCase(),lt==="select"||lt==="input"&&st.type==="file")var Ne=Sp;else if(vp(st))if(yp)Ne=bx;else{Ne=Ex;var ne=Mx}else lt=st.nodeName,!lt||lt.toLowerCase()!=="input"||st.type!=="checkbox"&&st.type!=="radio"?et&&vi(et.elementType)&&(Ne=Sp):Ne=Tx;if(Ne&&(Ne=Ne(e,et))){xp(_t,Ne,a,pt);break t}ne&&ne(e,st,et),e==="focusout"&&et&&st.type==="number"&&et.memoizedProps.value!=null&&Mn(st,"number",st.value)}switch(ne=et?is(et):window,e){case"focusin":(vp(ne)||ne.contentEditable==="true")&&(Gs=ne,du=et,eo=null);break;case"focusout":eo=du=Gs=null;break;case"mousedown":pu=!0;break;case"contextmenu":case"mouseup":case"dragend":pu=!1,wp(_t,a,pt);break;case"selectionchange":if(Rx)break;case"keydown":case"keyup":wp(_t,a,pt)}var ve;if(cu)t:{switch(e){case"compositionstart":var Ae="onCompositionStart";break t;case"compositionend":Ae="onCompositionEnd";break t;case"compositionupdate":Ae="onCompositionUpdate";break t}Ae=void 0}else Hs?gp(e,a)&&(Ae="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Ae="onCompositionStart");Ae&&(dp&&a.locale!=="ko"&&(Hs||Ae!=="onCompositionStart"?Ae==="onCompositionEnd"&&Hs&&(ve=lp()):(Ta=pt,au="value"in Ta?Ta.value:Ta.textContent,Hs=!0)),ne=ic(et,Ae),0<ne.length&&(Ae=new fp(Ae,e,null,a,pt),_t.push({event:Ae,listeners:ne}),ve?Ae.data=ve:(ve=_p(a),ve!==null&&(Ae.data=ve)))),(ve=_x?vx(e,a):xx(e,a))&&(Ae=ic(et,"onBeforeInput"),0<Ae.length&&(ne=new fp("onBeforeInput","beforeinput",null,a,pt),_t.push({event:ne,listeners:Ae}),ne.data=ve)),uS(_t,e,et,a,pt)}e0(_t,n)})}function Ro(e,n,a){return{instance:e,listener:n,currentTarget:a}}function ic(e,n){for(var a=n+"Capture",o=[];e!==null;){var u=e,h=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||h===null||(u=Yr(e,a),u!=null&&o.unshift(Ro(e,u,h)),u=Yr(e,n),u!=null&&o.push(Ro(e,u,h))),e.tag===3)return o;e=e.return}return[]}function pS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function i0(e,n,a,o,u){for(var h=n._reactName,S=[];a!==null&&a!==o;){var A=a,G=A.alternate,et=A.stateNode;if(A=A.tag,G!==null&&G===o)break;A!==5&&A!==26&&A!==27||et===null||(G=et,u?(et=Yr(a,h),et!=null&&S.unshift(Ro(a,et,G))):u||(et=Yr(a,h),et!=null&&S.push(Ro(a,et,G)))),a=a.return}S.length!==0&&e.push({event:n,listeners:S})}var mS=/\r\n?/g,gS=/\u0000|\uFFFD/g;function a0(e){return(typeof e=="string"?e:""+e).replace(mS,`
`).replace(gS,"")}function s0(e,n){return n=a0(n),a0(e)===n}function We(e,n,a,o,u,h){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||dn(e,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&dn(e,""+o);break;case"className":oe(e,"class",o);break;case"tabIndex":oe(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":oe(e,a,o);break;case"style":Fs(e,o,h);break;case"data":if(n!=="object"){oe(e,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=cl(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof h=="function"&&(a==="formAction"?(n!=="input"&&We(e,n,"name",u.name,u,null),We(e,n,"formEncType",u.formEncType,u,null),We(e,n,"formMethod",u.formMethod,u,null),We(e,n,"formTarget",u.formTarget,u,null)):(We(e,n,"encType",u.encType,u,null),We(e,n,"method",u.method,u,null),We(e,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=cl(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"onScroll":o!=null&&Ee("scroll",e);break;case"onScrollEnd":o!=null&&Ee("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=cl(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":Ee("beforetoggle",e),Ee("toggle",e),$t(e,"popover",o);break;case"xlinkActuate":te(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":te(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":te(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":te(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":te(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":te(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":te(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":te(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":te(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":$t(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Xv.get(a)||a,$t(e,a,o))}}function Hf(e,n,a,o,u,h){switch(a){case"style":Fs(e,o,h);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof o=="string"?dn(e,o):(typeof o=="number"||typeof o=="bigint")&&dn(e,""+o);break;case"onScroll":o!=null&&Ee("scroll",e);break;case"onScrollEnd":o!=null&&Ee("scrollend",e);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ot.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),h=e[Sn]||null,h=h!=null?h[a]:null,typeof h=="function"&&e.removeEventListener(n,h,u),typeof o=="function")){typeof h!="function"&&h!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,o,u);break t}a in e?e[a]=o:o===!0?e.setAttribute(a,""):$t(e,a,o)}}}function wn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Ee("error",e),Ee("load",e);var o=!1,u=!1,h;for(h in a)if(a.hasOwnProperty(h)){var S=a[h];if(S!=null)switch(h){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:We(e,n,h,S,a,null)}}u&&We(e,n,"srcSet",a.srcSet,a,null),o&&We(e,n,"src",a.src,a,null);return;case"input":Ee("invalid",e);var A=h=S=u=null,G=null,et=null;for(o in a)if(a.hasOwnProperty(o)){var pt=a[o];if(pt!=null)switch(o){case"name":u=pt;break;case"type":S=pt;break;case"checked":G=pt;break;case"defaultChecked":et=pt;break;case"value":h=pt;break;case"defaultValue":A=pt;break;case"children":case"dangerouslySetInnerHTML":if(pt!=null)throw Error(s(137,n));break;default:We(e,n,o,pt,a,null)}}qi(e,h,A,G,et,S,u,!1);return;case"select":Ee("invalid",e),o=S=h=null;for(u in a)if(a.hasOwnProperty(u)&&(A=a[u],A!=null))switch(u){case"value":h=A;break;case"defaultValue":S=A;break;case"multiple":o=A;default:We(e,n,u,A,a,null)}n=h,a=S,e.multiple=!!o,n!=null?si(e,!!o,n,!1):a!=null&&si(e,!!o,a,!0);return;case"textarea":Ee("invalid",e),h=u=o=null;for(S in a)if(a.hasOwnProperty(S)&&(A=a[S],A!=null))switch(S){case"value":o=A;break;case"defaultValue":u=A;break;case"children":h=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(s(91));break;default:We(e,n,S,A,a,null)}En(e,o,u,h);return;case"option":for(G in a)if(a.hasOwnProperty(G)&&(o=a[G],o!=null))switch(G){case"selected":e.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:We(e,n,G,o,a,null)}return;case"dialog":Ee("beforetoggle",e),Ee("toggle",e),Ee("cancel",e),Ee("close",e);break;case"iframe":case"object":Ee("load",e);break;case"video":case"audio":for(o=0;o<Ao.length;o++)Ee(Ao[o],e);break;case"image":Ee("error",e),Ee("load",e);break;case"details":Ee("toggle",e);break;case"embed":case"source":case"link":Ee("error",e),Ee("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(et in a)if(a.hasOwnProperty(et)&&(o=a[et],o!=null))switch(et){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:We(e,n,et,o,a,null)}return;default:if(vi(n)){for(pt in a)a.hasOwnProperty(pt)&&(o=a[pt],o!==void 0&&Hf(e,n,pt,o,a,void 0));return}}for(A in a)a.hasOwnProperty(A)&&(o=a[A],o!=null&&We(e,n,A,o,a,null))}function _S(e,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,h=null,S=null,A=null,G=null,et=null,pt=null;for(lt in a){var _t=a[lt];if(a.hasOwnProperty(lt)&&_t!=null)switch(lt){case"checked":break;case"value":break;case"defaultValue":G=_t;default:o.hasOwnProperty(lt)||We(e,n,lt,null,o,_t)}}for(var st in o){var lt=o[st];if(_t=a[st],o.hasOwnProperty(st)&&(lt!=null||_t!=null))switch(st){case"type":h=lt;break;case"name":u=lt;break;case"checked":et=lt;break;case"defaultChecked":pt=lt;break;case"value":S=lt;break;case"defaultValue":A=lt;break;case"children":case"dangerouslySetInnerHTML":if(lt!=null)throw Error(s(137,n));break;default:lt!==_t&&We(e,n,st,lt,o,_t)}}yn(e,S,A,G,et,pt,h,u);return;case"select":lt=S=A=st=null;for(h in a)if(G=a[h],a.hasOwnProperty(h)&&G!=null)switch(h){case"value":break;case"multiple":lt=G;default:o.hasOwnProperty(h)||We(e,n,h,null,o,G)}for(u in o)if(h=o[u],G=a[u],o.hasOwnProperty(u)&&(h!=null||G!=null))switch(u){case"value":st=h;break;case"defaultValue":A=h;break;case"multiple":S=h;default:h!==G&&We(e,n,u,h,o,G)}n=A,a=S,o=lt,st!=null?si(e,!!a,st,!1):!!o!=!!a&&(n!=null?si(e,!!a,n,!0):si(e,!!a,a?[]:"",!1));return;case"textarea":lt=st=null;for(A in a)if(u=a[A],a.hasOwnProperty(A)&&u!=null&&!o.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:We(e,n,A,null,o,u)}for(S in o)if(u=o[S],h=a[S],o.hasOwnProperty(S)&&(u!=null||h!=null))switch(S){case"value":st=u;break;case"defaultValue":lt=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==h&&We(e,n,S,u,o,h)}He(e,st,lt);return;case"option":for(var Kt in a)if(st=a[Kt],a.hasOwnProperty(Kt)&&st!=null&&!o.hasOwnProperty(Kt))switch(Kt){case"selected":e.selected=!1;break;default:We(e,n,Kt,null,o,st)}for(G in o)if(st=o[G],lt=a[G],o.hasOwnProperty(G)&&st!==lt&&(st!=null||lt!=null))switch(G){case"selected":e.selected=st&&typeof st!="function"&&typeof st!="symbol";break;default:We(e,n,G,st,o,lt)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ue in a)st=a[ue],a.hasOwnProperty(ue)&&st!=null&&!o.hasOwnProperty(ue)&&We(e,n,ue,null,o,st);for(et in o)if(st=o[et],lt=a[et],o.hasOwnProperty(et)&&st!==lt&&(st!=null||lt!=null))switch(et){case"children":case"dangerouslySetInnerHTML":if(st!=null)throw Error(s(137,n));break;default:We(e,n,et,st,o,lt)}return;default:if(vi(n)){for(var qe in a)st=a[qe],a.hasOwnProperty(qe)&&st!==void 0&&!o.hasOwnProperty(qe)&&Hf(e,n,qe,void 0,o,st);for(pt in o)st=o[pt],lt=a[pt],!o.hasOwnProperty(pt)||st===lt||st===void 0&&lt===void 0||Hf(e,n,pt,st,o,lt);return}}for(var j in a)st=a[j],a.hasOwnProperty(j)&&st!=null&&!o.hasOwnProperty(j)&&We(e,n,j,null,o,st);for(_t in o)st=o[_t],lt=a[_t],!o.hasOwnProperty(_t)||st===lt||st==null&&lt==null||We(e,n,_t,st,o,lt)}function r0(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function vS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],h=u.transferSize,S=u.initiatorType,A=u.duration;if(h&&A&&r0(S)){for(S=0,A=u.responseEnd,o+=1;o<a.length;o++){var G=a[o],et=G.startTime;if(et>A)break;var pt=G.transferSize,_t=G.initiatorType;pt&&r0(_t)&&(G=G.responseEnd,S+=pt*(G<A?1:(A-et)/(G-et)))}if(--o,n+=8*(h+S)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Gf=null,Vf=null;function ac(e){return e.nodeType===9?e:e.ownerDocument}function o0(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function l0(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function kf(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Xf=null;function xS(){var e=window.event;return e&&e.type==="popstate"?e===Xf?!1:(Xf=e,!0):(Xf=null,!1)}var c0=typeof setTimeout=="function"?setTimeout:void 0,SS=typeof clearTimeout=="function"?clearTimeout:void 0,u0=typeof Promise=="function"?Promise:void 0,yS=typeof queueMicrotask=="function"?queueMicrotask:typeof u0<"u"?function(e){return u0.resolve(null).then(e).catch(MS)}:c0;function MS(e){setTimeout(function(){throw e})}function Ga(e){return e==="head"}function f0(e,n){var a=n,o=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(u),pr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Co(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Co(a);for(var h=a.firstChild;h;){var S=h.nextSibling,A=h.nodeName;h[ns]||A==="SCRIPT"||A==="STYLE"||A==="LINK"&&h.rel.toLowerCase()==="stylesheet"||a.removeChild(h),h=S}}else a==="body"&&Co(e.ownerDocument.body);a=u}while(a);pr(n)}function h0(e,n){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function Wf(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Wf(a),qr(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function ES(e,n,a,o){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[ns])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(h=e.getAttribute("rel"),h==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(h!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(h=e.getAttribute("src"),(h!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&h&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var h=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===h)return e}else return e;if(e=hi(e.nextSibling),e===null)break}return null}function TS(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=hi(e.nextSibling),e===null))return null;return e}function d0(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=hi(e.nextSibling),e===null))return null;return e}function qf(e){return e.data==="$?"||e.data==="$~"}function Yf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function bS(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function hi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var jf=null;function p0(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return hi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function m0(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function g0(e,n,a){switch(n=ac(a),e){case"html":if(e=n.documentElement,!e)throw Error(s(452));return e;case"head":if(e=n.head,!e)throw Error(s(453));return e;case"body":if(e=n.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function Co(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);qr(e)}var di=new Map,_0=new Set;function sc(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ca=H.d;H.d={f:AS,r:RS,D:CS,C:wS,L:DS,m:US,X:LS,S:NS,M:OS};function AS(){var e=ca.f(),n=Kl();return e||n}function RS(e){var n=Ma(e);n!==null&&n.tag===5&&n.type==="form"?Om(n):ca.r(e)}var fr=typeof document>"u"?null:document;function v0(e,n,a){var o=fr;if(o&&typeof n=="string"&&n){var u=de(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),_0.has(u)||(_0.add(u),e={rel:e,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),wn(n,"link",e),R(n),o.head.appendChild(n)))}}function CS(e){ca.D(e),v0("dns-prefetch",e,null)}function wS(e,n){ca.C(e,n),v0("preconnect",e,n)}function DS(e,n,a){ca.L(e,n,a);var o=fr;if(o&&e&&n){var u='link[rel="preload"][as="'+de(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+de(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+de(a.imageSizes)+'"]')):u+='[href="'+de(e)+'"]';var h=u;switch(n){case"style":h=hr(e);break;case"script":h=dr(e)}di.has(h)||(e=_({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),di.set(h,e),o.querySelector(u)!==null||n==="style"&&o.querySelector(wo(h))||n==="script"&&o.querySelector(Do(h))||(n=o.createElement("link"),wn(n,"link",e),R(n),o.head.appendChild(n)))}}function US(e,n){ca.m(e,n);var a=fr;if(a&&e){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+de(o)+'"][href="'+de(e)+'"]',h=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":h=dr(e)}if(!di.has(h)&&(e=_({rel:"modulepreload",href:e},n),di.set(h,e),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Do(h)))return}o=a.createElement("link"),wn(o,"link",e),R(o),a.head.appendChild(o)}}}function NS(e,n,a){ca.S(e,n,a);var o=fr;if(o&&e){var u=Ea(o).hoistableStyles,h=hr(e);n=n||"default";var S=u.get(h);if(!S){var A={loading:0,preload:null};if(S=o.querySelector(wo(h)))A.loading=5;else{e=_({rel:"stylesheet",href:e,"data-precedence":n},a),(a=di.get(h))&&Zf(e,a);var G=S=o.createElement("link");R(G),wn(G,"link",e),G._p=new Promise(function(et,pt){G.onload=et,G.onerror=pt}),G.addEventListener("load",function(){A.loading|=1}),G.addEventListener("error",function(){A.loading|=2}),A.loading|=4,rc(S,n,o)}S={type:"stylesheet",instance:S,count:1,state:A},u.set(h,S)}}}function LS(e,n){ca.X(e,n);var a=fr;if(a&&e){var o=Ea(a).hoistableScripts,u=dr(e),h=o.get(u);h||(h=a.querySelector(Do(u)),h||(e=_({src:e,async:!0},n),(n=di.get(u))&&Kf(e,n),h=a.createElement("script"),R(h),wn(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},o.set(u,h))}}function OS(e,n){ca.M(e,n);var a=fr;if(a&&e){var o=Ea(a).hoistableScripts,u=dr(e),h=o.get(u);h||(h=a.querySelector(Do(u)),h||(e=_({src:e,async:!0,type:"module"},n),(n=di.get(u))&&Kf(e,n),h=a.createElement("script"),R(h),wn(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},o.set(u,h))}}function x0(e,n,a,o){var u=(u=Q.current)?sc(u):null;if(!u)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=hr(a.href),a=Ea(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=hr(a.href);var h=Ea(u).hoistableStyles,S=h.get(e);if(S||(u=u.ownerDocument||u,S={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},h.set(e,S),(h=u.querySelector(wo(e)))&&!h._p&&(S.instance=h,S.state.loading=5),di.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},di.set(e,a),h||PS(u,e,a,S.state))),n&&o===null)throw Error(s(528,""));return S}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=dr(a),a=Ea(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function hr(e){return'href="'+de(e)+'"'}function wo(e){return'link[rel="stylesheet"]['+e+"]"}function S0(e){return _({},e,{"data-precedence":e.precedence,precedence:null})}function PS(e,n,a,o){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=e.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),wn(n,"link",a),R(n),e.head.appendChild(n))}function dr(e){return'[src="'+de(e)+'"]'}function Do(e){return"script[async]"+e}function y0(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=e.querySelector('style[data-href~="'+de(a.href)+'"]');if(o)return n.instance=o,R(o),o;var u=_({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),R(o),wn(o,"style",u),rc(o,a.precedence,e),n.instance=o;case"stylesheet":u=hr(a.href);var h=e.querySelector(wo(u));if(h)return n.state.loading|=4,n.instance=h,R(h),h;o=S0(a),(u=di.get(u))&&Zf(o,u),h=(e.ownerDocument||e).createElement("link"),R(h);var S=h;return S._p=new Promise(function(A,G){S.onload=A,S.onerror=G}),wn(h,"link",o),n.state.loading|=4,rc(h,a.precedence,e),n.instance=h;case"script":return h=dr(a.src),(u=e.querySelector(Do(h)))?(n.instance=u,R(u),u):(o=a,(u=di.get(h))&&(o=_({},a),Kf(o,u)),e=e.ownerDocument||e,u=e.createElement("script"),R(u),wn(u,"link",o),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,rc(o,a.precedence,e));return n.instance}function rc(e,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,h=u,S=0;S<o.length;S++){var A=o[S];if(A.dataset.precedence===n)h=A;else if(h!==u)break}h?h.parentNode.insertBefore(e,h.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Zf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Kf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var oc=null;function M0(e,n,a){if(oc===null){var o=new Map,u=oc=new Map;u.set(a,o)}else u=oc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var h=a[u];if(!(h[ns]||h[on]||e==="link"&&h.getAttribute("rel")==="stylesheet")&&h.namespaceURI!=="http://www.w3.org/2000/svg"){var S=h.getAttribute(n)||"";S=e+S;var A=o.get(S);A?A.push(h):o.set(S,[h])}}return o}function E0(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function zS(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function T0(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function FS(e,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=hr(o.href),h=n.querySelector(wo(u));if(h){n=h._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=lc.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=h,R(h);return}h=n.ownerDocument||n,o=S0(o),(u=di.get(u))&&Zf(o,u),h=h.createElement("link"),R(h);var S=h;S._p=new Promise(function(A,G){S.onload=A,S.onerror=G}),wn(h,"link",o),a.instance=h}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=lc.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var Jf=0;function BS(e,n){return e.stylesheets&&e.count===0&&uc(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&uc(e,e.stylesheets),e.unsuspend){var h=e.unsuspend;e.unsuspend=null,h()}},6e4+n);0<e.imgBytes&&Jf===0&&(Jf=62500*vS());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&uc(e,e.stylesheets),e.unsuspend)){var h=e.unsuspend;e.unsuspend=null,h()}},(e.imgBytes>Jf?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function lc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)uc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var cc=null;function uc(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,cc=new Map,n.forEach(IS,e),cc=null,lc.call(e))}function IS(e,n){if(!(n.state.loading&4)){var a=cc.get(e);if(a)var o=a.get(null);else{a=new Map,cc.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),h=0;h<u.length;h++){var S=u[h];(S.nodeName==="LINK"||S.getAttribute("media")!=="not all")&&(a.set(S.dataset.precedence,S),o=S)}o&&a.set(null,o)}u=n.instance,S=u.getAttribute("data-precedence"),h=a.get(S)||o,h===o&&a.set(null,u),a.set(S,u),this.count++,o=lc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),h?h.parentNode.insertBefore(u,h.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var Uo={$$typeof:U,Provider:null,Consumer:null,_currentValue:$,_currentValue2:$,_threadCount:0};function HS(e,n,a,o,u,h,S,A,G){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ce(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ce(0),this.hiddenUpdates=Ce(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=h,this.onRecoverableError=S,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=G,this.incompleteTransitions=new Map}function b0(e,n,a,o,u,h,S,A,G,et,pt,_t){return e=new HS(e,n,a,S,G,et,pt,_t,A),n=1,h===!0&&(n|=24),h=jn(3,null,null,n),e.current=h,h.stateNode=e,n=wu(),n.refCount++,e.pooledCache=n,n.refCount++,h.memoizedState={element:o,isDehydrated:a,cache:n},Lu(h),e}function A0(e){return e?(e=Xs,e):Xs}function R0(e,n,a,o,u,h){u=A0(u),o.context===null?o.context=u:o.pendingContext=u,o=Da(n),o.payload={element:a},h=h===void 0?null:h,h!==null&&(o.callback=h),a=Ua(e,o,n),a!==null&&(Xn(a,e,n),lo(a,e,n))}function C0(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Qf(e,n){C0(e,n),(e=e.alternate)&&C0(e,n)}function w0(e){if(e.tag===13||e.tag===31){var n=os(e,67108864);n!==null&&Xn(n,e,67108864),Qf(e,67108864)}}function D0(e){if(e.tag===13||e.tag===31){var n=$n();n=kr(n);var a=os(e,n);a!==null&&Xn(a,e,n),Qf(e,n)}}var fc=!0;function GS(e,n,a,o){var u=B.T;B.T=null;var h=H.p;try{H.p=2,$f(e,n,a,o)}finally{H.p=h,B.T=u}}function VS(e,n,a,o){var u=B.T;B.T=null;var h=H.p;try{H.p=8,$f(e,n,a,o)}finally{H.p=h,B.T=u}}function $f(e,n,a,o){if(fc){var u=th(o);if(u===null)If(e,n,o,hc,a),N0(e,o);else if(XS(u,e,n,a,o))o.stopPropagation();else if(N0(e,o),n&4&&-1<kS.indexOf(e)){for(;u!==null;){var h=Ma(u);if(h!==null)switch(h.tag){case 3:if(h=h.stateNode,h.current.memoizedState.isDehydrated){var S=bt(h.pendingLanes);if(S!==0){var A=h;for(A.pendingLanes|=2,A.entangledLanes|=2;S;){var G=1<<31-kt(S);A.entanglements[1]|=G,S&=~G}Li(h),(ze&6)===0&&(jl=E()+500,bo(0))}}break;case 31:case 13:A=os(h,2),A!==null&&Xn(A,h,2),Kl(),Qf(h,2)}if(h=th(o),h===null&&If(e,n,o,hc,a),h===u)break;u=h}u!==null&&o.stopPropagation()}else If(e,n,o,null,a)}}function th(e){return e=eu(e),eh(e)}var hc=null;function eh(e){if(hc=null,e=ya(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=f(n),e!==null)return e;e=null}else if(a===31){if(e=d(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return hc=e,null}function U0(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(W()){case ut:return 2;case St:return 8;case ht:case Qt:return 32;case Ot:return 268435456;default:return 32}default:return 32}}var nh=!1,Va=null,ka=null,Xa=null,No=new Map,Lo=new Map,Wa=[],kS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function N0(e,n){switch(e){case"focusin":case"focusout":Va=null;break;case"dragenter":case"dragleave":ka=null;break;case"mouseover":case"mouseout":Xa=null;break;case"pointerover":case"pointerout":No.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Lo.delete(n.pointerId)}}function Oo(e,n,a,o,u,h){return e===null||e.nativeEvent!==h?(e={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:h,targetContainers:[u]},n!==null&&(n=Ma(n),n!==null&&w0(n)),e):(e.eventSystemFlags|=o,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function XS(e,n,a,o,u){switch(n){case"focusin":return Va=Oo(Va,e,n,a,o,u),!0;case"dragenter":return ka=Oo(ka,e,n,a,o,u),!0;case"mouseover":return Xa=Oo(Xa,e,n,a,o,u),!0;case"pointerover":var h=u.pointerId;return No.set(h,Oo(No.get(h)||null,e,n,a,o,u)),!0;case"gotpointercapture":return h=u.pointerId,Lo.set(h,Oo(Lo.get(h)||null,e,n,a,o,u)),!0}return!1}function L0(e){var n=ya(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=f(a),n!==null){e.blockedOn=n,wi(e.priority,function(){D0(a)});return}}else if(n===31){if(n=d(a),n!==null){e.blockedOn=n,wi(e.priority,function(){D0(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function dc(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=th(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);tu=o,a.target.dispatchEvent(o),tu=null}else return n=Ma(a),n!==null&&w0(n),e.blockedOn=a,!1;n.shift()}return!0}function O0(e,n,a){dc(e)&&a.delete(n)}function WS(){nh=!1,Va!==null&&dc(Va)&&(Va=null),ka!==null&&dc(ka)&&(ka=null),Xa!==null&&dc(Xa)&&(Xa=null),No.forEach(O0),Lo.forEach(O0)}function pc(e,n){e.blockedOn===n&&(e.blockedOn=null,nh||(nh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,WS)))}var mc=null;function P0(e){mc!==e&&(mc=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){mc===e&&(mc=null);for(var n=0;n<e.length;n+=3){var a=e[n],o=e[n+1],u=e[n+2];if(typeof o!="function"){if(eh(o||a)===null)continue;break}var h=Ma(a);h!==null&&(e.splice(n,3),n-=3,$u(h,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function pr(e){function n(G){return pc(G,e)}Va!==null&&pc(Va,e),ka!==null&&pc(ka,e),Xa!==null&&pc(Xa,e),No.forEach(n),Lo.forEach(n);for(var a=0;a<Wa.length;a++){var o=Wa[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<Wa.length&&(a=Wa[0],a.blockedOn===null);)L0(a),a.blockedOn===null&&Wa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],h=a[o+1],S=u[Sn]||null;if(typeof h=="function")S||P0(a);else if(S){var A=null;if(h&&h.hasAttribute("formAction")){if(u=h,S=h[Sn]||null)A=S.formAction;else if(eh(u)!==null)continue}else A=S.action;typeof A=="function"?a[o+1]=A:(a.splice(o,3),o-=3),P0(a)}}}function z0(){function e(h){h.canIntercept&&h.info==="react-transition"&&h.intercept({handler:function(){return new Promise(function(S){return u=S})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var h=navigation.currentEntry;h&&h.url!=null&&navigation.navigate(h.url,{state:h.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function ih(e){this._internalRoot=e}gc.prototype.render=ih.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=$n();R0(a,o,e,n,null,null)},gc.prototype.unmount=ih.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;R0(e.current,2,null,e,null,null),Kl(),n[_i]=null}};function gc(e){this._internalRoot=e}gc.prototype.unstable_scheduleHydration=function(e){if(e){var n=Xr();e={blockedOn:null,target:e,priority:n};for(var a=0;a<Wa.length&&n!==0&&n<Wa[a].priority;a++);Wa.splice(a,0,e),a===0&&L0(e)}};var F0=t.version;if(F0!=="19.2.4")throw Error(s(527,F0,"19.2.4"));H.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=p(n),e=e!==null?g(e):null,e=e===null?null:e.stateNode,e};var qS={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:B,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var _c=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!_c.isDisabled&&_c.supportsFiber)try{Tt=_c.inject(qS),Ct=_c}catch{}}return zo.createRoot=function(e,n){if(!l(e))throw Error(s(299));var a=!1,o="",u=Xm,h=Wm,S=qm;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(h=n.onCaughtError),n.onRecoverableError!==void 0&&(S=n.onRecoverableError)),n=b0(e,1,!1,null,null,a,o,null,u,h,S,z0),e[_i]=n.current,Bf(e),new ih(n)},zo.hydrateRoot=function(e,n,a){if(!l(e))throw Error(s(299));var o=!1,u="",h=Xm,S=Wm,A=qm,G=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(h=a.onUncaughtError),a.onCaughtError!==void 0&&(S=a.onCaughtError),a.onRecoverableError!==void 0&&(A=a.onRecoverableError),a.formState!==void 0&&(G=a.formState)),n=b0(e,1,!0,n,a??null,o,u,G,h,S,A,z0),n.context=A0(null),a=n.current,o=$n(),o=kr(o),u=Da(o),u.callback=null,Ua(a,u,o),a=o,n.current.lanes=a,Un(n,a),Li(n),e[_i]=n.current,Bf(e),new gc(n)},zo.version="19.2.4",zo}var Y0;function ny(){if(Y0)return rh.exports;Y0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),rh.exports=ey(),rh.exports}var iy=ny();function ay(){const[r,t]=ee.useState(""),[i,s]=ee.useState(!1);return ee.useEffect(()=>{fetch("/api/url").then(l=>l.json()).then(l=>t(l.url)).catch(()=>t("(unavailable)"))},[]),Dt.jsxs("div",{className:"qr-card",children:[Dt.jsx("h2",{className:"qr-title",children:"Connect"}),i?Dt.jsxs("div",{className:"qr-placeholder",children:[Dt.jsx("span",{children:"QR unavailable"}),Dt.jsx("span",{className:"qr-hint",children:"Server may not be running"})]}):Dt.jsx("img",{className:"qr-image",src:"/api/qr",alt:"QR Code",onError:()=>s(!0)}),Dt.jsx("p",{className:"qr-url",children:r})]})}const j0=1e3,sy=2e3,ry={debug:{color:"#888"},info:{color:"#4FC3F7"},warn:{color:"#FFB74D"},warning:{color:"#FFB74D"},error:{color:"#EF5350"},critical:{color:"#EF5350",bold:!0}};function oy(r){const t=ry[r.toLowerCase()]??{color:"#e0e0e0"};return{color:t.color,fontWeight:t.bold?"bold":"normal"}}function ly(r){try{const t=new Date(r);if(!isNaN(t.getTime())){const i=String(t.getHours()).padStart(2,"0"),s=String(t.getMinutes()).padStart(2,"0"),l=String(t.getSeconds()).padStart(2,"0"),c=String(t.getMilliseconds()).padStart(3,"0");return`${i}:${s}:${l}.${c}`}}catch{}return r}let cy=0;function uy({onConnectionChange:r,sessionFilter:t,onState:i}){const[s,l]=ee.useState([]),c=ee.useRef(null),f=ee.useRef(null),d=ee.useRef(!1),m=ee.useCallback(()=>{const g=f.current;if(!g)return;const x=g.scrollHeight-g.scrollTop-g.clientHeight<40;d.current=!x},[]),p=ee.useMemo(()=>t===null?s:s.filter(g=>!g.session||g.session===t),[s,t]);return ee.useEffect(()=>{var g;d.current||(g=c.current)==null||g.scrollIntoView({behavior:"smooth"})},[p]),ee.useEffect(()=>{let g=null,_=null,x=!1;function y(){if(x)return;const C=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws/logs`;g=new WebSocket(C),g.onopen=()=>{x||r(!0)},g.onclose=()=>{x||(r(!1),_=setTimeout(y,sy))},g.onerror=()=>{},g.onmessage=M=>{try{const v=JSON.parse(M.data);if(v.type==="state"){i(v);return}const P={...v,id:cy++};l(U=>{const D=[...U,P];return D.length>j0?D.slice(D.length-j0):D})}catch{}}}return y(),()=>{x=!0,_&&clearTimeout(_),g&&(g.onclose=null,g.close()),r(!1)}},[r,i]),Dt.jsxs("div",{className:"log-viewer",ref:f,onScroll:m,children:[s.length>0&&Dt.jsx("button",{className:"log-clear-btn",onClick:()=>l([]),title:"Clear log",children:Dt.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:[Dt.jsx("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"}),Dt.jsx("path",{fillRule:"evenodd",d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"})]})}),p.length===0&&Dt.jsx("div",{className:"log-empty",children:"Waiting for log messages..."}),p.map(g=>{const _=oy(g.level);return Dt.jsxs("div",{className:"log-line",children:[Dt.jsx("span",{className:"log-ts",children:ly(g.ts)}),Dt.jsx("span",{className:"log-level",style:_,children:g.level.toUpperCase().padEnd(8)}),g.session&&t===null&&Dt.jsx("span",{className:"log-session",children:g.session}),Dt.jsx("span",{className:"log-msg",style:{fontWeight:_.fontWeight},children:g.msg})]},g.id)}),Dt.jsx("div",{ref:c})]})}function fy(r){const t=new Map;for(const i of r){const s=i.name.match(/^[A-Z][a-z]*/),l=s?s[0]:"Other";t.has(l)||t.set(l,[]),t.get(l).push(i)}return t}function Z0(r){if(r===0)return"0";const t=Math.abs(r);return t>=100?r.toFixed(1):t>=10?r.toFixed(2):t>=1?r.toFixed(3):t>=.1?r.toFixed(4):r.toPrecision(3)}function hy({tweak:r,onChange:t,onReset:i}){const[s,l]=ee.useState(!1),[c,f]=ee.useState(""),d=ee.useRef(null),m=ee.useRef(!1),p=ee.useRef(0),g=ee.useRef(0),_=ee.useRef(!1),x=r.value!==r.default,y=r.name.match(/^[A-Z][a-z]*(.*)/),T=y&&y[1]?y[1]:r.name,C=ee.useCallback(L=>{if(L.button!==0||s)return;L.preventDefault(),m.current=!0,_.current=!1,p.current=L.clientX,g.current=r.value,document.body.style.cursor="ew-resize",document.body.style.userSelect="none";const I=q=>{if(!m.current)return;const b=q.clientX-p.current;if(Math.abs(b)>2&&(_.current=!0),!_.current)return;const w=q.shiftKey?.1:1,V=r.speed*w;let nt;if(r.scale==="log")nt=g.current*Math.pow(2,V*b/100),nt<1e-6&&(nt=1e-6);else{const it=Math.max(Math.abs(g.current),.01);nt=g.current+V*it*b/100}t(r.name,nt)},F=()=>{m.current=!1,document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",I),window.removeEventListener("mouseup",F),_.current||(f(Z0(r.value)),l(!0))};window.addEventListener("mousemove",I),window.addEventListener("mouseup",F)},[r,s,t]),M=ee.useCallback(L=>{L.preventDefault(),i(r.name)},[r.name,i]),v=ee.useCallback(()=>{l(!1);const L=parseFloat(c);isNaN(L)||t(r.name,L)},[c,r.name,t]),P=ee.useCallback(L=>{L.key==="Enter"?v():L.key==="Escape"&&l(!1)},[v]);ee.useEffect(()=>{s&&d.current&&(d.current.focus(),d.current.select())},[s]);const U=r.default!==0?r.value/r.default:1,D=Math.min(Math.max(U*50,0),100);return Dt.jsxs("div",{className:"tweak-row",children:[Dt.jsx("span",{className:`tweak-name ${x?"tweak-modified":""}`,children:T}),Dt.jsxs("div",{className:"tweak-field",onMouseDown:C,onContextMenu:M,title:"Drag to adjust, click to edit, right-click to reset",children:[Dt.jsx("div",{className:"tweak-fill",style:{width:`${D}%`}}),s?Dt.jsx("input",{ref:d,className:"tweak-input",type:"text",value:c,onChange:L=>f(L.target.value),onKeyDown:P,onBlur:v}):Dt.jsx("span",{className:"tweak-value",children:Z0(r.value)})]})]})}function dy(){const[r,t]=ee.useState([]),[i,s]=ee.useState(!1),l=ee.useRef(new Map),c=ee.useRef(null),f=ee.useCallback(()=>{fetch("/api/tweaks").then(y=>y.json()).then(y=>t(y)).catch(()=>{})},[]);ee.useEffect(()=>{f()},[f]);const d=ee.useCallback(()=>{const y=l.current;if(y.size!==0){for(const[T,C]of y)fetch("/api/tweaks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:T,value:C})}).catch(()=>{});y.clear()}},[]),m=ee.useCallback((y,T)=>{t(C=>C.map(M=>M.name===y?{...M,value:T}:M)),l.current.set(y,T),c.current&&clearTimeout(c.current),c.current=setTimeout(d,50)},[d]),p=ee.useCallback(y=>{fetch("/api/tweaks/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:y})}).then(T=>T.json()).then(T=>t(T)).catch(()=>{})},[]),g=ee.useCallback(()=>{s(!1),fetch("/api/tweaks/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:!0})}).then(y=>y.json()).then(y=>t(y)).catch(()=>{})},[]);if(r.length===0)return null;const _=fy(r),x=r.some(y=>y.value!==y.default);return Dt.jsxs("div",{className:"tweak-panel",children:[Dt.jsxs("div",{className:"tweak-header",children:[Dt.jsx("span",{className:"tweak-title",children:"Tweaks"}),x&&Dt.jsx("button",{className:"tweak-reset-all",onClick:()=>s(!0),children:"Reset All"})]}),Array.from(_.entries()).map(([y,T])=>Dt.jsxs("div",{className:"tweak-group",children:[Dt.jsx("div",{className:"tweak-group-name",children:y}),T.map(C=>Dt.jsx(hy,{tweak:C,onChange:m,onReset:p},C.name))]},y)),i&&Dt.jsx("div",{className:"confirm-overlay",onClick:()=>s(!1),children:Dt.jsxs("div",{className:"confirm-dialog",onClick:y=>y.stopPropagation(),children:[Dt.jsx("p",{className:"confirm-text",children:"Reset all tweaks to defaults?"}),Dt.jsxs("div",{className:"confirm-actions",children:[Dt.jsx("button",{className:"confirm-btn confirm-btn-stop",onClick:g,children:"Reset All"}),Dt.jsx("button",{className:"confirm-btn confirm-btn-cancel",onClick:()=>s(!1),children:"Cancel"})]})]})})]})}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const kd="182",py=0,K0=1,my=2,Vc=1,gy=2,Xo=3,es=0,qn=1,ma=2,_a=0,Ur=1,J0=2,Q0=3,$0=4,_y=5,Rs=100,vy=101,xy=102,Sy=103,yy=104,My=200,Ey=201,Ty=202,by=203,Wh=204,qh=205,Ay=206,Ry=207,Cy=208,wy=209,Dy=210,Uy=211,Ny=212,Ly=213,Oy=214,Yh=0,jh=1,Zh=2,Lr=3,Kh=4,Jh=5,Qh=6,$h=7,ev=0,Py=1,zy=2,Bi=0,nv=1,iv=2,av=3,sv=4,rv=5,ov=6,lv=7,cv=300,Us=301,Or=302,td=303,ed=304,Jc=306,nd=1e3,ga=1001,id=1002,Dn=1003,Fy=1004,vc=1005,xn=1006,uh=1007,ws=1008,ii=1009,uv=1010,fv=1011,Zo=1012,Xd=1013,Gi=1014,zi=1015,xa=1016,Wd=1017,qd=1018,Ko=1020,hv=35902,dv=35899,pv=1021,mv=1022,Ai=1023,Sa=1026,Ds=1027,gv=1028,Yd=1029,Pr=1030,jd=1031,Zd=1033,kc=33776,Xc=33777,Wc=33778,qc=33779,ad=35840,sd=35841,rd=35842,od=35843,ld=36196,cd=37492,ud=37496,fd=37488,hd=37489,dd=37490,pd=37491,md=37808,gd=37809,_d=37810,vd=37811,xd=37812,Sd=37813,yd=37814,Md=37815,Ed=37816,Td=37817,bd=37818,Ad=37819,Rd=37820,Cd=37821,wd=36492,Dd=36494,Ud=36495,Nd=36283,Ld=36284,Od=36285,Pd=36286,By=3200,_v=0,Iy=1,$a="",ni="srgb",zr="srgb-linear",jc="linear",ke="srgb",mr=7680,t_=519,Hy=512,Gy=513,Vy=514,Kd=515,ky=516,Xy=517,Jd=518,Wy=519,e_=35044,n_="300 es",Fi=2e3,Zc=2001;function vv(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Kc(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function qy(){const r=Kc("canvas");return r.style.display="block",r}const i_={};function a_(...r){const t="THREE."+r.shift();console.log(t,...r)}function pe(...r){const t="THREE."+r.shift();console.warn(t,...r)}function we(...r){const t="THREE."+r.shift();console.error(t,...r)}function Jo(...r){const t=r.join(" ");t in i_||(i_[t]=!0,pe(...r))}function Yy(r,t,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}class Ir{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[t]===void 0&&(s[t]=[]),s[t].indexOf(i)===-1&&s[t].push(i)}hasEventListener(t,i){const s=this._listeners;return s===void 0?!1:s[t]!==void 0&&s[t].indexOf(i)!==-1}removeEventListener(t,i){const s=this._listeners;if(s===void 0)return;const l=s[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const s=i[t.type];if(s!==void 0){t.target=this;const l=s.slice(0);for(let c=0,f=l.length;c<f;c++)l[c].call(this,t);t.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fh=Math.PI/180,zd=180/Math.PI;function Hr(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(Ln[r&255]+Ln[r>>8&255]+Ln[r>>16&255]+Ln[r>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[i&63|128]+Ln[i>>8&255]+"-"+Ln[i>>16&255]+Ln[i>>24&255]+Ln[s&255]+Ln[s>>8&255]+Ln[s>>16&255]+Ln[s>>24&255]).toLowerCase()}function Te(r,t,i){return Math.max(t,Math.min(i,r))}function jy(r,t){return(r%t+t)%t}function hh(r,t,i){return(1-i)*r+i*t}function Fo(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Wn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class Wt{constructor(t=0,i=0){Wt.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,s=this.y,l=t.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(Te(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y;return i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-t.x,f=this.y-t.y;return this.x=c*s-f*l+t.x,this.y=c*l+f*s+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class nl{constructor(t=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=s,this._w=l}static slerpFlat(t,i,s,l,c,f,d){let m=s[l+0],p=s[l+1],g=s[l+2],_=s[l+3],x=c[f+0],y=c[f+1],T=c[f+2],C=c[f+3];if(d<=0){t[i+0]=m,t[i+1]=p,t[i+2]=g,t[i+3]=_;return}if(d>=1){t[i+0]=x,t[i+1]=y,t[i+2]=T,t[i+3]=C;return}if(_!==C||m!==x||p!==y||g!==T){let M=m*x+p*y+g*T+_*C;M<0&&(x=-x,y=-y,T=-T,C=-C,M=-M);let v=1-d;if(M<.9995){const P=Math.acos(M),U=Math.sin(P);v=Math.sin(v*P)/U,d=Math.sin(d*P)/U,m=m*v+x*d,p=p*v+y*d,g=g*v+T*d,_=_*v+C*d}else{m=m*v+x*d,p=p*v+y*d,g=g*v+T*d,_=_*v+C*d;const P=1/Math.sqrt(m*m+p*p+g*g+_*_);m*=P,p*=P,g*=P,_*=P}}t[i]=m,t[i+1]=p,t[i+2]=g,t[i+3]=_}static multiplyQuaternionsFlat(t,i,s,l,c,f){const d=s[l],m=s[l+1],p=s[l+2],g=s[l+3],_=c[f],x=c[f+1],y=c[f+2],T=c[f+3];return t[i]=d*T+g*_+m*y-p*x,t[i+1]=m*T+g*x+p*_-d*y,t[i+2]=p*T+g*y+d*x-m*_,t[i+3]=g*T-d*_-m*x-p*y,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,s,l){return this._x=t,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const s=t._x,l=t._y,c=t._z,f=t._order,d=Math.cos,m=Math.sin,p=d(s/2),g=d(l/2),_=d(c/2),x=m(s/2),y=m(l/2),T=m(c/2);switch(f){case"XYZ":this._x=x*g*_+p*y*T,this._y=p*y*_-x*g*T,this._z=p*g*T+x*y*_,this._w=p*g*_-x*y*T;break;case"YXZ":this._x=x*g*_+p*y*T,this._y=p*y*_-x*g*T,this._z=p*g*T-x*y*_,this._w=p*g*_+x*y*T;break;case"ZXY":this._x=x*g*_-p*y*T,this._y=p*y*_+x*g*T,this._z=p*g*T+x*y*_,this._w=p*g*_-x*y*T;break;case"ZYX":this._x=x*g*_-p*y*T,this._y=p*y*_+x*g*T,this._z=p*g*T-x*y*_,this._w=p*g*_+x*y*T;break;case"YZX":this._x=x*g*_+p*y*T,this._y=p*y*_+x*g*T,this._z=p*g*T-x*y*_,this._w=p*g*_-x*y*T;break;case"XZY":this._x=x*g*_-p*y*T,this._y=p*y*_-x*g*T,this._z=p*g*T+x*y*_,this._w=p*g*_+x*y*T;break;default:pe("Quaternion: .setFromEuler() encountered an unknown order: "+f)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const s=i/2,l=Math.sin(s);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,s=i[0],l=i[4],c=i[8],f=i[1],d=i[5],m=i[9],p=i[2],g=i[6],_=i[10],x=s+d+_;if(x>0){const y=.5/Math.sqrt(x+1);this._w=.25/y,this._x=(g-m)*y,this._y=(c-p)*y,this._z=(f-l)*y}else if(s>d&&s>_){const y=2*Math.sqrt(1+s-d-_);this._w=(g-m)/y,this._x=.25*y,this._y=(l+f)/y,this._z=(c+p)/y}else if(d>_){const y=2*Math.sqrt(1+d-s-_);this._w=(c-p)/y,this._x=(l+f)/y,this._y=.25*y,this._z=(m+g)/y}else{const y=2*Math.sqrt(1+_-s-d);this._w=(f-l)/y,this._x=(c+p)/y,this._y=(m+g)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let s=t.dot(i)+1;return s<1e-8?(s=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=s):(this._x=0,this._y=-t.z,this._z=t.y,this._w=s)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=s),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,i){const s=this.angleTo(t);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const s=t._x,l=t._y,c=t._z,f=t._w,d=i._x,m=i._y,p=i._z,g=i._w;return this._x=s*g+f*d+l*p-c*m,this._y=l*g+f*m+c*d-s*p,this._z=c*g+f*p+s*m-l*d,this._w=f*g-s*d-l*m-c*p,this._onChangeCallback(),this}slerp(t,i){if(i<=0)return this;if(i>=1)return this.copy(t);let s=t._x,l=t._y,c=t._z,f=t._w,d=this.dot(t);d<0&&(s=-s,l=-l,c=-c,f=-f,d=-d);let m=1-i;if(d<.9995){const p=Math.acos(d),g=Math.sin(p);m=Math.sin(m*p)/g,i=Math.sin(i*p)/g,this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this._onChangeCallback()}else this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this.normalize();return this}slerpQuaternions(t,i,s){return this.copy(t).slerp(i,s)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Z{constructor(t=0,i=0,s=0){Z.prototype.isVector3=!0,this.x=t,this.y=i,this.z=s}set(t,i,s){return s===void 0&&(s=this.z),this.x=t,this.y=i,this.z=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(s_.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(s_.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=t.elements,f=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*f,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*f,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*f,this}applyQuaternion(t){const i=this.x,s=this.y,l=this.z,c=t.x,f=t.y,d=t.z,m=t.w,p=2*(f*l-d*s),g=2*(d*i-c*l),_=2*(c*s-f*i);return this.x=i+m*p+f*_-d*g,this.y=s+m*g+d*p-c*_,this.z=l+m*_+c*g-f*p,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this.z=Te(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this.z=Te(this.z,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const s=t.x,l=t.y,c=t.z,f=i.x,d=i.y,m=i.z;return this.x=l*m-c*d,this.y=c*f-s*m,this.z=s*d-l*f,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const s=t.dot(this)/i;return this.copy(t).multiplyScalar(s)}projectOnPlane(t){return dh.copy(this).projectOnVector(t),this.sub(dh)}reflect(t){return this.sub(dh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(Te(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y,l=this.z-t.z;return i*i+s*s+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,s){const l=Math.sin(i)*t;return this.x=l*Math.sin(s),this.y=Math.cos(i)*t,this.z=l*Math.cos(s),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,s){return this.x=t*Math.sin(i),this.y=s,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),s=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(t),this.y=i,this.z=s*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const dh=new Z,s_=new nl;class xe{constructor(t,i,s,l,c,f,d,m,p){xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,f,d,m,p)}set(t,i,s,l,c,f,d,m,p){const g=this.elements;return g[0]=t,g[1]=l,g[2]=d,g[3]=i,g[4]=c,g[5]=m,g[6]=s,g[7]=f,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(t,i,s){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,f=s[0],d=s[3],m=s[6],p=s[1],g=s[4],_=s[7],x=s[2],y=s[5],T=s[8],C=l[0],M=l[3],v=l[6],P=l[1],U=l[4],D=l[7],L=l[2],I=l[5],F=l[8];return c[0]=f*C+d*P+m*L,c[3]=f*M+d*U+m*I,c[6]=f*v+d*D+m*F,c[1]=p*C+g*P+_*L,c[4]=p*M+g*U+_*I,c[7]=p*v+g*D+_*F,c[2]=x*C+y*P+T*L,c[5]=x*M+y*U+T*I,c[8]=x*v+y*D+T*F,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8];return i*f*g-i*d*p-s*c*g+s*d*m+l*c*p-l*f*m}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8],_=g*f-d*p,x=d*m-g*c,y=p*c-f*m,T=i*_+s*x+l*y;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/T;return t[0]=_*C,t[1]=(l*p-g*s)*C,t[2]=(d*s-l*f)*C,t[3]=x*C,t[4]=(g*i-l*m)*C,t[5]=(l*c-d*i)*C,t[6]=y*C,t[7]=(s*m-p*i)*C,t[8]=(f*i-s*c)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,s,l,c,f,d){const m=Math.cos(c),p=Math.sin(c);return this.set(s*m,s*p,-s*(m*f+p*d)+f+t,-l*p,l*m,-l*(-p*f+m*d)+d+i,0,0,1),this}scale(t,i){return this.premultiply(ph.makeScale(t,i)),this}rotate(t){return this.premultiply(ph.makeRotation(-t)),this}translate(t,i){return this.premultiply(ph.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<9;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ph=new xe,r_=new xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),o_=new xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Zy(){const r={enabled:!0,workingColorSpace:zr,spaces:{},convert:function(l,c,f){return this.enabled===!1||c===f||!c||!f||(this.spaces[c].transfer===ke&&(l.r=va(l.r),l.g=va(l.g),l.b=va(l.b)),this.spaces[c].primaries!==this.spaces[f].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[f].fromXYZ)),this.spaces[f].transfer===ke&&(l.r=Nr(l.r),l.g=Nr(l.g),l.b=Nr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===$a?jc:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,f){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[f].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return Jo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return Jo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[zr]:{primaries:t,whitePoint:s,transfer:jc,toXYZ:r_,fromXYZ:o_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:ni},outputColorSpaceConfig:{drawingBufferColorSpace:ni}},[ni]:{primaries:t,whitePoint:s,transfer:ke,toXYZ:r_,fromXYZ:o_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:ni}}}),r}const De=Zy();function va(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Nr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let gr;class Ky{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let s;if(t instanceof HTMLCanvasElement)s=t;else{gr===void 0&&(gr=Kc("canvas")),gr.width=t.width,gr.height=t.height;const l=gr.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),s=gr}return s.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=Kc("canvas");i.width=t.width,i.height=t.height;const s=i.getContext("2d");s.drawImage(t,0,0,t.width,t.height);const l=s.getImageData(0,0,t.width,t.height),c=l.data;for(let f=0;f<c.length;f++)c[f]=va(c[f]/255)*255;return s.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(va(i[s]/255)*255):i[s]=va(i[s]);return{data:i,width:t.width,height:t.height}}else return pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Jy=0;class Qd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jy++}),this.uuid=Hr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let f=0,d=l.length;f<d;f++)l[f].isDataTexture?c.push(mh(l[f].image)):c.push(mh(l[f]))}else c=mh(l);s.url=c}return i||(t.images[this.uuid]=s),s}}function mh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Ky.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(pe("Texture: Unable to serialize Texture."),{})}let Qy=0;const gh=new Z;class Pn extends Ir{constructor(t=Pn.DEFAULT_IMAGE,i=Pn.DEFAULT_MAPPING,s=ga,l=ga,c=xn,f=ws,d=Ai,m=ii,p=Pn.DEFAULT_ANISOTROPY,g=$a){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qy++}),this.uuid=Hr(),this.name="",this.source=new Qd(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=f,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(gh).x}get height(){return this.source.getSize(gh).y}get depth(){return this.source.getSize(gh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const s=t[i];if(s===void 0){pe(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){pe(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(t.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cv)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case nd:t.x=t.x-Math.floor(t.x);break;case ga:t.x=t.x<0?0:1;break;case id:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case nd:t.y=t.y-Math.floor(t.y);break;case ga:t.y=t.y<0?0:1;break;case id:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=cv;Pn.DEFAULT_ANISOTROPY=1;class an{constructor(t=0,i=0,s=0,l=1){an.prototype.isVector4=!0,this.x=t,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,s,l){return this.x=t,this.y=i,this.z=s,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=this.w,f=t.elements;return this.x=f[0]*i+f[4]*s+f[8]*l+f[12]*c,this.y=f[1]*i+f[5]*s+f[9]*l+f[13]*c,this.z=f[2]*i+f[6]*s+f[10]*l+f[14]*c,this.w=f[3]*i+f[7]*s+f[11]*l+f[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,s,l,c;const m=t.elements,p=m[0],g=m[4],_=m[8],x=m[1],y=m[5],T=m[9],C=m[2],M=m[6],v=m[10];if(Math.abs(g-x)<.01&&Math.abs(_-C)<.01&&Math.abs(T-M)<.01){if(Math.abs(g+x)<.1&&Math.abs(_+C)<.1&&Math.abs(T+M)<.1&&Math.abs(p+y+v-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const U=(p+1)/2,D=(y+1)/2,L=(v+1)/2,I=(g+x)/4,F=(_+C)/4,q=(T+M)/4;return U>D&&U>L?U<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(U),l=I/s,c=F/s):D>L?D<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(D),s=I/l,c=q/l):L<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(L),s=F/c,l=q/c),this.set(s,l,c,i),this}let P=Math.sqrt((M-T)*(M-T)+(_-C)*(_-C)+(x-g)*(x-g));return Math.abs(P)<.001&&(P=1),this.x=(M-T)/P,this.y=(_-C)/P,this.z=(x-g)/P,this.w=Math.acos((p+y+v-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this.z=Te(this.z,t.z,i.z),this.w=Te(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this.z=Te(this.z,t,i),this.w=Te(this.w,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this.w=t.w+(i.w-t.w)*s,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $y extends Ir{constructor(t=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=s.depth,this.scissor=new an(0,0,t,i),this.scissorTest=!1,this.viewport=new an(0,0,t,i);const l={width:t,height:i,depth:s.depth},c=new Pn(l);this.textures=[];const f=s.count;for(let d=0;d<f;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(t={}){const i={minFilter:xn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,s=1){if(this.width!==t||this.height!==i||this.depth!==s){this.width=t,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Qd(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends $y{constructor(t=1,i=1,s={}){super(t,i,s),this.isWebGLRenderTarget=!0}}class xv extends Pn{constructor(t=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class tM extends Pn{constructor(t=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class il{constructor(t=new Z(1/0,1/0,1/0),i=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i+=3)this.expandByPoint(Mi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,s=t.count;i<s;i++)this.expandByPoint(Mi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const s=Mi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(s),this.max.copy(t).add(s),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const s=t.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let f=0,d=c.count;f<d;f++)t.isMesh===!0?t.getVertexPosition(f,Mi):Mi.fromBufferAttribute(c,f),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xc.copy(t.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),xc.copy(s.boundingBox)),xc.applyMatrix4(t.matrixWorld),this.union(xc)}const l=t.children;for(let c=0,f=l.length;c<f;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,s;return t.normal.x>0?(i=t.normal.x*this.min.x,s=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,s=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,s+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,s+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,s+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,s+=t.normal.z*this.min.z),i<=-t.constant&&s>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bo),Sc.subVectors(this.max,Bo),_r.subVectors(t.a,Bo),vr.subVectors(t.b,Bo),xr.subVectors(t.c,Bo),Ya.subVectors(vr,_r),ja.subVectors(xr,vr),Ss.subVectors(_r,xr);let i=[0,-Ya.z,Ya.y,0,-ja.z,ja.y,0,-Ss.z,Ss.y,Ya.z,0,-Ya.x,ja.z,0,-ja.x,Ss.z,0,-Ss.x,-Ya.y,Ya.x,0,-ja.y,ja.x,0,-Ss.y,Ss.x,0];return!_h(i,_r,vr,xr,Sc)||(i=[1,0,0,0,1,0,0,0,1],!_h(i,_r,vr,xr,Sc))?!1:(yc.crossVectors(Ya,ja),i=[yc.x,yc.y,yc.z],_h(i,_r,vr,xr,Sc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ua[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ua[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ua[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ua[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ua[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ua[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ua[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ua[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ua),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ua=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],Mi=new Z,xc=new il,_r=new Z,vr=new Z,xr=new Z,Ya=new Z,ja=new Z,Ss=new Z,Bo=new Z,Sc=new Z,yc=new Z,ys=new Z;function _h(r,t,i,s,l){for(let c=0,f=r.length-3;c<=f;c+=3){ys.fromArray(r,c);const d=l.x*Math.abs(ys.x)+l.y*Math.abs(ys.y)+l.z*Math.abs(ys.z),m=t.dot(ys),p=i.dot(ys),g=s.dot(ys);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const eM=new il,Io=new Z,vh=new Z;class $d{constructor(t=new Z,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const s=this.center;i!==void 0?s.copy(i):eM.setFromPoints(t).getCenter(s);let l=0;for(let c=0,f=t.length;c<f;c++)l=Math.max(l,s.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const s=this.center.distanceToSquared(t);return i.copy(t),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Io.subVectors(t,this.center);const i=Io.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Io,l/s),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Io.copy(t.center).add(vh)),this.expandByPoint(Io.copy(t.center).sub(vh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const fa=new Z,xh=new Z,Mc=new Z,Za=new Z,Sh=new Z,Ec=new Z,yh=new Z;class nM{constructor(t=new Z,i=new Z(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fa)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=fa.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(fa.copy(this.origin).addScaledVector(this.direction,i),fa.distanceToSquared(t))}distanceSqToSegment(t,i,s,l){xh.copy(t).add(i).multiplyScalar(.5),Mc.copy(i).sub(t).normalize(),Za.copy(this.origin).sub(xh);const c=t.distanceTo(i)*.5,f=-this.direction.dot(Mc),d=Za.dot(this.direction),m=-Za.dot(Mc),p=Za.lengthSq(),g=Math.abs(1-f*f);let _,x,y,T;if(g>0)if(_=f*m-d,x=f*d-m,T=c*g,_>=0)if(x>=-T)if(x<=T){const C=1/g;_*=C,x*=C,y=_*(_+f*x+2*d)+x*(f*_+x+2*m)+p}else x=c,_=Math.max(0,-(f*x+d)),y=-_*_+x*(x+2*m)+p;else x=-c,_=Math.max(0,-(f*x+d)),y=-_*_+x*(x+2*m)+p;else x<=-T?(_=Math.max(0,-(-f*c+d)),x=_>0?-c:Math.min(Math.max(-c,-m),c),y=-_*_+x*(x+2*m)+p):x<=T?(_=0,x=Math.min(Math.max(-c,-m),c),y=x*(x+2*m)+p):(_=Math.max(0,-(f*c+d)),x=_>0?c:Math.min(Math.max(-c,-m),c),y=-_*_+x*(x+2*m)+p);else x=f>0?-c:c,_=Math.max(0,-(f*x+d)),y=-_*_+x*(x+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,_),l&&l.copy(xh).addScaledVector(Mc,x),y}intersectSphere(t,i){fa.subVectors(t.center,this.origin);const s=fa.dot(this.direction),l=fa.dot(fa)-s*s,c=t.radius*t.radius;if(l>c)return null;const f=Math.sqrt(c-l),d=s-f,m=s+f;return m<0?null:d<0?this.at(m,i):this.at(d,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(t.normal)+t.constant)/i;return s>=0?s:null}intersectPlane(t,i){const s=this.distanceToPlane(t);return s===null?null:this.at(s,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let s,l,c,f,d,m;const p=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,x=this.origin;return p>=0?(s=(t.min.x-x.x)*p,l=(t.max.x-x.x)*p):(s=(t.max.x-x.x)*p,l=(t.min.x-x.x)*p),g>=0?(c=(t.min.y-x.y)*g,f=(t.max.y-x.y)*g):(c=(t.max.y-x.y)*g,f=(t.min.y-x.y)*g),s>f||c>l||((c>s||isNaN(s))&&(s=c),(f<l||isNaN(l))&&(l=f),_>=0?(d=(t.min.z-x.z)*_,m=(t.max.z-x.z)*_):(d=(t.max.z-x.z)*_,m=(t.min.z-x.z)*_),s>m||d>l)||((d>s||s!==s)&&(s=d),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(t){return this.intersectBox(t,fa)!==null}intersectTriangle(t,i,s,l,c){Sh.subVectors(i,t),Ec.subVectors(s,t),yh.crossVectors(Sh,Ec);let f=this.direction.dot(yh),d;if(f>0){if(l)return null;d=1}else if(f<0)d=-1,f=-f;else return null;Za.subVectors(this.origin,t);const m=d*this.direction.dot(Ec.crossVectors(Za,Ec));if(m<0)return null;const p=d*this.direction.dot(Sh.cross(Za));if(p<0||m+p>f)return null;const g=-d*Za.dot(yh);return g<0?null:this.at(g/f,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class tn{constructor(t,i,s,l,c,f,d,m,p,g,_,x,y,T,C,M){tn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,f,d,m,p,g,_,x,y,T,C,M)}set(t,i,s,l,c,f,d,m,p,g,_,x,y,T,C,M){const v=this.elements;return v[0]=t,v[4]=i,v[8]=s,v[12]=l,v[1]=c,v[5]=f,v[9]=d,v[13]=m,v[2]=p,v[6]=g,v[10]=_,v[14]=x,v[3]=y,v[7]=T,v[11]=C,v[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tn().fromArray(this.elements)}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(t){const i=this.elements,s=t.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,s){return this.determinant()===0?(t.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(t,i,s){return this.set(t.x,i.x,s.x,0,t.y,i.y,s.y,0,t.z,i.z,s.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const i=this.elements,s=t.elements,l=1/Sr.setFromMatrixColumn(t,0).length(),c=1/Sr.setFromMatrixColumn(t,1).length(),f=1/Sr.setFromMatrixColumn(t,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*f,i[9]=s[9]*f,i[10]=s[10]*f,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,s=t.x,l=t.y,c=t.z,f=Math.cos(s),d=Math.sin(s),m=Math.cos(l),p=Math.sin(l),g=Math.cos(c),_=Math.sin(c);if(t.order==="XYZ"){const x=f*g,y=f*_,T=d*g,C=d*_;i[0]=m*g,i[4]=-m*_,i[8]=p,i[1]=y+T*p,i[5]=x-C*p,i[9]=-d*m,i[2]=C-x*p,i[6]=T+y*p,i[10]=f*m}else if(t.order==="YXZ"){const x=m*g,y=m*_,T=p*g,C=p*_;i[0]=x+C*d,i[4]=T*d-y,i[8]=f*p,i[1]=f*_,i[5]=f*g,i[9]=-d,i[2]=y*d-T,i[6]=C+x*d,i[10]=f*m}else if(t.order==="ZXY"){const x=m*g,y=m*_,T=p*g,C=p*_;i[0]=x-C*d,i[4]=-f*_,i[8]=T+y*d,i[1]=y+T*d,i[5]=f*g,i[9]=C-x*d,i[2]=-f*p,i[6]=d,i[10]=f*m}else if(t.order==="ZYX"){const x=f*g,y=f*_,T=d*g,C=d*_;i[0]=m*g,i[4]=T*p-y,i[8]=x*p+C,i[1]=m*_,i[5]=C*p+x,i[9]=y*p-T,i[2]=-p,i[6]=d*m,i[10]=f*m}else if(t.order==="YZX"){const x=f*m,y=f*p,T=d*m,C=d*p;i[0]=m*g,i[4]=C-x*_,i[8]=T*_+y,i[1]=_,i[5]=f*g,i[9]=-d*g,i[2]=-p*g,i[6]=y*_+T,i[10]=x-C*_}else if(t.order==="XZY"){const x=f*m,y=f*p,T=d*m,C=d*p;i[0]=m*g,i[4]=-_,i[8]=p*g,i[1]=x*_+C,i[5]=f*g,i[9]=y*_-T,i[2]=T*_-y,i[6]=d*g,i[10]=C*_+x}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(iM,t,aM)}lookAt(t,i,s){const l=this.elements;return ti.subVectors(t,i),ti.lengthSq()===0&&(ti.z=1),ti.normalize(),Ka.crossVectors(s,ti),Ka.lengthSq()===0&&(Math.abs(s.z)===1?ti.x+=1e-4:ti.z+=1e-4,ti.normalize(),Ka.crossVectors(s,ti)),Ka.normalize(),Tc.crossVectors(ti,Ka),l[0]=Ka.x,l[4]=Tc.x,l[8]=ti.x,l[1]=Ka.y,l[5]=Tc.y,l[9]=ti.y,l[2]=Ka.z,l[6]=Tc.z,l[10]=ti.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,f=s[0],d=s[4],m=s[8],p=s[12],g=s[1],_=s[5],x=s[9],y=s[13],T=s[2],C=s[6],M=s[10],v=s[14],P=s[3],U=s[7],D=s[11],L=s[15],I=l[0],F=l[4],q=l[8],b=l[12],w=l[1],V=l[5],nt=l[9],it=l[13],dt=l[2],rt=l[6],B=l[10],H=l[14],$=l[3],yt=l[7],xt=l[11],O=l[15];return c[0]=f*I+d*w+m*dt+p*$,c[4]=f*F+d*V+m*rt+p*yt,c[8]=f*q+d*nt+m*B+p*xt,c[12]=f*b+d*it+m*H+p*O,c[1]=g*I+_*w+x*dt+y*$,c[5]=g*F+_*V+x*rt+y*yt,c[9]=g*q+_*nt+x*B+y*xt,c[13]=g*b+_*it+x*H+y*O,c[2]=T*I+C*w+M*dt+v*$,c[6]=T*F+C*V+M*rt+v*yt,c[10]=T*q+C*nt+M*B+v*xt,c[14]=T*b+C*it+M*H+v*O,c[3]=P*I+U*w+D*dt+L*$,c[7]=P*F+U*V+D*rt+L*yt,c[11]=P*q+U*nt+D*B+L*xt,c[15]=P*b+U*it+D*H+L*O,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[4],l=t[8],c=t[12],f=t[1],d=t[5],m=t[9],p=t[13],g=t[2],_=t[6],x=t[10],y=t[14],T=t[3],C=t[7],M=t[11],v=t[15],P=m*y-p*x,U=d*y-p*_,D=d*x-m*_,L=f*y-p*g,I=f*x-m*g,F=f*_-d*g;return i*(C*P-M*U+v*D)-s*(T*P-M*L+v*I)+l*(T*U-C*L+v*F)-c*(T*D-C*I+M*F)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,s){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=s),this}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8],_=t[9],x=t[10],y=t[11],T=t[12],C=t[13],M=t[14],v=t[15],P=_*M*p-C*x*p+C*m*y-d*M*y-_*m*v+d*x*v,U=T*x*p-g*M*p-T*m*y+f*M*y+g*m*v-f*x*v,D=g*C*p-T*_*p+T*d*y-f*C*y-g*d*v+f*_*v,L=T*_*m-g*C*m-T*d*x+f*C*x+g*d*M-f*_*M,I=i*P+s*U+l*D+c*L;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/I;return t[0]=P*F,t[1]=(C*x*c-_*M*c-C*l*y+s*M*y+_*l*v-s*x*v)*F,t[2]=(d*M*c-C*m*c+C*l*p-s*M*p-d*l*v+s*m*v)*F,t[3]=(_*m*c-d*x*c-_*l*p+s*x*p+d*l*y-s*m*y)*F,t[4]=U*F,t[5]=(g*M*c-T*x*c+T*l*y-i*M*y-g*l*v+i*x*v)*F,t[6]=(T*m*c-f*M*c-T*l*p+i*M*p+f*l*v-i*m*v)*F,t[7]=(f*x*c-g*m*c+g*l*p-i*x*p-f*l*y+i*m*y)*F,t[8]=D*F,t[9]=(T*_*c-g*C*c-T*s*y+i*C*y+g*s*v-i*_*v)*F,t[10]=(f*C*c-T*d*c+T*s*p-i*C*p-f*s*v+i*d*v)*F,t[11]=(g*d*c-f*_*c-g*s*p+i*_*p+f*s*y-i*d*y)*F,t[12]=L*F,t[13]=(g*C*l-T*_*l+T*s*x-i*C*x-g*s*M+i*_*M)*F,t[14]=(T*d*l-f*C*l-T*s*m+i*C*m+f*s*M-i*d*M)*F,t[15]=(f*_*l-g*d*l+g*s*m-i*_*m-f*s*x+i*d*x)*F,this}scale(t){const i=this.elements,s=t.x,l=t.y,c=t.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],s=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(t,i,s){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),s=Math.sin(t);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,f=t.x,d=t.y,m=t.z,p=c*f,g=c*d;return this.set(p*f+s,p*d-l*m,p*m+l*d,0,p*d+l*m,g*d+s,g*m-l*f,0,p*m-l*d,g*m+l*f,c*m*m+s,0,0,0,0,1),this}makeScale(t,i,s){return this.set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(t,i,s,l,c,f){return this.set(1,s,c,0,t,1,f,0,i,l,1,0,0,0,0,1),this}compose(t,i,s){const l=this.elements,c=i._x,f=i._y,d=i._z,m=i._w,p=c+c,g=f+f,_=d+d,x=c*p,y=c*g,T=c*_,C=f*g,M=f*_,v=d*_,P=m*p,U=m*g,D=m*_,L=s.x,I=s.y,F=s.z;return l[0]=(1-(C+v))*L,l[1]=(y+D)*L,l[2]=(T-U)*L,l[3]=0,l[4]=(y-D)*I,l[5]=(1-(x+v))*I,l[6]=(M+P)*I,l[7]=0,l[8]=(T+U)*F,l[9]=(M-P)*F,l[10]=(1-(x+C))*F,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,s){const l=this.elements;if(t.x=l[12],t.y=l[13],t.z=l[14],this.determinant()===0)return s.set(1,1,1),i.identity(),this;let c=Sr.set(l[0],l[1],l[2]).length();const f=Sr.set(l[4],l[5],l[6]).length(),d=Sr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(c=-c),Ei.copy(this);const p=1/c,g=1/f,_=1/d;return Ei.elements[0]*=p,Ei.elements[1]*=p,Ei.elements[2]*=p,Ei.elements[4]*=g,Ei.elements[5]*=g,Ei.elements[6]*=g,Ei.elements[8]*=_,Ei.elements[9]*=_,Ei.elements[10]*=_,i.setFromRotationMatrix(Ei),s.x=c,s.y=f,s.z=d,this}makePerspective(t,i,s,l,c,f,d=Fi,m=!1){const p=this.elements,g=2*c/(i-t),_=2*c/(s-l),x=(i+t)/(i-t),y=(s+l)/(s-l);let T,C;if(m)T=c/(f-c),C=f*c/(f-c);else if(d===Fi)T=-(f+c)/(f-c),C=-2*f*c/(f-c);else if(d===Zc)T=-f/(f-c),C=-f*c/(f-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=x,p[12]=0,p[1]=0,p[5]=_,p[9]=y,p[13]=0,p[2]=0,p[6]=0,p[10]=T,p[14]=C,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(t,i,s,l,c,f,d=Fi,m=!1){const p=this.elements,g=2/(i-t),_=2/(s-l),x=-(i+t)/(i-t),y=-(s+l)/(s-l);let T,C;if(m)T=1/(f-c),C=f/(f-c);else if(d===Fi)T=-2/(f-c),C=-(f+c)/(f-c);else if(d===Zc)T=-1/(f-c),C=-c/(f-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=0,p[12]=x,p[1]=0,p[5]=_,p[9]=0,p[13]=y,p[2]=0,p[6]=0,p[10]=T,p[14]=C,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<16;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t[i+9]=s[9],t[i+10]=s[10],t[i+11]=s[11],t[i+12]=s[12],t[i+13]=s[13],t[i+14]=s[14],t[i+15]=s[15],t}}const Sr=new Z,Ei=new tn,iM=new Z(0,0,0),aM=new Z(1,1,1),Ka=new Z,Tc=new Z,ti=new Z,l_=new tn,c_=new nl;class Vi{constructor(t=0,i=0,s=0,l=Vi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,s,l=this._order){return this._x=t,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,s=!0){const l=t.elements,c=l[0],f=l[4],d=l[8],m=l[1],p=l[5],g=l[9],_=l[2],x=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(Te(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,y),this._z=Math.atan2(-f,c)):(this._x=Math.atan2(x,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-_,c),this._z=0);break;case"ZXY":this._x=Math.asin(Te(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-_,y),this._z=Math.atan2(-f,p)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-Te(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(x,y),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-f,p));break;case"YZX":this._z=Math.asin(Te(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-_,c)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-Te(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(x,p),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-g,y),this._y=0);break;default:pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,s){return l_.makeRotationFromQuaternion(t),this.setFromRotationMatrix(l_,i,s)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return c_.setFromEuler(this),this.setFromQuaternion(c_,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vi.DEFAULT_ORDER="XYZ";class Sv{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let sM=0;const u_=new Z,yr=new nl,ha=new tn,bc=new Z,Ho=new Z,rM=new Z,oM=new nl,f_=new Z(1,0,0),h_=new Z(0,1,0),d_=new Z(0,0,1),p_={type:"added"},lM={type:"removed"},Mr={type:"childadded",child:null},Mh={type:"childremoved",child:null};class zn extends Ir{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sM++}),this.uuid=Hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zn.DEFAULT_UP.clone();const t=new Z,i=new Vi,s=new nl,l=new Z(1,1,1);function c(){s.setFromEuler(i,!1)}function f(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new tn},normalMatrix:{value:new xe}}),this.matrix=new tn,this.matrixWorld=new tn,this.matrixAutoUpdate=zn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return yr.setFromAxisAngle(t,i),this.quaternion.multiply(yr),this}rotateOnWorldAxis(t,i){return yr.setFromAxisAngle(t,i),this.quaternion.premultiply(yr),this}rotateX(t){return this.rotateOnAxis(f_,t)}rotateY(t){return this.rotateOnAxis(h_,t)}rotateZ(t){return this.rotateOnAxis(d_,t)}translateOnAxis(t,i){return u_.copy(t).applyQuaternion(this.quaternion),this.position.add(u_.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(f_,t)}translateY(t){return this.translateOnAxis(h_,t)}translateZ(t){return this.translateOnAxis(d_,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ha.copy(this.matrixWorld).invert())}lookAt(t,i,s){t.isVector3?bc.copy(t):bc.set(t,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ha.lookAt(Ho,bc,this.up):ha.lookAt(bc,Ho,this.up),this.quaternion.setFromRotationMatrix(ha),l&&(ha.extractRotation(l.matrixWorld),yr.setFromRotationMatrix(ha),this.quaternion.premultiply(yr.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(we("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(p_),Mr.child=t,this.dispatchEvent(Mr),Mr.child=null):we("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(lM),Mh.child=t,this.dispatchEvent(Mh),Mh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ha.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ha.multiply(t.parent.matrixWorld)),t.applyMatrix4(ha),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(p_),Mr.child=t,this.dispatchEvent(Mr),Mr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const f=this.children[s].getObjectByProperty(t,i);if(f!==void 0)return f}}getObjectsByProperty(t,i,s=[]){this[t]===i&&s.push(this);const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].getObjectsByProperty(t,i,s);return s}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,t,rM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,oM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(t)}updateWorldMatrix(t,i){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",s={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(d=>({...d})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const _=m[p];c(t.shapes,_)}else c(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(c(t.materials,this.material[m]));l.material=d}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];l.animations.push(c(t.animations,m))}}if(i){const d=f(t.geometries),m=f(t.materials),p=f(t.textures),g=f(t.images),_=f(t.shapes),x=f(t.skeletons),y=f(t.animations),T=f(t.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),_.length>0&&(s.shapes=_),x.length>0&&(s.skeletons=x),y.length>0&&(s.animations=y),T.length>0&&(s.nodes=T)}return s.object=l,s;function f(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let s=0;s<t.children.length;s++){const l=t.children[s];this.add(l.clone())}return this}}zn.DEFAULT_UP=new Z(0,1,0);zn.DEFAULT_MATRIX_AUTO_UPDATE=!0;zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ti=new Z,da=new Z,Eh=new Z,pa=new Z,Er=new Z,Tr=new Z,m_=new Z,Th=new Z,bh=new Z,Ah=new Z,Rh=new an,Ch=new an,wh=new an;class bi{constructor(t=new Z,i=new Z,s=new Z){this.a=t,this.b=i,this.c=s}static getNormal(t,i,s,l){l.subVectors(s,i),Ti.subVectors(t,i),l.cross(Ti);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,s,l,c){Ti.subVectors(l,i),da.subVectors(s,i),Eh.subVectors(t,i);const f=Ti.dot(Ti),d=Ti.dot(da),m=Ti.dot(Eh),p=da.dot(da),g=da.dot(Eh),_=f*p-d*d;if(_===0)return c.set(0,0,0),null;const x=1/_,y=(p*m-d*g)*x,T=(f*g-d*m)*x;return c.set(1-y-T,T,y)}static containsPoint(t,i,s,l){return this.getBarycoord(t,i,s,l,pa)===null?!1:pa.x>=0&&pa.y>=0&&pa.x+pa.y<=1}static getInterpolation(t,i,s,l,c,f,d,m){return this.getBarycoord(t,i,s,l,pa)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,pa.x),m.addScaledVector(f,pa.y),m.addScaledVector(d,pa.z),m)}static getInterpolatedAttribute(t,i,s,l,c,f){return Rh.setScalar(0),Ch.setScalar(0),wh.setScalar(0),Rh.fromBufferAttribute(t,i),Ch.fromBufferAttribute(t,s),wh.fromBufferAttribute(t,l),f.setScalar(0),f.addScaledVector(Rh,c.x),f.addScaledVector(Ch,c.y),f.addScaledVector(wh,c.z),f}static isFrontFacing(t,i,s,l){return Ti.subVectors(s,i),da.subVectors(t,i),Ti.cross(da).dot(l)<0}set(t,i,s){return this.a.copy(t),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(t,i,s,l){return this.a.copy(t[i]),this.b.copy(t[s]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,s,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,s),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ti.subVectors(this.c,this.b),da.subVectors(this.a,this.b),Ti.cross(da).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return bi.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,s,l,c){return bi.getInterpolation(t,this.a,this.b,this.c,i,s,l,c)}containsPoint(t){return bi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const s=this.a,l=this.b,c=this.c;let f,d;Er.subVectors(l,s),Tr.subVectors(c,s),Th.subVectors(t,s);const m=Er.dot(Th),p=Tr.dot(Th);if(m<=0&&p<=0)return i.copy(s);bh.subVectors(t,l);const g=Er.dot(bh),_=Tr.dot(bh);if(g>=0&&_<=g)return i.copy(l);const x=m*_-g*p;if(x<=0&&m>=0&&g<=0)return f=m/(m-g),i.copy(s).addScaledVector(Er,f);Ah.subVectors(t,c);const y=Er.dot(Ah),T=Tr.dot(Ah);if(T>=0&&y<=T)return i.copy(c);const C=y*p-m*T;if(C<=0&&p>=0&&T<=0)return d=p/(p-T),i.copy(s).addScaledVector(Tr,d);const M=g*T-y*_;if(M<=0&&_-g>=0&&y-T>=0)return m_.subVectors(c,l),d=(_-g)/(_-g+(y-T)),i.copy(l).addScaledVector(m_,d);const v=1/(M+C+x);return f=C*v,d=x*v,i.copy(s).addScaledVector(Er,f).addScaledVector(Tr,d)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const yv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ja={h:0,s:0,l:0},Ac={h:0,s:0,l:0};function Dh(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class Fe{constructor(t,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,s)}set(t,i,s){if(i===void 0&&s===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,s);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=ni){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,De.colorSpaceToWorking(this,i),this}setRGB(t,i,s,l=De.workingColorSpace){return this.r=t,this.g=i,this.b=s,De.colorSpaceToWorking(this,l),this}setHSL(t,i,s,l=De.workingColorSpace){if(t=jy(t,1),i=Te(i,0,1),s=Te(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,f=2*s-c;this.r=Dh(f,c,t+1/3),this.g=Dh(f,c,t),this.b=Dh(f,c,t-1/3)}return De.colorSpaceToWorking(this,l),this}setStyle(t,i=ni){function s(c){c!==void 0&&parseFloat(c)<1&&pe("Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const f=l[1],d=l[2];switch(f){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:pe("Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],f=c.length;if(f===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(f===6)return this.setHex(parseInt(c,16),i);pe("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=ni){const s=yv[t.toLowerCase()];return s!==void 0?this.setHex(s,i):pe("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=va(t.r),this.g=va(t.g),this.b=va(t.b),this}copyLinearToSRGB(t){return this.r=Nr(t.r),this.g=Nr(t.g),this.b=Nr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ni){return De.workingToColorSpace(On.copy(this),t),Math.round(Te(On.r*255,0,255))*65536+Math.round(Te(On.g*255,0,255))*256+Math.round(Te(On.b*255,0,255))}getHexString(t=ni){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=De.workingColorSpace){De.workingToColorSpace(On.copy(this),i);const s=On.r,l=On.g,c=On.b,f=Math.max(s,l,c),d=Math.min(s,l,c);let m,p;const g=(d+f)/2;if(d===f)m=0,p=0;else{const _=f-d;switch(p=g<=.5?_/(f+d):_/(2-f-d),f){case s:m=(l-c)/_+(l<c?6:0);break;case l:m=(c-s)/_+2;break;case c:m=(s-l)/_+4;break}m/=6}return t.h=m,t.s=p,t.l=g,t}getRGB(t,i=De.workingColorSpace){return De.workingToColorSpace(On.copy(this),i),t.r=On.r,t.g=On.g,t.b=On.b,t}getStyle(t=ni){De.workingToColorSpace(On.copy(this),t);const i=On.r,s=On.g,l=On.b;return t!==ni?`color(${t} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(t,i,s){return this.getHSL(Ja),this.setHSL(Ja.h+t,Ja.s+i,Ja.l+s)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,s){return this.r=t.r+(i.r-t.r)*s,this.g=t.g+(i.g-t.g)*s,this.b=t.b+(i.b-t.b)*s,this}lerpHSL(t,i){this.getHSL(Ja),t.getHSL(Ac);const s=hh(Ja.h,Ac.h,i),l=hh(Ja.s,Ac.s,i),c=hh(Ja.l,Ac.l,i);return this.setHSL(s,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,s=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const On=new Fe;Fe.NAMES=yv;let cM=0;class al extends Ir{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cM++}),this.uuid=Hr(),this.name="",this.type="Material",this.blending=Ur,this.side=es,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wh,this.blendDst=qh,this.blendEquation=Rs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=Lr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=t_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mr,this.stencilZFail=mr,this.stencilZPass=mr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const s=t[i];if(s===void 0){pe(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){pe(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(t).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(t).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(t).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(t).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(t).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ur&&(s.blending=this.blending),this.side!==es&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Wh&&(s.blendSrc=this.blendSrc),this.blendDst!==qh&&(s.blendDst=this.blendDst),this.blendEquation!==Rs&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Lr&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==t_&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mr&&(s.stencilFail=this.stencilFail),this.stencilZFail!==mr&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==mr&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.allowOverride===!1&&(s.allowOverride=!1),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const f=[];for(const d in c){const m=c[d];delete m.metadata,f.push(m)}return f}if(i){const c=l(t.textures),f=l(t.images);c.length>0&&(s.textures=c),f.length>0&&(s.images=f)}return s}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class tp extends al{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vi,this.combine=ev,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const hn=new Z,Rc=new Wt;let uM=0;class Hi{constructor(t,i,s=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:uM++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=s,this.usage=e_,this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,s){t*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[s+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Rc.fromBufferAttribute(this,i),Rc.applyMatrix3(t),this.setXY(i,Rc.x,Rc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix3(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyMatrix4(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix4(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyNormalMatrix(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.transformDirection(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let s=this.array[t*this.itemSize+i];return this.normalized&&(s=Fo(s,this.array)),s}setComponent(t,i,s){return this.normalized&&(s=Wn(s,this.array)),this.array[t*this.itemSize+i]=s,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Fo(i,this.array)),i}setX(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Fo(i,this.array)),i}setY(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Fo(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Fo(i,this.array)),i}setW(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,s){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array)),this.array[t+0]=i,this.array[t+1]=s,this}setXYZ(t,i,s,l){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this}setXYZW(t,i,s,l,c){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array),c=Wn(c,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==e_&&(t.usage=this.usage),t}}class Mv extends Hi{constructor(t,i,s){super(new Uint16Array(t),i,s)}}class Ev extends Hi{constructor(t,i,s){super(new Uint32Array(t),i,s)}}class Ri extends Hi{constructor(t,i,s){super(new Float32Array(t),i,s)}}let fM=0;const pi=new tn,Uh=new zn,br=new Z,ei=new il,Go=new il,vn=new Z;class Xi extends Ir{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fM++}),this.uuid=Hr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vv(t)?Ev:Mv)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,s=0){this.groups.push({start:t,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new xe().getNormalMatrix(t);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pi.makeRotationFromQuaternion(t),this.applyMatrix4(pi),this}rotateX(t){return pi.makeRotationX(t),this.applyMatrix4(pi),this}rotateY(t){return pi.makeRotationY(t),this.applyMatrix4(pi),this}rotateZ(t){return pi.makeRotationZ(t),this.applyMatrix4(pi),this}translate(t,i,s){return pi.makeTranslation(t,i,s),this.applyMatrix4(pi),this}scale(t,i,s){return pi.makeScale(t,i,s),this.applyMatrix4(pi),this}lookAt(t){return Uh.lookAt(t),Uh.updateMatrix(),this.applyMatrix4(Uh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(br).negate(),this.translate(br.x,br.y,br.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=t.length;l<c;l++){const f=t[l];s.push(f.x,f.y,f.z||0)}this.setAttribute("position",new Ri(s,3))}else{const s=Math.min(t.length,i.count);for(let l=0;l<s;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new il);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){we("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];ei.setFromBufferAttribute(c),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,ei.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,ei.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(ei.min),this.boundingBox.expandByPoint(ei.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&we('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $d);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){we("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(t){const s=this.boundingSphere.center;if(ei.setFromBufferAttribute(t),i)for(let c=0,f=i.length;c<f;c++){const d=i[c];Go.setFromBufferAttribute(d),this.morphTargetsRelative?(vn.addVectors(ei.min,Go.min),ei.expandByPoint(vn),vn.addVectors(ei.max,Go.max),ei.expandByPoint(vn)):(ei.expandByPoint(Go.min),ei.expandByPoint(Go.max))}ei.getCenter(s);let l=0;for(let c=0,f=t.count;c<f;c++)vn.fromBufferAttribute(t,c),l=Math.max(l,s.distanceToSquared(vn));if(i)for(let c=0,f=i.length;c<f;c++){const d=i[c],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)vn.fromBufferAttribute(d,p),m&&(br.fromBufferAttribute(t,p),vn.add(br)),l=Math.max(l,s.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&we('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){we("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hi(new Float32Array(4*s.count),4));const f=this.getAttribute("tangent"),d=[],m=[];for(let q=0;q<s.count;q++)d[q]=new Z,m[q]=new Z;const p=new Z,g=new Z,_=new Z,x=new Wt,y=new Wt,T=new Wt,C=new Z,M=new Z;function v(q,b,w){p.fromBufferAttribute(s,q),g.fromBufferAttribute(s,b),_.fromBufferAttribute(s,w),x.fromBufferAttribute(c,q),y.fromBufferAttribute(c,b),T.fromBufferAttribute(c,w),g.sub(p),_.sub(p),y.sub(x),T.sub(x);const V=1/(y.x*T.y-T.x*y.y);isFinite(V)&&(C.copy(g).multiplyScalar(T.y).addScaledVector(_,-y.y).multiplyScalar(V),M.copy(_).multiplyScalar(y.x).addScaledVector(g,-T.x).multiplyScalar(V),d[q].add(C),d[b].add(C),d[w].add(C),m[q].add(M),m[b].add(M),m[w].add(M))}let P=this.groups;P.length===0&&(P=[{start:0,count:t.count}]);for(let q=0,b=P.length;q<b;++q){const w=P[q],V=w.start,nt=w.count;for(let it=V,dt=V+nt;it<dt;it+=3)v(t.getX(it+0),t.getX(it+1),t.getX(it+2))}const U=new Z,D=new Z,L=new Z,I=new Z;function F(q){L.fromBufferAttribute(l,q),I.copy(L);const b=d[q];U.copy(b),U.sub(L.multiplyScalar(L.dot(b))).normalize(),D.crossVectors(I,b);const V=D.dot(m[q])<0?-1:1;f.setXYZW(q,U.x,U.y,U.z,V)}for(let q=0,b=P.length;q<b;++q){const w=P[q],V=w.start,nt=w.count;for(let it=V,dt=V+nt;it<dt;it+=3)F(t.getX(it+0)),F(t.getX(it+1)),F(t.getX(it+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Hi(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let x=0,y=s.count;x<y;x++)s.setXYZ(x,0,0,0);const l=new Z,c=new Z,f=new Z,d=new Z,m=new Z,p=new Z,g=new Z,_=new Z;if(t)for(let x=0,y=t.count;x<y;x+=3){const T=t.getX(x+0),C=t.getX(x+1),M=t.getX(x+2);l.fromBufferAttribute(i,T),c.fromBufferAttribute(i,C),f.fromBufferAttribute(i,M),g.subVectors(f,c),_.subVectors(l,c),g.cross(_),d.fromBufferAttribute(s,T),m.fromBufferAttribute(s,C),p.fromBufferAttribute(s,M),d.add(g),m.add(g),p.add(g),s.setXYZ(T,d.x,d.y,d.z),s.setXYZ(C,m.x,m.y,m.z),s.setXYZ(M,p.x,p.y,p.z)}else for(let x=0,y=i.count;x<y;x+=3)l.fromBufferAttribute(i,x+0),c.fromBufferAttribute(i,x+1),f.fromBufferAttribute(i,x+2),g.subVectors(f,c),_.subVectors(l,c),g.cross(_),s.setXYZ(x+0,g.x,g.y,g.z),s.setXYZ(x+1,g.x,g.y,g.z),s.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,s=t.count;i<s;i++)vn.fromBufferAttribute(t,i),vn.normalize(),t.setXYZ(i,vn.x,vn.y,vn.z)}toNonIndexed(){function t(d,m){const p=d.array,g=d.itemSize,_=d.normalized,x=new p.constructor(m.length*g);let y=0,T=0;for(let C=0,M=m.length;C<M;C++){d.isInterleavedBufferAttribute?y=m[C]*d.data.stride+d.offset:y=m[C]*g;for(let v=0;v<g;v++)x[T++]=p[y++]}return new Hi(x,g,_)}if(this.index===null)return pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Xi,s=this.index.array,l=this.attributes;for(const d in l){const m=l[d],p=t(m,s);i.setAttribute(d,p)}const c=this.morphAttributes;for(const d in c){const m=[],p=c[d];for(let g=0,_=p.length;g<_;g++){const x=p[g],y=t(x,s);m.push(y)}i.morphAttributes[d]=m}i.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let d=0,m=f.length;d<m;d++){const p=f[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(t[p]=m[p]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const p=s[m];t.data.attributes[m]=p.toJSON(t.data)}const l={};let c=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let _=0,x=p.length;_<x;_++){const y=p[_];g.push(y.toJSON(t.data))}g.length>0&&(l[m]=g,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(t.data.groups=JSON.parse(JSON.stringify(f)));const d=this.boundingSphere;return d!==null&&(t.data.boundingSphere=d.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const s=t.index;s!==null&&this.setIndex(s.clone());const l=t.attributes;for(const p in l){const g=l[p];this.setAttribute(p,g.clone(i))}const c=t.morphAttributes;for(const p in c){const g=[],_=c[p];for(let x=0,y=_.length;x<y;x++)g.push(_[x].clone(i));this.morphAttributes[p]=g}this.morphTargetsRelative=t.morphTargetsRelative;const f=t.groups;for(let p=0,g=f.length;p<g;p++){const _=f[p];this.addGroup(_.start,_.count,_.materialIndex)}const d=t.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const g_=new tn,Ms=new nM,Cc=new $d,__=new Z,wc=new Z,Dc=new Z,Uc=new Z,Nh=new Z,Nc=new Z,v_=new Z,Lc=new Z;class Ci extends zn{constructor(t=new Xi,i=new tp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(t,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,f=s.morphTargetsRelative;i.fromBufferAttribute(l,t);const d=this.morphTargetInfluences;if(c&&d){Nc.set(0,0,0);for(let m=0,p=c.length;m<p;m++){const g=d[m],_=c[m];g!==0&&(Nh.fromBufferAttribute(_,t),f?Nc.addScaledVector(Nh,g):Nc.addScaledVector(Nh.sub(i),g))}i.add(Nc)}return i}raycast(t,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Cc.copy(s.boundingSphere),Cc.applyMatrix4(c),Ms.copy(t.ray).recast(t.near),!(Cc.containsPoint(Ms.origin)===!1&&(Ms.intersectSphere(Cc,__)===null||Ms.origin.distanceToSquared(__)>(t.far-t.near)**2))&&(g_.copy(c).invert(),Ms.copy(t.ray).applyMatrix4(g_),!(s.boundingBox!==null&&Ms.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(t,i,Ms)))}_computeIntersections(t,i,s){let l;const c=this.geometry,f=this.material,d=c.index,m=c.attributes.position,p=c.attributes.uv,g=c.attributes.uv1,_=c.attributes.normal,x=c.groups,y=c.drawRange;if(d!==null)if(Array.isArray(f))for(let T=0,C=x.length;T<C;T++){const M=x[T],v=f[M.materialIndex],P=Math.max(M.start,y.start),U=Math.min(d.count,Math.min(M.start+M.count,y.start+y.count));for(let D=P,L=U;D<L;D+=3){const I=d.getX(D),F=d.getX(D+1),q=d.getX(D+2);l=Oc(this,v,t,s,p,g,_,I,F,q),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),C=Math.min(d.count,y.start+y.count);for(let M=T,v=C;M<v;M+=3){const P=d.getX(M),U=d.getX(M+1),D=d.getX(M+2);l=Oc(this,f,t,s,p,g,_,P,U,D),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(f))for(let T=0,C=x.length;T<C;T++){const M=x[T],v=f[M.materialIndex],P=Math.max(M.start,y.start),U=Math.min(m.count,Math.min(M.start+M.count,y.start+y.count));for(let D=P,L=U;D<L;D+=3){const I=D,F=D+1,q=D+2;l=Oc(this,v,t,s,p,g,_,I,F,q),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),C=Math.min(m.count,y.start+y.count);for(let M=T,v=C;M<v;M+=3){const P=M,U=M+1,D=M+2;l=Oc(this,f,t,s,p,g,_,P,U,D),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}}}function hM(r,t,i,s,l,c,f,d){let m;if(t.side===qn?m=s.intersectTriangle(f,c,l,!0,d):m=s.intersectTriangle(l,c,f,t.side===es,d),m===null)return null;Lc.copy(d),Lc.applyMatrix4(r.matrixWorld);const p=i.ray.origin.distanceTo(Lc);return p<i.near||p>i.far?null:{distance:p,point:Lc.clone(),object:r}}function Oc(r,t,i,s,l,c,f,d,m,p){r.getVertexPosition(d,wc),r.getVertexPosition(m,Dc),r.getVertexPosition(p,Uc);const g=hM(r,t,i,s,wc,Dc,Uc,v_);if(g){const _=new Z;bi.getBarycoord(v_,wc,Dc,Uc,_),l&&(g.uv=bi.getInterpolatedAttribute(l,d,m,p,_,new Wt)),c&&(g.uv1=bi.getInterpolatedAttribute(c,d,m,p,_,new Wt)),f&&(g.normal=bi.getInterpolatedAttribute(f,d,m,p,_,new Z),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const x={a:d,b:m,c:p,normal:new Z,materialIndex:0};bi.getNormal(wc,Dc,Uc,x.normal),g.face=x,g.barycoord=_}return g}class sl extends Xi{constructor(t=1,i=1,s=1,l=1,c=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:f};const d=this;l=Math.floor(l),c=Math.floor(c),f=Math.floor(f);const m=[],p=[],g=[],_=[];let x=0,y=0;T("z","y","x",-1,-1,s,i,t,f,c,0),T("z","y","x",1,-1,s,i,-t,f,c,1),T("x","z","y",1,1,t,s,i,l,f,2),T("x","z","y",1,-1,t,s,-i,l,f,3),T("x","y","z",1,-1,t,i,s,l,c,4),T("x","y","z",-1,-1,t,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new Ri(p,3)),this.setAttribute("normal",new Ri(g,3)),this.setAttribute("uv",new Ri(_,2));function T(C,M,v,P,U,D,L,I,F,q,b){const w=D/F,V=L/q,nt=D/2,it=L/2,dt=I/2,rt=F+1,B=q+1;let H=0,$=0;const yt=new Z;for(let xt=0;xt<B;xt++){const O=xt*V-it;for(let K=0;K<rt;K++){const ft=K*w-nt;yt[C]=ft*P,yt[M]=O*U,yt[v]=dt,p.push(yt.x,yt.y,yt.z),yt[C]=0,yt[M]=0,yt[v]=I>0?1:-1,g.push(yt.x,yt.y,yt.z),_.push(K/F),_.push(1-xt/q),H+=1}}for(let xt=0;xt<q;xt++)for(let O=0;O<F;O++){const K=x+O+rt*xt,ft=x+O+rt*(xt+1),Et=x+(O+1)+rt*(xt+1),Rt=x+(O+1)+rt*xt;m.push(K,ft,Rt),m.push(ft,Et,Rt),$+=6}d.addGroup(y,$,b),y+=$,x+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sl(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Fr(r){const t={};for(const i in r){t[i]={};for(const s in r[i]){const l=r[i][s];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][s]=null):t[i][s]=l.clone():Array.isArray(l)?t[i][s]=l.slice():t[i][s]=l}}return t}function Bn(r){const t={};for(let i=0;i<r.length;i++){const s=Fr(r[i]);for(const l in s)t[l]=s[l]}return t}function dM(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function Tv(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:De.workingColorSpace}const pM={clone:Fr,merge:Bn};var mM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends al{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mM,this.fragmentShader=gM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fr(t.uniforms),this.uniformsGroups=dM(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const f=this.uniforms[l].value;f&&f.isTexture?i.uniforms[l]={type:"t",value:f.toJSON(t).uuid}:f&&f.isColor?i.uniforms[l]={type:"c",value:f.getHex()}:f&&f.isVector2?i.uniforms[l]={type:"v2",value:f.toArray()}:f&&f.isVector3?i.uniforms[l]={type:"v3",value:f.toArray()}:f&&f.isVector4?i.uniforms[l]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?i.uniforms[l]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?i.uniforms[l]={type:"m4",value:f.toArray()}:i.uniforms[l]={value:f}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class bv extends zn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tn,this.projectionMatrix=new tn,this.projectionMatrixInverse=new tn,this.coordinateSystem=Fi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qa=new Z,x_=new Wt,S_=new Wt;class mi extends bv{constructor(t=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=zd*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zd*2*Math.atan(Math.tan(fh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,s){Qa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qa.x,Qa.y).multiplyScalar(-t/Qa.z),Qa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(Qa.x,Qa.y).multiplyScalar(-t/Qa.z)}getViewSize(t,i){return this.getViewBounds(t,x_,S_),i.subVectors(S_,x_)}setViewOffset(t,i,s,l,c,f){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(fh*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const f=this.view;if(this.view!==null&&this.view.enabled){const m=f.fullWidth,p=f.fullHeight;c+=f.offsetX*l/m,i-=f.offsetY*s/p,l*=f.width/m,s*=f.height/p}const d=this.filmOffset;d!==0&&(c+=t*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const Ar=-90,Rr=1;class _M extends zn{constructor(t,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new mi(Ar,Rr,t,i);l.layers=this.layers,this.add(l);const c=new mi(Ar,Rr,t,i);c.layers=this.layers,this.add(c);const f=new mi(Ar,Rr,t,i);f.layers=this.layers,this.add(f);const d=new mi(Ar,Rr,t,i);d.layers=this.layers,this.add(d);const m=new mi(Ar,Rr,t,i);m.layers=this.layers,this.add(m);const p=new mi(Ar,Rr,t,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[s,l,c,f,d,m]=i;for(const p of i)this.remove(p);if(t===Fi)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===Zc)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const p of i)this.add(p),p.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,f,d,m,p,g]=this.children,_=t.getRenderTarget(),x=t.getActiveCubeFace(),y=t.getActiveMipmapLevel(),T=t.xr.enabled;t.xr.enabled=!1;const C=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,t.setRenderTarget(s,0,l),t.render(i,c),t.setRenderTarget(s,1,l),t.render(i,f),t.setRenderTarget(s,2,l),t.render(i,d),t.setRenderTarget(s,3,l),t.render(i,m),t.setRenderTarget(s,4,l),t.render(i,p),s.texture.generateMipmaps=C,t.setRenderTarget(s,5,l),t.render(i,g),t.setRenderTarget(_,x,y),t.xr.enabled=T,s.texture.needsPMREMUpdate=!0}}class Av extends Pn{constructor(t=[],i=Us,s,l,c,f,d,m,p,g){super(t,i,s,l,c,f,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Rv extends Ii{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const s={width:t,height:t,depth:1},l=[s,s,s,s,s,s];this.texture=new Av(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new sl(5,5,5),c=new ki({name:"CubemapFromEquirect",uniforms:Fr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:qn,blending:_a});c.uniforms.tEquirect.value=i;const f=new Ci(l,c),d=i.minFilter;return i.minFilter===ws&&(i.minFilter=xn),new _M(1,10,this).update(t,f),i.minFilter=d,f.geometry.dispose(),f.material.dispose(),this}clear(t,i=!0,s=!0,l=!0){const c=t.getRenderTarget();for(let f=0;f<6;f++)t.setRenderTarget(this,f),t.clear(i,s,l);t.setRenderTarget(c)}}class wr extends zn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vM={type:"move"};class Lh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const s of t.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,s){let l=null,c=null,f=null;const d=this._targetRay,m=this._grip,p=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(p&&t.hand){f=!0;for(const C of t.hand.values()){const M=i.getJointPose(C,s),v=this._getHandJoint(p,C);M!==null&&(v.matrix.fromArray(M.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=M.radius),v.visible=M!==null}const g=p.joints["index-finger-tip"],_=p.joints["thumb-tip"],x=g.position.distanceTo(_.position),y=.02,T=.005;p.inputState.pinching&&x>y+T?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!p.inputState.pinching&&x<=y-T&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(l=i.getPose(t.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(vM)))}return d!==null&&(d.visible=l!==null),m!==null&&(m.visible=c!==null),p!==null&&(p.visible=f!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const s=new wr;s.matrixAutoUpdate=!1,s.visible=!1,t.joints[i.jointName]=s,t.add(s)}return t.joints[i.jointName]}}class xM extends zn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vi,this.environmentIntensity=1,this.environmentRotation=new Vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class SM extends Pn{constructor(t=null,i=1,s=1,l,c,f,d,m,p=Dn,g=Dn,_,x){super(null,f,d,m,p,g,l,c,_,x),this.isDataTexture=!0,this.image={data:t,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Oh=new Z,yM=new Z,MM=new xe;class As{constructor(t=new Z(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,s,l){return this.normal.set(t,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,s){const l=Oh.subVectors(s,i).cross(yM.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const s=t.delta(Oh),l=this.normal.dot(s);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const c=-(t.start.dot(this.normal)+this.constant)/l;return c<0||c>1?null:i.copy(t.start).addScaledVector(s,c)}intersectsLine(t){const i=this.distanceToPoint(t.start),s=this.distanceToPoint(t.end);return i<0&&s>0||s<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const s=i||MM.getNormalMatrix(t),l=this.coplanarPoint(Oh).applyMatrix4(t),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Es=new $d,EM=new Wt(.5,.5),Pc=new Z;class ep{constructor(t=new As,i=new As,s=new As,l=new As,c=new As,f=new As){this.planes=[t,i,s,l,c,f]}set(t,i,s,l,c,f){const d=this.planes;return d[0].copy(t),d[1].copy(i),d[2].copy(s),d[3].copy(l),d[4].copy(c),d[5].copy(f),this}copy(t){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(t.planes[s]);return this}setFromProjectionMatrix(t,i=Fi,s=!1){const l=this.planes,c=t.elements,f=c[0],d=c[1],m=c[2],p=c[3],g=c[4],_=c[5],x=c[6],y=c[7],T=c[8],C=c[9],M=c[10],v=c[11],P=c[12],U=c[13],D=c[14],L=c[15];if(l[0].setComponents(p-f,y-g,v-T,L-P).normalize(),l[1].setComponents(p+f,y+g,v+T,L+P).normalize(),l[2].setComponents(p+d,y+_,v+C,L+U).normalize(),l[3].setComponents(p-d,y-_,v-C,L-U).normalize(),s)l[4].setComponents(m,x,M,D).normalize(),l[5].setComponents(p-m,y-x,v-M,L-D).normalize();else if(l[4].setComponents(p-m,y-x,v-M,L-D).normalize(),i===Fi)l[5].setComponents(p+m,y+x,v+M,L+D).normalize();else if(i===Zc)l[5].setComponents(m,x,M,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Es.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Es)}intersectsSprite(t){Es.center.set(0,0,0);const i=EM.distanceTo(t.center);return Es.radius=.7071067811865476+i,Es.applyMatrix4(t.matrixWorld),this.intersectsSphere(Es)}intersectsSphere(t){const i=this.planes,s=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Pc.x=l.normal.x>0?t.max.x:t.min.x,Pc.y=l.normal.y>0?t.max.y:t.min.y,Pc.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Pc)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class TM extends Pn{constructor(t,i,s,l,c,f,d,m,p){super(t,i,s,l,c,f,d,m,p),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qo extends Pn{constructor(t,i,s=Gi,l,c,f,d=Dn,m=Dn,p,g=Sa,_=1){if(g!==Sa&&g!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const x={width:t,height:i,depth:_};super(x,l,c,f,d,m,g,s,p),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Qd(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class bM extends Qo{constructor(t,i=Gi,s=Us,l,c,f=Dn,d=Dn,m,p=Sa){const g={width:t,height:t,depth:1},_=[g,g,g,g,g,g];super(t,t,i,s,l,c,f,d,m,p),this.image=_,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Cv extends Pn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Wi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){pe("Curve: .getPoint() not implemented.")}getPointAt(t,i){const s=this.getUtoTmapping(t);return this.getPoint(s,i)}getPoints(t=5){const i=[];for(let s=0;s<=t;s++)i.push(this.getPoint(s/t));return i}getSpacedPoints(t=5){const i=[];for(let s=0;s<=t;s++)i.push(this.getPointAt(s/t));return i}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const i=[];let s,l=this.getPoint(0),c=0;i.push(0);for(let f=1;f<=t;f++)s=this.getPoint(f/t),c+=s.distanceTo(l),i.push(c),l=s;return this.cacheArcLengths=i,i}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,i=null){const s=this.getLengths();let l=0;const c=s.length;let f;i?f=i:f=t*s[c-1];let d=0,m=c-1,p;for(;d<=m;)if(l=Math.floor(d+(m-d)/2),p=s[l]-f,p<0)d=l+1;else if(p>0)m=l-1;else{m=l;break}if(l=m,s[l]===f)return l/(c-1);const g=s[l],x=s[l+1]-g,y=(f-g)/x;return(l+y)/(c-1)}getTangent(t,i){let l=t-1e-4,c=t+1e-4;l<0&&(l=0),c>1&&(c=1);const f=this.getPoint(l),d=this.getPoint(c),m=i||(f.isVector2?new Wt:new Z);return m.copy(d).sub(f).normalize(),m}getTangentAt(t,i){const s=this.getUtoTmapping(t);return this.getTangent(s,i)}computeFrenetFrames(t,i=!1){const s=new Z,l=[],c=[],f=[],d=new Z,m=new tn;for(let y=0;y<=t;y++){const T=y/t;l[y]=this.getTangentAt(T,new Z)}c[0]=new Z,f[0]=new Z;let p=Number.MAX_VALUE;const g=Math.abs(l[0].x),_=Math.abs(l[0].y),x=Math.abs(l[0].z);g<=p&&(p=g,s.set(1,0,0)),_<=p&&(p=_,s.set(0,1,0)),x<=p&&s.set(0,0,1),d.crossVectors(l[0],s).normalize(),c[0].crossVectors(l[0],d),f[0].crossVectors(l[0],c[0]);for(let y=1;y<=t;y++){if(c[y]=c[y-1].clone(),f[y]=f[y-1].clone(),d.crossVectors(l[y-1],l[y]),d.length()>Number.EPSILON){d.normalize();const T=Math.acos(Te(l[y-1].dot(l[y]),-1,1));c[y].applyMatrix4(m.makeRotationAxis(d,T))}f[y].crossVectors(l[y],c[y])}if(i===!0){let y=Math.acos(Te(c[0].dot(c[t]),-1,1));y/=t,l[0].dot(d.crossVectors(c[0],c[t]))>0&&(y=-y);for(let T=1;T<=t;T++)c[T].applyMatrix4(m.makeRotationAxis(l[T],y*T)),f[T].crossVectors(l[T],c[T])}return{tangents:l,normals:c,binormals:f}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class np extends Wi{constructor(t=0,i=0,s=1,l=1,c=0,f=Math.PI*2,d=!1,m=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=i,this.xRadius=s,this.yRadius=l,this.aStartAngle=c,this.aEndAngle=f,this.aClockwise=d,this.aRotation=m}getPoint(t,i=new Wt){const s=i,l=Math.PI*2;let c=this.aEndAngle-this.aStartAngle;const f=Math.abs(c)<Number.EPSILON;for(;c<0;)c+=l;for(;c>l;)c-=l;c<Number.EPSILON&&(f?c=0:c=l),this.aClockwise===!0&&!f&&(c===l?c=-l:c=c-l);const d=this.aStartAngle+t*c;let m=this.aX+this.xRadius*Math.cos(d),p=this.aY+this.yRadius*Math.sin(d);if(this.aRotation!==0){const g=Math.cos(this.aRotation),_=Math.sin(this.aRotation),x=m-this.aX,y=p-this.aY;m=x*g-y*_+this.aX,p=x*_+y*g+this.aY}return s.set(m,p)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class AM extends np{constructor(t,i,s,l,c,f){super(t,i,s,s,l,c,f),this.isArcCurve=!0,this.type="ArcCurve"}}function ip(){let r=0,t=0,i=0,s=0;function l(c,f,d,m){r=c,t=d,i=-3*c+3*f-2*d-m,s=2*c-2*f+d+m}return{initCatmullRom:function(c,f,d,m,p){l(f,d,p*(d-c),p*(m-f))},initNonuniformCatmullRom:function(c,f,d,m,p,g,_){let x=(f-c)/p-(d-c)/(p+g)+(d-f)/g,y=(d-f)/g-(m-f)/(g+_)+(m-d)/_;x*=g,y*=g,l(f,d,x,y)},calc:function(c){const f=c*c,d=f*c;return r+t*c+i*f+s*d}}}const zc=new Z,Ph=new ip,zh=new ip,Fh=new ip;class RM extends Wi{constructor(t=[],i=!1,s="centripetal",l=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=i,this.curveType=s,this.tension=l}getPoint(t,i=new Z){const s=i,l=this.points,c=l.length,f=(c-(this.closed?0:1))*t;let d=Math.floor(f),m=f-d;this.closed?d+=d>0?0:(Math.floor(Math.abs(d)/c)+1)*c:m===0&&d===c-1&&(d=c-2,m=1);let p,g;this.closed||d>0?p=l[(d-1)%c]:(zc.subVectors(l[0],l[1]).add(l[0]),p=zc);const _=l[d%c],x=l[(d+1)%c];if(this.closed||d+2<c?g=l[(d+2)%c]:(zc.subVectors(l[c-1],l[c-2]).add(l[c-1]),g=zc),this.curveType==="centripetal"||this.curveType==="chordal"){const y=this.curveType==="chordal"?.5:.25;let T=Math.pow(p.distanceToSquared(_),y),C=Math.pow(_.distanceToSquared(x),y),M=Math.pow(x.distanceToSquared(g),y);C<1e-4&&(C=1),T<1e-4&&(T=C),M<1e-4&&(M=C),Ph.initNonuniformCatmullRom(p.x,_.x,x.x,g.x,T,C,M),zh.initNonuniformCatmullRom(p.y,_.y,x.y,g.y,T,C,M),Fh.initNonuniformCatmullRom(p.z,_.z,x.z,g.z,T,C,M)}else this.curveType==="catmullrom"&&(Ph.initCatmullRom(p.x,_.x,x.x,g.x,this.tension),zh.initCatmullRom(p.y,_.y,x.y,g.y,this.tension),Fh.initCatmullRom(p.z,_.z,x.z,g.z,this.tension));return s.set(Ph.calc(m),zh.calc(m),Fh.calc(m)),s}copy(t){super.copy(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(l.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let i=0,s=this.points.length;i<s;i++){const l=this.points[i];t.points.push(l.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(new Z().fromArray(l))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function y_(r,t,i,s,l){const c=(s-t)*.5,f=(l-i)*.5,d=r*r,m=r*d;return(2*i-2*s+c+f)*m+(-3*i+3*s-2*c-f)*d+c*r+i}function CM(r,t){const i=1-r;return i*i*t}function wM(r,t){return 2*(1-r)*r*t}function DM(r,t){return r*r*t}function Yo(r,t,i,s){return CM(r,t)+wM(r,i)+DM(r,s)}function UM(r,t){const i=1-r;return i*i*i*t}function NM(r,t){const i=1-r;return 3*i*i*r*t}function LM(r,t){return 3*(1-r)*r*r*t}function OM(r,t){return r*r*r*t}function jo(r,t,i,s,l){return UM(r,t)+NM(r,i)+LM(r,s)+OM(r,l)}class wv extends Wi{constructor(t=new Wt,i=new Wt,s=new Wt,l=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=i,this.v2=s,this.v3=l}getPoint(t,i=new Wt){const s=i,l=this.v0,c=this.v1,f=this.v2,d=this.v3;return s.set(jo(t,l.x,c.x,f.x,d.x),jo(t,l.y,c.y,f.y,d.y)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class PM extends Wi{constructor(t=new Z,i=new Z,s=new Z,l=new Z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=i,this.v2=s,this.v3=l}getPoint(t,i=new Z){const s=i,l=this.v0,c=this.v1,f=this.v2,d=this.v3;return s.set(jo(t,l.x,c.x,f.x,d.x),jo(t,l.y,c.y,f.y,d.y),jo(t,l.z,c.z,f.z,d.z)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Dv extends Wi{constructor(t=new Wt,i=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=i}getPoint(t,i=new Wt){const s=i;return t===1?s.copy(this.v2):(s.copy(this.v2).sub(this.v1),s.multiplyScalar(t).add(this.v1)),s}getPointAt(t,i){return this.getPoint(t,i)}getTangent(t,i=new Wt){return i.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,i){return this.getTangent(t,i)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zM extends Wi{constructor(t=new Z,i=new Z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=i}getPoint(t,i=new Z){const s=i;return t===1?s.copy(this.v2):(s.copy(this.v2).sub(this.v1),s.multiplyScalar(t).add(this.v1)),s}getPointAt(t,i){return this.getPoint(t,i)}getTangent(t,i=new Z){return i.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,i){return this.getTangent(t,i)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uv extends Wi{constructor(t=new Wt,i=new Wt,s=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=i,this.v2=s}getPoint(t,i=new Wt){const s=i,l=this.v0,c=this.v1,f=this.v2;return s.set(Yo(t,l.x,c.x,f.x),Yo(t,l.y,c.y,f.y)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class FM extends Wi{constructor(t=new Z,i=new Z,s=new Z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=i,this.v2=s}getPoint(t,i=new Z){const s=i,l=this.v0,c=this.v1,f=this.v2;return s.set(Yo(t,l.x,c.x,f.x),Yo(t,l.y,c.y,f.y),Yo(t,l.z,c.z,f.z)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nv extends Wi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,i=new Wt){const s=i,l=this.points,c=(l.length-1)*t,f=Math.floor(c),d=c-f,m=l[f===0?f:f-1],p=l[f],g=l[f>l.length-2?l.length-1:f+1],_=l[f>l.length-3?l.length-1:f+2];return s.set(y_(d,m.x,p.x,g.x,_.x),y_(d,m.y,p.y,g.y,_.y)),s}copy(t){super.copy(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(l.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let i=0,s=this.points.length;i<s;i++){const l=this.points[i];t.points.push(l.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(new Wt().fromArray(l))}return this}}var Fd=Object.freeze({__proto__:null,ArcCurve:AM,CatmullRomCurve3:RM,CubicBezierCurve:wv,CubicBezierCurve3:PM,EllipseCurve:np,LineCurve:Dv,LineCurve3:zM,QuadraticBezierCurve:Uv,QuadraticBezierCurve3:FM,SplineCurve:Nv});class BM extends Wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),i=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(i)){const s=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fd[s](i,t))}return this}getPoint(t,i){const s=t*this.getLength(),l=this.getCurveLengths();let c=0;for(;c<l.length;){if(l[c]>=s){const f=l[c]-s,d=this.curves[c],m=d.getLength(),p=m===0?0:1-f/m;return d.getPointAt(p,i)}c++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let i=0;for(let s=0,l=this.curves.length;s<l;s++)i+=this.curves[s].getLength(),t.push(i);return this.cacheLengths=t,t}getSpacedPoints(t=40){const i=[];for(let s=0;s<=t;s++)i.push(this.getPoint(s/t));return this.autoClose&&i.push(i[0]),i}getPoints(t=12){const i=[];let s;for(let l=0,c=this.curves;l<c.length;l++){const f=c[l],d=f.isEllipseCurve?t*2:f.isLineCurve||f.isLineCurve3?1:f.isSplineCurve?t*f.points.length:t,m=f.getPoints(d);for(let p=0;p<m.length;p++){const g=m[p];s&&s.equals(g)||(i.push(g),s=g)}}return this.autoClose&&i.length>1&&!i[i.length-1].equals(i[0])&&i.push(i[0]),i}copy(t){super.copy(t),this.curves=[];for(let i=0,s=t.curves.length;i<s;i++){const l=t.curves[i];this.curves.push(l.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let i=0,s=this.curves.length;i<s;i++){const l=this.curves[i];t.curves.push(l.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let i=0,s=t.curves.length;i<s;i++){const l=t.curves[i];this.curves.push(new Fd[l.type]().fromJSON(l))}return this}}class M_ extends BM{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let i=1,s=t.length;i<s;i++)this.lineTo(t[i].x,t[i].y);return this}moveTo(t,i){return this.currentPoint.set(t,i),this}lineTo(t,i){const s=new Dv(this.currentPoint.clone(),new Wt(t,i));return this.curves.push(s),this.currentPoint.set(t,i),this}quadraticCurveTo(t,i,s,l){const c=new Uv(this.currentPoint.clone(),new Wt(t,i),new Wt(s,l));return this.curves.push(c),this.currentPoint.set(s,l),this}bezierCurveTo(t,i,s,l,c,f){const d=new wv(this.currentPoint.clone(),new Wt(t,i),new Wt(s,l),new Wt(c,f));return this.curves.push(d),this.currentPoint.set(c,f),this}splineThru(t){const i=[this.currentPoint.clone()].concat(t),s=new Nv(i);return this.curves.push(s),this.currentPoint.copy(t[t.length-1]),this}arc(t,i,s,l,c,f){const d=this.currentPoint.x,m=this.currentPoint.y;return this.absarc(t+d,i+m,s,l,c,f),this}absarc(t,i,s,l,c,f){return this.absellipse(t,i,s,s,l,c,f),this}ellipse(t,i,s,l,c,f,d,m){const p=this.currentPoint.x,g=this.currentPoint.y;return this.absellipse(t+p,i+g,s,l,c,f,d,m),this}absellipse(t,i,s,l,c,f,d,m){const p=new np(t,i,s,l,c,f,d,m);if(this.curves.length>0){const _=p.getPoint(0);_.equals(this.currentPoint)||this.lineTo(_.x,_.y)}this.curves.push(p);const g=p.getPoint(1);return this.currentPoint.copy(g),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Lv extends M_{constructor(t){super(t),this.uuid=Hr(),this.type="Shape",this.holes=[]}getPointsHoles(t){const i=[];for(let s=0,l=this.holes.length;s<l;s++)i[s]=this.holes[s].getPoints(t);return i}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let i=0,s=t.holes.length;i<s;i++){const l=t.holes[i];this.holes.push(l.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let i=0,s=this.holes.length;i<s;i++){const l=this.holes[i];t.holes.push(l.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let i=0,s=t.holes.length;i<s;i++){const l=t.holes[i];this.holes.push(new M_().fromJSON(l))}return this}}function IM(r,t,i=2){const s=t&&t.length,l=s?t[0]*i:r.length;let c=Ov(r,0,l,i,!0);const f=[];if(!c||c.next===c.prev)return f;let d,m,p;if(s&&(c=XM(r,t,c,i)),r.length>80*i){d=r[0],m=r[1];let g=d,_=m;for(let x=i;x<l;x+=i){const y=r[x],T=r[x+1];y<d&&(d=y),T<m&&(m=T),y>g&&(g=y),T>_&&(_=T)}p=Math.max(g-d,_-m),p=p!==0?32767/p:0}return $o(c,f,i,d,m,p,0),f}function Ov(r,t,i,s,l){let c;if(l===eE(r,t,i,s)>0)for(let f=t;f<i;f+=s)c=E_(f/s|0,r[f],r[f+1],c);else for(let f=i-s;f>=t;f-=s)c=E_(f/s|0,r[f],r[f+1],c);return c&&Br(c,c.next)&&(el(c),c=c.next),c}function Ns(r,t){if(!r)return r;t||(t=r);let i=r,s;do if(s=!1,!i.steiner&&(Br(i,i.next)||$e(i.prev,i,i.next)===0)){if(el(i),i=t=i.prev,i===i.next)break;s=!0}else i=i.next;while(s||i!==t);return t}function $o(r,t,i,s,l,c,f){if(!r)return;!f&&c&&ZM(r,s,l,c);let d=r;for(;r.prev!==r.next;){const m=r.prev,p=r.next;if(c?GM(r,s,l,c):HM(r)){t.push(m.i,r.i,p.i),el(r),r=p.next,d=p.next;continue}if(r=p,r===d){f?f===1?(r=VM(Ns(r),t),$o(r,t,i,s,l,c,2)):f===2&&kM(r,t,i,s,l,c):$o(Ns(r),t,i,s,l,c,1);break}}}function HM(r){const t=r.prev,i=r,s=r.next;if($e(t,i,s)>=0)return!1;const l=t.x,c=i.x,f=s.x,d=t.y,m=i.y,p=s.y,g=Math.min(l,c,f),_=Math.min(d,m,p),x=Math.max(l,c,f),y=Math.max(d,m,p);let T=s.next;for(;T!==t;){if(T.x>=g&&T.x<=x&&T.y>=_&&T.y<=y&&Wo(l,d,c,m,f,p,T.x,T.y)&&$e(T.prev,T,T.next)>=0)return!1;T=T.next}return!0}function GM(r,t,i,s){const l=r.prev,c=r,f=r.next;if($e(l,c,f)>=0)return!1;const d=l.x,m=c.x,p=f.x,g=l.y,_=c.y,x=f.y,y=Math.min(d,m,p),T=Math.min(g,_,x),C=Math.max(d,m,p),M=Math.max(g,_,x),v=Bd(y,T,t,i,s),P=Bd(C,M,t,i,s);let U=r.prevZ,D=r.nextZ;for(;U&&U.z>=v&&D&&D.z<=P;){if(U.x>=y&&U.x<=C&&U.y>=T&&U.y<=M&&U!==l&&U!==f&&Wo(d,g,m,_,p,x,U.x,U.y)&&$e(U.prev,U,U.next)>=0||(U=U.prevZ,D.x>=y&&D.x<=C&&D.y>=T&&D.y<=M&&D!==l&&D!==f&&Wo(d,g,m,_,p,x,D.x,D.y)&&$e(D.prev,D,D.next)>=0))return!1;D=D.nextZ}for(;U&&U.z>=v;){if(U.x>=y&&U.x<=C&&U.y>=T&&U.y<=M&&U!==l&&U!==f&&Wo(d,g,m,_,p,x,U.x,U.y)&&$e(U.prev,U,U.next)>=0)return!1;U=U.prevZ}for(;D&&D.z<=P;){if(D.x>=y&&D.x<=C&&D.y>=T&&D.y<=M&&D!==l&&D!==f&&Wo(d,g,m,_,p,x,D.x,D.y)&&$e(D.prev,D,D.next)>=0)return!1;D=D.nextZ}return!0}function VM(r,t){let i=r;do{const s=i.prev,l=i.next.next;!Br(s,l)&&zv(s,i,i.next,l)&&tl(s,l)&&tl(l,s)&&(t.push(s.i,i.i,l.i),el(i),el(i.next),i=r=l),i=i.next}while(i!==r);return Ns(i)}function kM(r,t,i,s,l,c){let f=r;do{let d=f.next.next;for(;d!==f.prev;){if(f.i!==d.i&&QM(f,d)){let m=Fv(f,d);f=Ns(f,f.next),m=Ns(m,m.next),$o(f,t,i,s,l,c,0),$o(m,t,i,s,l,c,0);return}d=d.next}f=f.next}while(f!==r)}function XM(r,t,i,s){const l=[];for(let c=0,f=t.length;c<f;c++){const d=t[c]*s,m=c<f-1?t[c+1]*s:r.length,p=Ov(r,d,m,s,!1);p===p.next&&(p.steiner=!0),l.push(JM(p))}l.sort(WM);for(let c=0;c<l.length;c++)i=qM(l[c],i);return i}function WM(r,t){let i=r.x-t.x;if(i===0&&(i=r.y-t.y,i===0)){const s=(r.next.y-r.y)/(r.next.x-r.x),l=(t.next.y-t.y)/(t.next.x-t.x);i=s-l}return i}function qM(r,t){const i=YM(r,t);if(!i)return t;const s=Fv(i,r);return Ns(s,s.next),Ns(i,i.next)}function YM(r,t){let i=t;const s=r.x,l=r.y;let c=-1/0,f;if(Br(r,i))return i;do{if(Br(r,i.next))return i.next;if(l<=i.y&&l>=i.next.y&&i.next.y!==i.y){const _=i.x+(l-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(_<=s&&_>c&&(c=_,f=i.x<i.next.x?i:i.next,_===s))return f}i=i.next}while(i!==t);if(!f)return null;const d=f,m=f.x,p=f.y;let g=1/0;i=f;do{if(s>=i.x&&i.x>=m&&s!==i.x&&Pv(l<p?s:c,l,m,p,l<p?c:s,l,i.x,i.y)){const _=Math.abs(l-i.y)/(s-i.x);tl(i,r)&&(_<g||_===g&&(i.x>f.x||i.x===f.x&&jM(f,i)))&&(f=i,g=_)}i=i.next}while(i!==d);return f}function jM(r,t){return $e(r.prev,r,t.prev)<0&&$e(t.next,r,r.next)<0}function ZM(r,t,i,s){let l=r;do l.z===0&&(l.z=Bd(l.x,l.y,t,i,s)),l.prevZ=l.prev,l.nextZ=l.next,l=l.next;while(l!==r);l.prevZ.nextZ=null,l.prevZ=null,KM(l)}function KM(r){let t,i=1;do{let s=r,l;r=null;let c=null;for(t=0;s;){t++;let f=s,d=0;for(let p=0;p<i&&(d++,f=f.nextZ,!!f);p++);let m=i;for(;d>0||m>0&&f;)d!==0&&(m===0||!f||s.z<=f.z)?(l=s,s=s.nextZ,d--):(l=f,f=f.nextZ,m--),c?c.nextZ=l:r=l,l.prevZ=c,c=l;s=f}c.nextZ=null,i*=2}while(t>1);return r}function Bd(r,t,i,s,l){return r=(r-i)*l|0,t=(t-s)*l|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function JM(r){let t=r,i=r;do(t.x<i.x||t.x===i.x&&t.y<i.y)&&(i=t),t=t.next;while(t!==r);return i}function Pv(r,t,i,s,l,c,f,d){return(l-f)*(t-d)>=(r-f)*(c-d)&&(r-f)*(s-d)>=(i-f)*(t-d)&&(i-f)*(c-d)>=(l-f)*(s-d)}function Wo(r,t,i,s,l,c,f,d){return!(r===f&&t===d)&&Pv(r,t,i,s,l,c,f,d)}function QM(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!$M(r,t)&&(tl(r,t)&&tl(t,r)&&tE(r,t)&&($e(r.prev,r,t.prev)||$e(r,t.prev,t))||Br(r,t)&&$e(r.prev,r,r.next)>0&&$e(t.prev,t,t.next)>0)}function $e(r,t,i){return(t.y-r.y)*(i.x-t.x)-(t.x-r.x)*(i.y-t.y)}function Br(r,t){return r.x===t.x&&r.y===t.y}function zv(r,t,i,s){const l=Bc($e(r,t,i)),c=Bc($e(r,t,s)),f=Bc($e(i,s,r)),d=Bc($e(i,s,t));return!!(l!==c&&f!==d||l===0&&Fc(r,i,t)||c===0&&Fc(r,s,t)||f===0&&Fc(i,r,s)||d===0&&Fc(i,t,s))}function Fc(r,t,i){return t.x<=Math.max(r.x,i.x)&&t.x>=Math.min(r.x,i.x)&&t.y<=Math.max(r.y,i.y)&&t.y>=Math.min(r.y,i.y)}function Bc(r){return r>0?1:r<0?-1:0}function $M(r,t){let i=r;do{if(i.i!==r.i&&i.next.i!==r.i&&i.i!==t.i&&i.next.i!==t.i&&zv(i,i.next,r,t))return!0;i=i.next}while(i!==r);return!1}function tl(r,t){return $e(r.prev,r,r.next)<0?$e(r,t,r.next)>=0&&$e(r,r.prev,t)>=0:$e(r,t,r.prev)<0||$e(r,r.next,t)<0}function tE(r,t){let i=r,s=!1;const l=(r.x+t.x)/2,c=(r.y+t.y)/2;do i.y>c!=i.next.y>c&&i.next.y!==i.y&&l<(i.next.x-i.x)*(c-i.y)/(i.next.y-i.y)+i.x&&(s=!s),i=i.next;while(i!==r);return s}function Fv(r,t){const i=Id(r.i,r.x,r.y),s=Id(t.i,t.x,t.y),l=r.next,c=t.prev;return r.next=t,t.prev=r,i.next=l,l.prev=i,s.next=i,i.prev=s,c.next=s,s.prev=c,s}function E_(r,t,i,s){const l=Id(r,t,i);return s?(l.next=s.next,l.prev=s,s.next.prev=l,s.next=l):(l.prev=l,l.next=l),l}function el(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Id(r,t,i){return{i:r,x:t,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function eE(r,t,i,s){let l=0;for(let c=t,f=i-s;c<i;c+=s)l+=(r[f]-r[c])*(r[c+1]+r[f+1]),f=c;return l}class nE{static triangulate(t,i,s=2){return IM(t,i,s)}}class Dr{static area(t){const i=t.length;let s=0;for(let l=i-1,c=0;c<i;l=c++)s+=t[l].x*t[c].y-t[c].x*t[l].y;return s*.5}static isClockWise(t){return Dr.area(t)<0}static triangulateShape(t,i){const s=[],l=[],c=[];T_(t),b_(s,t);let f=t.length;i.forEach(T_);for(let m=0;m<i.length;m++)l.push(f),f+=i[m].length,b_(s,i[m]);const d=nE.triangulate(s,l);for(let m=0;m<d.length;m+=3)c.push(d.slice(m,m+3));return c}}function T_(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function b_(r,t){for(let i=0;i<t.length;i++)r.push(t[i].x),r.push(t[i].y)}class ap extends Xi{constructor(t=new Lv([new Wt(.5,.5),new Wt(-.5,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),i={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:i},t=Array.isArray(t)?t:[t];const s=this,l=[],c=[];for(let d=0,m=t.length;d<m;d++){const p=t[d];f(p)}this.setAttribute("position",new Ri(l,3)),this.setAttribute("uv",new Ri(c,2)),this.computeVertexNormals();function f(d){const m=[],p=i.curveSegments!==void 0?i.curveSegments:12,g=i.steps!==void 0?i.steps:1,_=i.depth!==void 0?i.depth:1;let x=i.bevelEnabled!==void 0?i.bevelEnabled:!0,y=i.bevelThickness!==void 0?i.bevelThickness:.2,T=i.bevelSize!==void 0?i.bevelSize:y-.1,C=i.bevelOffset!==void 0?i.bevelOffset:0,M=i.bevelSegments!==void 0?i.bevelSegments:3;const v=i.extrudePath,P=i.UVGenerator!==void 0?i.UVGenerator:iE;let U,D=!1,L,I,F,q;if(v){U=v.getSpacedPoints(g),D=!0,x=!1;const gt=v.isCatmullRomCurve3?v.closed:!1;L=v.computeFrenetFrames(g,gt),I=new Z,F=new Z,q=new Z}x||(M=0,y=0,T=0,C=0);const b=d.extractPoints(p);let w=b.shape;const V=b.holes;if(!Dr.isClockWise(w)){w=w.reverse();for(let gt=0,At=V.length;gt<At;gt++){const Mt=V[gt];Dr.isClockWise(Mt)&&(V[gt]=Mt.reverse())}}function it(gt){const Mt=10000000000000001e-36;let Bt=gt[0];for(let z=1;z<=gt.length;z++){const ie=z%gt.length,Gt=gt[ie],se=Gt.x-Bt.x,Nt=Gt.y-Bt.y,N=se*se+Nt*Nt,E=Math.max(Math.abs(Gt.x),Math.abs(Gt.y),Math.abs(Bt.x),Math.abs(Bt.y)),W=Mt*E*E;if(N<=W){gt.splice(ie,1),z--;continue}Bt=Gt}}it(w),V.forEach(it);const dt=V.length,rt=w;for(let gt=0;gt<dt;gt++){const At=V[gt];w=w.concat(At)}function B(gt,At,Mt){return At||we("ExtrudeGeometry: vec does not exist"),gt.clone().addScaledVector(At,Mt)}const H=w.length;function $(gt,At,Mt){let Bt,z,ie;const Gt=gt.x-At.x,se=gt.y-At.y,Nt=Mt.x-gt.x,N=Mt.y-gt.y,E=Gt*Gt+se*se,W=Gt*N-se*Nt;if(Math.abs(W)>Number.EPSILON){const ut=Math.sqrt(E),St=Math.sqrt(Nt*Nt+N*N),ht=At.x-se/ut,Qt=At.y+Gt/ut,Ot=Mt.x-N/St,Jt=Mt.y+Nt/St,le=((Ot-ht)*N-(Jt-Qt)*Nt)/(Gt*N-se*Nt);Bt=ht+Gt*le-gt.x,z=Qt+se*le-gt.y;const Tt=Bt*Bt+z*z;if(Tt<=2)return new Wt(Bt,z);ie=Math.sqrt(Tt/2)}else{let ut=!1;Gt>Number.EPSILON?Nt>Number.EPSILON&&(ut=!0):Gt<-Number.EPSILON?Nt<-Number.EPSILON&&(ut=!0):Math.sign(se)===Math.sign(N)&&(ut=!0),ut?(Bt=-se,z=Gt,ie=Math.sqrt(E)):(Bt=Gt,z=se,ie=Math.sqrt(E/2))}return new Wt(Bt/ie,z/ie)}const yt=[];for(let gt=0,At=rt.length,Mt=At-1,Bt=gt+1;gt<At;gt++,Mt++,Bt++)Mt===At&&(Mt=0),Bt===At&&(Bt=0),yt[gt]=$(rt[gt],rt[Mt],rt[Bt]);const xt=[];let O,K=yt.concat();for(let gt=0,At=dt;gt<At;gt++){const Mt=V[gt];O=[];for(let Bt=0,z=Mt.length,ie=z-1,Gt=Bt+1;Bt<z;Bt++,ie++,Gt++)ie===z&&(ie=0),Gt===z&&(Gt=0),O[Bt]=$(Mt[Bt],Mt[ie],Mt[Gt]);xt.push(O),K=K.concat(O)}let ft;if(M===0)ft=Dr.triangulateShape(rt,V);else{const gt=[],At=[];for(let Mt=0;Mt<M;Mt++){const Bt=Mt/M,z=y*Math.cos(Bt*Math.PI/2),ie=T*Math.sin(Bt*Math.PI/2)+C;for(let Gt=0,se=rt.length;Gt<se;Gt++){const Nt=B(rt[Gt],yt[Gt],ie);Vt(Nt.x,Nt.y,-z),Bt===0&&gt.push(Nt)}for(let Gt=0,se=dt;Gt<se;Gt++){const Nt=V[Gt];O=xt[Gt];const N=[];for(let E=0,W=Nt.length;E<W;E++){const ut=B(Nt[E],O[E],ie);Vt(ut.x,ut.y,-z),Bt===0&&N.push(ut)}Bt===0&&At.push(N)}}ft=Dr.triangulateShape(gt,At)}const Et=ft.length,Rt=T+C;for(let gt=0;gt<H;gt++){const At=x?B(w[gt],K[gt],Rt):w[gt];D?(F.copy(L.normals[0]).multiplyScalar(At.x),I.copy(L.binormals[0]).multiplyScalar(At.y),q.copy(U[0]).add(F).add(I),Vt(q.x,q.y,q.z)):Vt(At.x,At.y,0)}for(let gt=1;gt<=g;gt++)for(let At=0;At<H;At++){const Mt=x?B(w[At],K[At],Rt):w[At];D?(F.copy(L.normals[gt]).multiplyScalar(Mt.x),I.copy(L.binormals[gt]).multiplyScalar(Mt.y),q.copy(U[gt]).add(F).add(I),Vt(q.x,q.y,q.z)):Vt(Mt.x,Mt.y,_/g*gt)}for(let gt=M-1;gt>=0;gt--){const At=gt/M,Mt=y*Math.cos(At*Math.PI/2),Bt=T*Math.sin(At*Math.PI/2)+C;for(let z=0,ie=rt.length;z<ie;z++){const Gt=B(rt[z],yt[z],Bt);Vt(Gt.x,Gt.y,_+Mt)}for(let z=0,ie=V.length;z<ie;z++){const Gt=V[z];O=xt[z];for(let se=0,Nt=Gt.length;se<Nt;se++){const N=B(Gt[se],O[se],Bt);D?Vt(N.x,N.y+U[g-1].y,U[g-1].x+Mt):Vt(N.x,N.y,_+Mt)}}}Q(),ct();function Q(){const gt=l.length/3;if(x){let At=0,Mt=H*At;for(let Bt=0;Bt<Et;Bt++){const z=ft[Bt];qt(z[2]+Mt,z[1]+Mt,z[0]+Mt)}At=g+M*2,Mt=H*At;for(let Bt=0;Bt<Et;Bt++){const z=ft[Bt];qt(z[0]+Mt,z[1]+Mt,z[2]+Mt)}}else{for(let At=0;At<Et;At++){const Mt=ft[At];qt(Mt[2],Mt[1],Mt[0])}for(let At=0;At<Et;At++){const Mt=ft[At];qt(Mt[0]+H*g,Mt[1]+H*g,Mt[2]+H*g)}}s.addGroup(gt,l.length/3-gt,0)}function ct(){const gt=l.length/3;let At=0;Ut(rt,At),At+=rt.length;for(let Mt=0,Bt=V.length;Mt<Bt;Mt++){const z=V[Mt];Ut(z,At),At+=z.length}s.addGroup(gt,l.length/3-gt,1)}function Ut(gt,At){let Mt=gt.length;for(;--Mt>=0;){const Bt=Mt;let z=Mt-1;z<0&&(z=gt.length-1);for(let ie=0,Gt=g+M*2;ie<Gt;ie++){const se=H*ie,Nt=H*(ie+1),N=At+Bt+se,E=At+z+se,W=At+z+Nt,ut=At+Bt+Nt;ye(N,E,W,ut)}}}function Vt(gt,At,Mt){m.push(gt),m.push(At),m.push(Mt)}function qt(gt,At,Mt){Ue(gt),Ue(At),Ue(Mt);const Bt=l.length/3,z=P.generateTopUV(s,l,Bt-3,Bt-2,Bt-1);fe(z[0]),fe(z[1]),fe(z[2])}function ye(gt,At,Mt,Bt){Ue(gt),Ue(At),Ue(Bt),Ue(At),Ue(Mt),Ue(Bt);const z=l.length/3,ie=P.generateSideWallUV(s,l,z-6,z-3,z-2,z-1);fe(ie[0]),fe(ie[1]),fe(ie[3]),fe(ie[1]),fe(ie[2]),fe(ie[3])}function Ue(gt){l.push(m[gt*3+0]),l.push(m[gt*3+1]),l.push(m[gt*3+2])}function fe(gt){c.push(gt.x),c.push(gt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),i=this.parameters.shapes,s=this.parameters.options;return aE(i,s,t)}static fromJSON(t,i){const s=[];for(let c=0,f=t.shapes.length;c<f;c++){const d=i[t.shapes[c]];s.push(d)}const l=t.options.extrudePath;return l!==void 0&&(t.options.extrudePath=new Fd[l.type]().fromJSON(l)),new ap(s,t.options)}}const iE={generateTopUV:function(r,t,i,s,l){const c=t[i*3],f=t[i*3+1],d=t[s*3],m=t[s*3+1],p=t[l*3],g=t[l*3+1];return[new Wt(c,f),new Wt(d,m),new Wt(p,g)]},generateSideWallUV:function(r,t,i,s,l,c){const f=t[i*3],d=t[i*3+1],m=t[i*3+2],p=t[s*3],g=t[s*3+1],_=t[s*3+2],x=t[l*3],y=t[l*3+1],T=t[l*3+2],C=t[c*3],M=t[c*3+1],v=t[c*3+2];return Math.abs(d-g)<Math.abs(f-p)?[new Wt(f,1-m),new Wt(p,1-_),new Wt(x,1-T),new Wt(C,1-v)]:[new Wt(d,1-m),new Wt(g,1-_),new Wt(y,1-T),new Wt(M,1-v)]}};function aE(r,t,i){if(i.shapes=[],Array.isArray(r))for(let s=0,l=r.length;s<l;s++){const c=r[s];i.shapes.push(c.uuid)}else i.shapes.push(r.uuid);return i.options=Object.assign({},t),t.extrudePath!==void 0&&(i.options.extrudePath=t.extrudePath.toJSON()),i}class rl extends Xi{constructor(t=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:s,heightSegments:l};const c=t/2,f=i/2,d=Math.floor(s),m=Math.floor(l),p=d+1,g=m+1,_=t/d,x=i/m,y=[],T=[],C=[],M=[];for(let v=0;v<g;v++){const P=v*x-f;for(let U=0;U<p;U++){const D=U*_-c;T.push(D,-P,0),C.push(0,0,1),M.push(U/d),M.push(1-v/m)}}for(let v=0;v<m;v++)for(let P=0;P<d;P++){const U=P+p*v,D=P+p*(v+1),L=P+1+p*(v+1),I=P+1+p*v;y.push(U,D,I),y.push(D,L,I)}this.setIndex(y),this.setAttribute("position",new Ri(T,3)),this.setAttribute("normal",new Ri(C,3)),this.setAttribute("uv",new Ri(M,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rl(t.width,t.height,t.widthSegments,t.heightSegments)}}class sE extends ki{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class rE extends al{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_v,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class oE extends al{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=By,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class lE extends al{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Bv extends zn{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(t),this.intensity=i}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}const Bh=new tn,A_=new Z,R_=new Z;class cE{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.mapType=ii,this.map=null,this.mapPass=null,this.matrix=new tn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ep,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new an(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,s=this.matrix;A_.setFromMatrixPosition(t.matrixWorld),i.position.copy(A_),R_.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(R_),i.updateMatrixWorld(),Bh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bh,i.coordinateSystem,i.reversedDepth),i.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(Bh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class sp extends bv{constructor(t=-1,i=1,s=1,l=-1,c=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=f,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,s,l,c,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-t,f=s+t,d=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=p*this.view.offsetX,f=c+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(c,f,d,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class uE extends cE{constructor(){super(new sp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fE extends Bv{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.shadow=new uE}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const i=super.toJSON(t);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}class hE extends Bv{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class dE extends mi{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function C_(r,t,i,s){const l=pE(s);switch(i){case pv:return r*t;case gv:return r*t/l.components*l.byteLength;case Yd:return r*t/l.components*l.byteLength;case Pr:return r*t*2/l.components*l.byteLength;case jd:return r*t*2/l.components*l.byteLength;case mv:return r*t*3/l.components*l.byteLength;case Ai:return r*t*4/l.components*l.byteLength;case Zd:return r*t*4/l.components*l.byteLength;case kc:case Xc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Wc:case qc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case sd:case od:return Math.max(r,16)*Math.max(t,8)/4;case ad:case rd:return Math.max(r,8)*Math.max(t,8)/2;case ld:case cd:case fd:case hd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ud:case dd:case pd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case md:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case gd:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case _d:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case vd:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case xd:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Sd:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case yd:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Md:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Ed:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Td:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case bd:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Ad:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Rd:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Cd:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case wd:case Dd:case Ud:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Nd:case Ld:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Od:case Pd:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function pE(r){switch(r){case ii:case uv:return{byteLength:1,components:1};case Zo:case fv:case xa:return{byteLength:2,components:1};case Wd:case qd:return{byteLength:2,components:4};case Gi:case Xd:case zi:return{byteLength:4,components:1};case hv:case dv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kd}}));typeof window<"u"&&(window.__THREE__?pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kd);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Iv(){let r=null,t=!1,i=null,s=null;function l(c,f){i(c,f),s=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(s=r.requestAnimationFrame(l),t=!0)},stop:function(){r.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function mE(r){const t=new WeakMap;function i(d,m){const p=d.array,g=d.usage,_=p.byteLength,x=r.createBuffer();r.bindBuffer(m,x),r.bufferData(m,p,g),d.onUploadCallback();let y;if(p instanceof Float32Array)y=r.FLOAT;else if(typeof Float16Array<"u"&&p instanceof Float16Array)y=r.HALF_FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?y=r.HALF_FLOAT:y=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)y=r.SHORT;else if(p instanceof Uint32Array)y=r.UNSIGNED_INT;else if(p instanceof Int32Array)y=r.INT;else if(p instanceof Int8Array)y=r.BYTE;else if(p instanceof Uint8Array)y=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)y=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:x,type:y,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:_}}function s(d,m,p){const g=m.array,_=m.updateRanges;if(r.bindBuffer(p,d),_.length===0)r.bufferSubData(p,0,g);else{_.sort((y,T)=>y.start-T.start);let x=0;for(let y=1;y<_.length;y++){const T=_[x],C=_[y];C.start<=T.start+T.count+1?T.count=Math.max(T.count,C.start+C.count-T.start):(++x,_[x]=C)}_.length=x+1;for(let y=0,T=_.length;y<T;y++){const C=_[y];r.bufferSubData(p,C.start*g.BYTES_PER_ELEMENT,g,C.start,C.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=t.get(d);m&&(r.deleteBuffer(m.buffer),t.delete(d))}function f(d,m){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const g=t.get(d);(!g||g.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const p=t.get(d);if(p===void 0)t.set(d,i(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:l,remove:c,update:f}}var gE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_E=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,SE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ME=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,EE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,TE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,bE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,AE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,RE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,CE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,wE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,DE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,UE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,NE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,LE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,OE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,PE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,FE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,BE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,IE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,HE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,GE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,VE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,XE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,WE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qE="gl_FragColor = linearToOutputTexel( gl_FragColor );",YE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ZE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,KE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,JE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,QE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$E=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,eT=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,nT=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,iT=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,aT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rT=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,oT=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lT=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,cT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,uT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hT=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,pT=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,mT=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_T=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ST=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,MT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ET=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,TT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,bT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,AT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,RT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,CT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,DT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,UT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,NT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,LT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,OT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,PT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,FT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,BT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,IT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,HT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,GT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,VT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,XT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,WT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,YT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ZT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,KT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,JT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,QT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$T=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,tb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,eb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,nb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ib=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ab=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,sb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ob=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lb=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,cb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ub=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,db=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const mb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_b=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Mb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Eb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Tb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,bb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ab=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Db=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ub=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ob=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Fb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ib=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Hb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Se={alphahash_fragment:gE,alphahash_pars_fragment:_E,alphamap_fragment:vE,alphamap_pars_fragment:xE,alphatest_fragment:SE,alphatest_pars_fragment:yE,aomap_fragment:ME,aomap_pars_fragment:EE,batching_pars_vertex:TE,batching_vertex:bE,begin_vertex:AE,beginnormal_vertex:RE,bsdfs:CE,iridescence_fragment:wE,bumpmap_pars_fragment:DE,clipping_planes_fragment:UE,clipping_planes_pars_fragment:NE,clipping_planes_pars_vertex:LE,clipping_planes_vertex:OE,color_fragment:PE,color_pars_fragment:zE,color_pars_vertex:FE,color_vertex:BE,common:IE,cube_uv_reflection_fragment:HE,defaultnormal_vertex:GE,displacementmap_pars_vertex:VE,displacementmap_vertex:kE,emissivemap_fragment:XE,emissivemap_pars_fragment:WE,colorspace_fragment:qE,colorspace_pars_fragment:YE,envmap_fragment:jE,envmap_common_pars_fragment:ZE,envmap_pars_fragment:KE,envmap_pars_vertex:JE,envmap_physical_pars_fragment:lT,envmap_vertex:QE,fog_vertex:$E,fog_pars_vertex:tT,fog_fragment:eT,fog_pars_fragment:nT,gradientmap_pars_fragment:iT,lightmap_pars_fragment:aT,lights_lambert_fragment:sT,lights_lambert_pars_fragment:rT,lights_pars_begin:oT,lights_toon_fragment:cT,lights_toon_pars_fragment:uT,lights_phong_fragment:fT,lights_phong_pars_fragment:hT,lights_physical_fragment:dT,lights_physical_pars_fragment:pT,lights_fragment_begin:mT,lights_fragment_maps:gT,lights_fragment_end:_T,logdepthbuf_fragment:vT,logdepthbuf_pars_fragment:xT,logdepthbuf_pars_vertex:ST,logdepthbuf_vertex:yT,map_fragment:MT,map_pars_fragment:ET,map_particle_fragment:TT,map_particle_pars_fragment:bT,metalnessmap_fragment:AT,metalnessmap_pars_fragment:RT,morphinstance_vertex:CT,morphcolor_vertex:wT,morphnormal_vertex:DT,morphtarget_pars_vertex:UT,morphtarget_vertex:NT,normal_fragment_begin:LT,normal_fragment_maps:OT,normal_pars_fragment:PT,normal_pars_vertex:zT,normal_vertex:FT,normalmap_pars_fragment:BT,clearcoat_normal_fragment_begin:IT,clearcoat_normal_fragment_maps:HT,clearcoat_pars_fragment:GT,iridescence_pars_fragment:VT,opaque_fragment:kT,packing:XT,premultiplied_alpha_fragment:WT,project_vertex:qT,dithering_fragment:YT,dithering_pars_fragment:jT,roughnessmap_fragment:ZT,roughnessmap_pars_fragment:KT,shadowmap_pars_fragment:JT,shadowmap_pars_vertex:QT,shadowmap_vertex:$T,shadowmask_pars_fragment:tb,skinbase_vertex:eb,skinning_pars_vertex:nb,skinning_vertex:ib,skinnormal_vertex:ab,specularmap_fragment:sb,specularmap_pars_fragment:rb,tonemapping_fragment:ob,tonemapping_pars_fragment:lb,transmission_fragment:cb,transmission_pars_fragment:ub,uv_pars_fragment:fb,uv_pars_vertex:hb,uv_vertex:db,worldpos_vertex:pb,background_vert:mb,background_frag:gb,backgroundCube_vert:_b,backgroundCube_frag:vb,cube_vert:xb,cube_frag:Sb,depth_vert:yb,depth_frag:Mb,distance_vert:Eb,distance_frag:Tb,equirect_vert:bb,equirect_frag:Ab,linedashed_vert:Rb,linedashed_frag:Cb,meshbasic_vert:wb,meshbasic_frag:Db,meshlambert_vert:Ub,meshlambert_frag:Nb,meshmatcap_vert:Lb,meshmatcap_frag:Ob,meshnormal_vert:Pb,meshnormal_frag:zb,meshphong_vert:Fb,meshphong_frag:Bb,meshphysical_vert:Ib,meshphysical_frag:Hb,meshtoon_vert:Gb,meshtoon_frag:Vb,points_vert:kb,points_frag:Xb,shadow_vert:Wb,shadow_frag:qb,sprite_vert:Yb,sprite_frag:jb},Ht={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new xe}},envmap:{envMap:{value:null},envMapRotation:{value:new xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new xe},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0},uvTransform:{value:new xe}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}}},Pi={basic:{uniforms:Bn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.fog]),vertexShader:Se.meshbasic_vert,fragmentShader:Se.meshbasic_frag},lambert:{uniforms:Bn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Se.meshlambert_vert,fragmentShader:Se.meshlambert_frag},phong:{uniforms:Bn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:Se.meshphong_vert,fragmentShader:Se.meshphong_frag},standard:{uniforms:Bn([Ht.common,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.roughnessmap,Ht.metalnessmap,Ht.fog,Ht.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Se.meshphysical_vert,fragmentShader:Se.meshphysical_frag},toon:{uniforms:Bn([Ht.common,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.gradientmap,Ht.fog,Ht.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Se.meshtoon_vert,fragmentShader:Se.meshtoon_frag},matcap:{uniforms:Bn([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,{matcap:{value:null}}]),vertexShader:Se.meshmatcap_vert,fragmentShader:Se.meshmatcap_frag},points:{uniforms:Bn([Ht.points,Ht.fog]),vertexShader:Se.points_vert,fragmentShader:Se.points_frag},dashed:{uniforms:Bn([Ht.common,Ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Se.linedashed_vert,fragmentShader:Se.linedashed_frag},depth:{uniforms:Bn([Ht.common,Ht.displacementmap]),vertexShader:Se.depth_vert,fragmentShader:Se.depth_frag},normal:{uniforms:Bn([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,{opacity:{value:1}}]),vertexShader:Se.meshnormal_vert,fragmentShader:Se.meshnormal_frag},sprite:{uniforms:Bn([Ht.sprite,Ht.fog]),vertexShader:Se.sprite_vert,fragmentShader:Se.sprite_frag},background:{uniforms:{uvTransform:{value:new xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Se.background_vert,fragmentShader:Se.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new xe}},vertexShader:Se.backgroundCube_vert,fragmentShader:Se.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Se.cube_vert,fragmentShader:Se.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Se.equirect_vert,fragmentShader:Se.equirect_frag},distance:{uniforms:Bn([Ht.common,Ht.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Se.distance_vert,fragmentShader:Se.distance_frag},shadow:{uniforms:Bn([Ht.lights,Ht.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Se.shadow_vert,fragmentShader:Se.shadow_frag}};Pi.physical={uniforms:Bn([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new xe},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new xe},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new xe},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new xe},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new xe},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new xe}}]),vertexShader:Se.meshphysical_vert,fragmentShader:Se.meshphysical_frag};const Ic={r:0,b:0,g:0},Ts=new Vi,Zb=new tn;function Kb(r,t,i,s,l,c,f){const d=new Fe(0);let m=c===!0?0:1,p,g,_=null,x=0,y=null;function T(U){let D=U.isScene===!0?U.background:null;return D&&D.isTexture&&(D=(U.backgroundBlurriness>0?i:t).get(D)),D}function C(U){let D=!1;const L=T(U);L===null?v(d,m):L&&L.isColor&&(v(L,1),D=!0);const I=r.xr.getEnvironmentBlendMode();I==="additive"?s.buffers.color.setClear(0,0,0,1,f):I==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,f),(r.autoClear||D)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function M(U,D){const L=T(D);L&&(L.isCubeTexture||L.mapping===Jc)?(g===void 0&&(g=new Ci(new sl(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:Fr(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(I,F,q){this.matrixWorld.copyPosition(q.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),Ts.copy(D.backgroundRotation),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),g.material.uniforms.envMap.value=L,g.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(Zb.makeRotationFromEuler(Ts)),g.material.toneMapped=De.getTransfer(L.colorSpace)!==ke,(_!==L||x!==L.version||y!==r.toneMapping)&&(g.material.needsUpdate=!0,_=L,x=L.version,y=r.toneMapping),g.layers.enableAll(),U.unshift(g,g.geometry,g.material,0,0,null)):L&&L.isTexture&&(p===void 0&&(p=new Ci(new rl(2,2),new ki({name:"BackgroundMaterial",uniforms:Fr(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:es,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=L,p.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,p.material.toneMapped=De.getTransfer(L.colorSpace)!==ke,L.matrixAutoUpdate===!0&&L.updateMatrix(),p.material.uniforms.uvTransform.value.copy(L.matrix),(_!==L||x!==L.version||y!==r.toneMapping)&&(p.material.needsUpdate=!0,_=L,x=L.version,y=r.toneMapping),p.layers.enableAll(),U.unshift(p,p.geometry,p.material,0,0,null))}function v(U,D){U.getRGB(Ic,Tv(r)),s.buffers.color.setClear(Ic.r,Ic.g,Ic.b,D,f)}function P(){g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return d},setClearColor:function(U,D=1){d.set(U),m=D,v(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(U){m=U,v(d,m)},render:C,addToRenderList:M,dispose:P}}function Jb(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=x(null);let c=l,f=!1;function d(w,V,nt,it,dt){let rt=!1;const B=_(it,nt,V);c!==B&&(c=B,p(c.object)),rt=y(w,it,nt,dt),rt&&T(w,it,nt,dt),dt!==null&&t.update(dt,r.ELEMENT_ARRAY_BUFFER),(rt||f)&&(f=!1,D(w,V,nt,it),dt!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(dt).buffer))}function m(){return r.createVertexArray()}function p(w){return r.bindVertexArray(w)}function g(w){return r.deleteVertexArray(w)}function _(w,V,nt){const it=nt.wireframe===!0;let dt=s[w.id];dt===void 0&&(dt={},s[w.id]=dt);let rt=dt[V.id];rt===void 0&&(rt={},dt[V.id]=rt);let B=rt[it];return B===void 0&&(B=x(m()),rt[it]=B),B}function x(w){const V=[],nt=[],it=[];for(let dt=0;dt<i;dt++)V[dt]=0,nt[dt]=0,it[dt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:nt,attributeDivisors:it,object:w,attributes:{},index:null}}function y(w,V,nt,it){const dt=c.attributes,rt=V.attributes;let B=0;const H=nt.getAttributes();for(const $ in H)if(H[$].location>=0){const xt=dt[$];let O=rt[$];if(O===void 0&&($==="instanceMatrix"&&w.instanceMatrix&&(O=w.instanceMatrix),$==="instanceColor"&&w.instanceColor&&(O=w.instanceColor)),xt===void 0||xt.attribute!==O||O&&xt.data!==O.data)return!0;B++}return c.attributesNum!==B||c.index!==it}function T(w,V,nt,it){const dt={},rt=V.attributes;let B=0;const H=nt.getAttributes();for(const $ in H)if(H[$].location>=0){let xt=rt[$];xt===void 0&&($==="instanceMatrix"&&w.instanceMatrix&&(xt=w.instanceMatrix),$==="instanceColor"&&w.instanceColor&&(xt=w.instanceColor));const O={};O.attribute=xt,xt&&xt.data&&(O.data=xt.data),dt[$]=O,B++}c.attributes=dt,c.attributesNum=B,c.index=it}function C(){const w=c.newAttributes;for(let V=0,nt=w.length;V<nt;V++)w[V]=0}function M(w){v(w,0)}function v(w,V){const nt=c.newAttributes,it=c.enabledAttributes,dt=c.attributeDivisors;nt[w]=1,it[w]===0&&(r.enableVertexAttribArray(w),it[w]=1),dt[w]!==V&&(r.vertexAttribDivisor(w,V),dt[w]=V)}function P(){const w=c.newAttributes,V=c.enabledAttributes;for(let nt=0,it=V.length;nt<it;nt++)V[nt]!==w[nt]&&(r.disableVertexAttribArray(nt),V[nt]=0)}function U(w,V,nt,it,dt,rt,B){B===!0?r.vertexAttribIPointer(w,V,nt,dt,rt):r.vertexAttribPointer(w,V,nt,it,dt,rt)}function D(w,V,nt,it){C();const dt=it.attributes,rt=nt.getAttributes(),B=V.defaultAttributeValues;for(const H in rt){const $=rt[H];if($.location>=0){let yt=dt[H];if(yt===void 0&&(H==="instanceMatrix"&&w.instanceMatrix&&(yt=w.instanceMatrix),H==="instanceColor"&&w.instanceColor&&(yt=w.instanceColor)),yt!==void 0){const xt=yt.normalized,O=yt.itemSize,K=t.get(yt);if(K===void 0)continue;const ft=K.buffer,Et=K.type,Rt=K.bytesPerElement,Q=Et===r.INT||Et===r.UNSIGNED_INT||yt.gpuType===Xd;if(yt.isInterleavedBufferAttribute){const ct=yt.data,Ut=ct.stride,Vt=yt.offset;if(ct.isInstancedInterleavedBuffer){for(let qt=0;qt<$.locationSize;qt++)v($.location+qt,ct.meshPerAttribute);w.isInstancedMesh!==!0&&it._maxInstanceCount===void 0&&(it._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let qt=0;qt<$.locationSize;qt++)M($.location+qt);r.bindBuffer(r.ARRAY_BUFFER,ft);for(let qt=0;qt<$.locationSize;qt++)U($.location+qt,O/$.locationSize,Et,xt,Ut*Rt,(Vt+O/$.locationSize*qt)*Rt,Q)}else{if(yt.isInstancedBufferAttribute){for(let ct=0;ct<$.locationSize;ct++)v($.location+ct,yt.meshPerAttribute);w.isInstancedMesh!==!0&&it._maxInstanceCount===void 0&&(it._maxInstanceCount=yt.meshPerAttribute*yt.count)}else for(let ct=0;ct<$.locationSize;ct++)M($.location+ct);r.bindBuffer(r.ARRAY_BUFFER,ft);for(let ct=0;ct<$.locationSize;ct++)U($.location+ct,O/$.locationSize,Et,xt,O*Rt,O/$.locationSize*ct*Rt,Q)}}else if(B!==void 0){const xt=B[H];if(xt!==void 0)switch(xt.length){case 2:r.vertexAttrib2fv($.location,xt);break;case 3:r.vertexAttrib3fv($.location,xt);break;case 4:r.vertexAttrib4fv($.location,xt);break;default:r.vertexAttrib1fv($.location,xt)}}}}P()}function L(){q();for(const w in s){const V=s[w];for(const nt in V){const it=V[nt];for(const dt in it)g(it[dt].object),delete it[dt];delete V[nt]}delete s[w]}}function I(w){if(s[w.id]===void 0)return;const V=s[w.id];for(const nt in V){const it=V[nt];for(const dt in it)g(it[dt].object),delete it[dt];delete V[nt]}delete s[w.id]}function F(w){for(const V in s){const nt=s[V];if(nt[w.id]===void 0)continue;const it=nt[w.id];for(const dt in it)g(it[dt].object),delete it[dt];delete nt[w.id]}}function q(){b(),f=!0,c!==l&&(c=l,p(c.object))}function b(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:q,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:I,releaseStatesOfProgram:F,initAttributes:C,enableAttribute:M,disableUnusedAttributes:P}}function Qb(r,t,i){let s;function l(p){s=p}function c(p,g){r.drawArrays(s,p,g),i.update(g,s,1)}function f(p,g,_){_!==0&&(r.drawArraysInstanced(s,p,g,_),i.update(g,s,_))}function d(p,g,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,g,0,_);let y=0;for(let T=0;T<_;T++)y+=g[T];i.update(y,s,1)}function m(p,g,_,x){if(_===0)return;const y=t.get("WEBGL_multi_draw");if(y===null)for(let T=0;T<p.length;T++)f(p[T],g[T],x[T]);else{y.multiDrawArraysInstancedWEBGL(s,p,0,g,0,x,0,_);let T=0;for(let C=0;C<_;C++)T+=g[C]*x[C];i.update(T,s,1)}}this.setMode=l,this.render=c,this.renderInstances=f,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function $b(r,t,i,s){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const F=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function f(F){return!(F!==Ai&&s.convert(F)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(F){const q=F===xa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(F!==ii&&s.convert(F)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==zi&&!q)}function m(F){if(F==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const g=m(p);g!==p&&(pe("WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const _=i.logarithmicDepthBuffer===!0,x=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),T=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=r.getParameter(r.MAX_TEXTURE_SIZE),M=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),v=r.getParameter(r.MAX_VERTEX_ATTRIBS),P=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),U=r.getParameter(r.MAX_VARYING_VECTORS),D=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),L=r.getParameter(r.MAX_SAMPLES),I=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:f,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:_,reversedDepthBuffer:x,maxTextures:y,maxVertexTextures:T,maxTextureSize:C,maxCubemapSize:M,maxAttributes:v,maxVertexUniforms:P,maxVaryings:U,maxFragmentUniforms:D,maxSamples:L,samples:I}}function t1(r){const t=this;let i=null,s=0,l=!1,c=!1;const f=new As,d=new xe,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(_,x){const y=_.length!==0||x||s!==0||l;return l=x,s=_.length,y},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,x){i=g(_,x,0)},this.setState=function(_,x,y){const T=_.clippingPlanes,C=_.clipIntersection,M=_.clipShadows,v=r.get(_);if(!l||T===null||T.length===0||c&&!M)c?g(null):p();else{const P=c?0:s,U=P*4;let D=v.clippingState||null;m.value=D,D=g(T,x,U,y);for(let L=0;L!==U;++L)D[L]=i[L];v.clippingState=D,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=P}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),t.numPlanes=s,t.numIntersection=0}function g(_,x,y,T){const C=_!==null?_.length:0;let M=null;if(C!==0){if(M=m.value,T!==!0||M===null){const v=y+C*4,P=x.matrixWorldInverse;d.getNormalMatrix(P),(M===null||M.length<v)&&(M=new Float32Array(v));for(let U=0,D=y;U!==C;++U,D+=4)f.copy(_[U]).applyMatrix4(P,d),f.normal.toArray(M,D),M[D+3]=f.constant}m.value=M,m.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,M}}function e1(r){let t=new WeakMap;function i(f,d){return d===td?f.mapping=Us:d===ed&&(f.mapping=Or),f}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===td||d===ed)if(t.has(f)){const m=t.get(f).texture;return i(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const p=new Rv(m.height);return p.fromEquirectangularTexture(r,f),t.set(f,p),f.addEventListener("dispose",l),i(p.texture,f.mapping)}else return null}}return f}function l(f){const d=f.target;d.removeEventListener("dispose",l);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function c(){t=new WeakMap}return{get:s,dispose:c}}const ts=4,w_=[.125,.215,.35,.446,.526,.582],Cs=20,n1=256,Vo=new sp,D_=new Fe;let Ih=null,Hh=0,Gh=0,Vh=!1;const i1=new Z;class U_{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,i=0,s=.1,l=100,c={}){const{size:f=256,position:d=i1}=c;Ih=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(f);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,s,l,m,d),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=O_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=L_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ih,Hh,Gh),this._renderer.xr.enabled=Vh,t.scissorTest=!1,Cr(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Us||t.mapping===Or?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ih=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(t,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:xn,minFilter:xn,generateMipmaps:!1,type:xa,format:Ai,colorSpace:zr,depthBuffer:!1},l=N_(t,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=N_(t,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=a1(c)),this._blurMaterial=r1(c,t,i),this._ggxMaterial=s1(c,t,i)}return l}_compileMaterial(t){const i=new Ci(new Xi,t);this._renderer.compile(i,Vo)}_sceneToCubeUV(t,i,s,l,c){const m=new mi(90,1,i,s),p=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],_=this._renderer,x=_.autoClear,y=_.toneMapping;_.getClearColor(D_),_.toneMapping=Bi,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(l),_.clearDepth(),_.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ci(new sl,new tp({name:"PMREM.Background",side:qn,depthWrite:!1,depthTest:!1})));const C=this._backgroundBox,M=C.material;let v=!1;const P=t.background;P?P.isColor&&(M.color.copy(P),t.background=null,v=!0):(M.color.copy(D_),v=!0);for(let U=0;U<6;U++){const D=U%3;D===0?(m.up.set(0,p[U],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+g[U],c.y,c.z)):D===1?(m.up.set(0,0,p[U]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+g[U],c.z)):(m.up.set(0,p[U],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+g[U]));const L=this._cubeSize;Cr(l,D*L,U>2?L:0,L,L),_.setRenderTarget(l),v&&_.render(C,m),_.render(t,m)}_.toneMapping=y,_.autoClear=x,t.background=P}_textureToCubeUV(t,i){const s=this._renderer,l=t.mapping===Us||t.mapping===Or;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=O_()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=L_());const c=l?this._cubemapMaterial:this._equirectMaterial,f=this._lodMeshes[0];f.material=c;const d=c.uniforms;d.envMap.value=t;const m=this._cubeSize;Cr(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(f,Vo)}_applyPMREM(t){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(t,c-1,c);i.autoClear=s}_applyGGXFilter(t,i,s){const l=this._renderer,c=this._pingPongRenderTarget,f=this._ggxMaterial,d=this._lodMeshes[s];d.material=f;const m=f.uniforms,p=s/(this._lodMeshes.length-1),g=i/(this._lodMeshes.length-1),_=Math.sqrt(p*p-g*g),x=0+p*1.25,y=_*x,{_lodMax:T}=this,C=this._sizeLods[s],M=3*C*(s>T-ts?s-T+ts:0),v=4*(this._cubeSize-C);m.envMap.value=t.texture,m.roughness.value=y,m.mipInt.value=T-i,Cr(c,M,v,3*C,2*C),l.setRenderTarget(c),l.render(d,Vo),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=T-s,Cr(t,M,v,3*C,2*C),l.setRenderTarget(t),l.render(d,Vo)}_blur(t,i,s,l,c){const f=this._pingPongRenderTarget;this._halfBlur(t,f,i,s,l,"latitudinal",c),this._halfBlur(f,t,s,s,l,"longitudinal",c)}_halfBlur(t,i,s,l,c,f,d){const m=this._renderer,p=this._blurMaterial;f!=="latitudinal"&&f!=="longitudinal"&&we("blur direction must be either latitudinal or longitudinal!");const g=3,_=this._lodMeshes[l];_.material=p;const x=p.uniforms,y=this._sizeLods[s]-1,T=isFinite(c)?Math.PI/(2*y):2*Math.PI/(2*Cs-1),C=c/T,M=isFinite(c)?1+Math.floor(g*C):Cs;M>Cs&&pe(`sigmaRadians, ${c}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${Cs}`);const v=[];let P=0;for(let F=0;F<Cs;++F){const q=F/C,b=Math.exp(-q*q/2);v.push(b),F===0?P+=b:F<M&&(P+=2*b)}for(let F=0;F<v.length;F++)v[F]=v[F]/P;x.envMap.value=t.texture,x.samples.value=M,x.weights.value=v,x.latitudinal.value=f==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:U}=this;x.dTheta.value=T,x.mipInt.value=U-s;const D=this._sizeLods[l],L=3*D*(l>U-ts?l-U+ts:0),I=4*(this._cubeSize-D);Cr(i,L,I,3*D,2*D),m.setRenderTarget(i),m.render(_,Vo)}}function a1(r){const t=[],i=[],s=[];let l=r;const c=r-ts+1+w_.length;for(let f=0;f<c;f++){const d=Math.pow(2,l);t.push(d);let m=1/d;f>r-ts?m=w_[f-r+ts-1]:f===0&&(m=0),i.push(m);const p=1/(d-2),g=-p,_=1+p,x=[g,g,_,g,_,_,g,g,_,_,g,_],y=6,T=6,C=3,M=2,v=1,P=new Float32Array(C*T*y),U=new Float32Array(M*T*y),D=new Float32Array(v*T*y);for(let I=0;I<y;I++){const F=I%3*2/3-1,q=I>2?0:-1,b=[F,q,0,F+2/3,q,0,F+2/3,q+1,0,F,q,0,F+2/3,q+1,0,F,q+1,0];P.set(b,C*T*I),U.set(x,M*T*I);const w=[I,I,I,I,I,I];D.set(w,v*T*I)}const L=new Xi;L.setAttribute("position",new Hi(P,C)),L.setAttribute("uv",new Hi(U,M)),L.setAttribute("faceIndex",new Hi(D,v)),s.push(new Ci(L,null)),l>ts&&l--}return{lodMeshes:s,sizeLods:t,sigmas:i}}function N_(r,t,i){const s=new Ii(r,t,i);return s.texture.mapping=Jc,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Cr(r,t,i,s,l){r.viewport.set(t,i,s,l),r.scissor.set(t,i,s,l)}function s1(r,t,i){return new ki({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:n1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Qc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:_a,depthTest:!1,depthWrite:!1})}function r1(r,t,i){const s=new Float32Array(Cs),l=new Z(0,1,0);return new ki({name:"SphericalGaussianBlur",defines:{n:Cs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_a,depthTest:!1,depthWrite:!1})}function L_(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_a,depthTest:!1,depthWrite:!1})}function O_(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_a,depthTest:!1,depthWrite:!1})}function Qc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function o1(r){let t=new WeakMap,i=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===td||m===ed,g=m===Us||m===Or;if(p||g){let _=t.get(d);const x=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return i===null&&(i=new U_(r)),_=p?i.fromEquirectangular(d,_):i.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,t.set(d,_),_.texture;if(_!==void 0)return _.texture;{const y=d.image;return p&&y&&y.height>0||g&&y&&l(y)?(i===null&&(i=new U_(r)),_=p?i.fromEquirectangular(d):i.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,t.set(d,_),d.addEventListener("dispose",c),_.texture):null}}}return d}function l(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function c(d){const m=d.target;m.removeEventListener("dispose",c);const p=t.get(m);p!==void 0&&(t.delete(m),p.dispose())}function f(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function l1(r){const t={};function i(s){if(t[s]!==void 0)return t[s];const l=r.getExtension(s);return t[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Jo("WebGLRenderer: "+s+" extension not supported."),l}}}function c1(r,t,i,s){const l={},c=new WeakMap;function f(_){const x=_.target;x.index!==null&&t.remove(x.index);for(const T in x.attributes)t.remove(x.attributes[T]);x.removeEventListener("dispose",f),delete l[x.id];const y=c.get(x);y&&(t.remove(y),c.delete(x)),s.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,i.memory.geometries--}function d(_,x){return l[x.id]===!0||(x.addEventListener("dispose",f),l[x.id]=!0,i.memory.geometries++),x}function m(_){const x=_.attributes;for(const y in x)t.update(x[y],r.ARRAY_BUFFER)}function p(_){const x=[],y=_.index,T=_.attributes.position;let C=0;if(y!==null){const P=y.array;C=y.version;for(let U=0,D=P.length;U<D;U+=3){const L=P[U+0],I=P[U+1],F=P[U+2];x.push(L,I,I,F,F,L)}}else if(T!==void 0){const P=T.array;C=T.version;for(let U=0,D=P.length/3-1;U<D;U+=3){const L=U+0,I=U+1,F=U+2;x.push(L,I,I,F,F,L)}}else return;const M=new(vv(x)?Ev:Mv)(x,1);M.version=C;const v=c.get(_);v&&t.remove(v),c.set(_,M)}function g(_){const x=c.get(_);if(x){const y=_.index;y!==null&&x.version<y.version&&p(_)}else p(_);return c.get(_)}return{get:d,update:m,getWireframeAttribute:g}}function u1(r,t,i){let s;function l(x){s=x}let c,f;function d(x){c=x.type,f=x.bytesPerElement}function m(x,y){r.drawElements(s,y,c,x*f),i.update(y,s,1)}function p(x,y,T){T!==0&&(r.drawElementsInstanced(s,y,c,x*f,T),i.update(y,s,T))}function g(x,y,T){if(T===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,y,0,c,x,0,T);let M=0;for(let v=0;v<T;v++)M+=y[v];i.update(M,s,1)}function _(x,y,T,C){if(T===0)return;const M=t.get("WEBGL_multi_draw");if(M===null)for(let v=0;v<x.length;v++)p(x[v]/f,y[v],C[v]);else{M.multiDrawElementsInstancedWEBGL(s,y,0,c,x,0,C,0,T);let v=0;for(let P=0;P<T;P++)v+=y[P]*C[P];i.update(v,s,1)}}this.setMode=l,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=_}function f1(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,f,d){switch(i.calls++,f){case r.TRIANGLES:i.triangles+=d*(c/3);break;case r.LINES:i.lines+=d*(c/2);break;case r.LINE_STRIP:i.lines+=d*(c-1);break;case r.LINE_LOOP:i.lines+=d*c;break;case r.POINTS:i.points+=d*c;break;default:we("WebGLInfo: Unknown draw mode:",f);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:s}}function h1(r,t,i){const s=new WeakMap,l=new an;function c(f,d,m){const p=f.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=g!==void 0?g.length:0;let x=s.get(d);if(x===void 0||x.count!==_){let w=function(){q.dispose(),s.delete(d),d.removeEventListener("dispose",w)};var y=w;x!==void 0&&x.texture.dispose();const T=d.morphAttributes.position!==void 0,C=d.morphAttributes.normal!==void 0,M=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],P=d.morphAttributes.normal||[],U=d.morphAttributes.color||[];let D=0;T===!0&&(D=1),C===!0&&(D=2),M===!0&&(D=3);let L=d.attributes.position.count*D,I=1;L>t.maxTextureSize&&(I=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const F=new Float32Array(L*I*4*_),q=new xv(F,L,I,_);q.type=zi,q.needsUpdate=!0;const b=D*4;for(let V=0;V<_;V++){const nt=v[V],it=P[V],dt=U[V],rt=L*I*4*V;for(let B=0;B<nt.count;B++){const H=B*b;T===!0&&(l.fromBufferAttribute(nt,B),F[rt+H+0]=l.x,F[rt+H+1]=l.y,F[rt+H+2]=l.z,F[rt+H+3]=0),C===!0&&(l.fromBufferAttribute(it,B),F[rt+H+4]=l.x,F[rt+H+5]=l.y,F[rt+H+6]=l.z,F[rt+H+7]=0),M===!0&&(l.fromBufferAttribute(dt,B),F[rt+H+8]=l.x,F[rt+H+9]=l.y,F[rt+H+10]=l.z,F[rt+H+11]=dt.itemSize===4?l.w:1)}}x={count:_,texture:q,size:new Wt(L,I)},s.set(d,x),d.addEventListener("dispose",w)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",f.morphTexture,i);else{let T=0;for(let M=0;M<p.length;M++)T+=p[M];const C=d.morphTargetsRelative?1:1-T;m.getUniforms().setValue(r,"morphTargetBaseInfluence",C),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",x.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",x.size)}return{update:c}}function d1(r,t,i,s){let l=new WeakMap;function c(m){const p=s.render.frame,g=m.geometry,_=t.get(m,g);if(l.get(_)!==p&&(t.update(_),l.set(_,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),l.get(m)!==p&&(i.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,r.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const x=m.skeleton;l.get(x)!==p&&(x.update(),l.set(x,p))}return _}function f(){l=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:c,dispose:f}}const p1={[nv]:"LINEAR_TONE_MAPPING",[iv]:"REINHARD_TONE_MAPPING",[av]:"CINEON_TONE_MAPPING",[sv]:"ACES_FILMIC_TONE_MAPPING",[ov]:"AGX_TONE_MAPPING",[lv]:"NEUTRAL_TONE_MAPPING",[rv]:"CUSTOM_TONE_MAPPING"};function m1(r,t,i,s,l){const c=new Ii(t,i,{type:r,depthBuffer:s,stencilBuffer:l}),f=new Ii(t,i,{type:xa,depthBuffer:!1,stencilBuffer:!1}),d=new Xi;d.setAttribute("position",new Ri([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute("uv",new Ri([0,2,0,0,2,0],2));const m=new sE({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new Ci(d,m),g=new sp(-1,1,1,-1,0,1);let _=null,x=null,y=!1,T,C=null,M=[],v=!1;this.setSize=function(P,U){c.setSize(P,U),f.setSize(P,U);for(let D=0;D<M.length;D++){const L=M[D];L.setSize&&L.setSize(P,U)}},this.setEffects=function(P){M=P,v=M.length>0&&M[0].isRenderPass===!0;const U=c.width,D=c.height;for(let L=0;L<M.length;L++){const I=M[L];I.setSize&&I.setSize(U,D)}},this.begin=function(P,U){if(y||P.toneMapping===Bi&&M.length===0)return!1;if(C=U,U!==null){const D=U.width,L=U.height;(c.width!==D||c.height!==L)&&this.setSize(D,L)}return v===!1&&P.setRenderTarget(c),T=P.toneMapping,P.toneMapping=Bi,!0},this.hasRenderPass=function(){return v},this.end=function(P,U){P.toneMapping=T,y=!0;let D=c,L=f;for(let I=0;I<M.length;I++){const F=M[I];if(F.enabled!==!1&&(F.render(P,L,D,U),F.needsSwap!==!1)){const q=D;D=L,L=q}}if(_!==P.outputColorSpace||x!==P.toneMapping){_=P.outputColorSpace,x=P.toneMapping,m.defines={},De.getTransfer(_)===ke&&(m.defines.SRGB_TRANSFER="");const I=p1[x];I&&(m.defines[I]=""),m.needsUpdate=!0}m.uniforms.tDiffuse.value=D.texture,P.setRenderTarget(C),P.render(p,g),C=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){c.dispose(),f.dispose(),d.dispose(),m.dispose()}}const Hv=new Pn,Hd=new Qo(1,1),Gv=new xv,Vv=new tM,kv=new Av,P_=[],z_=[],F_=new Float32Array(16),B_=new Float32Array(9),I_=new Float32Array(4);function Gr(r,t,i){const s=r[0];if(s<=0||s>0)return r;const l=t*i;let c=P_[l];if(c===void 0&&(c=new Float32Array(l),P_[l]=c),t!==0){s.toArray(c,0);for(let f=1,d=0;f!==t;++f)d+=i,r[f].toArray(c,d)}return c}function mn(r,t){if(r.length!==t.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==t[i])return!1;return!0}function gn(r,t){for(let i=0,s=t.length;i<s;i++)r[i]=t[i]}function $c(r,t){let i=z_[t];i===void 0&&(i=new Int32Array(t),z_[t]=i);for(let s=0;s!==t;++s)i[s]=r.allocateTextureUnit();return i}function g1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function _1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2fv(this.addr,t),gn(i,t)}}function v1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(mn(i,t))return;r.uniform3fv(this.addr,t),gn(i,t)}}function x1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4fv(this.addr,t),gn(i,t)}}function S1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;I_.set(s),r.uniformMatrix2fv(this.addr,!1,I_),gn(i,s)}}function y1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;B_.set(s),r.uniformMatrix3fv(this.addr,!1,B_),gn(i,s)}}function M1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;F_.set(s),r.uniformMatrix4fv(this.addr,!1,F_),gn(i,s)}}function E1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function T1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2iv(this.addr,t),gn(i,t)}}function b1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(mn(i,t))return;r.uniform3iv(this.addr,t),gn(i,t)}}function A1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4iv(this.addr,t),gn(i,t)}}function R1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function C1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2uiv(this.addr,t),gn(i,t)}}function w1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(mn(i,t))return;r.uniform3uiv(this.addr,t),gn(i,t)}}function D1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4uiv(this.addr,t),gn(i,t)}}function U1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(Hd.compareFunction=i.isReversedDepthBuffer()?Jd:Kd,c=Hd):c=Hv,i.setTexture2D(t||c,l)}function N1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(t||Vv,l)}function L1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(t||kv,l)}function O1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(t||Gv,l)}function P1(r){switch(r){case 5126:return g1;case 35664:return _1;case 35665:return v1;case 35666:return x1;case 35674:return S1;case 35675:return y1;case 35676:return M1;case 5124:case 35670:return E1;case 35667:case 35671:return T1;case 35668:case 35672:return b1;case 35669:case 35673:return A1;case 5125:return R1;case 36294:return C1;case 36295:return w1;case 36296:return D1;case 35678:case 36198:case 36298:case 36306:case 35682:return U1;case 35679:case 36299:case 36307:return N1;case 35680:case 36300:case 36308:case 36293:return L1;case 36289:case 36303:case 36311:case 36292:return O1}}function z1(r,t){r.uniform1fv(this.addr,t)}function F1(r,t){const i=Gr(t,this.size,2);r.uniform2fv(this.addr,i)}function B1(r,t){const i=Gr(t,this.size,3);r.uniform3fv(this.addr,i)}function I1(r,t){const i=Gr(t,this.size,4);r.uniform4fv(this.addr,i)}function H1(r,t){const i=Gr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function G1(r,t){const i=Gr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function V1(r,t){const i=Gr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function k1(r,t){r.uniform1iv(this.addr,t)}function X1(r,t){r.uniform2iv(this.addr,t)}function W1(r,t){r.uniform3iv(this.addr,t)}function q1(r,t){r.uniform4iv(this.addr,t)}function Y1(r,t){r.uniform1uiv(this.addr,t)}function j1(r,t){r.uniform2uiv(this.addr,t)}function Z1(r,t){r.uniform3uiv(this.addr,t)}function K1(r,t){r.uniform4uiv(this.addr,t)}function J1(r,t,i){const s=this.cache,l=t.length,c=$c(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));let f;this.type===r.SAMPLER_2D_SHADOW?f=Hd:f=Hv;for(let d=0;d!==l;++d)i.setTexture2D(t[d]||f,c[d])}function Q1(r,t,i){const s=this.cache,l=t.length,c=$c(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let f=0;f!==l;++f)i.setTexture3D(t[f]||Vv,c[f])}function $1(r,t,i){const s=this.cache,l=t.length,c=$c(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let f=0;f!==l;++f)i.setTextureCube(t[f]||kv,c[f])}function tA(r,t,i){const s=this.cache,l=t.length,c=$c(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let f=0;f!==l;++f)i.setTexture2DArray(t[f]||Gv,c[f])}function eA(r){switch(r){case 5126:return z1;case 35664:return F1;case 35665:return B1;case 35666:return I1;case 35674:return H1;case 35675:return G1;case 35676:return V1;case 5124:case 35670:return k1;case 35667:case 35671:return X1;case 35668:case 35672:return W1;case 35669:case 35673:return q1;case 5125:return Y1;case 36294:return j1;case 36295:return Z1;case 36296:return K1;case 35678:case 36198:case 36298:case 36306:case 35682:return J1;case 35679:case 36299:case 36307:return Q1;case 35680:case 36300:case 36308:case 36293:return $1;case 36289:case 36303:case 36311:case 36292:return tA}}class nA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.setValue=P1(i.type)}}class iA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=eA(i.type)}}class aA{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,s){const l=this.seq;for(let c=0,f=l.length;c!==f;++c){const d=l[c];d.setValue(t,i[d.id],s)}}}const kh=/(\w+)(\])?(\[|\.)?/g;function H_(r,t){r.seq.push(t),r.map[t.id]=t}function sA(r,t,i){const s=r.name,l=s.length;for(kh.lastIndex=0;;){const c=kh.exec(s),f=kh.lastIndex;let d=c[1];const m=c[2]==="]",p=c[3];if(m&&(d=d|0),p===void 0||p==="["&&f+2===l){H_(i,p===void 0?new nA(d,r,t):new iA(d,r,t));break}else{let _=i.map[d];_===void 0&&(_=new aA(d),H_(i,_)),i=_}}}class Yc{constructor(t,i){this.seq=[],this.map={};const s=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let f=0;f<s;++f){const d=t.getActiveUniform(i,f),m=t.getUniformLocation(i,d.name);sA(d,m,this)}const l=[],c=[];for(const f of this.seq)f.type===t.SAMPLER_2D_SHADOW||f.type===t.SAMPLER_CUBE_SHADOW||f.type===t.SAMPLER_2D_ARRAY_SHADOW?l.push(f):c.push(f);l.length>0&&(this.seq=l.concat(c))}setValue(t,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(t,s,l)}setOptional(t,i,s){const l=i[s];l!==void 0&&this.setValue(t,s,l)}static upload(t,i,s,l){for(let c=0,f=i.length;c!==f;++c){const d=i[c],m=s[d.id];m.needsUpdate!==!1&&d.setValue(t,m.value,l)}}static seqWithValue(t,i){const s=[];for(let l=0,c=t.length;l!==c;++l){const f=t[l];f.id in i&&s.push(f)}return s}}function G_(r,t,i){const s=r.createShader(t);return r.shaderSource(s,i),r.compileShader(s),s}const rA=37297;let oA=0;function lA(r,t){const i=r.split(`
`),s=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let f=l;f<c;f++){const d=f+1;s.push(`${d===t?">":" "} ${d}: ${i[f]}`)}return s.join(`
`)}const V_=new xe;function cA(r){De._getMatrix(V_,De.workingColorSpace,r);const t=`mat3( ${V_.elements.map(i=>i.toFixed(4))} )`;switch(De.getTransfer(r)){case jc:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return pe("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function k_(r,t,i){const s=r.getShaderParameter(t,r.COMPILE_STATUS),c=(r.getShaderInfoLog(t)||"").trim();if(s&&c==="")return"";const f=/ERROR: 0:(\d+)/.exec(c);if(f){const d=parseInt(f[1]);return i.toUpperCase()+`

`+c+`

`+lA(r.getShaderSource(t),d)}else return c}function uA(r,t){const i=cA(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const fA={[nv]:"Linear",[iv]:"Reinhard",[av]:"Cineon",[sv]:"ACESFilmic",[ov]:"AgX",[lv]:"Neutral",[rv]:"Custom"};function hA(r,t){const i=fA[t];return i===void 0?(pe("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Hc=new Z;function dA(){De.getLuminanceCoefficients(Hc);const r=Hc.x.toFixed(4),t=Hc.y.toFixed(4),i=Hc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qo).join(`
`)}function mA(r){const t=[];for(const i in r){const s=r[i];s!==!1&&t.push("#define "+i+" "+s)}return t.join(`
`)}function gA(r,t){const i={},s=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(t,l),f=c.name;let d=1;c.type===r.FLOAT_MAT2&&(d=2),c.type===r.FLOAT_MAT3&&(d=3),c.type===r.FLOAT_MAT4&&(d=4),i[f]={type:c.type,location:r.getAttribLocation(t,f),locationSize:d}}return i}function qo(r){return r!==""}function X_(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function W_(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const _A=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gd(r){return r.replace(_A,xA)}const vA=new Map;function xA(r,t){let i=Se[t];if(i===void 0){const s=vA.get(t);if(s!==void 0)i=Se[s],pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,s);else throw new Error("Can not resolve #include <"+t+">")}return Gd(i)}const SA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function q_(r){return r.replace(SA,yA)}function yA(r,t,i,s){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Y_(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const MA={[Vc]:"SHADOWMAP_TYPE_PCF",[Xo]:"SHADOWMAP_TYPE_VSM"};function EA(r){return MA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const TA={[Us]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE",[Jc]:"ENVMAP_TYPE_CUBE_UV"};function bA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":TA[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const AA={[Or]:"ENVMAP_MODE_REFRACTION"};function RA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":AA[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const CA={[ev]:"ENVMAP_BLENDING_MULTIPLY",[Py]:"ENVMAP_BLENDING_MIX",[zy]:"ENVMAP_BLENDING_ADD"};function wA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":CA[r.combine]||"ENVMAP_BLENDING_NONE"}function DA(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,s=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function UA(r,t,i,s){const l=r.getContext(),c=i.defines;let f=i.vertexShader,d=i.fragmentShader;const m=EA(i),p=bA(i),g=RA(i),_=wA(i),x=DA(i),y=pA(i),T=mA(c),C=l.createProgram();let M,v,P=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(qo).join(`
`),M.length>0&&(M+=`
`),v=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(qo).join(`
`),v.length>0&&(v+=`
`)):(M=[Y_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qo).join(`
`),v=[Y_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+g:"",i.envMap?"#define "+_:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Bi?"#define TONE_MAPPING":"",i.toneMapping!==Bi?Se.tonemapping_pars_fragment:"",i.toneMapping!==Bi?hA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",Se.colorspace_pars_fragment,uA("linearToOutputTexel",i.outputColorSpace),dA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(qo).join(`
`)),f=Gd(f),f=X_(f,i),f=W_(f,i),d=Gd(d),d=X_(d,i),d=W_(d,i),f=q_(f),d=q_(d),i.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,M=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,v=["#define varying in",i.glslVersion===n_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===n_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const U=P+M+f,D=P+v+d,L=G_(l,l.VERTEX_SHADER,U),I=G_(l,l.FRAGMENT_SHADER,D);l.attachShader(C,L),l.attachShader(C,I),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function F(V){if(r.debug.checkShaderErrors){const nt=l.getProgramInfoLog(C)||"",it=l.getShaderInfoLog(L)||"",dt=l.getShaderInfoLog(I)||"",rt=nt.trim(),B=it.trim(),H=dt.trim();let $=!0,yt=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if($=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,C,L,I);else{const xt=k_(l,L,"vertex"),O=k_(l,I,"fragment");we("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+rt+`
`+xt+`
`+O)}else rt!==""?pe("WebGLProgram: Program Info Log:",rt):(B===""||H==="")&&(yt=!1);yt&&(V.diagnostics={runnable:$,programLog:rt,vertexShader:{log:B,prefix:M},fragmentShader:{log:H,prefix:v}})}l.deleteShader(L),l.deleteShader(I),q=new Yc(l,C),b=gA(l,C)}let q;this.getUniforms=function(){return q===void 0&&F(this),q};let b;this.getAttributes=function(){return b===void 0&&F(this),b};let w=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=l.getProgramParameter(C,rA)),w},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=oA++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=L,this.fragmentShader=I,this}let NA=0;class LA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,s=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),f=this._getShaderCacheForMaterial(t);return f.has(l)===!1&&(f.add(l),l.usedTimes++),f.has(c)===!1&&(f.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let s=i.get(t);return s===void 0&&(s=new Set,i.set(t,s)),s}_getShaderStage(t){const i=this.shaderCache;let s=i.get(t);return s===void 0&&(s=new OA(t),i.set(t,s)),s}}class OA{constructor(t){this.id=NA++,this.code=t,this.usedTimes=0}}function PA(r,t,i,s,l,c,f){const d=new Sv,m=new LA,p=new Set,g=[],_=new Map,x=l.logarithmicDepthBuffer;let y=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(b){return p.add(b),b===0?"uv":`uv${b}`}function M(b,w,V,nt,it){const dt=nt.fog,rt=it.geometry,B=b.isMeshStandardMaterial?nt.environment:null,H=(b.isMeshStandardMaterial?i:t).get(b.envMap||B),$=H&&H.mapping===Jc?H.image.height:null,yt=T[b.type];b.precision!==null&&(y=l.getMaxPrecision(b.precision),y!==b.precision&&pe("WebGLProgram.getParameters:",b.precision,"not supported, using",y,"instead."));const xt=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,O=xt!==void 0?xt.length:0;let K=0;rt.morphAttributes.position!==void 0&&(K=1),rt.morphAttributes.normal!==void 0&&(K=2),rt.morphAttributes.color!==void 0&&(K=3);let ft,Et,Rt,Q;if(yt){const Ce=Pi[yt];ft=Ce.vertexShader,Et=Ce.fragmentShader}else ft=b.vertexShader,Et=b.fragmentShader,m.update(b),Rt=m.getVertexShaderID(b),Q=m.getFragmentShaderID(b);const ct=r.getRenderTarget(),Ut=r.state.buffers.depth.getReversed(),Vt=it.isInstancedMesh===!0,qt=it.isBatchedMesh===!0,ye=!!b.map,Ue=!!b.matcap,fe=!!H,gt=!!b.aoMap,At=!!b.lightMap,Mt=!!b.bumpMap,Bt=!!b.normalMap,z=!!b.displacementMap,ie=!!b.emissiveMap,Gt=!!b.metalnessMap,se=!!b.roughnessMap,Nt=b.anisotropy>0,N=b.clearcoat>0,E=b.dispersion>0,W=b.iridescence>0,ut=b.sheen>0,St=b.transmission>0,ht=Nt&&!!b.anisotropyMap,Qt=N&&!!b.clearcoatMap,Ot=N&&!!b.clearcoatNormalMap,Jt=N&&!!b.clearcoatRoughnessMap,le=W&&!!b.iridescenceMap,Tt=W&&!!b.iridescenceThicknessMap,Ct=ut&&!!b.sheenColorMap,Yt=ut&&!!b.sheenRoughnessMap,kt=!!b.specularMap,Pt=!!b.specularColorMap,_e=!!b.specularIntensityMap,X=St&&!!b.transmissionMap,Ft=St&&!!b.thicknessMap,wt=!!b.gradientMap,Xt=!!b.alphaMap,bt=b.alphaTest>0,vt=!!b.alphaHash,Lt=!!b.extensions;let he=Bi;b.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(he=r.toneMapping);const Ie={shaderID:yt,shaderType:b.type,shaderName:b.name,vertexShader:ft,fragmentShader:Et,defines:b.defines,customVertexShaderID:Rt,customFragmentShaderID:Q,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:y,batching:qt,batchingColor:qt&&it._colorsTexture!==null,instancing:Vt,instancingColor:Vt&&it.instanceColor!==null,instancingMorph:Vt&&it.morphTexture!==null,outputColorSpace:ct===null?r.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:zr,alphaToCoverage:!!b.alphaToCoverage,map:ye,matcap:Ue,envMap:fe,envMapMode:fe&&H.mapping,envMapCubeUVHeight:$,aoMap:gt,lightMap:At,bumpMap:Mt,normalMap:Bt,displacementMap:z,emissiveMap:ie,normalMapObjectSpace:Bt&&b.normalMapType===Iy,normalMapTangentSpace:Bt&&b.normalMapType===_v,metalnessMap:Gt,roughnessMap:se,anisotropy:Nt,anisotropyMap:ht,clearcoat:N,clearcoatMap:Qt,clearcoatNormalMap:Ot,clearcoatRoughnessMap:Jt,dispersion:E,iridescence:W,iridescenceMap:le,iridescenceThicknessMap:Tt,sheen:ut,sheenColorMap:Ct,sheenRoughnessMap:Yt,specularMap:kt,specularColorMap:Pt,specularIntensityMap:_e,transmission:St,transmissionMap:X,thicknessMap:Ft,gradientMap:wt,opaque:b.transparent===!1&&b.blending===Ur&&b.alphaToCoverage===!1,alphaMap:Xt,alphaTest:bt,alphaHash:vt,combine:b.combine,mapUv:ye&&C(b.map.channel),aoMapUv:gt&&C(b.aoMap.channel),lightMapUv:At&&C(b.lightMap.channel),bumpMapUv:Mt&&C(b.bumpMap.channel),normalMapUv:Bt&&C(b.normalMap.channel),displacementMapUv:z&&C(b.displacementMap.channel),emissiveMapUv:ie&&C(b.emissiveMap.channel),metalnessMapUv:Gt&&C(b.metalnessMap.channel),roughnessMapUv:se&&C(b.roughnessMap.channel),anisotropyMapUv:ht&&C(b.anisotropyMap.channel),clearcoatMapUv:Qt&&C(b.clearcoatMap.channel),clearcoatNormalMapUv:Ot&&C(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Jt&&C(b.clearcoatRoughnessMap.channel),iridescenceMapUv:le&&C(b.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&C(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&C(b.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&C(b.sheenRoughnessMap.channel),specularMapUv:kt&&C(b.specularMap.channel),specularColorMapUv:Pt&&C(b.specularColorMap.channel),specularIntensityMapUv:_e&&C(b.specularIntensityMap.channel),transmissionMapUv:X&&C(b.transmissionMap.channel),thicknessMapUv:Ft&&C(b.thicknessMap.channel),alphaMapUv:Xt&&C(b.alphaMap.channel),vertexTangents:!!rt.attributes.tangent&&(Bt||Nt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,pointsUvs:it.isPoints===!0&&!!rt.attributes.uv&&(ye||Xt),fog:!!dt,useFog:b.fog===!0,fogExp2:!!dt&&dt.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:x,reversedDepthBuffer:Ut,skinning:it.isSkinnedMesh===!0,morphTargets:rt.morphAttributes.position!==void 0,morphNormals:rt.morphAttributes.normal!==void 0,morphColors:rt.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:K,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:f.numPlanes,numClipIntersection:f.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&V.length>0,shadowMapType:r.shadowMap.type,toneMapping:he,decodeVideoTexture:ye&&b.map.isVideoTexture===!0&&De.getTransfer(b.map.colorSpace)===ke,decodeVideoTextureEmissive:ie&&b.emissiveMap.isVideoTexture===!0&&De.getTransfer(b.emissiveMap.colorSpace)===ke,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ma,flipSided:b.side===qn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Lt&&b.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&b.extensions.multiDraw===!0||qt)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Ie.vertexUv1s=p.has(1),Ie.vertexUv2s=p.has(2),Ie.vertexUv3s=p.has(3),p.clear(),Ie}function v(b){const w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(const V in b.defines)w.push(V),w.push(b.defines[V]);return b.isRawShaderMaterial===!1&&(P(w,b),U(w,b),w.push(r.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function P(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function U(b,w){d.disableAll(),w.instancing&&d.enable(0),w.instancingColor&&d.enable(1),w.instancingMorph&&d.enable(2),w.matcap&&d.enable(3),w.envMap&&d.enable(4),w.normalMapObjectSpace&&d.enable(5),w.normalMapTangentSpace&&d.enable(6),w.clearcoat&&d.enable(7),w.iridescence&&d.enable(8),w.alphaTest&&d.enable(9),w.vertexColors&&d.enable(10),w.vertexAlphas&&d.enable(11),w.vertexUv1s&&d.enable(12),w.vertexUv2s&&d.enable(13),w.vertexUv3s&&d.enable(14),w.vertexTangents&&d.enable(15),w.anisotropy&&d.enable(16),w.alphaHash&&d.enable(17),w.batching&&d.enable(18),w.dispersion&&d.enable(19),w.batchingColor&&d.enable(20),w.gradientMap&&d.enable(21),b.push(d.mask),d.disableAll(),w.fog&&d.enable(0),w.useFog&&d.enable(1),w.flatShading&&d.enable(2),w.logarithmicDepthBuffer&&d.enable(3),w.reversedDepthBuffer&&d.enable(4),w.skinning&&d.enable(5),w.morphTargets&&d.enable(6),w.morphNormals&&d.enable(7),w.morphColors&&d.enable(8),w.premultipliedAlpha&&d.enable(9),w.shadowMapEnabled&&d.enable(10),w.doubleSided&&d.enable(11),w.flipSided&&d.enable(12),w.useDepthPacking&&d.enable(13),w.dithering&&d.enable(14),w.transmission&&d.enable(15),w.sheen&&d.enable(16),w.opaque&&d.enable(17),w.pointsUvs&&d.enable(18),w.decodeVideoTexture&&d.enable(19),w.decodeVideoTextureEmissive&&d.enable(20),w.alphaToCoverage&&d.enable(21),b.push(d.mask)}function D(b){const w=T[b.type];let V;if(w){const nt=Pi[w];V=pM.clone(nt.uniforms)}else V=b.uniforms;return V}function L(b,w){let V=_.get(w);return V!==void 0?++V.usedTimes:(V=new UA(r,w,b,c),g.push(V),_.set(w,V)),V}function I(b){if(--b.usedTimes===0){const w=g.indexOf(b);g[w]=g[g.length-1],g.pop(),_.delete(b.cacheKey),b.destroy()}}function F(b){m.remove(b)}function q(){m.dispose()}return{getParameters:M,getProgramCacheKey:v,getUniforms:D,acquireProgram:L,releaseProgram:I,releaseShaderCache:F,programs:g,dispose:q}}function zA(){let r=new WeakMap;function t(f){return r.has(f)}function i(f){let d=r.get(f);return d===void 0&&(d={},r.set(f,d)),d}function s(f){r.delete(f)}function l(f,d,m){r.get(f)[d]=m}function c(){r=new WeakMap}return{has:t,get:i,remove:s,update:l,dispose:c}}function FA(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function j_(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Z_(){const r=[];let t=0;const i=[],s=[],l=[];function c(){t=0,i.length=0,s.length=0,l.length=0}function f(_,x,y,T,C,M){let v=r[t];return v===void 0?(v={id:_.id,object:_,geometry:x,material:y,groupOrder:T,renderOrder:_.renderOrder,z:C,group:M},r[t]=v):(v.id=_.id,v.object=_,v.geometry=x,v.material=y,v.groupOrder=T,v.renderOrder=_.renderOrder,v.z=C,v.group=M),t++,v}function d(_,x,y,T,C,M){const v=f(_,x,y,T,C,M);y.transmission>0?s.push(v):y.transparent===!0?l.push(v):i.push(v)}function m(_,x,y,T,C,M){const v=f(_,x,y,T,C,M);y.transmission>0?s.unshift(v):y.transparent===!0?l.unshift(v):i.unshift(v)}function p(_,x){i.length>1&&i.sort(_||FA),s.length>1&&s.sort(x||j_),l.length>1&&l.sort(x||j_)}function g(){for(let _=t,x=r.length;_<x;_++){const y=r[_];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:d,unshift:m,finish:g,sort:p}}function BA(){let r=new WeakMap;function t(s,l){const c=r.get(s);let f;return c===void 0?(f=new Z_,r.set(s,[f])):l>=c.length?(f=new Z_,c.push(f)):f=c[l],f}function i(){r=new WeakMap}return{get:t,dispose:i}}function IA(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new Z,color:new Fe};break;case"SpotLight":i={position:new Z,direction:new Z,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new Z,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":i={direction:new Z,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":i={color:new Fe,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return r[t.id]=i,i}}}function HA(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let GA=0;function VA(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function kA(r){const t=new IA,i=HA(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new Z);const l=new Z,c=new tn,f=new tn;function d(p){let g=0,_=0,x=0;for(let b=0;b<9;b++)s.probe[b].set(0,0,0);let y=0,T=0,C=0,M=0,v=0,P=0,U=0,D=0,L=0,I=0,F=0;p.sort(VA);for(let b=0,w=p.length;b<w;b++){const V=p[b],nt=V.color,it=V.intensity,dt=V.distance;let rt=null;if(V.shadow&&V.shadow.map&&(V.shadow.map.texture.format===Pr?rt=V.shadow.map.texture:rt=V.shadow.map.depthTexture||V.shadow.map.texture),V.isAmbientLight)g+=nt.r*it,_+=nt.g*it,x+=nt.b*it;else if(V.isLightProbe){for(let B=0;B<9;B++)s.probe[B].addScaledVector(V.sh.coefficients[B],it);F++}else if(V.isDirectionalLight){const B=t.get(V);if(B.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){const H=V.shadow,$=i.get(V);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,s.directionalShadow[y]=$,s.directionalShadowMap[y]=rt,s.directionalShadowMatrix[y]=V.shadow.matrix,P++}s.directional[y]=B,y++}else if(V.isSpotLight){const B=t.get(V);B.position.setFromMatrixPosition(V.matrixWorld),B.color.copy(nt).multiplyScalar(it),B.distance=dt,B.coneCos=Math.cos(V.angle),B.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),B.decay=V.decay,s.spot[C]=B;const H=V.shadow;if(V.map&&(s.spotLightMap[L]=V.map,L++,H.updateMatrices(V),V.castShadow&&I++),s.spotLightMatrix[C]=H.matrix,V.castShadow){const $=i.get(V);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,s.spotShadow[C]=$,s.spotShadowMap[C]=rt,D++}C++}else if(V.isRectAreaLight){const B=t.get(V);B.color.copy(nt).multiplyScalar(it),B.halfWidth.set(V.width*.5,0,0),B.halfHeight.set(0,V.height*.5,0),s.rectArea[M]=B,M++}else if(V.isPointLight){const B=t.get(V);if(B.color.copy(V.color).multiplyScalar(V.intensity),B.distance=V.distance,B.decay=V.decay,V.castShadow){const H=V.shadow,$=i.get(V);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,$.shadowCameraNear=H.camera.near,$.shadowCameraFar=H.camera.far,s.pointShadow[T]=$,s.pointShadowMap[T]=rt,s.pointShadowMatrix[T]=V.shadow.matrix,U++}s.point[T]=B,T++}else if(V.isHemisphereLight){const B=t.get(V);B.skyColor.copy(V.color).multiplyScalar(it),B.groundColor.copy(V.groundColor).multiplyScalar(it),s.hemi[v]=B,v++}}M>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ht.LTC_FLOAT_1,s.rectAreaLTC2=Ht.LTC_FLOAT_2):(s.rectAreaLTC1=Ht.LTC_HALF_1,s.rectAreaLTC2=Ht.LTC_HALF_2)),s.ambient[0]=g,s.ambient[1]=_,s.ambient[2]=x;const q=s.hash;(q.directionalLength!==y||q.pointLength!==T||q.spotLength!==C||q.rectAreaLength!==M||q.hemiLength!==v||q.numDirectionalShadows!==P||q.numPointShadows!==U||q.numSpotShadows!==D||q.numSpotMaps!==L||q.numLightProbes!==F)&&(s.directional.length=y,s.spot.length=C,s.rectArea.length=M,s.point.length=T,s.hemi.length=v,s.directionalShadow.length=P,s.directionalShadowMap.length=P,s.pointShadow.length=U,s.pointShadowMap.length=U,s.spotShadow.length=D,s.spotShadowMap.length=D,s.directionalShadowMatrix.length=P,s.pointShadowMatrix.length=U,s.spotLightMatrix.length=D+L-I,s.spotLightMap.length=L,s.numSpotLightShadowsWithMaps=I,s.numLightProbes=F,q.directionalLength=y,q.pointLength=T,q.spotLength=C,q.rectAreaLength=M,q.hemiLength=v,q.numDirectionalShadows=P,q.numPointShadows=U,q.numSpotShadows=D,q.numSpotMaps=L,q.numLightProbes=F,s.version=GA++)}function m(p,g){let _=0,x=0,y=0,T=0,C=0;const M=g.matrixWorldInverse;for(let v=0,P=p.length;v<P;v++){const U=p[v];if(U.isDirectionalLight){const D=s.directional[_];D.direction.setFromMatrixPosition(U.matrixWorld),l.setFromMatrixPosition(U.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(M),_++}else if(U.isSpotLight){const D=s.spot[y];D.position.setFromMatrixPosition(U.matrixWorld),D.position.applyMatrix4(M),D.direction.setFromMatrixPosition(U.matrixWorld),l.setFromMatrixPosition(U.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(M),y++}else if(U.isRectAreaLight){const D=s.rectArea[T];D.position.setFromMatrixPosition(U.matrixWorld),D.position.applyMatrix4(M),f.identity(),c.copy(U.matrixWorld),c.premultiply(M),f.extractRotation(c),D.halfWidth.set(U.width*.5,0,0),D.halfHeight.set(0,U.height*.5,0),D.halfWidth.applyMatrix4(f),D.halfHeight.applyMatrix4(f),T++}else if(U.isPointLight){const D=s.point[x];D.position.setFromMatrixPosition(U.matrixWorld),D.position.applyMatrix4(M),x++}else if(U.isHemisphereLight){const D=s.hemi[C];D.direction.setFromMatrixPosition(U.matrixWorld),D.direction.transformDirection(M),C++}}}return{setup:d,setupView:m,state:s}}function K_(r){const t=new kA(r),i=[],s=[];function l(g){p.camera=g,i.length=0,s.length=0}function c(g){i.push(g)}function f(g){s.push(g)}function d(){t.setup(i)}function m(g){t.setupView(i,g)}const p={lightsArray:i,shadowsArray:s,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:d,setupLightsView:m,pushLight:c,pushShadow:f}}function XA(r){let t=new WeakMap;function i(l,c=0){const f=t.get(l);let d;return f===void 0?(d=new K_(r),t.set(l,[d])):c>=f.length?(d=new K_(r),f.push(d)):d=f[c],d}function s(){t=new WeakMap}return{get:i,dispose:s}}const WA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,YA=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],jA=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],J_=new tn,ko=new Z,Xh=new Z;function ZA(r,t,i){let s=new ep;const l=new Wt,c=new Wt,f=new an,d=new oE,m=new lE,p={},g=i.maxTextureSize,_={[es]:qn,[qn]:es,[ma]:ma},x=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:WA,fragmentShader:qA}),y=x.clone();y.defines.HORIZONTAL_PASS=1;const T=new Xi;T.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Ci(T,x),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vc;let v=this.type;this.render=function(I,F,q){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||I.length===0)return;I.type===gy&&(pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),I.type=Vc);const b=r.getRenderTarget(),w=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),nt=r.state;nt.setBlending(_a),nt.buffers.depth.getReversed()===!0?nt.buffers.color.setClear(0,0,0,0):nt.buffers.color.setClear(1,1,1,1),nt.buffers.depth.setTest(!0),nt.setScissorTest(!1);const it=v!==this.type;it&&F.traverse(function(dt){dt.material&&(Array.isArray(dt.material)?dt.material.forEach(rt=>rt.needsUpdate=!0):dt.material.needsUpdate=!0)});for(let dt=0,rt=I.length;dt<rt;dt++){const B=I[dt],H=B.shadow;if(H===void 0){pe("WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;l.copy(H.mapSize);const $=H.getFrameExtents();if(l.multiply($),c.copy(H.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(c.x=Math.floor(g/$.x),l.x=c.x*$.x,H.mapSize.x=c.x),l.y>g&&(c.y=Math.floor(g/$.y),l.y=c.y*$.y,H.mapSize.y=c.y)),H.map===null||it===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Xo){if(B.isPointLight){pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Ii(l.x,l.y,{format:Pr,type:xa,minFilter:xn,magFilter:xn,generateMipmaps:!1}),H.map.texture.name=B.name+".shadowMap",H.map.depthTexture=new Qo(l.x,l.y,zi),H.map.depthTexture.name=B.name+".shadowMapDepth",H.map.depthTexture.format=Sa,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Dn,H.map.depthTexture.magFilter=Dn}else{B.isPointLight?(H.map=new Rv(l.x),H.map.depthTexture=new bM(l.x,Gi)):(H.map=new Ii(l.x,l.y),H.map.depthTexture=new Qo(l.x,l.y,Gi)),H.map.depthTexture.name=B.name+".shadowMap",H.map.depthTexture.format=Sa;const xt=r.state.buffers.depth.getReversed();this.type===Vc?(H.map.depthTexture.compareFunction=xt?Jd:Kd,H.map.depthTexture.minFilter=xn,H.map.depthTexture.magFilter=xn):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Dn,H.map.depthTexture.magFilter=Dn)}H.camera.updateProjectionMatrix()}const yt=H.map.isWebGLCubeRenderTarget?6:1;for(let xt=0;xt<yt;xt++){if(H.map.isWebGLCubeRenderTarget)r.setRenderTarget(H.map,xt),r.clear();else{xt===0&&(r.setRenderTarget(H.map),r.clear());const O=H.getViewport(xt);f.set(c.x*O.x,c.y*O.y,c.x*O.z,c.y*O.w),nt.viewport(f)}if(B.isPointLight){const O=H.camera,K=H.matrix,ft=B.distance||O.far;ft!==O.far&&(O.far=ft,O.updateProjectionMatrix()),ko.setFromMatrixPosition(B.matrixWorld),O.position.copy(ko),Xh.copy(O.position),Xh.add(YA[xt]),O.up.copy(jA[xt]),O.lookAt(Xh),O.updateMatrixWorld(),K.makeTranslation(-ko.x,-ko.y,-ko.z),J_.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),H._frustum.setFromProjectionMatrix(J_,O.coordinateSystem,O.reversedDepth)}else H.updateMatrices(B);s=H.getFrustum(),D(F,q,H.camera,B,this.type)}H.isPointLightShadow!==!0&&this.type===Xo&&P(H,q),H.needsUpdate=!1}v=this.type,M.needsUpdate=!1,r.setRenderTarget(b,w,V)};function P(I,F){const q=t.update(C);x.defines.VSM_SAMPLES!==I.blurSamples&&(x.defines.VSM_SAMPLES=I.blurSamples,y.defines.VSM_SAMPLES=I.blurSamples,x.needsUpdate=!0,y.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Ii(l.x,l.y,{format:Pr,type:xa})),x.uniforms.shadow_pass.value=I.map.depthTexture,x.uniforms.resolution.value=I.mapSize,x.uniforms.radius.value=I.radius,r.setRenderTarget(I.mapPass),r.clear(),r.renderBufferDirect(F,null,q,x,C,null),y.uniforms.shadow_pass.value=I.mapPass.texture,y.uniforms.resolution.value=I.mapSize,y.uniforms.radius.value=I.radius,r.setRenderTarget(I.map),r.clear(),r.renderBufferDirect(F,null,q,y,C,null)}function U(I,F,q,b){let w=null;const V=q.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(V!==void 0)w=V;else if(w=q.isPointLight===!0?m:d,r.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){const nt=w.uuid,it=F.uuid;let dt=p[nt];dt===void 0&&(dt={},p[nt]=dt);let rt=dt[it];rt===void 0&&(rt=w.clone(),dt[it]=rt,F.addEventListener("dispose",L)),w=rt}if(w.visible=F.visible,w.wireframe=F.wireframe,b===Xo?w.side=F.shadowSide!==null?F.shadowSide:F.side:w.side=F.shadowSide!==null?F.shadowSide:_[F.side],w.alphaMap=F.alphaMap,w.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,w.map=F.map,w.clipShadows=F.clipShadows,w.clippingPlanes=F.clippingPlanes,w.clipIntersection=F.clipIntersection,w.displacementMap=F.displacementMap,w.displacementScale=F.displacementScale,w.displacementBias=F.displacementBias,w.wireframeLinewidth=F.wireframeLinewidth,w.linewidth=F.linewidth,q.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const nt=r.properties.get(w);nt.light=q}return w}function D(I,F,q,b,w){if(I.visible===!1)return;if(I.layers.test(F.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&w===Xo)&&(!I.frustumCulled||s.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,I.matrixWorld);const it=t.update(I),dt=I.material;if(Array.isArray(dt)){const rt=it.groups;for(let B=0,H=rt.length;B<H;B++){const $=rt[B],yt=dt[$.materialIndex];if(yt&&yt.visible){const xt=U(I,yt,b,w);I.onBeforeShadow(r,I,F,q,it,xt,$),r.renderBufferDirect(q,null,it,xt,I,$),I.onAfterShadow(r,I,F,q,it,xt,$)}}}else if(dt.visible){const rt=U(I,dt,b,w);I.onBeforeShadow(r,I,F,q,it,rt,null),r.renderBufferDirect(q,null,it,rt,I,null),I.onAfterShadow(r,I,F,q,it,rt,null)}}const nt=I.children;for(let it=0,dt=nt.length;it<dt;it++)D(nt[it],F,q,b,w)}function L(I){I.target.removeEventListener("dispose",L);for(const q in p){const b=p[q],w=I.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}const KA={[Yh]:jh,[Zh]:Qh,[Kh]:$h,[Lr]:Jh,[jh]:Yh,[Qh]:Zh,[$h]:Kh,[Jh]:Lr};function JA(r,t){function i(){let X=!1;const Ft=new an;let wt=null;const Xt=new an(0,0,0,0);return{setMask:function(bt){wt!==bt&&!X&&(r.colorMask(bt,bt,bt,bt),wt=bt)},setLocked:function(bt){X=bt},setClear:function(bt,vt,Lt,he,Ie){Ie===!0&&(bt*=he,vt*=he,Lt*=he),Ft.set(bt,vt,Lt,he),Xt.equals(Ft)===!1&&(r.clearColor(bt,vt,Lt,he),Xt.copy(Ft))},reset:function(){X=!1,wt=null,Xt.set(-1,0,0,0)}}}function s(){let X=!1,Ft=!1,wt=null,Xt=null,bt=null;return{setReversed:function(vt){if(Ft!==vt){const Lt=t.get("EXT_clip_control");vt?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),Ft=vt;const he=bt;bt=null,this.setClear(he)}},getReversed:function(){return Ft},setTest:function(vt){vt?ct(r.DEPTH_TEST):Ut(r.DEPTH_TEST)},setMask:function(vt){wt!==vt&&!X&&(r.depthMask(vt),wt=vt)},setFunc:function(vt){if(Ft&&(vt=KA[vt]),Xt!==vt){switch(vt){case Yh:r.depthFunc(r.NEVER);break;case jh:r.depthFunc(r.ALWAYS);break;case Zh:r.depthFunc(r.LESS);break;case Lr:r.depthFunc(r.LEQUAL);break;case Kh:r.depthFunc(r.EQUAL);break;case Jh:r.depthFunc(r.GEQUAL);break;case Qh:r.depthFunc(r.GREATER);break;case $h:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Xt=vt}},setLocked:function(vt){X=vt},setClear:function(vt){bt!==vt&&(Ft&&(vt=1-vt),r.clearDepth(vt),bt=vt)},reset:function(){X=!1,wt=null,Xt=null,bt=null,Ft=!1}}}function l(){let X=!1,Ft=null,wt=null,Xt=null,bt=null,vt=null,Lt=null,he=null,Ie=null;return{setTest:function(Ce){X||(Ce?ct(r.STENCIL_TEST):Ut(r.STENCIL_TEST))},setMask:function(Ce){Ft!==Ce&&!X&&(r.stencilMask(Ce),Ft=Ce)},setFunc:function(Ce,Un,gi){(wt!==Ce||Xt!==Un||bt!==gi)&&(r.stencilFunc(Ce,Un,gi),wt=Ce,Xt=Un,bt=gi)},setOp:function(Ce,Un,gi){(vt!==Ce||Lt!==Un||he!==gi)&&(r.stencilOp(Ce,Un,gi),vt=Ce,Lt=Un,he=gi)},setLocked:function(Ce){X=Ce},setClear:function(Ce){Ie!==Ce&&(r.clearStencil(Ce),Ie=Ce)},reset:function(){X=!1,Ft=null,wt=null,Xt=null,bt=null,vt=null,Lt=null,he=null,Ie=null}}}const c=new i,f=new s,d=new l,m=new WeakMap,p=new WeakMap;let g={},_={},x=new WeakMap,y=[],T=null,C=!1,M=null,v=null,P=null,U=null,D=null,L=null,I=null,F=new Fe(0,0,0),q=0,b=!1,w=null,V=null,nt=null,it=null,dt=null;const rt=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,H=0;const $=r.getParameter(r.VERSION);$.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec($)[1]),B=H>=1):$.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),B=H>=2);let yt=null,xt={};const O=r.getParameter(r.SCISSOR_BOX),K=r.getParameter(r.VIEWPORT),ft=new an().fromArray(O),Et=new an().fromArray(K);function Rt(X,Ft,wt,Xt){const bt=new Uint8Array(4),vt=r.createTexture();r.bindTexture(X,vt),r.texParameteri(X,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(X,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Lt=0;Lt<wt;Lt++)X===r.TEXTURE_3D||X===r.TEXTURE_2D_ARRAY?r.texImage3D(Ft,0,r.RGBA,1,1,Xt,0,r.RGBA,r.UNSIGNED_BYTE,bt):r.texImage2D(Ft+Lt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,bt);return vt}const Q={};Q[r.TEXTURE_2D]=Rt(r.TEXTURE_2D,r.TEXTURE_2D,1),Q[r.TEXTURE_CUBE_MAP]=Rt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[r.TEXTURE_2D_ARRAY]=Rt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Q[r.TEXTURE_3D]=Rt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),f.setClear(1),d.setClear(0),ct(r.DEPTH_TEST),f.setFunc(Lr),Mt(!1),Bt(K0),ct(r.CULL_FACE),gt(_a);function ct(X){g[X]!==!0&&(r.enable(X),g[X]=!0)}function Ut(X){g[X]!==!1&&(r.disable(X),g[X]=!1)}function Vt(X,Ft){return _[X]!==Ft?(r.bindFramebuffer(X,Ft),_[X]=Ft,X===r.DRAW_FRAMEBUFFER&&(_[r.FRAMEBUFFER]=Ft),X===r.FRAMEBUFFER&&(_[r.DRAW_FRAMEBUFFER]=Ft),!0):!1}function qt(X,Ft){let wt=y,Xt=!1;if(X){wt=x.get(Ft),wt===void 0&&(wt=[],x.set(Ft,wt));const bt=X.textures;if(wt.length!==bt.length||wt[0]!==r.COLOR_ATTACHMENT0){for(let vt=0,Lt=bt.length;vt<Lt;vt++)wt[vt]=r.COLOR_ATTACHMENT0+vt;wt.length=bt.length,Xt=!0}}else wt[0]!==r.BACK&&(wt[0]=r.BACK,Xt=!0);Xt&&r.drawBuffers(wt)}function ye(X){return T!==X?(r.useProgram(X),T=X,!0):!1}const Ue={[Rs]:r.FUNC_ADD,[vy]:r.FUNC_SUBTRACT,[xy]:r.FUNC_REVERSE_SUBTRACT};Ue[Sy]=r.MIN,Ue[yy]=r.MAX;const fe={[My]:r.ZERO,[Ey]:r.ONE,[Ty]:r.SRC_COLOR,[Wh]:r.SRC_ALPHA,[Dy]:r.SRC_ALPHA_SATURATE,[Cy]:r.DST_COLOR,[Ay]:r.DST_ALPHA,[by]:r.ONE_MINUS_SRC_COLOR,[qh]:r.ONE_MINUS_SRC_ALPHA,[wy]:r.ONE_MINUS_DST_COLOR,[Ry]:r.ONE_MINUS_DST_ALPHA,[Uy]:r.CONSTANT_COLOR,[Ny]:r.ONE_MINUS_CONSTANT_COLOR,[Ly]:r.CONSTANT_ALPHA,[Oy]:r.ONE_MINUS_CONSTANT_ALPHA};function gt(X,Ft,wt,Xt,bt,vt,Lt,he,Ie,Ce){if(X===_a){C===!0&&(Ut(r.BLEND),C=!1);return}if(C===!1&&(ct(r.BLEND),C=!0),X!==_y){if(X!==M||Ce!==b){if((v!==Rs||D!==Rs)&&(r.blendEquation(r.FUNC_ADD),v=Rs,D=Rs),Ce)switch(X){case Ur:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case J0:r.blendFunc(r.ONE,r.ONE);break;case Q0:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case $0:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:we("WebGLState: Invalid blending: ",X);break}else switch(X){case Ur:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case J0:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Q0:we("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $0:we("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:we("WebGLState: Invalid blending: ",X);break}P=null,U=null,L=null,I=null,F.set(0,0,0),q=0,M=X,b=Ce}return}bt=bt||Ft,vt=vt||wt,Lt=Lt||Xt,(Ft!==v||bt!==D)&&(r.blendEquationSeparate(Ue[Ft],Ue[bt]),v=Ft,D=bt),(wt!==P||Xt!==U||vt!==L||Lt!==I)&&(r.blendFuncSeparate(fe[wt],fe[Xt],fe[vt],fe[Lt]),P=wt,U=Xt,L=vt,I=Lt),(he.equals(F)===!1||Ie!==q)&&(r.blendColor(he.r,he.g,he.b,Ie),F.copy(he),q=Ie),M=X,b=!1}function At(X,Ft){X.side===ma?Ut(r.CULL_FACE):ct(r.CULL_FACE);let wt=X.side===qn;Ft&&(wt=!wt),Mt(wt),X.blending===Ur&&X.transparent===!1?gt(_a):gt(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),f.setFunc(X.depthFunc),f.setTest(X.depthTest),f.setMask(X.depthWrite),c.setMask(X.colorWrite);const Xt=X.stencilWrite;d.setTest(Xt),Xt&&(d.setMask(X.stencilWriteMask),d.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),d.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),ie(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?ct(r.SAMPLE_ALPHA_TO_COVERAGE):Ut(r.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(X){w!==X&&(X?r.frontFace(r.CW):r.frontFace(r.CCW),w=X)}function Bt(X){X!==py?(ct(r.CULL_FACE),X!==V&&(X===K0?r.cullFace(r.BACK):X===my?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ut(r.CULL_FACE),V=X}function z(X){X!==nt&&(B&&r.lineWidth(X),nt=X)}function ie(X,Ft,wt){X?(ct(r.POLYGON_OFFSET_FILL),(it!==Ft||dt!==wt)&&(r.polygonOffset(Ft,wt),it=Ft,dt=wt)):Ut(r.POLYGON_OFFSET_FILL)}function Gt(X){X?ct(r.SCISSOR_TEST):Ut(r.SCISSOR_TEST)}function se(X){X===void 0&&(X=r.TEXTURE0+rt-1),yt!==X&&(r.activeTexture(X),yt=X)}function Nt(X,Ft,wt){wt===void 0&&(yt===null?wt=r.TEXTURE0+rt-1:wt=yt);let Xt=xt[wt];Xt===void 0&&(Xt={type:void 0,texture:void 0},xt[wt]=Xt),(Xt.type!==X||Xt.texture!==Ft)&&(yt!==wt&&(r.activeTexture(wt),yt=wt),r.bindTexture(X,Ft||Q[X]),Xt.type=X,Xt.texture=Ft)}function N(){const X=xt[yt];X!==void 0&&X.type!==void 0&&(r.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function E(){try{r.compressedTexImage2D(...arguments)}catch(X){we("WebGLState:",X)}}function W(){try{r.compressedTexImage3D(...arguments)}catch(X){we("WebGLState:",X)}}function ut(){try{r.texSubImage2D(...arguments)}catch(X){we("WebGLState:",X)}}function St(){try{r.texSubImage3D(...arguments)}catch(X){we("WebGLState:",X)}}function ht(){try{r.compressedTexSubImage2D(...arguments)}catch(X){we("WebGLState:",X)}}function Qt(){try{r.compressedTexSubImage3D(...arguments)}catch(X){we("WebGLState:",X)}}function Ot(){try{r.texStorage2D(...arguments)}catch(X){we("WebGLState:",X)}}function Jt(){try{r.texStorage3D(...arguments)}catch(X){we("WebGLState:",X)}}function le(){try{r.texImage2D(...arguments)}catch(X){we("WebGLState:",X)}}function Tt(){try{r.texImage3D(...arguments)}catch(X){we("WebGLState:",X)}}function Ct(X){ft.equals(X)===!1&&(r.scissor(X.x,X.y,X.z,X.w),ft.copy(X))}function Yt(X){Et.equals(X)===!1&&(r.viewport(X.x,X.y,X.z,X.w),Et.copy(X))}function kt(X,Ft){let wt=p.get(Ft);wt===void 0&&(wt=new WeakMap,p.set(Ft,wt));let Xt=wt.get(X);Xt===void 0&&(Xt=r.getUniformBlockIndex(Ft,X.name),wt.set(X,Xt))}function Pt(X,Ft){const Xt=p.get(Ft).get(X);m.get(Ft)!==Xt&&(r.uniformBlockBinding(Ft,Xt,X.__bindingPointIndex),m.set(Ft,Xt))}function _e(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),f.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),g={},yt=null,xt={},_={},x=new WeakMap,y=[],T=null,C=!1,M=null,v=null,P=null,U=null,D=null,L=null,I=null,F=new Fe(0,0,0),q=0,b=!1,w=null,V=null,nt=null,it=null,dt=null,ft.set(0,0,r.canvas.width,r.canvas.height),Et.set(0,0,r.canvas.width,r.canvas.height),c.reset(),f.reset(),d.reset()}return{buffers:{color:c,depth:f,stencil:d},enable:ct,disable:Ut,bindFramebuffer:Vt,drawBuffers:qt,useProgram:ye,setBlending:gt,setMaterial:At,setFlipSided:Mt,setCullFace:Bt,setLineWidth:z,setPolygonOffset:ie,setScissorTest:Gt,activeTexture:se,bindTexture:Nt,unbindTexture:N,compressedTexImage2D:E,compressedTexImage3D:W,texImage2D:le,texImage3D:Tt,updateUBOMapping:kt,uniformBlockBinding:Pt,texStorage2D:Ot,texStorage3D:Jt,texSubImage2D:ut,texSubImage3D:St,compressedTexSubImage2D:ht,compressedTexSubImage3D:Qt,scissor:Ct,viewport:Yt,reset:_e}}function QA(r,t,i,s,l,c,f){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new Wt,g=new WeakMap;let _;const x=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(N,E){return y?new OffscreenCanvas(N,E):Kc("canvas")}function C(N,E,W){let ut=1;const St=Nt(N);if((St.width>W||St.height>W)&&(ut=W/Math.max(St.width,St.height)),ut<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const ht=Math.floor(ut*St.width),Qt=Math.floor(ut*St.height);_===void 0&&(_=T(ht,Qt));const Ot=E?T(ht,Qt):_;return Ot.width=ht,Ot.height=Qt,Ot.getContext("2d").drawImage(N,0,0,ht,Qt),pe("WebGLRenderer: Texture has been resized from ("+St.width+"x"+St.height+") to ("+ht+"x"+Qt+")."),Ot}else return"data"in N&&pe("WebGLRenderer: Image in DataTexture is too big ("+St.width+"x"+St.height+")."),N;return N}function M(N){return N.generateMipmaps}function v(N){r.generateMipmap(N)}function P(N){return N.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?r.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function U(N,E,W,ut,St=!1){if(N!==null){if(r[N]!==void 0)return r[N];pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let ht=E;if(E===r.RED&&(W===r.FLOAT&&(ht=r.R32F),W===r.HALF_FLOAT&&(ht=r.R16F),W===r.UNSIGNED_BYTE&&(ht=r.R8)),E===r.RED_INTEGER&&(W===r.UNSIGNED_BYTE&&(ht=r.R8UI),W===r.UNSIGNED_SHORT&&(ht=r.R16UI),W===r.UNSIGNED_INT&&(ht=r.R32UI),W===r.BYTE&&(ht=r.R8I),W===r.SHORT&&(ht=r.R16I),W===r.INT&&(ht=r.R32I)),E===r.RG&&(W===r.FLOAT&&(ht=r.RG32F),W===r.HALF_FLOAT&&(ht=r.RG16F),W===r.UNSIGNED_BYTE&&(ht=r.RG8)),E===r.RG_INTEGER&&(W===r.UNSIGNED_BYTE&&(ht=r.RG8UI),W===r.UNSIGNED_SHORT&&(ht=r.RG16UI),W===r.UNSIGNED_INT&&(ht=r.RG32UI),W===r.BYTE&&(ht=r.RG8I),W===r.SHORT&&(ht=r.RG16I),W===r.INT&&(ht=r.RG32I)),E===r.RGB_INTEGER&&(W===r.UNSIGNED_BYTE&&(ht=r.RGB8UI),W===r.UNSIGNED_SHORT&&(ht=r.RGB16UI),W===r.UNSIGNED_INT&&(ht=r.RGB32UI),W===r.BYTE&&(ht=r.RGB8I),W===r.SHORT&&(ht=r.RGB16I),W===r.INT&&(ht=r.RGB32I)),E===r.RGBA_INTEGER&&(W===r.UNSIGNED_BYTE&&(ht=r.RGBA8UI),W===r.UNSIGNED_SHORT&&(ht=r.RGBA16UI),W===r.UNSIGNED_INT&&(ht=r.RGBA32UI),W===r.BYTE&&(ht=r.RGBA8I),W===r.SHORT&&(ht=r.RGBA16I),W===r.INT&&(ht=r.RGBA32I)),E===r.RGB&&(W===r.UNSIGNED_INT_5_9_9_9_REV&&(ht=r.RGB9_E5),W===r.UNSIGNED_INT_10F_11F_11F_REV&&(ht=r.R11F_G11F_B10F)),E===r.RGBA){const Qt=St?jc:De.getTransfer(ut);W===r.FLOAT&&(ht=r.RGBA32F),W===r.HALF_FLOAT&&(ht=r.RGBA16F),W===r.UNSIGNED_BYTE&&(ht=Qt===ke?r.SRGB8_ALPHA8:r.RGBA8),W===r.UNSIGNED_SHORT_4_4_4_4&&(ht=r.RGBA4),W===r.UNSIGNED_SHORT_5_5_5_1&&(ht=r.RGB5_A1)}return(ht===r.R16F||ht===r.R32F||ht===r.RG16F||ht===r.RG32F||ht===r.RGBA16F||ht===r.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function D(N,E){let W;return N?E===null||E===Gi||E===Ko?W=r.DEPTH24_STENCIL8:E===zi?W=r.DEPTH32F_STENCIL8:E===Zo&&(W=r.DEPTH24_STENCIL8,pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Gi||E===Ko?W=r.DEPTH_COMPONENT24:E===zi?W=r.DEPTH_COMPONENT32F:E===Zo&&(W=r.DEPTH_COMPONENT16),W}function L(N,E){return M(N)===!0||N.isFramebufferTexture&&N.minFilter!==Dn&&N.minFilter!==xn?Math.log2(Math.max(E.width,E.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?E.mipmaps.length:1}function I(N){const E=N.target;E.removeEventListener("dispose",I),q(E),E.isVideoTexture&&g.delete(E)}function F(N){const E=N.target;E.removeEventListener("dispose",F),w(E)}function q(N){const E=s.get(N);if(E.__webglInit===void 0)return;const W=N.source,ut=x.get(W);if(ut){const St=ut[E.__cacheKey];St.usedTimes--,St.usedTimes===0&&b(N),Object.keys(ut).length===0&&x.delete(W)}s.remove(N)}function b(N){const E=s.get(N);r.deleteTexture(E.__webglTexture);const W=N.source,ut=x.get(W);delete ut[E.__cacheKey],f.memory.textures--}function w(N){const E=s.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),s.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(E.__webglFramebuffer[ut]))for(let St=0;St<E.__webglFramebuffer[ut].length;St++)r.deleteFramebuffer(E.__webglFramebuffer[ut][St]);else r.deleteFramebuffer(E.__webglFramebuffer[ut]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[ut])}else{if(Array.isArray(E.__webglFramebuffer))for(let ut=0;ut<E.__webglFramebuffer.length;ut++)r.deleteFramebuffer(E.__webglFramebuffer[ut]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let ut=0;ut<E.__webglColorRenderbuffer.length;ut++)E.__webglColorRenderbuffer[ut]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[ut]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const W=N.textures;for(let ut=0,St=W.length;ut<St;ut++){const ht=s.get(W[ut]);ht.__webglTexture&&(r.deleteTexture(ht.__webglTexture),f.memory.textures--),s.remove(W[ut])}s.remove(N)}let V=0;function nt(){V=0}function it(){const N=V;return N>=l.maxTextures&&pe("WebGLTextures: Trying to use "+N+" texture units while this GPU supports only "+l.maxTextures),V+=1,N}function dt(N){const E=[];return E.push(N.wrapS),E.push(N.wrapT),E.push(N.wrapR||0),E.push(N.magFilter),E.push(N.minFilter),E.push(N.anisotropy),E.push(N.internalFormat),E.push(N.format),E.push(N.type),E.push(N.generateMipmaps),E.push(N.premultiplyAlpha),E.push(N.flipY),E.push(N.unpackAlignment),E.push(N.colorSpace),E.join()}function rt(N,E){const W=s.get(N);if(N.isVideoTexture&&Gt(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&W.__version!==N.version){const ut=N.image;if(ut===null)pe("WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)pe("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(W,N,E);return}}else N.isExternalTexture&&(W.__webglTexture=N.sourceTexture?N.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,W.__webglTexture,r.TEXTURE0+E)}function B(N,E){const W=s.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&W.__version!==N.version){Q(W,N,E);return}else N.isExternalTexture&&(W.__webglTexture=N.sourceTexture?N.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,W.__webglTexture,r.TEXTURE0+E)}function H(N,E){const W=s.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&W.__version!==N.version){Q(W,N,E);return}i.bindTexture(r.TEXTURE_3D,W.__webglTexture,r.TEXTURE0+E)}function $(N,E){const W=s.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&W.__version!==N.version){ct(W,N,E);return}i.bindTexture(r.TEXTURE_CUBE_MAP,W.__webglTexture,r.TEXTURE0+E)}const yt={[nd]:r.REPEAT,[ga]:r.CLAMP_TO_EDGE,[id]:r.MIRRORED_REPEAT},xt={[Dn]:r.NEAREST,[Fy]:r.NEAREST_MIPMAP_NEAREST,[vc]:r.NEAREST_MIPMAP_LINEAR,[xn]:r.LINEAR,[uh]:r.LINEAR_MIPMAP_NEAREST,[ws]:r.LINEAR_MIPMAP_LINEAR},O={[Hy]:r.NEVER,[Wy]:r.ALWAYS,[Gy]:r.LESS,[Kd]:r.LEQUAL,[Vy]:r.EQUAL,[Jd]:r.GEQUAL,[ky]:r.GREATER,[Xy]:r.NOTEQUAL};function K(N,E){if(E.type===zi&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===xn||E.magFilter===uh||E.magFilter===vc||E.magFilter===ws||E.minFilter===xn||E.minFilter===uh||E.minFilter===vc||E.minFilter===ws)&&pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(N,r.TEXTURE_WRAP_S,yt[E.wrapS]),r.texParameteri(N,r.TEXTURE_WRAP_T,yt[E.wrapT]),(N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY)&&r.texParameteri(N,r.TEXTURE_WRAP_R,yt[E.wrapR]),r.texParameteri(N,r.TEXTURE_MAG_FILTER,xt[E.magFilter]),r.texParameteri(N,r.TEXTURE_MIN_FILTER,xt[E.minFilter]),E.compareFunction&&(r.texParameteri(N,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(N,r.TEXTURE_COMPARE_FUNC,O[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Dn||E.minFilter!==vc&&E.minFilter!==ws||E.type===zi&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");r.texParameterf(N,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function ft(N,E){let W=!1;N.__webglInit===void 0&&(N.__webglInit=!0,E.addEventListener("dispose",I));const ut=E.source;let St=x.get(ut);St===void 0&&(St={},x.set(ut,St));const ht=dt(E);if(ht!==N.__cacheKey){St[ht]===void 0&&(St[ht]={texture:r.createTexture(),usedTimes:0},f.memory.textures++,W=!0),St[ht].usedTimes++;const Qt=St[N.__cacheKey];Qt!==void 0&&(St[N.__cacheKey].usedTimes--,Qt.usedTimes===0&&b(E)),N.__cacheKey=ht,N.__webglTexture=St[ht].texture}return W}function Et(N,E,W){return Math.floor(Math.floor(N/W)/E)}function Rt(N,E,W,ut){const ht=N.updateRanges;if(ht.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,W,ut,E.data);else{ht.sort((Tt,Ct)=>Tt.start-Ct.start);let Qt=0;for(let Tt=1;Tt<ht.length;Tt++){const Ct=ht[Qt],Yt=ht[Tt],kt=Ct.start+Ct.count,Pt=Et(Yt.start,E.width,4),_e=Et(Ct.start,E.width,4);Yt.start<=kt+1&&Pt===_e&&Et(Yt.start+Yt.count-1,E.width,4)===Pt?Ct.count=Math.max(Ct.count,Yt.start+Yt.count-Ct.start):(++Qt,ht[Qt]=Yt)}ht.length=Qt+1;const Ot=r.getParameter(r.UNPACK_ROW_LENGTH),Jt=r.getParameter(r.UNPACK_SKIP_PIXELS),le=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let Tt=0,Ct=ht.length;Tt<Ct;Tt++){const Yt=ht[Tt],kt=Math.floor(Yt.start/4),Pt=Math.ceil(Yt.count/4),_e=kt%E.width,X=Math.floor(kt/E.width),Ft=Pt,wt=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,_e),r.pixelStorei(r.UNPACK_SKIP_ROWS,X),i.texSubImage2D(r.TEXTURE_2D,0,_e,X,Ft,wt,W,ut,E.data)}N.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Ot),r.pixelStorei(r.UNPACK_SKIP_PIXELS,Jt),r.pixelStorei(r.UNPACK_SKIP_ROWS,le)}}function Q(N,E,W){let ut=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ut=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ut=r.TEXTURE_3D);const St=ft(N,E),ht=E.source;i.bindTexture(ut,N.__webglTexture,r.TEXTURE0+W);const Qt=s.get(ht);if(ht.version!==Qt.__version||St===!0){i.activeTexture(r.TEXTURE0+W);const Ot=De.getPrimaries(De.workingColorSpace),Jt=E.colorSpace===$a?null:De.getPrimaries(E.colorSpace),le=E.colorSpace===$a||Ot===Jt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);let Tt=C(E.image,!1,l.maxTextureSize);Tt=se(E,Tt);const Ct=c.convert(E.format,E.colorSpace),Yt=c.convert(E.type);let kt=U(E.internalFormat,Ct,Yt,E.colorSpace,E.isVideoTexture);K(ut,E);let Pt;const _e=E.mipmaps,X=E.isVideoTexture!==!0,Ft=Qt.__version===void 0||St===!0,wt=ht.dataReady,Xt=L(E,Tt);if(E.isDepthTexture)kt=D(E.format===Ds,E.type),Ft&&(X?i.texStorage2D(r.TEXTURE_2D,1,kt,Tt.width,Tt.height):i.texImage2D(r.TEXTURE_2D,0,kt,Tt.width,Tt.height,0,Ct,Yt,null));else if(E.isDataTexture)if(_e.length>0){X&&Ft&&i.texStorage2D(r.TEXTURE_2D,Xt,kt,_e[0].width,_e[0].height);for(let bt=0,vt=_e.length;bt<vt;bt++)Pt=_e[bt],X?wt&&i.texSubImage2D(r.TEXTURE_2D,bt,0,0,Pt.width,Pt.height,Ct,Yt,Pt.data):i.texImage2D(r.TEXTURE_2D,bt,kt,Pt.width,Pt.height,0,Ct,Yt,Pt.data);E.generateMipmaps=!1}else X?(Ft&&i.texStorage2D(r.TEXTURE_2D,Xt,kt,Tt.width,Tt.height),wt&&Rt(E,Tt,Ct,Yt)):i.texImage2D(r.TEXTURE_2D,0,kt,Tt.width,Tt.height,0,Ct,Yt,Tt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){X&&Ft&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Xt,kt,_e[0].width,_e[0].height,Tt.depth);for(let bt=0,vt=_e.length;bt<vt;bt++)if(Pt=_e[bt],E.format!==Ai)if(Ct!==null)if(X){if(wt)if(E.layerUpdates.size>0){const Lt=C_(Pt.width,Pt.height,E.format,E.type);for(const he of E.layerUpdates){const Ie=Pt.data.subarray(he*Lt/Pt.data.BYTES_PER_ELEMENT,(he+1)*Lt/Pt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,bt,0,0,he,Pt.width,Pt.height,1,Ct,Ie)}E.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,bt,0,0,0,Pt.width,Pt.height,Tt.depth,Ct,Pt.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,bt,kt,Pt.width,Pt.height,Tt.depth,0,Pt.data,0,0);else pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else X?wt&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,bt,0,0,0,Pt.width,Pt.height,Tt.depth,Ct,Yt,Pt.data):i.texImage3D(r.TEXTURE_2D_ARRAY,bt,kt,Pt.width,Pt.height,Tt.depth,0,Ct,Yt,Pt.data)}else{X&&Ft&&i.texStorage2D(r.TEXTURE_2D,Xt,kt,_e[0].width,_e[0].height);for(let bt=0,vt=_e.length;bt<vt;bt++)Pt=_e[bt],E.format!==Ai?Ct!==null?X?wt&&i.compressedTexSubImage2D(r.TEXTURE_2D,bt,0,0,Pt.width,Pt.height,Ct,Pt.data):i.compressedTexImage2D(r.TEXTURE_2D,bt,kt,Pt.width,Pt.height,0,Pt.data):pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):X?wt&&i.texSubImage2D(r.TEXTURE_2D,bt,0,0,Pt.width,Pt.height,Ct,Yt,Pt.data):i.texImage2D(r.TEXTURE_2D,bt,kt,Pt.width,Pt.height,0,Ct,Yt,Pt.data)}else if(E.isDataArrayTexture)if(X){if(Ft&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Xt,kt,Tt.width,Tt.height,Tt.depth),wt)if(E.layerUpdates.size>0){const bt=C_(Tt.width,Tt.height,E.format,E.type);for(const vt of E.layerUpdates){const Lt=Tt.data.subarray(vt*bt/Tt.data.BYTES_PER_ELEMENT,(vt+1)*bt/Tt.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,vt,Tt.width,Tt.height,1,Ct,Yt,Lt)}E.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Tt.width,Tt.height,Tt.depth,Ct,Yt,Tt.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,kt,Tt.width,Tt.height,Tt.depth,0,Ct,Yt,Tt.data);else if(E.isData3DTexture)X?(Ft&&i.texStorage3D(r.TEXTURE_3D,Xt,kt,Tt.width,Tt.height,Tt.depth),wt&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Tt.width,Tt.height,Tt.depth,Ct,Yt,Tt.data)):i.texImage3D(r.TEXTURE_3D,0,kt,Tt.width,Tt.height,Tt.depth,0,Ct,Yt,Tt.data);else if(E.isFramebufferTexture){if(Ft)if(X)i.texStorage2D(r.TEXTURE_2D,Xt,kt,Tt.width,Tt.height);else{let bt=Tt.width,vt=Tt.height;for(let Lt=0;Lt<Xt;Lt++)i.texImage2D(r.TEXTURE_2D,Lt,kt,bt,vt,0,Ct,Yt,null),bt>>=1,vt>>=1}}else if(_e.length>0){if(X&&Ft){const bt=Nt(_e[0]);i.texStorage2D(r.TEXTURE_2D,Xt,kt,bt.width,bt.height)}for(let bt=0,vt=_e.length;bt<vt;bt++)Pt=_e[bt],X?wt&&i.texSubImage2D(r.TEXTURE_2D,bt,0,0,Ct,Yt,Pt):i.texImage2D(r.TEXTURE_2D,bt,kt,Ct,Yt,Pt);E.generateMipmaps=!1}else if(X){if(Ft){const bt=Nt(Tt);i.texStorage2D(r.TEXTURE_2D,Xt,kt,bt.width,bt.height)}wt&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Ct,Yt,Tt)}else i.texImage2D(r.TEXTURE_2D,0,kt,Ct,Yt,Tt);M(E)&&v(ut),Qt.__version=ht.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function ct(N,E,W){if(E.image.length!==6)return;const ut=ft(N,E),St=E.source;i.bindTexture(r.TEXTURE_CUBE_MAP,N.__webglTexture,r.TEXTURE0+W);const ht=s.get(St);if(St.version!==ht.__version||ut===!0){i.activeTexture(r.TEXTURE0+W);const Qt=De.getPrimaries(De.workingColorSpace),Ot=E.colorSpace===$a?null:De.getPrimaries(E.colorSpace),Jt=E.colorSpace===$a||Qt===Ot?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Jt);const le=E.isCompressedTexture||E.image[0].isCompressedTexture,Tt=E.image[0]&&E.image[0].isDataTexture,Ct=[];for(let vt=0;vt<6;vt++)!le&&!Tt?Ct[vt]=C(E.image[vt],!0,l.maxCubemapSize):Ct[vt]=Tt?E.image[vt].image:E.image[vt],Ct[vt]=se(E,Ct[vt]);const Yt=Ct[0],kt=c.convert(E.format,E.colorSpace),Pt=c.convert(E.type),_e=U(E.internalFormat,kt,Pt,E.colorSpace),X=E.isVideoTexture!==!0,Ft=ht.__version===void 0||ut===!0,wt=St.dataReady;let Xt=L(E,Yt);K(r.TEXTURE_CUBE_MAP,E);let bt;if(le){X&&Ft&&i.texStorage2D(r.TEXTURE_CUBE_MAP,Xt,_e,Yt.width,Yt.height);for(let vt=0;vt<6;vt++){bt=Ct[vt].mipmaps;for(let Lt=0;Lt<bt.length;Lt++){const he=bt[Lt];E.format!==Ai?kt!==null?X?wt&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt,0,0,he.width,he.height,kt,he.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt,_e,he.width,he.height,0,he.data):pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):X?wt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt,0,0,he.width,he.height,kt,Pt,he.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt,_e,he.width,he.height,0,kt,Pt,he.data)}}}else{if(bt=E.mipmaps,X&&Ft){bt.length>0&&Xt++;const vt=Nt(Ct[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,Xt,_e,vt.width,vt.height)}for(let vt=0;vt<6;vt++)if(Tt){X?wt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,Ct[vt].width,Ct[vt].height,kt,Pt,Ct[vt].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,_e,Ct[vt].width,Ct[vt].height,0,kt,Pt,Ct[vt].data);for(let Lt=0;Lt<bt.length;Lt++){const Ie=bt[Lt].image[vt].image;X?wt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt+1,0,0,Ie.width,Ie.height,kt,Pt,Ie.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt+1,_e,Ie.width,Ie.height,0,kt,Pt,Ie.data)}}else{X?wt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,kt,Pt,Ct[vt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,_e,kt,Pt,Ct[vt]);for(let Lt=0;Lt<bt.length;Lt++){const he=bt[Lt];X?wt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt+1,0,0,kt,Pt,he.image[vt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Lt+1,_e,kt,Pt,he.image[vt])}}}M(E)&&v(r.TEXTURE_CUBE_MAP),ht.__version=St.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function Ut(N,E,W,ut,St,ht){const Qt=c.convert(W.format,W.colorSpace),Ot=c.convert(W.type),Jt=U(W.internalFormat,Qt,Ot,W.colorSpace),le=s.get(E),Tt=s.get(W);if(Tt.__renderTarget=E,!le.__hasExternalTextures){const Ct=Math.max(1,E.width>>ht),Yt=Math.max(1,E.height>>ht);St===r.TEXTURE_3D||St===r.TEXTURE_2D_ARRAY?i.texImage3D(St,ht,Jt,Ct,Yt,E.depth,0,Qt,Ot,null):i.texImage2D(St,ht,Jt,Ct,Yt,0,Qt,Ot,null)}i.bindFramebuffer(r.FRAMEBUFFER,N),ie(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ut,St,Tt.__webglTexture,0,z(E)):(St===r.TEXTURE_2D||St>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&St<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ut,St,Tt.__webglTexture,ht),i.bindFramebuffer(r.FRAMEBUFFER,null)}function Vt(N,E,W){if(r.bindRenderbuffer(r.RENDERBUFFER,N),E.depthBuffer){const ut=E.depthTexture,St=ut&&ut.isDepthTexture?ut.type:null,ht=D(E.stencilBuffer,St),Qt=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;ie(E)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,z(E),ht,E.width,E.height):W?r.renderbufferStorageMultisample(r.RENDERBUFFER,z(E),ht,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,ht,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Qt,r.RENDERBUFFER,N)}else{const ut=E.textures;for(let St=0;St<ut.length;St++){const ht=ut[St],Qt=c.convert(ht.format,ht.colorSpace),Ot=c.convert(ht.type),Jt=U(ht.internalFormat,Qt,Ot,ht.colorSpace);ie(E)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,z(E),Jt,E.width,E.height):W?r.renderbufferStorageMultisample(r.RENDERBUFFER,z(E),Jt,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,Jt,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function qt(N,E,W){const ut=E.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,N),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const St=s.get(E.depthTexture);if(St.__renderTarget=E,(!St.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),ut){if(St.__webglInit===void 0&&(St.__webglInit=!0,E.depthTexture.addEventListener("dispose",I)),St.__webglTexture===void 0){St.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,St.__webglTexture),K(r.TEXTURE_CUBE_MAP,E.depthTexture);const le=c.convert(E.depthTexture.format),Tt=c.convert(E.depthTexture.type);let Ct;E.depthTexture.format===Sa?Ct=r.DEPTH_COMPONENT24:E.depthTexture.format===Ds&&(Ct=r.DEPTH24_STENCIL8);for(let Yt=0;Yt<6;Yt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Yt,0,Ct,E.width,E.height,0,le,Tt,null)}}else rt(E.depthTexture,0);const ht=St.__webglTexture,Qt=z(E),Ot=ut?r.TEXTURE_CUBE_MAP_POSITIVE_X+W:r.TEXTURE_2D,Jt=E.depthTexture.format===Ds?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===Sa)ie(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Jt,Ot,ht,0,Qt):r.framebufferTexture2D(r.FRAMEBUFFER,Jt,Ot,ht,0);else if(E.depthTexture.format===Ds)ie(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Jt,Ot,ht,0,Qt):r.framebufferTexture2D(r.FRAMEBUFFER,Jt,Ot,ht,0);else throw new Error("Unknown depthTexture format")}function ye(N){const E=s.get(N),W=N.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==N.depthTexture){const ut=N.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),ut){const St=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,ut.removeEventListener("dispose",St)};ut.addEventListener("dispose",St),E.__depthDisposeCallback=St}E.__boundDepthTexture=ut}if(N.depthTexture&&!E.__autoAllocateDepthBuffer)if(W)for(let ut=0;ut<6;ut++)qt(E.__webglFramebuffer[ut],N,ut);else{const ut=N.texture.mipmaps;ut&&ut.length>0?qt(E.__webglFramebuffer[0],N,0):qt(E.__webglFramebuffer,N,0)}else if(W){E.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[ut]),E.__webglDepthbuffer[ut]===void 0)E.__webglDepthbuffer[ut]=r.createRenderbuffer(),Vt(E.__webglDepthbuffer[ut],N,!1);else{const St=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=E.__webglDepthbuffer[ut];r.bindRenderbuffer(r.RENDERBUFFER,ht),r.framebufferRenderbuffer(r.FRAMEBUFFER,St,r.RENDERBUFFER,ht)}}else{const ut=N.texture.mipmaps;if(ut&&ut.length>0?i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),Vt(E.__webglDepthbuffer,N,!1);else{const St=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ht),r.framebufferRenderbuffer(r.FRAMEBUFFER,St,r.RENDERBUFFER,ht)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function Ue(N,E,W){const ut=s.get(N);E!==void 0&&Ut(ut.__webglFramebuffer,N,N.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),W!==void 0&&ye(N)}function fe(N){const E=N.texture,W=s.get(N),ut=s.get(E);N.addEventListener("dispose",F);const St=N.textures,ht=N.isWebGLCubeRenderTarget===!0,Qt=St.length>1;if(Qt||(ut.__webglTexture===void 0&&(ut.__webglTexture=r.createTexture()),ut.__version=E.version,f.memory.textures++),ht){W.__webglFramebuffer=[];for(let Ot=0;Ot<6;Ot++)if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer[Ot]=[];for(let Jt=0;Jt<E.mipmaps.length;Jt++)W.__webglFramebuffer[Ot][Jt]=r.createFramebuffer()}else W.__webglFramebuffer[Ot]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer=[];for(let Ot=0;Ot<E.mipmaps.length;Ot++)W.__webglFramebuffer[Ot]=r.createFramebuffer()}else W.__webglFramebuffer=r.createFramebuffer();if(Qt)for(let Ot=0,Jt=St.length;Ot<Jt;Ot++){const le=s.get(St[Ot]);le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture(),f.memory.textures++)}if(N.samples>0&&ie(N)===!1){W.__webglMultisampledFramebuffer=r.createFramebuffer(),W.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let Ot=0;Ot<St.length;Ot++){const Jt=St[Ot];W.__webglColorRenderbuffer[Ot]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,W.__webglColorRenderbuffer[Ot]);const le=c.convert(Jt.format,Jt.colorSpace),Tt=c.convert(Jt.type),Ct=U(Jt.internalFormat,le,Tt,Jt.colorSpace,N.isXRRenderTarget===!0),Yt=z(N);r.renderbufferStorageMultisample(r.RENDERBUFFER,Yt,Ct,N.width,N.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ot,r.RENDERBUFFER,W.__webglColorRenderbuffer[Ot])}r.bindRenderbuffer(r.RENDERBUFFER,null),N.depthBuffer&&(W.__webglDepthRenderbuffer=r.createRenderbuffer(),Vt(W.__webglDepthRenderbuffer,N,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ht){i.bindTexture(r.TEXTURE_CUBE_MAP,ut.__webglTexture),K(r.TEXTURE_CUBE_MAP,E);for(let Ot=0;Ot<6;Ot++)if(E.mipmaps&&E.mipmaps.length>0)for(let Jt=0;Jt<E.mipmaps.length;Jt++)Ut(W.__webglFramebuffer[Ot][Jt],N,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ot,Jt);else Ut(W.__webglFramebuffer[Ot],N,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ot,0);M(E)&&v(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Qt){for(let Ot=0,Jt=St.length;Ot<Jt;Ot++){const le=St[Ot],Tt=s.get(le);let Ct=r.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ct=N.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Ct,Tt.__webglTexture),K(Ct,le),Ut(W.__webglFramebuffer,N,le,r.COLOR_ATTACHMENT0+Ot,Ct,0),M(le)&&v(Ct)}i.unbindTexture()}else{let Ot=r.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ot=N.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Ot,ut.__webglTexture),K(Ot,E),E.mipmaps&&E.mipmaps.length>0)for(let Jt=0;Jt<E.mipmaps.length;Jt++)Ut(W.__webglFramebuffer[Jt],N,E,r.COLOR_ATTACHMENT0,Ot,Jt);else Ut(W.__webglFramebuffer,N,E,r.COLOR_ATTACHMENT0,Ot,0);M(E)&&v(Ot),i.unbindTexture()}N.depthBuffer&&ye(N)}function gt(N){const E=N.textures;for(let W=0,ut=E.length;W<ut;W++){const St=E[W];if(M(St)){const ht=P(N),Qt=s.get(St).__webglTexture;i.bindTexture(ht,Qt),v(ht),i.unbindTexture()}}}const At=[],Mt=[];function Bt(N){if(N.samples>0){if(ie(N)===!1){const E=N.textures,W=N.width,ut=N.height;let St=r.COLOR_BUFFER_BIT;const ht=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Qt=s.get(N),Ot=E.length>1;if(Ot)for(let le=0;le<E.length;le++)i.bindFramebuffer(r.FRAMEBUFFER,Qt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,Qt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,Qt.__webglMultisampledFramebuffer);const Jt=N.texture.mipmaps;Jt&&Jt.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qt.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qt.__webglFramebuffer);for(let le=0;le<E.length;le++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(St|=r.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(St|=r.STENCIL_BUFFER_BIT)),Ot){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Qt.__webglColorRenderbuffer[le]);const Tt=s.get(E[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Tt,0)}r.blitFramebuffer(0,0,W,ut,0,0,W,ut,St,r.NEAREST),m===!0&&(At.length=0,Mt.length=0,At.push(r.COLOR_ATTACHMENT0+le),N.depthBuffer&&N.resolveDepthBuffer===!1&&(At.push(ht),Mt.push(ht),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Mt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,At))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Ot)for(let le=0;le<E.length;le++){i.bindFramebuffer(r.FRAMEBUFFER,Qt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,Qt.__webglColorRenderbuffer[le]);const Tt=s.get(E[le]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,Qt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,Tt,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Qt.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.resolveDepthBuffer===!1&&m){const E=N.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function z(N){return Math.min(l.maxSamples,N.samples)}function ie(N){const E=s.get(N);return N.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Gt(N){const E=f.render.frame;g.get(N)!==E&&(g.set(N,E),N.update())}function se(N,E){const W=N.colorSpace,ut=N.format,St=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||W!==zr&&W!==$a&&(De.getTransfer(W)===ke?(ut!==Ai||St!==ii)&&pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):we("WebGLTextures: Unsupported texture color space:",W)),E}function Nt(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(p.width=N.naturalWidth||N.width,p.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(p.width=N.displayWidth,p.height=N.displayHeight):(p.width=N.width,p.height=N.height),p}this.allocateTextureUnit=it,this.resetTextureUnits=nt,this.setTexture2D=rt,this.setTexture2DArray=B,this.setTexture3D=H,this.setTextureCube=$,this.rebindTextures=Ue,this.setupRenderTarget=fe,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=Bt,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=Ut,this.useMultisampledRTT=ie,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function $A(r,t){function i(s,l=$a){let c;const f=De.getTransfer(l);if(s===ii)return r.UNSIGNED_BYTE;if(s===Wd)return r.UNSIGNED_SHORT_4_4_4_4;if(s===qd)return r.UNSIGNED_SHORT_5_5_5_1;if(s===hv)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===dv)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===uv)return r.BYTE;if(s===fv)return r.SHORT;if(s===Zo)return r.UNSIGNED_SHORT;if(s===Xd)return r.INT;if(s===Gi)return r.UNSIGNED_INT;if(s===zi)return r.FLOAT;if(s===xa)return r.HALF_FLOAT;if(s===pv)return r.ALPHA;if(s===mv)return r.RGB;if(s===Ai)return r.RGBA;if(s===Sa)return r.DEPTH_COMPONENT;if(s===Ds)return r.DEPTH_STENCIL;if(s===gv)return r.RED;if(s===Yd)return r.RED_INTEGER;if(s===Pr)return r.RG;if(s===jd)return r.RG_INTEGER;if(s===Zd)return r.RGBA_INTEGER;if(s===kc||s===Xc||s===Wc||s===qc)if(f===ke)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===kc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Xc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Wc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===qc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===kc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Xc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Wc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===qc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===ad||s===sd||s===rd||s===od)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===ad)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===sd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===rd)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===od)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===ld||s===cd||s===ud||s===fd||s===hd||s===dd||s===pd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(s===ld||s===cd)return f===ke?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===ud)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===fd)return c.COMPRESSED_R11_EAC;if(s===hd)return c.COMPRESSED_SIGNED_R11_EAC;if(s===dd)return c.COMPRESSED_RG11_EAC;if(s===pd)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===md||s===gd||s===_d||s===vd||s===xd||s===Sd||s===yd||s===Md||s===Ed||s===Td||s===bd||s===Ad||s===Rd||s===Cd)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(s===md)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===gd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===_d)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===vd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===xd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Sd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===yd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Md)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Ed)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Td)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===bd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Ad)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Rd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Cd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===wd||s===Dd||s===Ud)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(s===wd)return f===ke?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Dd)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Ud)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Nd||s===Ld||s===Od||s===Pd)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(s===Nd)return c.COMPRESSED_RED_RGTC1_EXT;if(s===Ld)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Od)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Pd)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Ko?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const tR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,eR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class nR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const s=new Cv(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,s=new ki({vertexShader:tR,fragmentShader:eR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Ci(new rl(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iR extends Ir{constructor(t,i){super();const s=this;let l=null,c=1,f=null,d="local-floor",m=1,p=null,g=null,_=null,x=null,y=null,T=null;const C=typeof XRWebGLBinding<"u",M=new nR,v={},P=i.getContextAttributes();let U=null,D=null;const L=[],I=[],F=new Wt;let q=null;const b=new mi;b.viewport=new an;const w=new mi;w.viewport=new an;const V=[b,w],nt=new dE;let it=null,dt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ct=L[Q];return ct===void 0&&(ct=new Lh,L[Q]=ct),ct.getTargetRaySpace()},this.getControllerGrip=function(Q){let ct=L[Q];return ct===void 0&&(ct=new Lh,L[Q]=ct),ct.getGripSpace()},this.getHand=function(Q){let ct=L[Q];return ct===void 0&&(ct=new Lh,L[Q]=ct),ct.getHandSpace()};function rt(Q){const ct=I.indexOf(Q.inputSource);if(ct===-1)return;const Ut=L[ct];Ut!==void 0&&(Ut.update(Q.inputSource,Q.frame,p||f),Ut.dispatchEvent({type:Q.type,data:Q.inputSource}))}function B(){l.removeEventListener("select",rt),l.removeEventListener("selectstart",rt),l.removeEventListener("selectend",rt),l.removeEventListener("squeeze",rt),l.removeEventListener("squeezestart",rt),l.removeEventListener("squeezeend",rt),l.removeEventListener("end",B),l.removeEventListener("inputsourceschange",H);for(let Q=0;Q<L.length;Q++){const ct=I[Q];ct!==null&&(I[Q]=null,L[Q].disconnect(ct))}it=null,dt=null,M.reset();for(const Q in v)delete v[Q];t.setRenderTarget(U),y=null,x=null,_=null,l=null,D=null,Rt.stop(),s.isPresenting=!1,t.setPixelRatio(q),t.setSize(F.width,F.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){c=Q,s.isPresenting===!0&&pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){d=Q,s.isPresenting===!0&&pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||f},this.setReferenceSpace=function(Q){p=Q},this.getBaseLayer=function(){return x!==null?x:y},this.getBinding=function(){return _===null&&C&&(_=new XRWebGLBinding(l,i)),_},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(Q){if(l=Q,l!==null){if(U=t.getRenderTarget(),l.addEventListener("select",rt),l.addEventListener("selectstart",rt),l.addEventListener("selectend",rt),l.addEventListener("squeeze",rt),l.addEventListener("squeezestart",rt),l.addEventListener("squeezeend",rt),l.addEventListener("end",B),l.addEventListener("inputsourceschange",H),P.xrCompatible!==!0&&await i.makeXRCompatible(),q=t.getPixelRatio(),t.getSize(F),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ut=null,Vt=null,qt=null;P.depth&&(qt=P.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Ut=P.stencil?Ds:Sa,Vt=P.stencil?Ko:Gi);const ye={colorFormat:i.RGBA8,depthFormat:qt,scaleFactor:c};_=this.getBinding(),x=_.createProjectionLayer(ye),l.updateRenderState({layers:[x]}),t.setPixelRatio(1),t.setSize(x.textureWidth,x.textureHeight,!1),D=new Ii(x.textureWidth,x.textureHeight,{format:Ai,type:ii,depthTexture:new Qo(x.textureWidth,x.textureHeight,Vt,void 0,void 0,void 0,void 0,void 0,void 0,Ut),stencilBuffer:P.stencil,colorSpace:t.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}else{const Ut={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:c};y=new XRWebGLLayer(l,i,Ut),l.updateRenderState({baseLayer:y}),t.setPixelRatio(1),t.setSize(y.framebufferWidth,y.framebufferHeight,!1),D=new Ii(y.framebufferWidth,y.framebufferHeight,{format:Ai,type:ii,colorSpace:t.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}D.isXRRenderTarget=!0,this.setFoveation(m),p=null,f=await l.requestReferenceSpace(d),Rt.setContext(l),Rt.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function H(Q){for(let ct=0;ct<Q.removed.length;ct++){const Ut=Q.removed[ct],Vt=I.indexOf(Ut);Vt>=0&&(I[Vt]=null,L[Vt].disconnect(Ut))}for(let ct=0;ct<Q.added.length;ct++){const Ut=Q.added[ct];let Vt=I.indexOf(Ut);if(Vt===-1){for(let ye=0;ye<L.length;ye++)if(ye>=I.length){I.push(Ut),Vt=ye;break}else if(I[ye]===null){I[ye]=Ut,Vt=ye;break}if(Vt===-1)break}const qt=L[Vt];qt&&qt.connect(Ut)}}const $=new Z,yt=new Z;function xt(Q,ct,Ut){$.setFromMatrixPosition(ct.matrixWorld),yt.setFromMatrixPosition(Ut.matrixWorld);const Vt=$.distanceTo(yt),qt=ct.projectionMatrix.elements,ye=Ut.projectionMatrix.elements,Ue=qt[14]/(qt[10]-1),fe=qt[14]/(qt[10]+1),gt=(qt[9]+1)/qt[5],At=(qt[9]-1)/qt[5],Mt=(qt[8]-1)/qt[0],Bt=(ye[8]+1)/ye[0],z=Ue*Mt,ie=Ue*Bt,Gt=Vt/(-Mt+Bt),se=Gt*-Mt;if(ct.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(se),Q.translateZ(Gt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),qt[10]===-1)Q.projectionMatrix.copy(ct.projectionMatrix),Q.projectionMatrixInverse.copy(ct.projectionMatrixInverse);else{const Nt=Ue+Gt,N=fe+Gt,E=z-se,W=ie+(Vt-se),ut=gt*fe/N*Nt,St=At*fe/N*Nt;Q.projectionMatrix.makePerspective(E,W,ut,St,Nt,N),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function O(Q,ct){ct===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ct.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(l===null)return;let ct=Q.near,Ut=Q.far;M.texture!==null&&(M.depthNear>0&&(ct=M.depthNear),M.depthFar>0&&(Ut=M.depthFar)),nt.near=w.near=b.near=ct,nt.far=w.far=b.far=Ut,(it!==nt.near||dt!==nt.far)&&(l.updateRenderState({depthNear:nt.near,depthFar:nt.far}),it=nt.near,dt=nt.far),nt.layers.mask=Q.layers.mask|6,b.layers.mask=nt.layers.mask&3,w.layers.mask=nt.layers.mask&5;const Vt=Q.parent,qt=nt.cameras;O(nt,Vt);for(let ye=0;ye<qt.length;ye++)O(qt[ye],Vt);qt.length===2?xt(nt,b,w):nt.projectionMatrix.copy(b.projectionMatrix),K(Q,nt,Vt)};function K(Q,ct,Ut){Ut===null?Q.matrix.copy(ct.matrixWorld):(Q.matrix.copy(Ut.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ct.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ct.projectionMatrix),Q.projectionMatrixInverse.copy(ct.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=zd*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return nt},this.getFoveation=function(){if(!(x===null&&y===null))return m},this.setFoveation=function(Q){m=Q,x!==null&&(x.fixedFoveation=Q),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=Q)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(nt)},this.getCameraTexture=function(Q){return v[Q]};let ft=null;function Et(Q,ct){if(g=ct.getViewerPose(p||f),T=ct,g!==null){const Ut=g.views;y!==null&&(t.setRenderTargetFramebuffer(D,y.framebuffer),t.setRenderTarget(D));let Vt=!1;Ut.length!==nt.cameras.length&&(nt.cameras.length=0,Vt=!0);for(let fe=0;fe<Ut.length;fe++){const gt=Ut[fe];let At=null;if(y!==null)At=y.getViewport(gt);else{const Bt=_.getViewSubImage(x,gt);At=Bt.viewport,fe===0&&(t.setRenderTargetTextures(D,Bt.colorTexture,Bt.depthStencilTexture),t.setRenderTarget(D))}let Mt=V[fe];Mt===void 0&&(Mt=new mi,Mt.layers.enable(fe),Mt.viewport=new an,V[fe]=Mt),Mt.matrix.fromArray(gt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(gt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(At.x,At.y,At.width,At.height),fe===0&&(nt.matrix.copy(Mt.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale)),Vt===!0&&nt.cameras.push(Mt)}const qt=l.enabledFeatures;if(qt&&qt.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){_=s.getBinding();const fe=_.getDepthInformation(Ut[0]);fe&&fe.isValid&&fe.texture&&M.init(fe,l.renderState)}if(qt&&qt.includes("camera-access")&&C){t.state.unbindTexture(),_=s.getBinding();for(let fe=0;fe<Ut.length;fe++){const gt=Ut[fe].camera;if(gt){let At=v[gt];At||(At=new Cv,v[gt]=At);const Mt=_.getCameraImage(gt);At.sourceTexture=Mt}}}}for(let Ut=0;Ut<L.length;Ut++){const Vt=I[Ut],qt=L[Ut];Vt!==null&&qt!==void 0&&qt.update(Vt,ct,p||f)}ft&&ft(Q,ct),ct.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:ct}),T=null}const Rt=new Iv;Rt.setAnimationLoop(Et),this.setAnimationLoop=function(Q){ft=Q},this.dispose=function(){}}}const bs=new Vi,aR=new tn;function sR(r,t){function i(M,v){M.matrixAutoUpdate===!0&&M.updateMatrix(),v.value.copy(M.matrix)}function s(M,v){v.color.getRGB(M.fogColor.value,Tv(r)),v.isFog?(M.fogNear.value=v.near,M.fogFar.value=v.far):v.isFogExp2&&(M.fogDensity.value=v.density)}function l(M,v,P,U,D){v.isMeshBasicMaterial||v.isMeshLambertMaterial?c(M,v):v.isMeshToonMaterial?(c(M,v),_(M,v)):v.isMeshPhongMaterial?(c(M,v),g(M,v)):v.isMeshStandardMaterial?(c(M,v),x(M,v),v.isMeshPhysicalMaterial&&y(M,v,D)):v.isMeshMatcapMaterial?(c(M,v),T(M,v)):v.isMeshDepthMaterial?c(M,v):v.isMeshDistanceMaterial?(c(M,v),C(M,v)):v.isMeshNormalMaterial?c(M,v):v.isLineBasicMaterial?(f(M,v),v.isLineDashedMaterial&&d(M,v)):v.isPointsMaterial?m(M,v,P,U):v.isSpriteMaterial?p(M,v):v.isShadowMaterial?(M.color.value.copy(v.color),M.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function c(M,v){M.opacity.value=v.opacity,v.color&&M.diffuse.value.copy(v.color),v.emissive&&M.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(M.map.value=v.map,i(v.map,M.mapTransform)),v.alphaMap&&(M.alphaMap.value=v.alphaMap,i(v.alphaMap,M.alphaMapTransform)),v.bumpMap&&(M.bumpMap.value=v.bumpMap,i(v.bumpMap,M.bumpMapTransform),M.bumpScale.value=v.bumpScale,v.side===qn&&(M.bumpScale.value*=-1)),v.normalMap&&(M.normalMap.value=v.normalMap,i(v.normalMap,M.normalMapTransform),M.normalScale.value.copy(v.normalScale),v.side===qn&&M.normalScale.value.negate()),v.displacementMap&&(M.displacementMap.value=v.displacementMap,i(v.displacementMap,M.displacementMapTransform),M.displacementScale.value=v.displacementScale,M.displacementBias.value=v.displacementBias),v.emissiveMap&&(M.emissiveMap.value=v.emissiveMap,i(v.emissiveMap,M.emissiveMapTransform)),v.specularMap&&(M.specularMap.value=v.specularMap,i(v.specularMap,M.specularMapTransform)),v.alphaTest>0&&(M.alphaTest.value=v.alphaTest);const P=t.get(v),U=P.envMap,D=P.envMapRotation;U&&(M.envMap.value=U,bs.copy(D),bs.x*=-1,bs.y*=-1,bs.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(bs.y*=-1,bs.z*=-1),M.envMapRotation.value.setFromMatrix4(aR.makeRotationFromEuler(bs)),M.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=v.reflectivity,M.ior.value=v.ior,M.refractionRatio.value=v.refractionRatio),v.lightMap&&(M.lightMap.value=v.lightMap,M.lightMapIntensity.value=v.lightMapIntensity,i(v.lightMap,M.lightMapTransform)),v.aoMap&&(M.aoMap.value=v.aoMap,M.aoMapIntensity.value=v.aoMapIntensity,i(v.aoMap,M.aoMapTransform))}function f(M,v){M.diffuse.value.copy(v.color),M.opacity.value=v.opacity,v.map&&(M.map.value=v.map,i(v.map,M.mapTransform))}function d(M,v){M.dashSize.value=v.dashSize,M.totalSize.value=v.dashSize+v.gapSize,M.scale.value=v.scale}function m(M,v,P,U){M.diffuse.value.copy(v.color),M.opacity.value=v.opacity,M.size.value=v.size*P,M.scale.value=U*.5,v.map&&(M.map.value=v.map,i(v.map,M.uvTransform)),v.alphaMap&&(M.alphaMap.value=v.alphaMap,i(v.alphaMap,M.alphaMapTransform)),v.alphaTest>0&&(M.alphaTest.value=v.alphaTest)}function p(M,v){M.diffuse.value.copy(v.color),M.opacity.value=v.opacity,M.rotation.value=v.rotation,v.map&&(M.map.value=v.map,i(v.map,M.mapTransform)),v.alphaMap&&(M.alphaMap.value=v.alphaMap,i(v.alphaMap,M.alphaMapTransform)),v.alphaTest>0&&(M.alphaTest.value=v.alphaTest)}function g(M,v){M.specular.value.copy(v.specular),M.shininess.value=Math.max(v.shininess,1e-4)}function _(M,v){v.gradientMap&&(M.gradientMap.value=v.gradientMap)}function x(M,v){M.metalness.value=v.metalness,v.metalnessMap&&(M.metalnessMap.value=v.metalnessMap,i(v.metalnessMap,M.metalnessMapTransform)),M.roughness.value=v.roughness,v.roughnessMap&&(M.roughnessMap.value=v.roughnessMap,i(v.roughnessMap,M.roughnessMapTransform)),v.envMap&&(M.envMapIntensity.value=v.envMapIntensity)}function y(M,v,P){M.ior.value=v.ior,v.sheen>0&&(M.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),M.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(M.sheenColorMap.value=v.sheenColorMap,i(v.sheenColorMap,M.sheenColorMapTransform)),v.sheenRoughnessMap&&(M.sheenRoughnessMap.value=v.sheenRoughnessMap,i(v.sheenRoughnessMap,M.sheenRoughnessMapTransform))),v.clearcoat>0&&(M.clearcoat.value=v.clearcoat,M.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(M.clearcoatMap.value=v.clearcoatMap,i(v.clearcoatMap,M.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,i(v.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(M.clearcoatNormalMap.value=v.clearcoatNormalMap,i(v.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===qn&&M.clearcoatNormalScale.value.negate())),v.dispersion>0&&(M.dispersion.value=v.dispersion),v.iridescence>0&&(M.iridescence.value=v.iridescence,M.iridescenceIOR.value=v.iridescenceIOR,M.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(M.iridescenceMap.value=v.iridescenceMap,i(v.iridescenceMap,M.iridescenceMapTransform)),v.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=v.iridescenceThicknessMap,i(v.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),v.transmission>0&&(M.transmission.value=v.transmission,M.transmissionSamplerMap.value=P.texture,M.transmissionSamplerSize.value.set(P.width,P.height),v.transmissionMap&&(M.transmissionMap.value=v.transmissionMap,i(v.transmissionMap,M.transmissionMapTransform)),M.thickness.value=v.thickness,v.thicknessMap&&(M.thicknessMap.value=v.thicknessMap,i(v.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=v.attenuationDistance,M.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(M.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(M.anisotropyMap.value=v.anisotropyMap,i(v.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=v.specularIntensity,M.specularColor.value.copy(v.specularColor),v.specularColorMap&&(M.specularColorMap.value=v.specularColorMap,i(v.specularColorMap,M.specularColorMapTransform)),v.specularIntensityMap&&(M.specularIntensityMap.value=v.specularIntensityMap,i(v.specularIntensityMap,M.specularIntensityMapTransform))}function T(M,v){v.matcap&&(M.matcap.value=v.matcap)}function C(M,v){const P=t.get(v).light;M.referencePosition.value.setFromMatrixPosition(P.matrixWorld),M.nearDistance.value=P.shadow.camera.near,M.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function rR(r,t,i,s){let l={},c={},f=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(P,U){const D=U.program;s.uniformBlockBinding(P,D)}function p(P,U){let D=l[P.id];D===void 0&&(T(P),D=g(P),l[P.id]=D,P.addEventListener("dispose",M));const L=U.program;s.updateUBOMapping(P,L);const I=t.render.frame;c[P.id]!==I&&(x(P),c[P.id]=I)}function g(P){const U=_();P.__bindingPointIndex=U;const D=r.createBuffer(),L=P.__size,I=P.usage;return r.bindBuffer(r.UNIFORM_BUFFER,D),r.bufferData(r.UNIFORM_BUFFER,L,I),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,U,D),D}function _(){for(let P=0;P<d;P++)if(f.indexOf(P)===-1)return f.push(P),P;return we("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(P){const U=l[P.id],D=P.uniforms,L=P.__cache;r.bindBuffer(r.UNIFORM_BUFFER,U);for(let I=0,F=D.length;I<F;I++){const q=Array.isArray(D[I])?D[I]:[D[I]];for(let b=0,w=q.length;b<w;b++){const V=q[b];if(y(V,I,b,L)===!0){const nt=V.__offset,it=Array.isArray(V.value)?V.value:[V.value];let dt=0;for(let rt=0;rt<it.length;rt++){const B=it[rt],H=C(B);typeof B=="number"||typeof B=="boolean"?(V.__data[0]=B,r.bufferSubData(r.UNIFORM_BUFFER,nt+dt,V.__data)):B.isMatrix3?(V.__data[0]=B.elements[0],V.__data[1]=B.elements[1],V.__data[2]=B.elements[2],V.__data[3]=0,V.__data[4]=B.elements[3],V.__data[5]=B.elements[4],V.__data[6]=B.elements[5],V.__data[7]=0,V.__data[8]=B.elements[6],V.__data[9]=B.elements[7],V.__data[10]=B.elements[8],V.__data[11]=0):(B.toArray(V.__data,dt),dt+=H.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,nt,V.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function y(P,U,D,L){const I=P.value,F=U+"_"+D;if(L[F]===void 0)return typeof I=="number"||typeof I=="boolean"?L[F]=I:L[F]=I.clone(),!0;{const q=L[F];if(typeof I=="number"||typeof I=="boolean"){if(q!==I)return L[F]=I,!0}else if(q.equals(I)===!1)return q.copy(I),!0}return!1}function T(P){const U=P.uniforms;let D=0;const L=16;for(let F=0,q=U.length;F<q;F++){const b=Array.isArray(U[F])?U[F]:[U[F]];for(let w=0,V=b.length;w<V;w++){const nt=b[w],it=Array.isArray(nt.value)?nt.value:[nt.value];for(let dt=0,rt=it.length;dt<rt;dt++){const B=it[dt],H=C(B),$=D%L,yt=$%H.boundary,xt=$+yt;D+=yt,xt!==0&&L-xt<H.storage&&(D+=L-xt),nt.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),nt.__offset=D,D+=H.storage}}}const I=D%L;return I>0&&(D+=L-I),P.__size=D,P.__cache={},this}function C(P){const U={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(U.boundary=4,U.storage=4):P.isVector2?(U.boundary=8,U.storage=8):P.isVector3||P.isColor?(U.boundary=16,U.storage=12):P.isVector4?(U.boundary=16,U.storage=16):P.isMatrix3?(U.boundary=48,U.storage=48):P.isMatrix4?(U.boundary=64,U.storage=64):P.isTexture?pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):pe("WebGLRenderer: Unsupported uniform value type.",P),U}function M(P){const U=P.target;U.removeEventListener("dispose",M);const D=f.indexOf(U.__bindingPointIndex);f.splice(D,1),r.deleteBuffer(l[U.id]),delete l[U.id],delete c[U.id]}function v(){for(const P in l)r.deleteBuffer(l[P]);f=[],l={},c={}}return{bind:m,update:p,dispose:v}}const oR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Oi=null;function lR(){return Oi===null&&(Oi=new SM(oR,16,16,Pr,xa),Oi.name="DFG_LUT",Oi.minFilter=xn,Oi.magFilter=xn,Oi.wrapS=ga,Oi.wrapT=ga,Oi.generateMipmaps=!1,Oi.needsUpdate=!0),Oi}class cR{constructor(t={}){const{canvas:i=qy(),context:s=null,depth:l=!0,stencil:c=!1,alpha:f=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:x=!1,outputBufferType:y=ii}=t;this.isWebGLRenderer=!0;let T;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");T=s.getContextAttributes().alpha}else T=f;const C=y,M=new Set([Zd,jd,Yd]),v=new Set([ii,Gi,Zo,Ko,Wd,qd]),P=new Uint32Array(4),U=new Int32Array(4);let D=null,L=null;const I=[],F=[];let q=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let w=!1;this._outputColorSpace=ni;let V=0,nt=0,it=null,dt=-1,rt=null;const B=new an,H=new an;let $=null;const yt=new Fe(0);let xt=0,O=i.width,K=i.height,ft=1,Et=null,Rt=null;const Q=new an(0,0,O,K),ct=new an(0,0,O,K);let Ut=!1;const Vt=new ep;let qt=!1,ye=!1;const Ue=new tn,fe=new Z,gt=new an,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Mt=!1;function Bt(){return it===null?ft:1}let z=s;function ie(R,Y){return i.getContext(R,Y)}try{const R={alpha:!0,depth:l,stencil:c,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${kd}`),i.addEventListener("webglcontextlost",he,!1),i.addEventListener("webglcontextrestored",Ie,!1),i.addEventListener("webglcontextcreationerror",Ce,!1),z===null){const Y="webgl2";if(z=ie(Y,R),z===null)throw ie(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw we("WebGLRenderer: "+R.message),R}let Gt,se,Nt,N,E,W,ut,St,ht,Qt,Ot,Jt,le,Tt,Ct,Yt,kt,Pt,_e,X,Ft,wt,Xt,bt;function vt(){Gt=new l1(z),Gt.init(),wt=new $A(z,Gt),se=new $b(z,Gt,t,wt),Nt=new JA(z,Gt),se.reversedDepthBuffer&&x&&Nt.buffers.depth.setReversed(!0),N=new f1(z),E=new zA,W=new QA(z,Gt,Nt,E,se,wt,N),ut=new e1(b),St=new o1(b),ht=new mE(z),Xt=new Jb(z,ht),Qt=new c1(z,ht,N,Xt),Ot=new d1(z,Qt,ht,N),_e=new h1(z,se,W),Yt=new t1(E),Jt=new PA(b,ut,St,Gt,se,Xt,Yt),le=new sR(b,E),Tt=new BA,Ct=new XA(Gt),Pt=new Kb(b,ut,St,Nt,Ot,T,m),kt=new ZA(b,Ot,se),bt=new rR(z,N,se,Nt),X=new Qb(z,Gt,N),Ft=new u1(z,Gt,N),N.programs=Jt.programs,b.capabilities=se,b.extensions=Gt,b.properties=E,b.renderLists=Tt,b.shadowMap=kt,b.state=Nt,b.info=N}vt(),C!==ii&&(q=new m1(C,i.width,i.height,l,c));const Lt=new iR(b,z);this.xr=Lt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const R=Gt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Gt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ft},this.setPixelRatio=function(R){R!==void 0&&(ft=R,this.setSize(O,K,!1))},this.getSize=function(R){return R.set(O,K)},this.setSize=function(R,Y,ot=!0){if(Lt.isPresenting){pe("WebGLRenderer: Can't change size while VR device is presenting.");return}O=R,K=Y,i.width=Math.floor(R*ft),i.height=Math.floor(Y*ft),ot===!0&&(i.style.width=R+"px",i.style.height=Y+"px"),q!==null&&q.setSize(i.width,i.height),this.setViewport(0,0,R,Y)},this.getDrawingBufferSize=function(R){return R.set(O*ft,K*ft).floor()},this.setDrawingBufferSize=function(R,Y,ot){O=R,K=Y,ft=ot,i.width=Math.floor(R*ot),i.height=Math.floor(Y*ot),this.setViewport(0,0,R,Y)},this.setEffects=function(R){if(C===ii){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let Y=0;Y<R.length;Y++)if(R[Y].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}q.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(B)},this.getViewport=function(R){return R.copy(Q)},this.setViewport=function(R,Y,ot,at){R.isVector4?Q.set(R.x,R.y,R.z,R.w):Q.set(R,Y,ot,at),Nt.viewport(B.copy(Q).multiplyScalar(ft).round())},this.getScissor=function(R){return R.copy(ct)},this.setScissor=function(R,Y,ot,at){R.isVector4?ct.set(R.x,R.y,R.z,R.w):ct.set(R,Y,ot,at),Nt.scissor(H.copy(ct).multiplyScalar(ft).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(R){Nt.setScissorTest(Ut=R)},this.setOpaqueSort=function(R){Et=R},this.setTransparentSort=function(R){Rt=R},this.getClearColor=function(R){return R.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor(...arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha(...arguments)},this.clear=function(R=!0,Y=!0,ot=!0){let at=0;if(R){let J=!1;if(it!==null){const zt=it.texture.format;J=M.has(zt)}if(J){const zt=it.texture.type,jt=v.has(zt),It=Pt.getClearColor(),Zt=Pt.getClearAlpha(),$t=It.r,oe=It.g,te=It.b;jt?(P[0]=$t,P[1]=oe,P[2]=te,P[3]=Zt,z.clearBufferuiv(z.COLOR,0,P)):(U[0]=$t,U[1]=oe,U[2]=te,U[3]=Zt,z.clearBufferiv(z.COLOR,0,U))}else at|=z.COLOR_BUFFER_BIT}Y&&(at|=z.DEPTH_BUFFER_BIT),ot&&(at|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",he,!1),i.removeEventListener("webglcontextrestored",Ie,!1),i.removeEventListener("webglcontextcreationerror",Ce,!1),Pt.dispose(),Tt.dispose(),Ct.dispose(),E.dispose(),ut.dispose(),St.dispose(),Ot.dispose(),Xt.dispose(),bt.dispose(),Jt.dispose(),Lt.dispose(),Lt.removeEventListener("sessionstart",Os),Lt.removeEventListener("sessionend",Xr),wi.stop()};function he(R){R.preventDefault(),a_("WebGLRenderer: Context Lost."),w=!0}function Ie(){a_("WebGLRenderer: Context Restored."),w=!1;const R=N.autoReset,Y=kt.enabled,ot=kt.autoUpdate,at=kt.needsUpdate,J=kt.type;vt(),N.autoReset=R,kt.enabled=Y,kt.autoUpdate=ot,kt.needsUpdate=at,kt.type=J}function Ce(R){we("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Un(R){const Y=R.target;Y.removeEventListener("dispose",Un),gi(Y)}function gi(R){ol(R),E.remove(R)}function ol(R){const Y=E.get(R).programs;Y!==void 0&&(Y.forEach(function(ot){Jt.releaseProgram(ot)}),R.isShaderMaterial&&Jt.releaseShaderCache(R))}this.renderBufferDirect=function(R,Y,ot,at,J,zt){Y===null&&(Y=At);const jt=J.isMesh&&J.matrixWorld.determinant()<0,It=ns(R,Y,ot,at,J);Nt.setMaterial(at,jt);let Zt=ot.index,$t=1;if(at.wireframe===!0){if(Zt=Qt.getWireframeAttribute(ot),Zt===void 0)return;$t=2}const oe=ot.drawRange,te=ot.attributes.position;let ce=oe.start*$t,Oe=(oe.start+oe.count)*$t;zt!==null&&(ce=Math.max(ce,zt.start*$t),Oe=Math.min(Oe,(zt.start+zt.count)*$t)),Zt!==null?(ce=Math.max(ce,0),Oe=Math.min(Oe,Zt.count)):te!=null&&(ce=Math.max(ce,0),Oe=Math.min(Oe,te.count));const Je=Oe-ce;if(Je<0||Je===1/0)return;Xt.setup(J,at,It,ot,Zt);let je,Be=X;if(Zt!==null&&(je=ht.get(Zt),Be=Ft,Be.setIndex(je)),J.isMesh)at.wireframe===!0?(Nt.setLineWidth(at.wireframeLinewidth*Bt()),Be.setMode(z.LINES)):Be.setMode(z.TRIANGLES);else if(J.isLine){let ae=at.linewidth;ae===void 0&&(ae=1),Nt.setLineWidth(ae*Bt()),J.isLineSegments?Be.setMode(z.LINES):J.isLineLoop?Be.setMode(z.LINE_LOOP):Be.setMode(z.LINE_STRIP)}else J.isPoints?Be.setMode(z.POINTS):J.isSprite&&Be.setMode(z.TRIANGLES);if(J.isBatchedMesh)if(J._multiDrawInstances!==null)Jo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Be.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances);else if(Gt.get("WEBGL_multi_draw"))Be.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{const ae=J._multiDrawStarts,Pe=J._multiDrawCounts,de=J._multiDrawCount,yn=Zt?ht.get(Zt).bytesPerElement:1,qi=E.get(at).currentProgram.getUniforms();for(let Mn=0;Mn<de;Mn++)qi.setValue(z,"_gl_DrawID",Mn),Be.render(ae[Mn]/yn,Pe[Mn])}else if(J.isInstancedMesh)Be.renderInstances(ce,Je,J.count);else if(ot.isInstancedBufferGeometry){const ae=ot._maxInstanceCount!==void 0?ot._maxInstanceCount:1/0,Pe=Math.min(ot.instanceCount,ae);Be.renderInstances(ce,Je,Pe)}else Be.render(ce,Je)};function Vr(R,Y,ot){R.transparent===!0&&R.side===ma&&R.forceSinglePass===!1?(R.side=qn,R.needsUpdate=!0,zs(R,Y,ot),R.side=es,R.needsUpdate=!0,zs(R,Y,ot),R.side=ma):zs(R,Y,ot)}this.compile=function(R,Y,ot=null){ot===null&&(ot=R),L=Ct.get(ot),L.init(Y),F.push(L),ot.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(L.pushLight(J),J.castShadow&&L.pushShadow(J))}),R!==ot&&R.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(L.pushLight(J),J.castShadow&&L.pushShadow(J))}),L.setupLights();const at=new Set;return R.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;const zt=J.material;if(zt)if(Array.isArray(zt))for(let jt=0;jt<zt.length;jt++){const It=zt[jt];Vr(It,ot,J),at.add(It)}else Vr(zt,ot,J),at.add(zt)}),L=F.pop(),at},this.compileAsync=function(R,Y,ot=null){const at=this.compile(R,Y,ot);return new Promise(J=>{function zt(){if(at.forEach(function(jt){E.get(jt).currentProgram.isReady()&&at.delete(jt)}),at.size===0){J(R);return}setTimeout(zt,10)}Gt.get("KHR_parallel_shader_compile")!==null?zt():setTimeout(zt,10)})};let Ls=null;function kr(R){Ls&&Ls(R)}function Os(){wi.stop()}function Xr(){wi.start()}const wi=new Iv;wi.setAnimationLoop(kr),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(R){Ls=R,Lt.setAnimationLoop(R),R===null?wi.stop():wi.start()},Lt.addEventListener("sessionstart",Os),Lt.addEventListener("sessionend",Xr),this.render=function(R,Y){if(Y!==void 0&&Y.isCamera!==!0){we("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;const ot=Lt.enabled===!0&&Lt.isPresenting===!0,at=q!==null&&(it===null||ot)&&q.begin(b,it);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),Lt.enabled===!0&&Lt.isPresenting===!0&&(q===null||q.isCompositing()===!1)&&(Lt.cameraAutoUpdate===!0&&Lt.updateCamera(Y),Y=Lt.getCamera()),R.isScene===!0&&R.onBeforeRender(b,R,Y,it),L=Ct.get(R,F.length),L.init(Y),F.push(L),Ue.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Vt.setFromProjectionMatrix(Ue,Fi,Y.reversedDepth),ye=this.localClippingEnabled,qt=Yt.init(this.clippingPlanes,ye),D=Tt.get(R,I.length),D.init(),I.push(D),Lt.enabled===!0&&Lt.isPresenting===!0){const jt=b.xr.getDepthSensingMesh();jt!==null&&ai(jt,Y,-1/0,b.sortObjects)}ai(R,Y,0,b.sortObjects),D.finish(),b.sortObjects===!0&&D.sort(Et,Rt),Mt=Lt.enabled===!1||Lt.isPresenting===!1||Lt.hasDepthSensing()===!1,Mt&&Pt.addToRenderList(D,R),this.info.render.frame++,qt===!0&&Yt.beginShadows();const J=L.state.shadowsArray;if(kt.render(J,R,Y),qt===!0&&Yt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(at&&q.hasRenderPass())===!1){const jt=D.opaque,It=D.transmissive;if(L.setupLights(),Y.isArrayCamera){const Zt=Y.cameras;if(It.length>0)for(let $t=0,oe=Zt.length;$t<oe;$t++){const te=Zt[$t];Sn(jt,It,R,te)}Mt&&Pt.render(R);for(let $t=0,oe=Zt.length;$t<oe;$t++){const te=Zt[$t];on(D,R,te,te.viewport)}}else It.length>0&&Sn(jt,It,R,Y),Mt&&Pt.render(R),on(D,R,Y)}it!==null&&nt===0&&(W.updateMultisampleRenderTarget(it),W.updateRenderTargetMipmap(it)),at&&q.end(b),R.isScene===!0&&R.onAfterRender(b,R,Y),Xt.resetDefaultState(),dt=-1,rt=null,F.pop(),F.length>0?(L=F[F.length-1],qt===!0&&Yt.setGlobalState(b.clippingPlanes,L.state.camera)):L=null,I.pop(),I.length>0?D=I[I.length-1]:D=null};function ai(R,Y,ot,at){if(R.visible===!1)return;if(R.layers.test(Y.layers)){if(R.isGroup)ot=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(Y);else if(R.isLight)L.pushLight(R),R.castShadow&&L.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Vt.intersectsSprite(R)){at&&gt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Ue);const jt=Ot.update(R),It=R.material;It.visible&&D.push(R,jt,It,ot,gt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Vt.intersectsObject(R))){const jt=Ot.update(R),It=R.material;if(at&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),gt.copy(R.boundingSphere.center)):(jt.boundingSphere===null&&jt.computeBoundingSphere(),gt.copy(jt.boundingSphere.center)),gt.applyMatrix4(R.matrixWorld).applyMatrix4(Ue)),Array.isArray(It)){const Zt=jt.groups;for(let $t=0,oe=Zt.length;$t<oe;$t++){const te=Zt[$t],ce=It[te.materialIndex];ce&&ce.visible&&D.push(R,jt,ce,ot,gt.z,te)}}else It.visible&&D.push(R,jt,It,ot,gt.z,null)}}const zt=R.children;for(let jt=0,It=zt.length;jt<It;jt++)ai(zt[jt],Y,ot,at)}function on(R,Y,ot,at){const{opaque:J,transmissive:zt,transparent:jt}=R;L.setupLightsView(ot),qt===!0&&Yt.setGlobalState(b.clippingPlanes,ot),at&&Nt.viewport(B.copy(at)),J.length>0&&_i(J,Y,ot),zt.length>0&&_i(zt,Y,ot),jt.length>0&&_i(jt,Y,ot),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function Sn(R,Y,ot,at){if((ot.isScene===!0?ot.overrideMaterial:null)!==null)return;if(L.state.transmissionRenderTarget[at.id]===void 0){const ce=Gt.has("EXT_color_buffer_half_float")||Gt.has("EXT_color_buffer_float");L.state.transmissionRenderTarget[at.id]=new Ii(1,1,{generateMipmaps:!0,type:ce?xa:ii,minFilter:ws,samples:se.samples,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:De.workingColorSpace})}const zt=L.state.transmissionRenderTarget[at.id],jt=at.viewport||B;zt.setSize(jt.z*b.transmissionResolutionScale,jt.w*b.transmissionResolutionScale);const It=b.getRenderTarget(),Zt=b.getActiveCubeFace(),$t=b.getActiveMipmapLevel();b.setRenderTarget(zt),b.getClearColor(yt),xt=b.getClearAlpha(),xt<1&&b.setClearColor(16777215,.5),b.clear(),Mt&&Pt.render(ot);const oe=b.toneMapping;b.toneMapping=Bi;const te=at.viewport;if(at.viewport!==void 0&&(at.viewport=void 0),L.setupLightsView(at),qt===!0&&Yt.setGlobalState(b.clippingPlanes,at),_i(R,ot,at),W.updateMultisampleRenderTarget(zt),W.updateRenderTargetMipmap(zt),Gt.has("WEBGL_multisampled_render_to_texture")===!1){let ce=!1;for(let Oe=0,Je=Y.length;Oe<Je;Oe++){const je=Y[Oe],{object:Be,geometry:ae,material:Pe,group:de}=je;if(Pe.side===ma&&Be.layers.test(at.layers)){const yn=Pe.side;Pe.side=qn,Pe.needsUpdate=!0,Ps(Be,ot,at,ae,Pe,de),Pe.side=yn,Pe.needsUpdate=!0,ce=!0}}ce===!0&&(W.updateMultisampleRenderTarget(zt),W.updateRenderTargetMipmap(zt))}b.setRenderTarget(It,Zt,$t),b.setClearColor(yt,xt),te!==void 0&&(at.viewport=te),b.toneMapping=oe}function _i(R,Y,ot){const at=Y.isScene===!0?Y.overrideMaterial:null;for(let J=0,zt=R.length;J<zt;J++){const jt=R[J],{object:It,geometry:Zt,group:$t}=jt;let oe=jt.material;oe.allowOverride===!0&&at!==null&&(oe=at),It.layers.test(ot.layers)&&Ps(It,Y,ot,Zt,oe,$t)}}function Ps(R,Y,ot,at,J,zt){R.onBeforeRender(b,Y,ot,at,J,zt),R.modelViewMatrix.multiplyMatrices(ot.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),J.onBeforeRender(b,Y,ot,at,R,zt),J.transparent===!0&&J.side===ma&&J.forceSinglePass===!1?(J.side=qn,J.needsUpdate=!0,b.renderBufferDirect(ot,Y,at,J,R,zt),J.side=es,J.needsUpdate=!0,b.renderBufferDirect(ot,Y,at,J,R,zt),J.side=ma):b.renderBufferDirect(ot,Y,at,J,R,zt),R.onAfterRender(b,Y,ot,at,J,zt)}function zs(R,Y,ot){Y.isScene!==!0&&(Y=At);const at=E.get(R),J=L.state.lights,zt=L.state.shadowsArray,jt=J.state.version,It=Jt.getParameters(R,J.state,zt,Y,ot),Zt=Jt.getProgramCacheKey(It);let $t=at.programs;at.environment=R.isMeshStandardMaterial?Y.environment:null,at.fog=Y.fog,at.envMap=(R.isMeshStandardMaterial?St:ut).get(R.envMap||at.environment),at.envMapRotation=at.environment!==null&&R.envMap===null?Y.environmentRotation:R.envMapRotation,$t===void 0&&(R.addEventListener("dispose",Un),$t=new Map,at.programs=$t);let oe=$t.get(Zt);if(oe!==void 0){if(at.currentProgram===oe&&at.lightsStateVersion===jt)return Wr(R,It),oe}else It.uniforms=Jt.getUniforms(R),R.onBeforeCompile(It,b),oe=Jt.acquireProgram(It,Zt),$t.set(Zt,oe),at.uniforms=It.uniforms;const te=at.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(te.clippingPlanes=Yt.uniform),Wr(R,It),at.needsLights=ya(R),at.lightsStateVersion=jt,at.needsLights&&(te.ambientLightColor.value=J.state.ambient,te.lightProbe.value=J.state.probe,te.directionalLights.value=J.state.directional,te.directionalLightShadows.value=J.state.directionalShadow,te.spotLights.value=J.state.spot,te.spotLightShadows.value=J.state.spotShadow,te.rectAreaLights.value=J.state.rectArea,te.ltc_1.value=J.state.rectAreaLTC1,te.ltc_2.value=J.state.rectAreaLTC2,te.pointLights.value=J.state.point,te.pointLightShadows.value=J.state.pointShadow,te.hemisphereLights.value=J.state.hemi,te.directionalShadowMap.value=J.state.directionalShadowMap,te.directionalShadowMatrix.value=J.state.directionalShadowMatrix,te.spotShadowMap.value=J.state.spotShadowMap,te.spotLightMatrix.value=J.state.spotLightMatrix,te.spotLightMap.value=J.state.spotLightMap,te.pointShadowMap.value=J.state.pointShadowMap,te.pointShadowMatrix.value=J.state.pointShadowMatrix),at.currentProgram=oe,at.uniformsList=null,oe}function ll(R){if(R.uniformsList===null){const Y=R.currentProgram.getUniforms();R.uniformsList=Yc.seqWithValue(Y.seq,R.uniforms)}return R.uniformsList}function Wr(R,Y){const ot=E.get(R);ot.outputColorSpace=Y.outputColorSpace,ot.batching=Y.batching,ot.batchingColor=Y.batchingColor,ot.instancing=Y.instancing,ot.instancingColor=Y.instancingColor,ot.instancingMorph=Y.instancingMorph,ot.skinning=Y.skinning,ot.morphTargets=Y.morphTargets,ot.morphNormals=Y.morphNormals,ot.morphColors=Y.morphColors,ot.morphTargetsCount=Y.morphTargetsCount,ot.numClippingPlanes=Y.numClippingPlanes,ot.numIntersection=Y.numClipIntersection,ot.vertexAlphas=Y.vertexAlphas,ot.vertexTangents=Y.vertexTangents,ot.toneMapping=Y.toneMapping}function ns(R,Y,ot,at,J){Y.isScene!==!0&&(Y=At),W.resetTextureUnits();const zt=Y.fog,jt=at.isMeshStandardMaterial?Y.environment:null,It=it===null?b.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:zr,Zt=(at.isMeshStandardMaterial?St:ut).get(at.envMap||jt),$t=at.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,oe=!!ot.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),te=!!ot.morphAttributes.position,ce=!!ot.morphAttributes.normal,Oe=!!ot.morphAttributes.color;let Je=Bi;at.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Je=b.toneMapping);const je=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,Be=je!==void 0?je.length:0,ae=E.get(at),Pe=L.state.lights;if(qt===!0&&(ye===!0||R!==rt)){const Tn=R===rt&&at.id===dt;Yt.setState(at,R,Tn)}let de=!1;at.version===ae.__version?(ae.needsLights&&ae.lightsStateVersion!==Pe.state.version||ae.outputColorSpace!==It||J.isBatchedMesh&&ae.batching===!1||!J.isBatchedMesh&&ae.batching===!0||J.isBatchedMesh&&ae.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&ae.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&ae.instancing===!1||!J.isInstancedMesh&&ae.instancing===!0||J.isSkinnedMesh&&ae.skinning===!1||!J.isSkinnedMesh&&ae.skinning===!0||J.isInstancedMesh&&ae.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&ae.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&ae.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&ae.instancingMorph===!1&&J.morphTexture!==null||ae.envMap!==Zt||at.fog===!0&&ae.fog!==zt||ae.numClippingPlanes!==void 0&&(ae.numClippingPlanes!==Yt.numPlanes||ae.numIntersection!==Yt.numIntersection)||ae.vertexAlphas!==$t||ae.vertexTangents!==oe||ae.morphTargets!==te||ae.morphNormals!==ce||ae.morphColors!==Oe||ae.toneMapping!==Je||ae.morphTargetsCount!==Be)&&(de=!0):(de=!0,ae.__version=at.version);let yn=ae.currentProgram;de===!0&&(yn=zs(at,Y,J));let qi=!1,Mn=!1,si=!1;const He=yn.getUniforms(),En=ae.uniforms;if(Nt.useProgram(yn.program)&&(qi=!0,Mn=!0,si=!0),at.id!==dt&&(dt=at.id,Mn=!0),qi||rt!==R){Nt.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),He.setValue(z,"projectionMatrix",R.projectionMatrix),He.setValue(z,"viewMatrix",R.matrixWorldInverse);const bn=He.map.cameraPosition;bn!==void 0&&bn.setValue(z,fe.setFromMatrixPosition(R.matrixWorld)),se.logarithmicDepthBuffer&&He.setValue(z,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&He.setValue(z,"isOrthographic",R.isOrthographicCamera===!0),rt!==R&&(rt=R,Mn=!0,si=!0)}if(ae.needsLights&&(Pe.state.directionalShadowMap.length>0&&He.setValue(z,"directionalShadowMap",Pe.state.directionalShadowMap,W),Pe.state.spotShadowMap.length>0&&He.setValue(z,"spotShadowMap",Pe.state.spotShadowMap,W),Pe.state.pointShadowMap.length>0&&He.setValue(z,"pointShadowMap",Pe.state.pointShadowMap,W)),J.isSkinnedMesh){He.setOptional(z,J,"bindMatrix"),He.setOptional(z,J,"bindMatrixInverse");const Tn=J.skeleton;Tn&&(Tn.boneTexture===null&&Tn.computeBoneTexture(),He.setValue(z,"boneTexture",Tn.boneTexture,W))}J.isBatchedMesh&&(He.setOptional(z,J,"batchingTexture"),He.setValue(z,"batchingTexture",J._matricesTexture,W),He.setOptional(z,J,"batchingIdTexture"),He.setValue(z,"batchingIdTexture",J._indirectTexture,W),He.setOptional(z,J,"batchingColorTexture"),J._colorsTexture!==null&&He.setValue(z,"batchingColorTexture",J._colorsTexture,W));const dn=ot.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&_e.update(J,ot,yn),(Mn||ae.receiveShadow!==J.receiveShadow)&&(ae.receiveShadow=J.receiveShadow,He.setValue(z,"receiveShadow",J.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(En.envMap.value=Zt,En.flipEnvMap.value=Zt.isCubeTexture&&Zt.isRenderTargetTexture===!1?-1:1),at.isMeshStandardMaterial&&at.envMap===null&&Y.environment!==null&&(En.envMapIntensity.value=Y.environmentIntensity),En.dfgLUT!==void 0&&(En.dfgLUT.value=lR()),Mn&&(He.setValue(z,"toneMappingExposure",b.toneMappingExposure),ae.needsLights&&qr(En,si),zt&&at.fog===!0&&le.refreshFogUniforms(En,zt),le.refreshMaterialUniforms(En,at,ft,K,L.state.transmissionRenderTarget[R.id]),Yc.upload(z,ll(ae),En,W)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(Yc.upload(z,ll(ae),En,W),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&He.setValue(z,"center",J.center),He.setValue(z,"modelViewMatrix",J.modelViewMatrix),He.setValue(z,"normalMatrix",J.normalMatrix),He.setValue(z,"modelMatrix",J.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){const Tn=at.uniformsGroups;for(let bn=0,Fs=Tn.length;bn<Fs;bn++){const vi=Tn[bn];bt.update(vi,yn),bt.bind(vi,yn)}}return yn}function qr(R,Y){R.ambientLightColor.needsUpdate=Y,R.lightProbe.needsUpdate=Y,R.directionalLights.needsUpdate=Y,R.directionalLightShadows.needsUpdate=Y,R.pointLights.needsUpdate=Y,R.pointLightShadows.needsUpdate=Y,R.spotLights.needsUpdate=Y,R.spotLightShadows.needsUpdate=Y,R.rectAreaLights.needsUpdate=Y,R.hemisphereLights.needsUpdate=Y}function ya(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return nt},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(R,Y,ot){const at=E.get(R);at.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,at.__autoAllocateDepthBuffer===!1&&(at.__useRenderToTexture=!1),E.get(R.texture).__webglTexture=Y,E.get(R.depthTexture).__webglTexture=at.__autoAllocateDepthBuffer?void 0:ot,at.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,Y){const ot=E.get(R);ot.__webglFramebuffer=Y,ot.__useDefaultFramebuffer=Y===void 0};const Ma=z.createFramebuffer();this.setRenderTarget=function(R,Y=0,ot=0){it=R,V=Y,nt=ot;let at=null,J=!1,zt=!1;if(R){const It=E.get(R);if(It.__useDefaultFramebuffer!==void 0){Nt.bindFramebuffer(z.FRAMEBUFFER,It.__webglFramebuffer),B.copy(R.viewport),H.copy(R.scissor),$=R.scissorTest,Nt.viewport(B),Nt.scissor(H),Nt.setScissorTest($),dt=-1;return}else if(It.__webglFramebuffer===void 0)W.setupRenderTarget(R);else if(It.__hasExternalTextures)W.rebindTextures(R,E.get(R.texture).__webglTexture,E.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const oe=R.depthTexture;if(It.__boundDepthTexture!==oe){if(oe!==null&&E.has(oe)&&(R.width!==oe.image.width||R.height!==oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(R)}}const Zt=R.texture;(Zt.isData3DTexture||Zt.isDataArrayTexture||Zt.isCompressedArrayTexture)&&(zt=!0);const $t=E.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray($t[Y])?at=$t[Y][ot]:at=$t[Y],J=!0):R.samples>0&&W.useMultisampledRTT(R)===!1?at=E.get(R).__webglMultisampledFramebuffer:Array.isArray($t)?at=$t[ot]:at=$t,B.copy(R.viewport),H.copy(R.scissor),$=R.scissorTest}else B.copy(Q).multiplyScalar(ft).floor(),H.copy(ct).multiplyScalar(ft).floor(),$=Ut;if(ot!==0&&(at=Ma),Nt.bindFramebuffer(z.FRAMEBUFFER,at)&&Nt.drawBuffers(R,at),Nt.viewport(B),Nt.scissor(H),Nt.setScissorTest($),J){const It=E.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+Y,It.__webglTexture,ot)}else if(zt){const It=Y;for(let Zt=0;Zt<R.textures.length;Zt++){const $t=E.get(R.textures[Zt]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Zt,$t.__webglTexture,ot,It)}}else if(R!==null&&ot!==0){const It=E.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,It.__webglTexture,ot)}dt=-1},this.readRenderTargetPixels=function(R,Y,ot,at,J,zt,jt,It=0){if(!(R&&R.isWebGLRenderTarget)){we("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=E.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&jt!==void 0&&(Zt=Zt[jt]),Zt){Nt.bindFramebuffer(z.FRAMEBUFFER,Zt);try{const $t=R.textures[It],oe=$t.format,te=$t.type;if(!se.textureFormatReadable(oe)){we("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!se.textureTypeReadable(te)){we("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=R.width-at&&ot>=0&&ot<=R.height-J&&(R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+It),z.readPixels(Y,ot,at,J,wt.convert(oe),wt.convert(te),zt))}finally{const $t=it!==null?E.get(it).__webglFramebuffer:null;Nt.bindFramebuffer(z.FRAMEBUFFER,$t)}}},this.readRenderTargetPixelsAsync=async function(R,Y,ot,at,J,zt,jt,It=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=E.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&jt!==void 0&&(Zt=Zt[jt]),Zt)if(Y>=0&&Y<=R.width-at&&ot>=0&&ot<=R.height-J){Nt.bindFramebuffer(z.FRAMEBUFFER,Zt);const $t=R.textures[It],oe=$t.format,te=$t.type;if(!se.textureFormatReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,ce),z.bufferData(z.PIXEL_PACK_BUFFER,zt.byteLength,z.STREAM_READ),R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+It),z.readPixels(Y,ot,at,J,wt.convert(oe),wt.convert(te),0);const Oe=it!==null?E.get(it).__webglFramebuffer:null;Nt.bindFramebuffer(z.FRAMEBUFFER,Oe);const Je=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Yy(z,Je,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,ce),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,zt),z.deleteBuffer(ce),z.deleteSync(Je),zt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,Y=null,ot=0){const at=Math.pow(2,-ot),J=Math.floor(R.image.width*at),zt=Math.floor(R.image.height*at),jt=Y!==null?Y.x:0,It=Y!==null?Y.y:0;W.setTexture2D(R,0),z.copyTexSubImage2D(z.TEXTURE_2D,ot,0,0,jt,It,J,zt),Nt.unbindTexture()};const is=z.createFramebuffer(),Ea=z.createFramebuffer();this.copyTextureToTexture=function(R,Y,ot=null,at=null,J=0,zt=null){zt===null&&(J!==0?(Jo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),zt=J,J=0):zt=0);let jt,It,Zt,$t,oe,te,ce,Oe,Je;const je=R.isCompressedTexture?R.mipmaps[zt]:R.image;if(ot!==null)jt=ot.max.x-ot.min.x,It=ot.max.y-ot.min.y,Zt=ot.isBox3?ot.max.z-ot.min.z:1,$t=ot.min.x,oe=ot.min.y,te=ot.isBox3?ot.min.z:0;else{const dn=Math.pow(2,-J);jt=Math.floor(je.width*dn),It=Math.floor(je.height*dn),R.isDataArrayTexture?Zt=je.depth:R.isData3DTexture?Zt=Math.floor(je.depth*dn):Zt=1,$t=0,oe=0,te=0}at!==null?(ce=at.x,Oe=at.y,Je=at.z):(ce=0,Oe=0,Je=0);const Be=wt.convert(Y.format),ae=wt.convert(Y.type);let Pe;Y.isData3DTexture?(W.setTexture3D(Y,0),Pe=z.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(W.setTexture2DArray(Y,0),Pe=z.TEXTURE_2D_ARRAY):(W.setTexture2D(Y,0),Pe=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,Y.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,Y.unpackAlignment);const de=z.getParameter(z.UNPACK_ROW_LENGTH),yn=z.getParameter(z.UNPACK_IMAGE_HEIGHT),qi=z.getParameter(z.UNPACK_SKIP_PIXELS),Mn=z.getParameter(z.UNPACK_SKIP_ROWS),si=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,je.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,je.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,$t),z.pixelStorei(z.UNPACK_SKIP_ROWS,oe),z.pixelStorei(z.UNPACK_SKIP_IMAGES,te);const He=R.isDataArrayTexture||R.isData3DTexture,En=Y.isDataArrayTexture||Y.isData3DTexture;if(R.isDepthTexture){const dn=E.get(R),Tn=E.get(Y),bn=E.get(dn.__renderTarget),Fs=E.get(Tn.__renderTarget);Nt.bindFramebuffer(z.READ_FRAMEBUFFER,bn.__webglFramebuffer),Nt.bindFramebuffer(z.DRAW_FRAMEBUFFER,Fs.__webglFramebuffer);for(let vi=0;vi<Zt;vi++)He&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,E.get(R).__webglTexture,J,te+vi),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,E.get(Y).__webglTexture,zt,Je+vi)),z.blitFramebuffer($t,oe,jt,It,ce,Oe,jt,It,z.DEPTH_BUFFER_BIT,z.NEAREST);Nt.bindFramebuffer(z.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(J!==0||R.isRenderTargetTexture||E.has(R)){const dn=E.get(R),Tn=E.get(Y);Nt.bindFramebuffer(z.READ_FRAMEBUFFER,is),Nt.bindFramebuffer(z.DRAW_FRAMEBUFFER,Ea);for(let bn=0;bn<Zt;bn++)He?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,dn.__webglTexture,J,te+bn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,dn.__webglTexture,J),En?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Tn.__webglTexture,zt,Je+bn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Tn.__webglTexture,zt),J!==0?z.blitFramebuffer($t,oe,jt,It,ce,Oe,jt,It,z.COLOR_BUFFER_BIT,z.NEAREST):En?z.copyTexSubImage3D(Pe,zt,ce,Oe,Je+bn,$t,oe,jt,It):z.copyTexSubImage2D(Pe,zt,ce,Oe,$t,oe,jt,It);Nt.bindFramebuffer(z.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else En?R.isDataTexture||R.isData3DTexture?z.texSubImage3D(Pe,zt,ce,Oe,Je,jt,It,Zt,Be,ae,je.data):Y.isCompressedArrayTexture?z.compressedTexSubImage3D(Pe,zt,ce,Oe,Je,jt,It,Zt,Be,je.data):z.texSubImage3D(Pe,zt,ce,Oe,Je,jt,It,Zt,Be,ae,je):R.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,zt,ce,Oe,jt,It,Be,ae,je.data):R.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,zt,ce,Oe,je.width,je.height,Be,je.data):z.texSubImage2D(z.TEXTURE_2D,zt,ce,Oe,jt,It,Be,ae,je);z.pixelStorei(z.UNPACK_ROW_LENGTH,de),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,yn),z.pixelStorei(z.UNPACK_SKIP_PIXELS,qi),z.pixelStorei(z.UNPACK_SKIP_ROWS,Mn),z.pixelStorei(z.UNPACK_SKIP_IMAGES,si),zt===0&&Y.generateMipmaps&&z.generateMipmap(Pe),Nt.unbindTexture()},this.initRenderTarget=function(R){E.get(R).__webglFramebuffer===void 0&&W.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?W.setTextureCube(R,0):R.isData3DTexture?W.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?W.setTexture2DArray(R,0):W.setTexture2D(R,0),Nt.unbindTexture()},this.resetState=function(){V=0,nt=0,it=null,Nt.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=De._getDrawingBufferColorSpace(t),i.unpackColorSpace=De._getUnpackColorSpace()}}const uR=2e3,Q_=2.4,Gc=5,$_=.25,fR=.3,tv=.15;function hR(r,t,i){const s=new Lv,l=r/2,c=t/2;return s.moveTo(-l+i,-c),s.lineTo(l-i,-c),s.quadraticCurveTo(l,-c,l,-c+i),s.lineTo(l,c-i),s.quadraticCurveTo(l,c,l-i,c),s.lineTo(-l+i,c),s.quadraticCurveTo(-l,c,-l,c-i),s.lineTo(-l,-c+i),s.quadraticCurveTo(-l,-c,-l+i,-c),s}function dR({selectedSession:r}){const t=ee.useRef(null),i=ee.useRef(null);return ee.useEffect(()=>{const s=i.current;s&&s.readyState===WebSocket.OPEN&&s.send(JSON.stringify({type:"select",session:r}))},[r]),ee.useEffect(()=>{const s=t.current;if(!s)return;const l=new xM,c=new mi(35,3/4,.1,100);c.position.set(0,0,10),c.lookAt(0,0,0);const f=new cR({antialias:!0,alpha:!0});f.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.appendChild(f.domElement),l.add(new hE(16777215,.6));const d=new fE(16777215,.8);d.position.set(3,5,8),l.add(d);const m=new wr;l.add(m);const p=new wr;m.add(p);const g=document.createElement("canvas");g.width=540,g.height=1170;const _=g.getContext("2d");_.fillStyle="#111",_.fillRect(0,0,g.width,g.height);const x=new TM(g);x.colorSpace=ni,x.minFilter=xn,x.magFilter=xn;const y=new rE({color:1710638,metalness:.3,roughness:.7}),T=new tp({map:x});let C=null,M=null,v=null,P=null,U=Q_,D=Gc;function L(K,ft){C&&(p.remove(C),v.dispose()),M&&(p.remove(M),P.dispose()),U=K,D=ft;const Et=hR(K,ft,fR);v=new ap(Et,{depth:$_,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:3}),v.center(),C=new Ci(v,y),p.add(C);const Rt=K-tv*2,Q=ft-tv*2;P=new rl(Rt,Q),M=new Ci(P,T),M.position.z=($_+.08)/2+.01,p.add(M),g.width=Math.round(Rt*200),g.height=Math.round(Q*200),_.fillStyle="#111",_.fillRect(0,0,g.width,g.height),x.dispose(),x.needsUpdate=!0,nt()}const I=.85;let F=0,q=0,b=0;const w=[0,Math.PI/2,Math.PI,-Math.PI/2];let V=10;function nt(){const ft=(F===1||F===3?D:U)*I,Et=Math.atan(Math.tan(c.fov/2*Math.PI/180)*c.aspect);V=ft/2/Math.tan(Et)}L(Q_,Gc),p.scale.setScalar(I);function it(){const K=s.clientWidth,ft=s.clientHeight;K===0||ft===0||(c.aspect=K/ft,c.updateProjectionMatrix(),f.setSize(K,ft),nt())}it();const dt=new ResizeObserver(it);dt.observe(s);let rt=performance.now(),B=0;function H(){B=requestAnimationFrame(H);const K=performance.now(),ft=Math.min((K-rt)/1e3,.1);rt=K;const Et=1-Math.exp(-8*ft);let Rt=q-b;Rt>Math.PI&&(Rt-=2*Math.PI),Rt<-Math.PI&&(Rt+=2*Math.PI),b+=Rt*Et,m.rotation.z=b,c.position.z+=(V-c.position.z)*Et,f.render(l,c)}H();let $=null,yt=null,xt=!1;function O(){if(xt)return;const ft=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws/preview`;$=new WebSocket(ft),i.current=$,$.binaryType="arraybuffer",$.onopen=()=>{$.send(JSON.stringify({type:"select",session:r}))},$.onclose=()=>{i.current=null,xt||(yt=setTimeout(O,uR))},$.onerror=()=>{},$.onmessage=Et=>{if(typeof Et.data=="string")try{const Rt=JSON.parse(Et.data);if(Rt.type==="device"){const Q=Math.min(Rt.w,Rt.h),ct=Math.max(Rt.w,Rt.h),Ut=Q/ct;L(Gc*Ut,Gc)}if(Rt.type==="orient"&&Rt.o!==void 0){const Q=Rt.o;if(Q!==F){F=Q,q=w[F],nt();const ct=F===1||F===3,Ut=s==null?void 0:s.closest(".preview-column");Ut&&(Ut.style.width=ct?`${Math.round(400*D/U)}px`:"400px")}}}catch{}else{const Rt=new Blob([Et.data],{type:"image/jpeg"});createImageBitmap(Rt).then(Q=>{const ct=F===1||F===3;if(_.clearRect(0,0,g.width,g.height),ct){const Ut=w[F];_.save(),_.translate(g.width/2,g.height/2),_.rotate(Ut),_.drawImage(Q,-g.height/2,-g.width/2,g.height,g.width),_.restore()}else F===2?(_.save(),_.translate(g.width/2,g.height/2),_.rotate(w[2]),_.drawImage(Q,-g.width/2,-g.height/2,g.width,g.height),_.restore()):_.drawImage(Q,0,0,g.width,g.height);x.needsUpdate=!0,Q.close()})}}}return O(),()=>{xt=!0,yt&&clearTimeout(yt),$&&($.onclose=null,$.close(),i.current=null),cancelAnimationFrame(B),dt.disconnect(),f.dispose(),v&&v.dispose(),y.dispose(),P&&P.dispose(),T.dispose(),x.dispose(),s.contains(f.domElement)&&s.removeChild(f.domElement)}},[]),Dt.jsx("div",{className:"phone-preview",ref:t})}function pR({sessions:r,servers:t,selectedSession:i,onSelectSession:s,onSwitchAll:l,onSwitchSession:c}){const[f,d]=ee.useState(null),m=ee.useRef(null),p=ee.useRef(null),g=ee.useCallback(v=>{const P=t.find(U=>U.id===v);return P?P.name:"(none)"},[t]),_=(()=>{if(r.length===0)return"";const v=r[0].serverID;return r.every(P=>P.serverID===v)?v:""})(),x=_?g(_):"(mixed)",y=ee.useCallback(v=>{t.length<2||(p.current&&(clearTimeout(p.current),p.current=null),m.current=setTimeout(()=>d(v),50))},[t.length]),T=ee.useCallback(()=>{m.current&&(clearTimeout(m.current),m.current=null),p.current=setTimeout(()=>d(null),200)},[]),C=ee.useCallback(()=>{p.current&&(clearTimeout(p.current),p.current=null)},[]),M=ee.useCallback(v=>{v&&requestAnimationFrame(()=>{const P=v.parentElement;if(!P){v.style.opacity="1";return}const U=v.querySelector(".server-dropdown-item.current");if(!U){v.style.opacity="1";return}const D=P.getBoundingClientRect(),L=U.getBoundingClientRect(),I=getComputedStyle(P),F=getComputedStyle(U),q=D.left+parseFloat(I.paddingLeft)-(L.left+parseFloat(F.paddingLeft)),b=D.top+parseFloat(I.paddingTop)-(L.top+parseFloat(F.paddingTop));v.style.transform=`translate(${q}px, ${b}px)`,v.style.opacity="1"})},[]);return r.length===0?null:Dt.jsxs("div",{className:"player-list",children:[Dt.jsx("h2",{className:"player-title",children:"Players"}),Dt.jsxs("div",{className:"player-items",children:[Dt.jsxs("div",{className:`player-row ${i===null?"selected":""}`,children:[Dt.jsxs("button",{className:"player-label",onClick:()=>s(null),children:[Dt.jsx("span",{className:"player-dot all"}),Dt.jsx("span",{children:"All"})]}),Dt.jsx("span",{className:"player-arrow",children:"→"}),Dt.jsxs("div",{className:"player-server",onMouseEnter:()=>y("all"),onMouseLeave:T,children:[x,f==="all"&&Dt.jsx("div",{className:"server-dropdown",ref:M,style:{opacity:0},onMouseEnter:C,onMouseLeave:T,children:t.map(v=>Dt.jsx("button",{className:`server-dropdown-item ${v.id===_?"current":""}`,onClick:()=>{l(v.id),d(null)},children:v.name},v.id))})]})]}),r.map(v=>Dt.jsxs("div",{className:`player-row ${i===v.id?"selected":""}`,children:[Dt.jsxs("button",{className:"player-label",onClick:()=>s(v.id),children:[Dt.jsx("span",{className:"player-dot active"}),Dt.jsx("span",{children:v.name||v.id})]}),Dt.jsx("span",{className:"player-arrow",children:"→"}),Dt.jsxs("div",{className:"player-server",onMouseEnter:()=>y(v.id),onMouseLeave:T,children:[g(v.serverID),f===v.id&&Dt.jsx("div",{className:"server-dropdown",ref:M,style:{opacity:0},onMouseEnter:C,onMouseLeave:T,children:t.map(P=>Dt.jsx("button",{className:`server-dropdown-item ${P.id===v.serverID?"current":""}`,onClick:()=>{c(v.id,P.id),d(null)},children:P.name},P.id))})]})]},v.id))]})]})}function mR(){const[r,t]=ee.useState(!1),[i,s]=ee.useState(!1),[l,c]=ee.useState(!1),f=ee.useRef(!1),[d,m]=ee.useState("ge"),p=ee.useRef(!1),[g,_]=ee.useState([]),[x,y]=ee.useState(null),[T,C]=ee.useState([]),M=ee.useCallback(L=>{if(L.buildId&&L.buildId!=="mm63j9ef"){location.reload();return}const I=L.servers.map(b=>({id:b.id,name:b.name,pid:b.pid,active:b.active}));C(I);const F=new Set(L.sessions.map(b=>b.id));_(L.sessions.map(b=>({id:b.id,serverID:b.serverID,name:b.name}))),y(b=>b!==null&&!F.has(b)?null:b);const q=L.servers.find(b=>b.active);if(q){m(q.name);const b=window.location.port;document.title=b?`${q.name} :${b}`:q.name}else m("ge")},[]),v=ee.useCallback(L=>{fetch(`/api/servers/${L}/select`,{method:"POST"}).catch(()=>{})},[]),P=ee.useCallback((L,I)=>{fetch(`/api/sessions/${L}/server/${I}`,{method:"POST"}).catch(()=>{})},[]),U=ee.useCallback(()=>{c(!0),p.current=!0,s(!1),fetch("/api/stop",{method:"POST"}).catch(()=>{})},[]);ee.useEffect(()=>{const L=()=>{p.current||navigator.sendBeacon("/api/stop")};return window.addEventListener("pagehide",L),()=>window.removeEventListener("pagehide",L)},[]);const D=ee.useCallback(L=>{f.current=L,s(!0)},[]);return ee.useEffect(()=>{const L=I=>{if(I.key==="c"&&(I.ctrlKey||I.metaKey)){if(I.preventDefault(),l)return;i&&f.current?U():i||D(!0)}else I.key==="Escape"&&i&&s(!1)};return window.addEventListener("keydown",L),()=>window.removeEventListener("keydown",L)},[i,l,U,D]),Dt.jsxs("div",{className:"app",children:[Dt.jsxs("header",{className:"header",children:[Dt.jsx("h1",{className:"title",children:d}),Dt.jsx("button",{className:"stop-btn",onClick:()=>D(!1),disabled:l,title:"Stop server (Ctrl-C)",children:l?"Stopped":"Stop"}),Dt.jsx("span",{className:`status-dot ${r?"connected":"disconnected"}`}),Dt.jsx("span",{className:"status-text",children:r?"connected":"disconnected"})]}),Dt.jsxs("div",{className:"layout",children:[Dt.jsxs("aside",{className:"sidebar",children:[Dt.jsx(ay,{}),T.length>0&&Dt.jsxs("div",{className:"player-list",children:[Dt.jsx("h2",{className:"player-title",children:"Servers"}),Dt.jsx("div",{className:"player-items",children:T.map(L=>Dt.jsxs("div",{className:"player-row",children:[Dt.jsxs("span",{className:"player-label",style:{cursor:"default"},children:[Dt.jsx("span",{className:`player-dot ${L.active?"active":""}`}),Dt.jsx("span",{children:L.name})]}),Dt.jsxs("span",{className:"server-pid",children:["pid ",L.pid]})]},L.id))})]}),Dt.jsx(pR,{sessions:g,servers:T,selectedSession:x,onSelectSession:y,onSwitchAll:v,onSwitchSession:P}),Dt.jsx(dy,{})]}),Dt.jsx("main",{className:"main",children:Dt.jsx(uy,{onConnectionChange:t,sessionFilter:x,onState:M})}),Dt.jsx("aside",{className:"preview-column",children:Dt.jsx(dR,{selectedSession:x})})]}),i&&Dt.jsx("div",{className:"confirm-overlay",onClick:()=>s(!1),children:Dt.jsxs("div",{className:"confirm-dialog",onClick:L=>L.stopPropagation(),children:[Dt.jsx("p",{className:"confirm-text",children:"Stop the game server?"}),f.current&&Dt.jsx("p",{className:"confirm-hint",children:"Ctrl-C again to confirm"}),Dt.jsxs("div",{className:"confirm-actions",children:[Dt.jsx("button",{className:"confirm-btn confirm-btn-stop",onClick:U,children:"Stop Server"}),Dt.jsx("button",{className:"confirm-btn confirm-btn-cancel",onClick:()=>s(!1),children:"Cancel"})]})]})})]})}iy.createRoot(document.getElementById("root")).render(Dt.jsx(ee.StrictMode,{children:Dt.jsx(mR,{})}));
