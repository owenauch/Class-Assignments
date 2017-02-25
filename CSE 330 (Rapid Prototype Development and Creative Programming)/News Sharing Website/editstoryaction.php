<?php
  require 'database.php';
  session_start();

  if ($_SESSION['token'] !== $_POST['token']) {
      var_dump($_SESSION['token']);
      var_dump($_POST['token']);
      die("Request forgery detected");
  }

  $newsid = $_POST['newsid'];
  $title_text = $_POST['title_text'];
  $commentary_text = $_POST['commentary_text'];

  if ($_POST['story_action'] == 'delete') {
      $stmt = $mysqli->prepare("DELETE FROM newstories WHERE story_id = $newsid");
      if (!$stmt) {
          printf("Query Prep Failed: %s\n", $mysqli->error);
          exit;
      }

      $stmt->execute();

      $stmt->close();
  } else {
      $stmt = $mysqli->prepare("UPDATE newstories SET title='$title_text', commentary='$commentary_text' WHERE story_id = $newsid");
      if (!$stmt) {
          printf("Query Prep Failed: %s\n", $mysqli->error);
          exit;
      }

      $stmt->execute();

      $stmt->close();
  }

  $user = $_POST['user'];
  header("Location: profilepage.php?name=$user");
  exit();
