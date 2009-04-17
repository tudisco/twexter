<?php
require_once 'include/zendbootstrap.php';
require_once 'classes/class.dbtwext.php';
require_once 'include/twext_functions.php';

$docid = (is_numeric($_REQUEST['docid'])) ? $_REQUEST['docid'] : false;

$doc = new DbTwext();
$doc->load($docid);
$trans = $doc->getTranslations();
$c = array();
foreach($trans as $t){
    if($t['type']=='text'){
        $c[0] = $t['chunks'];
    }else{
        $c[1] = $t['chunks'];
    }
}

$max = max(count($c[0]),count($c[1]));
$tree = array();
for($i = 0 ; $i < $max ; $i++){
    if(is_int($c[0][$i]) && is_int($c[1][$i])){
        if($c[0][$i]==0){
            array_push($tree,0);
        }
        if($c[0][$i]==1){
            array_push($tree,1);
        }
    }else{
        $t = !empty($c[0][$i]) ? trim(stripslashes($c[0][$i])) : '';
        $w = !empty($c[1][$i]) ? trim(stripslashes($c[1][$i])) : '';
        array_push($tree,array($t,$w));
    }
}

//$s = createTwextStruct(implode('',$tree[0]),implode('',$tree[1]));

//print_r($s);exit;
//echo '<pre>',print_r($tree, true),'</pre>';exit;


$oo = ooGen($tree);
$oo->Output();
?>