<!DOCTYPE html>
<html>
<head>
    <title>Story Manager</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
  <h1>Edit or remove story:</h1>
  <?php
    require 'database.php';
    session_start();
    if ($_SESSION['token'] !== $_POST['token']) {
        die("Request forgery detected");
    }

    $token = $_SESSION['token'];
    $newsid = $_POST['newsid'];

    //make sure user is logged in
    if (isset($_SESSION["user"])) {
        //get comment text for the comment they submitted
      $stmt = $mysqli->prepare("SELECT user, title, commentary from newstories WHERE story_id = $newsid LIMIT 1");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();

        $stmt->bind_result($user, $title, $commentary);

      //prints a form that lets user edit or delete their comment they clicked through for
      while ($stmt->fetch()) {
          $title_safe = htmlentities($title);
          $commentary_safe = htmlentities($commentary);
          printf("
            <form method='POST' action='editstoryaction.php'>
              <label for='title_text'>Edit title:</label>
              <input type='text' name='title_text' id='title_text_input' value='$title_safe'>
              <label for='commentary_text'>Edit commentary:</label>
              <input type='text' name='commentary_text' id='commentary_text_input' value='$commentary_safe'>
              <input type='hidden' name='newsid' value='$newsid' />
              <input type='hidden' name='user' value='$user' />
              <button name='story_action' value='edit' type='submit'>Edit</button>
              <button name='story_action' value='delete' type='submit'>Delete</button>
              <input type='hidden' name='token' value=$token>
            </form>"
          );
      }

        $stmt->close();
    }
  ?>

</body>
</html>
