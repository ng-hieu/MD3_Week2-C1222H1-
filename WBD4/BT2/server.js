const http = require('http');
const fs = require('fs');
const qs = require('qs');
let server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        console.log(req.method)
        fs.readFile('calculator.html', "utf-8", (err, numb) => {
            if (err) {
                console.log(err);
            } else {
                numb = numb.replace('{numberA}', 0);
                numb = numb.replace('{numberB}', 0);
                numb = numb.replace('{result}', 0);
                res.write(numb);
                res.end();
            }
        })
    } else if (req.method === 'POST') {
        console.log(req.method)
        let data = ''
        req.on("data", chunk => {
            data += chunk;
        })
        req.on("end", () => {
            let calculators = qs.parse(data);
            let arrCalculator = JSON.parse(fs.readFileSync('data.json', "utf-8"));
            arrCalculator.push(calculators);
            fs.writeFileSync('data.json', JSON.stringify(arrCalculator));
            let result = 0;
            let numA = +arrCalculator[arrCalculator.length - 1].numbA;
            let numB = +arrCalculator[arrCalculator.length - 1].numbB;
            let calcu = arrCalculator[arrCalculator.length - 1].caculator;
            if (calcu === 'sum') {
                result = numA + numB;
            } else if (calcu === 'sub') {
                result = numA - numB;
            } else if (calcu === 'multi') {
                result = numA * numB;
            } else if (calcu === 'div') {
                result = numA / numB;
            }
            fs.readFile('calculator.html', "utf-8", (err, numb) => {
                numb = numb.replace('{numberA}', numA);
                numb = numb.replace('{numberB}', numB);
                numb = numb.replace('{result}', result);
                console.log(numb)
                res.write(numb);
                res.end();
            })
        })
    }
})

server.listen(8686, 'localhost', function () {
    console.log('Localhost 8686 is running');
})