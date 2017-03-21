<?php
    // creates event in database
    session_start();

    ini_set("session.cookie_httponly", 1);

    require 'database.php';
    header("Content-Type: application/x-www-form-urlencoded");

    // get date string
    $date_string = $_POST['date'];
    $display_category = $_POST['event_category'];

    // get needed year and month
    $date = strtotime($date_string);
    $month = date('n', $date);
    $year = date('Y', $date);

    $stmt = $mysqli->prepare("SELECT event_name, event_date, event_category FROM events WHERE username=? and MONTH(event_date) = ? and YEAR(event_date) = ?");
    if (!$stmt) {
        echo json_encode(array(
            "success" => false,
            "error" => $mysqli->error
        ));
        exit;
    }
    // Bind the parameters
    $user = $_SESSION['user'];
    $stmt->bind_param('sii', $user, $month, $year);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();

    $events_array = array("events" => $rows);
    echo json_encode(
            array_merge(
                array(
            "success" => true,
            "display_category" => $display_category
        ), $events_array));
