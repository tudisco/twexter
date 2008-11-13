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

Ext.namespace('twexter', 'twexter.login_button');

/**
 * Login Button Control
 */
twexter.login_button = function(config){
    twexter.login_button.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"click" : true
    });
};

twexter.login_button.prototype = {
    
    el:null,
    id: 'ident_button',
    tpl:'<div id="{id}" class="{id}"></div>',
    bodyId: MAIN_BODY,
    
    /** Init Control */
    init: function(){
        var tp = new Ext.Template(this.tpl);
        tp.append(this.bodyId, {
            id:this.id
        });
        
        this.el = Ext.get(this.id);
        this.init_events();
    },
    
    /** Init Control Events */
    init_events: function(){
        this.el.on('click', this.onClick, this);
    },
    
    /** Set Control Position */
    setPos: function(pos){
        if(Ext.isArray(pos)){
            this.el.setX(pos[0]);
            this.el.setY(pos[1]);
        }
        else if(pos == 'tr'){
            bwidth = Ext.get(this.bodyId).getWidth();
            myWidth = this.el.getWidth();
            var x = bwidth - myWidth - 10;
            this.el.setX(x);
            this.el.setY(0);
        }
    },
    
    /** On COntrol Click */
    onClick: function(){
        this.fireEvent('click', this);
    },
    
    /** Hide this control */
    hide: function(){
        this.el.hide();
    },
    
    /** Show this control */
    show: function(){
        this.el.show();
    },
    
    getEl: function(){
        return this.el;
    }
    
};

Ext.extend(twexter.login_button, Ext.util.Observable, twexter.login_button.prototype);