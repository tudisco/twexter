
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
    
    init: function(){
        
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
        
    },
    
    onResizeDelayed: function(){
        
    },
    
    doResize: function(){
        this.onResizeDelayed();
    },
    
    positionControls: function(){
        /*{*/console.debug("Going to position controls");/*}*/
        var view_name = this.currentView;
        var view = this.views[view_name];
        var gview = this.views.always;
        
        if(Ext.type(view)!='object' || Ext.type(gview)!='object'){
            throw "General View or View is not an object";
        }
        
        
    }
    
}

Ext.extend(twexter.uiviews, Ext.util.Observable, twexter.uiviews.prototype);