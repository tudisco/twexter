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

/**
 * Add Language to user list
 */

define("TWEXTERFILELIST_PATH", dirname(__FILE__).'/');
require_once TWEXTERFILELIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTERFILELIST_PATH.'../include/zendauth.php';

$userid = (is_numeric($_REQUEST['userid'])) ? $_REQUEST['userid'] : false;
$langid = (is_numeric($_REQUEST['langid'])) ? $_REQUEST['langid'] : false;
$langtext = (!empty($_REQUEST['langtext'])) ? $_REQUEST['langtext'] : false;

if(!$userid){
    echo json_encode(array('success'=>false, 'message'=>'no user id'));
    exit();
}
if(!$langid && !$langtext){
    echo json_encode(array('success'=>false, 'message'=>'no lang id or text'));
    exit();
}

if($langid){
    $uldb = new dbLangUser();
    $uldb->insert(array('user_id'=>$userid, 'lang_id'=>$langid));
}else{
    $ldb = new dbLangs();
    $uldb = new dbLangUser();
    $sel = $ldb->select();
    $sel->where("name = ?", $langtext);
    $rowset = $ldb->fetchAll($sel);
    if(count($rowset) > 0){
        $row = $rowset->current();
        
        //Check to see if we already have the lang
        $check = $uldb->fetchAll("user_id = $userid AND lang_id = {$row->id}");
        if(count($check) > 0){
            $cr = $check->current();
            echo json_encode(array('success'=>true,'id'=>$cr->lang_id,'name'=>$langtext));
        }else{
            $uldb->insert(array('user_id'=>$userid, 'lang_id'=>$row->id));
            echo json_encode(array('success'=>true,'id'=>$row->id,'name'=>$langtext));
        }
        exit();
    }else{
        $id = $ldb->insert(array('name'=>$langtext,'user_id'=>$userid,'config'=>'user'));
        if($id){
            $uldb->insert(array('user_id'=>$userid, 'lang_id'=>$id));
        }else{
            echo json_encode(array('success'=>'false','id'=>$id,'message'=>'No Insert ID returned'));
            exit();
        }
        echo json_encode(array('success'=>true,'id'=>$id,'name'=>$langtext));
        exit();
    }
}

echo json_encode(array('success'=>true));

?>