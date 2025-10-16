const Account = require('../domain/account.js');

function build(id, number, client, balance, active, type) {
    let account = new Account();
    account.id = id;
    account.number = number;
    account.client = client;
    account.balance = balance;
    account.active = active;
    account.type = type;
    return account;
}

// AccountRepositoryTestImpl
module.exports = class {
    accounts = [
        build(1, 'AA-000', 'Банк'                     , 0    , true , 'legal'),
        build(2, 'AB-001', 'Иванов'                   , 2000 , true , 'indiv'),
        build(3, 'AB-002', 'Петров'                   , 3000 , true , 'indiv'),
        build(4, 'AB-003', 'Сидоров'                  , 0    , false, 'indiv'),
        build(5, 'AC-001', 'ООО "Рога и копыта"'      , 10000, true , 'legal'),
        build(6, 'AC-002', 'ООО "Карамазов и сыновья"', 5000 , true , 'legal'),
        build(7, 'AC-003', 'ИП "Безенчук и Co"'       , 0    , false, 'legal')
    ];

    readByNumber(number) {
        return this.accounts.find(account => account.number === number);
    }

    update(account) {
        let index = this.accounts.findIndex(a => a.id === account.id);
        this.accounts[index] = account;
    }
};
