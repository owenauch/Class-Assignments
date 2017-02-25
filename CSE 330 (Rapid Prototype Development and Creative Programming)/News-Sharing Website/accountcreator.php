<?php
    require 'database.php';
    
    //assign variables
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    $passver = $_POST['passver'];
    
    //test if passwords match
    //if not, will send back with query string failed=nomatch
    if ($pass !== $passver) {
        header("Location: createuser.php?failed=nomatch");
        exit();
    }
    
    //test if password is longer than 6 characters
    //if not, send back with query string failed=passlength
    if (strlen($pass) < 6) {
        header("Location: createuser.php?failed=passlength");
        exit();
    }
    
    //make sure username isn't taken
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
    
    // Bind the parameter
    $stmt->bind_param('s', $user);
    $stmt->execute();
    
    // Bind the result
    $stmt->bind_result($count);
    $stmt->fetch();
    
    //dont forget this little bastard
    $stmt->close();
    
    //if count > 0, send back to createuser.php with query string failed=usernametaken
    if ($count > 0) {
        header("Location: createuser.php?failed=usernametaken");
        exit();
    }
    
    //else, insert into database and set session variable and send to the home page with query string accountcreated=1
    else {
        session_start();
        $_SESSION['user'] = $user;
        $passhash = password_hash($pass, PASSWORD_DEFAULT);
        echo var_dump($user);
        echo var_dump($passhash);
        
        //insert username and password into the database
        $stmt = $mysqli->prepare("INSERT into users (username, password) values (?,?)");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        
        //bind parameters
        $stmt->bind_param('ss', $user, $passhash);
        
        $stmt->execute();
 
        $stmt->close();
        
        header("Location: homepage.php?accountcreated=1");
        exit();
    }
 ?>