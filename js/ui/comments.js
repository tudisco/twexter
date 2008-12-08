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

Ext.namespace("twexter", "twexter.comments");

twexter.comments = function(config){
	twexter.comments.superclass.constructor.call(this);
	var nconfig = config || {};
	Ext.apply(this, nconfig);
	this.addEvents({
		"add_comment" : true
	});
};

twexter.comments.prototype = {
    
    el: null,
    id: 'comments',
    bodyId: MAIN_BODY,
    tpl_main: null,
    tpl_cmts: null,
    userId: false,
    docId: false,
    docSha1: false,
    store: null,
    dataview: null,
    loadedOnce: false,
    
    init: function(){
        var tpl = '<div id="{cid}" class="{cid}">'
                    +'<div id="{cid}_display" class="{cid}_display"></div>'
                    +'<div id="{cid}_input" class="{cid}_input">'
                        +'<div class="{cid}_textarea"><textarea id="{cid}_text" class="{cid}_text"></textarea></div>'
                        +'<div class="{cid}_buttonarea"><button id="{cid}_button" type="button">Comment</button></div>'
                    +'</div>'  
                +'</div>';
                
        if(this.tpl_main == null){
            this.tpl_main = new Ext.Template(tpl);
        }
        
        this.tpl_main.append(this.bodyId, {
            cid:this.id
        });
        
        if(this.tpl_cmts == null){
            this.tpl_cmts = new Ext.XTemplate(
                '<tpl for=".">',
                    '<div id="comment_{id}" class="a_comment">',
                        '<div class="title">',
                            '<span class="username">{username}</span> <span class="date">{[humane_date_from_seconds(values.seconds)]}</span>',
                        '</div>',
                    '{[this.checkforlinks(this.nl2br(values.comment))]}',
                    '</div>',
                '</tpl>',
                {
                    nl2br: function (text){
                        var sutil = twexter.string;
                        text = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
                        text = sutil.str_replace("\n","<br />",text);
                        return text;
                    },
                    
                    checkforlinks: function(text){
                        var link = /((mailto\:|javascript\:|(news|file|(ht|f)tp(s?))\:\/\/)[A-Za-z0-9\.:_\/~%\-+&#?!=()@\x80-\xB5\xB7\xFF]+)/g;
                        if(Ext.type(text)!='string') return '';        
                        return text.replace(link, "<a href=\"$1\" target=\"_blank\">$1</a>");
                    }
                }
            );
            this.tpl_cmts.compile();
        }
        
        this.el = Ext.get(this.id);
        this.el_display = Ext.get(this.id+'_display');
        this.el_textarea = Ext.get(this.id+'_text');
        this.el_button = Ext.get(this.id+'_button');
        this.el_input = Ext.get(this.id+'_input');
        
        this.init_events();
        
        this.init_store();
        this.init_view();
	this.init_tasks();
    },
    
    setUserId: function(userid){
        this.userId = userid;  
    },
    
    setDocId: function(docid, docsha1){
        this.docId = docid;
        this.docSha1 = docsha1;
        //TODO: Load Comments
        if(this.docSha1!=false){
            /*{*/console.info("Comments Loading");/*}*/
            this.store.load({params:{docsha1:this.docSha1}});
        }
    },
    
    init_tasks: function(){
	var task = {
		run: function(){
			if(this.docId!=false && this.store && this.dataview && this.loadedOnce!=false){
				this.store.reload();
			}
		},
		interval: 10000, //10 second
		scope: this
	}
	this.task_runner = new Ext.util.TaskRunner();
	this.task_runner.start(task);
    },
    
    init_events: function(){
        this.el_button.on('click', this.onAddComment, this);
    },
    
    init_store: function(){
        this.store = new Ext.data.JsonStore({
            url: RPC_COMMITLIST,
            root: 'comments',
            fields: [
                'id', 'user_id', 'doc_id', 'username', 'comment', 'seconds', 
                {name:'date_entered', type:'date', dateFormat:'Y-m-d H:i:s'}
            ]
        });
        //this.store.load();
	this.store.on('load', function(){
		this.loadedOnce = true;	
	}, this);
    },
    
    init_view: function(){
        
        this.dataview = new Ext.DataView({
            id: "dataviewComments",
            store: this.store,
            tpl: this.tpl_cmts,
            applyTo: this.el_display,
            autoHeight:true,
            singleSelect: false,
            multiSelect: false,
            //itemSelector: 'div.a_comment',
            emptyText: 'No comments to display'
        });
        
        
        /*{*/
	this.dataview.on('beforerender', function(){
	    conolse.log("Before comments render");
	    console.time('cmtslistrender');
	});
	this.dataview.on('render', function(){
	    console.timeEnd('cmtslistrender');
	    conolse.log("After comments render");
	});
	/*}*/
        
    },
    
    onAddComment: function(){
        /*{*/console.info("Save comment button pressed");/*}*/
        var comment = this.el_textarea.getValue();
        
        if(this.userId === false){
            alert("You are not signed in, please sign in first");
            return;
        }
        
        if(this.docId === false || this.docSha1 == false){
            alert("No document ID. this document needs to be saved first");
        }
        
        if(Ext.isEmpty(comment)){
            alert("Comments can not be empty");
            return;
        }
        
        var data = {};
        data.userid = this.userId;
        data.docid = this.docId;
        data.docsha1 = this.docSha1;
        data.comment = comment;
        
        var ajConfig = {
                url: RPC_ADDCOMMENT,
                params: data,
                method: 'POST',
                scope: this,
                success:this.saveSuccess,
                failure:this.saveFail
        };
        this.el_button.dom.disabled = true;
	Ext.Ajax.request(ajConfig);
        
    },
    
    saveSuccess: function(rep){
        
        this.el_button.dom.disabled = false;
        /*{*/console.info("Save comment success called");/*}*/
        var text = rep.responseText;
        if(text.length > 3){
            var r;
            var er = "Error saving comment. ";
            try{
                r = Ext.decode(text);
                if(r.success==false){
                    alert(er);
                }
            }catch(e){
                alert(er+e);
            }
            
        }else{
            alert("There might have been a problem saving you comment.");
        }
        //TODO: Comment was a success, notify and reload store.
        this.el_textarea.dom.value = '';
        this.store.reload();
        this.el_display.scrollTo('top', 0);
    },
    
    saveFail: function(){
        this.el_button.dom.disabled = false;
        /*{*/console.info("Save comment failed called");/*}*/
        alert("There was an error saving your comment, please try again latter");
    },
    
    posControls: function(){
        var h = this.el.getHeight();
        var y = this.el.getY();
        var ih = this.el_input.getHeight();
        this.el_display.setHeight(h-ih-y);
    },
    
    getEl: function(){
        return this.el;
    },
    
    show: function(){
        this.el.show();
    },
    
    hide: function(){
        this.el.hide();
    },
    
    setPosition: Ext.emptyFn
    
};

Ext.extend(twexter.comments,  Ext.util.Observable, twexter.comments.prototype);

