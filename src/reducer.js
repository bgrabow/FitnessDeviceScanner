import { Map } from "immutable";
import actions from "./actions";

const INITIAL_STATE = Map({
    devices: Map(),
    activeDevices: Map(),
    scanning: false,
    handlerDiscover: null,
    handlerStop: null
});

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actions.SET_DEVICES:
            return setDevices(state, action.devices);
        case actions.SET_SCANNING:
            return setScanning(state, action.isScanning);
        case actions.SCANNER_STARTED:
            return setHandlers(state, action.handlerDiscover, action.handlerStop);
        case actions.UNSUBSCRIBE:
            return setHandlers(state, null, null);
        case actions.DISCOVERED_DEVICE:
            return discoveredDevice(state, action.device);
        case actions.SET_INACTIVE_DEVICES:
            return setInactiveDevices(state);
        default:
            return state;
    }
}

function setDevices(state, devices) {
    return state.set("devices", devices);
}

function setScanning(state, isScanning) {
    return state.set("scanning", isScanning);
}

function setHandlers(state, handlerDiscover, handlerStop) {
    return state
        .set("handlerDiscover", handlerDiscover)
        .set("handlerStop", handlerStop);
}

function discoveredDevice(state, device) {
    return state
        .update("devices", devices => devices.set(device.id, device))
        .update("activeDevices", activeDevices => activeDevices.set(device.id, device));
}

function setInactiveDevices(state) {
    return state
        .update("devices",
            devices => devices.map(
                device => ({ ...device, inactive: !state.get("activeDevices").has(device.id) })))
        .set("activeDevices", Map());
}
