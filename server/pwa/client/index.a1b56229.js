import{S as r,i as a,s as e,e as s,t as o,a as t,c as l,b as c,d as n,f as u,g as i,h,j as v,k as d,n as p,l as f,m,o as g,p as E,q as w,r as b,u as $,v as D,w as V,x as I,y,z as k,A as x,B as H,C as F,D as P,E as j,F as B}from"./client.76a7abe8.js";function C(r,a,e){const s=r.slice();return s[1]=a[e],s}function _(r){let a,e,p,f,m,g,E,w,b,$,D=r[1].name+"";return{c(){a=s("div"),e=s("h3"),p=o(D),f=t(),m=s("p"),g=o("group recent summary"),E=t(),w=s("p"),b=o("group current stats"),$=t()},l(r){a=l(r,"DIV",{});var s=c(a);e=l(s,"H3",{});var o=c(e);p=n(o,D),o.forEach(u),f=i(s),m=l(s,"P",{});var t=c(m);g=n(t,"group recent summary"),t.forEach(u),E=i(s),w=l(s,"P",{});var h=c(w);b=n(h,"group current stats"),h.forEach(u),$=i(s),s.forEach(u)},m(r,s){h(r,a,s),v(a,e),v(e,p),v(a,f),v(a,m),v(m,g),v(a,E),v(a,w),v(w,b),v(a,$)},p(r,a){1&a&&D!==(D=r[1].name+"")&&d(p,D)},d(r){r&&u(a)}}}function q(r){let a,e=r[0],o=[];for(let a=0;a<e.length;a+=1)o[a]=_(C(r,e,a));return{c(){a=s("div");for(let r=0;r<o.length;r+=1)o[r].c()},l(r){a=l(r,"DIV",{});var e=c(a);for(let r=0;r<o.length;r+=1)o[r].l(e);e.forEach(u)},m(r,e){h(r,a,e);for(let r=0;r<o.length;r+=1)o[r].m(a,null)},p(r,[s]){if(1&s){let t;for(e=r[0],t=0;t<e.length;t+=1){const l=C(r,e,t);o[t]?o[t].p(l,s):(o[t]=_(l),o[t].c(),o[t].m(a,null))}for(;t<o.length;t+=1)o[t].d(1);o.length=e.length}},i:p,o:p,d(r){r&&u(a),f(o,r)}}}function z(r,a,e){let{groups:s}=a;return r.$set=(r=>{"groups"in r&&e(0,s=r.groups)}),[s]}class A extends r{constructor(r){super(),a(this,r,z,q,e,{groups:0})}}function S(r){let a,e;return{c(){a=s("p"),e=o("advocat was created as a local response to the 2020 international coronavirus crisis."),this.h()},l(r){a=l(r,"P",{class:!0});var s=c(a);e=n(s,"advocat was created as a local response to the 2020 international coronavirus crisis."),s.forEach(u),this.h()},h(){m(a,"class","svelte-16bw1r2")},m(r,s){h(r,a,s),v(a,e)},d(r){r&&u(a)}}}function G(r){let a,e,d,f,g,E,w,b,$,D,V,I,H,F,P;return{c(){a=s("div"),e=s("div"),d=s("h2"),f=o("Find Help"),g=t(),E=s("p"),w=o("Find volunteer groups in your local area"),b=t(),$=s("div"),D=s("h2"),V=o("Be a Volunteer"),I=t(),H=s("p"),F=o("Create or join a volunteer group with other people in your area"),this.h()},l(r){a=l(r,"DIV",{});var s=c(a);e=l(s,"DIV",{class:!0,style:!0});var o=c(e);d=l(o,"H2",{class:!0});var t=c(d);f=n(t,"Find Help"),t.forEach(u),g=i(o),E=l(o,"P",{});var h=c(E);w=n(h,"Find volunteer groups in your local area"),h.forEach(u),o.forEach(u),b=i(s),$=l(s,"DIV",{class:!0,style:!0});var v=c($);D=l(v,"H2",{class:!0});var p=c(D);V=n(p,"Be a Volunteer"),p.forEach(u),I=i(v),H=l(v,"P",{});var m=c(H);F=n(m,"Create or join a volunteer group with other people in your area"),m.forEach(u),v.forEach(u),s.forEach(u),this.h()},h(){m(d,"class","svelte-16bw1r2"),m(e,"class","calltoaction svelte-16bw1r2"),y(e,"border","2px solid "+(r[3]?"var(--colour-scheme-light)":"var(--colour-scheme-dark)")),m(D,"class","svelte-16bw1r2"),m($,"class","calltoaction svelte-16bw1r2"),y($,"border","2px solid "+(r[3]?"var(--colour-scheme-light)":"var(--colour-scheme-dark)"))},m(s,o,t){h(s,a,o),v(a,e),v(e,d),v(d,f),v(e,g),v(e,E),v(E,w),v(a,b),v(a,$),v($,D),v(D,V),v($,I),v($,H),v(H,F),t&&k(P),P=[x(e,"click",r[6]("findgroups")),x($,"click",r[6]("create_group"))]},p(r,a){8&a&&y(e,"border","2px solid "+(r[3]?"var(--colour-scheme-light)":"var(--colour-scheme-dark)")),8&a&&y($,"border","2px solid "+(r[3]?"var(--colour-scheme-light)":"var(--colour-scheme-dark)"))},i:p,o:p,d(r){r&&u(a),k(P)}}}function J(r){let a,e,p,f,m,E,b;const $=new A({props:{groups:r[0]}});return{c(){a=s("div"),e=s("div"),p=s("h1"),f=o("welcome back "),m=o(r[2]),E=t(),H($.$$.fragment)},l(s){a=l(s,"DIV",{});var o=c(a);e=l(o,"DIV",{});var t=c(e);p=l(t,"H1",{});var h=c(p);f=n(h,"welcome back "),m=n(h,r[2]),h.forEach(u),t.forEach(u),E=i(o),F($.$$.fragment,o),o.forEach(u)},m(r,s){h(r,a,s),v(a,e),v(e,p),v(p,f),v(p,m),v(a,E),P($,a,null),b=!0},p(r,a){(!b||4&a)&&d(m,r[2]);const e={};1&a&&(e.groups=r[0]),$.$set(e)},i(r){b||(w($.$$.fragment,r),b=!0)},o(r){g($.$$.fragment,r),b=!1},d(r){r&&u(a),j($)}}}function K(r){let a,e,d,p,f,b,$,D,I,y,k=!r[1]&&S();const x=[J,G],H=[];function F(r,a){return r[1]?0:1}return D=F(r),I=H[D]=x[D](r),{c(){a=s("div"),e=s("div"),d=s("h1"),p=o("advocat."),f=t(),k&&k.c(),b=t(),$=s("div"),I.c(),this.h()},l(r){a=l(r,"DIV",{class:!0});var s=c(a);e=l(s,"DIV",{class:!0});var o=c(e);d=l(o,"H1",{});var t=c(d);p=n(t,"advocat."),t.forEach(u),f=i(o),k&&k.l(o),o.forEach(u),b=i(s),$=l(s,"DIV",{class:!0});var h=c($);I.l(h),h.forEach(u),s.forEach(u),this.h()},h(){m(e,"class","title svelte-16bw1r2"),m($,"class","container svelte-16bw1r2"),m(a,"class","page svelte-16bw1r2")},m(r,s){h(r,a,s),v(a,e),v(e,d),v(d,p),v(e,f),k&&k.m(e,null),v(a,b),v(a,$),H[D].m($,null),y=!0},p(r,[a]){r[1]?k&&(k.d(1),k=null):k||((k=S()).c(),k.m(e,null));let s=D;(D=F(r))===s?H[D].p(r,a):(V(),g(H[s],1,1,()=>{H[s]=null}),E(),(I=H[D])||(I=H[D]=x[D](r)).c(),w(I,1),I.m($,null))},i(r){y||(w(I),y=!0)},o(r){g(I),y=!1},d(r){r&&u(a),k&&k.d(),H[D].d()}}}function L(r,a,e){let s,o,t;b(r,B,r=>e(3,t=r));let{loggedIn:l,username:c}=$("user");b(r,l,r=>e(1,s=r)),b(r,c,r=>e(2,o=r));const n=D({name:"groups"});let u=[];return r.$$.update=(()=>{2&r.$$.dirty&&s&&n.allDocs({include_docs:!0}).then(r=>{e(0,u=r.rows.map(r=>r.doc))})}),[u,s,o,t,l,c,r=>()=>I(r)]}export default class extends r{constructor(r){super(),a(this,r,L,K,e,{})}}
