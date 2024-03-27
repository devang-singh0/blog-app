import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto"
import { setTokenToUser } from "../services/auth.js";
let userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImgURL: {
        type: String,
        default: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.735520172.1711324800&semt=ais'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return;

    let salt = randomBytes(16).toString();
    let hashedPassword = createHmac('sha256', salt).
        update(user.password).
        digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.static('matchPassword', async function (email, password) {
    let user = await this.findOne({ email });
    if(!user) return false;
    let salt = user.salt;
    let hashedPassword = user.password;
    let userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    if(userProvidedHash === hashedPassword){
        return setTokenToUser(user);
    }
})

export let User = model('User', userSchema);