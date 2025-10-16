const Transfer = require('../domain/transfer.js');

function next(objs) {
    let max = Math.max.apply(null, objs.map(obj => obj.id));
    return isFinite(max) ? max + 1 : 1;
}

// TransferRepositoryTestImpl
module.exports = class {
    transfers = [];

    create(transfer) {
        transfer.id = next(this.transfers);
        this.transfers.push(transfer);
    }
};
