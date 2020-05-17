import { AsyncStorage } from 'react-native';

export const addData = async (key, value) => {
    try {
        let data = await AsyncStorage.setItem(key, JSON.stringify(value), (err) => console.log(err));
        return data;
    } catch (err) {

    }
};


export const getData = async (key) => {
    try {
        let data = await AsyncStorage.getItem(key, (err) => console.log('Error',err));
        return JSON.parse(data);

    } catch (err) {

    }
};


export const updateData = async (key, value) => {


    try {

        let getKey = await AsyncStorage.getItem('Cart',(err) => console.log(err));
        console.log('key', getKey);
        if(getKey){
            let data = await AsyncStorage.mergeItem(key, JSON.stringify(value), (err) => console.log(err));
            console.log('updated storage');
            return data;
        }
        else{
            let data = await AsyncStorage.setItem(key, JSON.stringify(value), (err) => console.log(err));
            console.log('added data');
            return data;

        }


    } catch (err) {

    }
};


export const removeData = async (key) => {
    try {
        return await AsyncStorage.removeItem(key, (err) => console.log(err))
    } catch (err) {

    }
};

export const clearStorage = async () => {
    try {
        return await AsyncStorage.clear((err) => console.log('callback error',err));
    } catch (err) {
        console.error(err);
    }

}


