'use strict';

module.exports = function(){
    return{
        UserNameValidation: (req, res, next) => {
            req.checkBody('username', 'You have to enter your small name').notEmpty(); // checks if the username is valid (not empty)

            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });

                    req.flash('error', messages);
                    res.redirect('/signup');

                  })
                    .catch((err) => {
                       return next();
                    })

                }

    }
}
