<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
    <h1>Welcome to Owen and Visaal's secure file-sharing website!</h1>
    <h3>Enter your username below to log in</h3>
    <form method="GET" action="home.php">
        <p>
            <label for="usernameinput">Username:</label>
            <input type="text" name="user" id="usernameinput" />
            <input type="submit" value="Log in" />
        </p>
    </form>
    
    <?php
    session_start();
    if (isset($_SESSION["user"])) {
        if ($_SESSION["user"] == "failed") {
            print("<h2 id=loginfail>Username not found. Please try again.</h2>");
        }
    }
    ?>
</body>
</html>