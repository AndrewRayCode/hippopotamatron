<?php
/*
* SAMPLE CONFIGURATION FILE. ALL VARIABLES REQUIRED
*/
$siteRoot = '/home1/delvarwo/public_html';	//Drive path to public_html or www folder
$imageDir = '/assets/photography';						//Folder to upload images to
$thumbDir = '/assets/photography';						//Folder to upload thumbs to

$imageTable = 'photography';				//MySQL table holding images
$categoryTable = 'photo_categories';			//MySQL table holding categories
$configTable = 'photo_manage';				//MySQL table for management

$installFolder = '/photocp'; // No trailing slash!
$dbHref = 'https://host256.hostmonster.com:2083/frontend/hostmonster/sql/PhpMyAdmin.html';
$mainSiteHref = '/';

//Maximum image dimensions, hard coded
$MAX_IMAGE_WIDTH = 16000;
$MAX_IMAGE_HEIGHT = 12000;

//Server options
$DBhost = 'localhost';
$DBuser = 'delvarwo_delvar';
$DBpass = 																																																												'C3qzpj2!';
$DBName = 'delvarwo_site';

//What to preceed errors by. Do not edit.
$error = 'error,';
?>