const sqlite = require('sqlite-sync');
sqlite.connect('.bank.sqlite.db');

sqlite.run(`
    CREATE TABLE account (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        number  TEXT    NOT NULL UNIQUE,
        client  TEXT    NOT NULL,
        balance INTEGER NOT NULL,
        active  INTEGER NOT NULL,
        type    TEXT    NOT NULL
    )
`);

sqlite.run(`
    CREATE TABLE transfer (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id   INTEGER,
        receiver_id INTEGER,
        sum         INTEGER NOT NULL,
        date        INTEGER NOT NULL,
        FOREIGN KEY (sender_id)   REFERENCES account(id),
        FOREIGN KEY (receiver_id) REFERENCES account(id)
    )
`);

sqlite.run(`
    INSERT INTO account
    (number  , client, balance, active, type   ) VALUES
    ('AA-000', 'Bank', 0      , 1     , 'legal')
`);

sqlite.close();

console.log('database was created');
