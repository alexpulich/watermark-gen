<?php
require_once "lib/autoload.php";
require_once "lib/sybio/image-workshop/src/PHPImageWorkshop/ImageWorkshop.php";

//  Получение данных
$img = $_POST['img'];
$watermark = $_POST['watermark'];
$x = $_POST['x'];
$y = $_POST['y'];
$opancity = $_POST['opancity'];
$widthImg = $_POST['widthImg'];
$heightImg  = $_POST['heightImg'];


//Получаем картинки
$imgMain = PHPImageWorkshop\ImageWorkshop::initFromPath("php/files/".$img);
$watermarkImg = PHPImageWorkshop\ImageWorkshop::initFromPath("php/files/".$watermark);

//Изменяем размер картинки
$imgMain -> resizeToFit($widthImg, $heightImg);

//Прозрачность вотермарка
$watermarkImg ->opacity(100 - $opancity);
$filename = substr(md5(microtime() . rand(0, 9999)), 0, 20);
//Обединяем картинки
$merged = $imgMain -> addLayer(null, $watermarkImg, $x , $y, "LT");
$imgMain -> save(__DIR__."/result/", $filename.".jpg", true, null, 100);

echo json_encode(array(status => 'OK', filename => $filename.".jpg" ));