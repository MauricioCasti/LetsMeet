import React, { useContext } from 'react'
import { Button, Text } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import GlobalStyles from '../styles/GlobalStyles'
import { REQUEST, sendData } from '../core/server'
import { UserContext } from '../core/UserContext'

export default function EventScreen({ route, navigation }) {
  const eventData = route.params
  const { userId } = useContext(UserContext)

  const removeEvent = () => {
    sendData(REQUEST.REMOVEEVENT, {
      eventid: eventData['eventid'],
      userid: userId,
    }).then(() => navigation.goBack())
  }

  const leaveEvent = () => {
    sendData(REQUEST.LEAVEEVENT, {
      eventid: eventData['eventid'],
      userid: userId,
    }).then(() => navigation.goBack())
  }

  const joinEvent = () => {
    sendData(REQUEST.PARTICIPANT, {
      eventid: eventData['eventid'],
      userid: userId,
    }).then(() => navigation.goBack())
  }

  const actionButton = () => {
    if (userId === eventData.host.userid) {
      return (
        <Button color="red" onPress={removeEvent}>
          Delete
        </Button>
      )
    }

    if (eventData.participants.some((user) => user.userid === userId)) {
      return (
        <Button color="red" onPress={leaveEvent}>
          Leave
        </Button>
      )
    }
    return (
      <Button color="blue" onPress={joinEvent}>
        Join
      </Button>
    )
  }

  return (
    <View style={{ ...GlobalStyles.background, alignItems: 'flex-start' }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={GlobalStyles.header}>{eventData.name}</Text>
        {actionButton()}
      </View>
      <View style={styles.eventInfo}>
        <Text>Host: {eventData.host.name}</Text>
        <Text>Date: {eventData.date}</Text>
      </View>
      <Text style={GlobalStyles.header}>About</Text>
      <Text style={styles.eventInfo}>{eventData.description}</Text>
      <Text style={GlobalStyles.header}>Participants</Text>
      <View style={styles.eventInfo}>
        {eventData.participants.map((user) => (
          <Text key={user.userid}>{user.name}</Text>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  eventInfo: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 20,
  },
})