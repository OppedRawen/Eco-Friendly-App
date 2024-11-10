require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.8.20",
    networks: {
        amoy: {
            url: "https://rpc-amoy.polygon.technology/",
            chainId: 80002,
            accounts: [`0x${process.env.APP_WALLET_PRIVATE_KEY}`]
        }
    }
};
