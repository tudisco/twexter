<?php
function createTwextStruct($text, $twxt){
		$text = str_replace(array("\r\n", "\n\r", "\r"), "\n", $text);
		$twxt = str_replace(array("\r\n", "\n\r", "\r"), "\n", $twxt);
		//$utf8 = detectUTF8($contents);
		//---Ok.. split by line
		$text = explode("\n",$text);
		$twxt = explode("\n",$twxt);
		
		//---Get mex line count
		$line_count = max(count($text), count($twxt));
		
		$tree = null;
		$break = 0;
		
		//---Lets build the tree (not really a tree anymore. hahaha)
		for($i=0;$i<$line_count;$i++){
			
			//---Lets get the text elements from both sides and trim the strings or supply empty string is line numbers don't match
			$t = (isset($text[$i])) ? trim($text[$i]) : '';
			$w = (isset($text[$i])) ? trim($twxt[$i]) : '';
			
			//---If both sides are empty
			if(strlen($t) < 1 && strlen($w) < 1){
				//---If a parabreak is already there set it and then process more breaks
				if($break == 2){
					$tree[] = getTwextBreakCode($break);
					$break = 0;
				}
				$break++;
				continue;
			}
			//---Ok lets handle the breaks first if there is any
			if($break){
				$tree[] = getTwextBreakCode($break);
				$break = 0;
			}
			//---Add a chunk
			$tree[] = array($t,$w);
		}
		
		return $tree;
		
}

function rtfGen($tree){
		if(!is_array($tree)) return false;
		
		require_once(dirname(__FILE__).'/../libs/rtf/Rtf.php');
		
		$font13 = new Font(13, 'Courier New', '#00008B');
		$font7 = new Font(7, 'Courier New', '#DAA520');
		$parFormat = new ParFormat();
		$rtf = new Rtf();
		$sect = $rtf->addSection();
		
		
		$l = count($tree);
		$x = $l-1;
		$nt = array();
		$nl = array();
		$nr = array();
		
		for($i = 0 ; $i<$l ; $i++){
				if(!is_array($tree[$i])){
						
						$sect->writeText(trim(implode('',$nl))."\n",$font13,$parFormat);
						$sect->writeText(trim(implode('',$nr)),$font7,$parFormat);
						
						$nl = array();
						$nr = array();
						
						if($tree[$i]==0){
								//$sect->writeText("\n",$font13,$parFormat);
						}else{
								$sect->writeText("\n",$font13,$parFormat);
						}
				}else{
						$cl = (!empty($tree[$i][0])) ? trim($tree[$i][0]) : '--';
						$cr = (!empty($tree[$i][1])) ? trim($tree[$i][1]) : '--';
						
						$ws = round(strlen($cr)/2);
						$m = max(strlen($cl), $ws);
						$m=$m+1;
						
						$cl = str_pad($cl,$m,' ',STR_PAD_RIGHT);
						$cr = str_pad($cr,$m*2,' ',STR_PAD_RIGHT);
						
						array_push($nl,$cl);
						array_push($nr,$cr);
				}
		}
		
		if(count($nl) > 0 || count($nr) > 0){
				$sect->writeText(trim(implode('',$nl))."\n",$font13,$parFormat);
				$sect->writeText(trim(implode('',$nr)),$font7,$parFormat);
		}
		
		
		//$rtf->save($filename);
		return $rtf;
}

function getTwextBreakCode($breakCount){
		if($breakCount==1) return 0;
		else return 1;
}
?>