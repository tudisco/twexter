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
 * REMOVE Language from user list
 */

define("TWEXTERFILELIST_PATH", dirname(__FILE__).'/');
require_once TWEXTERFILELIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTERFILELIST_PATH.'../include/zendauth.php';

$userid = (is_numeric($_REQUEST['userid'])) ? $_REQUEST['userid'] : false;
$langid = (is_numeric($_REQUEST['langid'])) ? $_REQUEST['langid'] : false;

if(!$userid){
    echo json_encode(array('success'=>false, 'message'=>'no user id'));
    exit();
}
if(!$langid){
    echo json_encode(array('success'=>false, 'message'=>'no lang id'));
    exit();
}

$uldb = new dbLangUser();
$row = $uldb->fetchRow("user_id = $userid && lang_id = $langid");
if(is_object($row))
    $row->delete();
echo json_encode(array('success'=>true));
?>