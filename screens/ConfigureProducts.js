import {Ionicons} from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {RectButton, ScrollView} from 'react-native-gesture-handler';

// import DateTimePicker from '@react-native-community/datetimepicker';
import {useState} from "react";
import {Button, CheckBox, ListItem, Text} from "react-native-elements";
import moment from 'moment';
import {getData as getProductList, updateData} from "../constants/Catlog";
import {useEffect} from "react";

import DatePicker from 'react-native-datepicker'

export default function ConfigureProducts({navigation}) {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [maxStartTime, setMaxStartTime] = useState('');

    const [dateSlot, setDateSlot ] = useState(0);
    const [showDateModal, setShowModal] = useState(false);
    const [products, setProducts] = useState({});

    const changeStartTime = (event, date) => {
        setStartDate(moment(date).format('hh:mm A'));
    };

    const changeEndTime = (event, date) => {
        setEndDate(moment(date).format('hh:mm A'));
    };

    const updateProductInConfig = (productId, checked) => {
        let productList = JSON.parse(JSON.stringify(products));

        if(checked){
            productList[productId]['start_time'] = startDate;
            productList[productId]['expiry_time'] = endDate;
            productList[productId]['repeat_slot'] = dateSlot;
            productList[productId]['checked'] = checked;
        }
        else{
            productList[productId]['start_time'] = '';
            productList[productId]['expiry_time'] = '';
            productList[productId]['repeat_slot'] = '';
            productList[productId]['checked'] = checked;
        }

        setProducts(productList);

    };

    const verifyProducts = (products) => {
        let productsList = JSON.parse(JSON.stringify(products));

        return new Promise(resolve => {
            if(productsList){
                for(let id in productsList){
                    if(productsList.hasOwnProperty(id)){
                        if(productsList[id] && productsList[id].checked){
                            productsList[id].start_time = startDate;
                            productsList[id].expiry_time = endDate;
                            productsList[id].repeat_slot = dateSlot;
                        }
                        else{
                            productsList[id].start_time = '';
                            productsList[id].expiry_time = '';
                            productsList[id].repeat_slot = '';
                        }
                    }
                }
            }

            resolve(productsList);
        })



    };

    const saveConfig = async () => {

        try{

            let productList = await verifyProducts(products);

            await updateData('Products', productList);

            setTimeout(() => { navigation.navigate('Home');}, 400)

        }
        catch(err){
            console.log(err);
        }

    };

    const getProducts = async () => {
        try {
            let products = await getProductList('Products');
            setProducts(products);
        } catch (err) {

        }
    };

    const Check = (props) => {

        const handleCheckBox = () => {
            let checked = !props.checked;
            props.onClick(props.id, checked);
        };

        return (
            <CheckBox
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                onPress={() => handleCheckBox()}
                checked={props.checked}
            />
        )
    };

    const handleSlotRepeat = (dateSlot) => {
        setDateSlot(dateSlot);
    };

    const addTimeSlot = () => {
        setShowModal(false);
    };

    useEffect(() => {
        let time = moment().subtract(60*60000).format('YYYY-MM-DD HH:MM:SS');
        setMaxStartTime(time);
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            getProducts();
            // Screen was focused
            // Do something
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View>

            <View style={{
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{paddingBottom: 16, width: '50%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text h5 style={{paddingBottom: 16}}>Start time</Text>
                    </View>
                    <View style={{paddingRight: 16}}>
                        <DatePicker
                            mode="time"
                            timeZoneOffsetInMinutes={330}
                            date={startDate}
                            format={`hh:mm A`}
                            placeholder={`Pick start time`}
                            display={`clock`}
                            onDateChange={changeStartTime}
                            showIcon={false}
                            maxDate={maxStartTime}
                        />
                    </View>
                </View>
                <View style={{paddingBottom: 16, width: '50%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text h5 style={{paddingBottom: 16}}>End time</Text>
                    </View>
                    <View style={{paddingRight: 16}}>
                        <DatePicker
                            timeZoneOffsetInMinutes={330}
                            testID="endTimePicker"
                            mode="time"
                            display={`clock`}
                            placeholder={`Pick end time`}
                            showIcon={false}
                            format={`hh:mm A`}
                            date={endDate}
                            onDateChange={changeEndTime}
                        />
                    </View>
                </View>
            </View>
            <View style={{padding: 16}}>
                <Button title={`Select slot`}  onPress={() => setShowModal(true)}/>
            </View>
            <ScrollView style={{height: '60%'}}>

                {
                    products && Object.keys(products).length > 0 && Object.keys(products).map((l, i) => (
                        <ListItem
                            key={products[l].id}
                            title={products[l].name}
                            rightElement={<Check onClick={updateProductInConfig} checked={products[l]['checked'] || false} id={products[l].id}/>}
                            subtitle={products[l].price}
                            bottomDivider
                        />
                    ))
                }
            </ScrollView>
            <View style={{padding: 16}}>
                <Button title={`Save config`} onPress={() => saveConfig()}/>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDateModal}
                onRequestClose={() => Alert.alert(`Are you sure you want to cancel.`)}>
                <View style={style.centerView}>
                    <View style={style.modalView}>
                        <ScrollView >
                            <ListItem
                                style={style.listStyle}
                                title={`Daily`}
                                rightElement={<Check checked={dateSlot === 0} onClick={() => handleSlotRepeat(0)}/>}
                                subtitle={``}
                                bottomDivider
                            />
                            <ListItem
                                style={style.listStyle}
                                title={`Weekend`}
                                rightElement={<Check checked={dateSlot === 1} onClick={() => handleSlotRepeat(1)}/>}
                                subtitle={``}
                                bottomDivider
                            />
                            <ListItem
                                style={style.listStyle}
                                title={`Weekdays`}
                                rightElement={<Check checked={dateSlot === 2} onClick={() => handleSlotRepeat(2)}/>}
                                subtitle={``}
                                bottomDivider
                            />
                        </ScrollView>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                            <Button buttonStyle={{width: 100}} type={`clear`} title={`Cancel`} onPress={() => setShowModal(false)}/>
                            <Button  buttonStyle={{width: 100}} title={`Done`} onPress={() => addTimeSlot()}/>
                        </View>
                    </View>
                </View>

            </Modal>
        </View>
    );
}


const style = StyleSheet.create({
    inputStyle: {
        borderColor: '#ddd',
        borderWidth: 2,
        width: 200,
        backgroundColor: '#fff',
        fontSize: 14,
        paddingHorizontal: 8,
    },
    centerView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    listStyle:{


    },
    modalStyle:{
      width: 200,
    },
    modalView:{
        margin: 12,
        width: 300,
        height: 350,
        backgroundColor: "white",
        borderRadius: 0,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});
