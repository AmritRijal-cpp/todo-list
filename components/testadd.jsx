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

export default function AddTask({ toggle, isModalVisible }) {
   const [datePickerVisibility, setDatePickerVisibility] = useState(false);
   const [timePickerVisibility, setTimePickerVisibility] = useState(false);
   const [selectedDate, setSelectedDate] = useState('');
   const [selectedTime, setSelectedTime] = useState(new Date());
   const [inputValue, setInputValue] = useState("");

   const handleDatePress = () => {
      setDatePickerVisibility(true);
      setTimePickerVisibility(false); // Ensure time picker is hidden
   };

   const handleTimePress = () => {
      setTimePickerVisibility(true);
      setDatePickerVisibility(false); // Ensure date picker is hidden
   };

   const handleDateConfirm = (event, date) => {
      if (date) {
         const formattedDate = format(date, "yyyy-MM-dd");
         setSelectedDate(formattedDate);
      }
      setDatePickerVisibility(false);
   };

   const handleTimeConfirm = (event, time) => {
      if (time) {
         const formattedTime = format(time, "HH:mm:ss");
         setSelectedTime(formattedTime);
      }
      setTimePickerVisibility(false);
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
         console.log("Task saved successfully");
      } catch (error) {
         console.error("Failed to save task", error);
      }
   };

   return (
      <Modal transparent={true} visible={isModalVisible} onRequestClose={toggle}>
         <View style={styles.container}>
            <View style={styles.insideContainer}>
               <Pressable style={styles.circleBtnClose} onPress={toggle}>
                  <Entypo name="cross" size={40} color="white" />
               </Pressable>
               <View style={styles.dateTimeContainer}>
                  <Pressable onPress={handleDatePress} style={styles.dateBtn}>
                     <MaterialIcons name="date-range" size={40} color="black" />
                  </Pressable>
                  {datePickerVisibility && (
                     <DateTimePicker
                        mode="date"
                        value={new Date()}
                        onChange={handleDateConfirm}
                     />
                  )}
                  <Pressable onPress={handleTimePress} style={styles.timeBtn}>
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
                     toggle();
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
      flexDirection: "column",
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
