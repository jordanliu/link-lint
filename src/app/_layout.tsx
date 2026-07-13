import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { migrateDatabase } from '@/db/database';
import { AppDataProvider } from '@/context/app-context';
import { palette } from '@/constants/theme';

export default function RootLayout(){return <Suspense fallback={<View style={styles.loading}><ActivityIndicator color={palette.blue}/></View>}><SQLiteProvider databaseName="link-lint.db" onInit={migrateDatabase} useSuspense><AppDataProvider><StatusBar style="auto"/><Stack screenOptions={{headerShown:false,animation:'fade'}}><Stack.Screen name="(tabs)"/><Stack.Screen name="command" options={{presentation:'modal'}}/></Stack></AppDataProvider></SQLiteProvider></Suspense>}
const styles=StyleSheet.create({loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F8FA'}});
