import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/constants/theme';
import { useAppData } from '@/context/app-context';

const icon=(ios:string,android:string)=>function TabIcon(p:{color:ColorValue;size:number}){return <SymbolView name={{ios,android} as any} size={p.size} tintColor={p.color}/>;};
export default function TabLayout(){const{colors}=useAppData();const insets=useSafeAreaInsets();return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:palette.blue,tabBarInactiveTintColor:colors.muted,tabBarShowLabel:true,tabBarLabelStyle:{fontSize:10,fontWeight:'600'},tabBarItemStyle:{borderRadius:16,marginHorizontal:2},tabBarStyle:{position:'absolute',left:0,right:0,bottom:Math.max(insets.bottom,16),height:64,marginHorizontal:18,paddingHorizontal:10,paddingTop:6,paddingBottom:7,borderTopWidth:StyleSheet.hairlineWidth,borderColor:colors.border,borderRadius:22,backgroundColor:colors.tab,shadowColor:'#000',shadowOpacity:Platform.OS==='ios'?.08:.12,shadowRadius:14,shadowOffset:{width:0,height:6},elevation:7}}}>
  <Tabs.Screen name="index" options={{title:'Editor',tabBarIcon:icon('link.badge.plus','add_link')}}/>
  <Tabs.Screen name="saved" options={{title:'Saved',tabBarIcon:icon('bookmark','bookmark')}}/>
  <Tabs.Screen name="history" options={{title:'History',tabBarIcon:icon('clock','history')}}/>
  <Tabs.Screen name="settings" options={{title:'Settings',tabBarIcon:icon('gearshape','settings')}}/>
 </Tabs>}
