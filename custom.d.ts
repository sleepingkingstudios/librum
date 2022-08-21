declare module '*.css' {
  const content: any;

  export default content;
}

declare module 'uuid' {
  export function v4(): string;
}
