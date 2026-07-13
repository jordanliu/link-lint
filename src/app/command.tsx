import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Share, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Label, Mono, Pill, Screen } from '@/components/ui';
import { palette } from '@/constants/theme';
import { useAppData } from '@/context/app-context';
import { generateCommand } from '@/domain/link-utils';
import { PlatformTarget } from '@/domain/types';
import { copyText } from '@/utils/clipboard';

export default function CommandScreen(){
 const {colors,draft}=useAppData(); const [target,setTarget]=useState<PlatformTarget>(Platform.OS==='android'?'android':'ios'); const command=generateCommand(draft.link,target);
 return <Screen title="Command Generator" subtitle="Run this link from a development machine" action={<Button label="Done" kind="secondary" onPress={()=>router.back()}/>}><View style={s.pills}><Pill label="iOS Simulator" selected={target==='ios'} onPress={()=>setTarget('ios')}/><Pill label="Android ADB" selected={target==='android'} onPress={()=>setTarget('android')}/></View><Card tint={target==='ios'?palette.lavender:palette.blueSoft}><Label>{target==='ios'?'Simulator command':'ADB command'}</Label><Mono>{command}</Mono></Card><Text style={{color:colors.muted,lineHeight:20}}>Commands use POSIX-safe quoting, including links containing apostrophes.</Text><Button label="Copy Command" icon={{ios:'doc.on.doc',android:'content_copy'} as any} onPress={()=>void copyText(command)}/><Button label="Share Command" kind="secondary" icon={{ios:'square.and.arrow.up',android:'share'} as any} onPress={()=>Share.share({message:command})}/></Screen>;
}
const s=StyleSheet.create({pills:{flexDirection:'row',gap:8,flexWrap:'wrap'}});
