const port=3030;

const express = require('express');
const path = require("path");
// สร้างแอป Express  
const app = express();

// const { connect } = require('http2');




const htmlFolderPath = path.join(__dirname, "../../sec2_gr6_fe_src/html");
const staticFolderPath = path.join(__dirname, "../../sec2_gr6_fe_src/image");
app.use(express.static(staticFolderPath));

app.get('/homepage', (req,res)=>{
    console.log(req.url)
    console.log('test homepage');
    res.sendFile(path.join(htmlFolderPath, "homepage.html"));
})
app.get('/update_Product', (req,res)=>{
    console.log('test update_Product');
    res.sendFile(path.join(htmlFolderPath, "update_Product.html"));
})
app.get('/category', (req,res)=>{
    console.log('test category');
    res.sendFile(path.join(htmlFolderPath, "category.html"));
})
app.get('/result2', (req,res)=>{
    console.log('test result');
    res.sendFile(path.join(htmlFolderPath, "result2.html"));
})
app.get('/login', (req,res)=>{
    console.log('test login');
    res.sendFile(path.join(htmlFolderPath, "login.html"));
})
app.get('/PDManagement', (req,res)=>{
    console.log('test pdmanage');
    res.sendFile(path.join(htmlFolderPath, "PDManagement.html"));
})
app.get('/AdminManage', (req,res)=>{
    console.log('test admanage');
    res.sendFile(path.join(htmlFolderPath, "AdminManage.html"));
})
app.get('/AddPD', (req,res)=>{
    console.log('test addPd');
    res.sendFile(path.join(htmlFolderPath, "AddPD.html"));
})
app.get('/EditProduct', (req,res)=>{
    console.log('test editPd');
    res.sendFile(path.join(htmlFolderPath, "EditProduct.html"));
})
app.get('/AddAdmin', (req,res)=>{
    console.log('test addAdmin');
    res.sendFile(path.join(htmlFolderPath, "AddAdmin.html"));
})
app.get('/EditAdmin', (req,res)=>{
    console.log('test editadmin');
    res.sendFile(path.join(htmlFolderPath, "EditAdmin.html"));
})
app.get('/learnmore', (req,res)=>{
    console.log('test editadmin');
    res.sendFile(path.join(htmlFolderPath, "learnmore.html"));
})
app.get('/register', (req,res)=>{
    console.log('test editadmin');
    res.sendFile(path.join(htmlFolderPath, "register.html"));
})
app.get('/teampage', (req,res)=>{
    console.log('test editadmin');
    res.sendFile(path.join(htmlFolderPath, "teampage.html"));
})



app.listen(port, ()=>{
    console.log(`listening on ${port}`);
})