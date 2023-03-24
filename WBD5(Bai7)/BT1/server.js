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
                        <th>${listProduct[i].id}</th>
                        <th>${listProduct[i].name}</th>
                        <th>${listProduct[i].price}</th>
                        <th>
                            <form method="post">
                                <input type="hidden" name = "deleteById" value="${listProduct[i].id}">
                                <button type="submit">Delete</button>
                            </form>
                        </th>
                        <th>
                            <form method="post">
                                <input type="text" name = "idEdit" value="${listProduct[i].id}">
                                <button type="submit">Edit</button>
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
            if (product.deleteById) {
                let listProduct = JSON.parse(fs.readFileSync('data.json', "utf-8"));
                let index = listProduct.findIndex(item=>{
                    return item.id == product.deleteById
                })
                listProduct.splice(index,1)
                fs.writeFileSync('data.json', JSON.stringify(listProduct));
                res.writeHead(301, {'location': '/'});
                res.end();
            } else if(product.idEdit){
                let listProduct = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
                console.log('checkkkk')
                console.log(listProduct)
                let index = listProduct.findIndex(item=>{
                    return item.id == product.idEdit;
                })
                let productEdit = listProduct[index];
                fs.readFile('WebEdit.html', 'utf-8',(err, webEdit) => {
                    webEdit = webEdit.replace('{id}', productEdit.id);
                    webEdit = webEdit.replace('{name}', productEdit.name);
                    webEdit = webEdit.replace('{price}', productEdit.price);
                    res.write(webEdit);
                    res.end();
                })
            } else if(product.editById){
                let dataWantEdit = JSON.parse(fs.readFileSync('data.json','utf-8'));
                let index = dataWantEdit.findIndex(item => {
                    return item.id == product.editById;
                })
                dataWantEdit[index]={id: product.editById, name: product.nameEdit, price: product.priceEdit};
                fs.writeFileSync('data.json', JSON.stringify(dataWantEdit));
                res.writeHead(301, {location:'/'});
                res.end()
            }
            else {
                let listProduct = JSON.parse(fs.readFileSync('data.json', "utf-8"));
                product.id = (listProduct.length>0)? +listProduct[listProduct.length-1].id+1:1;
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