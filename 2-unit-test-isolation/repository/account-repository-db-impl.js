const sqlite = require('sqlite-sync');

const Account = require('../domain/account.js');

// AccountRepositoryDbImpl
module.exports = class {
    #dbName;

    constructor(dbName) {
        this.#dbName = dbName;
    }

    readAll() {
        let accounts = [];
        sqlite.connect(this.#dbName);
        sqlite.run(`SELECT id, number, client, balance, active, type FROM account WHERE active = 1`, result => {
            if(result.error) throw result.error;
            result.forEach(element => {
                let account = new Account();
                Object.assign(account, element);
                accounts.push(account);
            });
        });
        sqlite.close();
        return accounts;
    }

    readById(id) {
        let account = null;
        sqlite.connect(this.#dbName);
        sqlite.run(`SELECT id, number, client, balance, active, type FROM account WHERE id = $id`, { $id: id }, result => {
            if(result.error) throw result.error;
            if(result.length === 1) {
                account = new Account();
                Object.assign(account, result[0]);
            }
        });
        sqlite.close();
        return account;
    }

    readByNumber(number) {
        let account = null;
        sqlite.connect(this.#dbName);
        sqlite.run(`SELECT id, number, client, balance, active, type FROM account WHERE number = $number`, { $number: number }, result => {
            if(result.error) throw result.error;
            if(result.length === 1) {
                account = new Account();
                Object.assign(account, result[0]);
            }
        });
        sqlite.close();
        return account;
    }

    create(account) {
        sqlite.connect(this.#dbName);
        sqlite.run(`INSERT INTO account (number, client, balance, active, type) VALUES ($number, $client, $balance, $active, $type)`, {
            $number: account.number,
            $client: account.client,
            $balance: 0,
            $active: 1,
            $type: account.type
        }, result => { if(result.error) throw result.error; });
        sqlite.close();
    }

    update(account) {
        sqlite.connect(this.#dbName);
        sqlite.run(`UPDATE account SET number = $number, client = $client, balance = $balance, active = $active, type = $type WHERE id = $id`, {
            $id: account.id,
            $number: account.number,
            $client: account.client,
            $balance: account.balance,
            $active: account.active,
            $type: account.type
        }, result => { if(result.error) throw result.error; });
        sqlite.close();
    }

    delete(id) {
        sqlite.connect(this.#dbName);
        sqlite.run(`DELETE FROM account WHERE id = $id`, { $id: id }, result => { if(result.error) throw result.error; });
        sqlite.close();
    }
};
