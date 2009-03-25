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

Ext.namespace('twexter', 'twexter.savedlg');

twexter.savedlg = function(userid, config){
    twexter.savedlg.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"save_document": true,
	"update_document": true
    });
    this.user_id = userid;
};

twexter.savedlg.prototype = {
    
    /** Ext.Element of this control */
    el: null,
    /** Tpl for this control */
    tpl: null,
    id: 'save_form',
    bodyId: MAIN_BODY,
    
    init: function(){
        if(Ext.isEmpty(this.tpl)){
            this.tpl = new Ext.Template(
                '<div id="{id}" class="{id}">',
                    '<div id="{id}_titlebar" class="title">{title}</div>',
                    '<div class="body">',
                        '<div class="field"><label for="{id}_title">Title:</label><input id="{id}_title" type="text" value="{doc_title}" /></div>',
                        '<div class="field_textarea">',
                            '<label for="{id}_desc">Description:</label>',
                            '<textarea id="{id}_desc">{doc_desc}</textarea>',
                        '</div>',
			'<div class="field"><label for="{id}_tags">Tags:</label><input id="{id}_tags" type="text" value="{doc_tags}" /></div>',
                        '<div class="field"><label for="{id}_global">Public:</label><input id="{id}_global" type="checkbox" {checked} /></div>',
                        '<div align="center" class="buttons">',
                            '<button id="{id}_save_button" class="{id}_save_button"><img src="/images/save/dialog-apply.png" height="16" width="16" /></button>',
                            '<button id="{id}_cancel_button" class="{id}_cancel_button"><img src="/images/save/dialog-cancel.png" height="16" width="16" /></button>',
                        '</div>',
                    '</div>',
                '</div>'
            );
        }
    
		this.tpl.append(this.bodyId, {id:this.id,title:"Save...",checked:'checked="checked"'});
		
		this.el = Ext.get(this.id);
		this.form_title = Ext.get(this.id+"_title");
		this.form_desc = Ext.get(this.id+"_desc");
		this.form_global = Ext.get(this.id+"_global");
		this.form_cancel_button = Ext.get(this.id+"_cancel_button");
		this.form_save_button = Ext.get(this.id+"_save_button");
		this.form_tags = Ext.get(this.id+"_tags");
		this.el.hide();
		this.init_events();
    },
    
    /**
     * Init Event for this control
     */
    init_events: function(){
		this.form_cancel_button.on('click', this.onCancel, this);
		this.el.addKeyListener(Ext.EventObject.ESC, this.onCancel, this);
		this.form_save_button.on('click', this.onSave, this);
		this.el.addKeyListener(Ext.EventObject.ENTER, this.onSave, this);
        //Comment this out so titles are editable
	//this.form_title.on('focus', this.onTitleFocus, this);
    },
    
    /**
     * Show this control
     */
    show: function(title){
        this.form_title.dom.value = title || '';
        if(!Ext.isEmpty(this.form_title.dom.value)){
            this.title_read_only = true;
        }else{
            this.title_read_only = false;
        }
        
        this.bodyProxy = Ext.get(this.bodyId).createChild({
            style:{
               visbility:"hidden",
               position:"absolute",
               "z-index":"400",
               "background-color":"black",
               top:"1px",
               left:"1px",
               bottom:"1px",
               right:"1px"
            }
        });
        
        this.bodyProxy.fadeIn({
            endOpacity:0.5,
            callback: function(){
                this.el.center();
                this.el.fadeIn({
                    callback:function(){
                        //this.el.frame("0000FF", 1,{duration:0.6});
                        this.form_title.focus();
                    },
                    scope:this
                });
            },
            scope:this
        });
    },
    
    /**
     *  Hide this control
     */
    hide: function(){
        this.el.fadeOut({
            callback: this.clearBodyProxy,
            scope:this
        });
    },
    
    /**
     * On Cancel Button Event
     */
    onCancel: function(){
        this.hide();
    },
    
    /**
     * Clear the body proxy (element which makes background darker)
     */
    clearBodyProxy: function(){
        if(this.bodyProxy){
            this.bodyProxy.fadeOut({
                callback: function(){
                    this.bodyProxy.remove();
                    this.bodyProxy = null;
                },
                scope:this
            });
        }
    },
    
    /**
     * Disable buttons on form
     */
    disableButtons: function(){
	this.form_save_button.dom.disabled = true;
	this.form_cancel_button.dom.disabled = true;
    },
    
    /**
     * Enable buttons on this form
     */
    enableButtons: function(){
	this.form_save_button.dom.disabled = false;
	this.form_cancel_button.dom.disabled = false;
    },
    
    /**
     * Clear the fields of this form
     */
    clearFields: function(){
	this.form_title.dom.value = '';
	this.form_desc.dom.value = '';
	this.form_tags.dom.value = '';
    },
    
    /**
     * On save event handler
     */
    onSave: function(){
	var title = this.form_title.getValue();
	var desc = this.form_desc.getValue();
	var global = this.form_global.dom.checked ? 'yes' : 'no';
	var tags = this.form_tags.getValue();
	/*{*/console.log("Save Document (%s|%s|%s)", title, desc, global);/*}*/
	this.fireEvent('save_document', title, desc, global, tags);
	Ext.get(this.id+'_titlebar').update("Saving...");
	this.disableButtons();
    },
    
    /**
     * Call this to let app know save is complete
     */
    saveCompleted: function(success, docid){
	if(success===false){
	    this.enableButtons();
	}else{
	    this.hide();
	    this.enableButtons();
	    this.clearFields();
	}
    },
    
    onTitleFocus: function(){
        if(this.title_read_only){
            this.form_title.blur();
        }
    }
    
};

Ext.extend(twexter.savedlg, Ext.util.Observable, twexter.savedlg.prototype);