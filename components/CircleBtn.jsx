import { Pressable, View, StyleSheet, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef } from 'react';

const CircleBtn = ({ style, toggleOpen, isModalVisible }) => {

   const openModal = () => {
      toggleOpen();
   }
   
   return (
      <View style={[styles.container, style]}>
         {isModalVisible ? (<></>
         ) : (
            <View style={[styles.container]}>
               <Pressable
                  style={styles.circleBtn}
                  onPress={openModal}
               >
                  <MaterialIcons name="add" size={40} color='white' />
               </Pressable>

               <Pressable style={styles.listBtn}>
                  <MaterialIcons name="format-list-bulleted" size={40} color="black" />
               </Pressable>
            </View>
         )}
      </View >
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: "row",
   },
   modalContainer: {
      alignItems: 'flex-end',
      height: '100%',
      width: '100%',
   },
   circleBtn: {
      margin: 10,
      backgroundColor: 'black',
      width: 65,
      height: 65,
      borderRadius: 42,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute'
   },
   listBtn: {
      left: 60,
      height: 65,
      width: 65,
      justifyContent: 'center',
      alignItems: 'center',
   },

})

export default CircleBtn;