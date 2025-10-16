const Service = require('./service.js');
const AccountRepository = require('../repository/account-repository-db-impl.js');
const TransferRepository = require('../repository/transfer-repository-db-impl.js');

const dbName = '.bank.sqlite.db';

// ServiceFactory
module.exports = {
    newInstance: function() {
        let service = new Service();
        service.accountRepository = new AccountRepository(dbName);
        service.transferRepository = new TransferRepository(dbName);
        service.dateBuilder = () => new Date();
        return service;
    }
};
