import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Body, Card, Empty, Field, IconButton, Mono, Screen } from '@/components/ui';
import { useAppData } from '@/context/app-context';
import { PlatformTarget } from '@/domain/types';
import { copyText } from '@/utils/clipboard';

export default function SavedScreen(){
 const {colors,savedLinks,draft,setDraft,repo,reload}=useAppData(); const [q,setQ]=useState(''); const platform:PlatformTarget=Platform.OS==='android'?'android':'ios';
 const links=useMemo(()=>savedLinks.filter(l=>`${l.name} ${l.link} ${l.notes}`.toLowerCase().includes(q.toLowerCase())),[savedLinks,q]);
 const open=(l:(typeof savedLinks)[number])=>{void setDraft({...draft,link:l.link,platform,savedLinkId:l.id});router.navigate('/');};
 const menu=(l:(typeof savedLinks)[number])=>Alert.alert(l.name,l.link,[{text:'Open in Editor',onPress:()=>open(l)},{text:'Copy link',onPress:()=>void copyText(l.link)},{text:'Duplicate',onPress:async()=>{await repo.saveLink({name:`${l.name} Copy`,link:l.link,platform,environmentId:null,notes:l.notes});await reload();}},{text:'Delete',style:'destructive',onPress:()=>Alert.alert('Delete saved link?','This cannot be undone.',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await repo.deleteSaved(l.id);await reload();}}])},{text:'Cancel',style:'cancel'}]);
 return <Screen title="Saved Links" subtitle={`${savedLinks.length} reusable ${savedLinks.length===1?'link':'links'}`}>{savedLinks.length?<Field value={q} onChangeText={setQ} placeholder="Search links or notes"/>:null}{links.length?links.map(l=><Card key={l.id}><View style={s.row}><View style={{flex:1,gap:5}}><Body style={{fontSize:20,fontWeight:'700'}}>{l.name}</Body><Mono numberOfLines={2}>{l.link}</Mono></View><IconButton label={`Actions for ${l.name}`} name={{ios:'ellipsis',android:'more_horiz'} as any} onPress={()=>menu(l)}/></View>{l.notes?<Text style={{color:colors.muted}} numberOfLines={2}>{l.notes}</Text>:null}</Card>):<Empty title="No saved links" body="Links you save in the Editor appear here."/>}</Screen>;
}
const s=StyleSheet.create({row:{flexDirection:'row',alignItems:'flex-start',gap:12}});
