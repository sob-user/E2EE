const crypto = require('crypto');
const aes256 = require('aes256');

function createKey() {
    let ECDH = crypto.createECDH('secp256k1');
    ECDH.generateKeys();
    return ECDH;
}

function publicKeys(key) {
    return key.getPublicKey().toString('base64');
}

function sharedKey(key, publicKey) {
    return key.computeSecret(publicKey, 'base64', 'hex');
}

function checkSharedKeys(firstKey, secondKey) {
    if(firstKey === secondKey) {
        console.log('shared key generated with success');
    } else {
        console.log('something went wrong while you trying to generate shared key')
    }
}

const firstPeerKey = createKey();
const secondPeerKey = createKey();

const firstPeerPublicKey =  publicKeys(firstPeerKey);
const secondPeerPublicKey = publicKeys(secondPeerKey);

const firstPeerSharedKey = sharedKey(firstPeerKey, secondPeerPublicKey);
const secondPeerSharedKey = sharedKey(secondPeerKey, firstPeerPublicKey);

checkSharedKeys(firstPeerSharedKey, secondPeerSharedKey);

const firstPeerMessage = "Hi! I'm sending you an encrypted message";
const encryptedMessage = aes256.encrypt(firstPeerSharedKey, firstPeerMessage);

const secondPeerMessageReceived = encryptedMessage;
console.log('message send: ',secondPeerMessageReceived);

const secondPeerDecryptedMessage = aes256.decrypt(secondPeerSharedKey, secondPeerMessageReceived);
console.log('message received decrypted: ', secondPeerDecryptedMessage);