<!DOCTYPE html>
<html>
<head>
    <title>Your Files</title>
    <link rel="stylesheet" type="text/css" href="custom.css">
</head>
<body>
<?php
    session_start();
    include 'getfilepath.php';
    include 'gohome.php';
    require '/srv/packages/PHPMailer/PHPMailerAutoload.php';
    
    //upload bigger files -- from Sitepoint: https://www.sitepoint.com/upload-large-files-in-php/
    ini_set('upload_max_filesize', '10M');
    ini_set('post_max_size', '10M');
    ini_set('max_input_time', 300);
    ini_set('max_execution_time', 300);
    //close
    
    $username = htmlentities($_SESSION['username']);
    $userpath = "/srv/uploads/$username";
    //file extensions we know how to open
    $exts = ["jpg", "pdf", "txt", "csv", "png"];
    
    //contains all file names in user directory
    //code acquired from http://stackoverflow.com/questions/8532569/exclude-hidden-files-from-scandir
    $userfiles = preg_grep('/^([^.])/', scandir($userpath));
    //close
    
    
    //loop through all user files
    foreach($userfiles as $file) {
        //if the user clicks view
        if (isset($_POST["view"])) {
            if ($_POST["view"] == $file) {
                 
                $full_path = get_file_path($file);
                // Now we need to get the MIME type (e.g., image/jpeg).  PHP provides a neat little interface to do this called finfo.
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mime = $finfo->file($full_path);
                 
                // Finally, set the Content-Type header to the MIME type of the file, and display the file.
                //if it can't be viewed in browser, download it
                $file_ext = pathinfo($full_path, PATHINFO_EXTENSION);
                $file_ext = strtolower($file_ext);
                if (in_array($file_ext, $exts)) {
                    header("Content-Type: " . $mime);
                }
                else {
                    header('Content-Disposition: attachment; filename=' . $file);
                    header('Content-Length: ' . filesize($full_path));
                }
                
                //there was white space somewhere messing everything up
                //gotten from http://stackoverflow.com/questions/22806647/why-is-my-image-not-being-displayed-correct-when-loading-it-using-readfile
                ob_clean();
                flush();
                //close
                
                readfile($full_path);
            }
        }
        //if the user clicks delete
        if(isset($_POST["delete"])){
            if($_POST["delete"] == $file){
                $full_path = get_file_path($file);
                
                unlink($full_path);
                print("File deleted");
                gohome();
            }
        }
        
        if(isset($_POST["email"])){

            if ($_POST["email"] == $file) {
 
                
                echo("
                <form method='POST' action='fileaction.php'>
                <p>Enter the email you wish to send this file to:</p>
                <input type='input' name='to_email' />
                <input type='submit' name='submit' value=$file />
                
                </form>");
                
                $fileName = $_POST["email"];
                $_SESSION["file"] = $fileName;
                //$_SESSION["buttonText"] = $buttonText;
            }
        }
        
        if(isset($_POST["to_email"])){

            if($_POST["submit"] == $file){
                $mail = new PHPMailer();
                
                //this code is from https://github.com/PHPMailer/PHPMailer, under the examples folder
                //we used it because it made it way easier to attach files to sending emails
                print($_SESSION["file"]);
                $toEmail = htmlentities($_POST["to_email"]);
                $full_path = get_file_path($_SESSION["file"]);
                
                $mail->isSMTP();
                $mail->SMTPDebug = 0;
                $mail->Debugoutput = 'html';
                $mail->Host='smtp.gmail.com';
                $mail->Port=587;
                $mail->SMTPSecure = 'tls';
                $mail->SMTPAuth = true;
                
                
                $mail->Username     = 'visaalserver@gmail.com';
                $mail->Password = "cse330wustl";
                
                //Set who the message is to be sent from
                $mail->setFrom('visaalserver@gmail.com', $username);
    
                //Set who the message is to be sent to
                $mail->addAddress($toEmail, 'Sent through VisaalAndOwens FileSharing Service');
                //Set the subject line
                $mail->Subject = 'Someone Shared a File With You Using VisaalAndOwens FileSharing Service!';
                //Read an HTML message body from an external file, convert referenced images to embedded,
                //convert HTML into a basic plain-text alternative body
                $mail->msgHTML(file_get_contents('messagebody.html'), dirname(__FILE__));
                //Replace the plain text body with one created manually
                $mail->AltBody = 'The file sent to you is attached to this email.';
                //Attach an image file
                $mail->addAttachment($full_path);
                //send the message, check for errors
                if (!$mail->send()) {
                    echo "Mailer Error: " . $mail->ErrorInfo;
                } else {
                    echo " Message sent!";
                }
                
                //$mail->FromName  = $username;
                //$mail->Subject   = 'A file has been shared with you!';
                //$mail->Body      = "thank you for using Owen and Visaal's file sharing website!";
                //$mail->AddAddress( $toEmail );
                //
                //$file_to_attach = $full_path;
                //
                //$mail->AddAttachment( $file_to_attach , $_SESSION["file"] );
                //
                //return $mail->Send();
            }
             gohome();
        }
        
            
            
            
        
        
        
    }

    
    
?>
</body>
</html>
