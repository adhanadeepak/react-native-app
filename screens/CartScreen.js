import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {Button, ButtonGroup, ListItem} from "react-native-elements";
import {useState} from "react";

import {getData as getCart, addData as removeItem} from "../constants/Catlog";
import {useFocusEffect} from "@react-navigation/core";

export default function CartScreen({navigation, route}) {

    const [cartItems, setCartItems] = useState({});


    const getCartItems = async () => {
        try {
            let items = await getCart('Cart');
            if(items) setCartItems(items);

        } catch (err) {
            console.log('error cart:',err)
        }
    };

    const getCartTotal = () => {
        let total = 0;
        if(Object.keys(cartItems).length > 0){

            Object.keys(cartItems).map(key => {
                total += parseInt(cartItems[key].price);
            });

            return total;
        }
        else{
            return '0';
        }


    };

    const deleteItemFormCart = async (id) => {
        try {
                let cart = {...cartItems};
                delete cart[id];
                setCartItems(cart);
                await removeItem('Cart', cart);

        } catch (err) {
            console.log(err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            getCartItems();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );


  return (
      <View style={styles.container}>
          <ScrollView style={styles.container}
                      contentContainerStyle={styles.contentContainer}>
              {
                  getCartTotal() !== '0' &&
                  <View>
                      <ListItem title={`Total amount:`} rightTitleStyle={{fontWeight: 'bold'}} rightTitle={`Rs ${getCartTotal()}`}
                                bottomDivider/>
                      <View>
                          <ListItem titleStyle={{fontWeight: 'bold', fontSize: 16}} title={`Products in cart`} bottomDivider/>
                      </View>
                  </View>
              }
              {
                  cartItems && Object.keys(cartItems).length > 0 ?
                  <View style={{padding: 16,}}>
                      <Button title={`Checkout`} raised
                              onPress={() => navigation.navigate('Invoice')}/>
                  </View>
                      :
                  <View style={{padding: 16}}>
                      <Text h2 style={{textAlign: 'center'}}>No product found in cart</Text>
                  </View>
              }
              <ScrollView style={styles.container}
                          contentContainerStyle={styles.contentContainer}>
                  {
                      cartItems && Object.keys(cartItems).length > 0 ?
                          <View>
                              {Object.keys(cartItems).map((l, i) => (
                                  <ListItem
                                      key={cartItems[l].id}
                                      title={cartItems[l].name}
                                      rightIcon={{
                                          name: 'delete',
                                          size: 32,
                                          onPress: () => deleteItemFormCart(cartItems[l].id),
                                          containerStyle: { paddingRight: 24, padding: 8}
                                      }}
                                      rightTitleStyle={{
                                          marginHorizontal: 16,
                                          color: '#333',
                                          fontSize: 14
                                      }}
                                      subtitle={l.price}
                                      bottomDivider
                                  />
                              ))}

                              <View style={{padding: 16,}}>
                                  <Button title={`Checkout`} raised onPress={() => navigation.navigate('Invoice')}/>
                              </View>
                          </View>
                          :
                          <View style={{padding: 16}}>
                              <Button title={`Go Shopping`} raised
                                      onPress={() => navigation.navigate('Home')}/>
                          </View>
                  }
              </ScrollView>
          </ScrollView>

      </View>
  );
}

CartScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
});
