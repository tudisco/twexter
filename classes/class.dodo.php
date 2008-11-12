<?php
/**
 * Class and function to work with dodo file format
 *
 * @package Dodo
 * @author Jason Tudisco
 * @version 0.1
 * @copyright Jason Tudisco (c) 2008 - Only Duke Crawford has rights to use this code freely.
 */


/**
 * Bad Language Data in File Name
 */
define('DODO_BAD_LANG', 1000);
/**
 * Bad Author name in file name. Not being used now
 */
define('DODO_BAD_AUTHOR', 1001);
/**
 * Unknow Dodo Version
 */
define('DODO_UNKNOWN_VERSION', 1002);
/**
 * Bad TimeStamp Data
 */
define('DODO_BAD_TIMESTAMP', 1003);
/**
 * Dodo Unknown Format
 */
define('DODO_UNKNOWN_FORMAT', 1004);
/**
 * Error found in dodo document
 */
define('DODO_DOCUMENT_ERROR',1005);
/**
 * Missing Info for title creation
 */
define('DODO_MISSING_DATA', 1006);


/**
 * Dodo Format One Column Idenifier
 */
define('DODO_TYPE_ONECOL',1);

/**
 * Dodo Format Two Column Idenifier
 */
define('DODO_TYPE_TWOCOL',2);

/**
 * Break Line Code used in Content Structure
 */
define('BREAK_LINE', 0);
/**
 * Paragraph Break Code used in Content Structure
 */
define('BREAK_PARA', 1);

//---Should Probably move to a util library latter
function detectUTF8($string)
{
        return preg_match('%(?:
        [\xC2-\xDF][\x80-\xBF]        # non-overlong 2-byte
        |\xE0[\xA0-\xBF][\x80-\xBF]               # excluding overlongs
        |[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}      # straight 3-byte
        |\xED[\x80-\x9F][\x80-\xBF]               # excluding surrogates
        |\xF0[\x90-\xBF][\x80-\xBF]{2}    # planes 1-3
        |[\xF1-\xF3][\x80-\xBF]{3}                  # planes 4-15
        |\xF4[\x80-\x8F][\x80-\xBF]{2}    # plane 16
        )+%xs', $string);
}

/**
 * Dodo Exception Class used to throw exception from the DODO code
 */
class DodoException extends Exception 
{
	function __toString(){
		return $this->getMessage();
	}
}

/**
 * Dodo Class used to Read and Write Twext Dodo Files
 */
class Dodo
{
	/**
	 * Content Title
	 *
	 * @var string
	 */
	protected $_title;
	/**
	 * Language Used for Text
	 *
	 * @var string
	 */
	protected $_lang_text;
	/**
	 * Language used for Twext
	 *
	 * @var string
	 */
	protected $_lang_twext;
	/**
	 * Dodo Version Number
	 *
	 * @var decimal
	 */
	protected $_version;
	/**
	 * Dodo Timestamp
	 *
	 * @var integer
	 */
	protected $_timestamp;
	/**
	 * Author - Currently not being used
	 *
	 * @var string
	 */
	protected $_author;
	/**
	 * Full unmodified file name given
	 *
	 * @var string
	 */
	protected $_filename;
	/**
	 * Raw dodo file contents sin modifications
	 *
	 * @var string
	 */
	protected $_raw_contents;
	/**
	 * Structed document information. Document stored as a special array of line breaks, paragraph breaks and chunks.
	 *
	 * @var array
	 */
	protected $_content_structure;
	
	/**
	 * Contructor
	 *
	 * @param string $filename Name of the dodo file
	 * @param string $contents Dodo files contents
	 */
	function __construct($filename=null, $contents=null){
		
		if(!is_null($filename)){
			$this->setFilename($filename);
		}
		
		if(!is_null($contents)){
			$this->setContents($contents);
		}
		
	}
	
	/**
	 * Check for the end of the file name
	 *
	 * @param string $text Filename Chunk
	 * @return boolean True if it is the end, Falso otherwise.
	 */
	private function _checkForFilenameEnding($text){
		return (strcasecmp($text,"dodo.txt")==0 || strcasecmp($text,"dodo")==0) ? true : false;
	}
	
	/**
	 * Set and parse the filename
	 *
	 * @param string $filename Dodo filename
	 */
	function setFilename($filename){
		$this->_filename = $filename;
		
		$data = explode('..',$filename);
		
		$utf8 = detectUTF8($filename);
		
		//print_r($data);
		
		$data_len = count($data);
		
		$sec_version = ($data_len - 2);
		$sec_lang = 1;
		$sec_time = 2;
		//--- We Decided not to include author in this version --- $sec_author = 1;
		//$sec_version = 4;
		
		//Lets get the verion
		if(is_numeric($data[$sec_version])){
			$this->_version = $data[$sec_version];
			if($this->_version != '0.1' || $this->_version != 0.1){
				throw new DodoException("Unknown Dodo Version", DODO_UNKNOWN_VERSION);
			}
		}else{
			throw new DodoException("Unknown Dodo Verions and Version number is not numeric ({$data[$sec_version]}) $sec_version", DODO_UNKNOWN_VERSION);
		}
		
		//---Lets get th title
		$this->_title = str_replace('.', ' ', $data[0]);
		
		if(!is_string($this->_title) && strlen($this->_title)){
			throw new DodoException("Bad Dodo Title ({$this->_title})",DODO_DOCUMENT_ERROR);
		}
		
		//---Lets get the translation and language info
			//Make sure data is set and this make sure it has a period to seperate the languages.
		if(isset($data[$sec_lang]) && strpos($data[$sec_lang],'.')>1){
			$l = explode('.', $data[$sec_lang]);
			if(count($l)<2){
				//THROW ERROR HERE
				throw new DodoException("Dodo Filename does not specify translation languages correctly", DODO_BAD_LANG);
			}
			$this->_lang_text = $l[0];
			$this->_lang_twext = $l[1];
		}else{
			throw new DodoException("Dodo Filename does not specify translation languages correctly", DODO_BAD_LANG);
		}
		
		//---Lets Get the time stamp
		if(isset($data[$sec_time]) &&  !$this->_checkForFilenameEnding($data[$sec_time])){
			$time_regex = '/(\d\d)(\d\d)(\d\d)\.(\d\d)(\d\d)(\d\d)/';
			if($utf8){
				$time_regex.="u";
			}
			$match = array();
			if(preg_match($time_regex,trim($data[$sec_time]),$match)){
				//print_r($match);
				$this->_timestamp = mktime($match[4],$match[5],$match[6],$match[2],$match[3],$match[1]);
			}else{
				throw new DodoException("Not a valid time stamp ({$data[$sec_time]}) $sec_time",DODO_BAD_TIMESTAMP);
			}
				
		}
		
		//---Lets get author
			//Was taken out for verion 0.1
		/*if(isset($data[$sec_author]) && !$this->_checkForFilenameEnding($data[$sec_author])){
			if(strlen($data[$sec_author])>1){
				throw new DodoException("Dodo Filename does not specify author correctly", DODO_BAD_AUTHOR);
			}
			$this->_author = $data[$sec_author];
		}*/
	}
	
	/**
	 * Determine which dodo format we are dealing with.
	 *
	 * @param string $content
	 * @return integer Type 1 for one column or 2 for two column.
	 */
	public function detectDodoFormat($contents){
		//Detect UTF8
		$utf8 = detectUTF8($contents);
		
		//Detects the twxt line
		$regex_type2 = "/(twxttwxttwxttwxt)+/";
		if($utf8){
			$regex_type2.='u';
		}
		//Detects a Non Space Char with three or more spaces and anoter non space char.
			//Not used right now. This is assumed if twxt line not found.
		$regex_type1 = '/(\S)(\s\s\s+)(\S)/';
		if($utf8){
			$regex_type1.='u';
		}
		
		//$contents = str_replace(array("\r\n", "\n\r", "\r"), "\n", $contents);
		$content_array = explode("\n", $contents);
		$content_line = $content_array[0];
		unset($content_array);
		
		if(preg_match($regex_type2, $contents)){
			$final_type = DODO_TYPE_ONECOL;
		}else if(preg_match($regex_type1,$content_line)){
			$final_type = DODO_TYPE_TWOCOL;
		}else{
			$final_type = null;
		}
		
		return $final_type;
	}
	
	public function setTextTwxt($text, $twxt){
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
					$tree[] = $this->getBreakCode($break);
					$break = 0;
				}
				$break++;
				continue;
			}
			//---Ok lets handle the breaks first if there is any
			if($break){
				$tree[] = $this->getBreakCode($break);
				$break = 0;
			}
			//---Add a chunk
			$tree[] = array($t,$w);
		}
		
		$this->_content_structure = $tree;
		
	}
	
	 /**
	 * Set the dodo file contents and parse into content structure array
	 *
	 * @param string $contents Dodo files contents
	 */
	public function setContents($contents){
		$this->_raw_contents = $contents;
		
		$format = $this->detectDodoFormat($contents);
		if(is_null($format)){
			throw new DodoException("Dodo Format is invalid.. the format is unknown", DODO_UNKNOWN_FORMAT);
		}
		
		$tree = null;
		
		if($format == DODO_TYPE_TWOCOL){
			//---Do Two Column Parse Here
			$tree = $this->ParseTwoColumn($contents);
		}else if($format == DODO_TYPE_ONECOL){
			//---Do one Column
			$tree = $this->ParseOneColumn($contents);
		}else{
			//---Ups, what happen!
			throw new DodoException("Ups, we don't know how to parse this file", DODO_UNKNOWN_FORMAT);
		}
		$this->_content_structure = $tree;
	}
	
	/**
	 * Parse the two column dodo format
	 *
	 * @param string $contents
	 * @return array document structure array
	 */
	protected function ParseTwoColumn($contents){
		//---Unicode File (UTF8)
		$utf8 = detectUTF8($contents);
		if(!utf8) $contents = utf8_encode($contents);
		$utf8=true;
		//$utf8 = detectUTF8($contents);
		//---Split into lines
		$contents = str_replace(array("\r\n", "\n\r", "\r"), "\n", $contents);
		$lines = explode("\n", $contents);
		
		$tree = array();
		$blank = 0;
		$linenum = 0;
		
		//Lets build a tree (not tree anymore)
		foreach($lines as $line){
			//---Increment Line Number
			$linenum++;
			
			//If line is empty
			if(strlen(trim($line))<1){
				//---We already have a para break.. handle that before adding more breaks
				if($break==2){
					$tree[] = $this->getBreakCode($break);
					$break = 0;
				}
				//---Increment break count
				$break++;
				//---Continue to next line
				continue;
			}
			
			//---Lets handle breaks before we add chunk.. if any
			if($break>0){
				$tree[] = $this->getBreakCode($break);
				$break = 0;
			}
			
			//---Split the chunks into two pieces.. at least 3 space in the middle
			if($utf8){
				$split = preg_split('/\s\s\s+/', $line);
			}else{
				$split = preg_split('/\s\s\s+/u', $line);
			}
			//echo '<pre>'.print_r($split).'</pre>';
			//---Make sure it is an array
			if(is_array($split)){
				
				//---Make sure we have only 2 chunks or less
				//--Duke see no use this
				/*if(count($split)>2){
					throw new DodoException("Error in Document (Double Split) on line: $linenum", DODO_DOCUMENT_ERROR);
				}*/
				
				//---Trim Text
				if(isset($split[0])){
					$split[0] = trim($split[0]);
				}
				
				//---Trim Twxt
				if(isset($split[1])){
					$split[1] = trim($split[1]);
				}
				
				//---Store in the tree
				$tree[] = $split;
			}else{
				throw new DodoException("Error in Domument on line: $linenum", DODO_DOCUMENT_ERROR);
			}
		}
		
		return $tree;
	}
	
	/**
	 * Parse one colunm dodo format
	 *
	 * @param string $contents
	 * @return array Document Structure Array
	 */
	protected function ParseOneColumn($contents){
		$utf8 = detectUTF8($contents);
		if(!utf8) $contents = utf8_encode($contents);
		$utf8=true;
		
		$contents = str_replace(array("\r\n", "\n\r", "\r"), "\n", $contents);
		
		$document_remove = '/[^\n\r]+(TEXTTEXTTEXT)+\w+[\r\n]+/';
		if($utf8){
			$document_remove.='u';
		}
		$document_split = '/[\n\r]+(twxttwxttwxt)+\w+[\r\n]+/';
		if($utf8){
			$document_split.='u';
		}
		
		//---Get rid of TEXTTEXTTEXT if it exist
		$contents = preg_replace($document_remove, '', $contents);
		
		//---Split Document by twxttwxttwxt line
		$contents_split = preg_split($document_split, $contents);
		
		//---Verify this worked
		if(!is_array($contents_split) && count($contents_split)<2){
			throw new Exception("twext line not found or more than one found", DODO_DOCUMENT_ERROR);
		}
		
		//---Ok.. split by line
		$text = explode("\n",$contents_split[0]);
		$twxt = explode("\n", $contents_split[1]);
		
		//test crap >> echo '<pre>'.print_r($text, true).'</pre>';
		
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
					$tree[] = $this->getBreakCode($break);
					$break = 0;
				}
				$break++;
				continue;
			}
			//---Ok lets handle the breaks first if there is any
			if($break){
				$tree[] = $this->getBreakCode($break);
				$break = 0;
			}
			//---Add a chunk
			$tree[] = array($t,$w);
		}
		
		return $tree;
	}
	
	/**
	 * Get Code break ID by break count
	 *
	 * @param integer $breakCount
	 * @return integer Code break ID used in Structured Document Array
	 */
	private function getBreakCode($breakCount){
		if($breakCount==1) return BREAK_LINE;
		else return BREAK_PARA;
	}
	
	/**
	 * Get title for content
	 *
	 * @return string Dodo Title
	 */
	public function getTitle(){
		return $this->_title;
	}
	
	/**
	 * Get Dodo Time Stampe
	 *
	 * @return integer Timestamp (PHP Defualt timestamp)
	 */
	public function getTimestamp(){
		return $this->_timestamp;
	}
	
	/**
	 * Get Dodo Version
	 *
	 * @return integer Verion Number
	 */
	public function getVerson(){
		return $this->_version;
	}
	
	/**
	 * Get Language for text
	 *
	 * @return string
	 */
	public function getLangText(){
		return $this->_lang_text;
	}
	
	/**
	 * Get Language for Twext
	 *
	 * @return string
	 */
	public function getLangTwext(){
		return $this->_lang_twext;
	}
	
	/**
	 * Get full filename given to class
	 *
	 * @return string Filename
	 */
	public function getFileName(){
		return $this->_filename;
	}
	
	/**
	 * Get Raw unmodified dodo file contents
	 *
	 * @return string
	 */
	public function getRawContents(){
		return $this->_raw_contents;
	}
	
	/**
	 * Set dodo content title. Title is forced to upper case and spaces replaced with one . and trimed.
	 *
	 * @param string $title Dodo Content Title
	 * @return boolen true if successfule, false otherwise
	 */
	public function setTitle($title){
		if(is_string($title) && strlen($title)>0){
			//--- Title is trimed set upper case and spaces are replaced with "."
			$title = trim($title);
			$title = strtoupper($title);
			$title = str_replace(" ", ".", $title);
			$this->_title = $title;
			return true;
		}
		return false;
	}
	
	/**
	 * Set dodo timestamp - using php normal timestamp
	 *
	 * @param itenger Php timetamp (time())
	 * @return boolean True if successful false otherwise
	 */
	public function setTimestamp($time){
		if(is_numeric($time)){
			$this->_timestamp = $time;
			return true;
		}
		return false;
	}
	
	/**
	 * Set Text Languege
	 *
	 * @param string $lang
	 * @return boolean True if succesful, otherwise false.
	 */
	public function setLangText($lang){
		if(is_string($lang) && strlen($lang)>1){
			$this->_lang_text = $lang;
			return true;
		}
		return false;
	}
	
	/**
	 * Set Twext Language
	 *
	 * @param string $lang
	 * @return boolean True if successful, False otherwise
	 */
	public function setLangTwext($lang){
		if(is_string($lang) && strlen($lang)>1){
			$this->_lang_twext = $lang;
			return true;
		}
		return false;
	}
	
	/**
	 * Set Dodo Version
	 *
	 * @param decimal $version
	 * @return boolean True if successful, false otherwise
	 */
	public function setVersion($version){
		if(is_numeric($version)){
			$this->_version = $version;
			return true;
		}
		return false;
	}
	
	/**
	 * Set Content Structure
	 *
	 * @param array $tree Conntent Structure Array
	 * @return boolean True if succesfule, false otherwise.
	 */
	public function setContentStruct($tree){
		if(is_array($tree)){
			$this->_content_structure = $tree;
			return true;
		}
		return false;
	}
	
	/**
	 * Return Content Structure
	 *
	 * @return array
	 */
	public function getContentStruct(){
		return $this->_content_structure;
	}
	
	public function createFileName(){
		$title = $this->getTitle();
		$timestamp = $this->getTimestamp();
		$text = $this->getLangText();
		$twxt = $this->getLangTwext();
		$version = $this->getVerson();
		
		if(!$title){
			throw new DodoException("We don't have a title",DODO_MISSING_DATA);
		}
		
		if(!$timestamp){
			throw new DodoException("We Don't have a timestamp",DODO_MISSING_DATA);
		}
		
		if(!$text){
			throw new DodoException("We Don't have a text language",DODO_MISSING_DATA);
		}
		
		if(!$twxt){
			throw new DodoException("We don't have a twext language",DODO_MISSING_DATA);
		}
		
		if(!$version){
			throw new DodoException("We Don't have a version",DODO_MISSING_DATA);
		}
		$formatted_timestamp = date("ymd.His",$timestamp); 
		return strtoupper(str_replace(' ', '.', $title))."..$text.$twxt..$formatted_timestamp..$version..dodo.txt";
	}
	
	public function createContents($onecol = false){
		if($onecol){
			return $this->_create_one_col();
		}else{
			return $this->_create_two_col();
		}
	}
	
	protected function _create_two_col(){
		$contents = $this->getContentStruct();
		
		if(!is_array($contents)){
			throw new DodoException("Content Struct is not an Array", DODO_MISSING_DATA);
		}
		
		$max_chars = 0;
		
		foreach($contents as $content){
			if(!is_array($content) && is_numeric($content)){
				continue;
			}
			$max_chars = max($max_chars, max(strlen($content[0]), strlen($content[1])));
		}
		
		$start_col2 = $max_chars+4;
		
		$text = '';
		
		foreach($contents as $content){
			if(!is_array($content) && is_numeric($content)){
				if($content==0){
					$line = str_repeat(' ', $start_col2)."\n";
				}elseif($content==1){
					$line = str_repeat(' ', $start_col2)."\n".str_repeat(' ', $start_col2)."\n";
				}
			}else{
				$line = str_pad($content[0], $start_col2, ' ', STR_PAD_RIGHT);
				$line.= $content[1];
				$line.="\n";
			}
			
			$text.=$line;
			$line = '';
		}
		
		
		return detectUTF8($text) ? $text : utf8_encode($text);
	}
	
	protected function _create_one_col(){
		$contents = $this->getContentStruct();
		
		if(!is_array($contents)){
			throw new DodoException("Content Struct is not an Array", DODO_MISSING_DATA);
		}
		
		$text = '';
		$twxt = '';
		
		foreach($contents as $content){
			
			if(!empty($text) && !empty($twxt)){
				$text.= "\n";
				$twxt.= "\n";
			}
			
			if(!is_array($content) && is_numeric($content)){
				if($content==0){
					$text.= "";
					$twxt.= "";
				}elseif($content==1){
					$text.= "\n";
					$twxt.= "\n";
				}
			}else{
				$text.=$content[0];
				$twxt.=$content[1];
			}
		}
		
		return detectUTF8($text.$twxt) ? $text."\n\ntwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxt\n\n".$twxt : utf8_encode($text."\n\ntwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxttwxt\n\n".$twxt);
	}
}


?>