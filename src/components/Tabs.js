import React, { useEffect, useState } from 'react';
import index from '../screens/index';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import homeStacks from './homeStacks';



const Tab = createBottomTabNavigator()

const Tabs = () => {

  return (
      <Tab.Navigator>
          <Tab.Screen name={'หน้าหลัก'} component={homeStacks} options={{headerShown:false}}/>


          
      </Tab.Navigator>

  )
}


export default Tabs
