<!DOCTYPE html>
<html>
<head>
    <title>Comment Manager</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
  <h1>Edit or remove comment</h1>
  <?php
    require 'database.php';
    session_start();
    $token = $_SESSION['token'];
    if ($_SESSION['token'] !== $_POST['token']) {
        die("Request forgery detected");
    }
    $cid = $_POST['cid'];

    //make sure user is logged in
    if (isset($_SESSION["user"])) {
        //get comment text for the comment they submitted
      $stmt = $mysqli->prepare("SELECT comment from comments WHERE comment_id = $cid LIMIT 1");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();

        $stmt->bind_result($comment);

      //prints a form that lets user edit or delete their comment they clicked through for
      while ($stmt->fetch()) {
          $comment_safe = htmlentities($comment);
          printf("
            <form method='POST' action='editcommentaction.php'>
              <input type='text' name='comment_text' id='comment_text_input' value='$comment_safe'>
              <input type='hidden' name='cid' value='$cid' />
              <button name='comment_action' value='edit' type='submit'>Edit</button>
              <button name='comment_action' value='delete' type='submit'>Delete</button>
              <input type=\"hidden\" name=\"token\" value=$token />

            </form>"
          );
      }

        $stmt->close();
    }
  ?>

</body>
</html>
