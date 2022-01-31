import React, {useState, useEffect} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Button, 
  Platform,
  TouchableOpacity,
} from 'react-native'

const App = () => {
  
  const [name, setName] = useState()
  const [dateTime, setDateTime] = useState(new Date())
  const [items, setItems] = useState([])

  const handleSubmit = () => {
    setItems([...items, {name: name, expiry: dateTime}])
  }

  const handleClearAll = () => {
    setItems([])
    PushNotification.cancelAllLocalNotifications()
  }


  //For DateTimePicker
  //https://www.npmjs.com/package/@react-native-community/datetimepicker
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, value) => {
    const currentDate = value || dateTime;
    setShow(Platform.OS === 'ios');
    setDateTime(currentDate);
    console.log(dateTime.toLocaleString())
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // const showDatepicker = () => {
  //   showMode('date');
  // };

  const showTimepicker = () => {
    showMode('time');
  };


  //for local notifiation 
  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "test-channel",
      channelName: "Test Channel"
    })
  }


  useEffect(()=>{
    createChannels()
  },[])

  const setNotification = (item, index) => {

    if(Platform.OS === 'ios'){
      //ios Local Immediate Notification
      PushNotificationIOS.presentLocalNotification({
        id: index,
        alertTitle: "You set nortification for",
        alertBody: `[${index}] ${item.name} : ${item.expiry}`,
      })

      //ios Lacal Schedule Notification
      PushNotificationIOS.scheduleLocalNotification({
        id: index,
        alertTitle: "Attention",
        alertBody: `${item.name} is expirying soon! ${item.name} expires: ${item.expiry}`,
        fireDate: item.expiry.toISOString(), //Expected format here is YYYY-MM-DD'T'JJ:mm:ss.sssz //which is toISOString()
      })

    } else {

      //Android Local Immediate Notification
      PushNotification.localNotification({
        channelId: "test-channel",
        id: index,
        title: "You set nortification for",
        message: `[${index}] ${item.name} : ${item.expiry}`,
      })

      //Android Lacal Schedule Notification
      PushNotification.localNotificationSchedule({
        channelId: "test-channel",
        id: index,
        title: "Attention",
        message: `${item.name} is expirying soon!`,
        bigText: `${item.name} expires: ${item.expiry}`,
        date: item.expiry,
        allowWhileIdle: true,
      })
    }
  }


  return (
    <View style={styles.body}>
      <Text style={styles.text}>
        Enter Item:
      </Text>
      <TextInput 
        style={styles.input}
        placeholder='e.g. Banana'
        onChangeText={(value) => setName(value)}
      />

      {/* <Text style={styles.text}>
        Enter Expiry:
      </Text>
      <TextInput 
        style={styles.input}
        placeholder='e.g. Jan 31'
        onChangeText={(value) => setExpiry(value)}
      /> */}

    <View>
      {/* <View>
        <Button onPress={showDatepicker} title="Set Expiry Date" />
      </View> */}
      <View>
        <Button onPress={showTimepicker} title="Set Expiry" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateTime}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>

      <Pressable
        onPress={handleSubmit}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : 'skyblue', margin:20},
        ]}
        hitSlop={{top: 10, bottom: 10, right: 10, left: 10}} //10 around button can be pressed as the button as well
      >
        <Text style={styles.text}>
          Submit
        </Text>
      </Pressable>

      <Pressable
        onPress={handleClearAll}
        style={({pressed}) => [
          {backgroundColor: pressed ? '#dddddd' : 'skyblue', marginBottom: 50},
        ]}
        hitSlop={{top: 10, bottom: 10, right: 10, left: 10}} //10 around button can be pressed as the button as well
      >
        <Text style={styles.text}>
          Clear All
        </Text>
      </Pressable>

      <ScrollView>
        {items.map((item, index) =>
          <TouchableOpacity key={index} style={styles.list} onPress={()=>{setNotification(item, index)}}>
            <Text style={styles.text}>{item.name} -- {item.expiry.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginVertical: 60,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  list: {
    width: 350,
    height: 50,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'pink',
  }

});

export default App