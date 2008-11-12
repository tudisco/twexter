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

define("TWEXTERCHUNK_PATH", dirname(__FILE__).'/');
require_once(TWEXTERCHUNK_PATH.'../classes/class.chunk.php');

$text = (!empty($_REQUEST['text'])) ?  $_REQUEST['text'] : null;
$wboth = (!empty($_REQUEST['wboth'])) ?  json_decode($_REQUEST['wboth']) : null;
$wb = (!empty($_REQUEST['wb'])) ?  json_decode($_REQUEST['wb']) : null;
$wa = (!empty($_REQUEST['wa'])) ?  json_decode($_REQUEST['wa']) : null;
$len = (!empty($_REQUEST['len'])) ?  $_REQUEST['len'] : -1;

$chunker = new Chunk($len, $wboth, $wb, $wa);
try{
    if($text==null){
        throw new Exception('Text is empty!');
    }
    $text = $chunker->chunkText($text);
    $error = false;
}catch(Exception $e){
    $error = $e->getMessage();
}

if($error!==false){
    echo json_encode(array('success'=>false,'message'=>$error));
    exit();
}else{
    echo json_encode(array('success'=>true,'text'=>$text));
    exit();
}

?>