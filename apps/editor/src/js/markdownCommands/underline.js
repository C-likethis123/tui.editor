/**
 * @fileoverview Implements Underline markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { changeSyntaxHtmlTags } from './emphasisCommon';

const underlineRangeRegex = /^<u>.*<\/u>$/;
const underlineContentRegex = /<u>([^~]*)<\/u>/g;
const underlineOpeningTag = '<u>';

/**
 * Underline
 * Add underline markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Underline
 * @ignore
 */
const Underline = CommandManager.command(
  'markdown',
  /** @lends Underline */ {
    name: 'Underline',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();
      const originRange = mde.getRange();

      changeSyntaxHtmlTags(doc, originRange, underlineOpeningTag, underlineRangeRegex, underlineContentRegex);

      cm.focus();
    }
  }
);

export default Underline;
