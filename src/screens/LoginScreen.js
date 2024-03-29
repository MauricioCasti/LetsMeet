import React, { useState, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import GlobalStyles from '../styles/GlobalStyles'
import TextInput from '../components/TextInput'
import { sendData, REQUEST } from '../core/server'
import { UserContext } from '../core/UserContext'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const { setUserId } = useContext(UserContext)

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    sendData(REQUEST.LOGIN, {
      email: email.value,
      password: password.value,
    }).then((userId) => {
      if (userId !== -1) {
        setUserId(userId)
        navigation.navigate('Dashboard')
      } else {
        setEmail({
          ...email,
          error: 'This email and password combination does not exist.',
        })
        setPassword({
          ...password,
          error: 'This email and password combination does not exist.',
        })
      }
    })
  }

  const styles = makeStyles(useTheme())

  return (
    <View style={GlobalStyles.background}>
      <Image
        source={require('../assets/meetlogo.png')}
        style={GlobalStyles.logo}
      />
      <Text style={GlobalStyles.header}>Welcome back.</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const makeStyles = (theme) =>
  StyleSheet.create({
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    forgot: {
      fontSize: 13,
      // color: theme.colors.secondary,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    description: {
      fontSize: 13,
      // color: theme.colors.secondary,
      paddingTop: 8,
    },
    error: {
      fontSize: 13,
      // color: theme.colors.error,
      paddingTop: 8,
    },
  })
