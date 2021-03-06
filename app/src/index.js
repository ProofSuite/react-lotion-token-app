import React from 'react'
import ReactDOM from 'react-dom'
import { createChainStore } from 'redux-tendermint'
import { reducer, actions } from '@proofsuite/tokenchain'
import { Provider } from 'react-redux'
import { genesis, chainId } from './config.json'

import Accounts from './components/Accounts'
import SendTxForm from './components/SendTxForm'

createChainStore(reducer, chainId, genesis).then(store => {
  const render = () => ReactDOM.render(
    <Provider store={store}>
      <Accounts />
      <SendTxForm />
    </Provider>,
    document.getElementById('root')
  )

  render()

  store.subscribe(render)
  store.subscribe(() => console.log('State', store.getState()))
  store.subscribeChain(() => console.log('Chain State', store.getChainState()))
})



