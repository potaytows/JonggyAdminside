import React, { useEffect, useState } from 'react'
import table from '../screens/table'
import { createStackNavigator } from '@react-navigation/stack'
import Index from '../screens/index'
import allRestaurants from '../screens/allRestaurants'
import Restaurant from '../screens/Restaurant'
import User from '../screens/usermanagement/user'
import allUsers from '../screens/usermanagement/allUsers'
import addRestaurant from '../screens/addRestaurant'
import Promotion from '../screens/promotion'
import Petition from '../screens/petition'
import AddPromotion from '../screens/addPromotion'
import UserHelpScreen from '../screens/userHelp'
import UserTickScreen from '../screens/userTicket'
const Stack = createStackNavigator();

const Stacks = () => {

  return (
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#ff8a24',},headerTintColor:'white'}}>
        
        <Stack.Screen name="Index" component={Index} options={{headerShown:false}}/>
        <Stack.Screen name="allRestaurants" component={allRestaurants} options={{title:"ร้านอาหาร",headerTitleAlign:'center'}}/>
        <Stack.Screen name="allUsers" component={allUsers} options={{title:"จัดการผู้ใช้",headerTitleAlign:'center'}}/>
        <Stack.Screen name="User" component={User} options={({route})=>({title: false})}/>
        <Stack.Screen name="addRestaurant" component={addRestaurant} options={{title:"เพิ่มร้านอาหาร",headerTitleAlign:'center'}}/>
        <Stack.Screen name="Tables"  component={table} options={({ route }) => ({ title: route.params.restaurantName,restaurant_id:route.params.restaurant_id})}/>
        <Stack.Screen name="Restaurant" component={Restaurant} options={({route})=>({title: false})}/>
        <Stack.Screen name="promotion" component={Promotion} options={{title:"โปรโมชัน",headerTitleAlign:'center'}}/>
        <Stack.Screen name="petition" component={Petition} options={{title:"คำร้อง",headerTitleAlign:'center'}}/>
        <Stack.Screen name="addPromotion" component={AddPromotion} options={{title:"เพิ่มโปรโมชัน",headerTitleAlign:'center'}}/>
        <Stack.Screen name="UserHelp" component={UserHelpScreen} options={{title:"เพิ่มโปรโมชัน",headerTitleAlign:'center'}}/>
        <Stack.Screen name="userTicket" component={UserTickScreen} options={{title:"เพิ่มโปรโมชัน",headerTitleAlign:'center'}}/>
        


      </Stack.Navigator>
  )
}


export default Stacks
