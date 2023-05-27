let http=require('http');
let fs=require('fs');
let formidable=require('formidable');
const server=http.createServer(function(req,res){
    let form= new formidable.IncomingForm();
    form.parse(req,function(error, fields, file){
        let filepath=file.fileupload.filepath;
        let newpath='C:/Users/cc/Desktop/File/';
        newpath+=file.fileupload.originalFilename;
        console.log(newpath);
        fs.rename(filepath,newpath,function(err){
            if(err) throw err;
            
            res.write('NodeJS File Upload Success!');
            res.end();
        });
    });
});

const port=8888;
server.listen(port,()=>{
    console.log(`Server running at port ${port}`)
    var options={
        port:8888,
        host:'localhost',
    }

    var request=http.request(options);
    request.setHeader("Access-Control-Allow-Origin", "http://localhost:9002");
    request.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, HEAD");
});
