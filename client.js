document.onkeydown = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 13 : document.getElementById('submit-button').click();
            break;
    }
}

var validateCaptcha = async function(response){
    let res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
          'secret' : '6LfmxM0ZAAAAAHVBrE_ZkyYDcxs0Xqw0oYvH4N0D',
          'response' : response,
      }),
    });

    let result = await res.json();
    console.log(result);
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
