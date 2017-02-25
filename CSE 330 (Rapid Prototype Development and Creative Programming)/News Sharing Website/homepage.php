<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
    <!-- Displays articles, with most recent first -->
    <?php
        session_start();
        require 'database.php';

        //creatin
      //  $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

        //querying newstory database to display the newstories
        $stmt = $mysqli->prepare("SELECT user, title, commentary, link, story_id from newstories ORDER BY story_id DESC");
        if (!$stmt) {
            printf("Story Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();

        //$stmt->bind_result($user, $title, $commentary, $link, $story_id);
        $result = $stmt->get_result();
        //Printing out individual newstories and having a form for comments

        if (isset($_SESSION["user"])) {
            $token = $_SESSION['token'];

            printf("<div id=\"header\">
            <h1>The Times of New South 40</h1>
            <h3>Welcome! You are logged in as %s.</h3>
            ", htmlentities($_SESSION['user']));

            //logout button
            printf("
                    <form method=\"POST\" action=\"logout.php\">
                      <input type=\"submit\" value=\"logout\"/>
                      <input type=\"hidden\" name=\"token\" value=$token />
                    </form>

                    ");

            //posting a story input fields
            printf("
            <br>

            <h4>Post a Story below!</h4>
            <form method=\"POST\" action=\"submitstory.php\">
                  <p>
                      <label for=\"title\">Title:</label>
                      <input type=\"text\" name=\"title\" id=\"titleinput\" />

                      <label for=\"commentary\">Commentary:</label>
                      <textarea rows='1' columns='40' name=\"commentary\" id=\"commentaryinput\">Enter story commentary</textarea>
                      <label for=\"link\">Link (optional):</label>
                      <input type=\"text\" name=\"link\" id=\"linkinput\"/>
                      <input type=\"hidden\" name=\"token\" value=$token />

                      <input type=\"submit\" value=\"submit\" />
                  </p>
            </form>
            </div>

            ");
        } else {
            printf("<div id=\"header\">
            <h1>The Times of New South 40</h1>
            Welcome! Click <a href='login.php'>here</a> to login.
            </div>");
        }

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


        while ($row = $result->fetch_assoc()) {
            $sid = $row["story_id"];


            //if there is a link, have the title be the link, otherwise the title is not a link
            if ($row["link"]) {
                $linky = $row["link"];
                printf("<div class=\"storyblock\">
                            <h2><a href=\"$linky\">%s</a></h2>", htmlentities($row["title"]));
            } else {
                printf("<div id=\"storyblock\">
                            <h2>%s</h2>", htmlentities($row["title"]));
            }
            //printing newstories
            printf("
                        <h6><strong>Submitted by:</strong> %s</h6>
                        <p>%s</p>
                        <p>Comments:</p>
                        ", htmlentities($row["user"]), htmlentities($row["commentary"]));

            //querying comments database
            $commquery = $mysqli->prepare("SELECT comment_id, username, comment, story_id from comments");

            if (!$commquery) {
                printf("Comment Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }

            $commquery->execute();
            $commquery->bind_result($cid, $usernam, $comm, $newsid);
            while ($commquery->fetch()) {
                //if comments story id matches the actual story id, display the comment there


                if ($newsid == $row["story_id"]) {
                    printf(
                    "
                    <p>&nbsp;&nbsp;&nbsp;<a href=\"profilepage.php?name=%s\">%s</a>: %s
                    ", htmlentities($usernam), htmlentities($usernam), htmlentities($comm)
                    );
                    //puts form to edit comment next to each comment submitted by the user
                    if (isset($_SESSION['user'])) {
                        if ($_SESSION['user'] == $usernam) {
                            printf(
                          "
                            <form method='POST' action='editcomment.php'>
                              <input type='hidden' name='cid' value='$cid' />
                              <input type=\"hidden\" name=\"token\" value=$token />
                              <input type='submit' value='Edit or Delete Comment' />
                            </form>
                            </p>


                        ");
                        }
                    }
                }
            }

            //printing html form for comments
            if (isset($_SESSION["user"])) {
                printf("
                      <form method=\"POST\" action=\"commentmanager.php\">
                        <p>
                        <input type=\"hidden\" name=\"sid\" value=\"$sid\"/>
                        <label for=\"comment\">Enter comment here:</label>
                        <input type=\"text\" name=\"comment\" id=\"commentinput\" />
                        <input type=\"submit\" value=\"Submit Comment\" />
                        <input type=\"hidden\" name=\"token\" value=$token />
                        </p>
                      </form>");
            }

            printf("</div>");
        }
        printf("<h6 id='footer'>Totally not #FakeNews! Thank you for visiting out website. </h6>");

        $stmt->close();
    ?>



    </body>
</html>
