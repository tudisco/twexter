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


define('RPCLOGIN_PATH', dirname(__FILE__));
require_once(realpath(RPCLOGIN_PATH.'/../include/zendbootstrap.php'));
require_once(realpath(RPCLOGIN_PATH.'/../include/zendauth.php'));

$login = ($_REQUEST['username']) ? $_REQUEST['username'] : false;
$pass = ($_REQUEST['password']) ? $_REQUEST['password'] : false;

if($pass === false || $login === false){
    $error = array('success'=>false, 'message'=>"missing username or password");
    echo json_encode($error);
    exit();
}

$success = log_into_text($login, $pass);

if($success === false){
    $error = array('success'=>false, 'message'=>"Wrong username and password");
    echo json_encode($error);
    exit();
}

$as = Zend_Registry::get('session_auth');

$data = array('success'=>true, 'message'=>"success", 'userid'=>$as->userID, 'name_first'=>$as->name_first, 'name_last'=>$as->name_last);
echo json_encode($data);
exit();
?>