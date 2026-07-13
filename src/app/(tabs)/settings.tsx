import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, Field, IconButton, Label, Pill, Screen } from '@/components/ui';
import { palette } from '@/constants/theme';
import { useAppData } from '@/context/app-context';
import { AppSettings } from '@/domain/types';

export default function SettingsScreen(){
 const {colors,settings,updateSettings,repo,reload,sensitiveNames}=useAppData();
 const [sensitive,setSensitive]=useState('');
 const change=(part:Partial<AppSettings>)=>updateSettings({...settings,...part});
 const row=(label:string,value:boolean,onChange:(v:boolean)=>void)=><View style={s.row}><Text style={[s.text,{color:colors.ink}]}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{true:palette.blue}}/></View>;
 return <Screen title="Settings" subtitle="Privacy and appearance">
  <Card><Label>Opening links</Label>{row('Confirm before opening',settings.confirmBeforeOpen,v=>change({confirmBeforeOpen:v}))}{row('Restore last link on launch',settings.reopenLastLink,v=>change({reopenLastLink:v}))}</Card>
  <Card><Label>Privacy</Label>{row('Mask sensitive parameters',settings.maskSensitive,v=>change({maskSensitive:v}))}<View style={s.addRow}><Field value={sensitive} onChangeText={setSensitive} placeholder="Add parameter name" autoCapitalize="none" style={{flex:1}}/><IconButton label="Add sensitive name" name={{ios:'plus',android:'add'} as any} onPress={async()=>{if(sensitive.trim()){await repo.addSensitiveName(sensitive);setSensitive('');await reload();}}}/></View><View style={s.pills}>{sensitiveNames.map(name=><View key={name} style={[s.sensitiveTag,{backgroundColor:colors.surfaceMuted}]}><Text style={[s.tagText,{color:colors.ink}]}>{name}</Text><Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={`Remove ${name}`} onPress={()=>Alert.alert(`Remove ${name}?`,'It will no longer be masked.',[{text:'Cancel'},{text:'Remove',style:'destructive',onPress:async()=>{await repo.deleteSensitiveName(name);await reload();}}])}><SymbolView name={{ios:'xmark.circle.fill',android:'cancel'} as any} size={17} tintColor={colors.muted}/></Pressable></View>)}</View><Text style={[s.muted,{color:colors.muted}]}>History retention</Text><View style={s.pills}>{[7,30,90,0].map(d=><Pill key={d} label={d===0?'Forever':`${d} days`} selected={settings.retentionDays===d} onPress={()=>change({retentionDays:d})}/>)}</View><Button label="Clear History" kind="secondary" onPress={()=>Alert.alert('Clear launch history?','Saved Links will remain.',[{text:'Cancel'},{text:'Clear',style:'destructive',onPress:async()=>{await repo.clearHistory();await reload();}}])}/></Card>
  <Card><Label>Appearance</Label><View style={s.pills}>{(['system','light','dark'] as const).map(a=><Pill key={a} label={a[0].toUpperCase()+a.slice(1)} selected={settings.appearance===a} onPress={()=>change({appearance:a})}/>)}</View></Card>
  <Card tint={palette.blush}><Label>Local data</Label><Text style={[s.muted,{color:colors.muted}]}>Saved Links, settings, drafts, and history stay in this device’s SQLite database.</Text><Button label="Clear All Local Data" kind="danger" onPress={()=>Alert.alert('Clear all local data?','This permanently removes Saved Links and restores defaults.',[{text:'Cancel'},{text:'Clear everything',style:'destructive',onPress:async()=>{await repo.resetAll();await reload();}}])}/></Card>
 </Screen>;
}
const s=StyleSheet.create({row:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16},addRow:{flexDirection:'row',alignItems:'center',gap:8},sensitiveTag:{minHeight:34,borderRadius:17,paddingLeft:12,paddingRight:7,flexDirection:'row',alignItems:'center',gap:6},tagText:{fontSize:14,fontWeight:'600'},text:{fontSize:17,fontWeight:'400',flex:1},muted:{fontSize:14,lineHeight:20},pills:{flexDirection:'row',gap:8,flexWrap:'wrap'}});
