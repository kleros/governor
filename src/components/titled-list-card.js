import { Card } from 'antd'
import React, { Fragment } from 'react'
import { ReactComponent as Hexagon } from '../assets/images/hexagon.svg'
import PropTypes from 'prop-types'
import { ReactComponent as Underline } from '../assets/images/underline.svg'
import styled from 'styled-components/macro'

const StyledCard = styled(Card)`
  background: none;
  cursor: initial;
  margin: 28px 0 0;

  .ant-card {
    &-body {
      border-radius: 12px;
      padding: 0;
    }
    &-head {
      background: linear-gradient(111.6deg, #4d00b4 46.25%, #6500b4 96.25%);
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      color: white;
      margin: 0 0 11px;

      &-title {
        padding: 0;
      }
    }
  }

  &.ant-card-wider-padding {
    .ant-card {
      &-head {
        padding: 0 24px;
      }

      &-body {
        padding: 0;
      }
    }
  }
`
const StyledPrefixDiv = styled.div`
  font-size: 21px;
  font-weight: bold;
  left: 53px;
  position: absolute;
  top: 35px;
  transform: translate(-50%, -50%);
`
const StyledTitleDiv = styled.div`
  font-size: 24px;
  font-weight: medium;
  left: 95px;
  position: absolute;
  top: 35px;
  transform: translateY(-50%);
`
const StyledUnderline = styled(Underline)`
  height: 4px;
  left: 0;
  position: absolute;
  top: 72px;
  width: 100%;
`
const StyledDivider = styled.div`
  border-bottom: 1px solid #d09cff;
  margin: 0;
  width: 100%;
`
const TitledListCard = ({ children, loading, prefix, title, extra }) => (
  <StyledCard
    bordered={false}
    loading={loading}
    extra={extra}
    title={
      <>
        <Hexagon className="ternary-fill" />
        <StyledPrefixDiv>{prefix}</StyledPrefixDiv>
        <StyledTitleDiv>{title}</StyledTitleDiv>
        <StyledUnderline className="primary-fill" />
      </>
    }
  >
    {children &&
      (children.length === undefined
        ? children
        : children.map((c, i) =>
            i < children.length - 2 ? (
              <Fragment key={i}>
                {c}
                <StyledDivider />
              </Fragment>
            ) : (
              c
            )
          ))}
  </StyledCard>
)

TitledListCard.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  prefix: PropTypes.node,
  title: PropTypes.node.isRequired
}

TitledListCard.defaultProps = {
  children: null,
  loading: false,
  prefix: null
}

export default TitledListCard
