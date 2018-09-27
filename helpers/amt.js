var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";
var translatedData = [];

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

function amtTranslate(source, contentType, traverseIndex = undefined) {
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
        if (contentType == "subject") {
            $("#subject").html("<b>" + data + "</b>");
        } else if (contentType == "body") {
            //callback.apply(callbackObj, [data.replace(/(\r\n|\n|\r)/gm, "<br>")]);
            // var pushData = {};
            // pushData[traverseIndex] = data.replace(/(\r\n|\n|\r)/gm, "<br>");
            console.log(data);
            translatedData = data.replace(/(\r\n|\n|\r)/gm, "<br>").split("\u0001");
        }
    }).fail(function(error) {
        console.log("Translate failed. Reason: " + error.responseText);
    })
}