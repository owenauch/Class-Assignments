<!DOCTYPE html>
<html>
<head>
    <title>Your Files</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
    <?php
    //if the user query variable is set, then the username will be saved
    //as a session variable
    session_start();
    if (isset($_GET['user'])) {
        $_SESSION['username'] = $_GET['user'];
        $username = htmlentities($_SESSION['username']);
    }
    
    //read all usernames from file and save into array
    $h = fopen("users/users.txt", "r");
    $users = array("","","");
    $linenum = 1;
    echo "<ul>\n";
    while( !feof($h) ){
        $users[$linenum - 1] = trim(fgets($h));
        $linenum++;
    }
    echo "</ul>\n";
    fclose($h);
    
    if (!in_array($username, $users)) {
        //set POST["user"] = "failed" if redirected in order to display message saying that login failed
        $_SESSION['user'] = 'failed';
        header("Location: index.php");
        exit;   // we call exit here so that the script will stop executing before the connection is broken
    }
    ?>
    
    <h3>Your files:</h3>
    <form method="POST" action="fileaction.php">
        <?php
        //find all files associated with this username and make a form to view each one
        $username = htmlentities($_SESSION['username']);
        $userpath = "/srv/uploads/$username";
        
        //contains all file names in user directory
        //code acquired from http://stackoverflow.com/questions/8532569/exclude-hidden-files-from-scandir
        $userfiles = preg_grep('/^([^.])/', scandir($userpath));
        //close
        
        foreach($userfiles as $file) {
            //creates form elements to view or delete the button 
            echo("<p>$file</p><button name='view' value='$file' type='submit'>View</button>
                 <button name='delete' value='$file' type='submit'>Delete</button>
                 <button name='email' value='$file' type='submit'>Email</button>");
        }
        ?>
    </form>
    
    
    <!--File upload form, redirects to uploader.php-->
    <form enctype="multipart/form-data" action="uploader.php" method="POST">
        <p>
            <input type="hidden" name="MAX_FILE_SIZE" value="20000000" />
            <label for="uploadfile_input">Upload a file:</label> <input name="uploadedfile" type="file" id="uploadfile_input" />
        </p>
        <p>
            <input type="submit" value="Upload File" />
        </p>
    </form>
    
    <form method="GET" action="logout.php">
        <button name='logout' value='logout' type='submit'>Log Out</button>
    </form>
    
</body>
</html>