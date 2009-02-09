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

Ext.namespace('twexter', 'twexter.tools_popup');

/**
 * Editor Tools / Settings Popup
 */
twexter.tools_popup = function(config){
    twexter.tools_popup.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
	"unchunk" : true,
        "rechunk" : true,
        "translate": true,
        "TranslateOptionChange": true,
        "getSettings": true,
        "translateButtonClick" : true
    });
    //this.init();
};

twexter.tools_popup.prototype = {
    
    el:null,
    tpl:null,
    id:'tools_popup',
    bodyId: MAIN_BODY,
    firstSize: null,
    
    /**
     * Init Control
     */
    init: function(){
        //If we don't have a template create one
        if(Ext.isEmpty(this.tpl)){
            nl = "\n";
            this.tpl = new Ext.Template(
                nl,
                '<div id="{id}" class="{id}">',
                    '<div id="{id}_type" class="{id}_type">',
                        'Translation Type:',
                        '<select id="{id}_sel_type"></select>',
                    '</div>',
		    '<div id="{id}_trans" class="{id}_trans">',
                        '<img src="/images/edittools/GoogleTranslate.gif" align="absmiddle">',
                        ':<select id="{id}_sel_trans"></select>',
                    '</div>',
                    '<div id="{id}_chunk" class="{id}_chunk">',
                        '<div class="chunk_length">Chunk Width:',
                            '<select id="{id}_chunk_len"></select>',
                        '</div>',
                        //'<div id="{id}_chunk_start" class="chunk_start">',
                        //    'Chunk',
                        //'</div>',
                        //'<div id="{id}_chunk_undo" class="chunk_undo">',
                        //    'UnChunk',
                        //'</div>',
                        '<div id="{id}_chunk_optbutt" class="chunk_optbutt">',
                            '<<<',
                        //    //'',
                        '</div>',
                    '</div>',
                    
                    '<div id="{id}_transbutton_div" style="float:right"><button id="{id}_transbutton">Translate</button></div>',
                    '<div style="clear:both;></div>"',
		    
                    '<div id="{id}_chunk_options" class="{id}_chunk_options">',
                        '<div class="chunk_both"><div>Both:</div><textarea id="{id}_chunk_both"></textarea></div>',
                        '<div class="chunk_before"><div>Before:</div><textarea id="{id}_chunk_before"></textarea></div>',
                        '<div class="chunk_after"><div>After:</div><textarea id="{id}_chunk_after"></textarea></div>',
                    '</div>',
                '<div>'
            );
        }
        
        //Append Template to body
        this.tpl.append(this.bodyId, {
            id:this.id
        });
        
        this.el = Ext.get(this.id);
        this.comboType = Ext.get(this.id+'_sel_type');
        this.comboType.on('click', function(e){e.stopEvent();});
        this.comboLength = Ext.get(this.id+'_chunk_len');
        this.comboLength.on('click', function(e){e.stopEvent();});
        this.comboTrans = Ext.get(this.id+'_sel_trans');
        this.comboTrans.on('click', function(e){e.stopEvent();});
        this.chunkOptions = Ext.get(this.id+'_chunk_options');
        
        this.translateButton = Ext.get(this.id+'_transbutton');
        
        //this.el.setLeft(COL_LEFT_SIZE);
        
        this.fillTypeCombo();
        this.fillLengthCombo();
        this.fillTransCombo();
        this.fillTextBoxes();
        this.init_events();
        
        var lang = SIMPLE.getSourceLang();
        this.setLanguage(lang);
        
        this.fireEvent('getSettings', lang);
    },
    
    init_events: function(){
        //this.unchunk = Ext.get(this.id+'_chunk_undo');
        //this.unchunk.on('click', function(){
        //    this.fireEvent('unchunk', this);
        //}, this);
        
        //this.rechunk = Ext.get(this.id+'_chunk_start');
        //this.rechunk.on('click', function(){
        //    this.fireEvent('rechunk', this, this.comboLength.getValue(), this.TextAreaBoth.getValue(), this.TextAreaBefore.getValue(), this.TextAreaAfter.getValue());
        //}, this);
        
        this.chunkOptButt = Ext.get(this.id+'_chunk_optbutt');
        this.chunkOptButt.on('click', this.onOptButtClick, this);
        
        this.translateButton.on('click', function(){
            this.fireEvent('translateButtonClick', this);
            this.hide(true);
        }, this);
        
       // this.comboTrans.on('change', this.onComboTransChange, this);
    },
    
    init_DocClickEvent: function(){
	Ext.getDoc().on('click', this.onDocClick, this);
    },
    
    onDocClick: function(e){
	/*{*/console.debug("Outside Edittool Click");/*}*/
	if(!this.el.isVisible()) return;
	var xy = this.el.getXY();
	var w = this.el.getWidth();
	var h = this.el.getHeight();
	
	if(e.xy[0] >= xy[0] && e.xy[0] <= (xy[0]+w)){
	    if(e.xy[1] >= xy[1] && e.xy[1] <= (xy[1]+h)){
		return;
	    }
	}
	this.hide();
    },
    
    fillTypeCombo: function(){
        var types = [['text','Text'],['chucked','Chunked'],['twext','Twext']];
        var xx = 0;
        Ext.each(types, function(item){
            this.comboType.dom.options[xx] = new Option(item[1], item[0], false, false);
            xx++;
        }, this);
    },
    
    fillLengthCombo: function(){
        var max = 50;
        var min = 15;
        var sel = 22;
        this.comboLength.dom.options[0] = new Option('None', -1, false, false);
        for(var i = 15, idx = 1 ; i<max ; i++ , idx++){
            if(i!=sel){
                this.comboLength.dom.options[idx] = new Option(i,i,false,false);
            }else{
                this.comboLength.dom.options[idx] = new Option(i,i,true,true);
            }
            
        }
    },
    
    fillTransCombo: function(){
        this.comboTrans.dom.options[0] = new Option('No', 'none', false, true);
        this.comboTrans.dom.options[1] = new Option('Yes', 'google', false, false);
    },
    
    fillTextBoxes: function(){
        this.TextAreaBoth = Ext.get(this.id+'_chunk_both');
        this.TextAreaBefore = Ext.get(this.id+'_chunk_before');
        this.TextAreaAfter = Ext.get(this.id+'_chunk_after');
        /*this.TextAreaBefore.dom.value = ['i','your', 'are','to','under','on','at','of','you','your','as','so','my','is','too','she','he','in','by','has','each','after'].join("\n");
        this.TextAreaBoth.dom.value = ['who', 'what', 'where', 'how', 'when', 'why', 'which', 'whose', 'and', 'that','if','now','for','whenever','without','in','one','two','three'].join("\n");
        this.TextAreaAfter.dom.value = ['then','it','with','but','me'].join("\n");*/
    },
    
    clearTextBoxes: function(){
        this.TextAreaBefore.dom.value = '';
        this.TextAreaBoth.dom.value = '';
        this.TextAreaAfter.dom.value = '';
    },
    
    setLanguage: function(lang){
        this.language = lang;
        this.clearTextBoxes();
        if(lang=="english"){
            this.TextAreaBefore.dom.value = ['i','your', 'are','to','under','on','at','of','you','your','as','so','my','is','too','she','he','in','by','has','each','after'].join("\n");
            this.TextAreaBoth.dom.value = ['who', 'what', 'where', 'how', 'when', 'why', 'which', 'whose', 'and', 'that','if','now','for','whenever','without','in','one','two','three'].join("\n");
            this.TextAreaAfter.dom.value = ['then','it','with','but','me'].join("\n");
        }
    },
    
    show: function(btn){
	if(btn && btn.getX){
	    this.el.alignTo(btn);
	}
        this.el.show();
        if(this.firstSize === null) this.firstSize = this.el.getHeight();
	this.init_DocClickEvent.defer(200, this);
	this.timestamp = new Date().getTime();
    },
    
    hide: function(force){
	//Timed Protection becuase of event system wierdness
        var f = (force===true) ? true : false;
	var time = new Date().getTime();
	if((time-this.timestamp)<500 && f===false) return;
        this.chunkOptions.hide();
        this.el.setHeight(this.firstSize);
	this.el.setWidth(350);
        this.chunkOptButt.update("<<<");
        this.el.hide();
	Ext.getDoc().un('click', this.onDocClick, this);
        this.saveValuesEvent();
    },
    
    saveValuesEvent: function(){
        var type = this.comboType.getValue();
        var trans = this.comboTrans.getValue();
        var cwidth = this.comboLength.getValue();
        var chunk_options = {};
        chunk_options.both = this.TextAreaBoth.getValue();
        chunk_options.before = this.TextAreaBefore.getValue();
        chunk_options.after = this.TextAreaAfter.getValue();
        
        this.fireEvent('TranslateOptionChange', type, trans, cwidth, chunk_options, this.language);
    },
    
    setOptions: function(s){
        if(s.type) this.comboType.dom.value = s.type;
        if(s.trans) this.comboTrans.dom.value = s.trans;
        if(s.cwidth) this.comboLength.dom.value = s.cwidth;
        if(Ext.type(s.options)=='object'){
            var o = s.options;
            /*{*/console.dir(o);/*}*/
            if(o.both) this.TextAreaBoth.dom.value = o.both;
            if(o.before) this.TextAreaBefore.dom.value = o.before;
            if(o.after) this.TextAreaAfter.dom.value = o.after;
        }
    },
    
    getOptions: function(){
        var s = {}, o = {};
        s.type = this.comboType.getValue();
        s.trans = this.comboTrans.getValue();
        s.cwidth = this.comboLength.getValue();
        o.both = this.TextAreaBoth.getValue();
        o.before = this.TextAreaBefore.getValue();
        o.after = this.TextAreaAfter.getValue();
        s.options = o;
        return s;
    },
    
    chunkingFinished: function(){
        var trans = this.comboTrans.getValue();
        
        if(trans != 'none'){
            this.fireTranslate();
        }
    },
    
    fireTranslate: function(){
        if(LANG_GOOG_API===false){
            alert("Google Api has not loaded, please try again");
        }else{
            if(!Ext.isEmpty(LANG_TRANS_CODE) && !Ext.isEmpty(LANG_SOURCE_CODE)){
                this.fireEvent('translate', this, 'google', LANG_SOURCE_CODE, LANG_TRANS_CODE);
            }else{
                alert("Source or Target languge not supported");
            }
        }
        //this.comboTrans.dom.value = 'none';
    },
    
    onOptButtClick: function(){
        if(this.chunkOptions.isVisible()){
            this.chunkOptions.hide();
            this.el.setHeight(this.firstSize);
	    this.el.setWidth(350);
            this.chunkOptButt.update("<<<");
        }else{
            this.chunkOptions.show();
            this.el.setHeight(450);
	    this.el.setWidth(750);
            this.chunkOptButt.update(">>>");
        }
    }
    
};

Ext.extend(twexter.tools_popup, Ext.util.Observable, twexter.tools_popup.prototype);