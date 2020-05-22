/**
 * @fileoverview Stores all keyboard shortcuts for items in the toolbar
 */

import { isMac } from './utils/common';

export const keyMaps = {
  bold: ['CTRL+B', 'META+B'],
  underline: ['CTRL+U', 'META+U'],
  italic: ['CTRL+I', 'META+I'],
  strike: ['CTRL+S', 'META+S'],
  hr: ['CTRL+L', 'META+L'],
  code: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
  codeblock: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
  ul: ['SHIFT+CTRL+U', 'SHIFT+META+U'],
  ol: ['CTRL+O', 'META+O'],
  quote: ['ALT+Q', 'ALT+Q'],
  task: ['ALT+T', 'ALT+T']
};

export function getFormattedKeyboardShortcuts(toolbarItem) {
  const [shortcut] = keyMaps[toolbarItem];

  if (isMac) {
    return shortcut
      .replace('CTRL', 'Command')
      .replace('SHIFT', 'Shift')
      .replace('ALT', 'Option');
  }
  return shortcut
    .replace('CTRL', 'Ctrl')
    .replace('SHIFT', 'Shift')
    .replace('ALT', 'Alt');
}
