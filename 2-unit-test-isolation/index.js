const input = require('readline-sync');
const Account = require('./domain/account.js');
const ServiceFactory = require('./service/service-factory.js');
const service = ServiceFactory.newInstance();

const menu = [{
    name: 'Transfer money',
    exec: function() {
        let senderNumber   = input.question   ('enter sender account number..... > ');
        let receiverNumber = input.question   ('enter receiver account number... > ');
        let sum            = input.questionInt('enter sum....................... > ');
        if(sum > 0) {
            try {
                service.transfer(senderNumber, receiverNumber, sum);
                console.log('transaction complete');
            } catch(e) {
                console.log(e.error);
            }
        } else {
            console.log('incorrect sum');
        }
        return true;
    }
}, {
    name: 'Deposit cash',
    exec: function() {
        let accountNumber = input.question   ('enter account number... > ');
        let sum           = input.questionInt('enter sum.............. > ');
        if(sum > 0) {
            try {
                service.deposit(accountNumber, sum);
                console.log('transaction complete');
            } catch(e) {
                console.log(e.error);
            }
        } else {
            console.log('incorrect sum');
        }
        return true;
    }
}, {
    name: 'Withdraw cash',
    exec: function() {
        let accountNumber = input.question   ('enter account number... > ');
        let sum           = input.questionInt('enter sum.............. > ');
        if(sum > 0) {
            try {
                service.withdraw(accountNumber, sum);
                console.log('transaction complete');
            } catch(e) {
                console.log(e.error);
            }
        } else {
            console.log('incorrect sum');
        }
        return true;
    }
}, {
    name: 'View list of accounts',
    exec: function() {
        let accounts = service.list();
        accounts.forEach(account => {
            console.log(`${account.number} (${account.type}: ${account.client}), balance: $${account.balance}`);
        });
        console.log(`total: ${accounts.length} accounts`);
        return true;
    }
}, {
    name: 'View details of account',
    exec: function() {
        let number = input.question('enter account number > ');
        let account = service.details(number);
        if(account) {
            console.log(`number     : ${account.number}`);
            console.log(`client     : ${account.client}`);
            console.log(`type       : ${account.type}`);
            console.log(`balance ($): ${account.balance}`);
            console.log(`status     : ${account.active ? 'opened' : 'closed'}`);
            console.log(`transfers:`);
            if(account.transfers.length > 0) {
                account.transfers.forEach(transfer => {
                    let year = transfer.date.getFullYear();
                    let month = transfer.date.getMonth() + 1;
                    let day = transfer.date.getDate();
                    let date = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    let hours = transfer.date.getHours();
                    let minutes = transfer.date.getMinutes();
                    let seconds = transfer.date.getSeconds();
                    let time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    console.log(`${date}, ${time} ${transfer.sender ? transfer.sender.number : '<CASH>'} --> ${transfer.receiver ? transfer.receiver.number : '<CASH>'} : ${transfer.sum}`);
                });
                console.log(`total ${account.transfers.length} transactions`);
            } else {
                console.log('there are no transactions yet');
            }
        } else {
            console.log('nothing found');
        }
        return true;
    }
}, {
    name: 'Open account',
    exec: function() {
        let account = new Account();
        account.number = input.question('enter account number.................. > ');
        account.client = input.question('enter client name..................... > ');
        account.type   = input.question('enter account type (indiv or legal)... > ');
        if(account.type === 'indiv' || account.type === 'legal') {
            service.open(account);
            console.log('account opened');
        } else {
            console.log('incorrect account type');
        }
        return true;
    }
}, {
    name: 'Close account',
    exec: function() {
        let number = input.question('enter account number > ');
        try {
            service.close(number);
            console.log('transaction complete');
        } catch(e) {
            console.log(e.error);
        }
        return true;
    }
}, {
    name: 'Exit',
    exec: function() {
        return input.question('Do you want to exit? (y/n) > ') !== 'y';
    }
}];

let work = true;
while(work) {
    console.log('MENU:');
    menu.forEach((item, index) => console.log(`${index + 1}) ${item.name}`));
    let index = input.questionInt('enter menu item > ');
    let item = menu[index - 1];
    if(item) {
        work = item.exec();
    } else {
        console.log('Incorrect menu item');
    }
}
