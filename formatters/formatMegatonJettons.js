const { addressToBuffer } = require('../utils.js');

// Get pretty data from Megaton.fi
function formatMegatonJettons(jettons, ton_usd_price) {

  const formatted_data = [];

  for (jetton of jettons) {
    const temp = {
      source: 'Megaton',
      base_address: addressToBuffer(jetton["address"]).toString('binary'),
      readable_base_address: jetton["address"],
      quote_address: addressToBuffer('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c').toString('binary'),
      readable_quote_address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
      symbol: jetton["symbol"] + "/TON",
      usd_price: jetton["price"],
      jetton_price: jetton["price"] / ton_usd_price,
    };
    formatted_data.push(temp);
  }

  return formatted_data;
}

module.exports = { formatMegatonJettons };
