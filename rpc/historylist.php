<?
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
 * Loads a list of comments available for current document
 */

define("HISTORYLIST_PATH", dirname(__FILE__).'/');
require_once HISTORYLIST_PATH.'../include/zendbootstrap.php';
require_once HISTORYLIST_PATH.'../include/zendauth.php';

$docsha1 = (!empty($_REQUEST['docsha1'])) ? $_REQUEST['docsha1'] : false;

if($docsha1==false){
    exit();
}

$db = new dbDocument();
$dbUser = new dbUser();
$sel = $db->select();

$sel->where("sha1 = ?", $docsha1)->order("inserted_on DESC");
$doc = $db->fetchAll($sel);
$docs = array();

foreach($doc as $d){
    $u = $d->findDependentRowset("dbUser")->toArray();
    $dd = $d->toArray();
    $dd['user'] = $u[0]['username'];
    $dd['seconds'] = time()-strtotime($dd['created_on']);
    $docs[] = $dd;
}
$data = array('success'=>true, 'total'=>count($docs), 'data'=>$docs);
echo json_encode($data);
exit();
?>