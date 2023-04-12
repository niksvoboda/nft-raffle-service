/**
 * Контроллер авторизации (логин, логаут, обновление токена)
 */
const config    = require("config");
const Users     = require("../models/_users.js");
const Log       = require("../components/log.js");
const jwt       = require('jsonwebtoken');

/**
 * @description Функция генерации jwt-токена
 * @param {*} - передаем в функцию генерации токена ID пользователя из базы (для использования его на фронтенде при необходимости)
 * @returns - возвращаем из функции сгенерированный jwt-токен с временем жизни 72 часа (задается в настройках)
 * 
 */

const expires_in = config.get("auth.accessTokenExpTime");
const secret_key = config.get("auth.secret_key")

const generateToken = (id, username, login, role, permissions) =>{
    const payload = {
        id,
        username,
        login,
        role,
        permissions
    }
    return jwt.sign(payload, secret_key, {expiresIn: expires_in})
}

class AuthController extends Log {
    name = "AuthController";
    /**
     * @description Функция авторизации
     * @param {*} req  - запрос методом POST передает логин и пароль
     * @param {*} res  - ответ либо соответсвующая ошибка, либо если логин и пароль верны - генерируем JWT-токен для проверки запросов пользователя.
     * @returns {*} - возвращаем описанные выше ответы
     */
    async login (req, res) {
        try{
            /** получаем логин и пароль */
            const {email, password} = req.body
            /** если пользователя с таким логином нет то возвращаем информацию об этом */
            //console.log(email, password)
            const user = await Users.getUserByLoginWithRole(email);
          //  console.log(user)
            if(!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            /** Проверяем логин, пароль и активен ли юзер если не правильный - сообщаем */
            
            const passwd_check = await Users.checkPassword(password, user?.passwd);
            if (user && user?.enabled && passwd_check)  {
                 /** Если пароль правильный - генерируем и возращаем JWT-токен */
                const token =  generateToken(user.user_id, user.username, user.login, user.role_id, user.permissions)
                /** Логируем */
                const user_data = {
                    id: user.user_id, 
                    username: user.username, 
                    login: user.login,
                }
                const details = {"status":"OK","user_id": user.user_id ,"login": user.login}
             //   Syslog.addAction(user_data, "login", details)
                console.log(token)
                return res.status(200).json(token)
            } else {
                return res.status(400).json({message: 'Неправильный пароль или пользователь неактивен'})
            } 
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка авторизации: '+ e})
        } 
    }

    async check(req, res, next){
        try{
            const token = generateToken(user._id, user._roles)
            return res.json({token})
        }
        catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка проверки: '+ e})
        }
    }
    
    async logout(req, res, next){
        self.d(".logout");
        const {id, username, login} = req.body
             /** Логируем */
          //   console.log(req.user_data)
             const user_data = {
                id: id, 
                username: username, 
                login:login,
            }
             const details = {"status":"OK","user_id": id ,"login": login}
          //   Syslog.addAction(user_data, "logout", details)
             res.status(200).json({message: 'logout'})        
    }  
}

const self = new AuthController();
module.exports = self;