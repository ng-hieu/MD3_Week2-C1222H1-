const http = require('http')
const fs = require('fs')
const qs = require('qs')

let server = http.createServer((req, res)=> {
    let methodRequest = req.method;
    if(methodRequest === 'GET'){
        fs.readFile('./create.html','utf8',(err, data) => {
           res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
           return res.end();
        });
    } else {
        let data = '';
        req.on("data", chunk => {
            data += chunk;
        })
        req.on('end', ()=>{
            let name = qs.parse(data).name;
            fs.writeFile('../data/data.txt', name, err => {
                if(err){
                    console.log('err');
                    return;
                }
                return res.end('Create success')
            })
        })
        req.on('error', ()=>{
            console.log('error')
        })
    }
})
server.listen('8080', function (){
    console.log('Serve running port 8080')
})