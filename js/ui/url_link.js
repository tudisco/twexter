/**
twexter helps you learn to read in any language
Copyright © 2008 READ.FM http://license.read.fm
used, under license, U.S. Patent #6,438,515
http://more.read.fm/more read, more market

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License, 
Version 2, as published by the Free Software Foundation at 
http://www.gnu.org/licenses/gpl-2.0.html

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/**
 * Url Resource Link Control.
 */
Ext.namespace('twexter', 'twexter.url_link_display');

//_________________________________________________________________________________________________________//

twexter.url_link_display = function(config){
    twexter.url_link_display.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
    /*this.addEvents({
       
    });*/
    this.init();
};

twexter.url_link_display.prototype = {
    el:null,
    id:'url_res_display',
    tpl:null,
    bodyId: MAIN_BODY,
    docId: null,
    url: null,
    ut_autoscroll: false,
    
    init: function(){
        if(Ext.isEmpty(this.tpl)){
            this.tpl = new Ext.Template(
                '<div id="{id}" class="{id}">',
                    //'<iframe src="{url}" id="{id}_iframe" class="{id}_iframe" frameborder="0"></iframe>',
                '</div>'
            );
        }
        
        this.embedtype = (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) ? 1 : 2;
        this.embedTpl = new Ext.XTemplate(
            '<tpl if="etype == 3">',
                '<iframe src="" id="{id}_iframe" class="{id}_iframe" frameborder="0"></iframe>',
            '</tpl><tpl if="etype == 1">',
                '<embed id="{id}_iframe" class="{id}_iframe" src="http://www.youtube.com/v/{uid}&hl=en&fs=1&enablejsapi=1&start={time}" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="100%" height="344"></embed>',
                '<div id="ut_auto_scroll" class="off">AutoScroll: OFF</div>',
            '</tpl><tpl if="etype == 2">',
                '<object id="{id}_iframe" class="{id}_iframe" width="100%" height="344">',
                    '<param name="movie" value="http://www.youtube.com/v/{uid}&hl=en&fs=1&enablejsapi=1&start={time}"></param>',
                    '<param name="allowFullScreen" value="true"></param>',
                    '<param name="allowscriptaccess" value="always"></param>',
                    '<embed id="{id}_iframe2" class="{id}_iframe2" src="http://www.youtube.com/v/{uid}&hl=en&fs=1&enablejsapi=1&start={time}" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="100%" height="344"></embed>',
                '</object>',
                //'<div id="ut_auto_scroll" class="on">AutoScroll: ON</div>',
            '</tpl>'
        );
        
        this.embedTpl.compile();
        
        this.tpl.append(this.bodyId,{
            id: this.id
        });
        
        this.el = Ext.get(this.id);
        //this.iframe = Ext.get(this.id+"_iframe");
        this.iframeId = this.id+"_iframe";
        
    },
    
    show: function(){
        this.el.show();
        //this.iframe.show();
        if(Ext.isEmpty(this.url)){
            this.el.update('<div id="url_no_youtube" style="font-size:18px;color:grey;text-align:center;font-weight:bold;">NO URL SET</div>');
            Ext.get('url_no_youtube').center(this.el);
        }else{
            var ifr = Ext.fly(this.iframeId);
            if(ifr) ifr.show();
        }
        
    },
    
    hide: function(){
        this.el.hide();
        var ifr = Ext.fly(this.iframeId);
        if(ifr) ifr.hide();
    },
    
    getEl: function(){
        return this.el;
    },
    
    setPosition: function(arr){
       //Curently not being used.  
    },
    
    setUrl: function(url){
        /*{*/console.log("Set URL fired: "+url);/*}*/
        if(!Ext.isEmpty(url) && Ext.type(url) == 'string'){
            this.clearUrl();
            this.url = url;
            url = this.__check_youtube(url, true);
            if(Ext.isArray(url)){
                var type = this.embedtype;
                var uid = url[1];
                this.youTubeTime = url[2];
                this.embedTpl.append(this.el, {
                    id:this.id,
                    etype: type,
                    uid: uid,
                    time: url[2]
                });
                var elf = Ext.fly(this.id+'_iframe');
                //alert('youtube');
                UT_OBJECT = this;
                UT_FUNCTION = this.onYoutubeReady;
            }else{
                this.embedTpl.append(this.el, {
                    id:this.id,
                    etype: 3
                });
                var elf = Ext.fly(this.id+'_iframe');
                elf.dom.src = url;
                UT_OBJECT = null;
                UT_FUNCTION = null;
            }
            /*var elf = this.el.createChild({
                tag:'iframe',
                id: this.id+'_iframe',
                cls: this.id+'_iframe',
                frameborder: 0
            });
            elf.dom.src = url;*/
            //elf.show();
            this.pos_iframe.defer(1000,this);
            
            this.el_autoscroll = Ext.get('ut_auto_scroll');
            if(this.el_autoscroll){
                if(this.ut_autoscroll){
                    this.el_autoscroll.update("AutoScroll: ON");
                }else{
                    this.el_autoscroll.update("AutoScroll: OFF");
                }
                
                this.el_autoscroll.on('click', this.toggleAutoScroll, this);
            }
        }
    },
    
    toggleAutoScroll: function(){
        if(this.el_autoscroll){
            var ela = this.el_autoscroll;
            if(this.ut_autoscroll){
                this.ut_autoscroll = false;
                ela.update("AutoScroll: OFF");
                ela.addClass("off");
                ela.removeClass("on");
            }else{
                this.ut_autoscroll = true;
                ela.update("AutoScroll: ON");
                ela.addClass("on");
                ela.removeClass("off");
            }
        }
    },
    
    onYouTubePlayerReady: function(){
        this.ytPlayer = (!Ext.isIE) ? Ext.get(this.iframeId) : false;
        
        if(this.ytPlayer){
            UT_STATE_WATCH = this;
            this.ytPlayer.dom.addEventListener("onStateChange", "onYouTubeStateChange");
            //alert("going to play video");
            //this.ytPlayer.dom.playVideo();
        }
        
    },
    
    onYouTubePlayerStateChange: function(st){
        
        if(st==1){
            if(!this.uttask) this.uttask={run: this.onYouTubeTimed, interval:400, scope:this};
            if(!this.taskrunner) this.taskrunner = new Ext.util.TaskRunner();
            this.taskrunner.start(this.uttask);
        }else{
            try{
                if(this.taskrunner) this.taskrunner.stopAll();
            }catch(e){
                /*{*/console.warn("Exception Thrown "+e);/*}*/
            }
        }
        if(st==0){
            SIMPLE.output.autoscroll(1);
        }
    },
    
    onYouTubeTimed: function(){
        if(this.ut_autoscroll){
            var d = this.ytPlayer.dom.getDuration();
            var c = this.ytPlayer.dom.getCurrentTime();
            //c = Math.round(c);
            //d = Math.round(d);
            if(this.youTubeTime>0){
                d = d - this.youTubeTime;
                c = c - this.youTubeTime;
            }
            if(c<=0){
                SIMPLE.output.autoscroll(0);
            }else{
                var p = (c*100)/d;
                SIMPLE.output.autoscroll(p);
            }
        }
    },
    
    __get_youtube_time: function(url){
        var u = url.split("#");
        if(u.length < 2) return '0';
        var timeRex = /t\=([0-9]+)m([0-9]+)s/i;
        if(timeRex.test(u[1])){
            var p = timeRex.exec(u[1]);
            var m = parseInt(p[1], 10)*60;
            var t = m+parseInt(p[2], 10);
            return t;
        }
        return '0';
    },
    
    __check_youtube: function(url, id){
        var rid = (id==true) ? true : false;
        var rule;
        /*var regyt = "youtube\.com\/watch\?v=([^&]+)";
        var rule = new RegExp(regyt, 'i');*/
        if(rid){
            rule = /youtube\.com\/v\/([^&#]+)/i;
            if(rule.test(url)){
                var yt_id = rule.exec(url);
                return ['youtube',yt_id[1],this.__get_youtube_time(url)];
            }
        }
        rule = /youtube\.com\/watch\?v=([^&#]+)/i;
        if(rule.test(url)){
            var yt_id = rule.exec(url);
            if(rid) return ['youtube',yt_id[1],this.__get_youtube_time(url)];
            if(yt_id !== null){
                return "http://youtube.com/v/"+yt_id[1];
            }
        }
        return url;
    },
    
    getUrl: function(){
        return this.url;
    },
    
    clearUrl: function(){
        if(this.el_autoscroll) this.el_autoscroll.un('click', this.toggleAutoScroll, this);
        this.url = null;
        //this.iframe.dom.src = "";
        var ifr = Ext.fly(this.iframeId);
        if(ifr){
            ifr.dom.src = "";
            ifr.remove();
        }
        this.el.update('');
    },
    
    pos_iframe : function() {
    	this.pos_iframe2.defer(500, this);
    },
    
    pos_iframe2 : function(){
        var height = this.el.getHeight() - URLDISPLAY_HEIGHT_DIFF;
        //this.iframe.setHeight(height);
        var ifr = Ext.get(this.iframeId);
        var ifr2 = Ext.fly(this.iframeId+'2');
        if(ifr){
            ifr.setHeight(height);
            ifr.setWidth("100%");
        }
        if(ifr2){
            ifr2.setHeight(height);
            ifr2.setWidth("100%");
        }
    }
};

UT_OBJJECT = null;
UT_STATE_WATCH = null;
function onYouTubePlayerReady(playerId) {
    if(Ext.type(UT_OBJECT)=='object'){
        UT_OBJECT.onYouTubePlayerReady(playerId);
    }
    UT_OBJECT=null;
}

function onYouTubeStateChange(sc){
    /*{*/console.log("You Tube State Change: ",sc);/*}*/
    if(Ext.type(UT_STATE_WATCH)=='object'){
        UT_STATE_WATCH.onYouTubePlayerStateChange(sc);
    }
}

Ext.extend(twexter.url_link_display, Ext.util.Observable, twexter.url_link_display.prototype);