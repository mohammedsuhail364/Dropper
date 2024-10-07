const mongoose=require('mongoose')

const connectdatabase=()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connect to the host ${con.connection.host}`);
    })
}
module.exports=connectdatabase;