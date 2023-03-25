const http = require('http');
const fs = require('fs');
const qs = require('qs');

let server = http.createServer((req, res) => {
    let url = req.url
    let arrUrl = url.split('/')
    let path = arrUrl[1];
    let chosenHandle;
    if (router[path] !== undefined) {
        chosenHandle = router[path];
    } else {
        chosenHandle = handel.webError;
    }
    chosenHandle(req, res, arrUrl[2])
})

server.listen(8686, 'localhost', function () {
    console.log("Server 8686 is running...")
})

let handel = {};
handel.webProduct = (req, res) => {
    if (req.method === 'GET') {
        fs.readFile('WebProduct.html', "utf-8", (err, showProductInHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = JSON.parse(fs.readFileSync('data.json', "utf-8"));
                let value = '';
                for (let i = 0; i < products.length; i++) {
                    value += `
            <tr>
                <th scope="col">${products[i].id}</th>
                <th scope="col">${products[i].name}</th>
                <th scope="col">${products[i].price}</th>
                <th scope="col" style="text-align: center">
                    <form method="post">
                        <input type="hidden" name="idDelete" value="${products[i].id}">
                        <button type="submit" class="btn btn-warning">Delete</button>
                    </form>
                    <input type="hidden" name="idEdit" value="${products[i].id}">
                    <button type="submit" class="btn btn-warning"><a href="/webEdit/${products[i].id}">Edit</a></button>
                </th>
            </tr>
            `
                }
                res.writeHead(301, {'Content-Type': 'text/html'})
                showProductInHtml = showProductInHtml.replace('{product}', value);
                res.write(showProductInHtml);
                res.end();
            }
        })
    }
    if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let infor = qs.parse(data);
            let products = JSON.parse(fs.readFileSync('data.json', "utf-8"))
            if (infor.idDelete) {
                let index = products.findIndex(item => {
                    return item.id == infor.idDelete;
                })
                products.splice(index, 1);
                fs.writeFileSync('data.json', JSON.stringify(products));
                res.writeHead(301, {'location': '/webProduct'});
                res.end();
            } else {
                infor.id = ((products.length > 0) ? +products[products.length - 1].id + 1 : 1).toString();
                products.push(infor);
                fs.writeFileSync('data.json', JSON.stringify(products));
                res.writeHead(301, {'location': '/webProduct'});
                res.end();
            }
        })
    }
}

handel.webError = (req, res) => {
    fs.readFile('WebError.html', (err, error) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(error);
        res.end();
    })
}

handel.webEdit = (req, res, id) => {
    if (req.method === 'GET') {
        fs.readFile('WebEdit.html', "utf-8", (err, showProductInHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = JSON.parse(fs.readFileSync('data.json', "utf-8"));
                let index = products.findIndex(item => {
                    return item.id == id
                })
                let product = products[index];
                showProductInHtml = showProductInHtml.replace('{id}', product.id);
                showProductInHtml = showProductInHtml.replace('{name}', product.name);
                showProductInHtml = showProductInHtml.replace('{price}', product.price);
                res.write(showProductInHtml);
                res.end();
            }
        })
    }
    if (req.method === 'POST') {
        let products = JSON.parse(fs.readFileSync('data.json', "utf-8"));
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let afterEdit = qs.parse(data);
            let index = products.findIndex(item => {
                return item.id == id;
            })
            products[index]= {id: afterEdit.editById, name: afterEdit.nameEdit, price: afterEdit.priceEdit};
            console.log('Checkkk'+products)
            fs.writeFileSync('data.json', JSON.stringify(products));
            res.writeHead(301, {'location': '/webProduct'})
            res.end();
        })
    }
}
let router = {
    'webProduct': handel.webProduct,
    'webEdit': handel.webEdit
}