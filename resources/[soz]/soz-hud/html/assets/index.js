var q=Object.defineProperty,J=Object.defineProperties;var Q=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var e1=Object.prototype.hasOwnProperty,_1=Object.prototype.propertyIsEnumerable;var B=(e,t,r)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,m=(e,t)=>{for(var r in t||(t={}))e1.call(t,r)&&B(e,r,t[r]);if($)for(var r of $(t))_1.call(t,r)&&B(e,r,t[r]);return e},P=(e,t)=>J(e,Q(t));import{j as t1,a as r1,F as a1,D as M,l as R,A as U,d as y,L as Z,b as f,c as u,y as l,S as s1}from"./vendor.js";const O1=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const O of a)if(O.type==="childList")for(const n of O.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function r(a){const O={};return a.integrity&&(O.integrity=a.integrity),a.referrerpolicy&&(O.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?O.credentials="include":a.crossorigin==="anonymous"?O.credentials="omit":O.credentials="same-origin",O}function s(a){if(a.ep)return;a.ep=!0;const O=r(a);fetch(a.href,O)}};O1();const o1="_statues_18cda_1";var n1={statues:o1};const _=t1,c=r1,i1=a1,Y=M({inVehicle:!1,health:200,armor:0,hunger:100,thirst:100,updateInVehicle:e=>{},updateHealth:e=>{},updateArmor:e=>{},updateHunger:e=>{},updateThirst:e=>{}}),U1=({children:e})=>{const[t,r]=R(!1),[s,a]=R(200),[O,n]=R(0),[o,L]=R(100),[C,d]=R(100),i=U(b=>r(b),[r]),D=U(b=>a(b),[a]),v=U(b=>n(b),[n]),E=U(b=>L(b),[L]),k=U(b=>d(b),[d]),X=y(function(){return{inVehicle:t,health:s,armor:O,hunger:o,thirst:C,updateInVehicle:i,updateHealth:D,updateArmor:v,updateHunger:E,updateThirst:k}},[t,s,O,o,C,i,D,v,E,k]);return _(Y.Provider,{value:X,children:e})},c1="modulepreload",F={},R1="/html/",g=function(t,r){return!r||r.length===0?t():Promise.all(r.map(s=>{if(s=`${R1}${s}`,s in F)return;F[s]=!0;const a=s.endsWith(".css"),O=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${O}`))return;const n=document.createElement("link");if(n.rel=a?"stylesheet":c1,a||(n.as="script",n.crossOrigin=""),n.href=s,document.head.appendChild(n),a)return new Promise((o,L)=>{n.addEventListener("load",o),n.addEventListener("error",L)})})).then(()=>t())},L1="_status_gpkxz_1",C1="_icon_gpkxz_17",g1="_progressbar_gpkxz_33",d1="_progress_gpkxz_33";var N={status:L1,icon:C1,progressbar:g1,progress:d1};const K=e=>_("svg",P(m({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 320 512"},e),{children:_("path",{fill:"currentColor",d:"M204.3 32.01H96c-52.94 0-96 43.06-96 96c0 17.67 14.31 31.1 32 31.1s32-14.32 32-31.1c0-17.64 14.34-32 32-32h108.3C232.8 96.01 256 119.2 256 147.8c0 19.72-10.97 37.47-30.5 47.33L127.8 252.4C117.1 258.2 112 268.7 112 280v40c0 17.67 14.31 31.99 32 31.99s32-14.32 32-31.99V298.3L256 251.3c39.47-19.75 64-59.42 64-103.5C320 83.95 268.1 32.01 204.3 32.01zM144 400c-22.09 0-40 17.91-40 40s17.91 39.1 40 39.1s40-17.9 40-39.1S166.1 400 144 400z"})}));var I=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:K});function l1(e){switch(e){case"../../../assets/needs/armor.tsx":return g(()=>import("./armor.js"),["assets/armor.js","assets/vendor.js"]);case"../../../assets/needs/health.tsx":return g(()=>import("./health.js"),["assets/health.js","assets/vendor.js"]);case"../../../assets/needs/hunger.tsx":return g(()=>import("./hunger.js"),["assets/hunger.js","assets/vendor.js"]);case"../../../assets/needs/thirst.tsx":return g(()=>import("./thirst.js"),["assets/thirst.js","assets/vendor.js"]);default:return new Promise(function(t,r){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}const T=({type:e,value:t,backgroundPrimary:r,backgroundSecondary:s})=>{const a=f(()=>l1(`../../../assets/needs/${e}.tsx`).catch(()=>g(()=>Promise.resolve().then(function(){return I}),void 0)));return(e==="hunger"||e==="thirst")&&t>=50||t===0&&e!=="hunger"&&e!=="thirst"?null:c("li",{class:N.status,children:[_(Z,{fallback:_(K,{class:N.icon}),children:_(a,{class:N.icon})}),_("div",{class:N.progressbar,style:{background:r},children:_("div",{class:N.progress,style:{background:s,width:`${t}%`}})})]})},E1=()=>{const{hunger:e,thirst:t,updateHealth:r,updateArmor:s,updateHunger:a,updateThirst:O}=u(Y),n=U(o=>{o.data.action==="update_needs"&&(o.data.health!==void 0&&r(o.data.health),o.data.armor!==void 0&&s(o.data.armor),o.data.hunger!==void 0&&a(o.data.hunger),o.data.thirst!==void 0&&O(o.data.thirst))},[]);return l(()=>(window.addEventListener("message",n),()=>window.removeEventListener("message",n)),[]),c("ul",{class:n1.statues,children:[_(T,{type:"weed",value:0,backgroundPrimary:"rgba(79, 228, 30, 0.4)",backgroundSecondary:"linear-gradient(to top, rgba(37, 228, 30, 0.6) 31%, rgba(97, 243, 91, 0.6) 100%)"}),_(T,{type:"drunk",value:0,backgroundPrimary:"rgba(228, 30, 53, 0.4)",backgroundSecondary:"linear-gradient(to top, rgba(228, 30, 47, 0.6) 31%, rgba(241, 78, 92, 0.6) 100%)"}),_(T,{type:"hunger",value:e,backgroundPrimary:"rgba(251, 140, 0, 0.4)",backgroundSecondary:"linear-gradient(to top, rgba(251, 140, 0, 0.6) 31%, rgba(255, 168, 55, 0.6) 100%)"}),_(T,{type:"thirst",value:t,backgroundPrimary:"rgba(30, 135, 228, 0.4)",backgroundSecondary:"linear-gradient(to top, rgba(30, 135, 228, 0.6) 31%, rgba(94, 165, 239, 0.6) 100%)"})]})},D1="_speedometer_1008f_1",b1="_seatbelt_1008f_23",H1="_belt_1008f_39",u1="_nobelt_1008f_45",A1="_icon_1008f_53",h1="_gauge_1008f_63";var A={speedometer:D1,seatbelt:b1,belt:H1,nobelt:u1,icon:A1,gauge:h1};const p1="_lights_1oxb6_1",T1="_icon_1oxb6_8";var G={lights:p1,icon:T1};const m1=e=>c("svg",P(m({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 20",fill:"currentColor"},e),{children:[_("path",{d:"M14.6479 0C11.831 0 9.78873 4.11972 9.78873 9.82394C9.78873 16.0563 11.5493 19.6479 14.6479 19.6479C20.0704 19.6479 24.4718 15.2465 24.4718 9.82394C24.4718 4.40141 20.0704 0 14.6479 0ZM22.7113 9.82394C22.7113 14.2606 19.0845 17.8873 14.6479 17.8873C12.7465 17.8873 11.5493 14.7887 11.5493 9.82394C11.5493 5 13.169 1.76056 14.6479 1.76056C19.0845 1.76056 22.7113 5.38732 22.7113 9.82394Z"}),_("path",{d:"M0.880277 5.38729C0.950699 5.38729 1.02112 5.38729 1.09154 5.35208L8.20422 3.48588C8.41549 3.41546 8.62676 3.27461 8.73239 3.06335C8.83802 2.85208 8.87323 2.64081 8.83802 2.39433C8.7676 2.18306 8.62676 1.9718 8.41549 1.86616C8.20422 1.72532 7.99295 1.72532 7.74647 1.76053L0.669009 3.62673C0.211262 3.76757 -0.0704279 4.22532 0.035206 4.71828C0.14084 5.1056 0.492952 5.38729 0.880277 5.38729Z"}),_("path",{d:"M8.41549 6.72528C8.20422 6.61965 7.99295 6.58444 7.74648 6.61965L0.66901 8.52106C0.457743 8.59148 0.246475 8.73233 0.140841 8.94359C0.0352074 9.15486 -3.86871e-06 9.36613 0.0352074 9.61261C0.140841 9.99993 0.492954 10.2816 0.880278 10.2816C0.9507 10.2816 1.02112 10.2816 1.09155 10.2464L8.20422 8.38021C8.41549 8.30979 8.62676 8.16895 8.73239 7.95768C8.83802 7.74641 8.87324 7.49993 8.83802 7.28866C8.7676 7.04219 8.62676 6.86613 8.41549 6.72528Z"}),_("path",{d:"M7.74647 11.5141L0.669009 13.4155C0.211262 13.5564 -0.0704279 14.0141 0.035206 14.5071C0.14084 14.8592 0.492952 15.1409 0.880277 15.1409C0.950699 15.1409 1.02112 15.1409 1.09154 15.1057L8.20422 13.2395C8.41549 13.169 8.62676 13.0282 8.73239 12.8169C8.83802 12.6057 8.87323 12.3944 8.83802 12.1479C8.69718 11.6902 8.23943 11.4085 7.74647 11.5141Z"}),_("path",{d:"M8.41549 16.5141C8.20422 16.4085 7.95774 16.3733 7.74647 16.4085L0.669009 18.2747C0.211262 18.4155 -0.0704279 18.8733 0.035206 19.3662C0.14084 19.7535 0.492952 20.0352 0.880277 20.0352C0.950699 20.0352 1.02112 20.0352 1.09154 20L8.20422 18.1338C8.41549 18.0634 8.62676 17.9226 8.73239 17.7113C8.83802 17.5 8.87323 17.2888 8.83802 17.0423C8.80281 16.7958 8.62676 16.6197 8.41549 16.5141Z"})]})),P1=e=>c("svg",P(m({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 20",fill:"currentColor"},e),{children:[_("path",{d:"M14.7312 0C11.8638 0 9.78494 4.19355 9.78494 10C9.78494 16.3441 11.5771 20 14.7312 20C20.2509 20 24.7312 15.5197 24.7312 10C24.767 4.48029 20.2509 0 14.7312 0ZM14.7312 18.2079C12.7957 18.2079 11.5771 15.0538 11.5771 10C11.6129 5.08961 13.2258 1.79211 14.7312 1.79211C19.2473 1.79211 22.9391 5.48387 22.9391 10C22.9391 14.5161 19.2832 18.2079 14.7312 18.2079Z"}),_("path",{d:"M8.1362 1.14697H0.896057C0.394265 1.14697 0 1.57708 0 2.04303C0 2.50898 0.394265 2.93909 0.896057 2.93909H8.1362C8.63799 2.93909 9.03226 2.54482 9.03226 2.04303C9.03226 1.54124 8.60215 1.14697 8.1362 1.14697Z"}),_("path",{d:"M8.1362 6.45166H0.896057C0.394265 6.45166 0 6.84593 0 7.34772C0 7.84951 0.394265 8.24378 0.896057 8.24378H8.1362C8.63799 8.24378 9.03226 7.84951 9.03226 7.34772C9.03226 6.84593 8.60215 6.45166 8.1362 6.45166Z"}),_("path",{d:"M8.1362 11.7563H0.896057C0.394265 11.7563 0 12.1506 0 12.6524C0 13.1542 0.394265 13.5485 0.896057 13.5485H8.1362C8.63799 13.5485 9.03226 13.1542 9.03226 12.6524C9.03226 12.1506 8.60215 11.7563 8.1362 11.7563Z"}),_("path",{d:"M8.1362 17.0608H0.896057C0.394265 17.0608 0 17.4551 0 17.9568C0 18.4586 0.394265 18.8529 0.896057 18.8529H8.1362C8.63799 18.8529 9.03226 18.4586 9.03226 17.9568C9.03226 17.4551 8.60215 17.0608 8.1362 17.0608Z"})]})),N1=({state:e})=>_("div",{class:G.lights,children:e<=1?_(m1,{class:G.icon,style:{color:e===1?"#2ecc71":""}}):_(P1,{class:G.icon,style:{color:"#0984e3"}})}),f1="_fuel_1rwl3_1";var I1={fuel:f1};const v1=({value:e})=>{const t=()=>e<=25?"#0e2e04":e<=35?"#23740c":"#ffffff";return c("svg",{class:I1.fuel,width:"50",height:"50",children:[_("path",{d:"M8.43982 33C4.50943 29.7974 2 24.9236 2 19.4648C2 9.81925 9.83502 2 19.5 2C29.165 2 37 9.81925 37 19.4648C37 24.9236 34.4906 29.7974 30.5602 33",fill:"none",stroke:"white","stroke-width":"3","stroke-opacity":"0.2"}),_("path",{d:"M8.43982 33C4.50943 29.7974 2 24.9236 2 19.4648C2 9.81925 9.83502 2 19.5 2C29.165 2 37 9.81925 37 19.4648C37 24.9236 34.4906 29.7974 30.5602 33",fill:"none",stroke:t(),"stroke-width":"3","stroke-opacity":"0.6","stroke-dasharray":"100",style:{strokeDashoffset:100-e}}),_("g",{opacity:"1","clip-path":"url(#clip0)",children:_("path",{d:"M9.2084 4.27568V1.82575V1.59168V0.920676C9.2084 0.795839 9.09531 0.686606 8.96607 0.686606C8.83683 0.686606 8.72375 0.795839 8.72375 0.920676V1.56047C8.65913 1.90377 8.43296 2.85566 8.01292 3.24577C7.96446 3.29259 7.9483 3.35501 7.9483 3.41743V3.90117C7.9483 4.02601 8.06139 4.13524 8.19063 4.13524H8.72375V4.44733V4.46294C8.72375 4.58778 8.83683 4.69701 8.96607 4.69701C9.27302 4.69701 9.51535 4.93108 9.51535 5.22757V9.58127C9.51535 9.87776 9.27302 10.1118 8.96607 10.1118C8.65913 10.1118 8.4168 9.87776 8.4168 9.58127V8.20806C8.4168 8.08322 8.30371 7.97399 8.17447 7.97399H7.67367V4.43173C7.67367 4.22887 7.57674 4.04161 7.4475 3.91677V0.905072C7.4475 0.405722 7.02746 0 6.5105 0H1.69628C1.17932 0 0.759289 0.405722 0.759289 0.905072V3.91677C0.613893 4.04161 0.533118 4.22887 0.533118 4.43173V11.5319H0.242326C0.113086 11.5319 0 11.6411 0 11.7659C0 11.8908 0.113086 12 0.242326 12H0.759289H7.1567H7.9483C8.07754 12 8.19063 11.8908 8.19063 11.7659C8.19063 11.6411 8.07754 11.5319 7.9483 11.5319H7.65751V8.45774H7.91599V9.59688C7.91599 10.143 8.38449 10.5956 8.94992 10.5956C9.51535 10.5956 9.98384 10.143 9.98384 9.59688V5.24317C10 4.77503 9.66074 4.36931 9.2084 4.27568ZM1.69628 0.780234H6.5105C6.57512 0.780234 6.63974 0.842653 6.63974 0.905072V3.72952H1.56704V0.905072C1.56704 0.842653 1.63166 0.780234 1.69628 0.780234Z",fill:"white"})})]})},M1="_display_131f4_8",y1="_speed_131f4_22",Y1="_gauge_131f4_27";var w={display:M1,speed:y1,gauge:Y1};const G1=({value:e})=>{const t=e>200?200:e;return c(i1,{children:[c("svg",{class:w.gauge,width:"100",height:"100",children:[_("path",{d:"M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82",fill:"none",stroke:"white","stroke-width":"4","stroke-opacity":"0.2"}),_("path",{d:"M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82",className:"progress",fill:"none",stroke:"url(#gradient)","stroke-width":"4","stroke-opacity":"0.6","stroke-dasharray":"200",style:{strokeDashoffset:-(200-t)}}),_("defs",{children:c("linearGradient",{id:"gradient",children:[_("stop",{offset:"10%","stop-color":"rgba(255, 255, 255, .8)"}),_("stop",{offset:"100%","stop-color":"#23740c"})]})})]}),c("div",{class:w.display,children:[_("span",{class:w.speed,children:e}),_("span",{children:"km/h"})]})]})},j=M({speed:0,fuel:0,seatbelt:!1,lightState:0,updateSpeed:e=>{},updateFuel:e=>{},updateSeatbelt:e=>{},updateLightState:e=>{}}),w1=({children:e})=>{const[t,r]=R(0),[s,a]=R(0),[O,n]=R(!1),[o,L]=R(0),C=U(E=>r(E),[r]),d=U(E=>a(E),[a]),i=U(E=>n(E),[n]),D=U(E=>L(E),[L]),v=y(function(){return{speed:t,fuel:s,seatbelt:O,lightState:o,updateSpeed:C,updateFuel:d,updateSeatbelt:i,updateLightState:D}},[t,s,O,o,C,d,i,D]);return _(j.Provider,{value:v,children:e})},S1=e=>_("svg",P(m({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19 23"},e),{children:_("path",{fill:"currentColor",d:"M4.39905 12.514C4.31405 6.69301 8.14802 6.74699 8.49902 6.32199C8.63704 6.13212 8.73285 5.91494 8.78003 5.685C8.23672 5.46105 7.77321 5.07905 7.44958 4.58853C7.12596 4.09801 6.95721 3.52159 6.96509 2.93399C6.94481 2.55584 7.00182 2.17752 7.13257 1.82211C7.26332 1.4667 7.46507 1.14165 7.72558 0.866791C7.9861 0.591935 8.29981 0.373044 8.6477 0.22345C8.9956 0.0738557 9.37033 -0.0032959 9.74902 -0.0032959C10.1277 -0.0032959 10.5024 0.0738557 10.8503 0.22345C11.1982 0.373044 11.5121 0.591935 11.7726 0.866791C12.0331 1.14165 12.2348 1.4667 12.3656 1.82211C12.4963 2.17752 12.5534 2.55584 12.5331 2.93399C12.5407 3.52179 12.3715 4.09832 12.0475 4.58884C11.7235 5.07935 11.2597 5.46125 10.7161 5.685C10.7625 5.91536 10.8587 6.13277 10.998 6.32199C11.0297 6.35626 11.0682 6.38353 11.1111 6.40201C8.73375 8.28008 6.49089 10.3224 4.39905 12.514V12.514ZM4.63513 15.574C5.20213 19.874 6.56608 21.898 7.28808 22.115C7.61387 22.2444 7.96804 22.2856 8.31482 22.2343C8.66159 22.183 8.98866 22.0411 9.26306 21.823C9.78606 20.985 6.78211 17.561 7.51611 16.941C8.9775 16.5456 10.5177 16.5456 11.9791 16.941C12.7131 17.561 9.71113 20.984 10.2341 21.823C10.5084 22.0413 10.8354 22.1833 11.1823 22.2346C11.5291 22.2859 11.8834 22.2446 12.2091 22.115C12.9091 21.901 14.2401 19.945 14.8251 15.815C11.4452 15.3694 8.02727 15.2886 4.63013 15.574H4.63513ZM6.36011 13.396C9.25762 13.2475 12.1627 13.3711 15.0371 13.765C15.0561 13.471 15.0741 13.165 15.0861 12.857C15.2151 9.67799 14.2201 8.15699 13.1771 7.36899C10.7603 9.20913 8.48154 11.2239 6.35913 13.397L6.36011 13.396ZM17.1731 4.63101C17.4006 4.48505 17.5637 4.25767 17.6291 3.99539C17.6946 3.73311 17.6573 3.45573 17.525 3.22C17.4649 3.10489 17.3818 3.00335 17.2809 2.92163C17.1799 2.83991 17.0632 2.77977 16.9381 2.7449C16.813 2.71004 16.6821 2.7012 16.5535 2.71893C16.4248 2.73667 16.3011 2.78058 16.1901 2.84799C14.4295 3.93319 12.7334 5.11952 11.1101 6.401C11.843 6.62086 12.5398 6.94698 13.1781 7.36899C14.4301 6.42299 15.7661 5.49599 17.1721 4.63199L17.1731 4.63101ZM17.2891 14.183C16.5481 14.012 15.7891 13.876 15.0381 13.765C14.9891 14.503 14.915 15.186 14.826 15.819C15.518 15.919 16.203 16.046 16.878 16.201C16.9467 16.2163 17.0167 16.224 17.087 16.224C17.3156 16.2189 17.5355 16.135 17.7093 15.9865C17.8832 15.838 18.0004 15.634 18.0411 15.409C18.1001 15.1469 18.0544 14.8722 17.9137 14.6433C17.773 14.4145 17.5486 14.2497 17.2881 14.184L17.2891 14.183ZM4.44214 13.514C4.43014 13.297 4.4171 13.081 4.4071 12.856C4.4071 12.737 4.40705 12.626 4.39905 12.513C4.03805 12.892 3.69912 13.259 3.37512 13.613C2.63312 14.423 2.01409 15.141 1.52209 15.732C0.728093 16.686 0.272053 17.298 0.206053 17.388C0.0466903 17.6066 -0.0240362 17.8774 0.00805537 18.146C0.0401469 18.4146 0.172653 18.6611 0.379027 18.836C0.547822 18.9757 0.760016 19.0524 0.979125 19.053C1.13071 19.0523 1.27997 19.0156 1.41467 18.9461C1.54938 18.8766 1.6656 18.7761 1.75403 18.653C1.77703 18.621 2.68109 17.407 4.29309 15.605L4.63513 15.577C4.62313 15.477 4.61002 15.371 4.59802 15.267C4.53002 14.715 4.47704 14.135 4.44104 13.515L4.44214 13.514Z"})})),V1=()=>{const{inVehicle:e,updateInVehicle:t}=u(Y),{speed:r,fuel:s,seatbelt:a,lightState:O,updateSpeed:n,updateFuel:o,updateSeatbelt:L,updateLightState:C}=u(j),d=U(i=>{if(i.data.action==="speedometer")t(i.data.show);else if(i.data.action==="update_vehicle"&&(i.data.speed!==void 0&&n(i.data.speed),i.data.fuel!==void 0&&o(i.data.fuel),i.data.haveSeatbelt!==void 0&&L(i.data.haveSeatbelt),i.data.haveLight!==void 0)){let D=0;i.data.haveLight&&i.data.highBeamsOn?D=2:i.data.haveLight&&i.data.lightsOn&&(D=1),C(D)}},[]);return l(()=>(window.addEventListener("message",d),()=>window.removeEventListener("message",d)),[]),c("div",{class:A.speedometer,style:{transition:"opacity .5s",opacity:e?1:0},children:[_("div",{class:`${A.seatbelt} ${a?A.belt:A.nobelt}`,children:_(S1,{class:A.icon})}),c("div",{class:A.gauge,children:[_(G1,{value:r}),_(v1,{value:s})]}),_(N1,{state:O})]})},K1="_voiceInfo_1548r_1",x1="_icon_1548r_15";var h={voiceInfo:K1,icon:x1,"display-in":"_display-in_1548r_1"};const z=M({voiceMode:0,updateVoiceMode:e=>{}}),k1=({children:e})=>{const[t,r]=R(0),s=U(O=>r(O),[r]),a=y(function(){return{voiceMode:t,updateVoiceMode:s}},[t,s]);return _(z.Provider,{value:a,children:e})};function $1(){const{voiceMode:e,updateVoiceMode:t}=u(z),r=f(()=>g(()=>import("./mute.js"),["assets/mute.js","assets/vendor.js"]).catch(()=>g(()=>Promise.resolve().then(function(){return I}),void 0))),s=f(()=>g(()=>import("./whisper.js"),["assets/whisper.js","assets/vendor.js"]).catch(()=>g(()=>Promise.resolve().then(function(){return I}),void 0))),a=f(()=>g(()=>import("./normal.js"),["assets/normal.js","assets/vendor.js"]).catch(()=>g(()=>Promise.resolve().then(function(){return I}),void 0))),O=f(()=>g(()=>import("./shouting.js"),["assets/shouting.js","assets/vendor.js"]).catch(()=>g(()=>Promise.resolve().then(function(){return I}),void 0))),n=U(o=>{o.data.action==="voiceMode"&&t(o.data.voiceMode)},[]);return l(()=>(window.addEventListener("message",n),()=>window.removeEventListener("message",n)),[]),_("div",{class:h.voiceInfo,children:c(Z,{fallback:_(K,{class:h.icon}),children:[e===-1&&_(r,{class:h.icon}),e===0&&_(s,{class:h.icon}),e===1&&_(a,{class:h.icon}),e===2&&_(O,{class:h.icon})]})})}const x=M({minimap:{},updateMinimap:e=>{}}),B1=({children:e})=>{const[t,r]=R({X:.08091666683321,Y:.88549252311906,bottomY:.97361377796573,height:.17624250969333,leftX:.01060416735708,rightX:.15122916630934,topY:.79737126827239,width:.14062499895226}),s=U(O=>r(O),[r]),a=y(function(){return{minimap:t,updateMinimap:s}},[t,s]);return _(x.Provider,{value:a,children:e})},F1=()=>{const{minimap:e,updateMinimap:t}=u(x),{inVehicle:r,health:s,armor:a}=u(Y),O=U(n=>{n.data.action==="hud_minimap_pos"&&n.data.data!==void 0&&t(n.data.data)},[]);return l(()=>(window.addEventListener("message",O),()=>window.removeEventListener("message",O)),[]),c("div",{style:{position:"absolute",display:"grid",gap:".3rem",gridTemplateColumns:"repeat(2, 1fr)",padding:"0 .5rem",width:`calc(100vw * ${e.width})`,top:`calc((100vh * ${e.bottomY}) - .5rem )`,left:`calc(100vw * ${e.leftX})`},children:[(r||s-100<=50)&&_(T,{type:"health",value:s-100,backgroundPrimary:"rgba(60,152,30,0.5)",backgroundSecondary:"linear-gradient(to top, rgba(71,190,32,0.6) 31%, rgba(79,228,30,0.6) 100%)"}),r&&_(T,{type:"armor",value:a,backgroundPrimary:"rgba(19,90,128,0.5)",backgroundSecondary:"linear-gradient(to top, rgba(19,120,187,0.6) 31%, rgba(23,147,218,0.6) 100%)"})]})},W1="_container_1w6zg_1";var Z1={container:W1};const j1="_notification_t6bic_1",z1="_slideIn_t6bic_33",X1="_slideOut_t6bic_39",q1="_header_t6bic_56",J1="_header_text_t6bic_68",Q1="_text_t6bic_75";var p={notification:j1,slideIn:z1,slideOut:X1,header:q1,header_text:J1,text:Q1};const W={r:"rgba(255, 0, 0, 255)",b:"rgba(93, 182, 229, 255)",y:"rgba(240, 200, 80, 255)",s:"rgba(240, 240, 240, 255)",g:"rgba(114, 204, 114, 255)",o:"rgba(255, 133, 85, 255)",p:"rgba(132, 102, 226, 255)",c:"rgba(155, 155, 155, 255)",m:"rgba(77, 77, 77, 255)",u:"rgba(0, 0, 0, 255)",HUD_COLOUR_PURE_WHITE:"rgba(255, 255, 255, 255)",HUD_COLOUR_WHITE:"rgba(240, 240, 240, 255)",HUD_COLOUR_BLACK:"rgba(0, 0, 0, 255)",HUD_COLOUR_GREY:"rgba(155, 155, 155, 255)",HUD_COLOUR_GREYLIGHT:"rgba(205, 205, 205, 255)",HUD_COLOUR_GREYDARK:"rgba(77, 77, 77, 255)",HUD_COLOUR_RED:"rgba(224, 50, 50, 255)",HUD_COLOUR_REDLIGHT:"rgba(240, 153, 153, 255)",HUD_COLOUR_REDDARK:"rgba(112, 25, 25, 255)",HUD_COLOUR_BLUE:"rgba(93, 182, 229, 255)",HUD_COLOUR_BLUELIGHT:"rgba(174, 219, 242, 255)",HUD_COLOUR_BLUEDARK:"rgba(47, 92, 115, 255)",HUD_COLOUR_YELLOW:"rgba(240, 200, 80, 255)",HUD_COLOUR_YELLOWLIGHT:"rgba(254, 235, 169, 255)",HUD_COLOUR_YELLOWDARK:"rgba(126, 107, 41, 255)",HUD_COLOUR_ORANGE:"rgba(255, 133, 85, 255)",HUD_COLOUR_ORANGELIGHT:"rgba(255, 194, 170, 255)",HUD_COLOUR_ORANGEDARK:"rgba(127, 66, 42, 255)",HUD_COLOUR_GREEN:"rgba(114, 204, 114, 255)",HUD_COLOUR_GREENLIGHT:"rgba(185, 230, 185, 255)",HUD_COLOUR_GREENDARK:"rgba(57, 102, 57, 255)",HUD_COLOUR_PURPLE:"rgba(132, 102, 226, 255)",HUD_COLOUR_PURPLELIGHT:"rgba(192, 179, 239, 255)",HUD_COLOUR_PURPLEDARK:"rgba(67, 57, 111, 255)",HUD_COLOUR_PINK:"rgba(203, 54, 148, 255)",HUD_COLOUR_RADAR_HEALTH:"rgba(53, 154, 71, 255)",HUD_COLOUR_RADAR_ARMOUR:"rgba(93, 182, 229, 255)",HUD_COLOUR_RADAR_DAMAGE:"rgba(235, 36, 39, 255)",HUD_COLOUR_NET_PLAYER1:"rgba(194, 80, 80, 255)",HUD_COLOUR_NET_PLAYER2:"rgba(156, 110, 175, 255)",HUD_COLOUR_NET_PLAYER3:"rgba(255, 123, 196, 255)",HUD_COLOUR_NET_PLAYER4:"rgba(247, 159, 123, 255)",HUD_COLOUR_NET_PLAYER5:"rgba(178, 144, 132, 255)",HUD_COLOUR_NET_PLAYER6:"rgba(141, 206, 167, 255)",HUD_COLOUR_NET_PLAYER7:"rgba(113, 169, 175, 255)",HUD_COLOUR_NET_PLAYER8:"rgba(211, 209, 231, 255)",HUD_COLOUR_NET_PLAYER9:"rgba(144, 127, 153, 255)",HUD_COLOUR_NET_PLAYER10:"rgba(106, 196, 191, 255)",HUD_COLOUR_NET_PLAYER11:"rgba(214, 196, 153, 255)",HUD_COLOUR_NET_PLAYER12:"rgba(234, 142, 80, 255)",HUD_COLOUR_NET_PLAYER13:"rgba(152, 203, 234, 255)",HUD_COLOUR_NET_PLAYER14:"rgba(178, 98, 135, 255)",HUD_COLOUR_NET_PLAYER15:"rgba(144, 142, 122, 255)",HUD_COLOUR_NET_PLAYER16:"rgba(166, 117, 94, 255)",HUD_COLOUR_NET_PLAYER17:"rgba(175, 168, 168, 255)",HUD_COLOUR_NET_PLAYER18:"rgba(232, 142, 155, 255)",HUD_COLOUR_NET_PLAYER19:"rgba(187, 214, 91, 255)",HUD_COLOUR_NET_PLAYER20:"rgba(12, 123, 86, 255)",HUD_COLOUR_NET_PLAYER21:"rgba(123, 196, 255, 255)",HUD_COLOUR_NET_PLAYER22:"rgba(171, 60, 230, 255)",HUD_COLOUR_NET_PLAYER23:"rgba(206, 169, 13, 255)",HUD_COLOUR_NET_PLAYER24:"rgba(71, 99, 173, 255)",HUD_COLOUR_NET_PLAYER25:"rgba(42, 166, 185, 255)",HUD_COLOUR_NET_PLAYER26:"rgba(186, 157, 125, 255)",HUD_COLOUR_NET_PLAYER27:"rgba(201, 225, 255, 255)",HUD_COLOUR_NET_PLAYER28:"rgba(240, 240, 150, 255)",HUD_COLOUR_NET_PLAYER29:"rgba(237, 140, 161, 255)",HUD_COLOUR_NET_PLAYER30:"rgba(249, 138, 138, 255)",HUD_COLOUR_NET_PLAYER31:"rgba(252, 239, 166, 255)",HUD_COLOUR_NET_PLAYER32:"rgba(240, 240, 240, 255)",HUD_COLOUR_SIMPLEBLIP_DEFAULT:"rgba(159, 201, 166, 255)",HUD_COLOUR_MENU_BLUE:"rgba(140, 140, 140, 255)",HUD_COLOUR_MENU_GREY_LIGHT:"rgba(140, 140, 140, 255)",HUD_COLOUR_MENU_BLUE_EXTRA_DARK:"rgba(40, 40, 40, 255)",HUD_COLOUR_MENU_YELLOW:"rgba(240, 160, 0, 255)",HUD_COLOUR_MENU_YELLOW_DARK:"rgba(240, 160, 0, 255)",HUD_COLOUR_MENU_GREEN:"rgba(240, 160, 0, 255)",HUD_COLOUR_MENU_GREY:"rgba(140, 140, 140, 255)",HUD_COLOUR_MENU_GREY_DARK:"rgba(60, 60, 60, 255)",HUD_COLOUR_MENU_HIGHLIGHT:"rgba(30, 30, 30, 255)",HUD_COLOUR_MENU_STANDARD:"rgba(140, 140, 140, 255)",HUD_COLOUR_MENU_DIMMED:"rgba(75, 75, 75, 255)",HUD_COLOUR_MENU_EXTRA_DIMMED:"rgba(50, 50, 50, 255)",HUD_COLOUR_BRIEF_TITLE:"rgba(95, 95, 95, 255)",HUD_COLOUR_MID_GREY_MP:"rgba(100, 100, 100, 255)",HUD_COLOUR_NET_PLAYER1_DARK:"rgba(93, 39, 39, 255)",HUD_COLOUR_NET_PLAYER2_DARK:"rgba(77, 55, 89, 255)",HUD_COLOUR_NET_PLAYER3_DARK:"rgba(124, 62, 99, 255)",HUD_COLOUR_NET_PLAYER4_DARK:"rgba(120, 80, 80, 255)",HUD_COLOUR_NET_PLAYER5_DARK:"rgba(87, 72, 66, 255)",HUD_COLOUR_NET_PLAYER6_DARK:"rgba(74, 103, 83, 255)",HUD_COLOUR_NET_PLAYER7_DARK:"rgba(60, 85, 88, 255)",HUD_COLOUR_NET_PLAYER8_DARK:"rgba(105, 105, 64, 255)",HUD_COLOUR_NET_PLAYER9_DARK:"rgba(72, 63, 76, 255)",HUD_COLOUR_NET_PLAYER10_DARK:"rgba(53, 98, 95, 255)",HUD_COLOUR_NET_PLAYER11_DARK:"rgba(107, 98, 76, 255)",HUD_COLOUR_NET_PLAYER12_DARK:"rgba(117, 71, 40, 255)",HUD_COLOUR_NET_PLAYER13_DARK:"rgba(76, 101, 117, 255)",HUD_COLOUR_NET_PLAYER14_DARK:"rgba(65, 35, 47, 255)",HUD_COLOUR_NET_PLAYER15_DARK:"rgba(72, 71, 61, 255)",HUD_COLOUR_NET_PLAYER16_DARK:"rgba(85, 58, 47, 255)",HUD_COLOUR_NET_PLAYER17_DARK:"rgba(87, 84, 84, 255)",HUD_COLOUR_NET_PLAYER18_DARK:"rgba(116, 71, 77, 255)",HUD_COLOUR_NET_PLAYER19_DARK:"rgba(93, 107, 45, 255)",HUD_COLOUR_NET_PLAYER20_DARK:"rgba(6, 61, 43, 255)",HUD_COLOUR_NET_PLAYER21_DARK:"rgba(61, 98, 127, 255)",HUD_COLOUR_NET_PLAYER22_DARK:"rgba(85, 30, 115, 255)",HUD_COLOUR_NET_PLAYER23_DARK:"rgba(103, 84, 6, 255)",HUD_COLOUR_NET_PLAYER24_DARK:"rgba(35, 49, 86, 255)",HUD_COLOUR_NET_PLAYER25_DARK:"rgba(21, 83, 92, 255)",HUD_COLOUR_NET_PLAYER26_DARK:"rgba(93, 98, 62, 255)",HUD_COLOUR_NET_PLAYER27_DARK:"rgba(100, 112, 127, 255)",HUD_COLOUR_NET_PLAYER28_DARK:"rgba(120, 120, 75, 255)",HUD_COLOUR_NET_PLAYER29_DARK:"rgba(152, 76, 93, 255)",HUD_COLOUR_NET_PLAYER30_DARK:"rgba(124, 69, 69, 255)",HUD_COLOUR_NET_PLAYER31_DARK:"rgba(10, 43, 50, 255)",HUD_COLOUR_NET_PLAYER32_DARK:"rgba(95, 95, 10, 255)",HUD_COLOUR_BRONZE:"rgba(180, 130, 97, 255)",HUD_COLOUR_SILVER:"rgba(150, 153, 161, 255)",HUD_COLOUR_GOLD:"rgba(214, 181, 99, 255)",HUD_COLOUR_PLATINUM:"rgba(166, 221, 190, 255)",HUD_COLOUR_GANG1:"rgba(29, 100, 153, 255)",HUD_COLOUR_GANG2:"rgba(214, 116, 15, 255)",HUD_COLOUR_GANG3:"rgba(135, 125, 142, 255)",HUD_COLOUR_GANG4:"rgba(229, 119, 185, 255)",HUD_COLOUR_SAME_CREW:"rgba(252, 239, 166, 255)",HUD_COLOUR_FREEMODE:"rgba(45, 110, 185, 255)",HUD_COLOUR_PAUSE_BG:"rgba(0, 0, 0, 186)",HUD_COLOUR_FRIENDLY:"rgba(93, 182, 229, 255)",HUD_COLOUR_ENEMY:"rgba(194, 80, 80, 255)",HUD_COLOUR_LOCATION:"rgba(240, 200, 80, 255)",HUD_COLOUR_PICKUP:"rgba(114, 204, 114, 255)",HUD_COLOUR_PAUSE_SINGLEPLAYER:"rgba(114, 204, 114, 255)",HUD_COLOUR_FREEMODE_DARK:"rgba(22, 55, 92, 255)",HUD_COLOUR_INACTIVE_MISSION:"rgba(154, 154, 154, 255)",HUD_COLOUR_DAMAGE:"rgba(194, 80, 80, 255)",HUD_COLOUR_PINKLIGHT:"rgba(252, 115, 201, 255)",HUD_COLOUR_PM_MITEM_HIGHLIGHT:"rgba(252, 177, 49, 255)",HUD_COLOUR_SCRIPT_VARIABLE:"rgba(0, 0, 0, 255)",HUD_COLOUR_YOGA:"rgba(109, 247, 204, 255)",HUD_COLOUR_TENNIS:"rgba(241, 101, 34, 255)",HUD_COLOUR_GOLF:"rgba(214, 189, 97, 255)",HUD_COLOUR_SHOOTING_RANGE:"rgba(112, 25, 25, 255)",HUD_COLOUR_FLIGHT_SCHOOL:"rgba(47, 92, 115, 255)",HUD_COLOUR_NORTH_BLUE:"rgba(93, 182, 229, 255)",HUD_COLOUR_SOCIAL_CLUB:"rgba(234, 153, 28, 255)",HUD_COLOUR_PLATFORM_BLUE:"rgba(11, 55, 123, 255)",HUD_COLOUR_PLATFORM_GREEN:"rgba(146, 200, 62, 255)",HUD_COLOUR_PLATFORM_GREY:"rgba(234, 153, 28, 255)",HUD_COLOUR_FACEBOOK_BLUE:"rgba(66, 89, 148, 255)",HUD_COLOUR_INGAME_BG:"rgba(0, 0, 0, 186)",HUD_COLOUR_DARTS:"rgba(114, 204, 114, 255)",HUD_COLOUR_WAYPOINT:"rgba(164, 76, 242, 255)",HUD_COLOUR_MICHAEL:"rgba(101, 180, 212, 255)",HUD_COLOUR_FRANKLIN:"rgba(171, 237, 171, 255)",HUD_COLOUR_TREVOR:"rgba(255, 163, 87, 255)",HUD_COLOUR_GOLF_P1:"rgba(240, 240, 240, 255)",HUD_COLOUR_GOLF_P2:"rgba(235, 239, 30, 255)",HUD_COLOUR_GOLF_P3:"rgba(255, 149, 14, 255)",HUD_COLOUR_GOLF_P4:"rgba(246, 60, 161, 255)",HUD_COLOUR_WAYPOINTLIGHT:"rgba(210, 166, 249, 255)",HUD_COLOUR_WAYPOINTDARK:"rgba(82, 38, 121, 255)",HUD_COLOUR_PANEL_LIGHT:"rgba(0, 0, 0, 77)",HUD_COLOUR_MICHAEL_DARK:"rgba(72, 103, 116, 255)",HUD_COLOUR_FRANKLIN_DARK:"rgba(85, 118, 85, 255)",HUD_COLOUR_TREVOR_DARK:"rgba(127, 81, 43, 255)",HUD_COLOUR_OBJECTIVE_ROUTE:"rgba(240, 200, 80, 255)",HUD_COLOUR_PAUSEMAP_TINT:"rgba(0, 0, 0, 215)",HUD_COLOUR_PAUSE_DESELECT:"rgba(100, 100, 100, 127)",HUD_COLOUR_PM_WEAPONS_PURCHASABLE:"rgba(45, 110, 185, 255)",HUD_COLOUR_PM_WEAPONS_LOCKED:"rgba(240, 240, 240, 191)",HUD_COLOUR_END_SCREEN_BG:"rgba(0, 0, 0, 186)",HUD_COLOUR_CHOP:"rgba(255, 0, 0, 255)",HUD_COLOUR_PAUSEMAP_TINT_HALF:"rgba(0, 0, 0, 215)",HUD_COLOUR_NORTH_BLUE_OFFICIAL:"rgba(0, 71, 133, 255)",HUD_COLOUR_SCRIPT_VARIABLE_2:"rgba(0, 0, 0, 255)",HUD_COLOUR_H:"rgba(33, 118, 37, 255)",HUD_COLOUR_HDARK:"rgba(37, 102, 40, 255)",HUD_COLOUR_T:"rgba(234, 153, 28, 255)",HUD_COLOUR_TDARK:"rgba(225, 140, 8, 255)",HUD_COLOUR_HSHARD:"rgba(20, 40, 0, 255)",HUD_COLOUR_CONTROLLER_MICHAEL:"rgba(48, 255, 255, 255)",HUD_COLOUR_CONTROLLER_FRANKLIN:"rgba(48, 255, 0, 255)",HUD_COLOUR_CONTROLLER_TREVOR:"rgba(176, 80, 0, 255)",HUD_COLOUR_CONTROLLER_CHOP:"rgba(127, 0, 0, 255)",HUD_COLOUR_VIDEO_EDITOR_VIDEO:"rgba(53, 166, 224, 255)",HUD_COLOUR_VIDEO_EDITOR_AUDIO:"rgba(162, 79, 157, 255)",HUD_COLOUR_VIDEO_EDITOR_TEXT:"rgba(104, 192, 141, 255)",HUD_COLOUR_HB_BLUE:"rgba(29, 100, 153, 255)",HUD_COLOUR_HB_YELLOW:"rgba(234, 153, 28, 255)",HUD_COLOUR_VIDEO_EDITOR_SCORE:"rgba(240, 160, 1, 255)",HUD_COLOUR_VIDEO_EDITOR_AUDIO_FADEOUT:"rgba(59, 34, 57, 255)",HUD_COLOUR_VIDEO_EDITOR_TEXT_FADEOUT:"rgba(41, 68, 53, 255)",HUD_COLOUR_VIDEO_EDITOR_SCORE_FADEOUT:"rgba(82, 58, 10, 255)",HUD_COLOUR_HEIST_BACKGROUND:"rgba(37, 102, 40, 186)",HUD_COLOUR_VIDEO_EDITOR_AMBIENT:"rgba(240, 200, 80, 255)",HUD_COLOUR_VIDEO_EDITOR_AMBIENT_FADEOUT:"rgba(80, 70, 34, 255)",HUD_COLOUR_VIDEO_EDITOR_AMBIENT_DARK:"rgba(255, 133, 85, 255)",HUD_COLOUR_VIDEO_EDITOR_AMBIENT_LIGHT:"rgba(255, 194, 170, 255)",HUD_COLOUR_VIDEO_EDITOR_AMBIENT_MID:"rgba(255, 133, 85, 255)",HUD_COLOUR_LOW_FLOW:"rgba(240, 200, 80, 255)",HUD_COLOUR_LOW_FLOW_DARK:"rgba(126, 107, 41, 255)",HUD_COLOUR_G1:"rgba(247, 159, 123, 255)",HUD_COLOUR_G2:"rgba(226, 134, 187, 255)",HUD_COLOUR_G3:"rgba(239, 238, 151, 255)",HUD_COLOUR_G4:"rgba(113, 169, 175, 255)",HUD_COLOUR_G5:"rgba(160, 140, 193, 255)",HUD_COLOUR_G6:"rgba(141, 206, 167, 255)",HUD_COLOUR_G7:"rgba(181, 214, 234, 255)",HUD_COLOUR_G8:"rgba(178, 144, 132, 255)",HUD_COLOUR_G9:"rgba(0, 132, 114, 255)",HUD_COLOUR_G10:"rgba(216, 85, 117, 255)",HUD_COLOUR_G11:"rgba(30, 100, 152, 255)",HUD_COLOUR_G12:"rgba(43, 181, 117, 255)",HUD_COLOUR_G13:"rgba(233, 141, 79, 255)",HUD_COLOUR_G14:"rgba(137, 210, 215, 255)",HUD_COLOUR_G15:"rgba(134, 125, 141, 255)",HUD_COLOUR_ADVERSARY:"rgba(109, 34, 33, 255)",HUD_COLOUR_DEGEN_RED:"rgba(255, 0, 0, 255)",HUD_COLOUR_DEGEN_YELLOW:"rgba(255, 255, 0, 255)",HUD_COLOUR_DEGEN_GREEN:"rgba(0, 255, 0, 255)",HUD_COLOUR_DEGEN_CYAN:"rgba(0, 255, 255, 255)",HUD_COLOUR_DEGEN_BLUE:"rgba(0, 0, 255, 255)",HUD_COLOUR_DEGEN_MAGENTA:"rgba(255, 0, 255, 255)",HUD_COLOUR_STUNT_1:"rgba(38, 136, 234, 255)",HUD_COLOUR_STUNT_2:"rgba(255, 0, 0, 255)",HUD_COLOUR_SPECIAL_RACE_SERIES:"rgba(154, 178, 54, 255)",HUD_COLOUR_SPECIAL_RACE_SERIES_DARK:"rgba(93, 107, 45, 255)",HUD_COLOUR_CS:"rgba(206, 169, 13, 255)",HUD_COLOUR_CS_DARK:"rgba(103, 84, 6, 255)",HUD_COLOUR_TECH_GREEN:"rgba(0, 151, 151, 255)",HUD_COLOUR_TECH_GREEN_DARK:"rgba(5, 119, 113, 255)",HUD_COLOUR_TECH_RED:"rgba(151, 0, 0, 255)",HUD_COLOUR_TECH_GREEN_VERY_DARK:"rgba(0, 40, 40, 255)",HUD_COLOUR_PLACEHOLDER_01:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_02:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_03:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_04:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_05:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_06:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_07:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_08:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_09:"rgba(255, 255, 255, 255)",HUD_COLOUR_PLACEHOLDER_10:"rgba(255, 255, 255, 255)"},S=e=>(e=e.replace(/~n~/g,"<br />"),e=e.replace(/~h~/g,"<strong>"),Object.keys(W).forEach(s=>{e=e.replace(RegExp(`~${s}~`,"g"),`<span style="color: ${W[s]}">`)}),new DOMParser().parseFromString(e||"","text/html").body.innerHTML),e2=({notification:e,onDelete:t})=>{const[r,s]=R(!1);l(()=>{if(r){const O=setTimeout(t,300);return()=>{clearTimeout(O)}}},[r,t]),l(()=>{const O=setTimeout(()=>s(!0),e.delay||1e4);return()=>clearTimeout(O)},[]);function a(O){return O.title!==void 0}return c("div",{class:`${p.notification} ${r?p.slideOut:p.slideIn}`,children:[a(e)&&c("div",{class:p.header,children:[_("img",{src:e.image.startsWith("http")?e.image:`https://nui-img/${e.image}/${e.image}`}),c("div",{class:p.header_text,children:[_("p",{dangerouslySetInnerHTML:{__html:S(e.title)}}),_("p",{dangerouslySetInnerHTML:{__html:S(e.subtitle)}})]})]}),_("p",{class:p.text,dangerouslySetInnerHTML:{__html:S(e.message)}})]})},V=()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)),_2=()=>{const{minimap:e}=u(x),[t,r]=R([]),s=U((o,L,C)=>{r(d=>[{id:V(),message:o,delay:C},...d])},[r]),a=U((o,L,C,d)=>{r(i=>[{id:V(),title:o,subtitle:L,message:C,image:d},...i])},[r]),O=U(o=>{r(L=>L.filter(C=>C.id!==o))},[r]),n=U(o=>{o.data.action==="draw_basic_notification"?s(o.data.message,o.data.flash,o.data.delay):o.data.action==="draw_advanced_notification"&&a(o.data.title,o.data.subtitle,o.data.message,o.data.image)},[s]);return l(()=>(window.addEventListener("message",n),()=>window.removeEventListener("message",n)),[]),_("div",{class:Z1.container,style:{top:`calc((100vh * ${e.topY}) - calc((100vh * ${e.height}) * 4) - .5rem )`,left:`calc(100vw * ${e.leftX})`,height:`calc((100vh * ${e.height}) * 4)`,width:`calc(100vw * ${e.width})`},children:t.map(o=>_(e2,{notification:o,onDelete:()=>O(o.id)},o.id))})},t2="_container_gclcu_1";var r2={container:t2};const a2="_news_v7ctx_1",s2="_lspd_v7ctx_14",O2="_bcso_v7ctx_19",o2="_slideIn_v7ctx_33",n2="_slideOut_v7ctx_39",i2="_header_v7ctx_56",U2="_content_v7ctx_66",c2="_text_v7ctx_73";var H={news:a2,lspd:s2,bcso:O2,slideIn:o2,slideOut:n2,header:i2,content:U2,text:c2};const R2=({news:e,onDelete:t})=>{const[r,s]=R(!1);return l(()=>{if(r){const a=setTimeout(t,300);return()=>{clearTimeout(a)}}},[r,t]),l(()=>{const a=setTimeout(()=>s(!0),1e4);return()=>clearTimeout(a)},[]),c("div",{class:`${H.news} ${H[e.type]} ${r?H.slideOut:H.slideIn}`,children:[_("h3",{class:H.header,children:e.type==="lspd"||e.type==="bcso"?"Avis de recherche":e.type}),_("div",{class:H.content,children:e.type==="lspd"||e.type==="bcso"?c("p",{class:H.text,children:["Les forces de l'ordre sont \xE0 la recherche de ",_("strong",{children:e.message}),".",_("p",{style:{padding:"1rem 0"}}),"Si vous avez des informations sur cette personne, veuillez les communiquer au ",c("strong",{style:{textTransform:"uppercase"},children:["555-",e.type]}),"."]}):_("p",{class:H.text,children:e.message})})]})},L2=()=>{const[e,t]=R([]),r=U(a=>{t(O=>O.filter(n=>n.id!==a))},[t]),s=U(a=>{a.data.action==="draw_news_banner"&&t(O=>[{id:V(),type:a.data.type,image:a.data.image,message:a.data.message},...O])},[t]);return l(()=>(window.addEventListener("message",s),()=>window.removeEventListener("message",s)),[]),_("div",{class:r2.container,children:e.map(a=>_(R2,{news:a,onDelete:()=>r(a.id)},a.id))})},C2=()=>{const[e,t]=R(!1),r=U(s=>{s.data.action==="display"&&t(s.data.show)},[]);return l(()=>(window.addEventListener("message",r),()=>window.removeEventListener("message",r)),[]),_(B1,{children:_(U1,{children:_(k1,{children:_(w1,{children:c("main",{style:{transition:"opacity .5s",opacity:e?1:0},children:[_(_2,{}),_(L2,{}),_(F1,{}),_($1,{}),_(E1,{}),_(V1,{})]})})})})})};s1(_(C2,{}),document.getElementById("app"));export{_ as j};
