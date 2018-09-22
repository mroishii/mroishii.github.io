function parseHTML(html) {

    //Get html-parser handler's instance
    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
        if (error) {
            console.log("parse failed. error: " + error);
        } else {
            console.log("parse completed");
        }
    }, { verbose: false, ignoreWhitespace: true }); //Ignore some useless stuff

    //Get html-parser instance, pass the handler
    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);

    //Parse the html content
    parser.parseComplete(html);

    return handler.dom;
}

//Loop through entire json object, do the action stuff
function traverse(node, action = undefined) {
    //Loop through every node inside parent
    for (var i = 0; i < node.length; i++) {
        //Any node with text data will be translate
        if (node[i].data !== undefined) {
            console.log("Old data:" + $.trim(node[i].data));
            if (action !== undefined) {
                node[i].data = action($.trim(node[i].data));
            }
        }
        
        //If node have children, traverse it too
        if (node[i].children !== undefined) {
            traverse(node[i].children);
        }
    }
}
