import{S as s,i as a,s as t,a as e,e as n,t as r,T as i,f as o,g as c,c as l,b as u,d as p,m as h,h as d,j as f,W as g,z as v,A as m,k as y,n as T,X as b,x as w}from"./client.76a7abe8.js";function E(s){let a,t,b,w,E,j,x,B,N,U,k,I,z,O,P,R,A,D;return{c(){a=e(),t=n("h1"),b=r("login"),w=e(),E=n("div"),j=r(s[2]),x=r("\n\nemail "),B=n("input"),N=n("br"),U=r("\npassword "),k=n("input"),I=n("br"),z=e(),O=n("button"),P=r("log in"),R=n("button"),A=r("register"),this.h()},l(e){i('[data-svelte="svelte-5a95jz"]',document.head).forEach(o),a=c(e),t=l(e,"H1",{});var n=u(t);b=p(n,"login"),n.forEach(o),w=c(e),E=l(e,"DIV",{class:!0});var r=u(E);j=p(r,s[2]),r.forEach(o),x=p(e,"\n\nemail "),B=l(e,"INPUT",{type:!0}),N=l(e,"BR",{}),U=p(e,"\npassword "),k=l(e,"INPUT",{type:!0}),I=l(e,"BR",{}),z=c(e),O=l(e,"BUTTON",{});var h=u(O);P=p(h,"log in"),h.forEach(o),R=l(e,"BUTTON",{});var d=u(R);A=p(d,"register"),d.forEach(o),this.h()},h(){document.title="login",h(E,"class","error svelte-1p70sjp"),h(B,"type","text"),h(k,"type","password")},m(e,n,r){d(e,a,n),d(e,t,n),f(t,b),d(e,w,n),d(e,E,n),f(E,j),d(e,x,n),d(e,B,n),g(B,s[0]),d(e,N,n),d(e,U,n),d(e,k,n),g(k,s[1]),d(e,I,n),d(e,z,n),d(e,O,n),f(O,P),d(e,R,n),f(R,A),r&&v(D),D=[m(B,"input",s[5]),m(k,"input",s[6]),m(O,"click",s[3]),m(R,"click",s[4])]},p(s,[a]){4&a&&y(j,s[2]),1&a&&B.value!==s[0]&&g(B,s[0]),2&a&&k.value!==s[1]&&g(k,s[1])},i:T,o:T,d(s){s&&o(a),s&&o(t),s&&o(w),s&&o(E),s&&o(x),s&&o(B),s&&o(N),s&&o(U),s&&o(k),s&&o(I),s&&o(z),s&&o(O),s&&o(R),v(D)}}}function j(s,a,t){let e="",n="",r="";return[e,n,r,async()=>{try{await b({username:e,password:n}),w("/")}catch(s){console.log(s.message),t(2,r=s.message)}},async()=>{w("/register")},function(){e=this.value,t(0,e)},function(){n=this.value,t(1,n)}]}export default class extends s{constructor(s){super(),a(this,s,j,E,t,{})}}
