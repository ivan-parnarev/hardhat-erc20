const { network } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY } = require("../helper-hardhat.config")
const { verify } = require("../utils/verify-erc20")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const testToken = await deploy("TestToken", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`TestToken deployed at ${testToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(testToken.address, [INITIAL_SUPPLY])
    }
}

module.exports.tags = ["all", "token"]
