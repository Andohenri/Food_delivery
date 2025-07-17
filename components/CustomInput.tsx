import { CustomInputProps } from '@/type';
import cn from 'clsx';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';


const CustomInput = ({ placeholder = 'Enter text', value, onChangeText, label, secureTextEntry = false, keyboardType = 'default' }: CustomInputProps) => {
   const [focused, setFocused] = useState(false)
   return (
      <View className='w-full'>
         <Text className='label'>{label}</Text>
         <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={'#888'}
            className={cn('input', focused ? 'border-primary' : 'border-gray-300')}
         />
      </View>
   )
}

export default CustomInput