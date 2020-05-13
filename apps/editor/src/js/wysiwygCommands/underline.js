/**
 * @fileoverview Implements underline WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Underline
 * Add underline to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Underline
 * @ignore
 */
const Underline = CommandManager.command(
  'wysiwyg',
  /** @lends Underline */ {
    name: 'Underline',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

      wwe.focus();

      if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
        tableSelectionManager.styleToSelectedCells(styleUnderline);

        const range = sq.getSelection();

        range.collapse(true);
        sq.setSelection(range);
      } else {
        styleUnderline(sq);
        domUtils.optimizeRange(sq.getSelection(), 'B');
      }
    }
  }
);

/**
 * Style underline.
 * @param {object} sq - squire editor instance
 */
function styleUnderline(sq) {
  if (sq.hasFormat('u') || sq.hasFormat('ins')) {
    sq.changeFormat(null, { tag: 'u' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.underline();
  }
}

export default Underline;
