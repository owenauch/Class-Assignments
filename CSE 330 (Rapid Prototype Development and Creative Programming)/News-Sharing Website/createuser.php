<!--Page for user to create account-->
<!DOCTYPE html>
<html>
<head>
    <title>Create an account</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
    <h1>Create an account below:</h1>
    <form method="POST" action="accountcreator.php">
        <label for="desiredusername">Desired username:</label>
        <input type="text" name="user" id="desiredusername" />
        <label for="desiredpass">Desired password:</label>
        <input type="password" name="pass" id="desiredpass" />
        <label for="verifypassinput">Desired password:</label>
        <input type="password" name="passver" id="verifypassinput" />
        <input type="submit" value="Create Account" />
    </form>
        <?php
            //display failure alert if necessary based on query string
            if (isset($_GET['failed'])) {
                switch ($_GET['failed']) {
                    case "nomatch":
                        echo "Passwords do not match.";
                        break;
                    case "passlength":
                        echo "Password must be 6 characters or more in length.";
                        break;
                    case "usernametaken":
                        echo "Username already taken. Please try another.";
                        break;
                    default:
                        echo 'Unknown error, please try again.';
                        break;
                }
            }
        ?>
</body>
</html>
