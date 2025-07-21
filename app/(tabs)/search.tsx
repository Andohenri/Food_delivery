import seed from '@/lib/seed'
import useAuthStore from '@/store/auth.store'
import { Redirect } from 'expo-router'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {
  const { logout } = useAuthStore();
  return (
    <SafeAreaView>
      <Text className='text-lg font-quicksand-bold'>Search</Text>
      <Button
        title="Seed Database"
        onPress={() => seed().catch((error) => {
          console.error("Seeding error:", error.message || error.toString());
        })}
      />
      <Button
        title="Sign out"
        onPress={() => {
          logout().catch((error) => {
            console.error("Sign out error:", error.message || error.toString());
            <Redirect href="/sign-in" />
          });
        }}
      />
    </SafeAreaView>
  )
}

export default Search