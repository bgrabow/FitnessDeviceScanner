import reducer from "./reducer";
import { fromJS, Map } from "immutable";
import actions from "./actions";

describe("reducer", () => {
    describe("setInactiveDevices", () => {
        it("sets inactive to false for active devices", () => {
            const initialState = Map({
                devices: Map({
                    "a": {id: "a"},
                    "b": {id: "b"}
                }),
                activeDevices: Map({
                    "a": {id: "a"},
                    "b": {id: "b"}
                })
            });
            const action = { type: actions.SET_INACTIVE_DEVICES };
            
            expect(reducer(initialState, action)).toEqual(Map({
                devices: Map({
                    "a": {id: "a", inactive: false},
                    "b": {id: "b", inactive: false}
                }),
                activeDevices: Map({})
            }));
        });
        it("sets inactive to true for inactive devices", () => {
            const initialState = Map({
                devices: Map({
                    "a": {id: "a"},
                    "b": {id: "b"}
                }),
                activeDevices: Map({
                    "a": {id: "a"}
                })
            });
            const action = { type: actions.SET_INACTIVE_DEVICES };
            
            expect(reducer(initialState, action)).toEqual(Map({
                devices: Map({
                    "a": {id: "a", inactive: false},
                    "b": {id: "b", inactive: true}
                }),
                activeDevices: Map({})
            }));
        });
    });
});