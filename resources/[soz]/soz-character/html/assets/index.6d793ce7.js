import{j as m,a as _,D as g,l as u,A as p,d as y,F as w,y as S,S as x}from"./vendor.78b7f53b.js";const b=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}};b();const C="_app_1lw53_1",P="_header_1lw53_5",L="_corner_top_right_1lw53_27",E="_corner_bottom_left_1lw53_47";var l={app:C,header:P,corner_top_right:L,corner_bottom_left:E},A="/html/assets/default.51bd416d.png",B="/html/assets/lossantos.855f404e.png",H="/html/assets/paletobay.54e73021.png";const v=[{identifier:"default",name:"Bienvenue \xE0 San Andreas",description:"Choisis ton d\xE9part en cliquant sur l'un des deux points !",image:A},{identifier:"spawn1",name:"Los Santos",description:"La ville avec le plus gros r\xE9seau de livreur Zuber de tout San Andreas !",image:B,waypoint:{left:"85vw",top:"50vh"}},{identifier:"spawn2",name:"Paleto Bay",description:"La ville o\xF9 vous avez le plus de chance de vous faire d\xE9vorer par un animal sauvage de tout San Andreas !",image:H,waypoint:{left:"14vw",top:"60vh"}}],t=m,c=_,h=g({spawn:{},updateSpawn:o=>{}}),j=({children:o})=>{const[e,a]=u(v[0]),i=p(r=>a(r),[a]),n=y(function(){return{spawn:e,updateSpawn:i}},[e,i]);return t(h.Provider,{value:n,children:o})},$="_container_1w5c9_1",k="_preview_1w5c9_6",M="_title_1w5c9_14",O="_description_1w5c9_22",I="_icon_1w5c9_32",z="_button_1w5c9_38";var s={container:$,preview:k,title:M,description:O,icon:I,button:z};const D="https://soz-character";function f(o,e={},a=()=>{}){o.charAt(0)!=="/"&&(o=`/${o}`),fetch(`${D}${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(i=>{i.ok&&i.json().then(n=>{n==="ok"&&a()})}).catch(i=>console.error(i))}const N=()=>{const{updateSpawn:o}=w(h);return t("div",{children:v.filter(e=>e.identifier!=="default").map(e=>t("div",{class:s.icon,style:e.waypoint&&{top:e.waypoint.top,left:e.waypoint.left},onClick:()=>o(e),children:t("svg",{height:"2rem",width:"2rem",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 384 512",children:t("path",{d:"M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"})})}))})},Z=o=>{const{spawn:e}=w(h),a=p(()=>{f("/SpawnPlayer",{SpawnId:e.identifier})},[e,f]);return c("section",{class:s.container,style:o.style,children:[t("div",{class:s.preview,style:{backgroundImage:`url(${e.image})`}}),t("h3",{class:s.title,children:e.name}),t("h4",{class:s.description,children:e.description}),t("div",{class:s.button,style:{transition:"all .5s",opacity:e.identifier!=="default"?"1":"0",top:e.identifier!=="default"?"0vh":"-10vh"},children:t("div",{onClick:a,children:"Choisir ce point de d\xE9marrage"})})]})},F=()=>{const[o,e]=u(!1),a=p(i=>{i.data.action==="open"&&e(!0),i.data.action==="close"&&e(!1)},[]);return S(()=>(window.addEventListener("message",a),()=>window.removeEventListener("message",a)),[]),t(j,{children:c("main",{class:l.app,style:{transition:"opacity .5s",opacity:o?1:0},children:[c("header",{class:l.header,style:{transition:"top .5s",top:o?"0vh":"1vh"},children:[t("h1",{children:"D\xE9marrage"}),t("h2",{children:"ZeraWorld"})]}),t(Z,{style:{position:"relative",transition:"top .5s",top:o?"0vh":"-1vh"}}),t(N,{}),c("footer",{class:l.footer,children:[t("div",{class:l.corner_top_right,children:t("svg",{xmlns:"http://www.w3.org/2000/svg",width:"71.927",height:"71.126",viewBox:"0 0 71.927 71.126",children:t("path",{id:"Path_7","data-name":"Path 7",d:"M61.5,959.681l-2.171,3.894v9.506l-1.374,5.612v24.51l-2.291,4.925v22.678H83.037l3.894-1.947H120.6l6.987-2.291H61.5Z",transform:"translate(127.591 1030.807) rotate(180)",fill:"#46ea18"})})}),t("div",{class:l.corner_bottom_left,children:t("svg",{xmlns:"http://www.w3.org/2000/svg",width:"71.927",height:"71.126",viewBox:"0 0 71.927 71.126",children:t("path",{id:"Path_4","data-name":"Path 4",d:"M61.5,959.681l-2.171,3.894v9.506l-1.374,5.612v24.51l-2.291,4.925v22.678H83.037l3.894-1.947H120.6l6.987-2.291H61.5Z",transform:"translate(-55.664 -959.681)",fill:"#46ea18"})})})]})]})})};x(t(F,{}),document.getElementById("app"));
