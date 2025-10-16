const sqlite = require('sqlite-sync');

const Account = require('../domain/account.js');
const Transfer = require('../domain/transfer.js');

// TransferRepositoryDbImpl
module.exports = class {
    #dbName;

    constructor(dbName) {
        this.#dbName = dbName;
    }

    readByAccount(id) {
        let transfers = [];
        sqlite.connect(this.#dbName);
        sqlite.run(`SELECT id, sender_id, receiver_id, sum, date FROM transfer WHERE sender_id = $sender_id OR receiver_id = $receiver_id`, {
            $sender_id: id,
            $receiver_id: id
        }, result => {
            if(result.error) throw result.error;
            result.forEach(element => {
                let transfer = new Transfer();
                transfer.id = element.id;
                if(element.sender_id) {
                    transfer.sender = new Account();
                    transfer.sender.id = element.sender_id;
                }
                if(element.receiver_id) {
                    transfer.receiver = new Account();
                    transfer.receiver.id = element.receiver_id;
                }
                transfer.sum = element.sum;
                transfer.date = new Date(element.date);
                transfers.push(transfer);
            });
        });
        sqlite.close();
        return transfers;
    }

    create(transfer) {
        sqlite.connect(this.#dbName);
        sqlite.run(`INSERT INTO transfer (sender_id, receiver_id, sum, date) VALUES ($sender_id, $receiver_id, $sum, $date)`, {
            $sender_id: transfer.sender ? transfer.sender.id : null,
            $receiver_id: transfer.receiver ? transfer.receiver.id : null,
            $sum: transfer.sum,
            $date: transfer.date.getTime()
        }, result => { if(result.error) throw result.error; });
        sqlite.close();
    }
};
