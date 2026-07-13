import { QueryParameter } from './types';

export type ParsedLink = { valid: true; url: URL; scheme: string; host: string; path: string; fragment: string; params: QueryParameter[] } | { valid: false; message: string };

export function parseLink(raw: string): ParsedLink {
  const value = raw.trim();
  if (!value) return { valid: false, message: 'Paste or enter a link to begin.' };
  if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return { valid: false, message: 'Add a URL scheme, such as https:// or myapp://.' };
  try {
    const url = new URL(value);
    const params = Array.from(url.searchParams.entries()).map(([key, val], index) => ({ id: `${index}-${key}`, key, value: val }));
    return { valid: true, url, scheme: url.protocol.slice(0, -1), host: url.host, path: url.pathname || '/', fragment: url.hash.slice(1), params };
  } catch { return { valid: false, message: 'This link has invalid URL syntax.' }; }
}

export function withQueryParameters(raw: string, params: QueryParameter[]): string {
  const url = new URL(raw);
  url.search = '';
  params.forEach(({ key, value }) => key && url.searchParams.append(key, value));
  return url.toString();
}

export function maskLink(raw: string, names: string[]): string {
  try {
    const url = new URL(raw); const sensitive = new Set(names.map((n) => n.toLowerCase()));
    const pairs = Array.from(url.searchParams.entries()); url.search = '';
    pairs.forEach(([key, value]) => url.searchParams.append(key, sensitive.has(key.toLowerCase()) ? '••••' : value));
    return url.toString();
  } catch { return raw; }
}

const quote = (value: string) => `'${value.replace(/'/g, `'"'"'`)}'`;
export function generateCommand(link: string, platform: 'android' | 'ios'): string {
  return platform === 'android'
    ? `adb shell am start -a android.intent.action.VIEW -d ${quote(link)}`
    : `xcrun simctl openurl booted ${quote(link)}`;
}
