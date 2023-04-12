const Log  = require("../components/log.js"); 
const Users  = require("../models/_users"); 
const Transactions  = require("../models/_transactions.js")
    /**
     * Класс данных для страницы заказчиков
     */
class Api_Users extends Log {
    
    name = "Api_Users";

    async getEntrys(req, res) {
        self.d(".getEntrys");
        
        try {
        const {start, length, search} = req.query;
        const result = await Users.getEntrys(search);
          let response = {
            status: "OK",
            data: result.slice(Number(start), Number(start)+Number(length)),
            total_entrys: result?.length,            
            }
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }

    /** Для формы редактирования */
    async getEntry(req, res) {
        self.d(".getEntry");
    try {        
        const {id} = req.query
        let result = await Users.getEntry(id);    
        const response = {
            status: "OK",
            data: result,
        };
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async addEntry(req, res) {
        self.d(".addEntry");
    try {
        const {data} = req.body.params;

         /** если пароль в форме указан то апдейтим */
        let passwd_hashed = null
        if(data.passwd){
        passwd_hashed =  Users.createPasswordHash(data.passwd);       
        }     

        let result = await Users.addEntry(
            data.username,
            data.birth_date,
            data.phone_mob,
            data.login,
            passwd_hashed,
            data.email,
            data.balance,
            data.deposit_net,
            data.deposit_wallet,
            data.withdraw_net,
            data.withdraw_wallet,
            data.rem,
            data.enabled );
        let response =  {
            status: "OK",
            message: "Успешно",
            result
        }
        if (result?.errno > 0 ) {
            response = {
                status: "ERROR",
                message: String(result)
            }}     
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async updateEntry(req, res) {
        self.d(".updateEntry");
    try {
        const {data ,id} = req.body.params
        let result = await Users.updateEntry(
            data.username,
            data.birth_date,
            data.phone_mob,
            data.login,
            data.email,
            data.balance,
            data.deposit_net,
            data.deposit_wallet,
            data.withdraw_net,
            data.withdraw_wallet,
            data.rem,
            data.enabled,
            id );
        let response =  {
            status: "OK",
            message: "Успешно",
            result
        }
        if (result?.errno > 0 ) {
            response = {
                status: "ERROR",
                message: String(result),
                id
            }}
        /** если пароль в форме указан то апдейтим */
        if(data.passwd){
            let passwd_hashed =  Users.createPasswordHash(data.passwd);
            let update_passwd = await Users.updateEntryPasswd(passwd_hashed ,id);
        }     
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async deleteEntry(req, res) {
        self.d(".deleteEntry");
    try {
        const {id} = req.body.params
        let result = await Users.deleteEntry(id)
        let response = {
            status: 'OK',
            message: 'Пользователь удален',
            user_id: id
        }
        if (result?.errno > 0 ) {
            response = {
                status: "ERROR",
                message: String(result),
                user_id: id
            }
        }   
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }
    async addDeposit(req, res) {
        self.d(".addDeposit");
        try {
            const {id, data} = req.body.params
            console.log(id, data)
            let get_balance = await Users.getBalance(id)
            let result_balance = Number(get_balance.balance) + Number(data.value);
            result_balance = Number(result_balance.toFixed(2))
            console.log(result_balance)
            let result = await Users.updateBalance(id , result_balance)

            let transactions = await Transactions.addEntry(id,
                data.value,
                data.type_id)

            let response = {
                status: 'OK',
                message: `Баланс пополнен на ${data.value}`,
                user_id: id
            }
            if (result?.errno > 0 ) {
                response = {
                    status: "ERROR",
                    message: String(result),
                    user_id: id
                }
            }
            if (transactions?.errno > 0 ) {
                response = {
                    status: "ERROR",
                    message: String(transactions),
                    user_id: id
                }
            }      
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }
}

const self = new Api_Users();
module.exports = self;