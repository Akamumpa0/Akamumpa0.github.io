<?php
session_start();
if(isset($_POST["submit"])){
    // Retrieve form data
    $studentID = $_POST["student-id"];
    $password = $_POST["password"];

    //initiating the SignupContr class
    include  "../classes/dbh.classes.php";
    include "../classes/login.classes.php";
    include "../classes/login_contr.classes.php";
    

    $login = new LoginContr($studentID, $password);

    //running error handlers and user signup

    $login->LoginUser();
}
else{
    //going back to front page
    $_SESSION['login_form_data'] = ['student-id' => ''];
    header("location: ../home.php");
    exit();
}
