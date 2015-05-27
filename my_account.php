
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml">
<?php


$username= 'root';
$password='';
$db='wtlab_db';

$conn = new mysqli('localhost', $username, $password,$db);

if($conn->connect_error){
die("connection failed" . $conn->connect_error);
}
echo '<p style="color:white;font-family:verdana;font-size:10px;text-align:left">Connected successfully</p><br>';
echo '<h1 style="font-size:60px" align="center"><font color="white"> MY ACCOUNT</font> </h1>';
if($conn->query($sql1)==TRUE){
echo '<p style="color:white;font-family:verdana;font-size:15px;text-align:left">New record FOR bid item created successfully</p><br>';
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$query = "SELECT * FROM bidItem"; //You don't need a ; like you do in SQL
$result = mysqli_query($conn,$query);
echo '<h2 style="text-align:center;font-family:verdana;font-size:30px;color:white"> CURRENT AUCTIONS </h2>';
echo '<table style="margin-left:500px;border-style:solid;border-color:#ffffff" width="400" border="1" cellspacing="0" cellpadding="2">'; // start a table tag in the HTML
echo "<tr align='center' bgcolor='#AF2A2A'><td> ITEM </td><td> </td></tr><br>";
while($row = mysqli_fetch_array($result)){   //Creates a loop to loop through results
echo "<tr align='center' bgcolor='#AF2A2A'><td>" . $row['Name'] . "</td><td> <a href='#CurA'><button> BID</button></a></td></tr>";  //$row['index'] the index here is a field name
}

echo '</table>'; //Close the table in HTML

mysqli_close($conn);

?>
<head>
<title>Bidding Site</title>
<script src="js/jQuery.js"></script>
<script src='js/auto_refresh.js'></script>
<link rel="stylesheet" type="text/css" href="css/global.css" />
<style type="text/css">				
#holder {
	position: relative;   /* leave as "relative" to keep timer centered on 
				 your page, or change to "absolute" then change
				 the values of the "top" and "left" properties to 
				 position the timer */
	top: 100px;            /* change to position the timer; must also change
				 position to "absolute" above */
	left: 0px;  	      /* change to position the timer; must also change
				 position to "absolute" above */
	width: 270px;
	height: 60px;
	border: none;
	margin: 0px auto;
}

#title, #note {
	color: lime;	      /* this determines the color of the DAYS, HRS, MIN, 
				 SEC labels under the timer and the color of the 
				 note that displays after reaching the target date
				 and time; if using the blue digital images,
				 change to #52C6FF; for the red images,
				 change to #FF6666; for the white images,
				 change to #BBBBBB; for the yellow images,
				 change to #FFFF00 */
}

#note {
	position: relative;
	top: 6px;
	height: 20px;
	width: 260px;
	margin: 0 auto;
	padding: 0px;
	text-align: center; 
	font-family: Arial; 
	font-size: 18px;
	font-weight: bold;    /* options are normal, bold, bolder, lighter */
	font-style: normal;   /* options are normal or italic */
	z-index: 1;
}

.title {
	border: none;
	padding: 0px;
	margin: 0px;
	width: 30px;
	text-align: center;
	font-family: Arial;
	font-size: 10px;
	font-weight: normal;    /* options are normal, bold, bolder, lighter */
	background-color: transparent; 
}

#timer {
	position: relative; 
	top: 0px; 
	left: 0px; 
	margin: 5px auto; 
	text-align: center; 
	width: 260px;
	height: 26px;
	border: none;
	padding: 10px 5px 20px 5px; 
	background: #000000;      /* may change to another color, or to "transparent" */
	border-radius: 20px;
	box-shadow: 0 0 10px #000000;  /* change to "none" if you don't want a shadow */
}
body{
	background-color:black
}
</style>

<script type="text/javascript">		


/*  
CHANGE THE ITEMS BELOW TO CREATE YOUR COUNTDOWN TARGET DATE AND ANNOUNCEMENT 
ONCE THE TARGET DATE AND TIME ARE REACHED.
*/
var note="Bid is closed!";	/* -->Enter what you want the script to 
				      display when the target date and time 
				      are reached, limit to 25 characters */
var year=2015;      /* -->Enter the count down target date YEAR */
var month=12;       /* -->Enter the count down target date MONTH */
var day=21;         /* -->Enter the count down target date DAY */
var hour=6;         /* -->Enter the count down target date HOUR (24 hour clock) */
var minute=12;      /* -->Enter the count down target date MINUTE */
var tz=-5;          /* -->Offset for your timezone in hours from UTC (see 
			  http://wwp.greenwichmeantime.com/index.htm to find 
			  the timezone offset for your location) */

//-->    DO NOT CHANGE THE CODE BELOW!    <--	
d1 = new Image(); d1.src = "digital-numbers/1.png";
d2 = new Image(); d2.src = "digital-numbers/2.png";
d3 = new Image(); d3.src = "digital-numbers/3.png";
d4 = new Image(); d4.src = "digital-numbers/4.png";
d5 = new Image(); d5.src = "digital-numbers/5.png";
d6 = new Image(); d6.src = "digital-numbers/6.png";
d7 = new Image(); d7.src = "digital-numbers/7.png";
d8 = new Image(); d8.src = "digital-numbers/8.png";
d9 = new Image(); d9.src = "digital-numbers/9.png";
d0 = new Image(); d0.src = "digital-numbers/0.png";
bkgd = new Image(); bkgd.src = "digital-numbers/bkgd.gif";

var montharray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");

function countdown(yr,m,d,hr,min){
	theyear=yr;themonth=m;theday=d;thehour=hr;theminute=min;
	var today=new Date();
	var todayy=today.getYear();
	if (todayy < 1000) {todayy+=1900;}
	var todaym=today.getMonth();
	var todayd=today.getDate();
	var todayh=today.getHours();
	var todaymin=today.getMinutes();
	var todaysec=today.getSeconds();
	var todaystring1=montharray[todaym]+" "+todayd+", "+todayy+" "+todayh+":"+todaymin+":"+todaysec;
	var todaystring=Date.parse(todaystring1)+(tz*1000*60*60);
	var futurestring1=(montharray[m-1]+" "+d+", "+yr+" "+hr+":"+min);
	var futurestring=Date.parse(futurestring1)-(today.getTimezoneOffset()*(1000*60));
	var dd=futurestring-todaystring;
	var dday=Math.floor(dd/(60*60*1000*24)*1);
	var dhour=Math.floor((dd%(60*60*1000*24))/(60*60*1000)*1);
	var dmin=Math.floor(((dd%(60*60*1000*24))%(60*60*1000))/(60*1000)*1);
	var dsec=Math.floor((((dd%(60*60*1000*24))%(60*60*1000))%(60*1000))/1000*1);
	if(dday<=0&&dhour<=0&&dmin<=0&&dsec<=0){
		document.getElementById('note').innerHTML=note;
		document.getElementById('note').style.display="block";
		document.getElementById('countdown').style.display="none";
		clearTimeout(startTimer);
		return;
	}
	else {
		document.getElementById('note').style.display="none";
		document.getElementById('timer').style.display="block";
		startTimer = setTimeout("countdown(theyear,themonth,theday,thehour,theminute)",500);
	}
	convert(dday,dhour,dmin,dsec);
}

function convert(d,h,m,s) {
	if (!document.images) return;
	if (d <= 9) {
		document.images.day1.src = bkgd.src;
		document.images.day2.src = bkgd.src;
		document.images.day3.src = eval("d"+d+".src");
	}
	else if (d <= 99) {
		document.images.day1.src = bkgd.src;
		document.images.day2.src = eval("d"+Math.floor(d/10)+".src");
		document.images.day3.src = eval("d"+(d%10)+".src");
	}
	else {
		document.images.day1.src = eval("d"+Math.floor(d/100)+".src");
		var day = d.toString();
		day = day.substr(1,1);
		day = parseInt(day);
		document.images.day2.src = eval("d"+day+".src");
		document.images.day3.src = eval("d"+(d%10)+".src");
	}
	if (h <= 9) {
		document.images.h1.src = d0.src;
		document.images.h2.src = eval("d"+h+".src");
	}
	else {
		document.images.h1.src = eval("d"+Math.floor(h/10)+".src");
		document.images.h2.src = eval("d"+(h%10)+".src");
	}
	if (m <= 9) {
		document.images.m1.src = d0.src;
		document.images.m2.src = eval("d"+m+".src");
	}
	else {
		document.images.m1.src = eval("d"+Math.floor(m/10)+".src");
		document.images.m2.src = eval("d"+(m%10)+".src");
	}
	if (s <= 9) {
		document.images.s1.src = d0.src;
		document.images.s2.src = eval("d"+s+".src");
	}
	else {
		document.images.s1.src = eval("d"+Math.floor(s/10)+".src");
		document.images.s2.src = eval("d"+(s%10)+".src");
	}
}
</script>
</head>
<body onload="countdown(year,month,day,hour,minute)">

<a id='myAccount' href='logout.php'>Logout from my account </a>
<h2 id="CurA"><font color="white">Current Auctions</font></h2>
<hr />
<div id="activeItems">
	
		<p align="center"><strong><font color="white" size="5">Production & Procurement</font></strong> </p>
		<p align="center"><strong><font color="red" size="5">Bid Countdown</font></strong> </p>
		
		<p>
		<div id="holder">
	<div id="timer">
		<div id="note"></div>
		<div id="countdown">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="day1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="day2">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="day3">
			<img height=21 id="colon1" src="digital-numbers/colon.png" width=9 name="d1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="h1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="h2">
			<img height=21 id="colon2" src="digital-numbers/colon.png" width=9 name="g1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="m1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="m2">
			<img height=21 id="colon3" src="digital-numbers/colon.png" width=9 name="j1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="s1">
			<img height=21 src="digital-numbers/bkgd.gif" width=16 name="s2">
			<div id="title">
				<div class="title" style="position: absolute; top: 36px; left: 42px">DAYS</div>
				<div class="title" style="position: absolute; top: 36px; left: 105px">HRS</div>
				<div class="title" style="position: absolute; top: 36px; left: 156px">MIN</div>
				<div class="title" style="position: absolute; top: 36px; left: 211px">SEC</div>
			</div>
		</div>
	</div>
</div> 
</p>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
					<form class='bidForm' action='bid.php?id=250' method='POST'>
				<input class='bid' type='submit' value='BID' />
			</form>
				</div>
	<!--<div class="itemContainer">
		<p><strong>Item Name:</strong> app</p>
		<p><strong>Current Item Price:</strong> 0</p>
		<p><strong>Bid Expires In:</strong> 03:37:23</p>
		<p><strong>Present Highest Bidder:</strong> no bidder yet</p>
					<form class='bidForm' action='bid.php?id=914' method='POST'>
				<input class='bid' type='submit' value='BID' />
			</form>
				</div>
	<div class="itemContainer">
		<p><strong>Item Name:</strong> ATTA</p>
		<p><strong>Current Item Price:</strong> 0.01</p>
		<p><strong>Bid Expires In:</strong> 17:15:15</p>
		<p><strong>Present Highest Bidder:</strong> aj</p>
					<form class='bidForm' action='bid.php?id=912' method='POST'>
				<input class='bid' type='submit' value='BID' />
			</form>
				</div> -->
</div>
<div class='clearBoth'></div>
<hr />
<!--
<form action='list_item.php' method='POST'>
	name of item: <input type='text' name='item_name' /><br />
	starting countdown from now: <input type='text' name='hours' />hrs <input type='text' name='minutes' />mins <input type='text' name='seconds' />secs <br />
	<input type='submit' value='List' />
</form>
-->
</body>
</html>