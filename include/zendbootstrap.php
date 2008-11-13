<?php
/* Add the Zend Framework library to the include path so that we can access the ZF classes */ 
set_include_path(realpath(dirname(__FILE__).'/../libs') . PATH_SEPARATOR .
		realpath(dirname(__FILE__).'/../libs/minify/lib') . PATH_SEPARATOR . get_include_path());

require_once 'Zend/Db.php';
require_once 'Zend/Registry.php';
require_once 'Zend/Db/Table/Abstract.php';
$dbconf = parse_ini_file(dirname(__FILE__)."/db.ini", true);
if($dbconf===false) die("No database config");

if(strpos($_SERVER['HTTP_HOST'],'read.fm')){
    $_db_params = array(
        'host'           => $dbconf['readfm']['host'],
        'username'       => $dbconf['readfm']['username'],
        'password'       => $dbconf['readfm']['password'],
        'dbname'         => $dbconf['readfm']['dbname'],
        'profiler' 		 => false
    ); 
}else{
    $_db_params = array(
        'host'           => $dbconf['local']['host'],
        'username'       => $dbconf['local']['username'],
        'password'       => $dbconf['local']['password'],
        'dbname'         => $dbconf['local']['dbname'],
        'profiler' 		 => true
    );    
}


// Automatically load class Zend_Db_Adapter_Pdo_Mysql and create an instance of it.
$_db = Zend_Db::factory('Pdo_Mysql', $_db_params);
Zend_Registry::set('dbTwext', $_db);

//Make sure UTF8
$_db->query('SET NAMES utf8');
$_db->query('SET CHARACTER SET utf8');

//----- Below we have some classes to access database tables -----

/*
* Main Document Database
*/
class dbDocument extends Zend_Db_Table_Abstract
{
	protected $_name = 'document';
	protected $_primary = 'id';
	protected $_sequence = true;
	
	protected function _setupDatabaseAdapter(){
		$this->_db = self::_setupAdapter('dbTwext');
                parent::_setupDatabaseAdapter();
	}
}

/*
 * User Database
 */
class dbUser extends Zend_Db_Table_Abstract
{
        protected $_name = 'users';
	protected $_primary = 'id';
	protected $_sequence = true;
        
        //protected $_dependentTables = array('dbDocument');
        protected $_referenceMap    = array(
            'User' => array(
                'columns'           => array('id'),
                'refTableClass'     => 'dbDocument',
                'refColumns'        => array('user_id')
            )
        );
        
        protected function _setupDatabaseAdapter(){
		$this->_db = self::_setupAdapter('dbTwext');
                parent::_setupDatabaseAdapter();
	}
}

/*
 * Document Translation Table
 */
class dbDocumentTrans extends Zend_Db_Table_Abstract
{
	protected $_name = 'document_trans';
	protected $_primary = 'id';
	protected $_sequence = true;
	
	protected function _setupDatabaseAdapter(){
		$this->_db = self::_setupAdapter('dbTwext');
                parent::_setupDatabaseAdapter();
	}
}

/*
 * Document Chunks Table
 */
class dbDocumentChunks extends Zend_Db_Table_Abstract
{
	protected $_name = 'document_chunks';
	protected $_primary = 'id';
	protected $_sequence = true;
	
	protected function _setupDatabaseAdapter(){
		$this->_db = self::_setupAdapter('dbTwext');
                parent::_setupDatabaseAdapter();
	}
}

/*
 * Language Table
 */
class dbLangs extends Zend_Db_Table_Abstract
{
        protected $_name = 'langs';
	protected $_primary = 'id';
	protected $_sequence = true;
        
        protected function _setupDatabaseAdapter(){
		$this->_db = self::_setupAdapter('dbTwext');
                parent::_setupDatabaseAdapter();
	}
}

/*
 * Language User Table - Store User Language Preferances
 */
class dbLangUser extends Zend_Db_Table_Abstract
{
    protected $_name = 'user_lang';
    protected $_primary = 'id';
    protected $_sequence = true;
    
    protected function _setupDatabaseAdapter(){
            $this->_db = self::_setupAdapter('dbTwext');
            parent::_setupDatabaseAdapter();
    }
}

/**
 * Document Url Resource Table
 */
class dbDocumentLinkResource extends Zend_Db_Table_Abstract
{
    protected $_name = 'document_link_resource';
    protected $_primary = 'id';
    protected $_sequence = true;
    
    protected $_referenceMap    = array(
        'UrlLink' => array(
            'columns'           => array('document_id'),
            'refTableClass'     => 'dbDocument',
            'refColumns'        => array('id')
        )
    );
    
    protected function _setupDatabaseAdapter(){
            $this->_db = self::_setupAdapter('dbTwext');
            parent::_setupDatabaseAdapter();
    }
}
?>