Ext.namespace('twexter.historylist');


twexter.historylist = function(config){
    this.id = 'out_history_list';
    this.cls = this.id;
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
        "show_list" : true,
        "hide_list" : true
    });
};

twexter.historylist.prototype = {
    
    store: new Ext.data.JsonStore({
        url: "/rpc/historylist.php",
        root: 'data',
        fields: [
            'id','sha1','parent_id','parent_sha1','user_id','user','title','description','created_on','global','version','chunk_style' 
        ]
    }),
    
    tpl: null,
    
    output: null,
    
    init: function(){
        twexter.historylist.superclass.init.call(this);
        this.init2();
    },
    
    init2: function(){
        
        if(true){
            this.tpl = new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="hl-menu-item">{title} - {user} - {created_on}</div>',
                '</tpl>',
                '<div style="clear:both"></div>'
            );
        }
        
        this.dataview = new Ext.DataView({
            applyTo: this.el,
            store: this.store,
            tpl: this.tpl,
            autoHeight:true,
            multiSelect: false,
            overClass:'hl-menu-item-over',
            itemSelector:'div.hl-menu-item',
            emptyText: 'No menu history to display',
            loadingText: 'Loading...'
        });
        
        this.dataview.on('click', this.onMenuClick, this);
        
    },
    
    load_with_sha1: function(sha1){
        this.store.load({params:{docsha1:sha1}});
        this.el.setHeight(210);
        this.show();
        this.el.center(this.output);
    },
    
    onMenuClick: function(dv, indx, node, e){
        var d = this.store.getAt(indx);
        var docid = d.get('id');
        /*{*/console.debug("The doc id is: "+docid);/*}*/
        SIMPLE.onLoadDocument(docid);
        this.collapse();
        
    }
    
};

Ext.extend(twexter.historylist, twexter.ui.popup, twexter.historylist.prototype);

