<?php

   ini_set("session.cookie_httponly", 1);

        // creates event in database
    session_start();



    require 'database.php';
    header("Content-Type: application/x-www-form-urlencoded");

    // get variables
    $event_name = $_POST['name'];
    $event_time = $_POST['time'];
    $event_date = $_POST['date'];
    $event_category = $_POST['category'];
    $user = $_SESSION['user'];


    // format datestring for mysql
    $date_inter = strtotime($event_date);
    $mysql_date = date('Y-m-d', $date_inter);
    $mysql_date = $mysql_date . " " . $event_time . ":00";

    // insert into events
    $stmt = $mysqli->prepare("insert into events (username, event_name, event_date, event_category) values (?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(array(
            "success" => false,
            "error" => $mysqli->error
        ));
        exit;
    }

    $stmt->bind_param('ssss', $user, $event_name, $mysql_date, $event_category);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "event_name" => $event_name,
        "event_category" => $event_category
    ));

    exit;
