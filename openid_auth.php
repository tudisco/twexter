<?php
require_once 'include/zendbootstrap.php';
require_once 'include/zendauth.php';
//require_once 'Zend/OpenId/Consumer.php';
require_once 'Zend/Auth/Adapter/OpenId.php';
require_once 'Zend/OpenId/Extension/Sreg.php';

if ((isset($_POST['openid_action']) &&
            $_POST['openid_action'] == "login" &&
            !empty($_POST['openid_identifier'])) ||
            isset($_GET['openid_mode']) ||
            isset($_POST['openid_mode'])) {
    
    $sreg = new Zend_OpenId_Extension_Sreg(array(
        'nickname'=>true,
        'email'=>false,
        'fullname'=>false, 'dob'=>false, 'gender'=>false), null, 1.1);
    
    $openidAdpr = new Zend_Auth_Adapter_OpenId(@$_POST['openid_identifier']);
    $openidAdpr->setExtensions($sreg);
    $result = $authAdapter->authenticate($openidAdpr);
    if ($result->isValid()) {
        $data = $sreg->getProperties();
        setSessionVar($result->getIdentity(), $data);
    } else {
        $authAdapter->clearIdentity();
        loginError($result->getMessages());
    }
} else if ($authAdapter->hasIdentity()) {
    if (isset($_POST['openid_action']) &&
        $_POST['openid_action'] == "logout") {
        $authAdapter->clearIdentity();
    } else {
        $status = "You are logged in as "
                . $authAdapter->getIdentity()
                . "<br>\n";
    }
}

function setSessionVar($id, $data){
    $db  = Zend_Registry::get('Pdo_Mysql');
    $a = Zend_Registry::get('authAdapter');
    $aSess = Zend_Registry::get('session_auth');
    $tSess = Zend_Registry::get('session_twext');
    
    $sel = $db->select()->from('user_openid_link')->where('open_id', $id);
    $user_id = $db->fetchOne($sel);
    
    if($user_id && is_numeric($user_id)){
        //We have a user!
        $user =  $db->fetchRow($db->select()->from('users')->where("id = ?", $user_id));
        $aSess->fullname = $user['name_full'];
        $aSess->firstname = $user['name_first'];
        $aSess->email = $user['email'];
        $aSess->lastname = $user['name_last'];
        $aSess->userId = $user_id;
        $aSess->nickname = $user['username'];
        $aSess->login =  $user['username'];
        header('loacation: /index.php');
        exit();
    }else{
        die('I need to register you.. man!');
    }
    
}

function loginError($messages){
    
    foreach($messages as $m){
        print $m;
    }
    die("\nCaptian! We have an error!");
}
?>


?>