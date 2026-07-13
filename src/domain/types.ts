export type PlatformTarget = 'android' | 'ios';
export type HandoffResult = 'pending' | 'succeeded' | 'failed';
export type ReportedResult = 'yes' | 'no' | 'not_sure' | null;
export type Appearance = 'system' | 'light' | 'dark';

export interface Environment { id: number; name: string; baseUrl: string; customScheme: string | null; isBuiltIn: boolean; }
export interface SavedLink { id: number; name: string; link: string; platform: PlatformTarget; environmentId: number | null; notes: string; lastUsedAt: string | null; reportedResult: ReportedResult; createdAt: string; updatedAt: string; }
export interface LaunchAttempt { id: number; finalLink: string; attemptedAt: string; platform: PlatformTarget; environmentId: number | null; environmentName: string; handoffResult: HandoffResult; errorCode: string | null; errorMessage: string | null; reportedResult: ReportedResult; savedLinkId: number | null; }
export interface AppSettings { defaultPlatform: PlatformTarget; defaultEnvironmentId: number; confirmBeforeOpen: boolean; reopenLastLink: boolean; maskSensitive: boolean; retentionDays: number; appearance: Appearance; }
export interface EditorDraft { link: string; platform: PlatformTarget; environmentId: number; savedLinkId: number | null; }
export interface QueryParameter { id: string; key: string; value: string; }

