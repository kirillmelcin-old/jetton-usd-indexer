const mysql = require('mysql2');
const dbConfig = require('./config/db.config.js');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    database: dbConfig.DB,
    password: dbConfig.PASSWORD
});

function addJettonPrices(jettons_list, timestamp, ton_usd_price) {
    for (j of jettons_list) {
        if (j.readable_quote_address == "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") {
            // Изменить названия столбцов и таблицы 
            connection.query(`UPDATE jettons_meta AS jm 
                              SET usd_price = ?
                              WHERE BINARY jm.jetton_address = ?`,
                [j.jetton_price * ton_usd_price, '0x' + j.base_address],
            );
        }
    }
    connection.end();
}

module.exports = {
    addJettonPrices
};