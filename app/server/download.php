<?php

$img = $_POST["filename"];
$img = __DIR__."/result/".$img;
header('Content-Type: application/octet-stream');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($img) . "\"");
readfile($img);