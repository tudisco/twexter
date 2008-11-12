Ext.namespace("twexter", "twexter.translator");

twexter.translator = function(config){
    n = config || {};
    Ext.apply(this, n);
}

twexter.translator.prototype = {
    
    text: null,
    textType: null,
    sourceLang: null,
    targetLang: null,
    callback: null,
    errorfn: null,
    maxSliceSize: 499,
    slicedText: null,
    scope: null,
    
    setText: function(struct, text_type){
        this.textType =  text_type || 'space';
        if(Ext.isArray(struct)){
            this.text = struct;
        }else{
            throw "arg1 must be array";
        }
    },
    
    setSourceLang: function(lang){
        this.sourceLang = (Ext.type(lang)=='string') ? lang : null;  
    },
    
    getSourceLang: function(){
        return this.sourceLang;
    },
    
    setTargetLang: function(lang){
        this.targetLang = (Ext.type(lang)=='string') ? lang : null;
    },
    
    getTargetLang: function(){
        return this.targetLang;
    },
    
    setTransLangs: function(sourceLang, target){
        this.setSourceLang(sourceLang);
        this.setTargetLang(target);
    },
    
    convertSpaceToScroll: function(text){
        return twexter.spacechunk_to_chunk(text);    
    },
    
    convertScrollToSpace: function(text){
        return twexter.chunk_to_spacechunk(text);
    },
    
    setCallBack: function(fn){
        this.callback = fn;
    },
    
    _sliceText: function(text){
        var ttextp = text.split("\n\n\n");
        var newtexta = [];
        var tt_c = ttextp.length;
        var tt_d = 0;
        ttextp.forEach(function(i){
            tt_d++;
            if(i.length > this.maxSliceSize){
                var t = i.split("\n\n");
                var t_c = t.length;
                var t_d = 0;
                t.forEach(function(a){
                    t_d++;
                    if(a.length > this.maxSliceSize){
                        var t2 = a.split("\n");
                        var t2_c = t2.length;
                        var t2_d = 0;
                        t2.forEach(function(b){
                            if(t_d < t_c){ newtexta.push(b+"\n"); }
                            else { newtexta.push(b+"\n\n"); }
                        });
                    }else{
                        if(t_d < t_c) { newtexta.push(a+"\n\n"); }
                        else { newtexta.push(a+"\n\n\n"); }
                    }
                });
            }else{
                if(tt_d < tt_c){ newtexta.push(i+"\n\n\n"); }
                else{ newtexta.push(i); }
            }
        });
        //-----------------  Wow that probably can be done better.. jaja.
        /*{*/console.debug(newtexta);/*}*/
        this.slicedText = newtexta;
    },
    
    tranlate: function(){
        if(Ext.isEmpty(this.sourceLang) || Ext.isEmpty(this.targetLang)){
            alert("Target or Source Language not Supported");
            this.translationError();
            return;
        }
        this.translatedText = [];
        var isText = (this.textType=='flow') ? false : true;
        this.sourceText = twexter.struct_to_sourceText(this.text);
        this._sliceText(this.sourceText);
        var count = this.slicedText.length;
        var cdone = 0;
        //var self = this;
        
        for(var i=0 ; i<count ; i++){
            google.language.translate({text:this.slicedText[i],type:'text'}, this.sourceLang, this.targetLang, function(){
                cdone++;
                var res = arguments[0];
                var slice_idx = arguments[1];
                if(res && res.error){
                    this.translationError(res);
                }else{
                    this.translatedText[slice_idx] = twexter.clean_text( res.translation );
                }
                if(cdone==count){
                    this.translationDone();
                }
            }.createDelegate(this, [i], true));
        }
    },
    
    translationError: function(res){
        alert("Google Ttranslation Error: "+res.error.message);
        /*{*/console.debug("Googgle Error: %s %s", res.error.code, res.error.message);/*}*/
        if(Ext.type(this.errorfn) == 'function'){
            if(Ext.type(this.scope) == 'object'){
                this.errorfn.call(this.scope);
            }else{
                this.errorfn();
            }
        }
    },
    
    translationDone: function(){
        
        var trans = this.translatedText.join('');
        var tt;
        switch(this.textType){
            case 'xscroll':
                tt = [this.sourceText,trans];
                break;
            case 'space':
                tt = twexter.chunk_to_spacechunk(this.sourceText,trans);
                break;
            case 'flow':
                var s = twexter.parse_into_struct(this.sourceText,trans);
                tt = twexter.struct_to_flowchunk(s);
        }
        
        if(Ext.type(this.callback) == 'function'){
            if(Ext.type(this.scope) == 'object'){
                this.callback.call(this.scope, tt);
            }else{
                this.callback(tt);
            }
        }
    }
}