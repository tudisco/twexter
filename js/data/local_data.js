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

Ext.namespace('twexter', 'twexter.data', 'twexter.introdoc');

/**
 * The document that is show to th euser on first load
 */
twexter.introdoc.struct = [
    ['<- CLICK ME','cliqueme'],
    1,
    ['click','cliquea'],
    ['this','esta'],
    ['x','equis'],
    ['thing','cosa'],
    0,
    ['double click,','doble clique'],
    ['too','ademas'],
    1,
    ['click','presiona'],
    ['LEFT','izquierda'],
    ['to edit','editar'],
    0,
    ['click','pegale'],
    ['RIGHT','derecha'],
    ['to find','encontrar'],
    0,
    ['click','dale'],
    ['BOTTOM',"pa'abajo"],
    ['to style',"dar estilo"],
    0,
    ['click','y ya'],
    ['TOP','arriba'],
    ['to print','para imprimir'],
    ['(SOON)','dentro de poco'],
    1,
    ['now','ahora'],
    ['you can','puedes'],
    ['get','hacer'],
    ['text','texto'],
    ['[href=http://twext.com/twext,twext]','twexto'],
    0,
    ['in','en'],
    ['any','qualquier'],
    ['of','de'],
    ['many','muchas'],
    ['languages','idiomas']
];

/**
 * Local data storage frame work
 */
twexter.data = function(config){
    twexter.data.superclass.constructor.call(this);
    nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
        'document_loaded': true 
    });
};

twexter.data.prototype = {
    
    document_id: null,
    document_sha1: null,
    document_struct: null,
    store: null,
    editor_undo: [],
    editor_redo: [],
    diff: null,
    lastLeftText: '',
    lastRightText: '',
    
    /**
     * Creates the local store
    */
    init: function(){
        this.store = new Ext.state.CookieProvider();
    },
    
    /**
     * Get the current document that the user is working on.. currently this just loads the defuelt doc
    */
    getCurrentDocumentStruct: function(){
        
        if(!Ext.isEmpty(LOAD_DOC)){
            SIMPLE.onLoadDocument(LOAD_DOC);
            return '';
        }
        
        var docid = this.store.get('last_doc', false);
        if(docid !== false && USER_LOGED_IN){
            SIMPLE.onLoadDocument(docid);
            return '';
        }
        
        return this.getStartDocument(); 
        
        
        /** Obsolete -  Currently Not using **/
        
        /**var stepForwardl = false, stepForwardr = false;
        var left, right;
        console.debug('Loading Doc');
        
        this.store.get('editor_text_left', function(ok,val){
            if(ok){
                left = val;
            }
            stepForwardl = true;
        }, this);
        
        this.store.get('editor_text_right', function(ok,val){
            if(ok){
                right = val;
            }
            stepForwardr = true;
        },this);
        
        while(!stepForwardl || !stepForwardr){
            console.debug('wait...');
        }
        
        if(Ext.type(left)=='string' || Ext.type(right)=='string'){
            this.document_struct = twexter.parse_into_struct(left, right);
        }
        
        if(this.document_struct == null){
            return this.getStartDocument();
        }
        return this.document_struct;**/
    },
    
    /**
     * Get the defualt Start Document
    */
    getStartDocument: function(){
        return twexter.introdoc.struct;
    },
    
    /**
     * Set the output tool bar setting events to fire changes in localdata
    */
    setOutputToolBar: function(outToolbar){
        outToolbar.on('font_change', this.onFontChange, this);
        outToolbar.on('font_size_change', this.onFontSizeChange, this);
        outToolbar.on('font_color_change', this.onFontColorChange, this);
        outToolbar.on('font_weight_change', this.onFontWeightChange, this);
        outToolbar.on('font_space_change', this.onFontWeightChange, this);
        this.sendDataOutToolbar(outToolbar);
    },
    
    setEditor: function(editor){
        //** Need to update this **//
        editor.on('change', this.onEditorChange, this);
    },
    
    /**
     * Fix type spelling.. to be sure we only use one way of saving data
    */
    fixType: function(type){
        if(type == 'twext'){
            type = 'twxt';
        }
        return type;
    },
    
    /**
     * Event: On Font Change event
    */
    onFontChange: function(type, font){
        type = this.fixType(type);
        var key = 'font_'+type;
        this.store.set(key, font);
        /*{*/console.info("Saved font change (%s: %s)", key, font);/*}*/
    },
    
    /**
     * Event: On Font Size Change event
    */
    onFontSizeChange: function(type, size){
        type = this.fixType(type);
        var key = 'fontsize_'+type;
        this.store.set(key, size);
        /*{*/console.info("Saved font size (%s: %s)", key, size);/*}*/
    },
    
    /**
     * Event: On Font Color Change event
    */
    onFontColorChange: function(type, color){
        type = this.fixType(type);
        var key = 'fontcolor_'+type;
        this.store.set(key, color);
        /*{*/console.info("Saved font color (%s: %s)", key, color);/*}*/
    },
    
    /**
     * Event: On Font Wieght event
    */
    onFontWeightChange: function(type, weight){
        type = this.fixType(type);
        var key = "fontweight_"+type;
        this.store.set(key, weight);
        /*{*/console.info("Saved font weight (%s: %s)", key, weight);/*}*/
    },
    
    /**
     * Event: On Font Space event
    */
    onFontSpaceChange: function(type, space){
        type = this.fixType(type);
        var key = "fontspace_"+type;
        this.store.set(key, space);
        /*{*/console.info("Saved font space (%s: %s)", key, weight);/*}*/
    },
    
    /**
     * Sets the last loaded document id
    */
    setLastLoadedDocument: function(docid){
        this.store.set('last_doc', docid);  
    },
    
    /**
     * Clear last document ID
    */
    clearLastDoc: function(){
        this.store.clear('last_doc');
    },
    
    
    /**
     * Clear all output options
    */
    clearAllOutputOptions: function(){
        var types = ['text','twxt','twext'];
        
        Ext.each(types, function(i){
            this.store.clear('font_'+i);
            this.store.clear('fontsize_'+i);
            this.store.clear('fontcolor_'+i);
            this.store.clear('fontweight_'+i);
            this.store.clear('fontspace_'+i);
        }, this);
        
        /*{*/console.log('all output toolbar options cleaned from local data');/*}*/
    },
    
    /**
     * Send Data to Output Tool Bar
    */
    sendDataOutToolbar: function(outToolbar){
        var t = ['text','twxt'];
        var o = ['font', 'fontsize', 'fontcolor', 'fontweight', 'fontspace'];
        /*{*/console.debug("going to load out toolbar options");/*}*/
        
        var text_style = '.chunk .text';
        var twxt_style = '.chunk .twext';
        var s = ['fontFamily', 'fontSize', 'color', 'fontWeight', null];
        
        Ext.each(t, function(i){
            var ty = (i=='text') ? '.text' : '.twext';
            var cur = Ext.util.CSS.getRule('.chunk '+ty);
            if(Ext.isEmpty(cur)){
                /*{*/console.warn("No style found for: .chunk "+ty); /*}*/   
                return;
            }
            var sc = 0;
            Ext.each(o, function(x){
                var tmp = cur.style[s[sc]];
                /*{*/console.debug("--Local Data Defualt: ", x+'_'+i, ' ', tmp);/*}*/
                outToolbar.setData(i, x, this.store.get(x+'_'+i, tmp));
                delete tmp;
                sc++;
            }, this);
        }, this);
        
        //** Obsolete **//
        /**Ext.each(t, function(i){
            Ext.each(o, function(x){
                this.store.get(x+'_'+i, function(ok,val){
                    if(ok===true){ outToolbar.setData(i, x, val); }
                });                
            },this);
        },this);**/
        
        /*{*/console.debug("done");/*}*/
    },
    
    /**
     * Event fired on editor changes.. currently not being used
    */
    onEditorChange: function(left, right){
        
        if(this.leuid){
            clearTimeout(this.leuid);
        }
        this.leuid = this.saveEditorUndo.defer(600, this, [left, right]);
        
        //** Obsolete, Need to Fix.. Maybe Flash? **//
        //this.store.set('editor_text_left', left);
        //this.store.set('editor_text_right', right);
        //console.debug("saved editor");
    },
    
    makeXscroll: function(left,right,cs){
        var s;
        var ct = cs || twexter.detect_chunk_style(left,right);
        if(ct == twexter.CHUNKSTYLE_FLOW){
            s = twexter.flowchunk_to_struct(right);
            s = twexter.struct_to_xscrollchunk(s);
        }else if(ct == twexter.CHUNKSTYLE_SPACE){
            s = twexter.spacechunk_to_struct(left,right);
            s = twexter.struct_to_xscrollchunk(s);
        }else{
            s = [left,right];
        }
        return s;
    },
    
    saveEditorUndo: function(left,right){
          /*{*/console.log('Saving Undo Info.');/*}*/
        if(this.applyUndo){
            this.applyUndo=false;
            console.log("Apply Undo");
            return;
        }
        var s = this.makeXscroll(left, right);
        s[0] = twexter.string.trim(s[0]);
        s[1] = twexter.string.trim(s[1]);
        
        if(!this.lastLeftText || !this.lastRightText){
            this.lastLeftText = s[0];
            this.lastRightText = s[1];
            return;
        }
        
        if(this.lastLeftText != s[0] || this.lastRightText != s[1]){
            this.editor_undo.push([this.lastLeftText,this.lastRightText]);
            this.lastLeftText = s[0];
            this.lastRightText = s[1];
            
            if(this.editor_undo.length > 25){
                this.editor_undo.shift();
            }
            /*{*/console.dir(this.editor_undo);/*}*/
        }
        
    },
    
    doUndo: function(left,right){
         /*{*/console.log('Doing UNDO.');/*}*/
        if(this.editor_undo.length < 1){
            /*{*/console.log('NO UNDOs.');/*}*/
            return false;
        }
        /*{*/console.dir(this.editor_undo);/*}*/
        
        var ct = twexter.detect_chunk_style(left,right);
        var s = this.makeXscroll(left,right,ct);
        s[0] = twexter.string.trim(s[0]);
        s[1] = twexter.string.trim(s[1]);
        this.editor_redo.push(s);
        var lc = this.editor_undo.pop();
        var l = lc[0];
        var r = lc[1];
        this.applyUndo = true;
        this.lastLeftText = l;
        this.lastRightText = r;
        
        if(ct != twexter.CHUNKSTYLE_XSCROLL){
            if(ct == twexter.CHUNKSTYLE_SPACE){
                s = twexter.parse_into_struct(l,r);
                s = twexter.struct_to_spacechunk(s);
                return s;
            }else{
                s = twexter.parse_into_struct(l,r);
                s = twexter.struct_to_flowchunk(s);
                return ['',s];
            }
        }
        return [l,r];
        
    },
    
    clearUndo: function(){
        delete this.editor_undo;
        delete this.editor_redo;
        this.editor_undo = [];
        this.editor_redo = [];
    },
    
    loadDoc: function(left,right){
        var s = this.makeXscroll(left,right);
        this.lastLeftText = twexter.string.trim(s[0]);
        this.lastRightText = twexter.string.trim(s[1]);
    }
    
    
};

Ext.extend(twexter.data, Ext.util.Observable, twexter.data.prototype);