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


/**
 * Loads a document
 *
 * @todo Verify document is accessable to user
 */

define("TWEXTERLOADDOC_PATH", dirname(__FILE__).'/');
require_once TWEXTERLOADDOC_PATH.'../include/zendbootstrap.php';
//require_once TWEXTERLOADDOC_PATH.'../include/zendauth.php';
require_once TWEXTERLOADDOC_PATH.'../classes/class.dbtwext.php';

$docid = (is_numeric($_REQUEST['docid'])) ? $_REQUEST['docid'] : false;

if(is_numeric($docid)){
	$doc = new DbTwext();
	$doc->load($docid);
	
	$doc = array(
		'title' => $doc->getTitle(),
		'sha1' => $doc->getSha1(),
		'parent_id' => $doc->getParentId(),
		'parent_sha1' => $doc->getParentSha1(),
		'created_on' => $doc->getCreationDate(),
		'updated_on' => $doc->getUpdateDate(),
		'description' => $doc->getDescription(),
		'version' => $doc->getVersion(),
		'trans' => $doc->getTranslations(),
		'url' => $doc->getUrlLink(),
		'chunk_style' => $doc->getChunkStyle()
	);
	
	echo json_encode($doc);
}

?>