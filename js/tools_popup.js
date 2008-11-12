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

Ext.namespace('twexter', 'twexter.tools_popup');

/**
 * Editor Tools / Settings Popup
 */
twexter.tools_popup = function(config){
    twexter.tools_popup.superclass.constructor.call(this);
    var n = config || {};
    Ext.apply(this, n);
    this.addEvents({
	"unchunk" : true,
        "rechunk" : true,
        "translate": true
    });
    this.init();
};

twexter.tools_popup.prototype = {
    
    el:null,
    tpl:null,
    id:'tools_popup',
    bodyId: MAIN_BODY,
    
    /**
     * Init Control
     */
    init: function(){
        //If we don't have a template create one
        if(Ext.isEmpty(this.tpl)){
            nl = "\n";
            this.tpl = new Ext.Template(
                nl,
                '<div id="{id}" class="{id}">',
                    '<div id="{id}_chunk" class="{id}_chunk">',
                        '<div class="chunk_length">Chunk Width:',
                            '<select id="{id}_chunk_len"></select>',
                        '</div>',
                        '<div id="{id}_chunk_start" class="chunk_start">',
                            'Chunk',
                        '</div>',
                        '<div id="{id}_chunk_undo" class="chunk_undo">',
                            'UnChunk',
                        '</div>',
                        '<div id="{id}_chunk_optbutt" class="chunk_optbutt">',
                            '<<<',
                            //'',
                        '</div>',
                    '</div>',
                    '<div id="{id}_trans" class="{id}_trans">',
                        'Translate:',
                        '<select id="{id}_sel_trans"></select>',
                    '</div>',
                    '<div style="clear:both;></div>"',
                    '<div id="{id}_chunk_options" class="{id}_chunk_options">',
                        '<div class="chunk_both"><div>Both:</div><textarea id="{id}_chunk_both"></textarea></div>',
                        '<div class="chunk_before"><div>Before:</div><textarea id="{id}_chunk_before"></textarea></div>',
                        '<div class="chunk_after"><div>After:</div><textarea id="{id}_chunk_after"></textarea></div>',
                    '</div>',
                '<div>'
            );
        }
        
        //Append Template to body
        this.tpl.append(this.bodyId, {
            id:this.id
        });
        
        this.el = Ext.get(this.id);
        this.comboLength = Ext.get(this.id+'_chunk_len');
        this.comboTrans = Ext.get(this.id+'_sel_trans');
        this.chunkOptions = Ext.get(this.id+'_chunk_options');
        
        //this.el.setLeft(COL_LEFT_SIZE);
        
        this.fillLengthCombo();
        this.fillTransCombo();
        this.fillTextBoxes();
        this.init_events();
        
        var lang = SIMPLE.getSourceLang();
        this.setLanguage(lang);
    },
    
    init_events: function(){
        this.unchunk = Ext.get(this.id+'_chunk_undo');
        this.unchunk.on('click', function(){
            this.fireEvent('unchunk', this);
        }, this);
        
        this.rechunk = Ext.get(this.id+'_chunk_start');
        this.rechunk.on('click', function(){
            this.fireEvent('rechunk', this, this.comboLength.getValue(), this.TextAreaBoth.getValue(), this.TextAreaBefore.getValue(), this.TextAreaAfter.getValue());
        }, this);
        
        this.chunkOptButt = Ext.get(this.id+'_chunk_optbutt');
        this.chunkOptButt.on('click', this.onOptButtClick, this);
        
       // this.comboTrans.on('change', this.onComboTransChange, this);
    },
    
    fillLengthCombo: function(){
        var max = 50;
        var min = 15;
        var sel = 22;
        this.comboLength.dom.options[0] = new Option('None', -1, false, false);
        for(var i = 15, idx = 1 ; i<max ; i++ , idx++){
            if(i!=sel){
                this.comboLength.dom.options[idx] = new Option(i,i,false,false);
            }else{
                this.comboLength.dom.options[idx] = new Option(i,i,true,true);
            }
            
        }
    },
    
    fillTransCombo: function(){
        this.comboTrans.dom.options[0] = new Option('None', 'none', false, true);
        this.comboTrans.dom.options[1] = new Option('Google', 'google', false, false);
    },
    
    fillTextBoxes: function(){
        this.TextAreaBoth = Ext.get(this.id+'_chunk_both');
        this.TextAreaBefore = Ext.get(this.id+'_chunk_before');
        this.TextAreaAfter = Ext.get(this.id+'_chunk_after');
        /*this.TextAreaBefore.dom.value = ['i','your', 'are','to','under','on','at','of','you','your','as','so','my','is','too','she','he','in','by','has','each','after'].join("\n");
        this.TextAreaBoth.dom.value = ['who', 'what', 'where', 'how', 'when', 'why', 'which', 'whose', 'and', 'that','if','now','for','whenever','without','in','one','two','three'].join("\n");
        this.TextAreaAfter.dom.value = ['then','it','with','but','me'].join("\n");*/
    },
    
    clearTextBoxes: function(){
        this.TextAreaBefore.dom.value = '';
        this.TextAreaBoth.dom.value = '';
        this.TextAreaAfter.dom.value = '';
    },
    
    setLanguage: function(lang){
        this.clearTextBoxes();
        if(lang=="english"){
            this.TextAreaBefore.dom.value = ['i','your', 'are','to','under','on','at','of','you','your','as','so','my','is','too','she','he','in','by','has','each','after'].join("\n");
            this.TextAreaBoth.dom.value = ['who', 'what', 'where', 'how', 'when', 'why', 'which', 'whose', 'and', 'that','if','now','for','whenever','without','in','one','two','three'].join("\n");
            this.TextAreaAfter.dom.value = ['then','it','with','but','me'].join("\n");
        }
    },
    
    show: function(){
        this.el.show();
    },
    
    hide: function(){
        this.chunkOptions.hide();
        this.el.hide();
    },
    
    chunkingFinished: function(){
        var trans = this.comboTrans.getValue();
        
        if(trans != 'none'){
            this.fireTranslate();
        }
    },
    
    fireTranslate: function(){
        if(LANG_GOOG_API===false){
            alert("Google Api has not loaded, please try again");
        }else{
            if(!Ext.isEmpty(LANG_TRANS_CODE) && !Ext.isEmpty(LANG_SOURCE_CODE)){
                this.fireEvent('translate', this, 'google', LANG_SOURCE_CODE, LANG_TRANS_CODE);
            }else{
                alert("Source or Target languge not supported");
            }
        }
        //this.comboTrans.dom.value = 'none';
    },
    
    onOptButtClick: function(){
        if(this.chunkOptions.isVisible()){
            this.chunkOptions.hide();
            this.el.setHeight(100);
            this.chunkOptButt.update("<<<");
        }else{
            this.chunkOptions.show();
            this.el.setHeight(400);
            this.chunkOptButt.update(">>>");
        }
    }
    
};

Ext.extend(twexter.tools_popup, Ext.util.Observable, twexter.tools_popup.prototype);