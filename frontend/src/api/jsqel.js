import { useEffect, useState, useReducer } from 'react'
import axios from 'axios'

// React hook to use a query
// const [{results, error, loading}, refresh, clear] = useJsqel('private_hello', { sendItNow:true, filter : filter })
// refresh can be used like this :
// refresh()                    -> send the query with the same parameters
// refresh( {filter:'F%'} )     -> send the query with updated parameters
// refresh({ sendItNow:true, filter : filter }) --> send the query if sendItNow was initially false
// clear : set results to null

const api_url = process.env.NODE_ENV === 'production' ? 'http://localhost/api/' : 'http://localhost:5000/'
console.log("Using API url :", api_url)

const setToken = (token) => {
  console.log('Setting token :', token)
  window.localStorage.setItem('jsqel_token', token)
}

const removeToken = () => {
  if (window.localStorage.getItem('jsqel_token')) window.localStorage.removeItem("jsqel_token");
}

const jsqelReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return { ...state, loading: true, error: null }
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, error: null, results: action.payload, };
      case 'FETCH_FAILURE':
        console.log("Error payload : ", action.payload.response)
        if (action.payload.response && action.payload.response.status===401) removeToken()
        return { ...state, loading: false, error: action.payload };
      case 'CLEAR' :
          return { ...state, loading: false, error: null, results: null };
      default:
              return state;
    }
  }
  
const useJsqel = (query, props = {}, initialResults=[]) => {
    const [apiParameters, setApiParameters] = useState( { query, props });

    const [state, dispatch] = useReducer(jsqelReducer, {
        loading: false,
        error : null,
        results: initialResults,
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })
            try {
                // Add token if any
                const token = window.localStorage.getItem('jsqel_token') 
                const result = await axios.post(api_url+apiParameters.query, apiParameters.props,  token ? { headers: { Authorization: `Bearer ${token}` } } : {} )
                console.log('Result :', result)
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
                if ( apiParameters.props && apiParameters.props.callback) apiParameters.props.callback({error:null, results: result.data } );
            } catch (error) {
              console.log('error :', error)
              dispatch({ type: 'FETCH_FAILURE', payload: error })
              if ( apiParameters.props && apiParameters.props.callback) apiParameters.props.callback({error:error, results: null });
            }
        }
        // if props contains sendItNow:true
        console.log("useEffect:", apiParameters)
        if ( apiParameters.props && apiParameters.props.sendItNow) fetchData();
    }, [apiParameters]);

    const refresh = (newParams={}) => setApiParameters( {query:query, props:Object.assign( {}, apiParameters.props, newParams, {sendItNow:true} )} )

    const clear = () => dispatch({ type: 'CLEAR' })

    return [state, refresh, clear]
}

export {useJsqel, setToken}


