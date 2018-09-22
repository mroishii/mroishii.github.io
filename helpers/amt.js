var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";

function amtLogin() {
    var user = 'trongtv_api';
    var password = 'Amt_api@2018##';
    
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

function amtTranslate(source, content = undefined) {
    var amtToken;
    var ret;
    
    if (Cookies.get('amtToken') !== undefined) {
        amtToken = Cookies.get('amtToken');
        console.log("Logged in. Token: " + amtToken);
    }
    
    $.ajax({
        url: translateUrl,
        type: 'post',
        headers: {'content-type': 'application/json',
                  'authorization': 'Bearer ' + amtToken,
                  'token-type': 'AMT'},
        data: '{"jpn":"'+ source +'"}',
        async: false
    }).done(function(data) {
        console.log("Translated. Data: " + data);
        ret = data.toString();
        // if (content === "subject") {
        //     $("#subject").html(data);
        // } else if (content === "body") {
        //     $("#translated").html(data);
        // }
    }).fail(function(error) {
        console.log("Translate failed. Reason: " + error.responseText);
    })

    return ret;
}