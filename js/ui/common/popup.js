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

Ext.namespace('twexter', 'twexter.ui.popup');

twexter.ui.popup = function(config){
    twexter.ui.popup.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
	"before_show" : true,
        "after_show" : true,
        "before_hide" : true,
        "after_hide" : true,
        "on_destroy" : true
    });
}

twexter.ui.popup.prototype = {
    
    el: null,
    bodyId: MAIN_BODY,
    id: null,
    tpl: null,
    tpl_obj: null,
    cls: null,
    attachedCtrl: null,
    popAlign: 'tl-bl?',
    removeOnHide: false,
    
    init: function(){
        if(this.id === null){
            this.id = Ext.id();
        }
        
        if(this.cls === null){
            this.cls = 'ui_popup';
        }
        
        if(this.tpl === null){
            this.tpl = "<div id=\"{id}\" class=\"{cls}\"> </div>";
        }
        
        this.tpl_obj = new Ext.Template(this.tpl);
        this.tpl_obj.append(this.bodyId, {
           id: this.id,
           cls: this.cls
        });
        
        this.el = Ext.get(this.id);
        
        this.init_global_events.defer(600, this);
    },
    
    init_global_events: function(){
        Ext.getDoc().on('click', this.collapseIf, this);
    },
    
    collapseIf: function(e){

        var xy = this.el.getXY();
        var w = this.el.getWidth();
        var h = this.el.getHeight();
        
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
        if(this.removeOnHide){
            this.el.remove();
        }
    },
    
    show: function(){
	if(this.attachedCtrl !== null){
	    this.el.alignTo(this.attachedCtrl, this.popAlign);
	}
        this.el.show();
        this.init_global_events.defer(600, this);
    },
    
    hide: function(){
        this.el.hide();
    },
    
    getEl: function(){
	return this.el;
    }
    
};

Ext.extend(twexter.ui.popup, Ext.util.Observable, twexter.ui.popup.prototype);