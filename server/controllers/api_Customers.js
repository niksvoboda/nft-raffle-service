const Log           = require("../components/log.js");
const Users         = require("../models/_users"); 
const Transactions  = require("../models/_transactions.js")
    /**
     * Класс данных для страницы заказчиков
     */
class Api_Customers extends Log {
    
    name = "Api_Customers";

    /** Для формы редактирования */
    async getAccount(req, res) {
        self.d(".getAccount");
    try {
       const {startDate, endDate} = req.query 
       const {id} = req.user_data
       let result = await Users.getEntry(id);    
       let transactions = await Transactions.getEntrysByIdAndTypeAndDate(id, 2, startDate, endDate);  
       const response = {
           status: "OK",
           data: result,
           transactions
       };
       console.log(id, 2, startDate, endDate)
       return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async balanceWidget(req, res) {
        self.d(".balanceWidget");
    try {
       const {id} = req.user_data
       let result = await Users.getEntry(id);    
       let transactions = await Transactions.getEntrysByIdAndType(id, 2);
       let deposits = await Transactions.getEntrysByIdAndType(id, 1);  
       const response = {
           status: "OK",
           balance: result.balance,
           transactions,
           deposits
       };
       console.log(id, 2)
       return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    

    async getDeposit(req, res) {
        self.d(".getDeposit");
    try {
        console.log(req.user_data.id)
       // const {id} = req.query

       const {id} = req.user_data
       let result = await Users.getEntry(id);
       let transactions = await Transactions.getEntrysByIdAndType(id, 1);    
       const response = {
           status: "OK",
           data: result,           
           deposit_net: result.deposit_net,
           deposit_wallet: result.deposit_wallet	,	
           transactions
       };
       return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }
    /**
     *  1 Пополнение пользователем
     *  2 Начисление прибыли
     *  3 Запрос на вывод
     *  4 Подтвержденный вывод
        */

    async getWithdraw(req, res) {
        self.d(".getWithdraw");
    try {
        console.log(req.user_data.id)
       const {id} = req.user_data
       let result = await Users.getEntry(id);
       let withdraws = await Transactions.getEntrysByIdAndType(id, 4);  
       let pendings   = await Transactions.getEntrysByIdAndType(id, 3);
       const response = {
           status: "OK",
           withdraw_net: result.withdraw_net,
           withdraw_wallet: result.withdraw_wallet	,	
           withdraws,
           pendings
       };
       return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async saveWithdraw(req, res) {
        self.d(".saveWithdraw");
    try {
        const {net, wallet} = req.body.params
        console.log(net, wallet)
        const {id} = req.user_data
        let result = await Users.updateWithdraw(id, net, wallet);
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
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }
    

    async requestWithrdaw(req, res) {
        self.d(".requestWithrdaw");
    try {
        const {value} = req.body.params
        console.log(value)
        const {id} = req.user_data        
        let result   = await Transactions.addEntry(id, Number(value), 3);
        let response =  {
            status: "OK",
            message: "Успешно",
        }
        if (result?.errno > 0 ) {
            response = {
                status: "ERROR",
                message: String(result),
                id
            }}
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }
    

    async cancelWithrdaw(req, res) {
        self.d(".cancelWithrdaw");
    try {
        const {trans_id} = req.body.params
        console.log(trans_id)
        const {id} = req.user_data
        
        let result   = await Transactions.deleteEntryByUserID(id, trans_id);
        let response =  {
            status: "OK",
            message: "Заявка отменена",
        }
        if (result?.errno > 0 ) {
            response = {
                status: "ERROR",
                message: String(result),
                id
            }}
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }

    async saveDeposit(req, res) {
        self.d(".saveDeposit");
    try {
        const {net, wallet} = req.body.params
        console.log(net, wallet)
        const {id} = req.user_data
        let result = await Users.updateDeposit(id, net, wallet);
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
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
    }
  
    async getEntry(req, res) {
            self.d(".getEntry");
        try {
            const {id} = req.query
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }

    async getEntrys(req, res) {
        self.d(".getEntrys");
        try {
          let response = {
            status: "OK"
            }
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

    async updateEntry(req, res) {
        self.d(".updateEntry");
    try {
        const {data ,id} = req.body.params
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

}

const self = new Api_Customers();
module.exports = self;