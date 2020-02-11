import React from 'react'
import { BrowserRouter as Router, Route,  Switch } from "react-router-dom"
import { withStore } from './store/store'
import {reducer, initialStore} from './store/reducer'

import './App.css'

import UserLoginForm from './components/login/UserLoginForm'
import PrivateRoute from './components/navigation/PrivateRoute'
import PrivateApp from './components/navigation/PrivateApp'

const App = () => (
    <Router >
          <Switch>
            {/* Routes without authentication */  }
            <Route exact path="/login"  component={UserLoginForm} />

            {/* Routes with authentication */  }
            <PrivateRoute exact path={['/users', '/opportunities', '/leads', '/upload','/signin', '/' ]} component={PrivateApp} />

            {/* Fallback route */  }
            <Route component={UserLoginForm} />
          </Switch>
    </Router>
)



export default withStore(initialStore, reducer)(App)