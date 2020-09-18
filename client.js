const CLIENT_ID = '457555921399-86s8lincsm63un3ctbj3oo2n8uete63t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCDEaAMRp2uCzRjtg_vr8hG2QdFeTLBKkw';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } 
    else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

// Sign in the user upon button click.
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


document.onkeydown = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 13 : document.getElementById('submit-button').click();
            break;
    }
}

function send_mail(){
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const datetime = document.getElementById('datetime').value;
	Email.send({
        Host: 'smtp.elasticemail.com',
        Username: 'dtsinfo.service@gmail.com', 
        Password: 'F87C76BD5CBEF0DCEAB88E0E4062E66487D0',
        To : email,
        From: 'dtsinfo.service@gmail.com',
        Subject : 'Event successfully created!',
        Body : 'Hey '+name+', you have successfully created an event on '+datetime+'.',
    })
    .then(function (message) { 
        if(message == 'OK'){
            document.getElementById('submit-button').innerText = 'submitted!';
            alert('mail sent successfully, it is probably in your spam folder by now!');
        }
        else{
            alert('i do not deserve this job');
        }
    }); 
}

function send_event(){

}

function after_submit(){
    document.getElementById('captcha').style.visibility = 'hidden';
    document.getElementById('captcha').style.height = '0';
    send_event();
    send_mail();
}

var validateCaptcha = function(response){
    if(response != null){
        console.log('you\re just a human after all');
        after_submit();
    }
    else{
        console.log('you\'re a robot, admit it!');
    }
}

function submit(event){
    const fields = [
        document.getElementById('name'),
        document.getElementById('phone'),
        document.getElementById('email'),
        document.getElementById('datetime'),
    ];
    for(var f of fields){
        if(!f.validity.valid){
            f.focus();
            return;
        }
    }
    const name = fields[0].value;
    const phone = fields[1].value;
    const email = fields[2].value;
    const datetime = fields[3].value;

    document.getElementById('submit-button').innerText = '';
    grecaptcha.render('captcha', {
        'sitekey' : '6LfmxM0ZAAAAABH__t4Nkn-U4Cr-VKxJZzPVis17',
        'data-size' : 'compact',
        'callback' : validateCaptcha,
    });
}
