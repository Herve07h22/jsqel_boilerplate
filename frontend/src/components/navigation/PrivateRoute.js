import React from 'react'
import {  Route, Redirect } from "react-router-dom"

const PrivateRoute = ({ component: Component, ...rest }) => {
    let isAuthenticated = false
    const token = window.localStorage.getItem('jsqel_token')
    if (token) {
      // Vérification de la non expiration du token
      let decodedToken = token && token.split('.')
      let decodedData = JSON.parse(Buffer.from(decodedToken[0], 'base64').toString('utf8')) 
      if (decodedData.exp && (Number(decodedData.exp) > Date.now()) && decodedData.role && decodedData.role!=='Public' ) {
        isAuthenticated=true
      }
    }

    const next = pathname => {
        if (pathname && pathname.length) {
          if (pathname!=='/login' && pathname!=='/') {
            return '?next='+pathname.slice(1)
          }
        }
        return ''
      }
      
    return (
        <Route {...rest} render={(props) => (
            isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to={'/login'+ next(props.location.pathname) } />
        )} />
    )
}

export default PrivateRoute

