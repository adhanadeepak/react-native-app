import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {View} from "react-native";
import {Button, Text} from "react-native-elements";
import {useFocusEffect} from "@react-navigation/core";

function ThankYouScreen({navigation}) {

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            navigation.setOptions({
                headerLeft: null,
            });
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );


    return (
        <View style={{flexDirection: 'column'}}>
            <View style={{alignItems: 'center', justifyContent: 'center', margin: 44}}>
                <Text h4 style={{color: 'green'}}> Payment Done</Text>
            </View>
            <View style={{padding: 16}}>
                <Button title={`Shop more`} onPress={() => navigation.navigate('Home')}/>
            </View>

        </View>
    );
}

ThankYouScreen.propTypes = {};
ThankYouScreen.defaultProps = {};

export default ThankYouScreen;
