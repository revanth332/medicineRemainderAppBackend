const mongoose = require('mongoose');
require('dotenv/config');
// mongoose.connect('mongodb://localhost:27017/smartnotes');

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.APP_DATABASE);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

// mongoose.connect(process.env.APP_DATABASE).then(db => console.log("database connected")).catch(err => console.log("Databse connection failed"));

const medicineSchema = mongoose.Schema({
    name : String,
    doses : String,
    caretakermail : String,
    completed:{
      type:Boolean,
      default:false
    },
    timings:Array
})

const MedicineModel = mongoose.model("Medicine",medicineSchema);

module.exports = {MedicineModel,connectDB};