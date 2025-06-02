import mongoose, { model } from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

// address Schema 
const addressSchema = new Schema({
    street: String,
    zip: String,
    city: String,
    country: String
}, { _id: false });

// user Schema 
const userSchema = new Schema({
    userNumber: Number,
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png"
    },
    roles: {
        type: [String],
        default: ["user"]
    },
    address: [addressSchema]
}, { timestamps: true });

// 🔐 Passwort vor dem Speichern hashen
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Methode zum Passwortvergleich
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const User = model('User', userSchema);

export default User;
