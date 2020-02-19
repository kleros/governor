import Web3 from 'web3'

export const txHash = (target, value, data) => {
  const web3 = new Web3()
  return Web3.utils.soliditySha3(
    target, value, data
  )
}

export const orderParametersByHash = (txs) => {
  const addresses = []
  const values = []
  let data = '0x'
  const dataSizes = []
  let titles = ''

  const _hashes = []
  txs.forEach(tx => {
    // Remove 0x
    if (tx.data.length > 1 && tx.data.substring(0,2) === '0x') {
      tx.data = tx.data.substr(2)
    }
    _hashes.push(txHash(tx.address, tx.amount, tx.data))
  })

  const _orderedHashes = _hashes.sort((a,b) => parseInt(a) - parseInt(b))

  _orderedHashes.forEach(h => {
    const i = _hashes.indexOf(h)

    addresses.push(txs[i].address)
    values.push(txs[i].amount)
    data += txs[i].data
    dataSizes.push(txs[i].data.length / 2)
    titles += txs[i].title + ','
  })

  return {
    addresses,
    values,
    data,
    dataSizes,
    titles
  }
}
