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

define("TWEXTERGETSETTING_PATH", dirname(__FILE__).'/');
require_once TWEXTERGETSETTING_PATH.'../include/zendbootstrap.php';
require_once TWEXTERGETSETTING_PATH.'../include/zendauth.php';

$userid = (is_numeric($_POST['userid'])) ? $_POST['userid'] : 0;
$key = (is_numeric($_POST['key'])) ? $_POST['key'] : 0;

if($authSession->login && !empty($key) && $authSession->userID==$userid){
    
    $udb = new dbUserSettings();
    $sel = $udb->select();
    $sel->where("user_id = ?", $userid);
    
    
    if($key=='*ALL*'){
        $res = $udb->fetchAll();
        $settings = $res->toArray();
        $data = array('success'=>true, 'settings'=>$settings);
    }else{
        $sel->where("key = ?", $key);
        $res = $udb->fetchRow($sel);
        if($res!=null){
            $res = $res->toArray();
        }
        $data = array('success'=>true, 'setting'=>$res);
    }
    
    echo json_encode($data);
    exit();
}else{
    echo json_encode(array('success'=>false,'message'=>'Could not get setting(s)'));
    exit();
}

?>