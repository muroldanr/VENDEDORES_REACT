const homeReducer = (state = {
                            currentUEN: "",
                            embarque: [],
                            currentEmbarque: "",
                            ruta: [],
                            }, action) => {
    let newState = Object.assign({}, state)
    let {type} = action
    switch(type){
        case "EMBARQUE":
            newState.embarque = action.data.options
            return newState
        case "RUTA":
            newState.ruta = action.data.options
            return newState
        default: 
            return state
    }
}
 
export default homeReducer