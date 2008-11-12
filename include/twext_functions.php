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

function getTwextBreakCode($breakCount){
		if($breakCount==1) return 0;
		else return 1;
}
?>