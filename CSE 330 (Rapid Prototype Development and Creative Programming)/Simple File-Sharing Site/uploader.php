<!DOCTYPE html>
<html>
<head>
    <title>Your Files</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
<?php
    session_start();
    include "gohome.php";
    include 'getfilepath.php';
    //put the file in the correct folder by username
    // Get the filename and make sure it is valid
    $filename = basename($_FILES['uploadedfile']['name']);
     
    $full_path = get_file_path($filename);
     
    if( move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $full_path) ){
        print("File uploaded succesfully!");
    }else{
        print("File failed to upload.");
    }
    
    gohome();
?>
</body>
</html>