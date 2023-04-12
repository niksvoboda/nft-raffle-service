const bcrypt   = require('bcrypt');
const db       = require("../components/db.js");
const Log      = require("../components/log.js");

class Users extends Log {

    name = "Users";
    saltRounds = 10;
    /** Для авторизации */
    async getUserByLoginWithRole(login) {
        this.d(".getUserByLoginWithRole login:" + login);
        const res = await db.asyncQuery("SELECT *, `tbl_users_roles`.permissions AS permissions FROM `tbl_users`  INNER JOIN `tbl_users_roles` ON tbl_users_roles.role_id = tbl_users.role_id WHERE login=(?)", [ login ]);
        return res ? res : null;
    }
    /**
     * Проверка переденного пороля и хеша пароля из БД
     * @param string password       Проверяемый пароль
     * @param string passwordHash   Хэш пароля
     * @returns boolean             Соответствует ли пароль хешу
     */
    async checkPassword(password, passwordHash) {
        this.d(".checkPassword");
        return await bcrypt.compare(password, passwordHash);
    }

    /**Пользовательская часть */
     async getEntrys(search) {
        search = '%' + search + '%';
        this.d(".getEntrys");
        let result = await db.asyncQuery(`SELECT * FROM tbl_users 
        WHERE username LIKE (?)
        OR login LIKE (?)`, [search, search, search], 1);
        return result;
    }
    /** Для формы редактирования */
    async getEntry(id) {
        this.d(".getEntry");
        let result = await db.asyncQuery("SELECT * FROM tbl_users WHERE user_id = (?)", [id]);
        return result;
    }

    async getEntryStatus(request_status) {
        //this.d(".getEntry");
        let result = await db.asyncQuery("SELECT COUNT(*) AS count FROM tbl_requests WHERE request_status = (?)", [request_status]);
        return result;
    }

    async addEntry(
        username,
        birth_date,
        phone_mob,
        login,
        passwd,
        email,
        balance,
        deposit_net,
        deposit_wallet,
        withdraw_net,
        withdraw_wallet,
        rem,
        enabled ) {
        this.d(".addEntrys");
        let result = await db.asyncQuery(`INSERT INTO tbl_users 
        (   username,
            role_id,
            birth_date,
            phone_mob,
            login,
            passwd,
            email,
            balance,
            deposit_net,
            deposit_wallet,
            withdraw_net,
            withdraw_wallet,
            rem,
            enabled) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
         [  username,
            2, // автоматически присваем роль юзер
            birth_date,
            phone_mob,
            login,
            passwd,
            email,
            balance,
            deposit_net,
            deposit_wallet,
            withdraw_net,
            withdraw_wallet,
            rem,
            enabled]);
        return result;
    }
    async updateEntry(
        username,
        birth_date,
        phone_mob,
        login,
        email,
        balance,
        deposit_net,
        deposit_wallet,
        withdraw_net,
        withdraw_wallet,
        rem,
        enabled,
        user_id) {
        this.d(".updateEntrys");
        let result = await db.asyncQuery(`UPDATE tbl_users SET
            username = (?),
            birth_date = (?),
            phone_mob = (?),
            login = (?),
            email = (?),
            balance = (?),
            deposit_net = (?),
            deposit_wallet = (?),
            withdraw_net = (?),
            withdraw_wallet = (?),
            rem = (?),
            enabled = (?)
            WHERE user_id = (?)`, [
            username,
            birth_date,
            phone_mob,
            login,
            email,
            balance,
            deposit_net,
            deposit_wallet,
            withdraw_net,
            withdraw_wallet,
            rem,
            enabled,
            user_id]);
        return result;
    }
    async deleteEntry(id) {
        this.d(".deleteEntrys");
        let result = await db.asyncQuery("DELETE FROM tbl_users WHERE user_id = (?)", [id]);
        return result;
    }
    createPasswordHash(passwd) {
        this.d(".createPasswordHash");
        const salt = bcrypt.genSaltSync(this.saltRounds);
        return bcrypt.hashSync(passwd, salt);
    }
    async updateEntryPasswd(
        passwd,
        user_id) {
        this.d(".updateEntryPasswd");
        let result = await db.asyncQuery(`UPDATE tbl_users SET
        passwd = (?)
        WHERE user_id = (?)`, [
        passwd,
        user_id]);
        return result;
    }


    async getBalance(id) {
        this.d(".getBalance");
        let result = await db.asyncQuery("SELECT tbl_users.balance FROM tbl_users WHERE user_id = (?)", [id]);
        console.log(result)
        return result;
    }
    async updateBalance(id, balance) {
        this.d(".getBalance");
        let result = await db.asyncQuery(`UPDATE tbl_users SET 
        balance  = (?) 
        WHERE user_id = (?)`, [balance, id]);
        return result;
    }

    async updateWithdraw(id, net, wallet) {
        this.d(".getBalance");
        let result = await db.asyncQuery(`UPDATE tbl_users SET 
        withdraw_net  = (?) ,
        withdraw_wallet = (?) 
        WHERE user_id = (?)`, [net, wallet, id]);
        return result;
    }

    async updateDeposit(id, net, wallet) {
        this.d(".getBalance");
        let result = await db.asyncQuery(`UPDATE tbl_users SET 
        deposit_net  = (?) ,
        deposit_wallet = (?) 
        WHERE user_id = (?)`, [net, wallet, id]);
        return result;
    }

}

module.exports = new Users();