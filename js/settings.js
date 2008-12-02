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

//Elements
MAIN_BODY = 'main_body';

//Lang Setting for Google Lang Api
LANG_GOOG_API = false;
LANG_TRANS_CODE = null;
LANG_SOURCE_CODE = null;

//Rpc Call Location
RPC_FILELIST = '/rpc/filelist.php';
RPC_LANGS = '/rpc/langs.php';
RPC_SAVE = '/rpc/save.php';
RPC_LOAD = '/rpc/load.php';
RPC_ADDLANG =  '/rpc/addlang.php';
RPC_REMOVELANG = '/rpc/removelang.php';
RPC_LOGIN = '/rpc/login.php';
RPC_ADDCOMMENT = '/rpc/addcomment.php';
RPC_COMMITLIST = '/rpc/commentlist.php';

//Positioning Settings
OUT_POS_TOP_FULL = 23;
OUT_POS_TOP = 55;
OUT_POS_MARGIN = 10;

//XB = XBUTTON
// Top Margin
XB_POS_TOP_M = 10;
//Left Margin
XB_POS_LEFT_M = 10;

COL_LEFT_SIZE = 63+(XB_POS_TOP_M*2);

//Usertag Icon Width for Messurements
USERTAG_W = 25;

//URL LINK STUFF
URLLINK_INPUT_LENGTH = 300;
URLDISPLAY_HEIGHT_DIFF = 40;

//Chunking Tools Setting
CHUNKTOOLS_TOP = 170;


VIEW_STATES = {
    always:{
        menubar: {dock:'tr', callafter:'posButtons'},
        xnav: 'tl',
        sidebar: {visible: true, width:COL_LEFT_SIZE, dock:'bl'},
        finder: {visible: false},
        editortools: {visible: false},
        output: {visible:false},
        urldisplay: {visible: false},
        editor: {visible: false},
        stylecontrol: {visible: false},
        comments: {visible: false}
    },
    doc_nourl:{
        settings: {topbar2space:false},
        output: {visible: true, dock:'c', part:'all'},
        urldisplay: {visible: false},
        editortools: {visible:false},
        editor: {visible: false}
    },
    doc_url:{
        settings: {topbar2space:false},
        output: {visible: true, dock:'c', part:'l'},
        urldisplay: {visible: true, dock:'c', part:'r', callafter:'pos_iframe'},
        editortools: {visible:false},
        editor: {visible: false}
    },
    style_preview: {
        settings: {topbar2space:false,bottom_margin:100},
        output: {visible: true, dock:'c', part:'all'},
        urldisplay: {visible: false},
        editortools: {visible:false},
        editor: {visible: false},
        stylecontrol: {visible: true, dock:'b'}
    },
    edit_preview:{
        settings: {topbar2space:true},
        output: {visible: true, dock: 'c', part:'r'},
        urldisplay: {visible: false},
        editortools: {visible: true, dock:'tr2', align:'l'},
        editor: {visible: true, dock:'c', part:'l', callafter:'positionEditors'}
    },
    edit_full: {
        settings: {topbar2space:true},
        output: {visible:false},
        urldisplay: {visible: false},
        editortools: {visible: true, dock:'tr2', align:'l'},
        editor: {visible: true, dock:'c', part:'all', callafter:'positionEditors'}
    },
    finder: {
        settings: {topbar2space:false},
        finder: {visible:true, dock:'c', part:'all'}
    },
    comments: {
        settings: {topbar2space:false},
        output: {visible: true, dock: 'c', part:'r'},
        comments: {visible: true, dock: 'c', part:'l', callafter:'posControls'}
    }
}
