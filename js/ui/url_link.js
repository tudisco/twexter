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
Ext.namespace('twexter', 'twexter.url_link_button_bar', 'twexter.url_link_display');


/**
 * UrlLink Address Bar
 */
twexter.url_link_addr_bar = function(config){
    twexter.url_link_addr_bar.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
        "urlResourceChange" : true,
        "posUrlLink" : true,
        "showUrlResource" : true,
        "hideUrlResource" : true,
        "clearUrlDisplay" : true,
        "save_doc" : true
    });
    this.init();
};

twexter.url_link_addr_bar.prototype = {
    el: null,
    tpl: null,
    id: 'url_link_address',
    bodyId: MAIN_BODY,
    docId: null,
    buttOverClass: null,
    
    init : function(){
        if(Ext.isEmpty(this.tpl)){
            this.tpl = new Ext.Template(
                '<div id="{id}">',
                    '<div id="{id}_saveButton" class="{id}_saveButton"></div>',
                    '<div id="{id}_adressBar" class="{id}_adressBar"><input type="text" id="{id}_input" /></div>',
                    '<div id="{id}_actionButton" class="{id}_actionButton"></div>',
                '</div>'
            );
        }
        
        this.tpl.append(this.bodyId, {
           id: this.id 
        });
        
        this.el = Ext.get(this.id);
        this.el_butt = Ext.get(this.id+'_actionButton');
        this.el_addr_bar  = Ext.get(this.id+'_adressBar');
        this.el_input = Ext.get(this.id+'_input');
        this.el_save = Ext.get(this.id+'_saveButton');
        
        this.init_events();
    },
    
    init_events: function(){
        this.el_input.on('change', this.onEditChange, this);
        this.el_butt.on('click', this.onButtClick, this);
        this.el_save.on('click', function(){
            this.fireEvent('save_doc', this);
        }, this);
        
        this.el_butt.on('mouseover', function(e){
            
            if(!Ext.isEmpty(this.buttOverClass)){
                this.el_butt.addClass(this.buttOverClass);
            }
            
        }, this);
        
        this.el_butt.on('mouseout', function(e){
            /*{*/console.log("Going out url Button: "+this.buttOverClass);/*}*/
            
            if(!Ext.isEmpty(this.buttOverClass)){
                this.el_butt.removeClass(this.buttOverClass);
            }
            
        }, this);
        
        if(Ext.isIE){
            this.el_input.addKeyListener(Ext.EventObject.ENTER, this.onEditChange, this);
        }
    },
    
    getEl: function(){
        return this.el;
    },
    
    setPos : function(pos){
        if(Ext.isArray(pos)){
            this.el.setX(pos[0]);
            this.el.setY(pos[1]);
        }
    },
    
    documentLoaded : function(docId){
        this.docId = docId;
        this._removeClasses();
        this.el_butt.addClass('url_link_address_actionButtonReady');
        this.buttOverClass = 'url_link_address_actionButtonOver';
        
        
        this.el_addr_bar.hide();
        
        this.el_addr_bar.setWidth(0);
        this.el_input.setWidth(0);
        
        this.el.setWidth(this.el_butt.getWidth());
        //SIMPLE.pos_urllinkButton();
        this.fireEvent('posUrlLink');
        this.fireEvent('hideUrlResource');
    },
    
    _removeClasses : function(){
        this.el_butt.removeClass(['url_link_address_actionButtonReady','url_link_address_actionButton']);
    },
    
    onButtClick : function(){
        
        /*{*/console.log("URL Link Button Pressed")/*}*/
        
        if(!this.el_addr_bar.isVisible()){
            /*{*/console.log("Address Bar is Not Visable, going to show");/*}*/
            this.showAddrBar();
        }else{
            /*{*/console.log("Address bar is Visable, going to hide");/*}*/
            this.hideAddrBar();
        }
        
    },
    
    showAddrBar: function(event){
        /*{*/console.log("In Show Address Bar");/*}*/
        event = (event===false) ? false : true;
        this.el_addr_bar.show();
        this.el_save.show();
        this.el_addr_bar.setWidth(URLLINK_INPUT_LENGTH);
        this.el_save.setWidth(16);
        this.el_input.setWidth(URLLINK_INPUT_LENGTH-5);
        this.el.setWidth(this.el_butt.getWidth()+this.el_addr_bar.getWidth()+this.el_save.getWidth()+10);
        if(event){
            /*{*/console.log("Trigger Event");/*}*/
            this.fireEvent('posUrlLink');
            this.fireEvent('showUrlResource');
        }
    },
    
    hideAddrBar: function(event){
        event = (event===false) ? false : true;
        this.el_addr_bar.hide();
        this.el_save.hide();
        this.el_addr_bar.setWidth(0);
        this.el_input.setWidth(0);
        this.el_save.setWidth(0);
        this.el.setWidth(this.el_butt.getWidth()+10);
        if(event){
            this.fireEvent('posUrlLink');
            this.fireEvent('hideUrlResource');
        }
    },
    
    documentNew : function(){
        this.docId = null;
        this.hideAddrBar();
        this.el_butt.addClassOnOver('');
        this.el_butt.removeClass('url_link_address_actionButtonOver');
        this.buttOverClass = 'url_link_address_actionButtonOver';
        this.el_input.dom.value = '';
    },
    
    isUrl: function(s) {
        //var rule = "(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?";
        var rule = "^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$";
        //var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        var regexp = new RegExp(rule, 'i');
        return regexp.test(s);
    },
    
    onEditChange: function(){
        var url = this.el_input.getValue();
        if(!Ext.isEmpty(url)){
            if(!this.isUrl(url)){
                alert("Not a valid url");
                this.el_butt.removeClass('url_link_address_actionButtonOver');
                this.buttOverClass = 'url_link_address_actionButtonOver';
            }else{
                this.fireEvent("urlResourceChange", this, url);
                this.el_butt.addClass('url_link_address_actionButtonOver');
                this.buttOverClass = null;
            }
        }else{
            this.fireEvent('clearUrlDisplay');
        }
    },
    
    clearHover: function(){
        this.el_butt.hover(Ext.emptyFn, Ext.emptyFn);
    },
    
    setUrl: function(url){
        this.el_input.dom.value = url;
        this.el_butt.addClass('url_link_address_actionButtonOver');
        this.buttOverClass = null;
    }
};

Ext.extend(twexter.url_link_addr_bar, Ext.util.Observable, twexter.url_link_addr_bar.prototype);

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
        var ifr = Ext.fly(this.iframeId);
        if(ifr) ifr.show();
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
            elf.show();
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
            this.ytPlayer.dom.addEventListener("onStateChange", "onYouTubeStateChange")
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
    
    pos_iframe: function(){
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