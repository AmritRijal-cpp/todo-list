import React, { useState } from "react";
import {
   Button,
   Dimensions,
   Modal,
   Pressable,
   StyleSheet,
   TextInput,
   View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Entypo from "@expo/vector-icons/Entypo";
import { format } from "date-fns";

const { height: screenHeight } = Dimensions.get("window");

const TASKS_KEY = 'tasks';

export default function AddTask({ toggleClose, isModalVisible, close, getTasks }) {
   const [datePickerVisibility, setDatePickerVisibility] = useState(false);
   const [timePickerVisibility, setTimePickerVisibility] = useState(false);
   const [selectedDate, setSelectedDate] = useState('');
   const [selectedTime, setSelectedTime] = useState(new Date());
   const [inputValue, setInputValue] = useState("");

   const changeDatePicker = () => {
      setDatePickerVisibility(true);
      setTimePickerVisibility(false);

   };

   const changeTimePicker = () => {
      setTimePickerVisibility(true);
      setDatePickerVisibility(false);
   }

   const closeModal = () => {
      toggleClose();
      close(false);
   }

   const handleDateConfirm = (event, date) => {
      if (date) {
         const formatted = format(date, "yyyy-MM-dd");
         setSelectedDate(formatted);
      }
      setDatePickerVisibility(false);
      console.log(selectedDate);
   };

   //   useEffect(() => console.log(selectedDate))

   const handleTimeConfirm = (event, time) => {
      if (time) {
         const formatted = format(time, "hh:mm:ss");
         setSelectedTime(formatted);
      }
      setTimePickerVisibility(false);
      console.log(selectedTime);
   };

   const handleTextChange = (value) => {
      setInputValue(value);
   };

   const saveTask = async () => {
      const task = {
         id: Date.now().toString(),
         date: selectedDate,
         time: selectedTime,
         value: inputValue
      }
      try {
         const existingTasksJSON = await AsyncStorage.getItem(TASKS_KEY);
         let existingTasks = existingTasksJSON ? JSON.parse(existingTasksJSON) : [];

         existingTasks.push(task);

         await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(existingTasks));
         getTasks();
         console.log(await AsyncStorage.getItem(TASKS_KEY));

      } catch (error) {
         console.error("Failed to save data \n", error);
      }
   }

   return (
      <Modal transparent={true} visible={isModalVisible} onRequestClose={closeModal} animationType="fade" statusBarTranslucent={true}>
         <View style={styles.container}>
            <View style={styles.insideContainer}>
               <Pressable style={styles.circleBtnClose} onPress={closeModal}>
                  <Entypo name="cross" size={40} color="white" />
               </Pressable>
               <View style={styles.dateTimeContainer}>
                  <Pressable onPress={changeDatePicker} style={styles.dateBtn}>
                     <MaterialIcons name="date-range" size={40} color="black" />
                  </Pressable>
                  {datePickerVisibility && (
                     <DateTimePicker
                        mode="date"
                        value={new Date()}
                        onChange={handleDateConfirm}
                     />
                  )}
                  <Pressable
                     onPress={changeTimePicker}
                     style={styles.timeBtn}
                  >
                     <MaterialIcons name="access-time" size={40} color="black" />
                  </Pressable>
                  {timePickerVisibility && (
                     <DateTimePicker
                        mode="time"
                        value={new Date()}
                        onChange={handleTimeConfirm}
                     />
                  )}
                  <TextInput
                     style={styles.input}
                     onChangeText={handleTextChange}
                     placeholder="Add Your Task"
                  />
               </View>
               <Button
                  title="Save"
                  onPress={() => {
                     saveTask();
                     toggleClose();

                  }}
               />
            </View>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      height: "100%",
      backgroundColor: "hsla(0, 0.00%, 0.00%, 0.30)",
      justifyContent: "flex-end",
   },
   insideContainer: {
      width: "100%",
      height: screenHeight * 0.7,
      backgroundColor: "#ac3a3a",
      justifyContent: 'flex-end',
   },
   circleBtnClose: {
      width: 40,
      height: 40,
      alignSelf: "flex-end",
   },
   dateTimeContainer: {
      padding: 25,
      height: "100%",
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
   },
   dateBtn: {
      flex: 1,
   },
   timeBtn: {
      flex: 1,
   },
   input: {
      flex: 4,
      backgroundColor: "white",
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 5,
   },
});
