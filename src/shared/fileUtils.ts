export const getLanguageFromFilename = (filename: string): string => {
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.cpp')) return 'cpp';
    if (filename.endsWith('.java')) return 'java';
    return 'plaintext';
};