const assert = require('assert');
const { test, suite } = require('mocha');

const Service = require('../service/service.js');
const AccountRepository = require('../repository/account-repository-test-impl.js');
const TransferRepository = require('../repository/transfer-repository-test-impl.js');

suite('transfer service test', function() {
    let service;
    let accountRepository;
    let transferRepository;
    const dateBuilder = () => new Date(2025, 8, 15, 12, 34, 45, 567);

    beforeEach(function() {
        service = new Service();
        accountRepository = new AccountRepository();
        transferRepository = new TransferRepository();
        service.accountRepository = accountRepository;
        service.transferRepository = transferRepository;
        service.dateBuilder = dateBuilder;
    });

    test('from individual to legal transfer (with no commission): successed transfer', function() {
        let transfer = service.transfer('AB-001', 'AC-001', 500);
        let sender = accountRepository.readByNumber('AB-001');
        assert.equal(sender.balance, 1500);
        let receiver = accountRepository.readByNumber('AC-001');
        assert.equal(receiver.balance, 10500);
        assert.deepEqual(transfer, {
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 500,
            date: dateBuilder()
        });
    });

    test('from individual to legal transfer (with no commission): unexisting sender', function() {
        assert.throws(() => {
            service.transfer('AB-010', 'AC-001', 500);
        }, {
            error: 'sender is not exists'
        });
    });

    test('from individual to legal transfer (with no commission): unexisting receiver', function() {
        assert.throws(() => {
            service.transfer('AB-001', 'AC-010', 500);
        }, {
            error: 'receiver is not exists'
        });
    });

    test('from individual to legal transfer (with no commission): inactive sender', function() {
        assert.throws(() => {
            service.transfer('AB-003', 'AC-001', 500);
        }, {
            error: 'sender is not active'
        });
    });

    test('from individual to legal transfer (with no commission): inactive receiver', function() {
        assert.throws(() => {
            service.transfer('AB-001', 'AC-003', 500);
        }, {
            error: 'receiver is not active'
        });
    });

    test('from individual to legal transfer (with no commission): not enough funds', function() {
        assert.throws(() => {
            service.transfer('AB-001', 'AC-001', 5000);
        }, {
            error: 'not enough funds'
        });
    });

    test('from individual to individual transfer (commission 2%): successed transfer', function() {
        let transfers = service.transfer('AB-001', 'AB-002', 500);
        let sender = accountRepository.readByNumber('AB-001');
        assert.equal(sender.balance, 1490);
        let receiver = accountRepository.readByNumber('AB-002');
        assert.equal(receiver.balance, 3500);
        let bank = accountRepository.readByNumber('AA-000');
        assert.equal(bank.balance, 10);
        assert.deepEqual(transfers, [{
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 500,
            date: dateBuilder()
        }, {
            id: 2,
            sender: sender,
            receiver: bank,
            sum: 10,
            date: dateBuilder()
        }]);
    });

    test('from individual to individual transfer (commission 2%): not enough funds', function() {
        assert.throws(() => {
            service.transfer('AB-001', 'AB-002', 1980);
        }, {
            error: 'not enough funds'
        });
    });

    test('from legal to individual transfer (limit 5000): successed transfer', function() {
        let transfers = service.transfer('AC-001', 'AB-001', 3000);
        let sender = accountRepository.readByNumber('AC-001');
        assert.equal(sender.balance, 7000);
        let receiver = accountRepository.readByNumber('AB-001');
        assert.equal(receiver.balance, 5000);
        assert.deepEqual(transfers, {
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 3000,
            date: dateBuilder()
        });
    });

    test('from legal to individual transfer (limit 5000): limit is exceeded', function() {
        assert.throws(() => {
            service.transfer('AC-001', 'AB-001', 6000);
        }, {
            error: 'limit is exceeded'
        });
    });

    test('from legal to legal transfer (commission 5% up to 1000): successed transfer', function() {
        let transfers = service.transfer('AC-001', 'AC-002', 500);
        let sender = accountRepository.readByNumber('AC-001');
        assert.equal(sender.balance, 9475);
        let receiver = accountRepository.readByNumber('AC-002');
        assert.equal(receiver.balance, 5500);
        let bank = accountRepository.readByNumber('AA-000');
        assert.equal(bank.balance, 25);
        assert.deepEqual(transfers, [{
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 500,
            date: dateBuilder()
        }, {
            id: 2,
            sender: sender,
            receiver: bank,
            sum: 25,
            date: dateBuilder()
        }]);
    });

    test('from legal to legal transfer (commission 4% from 1000 up to 5000): successed transfer', function() {
        let transfers = service.transfer('AC-001', 'AC-002', 1000);
        let sender = accountRepository.readByNumber('AC-001');
        assert.equal(sender.balance, 8960);
        let receiver = accountRepository.readByNumber('AC-002');
        assert.equal(receiver.balance, 6000);
        let bank = accountRepository.readByNumber('AA-000');
        assert.equal(bank.balance, 40);
        assert.deepEqual(transfers, [{
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 1000,
            date: dateBuilder()
        }, {
            id: 2,
            sender: sender,
            receiver: bank,
            sum: 40,
            date: dateBuilder()
        }]);
    });

    test('from legal to legal transfer (commission 3% from 5000): successed transfer', function() {
        let transfers = service.transfer('AC-001', 'AC-002', 5000);
        let sender = accountRepository.readByNumber('AC-001');
        assert.equal(sender.balance, 4850);
        let receiver = accountRepository.readByNumber('AC-002');
        assert.equal(receiver.balance, 10000);
        let bank = accountRepository.readByNumber('AA-000');
        assert.equal(bank.balance, 150);
        assert.deepEqual(transfers, [{
            id: 1,
            sender: sender,
            receiver: receiver,
            sum: 5000,
            date: dateBuilder()
        }, {
            id: 2,
            sender: sender,
            receiver: bank,
            sum: 150,
            date: dateBuilder()
        }]);
    });
});
