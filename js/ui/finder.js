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

Ext.namespace("twexter","twexter.finder");

twexter.finder = function(config){
    twexter.finder.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"hidden": true,
        "document_selected" : true
    });
};

twexter.finder.prototype = {
    el:null,
    id:'finder',
    bodyId:MAIN_BODY,
    tpl:null,
    tpl_filelist: null,
    search_chars: 2,
    imageSearchCancel: '/images/finder/dialog-cancel.png',
    imageSearch: '/images/finder/edit-find.png',
    sorting: null,
    store_params: {},
    lastHistoryIdx: 0,
    firstLoad: true,
    
    init: function(){
        if(Ext.isEmpty(this.tpl)){
            this.tpl = new Ext.Template(
		    '<div id="{id}_loader" class="{id}_loader"></div>',
                    '<div id="{id}" class="{id}">',
                        //'<div class="{id}_searchbar">',
                            //'<div id="{id}_slop" class="{id}_slop"></div>',
                            //'<div id="{id}_searchbox"><input type="text" id="{id}_field_search"></input>',
                            //    '<img id="{id}_search_cancel" class="{id}_search_cancel" src="{searchImage}" align="abscenter">',
                            //'</div>',
                            //'<div style="clear:both;"></div>',
                        //'</div>',
                        '<div class="{id}_sort">',
                            '<div id="{id}_sort_name" class="sortname sort_none"></div>',
                            '<div id="{id}_sort_date" class="sortdate sort_none"></div>',
                            '<div style="clear:both;"></div>',
                        '</div>',
                        '<div id="{id}_filelist" class="{id}_filelist">',
                        '</div>',
			
			'<div style="clear:both;"></div>',
			//BUTTONS
			'<div id="{id}_buttons" class="{id}_buttons">',
			'<div class="prev" id="{id}_prev"></div>',
			'<div class="next" id="{id}_next"></div>',
			'<div class="count" id="{id}_count">count</div>',
			'<div>',
                    '</div>'
            );
        }
        
        //Search Bar now on top menu bar.
        this.finderTpl = new Ext.Template(
            '<div id="{id}_searchbox"><input type="text" id="{id}_field_search"></input>',
                '<img id="{id}_search_cancel" class="{id}_search_cancel" src="{searchImage}" align="abscenter" width="14" height="14">',
            '</div>'
        );
        
        if(Ext.isEmpty(this.tpl_filelist)){
            this.tpl_filelist = new Ext.XTemplate(
                "\n",
                '<tpl for=".">',
                    "\n",
                    '<div class="filelisting">',
                        '<div class="file_title_row" id="doc-{id}">',
                            '<div class="title">{[this.highlight(values.title)]} <span class="ver">v{version}</span> <span class="user">({user})</span> <tpl if="ccount &gt; 0"><span class="cmts">{ccount}</span></tpl></div>',
                            '<div class="creation">{[humane_date_from_seconds(values.seconds)]} - {[values.creation.format("D M d, Y")]}</div>',
                            '<div style="clear:both;"></div>',
        
                            '<div class="desc">{[this.fmtThumbNail(values.link)]}{description}</div>',
                            '<div style="clear:both;"></div>',
                            
                        '</div>',
			//'<tpl if="children &gt; 0"><div class="childrenhere" id="par-{id}"></div></tpl>',
                        '<tpl if="childLang">',
                            '<div class="childrenhere">',
                            '<span class="label" id="par-{id}">Translations: </span>',
                            '<tpl for="childLang">',
                                '<tpl if="type && type == \'text\'">',
                                    '<span id="dl-{id}" class="lang text"> {lang} </span>',
                                '</tpl>',
                                '<tpl if="type && type == \'twxt\'">',
                                    '<span id="dl-{id}" class="lang twxt"> {lang} </span>',
                                '</tpl>',
                            '</tpl>',
                            '</div>',
                        '</tpl>',
                    '</div>',
                '</tpl>',
                '<div class="x-clear"></div>',
                {
                    uTubeRule1: /youtube\.com\/v\/([^&]+)/i,
                    uTubeRule2: /youtube\.com\/watch\?v=([^&]+)/i,
                    uTubeImage: "<img class=\"__img_l\" align=\"left\" hspace=\"5\" src=\"/thumb.php?src=http://i1.ytimg.com/vi/**ID**/1.jpg&x=100&y=100&f=0\" />",
                    imageRule: /^(http\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[a-zA-Z0-9_])+\.(?:jpg|jpeg|gif|png))$/i,
                    imageThumb: "<img class=\"__img_l\" align=\"left\" hspace=\"5\" src=\"/thumb.php?src=**IMG**&x=100&y=100&f=0\" />",
                    
                    fmtCdate: function(cdate){
                        return String.format(
                            '<span class="y">{0}</span><span class="m">{1}</span><span class="d">{2}</span><span class="t">{3}</span><span class="a">{4}</span>',
                            cdate.format('y'), cdate.format('M').toUpperCase(), cdate.format('d'), cdate.format('g:i'), cdate.format('a')
                        );
                    },
                    
                    fmtThumbNail: function(clink){
                        var yt_id;
                        
                        if(this.uTubeRule1.test(clink)){
                            yt_id = this.uTubeRule1.exec(clink);
                            if(yt_id !== null){
                                return this.uTubeImage.replace('**ID**', yt_id[1]);
                            }
                        }
                        
                        if(this.uTubeRule2.test(clink)){
                            yt_id = this.uTubeRule2.exec(clink);
                            if(yt_id !== null){
                                return this.uTubeImage.replace('**ID**', yt_id[1]);
                            }
                        }
                        
                        if(this.imageRule.test(clink)){
                            return this.imageThumb.replace('**IMG**', clink);
                        }
                        
                        return '';  
                    },
                    
                    highlight: function(tstring){
                        var val = this.myParent.lastSearchValue;
                        if(Ext.isEmpty(val)){ return tstring; }
                        var newstr = '';
                        var lcVal = val.toLowerCase();
                        var lcTs = tstring.toLowerCase();
                        //var val = new RegExp(this.myParent.lastSearchValue, 'gi');
                        //return tstring.replace(val, '<span class="findlite">'+this.myParent.lastSearchValue+'</span>');
                        var i = -1;
                        while(tstring.length > 0){
                            i = lcTs.indexOf(lcVal, i+1);
                            if(i < 0){
                                newstr += tstring;
                                tstring = '';
                            }else{
                                newstr += tstring.substring(0,i)+'<span class="findlite">'+tstring.substr(i, val.length)+'</span>';
                                tstring = tstring.substr(i + val.length);
                                lcTs = tstring.toLowerCase();
                                i = -1;
                            }
                        }
                        
                        return newstr;
                    },
                    myParent:this
                }
            );
        }
        
        this.finderTpl.append(this.bodyId, {
            id:this.id,
            searchImage: this.imageSearch
        });
        
        SIMPLE.topButtonBar.addButton(Ext.get(this.id+'_searchbox'), 2);
        
        this.tpl.append(this.bodyId, {
            id:this.id,
            searchImage: this.imageSearch
        });
        this.init_preload();
        
        this.el = Ext.get(this.id);
        this.filelist = Ext.get(this.id+"_filelist");
        this.searchfield = Ext.get(this.id+"_field_search");
        this.searchcancel = Ext.get(this.id+"_search_cancel");
        this.slopspace = Ext.get(this.id+"_slop");
        
        this.sortIconName = Ext.get(this.id+'_sort_name');
        this.sortIconDate = Ext.get(this.id+'_sort_date');
        
	this.store_params.start = 0;
	this.store_params.limit = 10;
	this.store_params.search = '';
	
	this.button_prev = Ext.get(this.id+'_prev');
	this.button_next = Ext.get(this.id+'_next');
	this.button_count = Ext.get(this.id+'_count');
	
        this.init_store();
        this.init_view();
        this.init_events();
        
        this.task = {
            run: this.sizeFileList,
            scope:this,
            interval:1200
        };
        
        this.el.setLeft(COL_LEFT_SIZE);
        
        this.init_slop();
    },
    
    init_events: function(){
        this.searchfield.on('keyup', this.onSearchChange, this);
        this.searchcancel.on('click', this.onSearchCancel, this);
        
        this.sortIconName.on('click', this.onSortName, this);
        this.sortIconDate.on('click', this.onSortDate, this);
    },
    
    init_slop: function(){
        //Temporarly Turned off
        
        /*var pre = (USER_LOGED_IN) ? USER_DATA.userid : null;
        var userid = this.user_id || pre;
        
        this.slop_sel_text = this.slopspace.createChild({
            tag:'select',
            id:this.id+'slop_text',
            cls:this.id+'_slop_text',
            name:'slop_text'
        });
        this.slop_switch = this.slopspace.createChild({
            tag:'img',
            id:this.id+'slop_switch',
            cls:this.id+'_slop_switch',
            src: "images/finder/switch.gif",
            align: "absmiddle"
        });
        
        this.slop_sel_twxt = this.slopspace.createChild({
            tag:'select',
            id:this.id+'slop_twxt',
            cls:this.id+'_slop_twxt',
            name:'slop_twxt'
        });
        
        this.slop_select = new twexter.slop_select({
            select_text: this.slop_sel_text,
            select_twxt: this.slop_sel_twxt,
            user_id: userid,
            hide_editor: false,
            add_all: true
        });
        this.slop_select.init();
        
        this.slop_select.on('langSelect', this.onSlopChange, this);
        this.slop_switch.on('click', this.onSwitchSlop, this);*/
    },
    
    show_loader: function(){
	var loader = Ext.fly('finder_loader');
	if(this.el.isVisible()){
	    loader.show();
	    loader.center(this.el);
	}
	if(this.dataview)this.dataview.disable();
    },
    
    hide_loader: function(){
	var loader = Ext.fly('finder_loader');
	loader.hide();
    },
    
    onDataLoad: function(){
	
	if(this.dataview)this.dataview.enable();
	//Write out teh count
	var total = this.store.getTotalCount();
	var to = this.store_params.start + this.store_params.limit;
	to = Math.min(to, total);
	var count = (this.store_params.start+1) + ' - ' + to + ' / ' + total;
	this.button_count.update(count);
	
	//now check buttons
	this.button_next.un('click', this.onNextClick, this);
	this.button_prev.un('click', this.onPrevClick, this);
	
	if(to == total){
	    this.button_next.addClass('next_disabled');
	    this.button_next.removeClass('next');
	    this.button_next.un('click', this.onNextClick, this);
	}else{
	    this.button_next.addClass('next');
	    this.button_next.removeClass('next_disabled');
	    this.button_next.on('click', this.onNextClick, this);
	}
	
	if(this.store_params.start == 0){
	    this.button_prev.addClass('prev_disabled');
	    this.button_prev.removeClass('prev');
	    this.button_prev.un('click', this.onPrevClick, this);
	}else{
	    this.button_prev.addClass('prev');
	    this.button_prev.removeClass('prev_disabled');
	    this.button_prev.on('click', this.onPrevClick, this);
	}
	
	this.findChildren();
    },
    
    findChildren: function(){
	//This is the old way of doing things... Now we list languages
        /*var childr = this.el.select('.filelisting .childrenhere');
	var c = childr.getCount();
	
	if(c>0){
	    childr.on('click', function(e){
		var el = e.getTarget();
		var id = el.id.split('-')[1];
		e.stopEvent();
		this.clearDataParams();
		this.store_params.parent = id;
		this.loadWithParams();
	    }, this);
	}*/
        
        var childr = this.el.select('.filelisting .childrenhere .lang');
        var c = childr.getCount();
        
        if(c>0){
            childr.on('click', function(e){
                var el = e.getTarget();
                var id = el.id.split('-')[1];
                e.stopEvent();
                this.fireEvent('document_selected', id);
                this.hide();
                this.fireEvent('hidden', this);
            }, this);
            
            var trans = this.el.select('.filelisting .childrenhere .label');
            var tc = trans.getCount();
            
            if(tc>0){
                trans.on('click', function(e){
                    var el = e.getTarget();
                    var id = el.id.split('-')[1];
                    e.stopEvent();
                    this.clearDataParams();
                    this.store_params.parent = id;
                    this.loadWithParams();
                },this);
            }
        }
	
        
        
    },
    
    history: function(idx){
	console.log("History Index ", idx);
	if(idx == (this.lastHistoryIdx)) return;
	
	if(Ext.type(this.last_store_params[idx-1]) == 'object'){
	    this.store_params = Ext.apply({},this.last_store_params[idx-1]);
	    console.dir(this.store_params);
	    this.searchfield.dom.value = '';
	    this.searchfield.dom.value = this.store_params.search;
	    this.loadWithParams(true);
	    //this.lastHistoryIdx = idx;
	}
	
    },
    
    clearAndLoad: function(){
	if(this.firstLoad){
	    this.firstLoad = false;
	    return;
	}
	this.clearDataParams();
	this.loadWithParams();
    },
    
    clearDataParams: function(){
	//Using Ext.apple to make copy
	this.store_params.search = '';
	this.store_params.start = 0;
	this.store_params.parent = null;
    },
    
    loadWithParams: function(history){
	this.store.baseParams = this.store_params;
	var doHist = (history==true) ? false : true;
	if(doHist){
	    if(!Ext.isArray(this.last_store_params)) this.last_store_params = [];
	    //this.last_store_params[this.lastHistoryIdx] = Ext.apply({},this.store_params);
	    var hobj = Ext.apply({},this.store_params);
	    this.lastHistoryIdx = this.last_store_params.push(hobj);
	    hobj.historyIdx = this.lastHistoryIdx;
	    Ext.History.add("finder:goback:"+this.lastHistoryIdx);
	    console.log("Add history for ",this.lastHistoryIdx);
	}
	this.store.load();
    },
    
    init_store: function(){
        if(!this.store){
            this.store = new Ext.data.JsonStore({
                url: RPC_FILELIST,
		totalProperty: 'total',
                root: 'files',
                fields: [
                    'id', 'ccount', 'title', 'hasDesc', 'description', 'seconds',
                    {name:'creation', type:'date', dateFormat:'Y-m-d H:i:s'},
                    'isUser', 'sha1', 'version', 'user', 'link', 'children', 'childLang'
                ],
		remoteSort: true,
		baseParams: this.store_params
            });
        }
	
	this.store.on({
	    'beforeload':this.show_loader,
	    'load':this.hide_loader,
	    scope:this
	});
	this.store.on('load', this.onDataLoad, this);
	
        
        
        //Set Icons for showing proper sort.
        this.removeSortStyle(this.sortIconName);
        this.removeSortStyle(this.sortIconDate);
        this.sortIconDate.addClass('sort_up');
        this.sortIconName.addClass('sort_none');
        this.sorting = ['creation', 'desc'];
        
        this.store.sort("creation", 'DESC');
	this.loadWithParams();
    },
    
    init_view: function(){
        
        
        if(!this.dataview){
            this.dataview = new Ext.DataView({
                id: "dataview",
                store: this.store,
                tpl: this.tpl_filelist.compile(),
                applyTo: this.id+'_filelist',
                //applyTo: 'filetable',
                autoHeight:true,
                singleSelect: true,
                itemSelector: 'div.filelisting',
                selectedClass: 'file_select',
                overClass: 'file_hover',
                emptyText: 'No documents to display'
            });
        }
        
	/*{*/
	this.dataview.on('beforerender', function(){
	    conolse.log("Before filelist render");
	    console.time('filelistrender');
	});
	this.dataview.on('render', function(){
	    console.timeEnd('filelistrender');
	    conolse.log("After filelist render");
	});
	/*}*/
	
        this.dataview.on('beforerender', this.sizeFileList, this);
        this.dataview.on('click', this.onItemClick, this);
    },
    
    init_preload: function(){
        this.images = [];
        var tmp = new Image();
        tmp.src = this.imageSearchCancel;
        this.images[this.images.length] = tmp;
    },
    
    onSearchChange: function(){
        
        //Need to replace with event... just testing.
        if(!this.el.isVisible()){
            SIMPLE.xbutton.setButtonState('r', 1);
        }
        
        if(!this.searchDelayer){
            this.searchDelayer = new Ext.util.DelayedTask(this.onDoFilter, this);
           /*{*/console.debug("Created Search Delayer");/*}*/
        }
        var val = this.searchfield.getValue();
        if(Ext.isEmpty(val)){
            this.searchcancel.dom.src = this.imageSearch;
	    this.clearDataParams()
	    this.loadWithParams();
        }else{
            this.searchcancel.dom.src = this.imageSearchCancel;
        }
        
        if(val.length < this.search_chars-1){
	    this.lastSearchValue = '';
	    this.clearDataParams();
            this.searchDelayer.cancel();
            this.loadWithParams();
	    //this.store.clearFilter();
	    //this.dataview.refresh();
        }else{
            this.searchDelayer.delay(400);
        }

        this.lastSearchValue = val;
    },
    
    onDoFilter: function(){
        var value = this.searchfield.getValue();
	this.clearDataParams();
	this.store_params.search = value;
	this.loadWithParams();
        //this.store.filter("title", value, true);
    },
    
    onSearchCancel: function(){
        this.searchfield.dom.value = '';
        this.searchcancel.dom.src = this.imageSearch;
        this.store.clearFilter();
        this.lastSearchValue = '';
        this.clearDataParams();
        this.loadWithParams();
    },
    
    onItemClick: function(ctl, idx, node, evt){
        /*{*/console.debug("The idex was %s", idx);/*}*/
        var rec = this.store.getAt(idx);
        //console.dir(rec);
        this.fireEvent('document_selected', rec.get('id'));
        this.hide();
        this.fireEvent('hidden', this);
	
	if(this.lastSearchValue!=''){
	    this.lastSearchValue = '';
	    this.store_params.search = '';
	    this.store.baseParams = this.store_params;
	    /*{*/console.debug("Going to reload file list in 2 secs");/*}*/
	    //this.store.load.defer(2000, this.store);
	    this.loadWithParams.defer(2000, this, [true]);
	}
	
    },
    
    onNextClick: function(){
	this.store_params.start+=10;
	this.store.baseParams = this.store_params;
	//this.store.load();
	this.loadWithParams();
    },
    
    onPrevClick: function(){
	this.store_params.start-=10;
	if(this.store_params.start<0) this.store_params.start = 0;
	this.store.baseParams = this.store_params;
	//this.store.load();
	this.loadWithParams();
    },
    
    sizeFileList: function(){
        /*{*/console.debug("**Size Finder Timed");/*}*/
        var h = this.el.getHeight();
        var y = this.el.getY();
        
        if(!this.last_fileview_h){
            this.last_fileview_h = h;
            this.last_fileview_y = y;
        }else{
            if(this.last_fileview_h == h && this.last_fileview_y == y){
                return;
            }
            this.last_fileview_h = h;
            this.last_fileview_y = y;
        }
        
        var fh = h - 50 - 50;
	Ext.fly(this.id+'_buttons').setY(fh+50+50);
	
        /*{*/console.debug("Sazing List: %s - %s - 50", h, fh);/*}*/
        this.filelist.setY(y+50);
        this.filelist.setHeight(fh);
    },
    
    loadDocuments: function(tx, tw){
        if(tx !== false && tw !== false){
            //Temporarly Off
            /*this.slop_sel_text.dom.value = tx;
            this.slop_sel_twxt.dom.value = tw;
            this.slop_select.last_text_value = tx;
            this.slop_select.last_twxt_value = tw;
            this.store.load({params:{text:tx,twxt:tw}});*/
            //this.store.load();
        }else{
            this.store.reload();
        }
    },
    
    
    
    loadFail: function(){
        alert("could not load documents!");
    },
    
    show: function(stext, stwxt){
        this.el.show();
        this.sizeFileList();
        if(Ext.isEmpty(this.taskRunner)){
            this.taskRunner = new Ext.util.TaskRunner();
            this.taskRunner.start(this.task);
        }
    },
    
    setLang: function(stext, stwxt){
        var t = stext || false;
        var x = stwxt || false;
        //this.loadDocuments(t, x);
    },
    
    hide: function(){
        try{
            if(this.taskRunner) this.taskRunner.stopAll();
        }catch(e){
            console.warn("Error on StopAll: "+e);
        }
        this.el.hide();
        //this.searchcancel.hide();
        this.store.clearFilter();
        this.searchfield.dom.value = '';
        this.searchcancel.dom.src = this.imageSearch;
        
    },
    
    setPosition: function(arr){
        //Not being used
    },
    
    onSlopChange: function(text, twxt){
        this.store.load({params:{text:text,twxt:twxt}});
    },
    
    userLogin: function(userid){
        //Currently Diabled
	//this.slop_select.userLogin(userid);
    },
    
    getEl: function(){
        return this.el;
    },
    
    removeSortStyle : function(ctl){
        ctl.removeClass(['sort_none','sort_down','sort_up']);
    },
    
    onSortName : function(){
        if(Ext.isEmpty(this.sorting) || !Ext.isArray(this.sorting)){
            return;
        }
        
        if(this.sorting[0]=='date'){
            this.removeSortStyle(this.sortIconDate);
            this.sortIconDate.addClass('sort_none');
            
            this.sorting = ['title', 'ASC'];
            this.removeSortStyle(this.sortIconName);
            this.sortIconName.addClass('sort_down');
            this.store.sort('title', 'ASC');
        }else if(this.sorting[0]=='title'){
            if(this.sorting[1]=='ASC'){
                this.sorting = ['title', 'DESC'];
                this.removeSortStyle(this.sortIconName);
                this.sortIconName.addClass('sort_up');
                this.store.sort('title', 'DESC');
            }else{
                this.sorting = ['title', 'ASC'];
                this.removeSortStyle(this.sortIconName);
                this.sortIconName.addClass('sort_down');
                this.store.sort('title', 'ASC');
            }
        }else{
                this.removeSortStyle(this.sortIconDate);
                this.sortIconDate.addClass('sort_none');
                this.sorting = ['title', 'ASC'];
                this.removeSortStyle(this.sortIconName);
                this.sortIconName.addClass('sort_down');
                this.store.sort('title', 'ASC');
        }
    },
    
    onSortDate : function(){
        if(Ext.isEmpty(this.sorting) || !Ext.isArray(this.sorting)){
            return;
        }
        
        if(this.sorting[0]=='title'){
            this.removeSortStyle(this.sortIconName);
            this.sortIconName.addClass('sort_none');
            
            this.sorting = ['creation', 'ASC'];
            this.removeSortStyle(this.sortIconDate);
            this.sortIconDate.addClass('sort_down');
            this.store.sort('creation', 'ASC');
        }else if(this.sorting[0]=='creation'){
            if(this.sorting[1]=='ASC'){
                this.sorting = ['creation', 'DESC'];
                this.removeSortStyle(this.sortIconDate);
                this.sortIconDate.addClass('sort_up');
                this.store.sort('creation', 'DESC');
            }else{
                this.sorting = ['creation', 'ASC'];
                this.removeSortStyle(this.sortIconDate);
                this.sortIconDate.addClass('sort_down');
                this.store.sort('creation', 'ASC');
            }
        }else{
                this.removeSortStyle(this.sortIconName);
                this.sortIconName.addClass('sort_none');
                this.sorting = ['creation', 'ASC'];
                this.removeSortStyle(this.sortIconDate);
                this.sortIconDate.addClass('sort_down');
                this.store.sort('creation', 'ASC');
        }
    },
    
    onSwitchSlop: function(){
        var tmp = this.slop_sel_text.getValue();
        this.slop_sel_text.dom.value = this.slop_sel_twxt.getValue();
        this.slop_sel_twxt.dom.value = tmp;
        this.store.load({params:{text:this.slop_sel_text.getValue(),twxt:this.slop_sel_twxt.getValue()}});
    }
};

Ext.extend(twexter.finder, Ext.util.Observable, twexter.finder.prototype);