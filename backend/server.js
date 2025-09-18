const app=require('./app')
const connectdatabase = require('./config/database')
const cors=require('cors')
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://mohammedsuhail364.github.io/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
connectdatabase();
app.listen(process.env.PORT,()=>{
    console.log(`server listening to the port ${process.env.PORT} in ${process.env.NODE_ENV}`);
})
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    process.exit(1)
})

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    process.exit(1)
})
