Ext.namespace("twexter", "twexter.translation_selection");

twexter.translation_selection = function(config){
    twexter.out_contextmenu.superclass.constructor.call(this);
    this.id = 'translation_selection_menu';
    this.cls = this.id;
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
        "childoc_type" : true
    });
};

twexter.translation_selection.prototype = {
    
    menuData: [
        ["Text", "text-source"],
        ["Chunked", "text-chunked"],
        ["Twext", 'twxt-source']
        //["Twext Chunked", "twxt-chunked"]
    ],
    
    store: null,
    
    init: function(){
        twexter.translation_selection.superclass.init.call(this);
        this.init2();
    },
    
    init2: function(){
        this.store = new Ext.data.SimpleStore({
            fields: [
                {name: 'label'},
                {name: 'action'}
            ]
        });
        this.store.loadData(this.menuData);
        
        var tpl = new Ext.XTemplate(
            '<div class="title">Translate</div>',
            '<div class="list">',
                '<tpl for=".">',
                    '<div class="st-item">{label}</div>',
                '</tpl>',
            '</div>',
            '<div style="clear:both"></div>'
        );
        
        this.dataview = new Ext.DataView({
            applyTo: this.el,
            store: this.store,
            tpl: tpl,
            autoHeight:true,
            multiSelect: true,
            overClass:'st-item-over',
            itemSelector:'div.st-item',
            emptyText: 'No items to display'
        });
        
        this.dataview.on('click', this.onMenuClick, this);
    },
    
    onMenuClick: function(dv, indx, node, e){
        var d = this.store.getAt(indx);
        var s = d.get('action');
        if(Ext.type(s) != 'string') return;
        var o = s.split('-');
        /*{*/console.debug("Fireing Selection Event");/*}*/
        this.fireEvent('childoc_type', o[0], o[1]);
        
        this.hide();
    }
    
};

Ext.extend(twexter.translation_selection, twexter.ui.popup, twexter.translation_selection.prototype);