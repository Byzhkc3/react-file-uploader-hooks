const express = require("express");
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

// 文件上传
app.post('/upload',(req,res)=>{
    if(req.files === null){
        return res.status(400).json({msg:"没有上传文件"})
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`,err => {
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }

        return res.json({fileName:file.name,filePath:`/uploads/${file.name}`});
    });
});


app.listen(5000,()=>console.log("服务正在运行..."));
