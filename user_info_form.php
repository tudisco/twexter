<?php
require_once 'include/zendbootstrap.php';
require_once 'include/zendauth.php';
Zend_Loader::registerAutoload();


class Nickname_Validate extends Zend_Validate_Abstract
{
    function isValid($value){
	$db = Zend_Registry::get('dbTwext');
	$as = Zend_Registry::get('session_auth');
	$res = $db->fetchAll($db->select()->from('users')->where("username = ?", $value)->where("id <> ?", $as->userID));
	if(count($res)<1){
	    return true;
	}else{
	    $this->_error("The username is taken, Please choose another");
	    return false;
	}
    }
}

if(!$authSession->login || !is_numeric($authSession->userID)){
    header('location: /');
    exit();
}

$userdata = $_db->fetchAll($_db->select()->from('users')->where("id = ?", $authSession->userID));
$userdata[0]['lang_learning'] = explode(',',$userdata[0]['lang_learning']);


$form = new Zend_Form();
$form->setAction('user_info_form.php');
$form->setMethod('POST');


$form->addElement('hidden', 'id');

$form->addElement('text', 'name_first', array('label'=>'First Name'));
$form->addElement('text', 'name_last', array('label'=>'Last Name'));

$form->addElement('text','username', array('label'=>'Nickname','required'=>true,'validators'=>array(new Nickname_Validate())));
$form->addElement('text','email',array('label'=>'Email'));

$form->addDisplayGroup(array('name_first','name_last','username','email'), 'name', array("legend" => "Your Information"));

$alangs = $_db->fetchPairs("SELECT iso_code, name FROM langs WHERE google_code IS NOT NULL");

$el = new Zend_Form_Element_Select('lang_main');
$el->setLabel('Your Language');
$el->addMultiOptions($alangs);
$el->setValue('eng');
$form->addElement($el);

$el = new Zend_Form_Element_MultiCheckbox('lang_learning');
$el->setLabel('Leaning Languages');
$el->addMultiOptions($alangs);
$form->addElement($el);

$form->addDisplayGroup(array('lang_main','lang_learning'), 'lang', array("legend" => "Your Languages"));

$submit = new Zend_Form_Element_Submit('submit');
$form->addElement($submit);
//$submit->setLabel('Save');
$form->submit->setValue("Save");



if($_SERVER['REQUEST_METHOD'] == 'POST' && $form->isValid($_POST)){
    
    $values = $form->getValues();
    $alllangs = $values['lang_learning'];
    $alllangs[] = $values['lang_main'];
    $values['lang_learning'] = implode(',',$values['lang_learning']);
    
    $where = $_db->quoteInto('id = ?', $values['id']);
    $userid = $values['id'];
    unset($values['submit'],$values['id']);
    
    $udb = new dbUser();
    $udb->update($values, $where);
    
    //Lets Make sure they have some selected langs
    $rlangs = $_db->fetchAll($_db->select()->from('user_lang')->where("user_id = ?", $userid));
    if(count($rlangs)<1){
	$langs = $alllangs;
	if(count($langs) < 2){
	    $langs[] = 'spa';
	    $langs[] = 'eng';
	    $langs[] = 'fra';
	    $langs[] = 'ita';
	}else{
	    $langs[] = 'spa';
	    $langs[] = 'eng';
	}
	$langs = array_unique($langs);
	$dblu = new dbLangUser();
	foreach($langs as $lang){
	    $lid = $_db->fetchOne("SELECT id FROM langs WHERE iso_code = '$lang'");
	    if(is_numeric($lid)){
		$dblu->insert(array('user_id'=>$userid, 'lang_id'=>$lid));
	    }
	}
    }
    
    
    header('location: /');
    exit();
    
}else if($_SERVER['REQUEST_METHOD'] != 'POST'){
    $form->setDefaults($userdata[0]);
}

$form->setView(new Zend_View());
echo '<?xml version="1.0" encoding="utf-8"?>';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xml:lang="en" lang="en" xml‎ns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="shortcut icon" href="/images/twext.ico" />
    <style>
        body {
            text-align: center;
            min-width: 500px;
	    background: white url(/images/twext.gif) no-repeat;
        }
        #wrapper {
            text-align: left;
            width: 500px;
            margin-left: auto;
            margin-right: auto;
        }


    /* Zend Form Styling */
	dl.zend dt, dd { min-height: 30px; }
	dl.zend_form dt {
		float: left;
		clear: left;
		text-align: right;
	}
        dl.zend_form dt label{
            width: 150;
            font-family: Ariel,sans-serif;
            font-size: 12px;
            font-weight: normal;
            color: black;
        }
        dl.zend_form dd fieldset{
            width: 350px;
            border: solid 1px grey;
            font-family: Ariel,sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: grey;
            margin-bottom: 10px;
            -moz-border-radius : 5px;
            -webkit-border-radius: 5px;
        }
	dl.zend_form dt label.required { font-weight: 600; color: darkred; }
	dl.zend_form dd {
		float: left;
		clear: right;
		padding-left: 5px;
	}
        
        dl.zend_form dd input {
            font-size: 12px;
        }
	
	dl.zend_form dd ul.errors {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	dl.zend_form dd ul.errors li {
		float: left;
		margin: 0 0.15em;
		font-size: 10px;
		font-weight: normal;
		color: red;
	}
	
    </style>
</head>
<body>
<div id="wrapper">
<? echo $form ?>
</div>

</body>
</html>