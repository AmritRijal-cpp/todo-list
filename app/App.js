import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '../constants/themes';
import AddTask from '../components/AddTask';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CircleBtn from '../components/CircleBtn';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const TASKS_KEY = 'tasks';


const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const translateY = useSharedValue(500);

  useEffect(() => {
    getTasks();
  }, []);

  const toggleModalOpen = () => {
    setShowModal(true);
  };

  const toggleModalClose = () => {
    setShowModal(false)
  };
  const animatedStyle = useAnimatedStyle(() => {
    return (
      { transform: [{ translateY: translateY.value }], }
    );
  });

  const getTasks = async () => {
    try {
      const taskJSON = await AsyncStorage.getItem(TASKS_KEY);
      if (taskJSON !== null) {
        setTasks(JSON.parse(taskJSON));
      }
    } catch (error) {
      console.error('Failed to retrieve to-do list', error);
    }
  };

  const isConfirm = (id) => {
    Alert.alert(
      'Delete?',
      'Do you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => handleRemoveTask(id),
        }
      ],
      { cancelable: true }
    )
  }

  const handleRemoveTask = async (id) => {
    try {

      const tasksJSON = await AsyncStorage.getItem(TASKS_KEY);
      const tasksParse = JSON.parse(tasksJSON);

      const updatedTasks = tasksParse.filter(task => task.id != id);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));

      getTasks();
    } catch (err) {
      console.log('Error: ', err);

    }
  }

  const TableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.header, styles.tableHeaderDate]}>Date</Text>
      <Text style={[styles.header, styles.tableHeaderTime]}>Time</Text>
      <Text style={[styles.header, styles.tableHeaderValue]}>Task</Text>
      <Text style={[styles.header, styles.tableHeaderDel]}>Del</Text>
    </View>
  );

  const renderItems = ({ item }) => {
    return (
      <View style={styles.renderContainer}>
        <Text style={[styles.cell, styles.itemDate]}>{item.date}</Text>
        <Text style={[styles.cell, styles.itemTime]}>{item.time}</Text>
        <Text style={[styles.cell, styles.itemValue]}>{item.value}</Text>
        <Pressable style={[styles.cell, styles.itemDel]} onPress={() => { isConfirm(item.id) }}>
          <MaterialIcons name="delete" size={24} color="black" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TableHeader />
      <FlatList
        style={styles.flatList}
        data={tasks}
        renderItem={renderItems}
        keyExtractor={item => item.id}
      />

      <View style={styles.line} />

      <View style={styles.bottomContainer}>
        {showModal ? (
          <View>
            <AddTask style={styles.addTask} toggleClose={toggleModalClose} close={setShowModal} isModalVisible={showModal} getTasks={getTasks}/>
          </View>
        ) : (
          <View>
            <CircleBtn style={styles.circleBtn} toggleOpen={toggleModalOpen} isModalVisible={showModal} />
          </View>
        )}

      </View>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgorund,
    alignItems: 'center',
    padding: 25,
    paddingTop: 40,

  },
  tableHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    fontSize: 50,
    fontWeight: '900',
    borderWidth: 1,
    paddingLeft: 5,
    borderBlockColor: 'grey',

  },
  header: {
    flex: 2,
    fontSize: 18,
    fontWeight: '900',
  },
  tableHeaderValue: {
    flex: 4,
  },
  tableHeaderDel: {
    flex: 1,
  },
  cell: {
    flex: 2,
    alignSelf: 'center',
  },
  itemValue: {
    flex: 4,
  },
  itemDel: {
    flex: 1,
  },
  renderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBlockColor: 'grey',
    borderWidth: 1,
    borderTopWidth: 0,
    minHeight: 50,
    paddingLeft: 5,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.secondary,
    marginBottom: 15,
    marginTop: 15,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  circleBtn: {
    width: '100%',
    padding: 25,
  },
  tasks: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default App;