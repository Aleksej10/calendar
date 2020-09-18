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
    console.log(email);
	Email.send({
        SecureToken: 'A694C511-2BF4-4D1F-941D-E4BCD288D4BF',
        To : email,
        From: 'dtsinfo.service@gmail.com',
        Subject : 'Event successfully created!',
        Body : 'Hey '+name+', you have successfully created an event on '+datetime+'.',
    })
    .then(function (message) { 
        console.log(message);
        alert("mail sent successfully");
    }); 
}

function after_submit(){
    document.getElementById('captcha').style.visibility = 'hidden';
    send_mail();
}

var validateCaptcha = function(response){
    if(response != null){
        console.log('submitted!');
        after_submit();
    }
    else{
        console.log('you are a robot');
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
    console.log("form is valid");
    console.log(name);
    console.log(phone);
    console.log(email);
    console.log(datetime);
    document.getElementById('submit-button').innerText = '';
    grecaptcha.render('captcha', {
        'sitekey' : '6LfmxM0ZAAAAABH__t4Nkn-U4Cr-VKxJZzPVis17',
        'data-size' : 'compact',
        'callback' : validateCaptcha,
    });
}
