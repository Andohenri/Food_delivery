import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
  const {  fetchAuthenticatedUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setform] = useState({
    email: '',
    password: ''
  });

  const submit = async () => {
    if (!form.email || !form.password) return Alert.alert('Error', 'Please fill all fields');
    setIsSubmitting(true);
    try {
      await signIn(form);
      await fetchAuthenticatedUser();
      Alert.alert('Success', 'User signed in successfully');
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => setform(prev => ({...prev, email: text}))}
        label='Email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Enter your password'
        value={form.password}
        onChangeText={(text) => setform(prev => ({...prev, password: text}))}
        label='Password'
        secureTextEntry={true}
      />
      <CustomButton
        title='Sign In'
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View className='flex justify-center items-center flex-row gap-x-2 mt-5'>
        <Text className='base-regular text-gray-200'>
          Don't have an account ?
        </Text>
        <Link className='base-bold text-primary' href={'/sign-up'}>Sign Up</Link>
      </View>
    </View>
  )
}

export default SignIn