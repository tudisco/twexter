<?php
$baseh = realpath(dirname(__FILE__));

require_once $baseh.'/include/zendbootstrap.php';
require_once 'Minify.php';
require_once($baseh.'/dl.php');


$minifyCachePath = "{$baseh}/cache";
unset($baseh);

if ($minifyCachePath) {
    Minify::useServerCache($minifyCachePath);
}

Minify::serve('Groups', array(
    'groups' => $groupsSources
    ,'setExpires' => time() + (86400 * 0.5)
));

?>