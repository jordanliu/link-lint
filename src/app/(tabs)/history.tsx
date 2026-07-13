import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Card, Empty, IconButton, Label, Mono, Pill, Screen } from '@/components/ui';
import { palette } from '@/constants/theme';
import { useAppData } from '@/context/app-context';
import { maskLink } from '@/domain/link-utils';
import { PlatformTarget } from '@/domain/types';
import { copyText } from '@/utils/clipboard';

export default function HistoryScreen(){
 const {history,sensitiveNames,settings,draft,setDraft,repo,reload}=useAppData();
 const platform:PlatformTarget=Platform.OS==='android'?'android':'ios';
 const edit=(h:(typeof history)[number])=>{void setDraft({...draft,link:h.finalLink,platform,savedLinkId:h.savedLinkId});router.navigate('/');};
 const reopen=async(h:(typeof history)[number])=>{const id=await repo.createAttempt({link:h.finalLink,platform,environmentId:null,environmentName:'This device',savedLinkId:h.savedLinkId});try{await Linking.openURL(h.finalLink);await repo.finishAttempt(id,'succeeded');}catch(error){await repo.finishAttempt(id,'failed','handoff_failed',error instanceof Error?error.message:'Could not open link.');}await reload();};
 const menu=(h:(typeof history)[number])=>Alert.alert('Launch actions',h.finalLink,[
  {text:'Open Again',onPress:()=>reopen(h)},
  {text:'Edit in Editor',onPress:()=>edit(h)},
  {text:'Copy raw link',onPress:()=>void copyText(h.finalLink)},
  {text:'Save Link',onPress:async()=>{await repo.saveLink({name:`Link from ${new Date(h.attemptedAt).toLocaleDateString()}`,link:h.finalLink,platform,environmentId:null,notes:''});await reload();}},
  {text:'Delete',style:'destructive',onPress:async()=>{await repo.deleteAttempt(h.id);await reload();}},
  {text:'Cancel',style:'cancel'},
 ]);
 return <Screen title="History" subtitle="Operating-system handoff attempts">{history.length?history.map(h=><Card key={h.id}><View style={s.row}><View style={{flex:1,gap:5}}><Label>{new Date(h.attemptedAt).toLocaleString()}</Label><Mono numberOfLines={3}>{settings.maskSensitive?maskLink(h.finalLink,sensitiveNames):h.finalLink}</Mono></View><IconButton label="History actions" name={{ios:'ellipsis',android:'more_horiz'} as any} onPress={()=>menu(h)}/></View><View style={s.tags}><Pill label={h.handoffResult} tint={h.handoffResult==='failed'?palette.blush:h.handoffResult==='pending'?palette.sand:palette.blueSoft}/>{h.reportedResult?<Pill label={`Destination: ${h.reportedResult.replace('_',' ')}`}/>:null}</View>{h.errorMessage?<Text style={{color:palette.danger}}>{h.errorMessage}</Text>:null}</Card>):<Empty title="No history" body="Opened links appear here."/>}</Screen>;
}
const s=StyleSheet.create({row:{flexDirection:'row',gap:12},tags:{flexDirection:'row',gap:7,flexWrap:'wrap'}});
