import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string, filter?: string }>();
  const { data: latestProperties, loading: latestPropertiesLoading } = useAppwrite({
    fn: getLatestProperties
  });
  const { data: properties, loading, refetch } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6
    },
    skip: true
  });
  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`)
  }
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6
    });
  }, [params.filter, params.query])
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties}
        numColumns={2}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ?
            <ActivityIndicator size={"large"} className="text-primary-300 mt-5" /> :
            <NoResults />
        }
        renderItem={({ item, index }) => <Card key={item.$id} item={item} onPress={() => { handleCardPress(item.$id) }} />}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
                </TouchableOpacity>
              </View>
              {latestPropertiesLoading ?
                <ActivityIndicator size={"large"} className="text-primary-300" />
                :
                !latestProperties || latestProperties.length === 0 ?
                  <NoResults />
                  :
                  <FlatList
                    data={latestProperties}
                    horizontal
                    keyExtractor={(item) => item.$id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex gap-5 mt-5"
                    bounces={false}
                    renderItem={({ item, index }) => <FeaturedCard key={item.$id} item={item} onPress={() => { handleCardPress(item.$id) }} />}
                  />
              }
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
