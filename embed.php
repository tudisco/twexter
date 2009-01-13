<?php
require_once 'include/zendbootstrap.php';
require_once 'include/urltools.php';
//require_once 'include/zendauth.php';
require_once 'classes/class.dbtwext.php';

$path = $_SERVER['PATH_INFO'];

$p = $_GET['o'];
if($p){
    $path = $p;
    $bpath = '/';
}else{
    $bpath = str_ireplace($path,'',$_SERVER["REQUEST_URI"]);
    $bpath = str_replace('embed.php','',$bpath);
    $path = substr($path, 1);
}

//
//$parts = explode('/', $path);
//
//if(count($parts)==2 && $parts[0]=='id'){
//    if(is_numeric($parts[1])){
//        //print("Document ID is ".$parts[1]);
//        $docid = $parts[1];
//    }else{
//       // die("Document ID is not a number");
//    }
//}else if(count($parts)==1 && strlen($parts[0])==40){
//    $query = "select id from document 
//    where 
//    sha1='%s' 
//    and 
//    version=(select MAX(version)from document where sha1='%s' )";
//    
//    $ddb = new dbDocument();
//    $sel = $ddb->select();
//    $sel->where("sha1 = ?", $parts[0])->where("version = (SELECT MAX(d2.version) FROM document as d2 WHERE sha1=document.sha1)");
//    
//    $doc = $ddb->fetchAll($sel);
//    if($doc->count()>0){
//        foreach($doc as $d){
//            $docid = $d->id;
//        }
//    }
//}else if(count($parts)==4){
//    if(is_numeric($parts[0]) && is_numeric($parts[1]) && is_numeric($parts[2])){
//        $year = $parts[0];
//        $month = $parts[1];
//        $day = $parts[2];
//        $name = $parts[3];
//        $name = str_replace('_', ' ', $name);
//        
//        $ddb = new dbDocument();
//        $sel = $ddb->select();
//        $sel->where("YEAR(created_on) = ?", $year)
//            ->where("MONTH(created_on) = ?", $month)
//            ->where("DAYOFMONTH(created_on) = ?", $day)
//            ->where("title = ?", $name)
//            ->order("version");
//            
//        $doc = $ddb->fetchAll($sel);
//        
//        if($doc->count(0)>0){
//            foreach($doc as $d){
//                $docid = $d->id;
//            }
//        }
//    }
//}

$docid = docurl_get_id($path);

if($docid==false){
    $docid = 'null';
}

//if($docid){
//    $doc = new DbTwext();
//    $doc->load($docid);
//}
?>
<html>
<head>
<title>Twexter</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<link rel="stylesheet" type="text/css" href="<?=$bpath?>css/twext_new.css" />
<script type="text/javascript" src="<?=$bpath?>js/lib/ext-min.js"></script>
<script type="text/javascript" src="<?=$bpath?>js/lib/libtwexter.js"></script>
<script language="javascript">

DOCID = <? echo $docid ?>;

HTML_TEMPLATE = {
    tpl_box:"{paras}",
    tpl_line: "{chunks}<div class=\"line-break\"></div><div id=\"line_num{linenum}\"></div>",
    tpl_paras: "{lines}<div class=\"para-break\"></div>",
    tpl_chunk: "<div id=\"ch_l{chunknum}\" class=\"chunk x-unselectable\">{text}{twext}</div>",
    tpl_chunk_el: "<div class= \"{class}\">{text}</div>",
    text_class: "text",
    twext_class: "twext"
};

 var viewportwidth;
 var viewportheight;
 
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
 
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
 
 // older versions of IE
 
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }


Ext.onReady(function(){
    if(DOCID!=null){
        
        Ext.getBody().update("loading...");
        
        var ajConfig = {
            url: '<?=$bpath?>rpc/display_load.php',
            params: {docid:DOCID},
            method: 'POST',
            success:onLoad,
            failure:onFail
        }

        Ext.Ajax.request(ajConfig);
    }
});

function onFail(){
    var nodoc = "Not Found";
    Ext.get('mainbody').update(nodoc);
}

function onLoad(rep){
    var text = rep.responseText;
    var doc = Ext.decode(text);
    
    var url = doc.url;
    var has_url = !Ext.isEmpty(url);
    
    var trans = doc.trans;    
    var left = [];
    var right = [];
    
    var chunks = trans[0].chunks;
    
    var tmp=[];
    for(var i = 0; i<chunks.length; i++){
            if(!isNaN(chunks[i])){
                    if(chunks[i]==0) tmp[tmp.length] = "\n";
                    if(chunks[i]==1) tmp[tmp.length] = "\n\n";
            }else{
                    tmp[tmp.length] = twexter.string.stripslashes(chunks[i]);
                    tmp[tmp.length] = "\n";
            }
    }
    
    if(trans[0].type == 'text'){
            left = tmp;
    }else{
            right = tmp;
    }
    
    
    tmp = [];
    var chunks = trans[1].chunks;
    
    for(var x = 0; x<chunks.length; x++){
            if(!isNaN(chunks[x])){
                    if(chunks[x]==0) tmp[tmp.length] = "\n";
                    if(chunks[x]==1) tmp[tmp.length] = "\n\n";
            }else{
                    tmp[tmp.length] = twexter.string.stripslashes(chunks[x]);
                    tmp[tmp.length] = "\n";
            }
    }
    
    if(trans[1].type == 'twxt' || trans[0].type == 'text'){
            right = tmp;
    }else{
            left = tmp;
    }
    
    //console.info(left);
    //console.info(right);
    
    var s = twexter.parse_into_struct(left.join('') ,right.join(''));
    
    //console.dir(s);
    
    var htmlExporter = new twexter.exporter.html(HTML_TEMPLATE);
    
    var html1 = "<div id=\"wrapper\"></div>";
    var html2 = "<div id=\"wrapper\" style=\"float:left;width=48%;overflow:auto;\"></div><div id=\"urliframe\" style=\"float:right;width=48%;\">";
    var alll = Ext.getBody();
    //alert(viewportheight);
    if(has_url){
        alll.update(html2);
    }else{
        alll.update(html1);
    }
    
    Ext.get('wrapper').update(htmlExporter.getOutput(s));
    if(Ext.get('urliframe')){
        var w = (alll.getWidth()/2)-10;
        var wr = Ext.get('wrapper');
        var ifw = Ext.get('urliframe');
        wr.setWidth(w);
        ifw.setWidth(w);
        var ifm = ifw.createChild({
            tag:'iframe',
            src:url
        });
        ifm.setWidth(ifw.getWidth());
        //ifm.setHeight(ifw.getWidth());
        ifm.setHeight(Math.min(ifw.getWidth(),viewportheight-25));
        wr.setHeight(viewportheight-25);
    }

    
}

</script>

</head>

<body id="mainbody">

</body>

</html>
