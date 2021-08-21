export const variableRegExp = /\{\s*[a-z0-9_]+\d*\s*\}/i;

export function hasPromptVariables(prompt: string,): boolean {
    return variableRegExp.test(prompt);
}