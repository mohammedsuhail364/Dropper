const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto =require('crypto')
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the name']
    },
    email:{
        type:String,
        required:[true,'please enter the email'],
        unique:true,
        validate:[validator.isEmail,'please enter the valid email']
    },
    password:{
        type:String,
        required:[true,'please enter password'],
        maxLength:[6,'password length must be less than 6'],
        select:false   
    },
    avatar:{
        type:String
    },
    role:{
        type:String,
        default:'user'

    },
    resetpasswordtoken:{
        type:String
    },
    resetpasswordtokenExpire:{
        type:Date
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
userschema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
})

userschema.methods.getjwtToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}
userschema.methods.isValidPassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

userschema.methods.getResetToken=function(){
    // generate resetpassword token
    const token=crypto.randomBytes(20).toString('hex');

    // generate hash and set to resetpasswordToken
    this.resetpasswordtoken = crypto.createHash('sha256').update(token).digest('hex');
    
    // set token expire time
    this.resetpasswordtokenExpire=Date.now()+30*60*1000;
    return token
}

let model=mongoose.model('User',userschema)

module.exports=model;