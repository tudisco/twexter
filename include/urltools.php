<?
require_once 'zendbootstrap.php';

function docurl_type($path){
    $parts = explode('/', $path);
    $count = count($parts);
    
    if($count == 0) return false;
    
    if($count == 1){
        if(strlen($parts[0])==40 && strpos($parts[0], '.')==false){
            return 'doc_sha1';
        }else{
        	return 'doc_name';
		}
    }else if($count == 2){
        if($parts[0]=='id' && is_numeric($parts[1])){
            return 'doc_id';
        }
    }else if($count == 4){
        $year = $parts[0];
        $month = $parts[1];
        $day = $parts[2];
        $name = $parts[3];
        $name = str_replace('_', ' ', $name);
        
        if(is_numeric($year) && is_numeric($month) && is_numeric($day)){
            return 'doc_dated';
        }
    }
    
    return false;
}

function docurl_get_id_docid($path){
    $parts = explode('/', $path);
    return $parts[1];
}

function docurl_get_id_docsha1($path){
    $parts = explode('/', $path);
    
    $ddb = new dbDocument();
    $sel = $ddb->select();
    $sel->where("sha1 = ?", $parts[0])->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)");
    
    $doc = $ddb->fetchAll($sel);
    if($doc->count()>0){
        foreach($doc as $d){
            $docid = $d->id;
        }
    }
    
    return (isset($docid)) ? $docid : false; 
}

function docurl_get_id_docdated($path){
    
    $parts = explode('/', $path);
    $year = $parts[0];
    $month = $parts[1];
    $day = $parts[2];
    $name = $parts[3];
    $name = str_replace('.', ' ', $name);
    
    $ddb = new dbDocument();
    $sel = $ddb->select();
    $sel->where("YEAR(created_on) = ?", $year)
        ->where("MONTH(created_on) = ?", $month)
        ->where("DAYOFMONTH(created_on) = ?", $day)
        ->where("title = ?", $name)
        ->order("version");
        
    $doc = $ddb->fetchAll($sel);
    
    if($doc->count(0)>0){
        foreach($doc as $d){
            $docid = $d->id;
        }
    }
    
    return (isset($docid)) ? $docid : false; 
}

function docurl_get_id_docname($path){
	$parts = explode('/', $path);
	$name = $parts[0];
	$parts = explode('#', $name);
	$name = $parts[0];
	$name = str_replace('.', ' ', $name);
	
	
	$ddb = new dbDocument();
	$sel = $ddb->select();
	$sel->where("title = ?", $name)->order("version DESC");
	
	//We only need to detch one.. Fix this
	$doc = $ddb->fetchAll($sel);
	if($doc->count()>0){
		foreach($doc as $d){
			$docid = $d->id;
			break;
		}
	}
	
	return (isset($docid)) ? $docid : false;
}

function docurl_get_id($path){
    $type = docurl_type($path);
    
    switch($type){
        case 'doc_id':
            $docid = docurl_get_id_docid($path);
            break;
        case 'doc_sha1':
            $docid = docurl_get_id_docsha1($path);
            break;
        case 'doc_dated':
            $docid = docurl_get_id_docdated($path);
            break;
        case 'doc_name':
        	$docid = docurl_get_id_docname($path);
        	break;
    }
    
    return (isset($docid)) ? $docid : false;
}


?>
