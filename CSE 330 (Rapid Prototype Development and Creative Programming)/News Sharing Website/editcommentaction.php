<?php
  require 'database.php';
  session_start();
  if ($_SESSION['token'] !== $_POST['token']) {
      die("Request forgery detected");
  }
  $cid = $_POST['cid'];
  $comment_text = $_POST['comment_text'];

  if ($_POST['comment_action'] == 'delete') {
      $stmt = $mysqli->prepare("DELETE FROM comments WHERE comment_id = $cid");
      if (!$stmt) {
          printf("Query Prep Failed: %s\n", $mysqli->error);
          exit;
      }

      $stmt->execute();

      $stmt->close();
  } else {
      $stmt = $mysqli->prepare("UPDATE comments SET comment='$comment_text' WHERE comment_id = $cid");
      if (!$stmt) {
          printf("Query Prep Failed: %s\n", $mysqli->error);
          exit;
      }

      $stmt->execute();

      $stmt->close();
  }

  $user = $_POST['user'];
  header("Location: homepage.php");
  exit();
