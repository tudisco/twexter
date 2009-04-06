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
 * Loads a list of tags
 */
define("HISTORYLIST_PATH", dirname(__FILE__).'/');
require_once HISTORYLIST_PATH.'../include/zendbootstrap.php';
require_once HISTORYLIST_PATH.'../include/zendauth.php';

$db = Zend_Registry::get('dbTwext');
//$db->query('SELECT tag, count(tag) AS tcount FROM document_tags GROUP BY tag ORDER BY tag');

$tags = $db->fetchAll("
SELECT t2.id as id, t2.tag as tag, count(t1.tag_id) as tcount FROM document_tags_link AS t1,document_tags AS t2 
WHERE t1.tag_id = t2.id 
GROUP BY t2.tag
ORDER BY tag                     
");

echo json_encode(array('data'=>$tags, 'total'=>count($tags)));
?>