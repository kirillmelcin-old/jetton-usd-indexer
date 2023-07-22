const { addressToBuffer } = require('../utils.js');

// Get pretty data from DeDust.io
function formatDedustJettons(jettons, ton_usd_price) {

  const formatted_data = [];

  for (jetton of jettons) {
    if (jetton.lastPrice != null) {
      const price = 1 / Number(jetton.lastPrice);
      const usd_price = price * ton_usd_price;

      const temp = {
        source: 'Dedust',
        base_address: addressToBuffer(jetton.assets[1].address).toString('binary'),
        readable_base_address: jetton.assets[1].address,
        quote_address: addressToBuffer(jetton.assets[0].address || 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c').toString('binary'),
        readable_quote_address: jetton.assets[0].address || 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
        usd_price: usd_price,
        jetton_price: price,
      };

      formatted_data.push(temp);
    }
  }

  return formatted_data;
}

module.exports = { formatDedustJettons };