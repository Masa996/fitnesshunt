
function appendScoreToSheet(sheetName, question, score)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(sheetName);
 sheet.appendRow([question, score]);
}

function appendInteractionToLog(sheetName, user, mission, location)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(sheetName);
 var d = new Date();

 var timeStamp = d.getTime();  // Number of ms since Jan 1, 1970
 sheet.appendRow([user, mission, location, timeStamp]);
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
/*
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}*/



function getLastTime(sheetName, user)
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var selection=sheet.getDataRange();
  var columns=selection.getNumColumns();
  var rows=selection.getNumRows();
  var t1=0;
  var t2=0;
  for (var row=2; row <= rows; row++) {
    var mailCell=selection.getCell(row,1);
    if (!mailCell.isBlank() && mailCell.getValue()==user) {
        t1=t2;
        t2=selection.getCell(row,4).getValue();   
        Logger.log("T1:"+t1);
        Logger.log("T2:"+t2);

    }
  }

  return t2-t1;
}
function appendToDataset(sheetName, user)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(sheetName);
 var lat1=43.32611955605144;
 var lon1=21.8954203846284;
 var lat2=44.793856;
 var lon2=20.453786;
 var d=distance(lat1,lon1,lat2,lon2, "K");
 //var d=getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
 time=getLastTime("Log",user);
 kcal=10;
 sheet.appendRow([user, d, time, kcal]);
}

/*
function onObjectInteraction(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();

  if(sheetName === "Artifacts"){
    var location=sheet.getRange(activeRow,1).getValue();
    var mission=sheet.getRange(activeRow,4).getValue();
    var user=sheet.getRange(activeRow,5).getValue();
    appendInteractionToLog("Log",user, mission,location);    
    appendToDataset("Dataset", user)
  }
}*/


function onArtifactInteraction(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();

  if(sheetName === "Artifacts"){
    var location=sheet.getRange(activeRow,1).getValue();
    var mission=sheet.getRange(activeRow,4).getValue();
    var user=sheet.getRange(activeRow,5).getValue();
    appendInteractionToLog("Log",user, mission,location);    
    appendToDataset("Dataset", user);
    /*
    var dur=getLastTime("Log",user);
    var hours=(dur/1000)/3600;
    var response = UrlFetchApp.fetch("http://ed6917617fa3.ngrok.io/regresija?tezina=70&tip=1&trajanje="+dur);
    var kcal=response.getContentText();*/


    var score=updateScore("Score",user, 2);
    Logger.log(kcal);


  }




}



function updateScore(sheetName, user, score)
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var selection=sheet.getDataRange();
  var columns=selection.getNumColumns();
  var rows=selection.getNumRows();
  for (var row=2; row <= rows; row++) {
    var mailCell=selection.getCell(row,1);
    if (!mailCell.isBlank() && mailCell.getValue()===user) {
      var scoreCell=selection.getCell(row,2);
      scoreCell.setValue(scoreCell.getValue()+score);
    }
  }
}


function onQuestionCompleted(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  var score=0;

  if(sheetName === "Questions"){
    var answer=sheet.getRange(activeRow,2).getValue();
    var correct=sheet.getRange(activeRow,4).getValue();
    var user=sheet.getRange(activeRow,5).getValue();
    
    if(answer==correct)
    {
      score=sheet.getRange(activeRow,3).getValue();
      updateScore("Score",user, score);

    }

  }
}



function onRewardClaim(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  if(sheetName === "Rewards"){
    var response = UrlFetchApp.fetch("http://www.google.com/");
    Logger.log(response.getContentText());
    var claimAddress=sheet.getRange(activeRow,4).getValue();
    if(claimAddress!="")
    {
      var volunteerScore=getScore("Score", claimAddress);
      var rewardItem=sheet.getRange(activeRow,1).getValue();
      var neededScore=sheet.getRange(activeRow,3).getValue();
      if(volunteerScore>=neededScore)
      {
        var subject=rewardItem;
        var message=generateDiscountCode();
        payReward("Score",claimAddress,neededScore);
        MailApp.sendEmail(claimAddress, subject, message);
        sheet.getRange(activeRow,4).setValue("");
      }
    }
  }
}

function onArtifactClaim(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  if(sheetName === "Artifacts"){
    var response1 = UrlFetchApp.fetch("http://3e59cc4d386b.ngrok.io/regresija?tezina=70&tip=1&trajanje=1");
    var response2 = UrlFetchApp.fetch("http://3e59cc4d386b.ngrok.io/regresija?tezina=70&tip=1&trajanje=1");
    Logger.log(response1.getContentText());
    Logger.log(response1.getContentText());
  }
}

function generateDiscountCode()
{
  var first=(Math.random()*100);
  var second=(Math.random()*100);
  var third=(Math.random()*100);
 // var currentDate = Utilities.formatDate(new Date(), "GMT", "### EEEE - dd/MM/yyyy")
  //return first;
  //return first+second+third;
 // return getCurrentDayNumber()+" "+getCurrentHourNumber();
 return "COUPON"+getCurrentDayNumber()+getCurrentHourNumber();
}

function getCurrentDayNumber()
{
  var currentDate = Utilities.formatDate(new Date(), "GMT+1", "### EEEE - dd/MM/yyyy");
  var day = currentDate.split(" ");
  if(day[1]==="Monday") return 1;
  if(day[1]==="Tuesday") return 2;
  if(day[1]==="Wednesday") return 3;
  if(day[1]==="Thursday") return 4;
  if(day[1]==="Friday") return 5;
  if(day[1]==="Saturday") return 6;
  if(day[1]==="Sunday") return 7;
}


function getCurrentHourNumber() {
  var currentDate = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd'*'HH");
  var h=currentDate.split("*");
  return h[1];
}



function getScore(sheetName, user)
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var selection=sheet.getDataRange();
  var columns=selection.getNumColumns();
  var rows=selection.getNumRows();
  for (var row=2; row <= rows; row++) {
    var mailCell=selection.getCell(row,1);
    if (!mailCell.isBlank() && mailCell.getValue()===user) {
      var scoreCell=selection.getCell(row,2);
      var score=scoreCell.getValue();
      return score;
    }
  }
  return 0;
}


function payReward(sheetName, volunteer, price)
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var selection=sheet.getDataRange();
  var columns=selection.getNumColumns();
  var rows=selection.getNumRows();
  for (var row=2; row <= rows; row++) {
    var mailCell=selection.getCell(row,1);
    if (!mailCell.isBlank() && mailCell.getValue()===volunteer) {
      var scoreCell=selection.getCell(row,2);
      var score=scoreCell.getValue()-price;
      scoreCell.setValue(score);
      return 1;
    }
  }
  return 0;
}