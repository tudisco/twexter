<?
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

define("TWEXTERADDCOMMENT_PATH", dirname(__FILE__).'/');
require_once TWEXTERADDCOMMENT_PATH.'../include/zendbootstrap.php';
require_once TWEXTERADDCOMMENT_PATH.'../include/zendauth.php';

$userid = (is_numeric($_REQUEST['userid'])) ? $_REQUEST['userid'] : false;
$docid = (is_numeric($_REQUEST['docid'])) ? $_REQUEST['docid'] : false;
$docsha1 = (!empty($_REQUEST['docsha1'])) ? $_REQUEST['docsha1'] : false;
$comment = (!empty($_REQUEST['comment'])) ? $_REQUEST['comment'] : false;
$title = (!empty($_REQUEST['title'])) ? $_REQUEST['title'] : false;

if($docid===false || $docid==0){
    echo json_encode(array('success'=>false, 'message'=>'no doc id'));
    exit();
}

if($comment===false){
    echo json_encode(array('success'=>false, 'message'=>'no comment'));
    exit();
}

$comment = stripcslashes($comment);
$comment = strip_tags($comment);
$dbc = new dbDocumentComments();
$date = date('Y-m-d H:i:s');
$data = array('doc_id'=>$docid, 'doc_sha1'=>$docsha1, 'user_id'=>$userid, 'comment'=>$comment, 'date_entered'=>$date);
$dbc->insert($data);
echo json_encode(array('success'=>true));

$dbdoc = new dbDocument();
$drows = $dbdoc->find($docid);

if(count($drows)>0){
    $row = $drows->current();
    $mess = "Comment has been add on Document:\n";
    $mess.= $row->title;
    $mess.= "\n----------------------------\n\n";
    $mess.= $comment;
    mail("tudisco@tudisco.biz,dukecr@gmail.com", "Twext Comment", $mess);
}



?>