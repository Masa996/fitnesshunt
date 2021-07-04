
function appendScoreToSheet(sheetName, question, score)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(sheetName);
 sheet.appendRow([question, score]);
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