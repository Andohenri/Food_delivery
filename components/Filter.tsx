import { Category } from '@/type';
import cn from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Platform, Text, TouchableOpacity } from 'react-native';


const Filter = ({ categories }: { categories: Category[] }) => {
   const searchParams = useLocalSearchParams();
   const [active, setActive] = useState(searchParams.category || 'all');

   const handlePress = (id: string) => {
      setActive(id);
      if (id === 'all') router.setParams({ category: undefined });
      else router.setParams({ category: id });
   };

   const filterData: (Category | { $id: string; name: string })[] = categories
      ? [{ $id: 'all', name: 'All' }, ...categories]
      : [{ $id: 'all', name: 'All' }];
      
   return (
      <FlatList
         data={filterData}
         renderItem={({ item }) => (
            <TouchableOpacity
               key={item.$id}
               className={cn('filter', active === item.$id ? 'bg-amber-500' : 'bg-white')}
               style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}
               onPress={() => handlePress(item.$id)}
            >
               <Text className={cn('body-medium', active === item.$id ? 'text-white' : 'text-primary')}>{item.name}</Text>
            </TouchableOpacity>
         )}
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerClassName='gap-x-2 pb-3'
         keyExtractor={item => item.$id}
      />
   )
}

export default Filter