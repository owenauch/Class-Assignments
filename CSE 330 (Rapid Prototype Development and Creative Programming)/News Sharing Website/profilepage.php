<!DOCTYPE html>
<html>
<head>
    <title>Profile Pages</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
  <body>

    <?php
      session_start();
      require 'database.php';
      //profile page for every account
      $name = $_GET['name'];
      printf("<div id='header'>
            <h1>Welcome to $name's Profile</h1>
              <h3>These are the cool newstories $name has posted recently:</h3>
              </div>");


              //adding a nav bar to each page for better site navigation
              //getting all users from database
              $prof_query = $mysqli->prepare("SELECT username from users JOIN newstories on (users.username = newstories.user) group by newstories.user having count(*) > 0 order by count(*) desc");
              if (!$prof_query) {
                  printf("Query Prep Failed: %s\n", $mysqli->error);
                  exit;
              }

              $prof_query->execute();

              $prof_result = $prof_query->get_result();
              printf("<nav>
                        <ul>
                            <li><a href=\"homepage.php\">Home</a></li>
                            <li>Top Posters:</li>
                        "
                    );

              $counter = 1;
              while ($prof_row = $prof_result->fetch_assoc()) {
                  printf("<li>$counter. <a href=\"profilepage.php?name=%s\"> %s</a> </li>",
                      htmlentities($prof_row["username"]), htmlentities($prof_row["username"])
                  );
                  $counter = $counter + 1;
              }

              printf("</ul>
            </nav>"
            );
              $prof_query->close();


      $stmt = $mysqli->prepare("SELECT user, title, commentary, link, story_id from newstories where user like '$name' order by story_id DESC");
      if (!$stmt) {
          printf("Story Query Prep Failed: %s\n", $mysqli->error);
          exit;
      }

      $stmt->execute();

      $result = $stmt->get_result();

      while ($row = $result->fetch_assoc()) {
          if ($row["link"]) {
              $linky = $row["link"];
              printf("<div class=\"storyblock\">
                        <h3><a href=\"$linky\">%s</a></h3>", htmlentities($row["title"]));
          } else {
              printf("<div id=\"storyblock\">
                        <h3>%s</h3>", htmlentities($row["title"]));
          }

          printf("
          <h6><strong>Submitted by:</strong> %s</h6>
          <p>Commentary: %s</p>
          <p>Comments:</p>

          ", htmlentities($row["user"]), htmlentities($row['commentary']));

          $nid = $row['story_id'];
          //button to redirect to story editing page
          if (isset($_SESSION["user"]) && $row["user"] == $_SESSION["user"]) {
              $token = $_SESSION['token'];

              print("<form method='POST' action='editstory.php'>
                  <input type='hidden' name='newsid' value=$nid />
                  <input type='submit' value='Edit or Delete Story' />
                  <input type=\"hidden\" name=\"token\" value=$token>
                </form>");
          }
          //querying comments database
          $commquery = $mysqli->prepare("SELECT username, comment, story_id from comments");

          if (!$commquery) {
              printf("Comment Query Prep Failed: %s\n", $mysqli->error);
              exit;
          }

          $commquery->execute();
          $commquery->bind_result($usernam, $comm, $newsid);
          while ($commquery->fetch()) {
              //if comments story id matches the actual story id, display the comment there
                        if ($newsid == $row["story_id"]) {
                            printf(
                            "
                            <p> &nbsp;&nbsp;&nbsp;    <a href=\"profilepage.php?name=%s\">%s</a>: %s </p>
                            ", htmlentities($usernam), htmlentities($usernam), htmlentities($comm)
                            );
                        }
          }
          printf("</div>");
      }

      $stmt->close();



     ?>
  </body>
</html>
