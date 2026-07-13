import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export async function readClipboardText(): Promise<string | null> {
  try {
    const value = await Clipboard.getStringAsync();
    if (!value) throw new Error('The clipboard does not contain text, or paste access was denied.');
    return value;
  } catch (error) {
    Alert.alert('Couldn’t paste', error instanceof Error ? error.message : 'Clipboard access failed.');
    return null;
  }
}

export async function copyText(value: string): Promise<boolean> {
  try {
    const copied = await Clipboard.setStringAsync(value);
    if (!copied) throw new Error('The operating system did not accept the copied text.');
    return true;
  } catch (error) {
    Alert.alert('Couldn’t copy', error instanceof Error ? error.message : 'Clipboard access failed.');
    return false;
  }
}
