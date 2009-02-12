<?php
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

define("TWEXTERADDSETTING_PATH", dirname(__FILE__).'/');
require_once TWEXTERADDSETTING_PATH.'../include/zendbootstrap.php';
require_once TWEXTERADDSETTING_PATH.'../include/zendauth.php';

$userid = (is_numeric($_POST['userid'])) ? $_POST['userid'] : 0;
$key = (is_numeric($_POST['key'])) ? $_POST['key'] : 0;
$value = (is_numeric($_POST['value'])) ? $_POST['value'] : 0;

if($authSession->login && !empty($key) && $authSession->userID==$userid){
    
    $data = array('user_id'=>$userid,'key'=>$key,'value'=>$value);
    $udb = new dbUserSettings();
    if($udb->insert($data)){
        echo json_encode(array('success'=>true));
        exit();
    }else{
        echo json_encode(array('success'=>false,'message'=>'Error during insert'));
        exit();
    }
    
}else{
    echo json_encode(array('success'=>false,'message'=>'Not logged in or key is empty'));
    exit();
}

?>