<?php
  session_start();
  require 'database.php';

  $user = $_SESSION['user'];

  $stmt = $mysqli->prepare("DELETE FROM users WHERE username = '$user'");
  if (!$stmt) {
      printf("Query Prep Failed: %s\n", $mysqli->error);
      exit;
  }

  $stmt->execute();

  $stmt->close();

  header("Location: logout.php");
  exit();
?>
