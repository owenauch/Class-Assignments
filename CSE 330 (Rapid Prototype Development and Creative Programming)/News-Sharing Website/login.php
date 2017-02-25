<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>

  <?php
  session_start();
  //creating token
  $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

  if (isset($_SESSION["user"])) {
      if ($_SESSION["user"] == "failed") {
          print("<h2 id=loginfail>Username not found. Please try again.</h2>");
      }
  }
  ?>

    <h1>Times of Owen and Visaal</h1>
    <h3>Enter your username and password below to log in</h3>
        <form method="POST" action="verify.php">
                <p>
                    <label for="usernameinput">Username:</label>
                    <input type="text" name="user" id="usernameinput" />
                    <label for="passwordinput">Password:</label>
                    <input type="password" name="pass" id="passwordinput"/>
                    <input type="submit" value="Log in" />
                    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />

                </p>
        </form>

        <form method="GET" action="createuser.php">
                <input type="submit" value="Create User"/>
        </form>



</body>
</html>
