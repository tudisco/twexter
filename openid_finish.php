<?php
error_reporting(E_ERROR | E_PARSE);
require_once 'include/zendbootstrap.php';
require_once 'include/zendauth.php';
require_once "AuthCommon.php";
require_once('Auth/OpenID/AX.php');
//session_start();

function escape($thing) {
    return htmlentities($thing);
}

function openid_normalize_username($username) {
        $username = preg_replace('|^https?://(xri.net/([^@]!?)?)?|', '', $username);
        $username = preg_replace('|^xri://([^@]!?)?|', '', $username);
        $username = preg_replace('|/$|', '', $username);
        //$username = sanitize_user( $username );
        $username = preg_replace('|[^a-z0-9 _.\-@]+|i', '-', $username);
        return $username;
}

function run() {
    
    
    //file_put_contents("LastOPenIDResponse.txt", print_r(Auth_OpenID::getQuery(),true));
    
    $consumer = getConsumer();

    // Complete the authentication process using the server's
    // response.
    $return_to = getReturnTo();
    $response = $consumer->complete($return_to);

    // Check the response status.
    if ($response->status == Auth_OpenID_CANCEL) {
        // This means the authentication was cancelled.
        $msg = 'Verification cancelled.';
        displayError($msg);
    } else if ($response->status == Auth_OpenID_FAILURE) {
        // Authentication failed; display the error message.
        $msg = "OpenID authentication failed: " . $response->message;
        displayError($msg);
    } else if ($response->status == Auth_OpenID_SUCCESS) {
        // This means the authentication succeeded; extract the
        // identity URL and Simple Registration data (if it was
        // returned).
        $openid = $response->getDisplayIdentifier();
        $esc_identity = escape($openid);
        $params = Auth_OpenID::getQuery();

        if ($response->endpoint->canonicalID) {
            $escaped_canonicalID = escape($response->endpoint->canonicalID);
            //$success .= '  (XRI CanonicalID: '.$escaped_canonicalID.') ';
        }
        
        $sreg_resp = Auth_OpenID_SRegResponse::fromSuccessResponse($response);
        $ax = Auth_OpenID_AX_FetchResponse::fromSuccessResponse($response);

        $sreg = $sreg_resp->contents();
        
        //AX DATA
        $axdata = array();
        if($ax){
            $email = $ax->getSingle('http://axschema.org/contact/email');
            if ($email && !is_a($email, 'Auth_OpenID_AX_Error')) {
                    $axdata['email'] = $email;
            }
            
            $nickname = $ax->getSingle('http://axschema.org/namePerson/friendly');
            if ($nickname && !is_a($nickname, 'Auth_OpenID_AX_Error')) {
                    $axdata['nickname'] = $ax->getSingle('http://axschema.org/namePerson/friendly');
            }

            $fullname = $ax->getSingle('http://axschema.org/namePerson');
            if ($fullname && !is_a($fullname, 'Auth_OpenID_AX_Error')) {
                    $axdata['fullname'] = $fullname;
            }
        }
        
        //SREG DATA
        $sregdata = array();
        if(is_array($sreg)){
            if (array_key_exists('email', $sreg) && !empty($sreg['email'])) {
                    $sregdata['email'] = $sreg['email'];
            }
    
            if (array_key_exists('nickname', $sreg) && !empty($sreg['nickname'])) {
                    $sregdata['nickname'] = $sreg['nickname'];
            }
    
            if (array_key_exists('fullname', $sreg) && !empty($sreg['fullname'])) {
                    $sregdata['fullname'] = $sreg['fullname'];
            }
        }
        
        //Exceptions - Google
        if(empty($email)){
            if($params['openid.ext1.type.ext1']=='http://axschema.org/contact/email'){
                $email = $params['openid.ext1.value.ext1'];
            }
        }

        
        $db = Zend_Registry::get('dbTwext');
        $result = $db->fetchAll($db->select()->from('users')->where("openid = ?",$openid));
        
        if(count($result)<1){
            //We have a new user to add! Do it here..!!
            $data = array('openid'=>$openid,'password'=>sha1(sha1($openid)));
            
            $fullname = !empty($axdata['fullanme']) ? $axdata['fullname'] : $sregdata['fullname'];
            $fullname = empty($fullname) ? null : $fullname;
            $email = !empty($axdata['email']) ? $axdata['email'] : (!empty($sregdata['email'])) ? $sregdata['email'] : null;
            $nickname = !empty($axdata['nickname']) ? $axdata['nickname'] : $sregdata['nickname'];
            if(empty($nickname)){
                $nickname = !empty($fullname) ? trim($fullname) : (!empty($email)) ? $email : openid_normalize_username($openid);
            }
            
            
            $data['username'] = $nickname;
            
            if(!empty($fullname)){
                $data['name_full'] = trim($fullname);
                $namechunks = explode( ' ', trim($fullname), 2 );
                if( isset($namechunks[0]) ) $data['name_first'] = $namechunks[0];
                if( isset($namechunks[1]) ) $data['name_last'] = $namechunks[1];
            }
            if(!empty($email)){
                $data['email'] = $email;
            }
            
            if(is_array($sreg)){
                if(!empty($sreg['dob'])){
                    $data['dob'] = $sreg['dob'];
                }
                if(!empty($sreg['gender'])){
                    $data['gender'] = $sreg['gender'];
                }
            }
            
            $udb = new dbUser();
            if($udb->insert($data)){
                log_into_text($openid,sha1(sha1($openid)));
            }else{
                displayError("Error adding user, please try again latter");
            }
        }else{
            //Ok.. the users exist do stupid zend auth trick
            log_into_text($openid,sha1(sha1($openid)));
        }
    }

    //print $msg;
    //print $success;
    //include 'index.php';
    header("location: /index.php");
}
run();
?>