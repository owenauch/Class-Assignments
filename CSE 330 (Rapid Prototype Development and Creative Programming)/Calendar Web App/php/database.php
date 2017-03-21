<?php
// Content of database.php
//connects to banterzone database

    $mysqli = new mysqli('localhost', 'php', '330', 'calendar');

    if ($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
    }
