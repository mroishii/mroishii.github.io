var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";

function amtLogin() {
    var user = 'trongtv_api';
    var password = 'Fsoft@amt123#';
    
    $.ajax({
        url: loginUrl,
        type: 'post',
        headers: {'Content-Type': 'application/json'},
        data: '{"username":"'+ user +'","password":"'+ password +'"}'
    }).done(function(response) {
        Cookies.set('amtToken', response.token);
    }).fail(function(error) {
        console.log("Login failed. Reason: " + error.responseText);
    })
}

function amtTranslate(source, content) {
    var amtToken;
    if (Cookies.get('amtToken') !== undefined) {
        amtToken = Cookies.get('amtToken');
        Console.log("Logged in. Token: " + amtToken);
    }
    
    $.ajax({
        url: translateUrl,
        type: 'post',
        headers: {'content-type': 'application/json',
                  'authorization': 'Bearer ' + amtToken,
                  'token-type': 'AMT'},
        data: '{"jpn":"'+ source +'"}'
    }).done(function(data) {
        console.log("Translated. Data: " + data);
        if (content === "subject") {
            $("#subject").html(data);
        } else if (content === "body") {
            $("#translated").html(data);
        }
    }).fail(function(error) {
        console.log("Translate failed. Reason: " + error.responseText);
    })
}