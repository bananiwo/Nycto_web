const User = require('./models/user');
const { validationResult, matchedData } = require('express-validator');
module.exports={
    userForm:function(req, res) {
        res.render('register');
    },
    validateForm:function(req,res){
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            var errMsg= errors.mapped();
            var inputData = matchedData(req);

        }else{
            var inputData = matchedData(req);
            // insert query will be written here
            console.log(inputData)
            User.register(
                new User({
                    username: inputData.userName,
                    email: inputData.emailAddress
                }), inputData.password)

        }
        res.render('register', {errors:errMsg, inputData:inputData});
    }
}