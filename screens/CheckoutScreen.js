import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, ScrollView} from "react-native";
import {Button, Divider, ListItem, Text} from "react-native-elements";
import {useFocusEffect} from "@react-navigation/core";
import {getData as getCart} from "../constants/Catlog";

function InvoiceScreen({navigation}) {

    const [cartItems, setCartItems] = useState({});
    const[total, setTotal] = useState(0);
    const[tax, setTax] = useState(0);
    const[sellerAmount, setSellerAmount] = useState(0);
    const[websiteAmount, setWebsiteAmount] = useState(0);
    const[charityAmount, setCharityAmount] = useState(0);


    const getCartItems = async () => {
        try {
            let items = await getCart('Cart');
            console.log(2);

            if(items) {getAmount(items); setCartItems(items);}

        } catch (err) {
            console.log('error cart:',err)
        }
    };

    const getCartTotal = (items) => {
        let total = 0;
        if(Object.keys(items).length > 0){

            Object.keys(items).map(key => {
                total += parseInt(items[key].price);
            });

            let taxAmount = total * 0.19;
            total = taxAmount + total;
            setTax(taxAmount);
            setTotal(total);
            return total;
        }
        else{
            return '0';
        }
    };

    const getAmount = (items) => {

        let total = getCartTotal(items);
        console.log('check', total > 500);
         if(total < 100){
              setSellerAmount(total * 0.70);
              setWebsiteAmount(total * 0.20);
              setCharityAmount(total * 0.10);
         }
         else if(total > 100  && total < 500){
             console.log('seller', total * 0.65);
             setSellerAmount(total * 0.65);
             setWebsiteAmount(total * 0.20);
             setCharityAmount(total * 0.15);
         }
         else if(total > 500){
             console.log(1);
             console.log('seller', total * 0.33);
             setSellerAmount(Math.round((total * 0.33 * 100))/100);
             setWebsiteAmount(Math.round((total * 0.33)*100)/100);
             setCharityAmount(Math.round((total * 0.33)*100)/100);
         }
    };


    function getIndianCurrency (amount, decimalPlaces){
        let myObj = {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: decimalPlaces || 0,
        };
        return amount.toLocaleString("en-IN", myObj);
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            getCartItems();
            // Screen was focused
            // Do something
        });

        return unsubscribe;

    }, [navigation]);

    return (
        <View style={style.containerStyle}>
            <View style={style.invoiceContainer}>
                <View style={style.invoiceHeader}>
                    <Text h5 style={style.invoiceId}>Products</Text>
                    <Divider style={{backgroundColor:`#828282`, height: 1}}/>
                </View>

                <ScrollView style={style.productList}>
                    {
                        cartItems && Object.keys(cartItems).length > 0 &&
                            <View>
                                {Object.keys(cartItems).map((l, i) => (
                                    <ListItem
                                        key={cartItems[l].id}
                                        title={cartItems[l].name}
                                        rightTitle={`Rs ${getIndianCurrency(cartItems[l].price)}`}
                                        rightTitleStyle={{
                                            fontWeight: 'bold',
                                            paddingLeft: 8,
                                            color: '#333',
                                            fontSize: 14
                                        }}
                                        subtitle={l.price}
                                        bottomDivider
                                    />
                                ))}

                            </View>
                    }
                </ScrollView>
                <View style={{backgroundColor: '#ddd', padding: 16}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Tax Detail</Text>
                </View>
                <View>
                    <ListItem
                        title={`Seller`}
                        rightTitle={`Rs ${sellerAmount}`}
                        rightTitleStyle={{
                            fontWeight: 'bold',
                            paddingLeft: 0,
                            color: '#333',
                            fontSize: 14
                        }}
                        bottomDivider
                    />
                </View>
                <View>
                    <ListItem
                        title={`Website`}
                        rightTitle={`Rs ${websiteAmount}`}
                        rightTitleStyle={{
                            fontWeight: 'bold',
                            paddingLeft: 8,
                            color: '#333',
                            fontSize: 14
                        }}
                        bottomDivider
                    />
                </View>
                <View>
                    <ListItem
                        title={`Charity`}
                        rightTitle={`Rs ${charityAmount}`}
                        rightTitleStyle={{
                            fontWeight: 'bold',
                            paddingLeft: 8,
                            color: '#333',
                            fontSize: 14
                        }}
                        bottomDivider
                    />
                </View>
                <View>
                    <ListItem
                        title={`Tax`}
                        rightTitle={`Rs ${tax}`}
                        rightTitleStyle={{
                            fontWeight: 'bold',
                            paddingLeft: 8,
                            color: '#333',
                            fontSize: 14
                        }}
                        bottomDivider
                    />
                </View>
                <View>
                    <ListItem
                        title={`Total amount`}
                        rightTitle={`Rs ${total}`}
                        rightTitleStyle={{
                            fontWeight: 'bold',
                            paddingLeft: 8,
                            color: '#333',
                            fontSize: 14
                        }}
                        bottomDivider
                    />
                </View>
            </View>
            <View style={{padding: 16, width: '100%'}}>
                <Button title={`Pay`} onPress={() => navigation.navigate('ThankYou')}/>
            </View>
        </View>
    );
}



const style = StyleSheet.create({
    invoiceHeader:{
        backgroundColor: '#333',
        color: '#fff'
    },
    containerStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        margin: 28,

    },
    invoiceContainer:{
        shadowColor: '#333',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 10,
        width: '100%',
        height: '85%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    invoiceId:{
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 16,
    },
    productList:{
        backgroundColor: '#efefef',
    }
});

InvoiceScreen.propTypes = {};
InvoiceScreen.defaultProps = {};

export default InvoiceScreen;
