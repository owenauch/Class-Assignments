<?php
    /*
     *Creates a button that takes the user back to home.php
     */
    function gohome() {
        $username = htmlentities($_SESSION['username']);
        print ("<form method='POST' action='home.php?user=$username'>
                <button name='gohome' value='gohome' type='submit'>Go Back to Files</button>
           </form>");
    }
?>