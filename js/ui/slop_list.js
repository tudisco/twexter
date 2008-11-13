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

Ext.namespace('twexter', 'twexter.slop_list');

/**
 * Simple List Control for Slop Cntrol... Might need to make it just a general list control?
 */
twexter.slop_list = function(config){
    twexter.slop_list.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"expand": true,
        "collapse" : true,
        "beforeselect" : true,
        "select" : true,
        "beforequery" : true
    });
};

twexter.slop_list.prototype = {
    el:null,
    tpl:null,
    tpl_item:null,
    id:null,
    cls:'slop_list',
    cls_selected:'slop_item_sel',
    cls_over:'slop_item_over',
    listAlign: 'tl-bl?',
    parent: null,
    displayField: null,
    store: null,
    bodyId: MAIN_BODY,
    isPopUp: false,
    lastSearchValue: '',
    autoload:false,
    forceUpperCase: false,
    //itemSelector: null, //Only here as a remider
    
    init: function(id){
        
        this.id = id || this.id;
        if(Ext.isEmpty(this.id)){
            this.id = Ext.id();
        }
        
        if(Ext.isEmpty(this.tpl)){
            this.tpl = new Ext.Template('<div id="{id}" class="{cls}"></div>');
        }
        
        if(Ext.isEmpty(this.displayField) && !this.displayTpl){
            throw 'Display Field Required';
        }
        if(Ext.isEmpty(this.store)){
            throw 'Data Store Required';
        }
        if(Ext.isEmpty(this.parent)){
            throw 'No parent object, required';
        }
        
        if(Ext.isEmpty(this.tpl_item)){
	    var display = '';
	    
	    if(Ext.isEmpty(this.displayField)){
		display = this.displayTpl;
	    }else{
		if(this.forceUpperCase){
                    display = '{[this.highlight(values.' + this.displayField + '.toUpperCase())]}';
                }
                else
                {
                    display = '{[this.highlight(values.' + this.displayField + ')]}';
                }
	    }
	    
            this.tpl_item = new Ext.XTemplate(
                '<tpl for=".">'+ "\n" +'<div class="'+this.cls+'-item">' + display + '</div></tpl>',
                {
                    highlight: function(tstring){
                        var val = this.myParent.lastSearchValue;
                        if(Ext.isEmpty(val)){ return tstring; }
                        var newstr = '';
                        var lcVal = val.toLowerCase();
                        var lcTs = tstring.toLowerCase();
                        //var val = new RegExp(this.myParent.lastSearchValue, 'gi');
                        //return tstring.replace(val, '<span class="findlite">'+this.myParent.lastSearchValue+'</span>');
                        var i = -1;
                        while(tstring.length > 0){
                            i = lcTs.indexOf(lcVal, i+1);
                            if(i < 0){
                                newstr += tstring;
                                tstring = '';
                            }else{
                                newstr += tstring.substring(0,i)+'<span class="slopfindlite">'+tstring.substr(i, val.length)+'</span>';
                                tstring = tstring.substr(i + val.length);
                                lcTs = tstring.toLowerCase();
                                i = -1;
                            }
                        }
                        
                        return newstr;
                    },
                    myParent:this
                }
            );
        }
        
        this.tpl.append(this.renderTo || this.bodyId, {
            id: this.id,
            cls: this.cls
        });
        
        this.el = Ext.get(this.id);
        
        this.view = new Ext.DataView({
            store: this.store,
            applyTo: this.el,
            tpl: this.tpl_item,
            singleSelect: true,
            selectedClass: this.cls_selected,
            overClass: this.cls_over,
            itemSelector: this.itemSelector || 'div.' + this.cls + '-item',
            loadingText: "Loading....."
        });
        
        this.init_events();
        if(this.autoload){
            this.store.load();
        }
    },
    
    init_events: function(){
        this.view.on('click', this.onItemClick, this);
    },
    
    show: function(){
        this.el.show();
        if(this.isPopUp){ this.el.alignTo(this.parent, this.listAlign); }
    },
    
    hide: function(){
        this.el.hide();
    },
    
    onItemClick: function(ctl, idx, node, evt){
        /*{*/console.debug("Slop List %s Item %s", this.id, idx);/*}*/
        var rec = this.store.getAt(idx);
        this.fireEvent('select', this, idx, rec);
    },
    
    getEl: function(){
        return this.el;
    },
    
    setSearchValue: function(v){
        this.lastSearchValue = v;
    }
};

Ext.extend(twexter.slop_list, Ext.util.Observable, twexter.slop_list.prototype);