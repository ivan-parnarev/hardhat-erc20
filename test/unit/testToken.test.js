const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TestToken Unit Test", function () {
          const multiplier = 10 ** 18
          let testToken, deployer, user1
          beforeEach(async function () {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.user1

              await deployments.fixture("all")
              testToken = await ethers.getContract("TestToken", deployer)
          })

          it("was deployed", async () => {
              assert(testToken.address)
          })

          describe("constructor", () => {
              it("Should have correct INITIAL_SUPPLY of token", async () => {
                  const totalSupply = await testToken.totalSupply()
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
              })
              it("Initialises the token with correct name and symbol", async () => {
                  const name = (await testToken.name()).toString()
                  assert.equal(name.toString(), "TestToken")

                  const symbol = (await testToken.symbol()).toString()
                  assert.equal(symbol.toString(), "TT")
              })
          })

          describe("transfers", () => {
              it("Successfully transfer tokens to address", async () => {
                  const tokensToSend = ethers.utils.parseEther("10")
                  await testToken.transfer(user1, tokensToSend)
                  expect(await testToken.balanceOf(user1)).to.equal(tokensToSend)
              })
              it("Successfully emit event when transfer occurs", async () => {
                  await expect(testToken.transfer(user1, (10 * multiplier).toString())).to.emit(
                      testToken,
                      "Transfer"
                  )
              })
          })
      })
