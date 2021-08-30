
function appendScoreToSheet(sheetName, question, score)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(sheetName);
 sheet.appendRow([question, score]);
}


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


function onExerciseCompleted(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  var score=0;

  if(sheetName === "Exercises"){
    var answer=sheet.getRange(activeRow,7).getValue();
    var correct=sheet.getRange(activeRow,6).getValue();
    var user=sheet.getRange(activeRow,8).getValue();
    
    if(answer==correct)
    {
      score=sheet.getRange(activeRow,5).getValue();
      updateScore("Score",user, score);

    }

  }
}


function getFileByName(fileName, fileInFolder){
  var filecount = 0;
  var dupFileArray = [];
  var folderID = "";
  
  var files = DriveApp.getFilesByName(fileName);
  
  while(files.hasNext()){
    var file = files.next();
    dupFileArray.push(file.getId());
    
    filecount++;
  };
  
  if(filecount > 1){
    if(typeof fileInFolder === 'undefined'){
        folderID = {"id":false,"error":"More than one file with name: "+fileName+". \nTry adding the file's folder name as a reference in Argument 2 of this function."}
    
    }else{
     //iterate through list of files with the same name
     for(fl = 0; fl < dupFileArray.length; fl++){
       var activeFile = DriveApp.getFileById(dupFileArray[fl]);
       var folders = activeFile.getParents();
       var folder = ""
       var foldercount = 0;
      
       //Get the folder name for each file
       while(folders.hasNext()){
         folder = folders.next().getName();
         foldercount++;
       };
      
       if(folder === fileInFolder && foldercount > 1){
         folderID = {"id":false,"error":"There is more than one parent folder: "+fileInFolder+" for file "+fileName}
       };
      
       if(folder === fileInFolder){
           folderID = {"id":dupFileArray[fl],"error":false};
          
       }else{
         folderID = {"id":false,"error":"There are multiple files named: "+fileName+". \nBut none of them are in folder, "+fileInFolder}
       };
     };
   };
  
  }else if(filecount === 0){
      folderID = {"id":false,"error":"No file in your drive exists with name: "+fileName};
      
  }else{ //IF there is only 1 file with fileName
    folderID = {"id":dupFileArray[0],"error":false};
    };
 
  return folderID;
};


function onExerciseCompleted2(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  var score=0;

  if(sheetName === "Exercises"){
    var full_image_path=sheet.getRange(activeRow,4).getValue();
    var image_path=full_image_path.split("/");
    var image_file=image_path[1];
    
    // Log the name of every file in the user's Drive.
    var files = DriveApp.getFiles();
    Logger.log(image_path);
    while (files.hasNext()) {
      var file = files.next();
      //Logger.log(file.getName());
      file_name=file.getName();

      if(file_name == image_file){
        Logger.log("Hit!");
        Logger.log(file.getName());
        Logger.log(file.getId());
        Logger.log(file.getUrl());
      }
    } 
  }
}

function onExerciseCompleted3(e)
{
  var spreadS = e.source;
  var sheet = spreadS.getActiveSheet();
  var sheetName = sheet.getName();
  var activeRange = sheet.getActiveRange();
  var activeRow = activeRange.getRow();
  var activeColumn = activeRange.getColumn();
  var score=0;

  if(sheetName === "Exercises"){
    var full_image_path=sheet.getRange(activeRow,4).getValue();
    var image_path=full_image_path.split("/");
    var image_file=image_path[1];
    
    // Log the name of every file in the user's Drive.
    var files = DriveApp.getFiles();
    Logger.log(image_path);
    while (files.hasNext()) {
      var file = files.next();
      //Logger.log(file.getName());
      file_name=file.getName();

      if(file_name == image_file){
        Logger.log("Hit!");
        Logger.log(file.getName());
        Logger.log(file.getId());
        Logger.log(file.getUrl());
        var answer=sendImageToFlask(file.getId());
        Logger.log("Answer!");
        Logger.log(answer);
        var correct=sheet.getRange(activeRow,6).getValue();
        var user=sheet.getRange(activeRow,8).getValue();
        Logger.log("Correct:");
        Logger.log(correct);
        if(answer==correct)
        {
          score=sheet.getRange(activeRow,5).getValue();
          updateScore("Score",user, score);
        }



      }
    } 
  }
}


function sendImageToFlask(file_id) {
  var url = "http://8239-35-195-130-220.ngrok.io/image";
  var form = {
    date : new Date(),
    subject : "Check which class!",
    comment : "YogaAR image",
    attachment1 : DriveApp.getFileById(file_id).getBlob()
  };
  return uploadFile(url,form);
}

function uploadFile(url,form) {
  var options = {
    method : "POST",
    payload : form
  };
  var request = UrlFetchApp.getRequest(url,options);   // (OPTIONAL) generate the request so you
  console.info("Request payload: " + request.payload); // can examine it (useful for debugging)
  var response = UrlFetchApp.fetch(url,options);
  console.info("Response body: " + response.getContentText());
  return response.getContentText();
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
