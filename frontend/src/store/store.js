import React, {useReducer, useContext} from 'react'

var storeContext = React.createContext()

const withStore = (initialState, reducer) => WrappedComponent => props => {
    const StoreProvider = storeContext.Provider
    const [state, dispatch] = useReducer(reducer, initialState)
    const providervalue = {state, dispatch}
    return (
        <div>
            <StoreProvider value={providervalue}>
                <WrappedComponent {...props} />
            </StoreProvider>
        </div>
    )
}


const useStore = () => useContext(storeContext)

export { withStore , useStore }



