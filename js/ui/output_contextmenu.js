Ext.namespace("twexter", "twexter.out_contextmenu");

twexter.out_contextmenu = function(config){
    twexter.out_contextmenu.superclass.constructor.call(this);
    this.id = 'out_content_menu';
    this.cls = this.id;
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
        "show_menu" : true,
        "hide_menu" : true
    });
};

twexter.out_contextmenu.prototype = {
    
    menuData: [
        ["Document URL", "urlcopy"],
        ["Document ID", "idcopy"],
        ["<hr>", 'none'],
        ["Print", "print"],
        ["History", "history"]
    ],
    
    store: null,
    
    output: null,
    
    init: function(){
        twexter.out_contextmenu.superclass.init.call(this);
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
            '<tpl for=".">',
                '<div class="oc-menu-item">{label}</div>',
            '</tpl>',
            '<div style="clear:both"></div>'
        );
        
        this.dataview = new Ext.DataView({
            applyTo: this.el,
            store: this.store,
            tpl: tpl,
            autoHeight:true,
            multiSelect: true,
            overClass:'oc-menu-item-over',
            itemSelector:'div.oc-menu-item',
            emptyText: 'No menu items to display'
        });
        
        this.dataview.on('click', this.onMenuClick, this);
        
        if(this.output!==null){
            /*{*/console.debug("Adding event to output");/*}*/
            //this.output.on('contextmenu', this.onContextMenu);
            Ext.getBody().on('contextmenu', this.onContextMenu, this);
        }/*{*/else{
            console.debug("Outbut does not exist");
        }/*}*/
    },
    
    onContextMenu: function(e){
        
        if(e.within(this.output.getEl())){
            e.stopEvent();
            this.show();
            this.el.setX(e.xy[0]);
            this.el.setY(e.xy[1]);
            this.fireEvent("show_menu", this);
        }else{
            this.hide();
            this.fireEvent("hide_menu", false);
        }
        
    },
    
    parseURL: function(urls, query) {
        var url=urls || window.location.href,
                rx=/^((?:ht|f|nn)tps?)\:\/\/(?:([^\:\@]*)(?:\:([^\@]*))?\@)?([^\/]*)([^\?\#]*)(?:\?([^\#]*))?(?:\#(.*))?$/,
                rg=[null,'scheme','user','pass','host','path','query','fragment'],
                r=url.match(rx),i,q,ret={};
        if (r==null) return ret;
        for (i=1; i<rg.length; i++) 
                if (r[i]!=undefined)
                        ret[rg[i]]=r[i];        
        if (ret.path=='') ret.path='/';
        if (query!=undefined && r[6]!=undefined) {
                var q=r[6];
                ret.query={};
                q=q.split('&');
                for (var i=0; i<q.length; i++) {
                        q[i]=q[i].split('=',2);
                        ret.query[unescape(q[i][0])]=unescape(q[i][1]);
                }
        }
        return ret;
    },
    
    onMenuClick: function(dv, indx, node, e){
        var d = this.store.getAt(indx);
        if(d && d.get('action')=='urlcopy'){
            var url = this.parseURL();
            var returl = 'http://'+url.host+'/open/'+SIMPLE.doc_sha1;
            var clip = new twexter.utils.clipBoard(returl, this.output.el);
        }else if(d && d.get('action')=='idcopy'){
            var clip = new twexter.utils.clipBoard(SIMPLE.doc_sha1, this.output.el);
        }else if(d && d.get('action')=='history'){
            var hist = new twexter.historylist({
                output: this.output.el,
                removeOnHide: true
            });
            hist.init();
            hist.load_with_sha1(SIMPLE.doc_sha1);
        }else{
            alert("Comming Soon!");
        }
        this.hide();
    }
    
};

Ext.extend(twexter.out_contextmenu, twexter.ui.popup, twexter.out_contextmenu.prototype);