require('dotenv/config')
const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;
const {MedicineModel} = require('./database');
const {connectDB } = require('./database')
const bodyParser = require("body-parser");
const cors = require('cors')


const transporter = nodemailer.createTransport({
    service : "hotmail",
    auth: {
    user:process.env.MAIL_NAME,
    pass:process.env.MAIL_PASS
    }
});

const options = {
    from:process.env.MAIL_NAME,
    to:"example@gmail.com",
    subject: "Gentle remainder from medicine remainder",
    html: "<h2>Did you for get something!</h2>"
    };

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:["http://localhost:19006",process.env.APP_FRONTEND_URL],
})
)
app.get("/medicines",(req,res) => {
    MedicineModel.find({}).then(meds => {
        res.send({
            success : true,
            meds : meds
        })
    }).catch(err => {
        res.send({
            success : false,
            error : err
        })
    })
})

app.post('/addmedicine',(req,res) => {
    const medData = req.body;
    const medcine = new MedicineModel(medData);
    medcine.save().then(med => {
        res.send({
            success : true,
            status:200
        })
        }).catch(err => {
            res.send({
            success : false,
            error:err
        })
    })
})

app.post('/deletemedicine',(req,res) => {
    const id = req.body.id;
    MedicineModel.deleteOne({_id:id}).then((item)=>{
        res.send({
            success:true,
            message:"Medicine deleted successfully"
        })
    }).catch(err => {
            res.send({
                success:false,
                error:err
            })
    })
})

app.post('/updatemedicine',(req,res) => {
    const id = req.body.id;
    MedicineModel.updateOne({_id:id},{$set : {completed:true}}).then((item)=>{
        res.send({
            success:true,
            message:"Medicine updated successfully"
        })
    }).catch(err => {
            res.send({
                success:false,
                error:err
            })
        })
})

setInterval(function(){
    //update the medicines so that they can displyed daily
    if(new Date().getHours() == 22 && new Date().getMinutes() == 27 && new Date().getSeconds() == 5){
        MedicineModel.updateMany({}, {$set : { completed: false }})
        .then(() => {
            console.log('All medicines have been updated');
        })
        .catch(error => {
            console.log(error);
        });
    }

    //send mails at specified times of day about the medicines
    MedicineModel.find({}).then(meds => {
        meds.forEach(function(med){
            if(med.timings.includes("morning before meals") && new Date().getHours() == 7 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>morning before meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                    })
            }
            if(med.timings.includes("morning with meals") && new Date().getHours() == 8 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>morning with meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                    })
            }
            if(med.timings.includes("noon before meals") && new Date().getHours() == 11 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>noon before meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                    })
            }
            if(med.timings.includes("noon with meals") && new Date().getHours() == 12 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>noon with meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                    })
            }
            if(med.timings.includes("evening before meals") && new Date().getHours() == 19 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>evening before meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                        
                    })
            }
            if(med.timings.includes("evening with meals") && new Date().getHours() == 20 && new Date().getMinutes() == 1 && new Date().getSeconds() == 5){
                    const warn = "<h2>Did you for get something!</h2><h3>"+med.name+"</h3><h3>evening with meals</h3><h3>"+med.doses+"</h3><h3>Stay healthy!</h3>"
                    transporter.sendMail({...options,html:warn,to:med.caretakermail}, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log(info.response)
                        }
                    })
            }
                
        })
    })
},1000)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`);
    })
})