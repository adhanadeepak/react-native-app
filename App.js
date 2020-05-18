import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import CheckoutScreen from './screens/CheckoutScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import {useEffect} from "react";

import {updateData as addProducts, getData as checkProducts, clearStorage} from './constants/Catlog';

import {ProductHash as Products} from './constants/Products';

const Stack = createStackNavigator();

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  const updateCatalog = async (products) => {
    try {
        await addProducts('Products', Products);

    } catch (err) {

    }

  };

  useEffect(() => {
    updateCatalog(Products);
    // clearStorage();

  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator initialRouteName={`Root`}>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen name={`Invoice`} component={CheckoutScreen}/>
            <Stack.Screen name={`ThankYou`} component={ThankYouScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
