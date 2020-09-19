var CLIENT_ID = "558637768385-5epml3uiedk1po08rede31o5vatlgtac.apps.googleusercontent.com";
var API_KEY = "AIzaSyD-SHsqvtSLUDTfO4GiH9WypCr7i9wWSDU";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

var signed = false;

function log_msg(msg, color){
    var logd = document.getElementById('logger-div');
    var logp = document.getElementById('logger-p');
    logd.style.opacity = 0;
    logp.style.color = color;
    logp.innerText = msg;
    logd.style.opacity = 1;
    setTimeout(() => { logd.style.opacity = 0; }, 2000);
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
          log_msg(JSON.stringify(error, null, 2), 'red');
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signed = true;
        log_msg('Signed in with google account', 'green');
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
            log_msg('You\'ve got mail, check your spam folder!', 'green');
        }
        else{
            log_msg('Email service currently not available', 'grey');
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

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventt,
    });

    document.getElementById('submit-form').style.display = 'none';

    request.execute(function(eventt) {
      appendPre('Event added to your calendar', 'blue');
    });

}

function get_offset(date){
    const offset = date.getTimezoneOffset();
    const sign = offset < 0 ? '-' : '+';
    var hours = '00' + Math.abs(offset / 60);
    var minutes = '00' + Math.abs(offset % 60);
    return sign + hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);
}

function get_datetime(){
    const t = document.getElementById('datetime').value.split(' ');
    const dt = t[0].split('/');
    const tm = t[1].split(':');
    const d = new Date(dt[2], dt[1], dt[0], tm[0], tm[1], 0, 0);
    // return d.toISOString().split('.')[0]+'+00:00';
    // return d.toISOString().split('.')[0]+get_offset(d);
    return d.toISOString();
}

function after_submit(){
    document.getElementById('captcha').style.visibility = 'hidden';
    document.getElementById('captcha').style.height = '0';
    send_mail();
    create_event();
}

var validateCaptcha = function(response){
    if(response != null){
        after_submit();
    }
    else{
        log_msg('You\'re a robot, admit it!', 'red');
    }
}

function submit(){
    const fields = [
        document.getElementById('name'),
        document.getElementById('phone'),
        document.getElementById('email'),
        document.getElementById('datetime'),
    ];
    for(var f of fields){
        if(!f.validity.valid){
            log_msg('Please fill in all fields', 'red');
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

