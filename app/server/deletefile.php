<?php

$img = $_POST["filename"];
$img = __DIR__."/result/".$img;

unlink($img);

echo "ok";