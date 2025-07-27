import CartButton from '@/components/CartButton'
import Filter from '@/components/Filter'
import MenuCard from '@/components/MenuCard'
import SearchBar from '@/components/SearchBar'
import { getCategories, getMenus } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import useAuthStore from '@/store/auth.store'
import { MenuItem } from '@/type'
import cn from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {
  const { logout } = useAuthStore();
  const { query, category } = useLocalSearchParams<{ query: string; category: string }>();

  const { data, loading, error, refetch } = useAppwrite({ fn: getMenus, params: { category, query, limit: 6 } })
  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [query, category])


  return (
    <SafeAreaView className='bg-white h-full'>
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-primary mb-4'>Loading...</Text>
          {/* You can replace this with an ActivityIndicator for a spinner if you use react-native's built-in component */}
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            const isFirstRightColItem = index % 2 === 0;
            return (
              <View className={cn("flex-1 mx-w-[48%]", isFirstRightColItem ? "mt-0" : "mt-10")}>
                <MenuCard item={item as MenuItem} />
              </View>
            )
          }}
          keyExtractor={item => item.$id}
          numColumns={2}
          columnWrapperClassName='gap-7'
          contentContainerClassName='gap-7 px-5 pb-32'
          ListHeaderComponent={() => (
            <View className='my-5 gap-5'>
              <View className='flex-between flex-row w-full'>
                <View className='flex-start'>
                  <Text className='small-bold uppercase text-primary'>Search</Text>
                  <View className='flex-start flex-row gap-x-1 mt-0.5'>
                    <Text className='paragraph-semibold text-dark-100'>Find your favorite food</Text>
                  </View>
                </View>
                <CartButton />
              </View>

              <SearchBar />

              <Filter categories={categories} />
            </View>
          )}
          ListEmptyComponent={() => !loading && <Text>No results</Text>}
        />
        // <Button
        //   title="Sign out"
        //   onPress={() => {
        //     logout().catch((error) => {
        //       console.error("Sign out error:", error.message || error.toString());
        //       <Redirect href="/sign-in" />
        //     });
        //   }}
        // /> 
      )}
    </SafeAreaView>
  )
}

export default Search