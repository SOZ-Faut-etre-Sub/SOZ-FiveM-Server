var W=Object.defineProperty,G=Object.defineProperties;var Q=Object.getOwnPropertyDescriptors;var B=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,X=Object.prototype.propertyIsEnumerable;var j=(e,a,r)=>a in e?W(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r,l=(e,a)=>{for(var r in a||(a={}))U.call(a,r)&&j(e,r,a[r]);if(B)for(var r of B(a))X.call(a,r)&&j(e,r,a[r]);return e},d=(e,a)=>G(e,Q(a));import{j as N,r as u,u as Y,C as M,N as I,c as Z,R as ee}from"./vendor.js";const ne=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const w of n.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&m(w)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}};ne();var oe="/html/assets/radio-sr.png",te="/html/assets/radio-lr.png";const ce="_container_1uio1_1",ae="_container_show_1uio1_8",ie="_container_hide_1uio1_12",re="_radio_1uio1_16",se="_screen_1uio1_22",_e="_actions_1uio1_32",le="_action_style_1uio1_36",de="_action_enable_1uio1_47 _action_style_1uio1_36",ue="_action_validate_1uio1_55 _action_style_1uio1_36",me="_action_mix_1uio1_63 _action_style_1uio1_36",ye="_action_close_1uio1_71",fe="_action_volume_up_1uio1_84 _action_style_1uio1_36",pe="_action_volume_down_1uio1_92 _action_style_1uio1_36",he="_action_freq_primary_1uio1_101 _action_style_1uio1_36",ve="_action_freq_secondary_1uio1_109 _action_style_1uio1_36";var ge={container:ce,container_show:ae,container_hide:ie,radio:re,screen:se,actions:_e,action_style:le,action_enable:de,action_validate:ue,action_mix:me,action_close:ye,action_volume_up:fe,action_volume_down:pe,action_freq_primary:he,action_freq_secondary:ve};const xe="_container_19dzc_1",qe="_container_show_19dzc_8",we="_container_hide_19dzc_12",Ce="_radio_19dzc_16",be="_screen_19dzc_22",$e="_actions_19dzc_38",ze="_action_style_19dzc_42",ke="_action_enable_19dzc_53 _action_style_19dzc_42",Ne="_action_validate_19dzc_61 _action_style_19dzc_42",Fe="_action_mix_19dzc_69 _action_style_19dzc_42",Le="_action_close_19dzc_77",Se="_action_volume_up_19dzc_90 _action_style_19dzc_42",Re="_action_volume_down_19dzc_98 _action_style_19dzc_42",Ae="_action_freq_primary_19dzc_107 _action_style_19dzc_42",Be="_action_freq_secondary_19dzc_115 _action_style_19dzc_42";var je={container:xe,container_show:qe,container_hide:we,radio:Ce,screen:be,actions:$e,action_style:ze,action_enable:ke,action_validate:Ne,action_mix:Fe,action_close:Le,action_volume_up:Se,action_volume_down:Re,action_freq_primary:Ae,action_freq_secondary:Be};const Me="_screen_1xhmt_1",Ie="_enabled_1xhmt_10",Pe="_frequency_1xhmt_14",Oe="_meta_1xhmt_37";var b={screen:Me,enabled:Ie,frequency:Pe,meta:Oe},q=(e=>(e[e.Left=0]="Left",e[e.Both=1]="Both",e[e.Right=2]="Right",e))(q||{});const Ve="https://soz-talk";function C(e,a={},r){e.charAt(0)!=="/"&&(e=`/${e}`),fetch(`${Ve}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(m=>{m.ok&&m.json().then(t=>{t==="ok"&&r()})}).catch(m=>console.error(m))}const o=N.exports.jsx,h=N.exports.jsxs,V=N.exports.Fragment,Ee=e=>o("svg",d(l({},e),{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:o("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})),He=()=>o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:o("path",{fillRule:"evenodd",d:"M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z",clipRule:"evenodd"})}),Te=()=>o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",fill:"currentColor",children:o("path",{d:"M512 287.9l-.0042 112C511.1 444.1 476.1 480 432 480c-26.47 0-48-21.56-48-48.06V304.1C384 277.6 405.5 256 432 256c10.83 0 20.91 2.723 30.3 6.678C449.7 159.1 362.1 80.13 256 80.13S62.29 159.1 49.7 262.7C59.09 258.7 69.17 256 80 256C106.5 256 128 277.6 128 304.1v127.9C128 458.4 106.5 480 80 480c-44.11 0-79.1-35.88-79.1-80.06L0 288c0-141.2 114.8-256 256-256c140.9 0 255.6 114.5 255.1 255.3C511.1 287.5 511.1 287.7 512 287.9z"})}),P=e=>{switch(e){case q.Left:return"L";case q.Both:return"L/R";case q.Right:return"R"}},O=e=>{const[a,r]=u.exports.useState(!1),[m,t]=u.exports.useState(!1),[n,w]=u.exports.useState("primary"),[v,f]=u.exports.useState({frequency:0,volume:100,ear:q.Both}),[g,p]=u.exports.useState({frequency:0,volume:100,ear:q.Both}),{control:F,handleSubmit:E,formState:{errors:Je}}=Y(),H=e.type==="radio"?oe:te,_=e.type==="radio"?ge:je,T=u.exports.useCallback(()=>{C(`/${e.type}/enable`,{state:!m},()=>{t(c=>!c)})},[m,t]),L=u.exports.useCallback(c=>{w(c)},[w]),D=u.exports.useCallback(()=>{const c=n==="primary"?v.ear:g.ear;let s=q[c+1]!==void 0?c+1:0;C(`/${e.type}/change_ear`,{[n]:s},()=>{n==="primary"?f(i=>d(l({},i),{ear:s})):p(i=>d(l({},i),{ear:s}))})},[n,v,g,f,p]),S=u.exports.useCallback(c=>{c>=0&&c<=100&&C(`/${e.type}/change_volume`,{[n]:c},()=>{n==="primary"?f(s=>d(l({},s),{volume:c})):p(s=>d(l({},s),{volume:c}))})},[n,f,p]),J=u.exports.useCallback(c=>{const s=n==="primary"?c.primaryFrequency:c.secondaryFrequency,i=parseInt(s.replace(/\./g,""));i>=1e4&&i<=99999&&C(`/${e.type}/change_frequency`,{[n]:i},()=>{n==="primary"?f(x=>d(l({},x),{frequency:i})):p(x=>d(l({},x),{frequency:i}))})},[n,v,g]),K=u.exports.useCallback(()=>{C(`/${e.type}/toggle`,{state:!1},()=>{r(!1)})},[r]),R=u.exports.useCallback(c=>{const{type:s,action:i,frequency:x,volume:$,ear:z,isPrimary:k,isEnabled:A}=c.data;s===e.type&&(i==="open"?r(!0):i==="close"?r(!1):i==="enabled"?A!==void 0&&t(A):i==="frequency_change"?x&&(k?f(y=>d(l({},y),{frequency:x/100})):p(y=>d(l({},y),{frequency:x/100}))):i==="volume_change"?$&&(k?f(y=>d(l({},y),{volume:$})):p(y=>d(l({},y),{volume:$}))):i==="ear_change"&&z&&(k?f(y=>d(l({},y),{ear:z})):p(y=>d(l({},y),{ear:z}))))},[]);return u.exports.useEffect(()=>(window.addEventListener("message",R),()=>{window.removeEventListener("message",R)}),[]),o("div",{className:`${_.container} ${a?_.container_show:_.container_hide}`,children:h("form",{onSubmit:E(J),children:[o("img",{className:_.radio,src:H,alt:"Radio"}),o("div",{className:_.screen,children:o("div",{className:`${b.screen} ${m?b.enabled:""}`,children:m&&h(V,{children:[h("div",{className:b.frequency,children:[o("span",{children:n==="primary"?"F1":"F2"}),n==="primary"&&o(M,{control:F,name:"primaryFrequency",render:({field:{onChange:c,name:s,value:i}})=>o(I,{format:"###.##",defaultValue:"000.00",name:s,value:i,onChange:c})}),n==="secondary"&&o(M,{control:F,name:"secondaryFrequency",render:({field:{onChange:c,name:s,value:i}})=>o(I,{format:"###.##",defaultValue:"000.00",name:s,value:i,onChange:c})})]}),h("span",{className:b.meta,children:[h("div",{children:[o(He,{}),n==="primary"?v.volume:g.volume,"%"]}),h("div",{children:[o(Te,{}),P(n==="primary"?v.ear:g.ear)]})]})]})})}),h("div",{className:_.actions,children:[o("input",{type:"submit",value:"",className:_.action_validate}),o("div",{className:_.action_enable,onClick:T}),o("div",{className:_.action_mix,onClick:D}),o(Ee,{className:_.action_close,onClick:K}),o("div",{className:_.action_volume_up,onClick:()=>S(n==="primary"?v.volume+10:g.volume+10)}),o("div",{className:_.action_volume_down,onClick:()=>S(n==="primary"?v.volume-10:g.volume-10)}),o("div",{className:_.action_freq_primary,onClick:()=>L("primary")}),o("div",{className:_.action_freq_secondary,onClick:()=>L("secondary")})]})]})})},De=()=>h(V,{children:[o(O,{type:"radio"}),o(O,{type:"cibi"})]});Z.createRoot(document.getElementById("app")).render(o(ee.StrictMode,{children:o(De,{})}));
