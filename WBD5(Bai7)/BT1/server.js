const http = require('http');
const fs = require('fs');
const qs = require('qs');

let server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('ListProduct.html', "utf-8", (err, dataInJSON) => {
            if (err) {
                console.log(err);
            } else {
                let listProduct = JSON.parse(fs.readFileSync('data.json', "utf-8"));
                let value = '';
                for (let i = 0; i < listProduct.length; i++) {
                    value +=
                        `<tr>
                        <th>${listProduct[i].id = i+1}</th>
                        <th>${listProduct[i].name}</th>
                        <th>${listProduct[i].price}</th>
                        <th>
                            <form method="post">
                                <input type="hidden" name = "deleteById" value="${listProduct[i].id}">
                                <button type="submit">Delete</button>
                            </form>
                        </th>
                    </tr>`
                }
                dataInJSON = dataInJSON.replace('{product}', value);
                res.write(dataInJSON);
                res.end();
            }
        })
    }
    if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on("end", () => {
            let product = qs.parse(data);
            let listProduct = JSON.parse(fs.readFileSync('data.json', "utf-8"));
            if (product.deleteById) {
                for (let i = 0; i < listProduct.length; i++) {
                    if ((i+1) == product.deleteById) {
                        listProduct.splice(i, 1);
                        break;
                    }
                }
                fs.writeFileSync('data.json', JSON.stringify(listProduct));
                res.writeHead(301, {'location': '/'});
                res.end();
            } else {
                listProduct.push(product);
                fs.writeFileSync('data.json', JSON.stringify(listProduct));
                res.writeHead(301, {'location': '/'});
                res.end();
            }
        })
    }
})

server.listen(8020, 'localhost', function () {
    console.log('server running at localhost:8020 ')
})