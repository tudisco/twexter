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
 * Loads a list of documents available for current user
 */

define("TWEXTERFILELIST_PATH", dirname(__FILE__).'/');
require_once TWEXTERFILELIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTERFILELIST_PATH.'../include/zendauth.php';

$s_text = (!empty($_POST['text']) && $_POST['text']!='--all--') ? $_POST['text'] : null;
$s_twxt = (!empty($_POST['twxt']) && $_POST['twxt']!='--all--') ? $_POST['twxt'] : null;

//if($authSession->login  && is_numeric($authSession->userID)){
if(true){
	//SELECT * from document as d1 WHERE user_id = 1 AND d1.version = (SELECT MAX(version) FROM document WHERE sha1=d1.sha1)
        $db = new dbDocument();
	$sel = $db->select();
        
        
        /*
                If logged in load private docs.
       */
        if($authSession->login  && is_numeric($authSession->userID)){
                $sel->where("user_id = ? OR global = 'yes'", $authSession->userID)->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)")->order('title');
        }else{
                $sel->where("global = 'yes'", $authSession->userID)->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)")->order('title');
        }
        
	
	
	
	$doc = $db->fetchAll($sel);
	
	if($doc->count()==0){
		print "No Documents Found";
		exit();
	}
	
	
        $docs = array();
	$dbT = new dbDocumentTrans();
        $_db = Zend_Registry::get('dbTwext');
        
        foreach($doc as $d){
            $u = $d->findDependentRowset("dbUser")->toArray();
            $l = $d->findDependentRowset("dbDocumentLinkResource")->toArray();
            $c = $_db->fetchOne("SELECT count(*) FROM document_comments WHERE doc_sha1 = ?", $d->sha1);
            //print_r($u); exit();
	    if($s_text){
		$r = $dbT->fetchRow("document_id = {$d->id} AND type = 'text'");
		if($r){
			if($r->language != $s_text){
				continue;
			}
		}else{
			continue;
		}
	    }
	    if($s_twxt){
		$r = $dbT->fetchRow("document_id = {$d->id} AND type = 'twxt'");
		if($r){
			if($r->language != $s_twxt){
				continue;
			}
		}else{
			continue;
		}
	    }
            $isUser = ($authSession->userID == $d->user_id) ? 1 : 0;
            $hasDesc = (!empty($d->description)) ? 1 : 0;
            $user = $u[0]['username'];
            $link = $l[0]['url'];
            $dtime = strtotime($d->created_on);
            $seconds = time()-$dtime;
            $docs[] = array('id'=>$d->id, 'ccount'=>$c, 'title'=>stripcslashes($d->title), 'hasDesc'=>$hasDesc, 'description'=>stripcslashes($d->description), 'seconds'=>$seconds, 'creation'=>date("Y-m-d H:i:s", $dtime), 'isUser'=>$isUser, 'sha1'=>$d->sha1, 'version'=>$d->version, 'user'=>$user, 'link'=>$link);
        }
        
        $data = array('success'=>true, 'total'=>count($docs), 'files'=>$docs);
        echo json_encode($data);
        exit();
}else{
        echo json_encode(array('success'=>false, 'message'=>"Not Authenicated"));
}
?>