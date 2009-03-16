<?php
error_reporting(E_ERROR | E_PARSE);
require_once 'include/zendbootstrap.php';
require_once 'include/zendauth.php';
require_once "AuthCommon.php";
require_once('Auth/OpenID/AX.php');

//session_start();

function getOpenIDURL() {
    // Render a default page if we got a submission without an openid
    // value.
    if (empty($_GET['openid_identifier'])) {
        $error = "Authinication method had errors. (None Selected)";
        if(!$aSess->autherror) $aSess->autherror = '';
        $aSess->autherror = $aSess->autherror.' '.$error;
        header("location: /index.php");
        exit(0);
    }

    return $_GET['openid_identifier'];
}

function run() {
    $openid = getOpenIDURL();
    $consumer = getConsumer();

    // Begin the OpenID authentication process.
    $auth_request = $consumer->begin($openid);

    // No auth request means we can't begin OpenID.
    if (!$auth_request) {
        displayError("Authentication error; not a valid OpenID.");
    }

    $exts = array();
    $exts[] = Auth_OpenID_SRegRequest::build(
                                     // Required
                                     array('nickname'),
                                     // Optional
                                     array('fullname', 'email', 'dob', 'gender'));
    
    $ax_request = new Auth_OpenID_AX_FetchRequest();
    $ax_request->add(Auth_OpenID_AX_AttrInfo::make('http://axschema.org/namePerson/friendly', 1, true));
    $ax_request->add(Auth_OpenID_AX_AttrInfo::make('http://axschema.org/contact/email', 1, true));
    $ax_request->add(Auth_OpenID_AX_AttrInfo::make('http://axschema.org/namePerson', 1, true));

    $exts[] = $ax_request;


    foreach($exts as $ext){
        $auth_request->addExtension($ext);
    }
    
    

    $policy_uris = $_GET['policies'];

    $pape_request = new Auth_OpenID_PAPE_Request($policy_uris);
    if ($pape_request) {
        $auth_request->addExtension($pape_request);
    }

    // Redirect the user to the OpenID server for authentication.
    // Store the token for this authentication so we can verify the
    // response.

    // For OpenID 1, send a redirect.  For OpenID 2, use a Javascript
    // form to send a POST request to the server.
    if ($auth_request->shouldSendRedirect()) {
        $redirect_url = $auth_request->redirectURL(getTrustRoot(),
                                                   getReturnTo());

        // If the redirect URL can't be built, display an error
        // message.
        if (Auth_OpenID::isFailure($redirect_url)) {
            displayError("Could not redirect to server: " . $redirect_url->message);
        } else {
            // Send redirect.
            header("Location: ".$redirect_url);
        }
    } else {
        // Generate form markup and render it.
        $form_id = 'openid_message';
        $form_html = $auth_request->htmlMarkup(getTrustRoot(), getReturnTo(),
                                               false, array('id' => $form_id));

        // Display an error if the form markup couldn't be generated;
        // otherwise, render the HTML.
        if (Auth_OpenID::isFailure($form_html)) {
            displayError("Could not redirect to server: " . $form_html->message);
        } else {
            print $form_html;
        }
    }
}

run();

?>