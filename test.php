<?php


$username= 'root';
$password='';
$db='wtlab_db';

$conn = new mysqli('localhost', $username, $password,$db);

if($conn->connect_error){
die("connection failed" . $conn->connect_error);
}
echo "Connected successfully";

?>