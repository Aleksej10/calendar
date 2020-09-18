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
