
Ext.namesspace("twexter", "twexter.uiviews");

twexter.uiviews = function(config){
    twexter.uiviews.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this,n);
    this.addEvents({
	"beforeViewChange" : true,
        "ViewChange" : true
    });
}

twexter.uiviews.prototype = {
    
    views: null,
    bodyId: MAIN_BODY,
    ctrls: {},
    currentView: null,
    resizeTask: false,
    
    init: function(){
        Ext.EventManager.onWindowResize(this.onResize, this);
    },
    
    addCtrl: function(name, ctrl){
        if(Ext.type(name) == 'string' && Ext.type(ctrl) == 'object'){
            if(ctrl.setPosition && ctrl.hide && ctrl.show){
                this.ctrls[name] = ctrl;
            }else{
                throw "Control is missing the necesary functions"
            }
        }else{
            throw "Name is not a string";
        }
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
        this.currentView = view;
    },
    
    onResize: function(){
        if(!this.resizeTask){
	    this.resizeTask = new Ext.util.DelayedTask(this.onResizeDelayed, this);
	    this.resizeBuffer = 60;
	}
	this.resizeTask.delay(this.resizeBuffer);
    },
    
    onResizeDelayed: function(){
        this.positionControls();
    },
    
    doResize: function(){
        this.onResizeDelayed();
    },
    
    positionControls: function(){
        /*{*/console.debug("Going to position controls");/*}*/
        var view_name = this.currentView;
        var view = this.views[view_name];
        var gview = this.views.always;
        var toolbar2space = false;
        
        if(Ext.type(view)!='object' || Ext.type(gview)!='object'){
            throw "General View or View is not an object";
        }
        
        var vs = (Ext.type(this.views['settings'])=='object') ? this.views['settings'] : false;
        
        if(vs !== false){
            if(vs['topbar2space']===false){
                toolbar2space = false;
            }else{
                toolbar2space = true;
            }
        }
        
        for (var v in view){
            if(Ext.type(this.ctrls[v])=='object'){
                var ctrl = this.ctrls[v]
                var vs = view[v];
                var vs_type = Ext.type(vs);
                if(vs_type=='string'){
                    
                }else if(vs_type=='object'){
                    
                }else if(vs_type=='array'){
                    
                }
            }
        }
        
    },
    
    posCtrlString: function(ctrl, str){
        
    },
    
    posCtrlObject: function(ctrl, obj){
        
    },
    
    posCtrlArray: function(ctrl, arr){
        
    },
    
    getPositionOf: function(ctrl){
        //Return the position of a control.
    }
    
}

Ext.extend(twexter.uiviews, Ext.util.Observable, twexter.uiviews.prototype);