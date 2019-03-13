import React from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

export default class Device extends React.PureComponent {
    render() {
        return (
            <View style={{ ...styles.container, ...(this.props.inactive ? styles.inactive : styles.active) }}>
                <View style={styles.row}>
                    <Text style={styles.name}>{this.props.name || "Unnamed device"}</Text>
                    <Text style={styles.rssi}>{this.props.rssi + " dBm"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.id}>{this.props.id}</Text>
                    <Text style={styles.deviceProp}>{this.props.inactive ? "inactive" : "active"}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inactive: {
        backgroundColor: "#CCC"
    },
    active: {
        backgroundColor: "#4ba1ed"
    },
    container: {
        padding: 5,
        margin: 2
    },
    row: {
        flexDirection: "row"
    },
    name: {
        flex: 8
    },
    rssi: {
        flex: 2,
        textAlign: "right"
    },
    id: {
        flex: 8
    },
    inRange: {
        flex: 2,
        textAlign: "right"
    }
});
