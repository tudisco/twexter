<?php
require_once 'include/zendbootstrap.php';
require_once 'include/zendauth.php';
require_once 'Minify/Build.php';
require_once 'sl.php';
$jsBuild = new Minify_Build($groupsSources['js']);
$cssBuild = new Minify_Build($groupsSources['css']);

$url = str_replace("index.php","",$_SERVER["REQUEST_URI"]);

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
<script src="http://www.google.com/jsapi?key=ABQIAAAAunEcMFDGHr_wmtu2XUug1BSMkLjG2dqjn9SZ4XtNlZnYQgQRQBQjPrVw2B4EL1mto37jy3sxhrl1Ag" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="<?php echo $cssBuild->uri('/m.php/css'); ?>" />
<script type="text/javascript" src="<?php echo $jsBuild->uri('/m.php/js'); ?>"></script>


<script type="text/javascript">
	<?
		echo "global_lang = '$lang';";
		echo "URL_DIR = '$url';";
		echo "LOAD_DOC = $docid;";
	?>
</script>

<script type="text/javascript" language="javascript">
<? if($authSession->login) {
	echo "USER_LOGED_IN = true;";
	$as = Zend_Registry::get('session_auth');
	
	$data = array('success'=>true, 'message'=>"success", 'userid'=>$as->userID, 'nickname'=>$as->nickname);
	echo "USER_DATA = ",json_encode($data);
}else{ 
	echo "USER_LOGED_IN = false;";
}
?>
</script>

</head>
<body id="main_body">

<form id="history-form" style="display:none;top:-1000px;left:-1000px;" action="#">
  <div>
    <input id="x-history-field" type="hidden" />
    <iframe id="x-history-frame"></iframe>
  </div>
</form>

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