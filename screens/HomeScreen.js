import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

import NikeImage from '../assets/images/nike1.jpeg'

import {ListItem, Icon, Avatar} from 'react-native-elements'

import {Product} from '../constants/Products'
import {updateData as UpdateProduct, getData as getProductList} from '../constants/Catlog';
import {useEffect} from "react";
import {useState} from "react";
import {useFocusEffect} from "@react-navigation/core";

export default function HomeScreen() {

  const [products, setProducts] = useState({});

  async function addToCart (product) {
    console.log(product);
    try {
      let tempProduct = {
        [product.id]: product
      };
      await UpdateProduct('Cart',tempProduct)
    } catch (err) {
      console.error('Product update error:',err);
    }
  }


  async function getProducts (){

    try {
          let products = await getProductList('Products');
          console.log('products', products);
          setProducts(products);
    } catch (err) {

    }
  }


  useFocusEffect(
      React.useCallback(() => {
        getProducts();

        return () => {
        //   Unmount
        }
      }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {
            products && Object.keys(products).length > 0 && Object.keys(products).map((l, i) => (
            <ListItem
              key={products[l].id}
              // leftAvatar={{title: l.avatar_title, rounded: true, titleStyle: styles.avatarTitleStyle, avatarStyle:styles.avatarStyle }}
              title={products[l].name}
              rightIcon={{name: 'shopping-cart', onPress: () => addToCart( products[l]) }}
              // rightTitle={`Add to cart`}
              subtitle={products[l].price}
              bottomDivider
            />
          ))
        }
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
