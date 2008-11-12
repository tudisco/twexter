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

$id = (is_numeric($_REQUEST['id'])) ? $_REQUEST['id'] : false;
$docid = (is_numeric($_REQUEST['doc_id'])) ? $_REQUEST['doc_id'] : false;
$url = (is_numeric($_REQUEST['url'])) ? $_REQUEST['url'] : false;
//Currently just handling url;
$type = 'url';

if(!is_numeric($id)){
    echo json_encode(array('success'=>false, 'message'=>'no doc link id'));
    exit();
}
if(!is_numeric($docid)){
    echo json_encode(array('success'=>false, 'message'=>'no user id'));
    exit();
}
if(!empty($url)){
    echo json_encode(array('success'=>false, 'message'=>'no lang id or text'));
    exit();
}

$db = new dbDocumentLinkResource();
$data = array('document_id'=>$docid, 'url'=>$url);

$db->insert($data);
echo json_encode(array('success'=>true));
?>