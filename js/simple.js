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

Ext.namespace('twexter', 'twexter.simple');

/** Main Application Controler */
twexter.xnavui = function(){
	twexter.xnavui.superclass.constructor.call(this);
	this.addEvents({
		"show_editor": true,
		"show_login": true
	});
};

twexter.xnavui.prototype = {
	
	/** Current State !! Not Being Used */
	state: null,
	/** The Current Alignment of the output window */
	output_align: 'c',
	/** Xbutton Control */
	xbutton: null,
	/** Output Control */
	output: null,
	/** Editor Control */
	editor:null,
	/** If we are authinicated !! I believe this is not currently used */
	authinicated: false,
	/** html exporter, the class that converts twext to html */
	htmlExporter: null,
	/** the main html body tag id */
	bodyId: MAIN_BODY,
	/** if we should preform live updates */
	liveUpdate: true,
	/** If editor has changed or not */
	editor_has_changed: false,
	/** The html template to use to product output in the output window */
	htmlTpl: {
			tpl_box:"{paras}",
			tpl_line: "{chunks}<div class=\"line-break\"></div><div id=\"line_num{linenum}\"></div>",
			tpl_paras: "{lines}<div class=\"para-break\"></div>",
			tpl_chunk: "<div id=\"ch_l{chunknum}\" class=\"chunk x-unselectable\">{text}{twext}</div>",
			tpl_chunk_el: "<div class= \"{class}\">{text}</div>",
			text_class: "text",
			twext_class: "twext"
		},
	
	/** The function that starts the application */
	init: function(){
		
		
		//Load Google Language API
		google.load("language", "1", {callback:function(){
			LANG_GOOG_API = true;
			/*{*/console.debug("***GOOGLE API LOADED***");/*}*/
		}});
		
		//TODO: Remove This
		window.onresize = this.onResize.createDelegate(this, []);
		/*{*/console.info("starting application");/*}*/
		
		//Create the layout class
		this.uiviews = new twexter.uiviews({views:VIEW_STATES});
		this.uiviews.setView("doc_nourl");
		
		//Create the top tool bar
		this.topButtonBar = new twexter.top_tool_bar();
		this.uiviews.addCtrl('menubar', this.topButtonBar);
		
		this.init_login();
		this.init_urlLinkButt();
		this.init_xbutton();
		this.init_output();
		this.init_editor();
		this.init_comments();
		this.init_sidebar();
		this.init_data();
		
		this.init_general_events();
		
		this.init_keys();
		
		//Cuasing to many errors
		//this.init_finder();
		
		this.uiviews.positionControls();
		
		if(USER_LOGED_IN){
			this.onUserAuth(null, USER_DATA.userid, USER_DATA.name_first, USER_DATA.name_last);
		}
		
		if(this.data.gotofinder === true){
			this.xbutton.setButtonState('r', 1);
		}
	},
	
	/** Initialize general events */
	init_general_events: function(){
		//TODO: need to add new menu here
		
		//this.newDocButton = this.topButtonBar.addManualButton('new_doc_butt','',2);
		//this.topButtonBar.setButtonMarginLeft(0,5);
		//this.topButtonBar.posButtons();
		//this.newDocButton.on('click', this.onNewDocument, this);
		
		var hc = "topButtonHi";
		
		this.topNewDocButton = this.topButtonBar.addManualButton('TopNewButton','TopNewButton','NEW',5);
		disableSelection(this.topNewDocButton.dom);
		this.topNewDocButton.addClassOnOver(hc);
		this.topNewDocButton.on('click', this.onNewDocument, this);
		
		this.topStyleButton = this.topButtonBar.addManualButton('TopStyleButton','TopStyleButton','STYLE',4);
		disableSelection(this.topStyleButton.dom);
		this.topStyleButton.addClassOnOver(hc);
		this.topStyleButton.on('click', function(){
			this.xbutton.setButtonState('b', 1);
		}, this);
		
		this.topTransButton = this.topButtonBar.addManualButton('TopTransButton','TopTransButton','TRANSLATE',8);
		disableSelection(this.topTransButton.dom);
		this.topTransButton.addClassOnOver(hc);
		
		this.topHelpButton = this.topButtonBar.addManualButton('TopHelpButton','TopHelpButton','FEEDBACK',2);
		disableSelection(this.topHelpButton.dom);
		this.topHelpButton.on('click', function(){
			this.uiviews.setView('comments');
			this.uiviews.positionControls();
			this.setMenuSelStyle('TopHelpButton');
		}, this);
		this.topHelpButton.addClassOnOver(hc);
		
		this.topFindButton = this.topButtonBar.addManualButton('TopFindButton','TopFindButton','FIND',3);
		disableSelection(this.topFindButton.dom);
		this.topFindButton.on('click', function(){
			this.xbutton.setButtonState('r', 1);
		}, this);
		this.topFindButton.addClassOnOver(hc);
		
		this.topViewButton = this.topButtonBar.addManualButton('TopViewButton','TopViewButton','VIEW',7);
		disableSelection(this.topViewButton.dom);
		this.topViewButton.on('click', function(){
			this.xbutton.setButtonState('t', 1);
		}, this);
		this.topViewButton.addClassOnOver(hc);
		
		this.topEditButton = this.topButtonBar.addManualButton('TopEditButton','TopEditButton','EDIT',6);
		disableSelection(this.topEditButton.dom);
		this.topEditButton.on('click', function(){
			this.xbutton.setButtonState('l', 1);
		}, this);
		this.topEditButton.addClassOnOver(hc);
		
		
		
	},
	
	init_finder: function(){
		if(this.user_id){
			this.finddlg = new twexter.finder({user_id:this.user_id});
		}
		else{
			this.finddlg = new twexter.finder();
		}
		this.uiviews.addCtrl('finder', this.finddlg);
		this.finddlg.on('hidden', this.onFindDlgHidden, this);
		this.finddlg.on('document_selected', this.onLoadDocument, this);
		this.finddlg.init();
	},
	
	init_sidebar: function(){
		/*{*/console.info("Going to create the sidebar control");/*}*/
		this.sidebar = new twexter.sidebar();
		this.sidebar.init();
		this.uiviews.addCtrl('sidebar', this.sidebar);
		this.uiviews.addCtrlMargin('sidebar', 'b', 10);
		this.uiviews.addCtrlMargin('sidebar', 'l', 10);
		this.sidebar.on('comment_click', function(){
			this.uiviews.setView('comments');
			this.uiviews.positionControls();
			this.setMenuSelStyle('TopHelpButton');
		}, this);
	},
	
	init_comments: function(){
		/*{*/console.info("Going to create the comments control");/*}*/
		this.comments = new twexter.comments();
		this.comments.init();
		this.uiviews.addCtrl('comments', this.comments);
	},
	
	/** Initialize the login button control */
	init_login: function(){
		/*{*/console.info("__Going to add Login Button__");/*}*/
		this.loginbutton = new twexter.login_button();
		this.loginbutton.init();
		this.topButtonBar.addButton(this.loginbutton.getEl(), 1);
		//this.loginbutton.setPos('tr');
		this.loginbutton.on('click', this.onUserLogin, this);
		this.topButtonBar.posButtons();
	},
	
	//TODO: Rename, the url link button control not going to be used
	init_urlLinkButt: function(){
		/*{*/console.info("__Going to add Url Resource Bar__");/*}*/
		
		
		this.topButtonBar.posButtons();	
		
		
		//URL DISPLAY CONTROL
		this.urlDisplay = new twexter.url_link_display();
		this.uiviews.addCtrl('urldisplay', this.urlDisplay);
		
	},
	
	/** Initialize the editor control */
	init_editor: function(){
		//The Editor
		this.editor = new twexter.editor();
		
		this.uiviews.addCtrl('editor', this.editor);
		
		this.editor.init();
		this.editor.setVisible(false);
		this.editor.on('change', this.onEditorChange, this);
		this.editor.on('chunkingFinished', this.onChunkFinish, this);
		
		//Here we can also do the editor toolbar
		this.editor_bar = new twexter.editor_tools();
		
		this.uiviews.addCtrl('editortools', this.editor_bar);
		
		this.editor_bar.init();
		//this.editor_bar.setVisible(false);
		
		this.editor_bar.on('new_document_click', this.onNewDocument, this);
		//this.editor_bar.on('user_click', this.onUserLogin, this);
		this.editor_bar.on('save_document_click', this.onSaveDocument, this);
		
		this.editor_bar.on('lang_switch', this.switchSides, this);
		this.editor_bar.on('options_click', this.onEditorTools, this);
		this.editor_bar.on('print_doc', this.onPrintDoc, this);
		this.editor_bar.on('urllink_change', function(url){
			this.urlDisplay.clearUrl();
			this.urlDisplay.setUrl(url);
			this.doc_url = url;
			this.uiviews.setView('doc_url');
			this.uiviews.positionControls();
			this.setMenuSelStyle(null);
		}, this);
		
		this.editor_bar.comboLeftLang.on('change', this.switchSourceLanguage, this);
		
		//Init Slop Style
		var t = 'text';
		var s = '#edit_toolbar .c_lang_left';
		var o = this.output_bar;
		o.setStyleChange(t,s, 'font_change');
		//o.setStyleChange(t,s, 'font_size_change');
		o.setStyleChange(t,s, 'font_color_change');
		o.setStyleChange(t,s, 'font_weight_change');
		o.setStyleChange(t,s, 'font_cap_change');
		t = 'twxt';
		s = '#edit_toolbar .c_lang_right';
		o.setStyleChange(t,s, 'font_change');
		//o.setStyleChange(t,s, 'font_size_change');
		o.setStyleChange(t,s, 'font_color_change');
		o.setStyleChange(t,s, 'font_weight_change');
		o.setStyleChange(t,s, 'font_cap_change');
		t = 'text';
		s = '.finder_slop_text';
		o.setStyleChange(t,s, 'font_change');
		//o.setStyleChange(t,s, 'font_size_change');
		o.setStyleChange(t,s, 'font_color_change');
		o.setStyleChange(t,s, 'font_weight_change');
		o.setStyleChange(t,s, 'font_cap_change');
		t = 'twxt';
		s = '.finder_slop_twxt';
		o.setStyleChange(t,s, 'font_change');
		//o.setStyleChange(t,s, 'font_size_change');
		o.setStyleChange(t,s, 'font_color_change');
		o.setStyleChange(t,s, 'font_weight_change');
		o.setStyleChange(t,s, 'font_cap_change');
	},
	
	/** Initialize the output control */
	init_output: function(){
		this.output = new twexter.out();
		this.output.init();
		this.uiviews.addCtrl('output', this.output);
		this.pos_output(this.output_align);
		
		//Lets do tool bar also
		this.output_bar = new twexter.out_tools(this.output, {});
		
		this.uiviews.addCtrl('stylecontrol', this.output_bar);
		
		this.output_bar.init();
		//this.output_bar.setVisible(false);
	},
	
	/** Initialize the local data storage control */
	init_data: function(){
		this.data = new twexter.data();
		this.data.init();
		
		//Temp, Set Defualt Languages
		
		this.editor_bar.comboLeftLang.value = 'english';
		this.editor_bar.comboRightLang.value = 'español';
		this.editor_bar.slop_select.last_text_value = 'english';
		this.editor_bar.slop_select.last_twxt_value = 'español';
		
		var s = this.data.getCurrentDocumentStruct();
		this.editor.setTextStruct(s);
		this.htmlExporter = new twexter.exporter.html(this.htmlTpl);
		var html = this.htmlExporter.getOutput(twexter.parse_into_struct(this.editor.getText(), this.editor.getTwxt(), true));
		this.output.update(html);
		
		//Set up events
		this.data.setOutputToolBar(this.output_bar);
		this.data.setEditor(this.editor);
		
		
	},
	
	/** initialize the xbutton control */
	init_xbutton: function(){
		this.xbutton = new twexter.xbutton(null);
		this.xbutton.init();
		
		this.uiviews.addCtrl('xnav', this.xbutton);
		this.uiviews.addCtrlMargin('xnav', 't', 10);
		this.uiviews.addCtrlMargin('xnav', 'l', 10);
		
		//Top
		this.xbutton.setSideActive('t',true,1);
		//this.xbutton.setSideActive('t',true,2);
		//Bottom
		this.xbutton.setSideActive('b',true,1);
		//this.xbutton.setSideActive('b',true,2);
		//left
		this.xbutton.setSideActive('l',true,1);
		this.xbutton.setSideActive('l',true,2);
		//right
		this.xbutton.setSideActive('r',true,1);
		//this.xbutton.setSideActive('r',true,2);
		//Set Events
		this.xbutton.on('selected_none', this.onXnone, this);
		this.xbutton.on('selected_top', this.onXtop, this);
		this.xbutton.on('selected_left', this.onXleft, this);
		this.xbutton.on('selected_right', this.onXright, this);
		this.xbutton.on('selected_bottom', this.onXbottom, this);
	},
	
	init_keys: function(){
		
		var undoEvent = {
			key: Ext.EventObject.Z,
			ctrl: true,
			fn: function(){
				var e = this.editor;
				var t = this.data.doUndo(e.getText(),e.getTwxt());
				if(t!==false){
					e.setTextArray(t);
				}
			},
			scope: this,
			stopEvent: true
		};
			
		var goToEdit = {
			key: Ext.EventObject.F7,
			ctrl: false,
			fn: function(){
				this.xbutton.setButtonState('l', 1);
			},
			scope: this,
			stopEvent: true
		};
		
		var goToEditFull = {
			key: Ext.EventObject.F8,
			ctrl: false,
			fn: function(){
				this.xbutton.setButtonState('l', 2);
			},
			scope: this,
			stopEvent: true
		};
		
		
		var goToView = {
			key: Ext.EventObject.F6,
			ctrl: false,
			fn: function(){
				this.xbutton.setButtonState('t', 1);
			},
			scope: this,
			stopEvent: true
		};
		
		var goToFind = {
			key: Ext.EventObject.F9,
			ctrl: false,
			fn: function(){
				this.xbutton.setButtonState('r', 1);
			},
			scope: this,
			stopEvent: true
		};
		
		var goToComments = {
			key: Ext.EventObject.F10,
			ctrl: false,
			fn: function(){
				//Need button state to be none.
				//this.xbutton.setButtonState('l', 2);
				this.uiviews.setView('comments');
				this.uiviews.positionControls();
			},
			scope: this,
			stopEvent: true
		};
		
		this.keyMapEditorl = new Ext.KeyMap(this.editor.TextAreaLeft.dom, undoEvent);
		this.keyMapEditorr = new Ext.KeyMap(this.editor.TextAreaRight.dom, undoEvent);
		
		this.keyMap = new Ext.KeyMap(document, [
			undoEvent,goToEdit,goToEditFull,goToView,goToFind,goToComments,
			{
				key: Ext.EventObject.S,
				ctrl: true,
				fn: function(){
					this.onSaveDocument();
				},
				scope: this,
				stopEvent: true
			},
			{
				key: Ext.EventObject.F1,
				stopEvent: true,
				fn: function(){
					this.editor_bar.onLangSwitch();	
				},
				scope: this
			},
			{
				key: Ext.EventObject.F2,
				stopEvent: true,
				fn: function(){
					var t,w,tw2,s;
					t = this.editor.getText();
					w = this.editor.getTwxt();
					
					switch(twexter.detect_chunk_style(t,w)){
						case twexter.CHUNKSTYLE_XSCROLL:
							/*{*/console.log("Chunk to Spacechunk");/*}*/
							s = twexter.parse_into_struct(t,w);
							tw2 = twexter.struct_to_spacechunk(s);
							this.editor.setEditorMode(2);
							this.editor.setText(tw2[0]);
							this.editor.setTwxt(tw2[1]);
						break;
						case twexter.CHUNKSTYLE_SPACE:
							/*{*/console.log("Spacechunk to Flow");/*}*/
							s = twexter.spacechunk_to_struct(t,w);
							tw2 = twexter.struct_to_flowchunk(s);
							this.editor.setEditorMode(1);
							this.editor.setText('');
							this.editor.setTwxt(tw2);
						break;
						case twexter.CHUNKSTYLE_FLOW:
							/*{*/console.log("Flow to Chunk");/*}*/
							s = twexter.flowchunk_to_struct(w);
							tw2 = twexter.struct_to_xscrollchunk(s);
							this.editor.setEditorMode(2);
							this.editor.setText(tw2[0]);
							this.editor.setTwxt(tw2[1]);
						break;
						default:
							tw2 = ['',''];
					}
					
					this.editor.fireEditChange();
					
				},
				scope: this
			},
			{
				key: Ext.EventObject.F4,
				stopEvent: true,
				fn: function(){
					if(!Ext.isEmpty(LANG_TRANS_CODE) && !Ext.isEmpty(LANG_SOURCE_CODE)){
						/*{*/console.log("translating by keybinding");/*}*/
						this.onTranslate(this, 'google', LANG_SOURCE_CODE, LANG_TRANS_CODE);
					}
				},
				scope: this
			}
		]);
	},
	
	
	setMenuSelStyle: function(button){
		var color = '#D6D7BD';
		var selcolor = "#000000";
		var css = Ext.util.CSS;
		css.updateRule('.TopNewButton', 'color', color);
		css.updateRule('.TopPrintButton', 'color', color);
		css.updateRule('.TopEditButton', 'color', color);
		css.updateRule('.TopStyleButton', 'color', color);
		css.updateRule('.TopTransButton', 'color', color);
		css.updateRule('.TopHelpButton', 'color', color);
		css.updateRule('.TopFindButton', 'color', color);
		css.updateRule('.TopViewButton', 'color', color);
		if(button!==null){
			css.updateRule('.'+button, 'color', selcolor);
		}
	},
	
	/** On Xbutton Click to None State */
	onXnone: function(){
		/*{*/console.info("** ON X NONE **");/*}*/
		
		this.onEditorChange(this.editor.getText(), this.editor.getTwxt());
		
		//this.hideUrlDisplay();
		this.setMenuSelStyle(null);
		this.liveUpdate = true;
		this.editor.clearHighlight();
		
		//Is there a URL resource available
		if(!Ext.isEmpty(this.urlDisplay.url)){
			this.uiviews.setView('doc_url');
		}else{
			this.uiviews.setView('doc_nourl');
		}
		
		if(this.finddlg){
			this.finddlg.hide();
		}
		this.uiviews.positionControls();
		if(pageTracker){ pageTracker._trackPageview("/actions/view_nosel"); }
	},
	
	/** On Xbutton click to top state */
	onXtop: function(){
		/*{*/console.info("** ON X TOP **");/*}*/
		
		this.onEditorChange(this.editor.getText(), this.editor.getTwxt());
		
		this.setMenuSelStyle("TopViewButton");
		this.liveUpdate = true;
		
		//Is there a URL resource available
		if(!Ext.isEmpty(this.urlDisplay.url)){
			this.uiviews.setView('doc_url');
		}else{
			this.uiviews.setView('doc_nourl');
		}
		
		if(this.finddlg){
			this.finddlg.hide();
		}
		if(pageTracker){ pageTracker._trackPageview("/actions/view"); }
		this.uiviews.positionControls();
	},
	
	/** on Xbutton click to left state */
	onXleft: function(xbtn, count){
		/*{*/console.info("** ON X LEFT **");/*}*/
		
		this.onEditorChange(this.editor.getText(), this.editor.getTwxt());
		
		this.setMenuSelStyle('TopEditButton');
		this.uiviews.setView('edit_preview');

		if (count == 2){
			
			this.uiviews.setView('edit_full');
			
			this.edit_full_screen = true;
			this.liveUpdate = false;
			if(pageTracker){ pageTracker._trackPageview("/actions/slop_edit_full"); }
		}else{
			this.edit_full_screen = false;
			this.liveUpdate = true;
			if(pageTracker){ pageTracker._trackPageview("/actions/slop_edit"); }
		}
		this.uiviews.positionControls();
	},
	
	/** On Xbutton click to right state */
	onXright: function(){
		this.setMenuSelStyle('TopFindButton');
		
		
		this.onEditorChange(this.editor.getText(), this.editor.getTwxt());
		
		/*{*/console.info("** ON X RIGHT **");/*}*/
		this.liveUpdate = true;
		
		if(!this.finddlg){
			
			//Do not need to log in to get to finder.
			//if(!this.user_id || this.user_id === 0 || Ext.isEmpty(this.user_id)){
			//	/*{*/console.info("User not logged on. Need to be logged on to save: "+this.user_id);/*}*/
			//	this.callAfterLogin = this.onXright;
			//	this.onUserLogin();
			//	return;
			//}
			
			/*{*/console.debug("Loading Find Dialog");/*}*/
			
			if(this.user_id){
				this.finddlg = new twexter.finder({user_id:this.user_id});
			}
			else{
				this.finddlg = new twexter.finder();
			}
			this.uiviews.addCtrl('finder', this.finddlg);
			this.finddlg.on('hidden', this.onFindDlgHidden, this);
			this.finddlg.on('document_selected', this.onLoadDocument, this);
			this.finddlg.init();
		}
		
		//Turning this off
		//var stext = this.editor_bar.comboLeftLang.getValue();
		//var stwxt = this.editor_bar.comboRightLang.getValue();
		//this.finddlg.setLang(stext, stwxt);
		
		this.uiviews.setView("finder");
		if(pageTracker){ pageTracker._trackPageview("/actions/finder"); }
		
		
		this.uiviews.positionControls();
	},
	
	/** On Xbutton click to bottom state */
	onXbottom: function(){
		this.setMenuSelStyle('TopStyleButton');
		this.uiviews.setView('style_preview');
		
		this.onEditorChange(this.editor.getText(), this.editor.getTwxt());
		
		/*{*/console.info("** ON X BOTTOM **");/*}*/
		//this.hideUrlDisplay();
		
		//Output Tool Bar
		//this.output_bar.setVisible(true);
		if(pageTracker){ pageTracker._trackPageview("/actions/sytle");}
		
		this.uiviews.positionControls();
	},
	
	pos_urllinkButton : function(){
		/*if(this.user_id){
			var sr = this.userTag.getX();
		}else{
			var sr = this.loginbutton.el.getX();
		}
		
		var uw = this.urlLinkButt.el.getWidth();
		var x = sr-uw;
		console.debug("Url Bar Location: [%s,%s]", x, 0);
		this.urlLinkButt.setPos([x,0]);*/
		
		//TODO: Make sure callafter set for this control in uiviews
		this.topButtonBar.posButtons();
	},
	
	/**
	 * Position Output scrren on resize
	 */
	pos_output: function(align){
		//TODO: this function needs to bu removed
		var bwidth, left, right;
		
		align = align || 'c';
		var el = this.output.getEl();
		
		/*{*/console.info("Align Output To:"+align);/*}*/
		
		if(align=='c' || align=='center'){
		
			/*var w = (bwidth*49)/100;
			var left = w/2;*/
			//var l = this.xbutton.getEl().getWidth() + (XB_POS_LEFT_M*2);
			el.setTop(OUT_POS_TOP_FULL);
			el.setLeft(COL_LEFT_SIZE);
			el.setRight(OUT_POS_MARGIN);
			/*{*/console.log("Out Move L:%s R:%s T:%s", COL_LEFT_SIZE, COL_LEFT_SIZE, OUT_POS_TOP_FULL);/*}*/
			
		}else if(align=='r' || align=='right'){
			
			el.setTop(OUT_POS_TOP+XB_POS_TOP_M);
			bwidth = Ext.getBody().getWidth();
			left = ((bwidth-COL_LEFT_SIZE)/2)+COL_LEFT_SIZE;
			el.setLeft(left);
			el.setRight(OUT_POS_MARGIN);
			/*{*/console.log("Out Move L:%s R:%s T:%s", left, OUT_POS_MARGIN, OUT_POS_TOP+XB_POS_TOP_M);/*}*/
			
		}else if(align=='l' || align=='left'){
			
			el.setTop(OUT_POS_TOP_FULL);
			bwidth = Ext.getBody().getWidth();
			right = (bwidth/2)-10;
			left = 10;
			el.setRight(right);
			el.setLeft(COL_LEFT_SIZE);
			/*{*/console.log("Out Move L:%s R:%s T:%s", left, right,OUT_POS_TOP_FULL);/*}*/
		}
		
		if(this.output_bar && this.output_bar.el.isVisible()){
			el.setBottom(this.output_bar.el.getHeight()+OUT_POS_MARGIN);
		}else{
			el.setBottom(OUT_POS_MARGIN);
		}
		
	},
	
	pos_urlDisplay: function(align){
		//TODO this function needs to be removed
		align = align || 'r';
		var el = this.urlDisplay.getEl();
		
		if(align == 'r' || align == 'right'){
			el.setTop(OUT_POS_TOP_FULL);
			var bwidth = Ext.getBody().getWidth();
			var left = (bwidth/2)+15;
			var right = 10;
			el.setLeft(left);
			el.setRight(right);
			/*{*/console.log("Url Display Move L:%s R:%s", left, right);/*}*/
		}
		
		this.urlDisplay.pos_iframe();
	},
	
	/** Position Editor on resize event */
	pos_editor: function(){
		if(!this.editor.getEl().isVisible()){ return; }
		
		var bwidth = Ext.getBody().getWidth();
		var el = this.editor.getEl();
		var right = ((bwidth-COL_LEFT_SIZE-10)/2)+10;
		//var left = COL_LEFT_SIZE;
		var left = 10;
		
		if(this.edit_full_screen!==true){
			el.setLeft(left);
			el.setRight(right);
			/*{*/console.log("Edit Move L:%s R:%s", 10, right);/*}*/
		}else{
			//el.setLeft(COL_LEFT_SIZE);
			//left = COL_LEFT_SIZE;
			el.setLeft(left);
			el.setRight(10);
			/*{*/console.log("editor is in fullscreen mode");/*}*/
		}
		el.setTop(OUT_POS_TOP+XB_POS_TOP_M);
		
		var elb = this.editor_bar.getEl();
		var editor_width = el.getWidth()+left;
		
		if(this.etools_visible){
			elb.setY(this.editor_tools.el.getY()-10-32);
		}else{
			elb.setY(el.getY()-10-32);	
		}
		
		//Need to wrap around button if in full screen mode.
		//Make room for switch button
		var sww = this.editor_bar.getSwitchButtWidth()/2;
		/*{*/console.debug("Switch Button Width %s", sww);/*}*/
		var button = this.xbutton.getEl();
		var lPlace = ((el.getWidth()/2)+left)-sww;
		var rPlace = ((el.getWidth()/2)+left)+sww;
		
		
		this.editor_bar.setComboLeftTo(lPlace);
		this.editor_bar.setComboRightTo(rPlace);
		this.editor_bar.setRightButtonsTo(editor_width);
		
		elb.setTop(el.getTop()-elb.getHeight()-5);
		
		//IE BUG?? Not sure but we need to get editor size right and without this is doesn't seem to work
		if(Ext.isIE){
			el.setLeft(0);
			el.setLeft(left);
		}
		
	},
	
	/** On window resize event */
	onResize: function(){
		if(!this.resizeTask){
			this.resizeTask = new Ext.util.DelayedTask(this.onResize2, this);
			this.resizeBuffer = 100;
		}
		this.resizeTask.delay(this.resizeBuffer);
	},
	
	/** Delayed resize event */
	onResize2: function(){
		
		this.uiviews.positionControls();
		
		/*{*/console.group("resize event fired");/*}*/
		/*{*/console.time("resize2");/*}*/
		//this.xbutton.setPosition('tl');
		//this.pos_urllinkButton();
		//this.pos_output(this.output_align);
		//this.pos_urlDisplay();
		//this.pos_editor();
		//this.checkEditTools();
		//this.topButtonBar.posButtons();
		/*{*/console.timeEnd("resize2");/*}*/
		console.groupEnd();
	},
	
	/** Event fired when the editor has changed */
	onEditorChange: function(left, right){
		/*{*/
		console.group("editor update");
		console.time("outputUpdate");
		/*}*/
		var s;
		
		if(this.liveUpdate){
			
			var style = twexter.detect_chunk_style(left,right);
			
			switch(style){
				case twexter.CHUNKSTYLE_XSCROLL:
					this.editor.chunkStyle = twexter.CHUNKSTYLE_XSCROLL;
					s = twexter.parse_into_struct(left ,right,true);
				break;
				case twexter.CHUNKSTYLE_SPACE:
					this.editor.chunkStyle = twexter.CHUNKSTYLE_SPACE;
					s = twexter.spacechunk_to_struct(left,right,true);
				break;
				case twexter.CHUNKSTYLE_FLOW:
					this.editor.chunkStyle = twexter.CHUNKSTYLE_FLOW;
					s = twexter.flowchunk_to_struct(right,true);
				break;
			}
			
			this.output.update(this.htmlExporter.getOutput(s));
		}
		//TODO: Should this be here?
		this.editor_has_changed = true;
		
		/*{*/
		console.timeEnd("outputUpdate");
		console.groupEnd();
		/*}*/
	},
	
	/** On new document */
	onNewDocument: function(tb){
		if(this.editor_has_changed === true){
			if(confirm("This document will be lost if not saved. Are you sure you want to create a new document?")){
				this.editor.clearEditors();
				this.editor_has_changed = false;
				if(pageTracker){ pageTracker._trackPageview("/actions/new_doc"); }
			}else{
				this.editor_has_changed = true;
				return;
			}
		}else{
			this.editor.clearEditors();
			this.editor_has_changed = false;
			if(pageTracker){ pageTracker._trackPageview("/actions/new_doc"); }
		}
		if(this.doc_id){ this.doc_id = null; }
		if(this.doc_desc){ this.doc_desc = null; }
		if(this.doc_title){ this.doc_title = null; }
		if(this.doc_version){ this.doc_version = null; }
		if(this.doc_sha1){ this.doc_sha1 = null; }
		if(this.doc_url){ this.doc_url = null; }
		if(this.doc_chunk_style){ this.doc_chunk_style = null; }
		
		this.editor_has_changed = false;
		this.data.clearLastDoc();
		this.data.clearUndo();
		
		//Clear Out Put
		this.output.update('');
		
		this.urlDisplay.clearUrl();
		
		this.xbutton.setButtonState('l', 1);
		
		
		
		//Clear Blank Docid to Controls that need it
		this.comments.setDocId(false, false);
	},
	
	/**
	 *Call on User Login Event
	 */
	onUserLogin: function(){
		/*{*/console.debug("Doing login form");/*}*/
		if(this.authinicated===false){
			if(!this.loginform){
				this.loginform = new twexter.userlogin();
				this.loginform.on('user_authinicated', this.onUserAuth, this);
				this.loginform.init();
			}
			this.loginform.show();
		}
	},
	
	/** Called when user has been authinicated */
	onUserAuth: function(user, id, first, last){
		this.user_id = id;
		this.user_first = first;
		this.user_last = last;
		
		this.userTag = Ext.get(this.bodyId).createChild({
			id:'usertag'
		});
		var users_name = String.format('{0} {1}', first, last);
		if(pageTracker){ pageTracker._trackPageview("/actions/login/"+users_name); }
		var m = Ext.util.TextMetrics.measure(this.userTag, users_name);
		this.userTag.update(users_name);
		this.userTag.setWidth(m.width+USERTAG_W);
		
		//Disable Selection
		disableSelection(this.userTag.dom);
		
		
		this.loginbutton.hide();
		
		this.topButtonBar.addButton(this.userTag, 1);
		
		if(this.callAfterLogin){ this.callAfterLogin(); this.callAfterLogin=false; }
		
		this.editor_bar.slop_select.userLogin(this.user_id);
		if(this.finddlg){
			this.finddlg.userLogin(this.user_id);
		}
		
		//this.pos_urllinkButton();
		this.topButtonBar.posButtons();
		
		//send id to controls that need it
		this.comments.setUserId(this.user_id);
	},
	
	/**
	 *Call on the save document event
	 */
	onSaveDocument: function(){
		
		//Testing now!---!Update Not supported yet... so check
		/*if(this.doc_id){
			alert("Updating still not supported. Comming soon");
			this.savedlg.saveCompleted(false);
			return;
		}*/
		this.hideUrlDisplay();
		if(!this.user_id || this.user_id === 0 || Ext.isEmpty(this.user_id)){
			/*{*/console.info("User not logged on. Need to be logged on to save: "+this.user_id);/*}*/
			this.callAfterLogin = this.onSaveDocument;
			this.onUserLogin();
			return;
		}else{
			/*{*/console.info("User logged in. Loading Save Module: "+this.user_id);/*}*/
			var title = this.editor.getTextTitle();
			if(!this.savedlg){
				this.savedlg = new twexter.savedlg(this.user_id);
				this.savedlg.on('save_document', this.onSaveDocumentToServer, this);
				this.savedlg.init();
				
				if(this.doc_desc){
					this.savedlg.form_desc.dom.value = this.doc_desc;
				}
				
				this.savedlg.show(title);
			}else{
				if(this.doc_desc){
					this.savedlg.form_desc.dom.value = this.doc_desc;
				}
				
				this.savedlg.show(title);
			}
		}
	},
	
	/** when the save docuemnt dialog fires the save_document event */
	onSaveDocumentToServer: function(title, desc, global){
		var data = {};
		data.title = title;
		data.description = desc;
		data.text = this.editor.getText();
		data.twxt = this.editor.getTwxt();
		data.lang_text = this.editor_bar.getTextLang();
		data.lang_twxt = this.editor_bar.getTwxtLang();
		data.global = global;
		
		var s;
		
		switch(twexter.detect_chunk_style(data.text, data.twxt)){
			case twexter.CHUNKSTYLE_XSCROLL:
				data.chunk_style = 'xscroll';
			break;
			case twexter.CHUNKSTYLE_SPACE:
				data.chunk_style = 'space';
				s = twexter.spacechunk_to_struct(data.text, data.twxt);
				s = twexter.struct_to_xscrollchunk(s);
				data.text = s[0];
				data.twxt = s[1];
			break;
			case twexter.CHUNKSTYLE_FLOW:
				data.chunk_style = 'flow';
				s = twexter.flowchunk_to_struct(data.twxt);
				s = twexter.struct_to_xscrollchunk(s);
				data.text = s[0];
				data.twxt = s[1];
			break;
			default:
				data.chunk_style = 'unknown';
			break;
		}
		
		//Check for URL
		var url = this.urlDisplay.getUrl();
		if(!Ext.isEmpty(url)){
			data.url = url;
		}
		
		
		
		if(this.doc_id){
			data.id = this.doc_id;
		}
		
		if(this.doc_sha1){
			data.sha1 = this.doc_sha1;
		}
		
		if(this.doc_id && !isNaN(this.doc_id) && this.doc_sha1){
			data.version = this.doc_version;
		}
		
		/*{*/console.dir(data);/*}*/
		
		
		this.sendDocumentToServer(data);
	},
	
	/** Send Document to server */
	sendDocumentToServer: function(data){
		var ajConfig = {
			url: RPC_SAVE,
   			success: this.sendSuccess,
   			failure: this.sendFail,
   			params: data,
   			method: 'POST',
   			scope: this
		};
		if(pageTracker){ pageTracker._trackPageview("/actions/saving"); }
		Ext.Ajax.request(ajConfig);
	},
	
	/** Called when document was successfully sent to the server and saved */
	sendSuccess: function(rep){
		/*{*/console.info("Save Success Called");/*}*/
		this.onResize2();
		try{
			rep = Ext.decode(rep.responseText);
			if(rep.success === true){
				if(pageTracker){ pageTracker._trackPageview("/actions/save/success"); }
				this.doc_id = rep.docid;
				this.data.setLastLoadedDocument(this.doc_id);
				this.doc_sha1 = rep.sha1;
				this.doc_title = rep.title;
				this.doc_desc = rep.desc;
				this.doc_version = rep.version;
				//alert("Document Saved successfully");
				this.savedlg.saveCompleted(true, rep.docid);
				this.xbutton.changeButtonClass(this.xbutton.ST_RIGHT);
				this.onXright();
				
				//Send Doc IDs to Controls that need it
				this.comments.setDocId(this.doc_id, this.doc_sha1);
				
				return;
			}else{
				alert("Error saving document");
				if(pageTracker){ pageTracker._trackPageview("/actions/save/error"); }
			}
		}
		catch(e){
			alert("Error saving document");
			if(pageTracker){ pageTracker._trackPageview("/actions/save/error"); }
		}
		finally{
			this.savedlg.saveCompleted(false);
		}
		
	},
	
	/** Called when the document has failed to send */
	sendFail: function(){
		this.onResize2();
		/*{*/console.info("Save Fail Called");/*}*/
		alert("Document could not be saved");
		if(pageTracker){ pageTracker._trackPageview("/actions/saving/error"); }
	},
	
	/** Called when the find dialog is hidden, might not be used anymore */
	onFindDlgHidden: function(){
		this.xbutton.resetState();
	},
	
	/** When find dialog fires load document event */
	onLoadDocument: function(docid){
		this.loading_doc_id = docid;
		var ajConfig = {
			url: RPC_LOAD,
			params: {docid:docid},
   			method: 'POST',
   			scope: this,
   			success:this.loadDocumentSuccess,
   			failure:this.loadDocumentFail
		};
		Ext.Ajax.request(ajConfig);
		
		this.OutMask = new Ext.LoadMask(this.output.getEl(), {msg:"Please wait...",msgCls:"outMask"});
		this.OutMask.show();
	},
	
	/** Load document SUccess */
	loadDocumentSuccess: function(rep){
		var text = rep.responseText;
		if(text.length > 3){
			var doc = Ext.decode(text);
			
			this.doc_title = doc.title;
			this.doc_desc = doc.description;
			this.doc_sha1 = doc.sha1;
			this.doc_version = doc.version;
			this.doc_id = this.loading_doc_id;
			this.data.setLastLoadedDocument(this.doc_id);
			this.doc_url = doc.url;
			this.doc_chunk_style = doc.chunk_style;
			delete this.loading_doc_id;
			if(pageTracker){ pageTracker._trackPageview("/actions/open_doc/"+this.doc_id+"/"+this.doc_title); }
			
			//URL Resource Stuff
			this.urlDisplay.clearUrl();
			//this.urlLinkButt.documentLoaded(this.doc_id);
			
			var trans = doc.trans;
			
			var left = [];
			var right = [];
			var chunks;
			
			chunks = trans[0].chunks;
			
			var tmp=[];
			for(var i = 0; i<chunks.length; i++){
				if(!isNaN(chunks[i])){
					if(chunks[i]===0){ tmp[tmp.length] = "\n"; }
					if(chunks[i]===1){ tmp[tmp.length] = "\n\n"; }
				}else{
					tmp[tmp.length] = twexter.string.stripslashes(chunks[i]);
					tmp[tmp.length] = "\n";
				}
			}
			
			if(trans[0].type == 'text'){
				left = tmp;
				this.editor_bar.comboLeftLang.dom.value = trans[0].lang;
			}else{
				right = tmp;
				this.editor_bar.comboRightLang.dom.value = trans[0].lang;
			}
			
			
			tmp = [];
			chunks = trans[1].chunks;
			
			for(var x = 0; x<chunks.length; x++){
				if(!isNaN(chunks[x])){
					if(chunks[x]===0){ tmp[tmp.length] = "\n"; }
					if(chunks[x]===1){ tmp[tmp.length] = "\n\n"; }
				}else{
					tmp[tmp.length] = twexter.string.stripslashes(chunks[x]);
					tmp[tmp.length] = "\n";
				}
			}
			
			if(trans[1].type == 'twxt' || trans[0].type == 'text'){
				right = tmp;
				this.editor_bar.comboRightLang.dom.value = trans[1].lang;
			}else{
				left = tmp;
				this.editor_bar.comboLeftLang.dom.value = trans[1].lang;
			}
			
			this.editor.setText(left.join(''));
			this.editor.setTwxt(right.join(''));
			
			this.data.clearUndo();
			this.data.loadDoc(left.join(''), right.join(''));
			
			this.onEditorChange(left.join(''), right.join(''));
			
			//saveCurrentTextTwext();
			this.OutMask.hide();
			this.OutMask.destroy();
			delete this.OutMask;
			
			//Url Link Stuff
			//this.urlLinkButt.documentNew();
			this.urlDisplay.clearUrl();
			
			if(this.doc_url && !Ext.isEmpty(this.doc_url)){
				//this.urlLinkButt.setUrl(this.doc_url);
				this.editor_bar.setLinkUrl(this.doc_url);
				this.urlDisplay.setUrl(this.doc_url);
			}else{
				this.editor_bar.setLinkUrl('');
			}
			
			//Set docid on controls that need it
			this.comments.setDocId(this.doc_id, this.doc_sha1);
			
			this.onXnone();
			this.editor_has_changed = false;
			
			/*{*/console.info("Chunk Style Loaded is: ", this.doc_chunk_style);/*}*/
			this.setChunkStyle(this.doc_chunk_style);
		}
	},
	
	setChunkStyle: function(style){
		if(style == 'unknown'){
			this.editor.setEditorMode(2, false);
			return;
		}
		
		if(twexter.detect_chunk_style(this.editor.getText(), this.editor.getTwxt())!=twexter.CHUNKSTYLE_XSCROLL){
			this.editor.setEditorMode(2, false);
			return;
		}
		
		var s;
		
		switch(style){
			case 'xscroll':
				this.editor.setEditorMode(2, false);
			break;
			case 'space':
				s = twexter.parse_into_struct(this.editor.getText(), this.editor.getTwxt());
				s = twexter.struct_to_spacechunk(s);
				this.editor.setText(s[0]);
				this.editor.setTwxt(s[1]);
				this.editor.setEditorMode(2, false);
			break;
			case 'flow':
				s = twexter.parse_into_struct(this.editor.getText(), this.editor.getTwxt());
				s = twexter.struct_to_flowchunk(s);
				this.editor.setText('');
				this.editor.setTwxt(s);
				this.editor.setEditorMode(1, false);
			break;
			default:
				this.editor.setEditorMode(2, false);
			break;
		}
	},
	
	/** Loading document has failed */
	loadDocumentFail: function(){
		alert("Laoding document has failed");
		delete this.loading_doc_id;
		if(pageTracker){ pageTracker._trackPageview("/actions/open_doc/error"); }
	},
	
	/** Switch edit sides */
	switchSides: function(){
		this.editor.switchSides();
	},
	
	/** Lazy Load Editor Tools when needed */
	onEditorTools: function(){
		if(Ext.isEmpty(this.editor_tools)){
			/*{*/console.debug("Created Editor Tools");/*}*/
			this.editor_tools = new twexter.tools_popup();
			this.editor_tools.on('unchunk', this.onUnChunk, this);
			this.editor_tools.on('rechunk', this.onChunk, this);
			this.editor_tools.on('translate', this.onTranslate, this);
		}
		if(!this.editor_tools.el.isVisible()){
			this.etools_visible = true;
			this.editor_tools.show();
			this.editor.el.setTop(CHUNKTOOLS_TOP);
			this.output.el.setTop(CHUNKTOOLS_TOP);
			if(pageTracker){ pageTracker._trackPageview("/actions/chunk_tools/open"); }
		}else{
			this.etools_visible = false;
			this.editor_tools.hide();
			var top = (this.output_align=='r') ? OUT_POS_TOP+XB_POS_TOP_M : OUT_POS_TOP_FULL;
			this.editor.el.setTop(OUT_POS_TOP+XB_POS_TOP_M);
			this.output.el.setTop(top);
			if(pageTracker){ pageTracker._trackPageview("/actions/chunk_tools/close"); }
		}
	},
	
	/** Checks to see if editor tools is visible and resizes other controls */
	//TODO:Probably need to remove.
	checkEditTools: function(){
		if(!this.editor.el.isVisible()){
			this.etools_visible = false;
			if(this.editor_tools){ this.editor_tools.hide(); }
			this.editor.el.setTop(55);
			var top = (this.output_align=='r') ? OUT_POS_TOP+XB_POS_TOP_M : OUT_POS_TOP_FULL;
			this.output.el.setTop(top);
		}
	},
	
	/** On unchunk editor tools event */
	onUnChunk: function(){
		this.editor.unChunk();
	},
	
	/** On chunk editor tools event */
	onChunk: function(ctl, len, both, before, after){
		this.editor.chunk(len, both, before, after);
	},
	
	/** On the cunking finishing */
	onChunkFinish: function(ctl){
		if(this.editor_tools){
			this.editor_tools.chunkingFinished();
		}
	},
	
	/** On translate editor tools event */
	onTranslate: function(ctl, service, sourcecode, langcode){
		this.editor.translate(service, sourcecode, langcode);
	},
	
	onShowUrlResource: function(){
		var el = this.urlDisplay.getEl();
		this.xbutton.changeButtonClass(this.xbutton.ST_NONE);
		//this.onXnone();
		
		/*{*/console.log("align to the output to the left to make room for URL resource");/*}*/
		this.output_align = 'l';
		this.pos_output(this.output_align);
		this.pos_urlDisplay();
		this.urlDisplay.show();
	},
	
	hideUrlDisplay : function(){
		/*{*/console.info("Going to hide URL display");/*}*/
		this.urlDisplay.hide();
		//this.urlLinkButt.hideAddrBar(false);
		//this.pos_urllinkButton();
	},
	
	onHideUrlResource: function(){
		//this.urlLinkButt.hideAddrBar(false);
		this.urlDisplay.hide();
		this.xbutton.changeButtonClass(this.xbutton.ST_NONE);
		this.onXnone();
	},
	
	onPrintDoc: function(){
		if(Ext.isEmpty(this.doc_id) || this.doc_id < 1){
			alert("No document Loaded or Saved");
			return;
		}else{
			window.open("/print/id/"+this.doc_id, 'printWin',
				    'status=0,menubar=1,scrollbars=1');
		}
	},
	
	switchSourceLanguage: function(){
		var lang = this.editor_bar.comboLeftLang.dom.value;
		this.sourceLang = lang;
		if(this.editor_tools){
			this.editor_tools.setLanguage(lang);
		}
	},
	
	getSourceLang: function(){
		var lang = this.editor_bar.comboLeftLang.dom.value;
		this.sourceLang = lang;
		return lang;
	}
};

Ext.extend(twexter.xnavui, Ext.util.Observable, twexter.xnavui.prototype);

//Start it on ready
SIMPLE = new twexter.xnavui();
Ext.onReady(SIMPLE.init, SIMPLE);