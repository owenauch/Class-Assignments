
<?php
    //checks comments
    session_start();
    require('database.php');
    if ($_SESSION['token'] !== $_POST['token']) {
        die("Request forgery detected");
    }
    if (isset($_SESSION["user"])) {

        //checking if user has a title and commentary
        if (null !== $_POST['comment']) {
            $comment = $_POST['comment'];
            //sid = StoryID
            $sid = $_POST['sid'];

          //trying to upload title and commentary to new table in database
          //user 30, comment text, storyid integer,

          //inserting comment to comments database
          $stmt = $mysqli->prepare("INSERT into comments
           (username, comment, story_id)
           values (?,?,?)");
            if (!$stmt) {
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
          //sending in username, comment text, and story id into comments database
          $stmt->bind_param('ssi', $_SESSION['user'], $comment, $sid);
            $stmt->execute();
            $stmt->close();
        }
    } else {
        header("Location: homepage.php?submit=userfailure");
        exit;
    }

    //send back with submit=success
    header("Location: homepage.php?submit=success");
    exit;

?>
