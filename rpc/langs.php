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
 * Loads a list of languages available for current user
 */

define("TWEXTERFILELIST_PATH", dirname(__FILE__).'/');
require_once TWEXTERFILELIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTERFILELIST_PATH.'../include/zendauth.php';

$query = (!empty($_REQUEST['query'])) ? $_REQUEST['query'] : false;


$ldb = new dbLangs();
$sel = $ldb->select();
$sel->from('langs', array('langs.id', 'langs.name', 'langs.english_name', 'langs.google_code'));

if($query=='user'){
    if(!is_numeric($_REQUEST['id'])){
        echo json_encode(array('success'=>false, 'message'=>'No user id'));
        exit();
    }
    
    $db = Zend_Registry::get('dbTwext');
    $sel = $db->select();
    
    $sel->from('langs', array('langs.id', 'langs.name', 'langs.english_name', 'langs.google_code'));
    $sel->from('user_lang', array());
    $sel->where('langs.id = user_lang.lang_id')->where('langs.active = ?', 1)->where('user_lang.user_id = ?', $_REQUEST['id']);
    $sel->order("name");
    $data = $db->fetchAll($sel);
    echo json_encode(array('success'=>true, 'total'=>count($data), 'langs'=>$data));
    exit();
    
    /*$sel->where('active = ?', 1)
        ->join('user_lang', 'langs.id = user_lang.lang_id')
        ->where('user_lang.user_id = ?', $_REQUEST['id'])
        ->setIntegrityCheck(false);*/
}
elseif($query == 'main'){
    $sel->where("active = ?", 1)->where("config = ?", 'main');
}
else{
    $sel->where("config = ?", 'main')->orWhere("config = ?", 'extra')->where("active = ?", 1);
}

$sel->order("name");

$langs = $ldb->fetchAll($sel);
$data = $langs->toArray();

echo json_encode(array('success'=>true, 'total'=>count($data), 'langs'=>$data));

?>