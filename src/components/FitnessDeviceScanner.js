import React, { Component } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { connect } from "react-redux";

import Device from "./Device";
import * as ActionCreators from '../action_creators';

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
class FitnessDeviceScanner extends Component {
  componentDidMount() {
    this.props.startScanner(bleManagerEmitter);
  }

  componentWillUnmount() {
    this.props.unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusInfo}>
          <TouchableHighlight
            style={{ margin: 10, padding: 20, backgroundColor: '#ccc' }}
            onPress={() => this.props.toggleScanning(this.props.scanning)}
          >
            <Text>Scan Bluetooth ({this.props.scanning ? 'on' : 'off'})</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.deviceScroller}>
          <ScrollView>
            {this.props.devices.valueSeq()
              .sortBy(d => d.name)
              .sortBy(d => Boolean(d.inactive)) /* false and undefined/null should sort the same */
              .map(device => <Device {...device} key={device.id} />)}
          </ScrollView>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.get("devices"),
    scanning: state.get("scanning")
  };
}

export default connect(mapStateToProps, ActionCreators)(FitnessDeviceScanner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  statusInfo: {
    flex: 1
  },
  deviceScroller: {
    flex: 4,
    flexDirection: "row"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
