import {Ionicons} from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {RectButton, ScrollView} from 'react-native-gesture-handler';

// import DateTimePicker from '@react-native-community/datetimepicker';
import {useState} from "react";
import {Button, CheckBox, ListItem, Text} from "react-native-elements";
import moment from 'moment';
import {getData as getProductList} from "../constants/Catlog";
import {useEffect} from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function LinksScreen({navigation}) {

    const [date, setDate] = useState(new Date());
    const [maxStartTime, setMaxStartTime] = useState(new Date( new Date().getTime() + 60*60000));
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [show, setShow] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [mode, setMode] = useState('time');
    const [dateSlot, setDateSlot ] = useState(0);
    const [showDateModal, setShowModal] = useState(false);
    const [products, setProducts] = useState({});

    const changeStartTime = (event, date) => {
        console.log('time',moment(date).format('HH:MM A'));
        setStartTime(moment(date).format('HH:MM A'));
        setDate(moment(date));
        setShow(false);
    };

    const changeEndTime = (event, date) => {

        setEndTime(moment(date).format('HH:MM A'));
        setEndDate(new Date(date));
        setShowEndTime(false);
    };

    const showStartTimePicker = () => {
        setMode('time');
        setShow(true);
    };

    const showEndTimePicker = () => {
        setMode('time');
        setShowEndTime(true);
    };

    const getMaxEndTime = () => {

    };

    const getMinEndTime = () => {

    };

    const getMaxStartTime = () => {
        if(!endTime){
            console.log('max start time:', moment().subtract(-1));
            return moment().subtract(-1);
        }
        else{
            let maxTime = moment(endDate).subtract(60000 * 60);
            console.log('max time: ', maxTime);
            return maxTime;
        }
    };

    const getMinStartTime = () => {

    };

    const getProducts = async () => {
        try {
            let products = await getProductList('Products');
            setProducts(products);
        } catch (err) {

        }
    };

    const Check = (props) => {

        const [checked, setChecked] = useState(false);

        const handleCheckBox = () => {
            setChecked((prevValue) => !prevValue);
            setTimeout(() => {
                props.onClick(props.id);
            }, 400)
        };

        return (
            <CheckBox
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                onPress={() => handleCheckBox()}
                checked={checked}
            />
        )
    };

    const handleSlotRepeat = (dateSlot) => {
        setDateSlot(dateSlot);
    };

    const addTimeSlot = () => {
        setShowModal(false);
    };

    const CloseModal = () => {
        setShowModal(false);
    };

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
                        <Text h5 style={{paddingLeft: 8, fontSize: 16, color: '#333', fontWeight: 'bold'}}>{startTime}</Text>
                    </View>
                    <View style={{paddingRight: 16}}>
                        <Button title={`Pick start time`}
                                onPress={showStartTimePicker}/>
                    </View>
                </View>
                <View style={{paddingBottom: 16, width: '50%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text h5 style={{paddingBottom: 16}}>End time</Text>
                        <Text h5 style={{paddingLeft: 8, fontSize: 16, color: '#333', fontWeight: 'bold'}}>{endTime}</Text>
                    </View>
                    <View style={{paddingRight: 16}}>
                        <Button title={`Pick end time`} disabled={!startTime}
                                onPress={showEndTimePicker}/>
                    </View>
                </View>
            </View>

            <View>
                {
                    <DateTimePickerModal
                        isVisible={show}
                        mode="time"
                        display={`clock`}
                        onConfirm={()=> console.log(3)}
                        onChange={changeStartTime}
                        // maximumDate={maxStartTime}
                        onCancel={changeStartTime}
                    />
                }
                {
                    showEndTime &&
                    <DateTimePickerModal
                        testID="endTimePicker"
                        isVisible={show}
                        mode="time"
                        display={`clock`}
                        onConfirm={()=> console.log(3)}
                        onChange={changeEndTime}
                        // maximumDate={maxStartTime}
                        onCancel={changeEndTime}
                    />
                }
            </View>
            <View style={{padding: 16}}>
                <Button title={`Select Date`}  onPress={() => setShowModal(true)}/>
            </View>
            <ScrollView style={{height: '70%'}}>

                {
                    products && Object.keys(products).length > 0 && Object.keys(products).map((l, i) => (
                        <ListItem
                            key={products[l].id}
                            title={products[l].name}
                            rightElement={<Check onClick={() => console.log(2)} id={products[l].id}/>}
                            subtitle={products[l].price}
                            bottomDivider
                        />
                    ))
                }
            </ScrollView>
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
                                rightElement={<Check dateSlot={dateSlot} onClick={() => handleSlotRepeat(0)}/>}
                                subtitle={``}
                                bottomDivider
                            />
                            <ListItem
                                style={style.listStyle}
                                title={`Weekend`}
                                rightElement={<Check dateSlot={dateSlot} onClick={() => handleSlotRepeat(1)}/>}
                                subtitle={``}
                                bottomDivider
                            />
                            <ListItem
                                style={style.listStyle}
                                title={`Weekdays`}
                                rightElement={<Check dateSlot={dateSlot} onClick={() => handleSlotRepeat(2)}/>}
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
        // alignItems: "center",
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
