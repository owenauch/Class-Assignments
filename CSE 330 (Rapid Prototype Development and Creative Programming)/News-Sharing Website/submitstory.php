<?php
  session_start();

  require('database.php');
  if ($_SESSION['token'] !== $_POST['token']) {
      var_dump($_SESSION['token']);
      var_dump($_POST['token']);
      die("Request forgery detected submit story");
  }

  if (isset($_SESSION["user"])) {

      //checking if user has a title and commentary
      if (isset($_POST['title']) && isset($_POST['commentary'])) {
          $title = $_POST['title'];
          $commentary = $_POST['commentary'];
        //optional link to news website
        $link = null;
          if ($_POST['link'] !== "") {
              //will always submit something, even if it's the empty string, so leave it null if so
          $link = $_POST['link'];
          }
        //set username as foreign key
        //trying to upload title and commentary to new table in database
        //user 30, title 100, commentary 500, link 500,

        //connecting to database
        $stmt = $mysqli->prepare("INSERT into newstories
         (user, title, commentary, link)
         values (?,?,?,?)");
          if (!$stmt) {
              printf("Query Prep Failed: %s\n", $mysqli->error);
              exit;
          }


          $stmt->bind_param('ssss', $_SESSION['user'], $title, $commentary, $link);
          $stmt->execute();
          $stmt->close();
      }
  }
  //sending them back so they don't dwell on submit page if not allowed to submit
  else {
      header("Location: homepage.php?submit=userfailure");
      exit;
  }

  //send back with submit=success
  header("Location: homepage.php?submit=success");
  exit;
