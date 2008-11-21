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

Ext.namespace("twexter", "twexter.out_tools");

twexter.out_tools = function(output,config){
    twexter.out_tools.superclass.constructor.call(this);
    this.output = output;
    var nconfig = config || {};
    Ext.apply(this,nconfig);
    this.addEvents({
       'font_change': true,
       'font_size_change': true,
       'font_color_change': true,
       'font_weight_change': true,
       'font_space_change': true,
       'font_cap_change' : true
    });
};

twexter.out_tools.prototype = {
    
    el: null,
    tpl: null,
    id: 'output_tool',
    id_table: 'output_tool_table',
    body_id: MAIN_BODY,
    textSizeMin: 10,
    textSizeMax: 30,
    twxtSizeMin: 4,
    twxtSizeMax: 30,
    lineSpaceMin: 5,
    lineSpaceMax: 30,
    twxtLineSpaceMin: -10,
    twxtLineSpaceMax: 7,
    schange: {},
    colors: [['black','Black'],
             ['darkgrey','Dark Grey'],['grey','Grey'],
             ['lightgrey','Light Grey'],['darkblue','Dark Blue'],
             ['blue','Blue'],['lightblue','Light Blue'],
             ['darkred','Dark Red'],['red','Red'],
             ['pink','Pink'],['yellow','Yellow'],
             ['darkgreen','Dark Green'],['green','Green'],
             ['lightgreen','Light Green'],['cornsilk','Corn Silk'],
             ['orange','Orange'],['goldenrod','Golden Rod'],
             ['brickred','Brick Red']
            ],
    boldOptions: [
        ['normal','Normal'],
        ['bold', 'Bold']
    ],
    fontOptions: [
        ['Arial','Arial'],['sans-serif','Sans Serif'],
        ['Helvetica','Helvetica'],['Helvetica Narrow','Helvetica Narrow'],
        ['Lucida','Lucida'],['Times','Times'],
        ['Times New Roman','Times New Roman'],['Bookman','Bookman'],
        ['monospace','Monospace']
    ],
    
    init: function(){
        var nl = "\n";
        this.tpl = new Ext.Template(
            '<div id="{id}">'+nl,
                '<table id={id_table} align="center">'+nl,
                    '<tr>'+nl,
                        '<th><th><th>SIZE</th><th>COLOR</th><th>SPACE</th><th>BOLD</th><th>FONT</th><th>CAPS</th>',
                    '</tr>'+nl,
                    '<tr>'+nl,
                        '<th>TEXT<th><td>{textSize}</td><td>{textColor}</td><td>{textSpace}</td><td>{textBold}</td><td>{textFont}</td><td>{textCap}</td>',
                    '</tr>'+nl,
                    '<tr>'+nl,
                        '<th>twext<th><td>{twxtSize}</td><td>{twxtColor}</td><td>{twxtSpace}</td><td>{twxtBold}</td><td>{twxtFont}</td><td>{twxtCap}</td>',
                    '</tr>'+nl,
                '</table>'+nl,
            '</div>'+nl
        );
        
        this.select_tpl = new Ext.Template('<select id="{id}" name={id}></select>');
        this.select_tpl.compile();
        
        this.tpl.append(this.body_id, {
           id:this.id,
           id_table:this.id_table,
           textSize: this.select_tpl.apply({id:'to_text_size'}),
           textColor: this.select_tpl.apply({id:'to_text_color'}),
           textSpace: this.select_tpl.apply({id:'to_text_space'}),
           textBold: this.select_tpl.apply({id:'to_text_bold'}),
           textFont: this.select_tpl.apply({id:'to_text_font'}),
           twxtSize: this.select_tpl.apply({id:'to_twxt_size'}),
           twxtColor: this.select_tpl.apply({id:'to_twxt_color'}),
           twxtSpace: this.select_tpl.apply({id:'to_twxt_space'}),
           twxtBold: this.select_tpl.apply({id:'to_twxt_bold'}),
           twxtFont: this.select_tpl.apply({id:'to_twxt_font'}),
           textCap: this.select_tpl.apply({id:'to_text_cap'}),
           twxtCap: this.select_tpl.apply({id:'to_twxt_cap'})
        });
        
        this.el = Ext.get(this.id);
        
        this.fillCombos();
        this.init_defaults();
        this.init_events();
    },
    
    fillCombos: function(){
        
        //Text Size
        this.comboTextSize = Ext.get('to_text_size');
        for(var i = this.textSizeMin, x=0 ; i<=this.textSizeMax ; i++, x++){
            this.comboTextSize.dom.options[x] = new Option(i, i, false, false);
        }
        
        //twext size
        this.comboTwxtSize = Ext.get('to_twxt_size');
        for(var i = this.twxtSizeMin, x=0 ; i<=this.twxtSizeMax ; i++, x++){
            this.comboTwxtSize.dom.options[x] = new Option(i, i, false, false);
        }
        
        //Color Options
        this.comboTextColor = Ext.get('to_text_color');
        this.comboTwxtColor = Ext.get('to_twxt_color');
        var xx = 0;
        Ext.each(this.colors, function(item){
            this.comboTextColor.dom.options[xx] = new Option(item[1], item[0], false, false);
            this.comboTwxtColor.dom.options[xx] = new Option(item[1], item[0], false, false);
            xx++;
        }, this);
        
        //Text Line Space
        this.comboLineSpace = Ext.get('to_text_space');
        for(var i = this.lineSpaceMin, x=0 ; i<=this.lineSpaceMax ; i++, x++ ){
            this.comboLineSpace.dom.options[x] = new Option(i, i, false, false);
        }
        
        //twext line space
        this.comboTwextLineSpace = Ext.get('to_twxt_space');
        for(var i = this.twxtLineSpaceMin, x=0 ; i<=this.twxtLineSpaceMax ; i++, x++){
            this.comboTwextLineSpace.dom.options[x] = new Option(i, i, false, false);
        }
        
        //Bold Options
        this.comboTextBold = Ext.get('to_text_bold');
        this.comboTwxtBold = Ext.get('to_twxt_bold');
        xx = 0;
        Ext.each(this.boldOptions, function(item){
            this.comboTextBold.dom.options[xx] = new Option(item[1], item[0], false, false);
            this.comboTwxtBold.dom.options[xx] = new Option(item[1], item[0], false, false);
            xx++;
        }, this);
        
        //Font Options
        this.comboTextFont = Ext.get('to_text_font');
        this.comboTwxtFont = Ext.get('to_twxt_font');
        xx = 0;
        Ext.each(this.fontOptions, function(item){
            this.comboTextFont.dom.options[xx] = new Option(item[1], item[0], false, false);
            this.comboTwxtFont.dom.options[xx] = new Option(item[1], item[0], false, false);
            xx++;
        }, this);
        
        //Cap Options
        this.comboTextCap = Ext.get('to_text_cap');
        this.comboTwxtCap = Ext.get('to_twxt_cap');
        
        this.comboTextCap.dom.options[0] = new Option('Yes', 'uppercase', false, false);
        this.comboTextCap.dom.options[1] = new Option('No', 'none', false, false);
        
        this.comboTwxtCap.dom.options[0] = new Option('Yes', 'uppercase', false, false);
        this.comboTwxtCap.dom.options[1] = new Option('No', 'none', false, false);
    },
    
    init_defaults: function(){
        var lineSpace = Ext.num(parseInt(this.output.getLineSpace(),10), 0);
        if(lineSpace > 0){
            this.comboLineSpace.dom.value = lineSpace;   
        }
        
        try{
            var textInfo = this.output.getChunkTextInfo();
        }catch(e){
            /*{*/console.error(e.message);/*}*/
            return;
        }
        //console.dir(textInfo);
        this.comboTextBold.dom.value = textInfo.weight;
        this.comboTextColor.dom.value = textInfo.color;
        this.comboTextFont.dom.value = textInfo.font;
        this.comboTextSize.dom.value = textInfo.size;
        this.comboTextCap.dom.value = textInfo.transform;
        
        var twxtInfo = this.output.getChunkTwxtInfo();
        this.comboTwxtBold.dom.value = twxtInfo.weight;
        this.comboTwxtColor.dom.value = twxtInfo.color;
        this.comboTwxtFont.dom.value = twxtInfo.font;
        this.comboTwxtSize.dom.value = twxtInfo.size;
        this.comboTwextLineSpace.dom.value = twxtInfo.space;
        this.comboTwxtCap.dom.value = textInfo.transform;
    },
    
    init_events: function(){
        this.comboTextFont.on('change', this.onFontChange.createDelegate(this, [this.comboTextFont, 'text']));
        this.comboTwxtFont.on('change', this.onFontChange.createDelegate(this, [this.comboTwxtFont, 'twxt']));
        this.comboTextSize.on('change', this.onFontSizeChange.createDelegate(this, [this.comboTextSize, 'text']));
        this.comboTwxtSize.on('change', this.onFontSizeChange.createDelegate(this, [this.comboTwxtSize, 'twxt']));
        this.comboTextColor.on('change', this.onFontColorChange.createDelegate(this, [this.comboTextColor, 'text']));
        this.comboTwxtColor.on('change', this.onFontColorChange.createDelegate(this, [this.comboTwxtColor, 'twxt']));
        this.comboTextBold.on('change', this.onFontWeightChange.createDelegate(this, [this.comboTextBold, 'text']));
        this.comboTwxtBold.on('change', this.onFontWeightChange.createDelegate(this, [this.comboTwxtBold, 'twxt']));
        this.comboLineSpace.on('change', this.onFontSpaceChange.createDelegate(this, [this.comboLineSpace, 'text']));
        this.comboTwextLineSpace.on('change', this.onFontSpaceChange.createDelegate(this, [this.comboTwextLineSpace, 'twxt']));
        this.comboTextCap.on('change', this.onCapChange.createDelegate(this, [this.comboTextCap, 'text']));
        this.comboTwxtCap.on('change', this.onCapChange.createDelegate(this, [this.comboTwxtCap, 'twxt']));
    },
    
    setVisible: function(see){
        if(see){
            this.el.show();
        }else{
            this.el.hide();
        }
    },
    
    show: function(){
        this.setVisible(true);
    },
    
    hide: function(){
        this.setVisible(false);
    },
    
    setStyleChange: function(side, selector, event){
       
        if(Ext.type(event) != 'string' || Ext.type(side) != 'string'){ return; }
        
        if(Ext.type(this.schange[side])!='object'){
            this.schange[side] = {};
        }
        
        
        if(!Ext.isArray(this.schange[side][event])){
            this.schange[side][event] = [];
        }
        
        this.schange[side][event].push(selector);
    },
    
    doStyleChange: function(side, event, name, value){
        
        /*{*/console.dir(this.schange);/*}*/
        /*{*/console.debug("Style change on side: ", side, " for event ", event, " (", name, ":", value, ")");/*}*/
        
        if(Ext.type(this.schange[side]) == 'object' && Ext.isArray(this.schange[side][event])){
            Ext.each(this.schange[side][event], function(i){
                /*{*/console.log("Updating Css Rule ", i, " with ", name, " ", value);/*}*/
                try{
                    Ext.util.CSS.updateRule(i, name, value);
                }catch(e){
                    /*{*/console.error(e.message);/*}*/
                }
            }, this);   
        }
    },
    
    onFontChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {font:val});
        var e = 'font_change';
        var c = (ctl == this.comboTextFont) ? 'text' : 'twxt';
        this.doStyleChange(c, e, 'font-family', val);
        this.fireEvent(e, type, val);
    },
    
    onCapChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {transform:val});
        var e = 'font_cap_change';
        var c = (ctl == this.comboTextCap) ? 'text' : 'twxt';
        this.doStyleChange(c, e, 'text-transform', val);
        this.fireEvent(e, type, val);
    },
    
    onFontSizeChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {size:val});
        var e = 'font_size_change';
        var c = (ctl == this.comboTextSize) ? 'text' : 'twxt';
        this.doStyleChange(c, e, 'font-size', val);
        this.fireEvent(e, type, val);
    },
    
    onFontColorChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {color:val});
        var e = 'font_color_change';
        var c = (ctl == this.comboTextColor) ? 'text' : 'twxt';
        this.doStyleChange(c, e, 'color', val);
        this.fireEvent(e, type, val);
    },
    
    onFontWeightChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {weight:val});
        var e = 'font_weight_change';
        var c = (ctl == this.comboTextBold) ? 'text' : 'twxt';
        this.doStyleChange(c, e, 'font-weight', val);
        this.fireEvent(e, type, val);
    },
    
    onFontSpaceChange: function(ctl, type){
        var val = ctl.getValue();
        this.output.setChunkStyle(type, {space:val});
        this.fireEvent('font_space_change', type, val);
    },
    
    setData: function(type, data, val){
        var tx = "text";
        var tw = "twxt";
        
        /*{*/console.info("change style "+type+' '+data+' '+val);/*}*/
        
        if(data == 'font'){
            if(type==tx) { this.comboTextFont.dom.value = val; }
            else if(type==tw){ this.comboTwxtFont.dom.value = val; }
            this.output.setChunkStyle(type, {font:val});
            this.doStyleChange(type, 'font_change', 'font-family', val);
        }else if(data == 'fontsize'){
            if(type==tx){ this.comboTextSize.dom.value = val; }
            else if(type==tw){ this.comboTwxtSize.dom.value = val; }
            this.output.setChunkStyle(type, {size:val});
            this.doStyleChange(type, 'font_size_change', 'font-size', val);
        }else if(data == 'fontcolor'){
            if(type==tx){ this.comboTextColor.dom.value = val; }
            else if(type==tw){ this.comboTwxtColor.dom.value = val; }
            this.output.setChunkStyle(type, {color:val});
            this.doStyleChange(type, 'font_color_change', 'color', val);
        }else if(data == 'fontweight'){
            if(type==tx){ this.comboTextBold.dom.value = val; }
            else if(type==tw){ this.comboTwxtBold.dom.value = val; }
            this.output.setChunkStyle(type, {weight:val});
            this.doStyleChange(type, 'font_weight_change', 'font-weight', val);
        }else if(data == 'fontspace'){
            if(type==tx){ this.comboLineSpace.dom.value = val; }
            else if(type==tw){ this.comboTwextLineSpace.dom.value = val; }
            this.output.setChunkStyle(type, {space:val});
        }
    },
    
    getEl: function(){
        this.el;
    },
    
    setPosition: Ext.emptyFn
};

Ext.extend(twexter.out_tools,  Ext.util.Observable, twexter.out_tools.prototype);