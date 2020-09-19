var CLIENT_ID = "558637768385-5epml3uiedk1po08rede31o5vatlgtac.apps.googleusercontent.com";
var API_KEY = "AIzaSyD-SHsqvtSLUDTfO4GiH9WypCr7i9wWSDU";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

var signed = false;

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
    });
}

// function listUpcomingEvents() {
// gapi.client.calendar.events.list({
//   'calendarId': 'primary',
//   'timeMin': (new Date()).toISOString(),
//   'showDeleted': false,
//   'singleEvents': true,
//   'maxResults': 10,
//   'orderBy': 'startTime'
// }).then(function(response) {
//   var events = response.result.items;
//   appendPre('Upcoming events:');

//   if (events.length > 0) {
//     for (i = 0; i < events.length; i++) {
//       var event = events[i];
//       var when = event.start.dateTime;
//       if (!when) {
//         when = event.start.date;
//       }
//       appendPre(event.summary + ' (' + when + ')')
//     }
//   } else {
//     appendPre('No upcoming events found.');
//   }
// });
// }

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signed = true;
        console.log("successfully signed in with google account!")
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('submit-form').style.display = 'flex';
    } 
    else {
        signed = false;
        document.getElementById('submit-form').style.display = 'none';
        document.getElementById('welcome').style.display = 'flex';
    }
}

function gglogin(){
    gapi.auth2.getAuthInstance().signIn();
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

function create_event(){
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const datetime = get_datetime();

    var eventt = {
        'summary': name + '\'s event',
        'description': 'phone: ' + phone + ' email: ' + email,
        'start': {
            'dateTime': datetime,
        },
        'end': {
            'dateTime': datetime,
        },
        'attendees': [
            {'email': email},
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 15},
                {'method': 'email', 'minutes': 30},
            ]
        }
    };
    console.log(eventt);

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventt,
    });

    request.execute(function(eventt) {
      appendPre('Event created: ' + eventt.htmlLink);
    });
}

function get_datetime(){
    const t = document.getElementById('datetime').value.split(' ');
    const dt = t[0].split('/');
    const d = new Date(dt[2], dt[1], dt[0], t[1][0], t[1][1], 0, 0);
    return d.toISOString();
}

function after_submit(){
    document.getElementById('captcha').style.visibility = 'hidden';
    document.getElementById('captcha').style.height = '0';
    create_event();
    send_mail();
}

var validateCaptcha = function(response){
    if(response != null){
        console.log('you\'re just a human after all');
        after_submit();
    }
    else{
        console.log('you\'re a robot, admit it!');
    }
}

function submit(event){
    if (signed == false){
        console.log('you need to sign with your google account in order to schedule an event');
        console.log('if you did not get prompted for sign in, please refresh the page');
        return;
    }
    const fields = [
        document.getElementById('name'),
        document.getElementById('phone'),
        document.getElementById('email'),
        document.getElementById('datetime'),
    ];
    for(var f of fields){
        if(!f.validity.valid){
            console.log('please fill all fields');
            f.focus();
            return;
        }
    }

    document.getElementById('submit-button').innerText = '';
    grecaptcha.render('captcha', {
        'sitekey' : '6LfmxM0ZAAAAABH__t4Nkn-U4Cr-VKxJZzPVis17',
        'data-size' : 'compact',
        'callback' : validateCaptcha,
    });
}

function ISODateString(d){
    function pad(n){
        return n<10 ? '0'+n : n;
    }
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds());
        // + pad(d.getUTCSeconds())+'Z'
}
