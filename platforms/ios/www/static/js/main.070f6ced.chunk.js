(this["webpackJsonphk.ust.ienv.praisehk_lite_symptom_analyzer"]=this["webpackJsonphk.ust.ienv.praisehk_lite_symptom_analyzer"]||[]).push([[0],{110:function(e,t,n){e.exports=n.p+"static/media/logo.fd291ecb.svg"},111:function(e,t,n){e.exports=n.p+"static/media/plus.dd88e7d2.svg"},117:function(e,t,n){e.exports=n.p+"static/media/save.aaa4672f.svg"},145:function(e,t,n){e.exports=n(163)},150:function(e,t,n){},151:function(e,t,n){},152:function(e,t,n){e.exports=n.p+"static/media/more.0d0660ce.svg"},161:function(e,t,n){},163:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(15),l=n.n(o),i=n(71),c=(n(150),n(13)),s=n(17),m=n(215),u=n(110),d=n.n(u),p=n(213),y=n(216),f=n(217),E=n(118),g=n.n(E),v=n(120),b=n.n(v),h=n(119),O=n.n(h),S=(n(151),n(37)),j=n(101),w=n(93),C=n(113),x=n.n(C),N=n(36),_=n(59),k=n(111),M=n.n(k),I=n(165),A=n(222),P=n(226),R=n(206),T=n(203),D=n(204),H=n(205),L=n(196),F=n(200),U=n(201),B=n(225),Q=(n(152),n(112)),W=n.n(Q),q=n(202),K=n(230);function V(e){var t=Object(a.useState)(1),n=Object(c.a)(t,2),o=(n[0],n[1],Object(a.useState)(!1)),l=Object(c.a)(o,2),i=l[0],s=l[1];function m(){s(!1)}return r.a.createElement(r.a.Fragment,null,r.a.createElement(L.a,{style:{marginTop:"10px",marginBottom:"10px"},raised:!0},r.a.createElement(F.a,null,r.a.createElement("div",{style:{display:"inline-block",float:"left"}},e.name,"\xa0\xa0 \u2507 \xa0\xa0",r.a.createElement(U.a,{control:r.a.createElement(B.a,{checked:e.isNull,onChange:function(t){e.onisNullChange(e.tempID,t.target.checked)},name:"checkedB",color:"primary"}),label:"No input"})),r.a.createElement("div",{style:{display:"inline-block",float:"right"}},r.a.createElement(W.a,{onClick:function(){s(!0)},style:{fontSize:30,cursor:"pointer"}})),r.a.createElement("div",{style:{display:e.isNull?"none":"block"}},r.a.createElement(q.a,{container:!0,spacing:2,alignItems:"center",style:{marginTop:"5px",clear:"both"}},r.a.createElement(q.a,{item:!0,xs:!0},r.a.createElement(K.a,{value:e.severity,onChange:function(t,n){e.onSeverityChange(e.tempID,n)},step:1,min:1,max:5})),r.a.createElement(q.a,{item:!0,style:{minWidth:"2ch"}},e.severity))))),r.a.createElement("br",null),r.a.createElement(P.a,{open:i,onClose:m},r.a.createElement(T.a,null,r.a.createElement(D.a,null,"Are you sure? All the records of this symptom will be deleted and non-recoverable!")),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:function(){e.deleteSymptomType(e.name),m()},color:"primary"},"Sure"),r.a.createElement(I.a,{onClick:m,color:"primary",autoFocus:!0},"Cancel"))))}var z={myid:"ienv.praiseApp",apikey:"iCJ5pCxVVOaL"},G={myid:"praisehk-symanaly",apikey:"ApGJ2uglNlv1"};function J(e){var t=Object(a.useRef)();return Object(a.useEffect)((function(){t.current=e})),t.current}var X=n(114),$=n.n(X),Y=n(73),Z=n(207),ee=n(125),te=n(208),ne=n(32),ae={display:"flex",justifyContent:"space-between",alignItems:"center"},re={flex:"none",marginLeft:10};function oe(e){var t=Object(a.useState)({indoor:!1,windowOpened:!1,airPurifierOn:!1,airConditionerOn:!1}),n=Object(c.a)(t,2),o=n[0],l=n[1],i=function(e){"indoor"!==e||o.indoor?"outdoor"===e&&o.indoor&&l({indoor:!1,windowOpened:!1,airPurifierOn:!1,airConditionerOn:!1}):l({indoor:!0,windowOpened:!1,airPurifierOn:!1,airConditionerOn:!1})},s=function(e){l(Object(S.a)(Object(S.a)({},o),{},Object(Y.a)({},e.target.name,e.target.checked)))};Object(a.useEffect)((function(){e.isOpen&&l({indoor:e.microEnvState.indoor,windowOpened:e.microEnvState.windowOpened,airPurifierOn:e.microEnvState.airPurifierOn,airConditionerOn:e.microEnvState.airConditionerOn})}),[e.isOpen]);var m=Object(ne.a)();return r.a.createElement(P.a,{open:e.isOpen,onClose:e.close},r.a.createElement(R.a,{style:{color:m.palette.primary.main}},"Micro Environment"),r.a.createElement(T.a,null,r.a.createElement(ee.a,{elevation:3,style:{minWidth:300,paddingTop:10}},r.a.createElement("div",{style:Object(S.a)(Object(S.a)({},ae),{},{justifyContent:"center"})},r.a.createElement("div",{style:{flex:"none"}},r.a.createElement(Z.a,{color:"primary"},r.a.createElement(I.a,{variant:o.indoor?"contained":"outlined",onClick:function(){i("indoor")}},"Indoor"),r.a.createElement(I.a,{variant:o.indoor?"outlined":"contained",onClick:function(){i("outdoor")}},"Outdoor")))),r.a.createElement("div",{style:ae},r.a.createElement("p",{style:re},"Open Window"),r.a.createElement("div",{style:{flex:"none"}},r.a.createElement(te.a,{disabled:!o.indoor,checked:o.windowOpened,onChange:s,name:"windowOpened",color:"primary"}))),r.a.createElement("div",{style:ae},r.a.createElement("p",{style:re},"Air Purifier"),r.a.createElement("div",{style:{flex:"none"}},r.a.createElement(te.a,{disabled:!o.indoor,checked:o.airPurifierOn,onChange:s,name:"airPurifierOn",color:"primary"}))),r.a.createElement("div",{style:ae},r.a.createElement("p",{style:re},"Air-conditioner"),r.a.createElement("div",{style:{flex:"none"}},r.a.createElement(te.a,{disabled:!o.indoor,checked:o.airConditionerOn,onChange:s,name:"airConditionerOn",color:"primary"}))))),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:function(){e.setMicroEnvState(o),e.close()},color:"primary"},"Confirm"),r.a.createElement(I.a,{onClick:e.close,color:"primary",autoFocus:!0},"Cancel")))}function le(e){var t=Object(a.useState)({path:null,state:null}),n=Object(c.a)(t,2),o=n[0],l=n[1],i=Object(a.useState)(!1),m=Object(c.a)(i,2),u=m[0],d=m[1],p=Object(a.useState)({hoisted:!1,error:null}),y=Object(c.a)(p,2),f=y[0],E=y[1],g=Object(a.useState)(!1),v=Object(c.a)(g,2),b=v[0],h=v[1],O=Object(a.useState)([]),C=Object(c.a)(O,2),k=C[0],L=C[1],F=J(k),U=Object(a.useState)(""),B=Object(c.a)(U,2),Q=B[0],W=B[1],q=Object(a.useState)(!1),K=Object(c.a)(q,2),X=K[0],Y=K[1],Z=Object(a.useState)(ge()),ee=Object(c.a)(Z,2),te=ee[0],ne=ee[1],ae=J(e.saveNewSymptoms),re=Object(a.useState)(null),le=Object(c.a)(re,2),ie=le[0],ce=le[1],se=Object(a.useState)(!1),me=Object(c.a)(se,2),ue=me[0],de=me[1],pe=Object(a.useRef)({indoor:!1,windowOpened:!1,airPurifierOn:!1,airConditionerOn:!1}),ye=Object(a.useContext)(xe),fe=Object(a.useContext)(Ce).loader,Ee=Object(a.useContext)(Ce).errorDialog;function ge(){return Object(N.a)(new Date,"dd MMMM yyyy  HH:mm")}function ve(){f.hoisted&&E({hoisted:!1,error:null}),d(!1),W("")}function be(){h(!1),e.saveNewSymptoms&&e.setSaveNewSymptoms(!1)}function he(e,t){L(k.map((function(n){return n.tempID===e&&(n.isNull=t),n})))}function Oe(e,t){L(k.map((function(n){return n.tempID===e&&(n.severity=t),n})))}Object(a.useEffect)((function(){for(var t=[],n=function(n){var a=e.symptomTypes[n],r={tempID:"temp_"+a,typeName:a,isNull:!0,severity:3};F&&F.every((function(e){return e.typeName!==a||(r=e,!1)})),t.push(r)},a=0;a<e.symptomTypes.length;a++)n(a);L(t)}),[e.symptomTypes]),Object(a.useEffect)((function(){e.saveNewSymptoms&&(e.saveNewSymptoms&&0===k.length?e.setSaveNewSymptoms(!1):e.saveNewSymptoms&&!ae&&k.length>0&&h(!0))}),[e.saveNewSymptoms]),Object(a.useEffect)((function(){if(X)if(k.length>0){fe.loaderSwitch("on");var t,n,a,r,o=[],i=[],s=!1,m={lng:null,lat:null},u=new Date,d=Object(N.a)(u,"yyyy-MM-dd HH:mm"),p=u.toISOString();(y={maximumAge:1e4,timeout:2e4,enableHighAccuracy:!0},new Promise((function(e,t){window.navigator.geolocation.getCurrentPosition(e,t,y)}))).then((function(e){m.lng=e.coords.longitude,m.lat=e.coords.latitude;var t=new URL("https://praise-web.ust.hk/uwsgi/praise-service/"),n=Object(S.a)({todo:"get_data",lng:m.lng.toString(),lat:m.lat.toString(),t0:p,t1:p,pids:"PM10,PM2.5,NO2,O3,SO2,AQHIBN,AQHIER"},z);t.search=new URLSearchParams(n).toString();var a=new URL("https://praise-web.ust.hk/uwsgi/praise-ir-cal/"),r=pe.current,o={IO:r.indoor?"Other Indoor":"Outdoor"};r.indoor&&(o=Object(S.a)(Object(S.a)({},o),{},{MicEnv:[{Factor:"Window",Option:r.windowOpened?"OPEN":"CLOSE"},{Factor:"Air Conditioner",Option:r.airConditionerOn?"ON":"OFF"},{Factor:"Air Purifier",Option:r.airPurifierOn?"ON":"OFF"}]}));var l=Object(S.a)({todo:"ir_cal",input_env:JSON.stringify(o)},G);return a.search=new URLSearchParams(l).toString(),Promise.all([fetch(t).then((function(e){return e.json()})),fetch(a,{referrerPolicy:"origin"}).then((function(e){return e.json()}))])}),(function(e){Ee.setErrorMsg(null,"Unable to get the position"),console.log("cannot get position"),s=!0})).then((function(e){var n=Object(c.a)(e,2),a=n[0],r=n[1];return new Promise((function(e,n){if(0===a.status&&0===r.status){var l={AQHI:a.AQHIBN[0],pctAR:null,NO2_con:r.NO2_IR*a.NO2[0],SO2_con:r.SO2_IR*a.SO2[0],O3_con:r.O3_IR*a.O3[0],PM2dot5_con:r["PM2.5_IR"]*a["PM2.5"][0],PM10_con:r.PM10_IR*a.PM10[0]},c={NO2:.0004462559,SO2:.0001393235,O3:.0005116328,PM2dot5:.0002180567,PM10:.0002821751},s=100*(Math.exp(c.PM10*l.PM10_con)-1),u=100*(Math.exp(c.PM2dot5*l.PM2dot5_con)-1),p=s>u?s:u;l.pctAR=100*(Math.exp(c.NO2*l.NO2_con)-1)+100*(Math.exp(c.SO2*l.SO2_con)-1)+100*(Math.exp(c.O3*l.O3_con)-1)+p;var y=ye.transaction(["symptoms_pollutants_relation"],"readwrite");y.onerror=function(e){n("Error : Unable to insert new symptoms into the DB")},y.oncomplete=function(t){e("All new symptoms are inserted into DB")};var f=y.objectStore("symptoms_pollutants_relation");t={AQHI:l.AQHI,pctAR:l.pctAR,NO2:l.NO2_con,SO2:l.SO2_con,O3:l.O3_con,PM2dot5:l.PM2dot5_con,PM10:l.PM10_con},k.forEach((function(e){if(!e.isNull){var n={datetime:d,coordinates:m,typeName:e.typeName,severity:e.severity,pollutantsValue:t};f.add(n).onsuccess=function(t){e.id=t.target.result,e.datetime=d,o.push(e.typeName),i.push(e.severity)}}}))}else n("Error in the pollutant info: Downloaded data_con not valid")}))}),(function(e){Ee.setErrorMsg(null,"Error in downloading pollutant info: "+e),console.log("Error in downloading pollutant info: ",e),s=!0})).then((function(e){var t=ye.transaction("symptoms_pollutants_relation").objectStore("symptoms_pollutants_relation").index("typeName"),n=o.map((function(e){var n=t.count(e);return new Promise((function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t()}}))}));return Promise.all(n)}),(function(e){Ee.setErrorMsg(null,e),console.log(e),s=!0})).then((function(e){return new Promise((function(t,r){var l=e.indexOf(Math.max.apply(Math,Object(j.a)(e)));n=o[l],a=i[l];var c=ye.transaction("symptoms_pollutants_relation").objectStore("symptoms_pollutants_relation").index("typeName,datetime,severity"),s=IDBKeyRange.bound([n,"2000-01-01 00:00",Number.MIN_SAFE_INTEGER],[n,"9999-12-31 00:00",Number.MAX_SAFE_INTEGER]),m=c.openCursor(s);m.onsuccess=function(e){var n=e.target.result;n&&t(n.value.datetime)},m.onerror=function(){r()}}))}),(function(){console.log("Counting of the no. of the types in the database failed"),Ee.setErrorMsg(null,"Database counting operation failed"),s=!0})).then((function(e){r=Object(_.a)(e,"yyyy-MM-dd HH:mm",new Date)}),(function(){console.log("Starting date retrieval in the database failed"),Ee.setErrorMsg(null,'Database "starting date retrieval" operation failed'),s=!0})).finally((function(){fe.loaderSwitch("off"),Y(!1),e.setSaveNewSymptoms(!1),s||l({path:"/chart",state:{symptom:n,highlightSymptom:!0,highlightedSymptomCurrentSeverity:a,highlightedSymptomCurrentPollutantsValue:t,dateRange:{start:r,end:new Date}}})}))}else e.setSaveNewSymptoms(!1);var y}),[X]),Object(a.useEffect)((function(){var e=setInterval((function(){ne(ge())}),3e4);return function(){clearInterval(e)}}),[]),Object(a.useEffect)((function(){F&&0!==F.length&&F.length<k.length&&window.scrollBy(0,document.body.scrollHeight)}),[k]),Object(a.useEffect)((function(){if(ie){var t=ye.transaction(["symptoms_pollutants_relation"],"readwrite"),n=t.objectStore("symptoms_pollutants_relation"),a=n.index("typeName").openKeyCursor(IDBKeyRange.only(ie));a.onsuccess=function(){var e=a.result;e&&(n.delete(e.primaryKey),e.continue())},t.oncomplete=function(){var t=ye.transaction(["symptom_types"],"readwrite").objectStore("symptom_types"),n=t.index("symptom_type_name").openKeyCursor(IDBKeyRange.only(ie));n.onsuccess=function(){var a=n.result;a?(t.delete(a.primaryKey),a.continue()):e.setSymptomTypes(e.symptomTypes.filter((function(e){return e!==ie})))},n.onerror=function(){console.log('Error occurred when deleting symptom type records in "symptom_types"')}},t.onerror=function(){console.log('Error occurred when deleting symptom records in "symptoms_pollutants_relation"')},ce(null)}}),[ie]);var Se=k.map((function(e){return r.a.createElement(V,{key:e.tempID,tempID:e.tempID,name:e.typeName,isNull:e.isNull,onisNullChange:he,severity:e.severity?e.severity:null,onSeverityChange:Oe,deleteSymptomType:ce})}));return o.path?r.a.createElement(s.a,{to:{pathname:o.path,state:o.state?o.state:null}}):r.a.createElement("div",{className:"page"},r.a.createElement("p",{style:{marginTop:"20px"}},r.a.createElement(x.a,{color:"primary",style:{verticalAlign:"text-bottom"}})," \xa0 ",te,"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",r.a.createElement("span",{onClick:function(){de(!0)},style:{cursor:"pointer"}},r.a.createElement($.a,{color:"primary",style:{verticalAlign:"text-bottom"}})," \xa0 Attributes")),r.a.createElement("p",{style:{textAlign:"center"}},"Mong Kok, Kowloon"),r.a.createElement("div",{style:{paddingTop:5}},Se,r.a.createElement("br",null),r.a.createElement("div",{id:"addNewSymptom_div",onClick:function(){d(!0)},style:{marginBottom:100,cursor:"pointer"}},r.a.createElement("img",{src:M.a,width:24,height:24,style:{verticalAlign:"text-bottom"}})," \xa0\xa0",r.a.createElement(w.a,{variant:"h6",style:{display:"inline-block"}},"Add New Symptom"))),r.a.createElement(P.a,{open:u,onClose:ve},r.a.createElement(R.a,{style:{textAlign:"center"}},"Add Symptom"),r.a.createElement(T.a,null,r.a.createElement(A.a,{label:"New Symptom Name",margin:"normal",variant:"outlined",value:Q,onChange:function(e){W(e.target.value)},error:f.hoisted,helperText:f.hoisted?f.error:"",style:{minWidth:"24ch"}})),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:ve,color:"primary"},"Cancel"),r.a.createElement(I.a,{onClick:function(){var t=Q.trim();if(""!==t){var n=ye.transaction(["symptom_types"],"readwrite").objectStore("symptom_types").add({name:t});n.onsuccess=function(n){e.setSymptomTypes([].concat(Object(j.a)(e.symptomTypes),[t])),ve()},n.onerror=function(e){"ConstraintError"===e.target.error.name?(console.log("Error : The symptom name is already existed"),E({hoisted:!0,error:"The symptom name is already existed"})):console.log("Database Error : Unable to add symptom type.")}}else E({hoisted:!0,error:"Name cannot be empty"})},color:"primary"},"Add"))),r.a.createElement(P.a,{open:b,onClose:be},r.a.createElement(T.a,null,r.a.createElement(D.a,null,"Are you sure? Once saved, you are now allowed to edit or remove it.")),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:function(){be(),Y(!0)},color:"primary"},"Confirm"),r.a.createElement(I.a,{onClick:be,color:"primary",autoFocus:!0},"Cancel"))),r.a.createElement(oe,{isOpen:ue,close:function(){de(!1)},microEnvState:pe.current,setMicroEnvState:function(e){pe.current=e}}))}var ie=n(211);function ce(){return r.a.createElement("div",{className:"page"},r.a.createElement(w.a,{variant:"h6",color:"primary"},"Settings"),r.a.createElement("br",null),r.a.createElement("div",{style:{textAlign:"left"}},r.a.createElement(w.a,{variant:"h5",color:"primary"},"PUSH NOTIFICATION"),r.a.createElement(ie.a,null),r.a.createElement("br",null),r.a.createElement(w.a,{variant:"body1"},r.a.createElement("span",{style:{verticalAlign:"sub"}},"Receive input reminder"),r.a.createElement(U.a,{control:r.a.createElement(te.a,{color:"primary"}),style:{float:"right"}})),r.a.createElement("br",null),r.a.createElement(ie.a,null)),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("div",{style:{textAlign:"left"}},r.a.createElement(w.a,{variant:"h5",color:"primary"},"EXPORT"),r.a.createElement(ie.a,null),r.a.createElement("br",null),r.a.createElement(w.a,{variant:"body1"},r.a.createElement("span",{style:{verticalAlign:"sub"}},"Export correlation chart as image")),r.a.createElement("br",null),r.a.createElement(ie.a,null),r.a.createElement("br",null),r.a.createElement(w.a,{variant:"body1"},r.a.createElement("span",{style:{verticalAlign:"sub"}},"Export data as csv")),r.a.createElement("br",null),r.a.createElement(ie.a,null)))}var se=n(212),me=n(116),ue=n.n(me),de=n(221),pe=n(229),ye=n(219),fe=n(115),Ee=n.n(fe),ge=n(100),ve=n.n(ge);n(161);function be(e){var t=Object(a.useContext)(xe),n=Object(a.useState)((function(){return e.location.state&&e.location.state.symptom?e.location.state.symptom:e.symptomTypes[0]})),o=Object(c.a)(n,2),l=o[0],i=o[1],s=J(l),m=Object(a.useState)((function(){return e.location.state&&e.location.state.highlightSymptom?{currentSeverity:e.location.state.highlightedSymptomCurrentSeverity,currentPollutantsValue:e.location.state.highlightedSymptomCurrentPollutantsValue}:null})),u=Object(c.a)(m,2),d=u[0],y=u[1],f=Object(a.useState)((function(){return e.location.state&&e.location.state.dateRange?{start:e.location.state.dateRange.start,end:e.location.state.dateRange.end}:(t.transaction("symptoms_pollutants_relation").objectStore("symptoms_pollutants_relation").index("datetime").openCursor().onsuccess=function(e){var t=e.target.result;if(t){var n=Object(_.a)(t.value.datetime,"yyyy-MM-dd HH:mm",new Date);v({start:n,end:new Date})}},{start:null,end:new Date})})),E=Object(c.a)(f,2),g=E[0],v=E[1],b=J(g),h=Object(a.useState)(null),O=Object(c.a)(h,2),S=O[0],j=O[1],C=Object(a.useState)("AQHI"),x=Object(c.a)(C,2),k=x[0],M=x[1],D=Object(a.useState)(g.start),L=Object(c.a)(D,2),F=L[0],U=L[1],B=Object(a.useState)(!1),Q=Object(c.a)(B,2),W=Q[0],q=Q[1],K=Object(a.useState)("mounting:start"),V=Object(c.a)(K,2),z=V[0],G=V[1],X=Object(a.useRef)(null),$=function(){S&&j(null),q(!1)},Y=function(e){M(e)};return Object(a.useEffect)((function(){"mounting:start"!==z&&(G("mounting:start"),l===s&&g.start===b.start&&g.end===b.end||y(null))}),[l,g,k]),Object(a.useEffect)((function(){if("mounting:start"!==z){if("mounting:dismounted"===z){for(var e=t.transaction("symptoms_pollutants_relation").objectStore("symptoms_pollutants_relation").index("typeName,datetime,severity"),n=IDBKeyRange.bound([l,g.start?Object(N.a)(g.start,"yyyy-MM-dd HH:mm"):"2000-01-01 00:00",Number.MIN_SAFE_INTEGER],[l,Object(N.a)(g.end,"yyyy-MM-dd HH:mm"),Number.MAX_SAFE_INTEGER]),a=e.openCursor(n),r=new Array(5),o={AQHI:1,pctAR:1,O3:10,NO2:10,SO2:1,PM10:2,PM2dot5:1},i=0;i<r.length;i++){r[i]=new Array(11);for(var c=0;c<11;c++)r[i][c]=0}a.onsuccess=function(e){var t=e.target.result;if(t){var n=t.value.severity-1,a=Math.floor(t.value.pollutantsValue[k]/o[k]);r[n][a]++,t.continue()}else{var l,i;d&&(i={i:d.currentSeverity-1,j:Math.floor(d.currentPollutantsValue[k]/o[k])});for(var c=[],s=0;s<r.length;s++)for(var m=0;m<11;m++){var u=s+1,p=void 0;p="AQHI"===k?m*o[k]:(m+.5)*o[k];var y=r[s][m];c.push({x:u,y:p,r:y}),i&&i.i===s&&i.j===m&&(l=[{x:u,y:p,r:y+6}])}var f,E={AQHI:"rgba(112,193,180,1)",pctAR:"rgba(255,224,102,1)",O3:"rgba(242,204,195,1)",NO2:"rgba(171,163,210,1)",SO2:"rgba(229,151,198,1)",PM10:"rgba(168,237,255,1)",PM2dot5:"rgba(168,237,255,1)"},g={};switch(k){case"AQHI":f="AQHI",g={min:1,callback:function(e){return 11===parseInt(e)?e+"+":e}};break;case"pctAR":f="%AR";break;default:f="concentration (\u03bcgm\xb3)"}var v=[{data:c,backgroundColor:E[k]}];0!==c.length&&v.push({data:l,backgroundColor:E[k].replace(",1)",",0.5)")}),new Ee.a(X.current,{type:"bubble",data:{datasets:v},options:{events:["click"],legend:{display:!1},scales:{xAxes:[{scaleLabel:{display:!0,labelString:"seriousness"}}],yAxes:[{scaleLabel:{display:!0,labelString:f},ticks:g}]}}})}},a.onerror=function(){console.log("error")},G("mounting:mounted")}}else G("mounting:dismounted")}),[z]),Object(a.useEffect)((function(){ve()(window).scrollTop()>0&&ve()(window).scrollTop(0)}),[]),r.a.createElement("div",{className:"page"},r.a.createElement("div",{style:{textAlign:"center",marginTop:"15px"}},r.a.createElement(A.a,{value:(g.start?Object(N.a)(g.start,"ddMMM"):"      ")+" - "+Object(N.a)(g.end,"ddMMM"),InputProps:{endAdornment:r.a.createElement(se.a,{position:"end"},r.a.createElement(ue.a,null))},variant:"outlined",style:{width:"17ch"},onClick:function(e){q(!0)}}),"\xa0\xa0\xa0\xa0",r.a.createElement(de.a,{value:l,onChange:function(e){i(e.target.value)},variant:"outlined",style:{width:"10em"}},e.symptomTypes.map((function(e){return r.a.createElement(pe.a,{key:e,value:e},e)})))),r.a.createElement(p.a,{style:{marginTop:"15px"}},r.a.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"}},r.a.createElement("div",{style:{flex:"none"}},"mounting:start"===z?r.a.createElement("div",{style:{width:300,height:400,maxWidth:300,maxHeight:400,marginRight:20}}):r.a.createElement("canvas",{ref:X,style:{width:300,height:400,maxWidth:300,maxHeight:400,marginRight:20}})),r.a.createElement(Z.a,{style:{flex:"none"},orientation:"vertical",color:"primary",size:"small"},r.a.createElement(I.a,{onClick:function(){Y("AQHI")},variant:"AQHI"===k?"contained":"outlined"},"AQHI"),r.a.createElement(I.a,{onClick:function(){Y("pctAR")},variant:"pctAR"===k?"contained":"outlined"},"%AR"),r.a.createElement(I.a,{onClick:function(){Y("O3")},variant:"O3"===k?"contained":"outlined"},"O",r.a.createElement("span",{className:"sub"},"3")),r.a.createElement(I.a,{onClick:function(){Y("NO2")},variant:"NO2"===k?"contained":"outlined"},"NO",r.a.createElement("span",{className:"sub"},"2")),r.a.createElement(I.a,{onClick:function(){Y("SO2")},variant:"SO2"===k?"contained":"outlined"},"SO",r.a.createElement("span",{className:"sub"},"2")),r.a.createElement(I.a,{onClick:function(){Y("PM10")},variant:"PM10"===k?"contained":"outlined"},"PM",r.a.createElement("span",{className:"sub"},"10")),r.a.createElement(I.a,{onClick:function(){Y("PM2dot5")},variant:"PM2dot5"===k?"contained":"outlined"},"PM",r.a.createElement("span",{className:"sub"},"2.5")))),r.a.createElement("p",null,"Entry: ",l),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.a,{variant:"h6"},"Health Advisory"),r.a.createElement(w.a,{variant:"body1",style:{textAlign:"left"}},"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")),r.a.createElement(P.a,{open:W,onEnter:function(){U(g.start)},onClose:$},r.a.createElement(R.a,null,S?"To":"From"),r.a.createElement(T.a,null,r.a.createElement(ye.a,{autoOk:!0,orientation:"landscape",variant:"static",disableToolbar:!0,minDate:S||null,disableFuture:!0,openTo:"date",value:F,onChange:U})),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:$,color:"primary"},"Cancel"),r.a.createElement(I.a,{onClick:function(){S?(v({start:S,end:F}),$()):(j(F),S>g.end?U(S):U(g.end))},color:"primary"},S?"Done":"Next"))))}var he=n(117),Oe=n.n(he),Se=n(214),je=n(121),we=n.n(je),Ce=r.a.createContext({UILocker:{isUILockerOn:null,UILockerSwitch:null,UILockerRequireCount:null},loader:{isLoading:null,loaderSwitch:null,loaderRequireCount:null},errorDialog:{setErrorMsg:null}}),xe=r.a.createContext(null);function Ne(){var e=Object(a.useRef)(0).current,t=Object(a.useRef)(0).current,n=Object(s.g)(),o=Object(a.useState)(!1),l=Object(c.a)(o,2),i=l[0],u=l[1],E=Object(a.useState)(!1),v=Object(c.a)(E,2),h=v[0],S=v[1],j=Object(a.useState)({isOpen:!1,title:null,contentText:null}),w=Object(c.a)(j,2),C=w[0],x=w[1],N=Object(a.useState)(null),_=Object(c.a)(N,2),k=_[0],M=_[1],I=Object(a.useState)([]),A=Object(c.a)(I,2),P=A[0],R=A[1],T=Object(a.useState)(!1),D=Object(c.a)(T,2),H=D[0],L=D[1];Object(a.useEffect)((function(){var e=window.indexedDB.open("praiseHK-lite_symptom-analyzer_DB",1);e.onupgradeneeded=function(e){var t=e.target.result,n=t.createObjectStore("symptom_types",{keyPath:"id",autoIncrement:!0});n.createIndex("symptom_type_name","name",{unique:!0});var a=["Wheezing","Phlegm","Shortness of breath","Chest tightness","Itchy eyes","Redness of eyes"];n.transaction.oncomplete=function(e){var n=t.transaction("symptom_types","readwrite").objectStore("symptom_types");a.forEach((function(e){n.add({name:e})}))};var r=t.createObjectStore("symptoms_pollutants_relation",{keyPath:"id",autoIncrement:!0});r.createIndex("datetime","datetime",{unique:!1}),r.createIndex("typeName","typeName",{unique:!1}),r.createIndex("typeName,datetime,severity",["typeName","datetime","severity"],{unique:!1})},e.onsuccess=function(e){M(e.target.result)},e.onerror=function(e){console.log("Database initialization error")}}),[]),Object(a.useEffect)((function(){if(k){var e=k.transaction("symptom_types").objectStore("symptom_types").openCursor(),t=[];e.onsuccess=function(e){var n=e.target.result;n?(t.push(n.value.name),n.continue()):R(t)},e.onerror=function(){console.log("Error: failed to get symptom types from the database")}}}),[k]);var F=Object(s.h)().pathname;return"/"===F&&(F+="home"),"/android_asset/www/index.html"===F&&(F="/home"),k?0===P.length?r.a.createElement(r.a.Fragment,null):r.a.createElement(r.a.Fragment,null,r.a.createElement(_e,{isLoading:h}),r.a.createElement(ke,{isLocked:i}),r.a.createElement(Me,{state:C,setState:x}),r.a.createElement(xe.Provider,{value:k},r.a.createElement(Ce.Provider,{value:{UILocker:{isUILockerOn:i,UILockerSwitch:function(t){"on"===t?(0===e&&u(!0),e++):"off"===t&&0===--e&&u(!1)},UILockerRequireCount:e},loader:{isLoading:h,loaderSwitch:function(e){"on"===e?(0===t&&S(!0),t++):"off"===e&&0===--t&&S(!1)},loaderRequireCount:t},errorDialog:{setErrorMsg:function(e,t){x({isOpen:!0,title:e,contentText:t})}}}},r.a.createElement("div",{className:"App"},r.a.createElement(m.a,{color:"inherit",position:"sticky",style:{paddingTop:"10px",paddingBottom:"10px"}},r.a.createElement("div",null,r.a.createElement("img",{src:d.a,width:89,height:52}))),r.a.createElement(p.a,{maxWidth:"md",style:{marginTop:"10px"}},r.a.createElement(s.d,null,r.a.createElement(s.b,{path:"/settings",component:ce}),r.a.createElement(s.b,{path:"/chart",render:function(e){return r.a.createElement(be,Object.assign({},e,{symptomTypes:P}))}}),r.a.createElement(s.b,{path:"/",render:function(e){return r.a.createElement(le,Object.assign({},e,{symptomTypes:P,setSymptomTypes:R,saveNewSymptoms:H,setSaveNewSymptoms:L}))}}))),r.a.createElement(p.a,{maxWidth:!1,style:{position:"fixed",bottom:0,backgroundColor:"white"}},r.a.createElement(y.a,{value:F.substring(1),onChange:function(e,t){n.push("/"+t)},showLabels:!0,style:{marginLeft:"auto",marginRight:"auto",maxWidth:"500px"}},r.a.createElement(f.a,{value:"chart",icon:r.a.createElement(g.a,null)}),r.a.createElement(f.a,{value:"home",icon:r.a.createElement(O.a,null)}),r.a.createElement(f.a,{value:"settings",icon:r.a.createElement(b.a,null)})),"/home"===F&&r.a.createElement("img",{src:Oe.a,onClick:function(){L(!0)},style:{position:"absolute",bottom:"15px",left:"50%",WebkitTransform:"translateX(-50%)",transform:"translateX(-50%)",width:"64px",height:"64px",cursor:"pointer"}})))))):r.a.createElement(r.a.Fragment,null)}function _e(e){return r.a.createElement("div",{className:"loader-modal-screen ".concat(e.isLoading?"loading":"not-loading")},r.a.createElement(Se.a,{style:{color:"grey"},thickness:6}))}function ke(e){return r.a.createElement("div",{className:"UILocker-modal-screen ".concat(e.isLocked?"UI-locked":"UI-not-locked")})}function Me(e){var t=e.state,n=t.isOpen,a=t.title,o=t.contentText;function l(){e.setState({isOpen:!1,title:null,contentText:null})}return r.a.createElement(P.a,{open:n,onClose:l},r.a.createElement(R.a,null,r.a.createElement(we.a,{color:"secondary"})," ",a||"Error"),r.a.createElement(T.a,null,r.a.createElement(D.a,null,o)),r.a.createElement(H.a,null,r.a.createElement(I.a,{onClick:l,color:"primary",autoFocus:!0},"OK")))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(162);var Ie=n(23),Ae=n(122),Pe=n(220),Re=n(123),Te=n(218);document.addEventListener("deviceready",(function(){var e=Object(Re.a)({palette:{primary:{main:"#0091CE"}}});l.a.render(r.a.createElement("div",null,r.a.createElement(Pe.b,{injectFirst:!0},r.a.createElement(i.a,null," ",r.a.createElement(Ie.a,{utils:Ae.a},r.a.createElement(Te.a,{theme:e},r.a.createElement(Ne,null)))))),document.getElementById("root"))}),!1),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[145,1,2]]]);
//# sourceMappingURL=main.070f6ced.chunk.js.map