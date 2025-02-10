const mongoose=require('mongoose')

const connectdatabase=()=>{
    mongoose.connect('mongodb+srv://Suhailcart:suhail364@cluster0.jl7nkbn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0',{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connect to the host ${con.connection.host}`);
    })
}
module.exports=connectdatabase;