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

  txs.forEach((tx, i) => {
    // Remove 0x
    if (tx.data.length > 1 && tx.data.substring(0,2) === '0x') {
      tx.data = tx.data.substr(2)
    }
  })

  const _sortedTxs = txs.sort((a,b) => {
    return parseInt(txHash(a.address, a.amount, '0x' + a.data), 16) - parseInt(txHash(b.address, b.amount, '0x' + b.data), 16)
  })

  _sortedTxs.forEach(tx => {
    addresses.push(tx.address)
    values.push(tx.amount)
    data += tx.data
    dataSizes.push(tx.data.length / 2)
    titles += tx.title + ','
  })

  return {
    addresses,
    values,
    data,
    dataSizes,
    titles
  }
}
