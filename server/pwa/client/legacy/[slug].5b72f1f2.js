import{W as t,X as s,_ as n,a,b as e,c as r,i,s as o,d as c,S as u,f as h,e as f,t as l,a1 as p,k as d,l as m,g as v,h as x,j as k,u as b,m as g,n as j,p as y,o as E,q as H}from"./client.86309a38.js";function q(t){var s,n,a,e,r,i,o=t[0].title+"",c=t[0].html+"";return document.title=s=t[0].title,{c:function(){n=h(),a=f("h1"),e=l(o),r=h(),i=f("div"),this.h()},l:function(t){p('[data-svelte="svelte-s8ptdu"]',document.head).forEach(d),n=m(t),a=v(t,"H1",{});var s=x(a);e=k(s,o),s.forEach(d),r=m(t),i=v(t,"DIV",{class:!0}),x(i).forEach(d),this.h()},h:function(){b(i,"class","content svelte-dkhkxh")},m:function(t,s){g(t,n,s),g(t,a,s),j(a,e),g(t,r,s),g(t,i,s),i.innerHTML=c},p:function(t,n){var a=y(n,1)[0];1&a&&s!==(s=t[0].title)&&(document.title=s),1&a&&o!==(o=t[0].title+"")&&E(e,o),1&a&&c!==(c=t[0].html+"")&&(i.innerHTML=c)},i:H,o:H,d:function(t){t&&d(n),t&&d(a),t&&d(r),t&&d(i)}}}function w(t){return L.apply(this,arguments)}function L(){return(L=t(s.mark(function t(n){var a,e,r;return s.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=n.params,n.query,t.next=3,this.fetch("blog/".concat(a.slug,".json"));case 3:return e=t.sent,t.next=6,e.json();case 6:if(r=t.sent,200!==e.status){t.next=11;break}return t.abrupt("return",{post:r});case 11:this.error(e.status,r.message);case 12:case"end":return t.stop()}},t,this)}))).apply(this,arguments)}function M(t,s,n){var a=s.post;return t.$set=function(t){"post"in t&&n(0,a=t.post)},[a]}export default(function(t){function s(t){var n;return a(this,s),n=e(this,r(s).call(this)),i(c(n),t,M,q,o,{post:0}),n}return n(s,u),s}());export{w as preload};
