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

define("TWEXTERFILELIST_PATH", dirname(__FILE__).'/');
require_once TWEXTERFILELIST_PATH.'../include/zendbootstrap.php';
require_once TWEXTERFILELIST_PATH.'../include/zendauth.php';

// Lets get the config option first

$s_text = (!empty($_POST['text']) && $_POST['text']!='--all--') ? $_POST['text'] : false;
$s_twxt = (!empty($_POST['twxt']) && $_POST['twxt']!='--all--') ? $_POST['twxt'] : false;

$limit_start = (is_numeric($_POST['start'])) ? $_POST['start'] : 0;
$limit_limit = (is_numeric($_POST['limit'])) ? $_POST['limit'] : 10;

$sort = (!empty($_POST['sort'])) ? $_POST['sort'] : false;
$sort_dir = (!empty($_POST['dir'])) ? $_POST['dir'] : 'ASC';

$search = (!empty($_POST['search'])) ? $_POST['search'] : false;

$children = ($_POST['children']==1) ? true : false;
$parent = (is_numeric($_POST['parent'])) ? $_POST['parent'] : false;

if($sort!==false && $sort == 'creation'){
        $sort = 'created_on';
}

//functions

function get_language_name($lang){
    $db = Zend_Registry::get('dbTwext');
    $sel = $db->select();
    $sel->from('langs',array('name'));
    $sel->where("iso_code = ?", $lang)->orWhere("name = ?", $lang)->orWhere("google_code = ?", $lang)->limit(1);
    return $db->fetchOne($sel);
}

function get_tag($tag){
        $db = Zend_Registry::get('dbTwext');
        $sel = $db->select();
        $sel->from('document_tags',array('id'));
        $sel->where("tag = ?",$tag);
        return $db->fetchOne($sel);
}

function get_user_id($user){
    $db = Zend_Registry::get('dbTwext');
    $sel = $db->select();
    $sel->from('users',array('id'));
    $sel->where("username = ?", $user);
    return $db->fetchOne($sel);
}

function get_languages($docid, $type){
    $db = Zend_Registry::get('dbTwext');
    $sel = $db->select();
    $sel->from('document_trans', array('language'))->where("document_id = ?", $docid)->where("type = ?", $type);
    return $db->fetchOne($sel);
}

function get_user_name($userid){
    $db = Zend_Registry::get('dbTwext');
    $sel = $db->select();
    $sel->from('users',array('username'));
    $sel->where("id = ?", $userid);
    return $db->fetchOne($sel);
}

function getChildIds($parentid){
       $db = Zend_Registry::get('dbTwext');
       $sel = $db->select();
       $sel->from('document', array('id', 'sha1'));
       $sel->where("parent_id = ?", $parentid);
       $sel->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)");
       
       $res = $db->fetchAll($sel);
       $ids = array();
       foreach($res as $r){
                $ids[] = $r['id'];
       }
       return $ids;
}

function get_all_langs($parentid){
        $ids = array($parentid);
        $ids = array_merge($ids,getChildIds($parentid));
        
        $langs = array();
        $langs[] = array('type'=>"text",'lang'=>get_languages($parentid, 'text'),'id'=>$parentid);
       
        foreach($ids as $id){
                $langs[] = array('type'=>'twxt','lang'=>get_languages($id, 'twxt'),'id'=>$id);
        }
        
        return $langs;
}

//database
$db = Zend_Registry::get('dbTwext');
$sel = $db->select();

$sel->from('document');

if($authSession->login  && is_numeric($authSession->userID)){
        $sel->where("user_id = ? OR global = 'yes'", $authSession->userID)->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)");
}else{
        $sel->where("global = 'yes'", $authSession->userID)->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)");
}

if($parent){
    $children = true;
    $sel->where("parent_id = ?", $parent);
}

if(!$children){
    $sel->where("parent_id = 0 OR parent_id IS NULL");
}

if($search !== false){
    $swords = explode(' ', $search);
    $sstr = '';
    $options = array();
    
    foreach($swords as $sword){
        
        if(strpos($sword, ':')!==false){
                $tempo = explode(':', $sword);
                if(strlen($tempo[0])>0) $options[$tempo[0]]=$tempo[1];
                continue;
        }
        
        $sel->where("title LIKE '%$sword%'");
        
    }
    
    if(count($options)>0){
        if(!empty($options['tx'])){
            $s_text = get_language_name($options['tx']);
        }
        if(!empty($options['tw'])){
            $s_twxt = get_language_name($options['tw']);
        }
        if(!empty($options['t'])){
            $tempo = explode('.', $options['t']);
            if(count($tempo)<3){
                if(!empty($tempo[0])){
                    $s_text = get_language_name($tempo[0]);    
                }
                if(!empty($tempo[1])){
                    $s_twxt = get_language_name($tempo[1]);    
                }
            }
        }
        if(!empty($options['u'])){
            $userid = get_user_id($options['u']);
            if($userid != false){
                $sel->where("user_id = ?", $userid);
            }else{
                $data = array('success'=>true, 'total'=>0, 'files'=>array());
                echo json_encode($data);
                exit();
            }
        }
        if(!empty($options['g'])){
                $tagid = get_tag($options['g']);
                $sel->join('document_tags_link', 'document_tags_link.doc_id = document.id');
                $sel->where('document_tags_link.tag_id = ?', $tagid);
        }
        if(!empty($options['tagid'])){
                $tagid = $options['tagid'];
                $sel->join('document_tags_link', 'document_tags_link.doc_id = document.id');
                $sel->where('document_tags_link.tag_id = ?', $tagid);
        }
    }
}

if($sort !== false){
        $sel->order($sort.' '.$sort_dir);
}else{
        $sel->order('created_on DESC');
}

$sel2 = clone $sel;
if(empty($s_text) && empty($s_twxt)){
    $sel->limit($limit_limit,$limit_start);
    $is_limited = true;
    $lang_search = false;
}else{
    $is_limited = false;
    $lang_search = true;
}

if($is_limited){
    $doc = $db->fetchAll($sel2);
    if(is_array($doc)){
        $totalCount = count($doc);
    }else{
        $totalCount = 0;
    }
}

$doc = $db->fetchAll($sel);


if(count($doc)==0){
    $data = array('success'=>true, 'total'=>0, 'files'=>array());
    echo json_encode($data);
    exit();
}

$rcount = 0;
$tcount = 0;

foreach($doc as $d){
    $chldCount = 0;
    
    if($lang_search){
        if($s_text){
            if(get_languages($d['id'], 'text') != $s_text){
                continue;
            }
        }
        if($s_twxt){
            if(get_languages($d['id'], 'twxt') != $s_twxt){
                continue;
            }
        }
    }
    
    $tcount++;
    
    if(!$is_limited && ($tcount <= $limit_start || $tcount > ($limit_start + $limit_limit))){
        continue;
    }else{
        $rcount++;
    }
    
    $user = get_user_name($d['user_id']);
    $link = $_db->fetchOne("SELECT url FROM document_link_resource WHERE document_id = ?", $d['id']);
    $cmtCount = $_db->fetchOne("SELECT count(*) FROM document_comments WHERE doc_sha1 = ?", $d['sha1']);
    $chldCount = $_db->fetchOne("SELECT count(*) FROM document WHERE parent_id = ?", $d['id']);
    if($chldCount){
        $childLangs = get_all_langs($d['id']);
    }else{
        $childLangs = false;
    }
    $isUser = ($authSession->login && $authSession->userID == $d['user_id']) ? 1 : 0;
    $hasDesc = (!empty($d['description'])) ? 1 : 0;
    $dtime = strtotime($d['created_on']);
    $seconds = time()-$dtime;
    $docs[] = array('id'=>$d['id'], 'ccount'=>$cmtCount, 'title'=>stripcslashes($d['title']), 'hasDesc'=>$hasDesc,
                    'description'=>stripcslashes($d['description']), 'seconds'=>$seconds,
                    'creation'=>date("Y-m-d H:i:s", $dtime), 'isUser'=>$isUser, 'sha1'=>$d['sha1'],
                    'version'=>$d['version'], 'user'=>$user, 'link'=>$link, 'children'=>$chldCount, 'childLang'=>$childLangs);
}

if($is_limited) $tcount = $totalCount;
$data = array('success'=>true, 'total'=>$tcount, 'files'=>$docs);
echo json_encode($data);
exit();

?>