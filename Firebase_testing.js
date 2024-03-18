//***********************************************************//
//***********************************************************//
//*********************SERVER********************************//
//***********************************************************//
//***********************************************************//

var id = app.GetDeviceId();
var listened=false;
var uid;
var message="4d099a657c383e23";

/*
 var firebaseConfig = {
    apiKey: "AIzaSyAB5mrC9RBehJ5WByg_WIctyUM4eSMt2cQ",
    authDomain: "event-01-9eb75.firebaseapp.com",
    databaseURL: "https://event-01-9eb75.firebaseio.com",
    projectId: "event-01-9eb75",
    storageBucket: "event-01-9eb75.appspot.com",
    messagingSenderId: "244757108292",
    appId: "1:244757108292:web:dc686f75b0ac08f9ef0e11",
    measurementId: "G-L7SVQVBR64"
  };
  
  */

var firebaseConfig = {
    apiKey: "AIzaSyDlXHnGXvIjODWu2m35ba8TWrOrdb1NEd8",
    authDomain: "callcentersapp-f8df3.firebaseapp.com",
    databaseURL: "https://callcentersapp-f8df3-default-rtdb.firebaseio.com",
    projectId: "callcentersapp-f8df3",
    storageBucket: "callcentersapp-f8df3.appspot.com",
    messagingSenderId: "585308003427",
    appId: "1:585308003427:web:227cf9150cb9c93c86ac56",
    measurementId: "G-7X2TQV2R9M"
  };

var crypt = app.CreateCrypt();
var encryptedId = crypt.Encrypt( id, "alluserspassword" );
function OnStart()
{
  //Screen set up.
  app.SetOrientation( "Portrait" );
  app.SetScreenMode( "Game" );
  app.SetBackColor( "#000000" );
  
  

  
  
  //Show a progress bar while loading files.
  app.ShowProgress( "Loading firebase files..." );
  
  //Load our firebase files.
  app.Script("Firebase/app.js", !0);
 // app.Script( 'Firebase/firebase-messaging.js' );
  app.Script("Firebase/database.js", !0);
  app.Script("Firebase/auth.js", !0);
  
  //End progress bar.
  app.HideProgress();
  
  //Create our layout.
  lay = app.CreateLayout( "Linear", "FillXY,VCenter" );
  
  //Create our text to send our data.
  namex = app.CreateTextEdit( "", 1, null, "NoSpell" );
  lay.AddChild( namex );
  edt = app.CreateTextEdit( "", 1, null, "NoSpell" );
  edt.SetHint( "Start typing..." );
  edt.SetBackColor( "#220022" );
  edt.SetTextColor( "#ffffff" );
  edt.SetTextSize( 18 );
  edt.SetOnChange( SendData );
  lay.AddChild( edt );
  
  //Create a text object to show
  //if data was sent.
  txtS = app.CreateText( "", 1, null, "FontAwesome" );
  txtS.SetTextSize( 20 );
  lay.AddChild( txtS );
  
  //Add layout to app.
  app.AddLayout( lay );
  
  firebase.initializeApp(firebaseConfig);
  
  db = firebase.database();
  auth = firebase.auth();
  db.goOffline();
  //We listen some specific paths from pur online database.
  CreateListeners();
  //We connect device to the server.
  ConnectFFT();
// messag=firebase.messaging();
}


function CreateListeners(){
  auth.onAuthStateChanged(OnAuth);
  //On connect/disconnect.
  db.ref(".info/connected").on("value", OnConnectionChange);
}

function SendData()
{
  txtS.SetText( "" );
	var data = edt.GetText();
	var mess = namex.GetText();
  if(connected)
  db.ref(mess).set(data).then(OnSuccessSend).catch(OnFailedSend);
  else
  OnFailedSend();
}

function OnSuccessSend()
{
	txtS.SetTextColor( "#22ff22" );
  txtS.SetText( "[fa-check]" );
}

function OnFailedSend()
{
	txtS.SetTextColor( "#ff0000" );
  txtS.SetText( "[fa-times]" );
}



function Connect(){
  auth.signInWithEmailAndPassword(id+"@mygamename.com", encryptedId).catch(function (e)
{

}
);
}

function ConnectFFT()
{
  auth.createUserWithEmailAndPassword(id+"@poste.it", encryptedId).then(OnAuth)
  .catch(error => {
     if(error.code=='auth/email-already-in-use')
          Connect();
       else if(error.code=='auth/invalid-email')
          console.log(`Email address is invalid.`);
        else if(error.code=='auth/operation-not-allowed')
          console.log(`Error during sign up.`);
        else if(error.code=='auth/weak-password')
          console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
        else
          console.log(error.code);
  });
}

function OnAuth(user)
{
  if(user!=null){
      
      
      
  uid = auth.currentUser.uid;
  
  app.Alert("uid : "+uid)
  
  db.goOnline();
  } else db.goOffline();
}

function OnConnectionChange(snap){
  connected = snap.val();
  app.ShowPopup( "Connection status: "+(connected?"Online":"Offline") );
  if(connected){
  if(uid && !listened){
  //Here we could listen also personal data
  //by calling db.ref("userspath/"+uid).on("value", callback);
  //because the uid is unick to each user.
  listened = true;
  }
  }
  
}