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

Ext.namespace('twexter', 'twexter.slop_select');

GLOBAL_SLOP_POPUP = null;

twexter.slop_select = function(config){
    twexter.slop_select.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"langSelect": true,
        "translateLangCode": true
    });
};

twexter.slop_select.prototype = {
    
    select_text: null,
    select_twxt: null,
    user_id: null,
    last_text_value: null,
    last_twxt_value: null,
    hide_editor: true,
    add_all: false,
    
    init: function(){
        if(Ext.isEmpty(GLOBAL_SLOP_POPUP)){
            GLOBAL_SLOP_POPUP = new twexter.slop_popup({
                user_id: (USER_LOGED_IN) ? USER_DATA.userid : null
            });
	    GLOBAL_SLOP_POPUP.init();
        }
        
        GLOBAL_SLOP_POPUP.on('collapse', this.reloadCombos, this);
	
	this.init_lang_store();
	this.init_combo_events();
    },
    
    init_lang_store: function(){
        var uparams;
	/*{*/console.debug("Loading Languages");/*}*/
	
        if(this.user_id!==null){
            uparams = {query:'user',id:this.user_id}; 
        }else{
            uparams = {query:'main'};
        }
        
        this.store = new Ext.data.JsonStore({
            url: RPC_LANGS,
            root: 'langs',
            fields: [
                'id', 'name', 'english_name', 'google_code'
            ],
            baseParams: uparams
        });
        
        this.store.on('load', this.onStoreLoad, this);
	
	this.store.load();
    },
    
    init_combo_events:  function(){
	this.select_text.on('change', this.onTextChange, this);
	this.select_twxt.on('change', this.onTwxtChange, this);
    },
    
    reloadCombos: function(){
        this.select_text.dom.options.length = 0;
        this.select_twxt.dom.options.length = 0;
        this.store.reload();
    },
    
    onStoreLoad: function(){
	
	/*{*/console.debug("Languages Loaded");/*}*/
	
        if(this.user_id){
            var rec = new this.store.recordType({
                id: 0,
                name: '+',
                english_name: '+'
            });
            
            //var recs = [rec];
            this.store.add(rec);
            
            if(this.add_all){
                var rec2 = new this.store.recordType({
                    id: 0,
                    name: '--all--',
                    english_name: '--all--'
                });
                
                //recs[recs.length] = rec2;
                this.store.insert(0,rec2);
            }
            
            //this.store.add(recs);
        }
        
        //Fill Combos Here.
	this.fillCombos();
    },
    
    fillCombos: function(){
	this.googleIdMap = [];
	//this.store.sort('name', 'ASC');
        
        if(Ext.isEmpty(this.select_text) || Ext.isEmpty(this.select_twxt)){
	    throw "no select controls";
	}
	
	var c = this.store.getCount();
	var r = null;
	for(var i = 0; i<c; i++){
	    r = this.store.getAt(i);
	    this.select_text.dom.options[i] = new Option(r.get('name').toUpperCase(), r.get('name'), false, false);
	    this.select_twxt.dom.options[i] = new Option(r.get('name').toLowerCase(), r.get('name'), false, false);
            this.googleIdMap[i] = r.get('google_code');
        }
        if(this.last_text_value===null){
            this.last_text_value = this.select_text.getValue();
        }else{
            this.select_text.dom.value = this.last_text_value;
        }
        
        if(this.last_twxt_value===null){
            this.last_twxt_value = this.select_twxt.getValue();
        }else{
            this.select_twxt.dom.value = this.last_twxt_value;
        }
        
        this.onTextChange();
        this.onTwxtChange();
        
        SIMPLE.pos_editor();
        
    },
    
    onTextChange: function(){
	var v = this.select_text.getValue();
        var selIdx = this.select_text.dom.selectedIndex;
	if(v == '+'){
	    /*{*/console.debug("We have a plus");/*}*/
	    if(this.hide_editor){ SIMPLE.editor.setVisible(false); }
	    GLOBAL_SLOP_POPUP.show(this.select_text);
            GLOBAL_SLOP_POPUP.hideEditor = this.hide_editor;
	}else{
            this.last_text_value = v;
            this.fireEvent('langSelect', v, this.select_twxt.getValue());
            this.fireEvent('translateSrcCode', this.googleIdMap[selIdx]);
        }
    },
    
    onTwxtChange: function(){
	var v = this.select_twxt.getValue();
        var selIdx = this.select_twxt.dom.selectedIndex;
        /*{*/console.debug("Google Code for %s: %s", selIdx, this.googleIdMap[selIdx]);/*}*/
	if(v == '+'){
	    /*{*/console.debug("We have a plus");/*}*/
            if(this.hide_editor){ SIMPLE.editor.setVisible(false); }
            GLOBAL_SLOP_POPUP.show(this.select_twxt);
            GLOBAL_SLOP_POPUP.hideEditor = this.hide_editor;
	}else{
            this.last_twxt_value = v;
            this.fireEvent('langSelect', this.select_text.getValue(), v);
            this.fireEvent('translateLangCode', this.googleIdMap[selIdx]);
        }
    },
    
    userLogin: function(user_id){
        this.user_id = user_id;
        this.store.baseParams = {query:'user',id:this.user_id};
        GLOBAL_SLOP_POPUP.onUserLogin(user_id);
        this.reloadCombos();
    }
};

Ext.extend(twexter.slop_select, Ext.util.Observable, twexter.slop_select.prototype);