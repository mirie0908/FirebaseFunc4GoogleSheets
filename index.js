const functions = require('firebase-functions');

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';




exports.hello = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase again!");
});
 
 
 
exports.googlesheets = functions.https.onRequest((request,response) => {

  // パラメータ１．氏名
  var reqname = "";
  if (request.query.name !== undefined) {
    reqname = request.query.name
    //response.status(200).send("Hello " + param)
    console.log('requested name: ' + reqname);
  } else {
    //response.status(200).send("Hello World")
    response.send("No name param specified");
  }

  // パラメータ２．
  var reqnear = "";
  if (request.query.near !== undefined) {
    reqnear = request.query.near
    //response.status(200).send("Hello " + param)
    console.log('requested near: ' + reqnear);
  } else {
    //response.status(200).send("Hello World")
    response.send("No near param specified");
  }

  // パラメータ３．
  var reqfree = "";
  if (request.query.free !== undefined) {
    reqfree = request.query.free
    //response.status(200).send("Hello " + param)
    console.log('requested free: ' + reqfree);
  } else {
    //response.status(200).send("Hello World")
    response.send("No free param specified");
  }

  // パラメータ４．
  var reqearly = "";
  if (request.query.early !== undefined) {
    reqearly = request.query.early
    //response.status(200).send("Hello " + param)
    console.log('requested early: ' + reqearly);
  } else {
    //response.status(200).send("Hello World")
    response.send("No early param specified");
  }

    

    
  
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', (err, content) => {
    //if (err) return console.log('Error loading client secret file:', err);
    if (err) {
        response.send("cannot read client_secret.json");
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    //response.send("now authorize func will be executed..");
    authorize(JSON.parse(content), listMajors, reqname, reqnear, reqfree, reqearly);
  });
    
  function authorize(credentials, callback, reqname, reqnear, reqfree, reqearly) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      //if (err) return getNewToken(oAuth2Client, callback,targetname);
      if (err) {
          response.send('getNewToken necessary in advance.');
      }
	oAuth2Client.setCredentials(JSON.parse(token));
	callback(oAuth2Client,reqname, reqnear, reqfree, reqearly);
    });
  }
    

    
  function listMajors(auth, targetname, reqnear, reqfree, reqearly) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1bL7ff47MmFgv2ymKmEdvLd3GnILNU1yNXT7ciKdnWxM',
      range: 'Sheet1!A2:G'
    }, (err, {data}) => {
      //if (err) return console.log('The API returned an error: ' + err);
      if (err) {
        response.send("cannot get sheet data");
      }
      const rows = data.values;
    
      if (rows.length) {
        console.log('number of entry record: ' + `${rows.length}`);
        console.log('既エントリの名簿は以下の通り：');
        console.log('No., Name, EntryDate:');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
            //console.log(`${row[0]}, ${row[4]}`);
            console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}, ${row[6]}`);
        });
      
        console.log('指定の氏名 ' + targetname + ' のエントリ１行を最下行に追加します');
        var newrange = 'A' + `${rows.length + 1}` + ':' + 'F' + `${rows.length + 1}` ;
        console.log('new range: ' + newrange);
        var date = new Date();
        var datestr = date.getFullYear() + '/' + `${date.getMonth() + 1}` + '/' + date.getDate() ; 
        var timestr = date.getHours()  + ':' + date.getMinutes() ;
	console.log('todays datestr: ' + datestr + '  time: ' + timestr);
        var values = [
            [ `${rows.length + 1}` , targetname , timestr , datestr , reqnear , reqfree , reqearly ]
        ];
        var requestparam = {
          spreadsheetId: '1bL7ff47MmFgv2ymKmEdvLd3GnILNU1yNXT7ciKdnWxM',
          range: newrange,
          valueInputOption: 'USER_ENTERED',
          resource: {
            // TODO: Add desired properties to the request body. All existing properties
            // will be replaced.
            values: values
          },
          // auth is oAuth2Client
          //auth: auth
        };
        console.log('１行追加実行');
        //sheets.spreadsheets.values.append(requestparam, function(err, resp) {
        return sheets.spreadsheets.values.append(requestparam, (err, resp) => {
          if (err) {
            console.log('err: ' + err);
            //return;
            response.send("１行追加がerrorになりました。");
          }
          // TODO: Change code below to process the `response` object:
          // console.log(JSON.stringify(response, null, 2)); これ、stringifyすると、circular structure構造が循環してるよエラー出る。のでやめ。
          return response.send("Google sheet append complete.");
        });    
      } else {
        //console.log('既エントリの名簿データがありません。'); //console.log('No data found.');
        response.send("既エントリの名簿データがありません。");
      }
    });
  }    
    
    
    
    
    
    
    
});
