const Account = require('../domain/account.js');
const Transfer = require('../domain/transfer.js');

const bankAccountNumber = 'AA-000';

// Service
module.exports = class {
    #accoutRepository;
    #transferRepository;
    #dateBuilder;

    set accountRepository(accountRepository) {
        this.#accoutRepository = accountRepository;
    }

    set transferRepository(transferRepository) {
        this.#transferRepository = transferRepository;
    }

    set dateBuilder(dateBuilder) {
        this.#dateBuilder = dateBuilder;
    }

    /*
     * Делает перевод со счёта с номером senderAccountNumber на счёт с номером
     * receiverAccountNumber на сумму sum.
     * В случае успеха возвращает соответствующий объект класса Transfer (или
     * массив объектов класса Transfer, если выполнялось списание комиссии в
     * пользу банка).
     * В случае ошибки генерирует исключительную ситуацию: объект в поле error
     * которого содержится описание ошибки
     */
    transfer(senderAccountNumber, receiverAccountNumber, sum) {
        let sender = this.#accoutRepository.readByNumber(senderAccountNumber);
        if(!sender)          throw { error: 'sender is not exists' };
        if(!sender.active)   throw { error: 'sender is not active' };
        let receiver = this.#accoutRepository.readByNumber(receiverAccountNumber);
        if(!receiver)        throw { error: 'receiver is not exists' };
        if(!receiver.active) throw { error: 'receiver is not active' };
        let commission;
        switch(sender.type) {
            case 'indiv':
                switch(receiver.type) {
                    case 'indiv':
                        commission = Math.ceil(sum * 0.02);
                        break;
                    case 'legal':
                        commission = 0;
                        break;
                }
                break;
            case 'legal':
                switch(receiver.type) {
                    case 'indiv':
                        if(sum > 5000) throw { error: 'limit is exceeded' };
                        commission = 0;
                        break;
                    case 'legal':
                        if(sum < 1000) {
                            commission = Math.ceil(sum * 0.05);
                        } else if(sum < 5000) {
                            commission = Math.ceil(sum * 0.04);
                        } else {
                            commission = Math.ceil(sum * 0.03);
                        }
                        break;
                }
                break;
        }
        if(sender.balance < sum + commission) throw { error: 'not enough funds' };
        let date = this.#dateBuilder();
        sender.balance -= sum + commission;
        this.#accoutRepository.update(sender);
        receiver.balance += sum;
        this.#accoutRepository.update(receiver);
        let transfer = new Transfer();
        transfer.sender = sender;
        transfer.receiver = receiver;
        transfer.sum = sum;
        transfer.date = date;
        this.#transferRepository.create(transfer);
        if(commission > 0) {
            let bank = this.#accoutRepository.readByNumber(bankAccountNumber);
            bank.balance += commission;
            this.#accoutRepository.update(bank);
            let commissionTransfer = new Transfer();
            commissionTransfer.sender = sender;
            commissionTransfer.receiver = bank;
            commissionTransfer.sum = commission;
            commissionTransfer.date = date;
            this.#transferRepository.create(commissionTransfer);
            return [transfer, commissionTransfer];
        } else {
            return transfer;
        }
    }

    deposit(accountNumber, sum) {
        let account = this.#accoutRepository.readByNumber(accountNumber);
        if(!account)        throw { error: 'account is not exists' };
        if(!account.active) throw { error: 'account is not active' };
        let date = this.#dateBuilder();
        account.balance += sum;
        this.#accoutRepository.update(account);
        let transfer = new Transfer();
        transfer.sender = null;
        transfer.receiver = account;
        transfer.sum = sum;
        transfer.date = date;
        this.#transferRepository.create(transfer);
    }

    withdraw(accountNumber, sum) {
        let account = this.#accoutRepository.readByNumber(accountNumber);
        if(!account)        throw { error: 'account is not exists' };
        if(!account.active) throw { error: 'account is not active' };
        if(account.balance < sum) throw { error: 'not enough funds' };
        let date = this.#dateBuilder();
        account.balance -= sum;
        this.#accoutRepository.update(account);
        let transfer = new Transfer();
        transfer.sender = account;
        transfer.receiver = null;
        transfer.sum = sum;
        transfer.date = date;
        this.#transferRepository.create(transfer);
    }

    list() {
        return this.#accoutRepository.readAll();
    }

    details(number) {
        let account = this.#accoutRepository.readByNumber(number);
        if(account) {
            const cache = {
                map: new Map(),
                get: id => {
                    let obj = cache.map.get(id);
                    if(!obj) {
                        obj = this.#accoutRepository.readById(id);
                        cache.map.set(id, obj);
                    }
                    return obj;
                }
            };
            cache.map.set(account.id, account);
            account.transfers = this.#transferRepository.readByAccount(account.id);
            account.transfers.forEach(transfer => {
                if(transfer.sender) {
                    transfer.sender = cache.get(transfer.sender.id);
                }
                if(transfer.receiver) {
                    transfer.receiver = cache.get(transfer.receiver.id);
                }
            });
        }
        return account;
    }

    open(account) {
        this.#accoutRepository.create(account);
    }

    close(number) {
        if(number === bankAccountNumber) throw { error: 'bank account can\'t be deleted' };
        let account = this.#accoutRepository.readByNumber(number);
        if(!account)            throw { error: 'account is not exists' };
        if(!account.active)     throw { error: 'account is not active' };
        if(account.balance > 0) throw { error: 'account has a non-zero balance' };
        let transfers = this.#transferRepository.readByAccount(account.id);
        if(transfers.length == 0) {
            this.#accoutRepository.delete(account.id);
        } else {
            account.active = false;
            this.#accoutRepository.update(account);
        }
    }
};
