const http = require('http');
const fs = require('fs');
const qs = require('qs');
const server = http.createServer((req, res) => {
    if(req.method==='GET'){
        fs.readFile('todo.html', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
            return res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data+=chunk;
        })
        req.on('end', ()=>{
            const toDoList = qs.parse(data);
            fs.readFile('display.html', "utf-8", (err, datahtml) => {
                if(err){
                    console.log(err)
                }else{
                    datahtml = datahtml.replace('{id}', toDoList.ID);
                    datahtml = datahtml.replace('{toDo}', toDoList.toDo);
                    res.writeHead(200, {'Content-Type': 'text/html' });
                    res.write(datahtml);
                    return res.end();
                }
            })
        })
        req.on('error', () => {
            console.log('error')
        })
    }

})
server.listen(8080, function () {
    console.log('server running at localhost:8080 ')
});