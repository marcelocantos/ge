var ay=Object.defineProperty;var sy=(r,t,i)=>t in r?ay(r,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[t]=i;var k0=(r,t,i)=>sy(r,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var ch={exports:{}},zo={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X0;function ry(){if(X0)return zo;X0=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(s,l,c){var f=null;if(c!==void 0&&(f=""+c),l.key!==void 0&&(f=""+l.key),"key"in l){c={};for(var d in l)d!=="key"&&(c[d]=l[d])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:f,ref:l!==void 0?l:null,props:c}}return zo.Fragment=t,zo.jsx=i,zo.jsxs=i,zo}var W0;function oy(){return W0||(W0=1,ch.exports=ry()),ch.exports}var pt=oy(),uh={exports:{}},ge={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var q0;function ly(){if(q0)return ge;q0=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),f=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),x=Symbol.iterator;function y(F){return F===null||typeof F!="object"?null:(F=x&&F[x]||F["@@iterator"],typeof F=="function"?F:null)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,M={};function _(F,$,ft){this.props=F,this.context=$,this.refs=M,this.updater=ft||b}_.prototype.isReactComponent={},_.prototype.setState=function(F,$){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,$,"setState")},_.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function z(){}z.prototype=_.prototype;function U(F,$,ft){this.props=F,this.context=$,this.refs=M,this.updater=ft||b}var N=U.prototype=new z;N.constructor=U,C(N,_.prototype),N.isPureReactComponent=!0;var B=Array.isArray;function L(){}var D={H:null,A:null,T:null,S:null},k=Object.prototype.hasOwnProperty;function T(F,$,ft){var Rt=ft.ref;return{$$typeof:r,type:F,key:$,ref:Rt!==void 0?Rt:null,props:ft}}function w(F,$){return T(F.type,$,F.props)}function V(F){return typeof F=="object"&&F!==null&&F.$$typeof===r}function J(F){var $={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(ft){return $[ft]})}var Y=/\/+/g;function ut(F,$){return typeof F=="object"&&F!==null&&F.key!=null?J(""+F.key):$.toString(36)}function rt(F){switch(F.status){case"fulfilled":return F.value;case"rejected":throw F.reason;default:switch(typeof F.status=="string"?F.then(L,L):(F.status="pending",F.then(function($){F.status==="pending"&&(F.status="fulfilled",F.value=$)},function($){F.status==="pending"&&(F.status="rejected",F.reason=$)})),F.status){case"fulfilled":return F.value;case"rejected":throw F.reason}}throw F}function I(F,$,ft,Rt,Xt){var it=typeof F;(it==="undefined"||it==="boolean")&&(F=null);var ot=!1;if(F===null)ot=!0;else switch(it){case"bigint":case"string":case"number":ot=!0;break;case"object":switch(F.$$typeof){case r:case t:ot=!0;break;case g:return ot=F._init,I(ot(F._payload),$,ft,Rt,Xt)}}if(ot)return Xt=Xt(F),ot=Rt===""?"."+ut(F,0):Rt,B(Xt)?(ft="",ot!=null&&(ft=ot.replace(Y,"$&/")+"/"),I(Xt,$,ft,"",function(It){return It})):Xt!=null&&(V(Xt)&&(Xt=w(Xt,ft+(Xt.key==null||F&&F.key===Xt.key?"":(""+Xt.key).replace(Y,"$&/")+"/")+ot)),$.push(Xt)),1;ot=0;var Ut=Rt===""?".":Rt+":";if(B(F))for(var Vt=0;Vt<F.length;Vt++)Rt=F[Vt],it=Ut+ut(Rt,Vt),ot+=I(Rt,$,ft,it,Xt);else if(Vt=y(F),typeof Vt=="function")for(F=Vt.call(F),Vt=0;!(Rt=F.next()).done;)Rt=Rt.value,it=Ut+ut(Rt,Vt++),ot+=I(Rt,$,ft,it,Xt);else if(it==="object"){if(typeof F.then=="function")return I(rt(F),$,ft,Rt,Xt);throw $=String(F),Error("Objects are not valid as a React child (found: "+($==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":$)+"). If you meant to render a collection of children, use an array instead.")}return ot}function H(F,$,ft){if(F==null)return F;var Rt=[],Xt=0;return I(F,Rt,"","",function(it){return $.call(ft,it,Xt++)}),Rt}function tt(F){if(F._status===-1){var $=F._result;$=$(),$.then(function(ft){(F._status===0||F._status===-1)&&(F._status=1,F._result=ft)},function(ft){(F._status===0||F._status===-1)&&(F._status=2,F._result=ft)}),F._status===-1&&(F._status=0,F._result=$)}if(F._status===1)return F._result.default;throw F._result}var bt=typeof reportError=="function"?reportError:function(F){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var $=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof F=="object"&&F!==null&&typeof F.message=="string"?String(F.message):String(F),error:F});if(!window.dispatchEvent($))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",F);return}console.error(F)},Mt={map:H,forEach:function(F,$,ft){H(F,function(){$.apply(this,arguments)},ft)},count:function(F){var $=0;return H(F,function(){$++}),$},toArray:function(F){return H(F,function($){return $})||[]},only:function(F){if(!V(F))throw Error("React.Children.only expected to receive a single React element child.");return F}};return ge.Activity=v,ge.Children=Mt,ge.Component=_,ge.Fragment=i,ge.Profiler=l,ge.PureComponent=U,ge.StrictMode=s,ge.Suspense=m,ge.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=D,ge.__COMPILER_RUNTIME={__proto__:null,c:function(F){return D.H.useMemoCache(F)}},ge.cache=function(F){return function(){return F.apply(null,arguments)}},ge.cacheSignal=function(){return null},ge.cloneElement=function(F,$,ft){if(F==null)throw Error("The argument must be a React element, but you passed "+F+".");var Rt=C({},F.props),Xt=F.key;if($!=null)for(it in $.key!==void 0&&(Xt=""+$.key),$)!k.call($,it)||it==="key"||it==="__self"||it==="__source"||it==="ref"&&$.ref===void 0||(Rt[it]=$[it]);var it=arguments.length-2;if(it===1)Rt.children=ft;else if(1<it){for(var ot=Array(it),Ut=0;Ut<it;Ut++)ot[Ut]=arguments[Ut+2];Rt.children=ot}return T(F.type,Xt,Rt)},ge.createContext=function(F){return F={$$typeof:f,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null},F.Provider=F,F.Consumer={$$typeof:c,_context:F},F},ge.createElement=function(F,$,ft){var Rt,Xt={},it=null;if($!=null)for(Rt in $.key!==void 0&&(it=""+$.key),$)k.call($,Rt)&&Rt!=="key"&&Rt!=="__self"&&Rt!=="__source"&&(Xt[Rt]=$[Rt]);var ot=arguments.length-2;if(ot===1)Xt.children=ft;else if(1<ot){for(var Ut=Array(ot),Vt=0;Vt<ot;Vt++)Ut[Vt]=arguments[Vt+2];Xt.children=Ut}if(F&&F.defaultProps)for(Rt in ot=F.defaultProps,ot)Xt[Rt]===void 0&&(Xt[Rt]=ot[Rt]);return T(F,it,Xt)},ge.createRef=function(){return{current:null}},ge.forwardRef=function(F){return{$$typeof:d,render:F}},ge.isValidElement=V,ge.lazy=function(F){return{$$typeof:g,_payload:{_status:-1,_result:F},_init:tt}},ge.memo=function(F,$){return{$$typeof:p,type:F,compare:$===void 0?null:$}},ge.startTransition=function(F){var $=D.T,ft={};D.T=ft;try{var Rt=F(),Xt=D.S;Xt!==null&&Xt(ft,Rt),typeof Rt=="object"&&Rt!==null&&typeof Rt.then=="function"&&Rt.then(L,bt)}catch(it){bt(it)}finally{$!==null&&ft.types!==null&&($.types=ft.types),D.T=$}},ge.unstable_useCacheRefresh=function(){return D.H.useCacheRefresh()},ge.use=function(F){return D.H.use(F)},ge.useActionState=function(F,$,ft){return D.H.useActionState(F,$,ft)},ge.useCallback=function(F,$){return D.H.useCallback(F,$)},ge.useContext=function(F){return D.H.useContext(F)},ge.useDebugValue=function(){},ge.useDeferredValue=function(F,$){return D.H.useDeferredValue(F,$)},ge.useEffect=function(F,$){return D.H.useEffect(F,$)},ge.useEffectEvent=function(F){return D.H.useEffectEvent(F)},ge.useId=function(){return D.H.useId()},ge.useImperativeHandle=function(F,$,ft){return D.H.useImperativeHandle(F,$,ft)},ge.useInsertionEffect=function(F,$){return D.H.useInsertionEffect(F,$)},ge.useLayoutEffect=function(F,$){return D.H.useLayoutEffect(F,$)},ge.useMemo=function(F,$){return D.H.useMemo(F,$)},ge.useOptimistic=function(F,$){return D.H.useOptimistic(F,$)},ge.useReducer=function(F,$,ft){return D.H.useReducer(F,$,ft)},ge.useRef=function(F){return D.H.useRef(F)},ge.useState=function(F){return D.H.useState(F)},ge.useSyncExternalStore=function(F,$,ft){return D.H.useSyncExternalStore(F,$,ft)},ge.useTransition=function(){return D.H.useTransition()},ge.version="19.2.4",ge}var Y0;function Yd(){return Y0||(Y0=1,uh.exports=ly()),uh.exports}var Ct=Yd(),fh={exports:{}},Fo={},hh={exports:{}},dh={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var j0;function cy(){return j0||(j0=1,(function(r){function t(I,H){var tt=I.length;I.push(H);t:for(;0<tt;){var bt=tt-1>>>1,Mt=I[bt];if(0<l(Mt,H))I[bt]=H,I[tt]=Mt,tt=bt;else break t}}function i(I){return I.length===0?null:I[0]}function s(I){if(I.length===0)return null;var H=I[0],tt=I.pop();if(tt!==H){I[0]=tt;t:for(var bt=0,Mt=I.length,F=Mt>>>1;bt<F;){var $=2*(bt+1)-1,ft=I[$],Rt=$+1,Xt=I[Rt];if(0>l(ft,tt))Rt<Mt&&0>l(Xt,ft)?(I[bt]=Xt,I[Rt]=tt,bt=Rt):(I[bt]=ft,I[$]=tt,bt=$);else if(Rt<Mt&&0>l(Xt,tt))I[bt]=Xt,I[Rt]=tt,bt=Rt;else break t}}return H}function l(I,H){var tt=I.sortIndex-H.sortIndex;return tt!==0?tt:I.id-H.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var f=Date,d=f.now();r.unstable_now=function(){return f.now()-d}}var m=[],p=[],g=1,v=null,x=3,y=!1,b=!1,C=!1,M=!1,_=typeof setTimeout=="function"?setTimeout:null,z=typeof clearTimeout=="function"?clearTimeout:null,U=typeof setImmediate<"u"?setImmediate:null;function N(I){for(var H=i(p);H!==null;){if(H.callback===null)s(p);else if(H.startTime<=I)s(p),H.sortIndex=H.expirationTime,t(m,H);else break;H=i(p)}}function B(I){if(C=!1,N(I),!b)if(i(m)!==null)b=!0,L||(L=!0,J());else{var H=i(p);H!==null&&rt(B,H.startTime-I)}}var L=!1,D=-1,k=5,T=-1;function w(){return M?!0:!(r.unstable_now()-T<k)}function V(){if(M=!1,L){var I=r.unstable_now();T=I;var H=!0;try{t:{b=!1,C&&(C=!1,z(D),D=-1),y=!0;var tt=x;try{e:{for(N(I),v=i(m);v!==null&&!(v.expirationTime>I&&w());){var bt=v.callback;if(typeof bt=="function"){v.callback=null,x=v.priorityLevel;var Mt=bt(v.expirationTime<=I);if(I=r.unstable_now(),typeof Mt=="function"){v.callback=Mt,N(I),H=!0;break e}v===i(m)&&s(m),N(I)}else s(m);v=i(m)}if(v!==null)H=!0;else{var F=i(p);F!==null&&rt(B,F.startTime-I),H=!1}}break t}finally{v=null,x=tt,y=!1}H=void 0}}finally{H?J():L=!1}}}var J;if(typeof U=="function")J=function(){U(V)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,ut=Y.port2;Y.port1.onmessage=V,J=function(){ut.postMessage(null)}}else J=function(){_(V,0)};function rt(I,H){D=_(function(){I(r.unstable_now())},H)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(I){I.callback=null},r.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<I?Math.floor(1e3/I):5},r.unstable_getCurrentPriorityLevel=function(){return x},r.unstable_next=function(I){switch(x){case 1:case 2:case 3:var H=3;break;default:H=x}var tt=x;x=H;try{return I()}finally{x=tt}},r.unstable_requestPaint=function(){M=!0},r.unstable_runWithPriority=function(I,H){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var tt=x;x=I;try{return H()}finally{x=tt}},r.unstable_scheduleCallback=function(I,H,tt){var bt=r.unstable_now();switch(typeof tt=="object"&&tt!==null?(tt=tt.delay,tt=typeof tt=="number"&&0<tt?bt+tt:bt):tt=bt,I){case 1:var Mt=-1;break;case 2:Mt=250;break;case 5:Mt=1073741823;break;case 4:Mt=1e4;break;default:Mt=5e3}return Mt=tt+Mt,I={id:g++,callback:H,priorityLevel:I,startTime:tt,expirationTime:Mt,sortIndex:-1},tt>bt?(I.sortIndex=tt,t(p,I),i(m)===null&&I===i(p)&&(C?(z(D),D=-1):C=!0,rt(B,tt-bt))):(I.sortIndex=Mt,t(m,I),b||y||(b=!0,L||(L=!0,J()))),I},r.unstable_shouldYield=w,r.unstable_wrapCallback=function(I){var H=x;return function(){var tt=x;x=H;try{return I.apply(this,arguments)}finally{x=tt}}}})(dh)),dh}var Z0;function uy(){return Z0||(Z0=1,hh.exports=cy()),hh.exports}var ph={exports:{}},Ln={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K0;function fy(){if(K0)return Ln;K0=1;var r=Yd();function t(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)p+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,p,g){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:p,implementation:g}}var f=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Ln.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Ln.createPortal=function(m,p){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(t(299));return c(m,p,null,g)},Ln.flushSync=function(m){var p=f.T,g=s.p;try{if(f.T=null,s.p=2,m)return m()}finally{f.T=p,s.p=g,s.d.f()}},Ln.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(m,p))},Ln.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Ln.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var g=p.as,v=d(g,p.crossOrigin),x=typeof p.integrity=="string"?p.integrity:void 0,y=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;g==="style"?s.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:v,integrity:x,fetchPriority:y}):g==="script"&&s.d.X(m,{crossOrigin:v,integrity:x,fetchPriority:y,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Ln.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var g=d(p.as,p.crossOrigin);s.d.M(m,{crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(m)},Ln.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var g=p.as,v=d(g,p.crossOrigin);s.d.L(m,g,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Ln.preloadModule=function(m,p){if(typeof m=="string")if(p){var g=d(p.as,p.crossOrigin);s.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(m)},Ln.requestFormReset=function(m){s.d.r(m)},Ln.unstable_batchedUpdates=function(m,p){return m(p)},Ln.useFormState=function(m,p,g){return f.H.useFormState(m,p,g)},Ln.useFormStatus=function(){return f.H.useHostTransitionStatus()},Ln.version="19.2.4",Ln}var J0;function hy(){if(J0)return ph.exports;J0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),ph.exports=fy(),ph.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Q0;function dy(){if(Q0)return Fo;Q0=1;var r=uy(),t=Yd(),i=hy();function s(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function f(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(c(e)!==e)throw Error(s(188))}function p(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(s(188));return n!==e?null:e}for(var a=e,o=n;;){var u=a.return;if(u===null)break;var h=u.alternate;if(h===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===h.child){for(h=u.child;h;){if(h===a)return m(u),e;if(h===o)return m(u),n;h=h.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=h;else{for(var S=!1,A=u.child;A;){if(A===a){S=!0,a=u,o=h;break}if(A===o){S=!0,o=u,a=h;break}A=A.sibling}if(!S){for(A=h.child;A;){if(A===a){S=!0,a=h,o=u;break}if(A===o){S=!0,o=h,a=u;break}A=A.sibling}if(!S)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:n}function g(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=g(e),n!==null)return n;e=e.sibling}return null}var v=Object.assign,x=Symbol.for("react.element"),y=Symbol.for("react.transitional.element"),b=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),M=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),z=Symbol.for("react.consumer"),U=Symbol.for("react.context"),N=Symbol.for("react.forward_ref"),B=Symbol.for("react.suspense"),L=Symbol.for("react.suspense_list"),D=Symbol.for("react.memo"),k=Symbol.for("react.lazy"),T=Symbol.for("react.activity"),w=Symbol.for("react.memo_cache_sentinel"),V=Symbol.iterator;function J(e){return e===null||typeof e!="object"?null:(e=V&&e[V]||e["@@iterator"],typeof e=="function"?e:null)}var Y=Symbol.for("react.client.reference");function ut(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Y?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case C:return"Fragment";case _:return"Profiler";case M:return"StrictMode";case B:return"Suspense";case L:return"SuspenseList";case T:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case b:return"Portal";case U:return e.displayName||"Context";case z:return(e._context.displayName||"Context")+".Consumer";case N:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case D:return n=e.displayName||null,n!==null?n:ut(e.type)||"Memo";case k:n=e._payload,e=e._init;try{return ut(e(n))}catch{}}return null}var rt=Array.isArray,I=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,tt={pending:!1,data:null,method:null,action:null},bt=[],Mt=-1;function F(e){return{current:e}}function $(e){0>Mt||(e.current=bt[Mt],bt[Mt]=null,Mt--)}function ft(e,n){Mt++,bt[Mt]=e.current,e.current=n}var Rt=F(null),Xt=F(null),it=F(null),ot=F(null);function Ut(e,n){switch(ft(it,n),ft(Xt,e),ft(Rt,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?h0(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=h0(n),e=d0(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}$(Rt),ft(Rt,e)}function Vt(){$(Rt),$(Xt),$(it)}function It(e){e.memoizedState!==null&&ft(ot,e);var n=Rt.current,a=d0(n,e.type);n!==a&&(ft(Xt,e),ft(Rt,a))}function ve(e){Xt.current===e&&($(Rt),$(Xt)),ot.current===e&&($(ot),No._currentValue=tt)}var me,fe;function xt(e){if(me===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);me=n&&n[1]||"",fe=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+me+e+fe}var gt=!1;function vt(e,n){if(!e||gt)return"";gt=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var St=function(){throw Error()};if(Object.defineProperty(St.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(St,[])}catch(ct){var st=ct}Reflect.construct(e,[],St)}else{try{St.call()}catch(ct){st=ct}e.call(St.prototype)}}else{try{throw Error()}catch(ct){st=ct}(St=e())&&typeof St.catch=="function"&&St.catch(function(){})}}catch(ct){if(ct&&st&&typeof ct.stack=="string")return[ct.stack,st.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var h=o.DetermineComponentFrameRoot(),S=h[0],A=h[1];if(S&&A){var G=S.split(`
`),nt=A.split(`
`);for(u=o=0;o<G.length&&!G[o].includes("DetermineComponentFrameRoot");)o++;for(;u<nt.length&&!nt[u].includes("DetermineComponentFrameRoot");)u++;if(o===G.length||u===nt.length)for(o=G.length-1,u=nt.length-1;1<=o&&0<=u&&G[o]!==nt[u];)u--;for(;1<=o&&0<=u;o--,u--)if(G[o]!==nt[u]){if(o!==1||u!==1)do if(o--,u--,0>u||G[o]!==nt[u]){var mt=`
`+G[o].replace(" at new "," at ");return e.displayName&&mt.includes("<anonymous>")&&(mt=mt.replace("<anonymous>",e.displayName)),mt}while(1<=o&&0<=u);break}}}finally{gt=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?xt(a):""}function Nt(e,n){switch(e.tag){case 26:case 27:case 5:return xt(e.type);case 16:return xt("Lazy");case 13:return e.child!==n&&n!==null?xt("Suspense Fallback"):xt("Suspense");case 19:return xt("SuspenseList");case 0:case 15:return vt(e.type,!1);case 11:return vt(e.type.render,!1);case 1:return vt(e.type,!0);case 31:return xt("Activity");default:return""}}function P(e){try{var n="",a=null;do n+=Nt(e,a),a=e,e=e.return;while(e);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Qt=Object.prototype.hasOwnProperty,Ft=r.unstable_scheduleCallback,ae=r.unstable_cancelCallback,Lt=r.unstable_shouldYield,O=r.unstable_requestPaint,E=r.unstable_now,q=r.unstable_getCurrentPriorityLevel,ht=r.unstable_ImmediatePriority,Et=r.unstable_UserBlockingPriority,dt=r.unstable_NormalPriority,te=r.unstable_LowPriority,Pt=r.unstable_IdlePriority,$t=r.log,le=r.unstable_setDisableYieldValue,Tt=null,wt=null;function jt(e){if(typeof $t=="function"&&le(e),wt&&typeof wt.setStrictMode=="function")try{wt.setStrictMode(Tt,e)}catch{}}var Wt=Math.clz32?Math.clz32:W,zt=Math.log,xe=Math.LN2;function W(e){return e>>>=0,e===0?32:31-(zt(e)/xe|0)|0}var Ht=256,Dt=262144,qt=4194304;function At(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function yt(e,n,a){var o=e.pendingLanes;if(o===0)return 0;var u=0,h=e.suspendedLanes,S=e.pingedLanes;e=e.warmLanes;var A=o&134217727;return A!==0?(o=A&~h,o!==0?u=At(o):(S&=A,S!==0?u=At(S):a||(a=A&~e,a!==0&&(u=At(a))))):(A=o&~h,A!==0?u=At(A):S!==0?u=At(S):a||(a=o&~e,a!==0&&(u=At(a)))),u===0?0:n!==0&&n!==u&&(n&h)===0&&(h=u&-u,a=n&-n,h>=a||h===32&&(a&4194048)!==0)?n:u}function Ot(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function he(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ie(){var e=qt;return qt<<=1,(qt&62914560)===0&&(qt=4194304),e}function we(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function Nn(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gi(e,n,a,o,u,h){var S=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var A=e.entanglements,G=e.expirationTimes,nt=e.hiddenUpdates;for(a=S&~a;0<a;){var mt=31-Wt(a),St=1<<mt;A[mt]=0,G[mt]=-1;var st=nt[mt];if(st!==null)for(nt[mt]=null,mt=0;mt<st.length;mt++){var ct=st[mt];ct!==null&&(ct.lane&=-536870913)}a&=~St}o!==0&&fl(e,o,0),h!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=h&~(S&~n))}function fl(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var o=31-Wt(n);e.entangledLanes|=n,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function kr(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var o=31-Wt(a),u=1<<o;u&n|e[o]&n&&(e[o]|=n),a&=~u}}function Os(e,n){var a=n&-n;return a=(a&42)!==0?1:Xr(a),(a&(e.suspendedLanes|n))!==0?0:a}function Xr(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ps(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Wr(){var e=H.p;return e!==0?e:(e=window.event,e===void 0?32:z0(e.type))}function wi(e,n){var a=H.p;try{return H.p=e,n()}finally{H.p=a}}var ai=Math.random().toString(36).slice(2),on="__reactFiber$"+ai,Sn="__reactProps$"+ai,vi="__reactContainer$"+ai,zs="__reactEvents$"+ai,Fs="__reactListeners$"+ai,hl="__reactHandles$"+ai,qr="__reactResources$"+ai,is="__reactMarker$"+ai;function Yr(e){delete e[on],delete e[Sn],delete e[zs],delete e[Fs],delete e[hl]}function ya(e){var n=e[on];if(n)return n;for(var a=e.parentNode;a;){if(n=a[vi]||a[on]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=S0(e);e!==null;){if(a=e[on])return a;e=S0(e)}return n}e=a,a=e.parentNode}return null}function Ma(e){if(e=e[on]||e[vi]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function as(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(s(33))}function Ea(e){var n=e[qr];return n||(n=e[qr]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function R(e){e[is]=!0}var j=new Set,lt={};function at(e,n){Q(e,n),Q(e+"Capture",n)}function Q(e,n){for(lt[e]=n,e=0;e<n.length;e++)j.add(n[e])}var Bt=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Zt={},Gt={};function Kt(e){return Qt.call(Gt,e)?!0:Qt.call(Zt,e)?!1:Bt.test(e)?Gt[e]=!0:(Zt[e]=!0,!1)}function ee(e,n,a){if(Kt(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function oe(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function ne(e,n,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+o)}}function ce(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Oe(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Je(e,n,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,h=o.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(S){a=""+S,h.call(this,S)}}),Object.defineProperty(e,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(S){a=""+S},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function je(e){if(!e._valueTracker){var n=Oe(e)?"checked":"value";e._valueTracker=Je(e,n,""+e[n])}}function Be(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return e&&(o=Oe(e)?e.checked?"true":"false":e.value),e=o,e!==a?(n.setValue(e),!0):!1}function se(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Pe=/[\n"\\]/g;function de(e){return e.replace(Pe,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function yn(e,n,a,o,u,h,S,A){e.name="",S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"?e.type=S:e.removeAttribute("type"),n!=null?S==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+ce(n)):e.value!==""+ce(n)&&(e.value=""+ce(n)):S!=="submit"&&S!=="reset"||e.removeAttribute("value"),n!=null?Mn(e,S,ce(n)):a!=null?Mn(e,S,ce(a)):o!=null&&e.removeAttribute("value"),u==null&&h!=null&&(e.defaultChecked=!!h),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?e.name=""+ce(A):e.removeAttribute("name")}function qi(e,n,a,o,u,h,S,A){if(h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"&&(e.type=h),n!=null||a!=null){if(!(h!=="submit"&&h!=="reset"||n!=null)){je(e);return}a=a!=null?""+ce(a):"",n=n!=null?""+ce(n):a,A||n===e.value||(e.value=n),e.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=A?e.checked:!!o,e.defaultChecked=!!o,S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"&&(e.name=S),je(e)}function Mn(e,n,a){n==="number"&&se(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function si(e,n,a,o){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&o&&(e[a].defaultSelected=!0)}else{for(a=""+ce(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,o&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function He(e,n,a){if(n!=null&&(n=""+ce(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+ce(a):""}function En(e,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(rt(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=ce(n),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),je(e)}function pn(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var bn=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Tn(e,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":o?e.setProperty(n,a):typeof a!="number"||a===0||bn.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Bs(e,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&Tn(e,u,o)}else for(var h in n)n.hasOwnProperty(h)&&Tn(e,h,n[h])}function _i(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var tx=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),ex=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function dl(e){return ex.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Yi(){}var su=null;function ru(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Is=null,Hs=null;function fp(e){var n=Ma(e);if(n&&(e=n.stateNode)){var a=e[Sn]||null;t:switch(e=n.stateNode,n.type){case"input":if(yn(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+de(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==e&&o.form===e.form){var u=o[Sn]||null;if(!u)throw Error(s(90));yn(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===e.form&&Be(o)}break t;case"textarea":He(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&si(e,!!a.multiple,n,!1)}}}var ou=!1;function hp(e,n,a){if(ou)return e(n,a);ou=!0;try{var o=e(n);return o}finally{if(ou=!1,(Is!==null||Hs!==null)&&(tc(),Is&&(n=Is,e=Hs,Hs=Is=null,fp(n),e)))for(n=0;n<e.length;n++)fp(e[n])}}function jr(e,n){var a=e.stateNode;if(a===null)return null;var o=a[Sn]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var ji=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),lu=!1;if(ji)try{var Zr={};Object.defineProperty(Zr,"passive",{get:function(){lu=!0}}),window.addEventListener("test",Zr,Zr),window.removeEventListener("test",Zr,Zr)}catch{lu=!1}var ba=null,cu=null,pl=null;function dp(){if(pl)return pl;var e,n=cu,a=n.length,o,u="value"in ba?ba.value:ba.textContent,h=u.length;for(e=0;e<a&&n[e]===u[e];e++);var S=a-e;for(o=1;o<=S&&n[a-o]===u[h-o];o++);return pl=u.slice(e,1<o?1-o:void 0)}function ml(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function gl(){return!0}function pp(){return!1}function In(e){function n(a,o,u,h,S){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=h,this.target=S,this.currentTarget=null;for(var A in e)e.hasOwnProperty(A)&&(a=e[A],this[A]=a?a(h):h[A]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?gl:pp,this.isPropagationStopped=pp,this}return v(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=gl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=gl)},persist:function(){},isPersistent:gl}),n}var ss={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},vl=In(ss),Kr=v({},ss,{view:0,detail:0}),nx=In(Kr),uu,fu,Jr,_l=v({},Kr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:du,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Jr&&(Jr&&e.type==="mousemove"?(uu=e.screenX-Jr.screenX,fu=e.screenY-Jr.screenY):fu=uu=0,Jr=e),uu)},movementY:function(e){return"movementY"in e?e.movementY:fu}}),mp=In(_l),ix=v({},_l,{dataTransfer:0}),ax=In(ix),sx=v({},Kr,{relatedTarget:0}),hu=In(sx),rx=v({},ss,{animationName:0,elapsedTime:0,pseudoElement:0}),ox=In(rx),lx=v({},ss,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),cx=In(lx),ux=v({},ss,{data:0}),gp=In(ux),fx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function px(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=dx[e])?!!n[e]:!1}function du(){return px}var mx=v({},Kr,{key:function(e){if(e.key){var n=fx[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=ml(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hx[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:du,charCode:function(e){return e.type==="keypress"?ml(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ml(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gx=In(mx),vx=v({},_l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),vp=In(vx),_x=v({},Kr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:du}),xx=In(_x),Sx=v({},ss,{propertyName:0,elapsedTime:0,pseudoElement:0}),yx=In(Sx),Mx=v({},_l,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ex=In(Mx),bx=v({},ss,{newState:0,oldState:0}),Tx=In(bx),Ax=[9,13,27,32],pu=ji&&"CompositionEvent"in window,Qr=null;ji&&"documentMode"in document&&(Qr=document.documentMode);var Rx=ji&&"TextEvent"in window&&!Qr,_p=ji&&(!pu||Qr&&8<Qr&&11>=Qr),xp=" ",Sp=!1;function yp(e,n){switch(e){case"keyup":return Ax.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Vs=!1;function Cx(e,n){switch(e){case"compositionend":return Mp(n);case"keypress":return n.which!==32?null:(Sp=!0,xp);case"textInput":return e=n.data,e===xp&&Sp?null:e;default:return null}}function wx(e,n){if(Vs)return e==="compositionend"||!pu&&yp(e,n)?(e=dp(),pl=cu=ba=null,Vs=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return _p&&n.locale!=="ko"?null:n.data;default:return null}}var Dx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ep(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Dx[e.type]:n==="textarea"}function bp(e,n,a,o){Is?Hs?Hs.push(o):Hs=[o]:Is=o,n=oc(n,"onChange"),0<n.length&&(a=new vl("onChange","change",null,a,o),e.push({event:a,listeners:n}))}var $r=null,to=null;function Ux(e){r0(e,0)}function xl(e){var n=as(e);if(Be(n))return e}function Tp(e,n){if(e==="change")return n}var Ap=!1;if(ji){var mu;if(ji){var gu="oninput"in document;if(!gu){var Rp=document.createElement("div");Rp.setAttribute("oninput","return;"),gu=typeof Rp.oninput=="function"}mu=gu}else mu=!1;Ap=mu&&(!document.documentMode||9<document.documentMode)}function Cp(){$r&&($r.detachEvent("onpropertychange",wp),to=$r=null)}function wp(e){if(e.propertyName==="value"&&xl(to)){var n=[];bp(n,to,e,ru(e)),hp(Ux,n)}}function Nx(e,n,a){e==="focusin"?(Cp(),$r=n,to=a,$r.attachEvent("onpropertychange",wp)):e==="focusout"&&Cp()}function Lx(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return xl(to)}function Ox(e,n){if(e==="click")return xl(n)}function Px(e,n){if(e==="input"||e==="change")return xl(n)}function zx(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var jn=typeof Object.is=="function"?Object.is:zx;function eo(e,n){if(jn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!Qt.call(n,u)||!jn(e[u],n[u]))return!1}return!0}function Dp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Up(e,n){var a=Dp(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=n&&o>=n)return{node:a,offset:n-e};e=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=Dp(a)}}function Np(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Np(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Lp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=se(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=se(e.document)}return n}function vu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var Fx=ji&&"documentMode"in document&&11>=document.documentMode,Gs=null,_u=null,no=null,xu=!1;function Op(e,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;xu||Gs==null||Gs!==se(o)||(o=Gs,"selectionStart"in o&&vu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),no&&eo(no,o)||(no=o,o=oc(_u,"onSelect"),0<o.length&&(n=new vl("onSelect","select",null,n,a),e.push({event:n,listeners:o}),n.target=Gs)))}function rs(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var ks={animationend:rs("Animation","AnimationEnd"),animationiteration:rs("Animation","AnimationIteration"),animationstart:rs("Animation","AnimationStart"),transitionrun:rs("Transition","TransitionRun"),transitionstart:rs("Transition","TransitionStart"),transitioncancel:rs("Transition","TransitionCancel"),transitionend:rs("Transition","TransitionEnd")},Su={},Pp={};ji&&(Pp=document.createElement("div").style,"AnimationEvent"in window||(delete ks.animationend.animation,delete ks.animationiteration.animation,delete ks.animationstart.animation),"TransitionEvent"in window||delete ks.transitionend.transition);function os(e){if(Su[e])return Su[e];if(!ks[e])return e;var n=ks[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in Pp)return Su[e]=n[a];return e}var zp=os("animationend"),Fp=os("animationiteration"),Bp=os("animationstart"),Bx=os("transitionrun"),Ix=os("transitionstart"),Hx=os("transitioncancel"),Ip=os("transitionend"),Hp=new Map,yu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");yu.push("scrollEnd");function xi(e,n){Hp.set(e,n),at(n,[e])}var Sl=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ri=[],Xs=0,Mu=0;function yl(){for(var e=Xs,n=Mu=Xs=0;n<e;){var a=ri[n];ri[n++]=null;var o=ri[n];ri[n++]=null;var u=ri[n];ri[n++]=null;var h=ri[n];if(ri[n++]=null,o!==null&&u!==null){var S=o.pending;S===null?u.next=u:(u.next=S.next,S.next=u),o.pending=u}h!==0&&Vp(a,u,h)}}function Ml(e,n,a,o){ri[Xs++]=e,ri[Xs++]=n,ri[Xs++]=a,ri[Xs++]=o,Mu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Eu(e,n,a,o){return Ml(e,n,a,o),El(e)}function ls(e,n){return Ml(e,null,null,n),El(e)}function Vp(e,n,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var u=!1,h=e.return;h!==null;)h.childLanes|=a,o=h.alternate,o!==null&&(o.childLanes|=a),h.tag===22&&(e=h.stateNode,e===null||e._visibility&1||(u=!0)),e=h,h=h.return;return e.tag===3?(h=e.stateNode,u&&n!==null&&(u=31-Wt(a),e=h.hiddenUpdates,o=e[u],o===null?e[u]=[n]:o.push(n),n.lane=a|536870912),h):null}function El(e){if(50<To)throw To=0,Lf=null,Error(s(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Ws={};function Vx(e,n,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Zn(e,n,a,o){return new Vx(e,n,a,o)}function bu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Zi(e,n){var a=e.alternate;return a===null?(a=Zn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Gp(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function bl(e,n,a,o,u,h){var S=0;if(o=e,typeof e=="function")bu(e)&&(S=1);else if(typeof e=="string")S=qS(e,a,Rt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case T:return e=Zn(31,a,n,u),e.elementType=T,e.lanes=h,e;case C:return cs(a.children,u,h,n);case M:S=8,u|=24;break;case _:return e=Zn(12,a,n,u|2),e.elementType=_,e.lanes=h,e;case B:return e=Zn(13,a,n,u),e.elementType=B,e.lanes=h,e;case L:return e=Zn(19,a,n,u),e.elementType=L,e.lanes=h,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case U:S=10;break t;case z:S=9;break t;case N:S=11;break t;case D:S=14;break t;case k:S=16,o=null;break t}S=29,a=Error(s(130,e===null?"null":typeof e,"")),o=null}return n=Zn(S,a,n,u),n.elementType=e,n.type=o,n.lanes=h,n}function cs(e,n,a,o){return e=Zn(7,e,o,n),e.lanes=a,e}function Tu(e,n,a){return e=Zn(6,e,null,n),e.lanes=a,e}function kp(e){var n=Zn(18,null,null,0);return n.stateNode=e,n}function Au(e,n,a){return n=Zn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Xp=new WeakMap;function oi(e,n){if(typeof e=="object"&&e!==null){var a=Xp.get(e);return a!==void 0?a:(n={value:e,source:n,stack:P(n)},Xp.set(e,n),n)}return{value:e,source:n,stack:P(n)}}var qs=[],Ys=0,Tl=null,io=0,li=[],ci=0,Ta=null,Di=1,Ui="";function Ki(e,n){qs[Ys++]=io,qs[Ys++]=Tl,Tl=e,io=n}function Wp(e,n,a){li[ci++]=Di,li[ci++]=Ui,li[ci++]=Ta,Ta=e;var o=Di;e=Ui;var u=32-Wt(o)-1;o&=~(1<<u),a+=1;var h=32-Wt(n)+u;if(30<h){var S=u-u%5;h=(o&(1<<S)-1).toString(32),o>>=S,u-=S,Di=1<<32-Wt(n)+u|a<<u|o,Ui=h+e}else Di=1<<h|a<<u|o,Ui=e}function Ru(e){e.return!==null&&(Ki(e,1),Wp(e,1,0))}function Cu(e){for(;e===Tl;)Tl=qs[--Ys],qs[Ys]=null,io=qs[--Ys],qs[Ys]=null;for(;e===Ta;)Ta=li[--ci],li[ci]=null,Ui=li[--ci],li[ci]=null,Di=li[--ci],li[ci]=null}function qp(e,n){li[ci++]=Di,li[ci++]=Ui,li[ci++]=Ta,Di=n.id,Ui=n.overflow,Ta=e}var An=null,Ze=null,Ce=!1,Aa=null,ui=!1,wu=Error(s(519));function Ra(e){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ao(oi(n,e)),wu}function Yp(e){var n=e.stateNode,a=e.type,o=e.memoizedProps;switch(n[on]=e,n[Sn]=o,a){case"dialog":be("cancel",n),be("close",n);break;case"iframe":case"object":case"embed":be("load",n);break;case"video":case"audio":for(a=0;a<Ro.length;a++)be(Ro[a],n);break;case"source":be("error",n);break;case"img":case"image":case"link":be("error",n),be("load",n);break;case"details":be("toggle",n);break;case"input":be("invalid",n),qi(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":be("invalid",n);break;case"textarea":be("invalid",n),En(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||u0(n.textContent,a)?(o.popover!=null&&(be("beforetoggle",n),be("toggle",n)),o.onScroll!=null&&be("scroll",n),o.onScrollEnd!=null&&be("scrollend",n),o.onClick!=null&&(n.onclick=Yi),n=!0):n=!1,n||Ra(e,!0)}function jp(e){for(An=e.return;An;)switch(An.tag){case 5:case 31:case 13:ui=!1;return;case 27:case 3:ui=!0;return;default:An=An.return}}function js(e){if(e!==An)return!1;if(!Ce)return jp(e),Ce=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||jf(e.type,e.memoizedProps)),a=!a),a&&Ze&&Ra(e),jp(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=x0(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));Ze=x0(e)}else n===27?(n=Ze,Va(e.type)?(e=$f,$f=null,Ze=e):Ze=n):Ze=An?hi(e.stateNode.nextSibling):null;return!0}function us(){Ze=An=null,Ce=!1}function Du(){var e=Aa;return e!==null&&(kn===null?kn=e:kn.push.apply(kn,e),Aa=null),e}function ao(e){Aa===null?Aa=[e]:Aa.push(e)}var Uu=F(null),fs=null,Ji=null;function Ca(e,n,a){ft(Uu,n._currentValue),n._currentValue=a}function Qi(e){e._currentValue=Uu.current,$(Uu)}function Nu(e,n,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),e===a)break;e=e.return}}function Lu(e,n,a,o){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var h=u.dependencies;if(h!==null){var S=u.child;h=h.firstContext;t:for(;h!==null;){var A=h;h=u;for(var G=0;G<n.length;G++)if(A.context===n[G]){h.lanes|=a,A=h.alternate,A!==null&&(A.lanes|=a),Nu(h.return,a,e),o||(S=null);break t}h=A.next}}else if(u.tag===18){if(S=u.return,S===null)throw Error(s(341));S.lanes|=a,h=S.alternate,h!==null&&(h.lanes|=a),Nu(S,a,e),S=null}else S=u.child;if(S!==null)S.return=u;else for(S=u;S!==null;){if(S===e){S=null;break}if(u=S.sibling,u!==null){u.return=S.return,S=u;break}S=S.return}u=S}}function Zs(e,n,a,o){e=null;for(var u=n,h=!1;u!==null;){if(!h){if((u.flags&524288)!==0)h=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var S=u.alternate;if(S===null)throw Error(s(387));if(S=S.memoizedProps,S!==null){var A=u.type;jn(u.pendingProps.value,S.value)||(e!==null?e.push(A):e=[A])}}else if(u===ot.current){if(S=u.alternate,S===null)throw Error(s(387));S.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(No):e=[No])}u=u.return}e!==null&&Lu(n,e,a,o),n.flags|=262144}function Al(e){for(e=e.firstContext;e!==null;){if(!jn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function hs(e){fs=e,Ji=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Rn(e){return Zp(fs,e)}function Rl(e,n){return fs===null&&hs(e),Zp(e,n)}function Zp(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Ji===null){if(e===null)throw Error(s(308));Ji=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Ji=Ji.next=n;return a}var Gx=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},kx=r.unstable_scheduleCallback,Xx=r.unstable_NormalPriority,ln={$$typeof:U,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ou(){return{controller:new Gx,data:new Map,refCount:0}}function so(e){e.refCount--,e.refCount===0&&kx(Xx,function(){e.controller.abort()})}var ro=null,Pu=0,Ks=0,Js=null;function Wx(e,n){if(ro===null){var a=ro=[];Pu=0,Ks=If(),Js={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Pu++,n.then(Kp,Kp),n}function Kp(){if(--Pu===0&&ro!==null){Js!==null&&(Js.status="fulfilled");var e=ro;ro=null,Ks=0,Js=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function qx(e,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var Jp=I.S;I.S=function(e,n){Og=E(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&Wx(e,n),Jp!==null&&Jp(e,n)};var ds=F(null);function zu(){var e=ds.current;return e!==null?e:Ye.pooledCache}function Cl(e,n){n===null?ft(ds,ds.current):ft(ds,n.pool)}function Qp(){var e=zu();return e===null?null:{parent:ln._currentValue,pool:e}}var Qs=Error(s(460)),Fu=Error(s(474)),wl=Error(s(542)),Dl={then:function(){}};function $p(e){return e=e.status,e==="fulfilled"||e==="rejected"}function tm(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Yi,Yi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,nm(e),e;default:if(typeof n.status=="string")n.then(Yi,Yi);else{if(e=Ye,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=n,e.status="pending",e.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,nm(e),e}throw ms=n,Qs}}function ps(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ms=a,Qs):a}}var ms=null;function em(){if(ms===null)throw Error(s(459));var e=ms;return ms=null,e}function nm(e){if(e===Qs||e===wl)throw Error(s(483))}var $s=null,oo=0;function Ul(e){var n=oo;return oo+=1,$s===null&&($s=[]),tm($s,e,n)}function lo(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function Nl(e,n){throw n.$$typeof===x?Error(s(525)):(e=Object.prototype.toString.call(n),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function im(e){function n(Z,X){if(e){var et=Z.deletions;et===null?(Z.deletions=[X],Z.flags|=16):et.push(X)}}function a(Z,X){if(!e)return null;for(;X!==null;)n(Z,X),X=X.sibling;return null}function o(Z){for(var X=new Map;Z!==null;)Z.key!==null?X.set(Z.key,Z):X.set(Z.index,Z),Z=Z.sibling;return X}function u(Z,X){return Z=Zi(Z,X),Z.index=0,Z.sibling=null,Z}function h(Z,X,et){return Z.index=et,e?(et=Z.alternate,et!==null?(et=et.index,et<X?(Z.flags|=67108866,X):et):(Z.flags|=67108866,X)):(Z.flags|=1048576,X)}function S(Z){return e&&Z.alternate===null&&(Z.flags|=67108866),Z}function A(Z,X,et,_t){return X===null||X.tag!==6?(X=Tu(et,Z.mode,_t),X.return=Z,X):(X=u(X,et),X.return=Z,X)}function G(Z,X,et,_t){var re=et.type;return re===C?mt(Z,X,et.props.children,_t,et.key):X!==null&&(X.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===k&&ps(re)===X.type)?(X=u(X,et.props),lo(X,et),X.return=Z,X):(X=bl(et.type,et.key,et.props,null,Z.mode,_t),lo(X,et),X.return=Z,X)}function nt(Z,X,et,_t){return X===null||X.tag!==4||X.stateNode.containerInfo!==et.containerInfo||X.stateNode.implementation!==et.implementation?(X=Au(et,Z.mode,_t),X.return=Z,X):(X=u(X,et.children||[]),X.return=Z,X)}function mt(Z,X,et,_t,re){return X===null||X.tag!==7?(X=cs(et,Z.mode,_t,re),X.return=Z,X):(X=u(X,et),X.return=Z,X)}function St(Z,X,et){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=Tu(""+X,Z.mode,et),X.return=Z,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case y:return et=bl(X.type,X.key,X.props,null,Z.mode,et),lo(et,X),et.return=Z,et;case b:return X=Au(X,Z.mode,et),X.return=Z,X;case k:return X=ps(X),St(Z,X,et)}if(rt(X)||J(X))return X=cs(X,Z.mode,et,null),X.return=Z,X;if(typeof X.then=="function")return St(Z,Ul(X),et);if(X.$$typeof===U)return St(Z,Rl(Z,X),et);Nl(Z,X)}return null}function st(Z,X,et,_t){var re=X!==null?X.key:null;if(typeof et=="string"&&et!==""||typeof et=="number"||typeof et=="bigint")return re!==null?null:A(Z,X,""+et,_t);if(typeof et=="object"&&et!==null){switch(et.$$typeof){case y:return et.key===re?G(Z,X,et,_t):null;case b:return et.key===re?nt(Z,X,et,_t):null;case k:return et=ps(et),st(Z,X,et,_t)}if(rt(et)||J(et))return re!==null?null:mt(Z,X,et,_t,null);if(typeof et.then=="function")return st(Z,X,Ul(et),_t);if(et.$$typeof===U)return st(Z,X,Rl(Z,et),_t);Nl(Z,et)}return null}function ct(Z,X,et,_t,re){if(typeof _t=="string"&&_t!==""||typeof _t=="number"||typeof _t=="bigint")return Z=Z.get(et)||null,A(X,Z,""+_t,re);if(typeof _t=="object"&&_t!==null){switch(_t.$$typeof){case y:return Z=Z.get(_t.key===null?et:_t.key)||null,G(X,Z,_t,re);case b:return Z=Z.get(_t.key===null?et:_t.key)||null,nt(X,Z,_t,re);case k:return _t=ps(_t),ct(Z,X,et,_t,re)}if(rt(_t)||J(_t))return Z=Z.get(et)||null,mt(X,Z,_t,re,null);if(typeof _t.then=="function")return ct(Z,X,et,Ul(_t),re);if(_t.$$typeof===U)return ct(Z,X,et,Rl(X,_t),re);Nl(X,_t)}return null}function Jt(Z,X,et,_t){for(var re=null,Ne=null,ie=X,Se=X=0,Re=null;ie!==null&&Se<et.length;Se++){ie.index>Se?(Re=ie,ie=null):Re=ie.sibling;var Le=st(Z,ie,et[Se],_t);if(Le===null){ie===null&&(ie=Re);break}e&&ie&&Le.alternate===null&&n(Z,ie),X=h(Le,X,Se),Ne===null?re=Le:Ne.sibling=Le,Ne=Le,ie=Re}if(Se===et.length)return a(Z,ie),Ce&&Ki(Z,Se),re;if(ie===null){for(;Se<et.length;Se++)ie=St(Z,et[Se],_t),ie!==null&&(X=h(ie,X,Se),Ne===null?re=ie:Ne.sibling=ie,Ne=ie);return Ce&&Ki(Z,Se),re}for(ie=o(ie);Se<et.length;Se++)Re=ct(ie,Z,Se,et[Se],_t),Re!==null&&(e&&Re.alternate!==null&&ie.delete(Re.key===null?Se:Re.key),X=h(Re,X,Se),Ne===null?re=Re:Ne.sibling=Re,Ne=Re);return e&&ie.forEach(function(qa){return n(Z,qa)}),Ce&&Ki(Z,Se),re}function ue(Z,X,et,_t){if(et==null)throw Error(s(151));for(var re=null,Ne=null,ie=X,Se=X=0,Re=null,Le=et.next();ie!==null&&!Le.done;Se++,Le=et.next()){ie.index>Se?(Re=ie,ie=null):Re=ie.sibling;var qa=st(Z,ie,Le.value,_t);if(qa===null){ie===null&&(ie=Re);break}e&&ie&&qa.alternate===null&&n(Z,ie),X=h(qa,X,Se),Ne===null?re=qa:Ne.sibling=qa,Ne=qa,ie=Re}if(Le.done)return a(Z,ie),Ce&&Ki(Z,Se),re;if(ie===null){for(;!Le.done;Se++,Le=et.next())Le=St(Z,Le.value,_t),Le!==null&&(X=h(Le,X,Se),Ne===null?re=Le:Ne.sibling=Le,Ne=Le);return Ce&&Ki(Z,Se),re}for(ie=o(ie);!Le.done;Se++,Le=et.next())Le=ct(ie,Z,Se,Le.value,_t),Le!==null&&(e&&Le.alternate!==null&&ie.delete(Le.key===null?Se:Le.key),X=h(Le,X,Se),Ne===null?re=Le:Ne.sibling=Le,Ne=Le);return e&&ie.forEach(function(iy){return n(Z,iy)}),Ce&&Ki(Z,Se),re}function qe(Z,X,et,_t){if(typeof et=="object"&&et!==null&&et.type===C&&et.key===null&&(et=et.props.children),typeof et=="object"&&et!==null){switch(et.$$typeof){case y:t:{for(var re=et.key;X!==null;){if(X.key===re){if(re=et.type,re===C){if(X.tag===7){a(Z,X.sibling),_t=u(X,et.props.children),_t.return=Z,Z=_t;break t}}else if(X.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===k&&ps(re)===X.type){a(Z,X.sibling),_t=u(X,et.props),lo(_t,et),_t.return=Z,Z=_t;break t}a(Z,X);break}else n(Z,X);X=X.sibling}et.type===C?(_t=cs(et.props.children,Z.mode,_t,et.key),_t.return=Z,Z=_t):(_t=bl(et.type,et.key,et.props,null,Z.mode,_t),lo(_t,et),_t.return=Z,Z=_t)}return S(Z);case b:t:{for(re=et.key;X!==null;){if(X.key===re)if(X.tag===4&&X.stateNode.containerInfo===et.containerInfo&&X.stateNode.implementation===et.implementation){a(Z,X.sibling),_t=u(X,et.children||[]),_t.return=Z,Z=_t;break t}else{a(Z,X);break}else n(Z,X);X=X.sibling}_t=Au(et,Z.mode,_t),_t.return=Z,Z=_t}return S(Z);case k:return et=ps(et),qe(Z,X,et,_t)}if(rt(et))return Jt(Z,X,et,_t);if(J(et)){if(re=J(et),typeof re!="function")throw Error(s(150));return et=re.call(et),ue(Z,X,et,_t)}if(typeof et.then=="function")return qe(Z,X,Ul(et),_t);if(et.$$typeof===U)return qe(Z,X,Rl(Z,et),_t);Nl(Z,et)}return typeof et=="string"&&et!==""||typeof et=="number"||typeof et=="bigint"?(et=""+et,X!==null&&X.tag===6?(a(Z,X.sibling),_t=u(X,et),_t.return=Z,Z=_t):(a(Z,X),_t=Tu(et,Z.mode,_t),_t.return=Z,Z=_t),S(Z)):a(Z,X)}return function(Z,X,et,_t){try{oo=0;var re=qe(Z,X,et,_t);return $s=null,re}catch(ie){if(ie===Qs||ie===wl)throw ie;var Ne=Zn(29,ie,null,Z.mode);return Ne.lanes=_t,Ne.return=Z,Ne}finally{}}}var gs=im(!0),am=im(!1),wa=!1;function Bu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Iu(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Da(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ua(e,n,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(ze&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=El(e),Vp(e,null,a),n}return Ml(e,o,n,a),El(e)}function co(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,kr(e,a)}}function Hu(e,n){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,h=null;if(a=a.firstBaseUpdate,a!==null){do{var S={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};h===null?u=h=S:h=h.next=S,a=a.next}while(a!==null);h===null?u=h=n:h=h.next=n}else u=h=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:h,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var Vu=!1;function uo(){if(Vu){var e=Js;if(e!==null)throw e}}function fo(e,n,a,o){Vu=!1;var u=e.updateQueue;wa=!1;var h=u.firstBaseUpdate,S=u.lastBaseUpdate,A=u.shared.pending;if(A!==null){u.shared.pending=null;var G=A,nt=G.next;G.next=null,S===null?h=nt:S.next=nt,S=G;var mt=e.alternate;mt!==null&&(mt=mt.updateQueue,A=mt.lastBaseUpdate,A!==S&&(A===null?mt.firstBaseUpdate=nt:A.next=nt,mt.lastBaseUpdate=G))}if(h!==null){var St=u.baseState;S=0,mt=nt=G=null,A=h;do{var st=A.lane&-536870913,ct=st!==A.lane;if(ct?(Ae&st)===st:(o&st)===st){st!==0&&st===Ks&&(Vu=!0),mt!==null&&(mt=mt.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});t:{var Jt=e,ue=A;st=n;var qe=a;switch(ue.tag){case 1:if(Jt=ue.payload,typeof Jt=="function"){St=Jt.call(qe,St,st);break t}St=Jt;break t;case 3:Jt.flags=Jt.flags&-65537|128;case 0:if(Jt=ue.payload,st=typeof Jt=="function"?Jt.call(qe,St,st):Jt,st==null)break t;St=v({},St,st);break t;case 2:wa=!0}}st=A.callback,st!==null&&(e.flags|=64,ct&&(e.flags|=8192),ct=u.callbacks,ct===null?u.callbacks=[st]:ct.push(st))}else ct={lane:st,tag:A.tag,payload:A.payload,callback:A.callback,next:null},mt===null?(nt=mt=ct,G=St):mt=mt.next=ct,S|=st;if(A=A.next,A===null){if(A=u.shared.pending,A===null)break;ct=A,A=ct.next,ct.next=null,u.lastBaseUpdate=ct,u.shared.pending=null}}while(!0);mt===null&&(G=St),u.baseState=G,u.firstBaseUpdate=nt,u.lastBaseUpdate=mt,h===null&&(u.shared.lanes=0),za|=S,e.lanes=S,e.memoizedState=St}}function sm(e,n){if(typeof e!="function")throw Error(s(191,e));e.call(n)}function rm(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)sm(a[e],n)}var tr=F(null),Ll=F(0);function om(e,n){e=oa,ft(Ll,e),ft(tr,n),oa=e|n.baseLanes}function Gu(){ft(Ll,oa),ft(tr,tr.current)}function ku(){oa=Ll.current,$(tr),$(Ll)}var Kn=F(null),fi=null;function Na(e){var n=e.alternate;ft(sn,sn.current&1),ft(Kn,e),fi===null&&(n===null||tr.current!==null||n.memoizedState!==null)&&(fi=e)}function Xu(e){ft(sn,sn.current),ft(Kn,e),fi===null&&(fi=e)}function lm(e){e.tag===22?(ft(sn,sn.current),ft(Kn,e),fi===null&&(fi=e)):La()}function La(){ft(sn,sn.current),ft(Kn,Kn.current)}function Jn(e){$(Kn),fi===e&&(fi=null),$(sn)}var sn=F(0);function Ol(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Jf(a)||Qf(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var $i=0,_e=null,Xe=null,cn=null,Pl=!1,er=!1,vs=!1,zl=0,ho=0,nr=null,Yx=0;function en(){throw Error(s(321))}function Wu(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!jn(e[a],n[a]))return!1;return!0}function qu(e,n,a,o,u,h){return $i=h,_e=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,I.H=e===null||e.memoizedState===null?Wm:lf,vs=!1,h=a(o,u),vs=!1,er&&(h=um(n,a,o,u)),cm(e),h}function cm(e){I.H=go;var n=Xe!==null&&Xe.next!==null;if($i=0,cn=Xe=_e=null,Pl=!1,ho=0,nr=null,n)throw Error(s(300));e===null||un||(e=e.dependencies,e!==null&&Al(e)&&(un=!0))}function um(e,n,a,o){_e=e;var u=0;do{if(er&&(nr=null),ho=0,er=!1,25<=u)throw Error(s(301));if(u+=1,cn=Xe=null,e.updateQueue!=null){var h=e.updateQueue;h.lastEffect=null,h.events=null,h.stores=null,h.memoCache!=null&&(h.memoCache.index=0)}I.H=qm,h=n(a,o)}while(er);return h}function jx(){var e=I.H,n=e.useState()[0];return n=typeof n.then=="function"?po(n):n,e=e.useState()[0],(Xe!==null?Xe.memoizedState:null)!==e&&(_e.flags|=1024),n}function Yu(){var e=zl!==0;return zl=0,e}function ju(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function Zu(e){if(Pl){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Pl=!1}$i=0,cn=Xe=_e=null,er=!1,ho=zl=0,nr=null}function Fn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return cn===null?_e.memoizedState=cn=e:cn=cn.next=e,cn}function rn(){if(Xe===null){var e=_e.alternate;e=e!==null?e.memoizedState:null}else e=Xe.next;var n=cn===null?_e.memoizedState:cn.next;if(n!==null)cn=n,Xe=e;else{if(e===null)throw _e.alternate===null?Error(s(467)):Error(s(310));Xe=e,e={memoizedState:Xe.memoizedState,baseState:Xe.baseState,baseQueue:Xe.baseQueue,queue:Xe.queue,next:null},cn===null?_e.memoizedState=cn=e:cn=cn.next=e}return cn}function Fl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function po(e){var n=ho;return ho+=1,nr===null&&(nr=[]),e=tm(nr,e,n),n=_e,(cn===null?n.memoizedState:cn.next)===null&&(n=n.alternate,I.H=n===null||n.memoizedState===null?Wm:lf),e}function Bl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return po(e);if(e.$$typeof===U)return Rn(e)}throw Error(s(438,String(e)))}function Ku(e){var n=null,a=_e.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=_e.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Fl(),_e.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),o=0;o<e;o++)a[o]=w;return n.index++,a}function ta(e,n){return typeof n=="function"?n(e):n}function Il(e){var n=rn();return Ju(n,Xe,e)}function Ju(e,n,a){var o=e.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=e.baseQueue,h=o.pending;if(h!==null){if(u!==null){var S=u.next;u.next=h.next,h.next=S}n.baseQueue=u=h,o.pending=null}if(h=e.baseState,u===null)e.memoizedState=h;else{n=u.next;var A=S=null,G=null,nt=n,mt=!1;do{var St=nt.lane&-536870913;if(St!==nt.lane?(Ae&St)===St:($i&St)===St){var st=nt.revertLane;if(st===0)G!==null&&(G=G.next={lane:0,revertLane:0,gesture:null,action:nt.action,hasEagerState:nt.hasEagerState,eagerState:nt.eagerState,next:null}),St===Ks&&(mt=!0);else if(($i&st)===st){nt=nt.next,st===Ks&&(mt=!0);continue}else St={lane:0,revertLane:nt.revertLane,gesture:null,action:nt.action,hasEagerState:nt.hasEagerState,eagerState:nt.eagerState,next:null},G===null?(A=G=St,S=h):G=G.next=St,_e.lanes|=st,za|=st;St=nt.action,vs&&a(h,St),h=nt.hasEagerState?nt.eagerState:a(h,St)}else st={lane:St,revertLane:nt.revertLane,gesture:nt.gesture,action:nt.action,hasEagerState:nt.hasEagerState,eagerState:nt.eagerState,next:null},G===null?(A=G=st,S=h):G=G.next=st,_e.lanes|=St,za|=St;nt=nt.next}while(nt!==null&&nt!==n);if(G===null?S=h:G.next=A,!jn(h,e.memoizedState)&&(un=!0,mt&&(a=Js,a!==null)))throw a;e.memoizedState=h,e.baseState=S,e.baseQueue=G,o.lastRenderedState=h}return u===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Qu(e){var n=rn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var o=a.dispatch,u=a.pending,h=n.memoizedState;if(u!==null){a.pending=null;var S=u=u.next;do h=e(h,S.action),S=S.next;while(S!==u);jn(h,n.memoizedState)||(un=!0),n.memoizedState=h,n.baseQueue===null&&(n.baseState=h),a.lastRenderedState=h}return[h,o]}function fm(e,n,a){var o=_e,u=rn(),h=Ce;if(h){if(a===void 0)throw Error(s(407));a=a()}else a=n();var S=!jn((Xe||u).memoizedState,a);if(S&&(u.memoizedState=a,un=!0),u=u.queue,ef(pm.bind(null,o,u,e),[e]),u.getSnapshot!==n||S||cn!==null&&cn.memoizedState.tag&1){if(o.flags|=2048,ir(9,{destroy:void 0},dm.bind(null,o,u,a,n),null),Ye===null)throw Error(s(349));h||($i&127)!==0||hm(o,n,a)}return a}function hm(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=_e.updateQueue,n===null?(n=Fl(),_e.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function dm(e,n,a,o){n.value=a,n.getSnapshot=o,mm(n)&&gm(e)}function pm(e,n,a){return a(function(){mm(n)&&gm(e)})}function mm(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!jn(e,a)}catch{return!0}}function gm(e){var n=ls(e,2);n!==null&&Xn(n,e,2)}function $u(e){var n=Fn();if(typeof e=="function"){var a=e;if(e=a(),vs){jt(!0);try{a()}finally{jt(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:e},n}function vm(e,n,a,o){return e.baseState=a,Ju(e,Xe,typeof o=="function"?o:ta)}function Zx(e,n,a,o,u){if(Gl(e))throw Error(s(485));if(e=n.action,e!==null){var h={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(S){h.listeners.push(S)}};I.T!==null?a(!0):h.isTransition=!1,o(h),a=n.pending,a===null?(h.next=n.pending=h,_m(n,h)):(h.next=a.next,n.pending=a.next=h)}}function _m(e,n){var a=n.action,o=n.payload,u=e.state;if(n.isTransition){var h=I.T,S={};I.T=S;try{var A=a(u,o),G=I.S;G!==null&&G(S,A),xm(e,n,A)}catch(nt){tf(e,n,nt)}finally{h!==null&&S.types!==null&&(h.types=S.types),I.T=h}}else try{h=a(u,o),xm(e,n,h)}catch(nt){tf(e,n,nt)}}function xm(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){Sm(e,n,o)},function(o){return tf(e,n,o)}):Sm(e,n,a)}function Sm(e,n,a){n.status="fulfilled",n.value=a,ym(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,_m(e,a)))}function tf(e,n,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,ym(n),n=n.next;while(n!==o)}e.action=null}function ym(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function Mm(e,n){return n}function Em(e,n){if(Ce){var a=Ye.formState;if(a!==null){t:{var o=_e;if(Ce){if(Ze){e:{for(var u=Ze,h=ui;u.nodeType!==8;){if(!h){u=null;break e}if(u=hi(u.nextSibling),u===null){u=null;break e}}h=u.data,u=h==="F!"||h==="F"?u:null}if(u){Ze=hi(u.nextSibling),o=u.data==="F!";break t}}Ra(o)}o=!1}o&&(n=a[0])}}return a=Fn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mm,lastRenderedState:n},a.queue=o,a=Gm.bind(null,_e,o),o.dispatch=a,o=$u(!1),h=of.bind(null,_e,!1,o.queue),o=Fn(),u={state:n,dispatch:null,action:e,pending:null},o.queue=u,a=Zx.bind(null,_e,u,h,a),u.dispatch=a,o.memoizedState=e,[n,a,!1]}function bm(e){var n=rn();return Tm(n,Xe,e)}function Tm(e,n,a){if(n=Ju(e,n,Mm)[0],e=Il(ta)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=po(n)}catch(S){throw S===Qs?wl:S}else o=n;n=rn();var u=n.queue,h=u.dispatch;return a!==n.memoizedState&&(_e.flags|=2048,ir(9,{destroy:void 0},Kx.bind(null,u,a),null)),[o,h,e]}function Kx(e,n){e.action=n}function Am(e){var n=rn(),a=Xe;if(a!==null)return Tm(n,a,e);rn(),n=n.memoizedState,a=rn();var o=a.queue.dispatch;return a.memoizedState=e,[n,o,!1]}function ir(e,n,a,o){return e={tag:e,create:a,deps:o,inst:n,next:null},n=_e.updateQueue,n===null&&(n=Fl(),_e.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,n.lastEffect=e),e}function Rm(){return rn().memoizedState}function Hl(e,n,a,o){var u=Fn();_e.flags|=e,u.memoizedState=ir(1|n,{destroy:void 0},a,o===void 0?null:o)}function Vl(e,n,a,o){var u=rn();o=o===void 0?null:o;var h=u.memoizedState.inst;Xe!==null&&o!==null&&Wu(o,Xe.memoizedState.deps)?u.memoizedState=ir(n,h,a,o):(_e.flags|=e,u.memoizedState=ir(1|n,h,a,o))}function Cm(e,n){Hl(8390656,8,e,n)}function ef(e,n){Vl(2048,8,e,n)}function Jx(e){_e.flags|=4;var n=_e.updateQueue;if(n===null)n=Fl(),_e.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function wm(e){var n=rn().memoizedState;return Jx({ref:n,nextImpl:e}),function(){if((ze&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function Dm(e,n){return Vl(4,2,e,n)}function Um(e,n){return Vl(4,4,e,n)}function Nm(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Lm(e,n,a){a=a!=null?a.concat([e]):null,Vl(4,4,Nm.bind(null,n,e),a)}function nf(){}function Om(e,n){var a=rn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&Wu(n,o[1])?o[0]:(a.memoizedState=[e,n],e)}function Pm(e,n){var a=rn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&Wu(n,o[1]))return o[0];if(o=e(),vs){jt(!0);try{e()}finally{jt(!1)}}return a.memoizedState=[o,n],o}function af(e,n,a){return a===void 0||($i&1073741824)!==0&&(Ae&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=zg(),_e.lanes|=e,za|=e,a)}function zm(e,n,a,o){return jn(a,n)?a:tr.current!==null?(e=af(e,a,o),jn(e,n)||(un=!0),e):($i&42)===0||($i&1073741824)!==0&&(Ae&261930)===0?(un=!0,e.memoizedState=a):(e=zg(),_e.lanes|=e,za|=e,n)}function Fm(e,n,a,o,u){var h=H.p;H.p=h!==0&&8>h?h:8;var S=I.T,A={};I.T=A,of(e,!1,n,a);try{var G=u(),nt=I.S;if(nt!==null&&nt(A,G),G!==null&&typeof G=="object"&&typeof G.then=="function"){var mt=qx(G,o);mo(e,n,mt,ti(e))}else mo(e,n,o,ti(e))}catch(St){mo(e,n,{then:function(){},status:"rejected",reason:St},ti())}finally{H.p=h,S!==null&&A.types!==null&&(S.types=A.types),I.T=S}}function Qx(){}function sf(e,n,a,o){if(e.tag!==5)throw Error(s(476));var u=Bm(e).queue;Fm(e,u,n,tt,a===null?Qx:function(){return Im(e),a(o)})}function Bm(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:tt,baseState:tt,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:tt},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ta,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function Im(e){var n=Bm(e);n.next===null&&(n=e.alternate.memoizedState),mo(e,n.next.queue,{},ti())}function rf(){return Rn(No)}function Hm(){return rn().memoizedState}function Vm(){return rn().memoizedState}function $x(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ti();e=Da(a);var o=Ua(n,e,a);o!==null&&(Xn(o,n,a),co(o,n,a)),n={cache:Ou()},e.payload=n;return}n=n.return}}function tS(e,n,a){var o=ti();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Gl(e)?km(n,a):(a=Eu(e,n,a,o),a!==null&&(Xn(a,e,o),Xm(a,n,o)))}function Gm(e,n,a){var o=ti();mo(e,n,a,o)}function mo(e,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Gl(e))km(n,u);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=n.lastRenderedReducer,h!==null))try{var S=n.lastRenderedState,A=h(S,a);if(u.hasEagerState=!0,u.eagerState=A,jn(A,S))return Ml(e,n,u,0),Ye===null&&yl(),!1}catch{}finally{}if(a=Eu(e,n,u,o),a!==null)return Xn(a,e,o),Xm(a,n,o),!0}return!1}function of(e,n,a,o){if(o={lane:2,revertLane:If(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Gl(e)){if(n)throw Error(s(479))}else n=Eu(e,a,o,2),n!==null&&Xn(n,e,2)}function Gl(e){var n=e.alternate;return e===_e||n!==null&&n===_e}function km(e,n){er=Pl=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function Xm(e,n,a){if((a&4194048)!==0){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,kr(e,a)}}var go={readContext:Rn,use:Bl,useCallback:en,useContext:en,useEffect:en,useImperativeHandle:en,useLayoutEffect:en,useInsertionEffect:en,useMemo:en,useReducer:en,useRef:en,useState:en,useDebugValue:en,useDeferredValue:en,useTransition:en,useSyncExternalStore:en,useId:en,useHostTransitionStatus:en,useFormState:en,useActionState:en,useOptimistic:en,useMemoCache:en,useCacheRefresh:en};go.useEffectEvent=en;var Wm={readContext:Rn,use:Bl,useCallback:function(e,n){return Fn().memoizedState=[e,n===void 0?null:n],e},useContext:Rn,useEffect:Cm,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,Hl(4194308,4,Nm.bind(null,n,e),a)},useLayoutEffect:function(e,n){return Hl(4194308,4,e,n)},useInsertionEffect:function(e,n){Hl(4,2,e,n)},useMemo:function(e,n){var a=Fn();n=n===void 0?null:n;var o=e();if(vs){jt(!0);try{e()}finally{jt(!1)}}return a.memoizedState=[o,n],o},useReducer:function(e,n,a){var o=Fn();if(a!==void 0){var u=a(n);if(vs){jt(!0);try{a(n)}finally{jt(!1)}}}else u=n;return o.memoizedState=o.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},o.queue=e,e=e.dispatch=tS.bind(null,_e,e),[o.memoizedState,e]},useRef:function(e){var n=Fn();return e={current:e},n.memoizedState=e},useState:function(e){e=$u(e);var n=e.queue,a=Gm.bind(null,_e,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:nf,useDeferredValue:function(e,n){var a=Fn();return af(a,e,n)},useTransition:function(){var e=$u(!1);return e=Fm.bind(null,_e,e.queue,!0,!1),Fn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var o=_e,u=Fn();if(Ce){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),Ye===null)throw Error(s(349));(Ae&127)!==0||hm(o,n,a)}u.memoizedState=a;var h={value:a,getSnapshot:n};return u.queue=h,Cm(pm.bind(null,o,h,e),[e]),o.flags|=2048,ir(9,{destroy:void 0},dm.bind(null,o,h,a,n),null),a},useId:function(){var e=Fn(),n=Ye.identifierPrefix;if(Ce){var a=Ui,o=Di;a=(o&~(1<<32-Wt(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=zl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=Yx++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:rf,useFormState:Em,useActionState:Em,useOptimistic:function(e){var n=Fn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=of.bind(null,_e,!0,a),a.dispatch=n,[e,n]},useMemoCache:Ku,useCacheRefresh:function(){return Fn().memoizedState=$x.bind(null,_e)},useEffectEvent:function(e){var n=Fn(),a={impl:e};return n.memoizedState=a,function(){if((ze&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},lf={readContext:Rn,use:Bl,useCallback:Om,useContext:Rn,useEffect:ef,useImperativeHandle:Lm,useInsertionEffect:Dm,useLayoutEffect:Um,useMemo:Pm,useReducer:Il,useRef:Rm,useState:function(){return Il(ta)},useDebugValue:nf,useDeferredValue:function(e,n){var a=rn();return zm(a,Xe.memoizedState,e,n)},useTransition:function(){var e=Il(ta)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:po(e),n]},useSyncExternalStore:fm,useId:Hm,useHostTransitionStatus:rf,useFormState:bm,useActionState:bm,useOptimistic:function(e,n){var a=rn();return vm(a,Xe,e,n)},useMemoCache:Ku,useCacheRefresh:Vm};lf.useEffectEvent=wm;var qm={readContext:Rn,use:Bl,useCallback:Om,useContext:Rn,useEffect:ef,useImperativeHandle:Lm,useInsertionEffect:Dm,useLayoutEffect:Um,useMemo:Pm,useReducer:Qu,useRef:Rm,useState:function(){return Qu(ta)},useDebugValue:nf,useDeferredValue:function(e,n){var a=rn();return Xe===null?af(a,e,n):zm(a,Xe.memoizedState,e,n)},useTransition:function(){var e=Qu(ta)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:po(e),n]},useSyncExternalStore:fm,useId:Hm,useHostTransitionStatus:rf,useFormState:Am,useActionState:Am,useOptimistic:function(e,n){var a=rn();return Xe!==null?vm(a,Xe,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Ku,useCacheRefresh:Vm};qm.useEffectEvent=wm;function cf(e,n,a,o){n=e.memoizedState,a=a(o,n),a=a==null?n:v({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var uf={enqueueSetState:function(e,n,a){e=e._reactInternals;var o=ti(),u=Da(o);u.payload=n,a!=null&&(u.callback=a),n=Ua(e,u,o),n!==null&&(Xn(n,e,o),co(n,e,o))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var o=ti(),u=Da(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ua(e,u,o),n!==null&&(Xn(n,e,o),co(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ti(),o=Da(a);o.tag=2,n!=null&&(o.callback=n),n=Ua(e,o,a),n!==null&&(Xn(n,e,a),co(n,e,a))}};function Ym(e,n,a,o,u,h,S){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,h,S):n.prototype&&n.prototype.isPureReactComponent?!eo(a,o)||!eo(u,h):!0}function jm(e,n,a,o){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==e&&uf.enqueueReplaceState(n,n.state,null)}function _s(e,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(e=e.defaultProps){a===n&&(a=v({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function Zm(e){Sl(e)}function Km(e){console.error(e)}function Jm(e){Sl(e)}function kl(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function Qm(e,n,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function ff(e,n,a){return a=Da(a),a.tag=3,a.payload={element:null},a.callback=function(){kl(e,n)},a}function $m(e){return e=Da(e),e.tag=3,e}function tg(e,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var h=o.value;e.payload=function(){return u(h)},e.callback=function(){Qm(n,a,o)}}var S=a.stateNode;S!==null&&typeof S.componentDidCatch=="function"&&(e.callback=function(){Qm(n,a,o),typeof u!="function"&&(Fa===null?Fa=new Set([this]):Fa.add(this));var A=o.stack;this.componentDidCatch(o.value,{componentStack:A!==null?A:""})})}function eS(e,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&Zs(n,a,u,!0),a=Kn.current,a!==null){switch(a.tag){case 31:case 13:return fi===null?ec():a.alternate===null&&nn===0&&(nn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),zf(e,o,u)),!1;case 22:return a.flags|=65536,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),zf(e,o,u)),!1}throw Error(s(435,a.tag))}return zf(e,o,u),ec(),!1}if(Ce)return n=Kn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==wu&&(e=Error(s(422),{cause:o}),ao(oi(e,a)))):(o!==wu&&(n=Error(s(423),{cause:o}),ao(oi(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,o=oi(o,a),u=ff(e.stateNode,o,u),Hu(e,u),nn!==4&&(nn=2)),!1;var h=Error(s(520),{cause:o});if(h=oi(h,a),bo===null?bo=[h]:bo.push(h),nn!==4&&(nn=2),n===null)return!0;o=oi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=ff(a.stateNode,o,e),Hu(a,e),!1;case 1:if(n=a.type,h=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(Fa===null||!Fa.has(h))))return a.flags|=65536,u&=-u,a.lanes|=u,u=$m(u),tg(u,e,a,o),Hu(a,u),!1}a=a.return}while(a!==null);return!1}var hf=Error(s(461)),un=!1;function Cn(e,n,a,o){n.child=e===null?am(n,null,a,o):gs(n,e.child,a,o)}function eg(e,n,a,o,u){a=a.render;var h=n.ref;if("ref"in o){var S={};for(var A in o)A!=="ref"&&(S[A]=o[A])}else S=o;return hs(n),o=qu(e,n,a,S,h,u),A=Yu(),e!==null&&!un?(ju(e,n,u),ea(e,n,u)):(Ce&&A&&Ru(n),n.flags|=1,Cn(e,n,o,u),n.child)}function ng(e,n,a,o,u){if(e===null){var h=a.type;return typeof h=="function"&&!bu(h)&&h.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=h,ig(e,n,h,o,u)):(e=bl(a.type,null,o,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(h=e.child,!Sf(e,u)){var S=h.memoizedProps;if(a=a.compare,a=a!==null?a:eo,a(S,o)&&e.ref===n.ref)return ea(e,n,u)}return n.flags|=1,e=Zi(h,o),e.ref=n.ref,e.return=n,n.child=e}function ig(e,n,a,o,u){if(e!==null){var h=e.memoizedProps;if(eo(h,o)&&e.ref===n.ref)if(un=!1,n.pendingProps=o=h,Sf(e,u))(e.flags&131072)!==0&&(un=!0);else return n.lanes=e.lanes,ea(e,n,u)}return df(e,n,a,o,u)}function ag(e,n,a,o){var u=o.children,h=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(h=h!==null?h.baseLanes|a:a,e!==null){for(o=n.child=e.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~h}else o=0,n.child=null;return sg(e,n,h,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&Cl(n,h!==null?h.cachePool:null),h!==null?om(n,h):Gu(),lm(n);else return o=n.lanes=536870912,sg(e,n,h!==null?h.baseLanes|a:a,a,o)}else h!==null?(Cl(n,h.cachePool),om(n,h),La(),n.memoizedState=null):(e!==null&&Cl(n,null),Gu(),La());return Cn(e,n,u,a),n.child}function vo(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function sg(e,n,a,o,u){var h=zu();return h=h===null?null:{parent:ln._currentValue,pool:h},n.memoizedState={baseLanes:a,cachePool:h},e!==null&&Cl(n,null),Gu(),lm(n),e!==null&&Zs(e,n,o,!0),n.childLanes=u,null}function Xl(e,n){return n=ql({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function rg(e,n,a){return gs(n,e.child,null,a),e=Xl(n,n.pendingProps),e.flags|=2,Jn(n),n.memoizedState=null,e}function nS(e,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(Ce){if(o.mode==="hidden")return e=Xl(n,o),n.lanes=536870912,vo(null,e);if(Xu(n),(e=Ze)?(e=_0(e,ui),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ta!==null?{id:Di,overflow:Ui}:null,retryLane:536870912,hydrationErrors:null},a=kp(e),a.return=n,n.child=a,An=n,Ze=null)):e=null,e===null)throw Ra(n);return n.lanes=536870912,null}return Xl(n,o)}var h=e.memoizedState;if(h!==null){var S=h.dehydrated;if(Xu(n),u)if(n.flags&256)n.flags&=-257,n=rg(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(s(558));else if(un||Zs(e,n,a,!1),u=(a&e.childLanes)!==0,un||u){if(o=Ye,o!==null&&(S=Os(o,a),S!==0&&S!==h.retryLane))throw h.retryLane=S,ls(e,S),Xn(o,e,S),hf;ec(),n=rg(e,n,a)}else e=h.treeContext,Ze=hi(S.nextSibling),An=n,Ce=!0,Aa=null,ui=!1,e!==null&&qp(n,e),n=Xl(n,o),n.flags|=4096;return n}return e=Zi(e.child,{mode:o.mode,children:o.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Wl(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function df(e,n,a,o,u){return hs(n),a=qu(e,n,a,o,void 0,u),o=Yu(),e!==null&&!un?(ju(e,n,u),ea(e,n,u)):(Ce&&o&&Ru(n),n.flags|=1,Cn(e,n,a,u),n.child)}function og(e,n,a,o,u,h){return hs(n),n.updateQueue=null,a=um(n,o,a,u),cm(e),o=Yu(),e!==null&&!un?(ju(e,n,h),ea(e,n,h)):(Ce&&o&&Ru(n),n.flags|=1,Cn(e,n,a,h),n.child)}function lg(e,n,a,o,u){if(hs(n),n.stateNode===null){var h=Ws,S=a.contextType;typeof S=="object"&&S!==null&&(h=Rn(S)),h=new a(o,h),n.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,h.updater=uf,n.stateNode=h,h._reactInternals=n,h=n.stateNode,h.props=o,h.state=n.memoizedState,h.refs={},Bu(n),S=a.contextType,h.context=typeof S=="object"&&S!==null?Rn(S):Ws,h.state=n.memoizedState,S=a.getDerivedStateFromProps,typeof S=="function"&&(cf(n,a,S,o),h.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(S=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),S!==h.state&&uf.enqueueReplaceState(h,h.state,null),fo(n,o,h,u),uo(),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(e===null){h=n.stateNode;var A=n.memoizedProps,G=_s(a,A);h.props=G;var nt=h.context,mt=a.contextType;S=Ws,typeof mt=="object"&&mt!==null&&(S=Rn(mt));var St=a.getDerivedStateFromProps;mt=typeof St=="function"||typeof h.getSnapshotBeforeUpdate=="function",A=n.pendingProps!==A,mt||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(A||nt!==S)&&jm(n,h,o,S),wa=!1;var st=n.memoizedState;h.state=st,fo(n,o,h,u),uo(),nt=n.memoizedState,A||st!==nt||wa?(typeof St=="function"&&(cf(n,a,St,o),nt=n.memoizedState),(G=wa||Ym(n,a,G,o,st,nt,S))?(mt||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount()),typeof h.componentDidMount=="function"&&(n.flags|=4194308)):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=nt),h.props=o,h.state=nt,h.context=S,o=G):(typeof h.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{h=n.stateNode,Iu(e,n),S=n.memoizedProps,mt=_s(a,S),h.props=mt,St=n.pendingProps,st=h.context,nt=a.contextType,G=Ws,typeof nt=="object"&&nt!==null&&(G=Rn(nt)),A=a.getDerivedStateFromProps,(nt=typeof A=="function"||typeof h.getSnapshotBeforeUpdate=="function")||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(S!==St||st!==G)&&jm(n,h,o,G),wa=!1,st=n.memoizedState,h.state=st,fo(n,o,h,u),uo();var ct=n.memoizedState;S!==St||st!==ct||wa||e!==null&&e.dependencies!==null&&Al(e.dependencies)?(typeof A=="function"&&(cf(n,a,A,o),ct=n.memoizedState),(mt=wa||Ym(n,a,mt,o,st,ct,G)||e!==null&&e.dependencies!==null&&Al(e.dependencies))?(nt||typeof h.UNSAFE_componentWillUpdate!="function"&&typeof h.componentWillUpdate!="function"||(typeof h.componentWillUpdate=="function"&&h.componentWillUpdate(o,ct,G),typeof h.UNSAFE_componentWillUpdate=="function"&&h.UNSAFE_componentWillUpdate(o,ct,G)),typeof h.componentDidUpdate=="function"&&(n.flags|=4),typeof h.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=ct),h.props=o,h.state=ct,h.context=G,o=mt):(typeof h.componentDidUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&st===e.memoizedState||(n.flags|=1024),o=!1)}return h=o,Wl(e,n),o=(n.flags&128)!==0,h||o?(h=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:h.render(),n.flags|=1,e!==null&&o?(n.child=gs(n,e.child,null,u),n.child=gs(n,null,a,u)):Cn(e,n,a,u),n.memoizedState=h.state,e=n.child):e=ea(e,n,u),e}function cg(e,n,a,o){return us(),n.flags|=256,Cn(e,n,a,o),n.child}var pf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function mf(e){return{baseLanes:e,cachePool:Qp()}}function gf(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=$n),e}function ug(e,n,a){var o=n.pendingProps,u=!1,h=(n.flags&128)!==0,S;if((S=h)||(S=e!==null&&e.memoizedState===null?!1:(sn.current&2)!==0),S&&(u=!0,n.flags&=-129),S=(n.flags&32)!==0,n.flags&=-33,e===null){if(Ce){if(u?Na(n):La(),(e=Ze)?(e=_0(e,ui),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ta!==null?{id:Di,overflow:Ui}:null,retryLane:536870912,hydrationErrors:null},a=kp(e),a.return=n,n.child=a,An=n,Ze=null)):e=null,e===null)throw Ra(n);return Qf(e)?n.lanes=32:n.lanes=536870912,null}var A=o.children;return o=o.fallback,u?(La(),u=n.mode,A=ql({mode:"hidden",children:A},u),o=cs(o,u,a,null),A.return=n,o.return=n,A.sibling=o,n.child=A,o=n.child,o.memoizedState=mf(a),o.childLanes=gf(e,S,a),n.memoizedState=pf,vo(null,o)):(Na(n),vf(n,A))}var G=e.memoizedState;if(G!==null&&(A=G.dehydrated,A!==null)){if(h)n.flags&256?(Na(n),n.flags&=-257,n=_f(e,n,a)):n.memoizedState!==null?(La(),n.child=e.child,n.flags|=128,n=null):(La(),A=o.fallback,u=n.mode,o=ql({mode:"visible",children:o.children},u),A=cs(A,u,a,null),A.flags|=2,o.return=n,A.return=n,o.sibling=A,n.child=o,gs(n,e.child,null,a),o=n.child,o.memoizedState=mf(a),o.childLanes=gf(e,S,a),n.memoizedState=pf,n=vo(null,o));else if(Na(n),Qf(A)){if(S=A.nextSibling&&A.nextSibling.dataset,S)var nt=S.dgst;S=nt,o=Error(s(419)),o.stack="",o.digest=S,ao({value:o,source:null,stack:null}),n=_f(e,n,a)}else if(un||Zs(e,n,a,!1),S=(a&e.childLanes)!==0,un||S){if(S=Ye,S!==null&&(o=Os(S,a),o!==0&&o!==G.retryLane))throw G.retryLane=o,ls(e,o),Xn(S,e,o),hf;Jf(A)||ec(),n=_f(e,n,a)}else Jf(A)?(n.flags|=192,n.child=e.child,n=null):(e=G.treeContext,Ze=hi(A.nextSibling),An=n,Ce=!0,Aa=null,ui=!1,e!==null&&qp(n,e),n=vf(n,o.children),n.flags|=4096);return n}return u?(La(),A=o.fallback,u=n.mode,G=e.child,nt=G.sibling,o=Zi(G,{mode:"hidden",children:o.children}),o.subtreeFlags=G.subtreeFlags&65011712,nt!==null?A=Zi(nt,A):(A=cs(A,u,a,null),A.flags|=2),A.return=n,o.return=n,o.sibling=A,n.child=o,vo(null,o),o=n.child,A=e.child.memoizedState,A===null?A=mf(a):(u=A.cachePool,u!==null?(G=ln._currentValue,u=u.parent!==G?{parent:G,pool:G}:u):u=Qp(),A={baseLanes:A.baseLanes|a,cachePool:u}),o.memoizedState=A,o.childLanes=gf(e,S,a),n.memoizedState=pf,vo(e.child,o)):(Na(n),a=e.child,e=a.sibling,a=Zi(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,e!==null&&(S=n.deletions,S===null?(n.deletions=[e],n.flags|=16):S.push(e)),n.child=a,n.memoizedState=null,a)}function vf(e,n){return n=ql({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function ql(e,n){return e=Zn(22,e,null,n),e.lanes=0,e}function _f(e,n,a){return gs(n,e.child,null,a),e=vf(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function fg(e,n,a){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n),Nu(e.return,n,a)}function xf(e,n,a,o,u,h){var S=e.memoizedState;S===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:h}:(S.isBackwards=n,S.rendering=null,S.renderingStartTime=0,S.last=o,S.tail=a,S.tailMode=u,S.treeForkCount=h)}function hg(e,n,a){var o=n.pendingProps,u=o.revealOrder,h=o.tail;o=o.children;var S=sn.current,A=(S&2)!==0;if(A?(S=S&1|2,n.flags|=128):S&=1,ft(sn,S),Cn(e,n,o,a),o=Ce?io:0,!A&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&fg(e,a,n);else if(e.tag===19)fg(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&Ol(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),xf(n,!1,u,a,h,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&Ol(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}xf(n,!0,a,null,h,o);break;case"together":xf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function ea(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),za|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(Zs(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(s(153));if(n.child!==null){for(e=n.child,a=Zi(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=Zi(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function Sf(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&Al(e)))}function iS(e,n,a){switch(n.tag){case 3:Ut(n,n.stateNode.containerInfo),Ca(n,ln,e.memoizedState.cache),us();break;case 27:case 5:It(n);break;case 4:Ut(n,n.stateNode.containerInfo);break;case 10:Ca(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Xu(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Na(n),n.flags|=128,null):(a&n.child.childLanes)!==0?ug(e,n,a):(Na(n),e=ea(e,n,a),e!==null?e.sibling:null);Na(n);break;case 19:var u=(e.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(Zs(e,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return hg(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ft(sn,sn.current),o)break;return null;case 22:return n.lanes=0,ag(e,n,a,n.pendingProps);case 24:Ca(n,ln,e.memoizedState.cache)}return ea(e,n,a)}function dg(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)un=!0;else{if(!Sf(e,a)&&(n.flags&128)===0)return un=!1,iS(e,n,a);un=(e.flags&131072)!==0}else un=!1,Ce&&(n.flags&1048576)!==0&&Wp(n,io,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(e=ps(n.elementType),n.type=e,typeof e=="function")bu(e)?(o=_s(e,o),n.tag=1,n=lg(null,n,e,o,a)):(n.tag=0,n=df(null,n,e,o,a));else{if(e!=null){var u=e.$$typeof;if(u===N){n.tag=11,n=eg(null,n,e,o,a);break t}else if(u===D){n.tag=14,n=ng(null,n,e,o,a);break t}}throw n=ut(e)||e,Error(s(306,n,""))}}return n;case 0:return df(e,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=_s(o,n.pendingProps),lg(e,n,o,u,a);case 3:t:{if(Ut(n,n.stateNode.containerInfo),e===null)throw Error(s(387));o=n.pendingProps;var h=n.memoizedState;u=h.element,Iu(e,n),fo(n,o,null,a);var S=n.memoizedState;if(o=S.cache,Ca(n,ln,o),o!==h.cache&&Lu(n,[ln],a,!0),uo(),o=S.element,h.isDehydrated)if(h={element:o,isDehydrated:!1,cache:S.cache},n.updateQueue.baseState=h,n.memoizedState=h,n.flags&256){n=cg(e,n,o,a);break t}else if(o!==u){u=oi(Error(s(424)),n),ao(u),n=cg(e,n,o,a);break t}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Ze=hi(e.firstChild),An=n,Ce=!0,Aa=null,ui=!0,a=am(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(us(),o===u){n=ea(e,n,a);break t}Cn(e,n,o,a)}n=n.child}return n;case 26:return Wl(e,n),e===null?(a=b0(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ce||(a=n.type,e=n.pendingProps,o=lc(it.current).createElement(a),o[on]=n,o[Sn]=e,wn(o,a,e),R(o),n.stateNode=o):n.memoizedState=b0(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return It(n),e===null&&Ce&&(o=n.stateNode=y0(n.type,n.pendingProps,it.current),An=n,ui=!0,u=Ze,Va(n.type)?($f=u,Ze=hi(o.firstChild)):Ze=u),Cn(e,n,n.pendingProps.children,a),Wl(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&Ce&&((u=o=Ze)&&(o=LS(o,n.type,n.pendingProps,ui),o!==null?(n.stateNode=o,An=n,Ze=hi(o.firstChild),ui=!1,u=!0):u=!1),u||Ra(n)),It(n),u=n.type,h=n.pendingProps,S=e!==null?e.memoizedProps:null,o=h.children,jf(u,h)?o=null:S!==null&&jf(u,S)&&(n.flags|=32),n.memoizedState!==null&&(u=qu(e,n,jx,null,null,a),No._currentValue=u),Wl(e,n),Cn(e,n,o,a),n.child;case 6:return e===null&&Ce&&((e=a=Ze)&&(a=OS(a,n.pendingProps,ui),a!==null?(n.stateNode=a,An=n,Ze=null,e=!0):e=!1),e||Ra(n)),null;case 13:return ug(e,n,a);case 4:return Ut(n,n.stateNode.containerInfo),o=n.pendingProps,e===null?n.child=gs(n,null,o,a):Cn(e,n,o,a),n.child;case 11:return eg(e,n,n.type,n.pendingProps,a);case 7:return Cn(e,n,n.pendingProps,a),n.child;case 8:return Cn(e,n,n.pendingProps.children,a),n.child;case 12:return Cn(e,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Ca(n,n.type,o.value),Cn(e,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,hs(n),u=Rn(u),o=o(u),n.flags|=1,Cn(e,n,o,a),n.child;case 14:return ng(e,n,n.type,n.pendingProps,a);case 15:return ig(e,n,n.type,n.pendingProps,a);case 19:return hg(e,n,a);case 31:return nS(e,n,a);case 22:return ag(e,n,a,n.pendingProps);case 24:return hs(n),o=Rn(ln),e===null?(u=zu(),u===null&&(u=Ye,h=Ou(),u.pooledCache=h,h.refCount++,h!==null&&(u.pooledCacheLanes|=a),u=h),n.memoizedState={parent:o,cache:u},Bu(n),Ca(n,ln,u)):((e.lanes&a)!==0&&(Iu(e,n),fo(n,null,null,a),uo()),u=e.memoizedState,h=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Ca(n,ln,o)):(o=h.cache,Ca(n,ln,o),o!==u.cache&&Lu(n,[ln],a,!0))),Cn(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function na(e){e.flags|=4}function yf(e,n,a,o,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Hg())e.flags|=8192;else throw ms=Dl,Fu}else e.flags&=-16777217}function pg(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!w0(n))if(Hg())e.flags|=8192;else throw ms=Dl,Fu}function Yl(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Ie():536870912,e.lanes|=n,or|=n)}function _o(e,n){if(!Ce)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ke(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=o,e.childLanes=a,n}function aS(e,n,a){var o=n.pendingProps;switch(Cu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(n),null;case 1:return Ke(n),null;case 3:return a=n.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),Qi(ln),Vt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(js(n)?na(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Du())),Ke(n),null;case 26:var u=n.type,h=n.memoizedState;return e===null?(na(n),h!==null?(Ke(n),pg(n,h)):(Ke(n),yf(n,u,null,o,a))):h?h!==e.memoizedState?(na(n),Ke(n),pg(n,h)):(Ke(n),n.flags&=-16777217):(e=e.memoizedProps,e!==o&&na(n),Ke(n),yf(n,u,e,o,a)),null;case 27:if(ve(n),a=it.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}e=Rt.current,js(n)?Yp(n):(e=y0(u,o,a),n.stateNode=e,na(n))}return Ke(n),null;case 5:if(ve(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}if(h=Rt.current,js(n))Yp(n);else{var S=lc(it.current);switch(h){case 1:h=S.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:h=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":h=S.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":h=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":h=S.createElement("div"),h.innerHTML="<script><\/script>",h=h.removeChild(h.firstChild);break;case"select":h=typeof o.is=="string"?S.createElement("select",{is:o.is}):S.createElement("select"),o.multiple?h.multiple=!0:o.size&&(h.size=o.size);break;default:h=typeof o.is=="string"?S.createElement(u,{is:o.is}):S.createElement(u)}}h[on]=n,h[Sn]=o;t:for(S=n.child;S!==null;){if(S.tag===5||S.tag===6)h.appendChild(S.stateNode);else if(S.tag!==4&&S.tag!==27&&S.child!==null){S.child.return=S,S=S.child;continue}if(S===n)break t;for(;S.sibling===null;){if(S.return===null||S.return===n)break t;S=S.return}S.sibling.return=S.return,S=S.sibling}n.stateNode=h;t:switch(wn(h,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&na(n)}}return Ke(n),yf(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==o&&na(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(e=it.current,js(n)){if(e=n.stateNode,a=n.memoizedProps,o=null,u=An,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}e[on]=n,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||u0(e.nodeValue,a)),e||Ra(n,!0)}else e=lc(e).createTextNode(o),e[on]=n,n.stateNode=e}return Ke(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(o=js(n),a!==null){if(e===null){if(!o)throw Error(s(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[on]=n}else us(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),e=!1}else a=Du(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(Jn(n),n):(Jn(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Ke(n),null;case 13:if(o=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=js(n),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[on]=n}else us(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),u=!1}else u=Du(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(Jn(n),n):(Jn(n),null)}return Jn(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),h=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(h=o.memoizedState.cachePool.pool),h!==u&&(o.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Yl(n,n.updateQueue),Ke(n),null);case 4:return Vt(),e===null&&kf(n.stateNode.containerInfo),Ke(n),null;case 10:return Qi(n.type),Ke(n),null;case 19:if($(sn),o=n.memoizedState,o===null)return Ke(n),null;if(u=(n.flags&128)!==0,h=o.rendering,h===null)if(u)_o(o,!1);else{if(nn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(h=Ol(e),h!==null){for(n.flags|=128,_o(o,!1),e=h.updateQueue,n.updateQueue=e,Yl(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Gp(a,e),a=a.sibling;return ft(sn,sn.current&1|2),Ce&&Ki(n,o.treeForkCount),n.child}e=e.sibling}o.tail!==null&&E()>Ql&&(n.flags|=128,u=!0,_o(o,!1),n.lanes=4194304)}else{if(!u)if(e=Ol(h),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,Yl(n,e),_o(o,!0),o.tail===null&&o.tailMode==="hidden"&&!h.alternate&&!Ce)return Ke(n),null}else 2*E()-o.renderingStartTime>Ql&&a!==536870912&&(n.flags|=128,u=!0,_o(o,!1),n.lanes=4194304);o.isBackwards?(h.sibling=n.child,n.child=h):(e=o.last,e!==null?e.sibling=h:n.child=h,o.last=h)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=E(),e.sibling=null,a=sn.current,ft(sn,u?a&1|2:a&1),Ce&&Ki(n,o.treeForkCount),e):(Ke(n),null);case 22:case 23:return Jn(n),ku(),o=n.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ke(n),n.subtreeFlags&6&&(n.flags|=8192)):Ke(n),a=n.updateQueue,a!==null&&Yl(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),e!==null&&$(ds),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Qi(ln),Ke(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function sS(e,n){switch(Cu(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Qi(ln),Vt(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return ve(n),null;case 31:if(n.memoizedState!==null){if(Jn(n),n.alternate===null)throw Error(s(340));us()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(Jn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(s(340));us()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return $(sn),null;case 4:return Vt(),null;case 10:return Qi(n.type),null;case 22:case 23:return Jn(n),ku(),e!==null&&$(ds),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Qi(ln),null;case 25:return null;default:return null}}function mg(e,n){switch(Cu(n),n.tag){case 3:Qi(ln),Vt();break;case 26:case 27:case 5:ve(n);break;case 4:Vt();break;case 31:n.memoizedState!==null&&Jn(n);break;case 13:Jn(n);break;case 19:$(sn);break;case 10:Qi(n.type);break;case 22:case 23:Jn(n),ku(),e!==null&&$(ds);break;case 24:Qi(ln)}}function xo(e,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&e)===e){o=void 0;var h=a.create,S=a.inst;o=h(),S.destroy=o}a=a.next}while(a!==u)}}catch(A){Ge(n,n.return,A)}}function Oa(e,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var h=u.next;o=h;do{if((o.tag&e)===e){var S=o.inst,A=S.destroy;if(A!==void 0){S.destroy=void 0,u=n;var G=a,nt=A;try{nt()}catch(mt){Ge(u,G,mt)}}}o=o.next}while(o!==h)}}catch(mt){Ge(n,n.return,mt)}}function gg(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{rm(n,a)}catch(o){Ge(e,e.return,o)}}}function vg(e,n,a){a.props=_s(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){Ge(e,n,o)}}function So(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(u){Ge(e,n,u)}}function Ni(e,n){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Ge(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ge(e,n,u)}else a.current=null}function _g(e){var n=e.type,a=e.memoizedProps,o=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Ge(e,e.return,u)}}function Mf(e,n,a){try{var o=e.stateNode;RS(o,e.type,a,n),o[Sn]=n}catch(u){Ge(e,e.return,u)}}function xg(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Va(e.type)||e.tag===4}function Ef(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||xg(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Va(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function bf(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Yi));else if(o!==4&&(o===27&&Va(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(bf(e,n,a),e=e.sibling;e!==null;)bf(e,n,a),e=e.sibling}function jl(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(o!==4&&(o===27&&Va(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(jl(e,n,a),e=e.sibling;e!==null;)jl(e,n,a),e=e.sibling}function Sg(e){var n=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);wn(n,o,a),n[on]=e,n[Sn]=a}catch(h){Ge(e,e.return,h)}}var ia=!1,fn=!1,Tf=!1,yg=typeof WeakSet=="function"?WeakSet:Set,_n=null;function rS(e,n){if(e=e.containerInfo,qf=mc,e=Lp(e),vu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,h=o.focusNode;o=o.focusOffset;try{a.nodeType,h.nodeType}catch{a=null;break t}var S=0,A=-1,G=-1,nt=0,mt=0,St=e,st=null;e:for(;;){for(var ct;St!==a||u!==0&&St.nodeType!==3||(A=S+u),St!==h||o!==0&&St.nodeType!==3||(G=S+o),St.nodeType===3&&(S+=St.nodeValue.length),(ct=St.firstChild)!==null;)st=St,St=ct;for(;;){if(St===e)break e;if(st===a&&++nt===u&&(A=S),st===h&&++mt===o&&(G=S),(ct=St.nextSibling)!==null)break;St=st,st=St.parentNode}St=ct}a=A===-1||G===-1?null:{start:A,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(Yf={focusedElem:e,selectionRange:a},mc=!1,_n=n;_n!==null;)if(n=_n,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,_n=e;else for(;_n!==null;){switch(n=_n,h=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&h!==null){e=void 0,a=n,u=h.memoizedProps,h=h.memoizedState,o=a.stateNode;try{var Jt=_s(a.type,u);e=o.getSnapshotBeforeUpdate(Jt,h),o.__reactInternalSnapshotBeforeUpdate=e}catch(ue){Ge(a,a.return,ue)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)Kf(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Kf(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=n.sibling,e!==null){e.return=n.return,_n=e;break}_n=n.return}}function Mg(e,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:sa(e,a),o&4&&xo(5,a);break;case 1:if(sa(e,a),o&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(S){Ge(a,a.return,S)}else{var u=_s(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(S){Ge(a,a.return,S)}}o&64&&gg(a),o&512&&So(a,a.return);break;case 3:if(sa(e,a),o&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{rm(e,n)}catch(S){Ge(a,a.return,S)}}break;case 27:n===null&&o&4&&Sg(a);case 26:case 5:sa(e,a),n===null&&o&4&&_g(a),o&512&&So(a,a.return);break;case 12:sa(e,a);break;case 31:sa(e,a),o&4&&Tg(e,a);break;case 13:sa(e,a),o&4&&Ag(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=mS.bind(null,a),PS(e,a))));break;case 22:if(o=a.memoizedState!==null||ia,!o){n=n!==null&&n.memoizedState!==null||fn,u=ia;var h=fn;ia=o,(fn=n)&&!h?ra(e,a,(a.subtreeFlags&8772)!==0):sa(e,a),ia=u,fn=h}break;case 30:break;default:sa(e,a)}}function Eg(e){var n=e.alternate;n!==null&&(e.alternate=null,Eg(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&Yr(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Qe=null,Hn=!1;function aa(e,n,a){for(a=a.child;a!==null;)bg(e,n,a),a=a.sibling}function bg(e,n,a){if(wt&&typeof wt.onCommitFiberUnmount=="function")try{wt.onCommitFiberUnmount(Tt,a)}catch{}switch(a.tag){case 26:fn||Ni(a,n),aa(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:fn||Ni(a,n);var o=Qe,u=Hn;Va(a.type)&&(Qe=a.stateNode,Hn=!1),aa(e,n,a),wo(a.stateNode),Qe=o,Hn=u;break;case 5:fn||Ni(a,n);case 6:if(o=Qe,u=Hn,Qe=null,aa(e,n,a),Qe=o,Hn=u,Qe!==null)if(Hn)try{(Qe.nodeType===9?Qe.body:Qe.nodeName==="HTML"?Qe.ownerDocument.body:Qe).removeChild(a.stateNode)}catch(h){Ge(a,n,h)}else try{Qe.removeChild(a.stateNode)}catch(h){Ge(a,n,h)}break;case 18:Qe!==null&&(Hn?(e=Qe,g0(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),mr(e)):g0(Qe,a.stateNode));break;case 4:o=Qe,u=Hn,Qe=a.stateNode.containerInfo,Hn=!0,aa(e,n,a),Qe=o,Hn=u;break;case 0:case 11:case 14:case 15:Oa(2,a,n),fn||Oa(4,a,n),aa(e,n,a);break;case 1:fn||(Ni(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&vg(a,n,o)),aa(e,n,a);break;case 21:aa(e,n,a);break;case 22:fn=(o=fn)||a.memoizedState!==null,aa(e,n,a),fn=o;break;default:aa(e,n,a)}}function Tg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{mr(e)}catch(a){Ge(n,n.return,a)}}}function Ag(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{mr(e)}catch(a){Ge(n,n.return,a)}}function oS(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new yg),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new yg),n;default:throw Error(s(435,e.tag))}}function Zl(e,n){var a=oS(e);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=gS.bind(null,e,o);o.then(u,u)}})}function Vn(e,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],h=e,S=n,A=S;t:for(;A!==null;){switch(A.tag){case 27:if(Va(A.type)){Qe=A.stateNode,Hn=!1;break t}break;case 5:Qe=A.stateNode,Hn=!1;break t;case 3:case 4:Qe=A.stateNode.containerInfo,Hn=!0;break t}A=A.return}if(Qe===null)throw Error(s(160));bg(h,S,u),Qe=null,Hn=!1,h=u.alternate,h!==null&&(h.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Rg(n,e),n=n.sibling}var Si=null;function Rg(e,n){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Vn(n,e),Gn(e),o&4&&(Oa(3,e,e.return),xo(3,e),Oa(5,e,e.return));break;case 1:Vn(n,e),Gn(e),o&512&&(fn||a===null||Ni(a,a.return)),o&64&&ia&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Si;if(Vn(n,e),Gn(e),o&512&&(fn||a===null||Ni(a,a.return)),o&4){var h=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){t:{o=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(o){case"title":h=u.getElementsByTagName("title")[0],(!h||h[is]||h[on]||h.namespaceURI==="http://www.w3.org/2000/svg"||h.hasAttribute("itemprop"))&&(h=u.createElement(o),u.head.insertBefore(h,u.querySelector("head > title"))),wn(h,o,a),h[on]=e,R(h),o=h;break t;case"link":var S=R0("link","href",u).get(o+(a.href||""));if(S){for(var A=0;A<S.length;A++)if(h=S[A],h.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&h.getAttribute("rel")===(a.rel==null?null:a.rel)&&h.getAttribute("title")===(a.title==null?null:a.title)&&h.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){S.splice(A,1);break e}}h=u.createElement(o),wn(h,o,a),u.head.appendChild(h);break;case"meta":if(S=R0("meta","content",u).get(o+(a.content||""))){for(A=0;A<S.length;A++)if(h=S[A],h.getAttribute("content")===(a.content==null?null:""+a.content)&&h.getAttribute("name")===(a.name==null?null:a.name)&&h.getAttribute("property")===(a.property==null?null:a.property)&&h.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&h.getAttribute("charset")===(a.charSet==null?null:a.charSet)){S.splice(A,1);break e}}h=u.createElement(o),wn(h,o,a),u.head.appendChild(h);break;default:throw Error(s(468,o))}h[on]=e,R(h),o=h}e.stateNode=o}else C0(u,e.type,e.stateNode);else e.stateNode=A0(u,o,e.memoizedProps);else h!==o?(h===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):h.count--,o===null?C0(u,e.type,e.stateNode):A0(u,o,e.memoizedProps)):o===null&&e.stateNode!==null&&Mf(e,e.memoizedProps,a.memoizedProps)}break;case 27:Vn(n,e),Gn(e),o&512&&(fn||a===null||Ni(a,a.return)),a!==null&&o&4&&Mf(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Vn(n,e),Gn(e),o&512&&(fn||a===null||Ni(a,a.return)),e.flags&32){u=e.stateNode;try{pn(u,"")}catch(Jt){Ge(e,e.return,Jt)}}o&4&&e.stateNode!=null&&(u=e.memoizedProps,Mf(e,u,a!==null?a.memoizedProps:u)),o&1024&&(Tf=!0);break;case 6:if(Vn(n,e),Gn(e),o&4){if(e.stateNode===null)throw Error(s(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(Jt){Ge(e,e.return,Jt)}}break;case 3:if(fc=null,u=Si,Si=cc(n.containerInfo),Vn(n,e),Si=u,Gn(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{mr(n.containerInfo)}catch(Jt){Ge(e,e.return,Jt)}Tf&&(Tf=!1,Cg(e));break;case 4:o=Si,Si=cc(e.stateNode.containerInfo),Vn(n,e),Gn(e),Si=o;break;case 12:Vn(n,e),Gn(e);break;case 31:Vn(n,e),Gn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zl(e,o)));break;case 13:Vn(n,e),Gn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Jl=E()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zl(e,o)));break;case 22:u=e.memoizedState!==null;var G=a!==null&&a.memoizedState!==null,nt=ia,mt=fn;if(ia=nt||u,fn=mt||G,Vn(n,e),fn=mt,ia=nt,Gn(e),o&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||G||ia||fn||xs(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){G=a=n;try{if(h=G.stateNode,u)S=h.style,typeof S.setProperty=="function"?S.setProperty("display","none","important"):S.display="none";else{A=G.stateNode;var St=G.memoizedProps.style,st=St!=null&&St.hasOwnProperty("display")?St.display:null;A.style.display=st==null||typeof st=="boolean"?"":(""+st).trim()}}catch(Jt){Ge(G,G.return,Jt)}}}else if(n.tag===6){if(a===null){G=n;try{G.stateNode.nodeValue=u?"":G.memoizedProps}catch(Jt){Ge(G,G.return,Jt)}}}else if(n.tag===18){if(a===null){G=n;try{var ct=G.stateNode;u?v0(ct,!0):v0(G.stateNode,!1)}catch(Jt){Ge(G,G.return,Jt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Zl(e,a))));break;case 19:Vn(n,e),Gn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zl(e,o)));break;case 30:break;case 21:break;default:Vn(n,e),Gn(e)}}function Gn(e){var n=e.flags;if(n&2){try{for(var a,o=e.return;o!==null;){if(xg(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,h=Ef(e);jl(e,h,u);break;case 5:var S=a.stateNode;a.flags&32&&(pn(S,""),a.flags&=-33);var A=Ef(e);jl(e,A,S);break;case 3:case 4:var G=a.stateNode.containerInfo,nt=Ef(e);bf(e,nt,G);break;default:throw Error(s(161))}}catch(mt){Ge(e,e.return,mt)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Cg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;Cg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function sa(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Mg(e,n.alternate,n),n=n.sibling}function xs(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:Oa(4,n,n.return),xs(n);break;case 1:Ni(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&vg(n,n.return,a),xs(n);break;case 27:wo(n.stateNode);case 26:case 5:Ni(n,n.return),xs(n);break;case 22:n.memoizedState===null&&xs(n);break;case 30:xs(n);break;default:xs(n)}e=e.sibling}}function ra(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=e,h=n,S=h.flags;switch(h.tag){case 0:case 11:case 15:ra(u,h,a),xo(4,h);break;case 1:if(ra(u,h,a),o=h,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(nt){Ge(o,o.return,nt)}if(o=h,u=o.updateQueue,u!==null){var A=o.stateNode;try{var G=u.shared.hiddenCallbacks;if(G!==null)for(u.shared.hiddenCallbacks=null,u=0;u<G.length;u++)sm(G[u],A)}catch(nt){Ge(o,o.return,nt)}}a&&S&64&&gg(h),So(h,h.return);break;case 27:Sg(h);case 26:case 5:ra(u,h,a),a&&o===null&&S&4&&_g(h),So(h,h.return);break;case 12:ra(u,h,a);break;case 31:ra(u,h,a),a&&S&4&&Tg(u,h);break;case 13:ra(u,h,a),a&&S&4&&Ag(u,h);break;case 22:h.memoizedState===null&&ra(u,h,a),So(h,h.return);break;case 30:break;default:ra(u,h,a)}n=n.sibling}}function Af(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&so(a))}function Rf(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&so(e))}function yi(e,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)wg(e,n,a,o),n=n.sibling}function wg(e,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:yi(e,n,a,o),u&2048&&xo(9,n);break;case 1:yi(e,n,a,o);break;case 3:yi(e,n,a,o),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&so(e)));break;case 12:if(u&2048){yi(e,n,a,o),e=n.stateNode;try{var h=n.memoizedProps,S=h.id,A=h.onPostCommit;typeof A=="function"&&A(S,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(G){Ge(n,n.return,G)}}else yi(e,n,a,o);break;case 31:yi(e,n,a,o);break;case 13:yi(e,n,a,o);break;case 23:break;case 22:h=n.stateNode,S=n.alternate,n.memoizedState!==null?h._visibility&2?yi(e,n,a,o):yo(e,n):h._visibility&2?yi(e,n,a,o):(h._visibility|=2,ar(e,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&Af(S,n);break;case 24:yi(e,n,a,o),u&2048&&Rf(n.alternate,n);break;default:yi(e,n,a,o)}}function ar(e,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var h=e,S=n,A=a,G=o,nt=S.flags;switch(S.tag){case 0:case 11:case 15:ar(h,S,A,G,u),xo(8,S);break;case 23:break;case 22:var mt=S.stateNode;S.memoizedState!==null?mt._visibility&2?ar(h,S,A,G,u):yo(h,S):(mt._visibility|=2,ar(h,S,A,G,u)),u&&nt&2048&&Af(S.alternate,S);break;case 24:ar(h,S,A,G,u),u&&nt&2048&&Rf(S.alternate,S);break;default:ar(h,S,A,G,u)}n=n.sibling}}function yo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,o=n,u=o.flags;switch(o.tag){case 22:yo(a,o),u&2048&&Af(o.alternate,o);break;case 24:yo(a,o),u&2048&&Rf(o.alternate,o);break;default:yo(a,o)}n=n.sibling}}var Mo=8192;function sr(e,n,a){if(e.subtreeFlags&Mo)for(e=e.child;e!==null;)Dg(e,n,a),e=e.sibling}function Dg(e,n,a){switch(e.tag){case 26:sr(e,n,a),e.flags&Mo&&e.memoizedState!==null&&YS(a,Si,e.memoizedState,e.memoizedProps);break;case 5:sr(e,n,a);break;case 3:case 4:var o=Si;Si=cc(e.stateNode.containerInfo),sr(e,n,a),Si=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Mo,Mo=16777216,sr(e,n,a),Mo=o):sr(e,n,a));break;default:sr(e,n,a)}}function Ug(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Eo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];_n=o,Lg(o,e)}Ug(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Ng(e),e=e.sibling}function Ng(e){switch(e.tag){case 0:case 11:case 15:Eo(e),e.flags&2048&&Oa(9,e,e.return);break;case 3:Eo(e);break;case 12:Eo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Kl(e)):Eo(e);break;default:Eo(e)}}function Kl(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];_n=o,Lg(o,e)}Ug(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Oa(8,n,n.return),Kl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Kl(n));break;default:Kl(n)}e=e.sibling}}function Lg(e,n){for(;_n!==null;){var a=_n;switch(a.tag){case 0:case 11:case 15:Oa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:so(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,_n=o;else t:for(a=e;_n!==null;){o=_n;var u=o.sibling,h=o.return;if(Eg(o),o===a){_n=null;break t}if(u!==null){u.return=h,_n=u;break t}_n=h}}}var lS={getCacheForType:function(e){var n=Rn(ln),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Rn(ln).controller.signal}},cS=typeof WeakMap=="function"?WeakMap:Map,ze=0,Ye=null,Ee=null,Ae=0,Ve=0,Qn=null,Pa=!1,rr=!1,Cf=!1,oa=0,nn=0,za=0,Ss=0,wf=0,$n=0,or=0,bo=null,kn=null,Df=!1,Jl=0,Og=0,Ql=1/0,$l=null,Fa=null,mn=0,Ba=null,lr=null,la=0,Uf=0,Nf=null,Pg=null,To=0,Lf=null;function ti(){return(ze&2)!==0&&Ae!==0?Ae&-Ae:I.T!==null?If():Wr()}function zg(){if($n===0)if((Ae&536870912)===0||Ce){var e=Dt;Dt<<=1,(Dt&3932160)===0&&(Dt=262144),$n=e}else $n=536870912;return e=Kn.current,e!==null&&(e.flags|=32),$n}function Xn(e,n,a){(e===Ye&&(Ve===2||Ve===9)||e.cancelPendingCommit!==null)&&(cr(e,0),Ia(e,Ae,$n,!1)),Nn(e,a),((ze&2)===0||e!==Ye)&&(e===Ye&&((ze&2)===0&&(Ss|=a),nn===4&&Ia(e,Ae,$n,!1)),Li(e))}function Fg(e,n,a){if((ze&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Ot(e,n),u=o?hS(e,n):Pf(e,n,!0),h=o;do{if(u===0){rr&&!o&&Ia(e,n,0,!1);break}else{if(a=e.current.alternate,h&&!uS(a)){u=Pf(e,n,!1),h=!1;continue}if(u===2){if(h=n,e.errorRecoveryDisabledLanes&h)var S=0;else S=e.pendingLanes&-536870913,S=S!==0?S:S&536870912?536870912:0;if(S!==0){n=S;t:{var A=e;u=bo;var G=A.current.memoizedState.isDehydrated;if(G&&(cr(A,S).flags|=256),S=Pf(A,S,!1),S!==2){if(Cf&&!G){A.errorRecoveryDisabledLanes|=h,Ss|=h,u=4;break t}h=kn,kn=u,h!==null&&(kn===null?kn=h:kn.push.apply(kn,h))}u=S}if(h=!1,u!==2)continue}}if(u===1){cr(e,0),Ia(e,n,0,!0);break}t:{switch(o=e,h=u,h){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ia(o,n,$n,!Pa);break t;case 2:kn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=Jl+300-E(),10<u)){if(Ia(o,n,$n,!Pa),yt(o,0,!0)!==0)break t;la=n,o.timeoutHandle=p0(Bg.bind(null,o,a,kn,$l,Df,n,$n,Ss,or,Pa,h,"Throttled",-0,0),u);break t}Bg(o,a,kn,$l,Df,n,$n,Ss,or,Pa,h,null,-0,0)}}break}while(!0);Li(e)}function Bg(e,n,a,o,u,h,S,A,G,nt,mt,St,st,ct){if(e.timeoutHandle=-1,St=n.subtreeFlags,St&8192||(St&16785408)===16785408){St={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Yi},Dg(n,h,St);var Jt=(h&62914560)===h?Jl-E():(h&4194048)===h?Og-E():0;if(Jt=jS(St,Jt),Jt!==null){la=h,e.cancelPendingCommit=Jt(qg.bind(null,e,n,h,a,o,u,S,A,G,mt,St,null,st,ct)),Ia(e,h,S,!nt);return}}qg(e,n,h,a,o,u,S,A,G)}function uS(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],h=u.getSnapshot;u=u.value;try{if(!jn(h(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ia(e,n,a,o){n&=~wf,n&=~Ss,e.suspendedLanes|=n,e.pingedLanes&=~n,o&&(e.warmLanes|=n),o=e.expirationTimes;for(var u=n;0<u;){var h=31-Wt(u),S=1<<h;o[h]=-1,u&=~S}a!==0&&fl(e,a,n)}function tc(){return(ze&6)===0?(Ao(0),!1):!0}function Of(){if(Ee!==null){if(Ve===0)var e=Ee.return;else e=Ee,Ji=fs=null,Zu(e),$s=null,oo=0,e=Ee;for(;e!==null;)mg(e.alternate,e),e=e.return;Ee=null}}function cr(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,DS(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),la=0,Of(),Ye=e,Ee=a=Zi(e.current,null),Ae=n,Ve=0,Qn=null,Pa=!1,rr=Ot(e,n),Cf=!1,or=$n=wf=Ss=za=nn=0,kn=bo=null,Df=!1,(n&8)!==0&&(n|=n&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=n;0<o;){var u=31-Wt(o),h=1<<u;n|=e[u],o&=~h}return oa=n,yl(),a}function Ig(e,n){_e=null,I.H=go,n===Qs||n===wl?(n=em(),Ve=3):n===Fu?(n=em(),Ve=4):Ve=n===hf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,Qn=n,Ee===null&&(nn=1,kl(e,oi(n,e.current)))}function Hg(){var e=Kn.current;return e===null?!0:(Ae&4194048)===Ae?fi===null:(Ae&62914560)===Ae||(Ae&536870912)!==0?e===fi:!1}function Vg(){var e=I.H;return I.H=go,e===null?go:e}function Gg(){var e=I.A;return I.A=lS,e}function ec(){nn=4,Pa||(Ae&4194048)!==Ae&&Kn.current!==null||(rr=!0),(za&134217727)===0&&(Ss&134217727)===0||Ye===null||Ia(Ye,Ae,$n,!1)}function Pf(e,n,a){var o=ze;ze|=2;var u=Vg(),h=Gg();(Ye!==e||Ae!==n)&&($l=null,cr(e,n)),n=!1;var S=nn;t:do try{if(Ve!==0&&Ee!==null){var A=Ee,G=Qn;switch(Ve){case 8:Of(),S=6;break t;case 3:case 2:case 9:case 6:Kn.current===null&&(n=!0);var nt=Ve;if(Ve=0,Qn=null,ur(e,A,G,nt),a&&rr){S=0;break t}break;default:nt=Ve,Ve=0,Qn=null,ur(e,A,G,nt)}}fS(),S=nn;break}catch(mt){Ig(e,mt)}while(!0);return n&&e.shellSuspendCounter++,Ji=fs=null,ze=o,I.H=u,I.A=h,Ee===null&&(Ye=null,Ae=0,yl()),S}function fS(){for(;Ee!==null;)kg(Ee)}function hS(e,n){var a=ze;ze|=2;var o=Vg(),u=Gg();Ye!==e||Ae!==n?($l=null,Ql=E()+500,cr(e,n)):rr=Ot(e,n);t:do try{if(Ve!==0&&Ee!==null){n=Ee;var h=Qn;e:switch(Ve){case 1:Ve=0,Qn=null,ur(e,n,h,1);break;case 2:case 9:if($p(h)){Ve=0,Qn=null,Xg(n);break}n=function(){Ve!==2&&Ve!==9||Ye!==e||(Ve=7),Li(e)},h.then(n,n);break t;case 3:Ve=7;break t;case 4:Ve=5;break t;case 7:$p(h)?(Ve=0,Qn=null,Xg(n)):(Ve=0,Qn=null,ur(e,n,h,7));break;case 5:var S=null;switch(Ee.tag){case 26:S=Ee.memoizedState;case 5:case 27:var A=Ee;if(S?w0(S):A.stateNode.complete){Ve=0,Qn=null;var G=A.sibling;if(G!==null)Ee=G;else{var nt=A.return;nt!==null?(Ee=nt,nc(nt)):Ee=null}break e}}Ve=0,Qn=null,ur(e,n,h,5);break;case 6:Ve=0,Qn=null,ur(e,n,h,6);break;case 8:Of(),nn=6;break t;default:throw Error(s(462))}}dS();break}catch(mt){Ig(e,mt)}while(!0);return Ji=fs=null,I.H=o,I.A=u,ze=a,Ee!==null?0:(Ye=null,Ae=0,yl(),nn)}function dS(){for(;Ee!==null&&!Lt();)kg(Ee)}function kg(e){var n=dg(e.alternate,e,oa);e.memoizedProps=e.pendingProps,n===null?nc(e):Ee=n}function Xg(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=og(a,n,n.pendingProps,n.type,void 0,Ae);break;case 11:n=og(a,n,n.pendingProps,n.type.render,n.ref,Ae);break;case 5:Zu(n);default:mg(a,n),n=Ee=Gp(n,oa),n=dg(a,n,oa)}e.memoizedProps=e.pendingProps,n===null?nc(e):Ee=n}function ur(e,n,a,o){Ji=fs=null,Zu(n),$s=null,oo=0;var u=n.return;try{if(eS(e,u,n,a,Ae)){nn=1,kl(e,oi(a,e.current)),Ee=null;return}}catch(h){if(u!==null)throw Ee=u,h;nn=1,kl(e,oi(a,e.current)),Ee=null;return}n.flags&32768?(Ce||o===1?e=!0:rr||(Ae&536870912)!==0?e=!1:(Pa=e=!0,(o===2||o===9||o===3||o===6)&&(o=Kn.current,o!==null&&o.tag===13&&(o.flags|=16384))),Wg(n,e)):nc(n)}function nc(e){var n=e;do{if((n.flags&32768)!==0){Wg(n,Pa);return}e=n.return;var a=aS(n.alternate,n,oa);if(a!==null){Ee=a;return}if(n=n.sibling,n!==null){Ee=n;return}Ee=n=e}while(n!==null);nn===0&&(nn=5)}function Wg(e,n){do{var a=sS(e.alternate,e);if(a!==null){a.flags&=32767,Ee=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){Ee=e;return}Ee=e=a}while(e!==null);nn=6,Ee=null}function qg(e,n,a,o,u,h,S,A,G){e.cancelPendingCommit=null;do ic();while(mn!==0);if((ze&6)!==0)throw Error(s(327));if(n!==null){if(n===e.current)throw Error(s(177));if(h=n.lanes|n.childLanes,h|=Mu,gi(e,a,h,S,A,G),e===Ye&&(Ee=Ye=null,Ae=0),lr=n,Ba=e,la=a,Uf=h,Nf=u,Pg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,vS(dt,function(){return Jg(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=I.T,I.T=null,u=H.p,H.p=2,S=ze,ze|=4;try{rS(e,n,a)}finally{ze=S,H.p=u,I.T=o}}mn=1,Yg(),jg(),Zg()}}function Yg(){if(mn===1){mn=0;var e=Ba,n=lr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=I.T,I.T=null;var o=H.p;H.p=2;var u=ze;ze|=4;try{Rg(n,e);var h=Yf,S=Lp(e.containerInfo),A=h.focusedElem,G=h.selectionRange;if(S!==A&&A&&A.ownerDocument&&Np(A.ownerDocument.documentElement,A)){if(G!==null&&vu(A)){var nt=G.start,mt=G.end;if(mt===void 0&&(mt=nt),"selectionStart"in A)A.selectionStart=nt,A.selectionEnd=Math.min(mt,A.value.length);else{var St=A.ownerDocument||document,st=St&&St.defaultView||window;if(st.getSelection){var ct=st.getSelection(),Jt=A.textContent.length,ue=Math.min(G.start,Jt),qe=G.end===void 0?ue:Math.min(G.end,Jt);!ct.extend&&ue>qe&&(S=qe,qe=ue,ue=S);var Z=Up(A,ue),X=Up(A,qe);if(Z&&X&&(ct.rangeCount!==1||ct.anchorNode!==Z.node||ct.anchorOffset!==Z.offset||ct.focusNode!==X.node||ct.focusOffset!==X.offset)){var et=St.createRange();et.setStart(Z.node,Z.offset),ct.removeAllRanges(),ue>qe?(ct.addRange(et),ct.extend(X.node,X.offset)):(et.setEnd(X.node,X.offset),ct.addRange(et))}}}}for(St=[],ct=A;ct=ct.parentNode;)ct.nodeType===1&&St.push({element:ct,left:ct.scrollLeft,top:ct.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<St.length;A++){var _t=St[A];_t.element.scrollLeft=_t.left,_t.element.scrollTop=_t.top}}mc=!!qf,Yf=qf=null}finally{ze=u,H.p=o,I.T=a}}e.current=n,mn=2}}function jg(){if(mn===2){mn=0;var e=Ba,n=lr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=I.T,I.T=null;var o=H.p;H.p=2;var u=ze;ze|=4;try{Mg(e,n.alternate,n)}finally{ze=u,H.p=o,I.T=a}}mn=3}}function Zg(){if(mn===4||mn===3){mn=0,O();var e=Ba,n=lr,a=la,o=Pg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?mn=5:(mn=0,lr=Ba=null,Kg(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Fa=null),Ps(a),n=n.stateNode,wt&&typeof wt.onCommitFiberRoot=="function")try{wt.onCommitFiberRoot(Tt,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=I.T,u=H.p,H.p=2,I.T=null;try{for(var h=e.onRecoverableError,S=0;S<o.length;S++){var A=o[S];h(A.value,{componentStack:A.stack})}}finally{I.T=n,H.p=u}}(la&3)!==0&&ic(),Li(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===Lf?To++:(To=0,Lf=e):To=0,Ao(0)}}function Kg(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,so(n)))}function ic(){return Yg(),jg(),Zg(),Jg()}function Jg(){if(mn!==5)return!1;var e=Ba,n=Uf;Uf=0;var a=Ps(la),o=I.T,u=H.p;try{H.p=32>a?32:a,I.T=null,a=Nf,Nf=null;var h=Ba,S=la;if(mn=0,lr=Ba=null,la=0,(ze&6)!==0)throw Error(s(331));var A=ze;if(ze|=4,Ng(h.current),wg(h,h.current,S,a),ze=A,Ao(0,!1),wt&&typeof wt.onPostCommitFiberRoot=="function")try{wt.onPostCommitFiberRoot(Tt,h)}catch{}return!0}finally{H.p=u,I.T=o,Kg(e,n)}}function Qg(e,n,a){n=oi(a,n),n=ff(e.stateNode,n,2),e=Ua(e,n,2),e!==null&&(Nn(e,2),Li(e))}function Ge(e,n,a){if(e.tag===3)Qg(e,e,a);else for(;n!==null;){if(n.tag===3){Qg(n,e,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Fa===null||!Fa.has(o))){e=oi(a,e),a=$m(2),o=Ua(n,a,2),o!==null&&(tg(a,o,n,e),Nn(o,2),Li(o));break}}n=n.return}}function zf(e,n,a){var o=e.pingCache;if(o===null){o=e.pingCache=new cS;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Cf=!0,u.add(a),e=pS.bind(null,e,n,a),n.then(e,e))}function pS(e,n,a){var o=e.pingCache;o!==null&&o.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Ye===e&&(Ae&a)===a&&(nn===4||nn===3&&(Ae&62914560)===Ae&&300>E()-Jl?(ze&2)===0&&cr(e,0):wf|=a,or===Ae&&(or=0)),Li(e)}function $g(e,n){n===0&&(n=Ie()),e=ls(e,n),e!==null&&(Nn(e,n),Li(e))}function mS(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),$g(e,a)}function gS(e,n){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),$g(e,a)}function vS(e,n){return Ft(e,n)}var ac=null,fr=null,Ff=!1,sc=!1,Bf=!1,Ha=0;function Li(e){e!==fr&&e.next===null&&(fr===null?ac=fr=e:fr=fr.next=e),sc=!0,Ff||(Ff=!0,xS())}function Ao(e,n){if(!Bf&&sc){Bf=!0;do for(var a=!1,o=ac;o!==null;){if(e!==0){var u=o.pendingLanes;if(u===0)var h=0;else{var S=o.suspendedLanes,A=o.pingedLanes;h=(1<<31-Wt(42|e)+1)-1,h&=u&~(S&~A),h=h&201326741?h&201326741|1:h?h|2:0}h!==0&&(a=!0,i0(o,h))}else h=Ae,h=yt(o,o===Ye?h:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(h&3)===0||Ot(o,h)||(a=!0,i0(o,h));o=o.next}while(a);Bf=!1}}function _S(){t0()}function t0(){sc=Ff=!1;var e=0;Ha!==0&&wS()&&(e=Ha);for(var n=E(),a=null,o=ac;o!==null;){var u=o.next,h=e0(o,n);h===0?(o.next=null,a===null?ac=u:a.next=u,u===null&&(fr=a)):(a=o,(e!==0||(h&3)!==0)&&(sc=!0)),o=u}mn!==0&&mn!==5||Ao(e),Ha!==0&&(Ha=0)}function e0(e,n){for(var a=e.suspendedLanes,o=e.pingedLanes,u=e.expirationTimes,h=e.pendingLanes&-62914561;0<h;){var S=31-Wt(h),A=1<<S,G=u[S];G===-1?((A&a)===0||(A&o)!==0)&&(u[S]=he(A,n)):G<=n&&(e.expiredLanes|=A),h&=~A}if(n=Ye,a=Ae,a=yt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===n&&(Ve===2||Ve===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&ae(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Ot(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(o!==null&&ae(o),Ps(a)){case 2:case 8:a=Et;break;case 32:a=dt;break;case 268435456:a=Pt;break;default:a=dt}return o=n0.bind(null,e),a=Ft(a,o),e.callbackPriority=n,e.callbackNode=a,n}return o!==null&&o!==null&&ae(o),e.callbackPriority=2,e.callbackNode=null,2}function n0(e,n){if(mn!==0&&mn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(ic()&&e.callbackNode!==a)return null;var o=Ae;return o=yt(e,e===Ye?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Fg(e,o,n),e0(e,E()),e.callbackNode!=null&&e.callbackNode===a?n0.bind(null,e):null)}function i0(e,n){if(ic())return null;Fg(e,n,!0)}function xS(){US(function(){(ze&6)!==0?Ft(ht,_S):t0()})}function If(){if(Ha===0){var e=Ks;e===0&&(e=Ht,Ht<<=1,(Ht&261888)===0&&(Ht=256)),Ha=e}return Ha}function a0(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:dl(""+e)}function s0(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function SS(e,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var h=a0((u[Sn]||null).action),S=o.submitter;S&&(n=(n=S[Sn]||null)?a0(n.formAction):S.getAttribute("formAction"),n!==null&&(h=n,S=null));var A=new vl("action","action",null,o,u);e.push({event:A,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Ha!==0){var G=S?s0(u,S):new FormData(u);sf(a,{pending:!0,data:G,method:u.method,action:h},null,G)}}else typeof h=="function"&&(A.preventDefault(),G=S?s0(u,S):new FormData(u),sf(a,{pending:!0,data:G,method:u.method,action:h},h,G))},currentTarget:u}]})}}for(var Hf=0;Hf<yu.length;Hf++){var Vf=yu[Hf],yS=Vf.toLowerCase(),MS=Vf[0].toUpperCase()+Vf.slice(1);xi(yS,"on"+MS)}xi(zp,"onAnimationEnd"),xi(Fp,"onAnimationIteration"),xi(Bp,"onAnimationStart"),xi("dblclick","onDoubleClick"),xi("focusin","onFocus"),xi("focusout","onBlur"),xi(Bx,"onTransitionRun"),xi(Ix,"onTransitionStart"),xi(Hx,"onTransitionCancel"),xi(Ip,"onTransitionEnd"),Q("onMouseEnter",["mouseout","mouseover"]),Q("onMouseLeave",["mouseout","mouseover"]),Q("onPointerEnter",["pointerout","pointerover"]),Q("onPointerLeave",["pointerout","pointerover"]),at("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),at("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),at("onBeforeInput",["compositionend","keypress","textInput","paste"]),at("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),at("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),at("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ro="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ES=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ro));function r0(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],u=o.event;o=o.listeners;t:{var h=void 0;if(n)for(var S=o.length-1;0<=S;S--){var A=o[S],G=A.instance,nt=A.currentTarget;if(A=A.listener,G!==h&&u.isPropagationStopped())break t;h=A,u.currentTarget=nt;try{h(u)}catch(mt){Sl(mt)}u.currentTarget=null,h=G}else for(S=0;S<o.length;S++){if(A=o[S],G=A.instance,nt=A.currentTarget,A=A.listener,G!==h&&u.isPropagationStopped())break t;h=A,u.currentTarget=nt;try{h(u)}catch(mt){Sl(mt)}u.currentTarget=null,h=G}}}}function be(e,n){var a=n[zs];a===void 0&&(a=n[zs]=new Set);var o=e+"__bubble";a.has(o)||(o0(n,e,2,!1),a.add(o))}function Gf(e,n,a){var o=0;n&&(o|=4),o0(a,e,o,n)}var rc="_reactListening"+Math.random().toString(36).slice(2);function kf(e){if(!e[rc]){e[rc]=!0,j.forEach(function(a){a!=="selectionchange"&&(ES.has(a)||Gf(a,!1,e),Gf(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[rc]||(n[rc]=!0,Gf("selectionchange",!1,n))}}function o0(e,n,a,o){switch(z0(n)){case 2:var u=JS;break;case 8:u=QS;break;default:u=ah}a=u.bind(null,n,a,e),u=void 0,!lu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function Xf(e,n,a,o,u){var h=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var S=o.tag;if(S===3||S===4){var A=o.stateNode.containerInfo;if(A===u)break;if(S===4)for(S=o.return;S!==null;){var G=S.tag;if((G===3||G===4)&&S.stateNode.containerInfo===u)return;S=S.return}for(;A!==null;){if(S=ya(A),S===null)return;if(G=S.tag,G===5||G===6||G===26||G===27){o=h=S;continue t}A=A.parentNode}}o=o.return}hp(function(){var nt=h,mt=ru(a),St=[];t:{var st=Hp.get(e);if(st!==void 0){var ct=vl,Jt=e;switch(e){case"keypress":if(ml(a)===0)break t;case"keydown":case"keyup":ct=gx;break;case"focusin":Jt="focus",ct=hu;break;case"focusout":Jt="blur",ct=hu;break;case"beforeblur":case"afterblur":ct=hu;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ct=mp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ct=ax;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ct=xx;break;case zp:case Fp:case Bp:ct=ox;break;case Ip:ct=yx;break;case"scroll":case"scrollend":ct=nx;break;case"wheel":ct=Ex;break;case"copy":case"cut":case"paste":ct=cx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ct=vp;break;case"toggle":case"beforetoggle":ct=Tx}var ue=(n&4)!==0,qe=!ue&&(e==="scroll"||e==="scrollend"),Z=ue?st!==null?st+"Capture":null:st;ue=[];for(var X=nt,et;X!==null;){var _t=X;if(et=_t.stateNode,_t=_t.tag,_t!==5&&_t!==26&&_t!==27||et===null||Z===null||(_t=jr(X,Z),_t!=null&&ue.push(Co(X,_t,et))),qe)break;X=X.return}0<ue.length&&(st=new ct(st,Jt,null,a,mt),St.push({event:st,listeners:ue}))}}if((n&7)===0){t:{if(st=e==="mouseover"||e==="pointerover",ct=e==="mouseout"||e==="pointerout",st&&a!==su&&(Jt=a.relatedTarget||a.fromElement)&&(ya(Jt)||Jt[vi]))break t;if((ct||st)&&(st=mt.window===mt?mt:(st=mt.ownerDocument)?st.defaultView||st.parentWindow:window,ct?(Jt=a.relatedTarget||a.toElement,ct=nt,Jt=Jt?ya(Jt):null,Jt!==null&&(qe=c(Jt),ue=Jt.tag,Jt!==qe||ue!==5&&ue!==27&&ue!==6)&&(Jt=null)):(ct=null,Jt=nt),ct!==Jt)){if(ue=mp,_t="onMouseLeave",Z="onMouseEnter",X="mouse",(e==="pointerout"||e==="pointerover")&&(ue=vp,_t="onPointerLeave",Z="onPointerEnter",X="pointer"),qe=ct==null?st:as(ct),et=Jt==null?st:as(Jt),st=new ue(_t,X+"leave",ct,a,mt),st.target=qe,st.relatedTarget=et,_t=null,ya(mt)===nt&&(ue=new ue(Z,X+"enter",Jt,a,mt),ue.target=et,ue.relatedTarget=qe,_t=ue),qe=_t,ct&&Jt)e:{for(ue=bS,Z=ct,X=Jt,et=0,_t=Z;_t;_t=ue(_t))et++;_t=0;for(var re=X;re;re=ue(re))_t++;for(;0<et-_t;)Z=ue(Z),et--;for(;0<_t-et;)X=ue(X),_t--;for(;et--;){if(Z===X||X!==null&&Z===X.alternate){ue=Z;break e}Z=ue(Z),X=ue(X)}ue=null}else ue=null;ct!==null&&l0(St,st,ct,ue,!1),Jt!==null&&qe!==null&&l0(St,qe,Jt,ue,!0)}}t:{if(st=nt?as(nt):window,ct=st.nodeName&&st.nodeName.toLowerCase(),ct==="select"||ct==="input"&&st.type==="file")var Ne=Tp;else if(Ep(st))if(Ap)Ne=Px;else{Ne=Lx;var ie=Nx}else ct=st.nodeName,!ct||ct.toLowerCase()!=="input"||st.type!=="checkbox"&&st.type!=="radio"?nt&&_i(nt.elementType)&&(Ne=Tp):Ne=Ox;if(Ne&&(Ne=Ne(e,nt))){bp(St,Ne,a,mt);break t}ie&&ie(e,st,nt),e==="focusout"&&nt&&st.type==="number"&&nt.memoizedProps.value!=null&&Mn(st,"number",st.value)}switch(ie=nt?as(nt):window,e){case"focusin":(Ep(ie)||ie.contentEditable==="true")&&(Gs=ie,_u=nt,no=null);break;case"focusout":no=_u=Gs=null;break;case"mousedown":xu=!0;break;case"contextmenu":case"mouseup":case"dragend":xu=!1,Op(St,a,mt);break;case"selectionchange":if(Fx)break;case"keydown":case"keyup":Op(St,a,mt)}var Se;if(pu)t:{switch(e){case"compositionstart":var Re="onCompositionStart";break t;case"compositionend":Re="onCompositionEnd";break t;case"compositionupdate":Re="onCompositionUpdate";break t}Re=void 0}else Vs?yp(e,a)&&(Re="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Re="onCompositionStart");Re&&(_p&&a.locale!=="ko"&&(Vs||Re!=="onCompositionStart"?Re==="onCompositionEnd"&&Vs&&(Se=dp()):(ba=mt,cu="value"in ba?ba.value:ba.textContent,Vs=!0)),ie=oc(nt,Re),0<ie.length&&(Re=new gp(Re,e,null,a,mt),St.push({event:Re,listeners:ie}),Se?Re.data=Se:(Se=Mp(a),Se!==null&&(Re.data=Se)))),(Se=Rx?Cx(e,a):wx(e,a))&&(Re=oc(nt,"onBeforeInput"),0<Re.length&&(ie=new gp("onBeforeInput","beforeinput",null,a,mt),St.push({event:ie,listeners:Re}),ie.data=Se)),SS(St,e,nt,a,mt)}r0(St,n)})}function Co(e,n,a){return{instance:e,listener:n,currentTarget:a}}function oc(e,n){for(var a=n+"Capture",o=[];e!==null;){var u=e,h=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||h===null||(u=jr(e,a),u!=null&&o.unshift(Co(e,u,h)),u=jr(e,n),u!=null&&o.push(Co(e,u,h))),e.tag===3)return o;e=e.return}return[]}function bS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function l0(e,n,a,o,u){for(var h=n._reactName,S=[];a!==null&&a!==o;){var A=a,G=A.alternate,nt=A.stateNode;if(A=A.tag,G!==null&&G===o)break;A!==5&&A!==26&&A!==27||nt===null||(G=nt,u?(nt=jr(a,h),nt!=null&&S.unshift(Co(a,nt,G))):u||(nt=jr(a,h),nt!=null&&S.push(Co(a,nt,G)))),a=a.return}S.length!==0&&e.push({event:n,listeners:S})}var TS=/\r\n?/g,AS=/\u0000|\uFFFD/g;function c0(e){return(typeof e=="string"?e:""+e).replace(TS,`
`).replace(AS,"")}function u0(e,n){return n=c0(n),c0(e)===n}function We(e,n,a,o,u,h){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||pn(e,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&pn(e,""+o);break;case"className":oe(e,"class",o);break;case"tabIndex":oe(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":oe(e,a,o);break;case"style":Bs(e,o,h);break;case"data":if(n!=="object"){oe(e,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=dl(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof h=="function"&&(a==="formAction"?(n!=="input"&&We(e,n,"name",u.name,u,null),We(e,n,"formEncType",u.formEncType,u,null),We(e,n,"formMethod",u.formMethod,u,null),We(e,n,"formTarget",u.formTarget,u,null)):(We(e,n,"encType",u.encType,u,null),We(e,n,"method",u.method,u,null),We(e,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=dl(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"onScroll":o!=null&&be("scroll",e);break;case"onScrollEnd":o!=null&&be("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=dl(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":be("beforetoggle",e),be("toggle",e),ee(e,"popover",o);break;case"xlinkActuate":ne(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":ne(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":ne(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":ne(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":ne(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":ne(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":ne(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":ne(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":ne(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":ee(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=tx.get(a)||a,ee(e,a,o))}}function Wf(e,n,a,o,u,h){switch(a){case"style":Bs(e,o,h);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof o=="string"?pn(e,o):(typeof o=="number"||typeof o=="bigint")&&pn(e,""+o);break;case"onScroll":o!=null&&be("scroll",e);break;case"onScrollEnd":o!=null&&be("scrollend",e);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!lt.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),h=e[Sn]||null,h=h!=null?h[a]:null,typeof h=="function"&&e.removeEventListener(n,h,u),typeof o=="function")){typeof h!="function"&&h!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,o,u);break t}a in e?e[a]=o:o===!0?e.setAttribute(a,""):ee(e,a,o)}}}function wn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":be("error",e),be("load",e);var o=!1,u=!1,h;for(h in a)if(a.hasOwnProperty(h)){var S=a[h];if(S!=null)switch(h){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:We(e,n,h,S,a,null)}}u&&We(e,n,"srcSet",a.srcSet,a,null),o&&We(e,n,"src",a.src,a,null);return;case"input":be("invalid",e);var A=h=S=u=null,G=null,nt=null;for(o in a)if(a.hasOwnProperty(o)){var mt=a[o];if(mt!=null)switch(o){case"name":u=mt;break;case"type":S=mt;break;case"checked":G=mt;break;case"defaultChecked":nt=mt;break;case"value":h=mt;break;case"defaultValue":A=mt;break;case"children":case"dangerouslySetInnerHTML":if(mt!=null)throw Error(s(137,n));break;default:We(e,n,o,mt,a,null)}}qi(e,h,A,G,nt,S,u,!1);return;case"select":be("invalid",e),o=S=h=null;for(u in a)if(a.hasOwnProperty(u)&&(A=a[u],A!=null))switch(u){case"value":h=A;break;case"defaultValue":S=A;break;case"multiple":o=A;default:We(e,n,u,A,a,null)}n=h,a=S,e.multiple=!!o,n!=null?si(e,!!o,n,!1):a!=null&&si(e,!!o,a,!0);return;case"textarea":be("invalid",e),h=u=o=null;for(S in a)if(a.hasOwnProperty(S)&&(A=a[S],A!=null))switch(S){case"value":o=A;break;case"defaultValue":u=A;break;case"children":h=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(s(91));break;default:We(e,n,S,A,a,null)}En(e,o,u,h);return;case"option":for(G in a)if(a.hasOwnProperty(G)&&(o=a[G],o!=null))switch(G){case"selected":e.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:We(e,n,G,o,a,null)}return;case"dialog":be("beforetoggle",e),be("toggle",e),be("cancel",e),be("close",e);break;case"iframe":case"object":be("load",e);break;case"video":case"audio":for(o=0;o<Ro.length;o++)be(Ro[o],e);break;case"image":be("error",e),be("load",e);break;case"details":be("toggle",e);break;case"embed":case"source":case"link":be("error",e),be("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(nt in a)if(a.hasOwnProperty(nt)&&(o=a[nt],o!=null))switch(nt){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:We(e,n,nt,o,a,null)}return;default:if(_i(n)){for(mt in a)a.hasOwnProperty(mt)&&(o=a[mt],o!==void 0&&Wf(e,n,mt,o,a,void 0));return}}for(A in a)a.hasOwnProperty(A)&&(o=a[A],o!=null&&We(e,n,A,o,a,null))}function RS(e,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,h=null,S=null,A=null,G=null,nt=null,mt=null;for(ct in a){var St=a[ct];if(a.hasOwnProperty(ct)&&St!=null)switch(ct){case"checked":break;case"value":break;case"defaultValue":G=St;default:o.hasOwnProperty(ct)||We(e,n,ct,null,o,St)}}for(var st in o){var ct=o[st];if(St=a[st],o.hasOwnProperty(st)&&(ct!=null||St!=null))switch(st){case"type":h=ct;break;case"name":u=ct;break;case"checked":nt=ct;break;case"defaultChecked":mt=ct;break;case"value":S=ct;break;case"defaultValue":A=ct;break;case"children":case"dangerouslySetInnerHTML":if(ct!=null)throw Error(s(137,n));break;default:ct!==St&&We(e,n,st,ct,o,St)}}yn(e,S,A,G,nt,mt,h,u);return;case"select":ct=S=A=st=null;for(h in a)if(G=a[h],a.hasOwnProperty(h)&&G!=null)switch(h){case"value":break;case"multiple":ct=G;default:o.hasOwnProperty(h)||We(e,n,h,null,o,G)}for(u in o)if(h=o[u],G=a[u],o.hasOwnProperty(u)&&(h!=null||G!=null))switch(u){case"value":st=h;break;case"defaultValue":A=h;break;case"multiple":S=h;default:h!==G&&We(e,n,u,h,o,G)}n=A,a=S,o=ct,st!=null?si(e,!!a,st,!1):!!o!=!!a&&(n!=null?si(e,!!a,n,!0):si(e,!!a,a?[]:"",!1));return;case"textarea":ct=st=null;for(A in a)if(u=a[A],a.hasOwnProperty(A)&&u!=null&&!o.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:We(e,n,A,null,o,u)}for(S in o)if(u=o[S],h=a[S],o.hasOwnProperty(S)&&(u!=null||h!=null))switch(S){case"value":st=u;break;case"defaultValue":ct=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==h&&We(e,n,S,u,o,h)}He(e,st,ct);return;case"option":for(var Jt in a)if(st=a[Jt],a.hasOwnProperty(Jt)&&st!=null&&!o.hasOwnProperty(Jt))switch(Jt){case"selected":e.selected=!1;break;default:We(e,n,Jt,null,o,st)}for(G in o)if(st=o[G],ct=a[G],o.hasOwnProperty(G)&&st!==ct&&(st!=null||ct!=null))switch(G){case"selected":e.selected=st&&typeof st!="function"&&typeof st!="symbol";break;default:We(e,n,G,st,o,ct)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ue in a)st=a[ue],a.hasOwnProperty(ue)&&st!=null&&!o.hasOwnProperty(ue)&&We(e,n,ue,null,o,st);for(nt in o)if(st=o[nt],ct=a[nt],o.hasOwnProperty(nt)&&st!==ct&&(st!=null||ct!=null))switch(nt){case"children":case"dangerouslySetInnerHTML":if(st!=null)throw Error(s(137,n));break;default:We(e,n,nt,st,o,ct)}return;default:if(_i(n)){for(var qe in a)st=a[qe],a.hasOwnProperty(qe)&&st!==void 0&&!o.hasOwnProperty(qe)&&Wf(e,n,qe,void 0,o,st);for(mt in o)st=o[mt],ct=a[mt],!o.hasOwnProperty(mt)||st===ct||st===void 0&&ct===void 0||Wf(e,n,mt,st,o,ct);return}}for(var Z in a)st=a[Z],a.hasOwnProperty(Z)&&st!=null&&!o.hasOwnProperty(Z)&&We(e,n,Z,null,o,st);for(St in o)st=o[St],ct=a[St],!o.hasOwnProperty(St)||st===ct||st==null&&ct==null||We(e,n,St,st,o,ct)}function f0(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function CS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],h=u.transferSize,S=u.initiatorType,A=u.duration;if(h&&A&&f0(S)){for(S=0,A=u.responseEnd,o+=1;o<a.length;o++){var G=a[o],nt=G.startTime;if(nt>A)break;var mt=G.transferSize,St=G.initiatorType;mt&&f0(St)&&(G=G.responseEnd,S+=mt*(G<A?1:(A-nt)/(G-nt)))}if(--o,n+=8*(h+S)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var qf=null,Yf=null;function lc(e){return e.nodeType===9?e:e.ownerDocument}function h0(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function d0(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function jf(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Zf=null;function wS(){var e=window.event;return e&&e.type==="popstate"?e===Zf?!1:(Zf=e,!0):(Zf=null,!1)}var p0=typeof setTimeout=="function"?setTimeout:void 0,DS=typeof clearTimeout=="function"?clearTimeout:void 0,m0=typeof Promise=="function"?Promise:void 0,US=typeof queueMicrotask=="function"?queueMicrotask:typeof m0<"u"?function(e){return m0.resolve(null).then(e).catch(NS)}:p0;function NS(e){setTimeout(function(){throw e})}function Va(e){return e==="head"}function g0(e,n){var a=n,o=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(u),mr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")wo(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,wo(a);for(var h=a.firstChild;h;){var S=h.nextSibling,A=h.nodeName;h[is]||A==="SCRIPT"||A==="STYLE"||A==="LINK"&&h.rel.toLowerCase()==="stylesheet"||a.removeChild(h),h=S}}else a==="body"&&wo(e.ownerDocument.body);a=u}while(a);mr(n)}function v0(e,n){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function Kf(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Kf(a),Yr(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function LS(e,n,a,o){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[is])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(h=e.getAttribute("rel"),h==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(h!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(h=e.getAttribute("src"),(h!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&h&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var h=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===h)return e}else return e;if(e=hi(e.nextSibling),e===null)break}return null}function OS(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=hi(e.nextSibling),e===null))return null;return e}function _0(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=hi(e.nextSibling),e===null))return null;return e}function Jf(e){return e.data==="$?"||e.data==="$~"}function Qf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function PS(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function hi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var $f=null;function x0(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return hi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function S0(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function y0(e,n,a){switch(n=lc(a),e){case"html":if(e=n.documentElement,!e)throw Error(s(452));return e;case"head":if(e=n.head,!e)throw Error(s(453));return e;case"body":if(e=n.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function wo(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);Yr(e)}var di=new Map,M0=new Set;function cc(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ca=H.d;H.d={f:zS,r:FS,D:BS,C:IS,L:HS,m:VS,X:kS,S:GS,M:XS};function zS(){var e=ca.f(),n=tc();return e||n}function FS(e){var n=Ma(e);n!==null&&n.tag===5&&n.type==="form"?Im(n):ca.r(e)}var hr=typeof document>"u"?null:document;function E0(e,n,a){var o=hr;if(o&&typeof n=="string"&&n){var u=de(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),M0.has(u)||(M0.add(u),e={rel:e,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),wn(n,"link",e),R(n),o.head.appendChild(n)))}}function BS(e){ca.D(e),E0("dns-prefetch",e,null)}function IS(e,n){ca.C(e,n),E0("preconnect",e,n)}function HS(e,n,a){ca.L(e,n,a);var o=hr;if(o&&e&&n){var u='link[rel="preload"][as="'+de(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+de(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+de(a.imageSizes)+'"]')):u+='[href="'+de(e)+'"]';var h=u;switch(n){case"style":h=dr(e);break;case"script":h=pr(e)}di.has(h)||(e=v({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),di.set(h,e),o.querySelector(u)!==null||n==="style"&&o.querySelector(Do(h))||n==="script"&&o.querySelector(Uo(h))||(n=o.createElement("link"),wn(n,"link",e),R(n),o.head.appendChild(n)))}}function VS(e,n){ca.m(e,n);var a=hr;if(a&&e){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+de(o)+'"][href="'+de(e)+'"]',h=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":h=pr(e)}if(!di.has(h)&&(e=v({rel:"modulepreload",href:e},n),di.set(h,e),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Uo(h)))return}o=a.createElement("link"),wn(o,"link",e),R(o),a.head.appendChild(o)}}}function GS(e,n,a){ca.S(e,n,a);var o=hr;if(o&&e){var u=Ea(o).hoistableStyles,h=dr(e);n=n||"default";var S=u.get(h);if(!S){var A={loading:0,preload:null};if(S=o.querySelector(Do(h)))A.loading=5;else{e=v({rel:"stylesheet",href:e,"data-precedence":n},a),(a=di.get(h))&&th(e,a);var G=S=o.createElement("link");R(G),wn(G,"link",e),G._p=new Promise(function(nt,mt){G.onload=nt,G.onerror=mt}),G.addEventListener("load",function(){A.loading|=1}),G.addEventListener("error",function(){A.loading|=2}),A.loading|=4,uc(S,n,o)}S={type:"stylesheet",instance:S,count:1,state:A},u.set(h,S)}}}function kS(e,n){ca.X(e,n);var a=hr;if(a&&e){var o=Ea(a).hoistableScripts,u=pr(e),h=o.get(u);h||(h=a.querySelector(Uo(u)),h||(e=v({src:e,async:!0},n),(n=di.get(u))&&eh(e,n),h=a.createElement("script"),R(h),wn(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},o.set(u,h))}}function XS(e,n){ca.M(e,n);var a=hr;if(a&&e){var o=Ea(a).hoistableScripts,u=pr(e),h=o.get(u);h||(h=a.querySelector(Uo(u)),h||(e=v({src:e,async:!0,type:"module"},n),(n=di.get(u))&&eh(e,n),h=a.createElement("script"),R(h),wn(h,"link",e),a.head.appendChild(h)),h={type:"script",instance:h,count:1,state:null},o.set(u,h))}}function b0(e,n,a,o){var u=(u=it.current)?cc(u):null;if(!u)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=dr(a.href),a=Ea(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=dr(a.href);var h=Ea(u).hoistableStyles,S=h.get(e);if(S||(u=u.ownerDocument||u,S={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},h.set(e,S),(h=u.querySelector(Do(e)))&&!h._p&&(S.instance=h,S.state.loading=5),di.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},di.set(e,a),h||WS(u,e,a,S.state))),n&&o===null)throw Error(s(528,""));return S}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=pr(a),a=Ea(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function dr(e){return'href="'+de(e)+'"'}function Do(e){return'link[rel="stylesheet"]['+e+"]"}function T0(e){return v({},e,{"data-precedence":e.precedence,precedence:null})}function WS(e,n,a,o){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=e.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),wn(n,"link",a),R(n),e.head.appendChild(n))}function pr(e){return'[src="'+de(e)+'"]'}function Uo(e){return"script[async]"+e}function A0(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=e.querySelector('style[data-href~="'+de(a.href)+'"]');if(o)return n.instance=o,R(o),o;var u=v({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),R(o),wn(o,"style",u),uc(o,a.precedence,e),n.instance=o;case"stylesheet":u=dr(a.href);var h=e.querySelector(Do(u));if(h)return n.state.loading|=4,n.instance=h,R(h),h;o=T0(a),(u=di.get(u))&&th(o,u),h=(e.ownerDocument||e).createElement("link"),R(h);var S=h;return S._p=new Promise(function(A,G){S.onload=A,S.onerror=G}),wn(h,"link",o),n.state.loading|=4,uc(h,a.precedence,e),n.instance=h;case"script":return h=pr(a.src),(u=e.querySelector(Uo(h)))?(n.instance=u,R(u),u):(o=a,(u=di.get(h))&&(o=v({},a),eh(o,u)),e=e.ownerDocument||e,u=e.createElement("script"),R(u),wn(u,"link",o),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,uc(o,a.precedence,e));return n.instance}function uc(e,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,h=u,S=0;S<o.length;S++){var A=o[S];if(A.dataset.precedence===n)h=A;else if(h!==u)break}h?h.parentNode.insertBefore(e,h.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function th(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function eh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var fc=null;function R0(e,n,a){if(fc===null){var o=new Map,u=fc=new Map;u.set(a,o)}else u=fc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var h=a[u];if(!(h[is]||h[on]||e==="link"&&h.getAttribute("rel")==="stylesheet")&&h.namespaceURI!=="http://www.w3.org/2000/svg"){var S=h.getAttribute(n)||"";S=e+S;var A=o.get(S);A?A.push(h):o.set(S,[h])}}return o}function C0(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function qS(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function w0(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function YS(e,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=dr(o.href),h=n.querySelector(Do(u));if(h){n=h._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=hc.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=h,R(h);return}h=n.ownerDocument||n,o=T0(o),(u=di.get(u))&&th(o,u),h=h.createElement("link"),R(h);var S=h;S._p=new Promise(function(A,G){S.onload=A,S.onerror=G}),wn(h,"link",o),a.instance=h}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=hc.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var nh=0;function jS(e,n){return e.stylesheets&&e.count===0&&pc(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&pc(e,e.stylesheets),e.unsuspend){var h=e.unsuspend;e.unsuspend=null,h()}},6e4+n);0<e.imgBytes&&nh===0&&(nh=62500*CS());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&pc(e,e.stylesheets),e.unsuspend)){var h=e.unsuspend;e.unsuspend=null,h()}},(e.imgBytes>nh?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function hc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)pc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var dc=null;function pc(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,dc=new Map,n.forEach(ZS,e),dc=null,hc.call(e))}function ZS(e,n){if(!(n.state.loading&4)){var a=dc.get(e);if(a)var o=a.get(null);else{a=new Map,dc.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),h=0;h<u.length;h++){var S=u[h];(S.nodeName==="LINK"||S.getAttribute("media")!=="not all")&&(a.set(S.dataset.precedence,S),o=S)}o&&a.set(null,o)}u=n.instance,S=u.getAttribute("data-precedence"),h=a.get(S)||o,h===o&&a.set(null,u),a.set(S,u),this.count++,o=hc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),h?h.parentNode.insertBefore(u,h.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var No={$$typeof:U,Provider:null,Consumer:null,_currentValue:tt,_currentValue2:tt,_threadCount:0};function KS(e,n,a,o,u,h,S,A,G){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=we(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=we(0),this.hiddenUpdates=we(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=h,this.onRecoverableError=S,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=G,this.incompleteTransitions=new Map}function D0(e,n,a,o,u,h,S,A,G,nt,mt,St){return e=new KS(e,n,a,S,G,nt,mt,St,A),n=1,h===!0&&(n|=24),h=Zn(3,null,null,n),e.current=h,h.stateNode=e,n=Ou(),n.refCount++,e.pooledCache=n,n.refCount++,h.memoizedState={element:o,isDehydrated:a,cache:n},Bu(h),e}function U0(e){return e?(e=Ws,e):Ws}function N0(e,n,a,o,u,h){u=U0(u),o.context===null?o.context=u:o.pendingContext=u,o=Da(n),o.payload={element:a},h=h===void 0?null:h,h!==null&&(o.callback=h),a=Ua(e,o,n),a!==null&&(Xn(a,e,n),co(a,e,n))}function L0(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function ih(e,n){L0(e,n),(e=e.alternate)&&L0(e,n)}function O0(e){if(e.tag===13||e.tag===31){var n=ls(e,67108864);n!==null&&Xn(n,e,67108864),ih(e,67108864)}}function P0(e){if(e.tag===13||e.tag===31){var n=ti();n=Xr(n);var a=ls(e,n);a!==null&&Xn(a,e,n),ih(e,n)}}var mc=!0;function JS(e,n,a,o){var u=I.T;I.T=null;var h=H.p;try{H.p=2,ah(e,n,a,o)}finally{H.p=h,I.T=u}}function QS(e,n,a,o){var u=I.T;I.T=null;var h=H.p;try{H.p=8,ah(e,n,a,o)}finally{H.p=h,I.T=u}}function ah(e,n,a,o){if(mc){var u=sh(o);if(u===null)Xf(e,n,o,gc,a),F0(e,o);else if(ty(u,e,n,a,o))o.stopPropagation();else if(F0(e,o),n&4&&-1<$S.indexOf(e)){for(;u!==null;){var h=Ma(u);if(h!==null)switch(h.tag){case 3:if(h=h.stateNode,h.current.memoizedState.isDehydrated){var S=At(h.pendingLanes);if(S!==0){var A=h;for(A.pendingLanes|=2,A.entangledLanes|=2;S;){var G=1<<31-Wt(S);A.entanglements[1]|=G,S&=~G}Li(h),(ze&6)===0&&(Ql=E()+500,Ao(0))}}break;case 31:case 13:A=ls(h,2),A!==null&&Xn(A,h,2),tc(),ih(h,2)}if(h=sh(o),h===null&&Xf(e,n,o,gc,a),h===u)break;u=h}u!==null&&o.stopPropagation()}else Xf(e,n,o,null,a)}}function sh(e){return e=ru(e),rh(e)}var gc=null;function rh(e){if(gc=null,e=ya(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=f(n),e!==null)return e;e=null}else if(a===31){if(e=d(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return gc=e,null}function z0(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(q()){case ht:return 2;case Et:return 8;case dt:case te:return 32;case Pt:return 268435456;default:return 32}default:return 32}}var oh=!1,Ga=null,ka=null,Xa=null,Lo=new Map,Oo=new Map,Wa=[],$S="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function F0(e,n){switch(e){case"focusin":case"focusout":Ga=null;break;case"dragenter":case"dragleave":ka=null;break;case"mouseover":case"mouseout":Xa=null;break;case"pointerover":case"pointerout":Lo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Oo.delete(n.pointerId)}}function Po(e,n,a,o,u,h){return e===null||e.nativeEvent!==h?(e={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:h,targetContainers:[u]},n!==null&&(n=Ma(n),n!==null&&O0(n)),e):(e.eventSystemFlags|=o,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function ty(e,n,a,o,u){switch(n){case"focusin":return Ga=Po(Ga,e,n,a,o,u),!0;case"dragenter":return ka=Po(ka,e,n,a,o,u),!0;case"mouseover":return Xa=Po(Xa,e,n,a,o,u),!0;case"pointerover":var h=u.pointerId;return Lo.set(h,Po(Lo.get(h)||null,e,n,a,o,u)),!0;case"gotpointercapture":return h=u.pointerId,Oo.set(h,Po(Oo.get(h)||null,e,n,a,o,u)),!0}return!1}function B0(e){var n=ya(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=f(a),n!==null){e.blockedOn=n,wi(e.priority,function(){P0(a)});return}}else if(n===31){if(n=d(a),n!==null){e.blockedOn=n,wi(e.priority,function(){P0(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function vc(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=sh(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);su=o,a.target.dispatchEvent(o),su=null}else return n=Ma(a),n!==null&&O0(n),e.blockedOn=a,!1;n.shift()}return!0}function I0(e,n,a){vc(e)&&a.delete(n)}function ey(){oh=!1,Ga!==null&&vc(Ga)&&(Ga=null),ka!==null&&vc(ka)&&(ka=null),Xa!==null&&vc(Xa)&&(Xa=null),Lo.forEach(I0),Oo.forEach(I0)}function _c(e,n){e.blockedOn===n&&(e.blockedOn=null,oh||(oh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,ey)))}var xc=null;function H0(e){xc!==e&&(xc=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){xc===e&&(xc=null);for(var n=0;n<e.length;n+=3){var a=e[n],o=e[n+1],u=e[n+2];if(typeof o!="function"){if(rh(o||a)===null)continue;break}var h=Ma(a);h!==null&&(e.splice(n,3),n-=3,sf(h,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function mr(e){function n(G){return _c(G,e)}Ga!==null&&_c(Ga,e),ka!==null&&_c(ka,e),Xa!==null&&_c(Xa,e),Lo.forEach(n),Oo.forEach(n);for(var a=0;a<Wa.length;a++){var o=Wa[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<Wa.length&&(a=Wa[0],a.blockedOn===null);)B0(a),a.blockedOn===null&&Wa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],h=a[o+1],S=u[Sn]||null;if(typeof h=="function")S||H0(a);else if(S){var A=null;if(h&&h.hasAttribute("formAction")){if(u=h,S=h[Sn]||null)A=S.formAction;else if(rh(u)!==null)continue}else A=S.action;typeof A=="function"?a[o+1]=A:(a.splice(o,3),o-=3),H0(a)}}}function V0(){function e(h){h.canIntercept&&h.info==="react-transition"&&h.intercept({handler:function(){return new Promise(function(S){return u=S})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var h=navigation.currentEntry;h&&h.url!=null&&navigation.navigate(h.url,{state:h.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function lh(e){this._internalRoot=e}Sc.prototype.render=lh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=ti();N0(a,o,e,n,null,null)},Sc.prototype.unmount=lh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;N0(e.current,2,null,e,null,null),tc(),n[vi]=null}};function Sc(e){this._internalRoot=e}Sc.prototype.unstable_scheduleHydration=function(e){if(e){var n=Wr();e={blockedOn:null,target:e,priority:n};for(var a=0;a<Wa.length&&n!==0&&n<Wa[a].priority;a++);Wa.splice(a,0,e),a===0&&B0(e)}};var G0=t.version;if(G0!=="19.2.4")throw Error(s(527,G0,"19.2.4"));H.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=p(n),e=e!==null?g(e):null,e=e===null?null:e.stateNode,e};var ny={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:I,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var yc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yc.isDisabled&&yc.supportsFiber)try{Tt=yc.inject(ny),wt=yc}catch{}}return Fo.createRoot=function(e,n){if(!l(e))throw Error(s(299));var a=!1,o="",u=Zm,h=Km,S=Jm;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(h=n.onCaughtError),n.onRecoverableError!==void 0&&(S=n.onRecoverableError)),n=D0(e,1,!1,null,null,a,o,null,u,h,S,V0),e[vi]=n.current,kf(e),new lh(n)},Fo.hydrateRoot=function(e,n,a){if(!l(e))throw Error(s(299));var o=!1,u="",h=Zm,S=Km,A=Jm,G=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(h=a.onUncaughtError),a.onCaughtError!==void 0&&(S=a.onCaughtError),a.onRecoverableError!==void 0&&(A=a.onRecoverableError),a.formState!==void 0&&(G=a.formState)),n=D0(e,1,!0,n,a??null,o,u,G,h,S,A,V0),n.context=U0(null),a=n.current,o=ti(),o=Xr(o),u=Da(o),u.callback=null,Ua(a,u,o),a=o,n.current.lanes=a,Nn(n,a),Li(n),e[vi]=n.current,kf(e),new Sc(n)},Fo.version="19.2.4",Fo}var $0;function py(){if($0)return fh.exports;$0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),fh.exports=dy(),fh.exports}var my=py();function gy(){const[r,t]=Ct.useState(""),[i,s]=Ct.useState(!1);return Ct.useEffect(()=>{fetch("/api/url").then(l=>l.json()).then(l=>t(l.url)).catch(()=>t("(unavailable)"))},[]),pt.jsxs("div",{className:"qr-card",children:[pt.jsx("h2",{className:"qr-title",children:"Connect"}),i?pt.jsxs("div",{className:"qr-placeholder",children:[pt.jsx("span",{children:"QR unavailable"}),pt.jsx("span",{className:"qr-hint",children:"Server may not be running"})]}):pt.jsx("img",{className:"qr-image",src:"/api/qr",alt:"QR Code",onError:()=>s(!0)}),pt.jsx("p",{className:"qr-url",children:r})]})}const tv=1e3,vy=2e3,_y={debug:{color:"#888"},info:{color:"#4FC3F7"},warn:{color:"#FFB74D"},warning:{color:"#FFB74D"},error:{color:"#EF5350"},critical:{color:"#EF5350",bold:!0}};function xy(r){const t=_y[r.toLowerCase()]??{color:"#e0e0e0"};return{color:t.color,fontWeight:t.bold?"bold":"normal"}}function Sy(r){try{const t=new Date(r);if(!isNaN(t.getTime())){const i=String(t.getHours()).padStart(2,"0"),s=String(t.getMinutes()).padStart(2,"0"),l=String(t.getSeconds()).padStart(2,"0"),c=String(t.getMilliseconds()).padStart(3,"0");return`${i}:${s}:${l}.${c}`}}catch{}return r}let yy=0;function My({onConnectionChange:r,sessionFilter:t,onState:i}){const[s,l]=Ct.useState([]),c=Ct.useRef(null),f=Ct.useRef(null),d=Ct.useRef(!1),m=Ct.useCallback(()=>{const g=f.current;if(!g)return;const x=g.scrollHeight-g.scrollTop-g.clientHeight<40;d.current=!x},[]),p=Ct.useMemo(()=>t===null?s:s.filter(g=>!g.session||g.session===t),[s,t]);return Ct.useEffect(()=>{var g;d.current||(g=c.current)==null||g.scrollIntoView({behavior:"smooth"})},[p]),Ct.useEffect(()=>{let g=null,v=null,x=!1;function y(){if(x)return;const C=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws/logs`;g=new WebSocket(C),g.onopen=()=>{x||r(!0)},g.onclose=()=>{x||(r(!1),v=setTimeout(y,vy))},g.onerror=()=>{},g.onmessage=M=>{var _,z;try{const U=JSON.parse(M.data);if(U.type==="state"){i(U);return}const N={...U,id:yy++};l(B=>{const L=[...B,N];return L.length>tv?L.slice(L.length-tv):L})}catch(U){console.error("LogViewer message error:",U,(z=(_=M.data)==null?void 0:_.substring)==null?void 0:z.call(_,0,200))}}}return y(),()=>{x=!0,v&&clearTimeout(v),g&&(g.onclose=null,g.close()),r(!1)}},[r,i]),pt.jsxs("div",{className:"log-viewer",ref:f,onScroll:m,children:[s.length>0&&pt.jsx("button",{className:"log-clear-btn",onClick:()=>l([]),title:"Clear log",children:pt.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:[pt.jsx("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"}),pt.jsx("path",{fillRule:"evenodd",d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"})]})}),p.length===0&&pt.jsx("div",{className:"log-empty",children:"Waiting for log messages..."}),p.map(g=>{const v=xy(g.level);return pt.jsxs("div",{className:"log-line",children:[pt.jsx("span",{className:"log-ts",children:Sy(g.ts)}),"	",pt.jsx("span",{className:"log-level",style:v,children:g.level.toUpperCase()}),"	",g.session&&t===null&&pt.jsxs(pt.Fragment,{children:[pt.jsx("span",{className:"log-session",children:g.session}),"	"]}),pt.jsx("span",{className:"log-msg",style:{fontWeight:v.fontWeight},children:g.msg})]},g.id)}),pt.jsx("div",{ref:c})]})}function Ey(r){if(r.type==="enum"&&typeof r.value=="number"&&Array.isArray(r.labels))return{type:"enum",name:r.name,value:r.value,default:r.default??0,labels:r.labels};if(r.type==="vec2"&&Array.isArray(r.value)&&r.value.length===2)return{type:"vec2",name:r.name,value:r.value,default:r.default??[0,0],speed:r.speed??1,xDir:r.xDir??"right",yDir:r.yDir??"down"};if(r.type==="axis"&&typeof r.value=="number"&&Array.isArray(r.axis))return{type:"axis",name:r.name,value:r.value,default:r.default??0,scale:r.scale??"linear",axis:r.axis};if(Array.isArray(r.value)&&(r.value.length===3||r.value.length===4)&&r.value.every(t=>typeof t=="number")){const t=r.value,i=r.default??[0,0,0,1];return{type:"color",name:r.name,value:[t[0],t[1],t[2],t[3]??1],default:[i[0],i[1],i[2],i[3]??1]}}return typeof r.value=="number"?{type:"number",name:r.name,value:r.value,default:r.default??0,scale:r.scale??"linear",speed:r.speed??1}:null}function by(r){const t=new Map;for(const i of r){const s=i.name.indexOf("."),l=s>0?i.name.substring(0,s):"other";t.has(l)||t.set(l,[]),t.get(l).push(i)}return t}function sl(r){const t=r.name.indexOf(".");return t>0?r.name.substring(t+1):r.name}function Qc(r){const t=Math.abs(r);return t<1e-9?1e-6:Math.pow(10,Math.floor(Math.log10(t))-2)}function Jo(r,t){return Math.round(r/t)*t}function es(r,t){if(t!==void 0){if(r=Jo(r,t),Math.abs(r)<t*.5)return"0";const s=Math.max(0,-Math.floor(Math.log10(t)-.5));return Bo(r.toFixed(s))}if(r===0)return"0";const i=Math.abs(r);return i>=100?Bo(r.toFixed(1)):i>=10?Bo(r.toFixed(2)):i>=1?Bo(r.toFixed(3)):i>=.1?Bo(r.toFixed(4)):r.toPrecision(3)}function Bo(r){return r.includes(".")?r.replace(/\.?0+$/,""):r}function Ty(r){const t=Math.round(Math.max(0,Math.min(1,r[0]))*255),i=Math.round(Math.max(0,Math.min(1,r[1]))*255),s=Math.round(Math.max(0,Math.min(1,r[2]))*255);return`#${t.toString(16).padStart(2,"0")}${i.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`}function Ay(r){const t=parseInt(r.slice(1,3),16)/255,i=parseInt(r.slice(3,5),16)/255,s=parseInt(r.slice(5,7),16)/255;return[t,i,s]}function Ry({tweak:r,onChange:t,onChangeStart:i,onChangeEnd:s,onReset:l}){const[c,f]=Ct.useState(!1),[d,m]=Ct.useState(""),p=Ct.useRef(null),g=Ct.useRef(!1),v=Ct.useRef(0),x=Ct.useRef(0),y=Ct.useRef(!1),b=Qc(r.default),C=r.default!==void 0&&r.value!==r.default,M=Ct.useCallback(B=>{if(B.button!==0||c)return;B.preventDefault(),g.current=!0,y.current=!1,v.current=B.clientX,x.current=r.value,i(r.name),document.body.style.cursor="ew-resize",document.body.style.userSelect="none";const L=k=>{if(!g.current)return;const T=k.clientX-v.current;if(Math.abs(T)>2&&(y.current=!0),!y.current)return;const w=k.shiftKey?.1:1,V=(r.speed||1)*w;let J;if(r.scale==="log")J=x.current*Math.pow(2,V*T/100),J<1e-6&&(J=1e-6);else{const Y=Math.max(Math.abs(x.current),.01);J=x.current+V*Y*T/100}t(r.name,Jo(J,b))},D=()=>{g.current=!1,document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",L),window.removeEventListener("mouseup",D),y.current?s(r.name,r.value):(m(es(r.value,b)),f(!0))};window.addEventListener("mousemove",L),window.addEventListener("mouseup",D)},[r,c,t,i,s,b]),_=Ct.useCallback(()=>{f(!1);const B=parseFloat(d);isNaN(B)||(i(r.name),t(r.name,B),s(r.name,B))},[d,r.name,t,i,s]),z=Ct.useCallback(B=>{B.key==="Enter"?_():B.key==="Escape"&&f(!1)},[_]);Ct.useEffect(()=>{c&&p.current&&(p.current.focus(),p.current.select())},[c]);const U=r.default&&r.default!==0?r.value/r.default:1,N=Math.min(Math.max(U*50,0),100);return pt.jsxs("div",{className:"tweak-row",children:[pt.jsx("span",{className:`tweak-name ${C?"tweak-modified":""}`,children:sl(r)}),pt.jsxs("div",{className:"tweak-field",onMouseDown:M,onContextMenu:B=>{B.preventDefault(),l(r.name)},title:"Drag to adjust, click to edit, right-click to reset",children:[pt.jsx("div",{className:"tweak-fill",style:{width:`${N}%`}}),c?pt.jsx("input",{ref:p,className:"tweak-input",type:"text",value:d,onChange:B=>m(B.target.value),onKeyDown:z,onBlur:_}):pt.jsx("span",{className:"tweak-value",children:es(r.value,b)})]}),pt.jsx("button",{className:"tweak-reset-btn",onClick:B=>{B.stopPropagation(),l(r.name)},title:"Reset to default",children:"↺"})]})}function Cy(r){const[t,i]=r,s=Math.abs(t),l=Math.abs(i);return s>l*2?t>0?"→":"←":l>s*2?i>0?"↓":"↑":t>0?i>0?"↘":"↗":i>0?"↙":"↖"}function wy({tweak:r,onChange:t,onChangeStart:i,onChangeEnd:s,onReset:l}){const[c,f]=Ct.useState(!1),[d,m]=Ct.useState(""),p=Ct.useRef(null),g=Ct.useRef(!1),v=Ct.useRef([0,0]),x=Ct.useRef(0),y=Ct.useRef(!1),b=Qc(r.default),C=r.value!==r.default,M=Cy(r.axis),_=Math.sqrt(r.axis[0]**2+r.axis[1]**2),z=_>0?[r.axis[0]/_,r.axis[1]/_]:[1,0],U=Math.abs(r.axis[0]),N=Math.abs(r.axis[1]),B=N>U*2?"ns-resize":U>N*2?"ew-resize":"move",L=Ct.useCallback(T=>{if(T.button!==0||c)return;T.preventDefault(),g.current=!0,y.current=!1,v.current=[T.clientX,T.clientY],x.current=r.value,i(r.name),document.body.style.cursor=B,document.body.style.userSelect="none";const w=J=>{if(!g.current)return;const Y=J.clientX-v.current[0],ut=J.clientY-v.current[1];if((Math.abs(Y)>2||Math.abs(ut)>2)&&(y.current=!0),!y.current)return;const rt=J.shiftKey?.1:1,I=(Y*z[0]+ut*z[1])/_,H=Math.max(Math.abs(x.current),.01),tt=x.current+rt*H*I/100;t(r.name,Jo(tt,b))},V=()=>{g.current=!1,document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",w),window.removeEventListener("mouseup",V),y.current?s(r.name,r.value):(m(es(r.value,b)),f(!0))};window.addEventListener("mousemove",w),window.addEventListener("mouseup",V)},[r,c,t,i,s,z,_,B,b]),D=Ct.useCallback(()=>{f(!1);const T=parseFloat(d);isNaN(T)||(i(r.name),t(r.name,T),s(r.name,T))},[d,r.name,t,i,s]),k=Ct.useCallback(T=>{T.key==="Enter"?D():T.key==="Escape"&&f(!1)},[D]);return Ct.useEffect(()=>{c&&p.current&&(p.current.focus(),p.current.select())},[c]),pt.jsxs("div",{className:"tweak-row",children:[pt.jsx("span",{className:`tweak-name ${C?"tweak-modified":""}`,children:sl(r)}),pt.jsx("div",{className:"tweak-field",style:{cursor:B},onMouseDown:L,onContextMenu:T=>{T.preventDefault(),l(r.name)},title:`Drag ${M} to adjust, click to edit, right-click to reset`,children:c?pt.jsx("input",{ref:p,className:"tweak-input",type:"text",value:d,onChange:T=>m(T.target.value),onKeyDown:k,onBlur:D}):pt.jsxs("span",{className:"tweak-value",children:[M," ",es(r.value,b)]})}),pt.jsx("button",{className:"tweak-reset-btn",onClick:T=>{T.stopPropagation(),l(r.name)},title:"Reset to default",children:"↺"})]})}function Dy({tweak:r,onChange:t,onChangeStart:i,onChangeEnd:s,onReset:l}){const c=r.value!==r.default;return pt.jsxs("div",{className:"tweak-row",children:[pt.jsx("span",{className:`tweak-name ${c?"tweak-modified":""}`,children:sl(r)}),pt.jsx("select",{className:"tweak-select",value:r.value,onChange:f=>{const d=parseInt(f.target.value,10);i(r.name),t(r.name,d),s(r.name,d)},children:r.labels.map((f,d)=>pt.jsx("option",{value:d,children:f},d))}),pt.jsx("button",{className:"tweak-reset-btn",onClick:f=>{f.stopPropagation(),l(r.name)},title:"Reset to default",children:"↺"})]})}function ev(r){switch(r){case"right":return"→";case"left":return"←";case"up":return"↑";case"down":return"↓"}}function nv(r){switch(r){case"right":return[0,1];case"left":return[0,-1];case"down":return[1,1];case"up":return[1,-1]}}function Uy({tweak:r,onChange:t,onChangeStart:i,onChangeEnd:s,onReset:l}){const c=Qc(r.default[0]),f=Qc(r.default[1]),d=Ct.useRef(!1),m=Ct.useRef([0,0]),p=Ct.useRef([0,0]),g=Ct.useRef(!1),v=Ct.useRef(null),[x,y]=Ct.useState(null),[b,C]=Ct.useState(""),M=Ct.useRef(null),_=r.value[0]!==r.default[0]||r.value[1]!==r.default[1],z=nv(r.xDir),U=nv(r.yDir),N=Ct.useCallback(D=>{if(D.button!==0||x!==null)return;D.preventDefault(),d.current=!0,g.current=!1,m.current=[D.clientX,D.clientY],p.current=[...r.value],i(r.name),document.body.style.cursor="move",document.body.style.userSelect="none";const T=D.target.closest(".tweak-vec2-half");if(T){const Y=T.parentElement;if(Y){const ut=Array.from(Y.querySelectorAll(".tweak-vec2-half"));v.current=ut.indexOf(T)}}else v.current=null;let w=null;const V=Y=>{if(!d.current)return;const ut=Y.clientX-m.current[0],rt=Y.clientY-m.current[1];if((Math.abs(ut)>2||Math.abs(rt)>2)&&(g.current=!0),!g.current)return;Y.metaKey&&w===null&&(w=Math.abs(ut)>=Math.abs(rt)?"x":"y"),Y.metaKey||(w=null);const I=Y.shiftKey?.1:1,H=(r.speed||1)*I,tt=[ut,rt],bt=Math.max(Math.abs(p.current[0]),.01),Mt=Math.max(Math.abs(p.current[1]),.01),F=w==="y"?p.current[0]:p.current[0]+H*bt*tt[z[0]]*z[1]/100,$=w==="x"?p.current[1]:p.current[1]+H*Mt*tt[U[0]]*U[1]/100;t(r.name,[Jo(F,c),Jo($,f)])},J=()=>{if(d.current=!1,document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",V),window.removeEventListener("mouseup",J),g.current)s(r.name,r.value);else if(v.current!==null){const Y=v.current;C(es(r.value[Y],[c,f][Y])),y(Y)}};window.addEventListener("mousemove",V),window.addEventListener("mouseup",J)},[r,x,t,i,s,z,U,c,f]),B=Ct.useCallback(()=>{if(x===null)return;const D=parseFloat(b);if(!isNaN(D)){i(r.name);const k=[...r.value];k[x]=D,t(r.name,k),s(r.name,k)}y(null)},[b,x,r,t,i,s]),L=Ct.useCallback(D=>{D.key==="Enter"?B():D.key==="Escape"&&y(null)},[B]);return Ct.useEffect(()=>{x!==null&&M.current&&(M.current.focus(),M.current.select())},[x]),pt.jsxs("div",{className:"tweak-row",children:[pt.jsx("span",{className:`tweak-name ${_?"tweak-modified":""}`,children:sl(r)}),pt.jsxs("div",{className:"tweak-field tweak-vec2-field",onMouseDown:N,onContextMenu:D=>{D.preventDefault(),l(r.name)},title:"Drag arrows to adjust, click values to edit, right-click to reset",children:[pt.jsxs("div",{className:"tweak-vec2-half",children:[pt.jsx("span",{className:"tweak-vec2-arrow",children:ev(r.xDir)}),x===0?pt.jsx("input",{ref:M,className:"tweak-input tweak-vec2-edit",type:"text",value:b,onChange:D=>C(D.target.value),onKeyDown:L,onBlur:B}):pt.jsx("span",{className:"tweak-vec2-num",children:es(r.value[0],c)})]}),pt.jsxs("div",{className:"tweak-vec2-half",children:[pt.jsx("span",{className:"tweak-vec2-arrow",children:ev(r.yDir)}),x===1?pt.jsx("input",{ref:M,className:"tweak-input tweak-vec2-edit",type:"text",value:b,onChange:D=>C(D.target.value),onKeyDown:L,onBlur:B}):pt.jsx("span",{className:"tweak-vec2-num",children:es(r.value[1],f)})]})]}),pt.jsx("button",{className:"tweak-reset-btn",onClick:D=>{D.stopPropagation(),l(r.name)},title:"Reset to default",children:"↺"})]})}function Ny({tweak:r,onChange:t,onChangeStart:i,onChangeEnd:s,onReset:l}){const c=r.value.some((p,g)=>p!==r.default[g]),f=Ty(r.value),d=p=>{const[g,v,x]=Ay(p.target.value),y=[g,v,x,r.value[3]];i(r.name),t(r.name,y),s(r.name,y)},m=p=>{const g=parseFloat(p.target.value);if(!isNaN(g)){const v=[r.value[0],r.value[1],r.value[2],g];i(r.name),t(r.name,v),s(r.name,v)}};return pt.jsxs("div",{className:"tweak-row",children:[pt.jsx("span",{className:`tweak-name ${c?"tweak-modified":""}`,children:sl(r)}),pt.jsxs("div",{className:"tweak-color",children:[pt.jsx("input",{className:"tweak-color-input",type:"color",value:f,onChange:d}),pt.jsx("input",{className:"tweak-color-alpha",type:"number",step:"0.01",min:"0",max:"1",value:es(r.value[3]),onChange:m,title:"alpha"})]}),pt.jsx("button",{className:"tweak-reset-btn",onClick:p=>{p.stopPropagation(),l(r.name)},title:"Reset to default",children:"↺"})]})}function Ly(){const[r,t]=Ct.useState([]),[i,s]=Ct.useState(!1),l=Ct.useRef(new Map),c=Ct.useRef(null),f=Ct.useRef([]),d=Ct.useRef([]),m=Ct.useRef(new Map),p=Ct.useCallback(L=>{const D=[];for(const k of L){const T=Ey(k);T&&D.push(T)}t(D)},[]),g=Ct.useCallback(()=>{fetch("/api/tweaks").then(L=>L.json()).then(p).catch(()=>{})},[p]);Ct.useEffect(()=>{g()},[g]);const v=Ct.useCallback(()=>{const L=l.current;if(L.size!==0){for(const[D,k]of L)fetch("/api/tweaks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:D,value:k})}).catch(()=>{});L.clear()}},[]),x=Ct.useCallback((L,D)=>{t(k=>k.map(T=>T.name===L?{...T,value:D}:T)),l.current.set(L,D),c.current&&clearTimeout(c.current),c.current=setTimeout(v,10)},[v]),y=Ct.useCallback(L=>{if(!m.current.has(L)){const D=r.find(k=>k.name===L);D&&m.current.set(L,D.value)}},[r]),b=Ct.useCallback((L,D)=>{x(L,D)},[x]),C=Ct.useCallback((L,D)=>{const k=m.current.get(L);m.current.delete(L),k!==void 0&&k!==D&&(f.current.push({name:L,oldValue:k,newValue:D}),d.current=[])},[]),M=Ct.useCallback(()=>{const L=f.current.pop();L&&(d.current.push(L),x(L.name,L.oldValue))},[x]),_=Ct.useCallback(()=>{const L=d.current.pop();L&&(f.current.push(L),x(L.name,L.newValue))},[x]);Ct.useEffect(()=>{const L=D=>{D.metaKey&&D.key==="z"&&(D.preventDefault(),D.shiftKey?_():M())};return window.addEventListener("keydown",L),()=>window.removeEventListener("keydown",L)},[M,_]);const z=Ct.useCallback(L=>{fetch("/api/tweaks/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:L})}).then(D=>D.json()).then(p).catch(()=>{})},[p]),U=Ct.useCallback(()=>{s(!1),fetch("/api/tweaks/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:!0})}).then(L=>L.json()).then(p).catch(()=>{})},[p]);if(r.length===0)return null;const N=by(r),B=r.some(L=>L.type==="color"||L.type==="vec2"?L.value.some((D,k)=>D!==L.default[k]):L.value!==L.default);return pt.jsxs("div",{className:"tweak-panel",children:[pt.jsxs("div",{className:"tweak-header",children:[pt.jsx("span",{className:"tweak-title",children:"Tweaks"}),B&&pt.jsx("button",{className:"tweak-reset-all",onClick:()=>s(!0),children:"Reset All"})]}),Array.from(N.entries()).map(([L,D])=>pt.jsxs("div",{className:"tweak-group",children:[pt.jsx("div",{className:"tweak-group-name",children:L}),D.map(k=>{switch(k.type){case"enum":return pt.jsx(Dy,{tweak:k,onChange:b,onChangeStart:y,onChangeEnd:C,onReset:z},k.name);case"axis":return pt.jsx(wy,{tweak:k,onChange:b,onChangeStart:y,onChangeEnd:C,onReset:z},k.name);case"vec2":return pt.jsx(Uy,{tweak:k,onChange:b,onChangeStart:y,onChangeEnd:C,onReset:z},k.name);case"color":return pt.jsx(Ny,{tweak:k,onChange:b,onChangeStart:y,onChangeEnd:C,onReset:z},k.name);default:return pt.jsx(Ry,{tweak:k,onChange:b,onChangeStart:y,onChangeEnd:C,onReset:z},k.name)}})]},L)),i&&pt.jsx("div",{className:"confirm-overlay",onClick:()=>s(!1),children:pt.jsxs("div",{className:"confirm-dialog",onClick:L=>L.stopPropagation(),children:[pt.jsx("p",{className:"confirm-text",children:"Reset all tweaks to defaults?"}),pt.jsxs("div",{className:"confirm-actions",children:[pt.jsx("button",{className:"confirm-btn confirm-btn-stop",onClick:U,children:"Reset All"}),pt.jsx("button",{className:"confirm-btn confirm-btn-cancel",onClick:()=>s(!1),children:"Cancel"})]})]})})]})}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jd="182",Oy=0,iv=1,Py=2,qc=1,zy=2,qo=3,ns=0,Yn=1,ma=2,va=0,Nr=1,av=2,sv=3,rv=4,Fy=5,Cs=100,By=101,Iy=102,Hy=103,Vy=104,Gy=200,ky=201,Xy=202,Wy=203,Kh=204,Jh=205,qy=206,Yy=207,jy=208,Zy=209,Ky=210,Jy=211,Qy=212,$y=213,tM=214,Qh=0,$h=1,td=2,Or=3,ed=4,nd=5,id=6,ad=7,f_=0,eM=1,nM=2,Bi=0,h_=1,d_=2,p_=3,m_=4,g_=5,v_=6,__=7,x_=300,Ns=301,Pr=302,sd=303,rd=304,nu=306,od=1e3,ga=1001,ld=1002,Dn=1003,iM=1004,Mc=1005,dn=1006,mh=1007,Ds=1008,ii=1009,S_=1010,y_=1011,Qo=1012,Zd=1013,Vi=1014,zi=1015,xa=1016,Kd=1017,Jd=1018,$o=1020,M_=35902,E_=35899,b_=1021,T_=1022,Ai=1023,Sa=1026,Us=1027,A_=1028,Qd=1029,zr=1030,$d=1031,tp=1033,Yc=33776,jc=33777,Zc=33778,Kc=33779,cd=35840,ud=35841,fd=35842,hd=35843,dd=36196,pd=37492,md=37496,gd=37488,vd=37489,_d=37490,xd=37491,Sd=37808,yd=37809,Md=37810,Ed=37811,bd=37812,Td=37813,Ad=37814,Rd=37815,Cd=37816,wd=37817,Dd=37818,Ud=37819,Nd=37820,Ld=37821,Od=36492,Pd=36494,zd=36495,Fd=36283,Bd=36284,Id=36285,Hd=36286,aM=3200,R_=0,sM=1,$a="",qn="srgb",Fr="srgb-linear",$c="linear",ke="srgb",gr=7680,ov=519,rM=512,oM=513,lM=514,ep=515,cM=516,uM=517,np=518,fM=519,lv=35044,cv="300 es",Fi=2e3,tu=2001;function C_(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function eu(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function hM(){const r=eu("canvas");return r.style.display="block",r}const uv={};function fv(...r){const t="THREE."+r.shift();console.log(t,...r)}function pe(...r){const t="THREE."+r.shift();console.warn(t,...r)}function De(...r){const t="THREE."+r.shift();console.error(t,...r)}function tl(...r){const t=r.join(" ");t in uv||(uv[t]=!0,pe(...r))}function dM(r,t,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}class Hr{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[t]===void 0&&(s[t]=[]),s[t].indexOf(i)===-1&&s[t].push(i)}hasEventListener(t,i){const s=this._listeners;return s===void 0?!1:s[t]!==void 0&&s[t].indexOf(i)!==-1}removeEventListener(t,i){const s=this._listeners;if(s===void 0)return;const l=s[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const s=i[t.type];if(s!==void 0){t.target=this;const l=s.slice(0);for(let c=0,f=l.length;c<f;c++)l[c].call(this,t);t.target=null}}}const On=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],gh=Math.PI/180,Vd=180/Math.PI;function Vr(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(On[r&255]+On[r>>8&255]+On[r>>16&255]+On[r>>24&255]+"-"+On[t&255]+On[t>>8&255]+"-"+On[t>>16&15|64]+On[t>>24&255]+"-"+On[i&63|128]+On[i>>8&255]+"-"+On[i>>16&255]+On[i>>24&255]+On[s&255]+On[s>>8&255]+On[s>>16&255]+On[s>>24&255]).toLowerCase()}function Te(r,t,i){return Math.max(t,Math.min(i,r))}function pM(r,t){return(r%t+t)%t}function vh(r,t,i){return(1-i)*r+i*t}function Io(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Wn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class Yt{constructor(t=0,i=0){Yt.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,s=this.y,l=t.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(Te(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y;return i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-t.x,f=this.y-t.y;return this.x=c*s-f*l+t.x,this.y=c*l+f*s+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class rl{constructor(t=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=s,this._w=l}static slerpFlat(t,i,s,l,c,f,d){let m=s[l+0],p=s[l+1],g=s[l+2],v=s[l+3],x=c[f+0],y=c[f+1],b=c[f+2],C=c[f+3];if(d<=0){t[i+0]=m,t[i+1]=p,t[i+2]=g,t[i+3]=v;return}if(d>=1){t[i+0]=x,t[i+1]=y,t[i+2]=b,t[i+3]=C;return}if(v!==C||m!==x||p!==y||g!==b){let M=m*x+p*y+g*b+v*C;M<0&&(x=-x,y=-y,b=-b,C=-C,M=-M);let _=1-d;if(M<.9995){const z=Math.acos(M),U=Math.sin(z);_=Math.sin(_*z)/U,d=Math.sin(d*z)/U,m=m*_+x*d,p=p*_+y*d,g=g*_+b*d,v=v*_+C*d}else{m=m*_+x*d,p=p*_+y*d,g=g*_+b*d,v=v*_+C*d;const z=1/Math.sqrt(m*m+p*p+g*g+v*v);m*=z,p*=z,g*=z,v*=z}}t[i]=m,t[i+1]=p,t[i+2]=g,t[i+3]=v}static multiplyQuaternionsFlat(t,i,s,l,c,f){const d=s[l],m=s[l+1],p=s[l+2],g=s[l+3],v=c[f],x=c[f+1],y=c[f+2],b=c[f+3];return t[i]=d*b+g*v+m*y-p*x,t[i+1]=m*b+g*x+p*v-d*y,t[i+2]=p*b+g*y+d*x-m*v,t[i+3]=g*b-d*v-m*x-p*y,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,s,l){return this._x=t,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const s=t._x,l=t._y,c=t._z,f=t._order,d=Math.cos,m=Math.sin,p=d(s/2),g=d(l/2),v=d(c/2),x=m(s/2),y=m(l/2),b=m(c/2);switch(f){case"XYZ":this._x=x*g*v+p*y*b,this._y=p*y*v-x*g*b,this._z=p*g*b+x*y*v,this._w=p*g*v-x*y*b;break;case"YXZ":this._x=x*g*v+p*y*b,this._y=p*y*v-x*g*b,this._z=p*g*b-x*y*v,this._w=p*g*v+x*y*b;break;case"ZXY":this._x=x*g*v-p*y*b,this._y=p*y*v+x*g*b,this._z=p*g*b+x*y*v,this._w=p*g*v-x*y*b;break;case"ZYX":this._x=x*g*v-p*y*b,this._y=p*y*v+x*g*b,this._z=p*g*b-x*y*v,this._w=p*g*v+x*y*b;break;case"YZX":this._x=x*g*v+p*y*b,this._y=p*y*v+x*g*b,this._z=p*g*b-x*y*v,this._w=p*g*v-x*y*b;break;case"XZY":this._x=x*g*v-p*y*b,this._y=p*y*v-x*g*b,this._z=p*g*b+x*y*v,this._w=p*g*v+x*y*b;break;default:pe("Quaternion: .setFromEuler() encountered an unknown order: "+f)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const s=i/2,l=Math.sin(s);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,s=i[0],l=i[4],c=i[8],f=i[1],d=i[5],m=i[9],p=i[2],g=i[6],v=i[10],x=s+d+v;if(x>0){const y=.5/Math.sqrt(x+1);this._w=.25/y,this._x=(g-m)*y,this._y=(c-p)*y,this._z=(f-l)*y}else if(s>d&&s>v){const y=2*Math.sqrt(1+s-d-v);this._w=(g-m)/y,this._x=.25*y,this._y=(l+f)/y,this._z=(c+p)/y}else if(d>v){const y=2*Math.sqrt(1+d-s-v);this._w=(c-p)/y,this._x=(l+f)/y,this._y=.25*y,this._z=(m+g)/y}else{const y=2*Math.sqrt(1+v-s-d);this._w=(f-l)/y,this._x=(c+p)/y,this._y=(m+g)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let s=t.dot(i)+1;return s<1e-8?(s=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=s):(this._x=0,this._y=-t.z,this._z=t.y,this._w=s)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=s),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,i){const s=this.angleTo(t);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const s=t._x,l=t._y,c=t._z,f=t._w,d=i._x,m=i._y,p=i._z,g=i._w;return this._x=s*g+f*d+l*p-c*m,this._y=l*g+f*m+c*d-s*p,this._z=c*g+f*p+s*m-l*d,this._w=f*g-s*d-l*m-c*p,this._onChangeCallback(),this}slerp(t,i){if(i<=0)return this;if(i>=1)return this.copy(t);let s=t._x,l=t._y,c=t._z,f=t._w,d=this.dot(t);d<0&&(s=-s,l=-l,c=-c,f=-f,d=-d);let m=1-i;if(d<.9995){const p=Math.acos(d),g=Math.sin(p);m=Math.sin(m*p)/g,i=Math.sin(i*p)/g,this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this._onChangeCallback()}else this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+f*i,this.normalize();return this}slerpQuaternions(t,i,s){return this.copy(t).slerp(i,s)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class K{constructor(t=0,i=0,s=0){K.prototype.isVector3=!0,this.x=t,this.y=i,this.z=s}set(t,i,s){return s===void 0&&(s=this.z),this.x=t,this.y=i,this.z=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(hv.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(hv.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=t.elements,f=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*f,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*f,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*f,this}applyQuaternion(t){const i=this.x,s=this.y,l=this.z,c=t.x,f=t.y,d=t.z,m=t.w,p=2*(f*l-d*s),g=2*(d*i-c*l),v=2*(c*s-f*i);return this.x=i+m*p+f*v-d*g,this.y=s+m*g+d*p-c*v,this.z=l+m*v+c*g-f*p,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this.z=Te(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this.z=Te(this.z,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const s=t.x,l=t.y,c=t.z,f=i.x,d=i.y,m=i.z;return this.x=l*m-c*d,this.y=c*f-s*m,this.z=s*d-l*f,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const s=t.dot(this)/i;return this.copy(t).multiplyScalar(s)}projectOnPlane(t){return _h.copy(this).projectOnVector(t),this.sub(_h)}reflect(t){return this.sub(_h.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(Te(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y,l=this.z-t.z;return i*i+s*s+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,s){const l=Math.sin(i)*t;return this.x=l*Math.sin(s),this.y=Math.cos(i)*t,this.z=l*Math.cos(s),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,s){return this.x=t*Math.sin(i),this.y=s,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),s=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(t),this.y=i,this.z=s*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _h=new K,hv=new rl;class ye{constructor(t,i,s,l,c,f,d,m,p){ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,f,d,m,p)}set(t,i,s,l,c,f,d,m,p){const g=this.elements;return g[0]=t,g[1]=l,g[2]=d,g[3]=i,g[4]=c,g[5]=m,g[6]=s,g[7]=f,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(t,i,s){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,f=s[0],d=s[3],m=s[6],p=s[1],g=s[4],v=s[7],x=s[2],y=s[5],b=s[8],C=l[0],M=l[3],_=l[6],z=l[1],U=l[4],N=l[7],B=l[2],L=l[5],D=l[8];return c[0]=f*C+d*z+m*B,c[3]=f*M+d*U+m*L,c[6]=f*_+d*N+m*D,c[1]=p*C+g*z+v*B,c[4]=p*M+g*U+v*L,c[7]=p*_+g*N+v*D,c[2]=x*C+y*z+b*B,c[5]=x*M+y*U+b*L,c[8]=x*_+y*N+b*D,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8];return i*f*g-i*d*p-s*c*g+s*d*m+l*c*p-l*f*m}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8],v=g*f-d*p,x=d*m-g*c,y=p*c-f*m,b=i*v+s*x+l*y;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/b;return t[0]=v*C,t[1]=(l*p-g*s)*C,t[2]=(d*s-l*f)*C,t[3]=x*C,t[4]=(g*i-l*m)*C,t[5]=(l*c-d*i)*C,t[6]=y*C,t[7]=(s*m-p*i)*C,t[8]=(f*i-s*c)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,s,l,c,f,d){const m=Math.cos(c),p=Math.sin(c);return this.set(s*m,s*p,-s*(m*f+p*d)+f+t,-l*p,l*m,-l*(-p*f+m*d)+d+i,0,0,1),this}scale(t,i){return this.premultiply(xh.makeScale(t,i)),this}rotate(t){return this.premultiply(xh.makeRotation(-t)),this}translate(t,i){return this.premultiply(xh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<9;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const xh=new ye,dv=new ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pv=new ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mM(){const r={enabled:!0,workingColorSpace:Fr,spaces:{},convert:function(l,c,f){return this.enabled===!1||c===f||!c||!f||(this.spaces[c].transfer===ke&&(l.r=_a(l.r),l.g=_a(l.g),l.b=_a(l.b)),this.spaces[c].primaries!==this.spaces[f].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[f].fromXYZ)),this.spaces[f].transfer===ke&&(l.r=Lr(l.r),l.g=Lr(l.g),l.b=Lr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===$a?$c:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,f){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[f].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return tl("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return tl("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[Fr]:{primaries:t,whitePoint:s,transfer:$c,toXYZ:dv,fromXYZ:pv,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:qn},outputColorSpaceConfig:{drawingBufferColorSpace:qn}},[qn]:{primaries:t,whitePoint:s,transfer:ke,toXYZ:dv,fromXYZ:pv,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:qn}}}),r}const Ue=mM();function _a(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Lr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let vr;class gM{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let s;if(t instanceof HTMLCanvasElement)s=t;else{vr===void 0&&(vr=eu("canvas")),vr.width=t.width,vr.height=t.height;const l=vr.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),s=vr}return s.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=eu("canvas");i.width=t.width,i.height=t.height;const s=i.getContext("2d");s.drawImage(t,0,0,t.width,t.height);const l=s.getImageData(0,0,t.width,t.height),c=l.data;for(let f=0;f<c.length;f++)c[f]=_a(c[f]/255)*255;return s.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(_a(i[s]/255)*255):i[s]=_a(i[s]);return{data:i,width:t.width,height:t.height}}else return pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vM=0;class ip{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=Vr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let f=0,d=l.length;f<d;f++)l[f].isDataTexture?c.push(Sh(l[f].image)):c.push(Sh(l[f]))}else c=Sh(l);s.url=c}return i||(t.images[this.uuid]=s),s}}function Sh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?gM.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(pe("Texture: Unable to serialize Texture."),{})}let _M=0;const yh=new K;class Un extends Hr{constructor(t=Un.DEFAULT_IMAGE,i=Un.DEFAULT_MAPPING,s=ga,l=ga,c=dn,f=Ds,d=Ai,m=ii,p=Un.DEFAULT_ANISOTROPY,g=$a){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_M++}),this.uuid=Vr(),this.name="",this.source=new ip(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=f,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(yh).x}get height(){return this.source.getSize(yh).y}get depth(){return this.source.getSize(yh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const s=t[i];if(s===void 0){pe(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){pe(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(t.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==x_)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case od:t.x=t.x-Math.floor(t.x);break;case ga:t.x=t.x<0?0:1;break;case ld:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case od:t.y=t.y-Math.floor(t.y);break;case ga:t.y=t.y<0?0:1;break;case ld:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Un.DEFAULT_IMAGE=null;Un.DEFAULT_MAPPING=x_;Un.DEFAULT_ANISOTROPY=1;class an{constructor(t=0,i=0,s=0,l=1){an.prototype.isVector4=!0,this.x=t,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,s,l){return this.x=t,this.y=i,this.z=s,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=this.w,f=t.elements;return this.x=f[0]*i+f[4]*s+f[8]*l+f[12]*c,this.y=f[1]*i+f[5]*s+f[9]*l+f[13]*c,this.z=f[2]*i+f[6]*s+f[10]*l+f[14]*c,this.w=f[3]*i+f[7]*s+f[11]*l+f[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,s,l,c;const m=t.elements,p=m[0],g=m[4],v=m[8],x=m[1],y=m[5],b=m[9],C=m[2],M=m[6],_=m[10];if(Math.abs(g-x)<.01&&Math.abs(v-C)<.01&&Math.abs(b-M)<.01){if(Math.abs(g+x)<.1&&Math.abs(v+C)<.1&&Math.abs(b+M)<.1&&Math.abs(p+y+_-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const U=(p+1)/2,N=(y+1)/2,B=(_+1)/2,L=(g+x)/4,D=(v+C)/4,k=(b+M)/4;return U>N&&U>B?U<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(U),l=L/s,c=D/s):N>B?N<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(N),s=L/l,c=k/l):B<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(B),s=D/c,l=k/c),this.set(s,l,c,i),this}let z=Math.sqrt((M-b)*(M-b)+(v-C)*(v-C)+(x-g)*(x-g));return Math.abs(z)<.001&&(z=1),this.x=(M-b)/z,this.y=(v-C)/z,this.z=(x-g)/z,this.w=Math.acos((p+y+_-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=Te(this.x,t.x,i.x),this.y=Te(this.y,t.y,i.y),this.z=Te(this.z,t.z,i.z),this.w=Te(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=Te(this.x,t,i),this.y=Te(this.y,t,i),this.z=Te(this.z,t,i),this.w=Te(this.w,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Te(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this.w=t.w+(i.w-t.w)*s,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xM extends Hr{constructor(t=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=s.depth,this.scissor=new an(0,0,t,i),this.scissorTest=!1,this.viewport=new an(0,0,t,i);const l={width:t,height:i,depth:s.depth},c=new Un(l);this.textures=[];const f=s.count;for(let d=0;d<f;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(t={}){const i={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,s=1){if(this.width!==t||this.height!==i||this.depth!==s){this.width=t,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new ip(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends xM{constructor(t=1,i=1,s={}){super(t,i,s),this.isWebGLRenderTarget=!0}}class w_ extends Un{constructor(t=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class SM extends Un{constructor(t=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ol{constructor(t=new K(1/0,1/0,1/0),i=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i+=3)this.expandByPoint(Mi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,s=t.count;i<s;i++)this.expandByPoint(Mi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const s=Mi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(s),this.max.copy(t).add(s),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const s=t.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let f=0,d=c.count;f<d;f++)t.isMesh===!0?t.getVertexPosition(f,Mi):Mi.fromBufferAttribute(c,f),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ec.copy(t.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Ec.copy(s.boundingBox)),Ec.applyMatrix4(t.matrixWorld),this.union(Ec)}const l=t.children;for(let c=0,f=l.length;c<f;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,s;return t.normal.x>0?(i=t.normal.x*this.min.x,s=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,s=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,s+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,s+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,s+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,s+=t.normal.z*this.min.z),i<=-t.constant&&s>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ho),bc.subVectors(this.max,Ho),_r.subVectors(t.a,Ho),xr.subVectors(t.b,Ho),Sr.subVectors(t.c,Ho),Ya.subVectors(xr,_r),ja.subVectors(Sr,xr),ys.subVectors(_r,Sr);let i=[0,-Ya.z,Ya.y,0,-ja.z,ja.y,0,-ys.z,ys.y,Ya.z,0,-Ya.x,ja.z,0,-ja.x,ys.z,0,-ys.x,-Ya.y,Ya.x,0,-ja.y,ja.x,0,-ys.y,ys.x,0];return!Mh(i,_r,xr,Sr,bc)||(i=[1,0,0,0,1,0,0,0,1],!Mh(i,_r,xr,Sr,bc))?!1:(Tc.crossVectors(Ya,ja),i=[Tc.x,Tc.y,Tc.z],Mh(i,_r,xr,Sr,bc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ua[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ua[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ua[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ua[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ua[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ua[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ua[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ua[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ua),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ua=[new K,new K,new K,new K,new K,new K,new K,new K],Mi=new K,Ec=new ol,_r=new K,xr=new K,Sr=new K,Ya=new K,ja=new K,ys=new K,Ho=new K,bc=new K,Tc=new K,Ms=new K;function Mh(r,t,i,s,l){for(let c=0,f=r.length-3;c<=f;c+=3){Ms.fromArray(r,c);const d=l.x*Math.abs(Ms.x)+l.y*Math.abs(Ms.y)+l.z*Math.abs(Ms.z),m=t.dot(Ms),p=i.dot(Ms),g=s.dot(Ms);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const yM=new ol,Vo=new K,Eh=new K;class ap{constructor(t=new K,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const s=this.center;i!==void 0?s.copy(i):yM.setFromPoints(t).getCenter(s);let l=0;for(let c=0,f=t.length;c<f;c++)l=Math.max(l,s.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const s=this.center.distanceToSquared(t);return i.copy(t),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Vo.subVectors(t,this.center);const i=Vo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Vo,l/s),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Eh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Vo.copy(t.center).add(Eh)),this.expandByPoint(Vo.copy(t.center).sub(Eh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const fa=new K,bh=new K,Ac=new K,Za=new K,Th=new K,Rc=new K,Ah=new K;class MM{constructor(t=new K,i=new K(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fa)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=fa.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(fa.copy(this.origin).addScaledVector(this.direction,i),fa.distanceToSquared(t))}distanceSqToSegment(t,i,s,l){bh.copy(t).add(i).multiplyScalar(.5),Ac.copy(i).sub(t).normalize(),Za.copy(this.origin).sub(bh);const c=t.distanceTo(i)*.5,f=-this.direction.dot(Ac),d=Za.dot(this.direction),m=-Za.dot(Ac),p=Za.lengthSq(),g=Math.abs(1-f*f);let v,x,y,b;if(g>0)if(v=f*m-d,x=f*d-m,b=c*g,v>=0)if(x>=-b)if(x<=b){const C=1/g;v*=C,x*=C,y=v*(v+f*x+2*d)+x*(f*v+x+2*m)+p}else x=c,v=Math.max(0,-(f*x+d)),y=-v*v+x*(x+2*m)+p;else x=-c,v=Math.max(0,-(f*x+d)),y=-v*v+x*(x+2*m)+p;else x<=-b?(v=Math.max(0,-(-f*c+d)),x=v>0?-c:Math.min(Math.max(-c,-m),c),y=-v*v+x*(x+2*m)+p):x<=b?(v=0,x=Math.min(Math.max(-c,-m),c),y=x*(x+2*m)+p):(v=Math.max(0,-(f*c+d)),x=v>0?c:Math.min(Math.max(-c,-m),c),y=-v*v+x*(x+2*m)+p);else x=f>0?-c:c,v=Math.max(0,-(f*x+d)),y=-v*v+x*(x+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(bh).addScaledVector(Ac,x),y}intersectSphere(t,i){fa.subVectors(t.center,this.origin);const s=fa.dot(this.direction),l=fa.dot(fa)-s*s,c=t.radius*t.radius;if(l>c)return null;const f=Math.sqrt(c-l),d=s-f,m=s+f;return m<0?null:d<0?this.at(m,i):this.at(d,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(t.normal)+t.constant)/i;return s>=0?s:null}intersectPlane(t,i){const s=this.distanceToPlane(t);return s===null?null:this.at(s,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let s,l,c,f,d,m;const p=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,x=this.origin;return p>=0?(s=(t.min.x-x.x)*p,l=(t.max.x-x.x)*p):(s=(t.max.x-x.x)*p,l=(t.min.x-x.x)*p),g>=0?(c=(t.min.y-x.y)*g,f=(t.max.y-x.y)*g):(c=(t.max.y-x.y)*g,f=(t.min.y-x.y)*g),s>f||c>l||((c>s||isNaN(s))&&(s=c),(f<l||isNaN(l))&&(l=f),v>=0?(d=(t.min.z-x.z)*v,m=(t.max.z-x.z)*v):(d=(t.max.z-x.z)*v,m=(t.min.z-x.z)*v),s>m||d>l)||((d>s||s!==s)&&(s=d),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(t){return this.intersectBox(t,fa)!==null}intersectTriangle(t,i,s,l,c){Th.subVectors(i,t),Rc.subVectors(s,t),Ah.crossVectors(Th,Rc);let f=this.direction.dot(Ah),d;if(f>0){if(l)return null;d=1}else if(f<0)d=-1,f=-f;else return null;Za.subVectors(this.origin,t);const m=d*this.direction.dot(Rc.crossVectors(Za,Rc));if(m<0)return null;const p=d*this.direction.dot(Th.cross(Za));if(p<0||m+p>f)return null;const g=-d*Za.dot(Ah);return g<0?null:this.at(g/f,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class tn{constructor(t,i,s,l,c,f,d,m,p,g,v,x,y,b,C,M){tn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,f,d,m,p,g,v,x,y,b,C,M)}set(t,i,s,l,c,f,d,m,p,g,v,x,y,b,C,M){const _=this.elements;return _[0]=t,_[4]=i,_[8]=s,_[12]=l,_[1]=c,_[5]=f,_[9]=d,_[13]=m,_[2]=p,_[6]=g,_[10]=v,_[14]=x,_[3]=y,_[7]=b,_[11]=C,_[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tn().fromArray(this.elements)}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(t){const i=this.elements,s=t.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,s){return this.determinant()===0?(t.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(t,i,s){return this.set(t.x,i.x,s.x,0,t.y,i.y,s.y,0,t.z,i.z,s.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const i=this.elements,s=t.elements,l=1/yr.setFromMatrixColumn(t,0).length(),c=1/yr.setFromMatrixColumn(t,1).length(),f=1/yr.setFromMatrixColumn(t,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*f,i[9]=s[9]*f,i[10]=s[10]*f,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,s=t.x,l=t.y,c=t.z,f=Math.cos(s),d=Math.sin(s),m=Math.cos(l),p=Math.sin(l),g=Math.cos(c),v=Math.sin(c);if(t.order==="XYZ"){const x=f*g,y=f*v,b=d*g,C=d*v;i[0]=m*g,i[4]=-m*v,i[8]=p,i[1]=y+b*p,i[5]=x-C*p,i[9]=-d*m,i[2]=C-x*p,i[6]=b+y*p,i[10]=f*m}else if(t.order==="YXZ"){const x=m*g,y=m*v,b=p*g,C=p*v;i[0]=x+C*d,i[4]=b*d-y,i[8]=f*p,i[1]=f*v,i[5]=f*g,i[9]=-d,i[2]=y*d-b,i[6]=C+x*d,i[10]=f*m}else if(t.order==="ZXY"){const x=m*g,y=m*v,b=p*g,C=p*v;i[0]=x-C*d,i[4]=-f*v,i[8]=b+y*d,i[1]=y+b*d,i[5]=f*g,i[9]=C-x*d,i[2]=-f*p,i[6]=d,i[10]=f*m}else if(t.order==="ZYX"){const x=f*g,y=f*v,b=d*g,C=d*v;i[0]=m*g,i[4]=b*p-y,i[8]=x*p+C,i[1]=m*v,i[5]=C*p+x,i[9]=y*p-b,i[2]=-p,i[6]=d*m,i[10]=f*m}else if(t.order==="YZX"){const x=f*m,y=f*p,b=d*m,C=d*p;i[0]=m*g,i[4]=C-x*v,i[8]=b*v+y,i[1]=v,i[5]=f*g,i[9]=-d*g,i[2]=-p*g,i[6]=y*v+b,i[10]=x-C*v}else if(t.order==="XZY"){const x=f*m,y=f*p,b=d*m,C=d*p;i[0]=m*g,i[4]=-v,i[8]=p*g,i[1]=x*v+C,i[5]=f*g,i[9]=y*v-b,i[2]=b*v-y,i[6]=d*g,i[10]=C*v+x}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(EM,t,bM)}lookAt(t,i,s){const l=this.elements;return ei.subVectors(t,i),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),Ka.crossVectors(s,ei),Ka.lengthSq()===0&&(Math.abs(s.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),Ka.crossVectors(s,ei)),Ka.normalize(),Cc.crossVectors(ei,Ka),l[0]=Ka.x,l[4]=Cc.x,l[8]=ei.x,l[1]=Ka.y,l[5]=Cc.y,l[9]=ei.y,l[2]=Ka.z,l[6]=Cc.z,l[10]=ei.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,f=s[0],d=s[4],m=s[8],p=s[12],g=s[1],v=s[5],x=s[9],y=s[13],b=s[2],C=s[6],M=s[10],_=s[14],z=s[3],U=s[7],N=s[11],B=s[15],L=l[0],D=l[4],k=l[8],T=l[12],w=l[1],V=l[5],J=l[9],Y=l[13],ut=l[2],rt=l[6],I=l[10],H=l[14],tt=l[3],bt=l[7],Mt=l[11],F=l[15];return c[0]=f*L+d*w+m*ut+p*tt,c[4]=f*D+d*V+m*rt+p*bt,c[8]=f*k+d*J+m*I+p*Mt,c[12]=f*T+d*Y+m*H+p*F,c[1]=g*L+v*w+x*ut+y*tt,c[5]=g*D+v*V+x*rt+y*bt,c[9]=g*k+v*J+x*I+y*Mt,c[13]=g*T+v*Y+x*H+y*F,c[2]=b*L+C*w+M*ut+_*tt,c[6]=b*D+C*V+M*rt+_*bt,c[10]=b*k+C*J+M*I+_*Mt,c[14]=b*T+C*Y+M*H+_*F,c[3]=z*L+U*w+N*ut+B*tt,c[7]=z*D+U*V+N*rt+B*bt,c[11]=z*k+U*J+N*I+B*Mt,c[15]=z*T+U*Y+N*H+B*F,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[4],l=t[8],c=t[12],f=t[1],d=t[5],m=t[9],p=t[13],g=t[2],v=t[6],x=t[10],y=t[14],b=t[3],C=t[7],M=t[11],_=t[15],z=m*y-p*x,U=d*y-p*v,N=d*x-m*v,B=f*y-p*g,L=f*x-m*g,D=f*v-d*g;return i*(C*z-M*U+_*N)-s*(b*z-M*B+_*L)+l*(b*U-C*B+_*D)-c*(b*N-C*L+M*D)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,s){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=s),this}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],f=t[4],d=t[5],m=t[6],p=t[7],g=t[8],v=t[9],x=t[10],y=t[11],b=t[12],C=t[13],M=t[14],_=t[15],z=v*M*p-C*x*p+C*m*y-d*M*y-v*m*_+d*x*_,U=b*x*p-g*M*p-b*m*y+f*M*y+g*m*_-f*x*_,N=g*C*p-b*v*p+b*d*y-f*C*y-g*d*_+f*v*_,B=b*v*m-g*C*m-b*d*x+f*C*x+g*d*M-f*v*M,L=i*z+s*U+l*N+c*B;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/L;return t[0]=z*D,t[1]=(C*x*c-v*M*c-C*l*y+s*M*y+v*l*_-s*x*_)*D,t[2]=(d*M*c-C*m*c+C*l*p-s*M*p-d*l*_+s*m*_)*D,t[3]=(v*m*c-d*x*c-v*l*p+s*x*p+d*l*y-s*m*y)*D,t[4]=U*D,t[5]=(g*M*c-b*x*c+b*l*y-i*M*y-g*l*_+i*x*_)*D,t[6]=(b*m*c-f*M*c-b*l*p+i*M*p+f*l*_-i*m*_)*D,t[7]=(f*x*c-g*m*c+g*l*p-i*x*p-f*l*y+i*m*y)*D,t[8]=N*D,t[9]=(b*v*c-g*C*c-b*s*y+i*C*y+g*s*_-i*v*_)*D,t[10]=(f*C*c-b*d*c+b*s*p-i*C*p-f*s*_+i*d*_)*D,t[11]=(g*d*c-f*v*c-g*s*p+i*v*p+f*s*y-i*d*y)*D,t[12]=B*D,t[13]=(g*C*l-b*v*l+b*s*x-i*C*x-g*s*M+i*v*M)*D,t[14]=(b*d*l-f*C*l-b*s*m+i*C*m+f*s*M-i*d*M)*D,t[15]=(f*v*l-g*d*l+g*s*m-i*v*m-f*s*x+i*d*x)*D,this}scale(t){const i=this.elements,s=t.x,l=t.y,c=t.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],s=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(t,i,s){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),s=Math.sin(t);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,f=t.x,d=t.y,m=t.z,p=c*f,g=c*d;return this.set(p*f+s,p*d-l*m,p*m+l*d,0,p*d+l*m,g*d+s,g*m-l*f,0,p*m-l*d,g*m+l*f,c*m*m+s,0,0,0,0,1),this}makeScale(t,i,s){return this.set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(t,i,s,l,c,f){return this.set(1,s,c,0,t,1,f,0,i,l,1,0,0,0,0,1),this}compose(t,i,s){const l=this.elements,c=i._x,f=i._y,d=i._z,m=i._w,p=c+c,g=f+f,v=d+d,x=c*p,y=c*g,b=c*v,C=f*g,M=f*v,_=d*v,z=m*p,U=m*g,N=m*v,B=s.x,L=s.y,D=s.z;return l[0]=(1-(C+_))*B,l[1]=(y+N)*B,l[2]=(b-U)*B,l[3]=0,l[4]=(y-N)*L,l[5]=(1-(x+_))*L,l[6]=(M+z)*L,l[7]=0,l[8]=(b+U)*D,l[9]=(M-z)*D,l[10]=(1-(x+C))*D,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,s){const l=this.elements;if(t.x=l[12],t.y=l[13],t.z=l[14],this.determinant()===0)return s.set(1,1,1),i.identity(),this;let c=yr.set(l[0],l[1],l[2]).length();const f=yr.set(l[4],l[5],l[6]).length(),d=yr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(c=-c),Ei.copy(this);const p=1/c,g=1/f,v=1/d;return Ei.elements[0]*=p,Ei.elements[1]*=p,Ei.elements[2]*=p,Ei.elements[4]*=g,Ei.elements[5]*=g,Ei.elements[6]*=g,Ei.elements[8]*=v,Ei.elements[9]*=v,Ei.elements[10]*=v,i.setFromRotationMatrix(Ei),s.x=c,s.y=f,s.z=d,this}makePerspective(t,i,s,l,c,f,d=Fi,m=!1){const p=this.elements,g=2*c/(i-t),v=2*c/(s-l),x=(i+t)/(i-t),y=(s+l)/(s-l);let b,C;if(m)b=c/(f-c),C=f*c/(f-c);else if(d===Fi)b=-(f+c)/(f-c),C=-2*f*c/(f-c);else if(d===tu)b=-f/(f-c),C=-f*c/(f-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=x,p[12]=0,p[1]=0,p[5]=v,p[9]=y,p[13]=0,p[2]=0,p[6]=0,p[10]=b,p[14]=C,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(t,i,s,l,c,f,d=Fi,m=!1){const p=this.elements,g=2/(i-t),v=2/(s-l),x=-(i+t)/(i-t),y=-(s+l)/(s-l);let b,C;if(m)b=1/(f-c),C=f/(f-c);else if(d===Fi)b=-2/(f-c),C=-(f+c)/(f-c);else if(d===tu)b=-1/(f-c),C=-c/(f-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=g,p[4]=0,p[8]=0,p[12]=x,p[1]=0,p[5]=v,p[9]=0,p[13]=y,p[2]=0,p[6]=0,p[10]=b,p[14]=C,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<16;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t[i+9]=s[9],t[i+10]=s[10],t[i+11]=s[11],t[i+12]=s[12],t[i+13]=s[13],t[i+14]=s[14],t[i+15]=s[15],t}}const yr=new K,Ei=new tn,EM=new K(0,0,0),bM=new K(1,1,1),Ka=new K,Cc=new K,ei=new K,mv=new tn,gv=new rl;class Gi{constructor(t=0,i=0,s=0,l=Gi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,s,l=this._order){return this._x=t,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,s=!0){const l=t.elements,c=l[0],f=l[4],d=l[8],m=l[1],p=l[5],g=l[9],v=l[2],x=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(Te(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,y),this._z=Math.atan2(-f,c)):(this._x=Math.atan2(x,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-v,c),this._z=0);break;case"ZXY":this._x=Math.asin(Te(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-v,y),this._z=Math.atan2(-f,p)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-Te(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(x,y),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-f,p));break;case"YZX":this._z=Math.asin(Te(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-v,c)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-Te(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(x,p),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-g,y),this._y=0);break;default:pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,s){return mv.makeRotationFromQuaternion(t),this.setFromRotationMatrix(mv,i,s)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return gv.setFromEuler(this),this.setFromQuaternion(gv,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Gi.DEFAULT_ORDER="XYZ";class D_{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let TM=0;const vv=new K,Mr=new rl,ha=new tn,wc=new K,Go=new K,AM=new K,RM=new rl,_v=new K(1,0,0),xv=new K(0,1,0),Sv=new K(0,0,1),yv={type:"added"},CM={type:"removed"},Er={type:"childadded",child:null},Rh={type:"childremoved",child:null};class zn extends Hr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=Vr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zn.DEFAULT_UP.clone();const t=new K,i=new Gi,s=new rl,l=new K(1,1,1);function c(){s.setFromEuler(i,!1)}function f(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new tn},normalMatrix:{value:new ye}}),this.matrix=new tn,this.matrixWorld=new tn,this.matrixAutoUpdate=zn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new D_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return Mr.setFromAxisAngle(t,i),this.quaternion.multiply(Mr),this}rotateOnWorldAxis(t,i){return Mr.setFromAxisAngle(t,i),this.quaternion.premultiply(Mr),this}rotateX(t){return this.rotateOnAxis(_v,t)}rotateY(t){return this.rotateOnAxis(xv,t)}rotateZ(t){return this.rotateOnAxis(Sv,t)}translateOnAxis(t,i){return vv.copy(t).applyQuaternion(this.quaternion),this.position.add(vv.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(_v,t)}translateY(t){return this.translateOnAxis(xv,t)}translateZ(t){return this.translateOnAxis(Sv,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ha.copy(this.matrixWorld).invert())}lookAt(t,i,s){t.isVector3?wc.copy(t):wc.set(t,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ha.lookAt(Go,wc,this.up):ha.lookAt(wc,Go,this.up),this.quaternion.setFromRotationMatrix(ha),l&&(ha.extractRotation(l.matrixWorld),Mr.setFromRotationMatrix(ha),this.quaternion.premultiply(Mr.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(De("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yv),Er.child=t,this.dispatchEvent(Er),Er.child=null):De("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(CM),Rh.child=t,this.dispatchEvent(Rh),Rh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ha.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ha.multiply(t.parent.matrixWorld)),t.applyMatrix4(ha),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yv),Er.child=t,this.dispatchEvent(Er),Er.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const f=this.children[s].getObjectByProperty(t,i);if(f!==void 0)return f}}getObjectsByProperty(t,i,s=[]){this[t]===i&&s.push(this);const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].getObjectsByProperty(t,i,s);return s}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Go,t,AM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Go,RM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(t)}updateWorldMatrix(t,i){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",s={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(d=>({...d})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const v=m[p];c(t.shapes,v)}else c(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(c(t.materials,this.material[m]));l.material=d}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];l.animations.push(c(t.animations,m))}}if(i){const d=f(t.geometries),m=f(t.materials),p=f(t.textures),g=f(t.images),v=f(t.shapes),x=f(t.skeletons),y=f(t.animations),b=f(t.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),v.length>0&&(s.shapes=v),x.length>0&&(s.skeletons=x),y.length>0&&(s.animations=y),b.length>0&&(s.nodes=b)}return s.object=l,s;function f(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let s=0;s<t.children.length;s++){const l=t.children[s];this.add(l.clone())}return this}}zn.DEFAULT_UP=new K(0,1,0);zn.DEFAULT_MATRIX_AUTO_UPDATE=!0;zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bi=new K,da=new K,Ch=new K,pa=new K,br=new K,Tr=new K,Mv=new K,wh=new K,Dh=new K,Uh=new K,Nh=new an,Lh=new an,Oh=new an;class Ti{constructor(t=new K,i=new K,s=new K){this.a=t,this.b=i,this.c=s}static getNormal(t,i,s,l){l.subVectors(s,i),bi.subVectors(t,i),l.cross(bi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,s,l,c){bi.subVectors(l,i),da.subVectors(s,i),Ch.subVectors(t,i);const f=bi.dot(bi),d=bi.dot(da),m=bi.dot(Ch),p=da.dot(da),g=da.dot(Ch),v=f*p-d*d;if(v===0)return c.set(0,0,0),null;const x=1/v,y=(p*m-d*g)*x,b=(f*g-d*m)*x;return c.set(1-y-b,b,y)}static containsPoint(t,i,s,l){return this.getBarycoord(t,i,s,l,pa)===null?!1:pa.x>=0&&pa.y>=0&&pa.x+pa.y<=1}static getInterpolation(t,i,s,l,c,f,d,m){return this.getBarycoord(t,i,s,l,pa)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,pa.x),m.addScaledVector(f,pa.y),m.addScaledVector(d,pa.z),m)}static getInterpolatedAttribute(t,i,s,l,c,f){return Nh.setScalar(0),Lh.setScalar(0),Oh.setScalar(0),Nh.fromBufferAttribute(t,i),Lh.fromBufferAttribute(t,s),Oh.fromBufferAttribute(t,l),f.setScalar(0),f.addScaledVector(Nh,c.x),f.addScaledVector(Lh,c.y),f.addScaledVector(Oh,c.z),f}static isFrontFacing(t,i,s,l){return bi.subVectors(s,i),da.subVectors(t,i),bi.cross(da).dot(l)<0}set(t,i,s){return this.a.copy(t),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(t,i,s,l){return this.a.copy(t[i]),this.b.copy(t[s]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,s,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,s),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bi.subVectors(this.c,this.b),da.subVectors(this.a,this.b),bi.cross(da).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ti.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Ti.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,s,l,c){return Ti.getInterpolation(t,this.a,this.b,this.c,i,s,l,c)}containsPoint(t){return Ti.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ti.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const s=this.a,l=this.b,c=this.c;let f,d;br.subVectors(l,s),Tr.subVectors(c,s),wh.subVectors(t,s);const m=br.dot(wh),p=Tr.dot(wh);if(m<=0&&p<=0)return i.copy(s);Dh.subVectors(t,l);const g=br.dot(Dh),v=Tr.dot(Dh);if(g>=0&&v<=g)return i.copy(l);const x=m*v-g*p;if(x<=0&&m>=0&&g<=0)return f=m/(m-g),i.copy(s).addScaledVector(br,f);Uh.subVectors(t,c);const y=br.dot(Uh),b=Tr.dot(Uh);if(b>=0&&y<=b)return i.copy(c);const C=y*p-m*b;if(C<=0&&p>=0&&b<=0)return d=p/(p-b),i.copy(s).addScaledVector(Tr,d);const M=g*b-y*v;if(M<=0&&v-g>=0&&y-b>=0)return Mv.subVectors(c,l),d=(v-g)/(v-g+(y-b)),i.copy(l).addScaledVector(Mv,d);const _=1/(M+C+x);return f=C*_,d=x*_,i.copy(s).addScaledVector(br,f).addScaledVector(Tr,d)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const U_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ja={h:0,s:0,l:0},Dc={h:0,s:0,l:0};function Ph(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class Fe{constructor(t,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,s)}set(t,i,s){if(i===void 0&&s===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,s);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=qn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ue.colorSpaceToWorking(this,i),this}setRGB(t,i,s,l=Ue.workingColorSpace){return this.r=t,this.g=i,this.b=s,Ue.colorSpaceToWorking(this,l),this}setHSL(t,i,s,l=Ue.workingColorSpace){if(t=pM(t,1),i=Te(i,0,1),s=Te(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,f=2*s-c;this.r=Ph(f,c,t+1/3),this.g=Ph(f,c,t),this.b=Ph(f,c,t-1/3)}return Ue.colorSpaceToWorking(this,l),this}setStyle(t,i=qn){function s(c){c!==void 0&&parseFloat(c)<1&&pe("Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const f=l[1],d=l[2];switch(f){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:pe("Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],f=c.length;if(f===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(f===6)return this.setHex(parseInt(c,16),i);pe("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=qn){const s=U_[t.toLowerCase()];return s!==void 0?this.setHex(s,i):pe("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_a(t.r),this.g=_a(t.g),this.b=_a(t.b),this}copyLinearToSRGB(t){return this.r=Lr(t.r),this.g=Lr(t.g),this.b=Lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qn){return Ue.workingToColorSpace(Pn.copy(this),t),Math.round(Te(Pn.r*255,0,255))*65536+Math.round(Te(Pn.g*255,0,255))*256+Math.round(Te(Pn.b*255,0,255))}getHexString(t=qn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Ue.workingColorSpace){Ue.workingToColorSpace(Pn.copy(this),i);const s=Pn.r,l=Pn.g,c=Pn.b,f=Math.max(s,l,c),d=Math.min(s,l,c);let m,p;const g=(d+f)/2;if(d===f)m=0,p=0;else{const v=f-d;switch(p=g<=.5?v/(f+d):v/(2-f-d),f){case s:m=(l-c)/v+(l<c?6:0);break;case l:m=(c-s)/v+2;break;case c:m=(s-l)/v+4;break}m/=6}return t.h=m,t.s=p,t.l=g,t}getRGB(t,i=Ue.workingColorSpace){return Ue.workingToColorSpace(Pn.copy(this),i),t.r=Pn.r,t.g=Pn.g,t.b=Pn.b,t}getStyle(t=qn){Ue.workingToColorSpace(Pn.copy(this),t);const i=Pn.r,s=Pn.g,l=Pn.b;return t!==qn?`color(${t} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(t,i,s){return this.getHSL(Ja),this.setHSL(Ja.h+t,Ja.s+i,Ja.l+s)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,s){return this.r=t.r+(i.r-t.r)*s,this.g=t.g+(i.g-t.g)*s,this.b=t.b+(i.b-t.b)*s,this}lerpHSL(t,i){this.getHSL(Ja),t.getHSL(Dc);const s=vh(Ja.h,Dc.h,i),l=vh(Ja.s,Dc.s,i),c=vh(Ja.l,Dc.l,i);return this.setHSL(s,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,s=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new Fe;Fe.NAMES=U_;let wM=0;class ll extends Hr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wM++}),this.uuid=Vr(),this.name="",this.type="Material",this.blending=Nr,this.side=ns,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kh,this.blendDst=Jh,this.blendEquation=Cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=Or,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ov,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gr,this.stencilZFail=gr,this.stencilZPass=gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const s=t[i];if(s===void 0){pe(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){pe(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(t).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(t).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(t).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(t).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(t).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Nr&&(s.blending=this.blending),this.side!==ns&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Kh&&(s.blendSrc=this.blendSrc),this.blendDst!==Jh&&(s.blendDst=this.blendDst),this.blendEquation!==Cs&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Or&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ov&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gr&&(s.stencilFail=this.stencilFail),this.stencilZFail!==gr&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==gr&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.allowOverride===!1&&(s.allowOverride=!1),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const f=[];for(const d in c){const m=c[d];delete m.metadata,f.push(m)}return f}if(i){const c=l(t.textures),f=l(t.images);c.length>0&&(s.textures=c),f.length>0&&(s.images=f)}return s}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class sp extends ll{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gi,this.combine=f_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const hn=new K,Uc=new Yt;let DM=0;class Hi{constructor(t,i,s=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:DM++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=s,this.usage=lv,this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,s){t*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[s+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Uc.fromBufferAttribute(this,i),Uc.applyMatrix3(t),this.setXY(i,Uc.x,Uc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix3(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyMatrix4(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyMatrix4(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.applyNormalMatrix(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let i=0,s=this.count;i<s;i++)hn.fromBufferAttribute(this,i),hn.transformDirection(t),this.setXYZ(i,hn.x,hn.y,hn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let s=this.array[t*this.itemSize+i];return this.normalized&&(s=Io(s,this.array)),s}setComponent(t,i,s){return this.normalized&&(s=Wn(s,this.array)),this.array[t*this.itemSize+i]=s,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Io(i,this.array)),i}setX(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Io(i,this.array)),i}setY(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Io(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Io(i,this.array)),i}setW(t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,s){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array)),this.array[t+0]=i,this.array[t+1]=s,this}setXYZ(t,i,s,l){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this}setXYZW(t,i,s,l,c){return t*=this.itemSize,this.normalized&&(i=Wn(i,this.array),s=Wn(s,this.array),l=Wn(l,this.array),c=Wn(c,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lv&&(t.usage=this.usage),t}}class N_ extends Hi{constructor(t,i,s){super(new Uint16Array(t),i,s)}}class L_ extends Hi{constructor(t,i,s){super(new Uint32Array(t),i,s)}}class Ri extends Hi{constructor(t,i,s){super(new Float32Array(t),i,s)}}let UM=0;const pi=new tn,zh=new zn,Ar=new K,ni=new ol,ko=new ol,xn=new K;class Xi extends Hr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:UM++}),this.uuid=Vr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(C_(t)?L_:N_)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,s=0){this.groups.push({start:t,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new ye().getNormalMatrix(t);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pi.makeRotationFromQuaternion(t),this.applyMatrix4(pi),this}rotateX(t){return pi.makeRotationX(t),this.applyMatrix4(pi),this}rotateY(t){return pi.makeRotationY(t),this.applyMatrix4(pi),this}rotateZ(t){return pi.makeRotationZ(t),this.applyMatrix4(pi),this}translate(t,i,s){return pi.makeTranslation(t,i,s),this.applyMatrix4(pi),this}scale(t,i,s){return pi.makeScale(t,i,s),this.applyMatrix4(pi),this}lookAt(t){return zh.lookAt(t),zh.updateMatrix(),this.applyMatrix4(zh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=t.length;l<c;l++){const f=t[l];s.push(f.x,f.y,f.z||0)}this.setAttribute("position",new Ri(s,3))}else{const s=Math.min(t.length,i.count);for(let l=0;l<s;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ol);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){De("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];ni.setFromBufferAttribute(c),this.morphTargetsRelative?(xn.addVectors(this.boundingBox.min,ni.min),this.boundingBox.expandByPoint(xn),xn.addVectors(this.boundingBox.max,ni.max),this.boundingBox.expandByPoint(xn)):(this.boundingBox.expandByPoint(ni.min),this.boundingBox.expandByPoint(ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&De('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ap);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){De("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(t){const s=this.boundingSphere.center;if(ni.setFromBufferAttribute(t),i)for(let c=0,f=i.length;c<f;c++){const d=i[c];ko.setFromBufferAttribute(d),this.morphTargetsRelative?(xn.addVectors(ni.min,ko.min),ni.expandByPoint(xn),xn.addVectors(ni.max,ko.max),ni.expandByPoint(xn)):(ni.expandByPoint(ko.min),ni.expandByPoint(ko.max))}ni.getCenter(s);let l=0;for(let c=0,f=t.count;c<f;c++)xn.fromBufferAttribute(t,c),l=Math.max(l,s.distanceToSquared(xn));if(i)for(let c=0,f=i.length;c<f;c++){const d=i[c],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)xn.fromBufferAttribute(d,p),m&&(Ar.fromBufferAttribute(t,p),xn.add(Ar)),l=Math.max(l,s.distanceToSquared(xn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&De('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){De("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hi(new Float32Array(4*s.count),4));const f=this.getAttribute("tangent"),d=[],m=[];for(let k=0;k<s.count;k++)d[k]=new K,m[k]=new K;const p=new K,g=new K,v=new K,x=new Yt,y=new Yt,b=new Yt,C=new K,M=new K;function _(k,T,w){p.fromBufferAttribute(s,k),g.fromBufferAttribute(s,T),v.fromBufferAttribute(s,w),x.fromBufferAttribute(c,k),y.fromBufferAttribute(c,T),b.fromBufferAttribute(c,w),g.sub(p),v.sub(p),y.sub(x),b.sub(x);const V=1/(y.x*b.y-b.x*y.y);isFinite(V)&&(C.copy(g).multiplyScalar(b.y).addScaledVector(v,-y.y).multiplyScalar(V),M.copy(v).multiplyScalar(y.x).addScaledVector(g,-b.x).multiplyScalar(V),d[k].add(C),d[T].add(C),d[w].add(C),m[k].add(M),m[T].add(M),m[w].add(M))}let z=this.groups;z.length===0&&(z=[{start:0,count:t.count}]);for(let k=0,T=z.length;k<T;++k){const w=z[k],V=w.start,J=w.count;for(let Y=V,ut=V+J;Y<ut;Y+=3)_(t.getX(Y+0),t.getX(Y+1),t.getX(Y+2))}const U=new K,N=new K,B=new K,L=new K;function D(k){B.fromBufferAttribute(l,k),L.copy(B);const T=d[k];U.copy(T),U.sub(B.multiplyScalar(B.dot(T))).normalize(),N.crossVectors(L,T);const V=N.dot(m[k])<0?-1:1;f.setXYZW(k,U.x,U.y,U.z,V)}for(let k=0,T=z.length;k<T;++k){const w=z[k],V=w.start,J=w.count;for(let Y=V,ut=V+J;Y<ut;Y+=3)D(t.getX(Y+0)),D(t.getX(Y+1)),D(t.getX(Y+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Hi(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let x=0,y=s.count;x<y;x++)s.setXYZ(x,0,0,0);const l=new K,c=new K,f=new K,d=new K,m=new K,p=new K,g=new K,v=new K;if(t)for(let x=0,y=t.count;x<y;x+=3){const b=t.getX(x+0),C=t.getX(x+1),M=t.getX(x+2);l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,C),f.fromBufferAttribute(i,M),g.subVectors(f,c),v.subVectors(l,c),g.cross(v),d.fromBufferAttribute(s,b),m.fromBufferAttribute(s,C),p.fromBufferAttribute(s,M),d.add(g),m.add(g),p.add(g),s.setXYZ(b,d.x,d.y,d.z),s.setXYZ(C,m.x,m.y,m.z),s.setXYZ(M,p.x,p.y,p.z)}else for(let x=0,y=i.count;x<y;x+=3)l.fromBufferAttribute(i,x+0),c.fromBufferAttribute(i,x+1),f.fromBufferAttribute(i,x+2),g.subVectors(f,c),v.subVectors(l,c),g.cross(v),s.setXYZ(x+0,g.x,g.y,g.z),s.setXYZ(x+1,g.x,g.y,g.z),s.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,s=t.count;i<s;i++)xn.fromBufferAttribute(t,i),xn.normalize(),t.setXYZ(i,xn.x,xn.y,xn.z)}toNonIndexed(){function t(d,m){const p=d.array,g=d.itemSize,v=d.normalized,x=new p.constructor(m.length*g);let y=0,b=0;for(let C=0,M=m.length;C<M;C++){d.isInterleavedBufferAttribute?y=m[C]*d.data.stride+d.offset:y=m[C]*g;for(let _=0;_<g;_++)x[b++]=p[y++]}return new Hi(x,g,v)}if(this.index===null)return pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Xi,s=this.index.array,l=this.attributes;for(const d in l){const m=l[d],p=t(m,s);i.setAttribute(d,p)}const c=this.morphAttributes;for(const d in c){const m=[],p=c[d];for(let g=0,v=p.length;g<v;g++){const x=p[g],y=t(x,s);m.push(y)}i.morphAttributes[d]=m}i.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let d=0,m=f.length;d<m;d++){const p=f[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(t[p]=m[p]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const p=s[m];t.data.attributes[m]=p.toJSON(t.data)}const l={};let c=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let v=0,x=p.length;v<x;v++){const y=p[v];g.push(y.toJSON(t.data))}g.length>0&&(l[m]=g,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(t.data.groups=JSON.parse(JSON.stringify(f)));const d=this.boundingSphere;return d!==null&&(t.data.boundingSphere=d.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const s=t.index;s!==null&&this.setIndex(s.clone());const l=t.attributes;for(const p in l){const g=l[p];this.setAttribute(p,g.clone(i))}const c=t.morphAttributes;for(const p in c){const g=[],v=c[p];for(let x=0,y=v.length;x<y;x++)g.push(v[x].clone(i));this.morphAttributes[p]=g}this.morphTargetsRelative=t.morphTargetsRelative;const f=t.groups;for(let p=0,g=f.length;p<g;p++){const v=f[p];this.addGroup(v.start,v.count,v.materialIndex)}const d=t.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ev=new tn,Es=new MM,Nc=new ap,bv=new K,Lc=new K,Oc=new K,Pc=new K,Fh=new K,zc=new K,Tv=new K,Fc=new K;class Ci extends zn{constructor(t=new Xi,i=new sp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(t,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,f=s.morphTargetsRelative;i.fromBufferAttribute(l,t);const d=this.morphTargetInfluences;if(c&&d){zc.set(0,0,0);for(let m=0,p=c.length;m<p;m++){const g=d[m],v=c[m];g!==0&&(Fh.fromBufferAttribute(v,t),f?zc.addScaledVector(Fh,g):zc.addScaledVector(Fh.sub(i),g))}i.add(zc)}return i}raycast(t,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Nc.copy(s.boundingSphere),Nc.applyMatrix4(c),Es.copy(t.ray).recast(t.near),!(Nc.containsPoint(Es.origin)===!1&&(Es.intersectSphere(Nc,bv)===null||Es.origin.distanceToSquared(bv)>(t.far-t.near)**2))&&(Ev.copy(c).invert(),Es.copy(t.ray).applyMatrix4(Ev),!(s.boundingBox!==null&&Es.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(t,i,Es)))}_computeIntersections(t,i,s){let l;const c=this.geometry,f=this.material,d=c.index,m=c.attributes.position,p=c.attributes.uv,g=c.attributes.uv1,v=c.attributes.normal,x=c.groups,y=c.drawRange;if(d!==null)if(Array.isArray(f))for(let b=0,C=x.length;b<C;b++){const M=x[b],_=f[M.materialIndex],z=Math.max(M.start,y.start),U=Math.min(d.count,Math.min(M.start+M.count,y.start+y.count));for(let N=z,B=U;N<B;N+=3){const L=d.getX(N),D=d.getX(N+1),k=d.getX(N+2);l=Bc(this,_,t,s,p,g,v,L,D,k),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,y.start),C=Math.min(d.count,y.start+y.count);for(let M=b,_=C;M<_;M+=3){const z=d.getX(M),U=d.getX(M+1),N=d.getX(M+2);l=Bc(this,f,t,s,p,g,v,z,U,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(f))for(let b=0,C=x.length;b<C;b++){const M=x[b],_=f[M.materialIndex],z=Math.max(M.start,y.start),U=Math.min(m.count,Math.min(M.start+M.count,y.start+y.count));for(let N=z,B=U;N<B;N+=3){const L=N,D=N+1,k=N+2;l=Bc(this,_,t,s,p,g,v,L,D,k),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,y.start),C=Math.min(m.count,y.start+y.count);for(let M=b,_=C;M<_;M+=3){const z=M,U=M+1,N=M+2;l=Bc(this,f,t,s,p,g,v,z,U,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}}}function NM(r,t,i,s,l,c,f,d){let m;if(t.side===Yn?m=s.intersectTriangle(f,c,l,!0,d):m=s.intersectTriangle(l,c,f,t.side===ns,d),m===null)return null;Fc.copy(d),Fc.applyMatrix4(r.matrixWorld);const p=i.ray.origin.distanceTo(Fc);return p<i.near||p>i.far?null:{distance:p,point:Fc.clone(),object:r}}function Bc(r,t,i,s,l,c,f,d,m,p){r.getVertexPosition(d,Lc),r.getVertexPosition(m,Oc),r.getVertexPosition(p,Pc);const g=NM(r,t,i,s,Lc,Oc,Pc,Tv);if(g){const v=new K;Ti.getBarycoord(Tv,Lc,Oc,Pc,v),l&&(g.uv=Ti.getInterpolatedAttribute(l,d,m,p,v,new Yt)),c&&(g.uv1=Ti.getInterpolatedAttribute(c,d,m,p,v,new Yt)),f&&(g.normal=Ti.getInterpolatedAttribute(f,d,m,p,v,new K),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const x={a:d,b:m,c:p,normal:new K,materialIndex:0};Ti.getNormal(Lc,Oc,Pc,x.normal),g.face=x,g.barycoord=v}return g}class cl extends Xi{constructor(t=1,i=1,s=1,l=1,c=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:f};const d=this;l=Math.floor(l),c=Math.floor(c),f=Math.floor(f);const m=[],p=[],g=[],v=[];let x=0,y=0;b("z","y","x",-1,-1,s,i,t,f,c,0),b("z","y","x",1,-1,s,i,-t,f,c,1),b("x","z","y",1,1,t,s,i,l,f,2),b("x","z","y",1,-1,t,s,-i,l,f,3),b("x","y","z",1,-1,t,i,s,l,c,4),b("x","y","z",-1,-1,t,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new Ri(p,3)),this.setAttribute("normal",new Ri(g,3)),this.setAttribute("uv",new Ri(v,2));function b(C,M,_,z,U,N,B,L,D,k,T){const w=N/D,V=B/k,J=N/2,Y=B/2,ut=L/2,rt=D+1,I=k+1;let H=0,tt=0;const bt=new K;for(let Mt=0;Mt<I;Mt++){const F=Mt*V-Y;for(let $=0;$<rt;$++){const ft=$*w-J;bt[C]=ft*z,bt[M]=F*U,bt[_]=ut,p.push(bt.x,bt.y,bt.z),bt[C]=0,bt[M]=0,bt[_]=L>0?1:-1,g.push(bt.x,bt.y,bt.z),v.push($/D),v.push(1-Mt/k),H+=1}}for(let Mt=0;Mt<k;Mt++)for(let F=0;F<D;F++){const $=x+F+rt*Mt,ft=x+F+rt*(Mt+1),Rt=x+(F+1)+rt*(Mt+1),Xt=x+(F+1)+rt*Mt;m.push($,ft,Xt),m.push(ft,Rt,Xt),tt+=6}d.addGroup(y,tt,T),y+=tt,x+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cl(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Br(r){const t={};for(const i in r){t[i]={};for(const s in r[i]){const l=r[i][s];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][s]=null):t[i][s]=l.clone():Array.isArray(l)?t[i][s]=l.slice():t[i][s]=l}}return t}function Bn(r){const t={};for(let i=0;i<r.length;i++){const s=Br(r[i]);for(const l in s)t[l]=s[l]}return t}function LM(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function O_(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ue.workingColorSpace}const OM={clone:Br,merge:Bn};var PM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends ll{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=PM,this.fragmentShader=zM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Br(t.uniforms),this.uniformsGroups=LM(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const f=this.uniforms[l].value;f&&f.isTexture?i.uniforms[l]={type:"t",value:f.toJSON(t).uuid}:f&&f.isColor?i.uniforms[l]={type:"c",value:f.getHex()}:f&&f.isVector2?i.uniforms[l]={type:"v2",value:f.toArray()}:f&&f.isVector3?i.uniforms[l]={type:"v3",value:f.toArray()}:f&&f.isVector4?i.uniforms[l]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?i.uniforms[l]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?i.uniforms[l]={type:"m4",value:f.toArray()}:i.uniforms[l]={value:f}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class P_ extends zn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tn,this.projectionMatrix=new tn,this.projectionMatrixInverse=new tn,this.coordinateSystem=Fi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qa=new K,Av=new Yt,Rv=new Yt;class mi extends P_{constructor(t=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=Vd*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(gh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vd*2*Math.atan(Math.tan(gh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,s){Qa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qa.x,Qa.y).multiplyScalar(-t/Qa.z),Qa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(Qa.x,Qa.y).multiplyScalar(-t/Qa.z)}getViewSize(t,i){return this.getViewBounds(t,Av,Rv),i.subVectors(Rv,Av)}setViewOffset(t,i,s,l,c,f){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(gh*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const f=this.view;if(this.view!==null&&this.view.enabled){const m=f.fullWidth,p=f.fullHeight;c+=f.offsetX*l/m,i-=f.offsetY*s/p,l*=f.width/m,s*=f.height/p}const d=this.filmOffset;d!==0&&(c+=t*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const Rr=-90,Cr=1;class FM extends zn{constructor(t,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new mi(Rr,Cr,t,i);l.layers=this.layers,this.add(l);const c=new mi(Rr,Cr,t,i);c.layers=this.layers,this.add(c);const f=new mi(Rr,Cr,t,i);f.layers=this.layers,this.add(f);const d=new mi(Rr,Cr,t,i);d.layers=this.layers,this.add(d);const m=new mi(Rr,Cr,t,i);m.layers=this.layers,this.add(m);const p=new mi(Rr,Cr,t,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[s,l,c,f,d,m]=i;for(const p of i)this.remove(p);if(t===Fi)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===tu)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const p of i)this.add(p),p.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,f,d,m,p,g]=this.children,v=t.getRenderTarget(),x=t.getActiveCubeFace(),y=t.getActiveMipmapLevel(),b=t.xr.enabled;t.xr.enabled=!1;const C=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,t.setRenderTarget(s,0,l),t.render(i,c),t.setRenderTarget(s,1,l),t.render(i,f),t.setRenderTarget(s,2,l),t.render(i,d),t.setRenderTarget(s,3,l),t.render(i,m),t.setRenderTarget(s,4,l),t.render(i,p),s.texture.generateMipmaps=C,t.setRenderTarget(s,5,l),t.render(i,g),t.setRenderTarget(v,x,y),t.xr.enabled=b,s.texture.needsPMREMUpdate=!0}}class z_ extends Un{constructor(t=[],i=Ns,s,l,c,f,d,m,p,g){super(t,i,s,l,c,f,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class F_ extends Ii{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const s={width:t,height:t,depth:1},l=[s,s,s,s,s,s];this.texture=new z_(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new cl(5,5,5),c=new ki({name:"CubemapFromEquirect",uniforms:Br(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Yn,blending:va});c.uniforms.tEquirect.value=i;const f=new Ci(l,c),d=i.minFilter;return i.minFilter===Ds&&(i.minFilter=dn),new FM(1,10,this).update(t,f),i.minFilter=d,f.geometry.dispose(),f.material.dispose(),this}clear(t,i=!0,s=!0,l=!0){const c=t.getRenderTarget();for(let f=0;f<6;f++)t.setRenderTarget(this,f),t.clear(i,s,l);t.setRenderTarget(c)}}class Dr extends zn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const BM={type:"move"};class Bh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const s of t.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,s){let l=null,c=null,f=null;const d=this._targetRay,m=this._grip,p=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(p&&t.hand){f=!0;for(const C of t.hand.values()){const M=i.getJointPose(C,s),_=this._getHandJoint(p,C);M!==null&&(_.matrix.fromArray(M.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=M.radius),_.visible=M!==null}const g=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],x=g.position.distanceTo(v.position),y=.02,b=.005;p.inputState.pinching&&x>y+b?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!p.inputState.pinching&&x<=y-b&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(l=i.getPose(t.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(BM)))}return d!==null&&(d.visible=l!==null),m!==null&&(m.visible=c!==null),p!==null&&(p.visible=f!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const s=new Dr;s.matrixAutoUpdate=!1,s.visible=!1,t.joints[i.jointName]=s,t.add(s)}return t.joints[i.jointName]}}class IM extends zn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gi,this.environmentIntensity=1,this.environmentRotation=new Gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class HM extends Un{constructor(t=null,i=1,s=1,l,c,f,d,m,p=Dn,g=Dn,v,x){super(null,f,d,m,p,g,l,c,v,x),this.isDataTexture=!0,this.image={data:t,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ih=new K,VM=new K,GM=new ye;class Rs{constructor(t=new K(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,s,l){return this.normal.set(t,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,s){const l=Ih.subVectors(s,i).cross(VM.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const s=t.delta(Ih),l=this.normal.dot(s);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const c=-(t.start.dot(this.normal)+this.constant)/l;return c<0||c>1?null:i.copy(t.start).addScaledVector(s,c)}intersectsLine(t){const i=this.distanceToPoint(t.start),s=this.distanceToPoint(t.end);return i<0&&s>0||s<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const s=i||GM.getNormalMatrix(t),l=this.coplanarPoint(Ih).applyMatrix4(t),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bs=new ap,kM=new Yt(.5,.5),Ic=new K;class rp{constructor(t=new Rs,i=new Rs,s=new Rs,l=new Rs,c=new Rs,f=new Rs){this.planes=[t,i,s,l,c,f]}set(t,i,s,l,c,f){const d=this.planes;return d[0].copy(t),d[1].copy(i),d[2].copy(s),d[3].copy(l),d[4].copy(c),d[5].copy(f),this}copy(t){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(t.planes[s]);return this}setFromProjectionMatrix(t,i=Fi,s=!1){const l=this.planes,c=t.elements,f=c[0],d=c[1],m=c[2],p=c[3],g=c[4],v=c[5],x=c[6],y=c[7],b=c[8],C=c[9],M=c[10],_=c[11],z=c[12],U=c[13],N=c[14],B=c[15];if(l[0].setComponents(p-f,y-g,_-b,B-z).normalize(),l[1].setComponents(p+f,y+g,_+b,B+z).normalize(),l[2].setComponents(p+d,y+v,_+C,B+U).normalize(),l[3].setComponents(p-d,y-v,_-C,B-U).normalize(),s)l[4].setComponents(m,x,M,N).normalize(),l[5].setComponents(p-m,y-x,_-M,B-N).normalize();else if(l[4].setComponents(p-m,y-x,_-M,B-N).normalize(),i===Fi)l[5].setComponents(p+m,y+x,_+M,B+N).normalize();else if(i===tu)l[5].setComponents(m,x,M,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),bs.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(t){bs.center.set(0,0,0);const i=kM.distanceTo(t.center);return bs.radius=.7071067811865476+i,bs.applyMatrix4(t.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(t){const i=this.planes,s=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Ic.x=l.normal.x>0?t.max.x:t.min.x,Ic.y=l.normal.y>0?t.max.y:t.min.y,Ic.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Ic)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class XM extends Un{constructor(t,i,s,l,c=dn,f=dn,d,m,p){super(t,i,s,l,c,f,d,m,p),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const g=this;function v(){g.needsUpdate=!0,g._requestVideoFrameCallbackId=t.requestVideoFrameCallback(v)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(v))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class WM extends Un{constructor(t,i,s,l,c,f,d,m,p){super(t,i,s,l,c,f,d,m,p),this.isCanvasTexture=!0,this.needsUpdate=!0}}class el extends Un{constructor(t,i,s=Vi,l,c,f,d=Dn,m=Dn,p,g=Sa,v=1){if(g!==Sa&&g!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const x={width:t,height:i,depth:v};super(x,l,c,f,d,m,g,s,p),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ip(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class qM extends el{constructor(t,i=Vi,s=Ns,l,c,f=Dn,d=Dn,m,p=Sa){const g={width:t,height:t,depth:1},v=[g,g,g,g,g,g];super(t,t,i,s,l,c,f,d,m,p),this.image=v,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class B_ extends Un{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Wi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){pe("Curve: .getPoint() not implemented.")}getPointAt(t,i){const s=this.getUtoTmapping(t);return this.getPoint(s,i)}getPoints(t=5){const i=[];for(let s=0;s<=t;s++)i.push(this.getPoint(s/t));return i}getSpacedPoints(t=5){const i=[];for(let s=0;s<=t;s++)i.push(this.getPointAt(s/t));return i}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const i=[];let s,l=this.getPoint(0),c=0;i.push(0);for(let f=1;f<=t;f++)s=this.getPoint(f/t),c+=s.distanceTo(l),i.push(c),l=s;return this.cacheArcLengths=i,i}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,i=null){const s=this.getLengths();let l=0;const c=s.length;let f;i?f=i:f=t*s[c-1];let d=0,m=c-1,p;for(;d<=m;)if(l=Math.floor(d+(m-d)/2),p=s[l]-f,p<0)d=l+1;else if(p>0)m=l-1;else{m=l;break}if(l=m,s[l]===f)return l/(c-1);const g=s[l],x=s[l+1]-g,y=(f-g)/x;return(l+y)/(c-1)}getTangent(t,i){let l=t-1e-4,c=t+1e-4;l<0&&(l=0),c>1&&(c=1);const f=this.getPoint(l),d=this.getPoint(c),m=i||(f.isVector2?new Yt:new K);return m.copy(d).sub(f).normalize(),m}getTangentAt(t,i){const s=this.getUtoTmapping(t);return this.getTangent(s,i)}computeFrenetFrames(t,i=!1){const s=new K,l=[],c=[],f=[],d=new K,m=new tn;for(let y=0;y<=t;y++){const b=y/t;l[y]=this.getTangentAt(b,new K)}c[0]=new K,f[0]=new K;let p=Number.MAX_VALUE;const g=Math.abs(l[0].x),v=Math.abs(l[0].y),x=Math.abs(l[0].z);g<=p&&(p=g,s.set(1,0,0)),v<=p&&(p=v,s.set(0,1,0)),x<=p&&s.set(0,0,1),d.crossVectors(l[0],s).normalize(),c[0].crossVectors(l[0],d),f[0].crossVectors(l[0],c[0]);for(let y=1;y<=t;y++){if(c[y]=c[y-1].clone(),f[y]=f[y-1].clone(),d.crossVectors(l[y-1],l[y]),d.length()>Number.EPSILON){d.normalize();const b=Math.acos(Te(l[y-1].dot(l[y]),-1,1));c[y].applyMatrix4(m.makeRotationAxis(d,b))}f[y].crossVectors(l[y],c[y])}if(i===!0){let y=Math.acos(Te(c[0].dot(c[t]),-1,1));y/=t,l[0].dot(d.crossVectors(c[0],c[t]))>0&&(y=-y);for(let b=1;b<=t;b++)c[b].applyMatrix4(m.makeRotationAxis(l[b],y*b)),f[b].crossVectors(l[b],c[b])}return{tangents:l,normals:c,binormals:f}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class op extends Wi{constructor(t=0,i=0,s=1,l=1,c=0,f=Math.PI*2,d=!1,m=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=i,this.xRadius=s,this.yRadius=l,this.aStartAngle=c,this.aEndAngle=f,this.aClockwise=d,this.aRotation=m}getPoint(t,i=new Yt){const s=i,l=Math.PI*2;let c=this.aEndAngle-this.aStartAngle;const f=Math.abs(c)<Number.EPSILON;for(;c<0;)c+=l;for(;c>l;)c-=l;c<Number.EPSILON&&(f?c=0:c=l),this.aClockwise===!0&&!f&&(c===l?c=-l:c=c-l);const d=this.aStartAngle+t*c;let m=this.aX+this.xRadius*Math.cos(d),p=this.aY+this.yRadius*Math.sin(d);if(this.aRotation!==0){const g=Math.cos(this.aRotation),v=Math.sin(this.aRotation),x=m-this.aX,y=p-this.aY;m=x*g-y*v+this.aX,p=x*v+y*g+this.aY}return s.set(m,p)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class YM extends op{constructor(t,i,s,l,c,f){super(t,i,s,s,l,c,f),this.isArcCurve=!0,this.type="ArcCurve"}}function lp(){let r=0,t=0,i=0,s=0;function l(c,f,d,m){r=c,t=d,i=-3*c+3*f-2*d-m,s=2*c-2*f+d+m}return{initCatmullRom:function(c,f,d,m,p){l(f,d,p*(d-c),p*(m-f))},initNonuniformCatmullRom:function(c,f,d,m,p,g,v){let x=(f-c)/p-(d-c)/(p+g)+(d-f)/g,y=(d-f)/g-(m-f)/(g+v)+(m-d)/v;x*=g,y*=g,l(f,d,x,y)},calc:function(c){const f=c*c,d=f*c;return r+t*c+i*f+s*d}}}const Hc=new K,Hh=new lp,Vh=new lp,Gh=new lp;class jM extends Wi{constructor(t=[],i=!1,s="centripetal",l=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=i,this.curveType=s,this.tension=l}getPoint(t,i=new K){const s=i,l=this.points,c=l.length,f=(c-(this.closed?0:1))*t;let d=Math.floor(f),m=f-d;this.closed?d+=d>0?0:(Math.floor(Math.abs(d)/c)+1)*c:m===0&&d===c-1&&(d=c-2,m=1);let p,g;this.closed||d>0?p=l[(d-1)%c]:(Hc.subVectors(l[0],l[1]).add(l[0]),p=Hc);const v=l[d%c],x=l[(d+1)%c];if(this.closed||d+2<c?g=l[(d+2)%c]:(Hc.subVectors(l[c-1],l[c-2]).add(l[c-1]),g=Hc),this.curveType==="centripetal"||this.curveType==="chordal"){const y=this.curveType==="chordal"?.5:.25;let b=Math.pow(p.distanceToSquared(v),y),C=Math.pow(v.distanceToSquared(x),y),M=Math.pow(x.distanceToSquared(g),y);C<1e-4&&(C=1),b<1e-4&&(b=C),M<1e-4&&(M=C),Hh.initNonuniformCatmullRom(p.x,v.x,x.x,g.x,b,C,M),Vh.initNonuniformCatmullRom(p.y,v.y,x.y,g.y,b,C,M),Gh.initNonuniformCatmullRom(p.z,v.z,x.z,g.z,b,C,M)}else this.curveType==="catmullrom"&&(Hh.initCatmullRom(p.x,v.x,x.x,g.x,this.tension),Vh.initCatmullRom(p.y,v.y,x.y,g.y,this.tension),Gh.initCatmullRom(p.z,v.z,x.z,g.z,this.tension));return s.set(Hh.calc(m),Vh.calc(m),Gh.calc(m)),s}copy(t){super.copy(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(l.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let i=0,s=this.points.length;i<s;i++){const l=this.points[i];t.points.push(l.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(new K().fromArray(l))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Cv(r,t,i,s,l){const c=(s-t)*.5,f=(l-i)*.5,d=r*r,m=r*d;return(2*i-2*s+c+f)*m+(-3*i+3*s-2*c-f)*d+c*r+i}function ZM(r,t){const i=1-r;return i*i*t}function KM(r,t){return 2*(1-r)*r*t}function JM(r,t){return r*r*t}function Zo(r,t,i,s){return ZM(r,t)+KM(r,i)+JM(r,s)}function QM(r,t){const i=1-r;return i*i*i*t}function $M(r,t){const i=1-r;return 3*i*i*r*t}function tE(r,t){return 3*(1-r)*r*r*t}function eE(r,t){return r*r*r*t}function Ko(r,t,i,s,l){return QM(r,t)+$M(r,i)+tE(r,s)+eE(r,l)}class I_ extends Wi{constructor(t=new Yt,i=new Yt,s=new Yt,l=new Yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=i,this.v2=s,this.v3=l}getPoint(t,i=new Yt){const s=i,l=this.v0,c=this.v1,f=this.v2,d=this.v3;return s.set(Ko(t,l.x,c.x,f.x,d.x),Ko(t,l.y,c.y,f.y,d.y)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class nE extends Wi{constructor(t=new K,i=new K,s=new K,l=new K){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=i,this.v2=s,this.v3=l}getPoint(t,i=new K){const s=i,l=this.v0,c=this.v1,f=this.v2,d=this.v3;return s.set(Ko(t,l.x,c.x,f.x,d.x),Ko(t,l.y,c.y,f.y,d.y),Ko(t,l.z,c.z,f.z,d.z)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class H_ extends Wi{constructor(t=new Yt,i=new Yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=i}getPoint(t,i=new Yt){const s=i;return t===1?s.copy(this.v2):(s.copy(this.v2).sub(this.v1),s.multiplyScalar(t).add(this.v1)),s}getPointAt(t,i){return this.getPoint(t,i)}getTangent(t,i=new Yt){return i.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,i){return this.getTangent(t,i)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class iE extends Wi{constructor(t=new K,i=new K){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=i}getPoint(t,i=new K){const s=i;return t===1?s.copy(this.v2):(s.copy(this.v2).sub(this.v1),s.multiplyScalar(t).add(this.v1)),s}getPointAt(t,i){return this.getPoint(t,i)}getTangent(t,i=new K){return i.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,i){return this.getTangent(t,i)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class V_ extends Wi{constructor(t=new Yt,i=new Yt,s=new Yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=i,this.v2=s}getPoint(t,i=new Yt){const s=i,l=this.v0,c=this.v1,f=this.v2;return s.set(Zo(t,l.x,c.x,f.x),Zo(t,l.y,c.y,f.y)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class aE extends Wi{constructor(t=new K,i=new K,s=new K){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=i,this.v2=s}getPoint(t,i=new K){const s=i,l=this.v0,c=this.v1,f=this.v2;return s.set(Zo(t,l.x,c.x,f.x),Zo(t,l.y,c.y,f.y),Zo(t,l.z,c.z,f.z)),s}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class G_ extends Wi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,i=new Yt){const s=i,l=this.points,c=(l.length-1)*t,f=Math.floor(c),d=c-f,m=l[f===0?f:f-1],p=l[f],g=l[f>l.length-2?l.length-1:f+1],v=l[f>l.length-3?l.length-1:f+2];return s.set(Cv(d,m.x,p.x,g.x,v.x),Cv(d,m.y,p.y,g.y,v.y)),s}copy(t){super.copy(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(l.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let i=0,s=this.points.length;i<s;i++){const l=this.points[i];t.points.push(l.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let i=0,s=t.points.length;i<s;i++){const l=t.points[i];this.points.push(new Yt().fromArray(l))}return this}}var Gd=Object.freeze({__proto__:null,ArcCurve:YM,CatmullRomCurve3:jM,CubicBezierCurve:I_,CubicBezierCurve3:nE,EllipseCurve:op,LineCurve:H_,LineCurve3:iE,QuadraticBezierCurve:V_,QuadraticBezierCurve3:aE,SplineCurve:G_});class sE extends Wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),i=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(i)){const s=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gd[s](i,t))}return this}getPoint(t,i){const s=t*this.getLength(),l=this.getCurveLengths();let c=0;for(;c<l.length;){if(l[c]>=s){const f=l[c]-s,d=this.curves[c],m=d.getLength(),p=m===0?0:1-f/m;return d.getPointAt(p,i)}c++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let i=0;for(let s=0,l=this.curves.length;s<l;s++)i+=this.curves[s].getLength(),t.push(i);return this.cacheLengths=t,t}getSpacedPoints(t=40){const i=[];for(let s=0;s<=t;s++)i.push(this.getPoint(s/t));return this.autoClose&&i.push(i[0]),i}getPoints(t=12){const i=[];let s;for(let l=0,c=this.curves;l<c.length;l++){const f=c[l],d=f.isEllipseCurve?t*2:f.isLineCurve||f.isLineCurve3?1:f.isSplineCurve?t*f.points.length:t,m=f.getPoints(d);for(let p=0;p<m.length;p++){const g=m[p];s&&s.equals(g)||(i.push(g),s=g)}}return this.autoClose&&i.length>1&&!i[i.length-1].equals(i[0])&&i.push(i[0]),i}copy(t){super.copy(t),this.curves=[];for(let i=0,s=t.curves.length;i<s;i++){const l=t.curves[i];this.curves.push(l.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let i=0,s=this.curves.length;i<s;i++){const l=this.curves[i];t.curves.push(l.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let i=0,s=t.curves.length;i<s;i++){const l=t.curves[i];this.curves.push(new Gd[l.type]().fromJSON(l))}return this}}class wv extends sE{constructor(t){super(),this.type="Path",this.currentPoint=new Yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let i=1,s=t.length;i<s;i++)this.lineTo(t[i].x,t[i].y);return this}moveTo(t,i){return this.currentPoint.set(t,i),this}lineTo(t,i){const s=new H_(this.currentPoint.clone(),new Yt(t,i));return this.curves.push(s),this.currentPoint.set(t,i),this}quadraticCurveTo(t,i,s,l){const c=new V_(this.currentPoint.clone(),new Yt(t,i),new Yt(s,l));return this.curves.push(c),this.currentPoint.set(s,l),this}bezierCurveTo(t,i,s,l,c,f){const d=new I_(this.currentPoint.clone(),new Yt(t,i),new Yt(s,l),new Yt(c,f));return this.curves.push(d),this.currentPoint.set(c,f),this}splineThru(t){const i=[this.currentPoint.clone()].concat(t),s=new G_(i);return this.curves.push(s),this.currentPoint.copy(t[t.length-1]),this}arc(t,i,s,l,c,f){const d=this.currentPoint.x,m=this.currentPoint.y;return this.absarc(t+d,i+m,s,l,c,f),this}absarc(t,i,s,l,c,f){return this.absellipse(t,i,s,s,l,c,f),this}ellipse(t,i,s,l,c,f,d,m){const p=this.currentPoint.x,g=this.currentPoint.y;return this.absellipse(t+p,i+g,s,l,c,f,d,m),this}absellipse(t,i,s,l,c,f,d,m){const p=new op(t,i,s,l,c,f,d,m);if(this.curves.length>0){const v=p.getPoint(0);v.equals(this.currentPoint)||this.lineTo(v.x,v.y)}this.curves.push(p);const g=p.getPoint(1);return this.currentPoint.copy(g),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class k_ extends wv{constructor(t){super(t),this.uuid=Vr(),this.type="Shape",this.holes=[]}getPointsHoles(t){const i=[];for(let s=0,l=this.holes.length;s<l;s++)i[s]=this.holes[s].getPoints(t);return i}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let i=0,s=t.holes.length;i<s;i++){const l=t.holes[i];this.holes.push(l.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let i=0,s=this.holes.length;i<s;i++){const l=this.holes[i];t.holes.push(l.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let i=0,s=t.holes.length;i<s;i++){const l=t.holes[i];this.holes.push(new wv().fromJSON(l))}return this}}function rE(r,t,i=2){const s=t&&t.length,l=s?t[0]*i:r.length;let c=X_(r,0,l,i,!0);const f=[];if(!c||c.next===c.prev)return f;let d,m,p;if(s&&(c=fE(r,t,c,i)),r.length>80*i){d=r[0],m=r[1];let g=d,v=m;for(let x=i;x<l;x+=i){const y=r[x],b=r[x+1];y<d&&(d=y),b<m&&(m=b),y>g&&(g=y),b>v&&(v=b)}p=Math.max(g-d,v-m),p=p!==0?32767/p:0}return nl(c,f,i,d,m,p,0),f}function X_(r,t,i,s,l){let c;if(l===ME(r,t,i,s)>0)for(let f=t;f<i;f+=s)c=Dv(f/s|0,r[f],r[f+1],c);else for(let f=i-s;f>=t;f-=s)c=Dv(f/s|0,r[f],r[f+1],c);return c&&Ir(c,c.next)&&(al(c),c=c.next),c}function Ls(r,t){if(!r)return r;t||(t=r);let i=r,s;do if(s=!1,!i.steiner&&(Ir(i,i.next)||$e(i.prev,i,i.next)===0)){if(al(i),i=t=i.prev,i===i.next)break;s=!0}else i=i.next;while(s||i!==t);return t}function nl(r,t,i,s,l,c,f){if(!r)return;!f&&c&&gE(r,s,l,c);let d=r;for(;r.prev!==r.next;){const m=r.prev,p=r.next;if(c?lE(r,s,l,c):oE(r)){t.push(m.i,r.i,p.i),al(r),r=p.next,d=p.next;continue}if(r=p,r===d){f?f===1?(r=cE(Ls(r),t),nl(r,t,i,s,l,c,2)):f===2&&uE(r,t,i,s,l,c):nl(Ls(r),t,i,s,l,c,1);break}}}function oE(r){const t=r.prev,i=r,s=r.next;if($e(t,i,s)>=0)return!1;const l=t.x,c=i.x,f=s.x,d=t.y,m=i.y,p=s.y,g=Math.min(l,c,f),v=Math.min(d,m,p),x=Math.max(l,c,f),y=Math.max(d,m,p);let b=s.next;for(;b!==t;){if(b.x>=g&&b.x<=x&&b.y>=v&&b.y<=y&&Yo(l,d,c,m,f,p,b.x,b.y)&&$e(b.prev,b,b.next)>=0)return!1;b=b.next}return!0}function lE(r,t,i,s){const l=r.prev,c=r,f=r.next;if($e(l,c,f)>=0)return!1;const d=l.x,m=c.x,p=f.x,g=l.y,v=c.y,x=f.y,y=Math.min(d,m,p),b=Math.min(g,v,x),C=Math.max(d,m,p),M=Math.max(g,v,x),_=kd(y,b,t,i,s),z=kd(C,M,t,i,s);let U=r.prevZ,N=r.nextZ;for(;U&&U.z>=_&&N&&N.z<=z;){if(U.x>=y&&U.x<=C&&U.y>=b&&U.y<=M&&U!==l&&U!==f&&Yo(d,g,m,v,p,x,U.x,U.y)&&$e(U.prev,U,U.next)>=0||(U=U.prevZ,N.x>=y&&N.x<=C&&N.y>=b&&N.y<=M&&N!==l&&N!==f&&Yo(d,g,m,v,p,x,N.x,N.y)&&$e(N.prev,N,N.next)>=0))return!1;N=N.nextZ}for(;U&&U.z>=_;){if(U.x>=y&&U.x<=C&&U.y>=b&&U.y<=M&&U!==l&&U!==f&&Yo(d,g,m,v,p,x,U.x,U.y)&&$e(U.prev,U,U.next)>=0)return!1;U=U.prevZ}for(;N&&N.z<=z;){if(N.x>=y&&N.x<=C&&N.y>=b&&N.y<=M&&N!==l&&N!==f&&Yo(d,g,m,v,p,x,N.x,N.y)&&$e(N.prev,N,N.next)>=0)return!1;N=N.nextZ}return!0}function cE(r,t){let i=r;do{const s=i.prev,l=i.next.next;!Ir(s,l)&&q_(s,i,i.next,l)&&il(s,l)&&il(l,s)&&(t.push(s.i,i.i,l.i),al(i),al(i.next),i=r=l),i=i.next}while(i!==r);return Ls(i)}function uE(r,t,i,s,l,c){let f=r;do{let d=f.next.next;for(;d!==f.prev;){if(f.i!==d.i&&xE(f,d)){let m=Y_(f,d);f=Ls(f,f.next),m=Ls(m,m.next),nl(f,t,i,s,l,c,0),nl(m,t,i,s,l,c,0);return}d=d.next}f=f.next}while(f!==r)}function fE(r,t,i,s){const l=[];for(let c=0,f=t.length;c<f;c++){const d=t[c]*s,m=c<f-1?t[c+1]*s:r.length,p=X_(r,d,m,s,!1);p===p.next&&(p.steiner=!0),l.push(_E(p))}l.sort(hE);for(let c=0;c<l.length;c++)i=dE(l[c],i);return i}function hE(r,t){let i=r.x-t.x;if(i===0&&(i=r.y-t.y,i===0)){const s=(r.next.y-r.y)/(r.next.x-r.x),l=(t.next.y-t.y)/(t.next.x-t.x);i=s-l}return i}function dE(r,t){const i=pE(r,t);if(!i)return t;const s=Y_(i,r);return Ls(s,s.next),Ls(i,i.next)}function pE(r,t){let i=t;const s=r.x,l=r.y;let c=-1/0,f;if(Ir(r,i))return i;do{if(Ir(r,i.next))return i.next;if(l<=i.y&&l>=i.next.y&&i.next.y!==i.y){const v=i.x+(l-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(v<=s&&v>c&&(c=v,f=i.x<i.next.x?i:i.next,v===s))return f}i=i.next}while(i!==t);if(!f)return null;const d=f,m=f.x,p=f.y;let g=1/0;i=f;do{if(s>=i.x&&i.x>=m&&s!==i.x&&W_(l<p?s:c,l,m,p,l<p?c:s,l,i.x,i.y)){const v=Math.abs(l-i.y)/(s-i.x);il(i,r)&&(v<g||v===g&&(i.x>f.x||i.x===f.x&&mE(f,i)))&&(f=i,g=v)}i=i.next}while(i!==d);return f}function mE(r,t){return $e(r.prev,r,t.prev)<0&&$e(t.next,r,r.next)<0}function gE(r,t,i,s){let l=r;do l.z===0&&(l.z=kd(l.x,l.y,t,i,s)),l.prevZ=l.prev,l.nextZ=l.next,l=l.next;while(l!==r);l.prevZ.nextZ=null,l.prevZ=null,vE(l)}function vE(r){let t,i=1;do{let s=r,l;r=null;let c=null;for(t=0;s;){t++;let f=s,d=0;for(let p=0;p<i&&(d++,f=f.nextZ,!!f);p++);let m=i;for(;d>0||m>0&&f;)d!==0&&(m===0||!f||s.z<=f.z)?(l=s,s=s.nextZ,d--):(l=f,f=f.nextZ,m--),c?c.nextZ=l:r=l,l.prevZ=c,c=l;s=f}c.nextZ=null,i*=2}while(t>1);return r}function kd(r,t,i,s,l){return r=(r-i)*l|0,t=(t-s)*l|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function _E(r){let t=r,i=r;do(t.x<i.x||t.x===i.x&&t.y<i.y)&&(i=t),t=t.next;while(t!==r);return i}function W_(r,t,i,s,l,c,f,d){return(l-f)*(t-d)>=(r-f)*(c-d)&&(r-f)*(s-d)>=(i-f)*(t-d)&&(i-f)*(c-d)>=(l-f)*(s-d)}function Yo(r,t,i,s,l,c,f,d){return!(r===f&&t===d)&&W_(r,t,i,s,l,c,f,d)}function xE(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!SE(r,t)&&(il(r,t)&&il(t,r)&&yE(r,t)&&($e(r.prev,r,t.prev)||$e(r,t.prev,t))||Ir(r,t)&&$e(r.prev,r,r.next)>0&&$e(t.prev,t,t.next)>0)}function $e(r,t,i){return(t.y-r.y)*(i.x-t.x)-(t.x-r.x)*(i.y-t.y)}function Ir(r,t){return r.x===t.x&&r.y===t.y}function q_(r,t,i,s){const l=Gc($e(r,t,i)),c=Gc($e(r,t,s)),f=Gc($e(i,s,r)),d=Gc($e(i,s,t));return!!(l!==c&&f!==d||l===0&&Vc(r,i,t)||c===0&&Vc(r,s,t)||f===0&&Vc(i,r,s)||d===0&&Vc(i,t,s))}function Vc(r,t,i){return t.x<=Math.max(r.x,i.x)&&t.x>=Math.min(r.x,i.x)&&t.y<=Math.max(r.y,i.y)&&t.y>=Math.min(r.y,i.y)}function Gc(r){return r>0?1:r<0?-1:0}function SE(r,t){let i=r;do{if(i.i!==r.i&&i.next.i!==r.i&&i.i!==t.i&&i.next.i!==t.i&&q_(i,i.next,r,t))return!0;i=i.next}while(i!==r);return!1}function il(r,t){return $e(r.prev,r,r.next)<0?$e(r,t,r.next)>=0&&$e(r,r.prev,t)>=0:$e(r,t,r.prev)<0||$e(r,r.next,t)<0}function yE(r,t){let i=r,s=!1;const l=(r.x+t.x)/2,c=(r.y+t.y)/2;do i.y>c!=i.next.y>c&&i.next.y!==i.y&&l<(i.next.x-i.x)*(c-i.y)/(i.next.y-i.y)+i.x&&(s=!s),i=i.next;while(i!==r);return s}function Y_(r,t){const i=Xd(r.i,r.x,r.y),s=Xd(t.i,t.x,t.y),l=r.next,c=t.prev;return r.next=t,t.prev=r,i.next=l,l.prev=i,s.next=i,i.prev=s,c.next=s,s.prev=c,s}function Dv(r,t,i,s){const l=Xd(r,t,i);return s?(l.next=s.next,l.prev=s,s.next.prev=l,s.next=l):(l.prev=l,l.next=l),l}function al(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Xd(r,t,i){return{i:r,x:t,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ME(r,t,i,s){let l=0;for(let c=t,f=i-s;c<i;c+=s)l+=(r[f]-r[c])*(r[c+1]+r[f+1]),f=c;return l}class EE{static triangulate(t,i,s=2){return rE(t,i,s)}}class Ur{static area(t){const i=t.length;let s=0;for(let l=i-1,c=0;c<i;l=c++)s+=t[l].x*t[c].y-t[c].x*t[l].y;return s*.5}static isClockWise(t){return Ur.area(t)<0}static triangulateShape(t,i){const s=[],l=[],c=[];Uv(t),Nv(s,t);let f=t.length;i.forEach(Uv);for(let m=0;m<i.length;m++)l.push(f),f+=i[m].length,Nv(s,i[m]);const d=EE.triangulate(s,l);for(let m=0;m<d.length;m+=3)c.push(d.slice(m,m+3));return c}}function Uv(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function Nv(r,t){for(let i=0;i<t.length;i++)r.push(t[i].x),r.push(t[i].y)}class cp extends Xi{constructor(t=new k_([new Yt(.5,.5),new Yt(-.5,.5),new Yt(-.5,-.5),new Yt(.5,-.5)]),i={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:i},t=Array.isArray(t)?t:[t];const s=this,l=[],c=[];for(let d=0,m=t.length;d<m;d++){const p=t[d];f(p)}this.setAttribute("position",new Ri(l,3)),this.setAttribute("uv",new Ri(c,2)),this.computeVertexNormals();function f(d){const m=[],p=i.curveSegments!==void 0?i.curveSegments:12,g=i.steps!==void 0?i.steps:1,v=i.depth!==void 0?i.depth:1;let x=i.bevelEnabled!==void 0?i.bevelEnabled:!0,y=i.bevelThickness!==void 0?i.bevelThickness:.2,b=i.bevelSize!==void 0?i.bevelSize:y-.1,C=i.bevelOffset!==void 0?i.bevelOffset:0,M=i.bevelSegments!==void 0?i.bevelSegments:3;const _=i.extrudePath,z=i.UVGenerator!==void 0?i.UVGenerator:bE;let U,N=!1,B,L,D,k;if(_){U=_.getSpacedPoints(g),N=!0,x=!1;const xt=_.isCatmullRomCurve3?_.closed:!1;B=_.computeFrenetFrames(g,xt),L=new K,D=new K,k=new K}x||(M=0,y=0,b=0,C=0);const T=d.extractPoints(p);let w=T.shape;const V=T.holes;if(!Ur.isClockWise(w)){w=w.reverse();for(let xt=0,gt=V.length;xt<gt;xt++){const vt=V[xt];Ur.isClockWise(vt)&&(V[xt]=vt.reverse())}}function Y(xt){const vt=10000000000000001e-36;let Nt=xt[0];for(let P=1;P<=xt.length;P++){const Qt=P%xt.length,Ft=xt[Qt],ae=Ft.x-Nt.x,Lt=Ft.y-Nt.y,O=ae*ae+Lt*Lt,E=Math.max(Math.abs(Ft.x),Math.abs(Ft.y),Math.abs(Nt.x),Math.abs(Nt.y)),q=vt*E*E;if(O<=q){xt.splice(Qt,1),P--;continue}Nt=Ft}}Y(w),V.forEach(Y);const ut=V.length,rt=w;for(let xt=0;xt<ut;xt++){const gt=V[xt];w=w.concat(gt)}function I(xt,gt,vt){return gt||De("ExtrudeGeometry: vec does not exist"),xt.clone().addScaledVector(gt,vt)}const H=w.length;function tt(xt,gt,vt){let Nt,P,Qt;const Ft=xt.x-gt.x,ae=xt.y-gt.y,Lt=vt.x-xt.x,O=vt.y-xt.y,E=Ft*Ft+ae*ae,q=Ft*O-ae*Lt;if(Math.abs(q)>Number.EPSILON){const ht=Math.sqrt(E),Et=Math.sqrt(Lt*Lt+O*O),dt=gt.x-ae/ht,te=gt.y+Ft/ht,Pt=vt.x-O/Et,$t=vt.y+Lt/Et,le=((Pt-dt)*O-($t-te)*Lt)/(Ft*O-ae*Lt);Nt=dt+Ft*le-xt.x,P=te+ae*le-xt.y;const Tt=Nt*Nt+P*P;if(Tt<=2)return new Yt(Nt,P);Qt=Math.sqrt(Tt/2)}else{let ht=!1;Ft>Number.EPSILON?Lt>Number.EPSILON&&(ht=!0):Ft<-Number.EPSILON?Lt<-Number.EPSILON&&(ht=!0):Math.sign(ae)===Math.sign(O)&&(ht=!0),ht?(Nt=-ae,P=Ft,Qt=Math.sqrt(E)):(Nt=Ft,P=ae,Qt=Math.sqrt(E/2))}return new Yt(Nt/Qt,P/Qt)}const bt=[];for(let xt=0,gt=rt.length,vt=gt-1,Nt=xt+1;xt<gt;xt++,vt++,Nt++)vt===gt&&(vt=0),Nt===gt&&(Nt=0),bt[xt]=tt(rt[xt],rt[vt],rt[Nt]);const Mt=[];let F,$=bt.concat();for(let xt=0,gt=ut;xt<gt;xt++){const vt=V[xt];F=[];for(let Nt=0,P=vt.length,Qt=P-1,Ft=Nt+1;Nt<P;Nt++,Qt++,Ft++)Qt===P&&(Qt=0),Ft===P&&(Ft=0),F[Nt]=tt(vt[Nt],vt[Qt],vt[Ft]);Mt.push(F),$=$.concat(F)}let ft;if(M===0)ft=Ur.triangulateShape(rt,V);else{const xt=[],gt=[];for(let vt=0;vt<M;vt++){const Nt=vt/M,P=y*Math.cos(Nt*Math.PI/2),Qt=b*Math.sin(Nt*Math.PI/2)+C;for(let Ft=0,ae=rt.length;Ft<ae;Ft++){const Lt=I(rt[Ft],bt[Ft],Qt);Vt(Lt.x,Lt.y,-P),Nt===0&&xt.push(Lt)}for(let Ft=0,ae=ut;Ft<ae;Ft++){const Lt=V[Ft];F=Mt[Ft];const O=[];for(let E=0,q=Lt.length;E<q;E++){const ht=I(Lt[E],F[E],Qt);Vt(ht.x,ht.y,-P),Nt===0&&O.push(ht)}Nt===0&&gt.push(O)}}ft=Ur.triangulateShape(xt,gt)}const Rt=ft.length,Xt=b+C;for(let xt=0;xt<H;xt++){const gt=x?I(w[xt],$[xt],Xt):w[xt];N?(D.copy(B.normals[0]).multiplyScalar(gt.x),L.copy(B.binormals[0]).multiplyScalar(gt.y),k.copy(U[0]).add(D).add(L),Vt(k.x,k.y,k.z)):Vt(gt.x,gt.y,0)}for(let xt=1;xt<=g;xt++)for(let gt=0;gt<H;gt++){const vt=x?I(w[gt],$[gt],Xt):w[gt];N?(D.copy(B.normals[xt]).multiplyScalar(vt.x),L.copy(B.binormals[xt]).multiplyScalar(vt.y),k.copy(U[xt]).add(D).add(L),Vt(k.x,k.y,k.z)):Vt(vt.x,vt.y,v/g*xt)}for(let xt=M-1;xt>=0;xt--){const gt=xt/M,vt=y*Math.cos(gt*Math.PI/2),Nt=b*Math.sin(gt*Math.PI/2)+C;for(let P=0,Qt=rt.length;P<Qt;P++){const Ft=I(rt[P],bt[P],Nt);Vt(Ft.x,Ft.y,v+vt)}for(let P=0,Qt=V.length;P<Qt;P++){const Ft=V[P];F=Mt[P];for(let ae=0,Lt=Ft.length;ae<Lt;ae++){const O=I(Ft[ae],F[ae],Nt);N?Vt(O.x,O.y+U[g-1].y,U[g-1].x+vt):Vt(O.x,O.y,v+vt)}}}it(),ot();function it(){const xt=l.length/3;if(x){let gt=0,vt=H*gt;for(let Nt=0;Nt<Rt;Nt++){const P=ft[Nt];It(P[2]+vt,P[1]+vt,P[0]+vt)}gt=g+M*2,vt=H*gt;for(let Nt=0;Nt<Rt;Nt++){const P=ft[Nt];It(P[0]+vt,P[1]+vt,P[2]+vt)}}else{for(let gt=0;gt<Rt;gt++){const vt=ft[gt];It(vt[2],vt[1],vt[0])}for(let gt=0;gt<Rt;gt++){const vt=ft[gt];It(vt[0]+H*g,vt[1]+H*g,vt[2]+H*g)}}s.addGroup(xt,l.length/3-xt,0)}function ot(){const xt=l.length/3;let gt=0;Ut(rt,gt),gt+=rt.length;for(let vt=0,Nt=V.length;vt<Nt;vt++){const P=V[vt];Ut(P,gt),gt+=P.length}s.addGroup(xt,l.length/3-xt,1)}function Ut(xt,gt){let vt=xt.length;for(;--vt>=0;){const Nt=vt;let P=vt-1;P<0&&(P=xt.length-1);for(let Qt=0,Ft=g+M*2;Qt<Ft;Qt++){const ae=H*Qt,Lt=H*(Qt+1),O=gt+Nt+ae,E=gt+P+ae,q=gt+P+Lt,ht=gt+Nt+Lt;ve(O,E,q,ht)}}}function Vt(xt,gt,vt){m.push(xt),m.push(gt),m.push(vt)}function It(xt,gt,vt){me(xt),me(gt),me(vt);const Nt=l.length/3,P=z.generateTopUV(s,l,Nt-3,Nt-2,Nt-1);fe(P[0]),fe(P[1]),fe(P[2])}function ve(xt,gt,vt,Nt){me(xt),me(gt),me(Nt),me(gt),me(vt),me(Nt);const P=l.length/3,Qt=z.generateSideWallUV(s,l,P-6,P-3,P-2,P-1);fe(Qt[0]),fe(Qt[1]),fe(Qt[3]),fe(Qt[1]),fe(Qt[2]),fe(Qt[3])}function me(xt){l.push(m[xt*3+0]),l.push(m[xt*3+1]),l.push(m[xt*3+2])}function fe(xt){c.push(xt.x),c.push(xt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),i=this.parameters.shapes,s=this.parameters.options;return TE(i,s,t)}static fromJSON(t,i){const s=[];for(let c=0,f=t.shapes.length;c<f;c++){const d=i[t.shapes[c]];s.push(d)}const l=t.options.extrudePath;return l!==void 0&&(t.options.extrudePath=new Gd[l.type]().fromJSON(l)),new cp(s,t.options)}}const bE={generateTopUV:function(r,t,i,s,l){const c=t[i*3],f=t[i*3+1],d=t[s*3],m=t[s*3+1],p=t[l*3],g=t[l*3+1];return[new Yt(c,f),new Yt(d,m),new Yt(p,g)]},generateSideWallUV:function(r,t,i,s,l,c){const f=t[i*3],d=t[i*3+1],m=t[i*3+2],p=t[s*3],g=t[s*3+1],v=t[s*3+2],x=t[l*3],y=t[l*3+1],b=t[l*3+2],C=t[c*3],M=t[c*3+1],_=t[c*3+2];return Math.abs(d-g)<Math.abs(f-p)?[new Yt(f,1-m),new Yt(p,1-v),new Yt(x,1-b),new Yt(C,1-_)]:[new Yt(d,1-m),new Yt(g,1-v),new Yt(y,1-b),new Yt(M,1-_)]}};function TE(r,t,i){if(i.shapes=[],Array.isArray(r))for(let s=0,l=r.length;s<l;s++){const c=r[s];i.shapes.push(c.uuid)}else i.shapes.push(r.uuid);return i.options=Object.assign({},t),t.extrudePath!==void 0&&(i.options.extrudePath=t.extrudePath.toJSON()),i}class ul extends Xi{constructor(t=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:s,heightSegments:l};const c=t/2,f=i/2,d=Math.floor(s),m=Math.floor(l),p=d+1,g=m+1,v=t/d,x=i/m,y=[],b=[],C=[],M=[];for(let _=0;_<g;_++){const z=_*x-f;for(let U=0;U<p;U++){const N=U*v-c;b.push(N,-z,0),C.push(0,0,1),M.push(U/d),M.push(1-_/m)}}for(let _=0;_<m;_++)for(let z=0;z<d;z++){const U=z+p*_,N=z+p*(_+1),B=z+1+p*(_+1),L=z+1+p*_;y.push(U,N,L),y.push(N,B,L)}this.setIndex(y),this.setAttribute("position",new Ri(b,3)),this.setAttribute("normal",new Ri(C,3)),this.setAttribute("uv",new Ri(M,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ul(t.width,t.height,t.widthSegments,t.heightSegments)}}class AE extends ki{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class RE extends ll{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=R_,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class CE extends ll{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=aM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class wE extends ll{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class j_ extends zn{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(t),this.intensity=i}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}const kh=new tn,Lv=new K,Ov=new K;class DE{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.mapType=ii,this.map=null,this.mapPass=null,this.matrix=new tn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rp,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new an(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,s=this.matrix;Lv.setFromMatrixPosition(t.matrixWorld),i.position.copy(Lv),Ov.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(Ov),i.updateMatrixWorld(),kh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kh,i.coordinateSystem,i.reversedDepth),i.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(kh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class up extends P_{constructor(t=-1,i=1,s=1,l=-1,c=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=f,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,s,l,c,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-t,f=s+t,d=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=p*this.view.offsetX,f=c+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(c,f,d,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class UE extends DE{constructor(){super(new up(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class NE extends j_{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.shadow=new UE}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const i=super.toJSON(t);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}class LE extends j_{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class OE extends mi{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Pv(r,t,i,s){const l=PE(s);switch(i){case b_:return r*t;case A_:return r*t/l.components*l.byteLength;case Qd:return r*t/l.components*l.byteLength;case zr:return r*t*2/l.components*l.byteLength;case $d:return r*t*2/l.components*l.byteLength;case T_:return r*t*3/l.components*l.byteLength;case Ai:return r*t*4/l.components*l.byteLength;case tp:return r*t*4/l.components*l.byteLength;case Yc:case jc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Zc:case Kc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ud:case hd:return Math.max(r,16)*Math.max(t,8)/4;case cd:case fd:return Math.max(r,8)*Math.max(t,8)/2;case dd:case pd:case gd:case vd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case md:case _d:case xd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Sd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case yd:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Md:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Ed:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case bd:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Td:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Ad:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Rd:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Cd:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case wd:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Dd:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Ud:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Nd:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Ld:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Od:case Pd:case zd:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Fd:case Bd:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Id:case Hd:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function PE(r){switch(r){case ii:case S_:return{byteLength:1,components:1};case Qo:case y_:case xa:return{byteLength:2,components:1};case Kd:case Jd:return{byteLength:2,components:4};case Vi:case Zd:case zi:return{byteLength:4,components:1};case M_:case E_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jd}}));typeof window<"u"&&(window.__THREE__?pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jd);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Z_(){let r=null,t=!1,i=null,s=null;function l(c,f){i(c,f),s=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(s=r.requestAnimationFrame(l),t=!0)},stop:function(){r.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function zE(r){const t=new WeakMap;function i(d,m){const p=d.array,g=d.usage,v=p.byteLength,x=r.createBuffer();r.bindBuffer(m,x),r.bufferData(m,p,g),d.onUploadCallback();let y;if(p instanceof Float32Array)y=r.FLOAT;else if(typeof Float16Array<"u"&&p instanceof Float16Array)y=r.HALF_FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?y=r.HALF_FLOAT:y=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)y=r.SHORT;else if(p instanceof Uint32Array)y=r.UNSIGNED_INT;else if(p instanceof Int32Array)y=r.INT;else if(p instanceof Int8Array)y=r.BYTE;else if(p instanceof Uint8Array)y=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)y=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:x,type:y,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:v}}function s(d,m,p){const g=m.array,v=m.updateRanges;if(r.bindBuffer(p,d),v.length===0)r.bufferSubData(p,0,g);else{v.sort((y,b)=>y.start-b.start);let x=0;for(let y=1;y<v.length;y++){const b=v[x],C=v[y];C.start<=b.start+b.count+1?b.count=Math.max(b.count,C.start+C.count-b.start):(++x,v[x]=C)}v.length=x+1;for(let y=0,b=v.length;y<b;y++){const C=v[y];r.bufferSubData(p,C.start*g.BYTES_PER_ELEMENT,g,C.start,C.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=t.get(d);m&&(r.deleteBuffer(m.buffer),t.delete(d))}function f(d,m){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const g=t.get(d);(!g||g.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const p=t.get(d);if(p===void 0)t.set(d,i(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:l,remove:c,update:f}}var FE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,BE=`#ifdef USE_ALPHAHASH
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
#endif`,IE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,HE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,VE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,GE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kE=`#ifdef USE_AOMAP
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
#endif`,XE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,WE=`#ifdef USE_BATCHING
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
#endif`,qE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,YE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ZE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,KE=`#ifdef USE_IRIDESCENCE
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
#endif`,JE=`#ifdef USE_BUMPMAP
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
#endif`,QE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$E=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ib=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ab=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,sb=`#if defined( USE_COLOR_ALPHA )
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
#endif`,rb=`#define PI 3.141592653589793
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
} // validated`,ob=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lb=`vec3 transformedNormal = objectNormal;
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
#endif`,cb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ub=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,db="gl_FragColor = linearToOutputTexel( gl_FragColor );",pb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mb=`#ifdef USE_ENVMAP
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
#endif`,gb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,vb=`#ifdef USE_ENVMAP
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
#endif`,_b=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xb=`#ifdef USE_ENVMAP
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
#endif`,Sb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Eb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bb=`#ifdef USE_GRADIENTMAP
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
}`,Tb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ab=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cb=`uniform bool receiveShadow;
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
#endif`,wb=`#ifdef USE_ENVMAP
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
#endif`,Db=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ub=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ob=`PhysicalMaterial material;
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
#endif`,Pb=`uniform sampler2D dfgLUT;
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
}`,zb=`
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
#endif`,Fb=`#if defined( RE_IndirectDiffuse )
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
#endif`,Bb=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ib=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kb=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Wb=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qb=`#if defined( USE_POINTS_UV )
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
#endif`,Yb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zb=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Kb=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Jb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qb=`#ifdef USE_MORPHTARGETS
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
#endif`,$b=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,eT=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,nT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sT=`#ifdef USE_NORMALMAP
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
#endif`,rT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,oT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fT=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,hT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_T=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ST=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,yT=`float getShadowMask() {
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
}`,MT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ET=`#ifdef USE_SKINNING
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
#endif`,bT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,TT=`#ifdef USE_SKINNING
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
#endif`,AT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,RT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,CT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wT=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,DT=`#ifdef USE_TRANSMISSION
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
#endif`,UT=`#ifdef USE_TRANSMISSION
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
#endif`,NT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,LT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,OT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,PT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,FT=`uniform sampler2D t2D;
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
}`,BT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IT=`#ifdef ENVMAP_TYPE_CUBE
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
}`,HT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,VT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GT=`#include <common>
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
}`,kT=`#if DEPTH_PACKING == 3200
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
}`,XT=`#define DISTANCE
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
}`,WT=`#define DISTANCE
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
}`,qT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,YT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jT=`uniform float scale;
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
}`,ZT=`uniform vec3 diffuse;
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
}`,KT=`#include <common>
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
}`,JT=`uniform vec3 diffuse;
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
}`,QT=`#define LAMBERT
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
}`,$T=`#define LAMBERT
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
}`,t1=`#define MATCAP
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
}`,e1=`#define MATCAP
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
}`,n1=`#define NORMAL
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
}`,i1=`#define NORMAL
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
}`,a1=`#define PHONG
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
}`,s1=`#define PHONG
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
}`,r1=`#define STANDARD
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
}`,o1=`#define STANDARD
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
}`,l1=`#define TOON
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
}`,c1=`#define TOON
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
}`,u1=`uniform float size;
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
}`,f1=`uniform vec3 diffuse;
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
}`,h1=`#include <common>
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
}`,d1=`uniform vec3 color;
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
}`,p1=`uniform float rotation;
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
}`,m1=`uniform vec3 diffuse;
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
}`,Me={alphahash_fragment:FE,alphahash_pars_fragment:BE,alphamap_fragment:IE,alphamap_pars_fragment:HE,alphatest_fragment:VE,alphatest_pars_fragment:GE,aomap_fragment:kE,aomap_pars_fragment:XE,batching_pars_vertex:WE,batching_vertex:qE,begin_vertex:YE,beginnormal_vertex:jE,bsdfs:ZE,iridescence_fragment:KE,bumpmap_pars_fragment:JE,clipping_planes_fragment:QE,clipping_planes_pars_fragment:$E,clipping_planes_pars_vertex:tb,clipping_planes_vertex:eb,color_fragment:nb,color_pars_fragment:ib,color_pars_vertex:ab,color_vertex:sb,common:rb,cube_uv_reflection_fragment:ob,defaultnormal_vertex:lb,displacementmap_pars_vertex:cb,displacementmap_vertex:ub,emissivemap_fragment:fb,emissivemap_pars_fragment:hb,colorspace_fragment:db,colorspace_pars_fragment:pb,envmap_fragment:mb,envmap_common_pars_fragment:gb,envmap_pars_fragment:vb,envmap_pars_vertex:_b,envmap_physical_pars_fragment:wb,envmap_vertex:xb,fog_vertex:Sb,fog_pars_vertex:yb,fog_fragment:Mb,fog_pars_fragment:Eb,gradientmap_pars_fragment:bb,lightmap_pars_fragment:Tb,lights_lambert_fragment:Ab,lights_lambert_pars_fragment:Rb,lights_pars_begin:Cb,lights_toon_fragment:Db,lights_toon_pars_fragment:Ub,lights_phong_fragment:Nb,lights_phong_pars_fragment:Lb,lights_physical_fragment:Ob,lights_physical_pars_fragment:Pb,lights_fragment_begin:zb,lights_fragment_maps:Fb,lights_fragment_end:Bb,logdepthbuf_fragment:Ib,logdepthbuf_pars_fragment:Hb,logdepthbuf_pars_vertex:Vb,logdepthbuf_vertex:Gb,map_fragment:kb,map_pars_fragment:Xb,map_particle_fragment:Wb,map_particle_pars_fragment:qb,metalnessmap_fragment:Yb,metalnessmap_pars_fragment:jb,morphinstance_vertex:Zb,morphcolor_vertex:Kb,morphnormal_vertex:Jb,morphtarget_pars_vertex:Qb,morphtarget_vertex:$b,normal_fragment_begin:tT,normal_fragment_maps:eT,normal_pars_fragment:nT,normal_pars_vertex:iT,normal_vertex:aT,normalmap_pars_fragment:sT,clearcoat_normal_fragment_begin:rT,clearcoat_normal_fragment_maps:oT,clearcoat_pars_fragment:lT,iridescence_pars_fragment:cT,opaque_fragment:uT,packing:fT,premultiplied_alpha_fragment:hT,project_vertex:dT,dithering_fragment:pT,dithering_pars_fragment:mT,roughnessmap_fragment:gT,roughnessmap_pars_fragment:vT,shadowmap_pars_fragment:_T,shadowmap_pars_vertex:xT,shadowmap_vertex:ST,shadowmask_pars_fragment:yT,skinbase_vertex:MT,skinning_pars_vertex:ET,skinning_vertex:bT,skinnormal_vertex:TT,specularmap_fragment:AT,specularmap_pars_fragment:RT,tonemapping_fragment:CT,tonemapping_pars_fragment:wT,transmission_fragment:DT,transmission_pars_fragment:UT,uv_pars_fragment:NT,uv_pars_vertex:LT,uv_vertex:OT,worldpos_vertex:PT,background_vert:zT,background_frag:FT,backgroundCube_vert:BT,backgroundCube_frag:IT,cube_vert:HT,cube_frag:VT,depth_vert:GT,depth_frag:kT,distance_vert:XT,distance_frag:WT,equirect_vert:qT,equirect_frag:YT,linedashed_vert:jT,linedashed_frag:ZT,meshbasic_vert:KT,meshbasic_frag:JT,meshlambert_vert:QT,meshlambert_frag:$T,meshmatcap_vert:t1,meshmatcap_frag:e1,meshnormal_vert:n1,meshnormal_frag:i1,meshphong_vert:a1,meshphong_frag:s1,meshphysical_vert:r1,meshphysical_frag:o1,meshtoon_vert:l1,meshtoon_frag:c1,points_vert:u1,points_frag:f1,shadow_vert:h1,shadow_frag:d1,sprite_vert:p1,sprite_frag:m1},kt={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ye}},envmap:{envMap:{value:null},envMapRotation:{value:new ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ye},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0},uvTransform:{value:new ye}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}}},Pi={basic:{uniforms:Bn([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.fog]),vertexShader:Me.meshbasic_vert,fragmentShader:Me.meshbasic_frag},lambert:{uniforms:Bn([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,kt.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Me.meshlambert_vert,fragmentShader:Me.meshlambert_frag},phong:{uniforms:Bn([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,kt.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:Me.meshphong_vert,fragmentShader:Me.meshphong_frag},standard:{uniforms:Bn([kt.common,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.roughnessmap,kt.metalnessmap,kt.fog,kt.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag},toon:{uniforms:Bn([kt.common,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.gradientmap,kt.fog,kt.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Me.meshtoon_vert,fragmentShader:Me.meshtoon_frag},matcap:{uniforms:Bn([kt.common,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,{matcap:{value:null}}]),vertexShader:Me.meshmatcap_vert,fragmentShader:Me.meshmatcap_frag},points:{uniforms:Bn([kt.points,kt.fog]),vertexShader:Me.points_vert,fragmentShader:Me.points_frag},dashed:{uniforms:Bn([kt.common,kt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Me.linedashed_vert,fragmentShader:Me.linedashed_frag},depth:{uniforms:Bn([kt.common,kt.displacementmap]),vertexShader:Me.depth_vert,fragmentShader:Me.depth_frag},normal:{uniforms:Bn([kt.common,kt.bumpmap,kt.normalmap,kt.displacementmap,{opacity:{value:1}}]),vertexShader:Me.meshnormal_vert,fragmentShader:Me.meshnormal_frag},sprite:{uniforms:Bn([kt.sprite,kt.fog]),vertexShader:Me.sprite_vert,fragmentShader:Me.sprite_frag},background:{uniforms:{uvTransform:{value:new ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Me.background_vert,fragmentShader:Me.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ye}},vertexShader:Me.backgroundCube_vert,fragmentShader:Me.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Me.cube_vert,fragmentShader:Me.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Me.equirect_vert,fragmentShader:Me.equirect_frag},distance:{uniforms:Bn([kt.common,kt.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Me.distance_vert,fragmentShader:Me.distance_frag},shadow:{uniforms:Bn([kt.lights,kt.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Me.shadow_vert,fragmentShader:Me.shadow_frag}};Pi.physical={uniforms:Bn([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ye},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ye},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ye},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ye},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ye},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ye}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag};const kc={r:0,b:0,g:0},Ts=new Gi,g1=new tn;function v1(r,t,i,s,l,c,f){const d=new Fe(0);let m=c===!0?0:1,p,g,v=null,x=0,y=null;function b(U){let N=U.isScene===!0?U.background:null;return N&&N.isTexture&&(N=(U.backgroundBlurriness>0?i:t).get(N)),N}function C(U){let N=!1;const B=b(U);B===null?_(d,m):B&&B.isColor&&(_(B,1),N=!0);const L=r.xr.getEnvironmentBlendMode();L==="additive"?s.buffers.color.setClear(0,0,0,1,f):L==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,f),(r.autoClear||N)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function M(U,N){const B=b(N);B&&(B.isCubeTexture||B.mapping===nu)?(g===void 0&&(g=new Ci(new cl(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:Br(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(L,D,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),Ts.copy(N.backgroundRotation),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,B.isCubeTexture&&B.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),g.material.uniforms.envMap.value=B,g.material.uniforms.flipEnvMap.value=B.isCubeTexture&&B.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(g1.makeRotationFromEuler(Ts)),g.material.toneMapped=Ue.getTransfer(B.colorSpace)!==ke,(v!==B||x!==B.version||y!==r.toneMapping)&&(g.material.needsUpdate=!0,v=B,x=B.version,y=r.toneMapping),g.layers.enableAll(),U.unshift(g,g.geometry,g.material,0,0,null)):B&&B.isTexture&&(p===void 0&&(p=new Ci(new ul(2,2),new ki({name:"BackgroundMaterial",uniforms:Br(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:ns,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=B,p.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,p.material.toneMapped=Ue.getTransfer(B.colorSpace)!==ke,B.matrixAutoUpdate===!0&&B.updateMatrix(),p.material.uniforms.uvTransform.value.copy(B.matrix),(v!==B||x!==B.version||y!==r.toneMapping)&&(p.material.needsUpdate=!0,v=B,x=B.version,y=r.toneMapping),p.layers.enableAll(),U.unshift(p,p.geometry,p.material,0,0,null))}function _(U,N){U.getRGB(kc,O_(r)),s.buffers.color.setClear(kc.r,kc.g,kc.b,N,f)}function z(){g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return d},setClearColor:function(U,N=1){d.set(U),m=N,_(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(U){m=U,_(d,m)},render:C,addToRenderList:M,dispose:z}}function _1(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=x(null);let c=l,f=!1;function d(w,V,J,Y,ut){let rt=!1;const I=v(Y,J,V);c!==I&&(c=I,p(c.object)),rt=y(w,Y,J,ut),rt&&b(w,Y,J,ut),ut!==null&&t.update(ut,r.ELEMENT_ARRAY_BUFFER),(rt||f)&&(f=!1,N(w,V,J,Y),ut!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(ut).buffer))}function m(){return r.createVertexArray()}function p(w){return r.bindVertexArray(w)}function g(w){return r.deleteVertexArray(w)}function v(w,V,J){const Y=J.wireframe===!0;let ut=s[w.id];ut===void 0&&(ut={},s[w.id]=ut);let rt=ut[V.id];rt===void 0&&(rt={},ut[V.id]=rt);let I=rt[Y];return I===void 0&&(I=x(m()),rt[Y]=I),I}function x(w){const V=[],J=[],Y=[];for(let ut=0;ut<i;ut++)V[ut]=0,J[ut]=0,Y[ut]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:J,attributeDivisors:Y,object:w,attributes:{},index:null}}function y(w,V,J,Y){const ut=c.attributes,rt=V.attributes;let I=0;const H=J.getAttributes();for(const tt in H)if(H[tt].location>=0){const Mt=ut[tt];let F=rt[tt];if(F===void 0&&(tt==="instanceMatrix"&&w.instanceMatrix&&(F=w.instanceMatrix),tt==="instanceColor"&&w.instanceColor&&(F=w.instanceColor)),Mt===void 0||Mt.attribute!==F||F&&Mt.data!==F.data)return!0;I++}return c.attributesNum!==I||c.index!==Y}function b(w,V,J,Y){const ut={},rt=V.attributes;let I=0;const H=J.getAttributes();for(const tt in H)if(H[tt].location>=0){let Mt=rt[tt];Mt===void 0&&(tt==="instanceMatrix"&&w.instanceMatrix&&(Mt=w.instanceMatrix),tt==="instanceColor"&&w.instanceColor&&(Mt=w.instanceColor));const F={};F.attribute=Mt,Mt&&Mt.data&&(F.data=Mt.data),ut[tt]=F,I++}c.attributes=ut,c.attributesNum=I,c.index=Y}function C(){const w=c.newAttributes;for(let V=0,J=w.length;V<J;V++)w[V]=0}function M(w){_(w,0)}function _(w,V){const J=c.newAttributes,Y=c.enabledAttributes,ut=c.attributeDivisors;J[w]=1,Y[w]===0&&(r.enableVertexAttribArray(w),Y[w]=1),ut[w]!==V&&(r.vertexAttribDivisor(w,V),ut[w]=V)}function z(){const w=c.newAttributes,V=c.enabledAttributes;for(let J=0,Y=V.length;J<Y;J++)V[J]!==w[J]&&(r.disableVertexAttribArray(J),V[J]=0)}function U(w,V,J,Y,ut,rt,I){I===!0?r.vertexAttribIPointer(w,V,J,ut,rt):r.vertexAttribPointer(w,V,J,Y,ut,rt)}function N(w,V,J,Y){C();const ut=Y.attributes,rt=J.getAttributes(),I=V.defaultAttributeValues;for(const H in rt){const tt=rt[H];if(tt.location>=0){let bt=ut[H];if(bt===void 0&&(H==="instanceMatrix"&&w.instanceMatrix&&(bt=w.instanceMatrix),H==="instanceColor"&&w.instanceColor&&(bt=w.instanceColor)),bt!==void 0){const Mt=bt.normalized,F=bt.itemSize,$=t.get(bt);if($===void 0)continue;const ft=$.buffer,Rt=$.type,Xt=$.bytesPerElement,it=Rt===r.INT||Rt===r.UNSIGNED_INT||bt.gpuType===Zd;if(bt.isInterleavedBufferAttribute){const ot=bt.data,Ut=ot.stride,Vt=bt.offset;if(ot.isInstancedInterleavedBuffer){for(let It=0;It<tt.locationSize;It++)_(tt.location+It,ot.meshPerAttribute);w.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let It=0;It<tt.locationSize;It++)M(tt.location+It);r.bindBuffer(r.ARRAY_BUFFER,ft);for(let It=0;It<tt.locationSize;It++)U(tt.location+It,F/tt.locationSize,Rt,Mt,Ut*Xt,(Vt+F/tt.locationSize*It)*Xt,it)}else{if(bt.isInstancedBufferAttribute){for(let ot=0;ot<tt.locationSize;ot++)_(tt.location+ot,bt.meshPerAttribute);w.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=bt.meshPerAttribute*bt.count)}else for(let ot=0;ot<tt.locationSize;ot++)M(tt.location+ot);r.bindBuffer(r.ARRAY_BUFFER,ft);for(let ot=0;ot<tt.locationSize;ot++)U(tt.location+ot,F/tt.locationSize,Rt,Mt,F*Xt,F/tt.locationSize*ot*Xt,it)}}else if(I!==void 0){const Mt=I[H];if(Mt!==void 0)switch(Mt.length){case 2:r.vertexAttrib2fv(tt.location,Mt);break;case 3:r.vertexAttrib3fv(tt.location,Mt);break;case 4:r.vertexAttrib4fv(tt.location,Mt);break;default:r.vertexAttrib1fv(tt.location,Mt)}}}}z()}function B(){k();for(const w in s){const V=s[w];for(const J in V){const Y=V[J];for(const ut in Y)g(Y[ut].object),delete Y[ut];delete V[J]}delete s[w]}}function L(w){if(s[w.id]===void 0)return;const V=s[w.id];for(const J in V){const Y=V[J];for(const ut in Y)g(Y[ut].object),delete Y[ut];delete V[J]}delete s[w.id]}function D(w){for(const V in s){const J=s[V];if(J[w.id]===void 0)continue;const Y=J[w.id];for(const ut in Y)g(Y[ut].object),delete Y[ut];delete J[w.id]}}function k(){T(),f=!0,c!==l&&(c=l,p(c.object))}function T(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:k,resetDefaultState:T,dispose:B,releaseStatesOfGeometry:L,releaseStatesOfProgram:D,initAttributes:C,enableAttribute:M,disableUnusedAttributes:z}}function x1(r,t,i){let s;function l(p){s=p}function c(p,g){r.drawArrays(s,p,g),i.update(g,s,1)}function f(p,g,v){v!==0&&(r.drawArraysInstanced(s,p,g,v),i.update(g,s,v))}function d(p,g,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,g,0,v);let y=0;for(let b=0;b<v;b++)y+=g[b];i.update(y,s,1)}function m(p,g,v,x){if(v===0)return;const y=t.get("WEBGL_multi_draw");if(y===null)for(let b=0;b<p.length;b++)f(p[b],g[b],x[b]);else{y.multiDrawArraysInstancedWEBGL(s,p,0,g,0,x,0,v);let b=0;for(let C=0;C<v;C++)b+=g[C]*x[C];i.update(b,s,1)}}this.setMode=l,this.render=c,this.renderInstances=f,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function S1(r,t,i,s){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const D=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function f(D){return!(D!==Ai&&s.convert(D)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(D){const k=D===xa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(D!==ii&&s.convert(D)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==zi&&!k)}function m(D){if(D==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const g=m(p);g!==p&&(pe("WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const v=i.logarithmicDepthBuffer===!0,x=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),b=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=r.getParameter(r.MAX_TEXTURE_SIZE),M=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),_=r.getParameter(r.MAX_VERTEX_ATTRIBS),z=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),U=r.getParameter(r.MAX_VARYING_VECTORS),N=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),B=r.getParameter(r.MAX_SAMPLES),L=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:f,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:v,reversedDepthBuffer:x,maxTextures:y,maxVertexTextures:b,maxTextureSize:C,maxCubemapSize:M,maxAttributes:_,maxVertexUniforms:z,maxVaryings:U,maxFragmentUniforms:N,maxSamples:B,samples:L}}function y1(r){const t=this;let i=null,s=0,l=!1,c=!1;const f=new Rs,d=new ye,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,x){const y=v.length!==0||x||s!==0||l;return l=x,s=v.length,y},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(v,x){i=g(v,x,0)},this.setState=function(v,x,y){const b=v.clippingPlanes,C=v.clipIntersection,M=v.clipShadows,_=r.get(v);if(!l||b===null||b.length===0||c&&!M)c?g(null):p();else{const z=c?0:s,U=z*4;let N=_.clippingState||null;m.value=N,N=g(b,x,U,y);for(let B=0;B!==U;++B)N[B]=i[B];_.clippingState=N,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=z}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),t.numPlanes=s,t.numIntersection=0}function g(v,x,y,b){const C=v!==null?v.length:0;let M=null;if(C!==0){if(M=m.value,b!==!0||M===null){const _=y+C*4,z=x.matrixWorldInverse;d.getNormalMatrix(z),(M===null||M.length<_)&&(M=new Float32Array(_));for(let U=0,N=y;U!==C;++U,N+=4)f.copy(v[U]).applyMatrix4(z,d),f.normal.toArray(M,N),M[N+3]=f.constant}m.value=M,m.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,M}}function M1(r){let t=new WeakMap;function i(f,d){return d===sd?f.mapping=Ns:d===rd&&(f.mapping=Pr),f}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===sd||d===rd)if(t.has(f)){const m=t.get(f).texture;return i(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const p=new F_(m.height);return p.fromEquirectangularTexture(r,f),t.set(f,p),f.addEventListener("dispose",l),i(p.texture,f.mapping)}else return null}}return f}function l(f){const d=f.target;d.removeEventListener("dispose",l);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function c(){t=new WeakMap}return{get:s,dispose:c}}const ts=4,zv=[.125,.215,.35,.446,.526,.582],ws=20,E1=256,Xo=new up,Fv=new Fe;let Xh=null,Wh=0,qh=0,Yh=!1;const b1=new K;class Bv{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,i=0,s=.1,l=100,c={}){const{size:f=256,position:d=b1}=c;Xh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(f);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,s,l,m,d),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Xh,Wh,qh),this._renderer.xr.enabled=Yh,t.scissorTest=!1,wr(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Ns||t.mapping===Pr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Xh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(t,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:xa,format:Ai,colorSpace:Fr,depthBuffer:!1},l=Iv(t,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Iv(t,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=T1(c)),this._blurMaterial=R1(c,t,i),this._ggxMaterial=A1(c,t,i)}return l}_compileMaterial(t){const i=new Ci(new Xi,t);this._renderer.compile(i,Xo)}_sceneToCubeUV(t,i,s,l,c){const m=new mi(90,1,i,s),p=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],v=this._renderer,x=v.autoClear,y=v.toneMapping;v.getClearColor(Fv),v.toneMapping=Bi,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ci(new cl,new sp({name:"PMREM.Background",side:Yn,depthWrite:!1,depthTest:!1})));const C=this._backgroundBox,M=C.material;let _=!1;const z=t.background;z?z.isColor&&(M.color.copy(z),t.background=null,_=!0):(M.color.copy(Fv),_=!0);for(let U=0;U<6;U++){const N=U%3;N===0?(m.up.set(0,p[U],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+g[U],c.y,c.z)):N===1?(m.up.set(0,0,p[U]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+g[U],c.z)):(m.up.set(0,p[U],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+g[U]));const B=this._cubeSize;wr(l,N*B,U>2?B:0,B,B),v.setRenderTarget(l),_&&v.render(C,m),v.render(t,m)}v.toneMapping=y,v.autoClear=x,t.background=z}_textureToCubeUV(t,i){const s=this._renderer,l=t.mapping===Ns||t.mapping===Pr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vv()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hv());const c=l?this._cubemapMaterial:this._equirectMaterial,f=this._lodMeshes[0];f.material=c;const d=c.uniforms;d.envMap.value=t;const m=this._cubeSize;wr(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(f,Xo)}_applyPMREM(t){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(t,c-1,c);i.autoClear=s}_applyGGXFilter(t,i,s){const l=this._renderer,c=this._pingPongRenderTarget,f=this._ggxMaterial,d=this._lodMeshes[s];d.material=f;const m=f.uniforms,p=s/(this._lodMeshes.length-1),g=i/(this._lodMeshes.length-1),v=Math.sqrt(p*p-g*g),x=0+p*1.25,y=v*x,{_lodMax:b}=this,C=this._sizeLods[s],M=3*C*(s>b-ts?s-b+ts:0),_=4*(this._cubeSize-C);m.envMap.value=t.texture,m.roughness.value=y,m.mipInt.value=b-i,wr(c,M,_,3*C,2*C),l.setRenderTarget(c),l.render(d,Xo),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=b-s,wr(t,M,_,3*C,2*C),l.setRenderTarget(t),l.render(d,Xo)}_blur(t,i,s,l,c){const f=this._pingPongRenderTarget;this._halfBlur(t,f,i,s,l,"latitudinal",c),this._halfBlur(f,t,s,s,l,"longitudinal",c)}_halfBlur(t,i,s,l,c,f,d){const m=this._renderer,p=this._blurMaterial;f!=="latitudinal"&&f!=="longitudinal"&&De("blur direction must be either latitudinal or longitudinal!");const g=3,v=this._lodMeshes[l];v.material=p;const x=p.uniforms,y=this._sizeLods[s]-1,b=isFinite(c)?Math.PI/(2*y):2*Math.PI/(2*ws-1),C=c/b,M=isFinite(c)?1+Math.floor(g*C):ws;M>ws&&pe(`sigmaRadians, ${c}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${ws}`);const _=[];let z=0;for(let D=0;D<ws;++D){const k=D/C,T=Math.exp(-k*k/2);_.push(T),D===0?z+=T:D<M&&(z+=2*T)}for(let D=0;D<_.length;D++)_[D]=_[D]/z;x.envMap.value=t.texture,x.samples.value=M,x.weights.value=_,x.latitudinal.value=f==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:U}=this;x.dTheta.value=b,x.mipInt.value=U-s;const N=this._sizeLods[l],B=3*N*(l>U-ts?l-U+ts:0),L=4*(this._cubeSize-N);wr(i,B,L,3*N,2*N),m.setRenderTarget(i),m.render(v,Xo)}}function T1(r){const t=[],i=[],s=[];let l=r;const c=r-ts+1+zv.length;for(let f=0;f<c;f++){const d=Math.pow(2,l);t.push(d);let m=1/d;f>r-ts?m=zv[f-r+ts-1]:f===0&&(m=0),i.push(m);const p=1/(d-2),g=-p,v=1+p,x=[g,g,v,g,v,v,g,g,v,v,g,v],y=6,b=6,C=3,M=2,_=1,z=new Float32Array(C*b*y),U=new Float32Array(M*b*y),N=new Float32Array(_*b*y);for(let L=0;L<y;L++){const D=L%3*2/3-1,k=L>2?0:-1,T=[D,k,0,D+2/3,k,0,D+2/3,k+1,0,D,k,0,D+2/3,k+1,0,D,k+1,0];z.set(T,C*b*L),U.set(x,M*b*L);const w=[L,L,L,L,L,L];N.set(w,_*b*L)}const B=new Xi;B.setAttribute("position",new Hi(z,C)),B.setAttribute("uv",new Hi(U,M)),B.setAttribute("faceIndex",new Hi(N,_)),s.push(new Ci(B,null)),l>ts&&l--}return{lodMeshes:s,sizeLods:t,sigmas:i}}function Iv(r,t,i){const s=new Ii(r,t,i);return s.texture.mapping=nu,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function wr(r,t,i,s,l){r.viewport.set(t,i,s,l),r.scissor.set(t,i,s,l)}function A1(r,t,i){return new ki({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:E1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:iu(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function R1(r,t,i){const s=new Float32Array(ws),l=new K(0,1,0);return new ki({name:"SphericalGaussianBlur",defines:{n:ws,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:iu(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function Hv(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:iu(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function Vv(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:iu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:va,depthTest:!1,depthWrite:!1})}function iu(){return`

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
	`}function C1(r){let t=new WeakMap,i=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===sd||m===rd,g=m===Ns||m===Pr;if(p||g){let v=t.get(d);const x=v!==void 0?v.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return i===null&&(i=new Bv(r)),v=p?i.fromEquirectangular(d,v):i.fromCubemap(d,v),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),v.texture;if(v!==void 0)return v.texture;{const y=d.image;return p&&y&&y.height>0||g&&y&&l(y)?(i===null&&(i=new Bv(r)),v=p?i.fromEquirectangular(d):i.fromCubemap(d),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),d.addEventListener("dispose",c),v.texture):null}}}return d}function l(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function c(d){const m=d.target;m.removeEventListener("dispose",c);const p=t.get(m);p!==void 0&&(t.delete(m),p.dispose())}function f(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function w1(r){const t={};function i(s){if(t[s]!==void 0)return t[s];const l=r.getExtension(s);return t[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&tl("WebGLRenderer: "+s+" extension not supported."),l}}}function D1(r,t,i,s){const l={},c=new WeakMap;function f(v){const x=v.target;x.index!==null&&t.remove(x.index);for(const b in x.attributes)t.remove(x.attributes[b]);x.removeEventListener("dispose",f),delete l[x.id];const y=c.get(x);y&&(t.remove(y),c.delete(x)),s.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,i.memory.geometries--}function d(v,x){return l[x.id]===!0||(x.addEventListener("dispose",f),l[x.id]=!0,i.memory.geometries++),x}function m(v){const x=v.attributes;for(const y in x)t.update(x[y],r.ARRAY_BUFFER)}function p(v){const x=[],y=v.index,b=v.attributes.position;let C=0;if(y!==null){const z=y.array;C=y.version;for(let U=0,N=z.length;U<N;U+=3){const B=z[U+0],L=z[U+1],D=z[U+2];x.push(B,L,L,D,D,B)}}else if(b!==void 0){const z=b.array;C=b.version;for(let U=0,N=z.length/3-1;U<N;U+=3){const B=U+0,L=U+1,D=U+2;x.push(B,L,L,D,D,B)}}else return;const M=new(C_(x)?L_:N_)(x,1);M.version=C;const _=c.get(v);_&&t.remove(_),c.set(v,M)}function g(v){const x=c.get(v);if(x){const y=v.index;y!==null&&x.version<y.version&&p(v)}else p(v);return c.get(v)}return{get:d,update:m,getWireframeAttribute:g}}function U1(r,t,i){let s;function l(x){s=x}let c,f;function d(x){c=x.type,f=x.bytesPerElement}function m(x,y){r.drawElements(s,y,c,x*f),i.update(y,s,1)}function p(x,y,b){b!==0&&(r.drawElementsInstanced(s,y,c,x*f,b),i.update(y,s,b))}function g(x,y,b){if(b===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,y,0,c,x,0,b);let M=0;for(let _=0;_<b;_++)M+=y[_];i.update(M,s,1)}function v(x,y,b,C){if(b===0)return;const M=t.get("WEBGL_multi_draw");if(M===null)for(let _=0;_<x.length;_++)p(x[_]/f,y[_],C[_]);else{M.multiDrawElementsInstancedWEBGL(s,y,0,c,x,0,C,0,b);let _=0;for(let z=0;z<b;z++)_+=y[z]*C[z];i.update(_,s,1)}}this.setMode=l,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=v}function N1(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,f,d){switch(i.calls++,f){case r.TRIANGLES:i.triangles+=d*(c/3);break;case r.LINES:i.lines+=d*(c/2);break;case r.LINE_STRIP:i.lines+=d*(c-1);break;case r.LINE_LOOP:i.lines+=d*c;break;case r.POINTS:i.points+=d*c;break;default:De("WebGLInfo: Unknown draw mode:",f);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:s}}function L1(r,t,i){const s=new WeakMap,l=new an;function c(f,d,m){const p=f.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,v=g!==void 0?g.length:0;let x=s.get(d);if(x===void 0||x.count!==v){let w=function(){k.dispose(),s.delete(d),d.removeEventListener("dispose",w)};var y=w;x!==void 0&&x.texture.dispose();const b=d.morphAttributes.position!==void 0,C=d.morphAttributes.normal!==void 0,M=d.morphAttributes.color!==void 0,_=d.morphAttributes.position||[],z=d.morphAttributes.normal||[],U=d.morphAttributes.color||[];let N=0;b===!0&&(N=1),C===!0&&(N=2),M===!0&&(N=3);let B=d.attributes.position.count*N,L=1;B>t.maxTextureSize&&(L=Math.ceil(B/t.maxTextureSize),B=t.maxTextureSize);const D=new Float32Array(B*L*4*v),k=new w_(D,B,L,v);k.type=zi,k.needsUpdate=!0;const T=N*4;for(let V=0;V<v;V++){const J=_[V],Y=z[V],ut=U[V],rt=B*L*4*V;for(let I=0;I<J.count;I++){const H=I*T;b===!0&&(l.fromBufferAttribute(J,I),D[rt+H+0]=l.x,D[rt+H+1]=l.y,D[rt+H+2]=l.z,D[rt+H+3]=0),C===!0&&(l.fromBufferAttribute(Y,I),D[rt+H+4]=l.x,D[rt+H+5]=l.y,D[rt+H+6]=l.z,D[rt+H+7]=0),M===!0&&(l.fromBufferAttribute(ut,I),D[rt+H+8]=l.x,D[rt+H+9]=l.y,D[rt+H+10]=l.z,D[rt+H+11]=ut.itemSize===4?l.w:1)}}x={count:v,texture:k,size:new Yt(B,L)},s.set(d,x),d.addEventListener("dispose",w)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",f.morphTexture,i);else{let b=0;for(let M=0;M<p.length;M++)b+=p[M];const C=d.morphTargetsRelative?1:1-b;m.getUniforms().setValue(r,"morphTargetBaseInfluence",C),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",x.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",x.size)}return{update:c}}function O1(r,t,i,s){let l=new WeakMap;function c(m){const p=s.render.frame,g=m.geometry,v=t.get(m,g);if(l.get(v)!==p&&(t.update(v),l.set(v,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),l.get(m)!==p&&(i.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,r.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const x=m.skeleton;l.get(x)!==p&&(x.update(),l.set(x,p))}return v}function f(){l=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:c,dispose:f}}const P1={[h_]:"LINEAR_TONE_MAPPING",[d_]:"REINHARD_TONE_MAPPING",[p_]:"CINEON_TONE_MAPPING",[m_]:"ACES_FILMIC_TONE_MAPPING",[v_]:"AGX_TONE_MAPPING",[__]:"NEUTRAL_TONE_MAPPING",[g_]:"CUSTOM_TONE_MAPPING"};function z1(r,t,i,s,l){const c=new Ii(t,i,{type:r,depthBuffer:s,stencilBuffer:l}),f=new Ii(t,i,{type:xa,depthBuffer:!1,stencilBuffer:!1}),d=new Xi;d.setAttribute("position",new Ri([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute("uv",new Ri([0,2,0,0,2,0],2));const m=new AE({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),p=new Ci(d,m),g=new up(-1,1,1,-1,0,1);let v=null,x=null,y=!1,b,C=null,M=[],_=!1;this.setSize=function(z,U){c.setSize(z,U),f.setSize(z,U);for(let N=0;N<M.length;N++){const B=M[N];B.setSize&&B.setSize(z,U)}},this.setEffects=function(z){M=z,_=M.length>0&&M[0].isRenderPass===!0;const U=c.width,N=c.height;for(let B=0;B<M.length;B++){const L=M[B];L.setSize&&L.setSize(U,N)}},this.begin=function(z,U){if(y||z.toneMapping===Bi&&M.length===0)return!1;if(C=U,U!==null){const N=U.width,B=U.height;(c.width!==N||c.height!==B)&&this.setSize(N,B)}return _===!1&&z.setRenderTarget(c),b=z.toneMapping,z.toneMapping=Bi,!0},this.hasRenderPass=function(){return _},this.end=function(z,U){z.toneMapping=b,y=!0;let N=c,B=f;for(let L=0;L<M.length;L++){const D=M[L];if(D.enabled!==!1&&(D.render(z,B,N,U),D.needsSwap!==!1)){const k=N;N=B,B=k}}if(v!==z.outputColorSpace||x!==z.toneMapping){v=z.outputColorSpace,x=z.toneMapping,m.defines={},Ue.getTransfer(v)===ke&&(m.defines.SRGB_TRANSFER="");const L=P1[x];L&&(m.defines[L]=""),m.needsUpdate=!0}m.uniforms.tDiffuse.value=N.texture,z.setRenderTarget(C),z.render(p,g),C=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){c.dispose(),f.dispose(),d.dispose(),m.dispose()}}const K_=new Un,Wd=new el(1,1),J_=new w_,Q_=new SM,$_=new z_,Gv=[],kv=[],Xv=new Float32Array(16),Wv=new Float32Array(9),qv=new Float32Array(4);function Gr(r,t,i){const s=r[0];if(s<=0||s>0)return r;const l=t*i;let c=Gv[l];if(c===void 0&&(c=new Float32Array(l),Gv[l]=c),t!==0){s.toArray(c,0);for(let f=1,d=0;f!==t;++f)d+=i,r[f].toArray(c,d)}return c}function gn(r,t){if(r.length!==t.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==t[i])return!1;return!0}function vn(r,t){for(let i=0,s=t.length;i<s;i++)r[i]=t[i]}function au(r,t){let i=kv[t];i===void 0&&(i=new Int32Array(t),kv[t]=i);for(let s=0;s!==t;++s)i[s]=r.allocateTextureUnit();return i}function F1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function B1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;r.uniform2fv(this.addr,t),vn(i,t)}}function I1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(gn(i,t))return;r.uniform3fv(this.addr,t),vn(i,t)}}function H1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;r.uniform4fv(this.addr,t),vn(i,t)}}function V1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(gn(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),vn(i,t)}else{if(gn(i,s))return;qv.set(s),r.uniformMatrix2fv(this.addr,!1,qv),vn(i,s)}}function G1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(gn(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),vn(i,t)}else{if(gn(i,s))return;Wv.set(s),r.uniformMatrix3fv(this.addr,!1,Wv),vn(i,s)}}function k1(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(gn(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),vn(i,t)}else{if(gn(i,s))return;Xv.set(s),r.uniformMatrix4fv(this.addr,!1,Xv),vn(i,s)}}function X1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function W1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;r.uniform2iv(this.addr,t),vn(i,t)}}function q1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(gn(i,t))return;r.uniform3iv(this.addr,t),vn(i,t)}}function Y1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;r.uniform4iv(this.addr,t),vn(i,t)}}function j1(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function Z1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;r.uniform2uiv(this.addr,t),vn(i,t)}}function K1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(gn(i,t))return;r.uniform3uiv(this.addr,t),vn(i,t)}}function J1(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;r.uniform4uiv(this.addr,t),vn(i,t)}}function Q1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(Wd.compareFunction=i.isReversedDepthBuffer()?np:ep,c=Wd):c=K_,i.setTexture2D(t||c,l)}function $1(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(t||Q_,l)}function tA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(t||$_,l)}function eA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(t||J_,l)}function nA(r){switch(r){case 5126:return F1;case 35664:return B1;case 35665:return I1;case 35666:return H1;case 35674:return V1;case 35675:return G1;case 35676:return k1;case 5124:case 35670:return X1;case 35667:case 35671:return W1;case 35668:case 35672:return q1;case 35669:case 35673:return Y1;case 5125:return j1;case 36294:return Z1;case 36295:return K1;case 36296:return J1;case 35678:case 36198:case 36298:case 36306:case 35682:return Q1;case 35679:case 36299:case 36307:return $1;case 35680:case 36300:case 36308:case 36293:return tA;case 36289:case 36303:case 36311:case 36292:return eA}}function iA(r,t){r.uniform1fv(this.addr,t)}function aA(r,t){const i=Gr(t,this.size,2);r.uniform2fv(this.addr,i)}function sA(r,t){const i=Gr(t,this.size,3);r.uniform3fv(this.addr,i)}function rA(r,t){const i=Gr(t,this.size,4);r.uniform4fv(this.addr,i)}function oA(r,t){const i=Gr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function lA(r,t){const i=Gr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function cA(r,t){const i=Gr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function uA(r,t){r.uniform1iv(this.addr,t)}function fA(r,t){r.uniform2iv(this.addr,t)}function hA(r,t){r.uniform3iv(this.addr,t)}function dA(r,t){r.uniform4iv(this.addr,t)}function pA(r,t){r.uniform1uiv(this.addr,t)}function mA(r,t){r.uniform2uiv(this.addr,t)}function gA(r,t){r.uniform3uiv(this.addr,t)}function vA(r,t){r.uniform4uiv(this.addr,t)}function _A(r,t,i){const s=this.cache,l=t.length,c=au(i,l);gn(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));let f;this.type===r.SAMPLER_2D_SHADOW?f=Wd:f=K_;for(let d=0;d!==l;++d)i.setTexture2D(t[d]||f,c[d])}function xA(r,t,i){const s=this.cache,l=t.length,c=au(i,l);gn(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let f=0;f!==l;++f)i.setTexture3D(t[f]||Q_,c[f])}function SA(r,t,i){const s=this.cache,l=t.length,c=au(i,l);gn(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let f=0;f!==l;++f)i.setTextureCube(t[f]||$_,c[f])}function yA(r,t,i){const s=this.cache,l=t.length,c=au(i,l);gn(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let f=0;f!==l;++f)i.setTexture2DArray(t[f]||J_,c[f])}function MA(r){switch(r){case 5126:return iA;case 35664:return aA;case 35665:return sA;case 35666:return rA;case 35674:return oA;case 35675:return lA;case 35676:return cA;case 5124:case 35670:return uA;case 35667:case 35671:return fA;case 35668:case 35672:return hA;case 35669:case 35673:return dA;case 5125:return pA;case 36294:return mA;case 36295:return gA;case 36296:return vA;case 35678:case 36198:case 36298:case 36306:case 35682:return _A;case 35679:case 36299:case 36307:return xA;case 35680:case 36300:case 36308:case 36293:return SA;case 36289:case 36303:case 36311:case 36292:return yA}}class EA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.setValue=nA(i.type)}}class bA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=MA(i.type)}}class TA{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,s){const l=this.seq;for(let c=0,f=l.length;c!==f;++c){const d=l[c];d.setValue(t,i[d.id],s)}}}const jh=/(\w+)(\])?(\[|\.)?/g;function Yv(r,t){r.seq.push(t),r.map[t.id]=t}function AA(r,t,i){const s=r.name,l=s.length;for(jh.lastIndex=0;;){const c=jh.exec(s),f=jh.lastIndex;let d=c[1];const m=c[2]==="]",p=c[3];if(m&&(d=d|0),p===void 0||p==="["&&f+2===l){Yv(i,p===void 0?new EA(d,r,t):new bA(d,r,t));break}else{let v=i.map[d];v===void 0&&(v=new TA(d),Yv(i,v)),i=v}}}class Jc{constructor(t,i){this.seq=[],this.map={};const s=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let f=0;f<s;++f){const d=t.getActiveUniform(i,f),m=t.getUniformLocation(i,d.name);AA(d,m,this)}const l=[],c=[];for(const f of this.seq)f.type===t.SAMPLER_2D_SHADOW||f.type===t.SAMPLER_CUBE_SHADOW||f.type===t.SAMPLER_2D_ARRAY_SHADOW?l.push(f):c.push(f);l.length>0&&(this.seq=l.concat(c))}setValue(t,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(t,s,l)}setOptional(t,i,s){const l=i[s];l!==void 0&&this.setValue(t,s,l)}static upload(t,i,s,l){for(let c=0,f=i.length;c!==f;++c){const d=i[c],m=s[d.id];m.needsUpdate!==!1&&d.setValue(t,m.value,l)}}static seqWithValue(t,i){const s=[];for(let l=0,c=t.length;l!==c;++l){const f=t[l];f.id in i&&s.push(f)}return s}}function jv(r,t,i){const s=r.createShader(t);return r.shaderSource(s,i),r.compileShader(s),s}const RA=37297;let CA=0;function wA(r,t){const i=r.split(`
`),s=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let f=l;f<c;f++){const d=f+1;s.push(`${d===t?">":" "} ${d}: ${i[f]}`)}return s.join(`
`)}const Zv=new ye;function DA(r){Ue._getMatrix(Zv,Ue.workingColorSpace,r);const t=`mat3( ${Zv.elements.map(i=>i.toFixed(4))} )`;switch(Ue.getTransfer(r)){case $c:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return pe("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Kv(r,t,i){const s=r.getShaderParameter(t,r.COMPILE_STATUS),c=(r.getShaderInfoLog(t)||"").trim();if(s&&c==="")return"";const f=/ERROR: 0:(\d+)/.exec(c);if(f){const d=parseInt(f[1]);return i.toUpperCase()+`

`+c+`

`+wA(r.getShaderSource(t),d)}else return c}function UA(r,t){const i=DA(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const NA={[h_]:"Linear",[d_]:"Reinhard",[p_]:"Cineon",[m_]:"ACESFilmic",[v_]:"AgX",[__]:"Neutral",[g_]:"Custom"};function LA(r,t){const i=NA[t];return i===void 0?(pe("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Xc=new K;function OA(){Ue.getLuminanceCoefficients(Xc);const r=Xc.x.toFixed(4),t=Xc.y.toFixed(4),i=Xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function PA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(jo).join(`
`)}function zA(r){const t=[];for(const i in r){const s=r[i];s!==!1&&t.push("#define "+i+" "+s)}return t.join(`
`)}function FA(r,t){const i={},s=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(t,l),f=c.name;let d=1;c.type===r.FLOAT_MAT2&&(d=2),c.type===r.FLOAT_MAT3&&(d=3),c.type===r.FLOAT_MAT4&&(d=4),i[f]={type:c.type,location:r.getAttribLocation(t,f),locationSize:d}}return i}function jo(r){return r!==""}function Jv(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qv(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const BA=/^[ \t]*#include +<([\w\d./]+)>/gm;function qd(r){return r.replace(BA,HA)}const IA=new Map;function HA(r,t){let i=Me[t];if(i===void 0){const s=IA.get(t);if(s!==void 0)i=Me[s],pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,s);else throw new Error("Can not resolve #include <"+t+">")}return qd(i)}const VA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $v(r){return r.replace(VA,GA)}function GA(r,t,i,s){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function t_(r){let t=`precision ${r.precision} float;
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
#define LOW_PRECISION`),t}const kA={[qc]:"SHADOWMAP_TYPE_PCF",[qo]:"SHADOWMAP_TYPE_VSM"};function XA(r){return kA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const WA={[Ns]:"ENVMAP_TYPE_CUBE",[Pr]:"ENVMAP_TYPE_CUBE",[nu]:"ENVMAP_TYPE_CUBE_UV"};function qA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":WA[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const YA={[Pr]:"ENVMAP_MODE_REFRACTION"};function jA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":YA[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const ZA={[f_]:"ENVMAP_BLENDING_MULTIPLY",[eM]:"ENVMAP_BLENDING_MIX",[nM]:"ENVMAP_BLENDING_ADD"};function KA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":ZA[r.combine]||"ENVMAP_BLENDING_NONE"}function JA(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,s=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function QA(r,t,i,s){const l=r.getContext(),c=i.defines;let f=i.vertexShader,d=i.fragmentShader;const m=XA(i),p=qA(i),g=jA(i),v=KA(i),x=JA(i),y=PA(i),b=zA(c),C=l.createProgram();let M,_,z=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(jo).join(`
`),M.length>0&&(M+=`
`),_=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(jo).join(`
`),_.length>0&&(_+=`
`)):(M=[t_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jo).join(`
`),_=[t_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Bi?"#define TONE_MAPPING":"",i.toneMapping!==Bi?Me.tonemapping_pars_fragment:"",i.toneMapping!==Bi?LA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",Me.colorspace_pars_fragment,UA("linearToOutputTexel",i.outputColorSpace),OA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(jo).join(`
`)),f=qd(f),f=Jv(f,i),f=Qv(f,i),d=qd(d),d=Jv(d,i),d=Qv(d,i),f=$v(f),d=$v(d),i.isRawShaderMaterial!==!0&&(z=`#version 300 es
`,M=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,_=["#define varying in",i.glslVersion===cv?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===cv?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const U=z+M+f,N=z+_+d,B=jv(l,l.VERTEX_SHADER,U),L=jv(l,l.FRAGMENT_SHADER,N);l.attachShader(C,B),l.attachShader(C,L),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function D(V){if(r.debug.checkShaderErrors){const J=l.getProgramInfoLog(C)||"",Y=l.getShaderInfoLog(B)||"",ut=l.getShaderInfoLog(L)||"",rt=J.trim(),I=Y.trim(),H=ut.trim();let tt=!0,bt=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(tt=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,C,B,L);else{const Mt=Kv(l,B,"vertex"),F=Kv(l,L,"fragment");De("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+rt+`
`+Mt+`
`+F)}else rt!==""?pe("WebGLProgram: Program Info Log:",rt):(I===""||H==="")&&(bt=!1);bt&&(V.diagnostics={runnable:tt,programLog:rt,vertexShader:{log:I,prefix:M},fragmentShader:{log:H,prefix:_}})}l.deleteShader(B),l.deleteShader(L),k=new Jc(l,C),T=FA(l,C)}let k;this.getUniforms=function(){return k===void 0&&D(this),k};let T;this.getAttributes=function(){return T===void 0&&D(this),T};let w=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=l.getProgramParameter(C,RA)),w},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=CA++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=B,this.fragmentShader=L,this}let $A=0;class tR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,s=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),f=this._getShaderCacheForMaterial(t);return f.has(l)===!1&&(f.add(l),l.usedTimes++),f.has(c)===!1&&(f.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let s=i.get(t);return s===void 0&&(s=new Set,i.set(t,s)),s}_getShaderStage(t){const i=this.shaderCache;let s=i.get(t);return s===void 0&&(s=new eR(t),i.set(t,s)),s}}class eR{constructor(t){this.id=$A++,this.code=t,this.usedTimes=0}}function nR(r,t,i,s,l,c,f){const d=new D_,m=new tR,p=new Set,g=[],v=new Map,x=l.logarithmicDepthBuffer;let y=l.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(T){return p.add(T),T===0?"uv":`uv${T}`}function M(T,w,V,J,Y){const ut=J.fog,rt=Y.geometry,I=T.isMeshStandardMaterial?J.environment:null,H=(T.isMeshStandardMaterial?i:t).get(T.envMap||I),tt=H&&H.mapping===nu?H.image.height:null,bt=b[T.type];T.precision!==null&&(y=l.getMaxPrecision(T.precision),y!==T.precision&&pe("WebGLProgram.getParameters:",T.precision,"not supported, using",y,"instead."));const Mt=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,F=Mt!==void 0?Mt.length:0;let $=0;rt.morphAttributes.position!==void 0&&($=1),rt.morphAttributes.normal!==void 0&&($=2),rt.morphAttributes.color!==void 0&&($=3);let ft,Rt,Xt,it;if(bt){const we=Pi[bt];ft=we.vertexShader,Rt=we.fragmentShader}else ft=T.vertexShader,Rt=T.fragmentShader,m.update(T),Xt=m.getVertexShaderID(T),it=m.getFragmentShaderID(T);const ot=r.getRenderTarget(),Ut=r.state.buffers.depth.getReversed(),Vt=Y.isInstancedMesh===!0,It=Y.isBatchedMesh===!0,ve=!!T.map,me=!!T.matcap,fe=!!H,xt=!!T.aoMap,gt=!!T.lightMap,vt=!!T.bumpMap,Nt=!!T.normalMap,P=!!T.displacementMap,Qt=!!T.emissiveMap,Ft=!!T.metalnessMap,ae=!!T.roughnessMap,Lt=T.anisotropy>0,O=T.clearcoat>0,E=T.dispersion>0,q=T.iridescence>0,ht=T.sheen>0,Et=T.transmission>0,dt=Lt&&!!T.anisotropyMap,te=O&&!!T.clearcoatMap,Pt=O&&!!T.clearcoatNormalMap,$t=O&&!!T.clearcoatRoughnessMap,le=q&&!!T.iridescenceMap,Tt=q&&!!T.iridescenceThicknessMap,wt=ht&&!!T.sheenColorMap,jt=ht&&!!T.sheenRoughnessMap,Wt=!!T.specularMap,zt=!!T.specularColorMap,xe=!!T.specularIntensityMap,W=Et&&!!T.transmissionMap,Ht=Et&&!!T.thicknessMap,Dt=!!T.gradientMap,qt=!!T.alphaMap,At=T.alphaTest>0,yt=!!T.alphaHash,Ot=!!T.extensions;let he=Bi;T.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(he=r.toneMapping);const Ie={shaderID:bt,shaderType:T.type,shaderName:T.name,vertexShader:ft,fragmentShader:Rt,defines:T.defines,customVertexShaderID:Xt,customFragmentShaderID:it,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:y,batching:It,batchingColor:It&&Y._colorsTexture!==null,instancing:Vt,instancingColor:Vt&&Y.instanceColor!==null,instancingMorph:Vt&&Y.morphTexture!==null,outputColorSpace:ot===null?r.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:Fr,alphaToCoverage:!!T.alphaToCoverage,map:ve,matcap:me,envMap:fe,envMapMode:fe&&H.mapping,envMapCubeUVHeight:tt,aoMap:xt,lightMap:gt,bumpMap:vt,normalMap:Nt,displacementMap:P,emissiveMap:Qt,normalMapObjectSpace:Nt&&T.normalMapType===sM,normalMapTangentSpace:Nt&&T.normalMapType===R_,metalnessMap:Ft,roughnessMap:ae,anisotropy:Lt,anisotropyMap:dt,clearcoat:O,clearcoatMap:te,clearcoatNormalMap:Pt,clearcoatRoughnessMap:$t,dispersion:E,iridescence:q,iridescenceMap:le,iridescenceThicknessMap:Tt,sheen:ht,sheenColorMap:wt,sheenRoughnessMap:jt,specularMap:Wt,specularColorMap:zt,specularIntensityMap:xe,transmission:Et,transmissionMap:W,thicknessMap:Ht,gradientMap:Dt,opaque:T.transparent===!1&&T.blending===Nr&&T.alphaToCoverage===!1,alphaMap:qt,alphaTest:At,alphaHash:yt,combine:T.combine,mapUv:ve&&C(T.map.channel),aoMapUv:xt&&C(T.aoMap.channel),lightMapUv:gt&&C(T.lightMap.channel),bumpMapUv:vt&&C(T.bumpMap.channel),normalMapUv:Nt&&C(T.normalMap.channel),displacementMapUv:P&&C(T.displacementMap.channel),emissiveMapUv:Qt&&C(T.emissiveMap.channel),metalnessMapUv:Ft&&C(T.metalnessMap.channel),roughnessMapUv:ae&&C(T.roughnessMap.channel),anisotropyMapUv:dt&&C(T.anisotropyMap.channel),clearcoatMapUv:te&&C(T.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&C(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$t&&C(T.clearcoatRoughnessMap.channel),iridescenceMapUv:le&&C(T.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&C(T.iridescenceThicknessMap.channel),sheenColorMapUv:wt&&C(T.sheenColorMap.channel),sheenRoughnessMapUv:jt&&C(T.sheenRoughnessMap.channel),specularMapUv:Wt&&C(T.specularMap.channel),specularColorMapUv:zt&&C(T.specularColorMap.channel),specularIntensityMapUv:xe&&C(T.specularIntensityMap.channel),transmissionMapUv:W&&C(T.transmissionMap.channel),thicknessMapUv:Ht&&C(T.thicknessMap.channel),alphaMapUv:qt&&C(T.alphaMap.channel),vertexTangents:!!rt.attributes.tangent&&(Nt||Lt),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,pointsUvs:Y.isPoints===!0&&!!rt.attributes.uv&&(ve||qt),fog:!!ut,useFog:T.fog===!0,fogExp2:!!ut&&ut.isFogExp2,flatShading:T.flatShading===!0&&T.wireframe===!1,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:x,reversedDepthBuffer:Ut,skinning:Y.isSkinnedMesh===!0,morphTargets:rt.morphAttributes.position!==void 0,morphNormals:rt.morphAttributes.normal!==void 0,morphColors:rt.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:$,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:f.numPlanes,numClipIntersection:f.numIntersection,dithering:T.dithering,shadowMapEnabled:r.shadowMap.enabled&&V.length>0,shadowMapType:r.shadowMap.type,toneMapping:he,decodeVideoTexture:ve&&T.map.isVideoTexture===!0&&Ue.getTransfer(T.map.colorSpace)===ke,decodeVideoTextureEmissive:Qt&&T.emissiveMap.isVideoTexture===!0&&Ue.getTransfer(T.emissiveMap.colorSpace)===ke,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===ma,flipSided:T.side===Yn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Ot&&T.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ot&&T.extensions.multiDraw===!0||It)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Ie.vertexUv1s=p.has(1),Ie.vertexUv2s=p.has(2),Ie.vertexUv3s=p.has(3),p.clear(),Ie}function _(T){const w=[];if(T.shaderID?w.push(T.shaderID):(w.push(T.customVertexShaderID),w.push(T.customFragmentShaderID)),T.defines!==void 0)for(const V in T.defines)w.push(V),w.push(T.defines[V]);return T.isRawShaderMaterial===!1&&(z(w,T),U(w,T),w.push(r.outputColorSpace)),w.push(T.customProgramCacheKey),w.join()}function z(T,w){T.push(w.precision),T.push(w.outputColorSpace),T.push(w.envMapMode),T.push(w.envMapCubeUVHeight),T.push(w.mapUv),T.push(w.alphaMapUv),T.push(w.lightMapUv),T.push(w.aoMapUv),T.push(w.bumpMapUv),T.push(w.normalMapUv),T.push(w.displacementMapUv),T.push(w.emissiveMapUv),T.push(w.metalnessMapUv),T.push(w.roughnessMapUv),T.push(w.anisotropyMapUv),T.push(w.clearcoatMapUv),T.push(w.clearcoatNormalMapUv),T.push(w.clearcoatRoughnessMapUv),T.push(w.iridescenceMapUv),T.push(w.iridescenceThicknessMapUv),T.push(w.sheenColorMapUv),T.push(w.sheenRoughnessMapUv),T.push(w.specularMapUv),T.push(w.specularColorMapUv),T.push(w.specularIntensityMapUv),T.push(w.transmissionMapUv),T.push(w.thicknessMapUv),T.push(w.combine),T.push(w.fogExp2),T.push(w.sizeAttenuation),T.push(w.morphTargetsCount),T.push(w.morphAttributeCount),T.push(w.numDirLights),T.push(w.numPointLights),T.push(w.numSpotLights),T.push(w.numSpotLightMaps),T.push(w.numHemiLights),T.push(w.numRectAreaLights),T.push(w.numDirLightShadows),T.push(w.numPointLightShadows),T.push(w.numSpotLightShadows),T.push(w.numSpotLightShadowsWithMaps),T.push(w.numLightProbes),T.push(w.shadowMapType),T.push(w.toneMapping),T.push(w.numClippingPlanes),T.push(w.numClipIntersection),T.push(w.depthPacking)}function U(T,w){d.disableAll(),w.instancing&&d.enable(0),w.instancingColor&&d.enable(1),w.instancingMorph&&d.enable(2),w.matcap&&d.enable(3),w.envMap&&d.enable(4),w.normalMapObjectSpace&&d.enable(5),w.normalMapTangentSpace&&d.enable(6),w.clearcoat&&d.enable(7),w.iridescence&&d.enable(8),w.alphaTest&&d.enable(9),w.vertexColors&&d.enable(10),w.vertexAlphas&&d.enable(11),w.vertexUv1s&&d.enable(12),w.vertexUv2s&&d.enable(13),w.vertexUv3s&&d.enable(14),w.vertexTangents&&d.enable(15),w.anisotropy&&d.enable(16),w.alphaHash&&d.enable(17),w.batching&&d.enable(18),w.dispersion&&d.enable(19),w.batchingColor&&d.enable(20),w.gradientMap&&d.enable(21),T.push(d.mask),d.disableAll(),w.fog&&d.enable(0),w.useFog&&d.enable(1),w.flatShading&&d.enable(2),w.logarithmicDepthBuffer&&d.enable(3),w.reversedDepthBuffer&&d.enable(4),w.skinning&&d.enable(5),w.morphTargets&&d.enable(6),w.morphNormals&&d.enable(7),w.morphColors&&d.enable(8),w.premultipliedAlpha&&d.enable(9),w.shadowMapEnabled&&d.enable(10),w.doubleSided&&d.enable(11),w.flipSided&&d.enable(12),w.useDepthPacking&&d.enable(13),w.dithering&&d.enable(14),w.transmission&&d.enable(15),w.sheen&&d.enable(16),w.opaque&&d.enable(17),w.pointsUvs&&d.enable(18),w.decodeVideoTexture&&d.enable(19),w.decodeVideoTextureEmissive&&d.enable(20),w.alphaToCoverage&&d.enable(21),T.push(d.mask)}function N(T){const w=b[T.type];let V;if(w){const J=Pi[w];V=OM.clone(J.uniforms)}else V=T.uniforms;return V}function B(T,w){let V=v.get(w);return V!==void 0?++V.usedTimes:(V=new QA(r,w,T,c),g.push(V),v.set(w,V)),V}function L(T){if(--T.usedTimes===0){const w=g.indexOf(T);g[w]=g[g.length-1],g.pop(),v.delete(T.cacheKey),T.destroy()}}function D(T){m.remove(T)}function k(){m.dispose()}return{getParameters:M,getProgramCacheKey:_,getUniforms:N,acquireProgram:B,releaseProgram:L,releaseShaderCache:D,programs:g,dispose:k}}function iR(){let r=new WeakMap;function t(f){return r.has(f)}function i(f){let d=r.get(f);return d===void 0&&(d={},r.set(f,d)),d}function s(f){r.delete(f)}function l(f,d,m){r.get(f)[d]=m}function c(){r=new WeakMap}return{has:t,get:i,remove:s,update:l,dispose:c}}function aR(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function e_(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function n_(){const r=[];let t=0;const i=[],s=[],l=[];function c(){t=0,i.length=0,s.length=0,l.length=0}function f(v,x,y,b,C,M){let _=r[t];return _===void 0?(_={id:v.id,object:v,geometry:x,material:y,groupOrder:b,renderOrder:v.renderOrder,z:C,group:M},r[t]=_):(_.id=v.id,_.object=v,_.geometry=x,_.material=y,_.groupOrder=b,_.renderOrder=v.renderOrder,_.z=C,_.group=M),t++,_}function d(v,x,y,b,C,M){const _=f(v,x,y,b,C,M);y.transmission>0?s.push(_):y.transparent===!0?l.push(_):i.push(_)}function m(v,x,y,b,C,M){const _=f(v,x,y,b,C,M);y.transmission>0?s.unshift(_):y.transparent===!0?l.unshift(_):i.unshift(_)}function p(v,x){i.length>1&&i.sort(v||aR),s.length>1&&s.sort(x||e_),l.length>1&&l.sort(x||e_)}function g(){for(let v=t,x=r.length;v<x;v++){const y=r[v];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:d,unshift:m,finish:g,sort:p}}function sR(){let r=new WeakMap;function t(s,l){const c=r.get(s);let f;return c===void 0?(f=new n_,r.set(s,[f])):l>=c.length?(f=new n_,c.push(f)):f=c[l],f}function i(){r=new WeakMap}return{get:t,dispose:i}}function rR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new K,color:new Fe};break;case"SpotLight":i={position:new K,direction:new K,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new K,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":i={direction:new K,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":i={color:new Fe,position:new K,halfWidth:new K,halfHeight:new K};break}return r[t.id]=i,i}}}function oR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let lR=0;function cR(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function uR(r){const t=new rR,i=oR(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new K);const l=new K,c=new tn,f=new tn;function d(p){let g=0,v=0,x=0;for(let T=0;T<9;T++)s.probe[T].set(0,0,0);let y=0,b=0,C=0,M=0,_=0,z=0,U=0,N=0,B=0,L=0,D=0;p.sort(cR);for(let T=0,w=p.length;T<w;T++){const V=p[T],J=V.color,Y=V.intensity,ut=V.distance;let rt=null;if(V.shadow&&V.shadow.map&&(V.shadow.map.texture.format===zr?rt=V.shadow.map.texture:rt=V.shadow.map.depthTexture||V.shadow.map.texture),V.isAmbientLight)g+=J.r*Y,v+=J.g*Y,x+=J.b*Y;else if(V.isLightProbe){for(let I=0;I<9;I++)s.probe[I].addScaledVector(V.sh.coefficients[I],Y);D++}else if(V.isDirectionalLight){const I=t.get(V);if(I.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){const H=V.shadow,tt=i.get(V);tt.shadowIntensity=H.intensity,tt.shadowBias=H.bias,tt.shadowNormalBias=H.normalBias,tt.shadowRadius=H.radius,tt.shadowMapSize=H.mapSize,s.directionalShadow[y]=tt,s.directionalShadowMap[y]=rt,s.directionalShadowMatrix[y]=V.shadow.matrix,z++}s.directional[y]=I,y++}else if(V.isSpotLight){const I=t.get(V);I.position.setFromMatrixPosition(V.matrixWorld),I.color.copy(J).multiplyScalar(Y),I.distance=ut,I.coneCos=Math.cos(V.angle),I.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),I.decay=V.decay,s.spot[C]=I;const H=V.shadow;if(V.map&&(s.spotLightMap[B]=V.map,B++,H.updateMatrices(V),V.castShadow&&L++),s.spotLightMatrix[C]=H.matrix,V.castShadow){const tt=i.get(V);tt.shadowIntensity=H.intensity,tt.shadowBias=H.bias,tt.shadowNormalBias=H.normalBias,tt.shadowRadius=H.radius,tt.shadowMapSize=H.mapSize,s.spotShadow[C]=tt,s.spotShadowMap[C]=rt,N++}C++}else if(V.isRectAreaLight){const I=t.get(V);I.color.copy(J).multiplyScalar(Y),I.halfWidth.set(V.width*.5,0,0),I.halfHeight.set(0,V.height*.5,0),s.rectArea[M]=I,M++}else if(V.isPointLight){const I=t.get(V);if(I.color.copy(V.color).multiplyScalar(V.intensity),I.distance=V.distance,I.decay=V.decay,V.castShadow){const H=V.shadow,tt=i.get(V);tt.shadowIntensity=H.intensity,tt.shadowBias=H.bias,tt.shadowNormalBias=H.normalBias,tt.shadowRadius=H.radius,tt.shadowMapSize=H.mapSize,tt.shadowCameraNear=H.camera.near,tt.shadowCameraFar=H.camera.far,s.pointShadow[b]=tt,s.pointShadowMap[b]=rt,s.pointShadowMatrix[b]=V.shadow.matrix,U++}s.point[b]=I,b++}else if(V.isHemisphereLight){const I=t.get(V);I.skyColor.copy(V.color).multiplyScalar(Y),I.groundColor.copy(V.groundColor).multiplyScalar(Y),s.hemi[_]=I,_++}}M>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=kt.LTC_FLOAT_1,s.rectAreaLTC2=kt.LTC_FLOAT_2):(s.rectAreaLTC1=kt.LTC_HALF_1,s.rectAreaLTC2=kt.LTC_HALF_2)),s.ambient[0]=g,s.ambient[1]=v,s.ambient[2]=x;const k=s.hash;(k.directionalLength!==y||k.pointLength!==b||k.spotLength!==C||k.rectAreaLength!==M||k.hemiLength!==_||k.numDirectionalShadows!==z||k.numPointShadows!==U||k.numSpotShadows!==N||k.numSpotMaps!==B||k.numLightProbes!==D)&&(s.directional.length=y,s.spot.length=C,s.rectArea.length=M,s.point.length=b,s.hemi.length=_,s.directionalShadow.length=z,s.directionalShadowMap.length=z,s.pointShadow.length=U,s.pointShadowMap.length=U,s.spotShadow.length=N,s.spotShadowMap.length=N,s.directionalShadowMatrix.length=z,s.pointShadowMatrix.length=U,s.spotLightMatrix.length=N+B-L,s.spotLightMap.length=B,s.numSpotLightShadowsWithMaps=L,s.numLightProbes=D,k.directionalLength=y,k.pointLength=b,k.spotLength=C,k.rectAreaLength=M,k.hemiLength=_,k.numDirectionalShadows=z,k.numPointShadows=U,k.numSpotShadows=N,k.numSpotMaps=B,k.numLightProbes=D,s.version=lR++)}function m(p,g){let v=0,x=0,y=0,b=0,C=0;const M=g.matrixWorldInverse;for(let _=0,z=p.length;_<z;_++){const U=p[_];if(U.isDirectionalLight){const N=s.directional[v];N.direction.setFromMatrixPosition(U.matrixWorld),l.setFromMatrixPosition(U.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),v++}else if(U.isSpotLight){const N=s.spot[y];N.position.setFromMatrixPosition(U.matrixWorld),N.position.applyMatrix4(M),N.direction.setFromMatrixPosition(U.matrixWorld),l.setFromMatrixPosition(U.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),y++}else if(U.isRectAreaLight){const N=s.rectArea[b];N.position.setFromMatrixPosition(U.matrixWorld),N.position.applyMatrix4(M),f.identity(),c.copy(U.matrixWorld),c.premultiply(M),f.extractRotation(c),N.halfWidth.set(U.width*.5,0,0),N.halfHeight.set(0,U.height*.5,0),N.halfWidth.applyMatrix4(f),N.halfHeight.applyMatrix4(f),b++}else if(U.isPointLight){const N=s.point[x];N.position.setFromMatrixPosition(U.matrixWorld),N.position.applyMatrix4(M),x++}else if(U.isHemisphereLight){const N=s.hemi[C];N.direction.setFromMatrixPosition(U.matrixWorld),N.direction.transformDirection(M),C++}}}return{setup:d,setupView:m,state:s}}function i_(r){const t=new uR(r),i=[],s=[];function l(g){p.camera=g,i.length=0,s.length=0}function c(g){i.push(g)}function f(g){s.push(g)}function d(){t.setup(i)}function m(g){t.setupView(i,g)}const p={lightsArray:i,shadowsArray:s,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:d,setupLightsView:m,pushLight:c,pushShadow:f}}function fR(r){let t=new WeakMap;function i(l,c=0){const f=t.get(l);let d;return f===void 0?(d=new i_(r),t.set(l,[d])):c>=f.length?(d=new i_(r),f.push(d)):d=f[c],d}function s(){t=new WeakMap}return{get:i,dispose:s}}const hR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dR=`uniform sampler2D shadow_pass;
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
}`,pR=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],mR=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],a_=new tn,Wo=new K,Zh=new K;function gR(r,t,i){let s=new rp;const l=new Yt,c=new Yt,f=new an,d=new CE,m=new wE,p={},g=i.maxTextureSize,v={[ns]:Yn,[Yn]:ns,[ma]:ma},x=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:hR,fragmentShader:dR}),y=x.clone();y.defines.HORIZONTAL_PASS=1;const b=new Xi;b.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Ci(b,x),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qc;let _=this.type;this.render=function(L,D,k){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||L.length===0)return;L.type===zy&&(pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),L.type=qc);const T=r.getRenderTarget(),w=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),J=r.state;J.setBlending(va),J.buffers.depth.getReversed()===!0?J.buffers.color.setClear(0,0,0,0):J.buffers.color.setClear(1,1,1,1),J.buffers.depth.setTest(!0),J.setScissorTest(!1);const Y=_!==this.type;Y&&D.traverse(function(ut){ut.material&&(Array.isArray(ut.material)?ut.material.forEach(rt=>rt.needsUpdate=!0):ut.material.needsUpdate=!0)});for(let ut=0,rt=L.length;ut<rt;ut++){const I=L[ut],H=I.shadow;if(H===void 0){pe("WebGLShadowMap:",I,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;l.copy(H.mapSize);const tt=H.getFrameExtents();if(l.multiply(tt),c.copy(H.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(c.x=Math.floor(g/tt.x),l.x=c.x*tt.x,H.mapSize.x=c.x),l.y>g&&(c.y=Math.floor(g/tt.y),l.y=c.y*tt.y,H.mapSize.y=c.y)),H.map===null||Y===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===qo){if(I.isPointLight){pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Ii(l.x,l.y,{format:zr,type:xa,minFilter:dn,magFilter:dn,generateMipmaps:!1}),H.map.texture.name=I.name+".shadowMap",H.map.depthTexture=new el(l.x,l.y,zi),H.map.depthTexture.name=I.name+".shadowMapDepth",H.map.depthTexture.format=Sa,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Dn,H.map.depthTexture.magFilter=Dn}else{I.isPointLight?(H.map=new F_(l.x),H.map.depthTexture=new qM(l.x,Vi)):(H.map=new Ii(l.x,l.y),H.map.depthTexture=new el(l.x,l.y,Vi)),H.map.depthTexture.name=I.name+".shadowMap",H.map.depthTexture.format=Sa;const Mt=r.state.buffers.depth.getReversed();this.type===qc?(H.map.depthTexture.compareFunction=Mt?np:ep,H.map.depthTexture.minFilter=dn,H.map.depthTexture.magFilter=dn):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Dn,H.map.depthTexture.magFilter=Dn)}H.camera.updateProjectionMatrix()}const bt=H.map.isWebGLCubeRenderTarget?6:1;for(let Mt=0;Mt<bt;Mt++){if(H.map.isWebGLCubeRenderTarget)r.setRenderTarget(H.map,Mt),r.clear();else{Mt===0&&(r.setRenderTarget(H.map),r.clear());const F=H.getViewport(Mt);f.set(c.x*F.x,c.y*F.y,c.x*F.z,c.y*F.w),J.viewport(f)}if(I.isPointLight){const F=H.camera,$=H.matrix,ft=I.distance||F.far;ft!==F.far&&(F.far=ft,F.updateProjectionMatrix()),Wo.setFromMatrixPosition(I.matrixWorld),F.position.copy(Wo),Zh.copy(F.position),Zh.add(pR[Mt]),F.up.copy(mR[Mt]),F.lookAt(Zh),F.updateMatrixWorld(),$.makeTranslation(-Wo.x,-Wo.y,-Wo.z),a_.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),H._frustum.setFromProjectionMatrix(a_,F.coordinateSystem,F.reversedDepth)}else H.updateMatrices(I);s=H.getFrustum(),N(D,k,H.camera,I,this.type)}H.isPointLightShadow!==!0&&this.type===qo&&z(H,k),H.needsUpdate=!1}_=this.type,M.needsUpdate=!1,r.setRenderTarget(T,w,V)};function z(L,D){const k=t.update(C);x.defines.VSM_SAMPLES!==L.blurSamples&&(x.defines.VSM_SAMPLES=L.blurSamples,y.defines.VSM_SAMPLES=L.blurSamples,x.needsUpdate=!0,y.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Ii(l.x,l.y,{format:zr,type:xa})),x.uniforms.shadow_pass.value=L.map.depthTexture,x.uniforms.resolution.value=L.mapSize,x.uniforms.radius.value=L.radius,r.setRenderTarget(L.mapPass),r.clear(),r.renderBufferDirect(D,null,k,x,C,null),y.uniforms.shadow_pass.value=L.mapPass.texture,y.uniforms.resolution.value=L.mapSize,y.uniforms.radius.value=L.radius,r.setRenderTarget(L.map),r.clear(),r.renderBufferDirect(D,null,k,y,C,null)}function U(L,D,k,T){let w=null;const V=k.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(V!==void 0)w=V;else if(w=k.isPointLight===!0?m:d,r.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){const J=w.uuid,Y=D.uuid;let ut=p[J];ut===void 0&&(ut={},p[J]=ut);let rt=ut[Y];rt===void 0&&(rt=w.clone(),ut[Y]=rt,D.addEventListener("dispose",B)),w=rt}if(w.visible=D.visible,w.wireframe=D.wireframe,T===qo?w.side=D.shadowSide!==null?D.shadowSide:D.side:w.side=D.shadowSide!==null?D.shadowSide:v[D.side],w.alphaMap=D.alphaMap,w.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,w.map=D.map,w.clipShadows=D.clipShadows,w.clippingPlanes=D.clippingPlanes,w.clipIntersection=D.clipIntersection,w.displacementMap=D.displacementMap,w.displacementScale=D.displacementScale,w.displacementBias=D.displacementBias,w.wireframeLinewidth=D.wireframeLinewidth,w.linewidth=D.linewidth,k.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const J=r.properties.get(w);J.light=k}return w}function N(L,D,k,T,w){if(L.visible===!1)return;if(L.layers.test(D.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&w===qo)&&(!L.frustumCulled||s.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,L.matrixWorld);const Y=t.update(L),ut=L.material;if(Array.isArray(ut)){const rt=Y.groups;for(let I=0,H=rt.length;I<H;I++){const tt=rt[I],bt=ut[tt.materialIndex];if(bt&&bt.visible){const Mt=U(L,bt,T,w);L.onBeforeShadow(r,L,D,k,Y,Mt,tt),r.renderBufferDirect(k,null,Y,Mt,L,tt),L.onAfterShadow(r,L,D,k,Y,Mt,tt)}}}else if(ut.visible){const rt=U(L,ut,T,w);L.onBeforeShadow(r,L,D,k,Y,rt,null),r.renderBufferDirect(k,null,Y,rt,L,null),L.onAfterShadow(r,L,D,k,Y,rt,null)}}const J=L.children;for(let Y=0,ut=J.length;Y<ut;Y++)N(J[Y],D,k,T,w)}function B(L){L.target.removeEventListener("dispose",B);for(const k in p){const T=p[k],w=L.target.uuid;w in T&&(T[w].dispose(),delete T[w])}}}const vR={[Qh]:$h,[td]:id,[ed]:ad,[Or]:nd,[$h]:Qh,[id]:td,[ad]:ed,[nd]:Or};function _R(r,t){function i(){let W=!1;const Ht=new an;let Dt=null;const qt=new an(0,0,0,0);return{setMask:function(At){Dt!==At&&!W&&(r.colorMask(At,At,At,At),Dt=At)},setLocked:function(At){W=At},setClear:function(At,yt,Ot,he,Ie){Ie===!0&&(At*=he,yt*=he,Ot*=he),Ht.set(At,yt,Ot,he),qt.equals(Ht)===!1&&(r.clearColor(At,yt,Ot,he),qt.copy(Ht))},reset:function(){W=!1,Dt=null,qt.set(-1,0,0,0)}}}function s(){let W=!1,Ht=!1,Dt=null,qt=null,At=null;return{setReversed:function(yt){if(Ht!==yt){const Ot=t.get("EXT_clip_control");yt?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT),Ht=yt;const he=At;At=null,this.setClear(he)}},getReversed:function(){return Ht},setTest:function(yt){yt?ot(r.DEPTH_TEST):Ut(r.DEPTH_TEST)},setMask:function(yt){Dt!==yt&&!W&&(r.depthMask(yt),Dt=yt)},setFunc:function(yt){if(Ht&&(yt=vR[yt]),qt!==yt){switch(yt){case Qh:r.depthFunc(r.NEVER);break;case $h:r.depthFunc(r.ALWAYS);break;case td:r.depthFunc(r.LESS);break;case Or:r.depthFunc(r.LEQUAL);break;case ed:r.depthFunc(r.EQUAL);break;case nd:r.depthFunc(r.GEQUAL);break;case id:r.depthFunc(r.GREATER);break;case ad:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}qt=yt}},setLocked:function(yt){W=yt},setClear:function(yt){At!==yt&&(Ht&&(yt=1-yt),r.clearDepth(yt),At=yt)},reset:function(){W=!1,Dt=null,qt=null,At=null,Ht=!1}}}function l(){let W=!1,Ht=null,Dt=null,qt=null,At=null,yt=null,Ot=null,he=null,Ie=null;return{setTest:function(we){W||(we?ot(r.STENCIL_TEST):Ut(r.STENCIL_TEST))},setMask:function(we){Ht!==we&&!W&&(r.stencilMask(we),Ht=we)},setFunc:function(we,Nn,gi){(Dt!==we||qt!==Nn||At!==gi)&&(r.stencilFunc(we,Nn,gi),Dt=we,qt=Nn,At=gi)},setOp:function(we,Nn,gi){(yt!==we||Ot!==Nn||he!==gi)&&(r.stencilOp(we,Nn,gi),yt=we,Ot=Nn,he=gi)},setLocked:function(we){W=we},setClear:function(we){Ie!==we&&(r.clearStencil(we),Ie=we)},reset:function(){W=!1,Ht=null,Dt=null,qt=null,At=null,yt=null,Ot=null,he=null,Ie=null}}}const c=new i,f=new s,d=new l,m=new WeakMap,p=new WeakMap;let g={},v={},x=new WeakMap,y=[],b=null,C=!1,M=null,_=null,z=null,U=null,N=null,B=null,L=null,D=new Fe(0,0,0),k=0,T=!1,w=null,V=null,J=null,Y=null,ut=null;const rt=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,H=0;const tt=r.getParameter(r.VERSION);tt.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(tt)[1]),I=H>=1):tt.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),I=H>=2);let bt=null,Mt={};const F=r.getParameter(r.SCISSOR_BOX),$=r.getParameter(r.VIEWPORT),ft=new an().fromArray(F),Rt=new an().fromArray($);function Xt(W,Ht,Dt,qt){const At=new Uint8Array(4),yt=r.createTexture();r.bindTexture(W,yt),r.texParameteri(W,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(W,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ot=0;Ot<Dt;Ot++)W===r.TEXTURE_3D||W===r.TEXTURE_2D_ARRAY?r.texImage3D(Ht,0,r.RGBA,1,1,qt,0,r.RGBA,r.UNSIGNED_BYTE,At):r.texImage2D(Ht+Ot,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,At);return yt}const it={};it[r.TEXTURE_2D]=Xt(r.TEXTURE_2D,r.TEXTURE_2D,1),it[r.TEXTURE_CUBE_MAP]=Xt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),it[r.TEXTURE_2D_ARRAY]=Xt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),it[r.TEXTURE_3D]=Xt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),f.setClear(1),d.setClear(0),ot(r.DEPTH_TEST),f.setFunc(Or),vt(!1),Nt(iv),ot(r.CULL_FACE),xt(va);function ot(W){g[W]!==!0&&(r.enable(W),g[W]=!0)}function Ut(W){g[W]!==!1&&(r.disable(W),g[W]=!1)}function Vt(W,Ht){return v[W]!==Ht?(r.bindFramebuffer(W,Ht),v[W]=Ht,W===r.DRAW_FRAMEBUFFER&&(v[r.FRAMEBUFFER]=Ht),W===r.FRAMEBUFFER&&(v[r.DRAW_FRAMEBUFFER]=Ht),!0):!1}function It(W,Ht){let Dt=y,qt=!1;if(W){Dt=x.get(Ht),Dt===void 0&&(Dt=[],x.set(Ht,Dt));const At=W.textures;if(Dt.length!==At.length||Dt[0]!==r.COLOR_ATTACHMENT0){for(let yt=0,Ot=At.length;yt<Ot;yt++)Dt[yt]=r.COLOR_ATTACHMENT0+yt;Dt.length=At.length,qt=!0}}else Dt[0]!==r.BACK&&(Dt[0]=r.BACK,qt=!0);qt&&r.drawBuffers(Dt)}function ve(W){return b!==W?(r.useProgram(W),b=W,!0):!1}const me={[Cs]:r.FUNC_ADD,[By]:r.FUNC_SUBTRACT,[Iy]:r.FUNC_REVERSE_SUBTRACT};me[Hy]=r.MIN,me[Vy]=r.MAX;const fe={[Gy]:r.ZERO,[ky]:r.ONE,[Xy]:r.SRC_COLOR,[Kh]:r.SRC_ALPHA,[Ky]:r.SRC_ALPHA_SATURATE,[jy]:r.DST_COLOR,[qy]:r.DST_ALPHA,[Wy]:r.ONE_MINUS_SRC_COLOR,[Jh]:r.ONE_MINUS_SRC_ALPHA,[Zy]:r.ONE_MINUS_DST_COLOR,[Yy]:r.ONE_MINUS_DST_ALPHA,[Jy]:r.CONSTANT_COLOR,[Qy]:r.ONE_MINUS_CONSTANT_COLOR,[$y]:r.CONSTANT_ALPHA,[tM]:r.ONE_MINUS_CONSTANT_ALPHA};function xt(W,Ht,Dt,qt,At,yt,Ot,he,Ie,we){if(W===va){C===!0&&(Ut(r.BLEND),C=!1);return}if(C===!1&&(ot(r.BLEND),C=!0),W!==Fy){if(W!==M||we!==T){if((_!==Cs||N!==Cs)&&(r.blendEquation(r.FUNC_ADD),_=Cs,N=Cs),we)switch(W){case Nr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case av:r.blendFunc(r.ONE,r.ONE);break;case sv:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case rv:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:De("WebGLState: Invalid blending: ",W);break}else switch(W){case Nr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case av:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case sv:De("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rv:De("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:De("WebGLState: Invalid blending: ",W);break}z=null,U=null,B=null,L=null,D.set(0,0,0),k=0,M=W,T=we}return}At=At||Ht,yt=yt||Dt,Ot=Ot||qt,(Ht!==_||At!==N)&&(r.blendEquationSeparate(me[Ht],me[At]),_=Ht,N=At),(Dt!==z||qt!==U||yt!==B||Ot!==L)&&(r.blendFuncSeparate(fe[Dt],fe[qt],fe[yt],fe[Ot]),z=Dt,U=qt,B=yt,L=Ot),(he.equals(D)===!1||Ie!==k)&&(r.blendColor(he.r,he.g,he.b,Ie),D.copy(he),k=Ie),M=W,T=!1}function gt(W,Ht){W.side===ma?Ut(r.CULL_FACE):ot(r.CULL_FACE);let Dt=W.side===Yn;Ht&&(Dt=!Dt),vt(Dt),W.blending===Nr&&W.transparent===!1?xt(va):xt(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),f.setFunc(W.depthFunc),f.setTest(W.depthTest),f.setMask(W.depthWrite),c.setMask(W.colorWrite);const qt=W.stencilWrite;d.setTest(qt),qt&&(d.setMask(W.stencilWriteMask),d.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),d.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Qt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?ot(r.SAMPLE_ALPHA_TO_COVERAGE):Ut(r.SAMPLE_ALPHA_TO_COVERAGE)}function vt(W){w!==W&&(W?r.frontFace(r.CW):r.frontFace(r.CCW),w=W)}function Nt(W){W!==Oy?(ot(r.CULL_FACE),W!==V&&(W===iv?r.cullFace(r.BACK):W===Py?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ut(r.CULL_FACE),V=W}function P(W){W!==J&&(I&&r.lineWidth(W),J=W)}function Qt(W,Ht,Dt){W?(ot(r.POLYGON_OFFSET_FILL),(Y!==Ht||ut!==Dt)&&(r.polygonOffset(Ht,Dt),Y=Ht,ut=Dt)):Ut(r.POLYGON_OFFSET_FILL)}function Ft(W){W?ot(r.SCISSOR_TEST):Ut(r.SCISSOR_TEST)}function ae(W){W===void 0&&(W=r.TEXTURE0+rt-1),bt!==W&&(r.activeTexture(W),bt=W)}function Lt(W,Ht,Dt){Dt===void 0&&(bt===null?Dt=r.TEXTURE0+rt-1:Dt=bt);let qt=Mt[Dt];qt===void 0&&(qt={type:void 0,texture:void 0},Mt[Dt]=qt),(qt.type!==W||qt.texture!==Ht)&&(bt!==Dt&&(r.activeTexture(Dt),bt=Dt),r.bindTexture(W,Ht||it[W]),qt.type=W,qt.texture=Ht)}function O(){const W=Mt[bt];W!==void 0&&W.type!==void 0&&(r.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function E(){try{r.compressedTexImage2D(...arguments)}catch(W){De("WebGLState:",W)}}function q(){try{r.compressedTexImage3D(...arguments)}catch(W){De("WebGLState:",W)}}function ht(){try{r.texSubImage2D(...arguments)}catch(W){De("WebGLState:",W)}}function Et(){try{r.texSubImage3D(...arguments)}catch(W){De("WebGLState:",W)}}function dt(){try{r.compressedTexSubImage2D(...arguments)}catch(W){De("WebGLState:",W)}}function te(){try{r.compressedTexSubImage3D(...arguments)}catch(W){De("WebGLState:",W)}}function Pt(){try{r.texStorage2D(...arguments)}catch(W){De("WebGLState:",W)}}function $t(){try{r.texStorage3D(...arguments)}catch(W){De("WebGLState:",W)}}function le(){try{r.texImage2D(...arguments)}catch(W){De("WebGLState:",W)}}function Tt(){try{r.texImage3D(...arguments)}catch(W){De("WebGLState:",W)}}function wt(W){ft.equals(W)===!1&&(r.scissor(W.x,W.y,W.z,W.w),ft.copy(W))}function jt(W){Rt.equals(W)===!1&&(r.viewport(W.x,W.y,W.z,W.w),Rt.copy(W))}function Wt(W,Ht){let Dt=p.get(Ht);Dt===void 0&&(Dt=new WeakMap,p.set(Ht,Dt));let qt=Dt.get(W);qt===void 0&&(qt=r.getUniformBlockIndex(Ht,W.name),Dt.set(W,qt))}function zt(W,Ht){const qt=p.get(Ht).get(W);m.get(Ht)!==qt&&(r.uniformBlockBinding(Ht,qt,W.__bindingPointIndex),m.set(Ht,qt))}function xe(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),f.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),g={},bt=null,Mt={},v={},x=new WeakMap,y=[],b=null,C=!1,M=null,_=null,z=null,U=null,N=null,B=null,L=null,D=new Fe(0,0,0),k=0,T=!1,w=null,V=null,J=null,Y=null,ut=null,ft.set(0,0,r.canvas.width,r.canvas.height),Rt.set(0,0,r.canvas.width,r.canvas.height),c.reset(),f.reset(),d.reset()}return{buffers:{color:c,depth:f,stencil:d},enable:ot,disable:Ut,bindFramebuffer:Vt,drawBuffers:It,useProgram:ve,setBlending:xt,setMaterial:gt,setFlipSided:vt,setCullFace:Nt,setLineWidth:P,setPolygonOffset:Qt,setScissorTest:Ft,activeTexture:ae,bindTexture:Lt,unbindTexture:O,compressedTexImage2D:E,compressedTexImage3D:q,texImage2D:le,texImage3D:Tt,updateUBOMapping:Wt,uniformBlockBinding:zt,texStorage2D:Pt,texStorage3D:$t,texSubImage2D:ht,texSubImage3D:Et,compressedTexSubImage2D:dt,compressedTexSubImage3D:te,scissor:wt,viewport:jt,reset:xe}}function xR(r,t,i,s,l,c,f){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new Yt,g=new WeakMap;let v;const x=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(O,E){return y?new OffscreenCanvas(O,E):eu("canvas")}function C(O,E,q){let ht=1;const Et=Lt(O);if((Et.width>q||Et.height>q)&&(ht=q/Math.max(Et.width,Et.height)),ht<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const dt=Math.floor(ht*Et.width),te=Math.floor(ht*Et.height);v===void 0&&(v=b(dt,te));const Pt=E?b(dt,te):v;return Pt.width=dt,Pt.height=te,Pt.getContext("2d").drawImage(O,0,0,dt,te),pe("WebGLRenderer: Texture has been resized from ("+Et.width+"x"+Et.height+") to ("+dt+"x"+te+")."),Pt}else return"data"in O&&pe("WebGLRenderer: Image in DataTexture is too big ("+Et.width+"x"+Et.height+")."),O;return O}function M(O){return O.generateMipmaps}function _(O){r.generateMipmap(O)}function z(O){return O.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?r.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function U(O,E,q,ht,Et=!1){if(O!==null){if(r[O]!==void 0)return r[O];pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let dt=E;if(E===r.RED&&(q===r.FLOAT&&(dt=r.R32F),q===r.HALF_FLOAT&&(dt=r.R16F),q===r.UNSIGNED_BYTE&&(dt=r.R8)),E===r.RED_INTEGER&&(q===r.UNSIGNED_BYTE&&(dt=r.R8UI),q===r.UNSIGNED_SHORT&&(dt=r.R16UI),q===r.UNSIGNED_INT&&(dt=r.R32UI),q===r.BYTE&&(dt=r.R8I),q===r.SHORT&&(dt=r.R16I),q===r.INT&&(dt=r.R32I)),E===r.RG&&(q===r.FLOAT&&(dt=r.RG32F),q===r.HALF_FLOAT&&(dt=r.RG16F),q===r.UNSIGNED_BYTE&&(dt=r.RG8)),E===r.RG_INTEGER&&(q===r.UNSIGNED_BYTE&&(dt=r.RG8UI),q===r.UNSIGNED_SHORT&&(dt=r.RG16UI),q===r.UNSIGNED_INT&&(dt=r.RG32UI),q===r.BYTE&&(dt=r.RG8I),q===r.SHORT&&(dt=r.RG16I),q===r.INT&&(dt=r.RG32I)),E===r.RGB_INTEGER&&(q===r.UNSIGNED_BYTE&&(dt=r.RGB8UI),q===r.UNSIGNED_SHORT&&(dt=r.RGB16UI),q===r.UNSIGNED_INT&&(dt=r.RGB32UI),q===r.BYTE&&(dt=r.RGB8I),q===r.SHORT&&(dt=r.RGB16I),q===r.INT&&(dt=r.RGB32I)),E===r.RGBA_INTEGER&&(q===r.UNSIGNED_BYTE&&(dt=r.RGBA8UI),q===r.UNSIGNED_SHORT&&(dt=r.RGBA16UI),q===r.UNSIGNED_INT&&(dt=r.RGBA32UI),q===r.BYTE&&(dt=r.RGBA8I),q===r.SHORT&&(dt=r.RGBA16I),q===r.INT&&(dt=r.RGBA32I)),E===r.RGB&&(q===r.UNSIGNED_INT_5_9_9_9_REV&&(dt=r.RGB9_E5),q===r.UNSIGNED_INT_10F_11F_11F_REV&&(dt=r.R11F_G11F_B10F)),E===r.RGBA){const te=Et?$c:Ue.getTransfer(ht);q===r.FLOAT&&(dt=r.RGBA32F),q===r.HALF_FLOAT&&(dt=r.RGBA16F),q===r.UNSIGNED_BYTE&&(dt=te===ke?r.SRGB8_ALPHA8:r.RGBA8),q===r.UNSIGNED_SHORT_4_4_4_4&&(dt=r.RGBA4),q===r.UNSIGNED_SHORT_5_5_5_1&&(dt=r.RGB5_A1)}return(dt===r.R16F||dt===r.R32F||dt===r.RG16F||dt===r.RG32F||dt===r.RGBA16F||dt===r.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function N(O,E){let q;return O?E===null||E===Vi||E===$o?q=r.DEPTH24_STENCIL8:E===zi?q=r.DEPTH32F_STENCIL8:E===Qo&&(q=r.DEPTH24_STENCIL8,pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Vi||E===$o?q=r.DEPTH_COMPONENT24:E===zi?q=r.DEPTH_COMPONENT32F:E===Qo&&(q=r.DEPTH_COMPONENT16),q}function B(O,E){return M(O)===!0||O.isFramebufferTexture&&O.minFilter!==Dn&&O.minFilter!==dn?Math.log2(Math.max(E.width,E.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?E.mipmaps.length:1}function L(O){const E=O.target;E.removeEventListener("dispose",L),k(E),E.isVideoTexture&&g.delete(E)}function D(O){const E=O.target;E.removeEventListener("dispose",D),w(E)}function k(O){const E=s.get(O);if(E.__webglInit===void 0)return;const q=O.source,ht=x.get(q);if(ht){const Et=ht[E.__cacheKey];Et.usedTimes--,Et.usedTimes===0&&T(O),Object.keys(ht).length===0&&x.delete(q)}s.remove(O)}function T(O){const E=s.get(O);r.deleteTexture(E.__webglTexture);const q=O.source,ht=x.get(q);delete ht[E.__cacheKey],f.memory.textures--}function w(O){const E=s.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),s.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let ht=0;ht<6;ht++){if(Array.isArray(E.__webglFramebuffer[ht]))for(let Et=0;Et<E.__webglFramebuffer[ht].length;Et++)r.deleteFramebuffer(E.__webglFramebuffer[ht][Et]);else r.deleteFramebuffer(E.__webglFramebuffer[ht]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[ht])}else{if(Array.isArray(E.__webglFramebuffer))for(let ht=0;ht<E.__webglFramebuffer.length;ht++)r.deleteFramebuffer(E.__webglFramebuffer[ht]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let ht=0;ht<E.__webglColorRenderbuffer.length;ht++)E.__webglColorRenderbuffer[ht]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[ht]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const q=O.textures;for(let ht=0,Et=q.length;ht<Et;ht++){const dt=s.get(q[ht]);dt.__webglTexture&&(r.deleteTexture(dt.__webglTexture),f.memory.textures--),s.remove(q[ht])}s.remove(O)}let V=0;function J(){V=0}function Y(){const O=V;return O>=l.maxTextures&&pe("WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+l.maxTextures),V+=1,O}function ut(O){const E=[];return E.push(O.wrapS),E.push(O.wrapT),E.push(O.wrapR||0),E.push(O.magFilter),E.push(O.minFilter),E.push(O.anisotropy),E.push(O.internalFormat),E.push(O.format),E.push(O.type),E.push(O.generateMipmaps),E.push(O.premultiplyAlpha),E.push(O.flipY),E.push(O.unpackAlignment),E.push(O.colorSpace),E.join()}function rt(O,E){const q=s.get(O);if(O.isVideoTexture&&Ft(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&q.__version!==O.version){const ht=O.image;if(ht===null)pe("WebGLRenderer: Texture marked for update but no image data found.");else if(ht.complete===!1)pe("WebGLRenderer: Texture marked for update but image is incomplete");else{it(q,O,E);return}}else O.isExternalTexture&&(q.__webglTexture=O.sourceTexture?O.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,q.__webglTexture,r.TEXTURE0+E)}function I(O,E){const q=s.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&q.__version!==O.version){it(q,O,E);return}else O.isExternalTexture&&(q.__webglTexture=O.sourceTexture?O.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,q.__webglTexture,r.TEXTURE0+E)}function H(O,E){const q=s.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&q.__version!==O.version){it(q,O,E);return}i.bindTexture(r.TEXTURE_3D,q.__webglTexture,r.TEXTURE0+E)}function tt(O,E){const q=s.get(O);if(O.isCubeDepthTexture!==!0&&O.version>0&&q.__version!==O.version){ot(q,O,E);return}i.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture,r.TEXTURE0+E)}const bt={[od]:r.REPEAT,[ga]:r.CLAMP_TO_EDGE,[ld]:r.MIRRORED_REPEAT},Mt={[Dn]:r.NEAREST,[iM]:r.NEAREST_MIPMAP_NEAREST,[Mc]:r.NEAREST_MIPMAP_LINEAR,[dn]:r.LINEAR,[mh]:r.LINEAR_MIPMAP_NEAREST,[Ds]:r.LINEAR_MIPMAP_LINEAR},F={[rM]:r.NEVER,[fM]:r.ALWAYS,[oM]:r.LESS,[ep]:r.LEQUAL,[lM]:r.EQUAL,[np]:r.GEQUAL,[cM]:r.GREATER,[uM]:r.NOTEQUAL};function $(O,E){if(E.type===zi&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===dn||E.magFilter===mh||E.magFilter===Mc||E.magFilter===Ds||E.minFilter===dn||E.minFilter===mh||E.minFilter===Mc||E.minFilter===Ds)&&pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(O,r.TEXTURE_WRAP_S,bt[E.wrapS]),r.texParameteri(O,r.TEXTURE_WRAP_T,bt[E.wrapT]),(O===r.TEXTURE_3D||O===r.TEXTURE_2D_ARRAY)&&r.texParameteri(O,r.TEXTURE_WRAP_R,bt[E.wrapR]),r.texParameteri(O,r.TEXTURE_MAG_FILTER,Mt[E.magFilter]),r.texParameteri(O,r.TEXTURE_MIN_FILTER,Mt[E.minFilter]),E.compareFunction&&(r.texParameteri(O,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(O,r.TEXTURE_COMPARE_FUNC,F[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Dn||E.minFilter!==Mc&&E.minFilter!==Ds||E.type===zi&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const q=t.get("EXT_texture_filter_anisotropic");r.texParameterf(O,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function ft(O,E){let q=!1;O.__webglInit===void 0&&(O.__webglInit=!0,E.addEventListener("dispose",L));const ht=E.source;let Et=x.get(ht);Et===void 0&&(Et={},x.set(ht,Et));const dt=ut(E);if(dt!==O.__cacheKey){Et[dt]===void 0&&(Et[dt]={texture:r.createTexture(),usedTimes:0},f.memory.textures++,q=!0),Et[dt].usedTimes++;const te=Et[O.__cacheKey];te!==void 0&&(Et[O.__cacheKey].usedTimes--,te.usedTimes===0&&T(E)),O.__cacheKey=dt,O.__webglTexture=Et[dt].texture}return q}function Rt(O,E,q){return Math.floor(Math.floor(O/q)/E)}function Xt(O,E,q,ht){const dt=O.updateRanges;if(dt.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,q,ht,E.data);else{dt.sort((Tt,wt)=>Tt.start-wt.start);let te=0;for(let Tt=1;Tt<dt.length;Tt++){const wt=dt[te],jt=dt[Tt],Wt=wt.start+wt.count,zt=Rt(jt.start,E.width,4),xe=Rt(wt.start,E.width,4);jt.start<=Wt+1&&zt===xe&&Rt(jt.start+jt.count-1,E.width,4)===zt?wt.count=Math.max(wt.count,jt.start+jt.count-wt.start):(++te,dt[te]=jt)}dt.length=te+1;const Pt=r.getParameter(r.UNPACK_ROW_LENGTH),$t=r.getParameter(r.UNPACK_SKIP_PIXELS),le=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let Tt=0,wt=dt.length;Tt<wt;Tt++){const jt=dt[Tt],Wt=Math.floor(jt.start/4),zt=Math.ceil(jt.count/4),xe=Wt%E.width,W=Math.floor(Wt/E.width),Ht=zt,Dt=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,xe),r.pixelStorei(r.UNPACK_SKIP_ROWS,W),i.texSubImage2D(r.TEXTURE_2D,0,xe,W,Ht,Dt,q,ht,E.data)}O.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Pt),r.pixelStorei(r.UNPACK_SKIP_PIXELS,$t),r.pixelStorei(r.UNPACK_SKIP_ROWS,le)}}function it(O,E,q){let ht=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ht=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ht=r.TEXTURE_3D);const Et=ft(O,E),dt=E.source;i.bindTexture(ht,O.__webglTexture,r.TEXTURE0+q);const te=s.get(dt);if(dt.version!==te.__version||Et===!0){i.activeTexture(r.TEXTURE0+q);const Pt=Ue.getPrimaries(Ue.workingColorSpace),$t=E.colorSpace===$a?null:Ue.getPrimaries(E.colorSpace),le=E.colorSpace===$a||Pt===$t?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);let Tt=C(E.image,!1,l.maxTextureSize);Tt=ae(E,Tt);const wt=c.convert(E.format,E.colorSpace),jt=c.convert(E.type);let Wt=U(E.internalFormat,wt,jt,E.colorSpace,E.isVideoTexture);$(ht,E);let zt;const xe=E.mipmaps,W=E.isVideoTexture!==!0,Ht=te.__version===void 0||Et===!0,Dt=dt.dataReady,qt=B(E,Tt);if(E.isDepthTexture)Wt=N(E.format===Us,E.type),Ht&&(W?i.texStorage2D(r.TEXTURE_2D,1,Wt,Tt.width,Tt.height):i.texImage2D(r.TEXTURE_2D,0,Wt,Tt.width,Tt.height,0,wt,jt,null));else if(E.isDataTexture)if(xe.length>0){W&&Ht&&i.texStorage2D(r.TEXTURE_2D,qt,Wt,xe[0].width,xe[0].height);for(let At=0,yt=xe.length;At<yt;At++)zt=xe[At],W?Dt&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,wt,jt,zt.data):i.texImage2D(r.TEXTURE_2D,At,Wt,zt.width,zt.height,0,wt,jt,zt.data);E.generateMipmaps=!1}else W?(Ht&&i.texStorage2D(r.TEXTURE_2D,qt,Wt,Tt.width,Tt.height),Dt&&Xt(E,Tt,wt,jt)):i.texImage2D(r.TEXTURE_2D,0,Wt,Tt.width,Tt.height,0,wt,jt,Tt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){W&&Ht&&i.texStorage3D(r.TEXTURE_2D_ARRAY,qt,Wt,xe[0].width,xe[0].height,Tt.depth);for(let At=0,yt=xe.length;At<yt;At++)if(zt=xe[At],E.format!==Ai)if(wt!==null)if(W){if(Dt)if(E.layerUpdates.size>0){const Ot=Pv(zt.width,zt.height,E.format,E.type);for(const he of E.layerUpdates){const Ie=zt.data.subarray(he*Ot/zt.data.BYTES_PER_ELEMENT,(he+1)*Ot/zt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,he,zt.width,zt.height,1,wt,Ie)}E.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,0,zt.width,zt.height,Tt.depth,wt,zt.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,At,Wt,zt.width,zt.height,Tt.depth,0,zt.data,0,0);else pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?Dt&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,0,zt.width,zt.height,Tt.depth,wt,jt,zt.data):i.texImage3D(r.TEXTURE_2D_ARRAY,At,Wt,zt.width,zt.height,Tt.depth,0,wt,jt,zt.data)}else{W&&Ht&&i.texStorage2D(r.TEXTURE_2D,qt,Wt,xe[0].width,xe[0].height);for(let At=0,yt=xe.length;At<yt;At++)zt=xe[At],E.format!==Ai?wt!==null?W?Dt&&i.compressedTexSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,wt,zt.data):i.compressedTexImage2D(r.TEXTURE_2D,At,Wt,zt.width,zt.height,0,zt.data):pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?Dt&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,wt,jt,zt.data):i.texImage2D(r.TEXTURE_2D,At,Wt,zt.width,zt.height,0,wt,jt,zt.data)}else if(E.isDataArrayTexture)if(W){if(Ht&&i.texStorage3D(r.TEXTURE_2D_ARRAY,qt,Wt,Tt.width,Tt.height,Tt.depth),Dt)if(E.layerUpdates.size>0){const At=Pv(Tt.width,Tt.height,E.format,E.type);for(const yt of E.layerUpdates){const Ot=Tt.data.subarray(yt*At/Tt.data.BYTES_PER_ELEMENT,(yt+1)*At/Tt.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,yt,Tt.width,Tt.height,1,wt,jt,Ot)}E.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Tt.width,Tt.height,Tt.depth,wt,jt,Tt.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Wt,Tt.width,Tt.height,Tt.depth,0,wt,jt,Tt.data);else if(E.isData3DTexture)W?(Ht&&i.texStorage3D(r.TEXTURE_3D,qt,Wt,Tt.width,Tt.height,Tt.depth),Dt&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Tt.width,Tt.height,Tt.depth,wt,jt,Tt.data)):i.texImage3D(r.TEXTURE_3D,0,Wt,Tt.width,Tt.height,Tt.depth,0,wt,jt,Tt.data);else if(E.isFramebufferTexture){if(Ht)if(W)i.texStorage2D(r.TEXTURE_2D,qt,Wt,Tt.width,Tt.height);else{let At=Tt.width,yt=Tt.height;for(let Ot=0;Ot<qt;Ot++)i.texImage2D(r.TEXTURE_2D,Ot,Wt,At,yt,0,wt,jt,null),At>>=1,yt>>=1}}else if(xe.length>0){if(W&&Ht){const At=Lt(xe[0]);i.texStorage2D(r.TEXTURE_2D,qt,Wt,At.width,At.height)}for(let At=0,yt=xe.length;At<yt;At++)zt=xe[At],W?Dt&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,wt,jt,zt):i.texImage2D(r.TEXTURE_2D,At,Wt,wt,jt,zt);E.generateMipmaps=!1}else if(W){if(Ht){const At=Lt(Tt);i.texStorage2D(r.TEXTURE_2D,qt,Wt,At.width,At.height)}Dt&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,wt,jt,Tt)}else i.texImage2D(r.TEXTURE_2D,0,Wt,wt,jt,Tt);M(E)&&_(ht),te.__version=dt.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function ot(O,E,q){if(E.image.length!==6)return;const ht=ft(O,E),Et=E.source;i.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+q);const dt=s.get(Et);if(Et.version!==dt.__version||ht===!0){i.activeTexture(r.TEXTURE0+q);const te=Ue.getPrimaries(Ue.workingColorSpace),Pt=E.colorSpace===$a?null:Ue.getPrimaries(E.colorSpace),$t=E.colorSpace===$a||te===Pt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);const le=E.isCompressedTexture||E.image[0].isCompressedTexture,Tt=E.image[0]&&E.image[0].isDataTexture,wt=[];for(let yt=0;yt<6;yt++)!le&&!Tt?wt[yt]=C(E.image[yt],!0,l.maxCubemapSize):wt[yt]=Tt?E.image[yt].image:E.image[yt],wt[yt]=ae(E,wt[yt]);const jt=wt[0],Wt=c.convert(E.format,E.colorSpace),zt=c.convert(E.type),xe=U(E.internalFormat,Wt,zt,E.colorSpace),W=E.isVideoTexture!==!0,Ht=dt.__version===void 0||ht===!0,Dt=Et.dataReady;let qt=B(E,jt);$(r.TEXTURE_CUBE_MAP,E);let At;if(le){W&&Ht&&i.texStorage2D(r.TEXTURE_CUBE_MAP,qt,xe,jt.width,jt.height);for(let yt=0;yt<6;yt++){At=wt[yt].mipmaps;for(let Ot=0;Ot<At.length;Ot++){const he=At[Ot];E.format!==Ai?Wt!==null?W?Dt&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot,0,0,he.width,he.height,Wt,he.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot,xe,he.width,he.height,0,he.data):pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?Dt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot,0,0,he.width,he.height,Wt,zt,he.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot,xe,he.width,he.height,0,Wt,zt,he.data)}}}else{if(At=E.mipmaps,W&&Ht){At.length>0&&qt++;const yt=Lt(wt[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,qt,xe,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(Tt){W?Dt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,wt[yt].width,wt[yt].height,Wt,zt,wt[yt].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,xe,wt[yt].width,wt[yt].height,0,Wt,zt,wt[yt].data);for(let Ot=0;Ot<At.length;Ot++){const Ie=At[Ot].image[yt].image;W?Dt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot+1,0,0,Ie.width,Ie.height,Wt,zt,Ie.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot+1,xe,Ie.width,Ie.height,0,Wt,zt,Ie.data)}}else{W?Dt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Wt,zt,wt[yt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,xe,Wt,zt,wt[yt]);for(let Ot=0;Ot<At.length;Ot++){const he=At[Ot];W?Dt&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot+1,0,0,Wt,zt,he.image[yt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Ot+1,xe,Wt,zt,he.image[yt])}}}M(E)&&_(r.TEXTURE_CUBE_MAP),dt.__version=Et.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function Ut(O,E,q,ht,Et,dt){const te=c.convert(q.format,q.colorSpace),Pt=c.convert(q.type),$t=U(q.internalFormat,te,Pt,q.colorSpace),le=s.get(E),Tt=s.get(q);if(Tt.__renderTarget=E,!le.__hasExternalTextures){const wt=Math.max(1,E.width>>dt),jt=Math.max(1,E.height>>dt);Et===r.TEXTURE_3D||Et===r.TEXTURE_2D_ARRAY?i.texImage3D(Et,dt,$t,wt,jt,E.depth,0,te,Pt,null):i.texImage2D(Et,dt,$t,wt,jt,0,te,Pt,null)}i.bindFramebuffer(r.FRAMEBUFFER,O),Qt(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ht,Et,Tt.__webglTexture,0,P(E)):(Et===r.TEXTURE_2D||Et>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Et<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ht,Et,Tt.__webglTexture,dt),i.bindFramebuffer(r.FRAMEBUFFER,null)}function Vt(O,E,q){if(r.bindRenderbuffer(r.RENDERBUFFER,O),E.depthBuffer){const ht=E.depthTexture,Et=ht&&ht.isDepthTexture?ht.type:null,dt=N(E.stencilBuffer,Et),te=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;Qt(E)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(E),dt,E.width,E.height):q?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(E),dt,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,dt,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,te,r.RENDERBUFFER,O)}else{const ht=E.textures;for(let Et=0;Et<ht.length;Et++){const dt=ht[Et],te=c.convert(dt.format,dt.colorSpace),Pt=c.convert(dt.type),$t=U(dt.internalFormat,te,Pt,dt.colorSpace);Qt(E)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(E),$t,E.width,E.height):q?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(E),$t,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,$t,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function It(O,E,q){const ht=E.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,O),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Et=s.get(E.depthTexture);if(Et.__renderTarget=E,(!Et.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),ht){if(Et.__webglInit===void 0&&(Et.__webglInit=!0,E.depthTexture.addEventListener("dispose",L)),Et.__webglTexture===void 0){Et.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,Et.__webglTexture),$(r.TEXTURE_CUBE_MAP,E.depthTexture);const le=c.convert(E.depthTexture.format),Tt=c.convert(E.depthTexture.type);let wt;E.depthTexture.format===Sa?wt=r.DEPTH_COMPONENT24:E.depthTexture.format===Us&&(wt=r.DEPTH24_STENCIL8);for(let jt=0;jt<6;jt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+jt,0,wt,E.width,E.height,0,le,Tt,null)}}else rt(E.depthTexture,0);const dt=Et.__webglTexture,te=P(E),Pt=ht?r.TEXTURE_CUBE_MAP_POSITIVE_X+q:r.TEXTURE_2D,$t=E.depthTexture.format===Us?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===Sa)Qt(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$t,Pt,dt,0,te):r.framebufferTexture2D(r.FRAMEBUFFER,$t,Pt,dt,0);else if(E.depthTexture.format===Us)Qt(E)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$t,Pt,dt,0,te):r.framebufferTexture2D(r.FRAMEBUFFER,$t,Pt,dt,0);else throw new Error("Unknown depthTexture format")}function ve(O){const E=s.get(O),q=O.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==O.depthTexture){const ht=O.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),ht){const Et=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,ht.removeEventListener("dispose",Et)};ht.addEventListener("dispose",Et),E.__depthDisposeCallback=Et}E.__boundDepthTexture=ht}if(O.depthTexture&&!E.__autoAllocateDepthBuffer)if(q)for(let ht=0;ht<6;ht++)It(E.__webglFramebuffer[ht],O,ht);else{const ht=O.texture.mipmaps;ht&&ht.length>0?It(E.__webglFramebuffer[0],O,0):It(E.__webglFramebuffer,O,0)}else if(q){E.__webglDepthbuffer=[];for(let ht=0;ht<6;ht++)if(i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[ht]),E.__webglDepthbuffer[ht]===void 0)E.__webglDepthbuffer[ht]=r.createRenderbuffer(),Vt(E.__webglDepthbuffer[ht],O,!1);else{const Et=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,dt=E.__webglDepthbuffer[ht];r.bindRenderbuffer(r.RENDERBUFFER,dt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Et,r.RENDERBUFFER,dt)}}else{const ht=O.texture.mipmaps;if(ht&&ht.length>0?i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),Vt(E.__webglDepthbuffer,O,!1);else{const Et=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,dt=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,dt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Et,r.RENDERBUFFER,dt)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function me(O,E,q){const ht=s.get(O);E!==void 0&&Ut(ht.__webglFramebuffer,O,O.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),q!==void 0&&ve(O)}function fe(O){const E=O.texture,q=s.get(O),ht=s.get(E);O.addEventListener("dispose",D);const Et=O.textures,dt=O.isWebGLCubeRenderTarget===!0,te=Et.length>1;if(te||(ht.__webglTexture===void 0&&(ht.__webglTexture=r.createTexture()),ht.__version=E.version,f.memory.textures++),dt){q.__webglFramebuffer=[];for(let Pt=0;Pt<6;Pt++)if(E.mipmaps&&E.mipmaps.length>0){q.__webglFramebuffer[Pt]=[];for(let $t=0;$t<E.mipmaps.length;$t++)q.__webglFramebuffer[Pt][$t]=r.createFramebuffer()}else q.__webglFramebuffer[Pt]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){q.__webglFramebuffer=[];for(let Pt=0;Pt<E.mipmaps.length;Pt++)q.__webglFramebuffer[Pt]=r.createFramebuffer()}else q.__webglFramebuffer=r.createFramebuffer();if(te)for(let Pt=0,$t=Et.length;Pt<$t;Pt++){const le=s.get(Et[Pt]);le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture(),f.memory.textures++)}if(O.samples>0&&Qt(O)===!1){q.__webglMultisampledFramebuffer=r.createFramebuffer(),q.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let Pt=0;Pt<Et.length;Pt++){const $t=Et[Pt];q.__webglColorRenderbuffer[Pt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,q.__webglColorRenderbuffer[Pt]);const le=c.convert($t.format,$t.colorSpace),Tt=c.convert($t.type),wt=U($t.internalFormat,le,Tt,$t.colorSpace,O.isXRRenderTarget===!0),jt=P(O);r.renderbufferStorageMultisample(r.RENDERBUFFER,jt,wt,O.width,O.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pt,r.RENDERBUFFER,q.__webglColorRenderbuffer[Pt])}r.bindRenderbuffer(r.RENDERBUFFER,null),O.depthBuffer&&(q.__webglDepthRenderbuffer=r.createRenderbuffer(),Vt(q.__webglDepthRenderbuffer,O,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(dt){i.bindTexture(r.TEXTURE_CUBE_MAP,ht.__webglTexture),$(r.TEXTURE_CUBE_MAP,E);for(let Pt=0;Pt<6;Pt++)if(E.mipmaps&&E.mipmaps.length>0)for(let $t=0;$t<E.mipmaps.length;$t++)Ut(q.__webglFramebuffer[Pt][$t],O,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pt,$t);else Ut(q.__webglFramebuffer[Pt],O,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pt,0);M(E)&&_(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(te){for(let Pt=0,$t=Et.length;Pt<$t;Pt++){const le=Et[Pt],Tt=s.get(le);let wt=r.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(wt=O.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(wt,Tt.__webglTexture),$(wt,le),Ut(q.__webglFramebuffer,O,le,r.COLOR_ATTACHMENT0+Pt,wt,0),M(le)&&_(wt)}i.unbindTexture()}else{let Pt=r.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Pt=O.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Pt,ht.__webglTexture),$(Pt,E),E.mipmaps&&E.mipmaps.length>0)for(let $t=0;$t<E.mipmaps.length;$t++)Ut(q.__webglFramebuffer[$t],O,E,r.COLOR_ATTACHMENT0,Pt,$t);else Ut(q.__webglFramebuffer,O,E,r.COLOR_ATTACHMENT0,Pt,0);M(E)&&_(Pt),i.unbindTexture()}O.depthBuffer&&ve(O)}function xt(O){const E=O.textures;for(let q=0,ht=E.length;q<ht;q++){const Et=E[q];if(M(Et)){const dt=z(O),te=s.get(Et).__webglTexture;i.bindTexture(dt,te),_(dt),i.unbindTexture()}}}const gt=[],vt=[];function Nt(O){if(O.samples>0){if(Qt(O)===!1){const E=O.textures,q=O.width,ht=O.height;let Et=r.COLOR_BUFFER_BIT;const dt=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,te=s.get(O),Pt=E.length>1;if(Pt)for(let le=0;le<E.length;le++)i.bindFramebuffer(r.FRAMEBUFFER,te.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,te.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,te.__webglMultisampledFramebuffer);const $t=O.texture.mipmaps;$t&&$t.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,te.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,te.__webglFramebuffer);for(let le=0;le<E.length;le++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(Et|=r.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(Et|=r.STENCIL_BUFFER_BIT)),Pt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,te.__webglColorRenderbuffer[le]);const Tt=s.get(E[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Tt,0)}r.blitFramebuffer(0,0,q,ht,0,0,q,ht,Et,r.NEAREST),m===!0&&(gt.length=0,vt.length=0,gt.push(r.COLOR_ATTACHMENT0+le),O.depthBuffer&&O.resolveDepthBuffer===!1&&(gt.push(dt),vt.push(dt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,vt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,gt))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Pt)for(let le=0;le<E.length;le++){i.bindFramebuffer(r.FRAMEBUFFER,te.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,te.__webglColorRenderbuffer[le]);const Tt=s.get(E[le]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,te.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,Tt,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,te.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&m){const E=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function P(O){return Math.min(l.maxSamples,O.samples)}function Qt(O){const E=s.get(O);return O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ft(O){const E=f.render.frame;g.get(O)!==E&&(g.set(O,E),O.update())}function ae(O,E){const q=O.colorSpace,ht=O.format,Et=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||q!==Fr&&q!==$a&&(Ue.getTransfer(q)===ke?(ht!==Ai||Et!==ii)&&pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):De("WebGLTextures: Unsupported texture color space:",q)),E}function Lt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(p.width=O.naturalWidth||O.width,p.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(p.width=O.displayWidth,p.height=O.displayHeight):(p.width=O.width,p.height=O.height),p}this.allocateTextureUnit=Y,this.resetTextureUnits=J,this.setTexture2D=rt,this.setTexture2DArray=I,this.setTexture3D=H,this.setTextureCube=tt,this.rebindTextures=me,this.setupRenderTarget=fe,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=Ut,this.useMultisampledRTT=Qt,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function SR(r,t){function i(s,l=$a){let c;const f=Ue.getTransfer(l);if(s===ii)return r.UNSIGNED_BYTE;if(s===Kd)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Jd)return r.UNSIGNED_SHORT_5_5_5_1;if(s===M_)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===E_)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===S_)return r.BYTE;if(s===y_)return r.SHORT;if(s===Qo)return r.UNSIGNED_SHORT;if(s===Zd)return r.INT;if(s===Vi)return r.UNSIGNED_INT;if(s===zi)return r.FLOAT;if(s===xa)return r.HALF_FLOAT;if(s===b_)return r.ALPHA;if(s===T_)return r.RGB;if(s===Ai)return r.RGBA;if(s===Sa)return r.DEPTH_COMPONENT;if(s===Us)return r.DEPTH_STENCIL;if(s===A_)return r.RED;if(s===Qd)return r.RED_INTEGER;if(s===zr)return r.RG;if(s===$d)return r.RG_INTEGER;if(s===tp)return r.RGBA_INTEGER;if(s===Yc||s===jc||s===Zc||s===Kc)if(f===ke)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===Yc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===jc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Zc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Kc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===Yc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===jc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Zc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Kc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===cd||s===ud||s===fd||s===hd)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===cd)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===ud)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===fd)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===hd)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===dd||s===pd||s===md||s===gd||s===vd||s===_d||s===xd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(s===dd||s===pd)return f===ke?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===md)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===gd)return c.COMPRESSED_R11_EAC;if(s===vd)return c.COMPRESSED_SIGNED_R11_EAC;if(s===_d)return c.COMPRESSED_RG11_EAC;if(s===xd)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===Sd||s===yd||s===Md||s===Ed||s===bd||s===Td||s===Ad||s===Rd||s===Cd||s===wd||s===Dd||s===Ud||s===Nd||s===Ld)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(s===Sd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===yd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Md)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Ed)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===bd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Td)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Ad)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Rd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Cd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===wd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Dd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Ud)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Nd)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Ld)return f===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Od||s===Pd||s===zd)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(s===Od)return f===ke?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Pd)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===zd)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Fd||s===Bd||s===Id||s===Hd)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(s===Fd)return c.COMPRESSED_RED_RGTC1_EXT;if(s===Bd)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Id)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Hd)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===$o?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const yR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MR=`
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

}`;class ER{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const s=new B_(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,s=new ki({vertexShader:yR,fragmentShader:MR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Ci(new ul(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class bR extends Hr{constructor(t,i){super();const s=this;let l=null,c=1,f=null,d="local-floor",m=1,p=null,g=null,v=null,x=null,y=null,b=null;const C=typeof XRWebGLBinding<"u",M=new ER,_={},z=i.getContextAttributes();let U=null,N=null;const B=[],L=[],D=new Yt;let k=null;const T=new mi;T.viewport=new an;const w=new mi;w.viewport=new an;const V=[T,w],J=new OE;let Y=null,ut=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(it){let ot=B[it];return ot===void 0&&(ot=new Bh,B[it]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(it){let ot=B[it];return ot===void 0&&(ot=new Bh,B[it]=ot),ot.getGripSpace()},this.getHand=function(it){let ot=B[it];return ot===void 0&&(ot=new Bh,B[it]=ot),ot.getHandSpace()};function rt(it){const ot=L.indexOf(it.inputSource);if(ot===-1)return;const Ut=B[ot];Ut!==void 0&&(Ut.update(it.inputSource,it.frame,p||f),Ut.dispatchEvent({type:it.type,data:it.inputSource}))}function I(){l.removeEventListener("select",rt),l.removeEventListener("selectstart",rt),l.removeEventListener("selectend",rt),l.removeEventListener("squeeze",rt),l.removeEventListener("squeezestart",rt),l.removeEventListener("squeezeend",rt),l.removeEventListener("end",I),l.removeEventListener("inputsourceschange",H);for(let it=0;it<B.length;it++){const ot=L[it];ot!==null&&(L[it]=null,B[it].disconnect(ot))}Y=null,ut=null,M.reset();for(const it in _)delete _[it];t.setRenderTarget(U),y=null,x=null,v=null,l=null,N=null,Xt.stop(),s.isPresenting=!1,t.setPixelRatio(k),t.setSize(D.width,D.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(it){c=it,s.isPresenting===!0&&pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(it){d=it,s.isPresenting===!0&&pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||f},this.setReferenceSpace=function(it){p=it},this.getBaseLayer=function(){return x!==null?x:y},this.getBinding=function(){return v===null&&C&&(v=new XRWebGLBinding(l,i)),v},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function(it){if(l=it,l!==null){if(U=t.getRenderTarget(),l.addEventListener("select",rt),l.addEventListener("selectstart",rt),l.addEventListener("selectend",rt),l.addEventListener("squeeze",rt),l.addEventListener("squeezestart",rt),l.addEventListener("squeezeend",rt),l.addEventListener("end",I),l.addEventListener("inputsourceschange",H),z.xrCompatible!==!0&&await i.makeXRCompatible(),k=t.getPixelRatio(),t.getSize(D),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ut=null,Vt=null,It=null;z.depth&&(It=z.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Ut=z.stencil?Us:Sa,Vt=z.stencil?$o:Vi);const ve={colorFormat:i.RGBA8,depthFormat:It,scaleFactor:c};v=this.getBinding(),x=v.createProjectionLayer(ve),l.updateRenderState({layers:[x]}),t.setPixelRatio(1),t.setSize(x.textureWidth,x.textureHeight,!1),N=new Ii(x.textureWidth,x.textureHeight,{format:Ai,type:ii,depthTexture:new el(x.textureWidth,x.textureHeight,Vt,void 0,void 0,void 0,void 0,void 0,void 0,Ut),stencilBuffer:z.stencil,colorSpace:t.outputColorSpace,samples:z.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}else{const Ut={antialias:z.antialias,alpha:!0,depth:z.depth,stencil:z.stencil,framebufferScaleFactor:c};y=new XRWebGLLayer(l,i,Ut),l.updateRenderState({baseLayer:y}),t.setPixelRatio(1),t.setSize(y.framebufferWidth,y.framebufferHeight,!1),N=new Ii(y.framebufferWidth,y.framebufferHeight,{format:Ai,type:ii,colorSpace:t.outputColorSpace,stencilBuffer:z.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}N.isXRRenderTarget=!0,this.setFoveation(m),p=null,f=await l.requestReferenceSpace(d),Xt.setContext(l),Xt.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function H(it){for(let ot=0;ot<it.removed.length;ot++){const Ut=it.removed[ot],Vt=L.indexOf(Ut);Vt>=0&&(L[Vt]=null,B[Vt].disconnect(Ut))}for(let ot=0;ot<it.added.length;ot++){const Ut=it.added[ot];let Vt=L.indexOf(Ut);if(Vt===-1){for(let ve=0;ve<B.length;ve++)if(ve>=L.length){L.push(Ut),Vt=ve;break}else if(L[ve]===null){L[ve]=Ut,Vt=ve;break}if(Vt===-1)break}const It=B[Vt];It&&It.connect(Ut)}}const tt=new K,bt=new K;function Mt(it,ot,Ut){tt.setFromMatrixPosition(ot.matrixWorld),bt.setFromMatrixPosition(Ut.matrixWorld);const Vt=tt.distanceTo(bt),It=ot.projectionMatrix.elements,ve=Ut.projectionMatrix.elements,me=It[14]/(It[10]-1),fe=It[14]/(It[10]+1),xt=(It[9]+1)/It[5],gt=(It[9]-1)/It[5],vt=(It[8]-1)/It[0],Nt=(ve[8]+1)/ve[0],P=me*vt,Qt=me*Nt,Ft=Vt/(-vt+Nt),ae=Ft*-vt;if(ot.matrixWorld.decompose(it.position,it.quaternion,it.scale),it.translateX(ae),it.translateZ(Ft),it.matrixWorld.compose(it.position,it.quaternion,it.scale),it.matrixWorldInverse.copy(it.matrixWorld).invert(),It[10]===-1)it.projectionMatrix.copy(ot.projectionMatrix),it.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const Lt=me+Ft,O=fe+Ft,E=P-ae,q=Qt+(Vt-ae),ht=xt*fe/O*Lt,Et=gt*fe/O*Lt;it.projectionMatrix.makePerspective(E,q,ht,Et,Lt,O),it.projectionMatrixInverse.copy(it.projectionMatrix).invert()}}function F(it,ot){ot===null?it.matrixWorld.copy(it.matrix):it.matrixWorld.multiplyMatrices(ot.matrixWorld,it.matrix),it.matrixWorldInverse.copy(it.matrixWorld).invert()}this.updateCamera=function(it){if(l===null)return;let ot=it.near,Ut=it.far;M.texture!==null&&(M.depthNear>0&&(ot=M.depthNear),M.depthFar>0&&(Ut=M.depthFar)),J.near=w.near=T.near=ot,J.far=w.far=T.far=Ut,(Y!==J.near||ut!==J.far)&&(l.updateRenderState({depthNear:J.near,depthFar:J.far}),Y=J.near,ut=J.far),J.layers.mask=it.layers.mask|6,T.layers.mask=J.layers.mask&3,w.layers.mask=J.layers.mask&5;const Vt=it.parent,It=J.cameras;F(J,Vt);for(let ve=0;ve<It.length;ve++)F(It[ve],Vt);It.length===2?Mt(J,T,w):J.projectionMatrix.copy(T.projectionMatrix),$(it,J,Vt)};function $(it,ot,Ut){Ut===null?it.matrix.copy(ot.matrixWorld):(it.matrix.copy(Ut.matrixWorld),it.matrix.invert(),it.matrix.multiply(ot.matrixWorld)),it.matrix.decompose(it.position,it.quaternion,it.scale),it.updateMatrixWorld(!0),it.projectionMatrix.copy(ot.projectionMatrix),it.projectionMatrixInverse.copy(ot.projectionMatrixInverse),it.isPerspectiveCamera&&(it.fov=Vd*2*Math.atan(1/it.projectionMatrix.elements[5]),it.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(x===null&&y===null))return m},this.setFoveation=function(it){m=it,x!==null&&(x.fixedFoveation=it),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=it)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(J)},this.getCameraTexture=function(it){return _[it]};let ft=null;function Rt(it,ot){if(g=ot.getViewerPose(p||f),b=ot,g!==null){const Ut=g.views;y!==null&&(t.setRenderTargetFramebuffer(N,y.framebuffer),t.setRenderTarget(N));let Vt=!1;Ut.length!==J.cameras.length&&(J.cameras.length=0,Vt=!0);for(let fe=0;fe<Ut.length;fe++){const xt=Ut[fe];let gt=null;if(y!==null)gt=y.getViewport(xt);else{const Nt=v.getViewSubImage(x,xt);gt=Nt.viewport,fe===0&&(t.setRenderTargetTextures(N,Nt.colorTexture,Nt.depthStencilTexture),t.setRenderTarget(N))}let vt=V[fe];vt===void 0&&(vt=new mi,vt.layers.enable(fe),vt.viewport=new an,V[fe]=vt),vt.matrix.fromArray(xt.transform.matrix),vt.matrix.decompose(vt.position,vt.quaternion,vt.scale),vt.projectionMatrix.fromArray(xt.projectionMatrix),vt.projectionMatrixInverse.copy(vt.projectionMatrix).invert(),vt.viewport.set(gt.x,gt.y,gt.width,gt.height),fe===0&&(J.matrix.copy(vt.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),Vt===!0&&J.cameras.push(vt)}const It=l.enabledFeatures;if(It&&It.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){v=s.getBinding();const fe=v.getDepthInformation(Ut[0]);fe&&fe.isValid&&fe.texture&&M.init(fe,l.renderState)}if(It&&It.includes("camera-access")&&C){t.state.unbindTexture(),v=s.getBinding();for(let fe=0;fe<Ut.length;fe++){const xt=Ut[fe].camera;if(xt){let gt=_[xt];gt||(gt=new B_,_[xt]=gt);const vt=v.getCameraImage(xt);gt.sourceTexture=vt}}}}for(let Ut=0;Ut<B.length;Ut++){const Vt=L[Ut],It=B[Ut];Vt!==null&&It!==void 0&&It.update(Vt,ot,p||f)}ft&&ft(it,ot),ot.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:ot}),b=null}const Xt=new Z_;Xt.setAnimationLoop(Rt),this.setAnimationLoop=function(it){ft=it},this.dispose=function(){}}}const As=new Gi,TR=new tn;function AR(r,t){function i(M,_){M.matrixAutoUpdate===!0&&M.updateMatrix(),_.value.copy(M.matrix)}function s(M,_){_.color.getRGB(M.fogColor.value,O_(r)),_.isFog?(M.fogNear.value=_.near,M.fogFar.value=_.far):_.isFogExp2&&(M.fogDensity.value=_.density)}function l(M,_,z,U,N){_.isMeshBasicMaterial||_.isMeshLambertMaterial?c(M,_):_.isMeshToonMaterial?(c(M,_),v(M,_)):_.isMeshPhongMaterial?(c(M,_),g(M,_)):_.isMeshStandardMaterial?(c(M,_),x(M,_),_.isMeshPhysicalMaterial&&y(M,_,N)):_.isMeshMatcapMaterial?(c(M,_),b(M,_)):_.isMeshDepthMaterial?c(M,_):_.isMeshDistanceMaterial?(c(M,_),C(M,_)):_.isMeshNormalMaterial?c(M,_):_.isLineBasicMaterial?(f(M,_),_.isLineDashedMaterial&&d(M,_)):_.isPointsMaterial?m(M,_,z,U):_.isSpriteMaterial?p(M,_):_.isShadowMaterial?(M.color.value.copy(_.color),M.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function c(M,_){M.opacity.value=_.opacity,_.color&&M.diffuse.value.copy(_.color),_.emissive&&M.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(M.map.value=_.map,i(_.map,M.mapTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.bumpMap&&(M.bumpMap.value=_.bumpMap,i(_.bumpMap,M.bumpMapTransform),M.bumpScale.value=_.bumpScale,_.side===Yn&&(M.bumpScale.value*=-1)),_.normalMap&&(M.normalMap.value=_.normalMap,i(_.normalMap,M.normalMapTransform),M.normalScale.value.copy(_.normalScale),_.side===Yn&&M.normalScale.value.negate()),_.displacementMap&&(M.displacementMap.value=_.displacementMap,i(_.displacementMap,M.displacementMapTransform),M.displacementScale.value=_.displacementScale,M.displacementBias.value=_.displacementBias),_.emissiveMap&&(M.emissiveMap.value=_.emissiveMap,i(_.emissiveMap,M.emissiveMapTransform)),_.specularMap&&(M.specularMap.value=_.specularMap,i(_.specularMap,M.specularMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest);const z=t.get(_),U=z.envMap,N=z.envMapRotation;U&&(M.envMap.value=U,As.copy(N),As.x*=-1,As.y*=-1,As.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(As.y*=-1,As.z*=-1),M.envMapRotation.value.setFromMatrix4(TR.makeRotationFromEuler(As)),M.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=_.reflectivity,M.ior.value=_.ior,M.refractionRatio.value=_.refractionRatio),_.lightMap&&(M.lightMap.value=_.lightMap,M.lightMapIntensity.value=_.lightMapIntensity,i(_.lightMap,M.lightMapTransform)),_.aoMap&&(M.aoMap.value=_.aoMap,M.aoMapIntensity.value=_.aoMapIntensity,i(_.aoMap,M.aoMapTransform))}function f(M,_){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,_.map&&(M.map.value=_.map,i(_.map,M.mapTransform))}function d(M,_){M.dashSize.value=_.dashSize,M.totalSize.value=_.dashSize+_.gapSize,M.scale.value=_.scale}function m(M,_,z,U){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,M.size.value=_.size*z,M.scale.value=U*.5,_.map&&(M.map.value=_.map,i(_.map,M.uvTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest)}function p(M,_){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,M.rotation.value=_.rotation,_.map&&(M.map.value=_.map,i(_.map,M.mapTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest)}function g(M,_){M.specular.value.copy(_.specular),M.shininess.value=Math.max(_.shininess,1e-4)}function v(M,_){_.gradientMap&&(M.gradientMap.value=_.gradientMap)}function x(M,_){M.metalness.value=_.metalness,_.metalnessMap&&(M.metalnessMap.value=_.metalnessMap,i(_.metalnessMap,M.metalnessMapTransform)),M.roughness.value=_.roughness,_.roughnessMap&&(M.roughnessMap.value=_.roughnessMap,i(_.roughnessMap,M.roughnessMapTransform)),_.envMap&&(M.envMapIntensity.value=_.envMapIntensity)}function y(M,_,z){M.ior.value=_.ior,_.sheen>0&&(M.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),M.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(M.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,M.sheenColorMapTransform)),_.sheenRoughnessMap&&(M.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,M.sheenRoughnessMapTransform))),_.clearcoat>0&&(M.clearcoat.value=_.clearcoat,M.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(M.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,M.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(M.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Yn&&M.clearcoatNormalScale.value.negate())),_.dispersion>0&&(M.dispersion.value=_.dispersion),_.iridescence>0&&(M.iridescence.value=_.iridescence,M.iridescenceIOR.value=_.iridescenceIOR,M.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(M.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,M.iridescenceMapTransform)),_.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),_.transmission>0&&(M.transmission.value=_.transmission,M.transmissionSamplerMap.value=z.texture,M.transmissionSamplerSize.value.set(z.width,z.height),_.transmissionMap&&(M.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,M.transmissionMapTransform)),M.thickness.value=_.thickness,_.thicknessMap&&(M.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=_.attenuationDistance,M.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(M.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(M.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=_.specularIntensity,M.specularColor.value.copy(_.specularColor),_.specularColorMap&&(M.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,M.specularColorMapTransform)),_.specularIntensityMap&&(M.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,M.specularIntensityMapTransform))}function b(M,_){_.matcap&&(M.matcap.value=_.matcap)}function C(M,_){const z=t.get(_).light;M.referencePosition.value.setFromMatrixPosition(z.matrixWorld),M.nearDistance.value=z.shadow.camera.near,M.farDistance.value=z.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function RR(r,t,i,s){let l={},c={},f=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(z,U){const N=U.program;s.uniformBlockBinding(z,N)}function p(z,U){let N=l[z.id];N===void 0&&(b(z),N=g(z),l[z.id]=N,z.addEventListener("dispose",M));const B=U.program;s.updateUBOMapping(z,B);const L=t.render.frame;c[z.id]!==L&&(x(z),c[z.id]=L)}function g(z){const U=v();z.__bindingPointIndex=U;const N=r.createBuffer(),B=z.__size,L=z.usage;return r.bindBuffer(r.UNIFORM_BUFFER,N),r.bufferData(r.UNIFORM_BUFFER,B,L),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,U,N),N}function v(){for(let z=0;z<d;z++)if(f.indexOf(z)===-1)return f.push(z),z;return De("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(z){const U=l[z.id],N=z.uniforms,B=z.__cache;r.bindBuffer(r.UNIFORM_BUFFER,U);for(let L=0,D=N.length;L<D;L++){const k=Array.isArray(N[L])?N[L]:[N[L]];for(let T=0,w=k.length;T<w;T++){const V=k[T];if(y(V,L,T,B)===!0){const J=V.__offset,Y=Array.isArray(V.value)?V.value:[V.value];let ut=0;for(let rt=0;rt<Y.length;rt++){const I=Y[rt],H=C(I);typeof I=="number"||typeof I=="boolean"?(V.__data[0]=I,r.bufferSubData(r.UNIFORM_BUFFER,J+ut,V.__data)):I.isMatrix3?(V.__data[0]=I.elements[0],V.__data[1]=I.elements[1],V.__data[2]=I.elements[2],V.__data[3]=0,V.__data[4]=I.elements[3],V.__data[5]=I.elements[4],V.__data[6]=I.elements[5],V.__data[7]=0,V.__data[8]=I.elements[6],V.__data[9]=I.elements[7],V.__data[10]=I.elements[8],V.__data[11]=0):(I.toArray(V.__data,ut),ut+=H.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,J,V.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function y(z,U,N,B){const L=z.value,D=U+"_"+N;if(B[D]===void 0)return typeof L=="number"||typeof L=="boolean"?B[D]=L:B[D]=L.clone(),!0;{const k=B[D];if(typeof L=="number"||typeof L=="boolean"){if(k!==L)return B[D]=L,!0}else if(k.equals(L)===!1)return k.copy(L),!0}return!1}function b(z){const U=z.uniforms;let N=0;const B=16;for(let D=0,k=U.length;D<k;D++){const T=Array.isArray(U[D])?U[D]:[U[D]];for(let w=0,V=T.length;w<V;w++){const J=T[w],Y=Array.isArray(J.value)?J.value:[J.value];for(let ut=0,rt=Y.length;ut<rt;ut++){const I=Y[ut],H=C(I),tt=N%B,bt=tt%H.boundary,Mt=tt+bt;N+=bt,Mt!==0&&B-Mt<H.storage&&(N+=B-Mt),J.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),J.__offset=N,N+=H.storage}}}const L=N%B;return L>0&&(N+=B-L),z.__size=N,z.__cache={},this}function C(z){const U={boundary:0,storage:0};return typeof z=="number"||typeof z=="boolean"?(U.boundary=4,U.storage=4):z.isVector2?(U.boundary=8,U.storage=8):z.isVector3||z.isColor?(U.boundary=16,U.storage=12):z.isVector4?(U.boundary=16,U.storage=16):z.isMatrix3?(U.boundary=48,U.storage=48):z.isMatrix4?(U.boundary=64,U.storage=64):z.isTexture?pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):pe("WebGLRenderer: Unsupported uniform value type.",z),U}function M(z){const U=z.target;U.removeEventListener("dispose",M);const N=f.indexOf(U.__bindingPointIndex);f.splice(N,1),r.deleteBuffer(l[U.id]),delete l[U.id],delete c[U.id]}function _(){for(const z in l)r.deleteBuffer(l[z]);f=[],l={},c={}}return{bind:m,update:p,dispose:_}}const CR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Oi=null;function wR(){return Oi===null&&(Oi=new HM(CR,16,16,zr,xa),Oi.name="DFG_LUT",Oi.minFilter=dn,Oi.magFilter=dn,Oi.wrapS=ga,Oi.wrapT=ga,Oi.generateMipmaps=!1,Oi.needsUpdate=!0),Oi}class DR{constructor(t={}){const{canvas:i=hM(),context:s=null,depth:l=!0,stencil:c=!1,alpha:f=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:x=!1,outputBufferType:y=ii}=t;this.isWebGLRenderer=!0;let b;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");b=s.getContextAttributes().alpha}else b=f;const C=y,M=new Set([tp,$d,Qd]),_=new Set([ii,Vi,Qo,$o,Kd,Jd]),z=new Uint32Array(4),U=new Int32Array(4);let N=null,B=null;const L=[],D=[];let k=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let w=!1;this._outputColorSpace=qn;let V=0,J=0,Y=null,ut=-1,rt=null;const I=new an,H=new an;let tt=null;const bt=new Fe(0);let Mt=0,F=i.width,$=i.height,ft=1,Rt=null,Xt=null;const it=new an(0,0,F,$),ot=new an(0,0,F,$);let Ut=!1;const Vt=new rp;let It=!1,ve=!1;const me=new tn,fe=new K,xt=new an,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let vt=!1;function Nt(){return Y===null?ft:1}let P=s;function Qt(R,j){return i.getContext(R,j)}try{const R={alpha:!0,depth:l,stencil:c,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${jd}`),i.addEventListener("webglcontextlost",he,!1),i.addEventListener("webglcontextrestored",Ie,!1),i.addEventListener("webglcontextcreationerror",we,!1),P===null){const j="webgl2";if(P=Qt(j,R),P===null)throw Qt(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw De("WebGLRenderer: "+R.message),R}let Ft,ae,Lt,O,E,q,ht,Et,dt,te,Pt,$t,le,Tt,wt,jt,Wt,zt,xe,W,Ht,Dt,qt,At;function yt(){Ft=new w1(P),Ft.init(),Dt=new SR(P,Ft),ae=new S1(P,Ft,t,Dt),Lt=new _R(P,Ft),ae.reversedDepthBuffer&&x&&Lt.buffers.depth.setReversed(!0),O=new N1(P),E=new iR,q=new xR(P,Ft,Lt,E,ae,Dt,O),ht=new M1(T),Et=new C1(T),dt=new zE(P),qt=new _1(P,dt),te=new D1(P,dt,O,qt),Pt=new O1(P,te,dt,O),xe=new L1(P,ae,q),jt=new y1(E),$t=new nR(T,ht,Et,Ft,ae,qt,jt),le=new AR(T,E),Tt=new sR,wt=new fR(Ft),zt=new v1(T,ht,Et,Lt,Pt,b,m),Wt=new gR(T,Pt,ae),At=new RR(P,O,ae,Lt),W=new x1(P,Ft,O),Ht=new U1(P,Ft,O),O.programs=$t.programs,T.capabilities=ae,T.extensions=Ft,T.properties=E,T.renderLists=Tt,T.shadowMap=Wt,T.state=Lt,T.info=O}yt(),C!==ii&&(k=new z1(C,i.width,i.height,l,c));const Ot=new bR(T,P);this.xr=Ot,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const R=Ft.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Ft.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ft},this.setPixelRatio=function(R){R!==void 0&&(ft=R,this.setSize(F,$,!1))},this.getSize=function(R){return R.set(F,$)},this.setSize=function(R,j,lt=!0){if(Ot.isPresenting){pe("WebGLRenderer: Can't change size while VR device is presenting.");return}F=R,$=j,i.width=Math.floor(R*ft),i.height=Math.floor(j*ft),lt===!0&&(i.style.width=R+"px",i.style.height=j+"px"),k!==null&&k.setSize(i.width,i.height),this.setViewport(0,0,R,j)},this.getDrawingBufferSize=function(R){return R.set(F*ft,$*ft).floor()},this.setDrawingBufferSize=function(R,j,lt){F=R,$=j,ft=lt,i.width=Math.floor(R*lt),i.height=Math.floor(j*lt),this.setViewport(0,0,R,j)},this.setEffects=function(R){if(C===ii){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let j=0;j<R.length;j++)if(R[j].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(I)},this.getViewport=function(R){return R.copy(it)},this.setViewport=function(R,j,lt,at){R.isVector4?it.set(R.x,R.y,R.z,R.w):it.set(R,j,lt,at),Lt.viewport(I.copy(it).multiplyScalar(ft).round())},this.getScissor=function(R){return R.copy(ot)},this.setScissor=function(R,j,lt,at){R.isVector4?ot.set(R.x,R.y,R.z,R.w):ot.set(R,j,lt,at),Lt.scissor(H.copy(ot).multiplyScalar(ft).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(R){Lt.setScissorTest(Ut=R)},this.setOpaqueSort=function(R){Rt=R},this.setTransparentSort=function(R){Xt=R},this.getClearColor=function(R){return R.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(R=!0,j=!0,lt=!0){let at=0;if(R){let Q=!1;if(Y!==null){const Bt=Y.texture.format;Q=M.has(Bt)}if(Q){const Bt=Y.texture.type,Zt=_.has(Bt),Gt=zt.getClearColor(),Kt=zt.getClearAlpha(),ee=Gt.r,oe=Gt.g,ne=Gt.b;Zt?(z[0]=ee,z[1]=oe,z[2]=ne,z[3]=Kt,P.clearBufferuiv(P.COLOR,0,z)):(U[0]=ee,U[1]=oe,U[2]=ne,U[3]=Kt,P.clearBufferiv(P.COLOR,0,U))}else at|=P.COLOR_BUFFER_BIT}j&&(at|=P.DEPTH_BUFFER_BIT),lt&&(at|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",he,!1),i.removeEventListener("webglcontextrestored",Ie,!1),i.removeEventListener("webglcontextcreationerror",we,!1),zt.dispose(),Tt.dispose(),wt.dispose(),E.dispose(),ht.dispose(),Et.dispose(),Pt.dispose(),qt.dispose(),At.dispose(),$t.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",Ps),Ot.removeEventListener("sessionend",Wr),wi.stop()};function he(R){R.preventDefault(),fv("WebGLRenderer: Context Lost."),w=!0}function Ie(){fv("WebGLRenderer: Context Restored."),w=!1;const R=O.autoReset,j=Wt.enabled,lt=Wt.autoUpdate,at=Wt.needsUpdate,Q=Wt.type;yt(),O.autoReset=R,Wt.enabled=j,Wt.autoUpdate=lt,Wt.needsUpdate=at,Wt.type=Q}function we(R){De("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Nn(R){const j=R.target;j.removeEventListener("dispose",Nn),gi(j)}function gi(R){fl(R),E.remove(R)}function fl(R){const j=E.get(R).programs;j!==void 0&&(j.forEach(function(lt){$t.releaseProgram(lt)}),R.isShaderMaterial&&$t.releaseShaderCache(R))}this.renderBufferDirect=function(R,j,lt,at,Q,Bt){j===null&&(j=gt);const Zt=Q.isMesh&&Q.matrixWorld.determinant()<0,Gt=is(R,j,lt,at,Q);Lt.setMaterial(at,Zt);let Kt=lt.index,ee=1;if(at.wireframe===!0){if(Kt=te.getWireframeAttribute(lt),Kt===void 0)return;ee=2}const oe=lt.drawRange,ne=lt.attributes.position;let ce=oe.start*ee,Oe=(oe.start+oe.count)*ee;Bt!==null&&(ce=Math.max(ce,Bt.start*ee),Oe=Math.min(Oe,(Bt.start+Bt.count)*ee)),Kt!==null?(ce=Math.max(ce,0),Oe=Math.min(Oe,Kt.count)):ne!=null&&(ce=Math.max(ce,0),Oe=Math.min(Oe,ne.count));const Je=Oe-ce;if(Je<0||Je===1/0)return;qt.setup(Q,at,Gt,lt,Kt);let je,Be=W;if(Kt!==null&&(je=dt.get(Kt),Be=Ht,Be.setIndex(je)),Q.isMesh)at.wireframe===!0?(Lt.setLineWidth(at.wireframeLinewidth*Nt()),Be.setMode(P.LINES)):Be.setMode(P.TRIANGLES);else if(Q.isLine){let se=at.linewidth;se===void 0&&(se=1),Lt.setLineWidth(se*Nt()),Q.isLineSegments?Be.setMode(P.LINES):Q.isLineLoop?Be.setMode(P.LINE_LOOP):Be.setMode(P.LINE_STRIP)}else Q.isPoints?Be.setMode(P.POINTS):Q.isSprite&&Be.setMode(P.TRIANGLES);if(Q.isBatchedMesh)if(Q._multiDrawInstances!==null)tl("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Be.renderMultiDrawInstances(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount,Q._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))Be.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{const se=Q._multiDrawStarts,Pe=Q._multiDrawCounts,de=Q._multiDrawCount,yn=Kt?dt.get(Kt).bytesPerElement:1,qi=E.get(at).currentProgram.getUniforms();for(let Mn=0;Mn<de;Mn++)qi.setValue(P,"_gl_DrawID",Mn),Be.render(se[Mn]/yn,Pe[Mn])}else if(Q.isInstancedMesh)Be.renderInstances(ce,Je,Q.count);else if(lt.isInstancedBufferGeometry){const se=lt._maxInstanceCount!==void 0?lt._maxInstanceCount:1/0,Pe=Math.min(lt.instanceCount,se);Be.renderInstances(ce,Je,Pe)}else Be.render(ce,Je)};function kr(R,j,lt){R.transparent===!0&&R.side===ma&&R.forceSinglePass===!1?(R.side=Yn,R.needsUpdate=!0,Fs(R,j,lt),R.side=ns,R.needsUpdate=!0,Fs(R,j,lt),R.side=ma):Fs(R,j,lt)}this.compile=function(R,j,lt=null){lt===null&&(lt=R),B=wt.get(lt),B.init(j),D.push(B),lt.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(B.pushLight(Q),Q.castShadow&&B.pushShadow(Q))}),R!==lt&&R.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(B.pushLight(Q),Q.castShadow&&B.pushShadow(Q))}),B.setupLights();const at=new Set;return R.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;const Bt=Q.material;if(Bt)if(Array.isArray(Bt))for(let Zt=0;Zt<Bt.length;Zt++){const Gt=Bt[Zt];kr(Gt,lt,Q),at.add(Gt)}else kr(Bt,lt,Q),at.add(Bt)}),B=D.pop(),at},this.compileAsync=function(R,j,lt=null){const at=this.compile(R,j,lt);return new Promise(Q=>{function Bt(){if(at.forEach(function(Zt){E.get(Zt).currentProgram.isReady()&&at.delete(Zt)}),at.size===0){Q(R);return}setTimeout(Bt,10)}Ft.get("KHR_parallel_shader_compile")!==null?Bt():setTimeout(Bt,10)})};let Os=null;function Xr(R){Os&&Os(R)}function Ps(){wi.stop()}function Wr(){wi.start()}const wi=new Z_;wi.setAnimationLoop(Xr),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(R){Os=R,Ot.setAnimationLoop(R),R===null?wi.stop():wi.start()},Ot.addEventListener("sessionstart",Ps),Ot.addEventListener("sessionend",Wr),this.render=function(R,j){if(j!==void 0&&j.isCamera!==!0){De("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;const lt=Ot.enabled===!0&&Ot.isPresenting===!0,at=k!==null&&(Y===null||lt)&&k.begin(T,Y);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(j),j=Ot.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,j,Y),B=wt.get(R,D.length),B.init(j),D.push(B),me.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Vt.setFromProjectionMatrix(me,Fi,j.reversedDepth),ve=this.localClippingEnabled,It=jt.init(this.clippingPlanes,ve),N=Tt.get(R,L.length),N.init(),L.push(N),Ot.enabled===!0&&Ot.isPresenting===!0){const Zt=T.xr.getDepthSensingMesh();Zt!==null&&ai(Zt,j,-1/0,T.sortObjects)}ai(R,j,0,T.sortObjects),N.finish(),T.sortObjects===!0&&N.sort(Rt,Xt),vt=Ot.enabled===!1||Ot.isPresenting===!1||Ot.hasDepthSensing()===!1,vt&&zt.addToRenderList(N,R),this.info.render.frame++,It===!0&&jt.beginShadows();const Q=B.state.shadowsArray;if(Wt.render(Q,R,j),It===!0&&jt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(at&&k.hasRenderPass())===!1){const Zt=N.opaque,Gt=N.transmissive;if(B.setupLights(),j.isArrayCamera){const Kt=j.cameras;if(Gt.length>0)for(let ee=0,oe=Kt.length;ee<oe;ee++){const ne=Kt[ee];Sn(Zt,Gt,R,ne)}vt&&zt.render(R);for(let ee=0,oe=Kt.length;ee<oe;ee++){const ne=Kt[ee];on(N,R,ne,ne.viewport)}}else Gt.length>0&&Sn(Zt,Gt,R,j),vt&&zt.render(R),on(N,R,j)}Y!==null&&J===0&&(q.updateMultisampleRenderTarget(Y),q.updateRenderTargetMipmap(Y)),at&&k.end(T),R.isScene===!0&&R.onAfterRender(T,R,j),qt.resetDefaultState(),ut=-1,rt=null,D.pop(),D.length>0?(B=D[D.length-1],It===!0&&jt.setGlobalState(T.clippingPlanes,B.state.camera)):B=null,L.pop(),L.length>0?N=L[L.length-1]:N=null};function ai(R,j,lt,at){if(R.visible===!1)return;if(R.layers.test(j.layers)){if(R.isGroup)lt=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(j);else if(R.isLight)B.pushLight(R),R.castShadow&&B.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Vt.intersectsSprite(R)){at&&xt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(me);const Zt=Pt.update(R),Gt=R.material;Gt.visible&&N.push(R,Zt,Gt,lt,xt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Vt.intersectsObject(R))){const Zt=Pt.update(R),Gt=R.material;if(at&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),xt.copy(R.boundingSphere.center)):(Zt.boundingSphere===null&&Zt.computeBoundingSphere(),xt.copy(Zt.boundingSphere.center)),xt.applyMatrix4(R.matrixWorld).applyMatrix4(me)),Array.isArray(Gt)){const Kt=Zt.groups;for(let ee=0,oe=Kt.length;ee<oe;ee++){const ne=Kt[ee],ce=Gt[ne.materialIndex];ce&&ce.visible&&N.push(R,Zt,ce,lt,xt.z,ne)}}else Gt.visible&&N.push(R,Zt,Gt,lt,xt.z,null)}}const Bt=R.children;for(let Zt=0,Gt=Bt.length;Zt<Gt;Zt++)ai(Bt[Zt],j,lt,at)}function on(R,j,lt,at){const{opaque:Q,transmissive:Bt,transparent:Zt}=R;B.setupLightsView(lt),It===!0&&jt.setGlobalState(T.clippingPlanes,lt),at&&Lt.viewport(I.copy(at)),Q.length>0&&vi(Q,j,lt),Bt.length>0&&vi(Bt,j,lt),Zt.length>0&&vi(Zt,j,lt),Lt.buffers.depth.setTest(!0),Lt.buffers.depth.setMask(!0),Lt.buffers.color.setMask(!0),Lt.setPolygonOffset(!1)}function Sn(R,j,lt,at){if((lt.isScene===!0?lt.overrideMaterial:null)!==null)return;if(B.state.transmissionRenderTarget[at.id]===void 0){const ce=Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float");B.state.transmissionRenderTarget[at.id]=new Ii(1,1,{generateMipmaps:!0,type:ce?xa:ii,minFilter:Ds,samples:ae.samples,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ue.workingColorSpace})}const Bt=B.state.transmissionRenderTarget[at.id],Zt=at.viewport||I;Bt.setSize(Zt.z*T.transmissionResolutionScale,Zt.w*T.transmissionResolutionScale);const Gt=T.getRenderTarget(),Kt=T.getActiveCubeFace(),ee=T.getActiveMipmapLevel();T.setRenderTarget(Bt),T.getClearColor(bt),Mt=T.getClearAlpha(),Mt<1&&T.setClearColor(16777215,.5),T.clear(),vt&&zt.render(lt);const oe=T.toneMapping;T.toneMapping=Bi;const ne=at.viewport;if(at.viewport!==void 0&&(at.viewport=void 0),B.setupLightsView(at),It===!0&&jt.setGlobalState(T.clippingPlanes,at),vi(R,lt,at),q.updateMultisampleRenderTarget(Bt),q.updateRenderTargetMipmap(Bt),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let ce=!1;for(let Oe=0,Je=j.length;Oe<Je;Oe++){const je=j[Oe],{object:Be,geometry:se,material:Pe,group:de}=je;if(Pe.side===ma&&Be.layers.test(at.layers)){const yn=Pe.side;Pe.side=Yn,Pe.needsUpdate=!0,zs(Be,lt,at,se,Pe,de),Pe.side=yn,Pe.needsUpdate=!0,ce=!0}}ce===!0&&(q.updateMultisampleRenderTarget(Bt),q.updateRenderTargetMipmap(Bt))}T.setRenderTarget(Gt,Kt,ee),T.setClearColor(bt,Mt),ne!==void 0&&(at.viewport=ne),T.toneMapping=oe}function vi(R,j,lt){const at=j.isScene===!0?j.overrideMaterial:null;for(let Q=0,Bt=R.length;Q<Bt;Q++){const Zt=R[Q],{object:Gt,geometry:Kt,group:ee}=Zt;let oe=Zt.material;oe.allowOverride===!0&&at!==null&&(oe=at),Gt.layers.test(lt.layers)&&zs(Gt,j,lt,Kt,oe,ee)}}function zs(R,j,lt,at,Q,Bt){R.onBeforeRender(T,j,lt,at,Q,Bt),R.modelViewMatrix.multiplyMatrices(lt.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Q.onBeforeRender(T,j,lt,at,R,Bt),Q.transparent===!0&&Q.side===ma&&Q.forceSinglePass===!1?(Q.side=Yn,Q.needsUpdate=!0,T.renderBufferDirect(lt,j,at,Q,R,Bt),Q.side=ns,Q.needsUpdate=!0,T.renderBufferDirect(lt,j,at,Q,R,Bt),Q.side=ma):T.renderBufferDirect(lt,j,at,Q,R,Bt),R.onAfterRender(T,j,lt,at,Q,Bt)}function Fs(R,j,lt){j.isScene!==!0&&(j=gt);const at=E.get(R),Q=B.state.lights,Bt=B.state.shadowsArray,Zt=Q.state.version,Gt=$t.getParameters(R,Q.state,Bt,j,lt),Kt=$t.getProgramCacheKey(Gt);let ee=at.programs;at.environment=R.isMeshStandardMaterial?j.environment:null,at.fog=j.fog,at.envMap=(R.isMeshStandardMaterial?Et:ht).get(R.envMap||at.environment),at.envMapRotation=at.environment!==null&&R.envMap===null?j.environmentRotation:R.envMapRotation,ee===void 0&&(R.addEventListener("dispose",Nn),ee=new Map,at.programs=ee);let oe=ee.get(Kt);if(oe!==void 0){if(at.currentProgram===oe&&at.lightsStateVersion===Zt)return qr(R,Gt),oe}else Gt.uniforms=$t.getUniforms(R),R.onBeforeCompile(Gt,T),oe=$t.acquireProgram(Gt,Kt),ee.set(Kt,oe),at.uniforms=Gt.uniforms;const ne=at.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(ne.clippingPlanes=jt.uniform),qr(R,Gt),at.needsLights=ya(R),at.lightsStateVersion=Zt,at.needsLights&&(ne.ambientLightColor.value=Q.state.ambient,ne.lightProbe.value=Q.state.probe,ne.directionalLights.value=Q.state.directional,ne.directionalLightShadows.value=Q.state.directionalShadow,ne.spotLights.value=Q.state.spot,ne.spotLightShadows.value=Q.state.spotShadow,ne.rectAreaLights.value=Q.state.rectArea,ne.ltc_1.value=Q.state.rectAreaLTC1,ne.ltc_2.value=Q.state.rectAreaLTC2,ne.pointLights.value=Q.state.point,ne.pointLightShadows.value=Q.state.pointShadow,ne.hemisphereLights.value=Q.state.hemi,ne.directionalShadowMap.value=Q.state.directionalShadowMap,ne.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,ne.spotShadowMap.value=Q.state.spotShadowMap,ne.spotLightMatrix.value=Q.state.spotLightMatrix,ne.spotLightMap.value=Q.state.spotLightMap,ne.pointShadowMap.value=Q.state.pointShadowMap,ne.pointShadowMatrix.value=Q.state.pointShadowMatrix),at.currentProgram=oe,at.uniformsList=null,oe}function hl(R){if(R.uniformsList===null){const j=R.currentProgram.getUniforms();R.uniformsList=Jc.seqWithValue(j.seq,R.uniforms)}return R.uniformsList}function qr(R,j){const lt=E.get(R);lt.outputColorSpace=j.outputColorSpace,lt.batching=j.batching,lt.batchingColor=j.batchingColor,lt.instancing=j.instancing,lt.instancingColor=j.instancingColor,lt.instancingMorph=j.instancingMorph,lt.skinning=j.skinning,lt.morphTargets=j.morphTargets,lt.morphNormals=j.morphNormals,lt.morphColors=j.morphColors,lt.morphTargetsCount=j.morphTargetsCount,lt.numClippingPlanes=j.numClippingPlanes,lt.numIntersection=j.numClipIntersection,lt.vertexAlphas=j.vertexAlphas,lt.vertexTangents=j.vertexTangents,lt.toneMapping=j.toneMapping}function is(R,j,lt,at,Q){j.isScene!==!0&&(j=gt),q.resetTextureUnits();const Bt=j.fog,Zt=at.isMeshStandardMaterial?j.environment:null,Gt=Y===null?T.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Fr,Kt=(at.isMeshStandardMaterial?Et:ht).get(at.envMap||Zt),ee=at.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,oe=!!lt.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),ne=!!lt.morphAttributes.position,ce=!!lt.morphAttributes.normal,Oe=!!lt.morphAttributes.color;let Je=Bi;at.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(Je=T.toneMapping);const je=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,Be=je!==void 0?je.length:0,se=E.get(at),Pe=B.state.lights;if(It===!0&&(ve===!0||R!==rt)){const bn=R===rt&&at.id===ut;jt.setState(at,R,bn)}let de=!1;at.version===se.__version?(se.needsLights&&se.lightsStateVersion!==Pe.state.version||se.outputColorSpace!==Gt||Q.isBatchedMesh&&se.batching===!1||!Q.isBatchedMesh&&se.batching===!0||Q.isBatchedMesh&&se.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&se.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&se.instancing===!1||!Q.isInstancedMesh&&se.instancing===!0||Q.isSkinnedMesh&&se.skinning===!1||!Q.isSkinnedMesh&&se.skinning===!0||Q.isInstancedMesh&&se.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&se.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&se.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&se.instancingMorph===!1&&Q.morphTexture!==null||se.envMap!==Kt||at.fog===!0&&se.fog!==Bt||se.numClippingPlanes!==void 0&&(se.numClippingPlanes!==jt.numPlanes||se.numIntersection!==jt.numIntersection)||se.vertexAlphas!==ee||se.vertexTangents!==oe||se.morphTargets!==ne||se.morphNormals!==ce||se.morphColors!==Oe||se.toneMapping!==Je||se.morphTargetsCount!==Be)&&(de=!0):(de=!0,se.__version=at.version);let yn=se.currentProgram;de===!0&&(yn=Fs(at,j,Q));let qi=!1,Mn=!1,si=!1;const He=yn.getUniforms(),En=se.uniforms;if(Lt.useProgram(yn.program)&&(qi=!0,Mn=!0,si=!0),at.id!==ut&&(ut=at.id,Mn=!0),qi||rt!==R){Lt.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),He.setValue(P,"projectionMatrix",R.projectionMatrix),He.setValue(P,"viewMatrix",R.matrixWorldInverse);const Tn=He.map.cameraPosition;Tn!==void 0&&Tn.setValue(P,fe.setFromMatrixPosition(R.matrixWorld)),ae.logarithmicDepthBuffer&&He.setValue(P,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&He.setValue(P,"isOrthographic",R.isOrthographicCamera===!0),rt!==R&&(rt=R,Mn=!0,si=!0)}if(se.needsLights&&(Pe.state.directionalShadowMap.length>0&&He.setValue(P,"directionalShadowMap",Pe.state.directionalShadowMap,q),Pe.state.spotShadowMap.length>0&&He.setValue(P,"spotShadowMap",Pe.state.spotShadowMap,q),Pe.state.pointShadowMap.length>0&&He.setValue(P,"pointShadowMap",Pe.state.pointShadowMap,q)),Q.isSkinnedMesh){He.setOptional(P,Q,"bindMatrix"),He.setOptional(P,Q,"bindMatrixInverse");const bn=Q.skeleton;bn&&(bn.boneTexture===null&&bn.computeBoneTexture(),He.setValue(P,"boneTexture",bn.boneTexture,q))}Q.isBatchedMesh&&(He.setOptional(P,Q,"batchingTexture"),He.setValue(P,"batchingTexture",Q._matricesTexture,q),He.setOptional(P,Q,"batchingIdTexture"),He.setValue(P,"batchingIdTexture",Q._indirectTexture,q),He.setOptional(P,Q,"batchingColorTexture"),Q._colorsTexture!==null&&He.setValue(P,"batchingColorTexture",Q._colorsTexture,q));const pn=lt.morphAttributes;if((pn.position!==void 0||pn.normal!==void 0||pn.color!==void 0)&&xe.update(Q,lt,yn),(Mn||se.receiveShadow!==Q.receiveShadow)&&(se.receiveShadow=Q.receiveShadow,He.setValue(P,"receiveShadow",Q.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(En.envMap.value=Kt,En.flipEnvMap.value=Kt.isCubeTexture&&Kt.isRenderTargetTexture===!1?-1:1),at.isMeshStandardMaterial&&at.envMap===null&&j.environment!==null&&(En.envMapIntensity.value=j.environmentIntensity),En.dfgLUT!==void 0&&(En.dfgLUT.value=wR()),Mn&&(He.setValue(P,"toneMappingExposure",T.toneMappingExposure),se.needsLights&&Yr(En,si),Bt&&at.fog===!0&&le.refreshFogUniforms(En,Bt),le.refreshMaterialUniforms(En,at,ft,$,B.state.transmissionRenderTarget[R.id]),Jc.upload(P,hl(se),En,q)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(Jc.upload(P,hl(se),En,q),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&He.setValue(P,"center",Q.center),He.setValue(P,"modelViewMatrix",Q.modelViewMatrix),He.setValue(P,"normalMatrix",Q.normalMatrix),He.setValue(P,"modelMatrix",Q.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){const bn=at.uniformsGroups;for(let Tn=0,Bs=bn.length;Tn<Bs;Tn++){const _i=bn[Tn];At.update(_i,yn),At.bind(_i,yn)}}return yn}function Yr(R,j){R.ambientLightColor.needsUpdate=j,R.lightProbe.needsUpdate=j,R.directionalLights.needsUpdate=j,R.directionalLightShadows.needsUpdate=j,R.pointLights.needsUpdate=j,R.pointLightShadows.needsUpdate=j,R.spotLights.needsUpdate=j,R.spotLightShadows.needsUpdate=j,R.rectAreaLights.needsUpdate=j,R.hemisphereLights.needsUpdate=j}function ya(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return Y},this.setRenderTargetTextures=function(R,j,lt){const at=E.get(R);at.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,at.__autoAllocateDepthBuffer===!1&&(at.__useRenderToTexture=!1),E.get(R.texture).__webglTexture=j,E.get(R.depthTexture).__webglTexture=at.__autoAllocateDepthBuffer?void 0:lt,at.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,j){const lt=E.get(R);lt.__webglFramebuffer=j,lt.__useDefaultFramebuffer=j===void 0};const Ma=P.createFramebuffer();this.setRenderTarget=function(R,j=0,lt=0){Y=R,V=j,J=lt;let at=null,Q=!1,Bt=!1;if(R){const Gt=E.get(R);if(Gt.__useDefaultFramebuffer!==void 0){Lt.bindFramebuffer(P.FRAMEBUFFER,Gt.__webglFramebuffer),I.copy(R.viewport),H.copy(R.scissor),tt=R.scissorTest,Lt.viewport(I),Lt.scissor(H),Lt.setScissorTest(tt),ut=-1;return}else if(Gt.__webglFramebuffer===void 0)q.setupRenderTarget(R);else if(Gt.__hasExternalTextures)q.rebindTextures(R,E.get(R.texture).__webglTexture,E.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const oe=R.depthTexture;if(Gt.__boundDepthTexture!==oe){if(oe!==null&&E.has(oe)&&(R.width!==oe.image.width||R.height!==oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(R)}}const Kt=R.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(Bt=!0);const ee=E.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(ee[j])?at=ee[j][lt]:at=ee[j],Q=!0):R.samples>0&&q.useMultisampledRTT(R)===!1?at=E.get(R).__webglMultisampledFramebuffer:Array.isArray(ee)?at=ee[lt]:at=ee,I.copy(R.viewport),H.copy(R.scissor),tt=R.scissorTest}else I.copy(it).multiplyScalar(ft).floor(),H.copy(ot).multiplyScalar(ft).floor(),tt=Ut;if(lt!==0&&(at=Ma),Lt.bindFramebuffer(P.FRAMEBUFFER,at)&&Lt.drawBuffers(R,at),Lt.viewport(I),Lt.scissor(H),Lt.setScissorTest(tt),Q){const Gt=E.get(R.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+j,Gt.__webglTexture,lt)}else if(Bt){const Gt=j;for(let Kt=0;Kt<R.textures.length;Kt++){const ee=E.get(R.textures[Kt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Kt,ee.__webglTexture,lt,Gt)}}else if(R!==null&&lt!==0){const Gt=E.get(R.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Gt.__webglTexture,lt)}ut=-1},this.readRenderTargetPixels=function(R,j,lt,at,Q,Bt,Zt,Gt=0){if(!(R&&R.isWebGLRenderTarget)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Kt=E.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Zt!==void 0&&(Kt=Kt[Zt]),Kt){Lt.bindFramebuffer(P.FRAMEBUFFER,Kt);try{const ee=R.textures[Gt],oe=ee.format,ne=ee.type;if(!ae.textureFormatReadable(oe)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(ne)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=R.width-at&&lt>=0&&lt<=R.height-Q&&(R.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Gt),P.readPixels(j,lt,at,Q,Dt.convert(oe),Dt.convert(ne),Bt))}finally{const ee=Y!==null?E.get(Y).__webglFramebuffer:null;Lt.bindFramebuffer(P.FRAMEBUFFER,ee)}}},this.readRenderTargetPixelsAsync=async function(R,j,lt,at,Q,Bt,Zt,Gt=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Kt=E.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Zt!==void 0&&(Kt=Kt[Zt]),Kt)if(j>=0&&j<=R.width-at&&lt>=0&&lt<=R.height-Q){Lt.bindFramebuffer(P.FRAMEBUFFER,Kt);const ee=R.textures[Gt],oe=ee.format,ne=ee.type;if(!ae.textureFormatReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ce),P.bufferData(P.PIXEL_PACK_BUFFER,Bt.byteLength,P.STREAM_READ),R.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Gt),P.readPixels(j,lt,at,Q,Dt.convert(oe),Dt.convert(ne),0);const Oe=Y!==null?E.get(Y).__webglFramebuffer:null;Lt.bindFramebuffer(P.FRAMEBUFFER,Oe);const Je=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await dM(P,Je,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ce),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Bt),P.deleteBuffer(ce),P.deleteSync(Je),Bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,j=null,lt=0){const at=Math.pow(2,-lt),Q=Math.floor(R.image.width*at),Bt=Math.floor(R.image.height*at),Zt=j!==null?j.x:0,Gt=j!==null?j.y:0;q.setTexture2D(R,0),P.copyTexSubImage2D(P.TEXTURE_2D,lt,0,0,Zt,Gt,Q,Bt),Lt.unbindTexture()};const as=P.createFramebuffer(),Ea=P.createFramebuffer();this.copyTextureToTexture=function(R,j,lt=null,at=null,Q=0,Bt=null){Bt===null&&(Q!==0?(tl("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Bt=Q,Q=0):Bt=0);let Zt,Gt,Kt,ee,oe,ne,ce,Oe,Je;const je=R.isCompressedTexture?R.mipmaps[Bt]:R.image;if(lt!==null)Zt=lt.max.x-lt.min.x,Gt=lt.max.y-lt.min.y,Kt=lt.isBox3?lt.max.z-lt.min.z:1,ee=lt.min.x,oe=lt.min.y,ne=lt.isBox3?lt.min.z:0;else{const pn=Math.pow(2,-Q);Zt=Math.floor(je.width*pn),Gt=Math.floor(je.height*pn),R.isDataArrayTexture?Kt=je.depth:R.isData3DTexture?Kt=Math.floor(je.depth*pn):Kt=1,ee=0,oe=0,ne=0}at!==null?(ce=at.x,Oe=at.y,Je=at.z):(ce=0,Oe=0,Je=0);const Be=Dt.convert(j.format),se=Dt.convert(j.type);let Pe;j.isData3DTexture?(q.setTexture3D(j,0),Pe=P.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(q.setTexture2DArray(j,0),Pe=P.TEXTURE_2D_ARRAY):(q.setTexture2D(j,0),Pe=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,j.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,j.unpackAlignment);const de=P.getParameter(P.UNPACK_ROW_LENGTH),yn=P.getParameter(P.UNPACK_IMAGE_HEIGHT),qi=P.getParameter(P.UNPACK_SKIP_PIXELS),Mn=P.getParameter(P.UNPACK_SKIP_ROWS),si=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,je.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,je.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ee),P.pixelStorei(P.UNPACK_SKIP_ROWS,oe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ne);const He=R.isDataArrayTexture||R.isData3DTexture,En=j.isDataArrayTexture||j.isData3DTexture;if(R.isDepthTexture){const pn=E.get(R),bn=E.get(j),Tn=E.get(pn.__renderTarget),Bs=E.get(bn.__renderTarget);Lt.bindFramebuffer(P.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Lt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Bs.__webglFramebuffer);for(let _i=0;_i<Kt;_i++)He&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,E.get(R).__webglTexture,Q,ne+_i),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,E.get(j).__webglTexture,Bt,Je+_i)),P.blitFramebuffer(ee,oe,Zt,Gt,ce,Oe,Zt,Gt,P.DEPTH_BUFFER_BIT,P.NEAREST);Lt.bindFramebuffer(P.READ_FRAMEBUFFER,null),Lt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(Q!==0||R.isRenderTargetTexture||E.has(R)){const pn=E.get(R),bn=E.get(j);Lt.bindFramebuffer(P.READ_FRAMEBUFFER,as),Lt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ea);for(let Tn=0;Tn<Kt;Tn++)He?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pn.__webglTexture,Q,ne+Tn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,pn.__webglTexture,Q),En?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,bn.__webglTexture,Bt,Je+Tn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,bn.__webglTexture,Bt),Q!==0?P.blitFramebuffer(ee,oe,Zt,Gt,ce,Oe,Zt,Gt,P.COLOR_BUFFER_BIT,P.NEAREST):En?P.copyTexSubImage3D(Pe,Bt,ce,Oe,Je+Tn,ee,oe,Zt,Gt):P.copyTexSubImage2D(Pe,Bt,ce,Oe,ee,oe,Zt,Gt);Lt.bindFramebuffer(P.READ_FRAMEBUFFER,null),Lt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else En?R.isDataTexture||R.isData3DTexture?P.texSubImage3D(Pe,Bt,ce,Oe,Je,Zt,Gt,Kt,Be,se,je.data):j.isCompressedArrayTexture?P.compressedTexSubImage3D(Pe,Bt,ce,Oe,Je,Zt,Gt,Kt,Be,je.data):P.texSubImage3D(Pe,Bt,ce,Oe,Je,Zt,Gt,Kt,Be,se,je):R.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Bt,ce,Oe,Zt,Gt,Be,se,je.data):R.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Bt,ce,Oe,je.width,je.height,Be,je.data):P.texSubImage2D(P.TEXTURE_2D,Bt,ce,Oe,Zt,Gt,Be,se,je);P.pixelStorei(P.UNPACK_ROW_LENGTH,de),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,yn),P.pixelStorei(P.UNPACK_SKIP_PIXELS,qi),P.pixelStorei(P.UNPACK_SKIP_ROWS,Mn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,si),Bt===0&&j.generateMipmaps&&P.generateMipmap(Pe),Lt.unbindTexture()},this.initRenderTarget=function(R){E.get(R).__webglFramebuffer===void 0&&q.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?q.setTextureCube(R,0):R.isData3DTexture?q.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?q.setTexture2DArray(R,0):q.setTexture2D(R,0),Lt.unbindTexture()},this.resetState=function(){V=0,J=0,Y=null,Lt.reset(),qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Ue._getDrawingBufferColorSpace(t),i.unpackColorSpace=Ue._getUnpackColorSpace()}}const s_=2e3,r_=2.4,Wc=5,o_=.25,UR=.3,l_=.15;function NR(r,t,i){const s=new k_,l=r/2,c=t/2;return s.moveTo(-l+i,-c),s.lineTo(l-i,-c),s.quadraticCurveTo(l,-c,l,-c+i),s.lineTo(l,c-i),s.quadraticCurveTo(l,c,l-i,c),s.lineTo(-l+i,c),s.quadraticCurveTo(-l,c,-l,c-i),s.lineTo(-l,-c+i),s.quadraticCurveTo(-l,-c,-l+i,-c),s}function LR({selectedSession:r}){const t=Ct.useRef(null),i=Ct.useRef(null),s=Ct.useRef(null);return Ct.useEffect(()=>{var c;const l=i.current;l&&l.readyState===WebSocket.OPEN&&l.send(JSON.stringify({type:"select",session:r})),(c=s.current)==null||c.call(s,r)},[r]),Ct.useEffect(()=>{const l=t.current;if(!l)return;const c=new IM,f=new mi(35,3/4,.1,100);f.position.set(0,0,10),f.lookAt(0,0,0);const d=new DR({antialias:!0,alpha:!0});d.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.appendChild(d.domElement),c.add(new LE(16777215,.6));const m=new NE(16777215,.8);m.position.set(3,5,8),c.add(m);const p=new Dr;c.add(p);const g=new Dr;p.add(g);const v=document.createElement("video");v.muted=!0,v.autoplay=!0,v.playsInline=!0,v.style.display="none",document.body.appendChild(v);const x=new XM(v);x.colorSpace=qn,x.minFilter=dn,x.magFilter=dn;const y=document.createElement("canvas");y.width=540,y.height=1170;const b=y.getContext("2d");b.fillStyle="#111",b.fillRect(0,0,y.width,y.height);const C=new WM(y);C.colorSpace=qn;const M=new RE({color:1710638,metalness:.3,roughness:.7}),_=new sp({map:C});let z=!1,U=null,N=null,B=null,L=null,D=r_,k=Wc;function T(gt,vt){U&&(g.remove(U),B.dispose()),N&&(g.remove(N),L.dispose()),D=gt,k=vt;const Nt=NR(gt,vt,UR);B=new cp(Nt,{depth:o_,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:3}),B.center(),U=new Ci(B,M),g.add(U);const P=gt-l_*2,Qt=vt-l_*2;L=new ul(P,Qt),N=new Ci(L,_),N.position.z=(o_+.08)/2+.01,g.add(N),I()}const w=.85;let V=0,J=0,Y=0;const ut=[0,Math.PI/2,Math.PI,-Math.PI/2];let rt=10;function I(){const vt=(V===1||V===3?k:D)*w,Nt=Math.atan(Math.tan(f.fov/2*Math.PI/180)*f.aspect);rt=vt/2/Math.tan(Nt)}T(r_,Wc),g.scale.setScalar(w);function H(){const gt=l.clientWidth,vt=l.clientHeight;gt===0||vt===0||(f.aspect=gt/vt,f.updateProjectionMatrix(),d.setSize(gt,vt),I())}H();const tt=new ResizeObserver(H);tt.observe(l);let bt=performance.now(),Mt=0;function F(){Mt=requestAnimationFrame(F);const gt=performance.now(),vt=Math.min((gt-bt)/1e3,.1);bt=gt;const Nt=1-Math.exp(-8*vt);let P=J-Y;P>Math.PI&&(P-=2*Math.PI),P<-Math.PI&&(P+=2*Math.PI),Y+=P*Nt,p.rotation.z=Y,f.position.z+=(rt-f.position.z)*Nt,d.render(c,f)}F();let $=null,ft=null,Rt=[];function Xt(){if(Rt=[],ft=null,$&&$.readyState==="open")try{$.endOfStream()}catch{}$=new MediaSource,v.src=URL.createObjectURL($),$.addEventListener("sourceopen",()=>{try{ft=$.addSourceBuffer('video/mp4; codecs="avc1.42E01E"'),ft.mode="segments",ft.addEventListener("updateend",()=>{if(ft.buffered.length>0){const gt=ft.buffered.end(ft.buffered.length-1);if(gt>3&&!ft.updating){ft.remove(0,gt-3);return}}Rt.length>0&&!ft.updating&&ft.appendBuffer(Rt.shift())}),Rt.length>0&&ft.appendBuffer(Rt.shift())}catch(gt){console.error("MSE addSourceBuffer failed:",gt)}})}function it(gt){if(ft&&!ft.updating)try{ft.appendBuffer(gt)}catch{Rt.push(gt)}else Rt.push(gt);z||(z=!0,_.map=x,_.needsUpdate=!0)}let ot=null,Ut=null,Vt=null,It=!1;function ve(gt){if(Ut&&(clearTimeout(Ut),Ut=null),ot&&(ot.onclose=null,ot.close(),ot=null),Vt=gt,!gt||It){z=!1,_.map=C,_.needsUpdate=!0;return}Xt();const Nt=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws/stream/${gt}`;ot=new WebSocket(Nt),ot.binaryType="arraybuffer",ot.onmessage=P=>{P.data instanceof ArrayBuffer&&it(P.data)},ot.onclose=()=>{!It&&gt===Vt&&(Ut=setTimeout(()=>ve(gt),s_))},ot.onerror=()=>{}}s.current=ve;let me=null,fe=null;function xt(){if(It)return;const vt=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws/preview`;me=new WebSocket(vt),i.current=me,me.binaryType="arraybuffer",me.onopen=()=>{me.send(JSON.stringify({type:"select",session:r}))},me.onclose=()=>{i.current=null,It||(fe=setTimeout(xt,s_))},me.onerror=()=>{},me.onmessage=Nt=>{if(typeof Nt.data=="string")try{const P=JSON.parse(Nt.data);if(P.type==="device"){const Qt=Math.min(P.w,P.h),Ft=Math.max(P.w,P.h),ae=Qt/Ft;T(Wc*ae,Wc)}if(P.type==="orient"&&P.o!==void 0){const Qt=P.o;if(Qt!==V){V=Qt,J=ut[V],I();const Ft=V===1||V===3,ae=l==null?void 0:l.closest(".preview-column");ae&&(ae.style.width=Ft?`${Math.round(400*k/D)}px`:"400px")}}}catch{}}}return xt(),r&&ve(r),()=>{It=!0,s.current=null,Ut&&clearTimeout(Ut),ot&&(ot.onclose=null,ot.close()),fe&&clearTimeout(fe),me&&(me.onclose=null,me.close(),i.current=null),cancelAnimationFrame(Mt),tt.disconnect(),d.dispose(),B&&B.dispose(),M.dispose(),L&&L.dispose(),_.dispose(),x.dispose(),C.dispose(),document.body.contains(v)&&document.body.removeChild(v),l.contains(d.domElement)&&l.removeChild(d.domElement)}},[]),pt.jsx("div",{className:"phone-preview",ref:t})}function OR({sessions:r,servers:t,selectedSession:i,onSelectSession:s,onSwitchAll:l,onSwitchSession:c}){const[f,d]=Ct.useState(null),m=Ct.useRef(null),p=Ct.useRef(null),g=Ct.useCallback(_=>{const z=t.find(U=>U.id===_);return z?z.name:"(none)"},[t]),v=(()=>{if(r.length===0)return"";const _=r[0].serverID;return r.every(z=>z.serverID===_)?_:""})(),x=v?g(v):"(mixed)",y=Ct.useCallback(_=>{t.length<2||(p.current&&(clearTimeout(p.current),p.current=null),m.current=setTimeout(()=>d(_),50))},[t.length]),b=Ct.useCallback(()=>{m.current&&(clearTimeout(m.current),m.current=null),p.current=setTimeout(()=>d(null),200)},[]),C=Ct.useCallback(()=>{p.current&&(clearTimeout(p.current),p.current=null)},[]),M=Ct.useCallback(_=>{_&&requestAnimationFrame(()=>{const z=_.parentElement;if(!z){_.style.opacity="1";return}const U=_.querySelector(".server-dropdown-item.current");if(!U){_.style.opacity="1";return}const N=z.getBoundingClientRect(),B=U.getBoundingClientRect(),L=getComputedStyle(z),D=getComputedStyle(U),k=N.left+parseFloat(L.paddingLeft)-(B.left+parseFloat(D.paddingLeft)),T=N.top+parseFloat(L.paddingTop)-(B.top+parseFloat(D.paddingTop));_.style.transform=`translate(${k}px, ${T}px)`,_.style.opacity="1"})},[]);return r.length===0?null:pt.jsxs("div",{className:"player-list",children:[pt.jsx("h2",{className:"player-title",children:"Players"}),pt.jsxs("div",{className:"player-items",children:[pt.jsxs("div",{className:`player-row ${i===null?"selected":""}`,children:[pt.jsxs("button",{className:"player-label",onClick:()=>s(null),children:[pt.jsx("span",{className:"player-dot all"}),pt.jsx("span",{children:"All"})]}),pt.jsx("span",{className:"player-arrow",children:"→"}),pt.jsxs("div",{className:"player-server",onMouseEnter:()=>y("all"),onMouseLeave:b,children:[x,f==="all"&&pt.jsx("div",{className:"server-dropdown",ref:M,style:{opacity:0},onMouseEnter:C,onMouseLeave:b,children:t.map(_=>pt.jsx("button",{className:`server-dropdown-item ${_.id===v?"current":""}`,onClick:()=>{l(_.id),d(null)},children:_.name},_.id))})]})]}),r.map(_=>pt.jsxs("div",{className:`player-row ${i===_.id?"selected":""}`,children:[pt.jsxs("button",{className:"player-label",onClick:()=>s(_.id),children:[pt.jsx("span",{className:"player-dot active"}),pt.jsx("span",{children:_.name||_.id})]}),pt.jsx("span",{className:"player-arrow",children:"→"}),pt.jsxs("div",{className:"player-server",onMouseEnter:()=>y(_.id),onMouseLeave:b,children:[g(_.serverID),f===_.id&&pt.jsx("div",{className:"server-dropdown",ref:M,style:{opacity:0},onMouseEnter:C,onMouseLeave:b,children:t.map(z=>pt.jsx("button",{className:`server-dropdown-item ${z.id===_.serverID?"current":""}`,onClick:()=>{c(_.id,z.id),d(null)},children:z.name},z.id))})]})]},_.id))]})]})}const c_="ged-sidebar-width",u_=260;function PR(){const[r,t]=Ct.useState(!1),[i,s]=Ct.useState(!1),[l,c]=Ct.useState(!1),f=Ct.useRef(!1),[d,m]=Ct.useState("ge"),p=Ct.useRef(!1),[g,v]=Ct.useState([]),[x,y]=Ct.useState(null),[b,C]=Ct.useState([]),[M,_]=Ct.useState(()=>{const T=localStorage.getItem(c_);return T&&parseInt(T,10)||u_}),z=Ct.useRef(null),U=Ct.useCallback(T=>{T.preventDefault();const w=T.clientX,V=M;document.body.style.cursor="col-resize",document.body.style.userSelect="none";const J=ut=>{const rt=Math.max(180,Math.min(600,V+ut.clientX-w));_(rt)},Y=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",J),window.removeEventListener("mouseup",Y),_(ut=>(localStorage.setItem(c_,String(ut)),ut))};window.addEventListener("mousemove",J),window.addEventListener("mouseup",Y)},[M]),N=Ct.useCallback(T=>{T.buildId&&T.buildId!=="mop05hdt"&&console.warn("Build ID mismatch:",T.buildId,"vs","mop05hdt","— skipping reload");const w=T.servers.map(Y=>({id:Y.id,name:Y.name,pid:Y.pid}));C(w);const V=new Set(T.sessions.map(Y=>Y.id));v(T.sessions.map(Y=>({id:Y.id,serverID:Y.serverID,name:Y.name}))),y(Y=>Y!==null&&!V.has(Y)?null:Y);const J=T.servers[0];if(J){m(J.name);const Y=window.location.port;document.title=Y?`${J.name} :${Y}`:J.name}else m("ge")},[]),B=Ct.useCallback(T=>{fetch(`/api/servers/${T}/select`,{method:"POST"}).catch(()=>{})},[]),L=Ct.useCallback((T,w)=>{fetch(`/api/sessions/${T}/server/${w}`,{method:"POST"}).catch(()=>{})},[]),D=Ct.useCallback(()=>{c(!0),p.current=!0,s(!1),fetch("/api/stop",{method:"POST"}).catch(()=>{})},[]);Ct.useEffect(()=>{const T=()=>{p.current||navigator.sendBeacon("/api/stop")};return window.addEventListener("pagehide",T),()=>window.removeEventListener("pagehide",T)},[]);const k=Ct.useCallback(T=>{f.current=T,s(!0)},[]);return Ct.useEffect(()=>{const T=w=>{if(w.key==="c"&&w.ctrlKey&&!w.metaKey){if(w.preventDefault(),l)return;i&&f.current?D():i||k(!0)}else w.key==="Escape"&&i&&s(!1)};return window.addEventListener("keydown",T),()=>window.removeEventListener("keydown",T)},[i,l,D,k]),pt.jsxs("div",{className:"app",children:[pt.jsxs("header",{className:"header",children:[pt.jsx("h1",{className:"title",children:d}),pt.jsx("button",{className:"stop-btn",onClick:()=>k(!1),disabled:l,title:"Stop server (Ctrl-C)",children:l?"Stopped":"Stop"}),pt.jsx("span",{className:`status-dot ${r?"connected":"disconnected"}`}),pt.jsx("span",{className:"status-text",children:r?"connected":"disconnected"})]}),pt.jsxs("div",{className:"layout",children:[pt.jsxs("aside",{className:"sidebar",style:{width:M},ref:z,children:[pt.jsx(gy,{}),b.length>0&&pt.jsxs("div",{className:"player-list",children:[pt.jsx("h2",{className:"player-title",children:"Servers"}),pt.jsx("div",{className:"player-items",children:b.map(T=>pt.jsxs("div",{className:"player-row",children:[pt.jsxs("span",{className:"player-label",style:{cursor:"default"},children:[pt.jsx("span",{className:"player-dot"}),pt.jsx("span",{children:T.name})]}),pt.jsxs("span",{className:"server-pid",children:["pid ",T.pid]})]},T.id))})]}),pt.jsx(OR,{sessions:g,servers:b,selectedSession:x,onSelectSession:y,onSwitchAll:B,onSwitchSession:L}),pt.jsx(Ly,{})]}),pt.jsx("div",{className:"sidebar-resize-handle",onMouseDown:U}),pt.jsx("main",{className:"main",children:pt.jsx(My,{onConnectionChange:t,sessionFilter:x,onState:N})}),pt.jsx("aside",{className:"preview-column",children:pt.jsx(LR,{selectedSession:x})})]}),i&&pt.jsx("div",{className:"confirm-overlay",onClick:()=>s(!1),children:pt.jsxs("div",{className:"confirm-dialog",onClick:T=>T.stopPropagation(),children:[pt.jsx("p",{className:"confirm-text",children:"Stop the game server?"}),f.current&&pt.jsx("p",{className:"confirm-hint",children:"Ctrl-C again to confirm"}),pt.jsxs("div",{className:"confirm-actions",children:[pt.jsx("button",{className:"confirm-btn confirm-btn-stop",onClick:D,children:"Stop Server"}),pt.jsx("button",{className:"confirm-btn confirm-btn-cancel",onClick:()=>s(!1),children:"Cancel"})]})]})})]})}window.addEventListener("unhandledrejection",r=>{document.title="REJECT: "+r.reason,console.error("Unhandled rejection:",r.reason)});class zR extends Ct.Component{constructor(){super(...arguments);k0(this,"state",{error:null})}static getDerivedStateFromError(i){return{error:i}}componentDidCatch(i,s){console.error("React error boundary:",i,s)}render(){return this.state.error?pt.jsxs("pre",{style:{color:"#f88",padding:20,whiteSpace:"pre-wrap",background:"#200"},children:[this.state.error.message,`
`,this.state.error.stack]}):this.props.children}}my.createRoot(document.getElementById("root")).render(pt.jsx(Ct.StrictMode,{children:pt.jsx(zR,{children:pt.jsx(PR,{})})}));
