<html>
<?php


$username= 'root';
$password='';
$db='wtlab_db';

$conn = new mysqli('localhost', $username, $password,$db);

if($conn->connect_error){
die("connection failed" . $conn->connect_error);
}
echo '<p style="color:white;font-family:verdana;font-size:15px;text-align:left">Connected successfully</p><br>';

$sql1="INSERT INTO bidItem (Name, Day, Hour, Min) VALUES ('$_POST[item_name]','$_POST[days]','$_POST[hours]','$_POST[minutes]')";


if($conn->query($sql1)==TRUE){
echo '<p style="color:white;font-family:verdana;font-size:15px;text-align:left">New record FOR bid item created successfully</p><br>';
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$query = "SELECT * FROM bidItem"; //You don't need a ; like you do in SQL
$result = mysqli_query($conn,$query);
echo '<h2 style="text-align:center;font-family:verdana;font-size:60px;color:white"> EXISTING BIDS </h2>';
echo '<table style="margin-left:500px;border-style:solid;border-color:#ffffff" width="400" border="1" cellspacing="0" cellpadding="2">'; // start a table tag in the HTML
echo "<tr align='center' bgcolor='#AF2A2A'><td> ITEM </td><td> Days </td><td> Hours </td><td> Mins </td></tr><br>";
while($row = mysqli_fetch_array($result)){   //Creates a loop to loop through results
echo "<tr align='center' bgcolor='#AF2A2A'><td>" . $row['Name'] . "</td><td>" . $row['Day'] . "</td><td>" . $row['Hour']."</td><td>" .$row['Min']."</td></tr>";  //$row['index'] the index here is a field name
}

echo '</table>'; //Close the table in HTML

mysqli_close($conn);

?>


<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
 	<title>LIST OF EXISTING BIDS</title>

	<meta http-equiv="Content-Language" content="en">
	<meta name="Description" content="Where innovation meets design in web development.">
	<meta name="Keywords" content="website development design django framework html5">

	<meta name="robots" content="index,follow">
	
<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="icon" type="image/png" href="http://hotdot.pro/static/img/fav.png">
	<link type="text/css" rel="stylesheet" href="./events_files/lib.css">
	<link type="text/css" rel="stylesheet" href="./events_files/fonts.css">
	<script type="text/javascript" async="" src="./events_files/watch.js"></script><script type="text/javascript" src="./events_files/jquery.js"></script>
	
<link type="text/css" rel="stylesheet" href="./events_files/general.css">
<link type="text/css" rel="stylesheet" href="./events_files/footer_on_bottom.css">
<script type="text/javascript" src="./events_files/lib.js"></script>
<script type="text/javascript" src="./events_files/map.js"></script>
<script type="text/javascript" src="./events_files/general.js"></script>
<script type="text/javascript" src="./events_files/footer.js"></script>

<link type="text/css" rel="stylesheet" href="./events_files/grid.css">
<link type="text/css" rel="stylesheet" href="./events_files/black_inner.css">
<link type="text/css" rel="stylesheet" href="./events_files/works.css">

<script type="text/javascript" src="./events_files/grid.js"></script>
<script type="text/javascript" src="./events_files/pack.js"></script>


<style type="text/css">.wcolor8 {color: #2b0f0e;}
.wcolor14 {color: #b2c1c7;}
.wcolor12 {color: #8a97a6;}
.wcolor9 {color: #6f96bc;}
.wcolor6 {color: #ffd95c;}
</style>

<link type="text/css" rel="stylesheet" href="./events_files/adapt.css">
<link type="text/css" rel="stylesheet" href="./events_files/minimal_footer.css">
<link rel="stylesheet" type="text/css" href="css/global.css" />

</head>


<p style="color:white;font-family:verdana;font-size:18px;text-align:left"> <a href="./admin_login.php">Click</a> to return</p>
	
</html>
