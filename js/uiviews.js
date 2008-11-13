
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
    
    
    
}

Ext.extend(twexter.uiviews, Ext.util.Observable, twexter.uiviews.prototype);