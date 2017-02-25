<?php
    //checks that username and password combo is correct
    //if correct, logs user in
    //if incorrect, sends back to login page
    session_start();
    require 'database.php';
    if ($_SESSION['token'] !== $_POST['token']) {
        die("Request forgery detected verify.php");
    }
    // Use a prepared statement
    $stmt = $mysqli->prepare("SELECT COUNT(*), username, password FROM users WHERE username=?");

    // Bind the parameter
    $stmt->bind_param('s', $user);
    $user = $_POST['user'];
    $stmt->execute();

    // Bind the results
    $stmt->bind_result($cnt, $username, $pwd_hash);
    $stmt->fetch();

    $pwd_guess = $_POST['pass'];
    // Compare the submitted password to the actual password hash
    // In PHP < 5.5, use the insecure: if( $cnt == 1 && crypt($pwd_guess, $pwd_hash)==$pwd_hash){

    if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
        // Login succeeded!
        $_SESSION['user'] = $username;
        // User successfully authenticated
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
        // Redirect to home page
        header("Location: homepage.php");
        exit;
    } else {
        // Login failed; redirect back to the login screen
        session_destroy();
        header("Location: login.php?failed=1");
        exit;
    }
