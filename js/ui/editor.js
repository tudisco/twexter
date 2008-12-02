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

Ext.namespace('twexter', 'twexter.editor');

/**
 * Twext Chunking Split Editor
 */
twexter.editor = function(config){
    twexter.editor.superclass.constructor.call(this);
    nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"change" : true,
        "chunkingFinished" : true
    });
};

twexter.editor.prototype = {
    
    /** Ext.Element to control */
    el:null,
    /** Element ID for Control */
    id: 'twext_editor',
    id_table: 'editor_table',
    bodyId: MAIN_BODY,
    className: 'twext_editor',
    leftTextId: 'twext_left',
    leftId: 'twext_editor_left',
    rightTextId: 'twext_right',
    rightId: 'twext_editor_right',
    tpl: '<div id="{id}" class="{sclass}"><table id="{tableId}" class="etable" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td id="{id}_td_left" valign="top" style="width:50%;" class="left"><textarea id="{textLeftId}" class="edit" wrap="off">{textLeft}</textarea></td><td id="{id}_td_right" valign="top" style="width:50%;" class="right"><textarea id="{textRightId}" class="edit" wrap="off">{textRight}</textarea></td></tr></table></div>',
    editor_line_height: 16,
    do_highlighting: true,
    chunkPrefix: 'ch_l',
    document_id: null,
    chunkStyle: 0,
    CHUNK_SLOP: 0,
    CHUNK_SPACE: 1,
    EDITOR_MODE: 2,
    
    /**
     * Initialize Editor Control
     */
    init: function(){
        /*{*/console.info("loading editor");/*}*/
        // Add new lines around template so I can see it clearer in the source.
        var nl = "\n";
        var tpl = new Ext.Template(nl+this.tpl+nl);
        
        // Append Template to the page.
        tpl.append(this.bodyId, {
            id:this.id,
            sclass:this.className,
            textRightId:this.rightTextId,
            rightId:this.rightId,
            textRight:'',
            textLeftId:this.leftTextId,
            leftId:this.leftId,
            textLeft:'',
            tableId:this.id_table
        });
        
        
        // Get the main Element
        this.el = Ext.get(this.id);
        
        // Get the table Element
        this.el_table = Ext.get(this.id_table);
        
        // Get Left Text Area
        this.TextAreaLeft = Ext.get(this.leftTextId);
        
        // Get Right Text Area
        this.TextAreaRight = Ext.get(this.rightTextId);
        
        this.td_right = Ext.get(this.id+'_td_right');
        this.td_left = Ext.get(this.id+'_td_left');
        
        //Initialize Events
        this.init_events();
        
        //this.el.removeClass(this.className); this.el.addClass(this.className);
        
        // Position the editor.
        this.positionEditors();
        
    },
    
    /**
     * Get the main Element
     *
     * @returns Ext.Element
     */
    getEl: function(){
        return this.el;
    },
    
    /**
     * Initialize this controls events
     */
    init_events: function(){
        var tl = this.TextAreaLeft;
        var tr = this.TextAreaRight;
        
        tl.on('keyup', this.onLeftKeyUp, this);
        tr.on('keyup', this.onRightKeyUp, this);
        tl.on('click', this.onLeftClick, this);
        tr.on('click', this.onRightClick, this);
        
        tl.addKeyListener(Ext.EventObject.TAB, this.tabSwitch_left, this);
        tr.addKeyListener(Ext.EventObject.TAB, this.tabSwitch_right, this);
        //tl.on('keydown', this.tabSwitch.createDelegate(this, [0]));
    },
    
    /**
     * Handle the tab key in editor
     */
    tabSwitch_left: function(key,ev){

        ev.stopEvent();
        
        var pos = this.getLinePosition(this.TextAreaLeft.dom);
        var tw = this.TextAreaRight.getValue();
        var i = 0, p, pp;
        for(p=1 ; i<tw.length ; i++){
            if(tw.charAt(i)=="\n"){
                p++;
                if(p==pos){
                    break;
                }
            }
        }
        /*{*/console.log("po = %s - Line = %s", i, p);/*}*/
        this.setLinePosition(this.TextAreaRight, i);
        this.TextAreaRight.focus();
        
        return false;
    },
    
    /**
     * Handle the tab key in right editor
     */
    tabSwitch_right: function(key,ev){

        ev.stopEvent();
        
        var pos = this.getLinePosition(this.TextAreaRight.dom);
        var tw = this.TextAreaLeft.getValue();
        var i = 0, p, pp;
        for(p=0 ; i<tw.length ; i++){
            if(tw.charAt(i)=="\n"){
                p++;
                if(p==pos){
                    break;
                }
            }
        }
        /*{*/console.log("po = %s - Line = %s", i, p);/*}*/
        this.setLinePosition(this.TextAreaLeft, i);
        this.TextAreaLeft.focus();
        
        return false;
    },
    
    /**
     * Get main Text
     *
     * @returns string Text
     */
    getText: function(){
        return this.TextAreaLeft.getValue() || '';  
    },
    
    /**
     * Sats Main Text
     *
     * @param string Text
     */
    setText: function(text){
        this.TextAreaLeft.dom.value = text;
    },
    
    /**
     * Get Twxt
     *
     * @returns string twext
     */
    getTwxt: function(){
        return this.TextAreaRight.getValue() || '';
    },
    
    /**
     * Set Twxt
     *
     * @param string twxt
     */
    setTwxt: function(twxt){
        this.TextAreaRight.dom.value = twxt;
    },
    
    /**
     * Switch Text Edit to Twxt Edit and Twxt to Text Editor
     */
    switchSides: function(){
        var tmp = this.getText();
        this.setText(this.getTwxt());
        this.setTwxt(tmp);
        this.fireEditChange();
    },
    
    
    getClientSize: function(){
    
        var theWidth, theHeight;

        if (window.innerWidth) {
            theWidth=window.innerWidth;
        }else if (document.documentElement && document.documentElement.clientWidth) {
            theWidth=document.documentElement.clientWidth;
        }else if (document.body) {
            theWidth=document.body.clientWidth;
        }
        
        if (window.innerHeight) {
            theHeight=window.innerHeight;
        }else if (document.documentElement && document.documentElement.clientHeight) {
            theHeight=document.documentElement.clientHeight;
        }else if (document.body) {
            theHeight=document.body.clientHeight;
        }
        
        this.wHeight = theHeight;
        this.wWidth = theWidth;
        
    },
    
    /**
     * Position the editors in the right places
     */
    positionEditors: function(){
        if(!this.el.isVisible())
        {
            return;
        }
        
        if(this.EDITOR_MODE == 2){
            
            this.getClientSize();
            
            var x = this.el.getX();
            var h = this.wHeight-10-x;
            
            this.el_table.setBottom(h);
            this.TextAreaLeft.setHeight(h);
            this.TextAreaRight.setHeight(h);
            this.orig_editor_height = h;
            this.adjustTwextEditorSize();
            
        }else if(this.EDITOR_MODE == 1){
            this.getClientSize();
            var x = this.el.getX();
            var h = this.wHeight-10-x;
            this.TextAreaRight.setHeight(h);
            this.orig_editor_height = h;
            this.adjustTwextEditorSize();
        }
    },
    
    setEditorMode: function(mode, vis){
        vis = (vis===false) ?  false : true;
        if(mode != 1 && mode != 2){
            throw "Invalid Editor Mode";
        }
        if(mode == 1){
            this.TextAreaLeft.hide();
            this.td_left.hide();
            this.td_left.setWidth("1%");
            this.td_right.setWidth("100%");
        }else{
            if(vis){
                this.TextAreaLeft.show();
                this.td_left.show();
            }
            this.td_left.setWidth("50%");
            this.td_right.setWidth("50%");
        }
        this.positionEditors();
    },
    
    /**
     * Male visable or Invisiable
     *
     * @param boolean True if Visible, False Otherwise
     */
    setVisible: function(vis){
        if(vis){
            this.el.show();
            this.td_left.show();
            this.td_right.show();
            this.TextAreaLeft.show();
            this.TextAreaRight.show();
            //this.el.fadeIn();
        }else{
            this.el.hide();
            this.td_left.hide();
            this.td_right.hide();
            this.TextAreaLeft.hide();
            this.TextAreaRight.hide();
        }
        //this.el.removeClass(this.className); this.el.addClass(this.className);
        this.positionEditors();
    },
    
    hide : function(){
        this.setVisible(false);  
    },
    
    show : function(){
        this.setVisible(true);
    },
    
    setPosition: Ext.emptyFn,
    
    setTextArray: function(t){
        if(Ext.isArray(t)){
            this.setText(t[0]);
            this.setTwxt(t[1]);
        }
    },
    
    /**
     * Take a text/twext structure and sepreate them and add them to the editors
     */
    setTextStruct: function(struct){
        if(!Ext.isArray(struct)){
            /*{*/console.error("Struct isn't an array");/*}*/
            /*console.dir(struct);*/
            return;
        }
        var s = struct;
        var l = s.length;
        var left = [];
        var right = [];
        var nl = "\n";
        var nlnl = nl+nl;
        
        for(var i=0;i<l;i++){
            if(Ext.isArray(s[i])){
                left[left.length] = s[i][0];
                left[left.length] = nl;
                right[right.length] = s[i][1];
                right[right.length] = nl;
            }
            else if(Ext.type(s[i]) == 'number'){
                if(s[i] === 0) {
                    left[left.length] = nl;
                    right[right.length] = nl;
                }else{
                    left[left.length] = nlnl;
                    right[right.length] = nlnl;
                }
            }
        }
        
        this.TextAreaLeft.dom.value = left.join('');
        this.TextAreaRight.dom.value = right.join('');
    },
    
    /**
     * Clear Editor, Remove text from both sides
     */
    clearEditors: function(){
        this.TextAreaLeft.dom.value = '';
        this.TextAreaRight.dom.value = '';
        this.document_id = null;
        this.fireEditChange();
    },
    
    /**
     * Event: On Left editor Key Up
     */
    onLeftKeyUp: function(e){
        
        this.adjustTwextEditorSize();
        if(this.leftUpdateTimeoutID){
            clearTimeout(this.leftUpdateTimeoutID);
        }
        this.leftUpdateTimeoutID = this.fireEditChange.defer(350,this);
        this.highlightPos(this.TextAreaLeft);
    },
    
    /**
     * Event: On Right Key Up
     */
    onRightKeyUp: function(){
        
        this.adjustTwextEditorSize();
        if(this.rightUpdateTimeoutID){
            clearTimeout(this.rightUpdateTimeoutID);
        }
        this.rightUpdateTimeoutID = this.fireEditChange.defer(250,this);
        this.highlightPos(this.TextAreaRight);
    },
    
    /**
     * Event: On Left Editor Click
     */
    onLeftClick: function(){
        this.highlightPos(this.TextAreaLeft);
    },
    
    /**
     * On Right Editor Click
     */
    onRightClick: function(){
        this.highlightPos(this.TextAreaRight);
    },
    
    /**
     * Adjust Text and Twext Editor Height By how much text is in the editor. Automatically Grow
     */
    adjustTwextEditorSize: function(){
        var numl = this.TextAreaLeft.getValue().split("\n").length;
        var numr = this.TextAreaRight.getValue().split("\n").length;
        
        var num = Math.max(numl,numr);
        num = num * this.editor_line_height;
        num+=5;
        
        if(num > this.orig_editor_height){
                this.TextAreaLeft.setHeight(num);
                this.TextAreaRight.setHeight(num);
        }else{
                this.TextAreaLeft.setHeight(this.orig_editor_height);
                this.TextAreaRight.setHeight(this.orig_editor_height);
        }
    },
    
    /**
     * Fire an Editor Content Change Event
     */
    fireEditChange: function(){
        this.fireEvent('change', this.TextAreaLeft.getValue(), this.TextAreaRight.getValue());
    },
    
    /**
     * Get Line position in gecko browsers
     */
    getLinePosition_gecko: function(el){
        var pos = el.selectionStart;
        var text = el.value;
        text = text.substring(0,pos);
        var num;
        
        switch(this.chunkStyle){
            case twexter.CHUNKSTYLE_XSCROLL:
                text = twexter.string.str_replace("\n\n","\n \n", text);
                num = text.split("\n").length;
            break;
            case twexter.CHUNKSTYLE_SPACE:
                text = twexter.string.str_replace("\n\n",".  .  .  .", text);
                text = twexter.string.str_replace("\n",".  .  .", text);
                num = text.split("  ").length;
            break;
            default:
                return null;
        }
        
        /*{*/console.log("Chunking Pos: ",num);/*}*/
        return (!isNaN(num)) ? num : null;
    },
    
    /**
     * Get line position in IE browsers
     */
    getLinePosition_ie: function(el){
        //el.focus();
        var range = document.selection.createRange();
        var range_all = document.body.createTextRange();
        range_all.moveToElementText(el);
        for (var sel_start = 0; range_all.compareEndPoints('StartToStart', range) < 0; sel_start ++)
        {
                range_all.moveStart('character', 1);
        }

        // calculate selection end point by moving

        // end of range_all to end of range
        for (var sel_end = el.value.length; range_all.compareEndPoints('EndToEnd', range) > 0; sel_end --)
        {
                range_all.moveEnd('character', -1);

        }
        
        var text = el.value;
        //text = twexter.string.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
         for (var i = 0; i <= sel_start; i ++)
        {
                if (text.charAt(i) == '\n'){
                    sel_start ++;
                }
                
        }
        text = text.substring(0,sel_start);
        var num;
        
        switch(this.chunkStyle){
            case twexter.CHUNKSTYLE_XSCROLL:
                text = twexter.string.str_replace("\n\n","\n \n", text);
                num = text.split("\n").length;
            break;
            case twexter.CHUNKSTYLE_SPACE:
                text = twexter.string.str_replace("\n","  .  ", text);
                num = text.split("  ").length;
            break;
            default:
                return null;
        }
        
        return (!isNaN(num)) ? num : 0;
    },
    
    /**
     * Get the line position in the editor
     *
     * @param mixed HtmlDom/Ext.Element of the editor control
     */
    getLinePosition: function(el){
        if(Ext.type(el)!='element'){
            if(el.dom){
                el = el.dom;
            }else{
                return false;
            }
        }
        if(Ext.isIE){
            return this.getLinePosition_ie(el);
        }else if(Ext.isGecko || Ext.isSafari || Ext.isOpera){
            return this.getLinePosition_gecko(el);
        }
        return false;
    },
    
    /**
     * Set cursor to line position in editor **Buggy**
     */
    setLinePosition: function(el, pos){
        if(Ext.type(el)!='element'){
            if(el.dom){
                el = el.dom;
            }else{
                return false;
            }
        }
        
        if(Ext.isGecko){
            //el.selectionStart = el.selectionEnd = pos;
            pos++;
            el.setSelectionRange(pos,pos);
            
        }else if(Ext.isIE){
            /**var range = el.createTextRange();
            //range.collapse(true);
            alert(pos);
            range.move("character", pos);
            //range.moveEnd("character", pos);
            range.select();**/
            return false;
        }
        
        return true;
    },
    
    /**
     * Change the style for the chunk.. so that the current line editing is being highlighted
     * in output window
     */
    highlightPos: function(el){
        var pos = this.getLinePosition(el);
        if(!isNaN(pos)){
            var obj = Ext.get(this.chunkPrefix+pos);
            if(obj && this.do_highlighting){
                if(this.last_highlight_var){
                    this.last_highlight_var.setStyle({'background-color':'transparent'});
		}
		obj.setStyle({'background-color':'yellow'});
		this.last_highlight_var = obj;
            }
        }
    },
    
    /**
     * Clear the highlighing style change man previously when no longer editing that change
     */
    clearHighlight: function(){
        if(this.last_highlight_var){
            this.last_highlight_var.setStyle({'background-color':'transparent'});
        }
        this.last_highlight_var = null;
    },
    
    /**
     * Unchunk the text in the left editor
     */
    unChunk: function(){
        //console.log(twexter.chucked_into_text(this.TextAreaLeft.getValue()));
        this.TextAreaLeft.dom.value = twexter.chucked_into_text(this.TextAreaLeft.getValue());
    },
    
    /**
     * Chunk the text in the left editor
     */
    chunk: function(length, both, before, after){
        length = length || -1;
        /*{*/console.debug("Running Chunker With Length: %s", length);/*}*/
        
        both = (both.length>0) ? both.split("\n") : [];
        before = (before.length>0) ? before.split("\n") : [];
        after = (after.length>0) ? after.split("\n") : [];
        
        var chunker = new twexter.chunker.WordChunker({
            max_length: length,
            words_before : before,
            words_after : after,
            words_both : both
        });
        
        this.EditMask = new Ext.LoadMask(this.el, {msg:"Please wait...",msgCls:"outMask"});
	this.EditMask.show();
        
        chunker.getChunks(this.TextAreaLeft.getValue(), function(text, oldtext, success){
            
            /*{*/console.debug("Chunk Callback Funtion Called");/*}*/
            
            this.EditMask.hide();
            this.EditMask.destroy();
            this.EditMask = null;
            
            if(success){
                this.TextAreaLeft.dom.value = twexter.clean_text(text);
            }else{
                /*{*/console.debug("Chunking Fialed");/*}*/
                /*{*/console.debug(text);/*}*/
            }
            
            this.fireEditChange();
            
            this.fireEvent('chunkingFinished', this);
            
        }, this);
    },
    
    /**
     * Tranlate the chunks in the left editor
     * and output to right editor
     */
    translate: function(service, sourcecode, langcode){
        
        if(service != 'google' || Ext.isEmpty(sourcecode) || Ext.isEmpty(langcode)){
            return;
        }
        
        var trans = new twexter.translator({
            sourceLang: sourcecode,
            targetLang: langcode,
            errorfn: function(){
                /*{*/console.log("Translation Error Called");/*}*/
                this.EditMask.hide();
                this.EditMask = null;
            },
            callback: function(text){
                /*{*/console.log("Translation Done");/*}*/
                this.EditMask.hide();
                this.EditMask = null;
                if(Ext.isArray(text)){
                    this.setTwxt(text[1]);
                }else{
                    this.setTwxt(text);
                }
                this.fireEditChange();
            },
            scope: this
        });
        
        switch(twexter.detect_chunk_style(this.getText(), this.getTwxt())){
            case twexter.CHUNKSTYLE_SPACE:
                /*{*/console.info("Translating Space");/*}*/
                trans.setText(twexter.spacechunk_to_struct(this.getText(), this.getTwxt(), false), 'space');
            break;
            case twexter.CHUNKSTYLE_XSCROLL:
                /*{*/console.info("Translating Xscroll");/*}*/
                trans.setText(twexter.parse_into_struct(this.getText(),this.getTwxt(), false), 'xscroll');
            break;
            case twexter.CHUNKSTYLE_FLOW:
                /*{*/console.info("Translating Flow");/*}*/
                trans.setText(twexter.flowchunk_to_struct(this.getTwxt(), false), 'flow');
            break;
            default:
                /*{*/console.info("Translating Unknown");/*}*/
                trans.setText(twexter.parse_into_struct(this.getText(),this.getTwxt(), false), 'chunk');
            break;
        }
        
        this.EditMask = new Ext.LoadMask(this.el, {msg:"Translating...",msgCls:"outMask"});
        this.EditMask.show();
        this.setTwxt('');
        trans.tranlate();
    },
    
    /**
     * Get Text Title ** First Line **
     */
    getTextTitle: function(){
        var line1 = '';
        
        var ds = twexter.detect_chunk_style(this.getText(), this.getTwxt());
        
        if(ds != twexter.CHUNKSTYLE_FLOW){
            line1 = this.TextAreaLeft.getValue().split("\n")[0];
        }else{
            line1 = this.TextAreaRight.getValue().split("\n")[0];
        }
        
        if(this.chunkStyle == twexter.CHUNKSTYLE_FLOW || this.chunkStyle == twexter.CHUNKSTYLE_SPACE){
            sp = /\s\s+/ig
            line1 = line1.replace(sp, ' ');
        }
        
        /*{*/console.debug("the text title is: %s", line1);/*}*/
        return line1;
    }
    
};

Ext.extend(twexter.editor, Ext.util.Observable, twexter.editor.prototype);