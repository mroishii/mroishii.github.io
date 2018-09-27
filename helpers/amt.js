var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";
var translatedData = new Array();

function amtLogin() {
    var user = 'trongtv_api';
    var password = 'Amt_api@2018##';
    var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
    $.ajax({
        url: loginUrl,
        type: 'post',
        headers: {'Content-Type': 'application/json'},
        data: '{"username":"'+ user +'","password":"'+ password +'"}'
    }).done(function(response) {
        //console.log("Logged in. Token: " + amtToken);
        Cookies.set('amtToken', response.token, { expires: inThirtyMinutes });
    }).fail(function(error) {
        console.log("Login failed. Reason: " + error.responseText);
    })
}

function amtTranslate(source, contentType, callback = undefined) {
    console.log(callback);
    var amtToken;

    if (Cookies.get('amtToken') !== undefined) {
        amtToken = Cookies.get('amtToken');
    } else {
        amtLogin();
    }
    
    $.ajax({
        url: translateUrl,
        type: 'post',
        headers: {'content-type': 'application/json',
                  'authorization': 'Bearer ' + amtToken,
                  'token-type': 'AMT'},
        data: '{"jpn":"'+ source +'"}',
    }).done(function(data) {
        console.log("Translated. Data: " + data);
        if (contentType === "subject") {
            $("#subject").html("<b>" + data + "</b>");
        } else if (contentType == "body") {
            callback(data.replace(/(\r\n|\n|\r)/gm, "<br>"));
        }
    }).fail(function(error) {
        console.log("Translate failed. Reason: " + error.responseText);
    })
}