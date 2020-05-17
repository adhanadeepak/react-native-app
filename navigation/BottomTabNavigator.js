import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import LinksScreen from '../screens/LinksScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route), headerMode: 'none' });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
          params: { reload: true,}
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Store',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-albums" />,
        }}
      />
        <BottomTab.Screen
            name="Cart"
            component={CartScreen}
            options={{
                title: 'Cart',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-appstore" />,
                initialParams: {reload: true}
            }}
        />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Store';
    case 'Links':
      return 'Configure products';
    case 'Cart':
          return 'Shopping cart';
  }
}

function getHeaderStyle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return { height: 0};
    case 'Links':
      return 'Configure products';
  }
}
