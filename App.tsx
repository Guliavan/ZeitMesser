import React, {Component} from 'react';
import { Svg, G, Circle, Path } from 'react-native-svg';
import { StyleSheet, Text, View, TextInput } from 'react-native';

const DEFAULT_TIME = 90;
const FULL_DASH_ARRAY = 283; //(2 * pi * 45 (r))
export const WARNING_THRESHOLD = 10;
export const ALERT_THRESHOLD = 5;
export const COLOR_CODES = {
    info: {
        color: "#41b883"
    },
    warning: {
        color: "#ffa500",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "#ff0000",
        threshold: ALERT_THRESHOLD
    }
};
const { alert, warning, info } = COLOR_CODES;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    baseTimer: {
        position: 'relative'
    },
    baseTimerSvg: {
        transform: [
           { scale: -3 },
           { scaleX: -1 },
           { rotate: '-90deg' }
        ]
    },
    baseTimerPathRemaining: {
        transform: [
            { rotate: '90deg' }
        ]
    },
    baseTimerCountdownContainer: {
        position: 'absolute'
    },
    baseTimerCountdownText: {
        fontSize: 100,
        color: '#333'
    },
    baseTimerInputContainer: {
        position: 'relative',
        top: 140
    },
    baseTimerInput: {
        height: 120,
        borderWidth: 0,
        fontSize: 50,
        color: 'white',
        padding: 10,
        width: 500,
        textAlign: 'center',
        position: 'absolute'
    },
    baseTimerInputText: {
        marginTop: 10,
        fontSize: 40,
    }
});

export default class App extends Component {
    constructor(props:Object) {
        super(props);
        this.state = {
            startTime: DEFAULT_TIME,
            timeLeft: DEFAULT_TIME,
            intervalTimer: 0,
            pathColor: COLOR_CODES.info.color,
            strokeDasharray: '283 283'
        };
        this.startTimer = this.startTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.iterateInterval = this.iterateInterval.bind(this);
        this.setCircleDasharray = this.setCircleDasharray.bind(this);
        this.calculateTimeFraction = this.calculateTimeFraction.bind(this);
        this.setPathColor = this.setPathColor.bind(this);
        this.setRemainingPathColor = this.setRemainingPathColor.bind(this);
        this.onChangeStartTime = this.onChangeStartTime.bind(this);
    }

    resetTimer () {
        this.setState({timeLeft: this.state.startTime});
        if (this.state.intervalTimer != 0) {
            this.setPathColor(info.color);
            clearInterval(this.state.intervalTimer);
        }
    };

    iterateInterval () {
        if (this.state.timeLeft <= 0) {
            this.resetTimer();
        } else {
            this.setState({timeLeft: this.state.timeLeft - 1});
            this.setCircleDasharray();
            this.setRemainingPathColor();
        }
    };

    startTimer() {
        this.resetTimer();
        const newTimer = setInterval( this.iterateInterval, 1000 );
        this.setState({ intervalTimer: newTimer });
    };

    formatTimeLeft(time: number) {
        const minutes:number = Math.floor(time / 60);
        let seconds = time % 60;
        let minutesPrint:string = `${minutes}`;
        if (minutes < 1) {
            minutesPrint = `0`;
        }
        let secondsPrint:string = `${seconds}`;
        if (seconds < 10) {
            secondsPrint = `0${seconds}`;
        }
        return `${minutesPrint}:${secondsPrint}`;
    };

    calculateTimeFraction() {
        const rawTimeFraction:Number = this.state.timeLeft / this.state.startTime;
        return rawTimeFraction - (1 / this.state.startTime) * (1 - rawTimeFraction);
    };

    setCircleDasharray() {
        const circleDasharray = `${(
            this.calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        this.setState({ strokeDasharray: circleDasharray });
    };

    setPathColor(color:string) {
        this.setState({ pathColor: color });
    };

    setRemainingPathColor() {
        if (this.state.timeLeft <= alert.threshold) {
            this.setPathColor(alert.color);
        } else if (this.state.timeLeft <= warning.threshold) {
            this.setPathColor(warning.color);
        }
    };

    onChangeStartTime(value:string) {
        let numericalValue:number = 0;
        const reverseString = (text:string) => text.split('').reverse().join('');
        if (value.length > 2) {
            const reversedValue = reverseString(value);
            const seconds = parseInt(reverseString(reversedValue.substr(0, 2)));
            const minutes = parseInt(reverseString(reversedValue.substr(2))) * 60;
            numericalValue = minutes + seconds
        } else if (value.length > 0) {
            numericalValue = parseInt(value);
        }
        this.setState({ startTime: numericalValue, timeLeft: numericalValue });
    };

    componentWillUnmount() {
        if (this.state.intervalTimer != 0) {
            clearInterval(this.state.intervalTimer);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.timerContainer}>
                    {/* <Text>Open up App.tsx to start working on your app!</Text> */}
                    <View style={styles.baseTimer}>
                        <Svg
                            testID="baseTimerPathSVG"
                            style={styles.baseTimerSvg}
                            height="100px"
                            width="100px"
                            onPress={this.startTimer}>
                            <G>
                                <Circle cx="50" cy="50" r="45" fill="white"/>
                                <Path
                                    d="
                                    M 50, 50
                                    m -45, 0
                                    a 45,45 0 1,0 90,0
                                    a 45,45 0 1,0 -90,0
                                    "
                                    fill="white"
                                    strokeLinecap="round"
                                    strokeWidth="7"
                                    strokeDasharray={this.state.strokeDasharray}
                                    stroke={this.state.pathColor}></Path>
                            </G>
                        </Svg>
                    </View>
                    <View style={styles.baseTimerCountdownContainer}>
                        <Text style={styles.baseTimerCountdownText} onPress={this.startTimer}>
                            {this.formatTimeLeft(this.state.timeLeft)}
                        </Text>
                    </View>
                </View>
                <View style={styles.baseTimerInputContainer}>
                    <Text style={styles.baseTimerInputText}>Change time</Text>
                    <TextInput
                        testID="timerTextInput"
                        style={styles.baseTimerInput}
                        onChangeText={value => this.onChangeStartTime(value)}
                        value={`${this.state.startTime}`}
                        maxLength={3}
                        keyboardType='number-pad'
                        enablesReturnKeyAutomatically={true}
                        returnKeyType='done'
                        caretHidden={true}
                        />
                </View>
            </View>
        );
    }
}


