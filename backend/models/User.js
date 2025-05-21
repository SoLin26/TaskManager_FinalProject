import mongoose, {model} from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose

// address Schema 
const addressSchema = new Schema({
    street : String, 
    zip : String,
    city: String,
    country : String
},{_id: false})


// user Schema 

const userSchema = new Schema({
    userNumber : Number,
    fullname:{
        type:String,
        required: true,
       
    },
    username:{
        type:String,
        required: true,
       
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required : true,
        default : false
    },
    profileImage : {
        type : String,
        default : "https://www.w3schools.com/howto/img_avatar.png"
    },
    roles : {
        type:[String],
        required : true,
        default :["user"]
    },
    address : [addressSchema] // multiple addresses
},{timestamps : true});

const User = model('User', userSchema);

export default User


