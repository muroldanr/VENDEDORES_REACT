import {createStore, combineReducers} from 'redux'
import home from './home-reducer'

const reducer = combineReducers({
    home, 
})

const store = createStore(reducer)

export default store