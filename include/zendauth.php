<?php
define("ZENDAUTH_PATH", dirname(__FILE__).'/');
require_once(ZENDAUTH_PATH."zendbootstrap.php");
require_once 'Zend/Auth/Adapter/DbTable.php';
require_once 'Zend/Session/Namespace.php';

// Configure the instance with constructor parameters...
$authAdapter = new Zend_Auth_Adapter_DbTable(Zend_Registry::get('dbTwext'), 'users', 'username', 'password');

//set up user session for twext
$twextSession = new Zend_Session_Namespace('twext');

//Seesion page count.. maybe used latter for logging.. 
if (isset($twextSession->numberOfPageRequests)) {
    $twextSession->numberOfPageRequests++; // this will increment for each page load.
} else {
    $twextSession->numberOfPageRequests = 1; // first time
}

//User session name space
$authSession = new Zend_Session_Namespace('auth_user');
//$authSession->user = "myusername";

//Lets save the session in the registery
Zend_Registry::set('authAdapter', $authAdapter);
Zend_Registry::set('session_twext', $twextSession);
Zend_Registry::set('session_auth', $authSession);

function log_into_text($login, $password){
    $a = Zend_Registry::get('authAdapter');
    $aSess = Zend_Registry::get('session_auth');
    $tSess = Zend_Registry::get('session_twext');
    
    $a->setIdentity($login)->setCredential($password);
    $r = $a->authenticate();
    
    if($r->isValid()){
	$ui = $a->getResultRowObject();
	$aSess->name_first = $ui->name_first;
	$aSess->name_last = $ui->name_last;
	$aSess->email = $ui->email;
	$aSess->userID = $ui->id;
	$aSess->login = true;
	unset($ui);
	return true;
    }else{
	$aSess->name_first = '';
	$aSess->name_last = '';
	$aSess->email = '';
	$aSess->userID = '';
	$aSess->login = false;
	$tSess->displayError = "Username and Password Failed";
	return false;
    }
}
?>