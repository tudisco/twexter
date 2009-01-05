<?php
define("TWEXTER_PATH", dirname(__FILE__).'/');

require_once TWEXTER_PATH.'/include/zendbootstrap.php';
require_once TWEXTER_PATH.'/include/zendauth.php';

$url = str_replace("index_debug.php","",$_SERVER["REQUEST_URI"]);

require_once 'include/urltools.php';
$o = isset($_GET['o']) ? $_GET['o'] : false;

if($o){
	$docid = docurl_get_id($o);	
}

if(!is_numeric($docid)) $docid = 'null';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Twexter</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link href="css/simple.css" rel="stylesheet" type="text/css">
<link href="css/x_button.css" rel="stylesheet" type="text/css">
<link href="css/output.css" rel="stylesheet" type="text/css">
<link href="css/output_toolbar.css" rel="stylesheet" type="text/css">
<link href="css/editor_toolbar.css" rel="stylesheet" type="text/css">
<link href="css/twext_editor.css" rel="stylesheet" type="text/css">
<link href="css/user_login.css" rel="stylesheet" type="text/css">
<link href="css/finder.css" rel="stylesheet" type="text/css">
<link href="css/save.css" rel="stylesheet" type="text/css">
<link href="css/login_button.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="css/twext_new.css" type="text/css">	
<link href="css/slop.css" rel="stylesheet" type="text/css">
<link href="css/tools_popup.css" rel="stylesheet" type="text/css">
<link href="css/top_tool_bar.css" rel="stylesheet" type="text/css">
<link href="css/comments.css" rel="stylesheet" type="text/css">
	
<link href="css/url_link.css" rel="stylesheet" type="text/css">
<link href="css/sidebar.css" rel="stylesheet" type="text/css">

<script src="http://www.google.com/jsapi?key=ABQIAAAAunEcMFDGHr_wmtu2XUug1BSMkLjG2dqjn9SZ4XtNlZnYQgQRQBQjPrVw2B4EL1mto37jy3sxhrl1Ag" type="text/javascript"></script>

<script type="text/javascript">
	<?
		echo "global_lang = '$lang';";
		echo "URL_DIR = '$url';";
		echo "LOAD_DOC = $docid;";
	?>
</script>

<script type="text/javascript" src="js/lib/ext_2.2b.js"></script>
<!-- <script type="text/javascript" src="../javascript/ext.js"></script> -->
<script type="text/javascript" src="js/utils/debug.js"></script>

<script type="text/javascript" src="js/settings.js"></script>

<script type="text/javascript" src="js/utils/util.js"></script>
<script type="text/javascript" src="js/lib/libtwexter.js"></script>
<!-- <script type="text/javascript" src="../javascript/persist-all-min.js"></script> -->
<script type="text/javascript" src="js/ui/x_button.js"></script>
<script type="text/javascript" src="js/simple.js"></script>
<script type="text/javascript" src="js/uiviews.js"></script>
<script type="text/javascript" src="js/ui/output.js"></script>
<script type="text/javascript" src="js/data/local_data.js"></script>
<script type="text/javascript" src="js/ui/editor.js"></script>
<script type="text/javascript" src="js/ui/editor_toolbar.js"></script>
<script type="text/javascript" src="js/ui/output_toolbar.js"></script>
<script type="text/javascript" src="js/ui/user_login.js"></script>
<script type="text/javascript" src="js/ui/save.js"></script>
<script type="text/javascript" src="js/ui/finder.js"></script>
<script type="text/javascript" src="js/ui/login_button.js"></script>
<script type="text/javascript" src="js/ui/slop_select.js"></script>
<script type="text/javascript" src="js/ui/slop_popup.js"></script>
<script type="text/javascript" src="js/ui/slop_list.js"></script>
<script type="text/javascript" src="js/ui/tools_popup.js"></script>


<script type="text/javascript" src="js/ui/url_link.js"></script>
<script type="text/javascript" src="js/ui/top_tool_bar.js"></script>

<script type="text/javascript" src="js/translator.js"></script>

<script type="text/javascript" src="js/ui/comments.js"></script>

<script type="text/javascript" src="js/ui/sidebar.js"></script>

<script type="text/javascript" src="js/ui/common/popup.js"></script>
<script type="text/javascript" src="js/ui/output_contextmenu.js"></script>
<script type="text/javascript" src="js/utils/clipboard.js"></script>

<script type="text/javascript" language="javascript">
<? if($authSession->login) {
	echo "USER_LOGED_IN = true;";
	$as = Zend_Registry::get('session_auth');
	
	$data = array('success'=>true, 'message'=>"success", 'userid'=>$as->userID, 'name_first'=>$as->name_first, 'name_last'=>$as->name_last);
	echo "USER_DATA = ",json_encode($data);
}else{ 
	echo "USER_LOGED_IN = false;";
}
?>
</script>

</head>
<body id="main_body">

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-135054-10");
pageTracker._trackPageview();
</script>
</body>
</html>