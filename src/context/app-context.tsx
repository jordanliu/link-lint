import { useSQLiteContext } from 'expo-sqlite';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Repository } from '@/db/repository';
import { AppSettings, EditorDraft, LaunchAttempt, PlatformTarget, SavedLink } from '@/domain/types';
import { dark, light } from '@/constants/theme';

type AppData = {
  repo: Repository; loading: boolean; error: string | null; savedLinks: SavedLink[];
  history: LaunchAttempt[]; sensitiveNames: string[]; settings: AppSettings; draft: EditorDraft; colors: typeof light;
  reload: () => Promise<void>; setDraft: (draft: EditorDraft) => Promise<void>; updateSettings: (settings: AppSettings) => Promise<void>;
};
const devicePlatform:PlatformTarget=Platform.OS==='android'?'android':'ios';
const defaults: AppSettings = { defaultPlatform:devicePlatform,defaultEnvironmentId:1,confirmBeforeOpen:false,reopenLastLink:false,maskSensitive:true,retentionDays:30,appearance:'system' };
const defaultDraft:EditorDraft={link:'',platform:devicePlatform,environmentId:1,savedLinkId:null};
const Context=createContext<AppData|null>(null);

export function AppDataProvider({children}:PropsWithChildren){
  const db=useSQLiteContext(); const repo=useMemo(()=>new Repository(db),[db]); const system=useColorScheme();
  const [loading,setLoading]=useState(true); const [error,setError]=useState<string|null>(null);
  const [savedLinks,setSavedLinks]=useState<SavedLink[]>([]);
  const [history,setHistory]=useState<LaunchAttempt[]>([]); const [sensitiveNames,setSensitiveNames]=useState<string[]>([]);
  const [settings,setSettings]=useState(defaults); const [draft,setDraftState]=useState(defaultDraft);
  const reload=useCallback(async()=>{try{setError(null);const c=await repo.settings();await repo.purgeHistory(c.retentionDays);const [s,h,n,d]=await Promise.all([repo.savedLinks(),repo.history(),repo.sensitiveNames(),repo.draft()]);setSavedLinks(s);setHistory(h);setSensitiveNames(n);setSettings(c);setDraftState({...d,platform:devicePlatform});}catch(err){setError(err instanceof Error?err.message:'Could not load local data.');}finally{setLoading(false);}},[repo]);
  useEffect(()=>{void Promise.resolve().then(reload);},[reload]);
  const setDraft=useCallback(async(d:EditorDraft)=>{setDraftState(d);try{await repo.saveDraft(d);}catch(err){setError(err instanceof Error?err.message:'Could not save the editor draft.');}},[repo]);
  const updateSettings=useCallback(async(s:AppSettings)=>{setSettings(s);try{await repo.updateSettings(s);await repo.purgeHistory(s.retentionDays);setHistory(await repo.history());}catch(err){setError(err instanceof Error?err.message:'Could not save settings.');}},[repo]);
  const actual=settings.appearance==='system'?(system==='dark'?'dark':'light'):settings.appearance;
  const value=useMemo(()=>({repo,loading,error,savedLinks,history,sensitiveNames,settings,draft,colors:(actual==='dark'?dark:light) as typeof light,reload,setDraft,updateSettings}),[repo,loading,error,savedLinks,history,sensitiveNames,settings,draft,actual,reload,setDraft,updateSettings]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppData(){const value=useContext(Context);if(!value)throw new Error('useAppData must be used inside AppDataProvider');return value;}
