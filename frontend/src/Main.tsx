import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { LinkContainer } from 'react-router-bootstrap';

import './Main.css';

import store, { history } from './store'
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux'
import CallerLookup from './views/CallerLookup';

const Home = () => <span>Home</span>;

const About = () => <span>About</span>;

const Users = () => <span>Users</span>;

const Main = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Container className="p-3">
        <h1 className="header">Advocat.</h1>
        <div>
          <Switch>
            <Route path="/about">
              <CallerLookup />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
        <h2>
          Navigate to{' '}
          <ButtonToolbar className="custom-btn-toolbar">
            <LinkContainer to="/">
              <Button>Home</Button>
            </LinkContainer>
            <LinkContainer to="/about">
              <Button>About</Button>
            </LinkContainer>
            <LinkContainer to="/users">
              <Button>Users</Button>
            </LinkContainer>
          </ButtonToolbar>
        </h2>
      </Container>
    </ConnectedRouter>
  </Provider>
);

export default Main;
