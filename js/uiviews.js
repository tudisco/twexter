
Ext.namespace("twexter", "twexter.uiviews");

twexter.uiviews = function(config){
    twexter.uiviews.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this,n);
    this.addEvents({
	"beforeViewChange" : true,
        "ViewChange" : true
    });
    this.init();
}

twexter.uiviews.prototype = {
    
    views: null,
    bodyId: MAIN_BODY,
    ctrls: {},
    currentView: null,
    resizeTask: false,
    margins: {},
    currentlyWorking: false,
    
    init: function(){
        Ext.EventManager.onWindowResize(this.onResize, this);
    },
    
    addCtrl: function(name, ctrl){
        if(Ext.type(name) == 'string' && Ext.type(ctrl) == 'object'){
            if(ctrl.setPosition && ctrl.hide && ctrl.show && ctrl.getEl){
                this.ctrls[name] = ctrl;
                this.margins[name] = null;
            }else{
                throw "Control is missing the necesary functions"
            }
        }else{
            throw "Name is not a string";
        }
    },
    
    addCtrlMargin: function(name, side, amount){
        if(Ext.type(this.margins[name])!='object'){
            this.margins[name] = {};
        }
        if(side != 'l' && side != 'r' && side != 't' && side != 'b'){
            throw "Unknown side";
        }
        
        this.margins[name][side] = amount;
    },
    
    removeCtrl: function(ctrl){
        if(Ext.type(ctrl) == 'string'){
            this.ctrls[ctrl] = null;
        }else if(Ext.type(ctrl) == 'object'){
            for(i in this.ctrls){
                if(Ext.type(this.ctrls[i]) == 'object'){
                    if(this.ctrls[i]==ctrl){
                        this.ctrls[i] = null;
                    }
                }
            }
        }
    },
    
    setView: function(view){
        /*{*/console.info("Setting view to "+view);/*}*/
        if(view == null || this.currentView==view) return false;
        if(view != 'finder') Ext.History.add('uiview:'+view);
        this.currentView = view;
	return true;
    },
    
    onResize: function(){
        if(!this.resizeTask){
	    this.resizeTask = new Ext.util.DelayedTask(this.onResizeDelayed, this);
	    this.resizeBuffer = 60;
	}
	this.resizeTask.delay(this.resizeBuffer);
    },
    
    onResizeDelayed: function(){
        /*{*/console.time("PositionTime")/*}*/
        this.positionControls();
        /*{*/console.timeEnd("PositionTime");/*}*/
    },
    
    doResize: function(){
        this.onResizeDelayed();
    },
    
    positionControls: function(){
	if(this.currentlyWorking) return;
	this.currentlyWorking = true;
	
        /*{*/console.debug("Going to position controls");/*}*/
        var view_name = this.currentView;
        var view = this.views[view_name];
        var gview = this.views.always;
        
        if(Ext.type(view)!='object' || Ext.type(gview)!='object'){
            /*{*/
                console.trace();
                console.log("The View is: "+this.currentView);
                console.log("View:");
                console.dir(view);
                console.log("GView:");
                console.dir(gview);
            /*}*/
            throw "General View or View is not an object";
        }
        
        var vs = (Ext.type(view['settings'])=='object') ? view['settings'] : false;
        
        if(vs !== false){
            if(vs['topbar2space']===false){
                this.toolbar2space = false;
            }else{
                this.toolbar2space = true;
            }
            this.bottomMargin = Ext.num(vs['bottom_margin'],10);
        }else{
            this.bottomMargin = 10;
        }
        
        Ext.applyIf(view, gview);
        
        /*{*/console.dir(view);/*}*/
        
        for (var v in view){
            if(Ext.type(this.ctrls[v])=='object'){
                this.currentControlName = v;
                /*{*/console.group("Positioning "+v);/*}*/
                var ctrl = this.ctrls[v]
                var vs = view[v];
                var vs_type = Ext.type(vs);
                if(vs_type=='string'){
                    /*{*/console.debug('going to show control');/*}*/
                    ctrl.show();
                    this.posCtrlString(ctrl, vs);
                }else if(vs_type=='object'){
                    this.posCtrlObject(ctrl, vs);
                }else if(vs_type=='array'){
                    
                }
                /*{*/console.groupEnd();/*}*/
            }
        }
        this.currentControlName = '';
	
	this.currentlyWorking = false;
        
    },
    
    posCtrlString: function(ctrl, str){
        /*{*/console.assert(Ext.type(str)=='string', "Type is not a string.");/*}*/
        var el = ctrl.getEl();
        var m = {},x=0;
        
        /*{*/console.group("Postion ctrl with string");/*}*/
        
        if(Ext.type(this.margins[this.currentControlName])=='object'){
            m = this.margins[this.currentControlName];
        }
        
        if(str.indexOf('t')!=-1){
            /*{*/console.debug("Setting Top to 0");/*}*/
            x = (m.t) ? m.t : 0; 
            ctrl.setTop ? ctrl.setTop(x) : el.setTop(x);
        }
        
        if(str.indexOf('r')!=-1){
            /*{*/console.debug("Setting Right to 0");/*}*/
            x = (m.r) ? m.r : 0; 
            ctrl.setRight ? ctrl.setRight(x) : el.setRight(x);
        }
        
        if(str.indexOf('l')!=-1){
            /*{*/console.debug("Setting Left to 0");/*}*/
            x = (m.l) ? m.l : 0; 
            ctrl.setLeft ? ctrl.setLeft(x) : el.setLeft(x);
        }
        
        if(str.indexOf('b')!=-1){
            /*{*/console.debug("Setting Bottom to 0");/*}*/
            x = (m.b) ? m.b : 0;
            ctrl.setBottom ? ctrl.setBottom(x) : el.setBottom(x);
        }
        
        /*{*/console.groupEnd();/*}*/
    },
    
    posCtrlObject: function(ctrl, obj){
        /*{*/console.group("Postion ctrl with object");/*}*/
        
        //first check is visible
        if(obj.visible!=undefined){
            if(obj.visible===true){
                /*{*/console.debug("Going to show control");/*}*/
                ctrl.show();
            }else{
                /*{*/console.debug("Going to hide control");/*}*/
                ctrl.hide();
            }
        }
        
        var bwidth = Ext.getBody().getWidth();
        var el = ctrl.getEl();
        if(obj.dock){
            if(obj.dock == 'c'){
                if(this.toolbar2space===true){
                    /*{*/console.debug("Making room for 2nd tool bar");/*}*/
                    ctrl.setTop ? ctrl.setTop(OUT_POS_TOP) : el.setTop(OUT_POS_TOP);
                }else{
                    /*{*/console.debug("No second tool bar");/*}*/
                    ctrl.setTop ? ctrl.setTop(OUT_POS_TOP_FULL) : el.setTop(OUT_POS_TOP_FULL);
                }
                
                if(!obj.part) obj.part='all';
                if(obj.part == 'all'){
                    /*{*/console.debug("Docking to client full");/*}*/
                    ctrl.setLeft ? ctrl.setLeft(COL_LEFT_SIZE) : el.setLeft(COL_LEFT_SIZE);
                    ctrl.setRight ? ctrl.setRight(OUT_POS_MARGIN) : el.setRight(OUT_POS_MARGIN);
                }else if(obj.part=='r'){
                    /*{*/console.debug("Docking to client right");/*}*/
                    var left = ((bwidth-COL_LEFT_SIZE)/2)+COL_LEFT_SIZE;
                    ctrl.setLeft ? ctrl.setLeft(left) : el.setLeft(left);
		    ctrl.setRight ? ctrl.setRight(OUT_POS_MARGIN) : el.setRight(OUT_POS_MARGIN);
                }else if(obj.part=='l'){
                    /*{*/console.debug("Docking to client left");/*}*/
                    right = ((bwidth-COL_LEFT_SIZE)/2)+10;
		    ctrl.setRight ? ctrl.setRight(right) : el.setRight(right);
		    ctrl.setLeft ? ctrl.setLeft(COL_LEFT_SIZE) : el.setLeft(COL_LEFT_SIZE);
                    /*{*/console.debug("setting right "+right+" and left "+COL_LEFT_SIZE);/*}*/
                }
                
                ctrl.setBottom ? ctrl.setBottom(this.bottomMargin) : el.setBottom(this.bottomMargin);
                /*{*/console.debug("set bottom to: "+this.bottomMargin);/*}*/
                
            }else if(obj.dock == 'tr2'){
                /*{*/console.debug("Docking to menu bar 2");/*}*/
                ctrl.setTop ? ctrl.setTop(OUT_POS_TOP_FULL) : el.setTop(OUT_POS_TOP_FULL);
                if(!obj.align) obj.align = 'l';
                if(obj.align=='l'){
                    /*{*/console.debug("Aligning Left");/*}*/
                    ctrl.setLeft ? ctrl.setLeft(COL_LEFT_SIZE) :  el.setLeft(COL_LEFT_SIZE);
                }else if(obj.align == 'r'){
                    /*{*/console.debug("Aligning Right");/*}*/
                    ctrl.setRight ? ctrl.setRight(10) : el.setRight(10);
                }
            }else if(obj.dock == 'tr'){
                if(Ext.type(this.margins[this.currentControlName])=='object'){
                    var x, m;
                    m = this.margins[this.currentControlName];
                    x = (m.t) ? m.t : 0; 
                    ctrl.setTop ? ctrl.setTop(x) : el.setTop(x);
                    x = (m.r) ? m.r : 0; 
                    ctrl.setRight ? ctrl.setRight(x) : el.setRight(x);
                }else{
                    if(el){
                        ctrl.setTop ? ctrl.setTop(0) : el.setTop(0);
                        ctrl.setRight ? ctrl.setRight(0) : el.setRight(0);
                    }
                }
            }else if(obj.dock == 'bl'){
                if(Ext.type(this.margins[this.currentControlName])=='object'){
                    var b,m;
                    m = this.margins[this.currentControlName];
                    x = (m.b) ? m.b : 0;
                    ctrl.setBottom ? ctrl.setBottom(x) : el.setBottom(x);
                    x = (m.l) ? m.l : 0;
                    ctrl.setLeft ? ctrl.setLeft(x) : el.setLeft(x);
                }else{
                    /*{*/console.debug("Setting Bottom and left to 0");/*}*/
                    ctrl.setBottom ? ctrl.setBottom(0) : el.setBottom(0);
                    ctrl.setLeft ? ctrl.setLeft(0) : el.setLeft(0);
                }
            }
        }
        
        if(obj.callafter){
            if(Ext.type(obj.callafter)=='string'){
                if(Ext.type(ctrl[obj.callafter])=='function'){
                    /*{*/console.debug("Going to call method "+obj.callafter);/*}*/
                    try{
                        ctrl[obj.callafter].call(ctrl);
                    }catch(e){
                       /*{*/console.error("Function could not be called");/*}*/
                    }
                    
                }
            }
        }
    
        /*{*/console.groupEnd();/*}*/
    },
    
    posCtrlArray: function(ctrl, arr){
        ctrl.setPosition(arr);
    },
    
    getPositionOf: function(ctrl){
        //Return the position of a control.
    }
    
}

Ext.extend(twexter.uiviews, Ext.util.Observable, twexter.uiviews.prototype);