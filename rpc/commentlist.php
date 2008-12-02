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
 * Loads a list of comments available for current document
 */

define("TWEXTCOMMENTLIST_PATH", dirname(__FILE__).'/');
require_once TWEXTCOMMENTLIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTCOMMENTLIST_PATH.'../include/zendauth.php';

$docid = (is_numeric($_REQUEST['docid'])) ? $_REQUEST['docid'] : false;



$db = new dbDocumentComments();
$dbUser = new dbUser();
$sel = $db->select();

$sel->where("doc_id = ?", $docid)->order("date_entered DESC");

$comments = $db->fetchAll($sel);

$cmts = array();
foreach($comments as $comment){
    $u = $comment->findDependentRowset("dbUser")->toArray();
    $c = $comment->toArray();
    $c['username'] = $u[0]['username'];
    $c['seconds'] = time()-strtotime($c['date_entered']);
    $cmts[] = $c;
}

$data = array('success'=>true, 'total'=>count($cmts), 'comments'=>$cmts);
echo json_encode($data);
?>