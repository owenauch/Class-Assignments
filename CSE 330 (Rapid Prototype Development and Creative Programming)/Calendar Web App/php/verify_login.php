<?php
    //checks that username and password combo is correct
    //if correct, logs user in
    //if incorrect, sends back to login page
    ini_set("session.cookie_httponly", 1);

    require 'database.php';
    header("Content-Type: application/x-www-form-urlencoded");

    $pass = $_POST['pwd'];

    // if ($_SESSION['token'] !== $_POST['token']) {
    //     die("Request forgery detected verify.php");
    // }
    // Use a prepared statement
    $stmt = $mysqli->prepare("SELECT COUNT(*), username, password FROM users WHERE username=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    // Bind the parameter
    $user = $_POST['user'];
    $stmt->bind_param('s', $user);
    //var_dump($user);
    $stmt->execute();

    // Bind the results
    $stmt->bind_result($cnt, $username, $pwd_hash);
    $stmt->fetch();

    $pwd_guess = $pass;
    //var_dump($pwd_guess);
    //var_dump($cnt);

    // Compare the submitted password to the actual password hash
    // In PHP < 5.5, use the insecure: if( $cnt == 1 && crypt($pwd_guess, $pwd_hash)==$pwd_hash){

    //correct password
    if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
        ini_set("session.cookie_httponly", 1);

        session_start();
        // Login succeeded!
        $_SESSION['user'] = $username;
        // User successfully authenticated
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
        // Redirect to home page

        //header("Location: index.html");
        echo json_encode(array(
                "success" => true,
                "username"=> $_SESSION['user']

            ));
        // security thing



        //security, checking http stuff
        $previous_ua = @$_SESSION['useragent'];
        $current_ua = $_SERVER['HTTP_USER_AGENT'];

        if (isset($_SESSION['useragent']) && $previous_ua !== $current_ua) {
            die("Session hijack detected");
        } else {
            $_SESSION['useragent'] = $current_ua;
        }

        exit;
    } else {
        echo json_encode(array(
                "success" => false,
                "message" => "Incorrect Username or Password"
           ));        // Login failed; redirect back to the login screen
        session_destroy();
        //header("Location: index.html?failed=1");
        exit;
    }

?>
<!--end -->
