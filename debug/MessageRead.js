'use strict';

(function () {

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        var token;
        $(document).ready(function () {
            
            //This to inform the Authenticator to automatically close the authentication dialog once the authentication is complete.
             if (OfficeHelpers.Authenticator.isAuthDialog()) {
                //Before closing, parse token and store in localStorage (SAFARI UNSUPPORTED)
                // localStorage.setItem("TokenURL", location.href);
                // localStorage.setItem("Token", parseTokenFromUrl((String)(location.href)));
                //window.close();
                window.close();
             }

             //If token is not existed, do authentication protocol
             if (Cookies.get('access_token') === undefined) {
                $('#errormessage').text("You are not authorized or your session has expired.");
                doAuthorize();
             } else {
                 //Get token
                 token = Cookies.get("access_token");
                 //Log it
                 logIt("token", token);
                 //Load Item Properties
                 loadItemProps(token);
             }
        });
    };

    function doAuthorize() {
        //Create new authenticator
        var authenticator = new OfficeHelpers.Authenticator();
                
        //Parameters for authenticator
        var client_id = '40f52d05-f5d8-4b29-9356-4248678802ba';
        var configs = {redirectUrl: 'https://mroishii.github.io/MessageRead.html',
                       scope: 'https://graph.microsoft.com/mail.readwrite'};

        // register Microsoft (Azure AD 2.0 Converged auth) endpoint using parameters)
        authenticator.endpoints.registerMicrosoftAuth(client_id, configs);

        // Authentication for the default Microsoft endpoint
        authenticator
            .authenticate(OfficeHelpers.DefaultEndpoints.Microsoft)
            .then(function (token) { /* Microsoft Token */ 
                console.log(token);
                $('#errormessage').text("Authorized");
                var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
                Cookies.set('access_token', (String)(token.access_token), {expires : inThirtyMinutes});
                location.reload();
            })
            .catch(OfficeHelpers.Utilities.log);
    }

    function parseTokenFromUrl (url) {
        return url.substring(
            url.search("access_token") + 13,
            url.search("token_type") - 1
        );
    }

    //Outdated
    // function getEWSToken() {
    //     Office.context.mailbox.getCallbackTokenAsync({isRest: true}, function (result) {
    //         if (result.status === "succeeded") {
    //             logIt("Token", result.value);
    //             return result.value;
    //         } else {
    //             logIt(result.error.name, result.error.message);
    //             return null;
    //         }
    //     });
    // }

    function getItemRestId() {
        var itemId;
        if (Office.context.mailbox.diagnostics.hostName === 'OutlookIOS') {
          // itemId is already REST-formatted
          itemId = Office.context.mailbox.item.itemId
          
        } else {
          // Convert to an item ID for API v2.0
          itemId = Office.context.mailbox.convertToRestId(
            Office.context.mailbox.item.itemId,
            Office.MailboxEnums.RestVersion.v2_0
          );
        }
        logIt("Item ID", itemId);
        return itemId;
    }

    function loadItemProps(accessToken) {
        // Get the table body element
        var tbody = $('.prop-table');

        // Get the item's REST ID
        var itemId = getItemRestId();

        // Construct the REST URL to the current item
        // Details for formatting the URL can be found at 
        // https://docs.microsoft.com/previous-versions/office/office-365-api/api/version-2.0/mail-rest-operations#get-a-message-rest
        //var getMessageUrl = Office.context.mailbox.restUrl +
        //             '/v2.0/me/messages/' + itemId;
        var getMessageUrl = "https://graph.microsoft.com/v1.0/me/messages/" + itemId;
        
        //Log the getMessageUrl
        logIt("url", getMessageUrl);

        $.ajax({
            url: getMessageUrl,
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).done(function(item){
            // Message is passed in `item`
            tbody.append(makeTableRow("Subject", item.subject));
            tbody.append(makeTableRow("ContentType", item.body.contentType));
            translate(item.subject, "subject");
            translate(item.body.content, "body");
        }).fail(function(error){
            // Handle error
            $('#errormessage').text("You are not authorized or your session has expired.");
            console.log("Error", error.status);
            doAuthorize();
        });
    }

    function makeTableRow(name, value) {
        return $("<tr><td><strong>" + name +
            "</strong></td><td class=\"prop-val\"><code>" +
            value + "</code></td></tr>");
    }

    function logIt(name, value) {
        // Get the table body element
        var tbody = $('.prop-table');
        tbody.append(makeTableRow(name, value));
    }

    function translate(source, content) {
        $.ajax({
            url:'https://translation.googleapis.com/language/translate/v2',
            type:"post",
            dataType:"json",
            data: {'q': source,
                   'target' : 'vi',
                   'key' : 'AIzaSyAYlBYQshvNVdRwBdCjXT6k8fqdxmoHnn0'},
            success: function(json) {
                if (content === "subject") {
                    $("#subject").html(json.data.translations[0].translatedText);
                } else if (content === "body") {
                    $("#translated").html(json.data.translations[0].translatedText);
                }
            }
        });
    }

    function amtLogin () {
        var user = 'trongtv_api';
        var password = 'Fsoft@amt123#';
        var url = 'https://amt.akaminds.co.jp/login';
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            headers: {'Content-Type': 'application/json'},
            data: {
                username: user,
                password: password
            },
            success: function(result) {
                console.log(result);
            }
        })
    }
})();