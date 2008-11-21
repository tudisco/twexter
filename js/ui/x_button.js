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

Ext.namespace('twexter', 'twexter.xbutton');

/**
* XNav Button Control Class
*/
twexter.xbutton = function(config){
	twexter.xbutton.superclass.constructor.call(this);
	var nconfig = config || {};
	Ext.apply(this, nconfig);
	this.addEvents({
        "click_top" : true,
        "click_bottom" : true,
        "click_right" : true,
        "click_left" : true,
        "click" : true,
        "selected_none": true,
        "selected_top": true,
        "selected_bottom": true,
        "selected_left": true,
        "selected_right": true
	});
};

twexter.xbutton.prototype = {
	
	/** Selection State None */
        ST_NONE:0,
	/** Selection State Top */
        ST_TOP:1,
	/** Selection State Left */
        ST_LEFT:2,
        /** Selection State Right */
	ST_RIGHT:3,
	/** Selection State Bottom */
        ST_BOTTOM:4,
	/** Not Used - Remove */
        ST_TOP2:5,
        /** Not Used - Remove */
	ST_LEFT2:6,
        /** Not Used - Remove */
	ST_RIGHT2:7,
        /** Not Used - Remove */
	ST_BOTTOM2:8,
        /** Selection State */
	state:0,
	/** Selection Side - I don't think I used this.. Remove */
        selected_side:0,
	/** Page Body  Tag ID */
        bodyId: MAIN_BODY,
	/** ID for xbutton div tag */
        id: 'xbutton',
	/** Zindex for xbutton div tag - Should be in style sheet */
        zindex: '150',
	/** Xbutton Template */
        tpl: '<div id="{xid}" class="{xclass}"></div>',
	/** CSS Class name for none.. Hover uses _l _t _b _r extion to class name */
        classNone: 'xb_none',
	/** CSS Class name for top selection. */
        classTop: 'xb_top',
	/** CSS Class name for top selection 2 */
        classTop2: 'xb_top2',
	/** CSS Class name for bottom selection */
        classBottom: 'xb_bottom',
        /** CSS Class name for bottom selection 2*/
	classBottom2: 'xb_bottom2',
        /** CSS Class name for right selection */
	classRight: 'xb_right',
        /** CSS Class name for Right Selection 2 */
	classRight2: 'xb_right2',
        /** Css Class name for left selection */
	classLeft: 'xb_left',
        /** Css class name for left selection 2 */
	classLeft2: 'xb_left2',
        /** X position */
	xpos: 0,
        /** Y Position */
	ypos: 0,
        /** Top Click Area (Several Boxes... Array of click areas) */
	click_top: [ 
		[ [14,48],[0,7] ],[ [20,42],[7,14] ],[ [27,35],[14,20] ] 
	],
        /** Left click area **/
	click_left: [
	    [ [0,6],[6,42] ],[ [7,14],[13,34] ],[ [14,20],[20,28] ]
	],
        /** Right click area */
	click_right: [
	    [ [55,62],[6,42] ],[ [48,55],[13,35] ],[ [41,20],[49,28] ]
	],
        /** Bottom click area */
	click_bottom: [ 
		[ [28,27],[35,34] ],[ [21,42],[35,42] ],[ [13,49],[41,48] ] 
	],
        //** Array that stores if a side is active and if side 2 click is active */
	active: {t:[],l:[],r:[],b:[]},
        //** The number of click for the current selection. 1 click, first selection. 2 clicks, second selection state */
	click_count: 0,
	
	/**
         * Init control
         */
        init: function(){
		//var body = Ext.get(this.bodyId);
		/*{*/console.info("loading xbutton");/*}*/
		var tpl = new Ext.Template(this.tpl);
		tpl.append(this.bodyId, {xid:this.id,xclass:this.classNone});
		
		this.el = this.xbutton = Ext.get(this.id);
		if(this.xbutton){
			this.xbutton.on('click', this.onClick, this);
			this.xbutton.on('mousemove', this.onMouseOver, this);
			this.xbutton.on('mouseover', this.onMouseOver, this);
			this.xbutton.on('mouseout', this.onMouseOut, this);
			if(Ext.isIE){
				this.xbutton.on('dblclick', this.onClick, this);
			}
		}else{
			/*{*/console.error("xbutton not found!");/*}*/
		}
		
		//this.setPosition('tl');
	},
        
        /**
         * Get element for this control
         *
         * @returns Ext.Element
         */
        getEl: function(){
                return this.xbutton;
        },
	
        /**
         * Make a side of the X button active.
         *
         * @param string side of the x to activate or deactivate.
         * @param boolean true if you want to active and false otherwise
         * @param integer The number of selection to activate. 1 first selection. 2 second selection
         */
	setSideActive: function(side, active, click){
		var c = click || 1;
		var a = active || true;
		var s = side || 't';
		
		switch(s){
			case 't':
			case 'n':
				this.active.t[c] = true;
				break;
			case 'l':
			case 'w':
				this.active.l[c] = true;
				break;
			case 'r':
			case 'e':
				this.active.r[c] = true;
				break;
			case 'b':
			case 's':
				this.active.b[c] = true;
				break;
		}
	},
	
	/**
         * Checks if a side is active
         *
         * @param string the side you wish to check
         * @param tyhe number of clicks.. 1 first selection. 2 second selection.
         */
        isSideActive: function(side, click){
		if(this.active[side][click]===true){
			return true;
		}else{
			return false;
		}
	},
	
	/**
         * How many selection are activated for a side
         *
         * @param integer the side
         * @returns integer the number of selections activated for this side.
         */
        sideActiveCount: function(side){
		var len = this.active[side];
		
		if(len && len>0){
			var count = 0;
			if(this.active[side][1]===true){ count++;}
			if(this.active[side][2]===true){ count++;}
		}else{
			return 0;
		}
		return count;
	},
	
	/**
         * Set the position of the xnav button. if no position is given defualts to top center
         *
         * @param array [x,y]
         */
        setPosition: function(pos){
		if(!this.xbutton){ return; }
		
		if(Ext.isArray(pos)){
			this.xbutton.setX(Ext.num(pos[0],0));
			this.xbutton.setY(Ext.num(pos[1],0));
		}else if(pos == 'tl'){
                        this.xbutton.setX(XB_POS_TOP_M);
                        this.xbutton.setY(XB_POS_LEFT_M);     
                }else{
                        var body = Ext.get(this.bodyId);
                        var width = body.getWidth();
                        var x = (width/2)-(this.xbutton.getWidth()/2);
                        this.xbutton.setX(x);
                        this.xbutton.setY(0);
                }
	},
	
	/**
         * Event Handler - On Xnav Click
         */
        onClick: function(ev){
                
		/*{*/console.group("Xbutton Click");/*}*/
		var x = ev.getPageX() - this.xbutton.getX();
		var y = ev.getPageY() - this.xbutton.getY();
		/*{*/console.debug("click x:%s y:%s", x, y);/*}*/
		
		this.fireEvent('click', this);
		
		this.click_count++;
		
		if(this.click_count > 2){
			this.click_count = 0;
		}
		
		//Check Top
		if(this.onClickTest(x,y,this.click_top)){
			/*{*/console.debug("top_click");/*}*/
			if(this.state != this.ST_TOP){ this.click_count = 1;} 
			if(this.isSideActive('t', this.click_count)){
				this.state = (this.state==this.ST_TOP && this.sideActiveCount('t')>this.click_count) ? this.ST_NONE : this.ST_TOP;
			}else{
				this.state = this.ST_NONE;
			}
			this.fireEvent('click_top', this);
		}
		//check left
		else if(this.onClickTest(x,y,this.click_left)){
			/*{*/console.debug("click_left");/*}*/
			if(this.state != this.ST_LEFT){ this.click_count = 1;} 
			if(this.isSideActive('l', this.click_count)){
				this.state = (this.state==this.ST_LEFT && this.sideActiveCount('l')>this.click_count) ? this.ST_NONE : this.ST_LEFT;
			}else{
				this.state = this.ST_NONE;
			}
			this.fireEvent('click_left', this);
		}
		//Check Right
		else if(this.onClickTest(x,y,this.click_right)){
			/*{*/console.debug("click_right");/*}*/
			if(this.state != this.ST_RIGHT){ this.click_count = 1; }
			if(this.isSideActive('r', this.click_count)){
				this.state = (this.state==this.ST_RIGHT && this.sideActiveCount('r')>this.click_count) ? this.ST_NONE : this.ST_RIGHT;
			}else{
				this.state = this.ST_NONE;
			}
			this.fireEvent('click_right', this);
		}
		//Check Bottom
		else if(this.onClickTest(x,y,this.click_bottom)){
			/*{*/console.debug("click_bottom");/*}*/
			if(this.state != this.ST_BOTTOM){ this.click_count = 1; }
			if(this.isSideActive('b', this.click_count)){
				this.state = (this.state==this.ST_BOTTOM && this.sideActiveCount('b')>this.click_count) ? this.ST_NONE : this.ST_BOTTOM;
			}else{
				this.state = this.ST_NONE;
			}
			this.fireEvent('click_bottom', this);
		}
		//Click Nothing
		else{
			this.click_count = 0;
			this.state = this.ST_NONE;
		}
		
		/*{*/console.debug("The State: %s", this.state);/*}*/
		this.changeButtonClass(this.state);
		this.fireStateEvent(this.state);
                
                /*{*/console.groupEnd();/*}*/
	},
	
        /**
         * Checks to see if a click was within a region
         *
         * @param integer X position of X
         * @param integer Y position of Y
         * @param array array of regions to check
         */
	onClickTest: function(x,y,r){
		var click = r;
		var click_len = click.length;
		
		for(var i=0; i<click_len; i++){
			var test = click[i];
			if(x >= test[0][0] && x <= test[0][1]){
				if(y >= test[1][0] && y <= test[1][1]){
					return true;
				}
			}
		}
		
		return false;
	},
	
	/**
         * Clear all known class xnav div
         */
        clearClass: function(){
		// If all classes haven't been generated and saved to an array.. do that now.
                if(!this.all_classes){
			this.all_classes = [
				this.classNone,this.classNone+'_t',this.classNone+'_l',this.classNone+'_r',this.classNone+'_b',
				this.classTop, this.classTop+'_l',this.classTop+'_r',this.classTop+'_b',
				this.classTop2, this.classTop2+'_l',this.classTop2+'_r',this.classTop2+'_b',
				this.classBottom, this.classBottom+'_t', this.classBottom+'_l', this.classBottom+'_r',
				this.classBottom2, this.classBottom2+'_t', this.classBottom2+'_l', this.classBottom2+'_r',
				this.classRight, this.classRight+'_l', this.classRight+'_t', this.classRight+'_b',
				this.classRight2, this.classRight2+'_l', this.classRight2+'_t', this.classRight2+'_b',
				this.classLeft, this.classLeft+'_r', this.classLeft+'_t', this.classLeft+'_b',
				this.classLeft2, this.classLeft2+'_r', this.classLeft2+'_t', this.classLeft2+'_b'
			];
		}
                // Remove all the classes
		this.xbutton.removeClass(this.all_classes);
	},
	
	/**
         * Change the css class for the xnav button.
         *
         * @param string class name
         * @param string class extension: _t _b _r _l (hover: top, button, right, left)
         */
        changeClass: function(nclass, ext){
		var sclass;
                if(Ext.isEmpty(ext)){
			sclass = nclass;
		}else{
			sclass = nclass+''+ext;
		}
		if(this.lclass != sclass){
			//console.debug("l:%s  s:%s", this.lclass, sclass);
			this.clearClass();
			this.xbutton.addClass(sclass);
		}
		this.lclass = sclass;
	},
	
	/**
         * Change the css class for the xnav button. this function is used to filter out certain conditions. you should use this one.
         *
         * @param string class name
         * @param string class extension: _t _b _r _l (hover: top, button, right, left)
         */
        changeButtonClass: function(state, ext){
		
		var sclass = null;
		var e = ext || '';
		
		if(state == this.ST_NONE){
			this.changeClass(this.classNone, e);
		}else if(state == this.ST_TOP){
			if(e=='_t'){ e=''; }
			sclass = (this.click_count == 1) ? this.classTop : this.classTop2;
			this.changeClass(sclass, e);
		}else if(state == this.ST_LEFT){
			if(e=='_l'){ e=''; }
			sclass = (this.click_count == 1) ? this.classLeft : this.classLeft2;
			this.changeClass(sclass, e);
		}else if(state == this.ST_RIGHT){
			if(e=='_r'){ e=''; }
			sclass = (this.click_count == 1) ? this.classRight : this.classRight2;
			this.changeClass(sclass, e);
		}else if(state == this.ST_BOTTOM){
			if(e=='_b'){ e=''; }
			sclass = (this.click_count == 1) ? this.classBottom : this.classBottom2;
			this.changeClass(sclass, e);
		}
	},
	
	/**
         * Fire the event that notifies application of state (Event: 'selected_{state}', xbutton, click count, class used)
         */
        fireStateEvent: function(state){
		if(state == this.ST_NONE){
			this.fireEvent('selected_none', this, this.click_count, this.lclass);
		}else if(state == this.ST_TOP){
			this.fireEvent('selected_top', this, this.click_count, this.lclass);
		}else if(state == this.ST_LEFT){
			this.fireEvent('selected_left', this, this.click_count, this.lclass);
		}else if(state == this.ST_RIGHT){
			this.fireEvent('selected_right', this, this.click_count, this.lclass);
		}else if(state == this.ST_BOTTOM){
			this.fireEvent('selected_bottom', this, this.click_count, this.lclass);
		}
	},
	
	/**
         * On Mouse move Event to handle hovering.
         */
        onMouseOver: function(ev){
		if(Ext.isArray(ev.xy)){
			var x = ev.xy[0] - this.xbutton.getX();
			var y = ev.xy[1] - this.xbutton.getY();
			//console.log('m');
			if(this.onClickTest(x,y,this.click_top)){
				this.changeButtonClass(this.state,'_t');
			}else if(this.onClickTest(x,y,this.click_left)){
				this.changeButtonClass(this.state,'_l');
			}else if(this.onClickTest(x,y,this.click_right)){
				this.changeButtonClass(this.state,'_r');
			}else if(this.onClickTest(x,y,this.click_bottom)){
				this.changeButtonClass(this.state,'_b');
			}else{
				this.changeButtonClass(this.state);
			}
		}
	},
	
	/**
         * On Mouse out event to stop hovering.
         */
        onMouseOut: function(ev){
		this.changeButtonClass(this.state);
	},
        
        /**
         * Reset button state to none. (no selection state)
         */
        resetState: function(){
                this.state = this.ST_NONE;
                this.changeButtonClass(this.state);
		this.fireStateEvent(this.state);
        },
        
        show: function(){
                this.getEl().show();
        },
        
        hide: function(){
                this.getEl().hide();
        }
};

Ext.extend(twexter.xbutton, Ext.util.Observable, twexter.xbutton.prototype);