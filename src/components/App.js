import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import reducer from "../reducer";
import FitnessDeviceScanner from "./FitnessDeviceScanner";

const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <FitnessDeviceScanner />
            </Provider>
        );
    }
}
