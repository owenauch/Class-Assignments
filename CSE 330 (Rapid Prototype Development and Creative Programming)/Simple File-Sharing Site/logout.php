<?php
//logs user out and redirects to main page
    session_start();
    session_destroy();
    header("Location: index.php");
?>