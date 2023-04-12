const Log           = require("../components/log.js");
const Transactions  = require("../models/_transactions.js")

class Api_Transactions extends Log { 
    
    name = "Api_Transactions";

    async getEntrys(req, res) {
        /** Типы транзакций 
         * 1 - Пополнение пользователем (депозит)
         * 2 - Пополнение за счет прибыли (прибыль)
         * 3 - Запрос на вывод 
         * 4 - Подвержденный вывод  */
        self.d(".getEntrys");
        try {
            const {start, length, search, type} = req.query;
            console.log(start, length, search, type)
            let result;
            if (type?.length > 0) {                
                result = await Transactions.getEntrysByType(search, type);
            }else{
                result = await Transactions.getEntrys(search);
            }
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
        let result = await Transactions.getEntry(id);    
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

    async updateEntry(req, res) {
        self.d(".updateEntry");
    try {
        const {data ,id} = req.body.params
        let result = await Transactions.updateEntry(id,
            data.count,
            data.type_id);    
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
        console.log(id,           
            data.count,
            data.type_id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async addEntry(req, res) {
        self.d(".addEntry");
    try {
        const {data} = req.body.params
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
        let result = await Transactions.deleteEntry(id)
        let response = {
            status: 'OK',
            message: 'Транзакция удалена',
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

}

const self = new Api_Transactions();
module.exports = self;