var K=Object.defineProperty,W=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var M=(e,i,r)=>i in e?K(e,i,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[i]=r,_=(e,i)=>{for(var r in i||(i={}))Q.call(i,r)&&M(e,r,i[r]);if(j)for(var r of j(i))U.call(i,r)&&M(e,r,i[r]);return e},l=(e,i)=>W(e,G(i));import{j as N,r as u,u as X,C as P,N as I,c as Y,R as Z}from"./vendor.js";const ee=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))y(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const v of n.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&y(v)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function y(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}};ee();var ne="/html/assets/radio-sr.png",oe="/html/assets/radio-lr.png";const te="_container_1uio1_1",ce="_container_show_1uio1_8",ae="_container_hide_1uio1_12",ie="_radio_1uio1_16",re="_screen_1uio1_22",se="_actions_1uio1_32",_e="_action_style_1uio1_36",le="_action_enable_1uio1_47 _action_style_1uio1_36",de="_action_validate_1uio1_55 _action_style_1uio1_36",ue="_action_mix_1uio1_63 _action_style_1uio1_36",ye="_action_close_1uio1_71",me="_action_volume_up_1uio1_84 _action_style_1uio1_36",fe="_action_volume_down_1uio1_92 _action_style_1uio1_36",pe="_action_freq_primary_1uio1_101 _action_style_1uio1_36",he="_action_freq_secondary_1uio1_109 _action_style_1uio1_36";var ve={container:te,container_show:ce,container_hide:ae,radio:ie,screen:re,actions:se,action_style:_e,action_enable:le,action_validate:de,action_mix:ue,action_close:ye,action_volume_up:me,action_volume_down:fe,action_freq_primary:pe,action_freq_secondary:he};const qe="_container_19dzc_1",ge="_container_show_19dzc_8",xe="_container_hide_19dzc_12",be="_radio_19dzc_16",we="_screen_19dzc_22",$e="_actions_19dzc_38",ze="_action_style_19dzc_42",Ce="_action_enable_19dzc_53 _action_style_19dzc_42",Fe="_action_validate_19dzc_61 _action_style_19dzc_42",ke="_action_mix_19dzc_69 _action_style_19dzc_42",Ne="_action_close_19dzc_77",Se="_action_volume_up_19dzc_90 _action_style_19dzc_42",Le="_action_volume_down_19dzc_98 _action_style_19dzc_42",Re="_action_freq_primary_19dzc_107 _action_style_19dzc_42",Ae="_action_freq_secondary_19dzc_115 _action_style_19dzc_42";var Be={container:qe,container_show:ge,container_hide:xe,radio:be,screen:we,actions:$e,action_style:ze,action_enable:Ce,action_validate:Fe,action_mix:ke,action_close:Ne,action_volume_up:Se,action_volume_down:Le,action_freq_primary:Re,action_freq_secondary:Ae};const je="_screen_1xhmt_1",Me="_enabled_1xhmt_10",Pe="_frequency_1xhmt_14",Ie="_meta_1xhmt_37";var z={screen:je,enabled:Me,frequency:Pe,meta:Ie},x=(e=>(e[e.Left=0]="Left",e[e.Both=1]="Both",e[e.Right=2]="Right",e))(x||{});const Oe="https://soz-talk";function w(e,i={},r){e.charAt(0)!=="/"&&(e=`/${e}`),fetch(`${Oe}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(y=>{y.ok&&y.json().then(t=>{t==="ok"&&r()})}).catch(y=>console.error(y))}const o=N.exports.jsx,b=N.exports.jsxs,V=N.exports.Fragment,Ve=e=>o("svg",l(_({},e),{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:o("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})),Ee=()=>o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:o("path",{fillRule:"evenodd",d:"M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z",clipRule:"evenodd"})}),O=e=>{const[i,r]=u.exports.useState(!1),[y,t]=u.exports.useState(!1),[n,v]=u.exports.useState("primary"),[q,f]=u.exports.useState({frequency:0,volume:100,ear:x.Both}),[g,p]=u.exports.useState({frequency:0,volume:100,ear:x.Both}),{control:S,handleSubmit:E,formState:{errors:He},setValue:$}=X(),T=e.type==="radio"?ne:oe,d=e.type==="radio"?ve:Be,H=u.exports.useCallback(()=>{w(`/${e.type}/enable`,{state:!y},()=>{t(c=>!c)})},[y,t]),L=u.exports.useCallback(c=>{v(c)},[v]);u.exports.useCallback(()=>{const c=n==="primary"?q.ear:g.ear;let s=x[c+1]!==void 0?c+1:0;w(`/${e.type}/change_ear`,{[n]:s},()=>{n==="primary"?f(a=>l(_({},a),{ear:s})):p(a=>l(_({},a),{ear:s}))})},[n,q,g,f,p]);const R=u.exports.useCallback(c=>{c>=0&&c<=100&&w(`/${e.type}/change_volume`,{[n]:c},()=>{n==="primary"?f(s=>l(_({},s),{volume:c})):p(s=>l(_({},s),{volume:c}))})},[n,f,p]),D=u.exports.useCallback(c=>{const s=n==="primary"?c.primaryFrequency:c.secondaryFrequency,a=parseInt(s.toString().replace(/\./g,""));a>=1e4&&a<=99999&&w(`/${e.type}/change_frequency`,{[n]:a},()=>{n==="primary"?f(h=>l(_({},h),{frequency:a})):p(h=>l(_({},h),{frequency:a}))})},[n,q,g]),J=u.exports.useCallback(()=>{w(`/${e.type}/toggle`,{state:!1},()=>{r(!1)})},[r]),A=u.exports.useCallback(c=>{const{type:s,action:a,frequency:h,volume:C,ear:F,isPrimary:k,isEnabled:B}=c.data;s===e.type&&(a==="reset"?(r(!1),t(!1),v("primary"),f({frequency:0,volume:100,ear:x.Both}),p({frequency:0,volume:100,ear:x.Both}),$("primaryFrequency",null),$("secondaryFrequency",null)):a==="open"?r(!0):a==="close"?r(!1):a==="enabled"?B!==void 0&&t(B):a==="frequency_change"?h&&(k?(f(m=>l(_({},m),{frequency:h/100})),$("primaryFrequency",h)):(p(m=>l(_({},m),{frequency:h/100})),$("secondaryFrequency",h))):a==="volume_change"?C&&(k?f(m=>l(_({},m),{volume:C})):p(m=>l(_({},m),{volume:C}))):a==="ear_change"&&F&&(k?f(m=>l(_({},m),{ear:F})):p(m=>l(_({},m),{ear:F}))))},[]);return u.exports.useEffect(()=>(window.addEventListener("message",A),()=>{window.removeEventListener("message",A)}),[]),o("div",{className:`${d.container} ${i?d.container_show:d.container_hide}`,children:b("form",{onSubmit:E(D),children:[o("img",{className:d.radio,src:T,alt:"Radio"}),o("div",{className:d.screen,children:o("div",{className:`${z.screen} ${y?z.enabled:""}`,children:y&&b(V,{children:[b("div",{className:z.frequency,children:[o("span",{children:n==="primary"?"F1":"F2"}),n==="primary"&&o(P,{control:S,name:"primaryFrequency",render:({field:{onChange:c,name:s,value:a}})=>o(I,{format:"###.##",defaultValue:"000.00",name:s,value:a,onChange:c})}),n==="secondary"&&o(P,{control:S,name:"secondaryFrequency",render:({field:{onChange:c,name:s,value:a}})=>o(I,{format:"###.##",defaultValue:"000.00",name:s,value:a,onChange:c})})]}),o("span",{className:z.meta,children:b("div",{children:[o(Ee,{}),n==="primary"?q.volume:g.volume,"%"]})})]})})}),b("div",{className:d.actions,children:[o("input",{type:"submit",value:"",className:d.action_validate}),o("div",{className:d.action_enable,onClick:H}),o(Ve,{className:d.action_close,onClick:J}),o("div",{className:d.action_volume_up,onClick:()=>R(n==="primary"?q.volume+10:g.volume+10)}),o("div",{className:d.action_volume_down,onClick:()=>R(n==="primary"?q.volume-10:g.volume-10)}),o("div",{className:d.action_freq_primary,onClick:()=>L("primary")}),o("div",{className:d.action_freq_secondary,onClick:()=>L("secondary")})]})]})})},Te=()=>b(V,{children:[o(O,{type:"radio"}),o(O,{type:"cibi"})]});Y.createRoot(document.getElementById("app")).render(o(Z.StrictMode,{children:o(Te,{})}));
