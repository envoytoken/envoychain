var StellarSdk = require('stellar-sdk');
StellarSdk.Network.usePublicNetwork();
var server = new StellarSdk.Server('https://horizon.stellar.org');

// Keys for accounts to issue and receive the new asset
var issuingKeys = StellarSdk.Keypair
  .fromSecret('Issuer wallet secret key');
var receivingKeys = StellarSdk.Keypair
  .fromSecret('distribution wallet secret key');

// Create an object to represent the new asset
var NVOYcoin = new StellarSdk.Asset('NVOY', issuingKeys.publicKey());

// First, the receiving account must trust the asset
server.loadAccount(receivingKeys.publicKey())
  .then(function(receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver)
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: NVOYcoin,
        limit: '250000000'
      }))
      .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })

  // Second, the issuing account actually sends a payment using the asset
  .then(function() {
    return server.loadAccount(issuingKeys.publicKey())
  })
  .then(function(issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.payment({
        destination: receivingKeys.publicKey(),
        asset: NVOYcoin,
        amount: '250000000'
      }))
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .catch(function(error) {
    console.error('Error!', error);
  });




//Add home domain
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.usePublicNetwork();
var server = new StellarSdk.Server('https://horizon.stellar.org');

// Keys for issuing account
var issuingKeys = StellarSdk.Keypair
  .fromSecret('Issuer wallet secret key');

server.loadAccount(issuingKeys.publicKey())
  .then(function(issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.setOptions({
        homeDomain: 'https://envoychain.io/',
      }))
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .catch(function(error) {
    console.error('Error!', error);
  });



// set auth flag on issuer account
StellarSdk.Network.usePublicNetwork();
var transaction = new StellarSdk.TransactionBuilder(issuingAccount)
  .addOperation(StellarSdk.Operation.setOptions({
    setFlags: StellarSdk.AuthRevocableFlag | StellarSdk.AuthRequiredFlag
  }))
  .build();
transaction.sign(issuingKeys);
server.submitTransaction(transaction);