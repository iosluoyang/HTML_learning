<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$time = date('r');
echo "data: 服务器端返回的时间为: {$time}\n\n";
flush();
?>