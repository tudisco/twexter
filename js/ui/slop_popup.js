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

Ext.namespace('twexter', 'twexter.slop_popup');

/**
 * The slop popup control.. ever user clicks on add lang option
 */
twexter.slop_popup = function(config){
    twexter.slop_popup.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"addLangUser": true,
        "loadedUserLangs" : true,
        "loadedAllLangs" : true,
        "removeLangUser" : true,
        'collapse': true
    });
};

twexter.slop_popup.prototype = {
    
    el: null,
    id: 'slop_popup',
    bodyId: MAIN_BODY,
    tpl: null,
    listUser: null,
    listUserId: 'slop_list_user',
    listUserEl: 'lang_user_container',
    listAll: null,
    listAllId: 'slop_list_all',
    listAllEl: 'lang_all_container',
    searchBoxEl: 'slop_lang_search',
    searchFieldId: 'slop_search_field',
    fieldSearch: null,
    user_id: null,
    alignTo: null,
    popAlign: 'tl-bl?',
    isPopup: true,
    imageSearch: 'images/slop/edit-find.png',
    imageAddDisable: 'images/slop/zoom-in-grey.png',
    imageAdd: 'images/slop/zoom-in.png',
    imageCancel: 'images/slop/dialog-cancel.png',
    hideEditor: true,
    
    init: function(){
        
        if(Ext.isEmpty(this.tpl)){
	    var nl = "\n";
            this.tpl = new Ext.Template(
		nl,
                '<div id={id} class={id}>',
		nl,
                    '<table>',
		    nl,
                        '<tr><td colspan="2">',
                            '<div id="{searchBoxEl}" class="{searchBoxEl}">',
			    nl,
                                '<input id="{searchFieldId}" type="text" style="border: none">',
				nl,
                                '<img id="{searchBoxEl}_img1" src="{imageSearch}" align="abscenter">',
                                '<img id="{searchBoxEl}_img2" src="{imageAdd}" align="abscenter">',
                                nl,
                            '</div>',
                        '</td></tr>',
                        
                        '<tr><td valign="top">',
			nl,
                            '<div id="{userListEl}" class="{userListEl}"></div>',
			    nl,
                        '</td><td valign="top">',
			nl,
                            
			    nl,
                            '<div id="{allListEl}" class="{allListEl}"></div>',
			    nl,
                        '</td></tr>',
			nl,
                    '</table>',
		    nl,
                '</div>'
            );
        }
        
        this.tpl.append(this.bodyId,{
            id: this.id,
            userListEl: this.listUserEl,
            searchBoxEl: this.searchBoxEl,
            allListEl: this.listAllEl,
	    searchFieldId: this.searchFieldId,
            imageSearch: this.imageSearch,
            imageAdd: this.imageAddDisable
        });
        
        this.el = Ext.get(this.id);
	this.fieldSearch = Ext.get(this.searchFieldId);
	this.fieldSearch.hide();
        this.fieldSearchContainer = Ext.get(this.searchBoxEl);
        
        this.init_stores();
        
        this.listUser = new twexter.slop_list({
            renderTo: this.listUserEl,
            id:this.listUserId,
            store:this.storeUserLangs,
            parent:this,
            displayField:'name',
            cls:'slop_list_user',
            forceUpperCase: true
            //displayTpl:'{name} <span class="eng">({enlish_name})</span>'
        });
        
        this.listAll = new twexter.slop_list({
            renderTo: this.listAllEl,
            id:this.listAllId,
            store:this.storeAllLangs,
            parent:this,
            displayField:'name',
            //displayTpl:'{name} <span class="eng">({english_name})</span>',
            cls:'slop_list_all'
        });
	
	this.listUser.init();
	this.listAll.init();
	
	this.listUserContainer = Ext.get(this.listUserEl);
	this.listAllContainer = Ext.get(this.listAllEl);
	
	if(this.listUserContainer){ this.listUserContainer.hide(); }
	if(this.listAllContainer){ this.listAllContainer.hide(); }
        
        this.preloadImages();
        this.init_events();
        
    },
    
    preloadImages: function(){
        this.images = [];
        var tmp = new Image();
        tmp.src = this.imageCancel;
        this.images[this.images.length] = tmp;
        tmp = new Image();
        tmp.src = this.imageAdd;
        this.images[this.images.length] = tmp;
    },
    
    init_events: function(){
        this.fieldSearch.on('keyup', this.onSearchKeyUp, this, {buffer:200});
        //this.fieldSearch.on('keypress', this.onSearchKeyPress, this);
        Ext.get(this.searchBoxEl+'_img1').on('click', this.onSearchCancelClick, this);
        Ext.get(this.searchBoxEl+'_img2').on('click', this.onAddUnknownLang, this);
        this.listAll.on('select', this.onClickAllLang, this);
        this.listUser.on('select', this.onClickUserLang, this);
        
        this.storeUserLangs.on('load', function(){
            this.storeUserLangs.sort('name', 'ASC');
            this.storeAllLangs.load();
        }, this);
        
        this.storeAllLangs.on('load', this.filterUserItems, this);
        
        this.storeUserLangs.on('add', this.onUserRecordAdd, this);
        this.storeUserLangs.on('remove', this.onUserRecordRemove, this);
    },
    
    init_event_delay: function(){
        Ext.getDoc().on('click', this.collapseIf, this);
    },
    
    init_stores: function(){
        
        var uparams, aparams;
        
        if(this.user_id){
            uparams = {query:'user',id:this.user_id};
            aparams = {query:'all',id:this.user_id};
        }else{
            uparams = {query:'main'};
            aparams = {};
        }
        
        var nameConv = function(v, r){
            return [r.name,' (',r.english_name,')'].join('');
        };
        
        this.storeUserLangs = new Ext.data.JsonStore({
            url: RPC_LANGS,
            root: 'langs',
            id: 'id',
            fields: [
                'id','name','english_name',
                {name:'cname', convert:nameConv}
            ],
            baseParams: uparams
        });
        
        this.storeAllLangs = new Ext.data.JsonStore({
            url: RPC_LANGS,
            root: 'langs',
            id: 'id',
            fields: [
                'id',
                'name',
                'english_name',
                {name:'cname', convert:nameConv}
            ],
            baseParams: aparams
        });
    },
    
    onUserLogin: function(user_id){
        this.user_id = user_id;
        if(!isNaN(this.user_id) && this.user_id > 0){
            //@TODO: Make Sure Store Loads User List.
            var uparams = {query:'user',id:this.user_id};
            this.storeUserLangs.baseParams = uparams;
            this.storeUserLangs.reload();
        }
    },
    
    correctSizes: function(){
        var sfh = this.fieldSearchContainer.getHeight();
        var mlh = this.listAllContainer.getHeight();
        
        var new_h = sfh + mlh;
        /*{*/console.debug("Search H:%s + List All H:%s = %s", sfh, mlh, new_h);/*}*/
        
        //this.listUserContainer.setHeight(new_h+4);
        this.listUserContainer.setHeight(mlh);
        
        
        /*{*/console.debug(this.listUser.getEl().getHeight());/*}*/
        
        var smargin = 6;
        var imargin = 1;
        var sfo = this.fieldSearchContainer;
        var img1 = Ext.get(this.searchBoxEl+'_img1');
        var img2 = Ext.get(this.searchBoxEl+'_img2');
        var sfw = sfo.getWidth();
        var sfx = sfo.getX();
        img2.setX(sfw+sfx-img2.getWidth()-smargin);
        img1.setX(img2.getX()-img1.getWidth()-imargin);
    },
    
    show: function(alignTo){
        var al = alignTo || this.alignTo;
        this.el.show();
        if(this.isPopup && !Ext.isEmpty(al)){
            this.el.alignTo(al, this.popAlign);
        }
	this.fieldSearch.show();
	this.storeUserLangs.reload();
	this.storeAllLangs.reload();
	this.listAllContainer.show();
	this.listUserContainer.show();
        this.correctSizes();
        //Global Click
        this.init_event_delay.defer(600, this);
    },
    
    hide: function(){
        this.el.hide();
	this.fieldSearch.hide();
	this.listAllContainer.hide();
	this.listUserContainer.hide();
        
        if(this.hideEditor){ SIMPLE.editor.setVisible(true); }
        
        this.fireEvent('collapse', this);
        
        
    },
    
    /*onSearchKeyPress: function(){
       
    },*/
    
    onSearchKeyUp: function(){
        
        var v = this.fieldSearch.getValue();
        if(v.length > 0){
            Ext.get(this.searchBoxEl+'_img1').dom.src = this.imageCancel;
            Ext.get(this.searchBoxEl+'_img2').dom.src = this.imageAdd;
            this.isShowingCancel = true;
            this.listAll.setSearchValue(v);
            this.storeAllLangs.filter('cname', v, true);
        }else{
            Ext.get(this.searchBoxEl+'_img1').dom.src = this.imageSearch;
            Ext.get(this.searchBoxEl+'_img2').dom.src = this.imageAddDisable;
            this.isShowingCancel = false;
            this.listAll.setSearchValue('');
            this.storeAllLangs.clearFilter();
        }
        this.correctSizes();
    },
    
    onSearchCancelClick: function(){
        if(this.isShowingCancel){
            this.fieldSearch.dom.value='';
            this.listAll.setSearchValue('');
            this.onSearchKeyUp();
        }
    },
    
    onClickAllLang: function(ctl, idx, rec){
        var langid = rec.get('id');
        var su = this.storeUserLangs;
        var suc = su.getCount();
        for(var i = 0 ; i<suc ; i++){
            var r = su.getAt(i);
            if(langid == r.get('id')){
                return;
            }
        }
        su.addSorted(rec);
        su.sort('name', 'ASC');
        this.storeAllLangs.remove(rec);
        this.fieldSearch.dom.value = '';
        this.onSearchKeyUp();
    },
    
    collapseIf: function(e){
        /*if(e.id != this.id && !e.within(this.el) && !e.within(this.listAllContainer) && !e.within(this.listUserContainer) && !e.within(this.listAllEl)){
            console.debug("Event El: %s", e.id);
            console.dir(e);
            this.collapse();
        }*/
        /*{*/console.dir(e.xy);/*}*/
        var xy = this.el.getXY();
        var w = this.el.getWidth();
        var h = this.el.getHeight();
        /*{*/console.log("%s %s %s %s", xy[0], xy[1], w, h);/*}*/
        
        if(e.xy[0] >= xy[0] && e.xy[0] <= (xy[0]+w)){
            if(e.xy[1] >= xy[1] && e.xy[1] <= (xy[1]+h)){
                return;
            }
        }
        
        this.collapse();
        
    },
    
    collapse: function(){
        /*{*/console.debug("Going to hide");/*}*/
        Ext.getDoc().un('click', this.collapseIf, this);
        this.hide();
    },
    
    filterUserItems: function(){
        this.storeAllLangs.sort('cname', 'ASC');
        /*{*/console.debug("Going to filter list");/*}*/
        this.storeUserLangs.each(function(rec){
           var uid = rec.get('id');
           /*{*/console.debug("Filtering Item %s", uid);/*}*/
           var arec = this.storeAllLangs.getById(uid);
           if(arec){
                this.storeAllLangs.remove(arec);
           }
        }, this);
        this.correctSizes();
    },
    
    onUserRecordAdd: function(store, rec, idx){
        
        if(this.skipNextAddLang){
            this.skipNextAddLang = false;
            return;
        }
        
        var r = rec[0];
        if(this.user_id){
            ajaxObj = {
                url: RPC_ADDLANG,
                success: this.onUserRecordAddSuc,
                failure: this.onUserRecordAddFail,
                params: {userid:this.user_id,langid:r.get('id')}
            };
            
            Ext.Ajax.request(ajaxObj);
        }
    },
    
    onUserRecordAddSuc: function(rep){
        if(rep.responseText){
            var o = Ext.decode(rep.responseText);
            if(o.success===true){
                return;
            }
        }
        alert("Problem saving use language");
    },
    
    onUserRecordAddFail: function(){
        alert("Failure Adding Language");
    },
    
    onClickUserLang: function(ctl, idx, rec){
        var langid = rec.get('id');
        this.storeUserLangs.remove(rec);
        var sa = this.storeAllLangs;
        var sac = sa.getCount();
        for(var i = 0 ; i<sac ; i++){
            var r = sa.getAt(i);
            if(langid == r.get('id')){
                return;
            }
        }
        
        //this.storeAllLangs.reload();
        
        sa.addSorted(rec);
        sa.sort('cname', 'ASC');
    },
    
    onUserRecordRemove: function(store, rec, idx){
        /*{*/console.debug("removing language");/*}*/
        if(this.user_id){
            ajaxObj = {
                url: RPC_REMOVELANG,
                success: this.onUserRecordRmSuc,
                failure: this.onUserRecordRmFail,
                params: {userid:this.user_id,langid:rec.get('id')}
            };
            
            Ext.Ajax.request(ajaxObj);
        }
    },
    
    onUserRecordRmSuc: function(rep){
        if(rep.responseText){
            var o = Ext.decode(rep.responseText);
            if(o.success===true){
                return;
            }
        }
        alert("Problem removing language");
    },
    
    onUserRecordRmFail: function(){
        alert("Failure Removing Language");
    },
    
    onAddUnknownLang: function(){
        /*{*/console.debug("Add Lang Click");/*}*/
        var v = this.fieldSearch.getValue();
        if(v.length > 0){
            if(this.user_id){
                ajaxObj = {
                    url: RPC_ADDLANG,
                    success: this.onUserCusotmAddSuc,
                    failure: this.onUserCusotmAddFail,
                    params: {userid:this.user_id,langtext:v},
                    scope: this
                };
                
                Ext.Ajax.request(ajaxObj);
                this.fieldSearch.dom.value = '';
                this.onSearchKeyUp();
            }
        }
    },
    
    onUserCusotmAddSuc: function(rep){
        if(rep.responseText){
            var o = Ext.decode(rep.responseText);
            if(o.success===true){
                
                if(this.storeUserLangs.getById(o.id)){
                    return;
                }
                
                var rec = new this.storeUserLangs.recordType({
                    id: o.id,
                    name: o.name,
                    english_name: ''
                });
                
                //var recs = [rec];
                this.skipNextAddLang = true;
                this.storeUserLangs.add(rec);
                
                return;
            }
        }
        alert("Problem saving custom language");
    },
    
    onUserCusotmAddFail: function(){
        alert("Problem saving custom language");
    }
    
};

Ext.extend(twexter.slop_popup, Ext.util.Observable, twexter.slop_popup.prototype);