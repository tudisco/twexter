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

Ext.namespace("twexter", "twexter.out");

twexter.out = function(config){
	twexter.out.superclass.constructor.call(this);
	var nconfig = config || {};
	Ext.apply(this, nconfig);
	this.addEvents({
		"text_change" : true
	});
};

twexter.out.prototype = {
	el: null,
	id: 'twext_out',
	bodyId: MAIN_BODY,
	className: 'twext_out',
	tpl: '<div id="{oid}" class="{oclass}"></div>',
	chunkClass: 'chunk',
	paraClass: 'para-break',
	tpl_metrics: '<div class="{chunkClass}"><div id="metrics_text" class="text" style="display:none">&nbsp;</div></div>',
	
	init: function(){
		/*{*/console.info("loading output");/*}*/
		var tpl = new Ext.Template(this.tpl);
		tpl.append(this.bodyId, {oid:this.id,oclass:this.className});
		this.el = Ext.get(this.id);
		
		//disableSelection(this.el.dom);
		
		this.init_text_metrics();
		this.calculateFontSpace();
		
		this.init_context_menu();
	},
	
	init_text_metrics: function(){
		//TODO: make more dynamic
		var tpl = new Ext.Template(this.tpl_metrics);
		tpl.append(this.bodyId, {chunkClass:this.chunkClass});
	},
	
	init_context_menu: function(){
		this.contextMenu = new twexter.out_contextmenu({output:this});
		this.contextMenu.init();
	},
	
	/**
	 * Calulate the FONT space char and set chunk padding to the same space so spacing looks correct
	 */
	calculateFontSpace: function(){
		var m = Ext.util.TextMetrics.createInstance('metrics_text');
		var w = m.getWidth('&nbsp;');
		/*{*/console.info("Text Space Width: %s",w);/*}*/
		Ext.util.CSS.updateRule('.'+this.chunkClass, 'padding-right', w+'px');
	},
	
	getEl: function(){
		return this.el;
	},
	
	setPosition: function(pos){
		if(Ext.isArray(pos)){
			this.el.setX(Ext.num(pos[0],0));
			this.el.setY(Ext.num(pos[1],0));
		}
	},
	
	setWidth: function(width){
		if(Ext.num(width, 0)!==0){
			this.el.setWidth(width);
		}
	},
	
	setHeight: function(height){
		if(Ext.num(height, 0)!==0){
			this.el.setHeight(height);
		}
	},
	
	/*setTop: function(top){
		Ext.util.CSS.updateRule('.'+this.className, 'top', top,+'px');
	},
	
	setLeft: function(left){
		Ext.util.CSS.updateRule('.'+this.className, 'left', left,+'px');
	},
	
	setRight: function(right){
		Ext.util.CSS.updateRule('.'+this.className, 'right', right,+'px');
	},
	
	setBottom: function(bottom){
		Ext.util.CSS.updateRule('.'+this.className, 'bottom', bottom,+'px');
	},*/
	
	update: function(html){
		this.lastHtml = html;
		this.el.update(html);
	},
	
	getLineSpace: function(){
		var c = Ext.util.CSS.getRule('.'+this.chunkClass);
		if(c && c.style){	
			return c.style.height.replace('px','');
		}else{
			return '7';
		}
	},
	
	setLineSpace: function(lineSpace){
		var lh = Ext.num(parseInt(lineSpace,10), 0);
		if(lh>0){
			Ext.util.CSS.updateRule('.'+this.chunkClass, 'height', lh+'px');
		}
	},
	
	getParaBreakHeight: function(){
		var p = Ext.util.CSS.getRule('.'+this.paraClass);
		return p.style.height.replace('px','');
	},
	
	setParaBreakHeight: function(height){
		var h = Ext.num(parseInt(height,10), 0);
		if(h>0){
			Ext.util.CSS.updateRule('.'+this.paraClass, 'height', h);
		}
	},
	
	getChunkTextInfo: function(){
		
		var ct = Ext.util.CSS.getRule('.'+this.chunkClass+' .text');
		var i = {};
		i.font = ct.style.fontFamily;
		i.size = ct.style.fontSize.replace('px','');
		i.color = ct.style.color;
		i.weight = ct.style.fontWeight;
		i.transform = ct.style.textTransform;
		i.align = ct.style.textAlign;
		return i;
		
	},
	
	getChunkTwxtInfo: function(){
		var ct = Ext.util.CSS.getRule('.'+this.chunkClass+' .twext');
		var i = {};
		i.font = ct.style.fontFamily;
		i.size = ct.style.fontSize.replace('px','');
		i.color = ct.style.color;
		i.weight = ct.style.fontWeight;
		i.space = ct.style.marginTop.replace('px','');
		i.transform = ct.style.textTransform;
		i.align = ct.style.textAlign;
		return i;
	},
	
	setChunkStyle: function(type, obj){
		var tmp = '';
		if(Ext.type(obj) != 'object'){ return false; }
		if(type == 'twxt'){
			type = 'twext';
		}
		if(type != 'text' && type != 'twext'){ return false; }
		
		var CSS = Ext.util.CSS;
		var select = '.'+this.chunkClass+' .'+type;
		
		if(obj.font){
			CSS.updateRule(select, 'font-family', obj.font);
		}
		if(obj.size){
			if(obj && Ext.type(obj.size) == 'string'){
				tmp = obj.size.replace('px', '');
			}else{
				tmp = obj.size;
			}
			CSS.updateRule(select, 'font-size', tmp+'px');
		}
		if(obj.color){
			CSS.updateRule(select, 'color', obj.color);
		}
		if(obj.weight){
			if(obj && Ext.type(obj.weight) == 'string'){
				if(obj.weight != 'normal' && obj.weight != 'bold'){
					/*{*/console.log("!!! obj.weight = "+obj.weight);/*}*/
					tmp = 'normal';
				}else{
					tmp = obj.weight;
				}
			}else{
				tmp = 'normal';
			}
			CSS.updateRule(select, 'font-weight', tmp);
		}
		if(obj.space && type == 'twext'){
			if(obj && Ext.type(obj.space) == 'string'){
				tmp = obj.space.replace('px', '');
			}else{
				tmp = obj.space;
			}
			CSS.updateRule(select, 'margin-top', obj.space+'px');
		}
		if(obj.space && type == 'text'){
			this.setLineSpace(obj.space);
		}
		if(obj.transform){
			CSS.updateRule(select, 'text-transform', obj.transform);
		}
		if(obj.align){
			CSS.updateRule(select, 'text-align', obj.align);
		}
		
		this.calculateFontSpace();
		if(this.lastHtml){ this.update(this.lastHtml); }
		return true;
	},
	
	setVisible: function(v){
		if(v){
			this.el.show();
		}else{
			this.el.hide();
		}
	},
	
	hide: function(){
		this.setVisible(false);
	},
	
	show: function(){
		this.setVisible(true);
	},
	
	autoscroll: function(percent){
		if(this.el.isScrollable()){
			var sh = this.el.dom.scrollHeight;
			var h = this.el.getHeight();
			var s = sh-h;
			var px = Math.round((s*percent)/100);
			this.el.scrollTo('top', px);
		}
	}
};

Ext.extend(twexter.out,  Ext.util.Observable, twexter.out.prototype);