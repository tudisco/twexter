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

/**
* Twexter Javascript Library
*
* @author Jason Tudisco
*/

//Set up name spaces
Ext.namespace('twexter');
Ext.namespace('twexter.chunker');
Ext.namespace('twexter.exporter');


Ext.applyIf(Array.prototype, {
	
	push: function(){
		var n = this.length >>> 0;
		for (var i = 0; i < arguments.length; i++) {
			this[n] = arguments[i];
			n = n + 1 >>> 0;
		}
		this.length = n;
		return n;
	},
	
	pop: function(){
		var n = this.length >>> 0, value;
		if (n) {
		    value = this[--n];
		    delete this[n];
		}
		this.length = n;
		return value;
	},
	
	removeArr: function(a){
		if(!Ext.isArray(a)){
			return this;
		}
		for(var i=0;i<a.length;i++){
			this.remove(a[i]);
		}
		return this;
	},
	
	unique: function( ) {
		
		var p, i, j, tmp_arr = this;
		for(i = tmp_arr.length; i;){
		    for(p = --i; p > 0;){
			if(tmp_arr[i] === tmp_arr[--p]){
			    for(j = p; --p && tmp_arr[i] === tmp_arr[p];);
			    i -= tmp_arr.splice(p + 1, j - p).length;
			}
		    }
		}
		
		return tmp_arr;
	},
	
	merge: function() {
		var merged = this;
		for (var i = 0; i < arguments.length; i++) {
			merged = merged.concat(arguments[i]);
		}
		return merged;
	},
	
	forEach: function( f ) {
		var j, l = this.length;
		for(var i=0; i<l; i++ ) { if( ( j = this[i] ) ) { f( j ); } }
	}

});

/**
* All twexter string functions are stored here.
*/
twexter.string = {

	/**
	* Trim the spaces from the left and right of a string
	*/
	trim:function(aString){
		var	str = aString.replace(/^\s\s*/, ''),ws = /\s/,i = str.length;
		while (ws.test(str.charAt(--i))){}
		return str.slice(0, i + 1);
	},
	
	rtrim: function(str) {
		return str.replace(/\s+$/,"");
	},
	
	str_pad: function( input, pad_length, pad_string, pad_type ) {
		var half = '', pad_to_go;
		var str_pad_repeater = function(s, len) {
		    var collect = '', i;
		    while(collect.length < len){ collect += s; }
		    collect = collect.substr(0,len);
		    return collect;
		};
		input += '';
		if (pad_type != 'L' && pad_type != 'R' && pad_type != 'B') { pad_type = 'R'; }
		if ((pad_to_go = pad_length - input.length) > 0) {
		    if (pad_type == 'L') { input = str_pad_repeater(pad_string, pad_to_go) + input; }
		    else if (pad_type == 'R') { input = input + str_pad_repeater(pad_string, pad_to_go); }
		    else if (pad_type == 'B') {
			half = str_pad_repeater(pad_string, Math.ceil(pad_to_go/2));
			input = half + input + half;
			input = input.substr(0, pad_length);
		    }
		}
		return input;
	},
	
	/**
	* Word wrap function for shortening line lenght to charator width
	*/
	wordwrap: function( str, int_width, str_break, cut ) {	    
	    var i, j, s;
	    var m = int_width;
	    var b = (!str_break) ? "\n" : str_break;
	    var c = cut;
	    var r = str.split("\n");
		if(m > 0) for(i in r){
		    for(s = r[i], r[i] = ""; s.length > m;
			j = c ? m : (j = s.substr(0, m).match(/\S*$/)).input.length - j[0].length
			|| m,
			r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b : "")
		    );
		    r[i] += s;
		}
		return r.join("\n");

	},
	
	/**
	* Check to see if a string or variable is empty
	*/
	empty: function( mixed_var ) {
		return ( mixed_var === "" || mixed_var === 0   || mixed_var === "0" || mixed_var === null  || mixed_var === false  ||  ( Ext.isArray(mixed_var) && mixed_var.length === 0 ) );
	},
	
	/**
	* Cooler String Replace
	*/
	str_replace: function(search, replace, subject) {     
	    var f = search, r = replace, s = subject;
	    var ra = Ext.isArray(r), sa = Ext.isArray(s), f = [].concat(f), r = [].concat(r), i = (s = [].concat(s)).length;
	 
	    while (j = 0, i--) {
	        while (s[i] = s[i].split(f[j]).join(ra ? r[j] || "" : r[0]), ++j in f){};
	    };
	     
	    return sa ? s : s[0];
	},
	
	/**
	* Strip C slashes from string
	*/
	stripslashes: function( str ) {
		return str.replace('/\0/g', '0').replace('/\(.)/g', '$1');
	}
};

twexter.wikirules = [
	{ rex:/\*([^*]+)\*/g, tmplt:"<strong>$1</strong>" }, //Bold
	{ rex:/_([^_]+)_/g, tmplt:"<em>$1</em>" }, //Italic
	//{ rex:/\^([^^]+)\^/g, tmplt:"<sup>$1</sup>" }, //Super
	//{ rex:/~([^~]+)~/g, tmplt:"<sub>$1</sub>" }, //Sub
	{ rex:/\(-(.+?)-\)/g, tmplt:"<del>$1</del>" }, //Strike Thru?
	{ rex:/\[([^ ,]+)[, ]([^\]]*)\]/g, tmplt:function(a,b,c){return twexter.wikiStore('<a href="'+b+'">'+c+'</a>')} }, //Wiki Link
	{ rex:/((mailto\:|javascript\:|(news|file|(ht|f)tp(s?))\:\/\/)[A-Za-z0-9\.:_\/~%\-+&#?!=()@\x80-\xB5\xB7\xFF]+)/g, tmplt:"<a href=\"$1\">$1</a>" },  // simple uri's ..
	{ rex:/[\.]{3}/g, tmplt:"&#8230;"}, // &hellip;
	{ rex:/---/g, tmplt:"&#8212;" },  // &mdash;
	{ rex:/--/g, tmplt:"&#8211;" }, // &ndash;
	{ rex:/\(c\)/g, tmplt:"&#169;"}, //&copy;
	{ rex:/\(r\)/g, tmplt:"&#174;"} //&register;
]

twexter.wikirules_pre_encode = [
	{ rex:/<->/g, tmplt:function(){return twexter.wikiStore("&#8596;");} }, // $harr;
	{ rex:/<-/g, tmplt:function(){return twexter.wikiStore("&#8592;");} }, // &larr;
	{ rex:/->/g, tmplt:function(){return twexter.wikiStore("&#8594;");} }, //&rarr;
]

twexter.applyWiki = function(str){
	var rules = twexter.wikirules;
	var pre = twexter.wikirules_pre_encode;
	
	if (str && pre){
		for (var i in pre) {
			str = str.replace(pre[i].rex, pre[i].tmplt);
		}
	}
	
	str = str.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');  
	
	if (str && rules){
		for (var i in rules) {
			str = str.replace(rules[i].rex, rules[i].tmplt);
		}
	}
	str = str.replace(/@([0-9]+)@/g, function($0,$1){return twexter.wiki_store[parseInt($1)-1];});
	return str;
}

twexter.wikiStore = function(str){
	if(!Ext.isArray(twexter.wiki_store)){
		twexter.wiki_store = [];
	}
	twexter.wiki_store[twexter.wiki_store.length] = str;
	return '@' + Ext.num(twexter.wiki_store.length,0) + '@';
}

twexter.check_for_space_chunk = function(text){
	var find = '  ';
	if(Ext.type(text) == 'string'){
		if(text.indexOf(find) != -1){
			return true;
		}else{
			return false;
		}
	}
}

twexter.spacechunk_to_struct = function(leftText, rightText, wiki){
	wiki = (wiki===true) ? true : false;
	var sutil = twexter.string;
	leftText = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", leftText);
	rightText = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", rightText);
	
	var tl = leftText.split("\n");
	var tr = rightText.split("\n");
	
	var tl_lines = tl.length;
	var tr_lines = tr.length;
	
	var struct = [];
	var breaks = 0;
	
	var max_lines = Math.max(tl_lines, tr_lines);
	var m = max_lines-1;
	
	for(var i = 0 ; i < max_lines ; i++){
		var cl = (i < tl_lines) ? sutil.rtrim(tl[i]) : '';
		var cr = (i < tr_lines) ? sutil.rtrim(tr[i]) : '';
		
		if(sutil.empty(cl) && sutil.empty(cr)){
			struct.push(1);
			breaks = 1;
			continue;
		}else{
			if(i!=0 && struct[struct.length-1] != 1){
				struct.push(0);
			}
		}
		
		if(wiki){
			cl = twexter.applyWiki(cl);
			cr = twexter.applyWiki(cr);
		}
		
		var ls = cl.split("  ");
		var rs = cr.split("  ");
		
		ms = Math.max(ls.length, rs.length);
		
		for(var x = 0; x < ms ; x++){
			var l_c = (sutil.empty(ls[x])) ? '' : ls[x];
			var r_c = (sutil.empty(rs[x])) ? '' : rs[x];
			struct.push([l_c,r_c]);
		}
		
	}
	
	return struct;
}

/**
* This is the new way tu interaly represent twext documents. Using in php pdf also
*/
twexter.parse_into_struct = function(leftText, rightText, wiki){
	wiki = (wiki===true) ? true : false;
	var sutil = twexter.string;
	//Fix new line for different systems
	leftText = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", leftText);
	rightText = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", rightText);
	
	if(wiki){
		var tl_w = leftText.split("\n\n");
		var tr_w = rightText.split("\n\n");
		var max_w = Math.max(tl_w.length,tr_w.length);
		for(var ii = 0; ii<max_w; ii++){
			if(Ext.type(tl_w[ii])=='string'){
				tl_w[ii] = twexter.applyWiki(tl_w[ii]);
			}
			if(Ext.type(tr_w[ii])=='string'){
				tr_w[ii] = twexter.applyWiki(tr_w[ii]);
			}
		}
		leftText = tl_w.join("\n\n");
		rightText = tr_w.join("\n\n");
	}
	
	var tl = leftText.split("\n");
	var tr = rightText.split("\n");
	
	var tl_lines = tl.length;
	var tr_lines = tr.length;
	
	var struct = [];
	var breaks = 0;
	
	var max_lines = Math.max(tl_lines, tr_lines); 
	
	for(var i = 0 ; i < max_lines ; i++){
		var cl = (i < tl_lines) ? sutil.trim(tl[i]) : '';
		var cr = (i < tr_lines) ? sutil.trim(tr[i]) : '';
		
		//If both lines are empty add a break. 2 breaks = a paragraph.
		if(sutil.empty(cl) && sutil.empty(cr)){
			if(breaks==2){
				struct.push(1);
				breaks = 0;
			}
			breaks++;
			continue;
		}
		
		//Before we add a chunk.. check if we have any breaks. 0 = line break, 1 = paragraph break.
		if(breaks>0){
			struct.push((breaks - 1));
			breaks = 0;
		}
		
		//Add the chunk
		struct.push([cl,cr]);
		
	}
	
	return struct;
}

twexter.CHUNKSTYLE_XSCROLL = 1;
twexter.CHUNKSTYLE_SPACE = 2;
twexter.CHUNKSTYLE_FLOW = 3;

twexter.detect_chunk_style = function(text,twxt){
	if(Ext.isEmpty(text) && Ext.isEmpty(twxt)){
		return twexter.CHUNKSTYLE_XSCROLL;
	}else
	if(Ext.isEmpty(text) && !Ext.isEmpty(twxt) ){
		return twexter.CHUNKSTYLE_FLOW;
	}else
	if(!Ext.isEmpty(text) && !Ext.isEmpty(twxt)){
		//NOTE: SPACE CHUNK DETECTION TURNED back on
		var find = '  ';
		if(Ext.type(text) == 'string'){
			if(text.indexOf(find) != -1){
				return twexter.CHUNKSTYLE_SPACE;
			}else{
				return twexter.CHUNKSTYLE_XSCROLL;
			}
		}
	}
	
}

twexter.struct_to_rtfspecial = function(s){
	if(!(s instanceof Array)) {
		throw "Struct not an array";
	}
	/*{*/console.log("Going to convert to Edit Chunk");/*}*/
	var l = s.length;
	var x=l-1;
	var nt = [],nl=[],nr=[];
	var cl,cr,m,ws;
	var su = twexter.string;
	
	
	for(var i=0; i<l; i++){
		if(!(s[i] instanceof Array)){
			nt.push(su.trim(nl.join('')), "\n", su.trim(nr.join('')));
			nl = [], nr = [];
			
			if(s[i]==0){
				nt.push("\n");
			}else{
				nt.push("\n\n");
			}
		}else{
			cl = (!Ext.isEmpty(s[i][0])) ? su.trim(s[i][0]) : '--';
			cr = (!Ext.isEmpty(s[i][1])) ? su.trim(s[i][1]) : '--';
			ws = parseInt(cr.length/2);
			m = Math.max(cl.length, ws);
			m=m+1;
			if(cl.length > ws){
				cl = su.str_pad(cl, m, " ", 'R');
				cr = su.str_pad(cr, m*2, " ", 'R');
			}else{
				cl = su.str_pad(cl, m, " ", 'R');
				cr = su.str_pad(cr, m*2, " ", 'R');
			}
			
			
			nl.push(cl);
			nr.push(cr);
		}
	}
	
	if(nl.length > 0 || nr.length > 0){
		nt.push(su.trim(nl.join('')), "\n", su.trim(nr.join('')));
	}
	
	return nt.join('');
}

twexter.struct_to_spacechunk = function(struct){
	var su = twexter.string;
	var l = struct.length;
	var nt = [],nw = [],tmpt = '',tmpw = '',n1 = "\n", n2 = "\n\n", s="  ";
	
	for(var i = 0 ; i<l ; i++){
		if(!Ext.isArray(struct[i])){
			if(tmpt != '' || tmpw != ''){
				nt.push(su.rtrim(tmpt));
				nw.push(su.rtrim(tmpw));
				tmpt = ''; tmpw = '';
			}
			if(struct[i]==0){
				nt.push(n1); nw.push(n1);
			}else{
				nt.push(n2); nw.push(n2);
			}
		}else{
			tmpt = tmpt + struct[i][0] + s;
			tmpw = tmpw + struct[i][1] + s;
		}
	}
	if(tmpt != '' || tmpw != ''){
		nt.push(su.rtrim(tmpt));
		nw.push(su.rtrim(tmpw));
	}
	return [nt.join(''),nw.join('')];
}

twexter.chunk_to_spacechunk = function(text,twxt){
	var struct;
	
	if(Ext.isArray(text) && Ext.isEmpty(twxt)){
		struct = text;
	}else{
		struct = twexter.parse_into_struct(text,twxt,false);
	}
	return twexter.struct_to_spacechunk(struct);
}

twexter.struct_to_xscrollchunk = function(struct){
	var su = twexter.string;
	var l = struct.length;
	var x = l-1;
	var nt = [],nw = [],tmpt = '',tmpw = '';n1="\n",n2="\n\n",s='  ';
	
	for(var i = 0 ; i<l ; i++){
		if(!Ext.isArray(struct[i])){
			if(struct[i]==0){
				nt.push(n1); nw.push(n1);
			}else if(struct[i]==1){
				nt.push(n2); nw.push(n2);
			}
		}else{
			nt.push(struct[i][0]);
			nw.push(struct[i][1]);
			
			if(i != x){
				nt.push(n1);
				nw.push(n1);
			}
		}
	}
	return [nt.join(''),nw.join('')];
}

twexter.spacechunk_to_chunk = function(text,twxt){
	var struct;
	
	if(Ext.isArray(text) && Ext.isEmpty(twxt)){
		struct = text;
	}else{
		struct = twexter.spacechunk_to_struct(text,twxt,false);
	}
	
	return twexter.struct_to_xscrollchunk(struct);
}

twexter.struct_to_flowchunk = function(s){
	if(!(s instanceof Array)) {
		throw "Struct not an array";
	}
	/*{*/console.log("Going to convert to Edit Chunk");/*}*/
	var l = s.length;
	var x=l-1;
	var nt = [],nl=[],nr=[];
	var cl,cr,m;
	var su = twexter.string;
	
	
	for(var i=0; i<l; i++){
		if(!(s[i] instanceof Array)){
			nt.push(su.trim(nl.join('')), "\n", su.trim(nr.join('')));
			nl = [], nr = [];
			
			if(s[i]==0){
				nt.push("\n");
			}else{
				nt.push("\n\n");
			}
		}else{
			cl = (!Ext.isEmpty(s[i][0])) ? su.trim(s[i][0]) : '--';
			cr = (!Ext.isEmpty(s[i][1])) ? su.trim(s[i][1]) : '--';
			m = Math.max(cl.length, cr.length);
			m=m+2;
			cl = su.str_pad(cl, m, " ", 'R');
			cr = su.str_pad(cr, m, " ", 'R');
			nl.push(cl);
			nr.push(cr);
		}
	}
	
	if(nl.length > 0 || nr.length > 0){
		nt.push(su.trim(nl.join('')), "\n", su.trim(nr.join('')));
	}
	
	return nt.join('');
	
}

twexter.flowchunk_to_struct = function(t, wiki){
	wiki = (wiki===true) ? true : false;
	var sp = /\s\s+/i;
	var su = twexter.string;
	t = su.trim(t);
	//Fix new line for different systems
	text = su.str_replace(["\r\n", "\n\r", "\r"], "\n", t);

	var tl = text.split("\n");
	
	var ml = tl.length;
	var mx = ml-1;
	
	var struct = [];
	
	for(var i = 0 ; i < ml ; i=i+2){
		var nxt = i+1;
		//If both lines are empty add a break. 2 breaks = a paragraph.
		ts = (Ext.type(tl[i])=='string') ? su.trim(tl[i]) : '';
		if(Ext.isEmpty(ts)){
			struct.push(1);
			i--;
			continue;
		}
		
		var ll = (i < ml && Ext.type(tl[i])=='string') ? su.trim(tl[i]) : '';
		var lr = (i+1 < ml && Ext.type(tl[nxt])=='string') ? su.trim(tl[nxt]) : '';
		
		if(wiki){
			ll = twexter.applyWiki(ll);
			lr = twexter.applyWiki(lr);
		}
		
		var cla = ll.split(sp);
		var cra = lr.split(sp);
		var cm = Math.max(cla.length, cra.length);
		
		for(var ii = 0; ii < cm; ii++){
			var cl = su.empty(cla[ii]) ? '' : cla[ii];
			var cr = su.empty(cra[ii]) ? '' : cra[ii];
			struct.push([cl,cr]);
		}
		
		if(i<mx && !su.empty(tl[nxt+1])){
			struct.push(0);
		}
		
	}
	return struct;
}

twexter.struct_to_sourceText = function(s, text){
	
	text = (text===false) ?  false : true;
	idx = text ? 0 : 1;
	
	if(!(s instanceof Array)){
		throw "Arg1 in not an array";
	}
	
	var l = s.length;
	var x = l-1;
	var nt = [];
	
	for(var i = 0; i<l ; i++){
		if(!Ext.isArray(s[i])){
			if(s[i]==0){
				nt.push("\n");
			}else{
				nt.push("\n\n");
			}
		}else{
			nt.push(s[i][idx]);
			
			if(i != x){
				nt.push("\n");
			}
		}
	}
	
	return nt.join('');
}

twexter.chucked_into_text = function(text){
	var sutil = twexter.string;
	text = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
	var ar = text.split("\n");
	var nl_count = 0;
	var ret = [];
	
	for(var i=0; i < ar.length ; i++){
		if(sutil.empty(ar[i])){
			ret.push("\n");
		}else{
			ret.push(ar[i]);
			if(!Ext.isEmpty(ar[i+1]))
				ret.push(' ');
		}
	}
	
	return ret.join('');
}

twexter.spacechunk_to_text = function(text){
	var sutil = twexter.string;
	text = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
	text = sutil.str_replace("  ", " ", text);
	return text;
}

twexter.clean_text = function(text){
	var sutil = twexter.string;
	text = sutil.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
	var ar = text.split("\n");
	var r = [];
	for(var i=0; i<ar.length; i++){
		r.push(sutil.trim(ar[i]));
	}
	return r.join("\n");
}

/**
* Export to HTML
*/
twexter.exporter.html = function(config){
	var nconfig = config || {};
	Ext.apply(this, nconfig);
};

twexter.exporter.html.prototype = {
	
	tpl_box: "<div class=\"twext-box\">{paras}</div>",
	tpl_paras: "<div class=\"twext-para\">{lines}</div>",
	tpl_line: "<div class=\"twext-line\" style=\"height: 32px;\">{chunks}</div>",
	tpl_chunk: "<span class=\"twext-chunk\">{text}{twext}</span>",
	tpl_chunk_el: "<span><span class=\"{class}\">{text}</span></span>",
	text_class: "twext-text",
	twext_class: "twext-twxt",
	
	c_tpl_box:null,
	c_tpl_paras:null,
	c_tpl_line:null,
	c_tpl_chunk:null,
	c_tpl_chunk_el:null,
	
	
	/**
	* Return HTML from twext struct
	* 
	* @var array twextStruct
	* @return string html
	*/
	getOutput:function(twextStruct, recache){
		//Lets prepare are templates (Need to investigate how to get this to work in XTemplates, much better)
		if(!twextStruct) return '';
		recache = (recache===true) ? true : false;
		
		if(recache || (this.c_tpl_box==null || this.c_tpl_paras==null || this.c_tpl_chunk==null || this.c_tpl_chunk_el==null)){
			var tpl_box = new Ext.Template(this.tpl_box);
			this.c_tpl_box = tpl_box = tpl_box.compile();
			var tpl_paras = new Ext.Template(this.tpl_paras);
			this.c_tpl_paras = tpl_paras = tpl_paras.compile();
			var tpl_line = new Ext.Template(this.tpl_line);
			this.c_tpl_line = tpl_line = tpl_line.compile();
			var tpl_chunk = new Ext.Template(this.tpl_chunk);
			this.c_tpl_chunk = tpl_chunk = tpl_chunk.compile();
			var tpl_chunk_el = new Ext.Template(this.tpl_chunk_el);
			this.c_tpl_chunk_el =  tpl_chunk_el = tpl_chunk_el.compile();
		}else{
			var tpl_box = this.c_tpl_box;
			var tpl_paras = this.c_tpl_paras;
			var tpl_line = this.c_tpl_line;
			var tpl_chunk = this.c_tpl_chunk;
			var tpl_chunk_el = this.c_tpl_chunk_el;
		}
		
		var twext_class = this.twext_class;
		var text_class = this.text_class;
		
		var html = [];
		var chunks = [];
		var lines = [];
		var paras = [];
		
		var linenum = 1;
		var chunknum = 0;
		
		for(var i = 0 ; i < twextStruct.length ; i++){
			chunknum++;
			
			var chunk = twextStruct[i];
			
			if(Ext.isEmpty(chunk) || (!Ext.isArray(chunk) && isNaN(chunk))){
				throw "Error en structured twext document";
			}
			
			if(Ext.isArray(chunk)){
				var t = (!Ext.isEmpty(chunk[0])) ? chunk[0] : '&nbsp;';
				var w = (!Ext.isEmpty(chunk[1])) ? chunk[1] : '&nbsp;';
				
				//This screws up links - No space check in html tags... somthing like this needed.
				//t = twexter.string.str_replace(' ', '&nbsp;', t);
				//w = twexter.string.str_replace(' ', '&nbsp;', w);
				
				var text = tpl_chunk_el.apply({'class':text_class,text:t});
				var twext = tpl_chunk_el.apply({'class':twext_class,text:w});
				html.push(tpl_chunk.apply({text:text,twext:twext,chunknum:chunknum}));
			}else{
				if(chunk==0){
					linenum++;
					html.push(tpl_line.apply({chunks:'',linenum:linenum}));
				}else{
					chunknum++;
					linenum=linenum+2;
					html.push(tpl_paras.apply({lines:'',linenum:linenum}));
				}
			}
			
		}
		
		return tpl_box.apply({paras:html.join(' ')});
		
	}
	
};

/**
* Chunk by line width
*
* Config:
*	Width - Max Chars
*/
twexter.chunker.WidthChunker = function(config){
	var nconfig = config || {};
	Ext.apply(this, nconfig);
};

twexter.chunker.WidthChunker.prototype = {
	width:30,
	
	getChunked:function(text){
		this.finalText = this.chunkit(text,this.width);
		return this.finalText;
	},
	
	chunkit:function(text,width, fromText){
		var s = twexter.string;
		text = s.str_replace(["\r\n", "\n\r", "\r"], "\n", text);
		if(fromText===true){
			text = s.str_replace("\n\n", "[+]-{+}", text);
			text = s.str_replace("\n", "\n\n", text);
			text = s.str_replace("[+]-{+}", "\n\n\n", text);
		}
		return s.wordwrap(text,width,"\n",false);
	}
};

/**
* Chunk By Words
*/
twexter.chunker.WordChunker = function(config){
	var nconfig = config || {};
	Ext.apply(this, nconfig);
};


//This is going to change to call server function. Empty For Now.
twexter.chunker.WordChunker.prototype = {
	words_before: [],
	words_after: [],
	words_both: [],
	max_length: -1,
	callback: null,
	scope: null,
	
	getChunks: function(text, callback, scope){
		this.oldText = text;
		this.useCallback = callback || this.callback;
		this.useScope = scope || this.scope;
		
		var ac = {
			url: '/rpc/chunk.php',
			success: this.success,
			failure: this.failure,
			scope: this,
			params: {
				text:text,
				wboth:Ext.encode(this.words_both),
				wb:Ext.encode(this.words_before),
				wa:Ext.encode(this.words_after),
				len:this.max_length
			}
		}
		
		Ext.Ajax.request(ac);
	},
	
	success: function(rep){
		try{
			if(rep && rep.responseText){
				rep = Ext.decode(rep.responseText);
				if(rep.success==false){
					throw("Chunking was unsuccessful: "+rep.message);
				}
				if(Ext.type(this.useCallback)=='function'){
					if(Ext.type(this.useScope)=='object'){
						this.useCallback.call(this.useScope, rep.text, this.oldText, true);
					}else{
						this.useCallback.call(this, rep.text, this.oldText, true);
					}
				}
			}else{
				this.failure();
			}
		}catch(e){
			/*{*/console.debug("Error chunking text");/*}*/
			/*{*/console.dir(e);/*}*/
			this.failure();
		}
	},
	
	failure: function(rep){
		if(Ext.type(this.useCallback)=='function'){
			if(Ext.type(this.useScope)=='object'){
				this.useCallback.call(this.useScope, null, this.oldText, false);
			}else{
				this.useCallback.call(this, null, this.oldText, false);
			}
		}
		
	}
};

/**
* Chunk by english words. Extends word chunker.
*/
twexter.chunker.EnglishWordChunker = function(config){
		
	this.words_before = ['i','your', 'are','to','under','on','at','of','you','your','as','so','my','is','too','she','he','in','by','has'];
	this.words_after = ['then','it','with','but','me'];
	this.words_both = ['who', 'what', 'where', 'how', 'when', 'why', 'which', 'whose', 'and', 'that','if','now','for','whenever','without','in'];
	var nconfig = config || {};
	Ext.apply(this, nconfig);
};

Ext.extend(twexter.chunker.EnglishWordChunker, twexter.chunker.WordChunker);
