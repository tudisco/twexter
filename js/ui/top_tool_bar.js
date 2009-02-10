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

Ext.namespace('twexter', 'twexter.top_tool_bar');

twexter.top_tool_bar = function(config){
    twexter.top_tool_bar.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
     this.addEvents({
	"unchunk" : true,
        "rechunk" : true,
        "translate": true
    });
};

twexter.top_tool_bar.prototype = {
    
    id: 'top_menu',
    bodyId: MAIN_BODY,
    el:null,
    buttons: [null,null,null,null,null,null],
    manButtons: [null,null,null,null,null,null],
    buttonMargins: [],
    
    addButton: function(el, pos){
        this.buttons[pos] = el;
    },
    
    init: function(){
        this.el = Ext.get(MAIN_BODY).createChild({id:this.id,cls:this.id});  
    },
    
    posButtons: function(){
        /*{*/console.group("Position Top Button Bar");/*}*/
        var right = 10;
        var twidth = 0;
        var bwidth = Ext.get(this.bodyId).getWidth()-right;
        Ext.each(this.buttons, function(item, idx){
            if(Ext.type(item)!='object'){
                return;
            }
            var w = item.getWidth();
            twidth+=w;
            var x = bwidth - twidth;
            item.setX(x);
            /*{*/console.debug("Going to tes button to ",x);/*}*/
	    if(Ext.isArray(this.buttonMargins[idx])){
		if(this.buttonMargins[idx]['l']){
		    twidth+=Ext.num(this.buttonMargins[idx]['l'],0);
		}
	    }
	    if(Ext.isArray(this.buttonMargins[idx]) && this.buttonMargins[idx]['t']){
		item.setY(Ext.num(this.buttonMargins[idx]['t'], 0));
	    }else{
		item.setY(0);
	    }
            /*{*/console.info("Button %s set to X:%s", idx, x);/*}*/
        }, this);
        /*{*/console.groupEnd();/*}*/
    },
    
    getEl: function(){
        //TODO: functio0n needs help
        return this.el;
    },
    
    show: function(){
        //TODO: this control needs help
        this.el.show();
    },
    
    hide: function(){
        //TODO: this control needs help
        this.el.hide();
    },
    
    setPosition: Ext.emptyFn,
    
    addManualButton: function(id,cls,txt,pos){
        var abutt = Ext.get(this.bodyId).createChild({
	    id:id,
            cls:cls
	});
        if(!Ext.isEmpty(txt) && Ext.type(txt)=='string'){
            abutt.update(txt);
        }
        this.manButtons[pos] = abutt;
        this.addButton(abutt, pos);
        return abutt;
    },
    
    setButtonMargin : function(pos, ar){
	if(Ext.isArray(ar)){
	    this.buttonMargins[pos] = ar;
	}
    },
    
    setButtonMarginTop : function(pos, num){
	if(!Ext.isArray(this.buttonMargins[pos])){
	    this.buttonMargins[pos] = [];
	}
	this.buttonMargins[pos]['t'] = Ext.num(num, 0);
    },
    
    setButtonMarginLeft : function(pos, num){
	if(!Ext.isArray(this.buttonMargins[pos])){
	    this.buttonMargins[pos] = [];
	}
	this.buttonMargins[pos]['l'] = Ext.num(num, 0);
    }
};

Ext.extend(twexter.top_tool_bar, Ext.util.Observable, twexter.top_tool_bar.prototype);