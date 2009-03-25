<?php
define(CLASS_DBTWEXT_PATH, dirname(__FILE__).'/');
if(!class_exists("dbDocument")){
	require_once CLASS_DBTWEXT_PATH.'../includes/zendbootstrap.php';
}


/**
 * Db Text Database Error
 */
define('DBTWEXT_DB_ERROR', 1000);
/**
 * Variable Type Error
 */
define('DBTWEXT_TYPE_ERROR', 1001);

class DbTwextException extends Exception 
{
	function __toString(){
		return $this->getMessage();
	}
}

class DbTwext {
	
	/**
	 * Array that store the different translation languages
	 *
	 * @var array
	 */
	protected $_tran_langs;
	/**
	 * Array that store the translation chunks
	 *
	 * @var array
	 */
	protected $_trans;
	/**
	 * Array that stores the translation DB ids
	 *
	 * @var array
	 */
	protected $_trans_ids;
	
	protected $_trans_type;
	/**
	 * Document Title
	 *
	 * @var string
	 */
	protected $_document_title;
	/**
	 * Document Creation Date
	 *
	 * @var integer
	 */
	protected $_document_creation_date;
	/**
	 * Document User ID
	 *
	 * @var integer
	 */
	protected $_document_userid;
	/**
	 * Document Sha1 Unique ID
	 *
	 * @var string
	 */
	protected $_document_sha1;
	/**
	 * Document DB id
	 *
	 * @var integer
	 */
	protected $_document_id;
	/**
	 * Document Insert Date
	 *
	 * @var integer
	 */
	protected $_document_insert_date;
	/**
	 * Document Update Date
	 *
	 * @var integer
	 */
	protected $_document_update_date;
	/**
	 * Document Description
	 *
	 * @var string
	 */
	protected $_document_desc;
	/**
	 * Docuemnt is Global (available to all users)
	 *
	 * @var boolean
	 */
	protected $_document_global;
	/**
	 * Document Version
	 *
	 * @var decimal
	 */
	protected $_document_version;
	/**
	 * Docuemtn URL Link
	 *
	 * @var string
	 */
	protected $_document_url_link;
	/**
	 * Document Last Chunk Style
	 *
	 * @var string
	 */
	protected $_document_chunk_style;
	/**
	 * Parent Doc ID
	 */
	protected $_document_parent_id;
	/**
	 * Parent Doc SHA1
	 */
	protected $_document_parent_sha1;
	/**
	 * Document Tags
	 */
	protected $_document_tags;
	
	

	/**
	 * Constructor
	 *
	 * @param string $title
	 * @param string $lang_text
	 * @param string $lang_twxt
	 * @param array $text
	 * @param array $twxt
	 * @param integer $userid
	 */
	function __construct($title=null,$tran1_lang=null,$tran2_lang=null,$tran1=null,$tran2=null,$userid=null) {
		if(!is_null($title)){
			$this->setTitle($title);
		}
		
		if(!is_null($tran1_lang)){
			$this->_tran_langs[] = $tran1_lang;
			$this->_trans_ids[] = null;
			$this->_trans[] = $tran1;
			$this->_trans_type[] = "text";
		}
		
		if(!is_null($tran2_lang) && !is_null($tran1_lang)){
			$this->_tran_langs[] = $tran2_lang;
			$this->_trans_ids[] = null;
			$this->_trans[] = $tran2;
			$this->_trans_type[] = "twxt";
		}
		
		$this->_document_desc = '';
		$this->_document_global = false;
		$this->_document_userid = $userid;
	}
	
	/**
	 * Add Translation Chunks to Docuemnt
	 *
	 * @param string $lang
	 * @param array $tran
	 */
	function addTranslation($lang, $tran, $type=null){
		if(is_string($lang) && strlen($lang)>0 && is_array($tran)){
			$this->_tran_langs[] = $lang;
			$this->_trans[] = $tran;
			$this->_trans_ids[] = null;
			$this->_trans_type[] = $type;
		}else{
			throw new DbTwextException("Arguement Error. Not valid types", DBTWEXT_TYPE_ERROR);
		}
	}
	
	function getTranslations(){
		$trans_count = count($this->_tran_langs);
		$t = array();
		for($i=0; $i<$trans_count; $i++){
			$t[] = array('id'=>$this->_trans_ids[$i], 'lang'=>$this->_tran_langs[$i], 'chunks'=>$this->_trans[$i], 'type'=>$this->_trans_type[$i]);
		}
		return $t;
	}
	
	/**
	 * Set Docuemtn Title
	 *
	 * @param string $title
	 */
	function setTitle($title){
		if(is_string($title) && strlen($title)>0){
			$this->_document_title = $title;
		}else{
			throw new DbTwextException("Title is empty or not a string", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Set Documetn Description
	 *
	 * @param string $desc
	 */
	function setDescription($desc){
		if(is_string($desc)){
			$this->_document_desc = $desc;
		}else{
			throw new DbTwextException("Description is not a string", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Set Parent ID
	 *
	 * @param number Parent ID
	 */
	function setParentId($id){
		if(is_numeric($id)){
			$this->_document_parent_id = $id;
		}else{
			throw new DbTwextException("Parent Doc ID not a number", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Set Parent ID
	 *
	 * @return number Parent ID
	 */
	function getParentId(){
		return $this->_document_parent_id;
	}
	
	/**
	 * Set Parent Sha1
	 *
	 * @param string sha1
	 */
	function setParentSha1($sha1){
		if(is_string($sha1)){
			$this->_document_parent_sha1 = $sha1;
		}else{
			throw new DbTwextException("Parent sha1 is not a string", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Set Parent Sha1
	 *
	 * @return string sha1
	 */
	function getParentSha1(){
		return $this->_document_parent_sha1;
	}
	
	/**
	 * Get Docuemtn Title
	 *
	 * @return string
	 */
	function getTitle(){
		return $this->_document_title;
	}
	
	/**
	 * Get Description
	 *
	 * @return string
	 */
	function getDescription(){
		return $this->_document_desc;
	}
	
	/**
	 * Create a unique document id (SHA1)
	 *
	 * @param string $key a unique key to use to generate sha1
	 * @param boolean $rand True to use rand information when generating key
	 * @return string SHA1
	 */
	function createUniqueId($key='', $rand=true){
		$h = $key;
		if(is_string($this->_document_title) && strlen($this->_document_title)){
			$h.=$this->_document_title;
		}
		if(is_string($this->_document_creation_date) && strlen($this->_document_creation_date)){
			$h.=$this->_document_creation_date;
		}
		if($rand){
			srand(time());
			$h.=rand(1,99999);
		}
		return sha1($h);
	}
	
	/**
	 * Checks to see if it is a Unix timestamp.. if not passes string to strtotime function
	 *
	 * @param mixed $time
	 * @return integer Unix timestamp
	 */
	private function _checkDateTime($time){
		if(!is_int($time)){
			$time = strtotime($time);
		}
		return $time;
	}
	
	
	/**
	 * Make Document Available to all
	 *
	 * @param boolean $global true if document avilable to all, false if just for user
	 */
	function setGlobal($global){
		$this->_document_global = ($global===true || $global=='yes') ? true : false;
	}
	
	/**
	 * Set Creation Date
	 *
	 * @param mixed $time Unix timestamp or datetime string
	 */
	function setCreationDate($time){
		$time = $this->_checkDateTime($time);
		if($time === false || is_null($time) || !is_int($time)){
			throw new DbTwextException("Error Converting Creation Date to Time Stamp", DBTWEXT_TYPE_ERROR);	
		}
		$this->_document_creation_date = $time;
	}
	
	function setTags($tags){
		if(is_string($tags)){
			$this->_document_tags = $tags;
		}
	}
	
	function getTags(){
		return $this->_document_tags;
	}
	
	/**
	 * Set User ID
	 *
	 * @param iteger $id
	 */
	function setUserID($id){
		if(is_numeric($id)){
			$this->_document_userid = $id;
		}else{
			throw new DbTwextException("Userid is not numeric", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Get user id
	 *
	 * @return integer
	 */
	function getUserID(){
		return (is_numeric($this->_document_userid)) ? $this->_document_userid : false;
	}
	
	/**
	 * Get Creation Date
	 *
	 * @return integer Unix timestamp
	 */
	function getCreationDate(){
		return (is_int($this->_document_creation_date) && $this->_document_creation_date!=0) ? $this->_document_creation_date : false;
	}
	
	/**
	 * Get date docuemnt was inserted into DB
	 *
	 * @return integer Unix timestamp
	 */
	function getInsertDate(){
		return (is_int($this->_document_insert_date) && $this->_document_insert_date>0) ? $this->_document_insert_date : false;
	}
	
	/**
	 * Set time document was last updated
	 *
	 * @param mixed $time Unix timestamp or datetime string
	 */
	function setUpdateDate($time){
		$time = $this->_checkDateTime($time);
		if($time === false || is_null($time) || !is_int($time)){
			throw new DbTwextException("Could not convert update time", DBTWEXT_TYPE_ERROR);	
		}
		$this->_document_update_date = $time;
	}
	
	
	/**
	 * Get Document Id
	 *
	 * @return interget
	 */
	function getId(){
		return $this->_document_id;
	}
	
	/**
	 * Set Document ID
	 *
	 * @param integer $id Document ID
	 */
	function setId($id){
		if(is_numeric($id)){
			$this->_document_id = $id;
		}
	}
	
	/**
	 * Get Last time docuement was updated
	 *
	 * @return integer
	 */
	function getUpdateDate(){
		return $this->_document_update_date;
	}
	
	/**
	 * Get document unique id
	 *
	 * @return string SHA1
	 */
	function getSha1(){
		return $this->_document_sha1;	
	}
	
	/**
	 * Set document unique id
	 *
	 * @param string Sha1 ID
	 */
	function setSha1($sha1){
		$this->_document_sha1 = $sha1;
	}
	
	/**
	 * Set Document Version
	 *
	 * @param decimal $ver
	 */
	function setVersion($ver){
		if(is_numeric($ver)){
			$this->_document_version = $ver;
		}else{
			throw new DbTwextException("Version Not Numeric", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Get document version
	 *
	 * @return return document version or false
	 */
	function getVersion(){
		return (is_numeric($this->_document_version)) ? $this->_document_version : false;
	}
	
	/**
	 * Set Last Chunk Style
	 *
	 * @param string chunk style used
	 */
	function setChunkStyle($style){
		if(is_string($style)){
			$this->_document_chunk_style = $style;
		}else{
			throw new DbTwextException("Chunk Style Type is not String", DBTWEXT_TYPE_ERROR);
		}
	}
	
	/**
	 * Get Last Chunk Style
	 *
	 * @return Last Chunk Style Used
	 */
	function getChunkStyle(){
		return (empty($this->_document_chunk_style)) ? 'unknown' : $this->_document_chunk_style;
	}
	
	/**
	 * Returns mysql timestamp for now
	 *
	 * @return string datetime string
	 */
	protected function _dateNow($time=null){
		$time = (!is_null($time)) ? $time : time();
		return date('Y-m-d H:i:s', $time);
	}
	
	/**
	 * Add Document to DB
	 *
	 * @return mixed Document DB ID or Fasle if failed
	 */
	function add(){
		//TODO: Wrap in tranaction
		if($this->_add_document() && $this->_add_translation()){
			
			if(!empty($this->_document_url_link) && is_string($this->_document_url_link)){
				if(!$this->_add_url()){
					//echo 'No URL!';
				}
			}
			
			if(!empty($this->_document_tags)){
				$this->_add_tags();
			}
			
			return $this->_document_id;
		}else{
			return false;
		}
	}
	
	/**
	 * Add Document Info to DB
	 *
	 * @return integer document ID
	 */
	protected function _add_document(){
		$db = new dbDocument();
		
		//TODO: add some data checking here before saving.. 
		$data = array();
		$current_time = time();
		$current_date = $this->_dateNow($current_time);
		$data['title'] = $this->_document_title;
		$data['user_id'] = $this->_document_userid;
		$data['description'] = $this->_document_desc;
		$data['created_on'] = (!empty($this->_document_creation_date)) ? date("Y-m-d H:i:s", $this->_document_creation_date) : $current_date;
		$data['inserted_on'] = (!empty($this->_document_insert_date)) ? date("Y-m-d H:i:s", $this->_document_insert_date) : $current_date;
		$data['updated_on'] = (!empty($this->_document_update_date)) ? date("Y-m-d H:i:s", $this->_document_update_date) : $current_date;
		$this->_document_sha1 = (empty($this->_document_sha1)) ? $this->createUniqueId("twext", true) : $this->_document_sha1;
		$data['sha1'] = $this->_document_sha1;
		$data['global'] = ($this->_document_global) ? 'yes' : 'no';
		$data['version'] = (empty($this->_document_version)) ? 1.0 : $this->_document_version;
		$data['chunk_style'] = (empty($this->_document_chunk_style)) ? 'unknown' : $this->_document_chunk_style;
		$data['parent_id'] = (is_numeric($this->_document_parent_id)) ? $this->_document_parent_id : 0;
		$data['parent_sha1'] = (!empty($this->_document_parent_sha1)) ? $this->_document_parent_sha1 : '';
		
		$pkey = $db->insert($data);
		
		if(!is_numeric($pkey)){
			throw new DbTwextException("Primary ID is not numeric", DBTWEXT_DB_ERROR);
		}
		
		if(empty($this->_document_insert_date)){
			$this->_document_insert_date = $current_time;
		}
		if(empty($this->_document_creation_date)){
			$this->_document_creation_date = $current_time;
		}
		if(empty($this->_document_update_date)){
			$this->_document_update_date = $current_time;
		}
		
		$this->_document_id = $pkey;
		return $pkey;
	}
	
	/**
	 * Add a translation to the DB and chunks
	 *
	 */
	protected function _add_translation(){
		$db = new dbDocumentTrans();
		
		//TODO: add checking
		$data = array();
		$current_date = $this->_dateNow();
		$data['document_id'] = $this->_document_id;
		$data['version_trans'] = $this->_document_version;
		//TODO: Loop through trans
		$trans_count = count($this->_tran_langs);
		
		for($i=0; $i<$trans_count; $i++){
			$data['language'] = $this->_tran_langs[$i];
			$data['author'] = '';
			$data['user_id'] = $this->_document_userid;
			$data['inserted_on'] = $current_date;
			$data['updated_on'] = $current_date;
			$data['type'] = $this->_trans_type[$i];
			
			$pkey = $db->insert($data);
			
			if(!is_numeric($this->_document_id)){
				throw new DbTwextException("Document ID not numeric", DBTWEXT_TYPE_ERROR);
			}
			
			$this->_trans_ids[$i] = $pkey;
			$this->_add_chunks($i,$pkey);
		}
		
		return true;
	}
	
	protected function _add_url(){
		$db = new dbDocumentLinkResource();
		$data = array();
		
		$data['type'] = 'url';
		$data['url'] = $this->_document_url_link;
		$data['document_id'] = $this->_document_id;
		
		return $db->insert($data);
	}
	
	protected function _add_tags(){
		$tags = $this->_document_tags;
		$dbt = new dbTags();
		$dbtl = new dbTagsLink();
		$dbtl->delete("doc_id = ".$this->_document_id);
		if(is_string($tags) && strlen($tags)){
			$tags = explode(',', $tags);
			foreach($tags as $tag){
				$tag = trim($tag);
				if(empty($tag)) continue;
				$sel = $dbt->select();
				$sel->where("tag = ?", $tag);
				$res = $dbt->fetchAll($sel);
				if($res->count()>0){
					$r = $res->toArray();
					$tid = $r[0]['id'];
				}else{
					$data = array('tag'=>$tag);
					$tid = $dbt->insert($data);
					if(!is_numeric($tid)) $tid = $dbt->getAdapter()->lastInsertId();
				}
				
				$dbtl->insert(array('tag_id'=>$tid, 'doc_id'=>$this->_document_id));
			}
		}
	}
	
	/**
	 * Add Chunks to the DB
	 *
	 * @param integer $indx Trans Index
	 * @param integer $trans_id Translation DB ID
	 */
	protected function _add_chunks($indx, $trans_id){
		$cdb = new dbDocumentChunks();
		$chunks = $this->_trans[$indx];
		$data = array();
		if(!is_array($chunks)){
			throw new DbTwextException('Chunks not an array', DBTWEXT_DB_ERROR);
		}
		$pos = 0;
		foreach($chunks as $chunk){
			$data['document_trans_id'] = $trans_id;
			$data['chunk_pos'] = $pos;
			if(!is_array($chunk) && is_int($chunk)){
				if($chunk == 0){
					$data['break'] = 'line';
				}else{
					$data['break'] = 'para';
				}
				$data['chunk'] = '';
			}else{
				$data['break'] = 'none';
				$data['chunk'] = $chunk;
			}
		
			$pkey = $cdb->insert($data);
			
			if(!is_numeric($pkey)){
				throw new DbTwextException("Primary Key not a number", DBTWEXT_DB_ERROR);
			}
			
			unset($data);
			$pos++;
		}
	}
	
	/**
	 * Update the current document
	 *
	 */
	function update(){
		$this->_update_document();
	}
	
	/**
	 * Udate document info in DB
	 *
	 */
	protected function _update_document(){
		if(!is_numeric($this->_document_id)){
			throw new DbTwextException("Can not update, No document ID", DBTWEXT_TYPE_ERROR);
		}
		
		$db = new dbDocument();
		
		//TODO: we need to handle versions.. This should be implemented in the future. For now version
		//	Not being handled.
		
		//TODO: add some data checking here before saving.. 
		$data = array();
		$current_date = $this->_dateNow();
		$data['title'] = $this->_document_title;
		$data['user_id'] = $this->_document_userid;
		$data['description'] = $this->_document_desc;
		$data['created_on'] = (!empty($this->_document_creation_date)) ? $this->_document_creation_date : $current_date;
		$data['inserted_on'] = (!empty($this->_document_insert_date)) ? $this->_document_insert_date : $current_date;
		$data['updated_on'] = (!empty($this->_document_update_date)) ? $this->_document_update_date : $current_date;
		$data['sha1'] = (empty($this->_document_sha1)) ? $this->createUniqueId("twext", true) : $this->_document_sha1;
		$data['global'] = ($this->_document_global) ? 'yes' : 'no';
		$data['version'] = (empty($this->_document_version)) ? 1.0 : $this->_document_version;
		$data['chunk_style'] = (empty($this->_document_chunk_style)) ? 'unknown' : $this->_document_chunk_style;
		$data['parent_id'] = (is_numeric($this->_document_parent_id)) ? $this->_document_parent_id : 0;
		$data['parent_sha1'] = (!empty($this->_document_parent_sha1)) ? $this->_document_parent_sha1 : '';
		
		$db->update($data,"id = ".$this->_document_id);
	}
	
	protected function _update_translation(){
		//TODO: Handle Translations
	}
	
	protected function _update_chunks(){
		//TODO: Handle adding new chunks
	}
	
	
	/**
	 * Save document to db
	 * 
	 * if document has a document ID this will be updated
	 * if document does not have ID document will be added.
	 */
	function save(){
		//Right now we just need to add
		return $this->add();
		
		// IF we have a document ID update or create new version. Otherwise add new document.
		/*if(is_numeric($this->_document_id)){
			return $this->update();
		}else{
			return $this->add();
		}*/
	}
	
	/**
	 * Get Document Versions
	 *
	 * @return array
	 */
	function getVersions(){
		if(empty($this->_document_sha1)){
			throw new DbTwextException("Can not get versions, no sha1 id available", DBTWEXT_TYPE_ERROR);
		}
		
		$db = new dbDocument();
		
		$rowset = $db->fetchAll($db->select()->where("sha1 = ?", $this->_document_sha1)->order('version'));
		
		if(is_object($rowset) && $rowset->count()>0){
			return $rowset->toArray();
		}else{
			return false;
		}
	}
	
	/**
	 * Load document by DB ID
	 *
	 * @param integer $id
	 */
	function load($id){
		//TODO: Start Loading Docuemnt from DB
		$doc = $this->_load_document($id);
		if($doc !== false && is_array($doc[0])){
			$doc = $doc[0];
			$this->_document_id = $doc['id'];
			$this->_document_desc = $doc['description'];
			$this->_document_title = $doc['title'];
			$this->_document_sha1 = $doc['sha1'];
			$this->_document_global = $doc['global'];
			$this->_document_insert_date = strtotime($doc['inserted_on']);
			$this->_document_creation_date = strtotime($doc['created_on']);
			$this->_document_update_date = strtotime($doc['updated_on']);
			$this->_document_userid = $doc['user_id'];
			$this->_document_version = $doc['version'];
			$this->_document_chunk_style = $doc['chunk_style'];
			$this->_document_parent_id = $doc['parent_id'];
			$this->_document_parent_sha1 = $doc['parent_sha1'];
			
			//Load Trans
			$trans = $this->_load_trans($id);
			if($trans === false){
				throw new DbTwextException('No Translations', DBTWEXT_DB_ERROR);
			}else{
				foreach($trans as $tran){
					$this->_tran_langs[] = $tran['language'];
					$this->_trans_ids[] = $tran['id'];
					$this->_trans_type[] = $tran['type'];
				}
			}
			
			//Load Chunks
			$trans_count = count($this->_trans_ids);
			
			for($i=0;$i<$trans_count;$i++){
				$tranid = $this->_trans_ids[$i];
				$chunks = $this->_load_chunks($tranid);
				//print_r($chunks);
				$c = array();
				foreach($chunks as $chunk){
					if($chunk['break']!='none'){
						if($chunk['break']=='line'){
							$c[] = 0;
						}elseif($chunk['break']=='para'){
							$c[] = 1;
						}
						
					}else{
						$c[] = $chunk['chunk'];
					}
				}
				
				$this->_trans[$i] = $c;
			}
			
			//Load URL
			$url = $this->_load_url_link($this->_document_id);
			if($url !== false && is_array($url)){
				$this->_document_url_link = $url['url'];
			}
			
			//load tags
			$this->_document_tags = null;
			$dbtl = new dbTagsLink();
			$dbt = new dbTags();
			$sel = $dbtl->select()->where("doc_id = ?", $this->_document_id);
			$tids = $dbtl->fetchAll($sel);
			
			foreach($tids as $tid){
				$id = $tid->tag_id;
				$tag = $dbt->find($id);
				foreach($tag as $t){
					if($this->_document_tags==null){
						$this->_document_tags.=$t->tag;
					}else{
						$this->_document_tags.= ', '.$t->tag;
					}
				}
			}
			
		}else{
			throw new DbTwextException("Document does not exist", DBTWEXT_DB_ERROR);
		}
	}
	
	/**
	 * Load Document Info 
	 *
	 * @param integer $doc_id
	 * @return mixed Array with doc info or false
	 */
	protected function _load_document($doc_id){
		//Load the document
		$db = new dbDocument();
		$rowset = $db->find($doc_id);
		if(is_object($rowset) && $rowset->count()>0){
			return $rowset->toArray();
		}else{
			return false;
		}
	}
	
	/**
	 * Load document tranlation info
	 *
	 * @param iteger $doc_id
	 * @return mixed Array or False if no translation found
	 */
	protected function _load_trans($doc_id){
		//Load the translations for document
		$db = new dbDocumentTrans();
		$select = $db->select();
		$select->where("document_id = ?", $doc_id)->order('language');
		$rowset = $db->fetchAll($select);
		
		if(is_object($rowset)){
			if($rowset->count()==0){
				return false;
			}
			return $rowset->toArray();
		}else{
			throw new DbTwextException("Rowset is not an object doc $doc_id", DBTWEXT_DB_ERROR);
		}
	}
	
	/**
	 * Load Chunks for translation
	 *
	 * @param iteger $tran_id
	 * @return mixed chunks
	 */
	protected function _load_chunks($tran_id){
		//Load the chunks for documents
		$db = new dbDocumentChunks();
		$rowset = $db->fetchAll($db->select()->where("document_trans_id = ?", $tran_id)->order('chunk_pos'));
		
		if(is_object($rowset) && $rowset->count()>0){
			return $rowset->toArray();
		}else{
			throw new DbTwextException("No chucnks for translation $tran_id", DBTWEXT_DB_ERROR);
		}
	}
	
	protected function _load_url_link($doc_id){
		$db = new dbDocumentLinkResource();
		$select = $db->select();
		$select->where("document_id = ?", $doc_id);
		$rowset = $db->fetchAll($select);
		if(is_object($rowset)){
			if($rowset->count()==0){
				return false;
			}else{
				$url =  $rowset->toArray();
				if(is_array($url[0])){
					return $url[0];
				}else{
					false;
				}
			}
		}else{
			throw new DbTwextException("Load URL Error", DBTWEXT_DB_ERROR);
		}
	}
	
	/**
	 * Load latest verion of document by unique ID SHA1
	 *
	 * @param string $sha1
	 */
	function load_by_sha1($sha1){
		//$sql = "SELECT * FROM document WHERE sha1=\"%s\" AND inserted_on = (SELECT MAX(inserted_on) FROM document WHERE sha1=\"%s\")";
		
		$db = new dbDocument();
		$sel = $db->select();
		$sel->where("sha1 = ?", $sha1)->where("inserted_on = (SELECT MAX(inserted_on) FROM document WHERE sha1= ? )", $sha1);
		
		$rowset = $db->fetchAll($sel);
		
		if(is_object($rowset) && $rowset->count()>0){
			$row = $rowset->current();
			$this->load($row->id);
		}else{
			throw new DbTwextException("No document for sha1: $sha1", DBTWEXT_DB_ERROR);
		}
	}
	
	function setUrlLink($url){
		$this->_document_url_link = $url;
	}
	
	function getUrlLink(){
		return $this->_document_url_link;
	}
}

?>
