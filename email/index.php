<?php

require_once(__DIR__ . '/../config.php');

function ipLog() {
    // Create connection
    $con = mysqli_connect("localhost", getMySQLUser(), getMySQLPass(), "spam");
    
    // Check connection
    if (mysqli_connect_errno()) {
        err("Failed to connect to MySQL");
        return false;
    }
    
    $ip = $_SERVER['REMOTE_ADDR'];
    /* create a prepared statement */
    if ($stmt = $con->prepare("INSERT INTO `ip` (ip, action) VALUES (?, 'email')")) {
        
        /* bind parameters for markers */
        $stmt->bind_param("s", $ip);
        
        /* execute query */
        $stmt->execute();
        
        /* close statement */
        $stmt->close();
    } else {
        err("Failed to execute query.");
        mysqli_close($con);
        return false;
    }
    
    mysqli_close($con);
    return true;
}

/* SELECT `time` FROM `ip` WHERE `time` > DATE_SUB( NOW(), INTERVAL 30 MINUTE ) LIMIT 1 */
function ipCheck() {
    // Create connection
    $con = mysqli_connect("localhost", getMySQLUser(), getMySQLPass(), "spam");
    
    // Check connection
    if (mysqli_connect_errno()) {
        err("Failed to connect to MySQL");
        return false;
    }
    
    $numRows = 0;
    
    $ip = $_SERVER['REMOTE_ADDR'];
    /*create a prepared statement */
    if ($stmt = $con->prepare("SELECT `time` FROM `ip` WHERE `time` > DATE_SUB( NOW(), INTERVAL 30 MINUTE ) AND `ip`=? AND `action`='email' LIMIT 1")) {
        
        /* bind parameters for markers */
        $stmt->bind_param("s", $ip);
        
        /* execute query */
        $stmt->execute();
        
        /* Bind results */
        $stmt->bind_result($result);
        
        /* Fetch the value */
        $stmt->fetch();
        
        if (isset($result)) {
            $numRows = 1;
        }
        
        /* close statement */
        $stmt->close();
    } else {
        err("Failed to execute query.");
        mysqli_close($con);
        return false;
    }
    
    if ($numRows == 0) {
        mysqli_close($con);
        return true;
    }
    
    err("An email from this IP was sent within the past 30 minutes.  Please wait a few minutes before trying to send another.");
    mysqli_close($con);
    return false;
}

function spamcheck($field) {
    // Sanitize e-mail address
    $field = filter_var($field, FILTER_SANITIZE_EMAIL);
    // Validate e-mail address
    if (filter_var($field, FILTER_VALIDATE_EMAIL)) {
        return TRUE;
    } else {
        return FALSE;
    }
}

function sanatizeJSstring($str) {
    $noBackSlash   = str_replace("\\", "\\\\", $str);
    $noDoubleQuote = str_replace("\"", "\\\"", $noBackSlash);
    return $noDoubleQuote;
}

function err($msg) {
    $sanatized = sanatizeJSstring($msg);
    echo "{\"success\":false,\"msg\":\"" . $sanatized . "\"}";
}

function success($msg) {
    $sanatized = sanatizeJSstring($msg);
    echo "{\"success\":true,\"msg\":\"" . $sanatized . "\"}";
}

// the user has submitted the form
// Check if the "from" input field is filled out
if (!ipCheck()) {
    return;
}
if (isset($_POST["from"])) {
    // Check if "from" email address is valid
    $mailcheck = spamcheck($_POST["from"]);
    if ($mailcheck == FALSE) {
        err("invalid input");
        return;
    }
    $from    = $_POST["from"]; // sender
    $subject = "SPA Website:  Contact Us";
    $message = "";
    $name    = "";
    if (isset($_POST["message"])) {
        $message = $_POST["message"];
    }
    if (isset($_POST["name"])) {
        $name = $_POST["name"];
    }
    $message = $_POST["message"] . "\r\n\r\n" . $_POST["name"];
    // message lines should not exceed 70 characters (PHP rule), so wrap it
    $message = wordwrap($message, 70);
    // send mail
    mail("kkleidal@gmail.com", $subject, $message, "From: $from\n");
    ipLog();
    success("sent");
} else {
    err("no email specified");
}

?>