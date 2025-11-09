const assert = require('assert');
const { test, suite } = require('mocha');

suite('nrb API test', async function() {
    test('test 1', async function() {
        const params = new URLSearchParams();
        params.append('periodicity', '1');
        params.append('ondate', '2025-01-01T00:00:00');
        const responce = await fetch(`https://api.nbrb.by/exrates/rates/465?${params}`);
        const result = await responce.json();
        assert.deepEqual(result, {
            "Cur_ID": 465,
            "Date": "2025-01-01T00:00:00",
            "Cur_Abbreviation": "DZD",
            "Cur_Scale": 100,
            "Cur_Name": "Алжирских динаров",
            "Cur_OfficialRate": 2.6774
        });
    });
});
