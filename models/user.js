const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // validate(value) {
            //     if (!validator.isEmail(value)) {
            //         throw new Error('Email is invalid')
            //     }
            // }
        },
        password: {
            type: String,
            required: true
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
)

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'secretstring')
    user.tokens = user.tokens.concat( { token })
    await user.save()

    return token
}

// this controls what is sent back when we res.send(user)
// so that password and tokens are not sent to user (security)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    console.log("Logged in")
    return user
}

// Hash plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

// automatically look for "Users" collection (adds s)
const User = mongoose.model('User', userSchema);
module.exports = User;