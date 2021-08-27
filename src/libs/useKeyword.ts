export const variableRegExp = /\{\s*[a-z0-9_]+\d*\s*\}/i;
export const splitRegExp = /\s*,\s*/;

export function hasPromptVariables(prompt: string): boolean {
    return variableRegExp.test(prompt);
}

export function makeKeywordPattern(i: number): string {
    return `\\{{2}\\s*(variable${i})\\s*\\}{2}`
}