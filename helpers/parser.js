var parsedMailBody;
function parseHTML(html) {

    //Get html-parser handler's instance
    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
        if (error) {
            console.log('Parse Failed. error: ' + error);
        } else {
            console.log('Parse Completed');
        }
    }, { verbose: false, ignoreWhitespace: true }); //Ignore some useless stuff

    //Get html-parser instance, pass the handler
    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);

    //Parse the html content
    parser.parseComplete(html);

    console.log(handler.dom);
    return handler.dom;
}

//Loop through entire json object, do the action stuff
var traverseIndex = 0;
var textToTranslate = [];

function traverse(node, mode) {
    //Loop through every node inside parent
    for (var i = 0; i < node.length; i++) {
        //Any node with text data will be translate
        if (node[i].data !== undefined) {
            var oldData = $.trim(node[i].data).replace(/(\r\n|\n|\r)/gm, "\\n");
            if (mode == "translate") {
                textToTranslate.push(oldData);
            } else if (mode == "replace") {
                console.log(translatedData);
                node[i].data = translatedData[traverseIndex] + "<br>";
                console.log('new:' + node[i].data);
                traverseIndex++;
            }  
        }
        //If node have children, traverse it too
        if (node[i].children !== undefined) {
            traverse(node[i].children, mode);
        }
    }
}
