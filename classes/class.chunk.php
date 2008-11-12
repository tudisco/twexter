<?php


class Chunk
{
    
    const both = 1;
    const before = 2;
    const after = 3;
    
    private $_words_both;
    private $_words_before;
    private $_words_after;
    private $_max_length;
    
    private $_regex_both = array('/(?!^|!\n)( %s )(?!$|!\n)/im', '/(?:^)(%s )(?!$|!\n)/im', '/(?!$|!\n)( %s)(?:$)/im');
    private $_replace_both = array("\n%s\n","%s\n","\n%s");
    
    private $_regex_before = array('/\b(?!^|!\n)(%s)\b/im');
    private $_replace_before = array("\n%s");
    
    private $_regex_after = array('/\b(%s)(?!$|!\n)\b/im');
    private $_replace_after = array("%s\n");
    
    function __construct($length=-1,$both=null,$before=null,$after=null){
        $this->_max_length = $length;
        $this->_words_both = $both;
        $this->_words_before = $before;
        $this->_words_after = $after;
    }
    
    private function _importWords($words){
        if(is_array($words)){
            return $words;
        }
        
        if(is_string($words) && strpos($words,',')){
            return explode(',', $words);
        }
        
        return array();
    }
    
    function setWordsBoth($words){
       $this->_words_both = $this->_importWords($words);
    }
    
    function setWordsBefore($words){
        $this->_words_before = $this->_importWords($words);
    }
    
    function setWordsAfter($words){
        $this->_words_after = $this->_importWords($words);
    }
    
    function setMaxLength($length){
        if(is_numeric($length)){
            $this->_max_length = $length;
        }
    }
    
    function cleanWordList(){
        
        $wbt = (is_array($this->_words_both)) ? $this->_words_both : array();
        $b = (is_array($this->_words_before)) ? $this->_words_before : array();
        $a = (is_array($this->_words_after))  ? $this->_words_after : array();
        
        $b = array_diff($b, $wbt);
        $a = array_diff($a, $wbt, $b);
        
        $wbt = array_unique($wbt);
        $b = array_unique($b);
        $a = array_unique($a);
        
        $wbt = array_values($wbt);
        $b = array_values($b);
        $a = array_values($a);
        
        $this->_words_both = $wbt;
        $this->_words_before = $b;
        $this->_words_after = $a;
        
    }
    
    private function checkLength($text){
        if($this->_max_length < 1) return $text;
        return wordwrap($text, $this->_max_length);
    }
    
    private function fixNewLines($text){
        $text = str_replace(array("\r\n", "\n\r", "\r"), "\n", $text);
        $text = explode("\n",$text);
        $nt = '';
        $nlc = 0;
        
        foreach($text as $line){
            if(!empty($line)){
                if($nlc!=0){
                    $nlc = 0;
                    $nt.="\n";
                }
                $nt.=trim($line);
                $nt.="\n\n";
            }else{
                $nlc++;
            }
        }
        return $nt;
    }
    
    private function filter($text, $words, $type=1){
        
        if(!is_array($words)) return $text;
        
        $filter = array();
        $replace = array();
        
        switch($type){
            case Chunk::both:
                $filter = $this->_regex_both;
                $replace = $this->_replace_both;
                break;
            case Chunk::before:
                $filter = $this->_regex_before;
                $replace = $this->_replace_before;
                break;
            case Chunk::after:
                $filter = $this->_regex_after;
                $replace = $this->_replace_after;
                break;
        }
        
        $fcount = count($filter);
        if($fcount!=count($replace)){
            return $text;
        }
        
        foreach($words as $w){
            $f = array();
            $r = array();
            for($i=0;$i<$fcount;$i++){
                $f[$i] = sprintf($filter[$i], preg_quote($w, '/'));
                $r[$i] = sprintf($replace[$i], $w);
            }
           //print_r($f);
           $text = preg_replace($f, $r, $text);
        }
        
        return $text;
    }
    
    public function chunkText($text){
        $this->cleanWordList();
        $text = $this->fixNewLines($text);
        $text = $this->filter($text, $this->_words_both, Chunk::both);
        $text = $this->filter($text, $this->_words_before, Chunk::before);
        $text = $this->filter($text, $this->_words_after, Chunk::after);
        $text = $this->checkLength($text);
        
        return $text;
    }
    
}
?>