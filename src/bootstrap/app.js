import '../components/theme.css'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import { Col, Layout, Menu, Row, Spin, message } from 'antd'
import { DrizzleProvider } from 'drizzle-react'
import { Helmet } from 'react-helmet'
import { ReactComponent as Logo } from '../assets/images/logo.svg'
import Footer from '../components/footer'
import React from 'react'
import drizzleOptions from './drizzle'
import loadable from '@loadable/component'
import { register } from './service-worker'
import styled from 'styled-components/macro'

const StyledSpin = styled(Spin)`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`
const C404 = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/404'),
  {
    fallback: <StyledSpin />
  }
)
const Home = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/home'),
  {
    fallback: <StyledSpin />
  }
)
const MenuItems = [
  <Menu.Item key="home">
    <NavLink to="/">Home</NavLink>
  </Menu.Item>,
  <Menu.Item key="lists">
    <NavLink to="/lists">My Lists</NavLink>
  </Menu.Item>,
  <Menu.Item key="disputes">
    <NavLink to="/disputes">Disputes</NavLink>
  </Menu.Item>
]

const StyledLayoutSider = styled(Layout.Sider)`
  height: 100%;
  position: fixed;
  z-index: 2000;

  @media (min-width: 768px) {
    display: none;
  }

  .ant-layout-sider-zero-width-trigger {
    right: -50px;
    top: 12px;
    width: 50px;
  }
`
const StyledCol = styled(Col)`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: space-evenly;

  @media (max-width: 575px) {
    &.ant-col-xs-0 {
      display: none;
    }
  }
`
const StyledMenu = styled(Menu)`
  font-weight: 500;
  line-height: 64px !important;
  text-align: center;

  .ant-menu-item-selected {
    background-color: transparent !important;
  }
`
const StyledLayoutContent = styled(Layout.Content)`
  background: #f2e3ff;
  min-height: 100vh;
  padding: 0px 9.375vw 120px 9.375vw;
`
export default () => (
  <>
    <Helmet>
      <title>Kleros · Governor</title>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i"
        rel="stylesheet"
      />
    </Helmet>
    <DrizzleProvider options={drizzleOptions}>
      <BrowserRouter>
        <Layout>
          <StyledLayoutSider breakpoint="md" collapsedWidth="0">
            <Menu theme="dark">{MenuItems}</Menu>
          </StyledLayoutSider>
          <Layout>
            <Layout.Header>
              <Row>
                <StyledCol md={3} sm={16} xs={0}>
                  <Logo />
                </StyledCol>
                <Col md={16} xs={0}>
                  <StyledMenu mode="horizontal" theme="dark">
                    {MenuItems}
                  </StyledMenu>
                </Col>
                <StyledCol md={5} sm={8} xs={24} />
              </Row>
            </Layout.Header>
            <StyledLayoutContent>
              <Switch>
                <Route component={Home} exact path="/" />
                <Route component={C404} />
              </Switch>
            </StyledLayoutContent>
            <Footer />
          </Layout>
        </Layout>
      </BrowserRouter>
    </DrizzleProvider>
  </>
)

register({
  onUpdate: () =>
    message.warning(
      'An update is ready to be installed. Please close and reopen all tabs.',
      0
    )
})
