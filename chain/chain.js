let lotion = require('lotion')
let fs = require('fs')
let balancesReducer = require('./reducers/balances')

let { haikunator, addressHash, generatePrivateKey, generateRandomName } = require('./utils/helpers/common')
let accounts = {}

for (let i = 0; i < 4; i++) {
  let { pubKey, privKey, address } = generatePrivateKey()
  let name = generateRandomName()
  let account = {
    name,
    sequence: 0,
    balance: 100,
    pubKey,
    address
  }

  accounts[address] = account
  console.log(`Name: ${name} - PrivateKey: ${privKey} - Address: ${address}`)
}

let initialState = { accounts }

let app = lotion({
  initialState,
  logTendermint: false,
  p2pPort: 64339,
  rpcPort: 64340
})

app.use(function(state, tx) {
  let newState = balancesReducer(state,tx)
  state.accounts = newState.accounts
})

app.start().then((appInfo) => {
  console.log('\n')
  console.log('Chain ID:', appInfo.GCI)
  console.log('Genesis Path:', appInfo.genesisPath)

  let genesisString = fs.readFileSync(appInfo.genesisPath, 'utf8')
  let genesis = JSON.parse(genesisString)
  let chainId = appInfo.GCI
  let config = { chainId, genesis }

  fs.writeFileSync('../app/src/config.json', JSON.stringify(config))
})