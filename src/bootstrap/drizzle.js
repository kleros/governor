import { Drizzle, generateStore } from 'drizzle'
import Governor from '../assets/contracts/governor.json'
import KlerosLiquid from '../assets/contracts/kleros-liquid.json'

const options = {
  contracts: [
    {
      ...Governor,
      networks: {
        42: { address: process.env.REACT_APP_KOVAN_GOVERNOR }
      }
    },
    {
      ...KlerosLiquid,
      networks: {
        42: { address: process.env.REACT_APP_KOVAN_KLEROS_LIQUID }
      }
    }
  ],
  polls: {
    accounts: 3000,
    blocks: 3000
  },
  web3: {
    fallback: {
      type: 'ws',
      url: ''
    }
  }
}
export default new Drizzle(options, generateStore(options))
