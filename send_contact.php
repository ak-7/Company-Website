<html>
<?php


$username= 'root';
$password='';
$db='wtlab_db';

$conn = new mysqli('localhost', $username, $password,$db);

if($conn->connect_error){
die("connection failed" . $conn->connect_error);
}
echo "Connected successfully<br>";

$sql1="INSERT INTO personal (FName, MName, LName, Gender, Id, DOB, Mob) VALUES ('$_POST[FIRSTNAME]','$_POST[MIDDLENAME]','$_POST[LASTNAME]','$_POST[GENDER]','$_POST[EMAIL]','$_POST[DOB]','$_POST[PHNO]')";

$sql2="INSERT INTO contact (Address, Country, PAddress, PCountry) VALUES ('$_POST[ADDRESS]','$_POST[COUNTRY]','$_POST[PADDRESS]','$_POST[PCOUNTRY]')";
$sql3="INSERT INTO jobDetails (Title) VALUE ('$_POST[TITLE]')";

if($conn->query($sql1)==TRUE){
echo "New record FOR PERSONAL created successfully<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
if($conn->query($sql2)==TRUE){
echo "New record FOR CONTACT created successfully<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
if($conn->query($sql3)==TRUE){
echo "New record FOR JOB DETAILS created successfully<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();


?>
<p> <a href="http://localhost/website/career.htm"> Click here</a> to return </p>
</html>