<?php
// File: store_user.php

// Retrieve user input from the login form
$username = $_POST['username'];
$password = $_POST['password'];

// Connect to the database
$servername = 'localhost';
$dbUsername = 'your_database_username';
$dbPassword = 'your_database_password';
$dbName = 'your_database_name';

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbName);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Store user information in the database
$sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

if ($conn->query($sql) === TRUE) {
    echo 'User information stored successfully.';
} else {
    echo 'Error storing user information: ' . $conn->error;
}

$conn->close();
?>
