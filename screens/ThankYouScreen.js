import React from 'react';
import PropTypes from 'prop-types';
import {View} from "react-native";
import {Text} from "react-native-elements";

function ThankYouScreen(props) {
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', margin: 44}}>
           <Text h4 style={{color: 'green'}}> Payment Done</Text>
        </View>
    );
}

ThankYouScreen.propTypes = {};
ThankYouScreen.defaultProps = {};

export default ThankYouScreen;
