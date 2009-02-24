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

Ext.namespace("twexter", "twexter.sidebar");

twexter.sidebar = function(config){
	twexter.sidebar.superclass.constructor.call(this);
	var nconfig = config || {};
	Ext.apply(this, nconfig);
	this.addEvents({
		"comment_click" : true
	});
};


twexter.sidebar.prototype = {
    
    el: null,
    id: 'sidebar',
    bodyId: MAIN_BODY,
    tpl: null,
    
    init: function(){
        if(this.tpl==null){
            this.tpl = new Ext.Template(
                '<div id="{sid}" class="{sid}">',
                        '<div class="fkeys">',
                                '<div class="frow"><span class="fkey">f1</span>switch</div>',
                                '<div class="frow"><span class="fkey">f2</span>edit</div>',
				'<div class="frow"><span class="fkey">f3</span>e-preview</div>',
                                '<div class="frow"><span class="fkey">f4</span>translate</div>',
                                '<div class="frow"><span class="fkey">f6</span>view</div>',
                                //'<div class="frow"><span class="fkey">f7</span>edit</div>',
                                '<div class="frow"><span class="fkey">f8</span>full Edit</div>',
                                '<div class="frow"><span class="fkey">f9</span>finder</div>',
                                '<div class="frow"><span class="fkey">f10</span>comment</div>',
                                //'<div class="frow"><span class="fkey">f12</span>Translate</div>',
                        '</div>', 
                        '<div id="{sid}_comment_button" class="comment_button"></div>',
                '</div>'  
            );
        }
        
        this.tpl.append(this.bodyId, {
            sid:this.id 
        });
        
        this.el = Ext.get(this.id);
        this.el_comment_butt = Ext.get(this.id+'_comment_button');
        
        this.init_events();
    },
    
    init_events: function(){
        this.el_comment_butt.on('click', function(){
            this.fireEvent('comment_click', this);
        }, this);
    },
    
    getEl: function(){
        return this.el;
    },
    
    show: function(){
        this.el.show();
    },
    
    hide: function(){
        this.el.hide();
    },
    
    setPosition: Ext.emptyFn
    
}

Ext.extend(twexter.sidebar, Ext.util.Observable, twexter.sidebar.prototype);


