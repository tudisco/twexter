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

Ext.namespace('twexter', 'twexter.editor_tools');

twexter.editor_tools = function(config){
    twexter.editor_tools.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"new_document_click" : true,
        "save_document_click": true,
        "user_click" : true,
        "options_click" : true,
        "lang_change" : true,
        "print_doc" : true,
        "urllink_change" : true,
	"go_preview_url" : true,
	"go_preview_out" : true,
	"go_preview_trans" : true
    });
};

twexter.editor_tools.prototype = {
    
    el: null,
    id: 'edit_toolbar',
    id_newdoc: 'newdoc',
    id_savedoc: 'savedoc',
    id_ident: 'ident',
    id_pref: 'pref',
    id_print: 'print',
    id_switch: 'edit_switch',
    id_lang_left: 'c_lang_left',
    id_lang_right: 'c_lang_right',
    id_linkbutt: 'linkbutton',
    id_linkinput: 'linkinput',
    langs: [['english','english'],['spanish','spanish'],['diiiste','diiiste']],
    url:null,
    
    init: function(){
        var nl = "\n";
        this.tpl = new Ext.Template(
            '<div id="{id}">',
                '<select id="{id_lang_left}" class="{id_lang_left}"></select>',
                '<div id="{id_switch}"></div>',
                '<select id="{id_lang_right}" class="{id_lang_right}"></select>',
                //'<div id="{id_print}"></div>',
                '<button id="{id_pref}">Translate</button>',
                //'<div id="{id_newdoc}"></div>',
                '<div id="{id_linkbutt}"></div>',
                '<input type="text" id="{id_linkinput}"></input>',
                '<button id="{id_savedoc}">Save</button>',
			
		    '</div>',
		    
		    //'<div id="{id}_sep" class="{id}_sep"></div>',
		    '<div id="{id}_edit_tabs" class="{id}_edit_tabs">',
				'<div id="{id}_tab_preview" class="{id}_tab_preview">Preview</div>',
				'<div id="{id}_tab_youtube" class="{id}_tab_youtube">YouTube</div>',
				'<div id="{id}_tab_trans" class="{id}_tab_trans">Translation</div>',
				'<div id="{id}_tab_assoc" class="{id}_tab_assoc">Assc.</div>',
			'</div>'
        );
        
        this.tpl.append(MAIN_BODY,{
            id: this.id,
            id_newdoc: this.id_newdoc,
            id_savedoc: this.id_savedoc,
            //id_ident: this.id_ident,
            id_pref: this.id_pref,
            id_lang_left: this.id_lang_left,
            id_lang_right: this.id_lang_right,
            id_switch: this.id_switch,
            id_print: this.id_print,
            id_linkbutt: this.id_linkbutt,
            id_linkinput: this.id_linkinput
        });
        
        this.el = Ext.get(this.id);
        
        this.init_events();
        
        this.fillLangCombos();
	
	this.linkInput.setWidth(150);
        this.linkInput.show();
    },
    
    init_events: function(){
        //this.buttNewDoc = Ext.get(this.id_newdoc);
        this.buttSaveDoc = Ext.get(this.id_savedoc);
        //this.buttIdent = Ext.get(this.id_ident);
        this.buttTrans = Ext.get(this.id_pref);
        this.comboLeftLang = Ext.get(this.id_lang_left);
        this.comboRightLang = Ext.get(this.id_lang_right);
        this.switchButton = Ext.get(this.id_switch);
        this.switchButton.toggleClass("flip");
        //this.printButton = Ext.get(this.id_print);
        this.linkButton = Ext.get(this.id_linkbutt);
        this.linkInput = Ext.get(this.id_linkinput);
	
	//Tabs
	this.tabPreview = Ext.get(this.id+'_tab_preview');
	this.tabUrl = Ext.get(this.id+'_tab_youtube');
	this.tabTrans = Ext.get(this.id+'_tab_trans');
	this.tabAssoc = Ext.get(this.id+'_tab_assoc');
	//Tab Events
	this.tabPreview.on('click', function(){
	    this.fireEvent('go_preview_out');
	}, this);
	this.tabUrl.on('click', function(){
	    this.fireEvent('go_preview_url');
	}, this);
	this.tabTrans.on('click', function(){
	    this.fireEvent('go_preview_trans');
	}, this);
	this.tabAssoc.on('click', function(){
	    this.fireEvent('go_preview_assoc');
	}, this);
	
	
        
        //this.buttNewDoc.on('click', this.onNewDocClick, this);
        this.buttSaveDoc.on('click', this.onSaveDocClick, this);
        //this.buttIdent.on('click', this.onIdentClick, this);
        this.buttTrans.on('click', this.onTranslate, this);
        this.comboLeftLang.on('change', this.onLangChange, this);
        this.comboRightLang.on('change', this.onLangChange, this);
        this.switchButton.on('click', this.onLangSwitch, this);
        //this.printButton.on('click', this.onPrint, this);
        //this.linkButton.on('click', this.onLinkButt, this);
        this.linkInput.on('change', this.onInputChange, this);
        
        if(Ext.isIE){
            this.linkInput.addKeyListener(Ext.EventObject.ENTER, this.onInputChange, this);
        }
    },
    
    setLinkUrl: function(url){
        this.url = url;
        this.linkInput.dom.value = url;
    },
    
    getEl: function(){
        return this.el;
    },
    
    getSwitchButtWidth: function(){
        return this.switchButton.getWidth();
    },
    
    setVisible: function(see){
        if(see){
            this.el.show();
	    	this.linkInput.show();
        }else{
            this.el.hide();
            this.linkInput.hide();
        }
    },
    
    show: function(){
        this.setVisible(true);
        Ext.fly('edit_toolbar_edit_tabs').show();
    },
    
    hide: function(){
        this.setVisible(false);
        Ext.fly('edit_toolbar_edit_tabs').hide();
    },
    
    setPosition: Ext.emptyFn,
    
    getTextLang: function(){
        return this.comboLeftLang.getValue();  
    },
    
    getTwxtLang: function(){
        return this.comboRightLang.getValue();
    },
    
    fillLangCombos: function(){
        /*var lCombo = this.comboLeftLang;
        var rCombo = this.comboRightLang;
        var num = 0;
        
        Ext.each(this.langs, function(item){
            lCombo.dom.options[num] = new Option(item[1].toUpperCase(), item[0], false, false);
            rCombo.dom.options[num] = new Option(item[1], item[0], false, false);
            num++;
        }, this);*/
        
        var userid = (USER_LOGED_IN) ? USER_DATA.userid : null;
        
        /*{*/console.debug("Going to load Slop Select");/*}*/
        this.slop_select = new twexter.slop_select({
            select_text: this.comboLeftLang,
            select_twxt: this.comboRightLang,
            user_id: userid
        });
        this.slop_select.init();
        
        this.slop_select.on('translateLangCode', this.onTranslateSetCode, this);
        this.slop_select.on('translateSrcCode', this.onTranslateSrcCode, this);
    },
    
    setComboLeftTo: function(x){
        //if(!this.comboLeftLang){ return; }
        this.comboLeftLang.setX(x-this.comboLeftLang.getWidth());
        
        //Place switcher next to left combo
        this.switchButton.setX(x);
        
        var y = this.comboLeftLang.getY()+((this.comboLeftLang.getHeight()/2)-(this.switchButton.getHeight()/2));
        this.switchButton.setY(y);
    },
    
    setComboRightTo: function(x){
        //var rCombo = this.comboRightLang;
        //if(!this.comboRightLang){ return; }
        this.comboRightLang.setX(x);
    },
    
    setRightButtonsTo: function(x){
	
	
	
        //var rightC = this.comboRightLang.getX()+this.comboRightLang.getWidth();
        
        /*if(this.printButton){
            this.printButton.setX(rightC+10);
        }*/
       /* if(this.buttTrans){
            //this.buttTrans.setX(this.buttSaveDoc.getX()-this.buttTrans.getWidth());
            this.buttTrans.setX(rightC+this.buttTrans.getWidth());
        }
        if(this.linkButton){
            this.linkButton.setX(this.buttTrans.getX()+this.linkButton.getWidth());
        }
        if(this.buttSaveDoc){
            if(this.linkInput.isVisible()){
                this.linkInput.setX(this.linkButton.getX()+this.linkInput.getWidth());
                this.buttSaveDoc.setX(this.linkButton.getX()+this.buttSaveDoc.getWidth());
                this.buttSaveDoc.setY(this.linkButton.getY());
            }else{
                this.buttSaveDoc.setY(this.linkButton.getY());
                this.buttSaveDoc.setX(this.linkButton.getX()+this.buttSaveDoc.getWidth()+100);
            }
            
        }*/
	
	
	//console.warn("Setting the position to:", this.buttSaveDoc.getX()+this.buttSaveDoc.getWidth());
	
	/*var preview = this.tabPreview;
	preview.show();
	preview.setX(this.buttSaveDoc.getX()+this.buttSaveDoc.getWidth()+5);
	preview.setY(this.buttSaveDoc.getY());
	
	var utube = this.tabUrl;
	utube.show();
	utube.setX(preview.getX()+preview.getWidth());
	utube.setY(sep.getY());
	
	var trans = this.tabTrans;
	trans.show();
	trans.setX(utube.getX()+utube.getWidth());
	trans.setY(sep.getY());*/
	var oel = SIMPLE.output.getEl();
	var tb = Ext.fly('edit_toolbar_edit_tabs');
	if(!this.editTabsSetSize){
		tb.setWidth(this.tabPreview.getWidth()+this.tabUrl.getWidth()+this.tabTrans.getWidth()+this.tabAssoc.getWidth()+8);
		tb.setHeight(this.tabPreview.getHeight());
		this.editTabsSetSize = true;
	}
	tb.setX(oel.getX()+oel.getWidth()-tb.getWidth()-10).setY(oel.getY()-tb.getHeight()).show();
        
        
    },
    
    view_preview: function(){
		this.tab_clear();
		this.color_tab('.'+this.id+'_tab_preview');
		this.setRightButtonsTo();
    },
    
    view_utube: function(){
		this.tab_clear();
		this.color_tab('.'+this.id+'_tab_youtube');
		this.setRightButtonsTo();
    },
    
    view_trans: function(){
		this.tab_clear();
		this.color_tab('.'+this.id+'_tab_trans');
		this.setRightButtonsTo();
    },
    
    view_assoc: function(){
	this.tab_clear();
	this.color_tab('.'+this.id+'_tab_assoc');
	this.setRightButtonsTo();
    },
    
    color_tab: function(t){
		Ext.util.CSS.updateRule(t,'background-color','#84794A');
		Ext.util.CSS.updateRule(t,'color','#FFFFFF');
		Ext.util.CSS.updateRule(t,'font-weight','bold');
    },
    
    tab_clear: function(){
		values = [['background-color','#FFF'],['color','#000'],['font-weight','normal']];
		Ext.each(values, function(i){
			Ext.util.CSS.updateRule('.'+this.id+'_tab_preview', i[0], i[1]);
			Ext.util.CSS.updateRule('.'+this.id+'_tab_youtube', i[0], i[1]);
			Ext.util.CSS.updateRule('.'+this.id+'_tab_trans', i[0], i[1]);
			Ext.util.CSS.updateRule('.'+this.id+'_tab_assoc', i[0], i[1]);
		}, this);
    },
    
    isUrl: function(s) {
		//var rule = "(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?";
		var rule = "^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\#\?\/.=]+$";
		//var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		var regexp = new RegExp(rule, 'i');
		return regexp.test(s);
    },
    
    onInputChange: function(){
		var url = this.linkInput.getValue();
		if(this.isUrl(url)){
			this.fireEvent('urllink_change', url);
			this.url = url;
		}else{
			alert("Not a valid URL");
		}
		this.setRightButtonsTo();
    },
    
    getURL: function(){
        return this.url;  
    },
    
    onLinkButt: function(){
        if(this.linkInput.isVisible()){
            this.linkInput.setWidth(0);
            this.linkInput.hide();
        }else{
            this.linkInput.setWidth(200);
            this.linkInput.show();
        }
        
    },
    
    onNewDocClick: function(){
        /*{*/console.debug("Firing New Document Event");/*}*/
        this.fireEvent('new_document_click', this);
    },
    
    onSaveDocClick: function(){
        /*{*/console.debug("Firing Save Document Event");/*}*/
        this.fireEvent('save_document_click', this);
    },
    
    onIdentClick: function(){
        /*{*/console.debug("Firing Ident Event");/*}*/
        this.fireEvent('user_click', this);
    },
    
    onTranslate: function(){
        /*{*/console.debug("Firing Options Click");/*}*/
        this.fireEvent('translate_click', this, this.buttTrans);
    },
    
    onLangChange: function(){
        var l = this.comboLeftLang.getValue();
        var r = this.comboRightLang.getValue();
        
        /*{*/console.debug("Language Change (%s) (%s)", l, r);/*}*/
        this.fireEvent('lang_change', this, l, r);
    },
    
    onLangSwitch: function(){
        var tmp = this.comboLeftLang.getValue();
        this.comboLeftLang.dom.value = this.comboRightLang.getValue();
        this.comboRightLang.dom.value = tmp;
        //this.switchButton.toggleClass("flip");
        this.fireEvent("lang_switch", this);
        this.onLangChange();
        this.slop_select.onTextChange();
        this.slop_select.onTwxtChange();
        
    },
    
    onTranslateSetCode: function(code){
        /*{*/console.log("Setting Translation Target Code To: %s", code);/*}*/
        LANG_TRANS_CODE = code;
    },
    
    onTranslateSrcCode: function(code){
        /*{*/console.log("Setting Translation Source Code To: %s", code);/*}*/
        LANG_SOURCE_CODE = code;
    },
    
    onPrint: function(){
        /*{*/console.log("Print Button Pressed");/*}*/
        this.fireEvent('print_doc');
    }
    
};

Ext.extend(twexter.editor_tools, Ext.util.Observable, twexter.editor_tools.prototype);
