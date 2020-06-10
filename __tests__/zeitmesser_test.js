import React from 'react';
import App, {COLOR_CODES} from '../App.tsx';

import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';

it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
});

jest.useFakeTimers();

const DEFAULT_TIME = '1:30';

it ('starts the timer upon user click timer text', () => {
    const { getByText } = render(<App />);

    const timerText = getByText(DEFAULT_TIME);
    fireEvent.press(timerText);
    jest.advanceTimersByTime(60000);
    expect(timerText.props.children).toEqual('0:30');
});

it ('changes the timer text upon input change', () => {
    const { getByText, getByTestId } = render(<App />);

    const timerText = getByText(DEFAULT_TIME);
    const timerTextInput = getByTestId('timerTextInput');
    // Test seconds change
    fireEvent.changeText(timerTextInput, '20');
    expect(timerText.props.children).toEqual('0:20');
    // Test minute/seconds change with numbers < 6
    fireEvent.changeText(timerTextInput, '120');
    expect(timerText.props.children).toEqual('1:20');
    // Test minute/seconds change with numbers > 6
    fireEvent.changeText(timerTextInput, '160');
    expect(timerText.props.children).toEqual('2:00');
});

it ('has startup color on normal timer value (> 10 sec)', () => {
    const { getByText, getByTestId } = render(<App />);

    const timerText = getByText(DEFAULT_TIME);
    const timerSVG = getByTestId('baseTimerPathSVG');
    const timerSVGProps = timerSVG.props.children.props.children.props.children[1].props;

    // Start timer
    expect(timerSVGProps.stroke).toEqual(COLOR_CODES.info.color);
    expect(timerText.props.children).toEqual('1:30');
    fireEvent.press(timerText);

    jest.advanceTimersByTime(79000);
    expect(timerText.props.children).toEqual('0:11');
    const timerSVGPropsAfter = timerSVG.props.children.props.children.props.children[1].props;
    expect(timerSVGPropsAfter.stroke).toEqual(COLOR_CODES.info.color);
});

it ('changes the color on warn timer value (<= 10 sec)', () => {
    const { getByText, getByTestId } = render(<App />);

    const timerText = getByText(DEFAULT_TIME);
    const timerSVG = getByTestId('baseTimerPathSVG');
    const timerSVGProps = timerSVG.props.children.props.children.props.children[1].props;

    // Start timer
    expect(timerSVGProps.stroke).toEqual(COLOR_CODES.info.color);
    fireEvent.press(timerText);

    jest.advanceTimersByTime(80000);
    expect(timerText.props.children).toEqual('0:10');
    const timerSVGPropsAfter = timerSVG.props.children.props.children.props.children[1].props;
    expect(timerSVGPropsAfter.stroke).toEqual(COLOR_CODES.warning.color);
});

it ('changes the color on alert timer value (<= 5 sec)', () => {
    const { getByText, getByTestId } = render(<App />);

    const timerText = getByText(DEFAULT_TIME);
    const timerSVG = getByTestId('baseTimerPathSVG');
    const timerSVGProps = timerSVG.props.children.props.children.props.children[1].props;

    // Start timer
    expect(timerSVGProps.stroke).toEqual(COLOR_CODES.info.color);
    fireEvent.press(timerText);

    jest.advanceTimersByTime(85000);
    expect(timerText.props.children).toEqual('0:05');
    const timerSVGPropsAfter = timerSVG.props.children.props.children.props.children[1].props;
    expect(timerSVGPropsAfter.stroke).toEqual(COLOR_CODES.alert.color);
});