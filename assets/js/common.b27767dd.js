(self.webpackChunksite_docusaurus_template=self.webpackChunksite_docusaurus_template||[]).push([[2076],{33091:(e,t,n)=>{"use strict";n.d(t,{A:()=>f});var s=n(96540),a=n(18215),r=n(15066),l=n(39269),o=n(75251),i=n(89090);const c={details:"details_lb9f",isBrowser:"isBrowser_bmU9",collapsibleContent:"collapsibleContent_i85q"};var u=n(74848);function d(e){return!!e&&("SUMMARY"===e.tagName||d(e.parentElement))}function p(e,t){return!!e&&(e===t||p(e.parentElement,t))}function h(e){let{summary:t,children:n,...a}=e;(0,l.A)().collectAnchor(a.id);const h=(0,o.A)(),b=(0,s.useRef)(null),{collapsed:y,setCollapsed:m}=(0,i.u)({initialState:!a.open}),[f,x]=(0,s.useState)(a.open),g=s.isValidElement(t)?t:(0,u.jsx)("summary",{children:t??"Details"});return(0,u.jsxs)("details",{...a,ref:b,open:f,"data-collapsed":y,className:(0,r.A)(c.details,h&&c.isBrowser,a.className),onMouseDown:e=>{d(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;d(t)&&p(t,b.current)&&(e.preventDefault(),y?(m(!1),x(!0)):m(!0))},children:[g,(0,u.jsx)(i.N,{lazy:!1,collapsed:y,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{m(e),x(!e)},children:(0,u.jsx)("div",{className:c.collapsibleContent,children:n})})]})}const b={details:"details_b_Ee"},y="alert alert--info";function m(e){let{...t}=e;return(0,u.jsx)(h,{...t,className:(0,a.A)(y,b.details,t.className)})}function f(e){const t=s.Children.toArray(e.children),n=t.find((e=>s.isValidElement(e)&&"summary"===e.type)),a=(0,u.jsx)(u.Fragment,{children:t.filter((e=>e!==n))});return(0,u.jsx)(m,{...e,summary:n,children:a})}},82223:(e,t,n)=>{"use strict";n.d(t,{A:()=>l});n(96540);var s=n(18215);const a={tabItem:"tabItem_Ymn6"};var r=n(74848);function l(e){let{children:t,hidden:n,className:l}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(a.tabItem,l),hidden:n,children:t})}},72206:(e,t,n)=>{"use strict";n.d(t,{A:()=>_});var s=n(96540),a=n(18215),r=n(80052),l=n(56347),o=n(35793),i=n(99025),c=n(4430),u=n(44148);function d(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:a}}=e;return{value:t,label:n,attributes:s,default:a}}))}(n);return function(e){const t=(0,c.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:n}=e;const a=(0,l.W6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,i.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(a.location.search);t.set(r,e),a.replace({...a.location,search:t.toString()})}),[r,a])]}function y(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,r=p(e),[l,i]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:r}))),[c,d]=b({queryString:n,groupId:a}),[y,m]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,r]=(0,u.Dv)(n);return[a,(0,s.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:a}),f=(()=>{const e=c??y;return h({value:e,tabValues:r})?e:null})();(0,o.A)((()=>{f&&i(f)}),[f]);return{selectedValue:l,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),m(e)}),[d,m,r]),tabValues:r}}var m=n(75251);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=n(74848);function g(e){let{className:t,block:n,selectedValue:s,selectValue:l,tabValues:o}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.a_)(),u=e=>{const t=e.currentTarget,n=i.indexOf(t),a=o[n].value;a!==s&&(c(t),l(a))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=i.indexOf(e.currentTarget)+1;t=i[n]??i[0];break}case"ArrowLeft":{const n=i.indexOf(e.currentTarget)-1;t=i[n]??i[i.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:r}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>{i.push(e)},onKeyDown:d,onClick:u,...r,className:(0,a.A)("tabs__item",f.tabItem,r?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:r}=e;const l=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:l.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function w(e){const t=y(e);return(0,x.jsxs)("div",{className:(0,a.A)("tabs-container",f.tabList),children:[(0,x.jsx)(g,{...t,...e}),(0,x.jsx)(v,{...t,...e})]})}function _(e){const t=(0,m.A)();return(0,x.jsx)(w,{...e,children:d(e.children)},String(t))}},89166:(e,t,n)=>{"use strict";n(96540),n(71332),n(75251),n(74848);n(81573)},53398:(e,t,n)=>{"use strict";n(33091),n(96540);n(74848)},19894:(e,t,n)=>{"use strict";n.d(t,{A:()=>l});var s=n(33091);n(96540);const a={collapsible:"collapsible_hOX2"};var r=n(74848);function l(e){let{children:t,title:n}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)(s.A,{className:a.collapsible,children:[(0,r.jsx)("summary",{mdxType:"summary",style:{fontWeight:"bold"},children:n||"Deep Dive"}),t]})})}},88761:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});n(96540);const s={center_image:"center_image_tcFY"};var a=n(74848);function r(e){let{path:t,customClass:n,widthPercentage:r}=e,l="";return null!=n&&(l=`, ${n}`),(0,a.jsx)("section",{children:(0,a.jsx)("img",{src:t,className:`${s.center_image} ${l}`,style:{width:`${r}`}})})}},384:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});n(96540);const s={center_video:"center_video_QRNx",center_div:"center_div_ipNX"};var a=n(74848);function r(e){return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)("div",{className:s.center_div,children:(0,a.jsxs)("video",{style:{width:`${e.widthPercentage}`},className:s.center_video,controls:!0,children:[(0,a.jsx)("source",{src:e.path,type:"video/mp4"}),"Your browser does not support the video tag."]})})})}},71332:(e,t,n)=>{"use strict";n.d(t,{A:()=>a});var s=n(96540);const a=function(e){const[t,n]=(0,s.useState)(e?"loading":"idle");return(0,s.useEffect)((()=>{if(!e)return void n("idle");let t=document.querySelector(`script[src="${e}"]`);if(t)n(t.getAttribute("data-status"));else{t=document.createElement("script"),t.src=e,t.async=!0,t.setAttribute("data-status","loading"),document.body.appendChild(t);const n=e=>{t.setAttribute("data-status","load"===e.type?"ready":"error")};t.addEventListener("load",n),t.addEventListener("error",n)}const s=e=>{n("load"===e.type?"ready":"error")};return t.addEventListener("load",s),t.addEventListener("error",s),()=>{t&&(t.removeEventListener("load",s),t.removeEventListener("error",s))}}),[e]),t}},98182:()=>{const e="black",t="KKO2rS1wYKTEyBJVRNa7e";let n="white",s=null,a=!1;const r=document.createElement("div");r.setAttribute("class","chatbase-bubble-button"),r.setAttribute("id","chatbase-bubble-button"),r.style.position="fixed",r.style.bottom="20px",r.style.right="20px",r.style.width="50px",r.style.height="50px",r.style.borderRadius="25px",r.style.backgroundColor=e,r.style.boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2)",r.style.cursor="pointer",r.style.zIndex=2,r.style.transition="all .2s ease-in-out";const l=document.createElement("div");l.setAttribute("id","chatbase-message-bubbles"),l.style.position="fixed",l.style.bottom="80px",l.style.borderRadius="10px",l.style.fontFamily="sans-serif",l.style.fontSize="16px",l.style.zIndex=2,l.style.cursor="pointer",l.style.flexDirection="column",l.style.gap="50px",l.style.marginLeft="20px",l.style.maxWidth="70vw",l.style.display="none";const o=document.createElement("div");o.setAttribute("id","chatbase-message-bubbles-close-button"),o.innerHTML="&#10005;",o.style.position="absolute",o.style.top="-7px",o.style.right="-7px",o.style.fontWeight="bold",o.style.display="none",o.style.justifyContent="center",o.style.alignItems="center",o.style.zIndex=2,o.style.width="22px",o.style.height="22px",o.style.borderRadius="50%",o.style.textAlign="center",o.style.fontSize="12px",o.style.cursor="pointer",l.appendChild(o),document.body.appendChild(l),r.addEventListener("mouseenter",(e=>{r.style.transform="scale(1.08)"})),r.addEventListener("mouseleave",(e=>{r.style.transform="scale(1)"}));const i=document.createElement("div");i.setAttribute("id","chatbase-chat-button-icon"),i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.width="100%",i.style.height="100%",i.style.zIndex=2,r.appendChild(i),r.addEventListener("click",(function(){"none"===c.style.display?(a=!0,l.style.display="none",c.style.display="flex",i.innerHTML=h()):(a=!1,c.style.display="none",i.innerHTML=p())})),l.addEventListener("click",(()=>{a=!0,l.style.display="none",c.style.display="flex",i.innerHTML=h()}));const c=document.createElement("div");c.setAttribute("id","chatbase-bubble-window"),c.style.position="fixed",c.style.flexDirection="column",c.style.justifyContent="space-between",c.style.bottom="80px",c.style.width="85vw",c.style.height="70vh",c.style.boxShadow="rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px",c.style.display="none",c.style.borderRadius="10px",c.style.zIndex=2,c.style.overflow="hidden",document.body.appendChild(c),c.innerHTML=`<iframe\nsrc="https://www.chatbase.co/chatbot-iframe/${t}"\nwidth="100%"\nheight="100%"\nframeborder="0"\n></iframe>`;const u=window.matchMedia("(min-width: 550px)");function d(e){e.matches&&(c.style.height="600px",c.style.width="400px",l.style.maxWidth="300px")}u.addEventListener("change",d),d(u);function p(){return s||`\n  <svg id="chatbase-chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="${n}" width="24" height="24">\n  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />\n  </svg>`}function h(){return`\n  <svg id="chatbase-close-icon" class="closeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="${n}" width="24" height="24">\n    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />\n  </svg>\n  `}function b(e,t){"#"===e.charAt(0)&&(e=e.substr(1));const n=e=>Math.min(255,Math.max(0,e)),s=parseInt(e.substr(0,2),16),a=parseInt(e.substr(2,2),16),r=parseInt(e.substr(4,2),16),l=(.299*s+.587*a+.114*r)/255>.5?-1*Math.abs(t):Math.abs(t),o=n(s+Math.round(255*l)),i=n(a+Math.round(255*l)),c=n(r+Math.round(255*l));return"#"+o.toString(16).padStart(2,"0")+i.toString(16).padStart(2,"0")+c.toString(16).padStart(2,"0")}(async()=>{const u=await fetch(`https://www.chatbase.co/api/get-chatbot-styles?chatbotId=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}),{styles:d,initialMessages:h}=await u.json();r.style.backgroundColor=d.button_color||e,"left"===d.align_chat_button?(r.style.left="20px",r.style.right="unset",c.style.left="20px",c.style.right="unset",l.style.left="20px",l.style.right="unset"):(r.style.right="20px",r.style.left="unset",c.style.right="20px",c.style.left="unset",l.style.right="20px",l.style.left="unset"),document.body.appendChild(r),d.chat_icon&&(s=`<img src="https://backend.chatbase.co/storage/v1/object/public/chat-icons/${d.chat_icon}" class="chatbase-bubble-img" id="chatbase-bubble-img" />`);const y=function(e){"#"===e.charAt(0)&&(e=e.substr(1));const t=parseInt(e.substr(0,2),16),n=parseInt(e.substr(2,2),16),s=parseInt(e.substr(4,2),16);return(.299*t+.587*n+.114*s)/255>.5?"black":"white"}(d.button_color||e);n=y,i.innerHTML=p(),h.forEach(((e,t)=>{const n=document.createElement("div");n.style.display="flex",n.style.justifyContent="left"===d.align_chat_button?"flex-start":"flex-end";const s=document.createElement("div");s.style.backgroundColor="dark"===d.theme?"black":"white",s.style.color="dark"===d.theme?"white":"black",s.style.boxShadow="rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px",s.style.borderRadius="10px",s.style.padding="20px",s.style.margin="8px",s.style.fontSize="14px",s.innerText=e,s.style.opacity=0,s.style.transform="scale(0.9)",s.style.transition="opacity 0.5s ease, transform 0.5s ease",n.appendChild(s),l.appendChild(n),d.auto_open_chat_window_after>=0&&setTimeout((()=>{a||"true"!==sessionStorage.getItem("message_bubbles_have_been_shown")&&(0===t&&(l.style.display="block"),s.style.opacity=1,s.style.transform="scale(1)",t===h.length-1&&sessionStorage.setItem("message_bubbles_have_been_shown","true"))}),1e3*d.auto_open_chat_window_after+100*t)})),o.style.backgroundColor="dark"===d.theme?b("#000000",.2):b("#FFFFFF",.12),o.style.color="dark"===d.theme?"white":"black",o.style.boxShadow="rgba(150, 150, 150, 0.15) 0px 6px 24px 0px, rgba(150, 150, 150, 0.15) 0px 0px 0px 1px",l.addEventListener("mouseenter",(()=>{o.style.display="flex"})),l.addEventListener("mouseleave",(()=>{o.style.display="none"})),o.addEventListener("click",(e=>{e.stopPropagation(),l.style.display="none"}))})(),document.onclick=function(e){console.log(e.target.id),"chatbase-bubble-window"!==e.target.id&&"chatbase-bubble-button"!==e.target.id&&"chatbase-bubble-img"!==e.target.id&&"chatbase-close-icon"!==e.target.id&&"chatbase-chat-icon"!==e.target.id&&"chatbase-chat-button-icon"!==e.target.id&&(a&&(c.style.display="none",i.innerHTML=p(),a=!1),console.log("close chat"))}},28453:(e,t,n)=>{"use strict";n.d(t,{R:()=>l,x:()=>o});var s=n(96540);const a={},r=s.createContext(a);function l(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:l(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);