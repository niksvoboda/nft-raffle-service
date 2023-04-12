const jwt    = require('jsonwebtoken');
const config = require("config");


module.exports = function (req, res, next) {
   // if (req.method === "OPTIONS"){
     //   next()
   // }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer token
        /** Если токена нет то транзакция стопается */
        if (!token){
           return res.status(401).json({message: "не авторизован"})
        } else {
            jwt.verify(token,  config.get('auth.secret_key'), function(err, decoded) {
                /** Если токен валидный добавляем ID пользователя для логирования и проверки ролевой модели в контроллере и пропускаем дале */
                if(decoded) {
                    req.user_data = decoded;   
                    next();
                } else {
                     /** Если токен истек то транзакция стопается */           
                 return res.status(401).json({message: "не авторизован"})
                }
            
            });
        }
       
    } catch (error) {
        console.log(error)
    }
}