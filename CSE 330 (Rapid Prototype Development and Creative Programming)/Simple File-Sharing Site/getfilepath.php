<?php

    /**
     *Gets file path from file name
     */
    function get_file_path($file) {
        // To perform the check, we will use a regular expression.
        if( !preg_match('/^[\w_\.\-]+$/', $file) ){
            echo "Invalid filename";
            exit;
        }
         
        // Get the username and make sure that it is alphanumeric with limited other characters.
        // You shouldn't allow usernames with unusual characters anyway, but it's always best to perform a sanity check
        // since we will be concatenating the string to load files from the filesystem.
        $username = htmlentities($_SESSION['username']);
        if( !preg_match('/^[\w_\-]+$/', $username) ){
            echo "Invalid username";
        }
         
        $full_path = sprintf("/srv/uploads/%s/%s", $username, $file);
        return $full_path;
        
    }
?>