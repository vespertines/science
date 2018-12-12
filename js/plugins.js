// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
 * @name jQuery Stick 'em
 * @author Trevor Davis
 * @version 1.4.1
 *
 *	$('.container').stickem({
 *		item: '.stickem',
 *		container: '.stickem-container',
 *		stickClass: 'stickit',
 *		endStickClass: 'stickit-end',
 *		offset: 0,
 *		onStick: null,
 *		onUnstick: null
 *	});
 */

;
(function ($, window, document, undefined) {

    var Stickem = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data("stickem-options");
        this.$win = $(window);
    };

    Stickem.prototype = {
        defaults: {
            item: '.stickem',
            container: '.stickem-container',
            stickClass: 'stickit',
            endStickClass: 'stickit-end',
            offset: 90,
            start: 0,
            onStick: null,
            onUnstick: null
        },

        init: function () {
            var _self = this;

            //Merge options
            _self.config = $.extend({}, _self.defaults, _self.options, _self.metadata);

            _self.setWindowHeight();
            _self.getItems();
            _self.bindEvents();

            return _self;
        },

        bindEvents: function () {
            var _self = this;

            _self.$win.on('scroll.stickem', $.proxy(_self.handleScroll, _self));
            _self.$win.on('resize.stickem', $.proxy(_self.handleResize, _self));
        },

        destroy: function () {
            var _self = this;

            _self.$win.off('scroll.stickem');
            _self.$win.off('resize.stickem');
        },

        getItem: function (index, element) {
            var _self = this;
            var $this = $(element);
            var item = {
                $elem: $this,
                elemHeight: $this.height(),
                $container: $this.parents(_self.config.container),
                isStuck: false
            };

            //If the element is smaller than the window
            if (_self.windowHeight > item.elemHeight) {
                item.containerHeight = item.$container.outerHeight();
                item.containerInner = {
                    border: {
                        bottom: parseInt(item.$container.css('border-bottom'), 10) || 0,
                        top: parseInt(item.$container.css('border-top'), 10) || 0
                    },
                    padding: {
                        bottom: parseInt(item.$container.css('padding-bottom'), 10) || 0,
                        top: parseInt(item.$container.css('padding-top'), 10) || 0
                    }
                };

                item.containerInnerHeight = item.$container.height();
                item.containerStart = item.$container.offset().top - _self.config.offset + _self.config.start + item.containerInner.padding.top + item.containerInner.border.top;
                item.scrollFinish = item.containerStart - _self.config.start + (item.containerInnerHeight - item.elemHeight);

                //If the element is smaller than the container
                if (item.containerInnerHeight > item.elemHeight) {
                    _self.items.push(item);
                }
            } else {
                item.$elem.removeClass(_self.config.stickClass + ' ' + _self.config.endStickClass);
            }
        },

        getItems: function () {
            var _self = this;

            _self.items = [];

            _self.$elem.find(_self.config.item).each($.proxy(_self.getItem, _self));
        },

        handleResize: function () {
            var _self = this;

            _self.getItems();
            _self.setWindowHeight();
        },

        handleScroll: function () {
            var _self = this;

            if (_self.items.length > 0) {
                var pos = _self.$win.scrollTop();

                for (var i = 0, len = _self.items.length; i < len; i++) {
                    var item = _self.items[i];

                    //If it's stuck, and we need to unstick it, or if the page loads below it
                    if ((item.isStuck && (pos < item.containerStart || pos > item.scrollFinish)) || pos > item.scrollFinish) {
                        item.$elem.removeClass(_self.config.stickClass);

                        //only at the bottom
                        if (pos > item.scrollFinish) {
                            item.$elem.addClass(_self.config.endStickClass);
                        }

                        item.isStuck = false;

                        //if supplied fire the onUnstick callback
                        if (_self.config.onUnstick) {
                            _self.config.onUnstick(item);
                        }

                        //If we need to stick it
                    } else if (item.isStuck === false && pos > item.containerStart && pos < item.scrollFinish) {
                        item.$elem.removeClass(_self.config.endStickClass).addClass(_self.config.stickClass);
                        item.isStuck = true;

                        //if supplied fire the onStick callback
                        if (_self.config.onStick) {
                            _self.config.onStick(item);
                        }
                    }
                }
            }
        },

        setWindowHeight: function () {
            var _self = this;

            _self.windowHeight = _self.$win.height() - _self.config.offset;
        }
    };

    Stickem.defaults = Stickem.prototype.defaults;

    $.fn.stickem = function (options) {
        //Create a destroy method so that you can kill it and call it again.
        this.destroy = function () {
            this.each(function () {
                new Stickem(this, options).destroy();
            });
        };

        return this.each(function () {
            new Stickem(this, options).init();
        });
    };

})(jQuery, window, document);

!function(){"use strict";function e(n){return"undefined"==typeof this||Object.getPrototypeOf(this)!==e.prototype?new e(n):(O=this,O.version="3.3.6",O.tools=new E,O.isSupported()?(O.tools.extend(O.defaults,n||{}),O.defaults.container=t(O.defaults),O.store={elements:{},containers:[]},O.sequences={},O.history=[],O.uid=0,O.initialized=!1):"undefined"!=typeof console&&null!==console,O)}function t(e){if(e&&e.container){if("string"==typeof e.container)return window.document.documentElement.querySelector(e.container);if(O.tools.isNode(e.container))return e.container}return O.defaults.container}function n(e,t){return"string"==typeof e?Array.prototype.slice.call(t.querySelectorAll(e)):O.tools.isNode(e)?[e]:O.tools.isNodeList(e)?Array.prototype.slice.call(e):[]}function i(){return++O.uid}function o(e,t,n){t.container&&(t.container=n),e.config?e.config=O.tools.extendClone(e.config,t):e.config=O.tools.extendClone(O.defaults,t),"top"===e.config.origin||"bottom"===e.config.origin?e.config.axis="Y":e.config.axis="X"}function r(e){var t=window.getComputedStyle(e.domEl);e.styles||(e.styles={transition:{},transform:{},computed:{}},e.styles.inline=e.domEl.getAttribute("style")||"",e.styles.inline+="; visibility: visible; ",e.styles.computed.opacity=t.opacity,t.transition&&"all 0s ease 0s"!==t.transition?e.styles.computed.transition=t.transition+", ":e.styles.computed.transition=""),e.styles.transition.instant=s(e,0),e.styles.transition.delayed=s(e,e.config.delay),e.styles.transform.initial=" -webkit-transform:",e.styles.transform.target=" -webkit-transform:",a(e),e.styles.transform.initial+="transform:",e.styles.transform.target+="transform:",a(e)}function s(e,t){var n=e.config;return"-webkit-transition: "+e.styles.computed.transition+"-webkit-transform "+n.duration/1e3+"s "+n.easing+" "+t/1e3+"s, opacity "+n.duration/1e3+"s "+n.easing+" "+t/1e3+"s; transition: "+e.styles.computed.transition+"transform "+n.duration/1e3+"s "+n.easing+" "+t/1e3+"s, opacity "+n.duration/1e3+"s "+n.easing+" "+t/1e3+"s; "}function a(e){var t,n=e.config,i=e.styles.transform;t="top"===n.origin||"left"===n.origin?/^-/.test(n.distance)?n.distance.substr(1):"-"+n.distance:n.distance,parseInt(n.distance)&&(i.initial+=" translate"+n.axis+"("+t+")",i.target+=" translate"+n.axis+"(0)"),n.scale&&(i.initial+=" scale("+n.scale+")",i.target+=" scale(1)"),n.rotate.x&&(i.initial+=" rotateX("+n.rotate.x+"deg)",i.target+=" rotateX(0)"),n.rotate.y&&(i.initial+=" rotateY("+n.rotate.y+"deg)",i.target+=" rotateY(0)"),n.rotate.z&&(i.initial+=" rotateZ("+n.rotate.z+"deg)",i.target+=" rotateZ(0)"),i.initial+="; opacity: "+n.opacity+";",i.target+="; opacity: "+e.styles.computed.opacity+";"}function l(e){var t=e.config.container;t&&O.store.containers.indexOf(t)===-1&&O.store.containers.push(e.config.container),O.store.elements[e.id]=e}function c(e,t,n){var i={target:e,config:t,interval:n};O.history.push(i)}function f(){if(O.isSupported()){y();for(var e=0;e<O.store.containers.length;e++)O.store.containers[e].addEventListener("scroll",d),O.store.containers[e].addEventListener("resize",d);O.initialized||(window.addEventListener("scroll",d),window.addEventListener("resize",d),O.initialized=!0)}return O}function d(){T(y)}function u(){var e,t,n,i;O.tools.forOwn(O.sequences,function(o){i=O.sequences[o],e=!1;for(var r=0;r<i.elemIds.length;r++)n=i.elemIds[r],t=O.store.elements[n],q(t)&&!e&&(e=!0);i.active=e})}function y(){var e,t;u(),O.tools.forOwn(O.store.elements,function(n){t=O.store.elements[n],e=w(t),g(t)?(t.config.beforeReveal(t.domEl),e?t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.target+t.styles.transition.delayed):t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.target+t.styles.transition.instant),p("reveal",t,e),t.revealing=!0,t.seen=!0,t.sequence&&m(t,e)):v(t)&&(t.config.beforeReset(t.domEl),t.domEl.setAttribute("style",t.styles.inline+t.styles.transform.initial+t.styles.transition.instant),p("reset",t),t.revealing=!1)})}function m(e,t){var n=0,i=0,o=O.sequences[e.sequence.id];o.blocked=!0,t&&"onload"===e.config.useDelay&&(i=e.config.delay),e.sequence.timer&&(n=Math.abs(e.sequence.timer.started-new Date),window.clearTimeout(e.sequence.timer)),e.sequence.timer={started:new Date},e.sequence.timer.clock=window.setTimeout(function(){o.blocked=!1,e.sequence.timer=null,d()},Math.abs(o.interval)+i-n)}function p(e,t,n){var i=0,o=0,r="after";switch(e){case"reveal":o=t.config.duration,n&&(o+=t.config.delay),r+="Reveal";break;case"reset":o=t.config.duration,r+="Reset"}t.timer&&(i=Math.abs(t.timer.started-new Date),window.clearTimeout(t.timer.clock)),t.timer={started:new Date},t.timer.clock=window.setTimeout(function(){t.config[r](t.domEl),t.timer=null},o-i)}function g(e){if(e.sequence){var t=O.sequences[e.sequence.id];return t.active&&!t.blocked&&!e.revealing&&!e.disabled}return q(e)&&!e.revealing&&!e.disabled}function w(e){var t=e.config.useDelay;return"always"===t||"onload"===t&&!O.initialized||"once"===t&&!e.seen}function v(e){if(e.sequence){var t=O.sequences[e.sequence.id];return!t.active&&e.config.reset&&e.revealing&&!e.disabled}return!q(e)&&e.config.reset&&e.revealing&&!e.disabled}function b(e){return{width:e.clientWidth,height:e.clientHeight}}function h(e){if(e&&e!==window.document.documentElement){var t=x(e);return{x:e.scrollLeft+t.left,y:e.scrollTop+t.top}}return{x:window.pageXOffset,y:window.pageYOffset}}function x(e){var t=0,n=0,i=e.offsetHeight,o=e.offsetWidth;do isNaN(e.offsetTop)||(t+=e.offsetTop),isNaN(e.offsetLeft)||(n+=e.offsetLeft),e=e.offsetParent;while(e);return{top:t,left:n,height:i,width:o}}function q(e){function t(){var t=c+a*s,n=f+l*s,i=d-a*s,y=u-l*s,m=r.y+e.config.viewOffset.top,p=r.x+e.config.viewOffset.left,g=r.y-e.config.viewOffset.bottom+o.height,w=r.x-e.config.viewOffset.right+o.width;return t<g&&i>m&&n<w&&y>p}function n(){return"fixed"===window.getComputedStyle(e.domEl).position}var i=x(e.domEl),o=b(e.config.container),r=h(e.config.container),s=e.config.viewFactor,a=i.height,l=i.width,c=i.top,f=i.left,d=c+a,u=f+l;return t()||n()}function E(){}var O,T;e.prototype.defaults={origin:"bottom",distance:"20px",duration:500,delay:0,rotate:{x:0,y:0,z:0},opacity:0,scale:.9,easing:"cubic-bezier(0.6, 0.2, 0.1, 1)",container:window.document.documentElement,mobile:!0,reset:!1,useDelay:"always",viewFactor:.2,viewOffset:{top:0,right:0,bottom:0,left:0},beforeReveal:function(e){},beforeReset:function(e){},afterReveal:function(e){},afterReset:function(e){}},e.prototype.isSupported=function(){var e=document.documentElement.style;return"WebkitTransition"in e&&"WebkitTransform"in e||"transition"in e&&"transform"in e},e.prototype.reveal=function(e,s,a,d){var u,y,m,p,g,w;if(void 0!==s&&"number"==typeof s?(a=s,s={}):void 0!==s&&null!==s||(s={}),u=t(s),y=n(e,u),!y.length)return O;a&&"number"==typeof a&&(w=i(),g=O.sequences[w]={id:w,interval:a,elemIds:[],active:!1});for(var v=0;v<y.length;v++)p=y[v].getAttribute("data-sr-id"),p?m=O.store.elements[p]:(m={id:i(),domEl:y[v],seen:!1,revealing:!1},m.domEl.setAttribute("data-sr-id",m.id)),g&&(m.sequence={id:g.id,index:g.elemIds.length},g.elemIds.push(m.id)),o(m,s,u),r(m),l(m),O.tools.isMobile()&&!m.config.mobile||!O.isSupported()?(m.domEl.setAttribute("style",m.styles.inline),m.disabled=!0):m.revealing||m.domEl.setAttribute("style",m.styles.inline+m.styles.transform.initial);return!d&&O.isSupported()&&(c(e,s,a),O.initTimeout&&window.clearTimeout(O.initTimeout),O.initTimeout=window.setTimeout(f,0)),O},e.prototype.sync=function(){if(O.history.length&&O.isSupported()){for(var e=0;e<O.history.length;e++){var t=O.history[e];O.reveal(t.target,t.config,t.interval,!0)}f()}return O},E.prototype.isObject=function(e){return null!==e&&"object"==typeof e&&e.constructor===Object},E.prototype.isNode=function(e){return"object"==typeof window.Node?e instanceof window.Node:e&&"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},E.prototype.isNodeList=function(e){var t=Object.prototype.toString.call(e),n=/^\[object (HTMLCollection|NodeList|Object)\]$/;return"object"==typeof window.NodeList?e instanceof window.NodeList:e&&"object"==typeof e&&n.test(t)&&"number"==typeof e.length&&(0===e.length||this.isNode(e[0]))},E.prototype.forOwn=function(e,t){if(!this.isObject(e))throw new TypeError('Expected "object", but received "'+typeof e+'".');for(var n in e)e.hasOwnProperty(n)&&t(n)},E.prototype.extend=function(e,t){return this.forOwn(t,function(n){this.isObject(t[n])?(e[n]&&this.isObject(e[n])||(e[n]={}),this.extend(e[n],t[n])):e[n]=t[n]}.bind(this)),e},E.prototype.extendClone=function(e,t){return this.extend(this.extend({},e),t)},E.prototype.isMobile=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},T=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return e}):"undefined"!=typeof module&&module.exports?module.exports=e:window.ScrollReveal=e}();

// KUTE.js v1.6.6 | © dnp_theme | Core Engine | MIT-License
!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.KUTE=e()}(this,function(){"use strict";for(var t,e="undefined"!=typeof global?global:window,i=e.performance,n=document.body,r=[],s=null,a="length",o="split",u="indexOf",h="options",c="valuesStart",l="valuesEnd",f="element",p="delay",v="repeat",g="yoyo",m="style",w=["color","backgroundColor"],y=["top","left","width","height"],I=["translate3d","translateX","translateY","translateZ","rotate","translate","rotateX","rotateY","rotateZ","skewX","skewY","scale"],b=["opacity"],M=w.concat(b,y,I),O={},T=0,k=M[a];T<k;T++)t=M[T],-1!==w[u](t)?O[t]="rgba(0,0,0,0)":-1!==y[u](t)?O[t]=0:"translate3d"===t?O[t]=[0,0,0]:"translate"===t?O[t]=[0,0]:"rotate"===t||/X|Y|Z/.test(t)?O[t]=0:"scale"!==t&&"opacity"!==t||(O[t]=1);var x={duration:700,delay:0,offset:0,repeat:0,repeatDelay:0,yoyo:!1,easing:"linear",keepHex:!1},E=function(){for(var t,e=["Moz","moz","Webkit","webkit","O","o","Ms","ms"],i=0,r=e[a];i<r;i++)if(e[i]+"Transform"in n[m]){t=e[i];break}return t},P=function(t){var e=!(t in n[m]),i=E();return e?i+(t.charAt(0).toUpperCase()+t.slice(1)):t},Y=function(t,e){var i;if(null===(i=e?t instanceof Object||"object"==typeof t?t:document.querySelectorAll(t):"object"==typeof t?t:document.querySelector(t))&&"window"!==t)throw new TypeError("Element not found or incorrect selector: "+t);return i},X=function(t){return 180*t/Math.PI},C=function(t,e){for(var i,n=parseInt(t)||0,r=["px","%","deg","rad","em","rem","vh","vw"],s=0;s<r[a];s++)if("string"==typeof t&&-1!==t[u](r[s])){i=r[s];break}return i=void 0!==i?i:e?"deg":"px",{v:n,u:i}},F=function(t){if(/rgb|rgba/.test(t)){var i=t.replace(/\s|\)/,"")[o]("(")[1][o](","),n=i[3]?i[3]:null;return n?{r:parseInt(i[0]),g:parseInt(i[1]),b:parseInt(i[2]),a:parseFloat(n)}:{r:parseInt(i[0]),g:parseInt(i[1]),b:parseInt(i[2])}}if(/^#/.test(t)){var r=_(t);return{r:r.r,g:r.g,b:r.b}}if(/transparent|none|initial|inherit/.test(t))return{r:0,g:0,b:0,a:0};if(!/^#|^rgb/.test(t)){var s=document.getElementsByTagName("head")[0];s[m].color=t;var a=e.getComputedStyle(s,null).color;return a=/rgb/.test(a)?a.replace(/[^\d,]/g,"")[o](","):[0,0,0],s[m].color="",{r:parseInt(a[0]),g:parseInt(a[1]),b:parseInt(a[2])}}},A=function(t,e,i){return"#"+((1<<24)+(t<<16)+(e<<8)+i).toString(16).slice(1)},_=function(t){var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;t=t.replace(e,function(t,e,i,n){return e+e+i+i+n+n});var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return i?{r:parseInt(i[1],16),g:parseInt(i[2],16),b:parseInt(i[3],16)}:null},S=function(t){if(t){for(var e=t[m].cssText.replace(/\s/g,"")[o](";"),i={},n=0,r=e[a];n<r;n++)if(/transform/i.test(e[n]))for(var s=e[n][o](":")[1][o](")"),h=0,c=s[a]-1;h<c;h++){var l=s[h][o]("("),f=l[0],p=l[1];-1!==I[u](f)&&(i[f]=/translate3d/.test(f)?p[o](","):p)}return i}},Z=function(t,i){var n=t[m],r=e.getComputedStyle(t,null)||t.currentStyle,s=P(i),a=n[i]&&!/auto|initial|none|unset/.test(n[i])?n[i]:r[s];if("transform"!==i&&(s in r||s in n)){if(a){if("filter"===s){var u=parseInt(a[o]("=")[1].replace(")",""));return parseFloat(u/100)}return a}return O[i]}},B=function(t){r.push(t)},$=function(t){var e=r[u](t);-1!==e&&r.splice(e,1)},q=function(){setTimeout(function(){!r[a]&&s&&(D(s),s=null)},64)},H="ontouchstart"in e||navigator&&navigator.msMaxTouchPoints||!1,Q=H?"touchstart":"mousewheel",R=e.requestAnimationFrame||e.webkitRequestAnimationFrame||function(t){return setTimeout(t,16)},D=e.cancelAnimationFrame||e.webkitCancelRequestAnimationFrame||function(t){return clearTimeout(t)},W=P("transform"),z=document.getElementsByTagName("HTML")[0],j=navigator&&/(EDGE|Mac)/i.test(navigator.userAgent)?n:z,N=!(!navigator||null===new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(navigator.userAgent))&&parseFloat(RegExp.$1),L=8===N,U=e.Interpolate={},G=U.number=function(t,e,i){return t=+t,e-=t,t+e*i},K=(U.unit=function(t,e,i,n){return t=+t,e-=t,t+e*n+i},U.color=function(t,e,i,n){var r,s={};for(r in e)s[r]="a"!==r?G(t[r],e[r],i)>>0||0:t[r]&&e[r]?(100*G(t[r],e[r],i)>>0)/100:null;return n?A(s.r,s.g,s.b):s.a?"rgba("+s.r+","+s.g+","+s.b+","+s.a+")":"rgb("+s.r+","+s.g+","+s.b+")"}),J=U.translate=function(t,e,i,n){var r={};for(var s in e)r[s]=(t[s]===e[s]?e[s]:(1e3*(t[s]+(e[s]-t[s])*n)>>0)/1e3)+i;return r.x||r.y?"translate("+r.x+","+r.y+")":"translate3d("+r.translateX+","+r.translateY+","+r.translateZ+")"},V=U.rotate=function(t,e,i,n){var r={};for(var s in e)r[s]="z"===s?"rotate("+(1e3*(t[s]+(e[s]-t[s])*n)>>0)/1e3+i+")":s+"("+(1e3*(t[s]+(e[s]-t[s])*n)>>0)/1e3+i+")";return r.z?r.z:(r.rotateX||"")+(r.rotateY||"")+(r.rotateZ||"")},tt=U.skew=function(t,e,i,n){var r={};for(var s in e)r[s]=s+"("+(1e3*(t[s]+(e[s]-t[s])*n)>>0)/1e3+i+")";return(r.skewX||"")+(r.skewY||"")},et=U.scale=function(t,e,i){return"scale("+(1e3*(t+(e-t)*i)>>0)/1e3+")"},it={},nt=function(t){for(var e=0;e<r[a];)rt.call(r[e],t)?e++:r.splice(e,1);s=R(nt)},rt=function(t){if((t=t||i.now())<this._startTime&&this.playing)return!0;var e=Math.min((t-this._startTime)/this[h].duration,1),n=this[h].easing(e);for(var r in this[l])it[r](this[f],r,this[c][r],this[l][r],n,this[h]);if(this[h].update&&this[h].update.call(this),1===e){if(this[h][v]>0)return isFinite(this[h][v])&&this[h][v]--,this[h][g]&&(this.reversed=!this.reversed,ct.call(this)),this._startTime=this[h][g]&&!this.reversed?t+this[h].repeatDelay:t,!0;this[h].complete&&this[h].complete.call(this),pt.call(this);for(var s=0,o=this[h].chain[a];s<o;s++)this[h].chain[s].start();return lt.call(this),!1}return!0},st=function(){var t=this[f],e=this[h];void 0!==e.perspective&&W in this[l]&&(this[c][W].perspective=this[l][W].perspective),void 0===e.transformOrigin||"svgTransform"in this[l]||(t[m][P("transformOrigin")]=e.transformOrigin),void 0!==e.perspectiveOrigin&&(t[m][P("perspectiveOrigin")]=e.perspectiveOrigin),void 0!==e.parentPerspective&&(t.parentNode[m][P("perspective")]=e.parentPerspective+"px"),void 0!==e.parentPerspectiveOrigin&&(t.parentNode[m][P("perspectiveOrigin")]=e.parentPerspectiveOrigin)},at={},ot={},ut={boxModel:function(t,e){t in it||(it[t]=function(t,e,i,n,r){t[m][e]=(r>.99||r<.01?(10*G(i,n,r)>>0)/10:G(i,n,r)>>0)+"px"});var i=C(e),n="height"===t?"offsetHeight":"offsetWidth";return"%"===i.u?i.v*this[f][n]/100:i.v},transform:function(t,e){if(W in it||(it[W]=function(t,e,i,n,r,s){t[m][e]=(i.perspective||"")+("translate"in i?J(i.translate,n.translate,"px",r):"")+("rotate"in i?V(i.rotate,n.rotate,"deg",r):"")+("skew"in i?tt(i.skew,n.skew,"deg",r):"")+("scale"in i?et(i.scale,n.scale,r):"")}),/translate/.test(t)){if("translate3d"===t){var i=e[o](","),n=C(i[0]),r=C(i[1],t3d2=C(i[2]));return{translateX:"%"===n.u?n.v*this[f].offsetWidth/100:n.v,translateY:"%"===r.u?r.v*this[f].offsetHeight/100:r.v,translateZ:"%"===t3d2.u?t3d2.v*(this[f].offsetHeight+this[f].offsetWidth)/200:t3d2.v}}if(/^translate(?:[XYZ])$/.test(t)){var s=C(e),u=/X/.test(t)?this[f].offsetWidth/100:/Y/.test(t)?this[f].offsetHeight/100:(this[f].offsetWidth+this[f].offsetHeight)/200;return"%"===s.u?s.v*u:s.v}if("translate"===t){var h,c="string"==typeof e?e[o](","):e,l={},p=C(c[0]),v=c[a]?C(c[1]):{v:0,u:"px"};return c instanceof Array?(l.x="%"===p.u?p.v*this[f].offsetWidth/100:p.v,l.y="%"===v.u?v.v*this[f].offsetHeight/100:v.v):(h=C(c),l.x="%"===h.u?h.v*this[f].offsetWidth/100:h.v,l.y=0),l}}else if(/rotate|skew/.test(t)){if(/^rotate(?:[XYZ])$|skew(?:[XY])$/.test(t)){var d=C(e,!0);return"rad"===d.u?X(d.v):d.v}if("rotate"===t){var g={},w=C(e,!0);return g.z="rad"===w.u?X(w.v):w.v,g}}else if("scale"===t)return parseFloat(e)},unitless:function(t,e){return!/scroll/.test(t)||t in it?"opacity"===t&&(t in it||(it[t]=L?function(t,e,i,n,r){t[m].filter="alpha(opacity="+(100*G(i,n,r)>>0)+")"}:function(t,e,i,n,r){t[m].opacity=(100*G(i,n,r)>>0)/100})):it[t]=function(t,e,i,n,r){t.scrollTop=G(i,n,r)>>0},parseFloat(e)},colors:function(t,e){return t in it||(it[t]=function(t,e,i,n,r,s){t[m][e]=K(i,n,r,s.keepHex)}),F(e)}},ht=function(t,e){var i="start"===e?this[c]:this[l],n={},r={},s={},a={};for(var o in t)if(-1!==I[u](o)){var h=["X","Y","Z"];if(/^translate(?:[XYZ]|3d)$/.test(o)){for(var f=0;f<3;f++){var p=h[f];/3d/.test(o)?s["translate"+p]=ut.transform.call(this,"translate"+p,t[o][f]):s["translate"+p]="translate"+p in t?ut.transform.call(this,"translate"+p,t["translate"+p]):0}a.translate=s}else if(/^rotate(?:[XYZ])$|^skew(?:[XY])$/.test(o)){for(var v=/rotate/.test(o)?"rotate":"skew",d="rotate"===v?r:n,g=0;g<3;g++){var m=h[g];void 0!==t[v+m]&&"skewZ"!==o&&(d[v+m]=ut.transform.call(this,v+m,t[v+m]))}a[v]=d}else/(rotate|translate|scale)$/.test(o)&&(a[o]=ut.transform.call(this,o,t[o]));i[W]=a}else-1!==y[u](o)?i[o]=ut.boxModel.call(this,o,t[o]):-1!==b[u](o)||"scroll"===o?i[o]=ut.unitless.call(this,o,t[o]):-1!==w[u](o)?i[o]=ut.colors.call(this,o,t[o]):o in ut&&(i[o]=ut[o].call(this,o,t[o]))},ct=function(){if(this[h][g])for(var t in this[l]){var e=this.valuesRepeat[t];this.valuesRepeat[t]=this[l][t],this[l][t]=e,this[c][t]=this.valuesRepeat[t]}},lt=function(){this[v]>0&&(this[h][v]=this[v]),this[h][g]&&!0===this.reversed&&(ct.call(this),this.reversed=!1),this.playing=!1,q()},ft=function(t){var e=n.getAttribute("data-tweening");e&&"scroll"===e&&t.preventDefault()},pt=function(){"scroll"in this[l]&&n.getAttribute("data-tweening")&&n.removeAttribute("data-tweening")},vt=function(){"scroll"in this[l]&&!n.getAttribute("data-tweening")&&n.setAttribute("data-tweening","scroll")},dt=function(t){return"function"==typeof t?t:"string"==typeof t?mt[t]:void 0},gt=function(){var t={},i=S(this[f]),n=["rotate","skew"],r=["X","Y","Z"];for(var s in this[c])if(-1!==I[u](s)){var a=/(rotate|translate|scale)$/.test(s);if(/translate/.test(s)&&"translate"!==s)t.translate3d=i.translate3d||O[s];else if(a)t[s]=i[s]||O[s];else if(!a&&/rotate|skew/.test(s))for(var o=0;o<2;o++)for(var h=0;h<3;h++){var p=n[o]+r[h];-1!==I[u](p)&&p in this[c]&&(t[p]=i[p]||O[p])}}else if("scroll"!==s)if("opacity"===s&&L){var v=Z(this[f],"filter");t.opacity="number"==typeof v?v:O.opacity}else-1!==M[u](s)?t[s]=Z(this[f],s)||d[s]:t[s]=s in at?at[s].call(this,s,this[c][s]):0;else t[s]=this[f]===j?e.pageYOffset||j.scrollTop:this[f].scrollTop;for(var g in i)-1===I[u](g)||g in this[c]||(t[g]=i[g]||O[g]);if(this[c]={},ht.call(this,t,"start"),W in this[l])for(var m in this[c][W])if("perspective"!==m)if("object"==typeof this[c][W][m])for(var w in this[c][W][m])void 0===this[l][W][m]&&(this[l][W][m]={}),"number"==typeof this[c][W][m][w]&&void 0===this[l][W][m][w]&&(this[l][W][m][w]=this[c][W][m][w]);else"number"==typeof this[c][W][m]&&void 0===this[l][W][m]&&(this[l][W][m]=this[c][W][m])},mt=e.Easing={};mt.linear=function(t){return t},mt.easingSinusoidalIn=function(t){return 1-Math.cos(t*Math.PI/2)},mt.easingSinusoidalOut=function(t){return Math.sin(t*Math.PI/2)},mt.easingSinusoidalInOut=function(t){return-.5*(Math.cos(Math.PI*t)-1)},mt.easingQuadraticIn=function(t){return t*t},mt.easingQuadraticOut=function(t){return t*(2-t)},mt.easingQuadraticInOut=function(t){return t<.5?2*t*t:(4-2*t)*t-1},mt.easingCubicIn=function(t){return t*t*t},mt.easingCubicOut=function(t){return--t*t*t+1},mt.easingCubicInOut=function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},mt.easingQuarticIn=function(t){return t*t*t*t},mt.easingQuarticOut=function(t){return 1- --t*t*t*t},mt.easingQuarticInOut=function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},mt.easingQuinticIn=function(t){return t*t*t*t*t},mt.easingQuinticOut=function(t){return 1+--t*t*t*t*t},mt.easingQuinticInOut=function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t},mt.easingCircularIn=function(t){return-(Math.sqrt(1-t*t)-1)},mt.easingCircularOut=function(t){return Math.sqrt(1-(t-=1)*t)},mt.easingCircularInOut=function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},mt.easingExponentialIn=function(t){return Math.pow(2,10*(t-1))-.001},mt.easingExponentialOut=function(t){return 1-Math.pow(2,-10*t)},mt.easingExponentialInOut=function(t){return(t*=2)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))},mt.easingBackIn=function(t){var e=1.70158;return t*t*((e+1)*t-e)},mt.easingBackOut=function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},mt.easingBackInOut=function(t){var e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2)},mt.easingElasticIn=function(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/Math.PI*2,-i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*Math.PI*2/.4))},mt.easingElasticOut=function(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/Math.PI*2,i*Math.pow(2,-10*t)*Math.sin((t-e)*Math.PI*2/.4)+1)},mt.easingElasticInOut=function(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/Math.PI*2,(t*=2)<1?i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*Math.PI*2/.4)*-.5:i*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*Math.PI*2/.4)*.5+1)},mt.easingBounceIn=function(t){return 1-mt.easingBounceOut(1-t)},mt.easingBounceOut=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},mt.easingBounceInOut=function(t){return t<.5?.5*mt.easingBounceIn(2*t):.5*mt.easingBounceOut(2*t-1)+.5};var wt=function(t,e,i,n){this[f]="scroll"in i&&(void 0===t||null===t)?j:t,this.playing=!1,this.reversed=!1,this.paused=!1,this._startTime=null,this._pauseTime=null,this._startFired=!1,this[h]={};for(var r in n)this[h][r]=n[r];if(this[h].rpr=n.rpr||!1,this.valuesRepeat={},this[l]={},this[c]={},ht.call(this,i,"end"),this[h].rpr?this[c]=e:ht.call(this,e,"start"),void 0!==this[h].perspective&&W in this[l]){var s="perspective("+parseInt(this[h].perspective)+"px)";this[l][W].perspective=s}for(var a in this[l])a in ot&&!this[h].rpr&&ot[a].call(this);this[h].chain=[],this[h].easing=dt(n.easing)||mt[x.easing]||mt.linear,this[h][v]=n[v]||x[v],this[h].repeatDelay=n.repeatDelay||x.repeatDelay,this[h][g]=n[g]||x[g],this[h].duration=n.duration||x.duration,this[h][p]=n[p]||x[p],this[v]=this[h][v]},yt=(wt.prototype={start:function(t){vt.call(this),this[h].rpr&&gt.apply(this),st.apply(this);for(var e in this[l])e in ot&&this[h].rpr&&ot[e].call(this),this.valuesRepeat[e]=this[c][e];return r.push(this),this.playing=!0,this.paused=!1,this._startFired=!1,this._startTime=t||i.now(),this._startTime+=this[h][p],this._startFired||(this[h].start&&this[h].start.call(this),this._startFired=!0),!s&&nt(),this},play:function(){return this.paused&&this.playing&&(this.paused=!1,this[h].resume&&this[h].resume.call(this),this._startTime+=i.now()-this._pauseTime,B(this),!s&&nt()),this},resume:function(){return this.play()},pause:function(){return!this.paused&&this.playing&&($(this),this.paused=!0,this._pauseTime=i.now(),this[h].pause&&this[h].pause.call(this)),this},stop:function(){return!this.paused&&this.playing&&($(this),this.playing=!1,this.paused=!1,pt.call(this),this[h].stop&&this[h].stop.call(this),this.stopChainedTweens(),lt.call(this)),this},chain:function(){return this[h].chain=arguments,this},stopChainedTweens:function(){for(var t=0,e=this[h].chain[a];t<e;t++)this[h].chain[t].stop()}},function(t,e,i){this.tweens=[];for(var n=[],r=0,s=t[a];r<s;r++)n[r]=i||{},i[p]=i[p]||x[p],n[r][p]=r>0?i[p]+(i.offset||x.offset):i[p],this.tweens.push(bt(t[r],e,n[r]))}),It=function(t,e,i,n){this.tweens=[];for(var r=[],s=0,o=t[a];s<o;s++)r[s]=n||{},n[p]=n[p]||x[p],r[s][p]=s>0?n[p]+(n.offset||x.offset):n[p],this.tweens.push(Mt(t[s],e,i,r[s]))},bt=(yt.prototype=It.prototype={start:function(t){t=t||i.now();for(var e=0,n=this.tweens[a];e<n;e++)this.tweens[e].start(t);return this},stop:function(){for(var t=0,e=this.tweens[a];t<e;t++)this.tweens[t].stop();return this},pause:function(){for(var t=0,e=this.tweens[a];t<e;t++)this.tweens[t].pause();return this},chain:function(){return this.tweens[this.tweens[a]-1][h].chain=arguments,this},play:function(){for(var t=0,e=this.tweens[a];t<e;t++)this.tweens[t].play();return this},resume:function(){return this.play()}},function(t,e,i){return i=i||{},i.rpr=!0,new wt(Y(t),e,e,i)}),Mt=function(t,e,i,n){return n=n||{},new wt(Y(t),e,i,n)},Ot=function(t,e,i){return new yt(Y(t,!0),e,i)},Tt=function(t,e,i,n){return new It(Y(t,!0),e,i,n)};return document.addEventListener(Q,ft,!1),document.addEventListener("mouseenter",ft,!1),{property:P,getPrefix:E,selector:Y,processEasing:dt,defaultOptions:x,to:bt,fromTo:Mt,allTo:Ot,allFromTo:Tt,ticker:nt,tick:s,tweens:r,update:rt,dom:it,parseProperty:ut,prepareStart:at,crossCheck:ot,Tween:wt,truD:C,truC:F,rth:A,htr:_,getCurrentStyle:Z}});

// KUTE.js v1.6.6 | © dnp_theme | SVG Plugin | MIT-License
!function(t,e){if("function"==typeof define&&define.amd)define(["./kute.js"],e);else if("object"==typeof module&&"function"==typeof require)module.exports=e(require("./kute.js"));else{if(void 0===t.KUTE)throw new Error("SVG Plugin require KUTE.js.");e(t.KUTE)}}(this,function(t){"use strict";var e="undefined"!=typeof global?global:window,r=t,n=r.dom,a=r.parseProperty,i=r.prepareStart,s=r.getCurrentStyle,o=(r.truC,r.truD,r.crossCheck),l=e.Interpolate.number,h=(e.Interpolate.unit,e.Interpolate.color,r.defaultOptions),u=null!==new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(navigator.userAgent)&&parseFloat(RegExp.$1);if(!(u&&u<9)){var p=/(m[^(h|v|l)]*|[vhl][^(v|h|l|z)]*)/gim,g=e.Interpolate.coords=function(t,e,r,n){for(var a=[],i=0;i<r;i++){a[i]=[];for(var s=0;s<2;s++)a[i].push((1e3*(t[i][s]+(e[i][s]-t[i][s])*n)>>0)/1e3)}return a},f=function(t,e,r){for(var n=[],a=[],i=t.getTotalLength(),s=e.getTotalLength(),o=Math.max(i,s),l=o/r,h=0,u=l*r;(h+=r)<u;)n.push([t.getPointAtLength(h).x,t.getPointAtLength(h).y]),a.push([e.getPointAtLength(h).x,e.getPointAtLength(h).y]);return[n,a]},c=function(t,e,r){for(var n,a,i,s,o,l=[],h=r.length,u=0;u<h;u++)n=Math.abs(r[u][0]-e.x),a=Math.abs(r[u][1]-e.y),l.push(Math.sqrt(n*n+a*a));return i=l.indexOf(Math.min.apply(null,l)),o=r[i-1]?i-1:h-1,s=r[i+1]?i+1:0,Math.abs(r[o][0]-e.x)<t&&Math.abs(r[o][1]-e.y)<t?r[o]:Math.abs(r[s][0]-e.x)<t&&Math.abs(r[s][1]-e.y)<t?r[s]:Math.abs(r[i][0]-e.x)<t&&Math.abs(r[i][1]-e.y)<t?r[i]:[e.x,e.y]},v=function(t){for(var e,r,n=t.match(p),a=n.length,i=0,s=0,o=0;o<a;o++)n[o]=n[o],e=n[o][0],r=new RegExp(e+"[^\\d|\\-]*","i"),n[o]=n[o].replace(/(^|[^,])\s*-/g,"$1,-").replace(/(\s+\,|\s|\,)/g,",").replace(r,"").split(","),n[o][0]=parseFloat(n[o][0]),n[o][1]=parseFloat(n[o][1]),0===o?(i+=n[o][0],s+=n[o][1]):(i=n[o-1][0],s=n[o-1][1],/l/i.test(e)?(n[o][0]="l"===e?n[o][0]+i:n[o][0],n[o][1]="l"===e?n[o][1]+s:n[o][1]):/h/i.test(e)?(n[o][0]="h"===e?n[o][0]+i:n[o][0],n[o][1]=s):/v/i.test(e)&&(n[o][0]=i,n[o][1]="v"===e?n[o][0]+s:n[o][0]));return n},m=function(t){return t.split(/z/i).shift()+"z"},d=function(t){var e=document.createElementNS("http://www.w3.org/2000/svg","path"),r="object"==typeof t?t.getAttribute("d"):t;return e.setAttribute("d",r),e},y=function(t){if("glyph"===t.tagName){var e=d(t);return t.parentNode.appendChild(e),e}return t},b=function(t){var e={},r="object"==typeof t?t:/^\.|^\#/.test(t)?document.querySelector(t):null;return r&&/path|glyph/.test(r.tagName)?(e.e=y(r),e.o=r.getAttribute("d")):!r&&/[a-z][^a-z]*/gi.test(t)&&(e.e=d(t.trim()),e.o=t),e},w=function(t,e){var r,n,a,i,s,o,l,h,u,p,g=[],m=this.options.morphIndex;if(this._isPolygon)if(t=v(t),e=v(e),t.length!==e.length){i=Math.max(t.length,e.length),i===e.length?(s=t,o=e):(s=e,o=t),s.length,l=d("M"+s.join("L")+"z"),h=l.getTotalLength()/i;for(var y=0;y<i;y++)u=l.getPointAtLength(h*y),p=c(h,u,s),g.push([p[0],p[1]]);i===e.length?(n=o,r=g):(r=o,n=g)}else r=t,n=e;else t=d(t),e=d(e),a=f(t,e,this.options.morphPrecision),r=a[0],n=a[1],i=n.length;if(this.options.reverseFirstPath&&r.reverse(),this.options.reverseSecondPath&&n.reverse(),m){n=n.splice(m,i-m).concat(n)}return t=e=null,[r,n]};h.morphPrecision=15,a.path=function(t,e){return"path"in n||(n.path=function(t,e,r,n,a){t.setAttribute("d",1===a?n.o:"M"+g(r.d,n.d,n.d.length,a)+"Z")}),b(e)},i.path=function(t){return this.element.getAttribute("d")},o.path=function(){var t,e=m(this.valuesStart.path.o),r=m(this.valuesEnd.path.o);this.options.morphPrecision=this.options&&"morphPrecision"in this.options?parseInt(this.options.morphPrecision):h.morphPrecision,this._isPolygon=!/[CSQTA]/i.test(e)&&!/[CSQTA]/i.test(r),t=w.apply(this,[e,r]),this.valuesStart.path.d=t[0],this.valuesEnd.path.d=t[1]};var A=function(t,e){return parseFloat(t)/100*e},M=function(t){return 2*t.getAttribute("width")+2*t.getAttribute("height")},x=function(t){var e=t.getAttribute("points").split(" "),r=0;if(e.length>1){var n=function(t){var e=t.split(",");if(2==e.length&&!isNaN(e[0])&&!isNaN(e[1]))return[parseFloat(e[0]),parseFloat(e[1])]},a=function(t,e){return void 0!=t&&void 0!=e?Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)):0};if(e.length>2)for(var i=0;i<e.length-1;i++)r+=a(n(e[i]),n(e[i+1]));r+="polygon"===t.tagName?a(n(e[0]),n(e[e.length-1])):0}return r},k=function(t){var e=t.getAttribute("x1"),r=t.getAttribute("x2"),n=t.getAttribute("y1"),a=t.getAttribute("y2");return Math.sqrt(Math.pow(r-e,2)+Math.pow(a-n,2))},P=function(t){var e=t.getAttribute("r");return 2*Math.PI*e},T=function(t){var e=t.getAttribute("rx"),r=t.getAttribute("ry"),n=2*e,a=2*r;return Math.sqrt(.5*(n*n+a*a))*(2*Math.PI)/2},F=function(t){return/rect/.test(t.tagName)?M(t):/circle/.test(t.tagName)?P(t):/ellipse/.test(t.tagName)?T(t):/polygon|polyline/.test(t.tagName)?x(t):/line/.test(t.tagName)?k(t):void 0},N=function(t,e){var r,n,a,i,o=/path|glyph/.test(t.tagName)?t.getTotalLength():F(t);return e instanceof Object?e:("string"==typeof e?(e=e.split(/\,|\s/),r=/%/.test(e[0])?A(e[0].trim(),o):parseFloat(e[0]),n=/%/.test(e[1])?A(e[1].trim(),o):parseFloat(e[1])):void 0===e&&(i=parseFloat(s(t,"stroke-dashoffset")),a=s(t,"stroke-dasharray").split(/\,/),r=0-i,n=parseFloat(a[0])+r||o),{s:r,e:n,l:o})};a.draw=function(t,e){return"draw"in n||(n.draw=function(t,e,r,n,a){var i=(100*r.l>>0)/100,s=(100*l(r.s,n.s,a)>>0)/100,o=(100*l(r.e,n.e,a)>>0)/100,h=0-s,u=o+h;t.style.strokeDashoffset=h+"px",t.style.strokeDasharray=(100*(u<1?0:u)>>0)/100+"px, "+i+"px"}),N(this.element,e)},i.draw=function(){return N(this.element)};var S=function(t,e){return/[a-zA-Z]/.test(t)&&!/px/.test(t)?t.replace(/top|left/,0).replace(/right|bottom/,100).replace(/center|middle/,50):/%/.test(t)?e.x+parseFloat(t)*e.width/100:parseFloat(t)},E=function(t){var e=t&&/\)/.test(t)?t.substring(0,t.length-1).split(/\)\s|\)/):"none",r={};if(e instanceof Array)for(var n=0,a=e.length;n<a;n++){var i=e[n].trim().split("(");r[i[0]]=i[1]}return r},I=function(t){var e,r={},n=this.element.getBBox(),a=n.x+n.width/2,i=n.y+n.height/2,s=this.options.transformOrigin;s=s?s instanceof Array?s:s.split(/\s/):[a,i],s[0]="number"==typeof s[0]?s[0]:S(s[0],n),s[1]="number"==typeof s[1]?s[1]:S(s[1],n),r.origin=s;for(var o in t)"rotate"===o?r[o]="number"==typeof t[o]?t[o]:t[o]instanceof Array?t[o][0]:1*t[o].split(/\s/)[0]:"translate"===o?(e=t[o]instanceof Array?t[o]:/\,|\s/.test(t[o])?t[o].split(","):[t[o],0],r[o]=[1*e[0]||0,1*e[1]||0]):/skew/.test(o)?r[o]=1*t[o]||0:"scale"===o&&(r[o]=parseFloat(t[o])||1);return r};return a.svgTransform=function(t,e){return"svgTransform"in n||(n.svgTransform=function(t,e,r,n,a){var i,s=0,o=0,h=Math.PI/180,u="scale"in n?l(r.scale,n.scale,a):1,p="rotate"in n?l(r.rotate,n.rotate,a):0,g=Math.sin(p*h),f=Math.cos(p*h),c="skewX"in n?l(r.skewX,n.skewX,a):0,v="skewY"in n?l(r.skewY,n.skewY,a):0,m=p||c||v||1!==u||0;s-=m?n.origin[0]:0,o-=m?n.origin[1]:0,s*=u,o*=u,o+=v?s*Math.tan(v*h):0,s+=c?o*Math.tan(c*h):0,i=f*s-g*o,o=p?g*s+f*o:o,s=p?i:s,s+="translate"in n?l(r.translate[0],n.translate[0],a):0,o+="translate"in n?l(r.translate[1],n.translate[1],a):0,s+=m?n.origin[0]:0,o+=m?n.origin[1]:0,t.setAttribute("transform",(s||o?"translate("+(1e3*s>>0)/1e3+(o?","+(1e3*o>>0)/1e3:"")+")":"")+(p?"rotate("+(1e3*p>>0)/1e3+")":"")+(c?"skewX("+(1e3*c>>0)/1e3+")":"")+(v?"skewY("+(1e3*v>>0)/1e3+")":"")+(1!==u?"scale("+(1e3*u>>0)/1e3+")":""))}),I.call(this,e)},i.svgTransform=function(t,e){var r={},n=E(this.element.getAttribute("transform"));for(var a in e)r[a]=a in n?n[a]:"scale"===a?1:0;return r},o.svgTransform=function(){if(this.options.rpr){var t=this.valuesStart.svgTransform,e=this.valuesEnd.svgTransform,r=I.call(this,E(this.element.getAttribute("transform")));for(var n in r)t[n]=r[n];var a=this.element.ownerSVGElement,i=a.createSVGTransformFromMatrix(a.createSVGMatrix().translate(-t.origin[0],-t.origin[1]).translate("translate"in t?t.translate[0]:0,"translate"in t?t.translate[1]:0).rotate(t.rotate||0).skewX(t.skewX||0).skewY(t.skewY||0).scale(t.scale||1).translate(+t.origin[0],+t.origin[1]));t.translate=[i.matrix.e,i.matrix.f];for(var n in t)n in e||(e[n]=t[n])}},this}});