const axios = require('axios');
const { addJettonPrices } = require('./db-script.js');
const { formatDedustJettons, formatMegatonJettons, formatStonfiJettons } = require('./formatters');
require('dotenv').config();

// Эндпоинты всех API 
let endpoints = [
    'https://api.dedust.io/v2/prices',
    'https://megaton.fi/api/token/infoList',
    'https://api.dedust.io/v2/pools',
    'https://api.ston.fi/export/cmc/v1'
];

function outlier(duplicates) {
    if (duplicates.length == 1) return duplicates[0];

    duplicates.sort((a, b) => a.jetton_price - b.jetton_price);
    const percent_diff = (duplicates[duplicates.length - 1].jetton_price / duplicates[0].jetton_price - 1);

    if (percent_diff < 0.15) {
        const mean_price = duplicates.reduce((sum, duplicate) => sum + duplicate.jetton_price, 0) / duplicates.length;

        return Object.freeze({
            base_address: duplicates[0].base_address,
            readable_base_address: duplicates[0].readable_base_address,
            quote_address: duplicates[0].quote_address,
            readable_quote_address: duplicates[0].readable_quote_address,
            jetton_price: mean_price
        });
    }

    return duplicates[0];
}

function joinData(megaton, dedust, stonfi) {
    let available_pairs = [];

    const all_data_together = stonfi.concat(dedust, megaton);

    let iteration = 0;

    // making an array of available jettons (without repeats)
    for (data of all_data_together) {
        // if jetton has no price - we remove it from list
        if (data.jetton_price === 0 || data.jetton_price === Infinity) {
            all_data_together.splice(iteration, 1);
            iteration++;

            continue;
        }

        const find_repeats = available_pairs.findIndex((item) => item.base == data.base_address && item.quote == data.quote_address);

        if (find_repeats == -1) {
            available_pairs.push({
                base: data.base_address,
                quote: data.quote_address
            });
        }

        iteration++;
    }

    result = [];

    for (pair of available_pairs) {
        const duplicates = [];

        for (data of all_data_together) {
            if (data.base_address == pair.base && data.quote_address == pair.quote) duplicates.push(data);
        }

        const the_only_one = outlier(duplicates);
        result.push(the_only_one);
    }
    return result;
}

// Make all of the requests to APIs
axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread(({ data: ton_price_req }, { data: megaton_jettons }, { data: dedust_jettons }, { data: stonfi_jettons }) => {

        // Get TON price in USD
        const ton_usd_price = ton_price_req.filter(prices => prices.symbol === 'TON')[0].price;

        // Get pretty data
        const formatted_megaton_jettons = formatMegatonJettons(megaton_jettons, ton_usd_price);
        const formatted_dedust_jettons = formatDedustJettons(dedust_jettons, ton_usd_price);
        const formatted_stonfi_jettons = formatStonfiJettons(stonfi_jettons, ton_usd_price);

        const result = joinData(formatted_megaton_jettons, formatted_dedust_jettons, formatted_stonfi_jettons);

        addJettonPrices(result, ton_usd_price); // push data to db
    })
);