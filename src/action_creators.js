import {
    PermissionsAndroid,
    Platform
} from "react-native";
import { OrderedMap } from "immutable";

import actions from "./actions";
import BleManager from "react-native-ble-manager";

/* Pure action creators to update component state */

export function setDevices(devices) {
    return { type: actions.SET_DEVICES, devices };
}

export function setScanning(isScanning) {
    return { type: actions.SET_SCANNING, isScanning };
}

export function setInactiveDevices() {
    return { type: actions.SET_INACTIVE_DEVICES };
}

export function discoverDevice(device) {
    return { type: actions.DISCOVERED_DEVICE, device: device };
}

export function scannerStarted(handlerDiscover, handlerStop) {
    return { type: actions.SCANNER_STARTED, handlerDiscover, handlerStop };
}

export function unsubscribe() {
    return { type: actions.UNSUBSCRIBE };
}

/* Thunks for interacting with BleManager */

async function requestLocationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        let granted;
        try {
            return {
                granted: await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            };
        } catch (error) {
            return { granted, error };
        }
    } else {
        return { granted: true };
    }
}

export function startScanner(bleManagerEmitter) {
    return async (dispatch) => {
        await BleManager.start({ showAlert: false });
        const handlerDiscover = bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (device) => dispatch(discoverDevice(device)));
        const handlerStop = bleManagerEmitter.addListener("BleManagerStopScan", () => dispatch(scanPeriodCompleted()));
        const { granted, error } = await requestLocationPermission();

        if (!granted) {
            console.error(`No location permission ${error}`);
        } else {
            dispatch(scannerStarted(handlerDiscover, handlerStop));
        }
    };
}

export function scanPeriodCompleted() {
    return (dispatch) => {
        dispatch(setInactiveDevices());
        dispatch(startScan());
    };
}

export function startScan() {
    const fitnessDevices = OrderedMap({
        "180d": "Heart Rate",
        "1816": "Cycling Speed and Cadence",
        "1818": "Cycling Power",
        "1826": "Fitness Machine",
        "a026ee06-0a7d-4ab3-97fa-f1500f9feb8b": "Wahoo ELEMNT"
    });

    const matchMode = { AGGRESSIVE: 0x1 }; // Allow weak signal & minimal sightings before reporting
    const matchNum = { MAX_ADVERTISEMENT: 0x3 }; // Match as many advertisements per filter as hardware allows
    const scanMode = { LOW_LATENCY: 0x2 };  // Scan using highest duty cycle

    return (dispatch) => {
        BleManager.scan(fitnessDevices.keySeq().toArray(), 10, true, {
            matchMode: matchMode.AGGRESSIVE,
            numberOfMatches: matchNum.MAX_ADVERTISEMENT,
            scanMode: scanMode.LOW_LATENCY
        });
        dispatch(setScanning(true));
    };
}

export function stopScan() {
    return (dispatch) => {
        BleManager.stopScan();
        dispatch(setScanning(false));
    };
}

export function toggleScanning(wasScanning) {
    return (dispatch) => {
        if (wasScanning) {
            dispatch(stopScan());
        } else {
            dispatch(startScan());
        }
    };
}
