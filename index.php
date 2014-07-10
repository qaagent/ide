<?php
/*
We need to include the config file
to make use of the database.
*/
include_once("../wp-config.php");

/*
We need to include the PasswordHass class
to make use of the methods and to check
if the passwords are matching. 
*/

include_once("../wp-includes/class-phpass.php");

if(!$_POST)
{
    if ( is_user_logged_in() ) {
        global $current_user;
          get_currentuserinfo();

          wp_safe_redirect("http://qaagent.com/ide/ts-explorer.html?qakey={$current_user->apikey}");

    } else {
         // wp_safe_redirect('http://qaagent.com/wp-login.php');
        $redirect = 'http://qaagent.com/ide';
        wp_safe_redirect(wp_login_url( $redirect ));
    }
}
else 
{
    $username = mysql_escape_string($_POST['username']);
    $password = mysql_escape_string($_POST['password']);

    $query = mysql_query("SELECT * FROM ".$table_prefix."users 
                              WHERE user_login = '$username'");
    $row = mysql_fetch_array($query);

    $wp_hasher = new PasswordHash(8, TRUE);

    $password_hashed = $row['user_pass'];

        /*
        Check if the password matches
        - Check if md5 matches
        - or Check if PasswordHash class matches
        */

    if($wp_hasher->CheckPassword($password, $password_hashed)
           || $password_hashed == md5($password)) {
        $_SESSION["logged_in"] = true;
        global $current_user;
        get_currentuserinfo();

        echo $current_user->apikey;
    }
    else {
        echo '0';
    }
}

?>