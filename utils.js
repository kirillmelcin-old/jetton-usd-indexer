const {utils} = require('tonweb')

/**
 * @param  {Buffer|String|Address} input
 * @return {Buffer}
 */
const addressToBuffer = function tonAddressTo33ByteBuffer(input) {
    if (Buffer.isBuffer(input)) return input;

    const address = new utils.Address(input);
    const wc = Uint8Array.of(address.wc);
    const hashPart = Uint8Array.from(address.hashPart);

    const buffer = new Uint8Array(wc.length + hashPart.length);
    buffer.set(wc, 0);
    buffer.set(hashPart, wc.length);

    return Buffer.from(buffer);
};

/**
 * @param  {Buffer} input
 * @return {Tonweb.utils.Address}
 */
const bufferToAddress = function convert33byteBufferToTonAddress(input) {
    if (input instanceof utils.Address) return input;

    const wc = input.slice(0, 1);
    const hashPart = input.slice(1);
    const address = Buffer.from(wc).readIntLE(0, 1) + ':' + Buffer.from(hashPart).toString('hex');
    return new utils.Address(address);
};

module.exports = { 
    addressToBuffer,  
    bufferToAddress
}