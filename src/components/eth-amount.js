import PropTypes from 'prop-types'
import React from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'

const SkeletonTitleProps = { width: 30 }
const StyledSkeleton = styled(Skeleton)`
  display: inline;

  .ant-skeleton-title {
    margin: -3px 0;
  }
`
const ETHAmount = ({ amount, decimals }) => {
  const { drizzle } = useDrizzle()
  return amount === null ? (
    <StyledSkeleton active paragraph={false} title={SkeletonTitleProps} />
  ) : (
    Number(
      drizzle.web3.utils.fromWei(
        typeof amount === 'number'
          ? amount.toLocaleString('fullwide', { useGrouping: false })
          : String(amount)
      )
    ).toFixed(decimals)
  )
}

ETHAmount.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
    PropTypes.object.isRequired
  ]),
  decimals: PropTypes.number
}

ETHAmount.defaultProps = {
  amount: null,
  decimals: 0
}

export default ETHAmount
