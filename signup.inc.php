<?php
session_start();
//check if the user accessed this page by clicking the signup button
if(isset($_POST["submit"])){
    // Retrieve form data
    $firstName = $_POST["first-name"];
    $lastName = $_POST["last-name"];
    $studentID = $_POST["student-id"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $dob = $_POST["dob"];
    $gender = $_POST["gender"];
    $address = $_POST["address"];
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirm-password"];

    $_SESSION['form_data'] = array(
        'first-name' => $firstName,
        'last-name' => $lastName,
        'student-id' => $studentID,
        'email' => $email,
        'phone' => $phone,
        'dob' => $dob,
        'gender' => $gender,
        'address' => $address
);
    
    //initiating the SignupContr class
    include  "../classes/dbh.classes.php";
    include "../classes/signup.classes.php";
    include "../classes/signup_contr.classes.php";
    

  try {
        $signup = new SignupContr($firstName, $lastName, $studentID, $email, $phone, $dob, $gender, $address, $password, $confirmPassword);
        $signup->signupUser();
        unset($_SESSION['form_data']);
        header("location: ../index.php");
        exit();
    } catch (Exception $e) {
        header("location: ../signup.php?error=stmtfailed");
        exit();
    }
} else {
    header("location: ../signup.php");
    exit();
}
