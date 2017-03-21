
<?php
      ini_set("session.cookie_httponly", 1);
      session_start();

      header("Content-Type: application/x-www-form-urlencoded");
      printf("logged out succeeded");

      session_destroy();

      printf(isset($_SESSION['user']));
    //  header("Location: index.html");
      exit;
?>
