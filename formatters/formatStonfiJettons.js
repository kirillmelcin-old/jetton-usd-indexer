const { addressToBuffer } = require('../utils.js');

// Get pretty data from ston.fi
function formatStonfiJettons(jettons, ton_usd_price) {

  const formatted_data = [];

  for (jetton in jettons) {
    const single_jetton_data = jettons[jetton];
    const price = Number(single_jetton_data.last_price);
    const usd_price = price * ton_usd_price;

    const temp = {
      source: 'Ston.fi',
      base_address: addressToBuffer(single_jetton_data.base_id).toString('binary'),
      readable_base_address: single_jetton_data.base_id,
      quote_address: addressToBuffer(single_jetton_data.quote_id).toString('binary'),
      readable_quote_address: single_jetton_data.quote_id,
      usd_price: usd_price,
      jetton_price: price,
    };

    formatted_data.push(temp);
  }

  return formatted_data;
}

module.exports = { formatStonfiJettons };