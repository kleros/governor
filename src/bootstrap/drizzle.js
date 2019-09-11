import { Drizzle, generateStore } from 'drizzle'
import Governor from '../assets/contracts/governor.json'

const options = {
  contracts: [
    {
      ...Governor,
      networks: {
        42: { address: process.env.REACT_APP_KOVAN_GOVERNOR }
      }
    }
  ],
  polls: {
    accounts: 3000,
    blocks: 3000
  }
}
export default new Drizzle(options, generateStore(options))
