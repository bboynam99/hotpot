const Web3 = require("web3");
const WalletConnectProvider = require("@walletconnect/web3-provider").default;
// const wallet = require("/Users/Study/blockchain/eth/walletconnect/node_modules/@walletconnect/types /Users/Study/blockchain/eth/walletconnect/node_modules/@walletconnect/web3-provider/dist/cjs/index")
// const types = require("@walletconnect/web3-provider");

async function test() {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
        infuraId: "hoge" // Required
    });
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        console.log(chainId);
    });

    // Subscribe to session connection
    provider.on("connect", () => {
        console.log("connect");
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
    });
    //  Enable session (triggers QR Code modal)
    await provider.enable();

    //  Create Web3
    const web3 = new Web3(provider);
}

test();