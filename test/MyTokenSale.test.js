const TokenSale = artifacts.require("MyTokenSale.sol");
const Token = artifacts.require("MyToken.sol");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});

contract("TokenSale Test", async accounts => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;
   
    it("should not have any tokens in my deployer account", async () => {
        let instance = await TokenSale.deployed();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all coins should be in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        let totalSupply = await instance.totalSupply.call();
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
        expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1","wei")})).to.be.rejected;
        expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(recipient);
        expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1","wei")})).to.be.fulfilled;
        balanceBeforeAccount = balanceBeforeAccount.add(new BN(1));
        return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    });   


});