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


define("TWEXTERSAVER_PATH", dirname(__FILE__).'/');
require_once TWEXTERSAVER_PATH.'../include/zendbootstrap.php';
require_once TWEXTERSAVER_PATH.'../include/zendauth.php';
require_once TWEXTERSAVER_PATH.'../include/twext_functions.php';

require_once TWEXTERSAVER_PATH.'../classes/class.dbtwext.php';


if($_SERVER['REQUEST_METHOD']=="POST"){
	$p = $_POST;
	
	if(empty($p['title'])){
		echo json_encode(array('success'=>false,'message'=>"no title sent"));
		exit();
	}
	
	$tdb = new DbTwext();
	
	try{
		$tdb->setTitle(stripcslashes($p['title']));
		$tdb->setDescription(stripcslashes($p['description']));
		$tdb->setChunkStyle(stripcslashes($p['chunk_style']));
		$tdb->setUserID($authSession->userID);
		if(!empty($p['sha1']))
			$tdb->setSha1($p['sha1']);
		if(!empty($p['id']))
			$tdb->setId($p['id']);
		if(!empty($p['version']) && is_numeric($p['version']))
			$tdb->setVersion($p['version']+1);
			
		if(!empty($p['parent_id']) && is_numeric($p['parent_id'])){
			$tdb->setParentId($p['parent_id']);
			$tdb->setParentSha1($p['parent_sha1']);
		}
		if(!empty($p['tags'])){
			$tdb->setTags($p['tags']);
		}
		
		$struct = createTwextStruct(stripcslashes($p['text']), stripcslashes($p['twxt']));
		
		$s1 = array();
		$s2 = array();
		
		foreach($struct as $s){
			if(!is_array($s) && is_int($s)){
				$s1[] = (int)$s;
				$s2[] = (int)$s;
			}else{
				$s1[] = (string)stripcslashes($s[0]);
				$s2[] = (string)stripcslashes($s[1]);
			}
		}
		
		$tdb->addTranslation($p['lang_text'], $s1, 'text');
		$tdb->addTranslation($p['lang_twxt'], $s2, 'twxt');
		
		$tdb->setGlobal($p['global']);
		
		if(!empty($p['url'])){
			$tdb->setUrlLink($p['url']);
		}
		
		$docid = $tdb->save();
		
		if(is_numeric($docid)){
			echo json_encode(array('success'=>true,'docid'=>$docid, 'sha1'=>$tdb->getSha1(), 'title'=>$tdb->getTitle(), 'desc'=>$tdb->getDescription(), 'version'=>$tdb->getVersion()));
			exit();
		}else{
			echo json_encode(array('success'=>false,'message'=>"no document id returned"));
			exit();
		}
	}
	catch(DbTwextException $e){
		echo json_encode(array('success'=>false,'message'=>$e->__toString()));
		exit();
	}
}
?>