import { FlashList } from '@shopify/flash-list';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faker } from '@faker-js/faker';

interface ItemDTO {
  id: number;
  title: string;
  description: string;
}

const COUNT_ITEMS = 1000;

const delay = (ms: number) => new Promise(res => setTimeout(() => res(true), ms));

const getItems = async () => {
  await delay(2000);

  return Array.from({ length: COUNT_ITEMS }, (_, i) => ({
    id: i,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
  }));
};

const App = () => {
  const [data, setData] = useState<ItemDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlashList<ItemDTO>>(null);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };

  useEffect(() => {
    setIsLoading(true);

    getItems()
      .then(response => setData(response))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: 500 });
    }, 500);
  }, [isLoading]);

  const handlePressAction = (index: number) => {
    listRef.current?.scrollToIndex({ index });
    console.log('scroll to:', index);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        {isLoading && <ActivityIndicator size="large" />}

        {!isLoading && data && (
          <View style={styles.container}>
            <FlashList
              ref={listRef}
              data={data}
              initialScrollIndex={500}
              estimatedItemSize={100}
              renderItem={({ item }) => <Item {...item} />}
              ListHeaderComponent={() => <Text style={styles.headerText}>Products</Text>}
            />
            <Actions onPress={handlePressAction} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const Item: FC<ItemDTO> = ({ id, title, description }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>
        {id}. {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const Actions: FC<{ onPress: (i: number) => void }> = ({ onPress }) => (
  <View style={actionsStyles.container}>
    <Text style={actionsStyles.actions} onPress={() => onPress(0)}>
      top
    </Text>
    <Text
      style={actionsStyles.actions}
      onPress={() => onPress(Math.floor(Math.random() * COUNT_ITEMS))}>
      random
    </Text>
  </View>
);

const actionsStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actions: {
    marginHorizontal: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: Dimensions.get('screen').width,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 32,
  },
  item: {
    padding: 16,
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
  },
  description: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
