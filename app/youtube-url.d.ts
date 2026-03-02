declare module 'youtube-url' {
  export const valid: (url: string) => boolean;
  export const extractId: (url: string) => string | null;
  export const regex: RegExp;
}
