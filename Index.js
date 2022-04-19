let http = require('http');

const port = process.env.PORT || 3000

http.createServer(function (request, response) {
    console.log('Er is een request.');

    let contentType = {'Content-Type': 'text/plain'};

    response.writeHead(200, contentType);

    let exampleArray = ["item1", "item2"];
    let exampleObj = {
        item1: "item1Val",
        item2: "item2Val"
    };

    let json = JSON.stringify({
        anObj: exampleObj,
        anArray: exampleArray,
        another: "item"
    })
    response.end(json);
}).listen(port, () => console.log('De server luistert op port 3000'));