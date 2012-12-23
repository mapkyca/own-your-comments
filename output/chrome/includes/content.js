﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
var kango={event:{MESSAGE:"message"},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);eval("(function(){"+c+"\n})();")}},browser:{getName:function(){return null}},console:{log:function(b){"undefined"!=typeof opera?opera.postError(b):console.log(b)}},io:{},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=
JSON.parse(a.response)}catch(g){a.response=null}else if("xml"==c)try{var e=null,e="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,f=new e;a.response=f.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=c;d(a)})}},_init:function(b){"undefined"==typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};


// Merged from /Users/barnabywalters/Documents/Programming/kango-framework-latest/src/js/chrome/includes/content_kango.part.js

kango.browser.getName=function(){return"chrome"};kango.io.getResourceUrl=function(a){return chrome.extension.getURL(a)};
kango._initMessaging=function(){var a=[],e=chrome.extension.connect({name:window==window.top?"main":Math.random().toString()});e.onMessage.addListener(function(c){c.source=c.target=kango;for(var b=0;b<a.length;b++)a[b](c)});kango.dispatchMessage=function(a,b){e.postMessage({name:a,data:b,origin:"tab",source:null,target:null});return!0};kango.addEventListener=function(c,b){if("message"==c){for(var d=0;d<a.length;d++)if(a[d]==b)return;a.push(b)}};(new kango.InvokeAsyncModule).init(kango);(new kango.MessageTargetModule).init(kango)};
kango.InvokeAsyncModule=function(){};
kango.InvokeAsyncModule.prototype.init=function(e){var g={},i=0,f=function(a){return"undefined"!=typeof a.call&&"undefined"!=typeof a.apply},j=function(a,b){var c={id:a.id,result:null,error:null};try{c.result=e.lang.invoke(e.getContext(),a.method,a.params)}catch(d){c.error=d.toString(),kango.console.log("Error during async call method "+a.method+". Details: "+c.error)}null!=a.id&&b.dispatchMessage("KangoInvokeAsyncModule_result",c)},k=function(a,b){var c={id:a.id,result:null,error:null};try{a.params.push(function(d){c.result=
d;null!=a.id&&b.dispatchMessage("KangoInvokeAsyncModule_result",c)}),e.lang.invoke(e.getContext(),a.method,a.params)}catch(d){c.error=d.toString(),null!=a.id?b.dispatchMessage("KangoInvokeAsyncModule_result",c):kango.console.log("Error during async call method "+a.method+". Details: "+c.error)}},l=function(a){if("undefined"!=typeof a.id&&"undefined"!=typeof g[a.id]){var b=g[a.id];try{if(null==a.error&&f(b.onSuccess))b.onSuccess(a.result);else if(f(b.onError))b.onError(a.error)}finally{delete g[a.id]}}};
e.addEventListener("message",function(a){var b={};b.KangoInvokeAsyncModule_invoke=j;b.KangoInvokeAsyncModule_invokeCallback=k;b.KangoInvokeAsyncModule_result=l;var c=a.data,d;for(d in b)if(b.hasOwnProperty(d)&&d==a.name){b[d](c,a.source);break}});var h=function(a,b){var b=Array.prototype.slice.call(b,0),c=b[b.length-1],d={onSuccess:function(){},onError:function(a){kango.console.log("Error during async call method "+b[0]+". Details: "+a)},isCallbackInvoke:a,isNotifyInvoke:!1};null!=c&&f(c)?(d.onSuccess=
function(a){c(a)},b[b.length-1]=d):(d.isNotifyInvoke=!0,b.push(d));e.invokeAsyncEx.apply(e,b)};e.invokeAsyncEx=function(a){var b=arguments[arguments.length-1],c=b.isCallbackInvoke?"KangoInvokeAsyncModule_invokeCallback":"KangoInvokeAsyncModule_invoke",d=Array.prototype.slice.call(arguments,1,arguments.length-1),f=null;b.isNotifyInvoke||(f=(Math.random()+i++).toString(),g[f]=b);e.dispatchMessage(c,{id:f,method:a,params:d})};e.invokeAsync=function(a){h(!1,arguments)};e.invokeAsyncCallback=function(a){h(!0,
arguments)}};"undefined"!=typeof kango&&"undefined"!=typeof kango.registerModule&&kango.registerModule(kango.InvokeAsyncModule);
kango.MessageTargetModule=function(){};
kango.MessageTargetModule.prototype.init=function(e){var a={};e.addMessageListener=function(b,d){if("undefined"!=typeof d.call&&"undefined"!=typeof d.apply){a[b]=a[b]||[];for(var c=0;c<a[b].length;c++)if(a[b][c]==d)return!1;a[b].push(d);return!0}return!1};e.removeMessageListener=function(b,d){if("undefined"!=typeof a[b])for(var c=0;c<a[b].length;c++)if(a[b][c]==d)return a[b].splice(c,1),!0;return!1};e.removeAllMessageListeners=function(){a={}};e.addEventListener("message",function(b){var d=b.name;
if("undefined"!=typeof a[d])for(var c=0;c<a[d].length;c++)a[d][c](b)})};"undefined"!=typeof kango&&"undefined"!=typeof kango.registerModule&&kango.registerModule(kango.MessageTargetModule);
kango.UserscriptEngineClient=function(){};kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new kango.UserscriptApi(c);a.kango=kango;kango.lang.evalInSandbox(c,a,b)}catch(d){kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};kango.UserscriptApi=function(){};
kango.UserscriptApi.prototype={};
window.addEventListener("DOMContentLoaded",function(){kango._init("document-end")},!1);kango._init("document-start");