
require('moment-timezone');

import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {Button, ListItem} from 'react-native-elements'

import {updateData as UpdateProduct, getData as getProductList} from '../constants/Catlog';
import {useEffect} from "react";
import {useState} from "react";

import moment from "moment";

export default function HomeScreen({navigation}) {

  const [products, setProducts] = useState({});

  async function addToCart (product) {
    // console.log(product);
    try {
      let tempProduct = {
        [product.id]: product
      };
      await UpdateProduct('Cart',tempProduct)
    } catch (err) {
      console.error('Product update error:',err);
    }
  }


  function validateProductAsPerSlot(product) {

    if(product['repeat_slot'] === 0){ // daily

      // Expiry check
      let start = moment(product['start_time'], 'hh:mm A');
      let end = moment(product['expiry_time'], 'hh:mm A');
      if( typeof product['expiry_time'] !== 'undefined' && moment().isBetween(start, end)){
        return true;
      }
      else{
        return false;
      }

    }
    else if(product['repeat_slot'] === 1){ // weekend
      let start = moment(product['start_time'], 'hh:mm A');
      let end = moment(product['expiry_time'], 'hh:mm A');
      let today = moment().format('dddd');
      if(typeof product['expiry_time'] !== 'undefined' && moment().isBetween(start, end) && today.match(/\b((Sun|Sat(u))(day)?)\b/g).length > 0) {
        return true;
      }
      else{
        return false;
      }

    }
    else if(product['repeat_slot'] === 2){ // weekdays
      let start = moment(product['start_time'], 'hh:mm A');
      let end = moment(product['expiry_time'], 'hh:mm A');
      let today = moment().format('dddd');

      console.log('time',moment().format('hh:mm A'));

      // console.log('Match', today.match(/\b((Mon|Tues|Wed(nes)?|Thur(s)?|Fri)(day)?)\b/g));
      console.log('check', moment().isBetween(start, end));

      if(typeof product['expiry_time'] !== 'undefined' && moment().isBetween(start, end) && today.match(/\b((Mon|Tues|Wed(nes)?|Thur(s)?|Fri)(day)?)\b/g).length > 0) {
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }


  }

  function filterProducts(products){


    if(products && Object.keys(products).length > 0 ){
      let List = Object.keys(products).map((l, i) => {

        // Expiry time check
        if(validateProductAsPerSlot(products[l])){
          return(
              <ListItem
                  key={products[l].id}
                  // leftAvatar={{title: l.avatar_title, rounded: true, titleStyle: styles.avatarTitleStyle, avatarStyle:styles.avatarStyle }}
                  title={products[l].name}
                  titleStyle={{
                    fontWeight: 'bold',
                    fontSize:18,
                  }}
                  rightElement={() => <Button type={`clear`} onPress={() => addToCart( products[l])} title={`Add to cart`}/>}
                  // rightTitle={`Add to cart`}
                  subtitle={`Rs ${products[l].price}`}
                  subtitleStyle={{
                    color: '#333'
                  }}
                  bottomDivider
              />
          )
        }
        else {
          return null;
        }
      });

      return List;
    }
    else{
      return <Text>HI</Text>;
    }
  }

  async function getProducts (){

    try {
          let products = await getProductList('Products');
          console.log('products home screen : ', products);
          setProducts(products);
    } catch (err) {
        console.log('err', err);
    }
  }

  useEffect(() => { getProducts();}, []);



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      getProducts();
      // Screen was focused
      // Do something
    });

    return unsubscribe;

  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            { filterProducts(products) || <Text>HI</Text>}
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarTitleStyle:{
    color: 'white',
    fontSize: 14,
  },
  avatarStyle:{
    backgroundColor: 'red',

  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
