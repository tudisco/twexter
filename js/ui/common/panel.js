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

Ext.namespace("twexter.ui.panel");

twexter.ui.panel = function(config){
    twexter.ui.panel.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
};

twexter.ui.panel.prototype = {
    el:null,
    id:'panel',
    bodyId: MAIN_BODY,
    className: 'panel',
    tpl: '<div id="{pid}" class="{pclass}"></div>',
    
    init: function(){
        var tpl = new Ext.Template(this.tpl);
        tpl.append(this.bodyId, {pid:this.id,pclass:this.className});
        this.el = Ext.get(this.id);
    },
    
    getEl: function(){
        return this.el;
    },
    
    update: function(html){
        this.el.update(html);  
    },
    
    show: function(){
        this.el.show();   
    },
    
    hide: function(){
        this.el.hide();
    },
    
    setPosition: Ext.emptyFn
};

Ext.extend(twexter.ui.panel,  Ext.util.Observable, twexter.ui.panel.prototype);