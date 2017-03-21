<?php
  ini_set("session.cookie_httponly", 1);
  session_start();

  header("Content-Type: application/json");

  if (isset($_SESSION['user'])) {
      echo json_encode(array(
            "username" => $_SESSION['user'],
            "success" => true
    ));
  } else {
      echo json_encode(array(
            "success" => false
    ));
  }

  exit;
