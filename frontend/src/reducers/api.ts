export enum ApiActions {
    CALLERS = "callers/get",
    CALLERS_REQUESTED = "callers/requested"
}

const initialState = {
    callers: [],
    fetchingCallers: false
}

export default function(state = initialState, action:{ type:ApiActions, response:any }) {
    switch (action.type) {
        case ApiActions.CALLERS_REQUESTED:
            return {
                ...state,
                fetchingCallers: true
            }
        case  ApiActions.CALLERS:
            return {
                ...state,
                callers: action.response,
                fetchingCallers: !state.fetchingCallers
            }
        default:
            return state
    }
}

export interface ICaller {
    name: string
}

export const fetchCallers = () => {
    return (dispatch:any) => {
        dispatch({
            type: ApiActions.CALLERS_REQUESTED
        })
        return setTimeout(() => {
            dispatch({type: ApiActions.CALLERS, response: [
                {
                    name: "Joe Bloggs"
                },
                {
                    name: "Ethel Green"
                },
                {
                    name: "Cecil Bethesda"
                }
            ]})
        }, 0)
        fetch("").then(() => {
            dispatch({
                type: ApiActions.CALLERS
            })
        })
    }
}