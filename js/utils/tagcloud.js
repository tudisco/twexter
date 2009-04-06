Ext.ns('twexter.util');

twexter.util.tagCloud = function(config){
    this.id = 'out_taglist';
    this.cls = this.id;
    this.centerScreen = true;
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
        'select_tag':true
    });
}

twexter.util.tagCloud.prototype = {
    
    minFontSize: 8,
    maxFontSize: 18,
    minBold: 100,
    maxBold: 800,
    
    tpl: null,
    
    store: new Ext.data.JsonStore({
        url: "/rpc/taglist.php",
        root: 'data',
        fields: [
            'id', 'tag','tcount'
        ]
    }),
    
    init: function(){
        twexter.util.tagCloud.superclass.init.call(this);
        this.init2();
    },
    
    init2: function(){
        this.store.on('load', this.onTagsLoad, this);
        
        this.tpl = new Ext.XTemplate (
            '<div class="taglist">',
                '<ul>',
                    '<tpl for=".">',
                        '<li><span id="atag-{id}" class="atag f{fontsize}">{tag}</span></li>',
                    '</tpl>',
                '</ul>',
            '</div>'
        );
        
        this.store.load();
    },
    
    onTagsLoad: function(store, recs, op){
        
        var maxCount = 1;
        var minCount = 1;
        var data = [];
        
        Ext.each(recs, function(r){
            var tc = parseInt(r.get('tcount'));
            console.log(tc);
            maxCount = Math.max(maxCount, tc);
            minCount = Math.min(minCount, tc);
        }, this);
        
        var range = 10 / (Math.log(maxCount) - Math.log(minCount));
        console.log("Range ",range," ",maxCount," ",minCount, " ", Math.log(maxCount), " ", Math.log(minCount));
        
        Ext.each(recs, function(r){
            //var fs = ((this.maxFontSize-this.minFontSize)*(r.get('tcount')*100/maxCount)/100)+this.minFontSize;
            var fs = parseInt((Math.log(r.get('tcount')) - Math.log(minCount)) * range);
            fs = fs + this.minFontSize;
            data.push({id:r.get('id'),tag:r.get('tag'),tcount:r.get('tcount'),fontsize:fs});
        }, this);
        
        /*{*/console.dir(data);/*}*/
        
        this.el.update('');
        this.tpl.append(this.el,data);
        
        var els = this.el.select("span.atag");
        els.on('click', this.onTagClick, this);
    
    },
    
    onTagClick: function(e){
        var el = e.getTarget();
        try{
            el = Ext.get(el);
            var tid = el.dom.id;
            tid = tid.split('-');
            if(tid.length==2){
                SIMPLE.xbutton.setButtonState('r', 1);
                SIMPLE.finddlg.searchfield.dom.value = "tagid:"+tid[1];
                SIMPLE.finddlg.onSearchChange();
            }
        }finally{
            this.hide();
        }
        
    }
    
};

Ext.extend(twexter.util.tagCloud, twexter.ui.popup, twexter.util.tagCloud.prototype);