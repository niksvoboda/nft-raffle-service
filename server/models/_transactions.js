const db       = require("../components/db.js");
const Log      = require("../components/log.js");

class Transactions extends Log {

    name = "Transactions";

     async getEntrys(search) {
        search = '%' + search + '%';
        this.d(".getEntrys");
        let result = await db.asyncQuery(`SELECT *
        FROM ((tbl_transactions  
        INNER JOIN tbl_type_transactions ON tbl_type_transactions.type_id = tbl_transactions.type_id)
        INNER JOIN tbl_users ON tbl_transactions.user_id = tbl_users.user_id)
        WHERE count LIKE (?) OR title LIKE(?) OR username LIKE(?) `, [search, search, search], 1);
        return result;
    }

    async getEntrysByType(search, type) {
        search = '%' + search + '%';
        console.log(search, type)
        this.d(".getEntrysByType");
        let result = await db.asyncQuery(`SELECT *
        FROM ((tbl_transactions  
        INNER JOIN tbl_type_transactions ON tbl_type_transactions.type_id = tbl_transactions.type_id)
        INNER JOIN tbl_users ON tbl_transactions.user_id = tbl_users.user_id)
        WHERE (count LIKE (?) OR title LIKE(?) OR username LIKE(?))
        AND tbl_transactions.type_id = (?)`, [search, search, search, type], 1);
        return result;
    }

    async getEntrysByIdAndType(id, type) {
        this.d(".getEntrysByID");
        let result = await db.asyncQuery(`SELECT *
        FROM tbl_transactions  
        WHERE user_id = (?)
        AND type_id = (?)`, [id, type], 1);
        return result;
    }

    async getEntrysByIdAndTypeAndDate(id, type, startDate, endDate) {
        this.d(".getEntrysByID");
        let result = await db.asyncQuery(`SELECT *
        FROM tbl_transactions  
        WHERE user_id = (?)
        AND type_id = (?) AND
        (created_dt 
        BETWEEN (?) AND (?))`, [id, type,startDate, endDate], 1);
        return result;
    }

    async getEntry(id) {
        this.d(".getEntry");
        let result = await db.asyncQuery("SELECT * FROM tbl_transactions WHERE trans_id = (?)", [id]);
        return result;
    }

    async addEntry(        
        user_id,
        count,
        type_id) {
        this.d(".addEntrys");
        let result = await db.asyncQuery(`INSERT INTO tbl_transactions 
        (   user_id,
            count,
            type_id) 
        VALUES (?,?,?)`,
         [  user_id,
            count,
            type_id]);
        return result;
    }
    async updateEntry(
        trans_id,
        count,
        type_id) {
        this.d(".updateEntrys");
        let result = await db.asyncQuery(`UPDATE tbl_transactions SET            
            count = (?),
            type_id = (?)
            WHERE trans_id = (?)`, [ 
                count,
                type_id,
                trans_id]);
        return result;
    }
    async deleteEntry(id) {
        this.d(".deleteEntrys");
        let result = await db.asyncQuery("DELETE FROM tbl_transactions WHERE trans_id = (?)", [id]);
        return result;
    }

    async deleteEntryByUserID(id, trans_id) {
        this.d(".deleteEntrys");
        let result = await db.asyncQuery(`DELETE FROM tbl_transactions 
        WHERE user_id = (?)
        AND  trans_id = (?)`, [id, trans_id]);
        return result;
    }

}

module.exports = new Transactions();