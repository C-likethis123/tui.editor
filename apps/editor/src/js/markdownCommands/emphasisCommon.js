/**
 * @fileoverview This file is common logic for italic, bold, strike makrdown commands.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * range expand according to expendSize
 * If can not expand, return null
 * @param {range} range - range
 * @param {number} expendSize - expendSize
 * @returns {object} expanded range or null
 * @ignore
 */
const getExpandedRange = (range, expendSize) => {
  const { start, end } = range;
  let expendRange;

  if (start.ch >= expendSize) {
    const from = {
      line: start.line,
      ch: start.ch - expendSize
    };
    const to = {
      line: end.line,
      ch: end.ch + expendSize
    };

    expendRange = {
      from,
      to
    };
  }

  return expendRange;
};

/**
 * remove symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
export const removeSyntax = (text, symbol) => {
  const symbolLength = symbol.length;

  return text.substr(symbolLength, text.length - symbolLength * 2);
};

/**
 * append symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
export const appendSyntax = function(text, symbol) {
  return `${symbol}${text}${symbol}`;
};

/**
 * check expanded text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @param {number} expandSize - expandSize
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
export const expandReplace = function(doc, range, expandSize, checker, replacer) {
  const expendRange = getExpandedRange(range, expandSize);
  let result = false;

  if (expendRange) {
    const { from, to } = expendRange;
    const expendRangeText = doc.getRange(from, to);

    if (checker(expendRangeText)) {
      doc.setSelection(from, to);
      doc.replaceSelection(replacer(expendRangeText), 'around');
      result = true;
    }
  }

  return result;
};

/**
 * check text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {string} text - text
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
export const replace = function(doc, text, checker, replacer) {
  let result = false;

  if (checker(text)) {
    doc.replaceSelection(replacer(text), 'around');
    result = true;
  }

  return result;
};

export const changeSyntax = function(doc, range, symbol, syntaxRegex, contentRegex) {
  const { line, ch } = doc.getCursor();
  const selectionStr = doc.getSelection();
  const symbolLength = symbol.length;
  const isSyntax = t => syntaxRegex.test(t);

  // 1. expand text and check syntax => remove syntax
  // 2. check text is syntax => remove syntax
  // 3. If text does not match syntax, remove syntax inside text and then append syntax
  if (
    !(
      expandReplace(doc, range, symbolLength, isSyntax, t => removeSyntax(t, symbol)) ||
      replace(doc, selectionStr, isSyntax, t => removeSyntax(t, symbol))
    )
  ) {
    const removeSyntaxInsideText = selectionStr.replace(contentRegex, '$1');

    doc.replaceSelection(appendSyntax(removeSyntaxInsideText, symbol), 'around');
  }

  const afterSelectStr = doc.getSelection();
  let size = ch;

  if (!selectionStr) {
    // If text was not selected, after replace text, move cursor
    // For example **|** => | (move cusor -symbolLenth)
    if (isSyntax(afterSelectStr)) {
      size += symbolLength;
    } else {
      size -= symbolLength;
    }
    doc.setCursor(line, size);
  }
};

/**
 * remove HTML tag in the front and back of text
 * @param {string} text - text
 * @param {string} openingTag - text
 * @returns {string}
 * @ignore
 */
function removeHtmlTags(text, symbol) {
  const symbolLength = symbol.length;
  const removedString = text.substr(symbolLength, text.length - (symbolLength * 2 + 1));

  return removedString;
}

/**
 * append HTML tag in the front and back of text
 * @param {string} text - text
 * @param {string} openingTag - text
 * @param {string} closingTag - text
 * @returns {string}
 * @ignore
 */
export const appendHtmlTags = function(text, openingTag, closingTag) {
  return `${openingTag}${text}${closingTag}`;
};

export const getClosingTag = function(openingHtmlTag) {
  return openingHtmlTag.replace('<', '</');
};

/**
 * check expanded HTML and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @param {number} expandSize - expandSize
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
export const expandReplaceHtmlTags = function(doc, range, expandSize, checker, replacer) {
  const expendRange = getExpandedRange(range, expandSize);
  let result = false;

  if (expendRange) {
    const { from, to } = expendRange;

    to.ch += 1;
    const expendRangeText = doc.getRange(from, to);

    if (checker(expendRangeText)) {
      doc.setSelection(from, to);
      doc.replaceSelection(replacer(expendRangeText), 'around');
      result = true;
    }
  }

  return result;
};

export const changeSyntaxHtmlTags = function(doc, range, openingTag, syntaxRegex, contentRegex) {
  const { line, ch } = doc.getCursor();
  const selectionStr = doc.getSelection();
  const symbolLength = openingTag.length;
  const closingTag = getClosingTag(openingTag);
  const isSyntax = t => syntaxRegex.test(t);

  if (
    !(
      expandReplaceHtmlTags(doc, range, symbolLength, isSyntax, t =>
        removeHtmlTags(t, openingTag)
      ) || replace(doc, selectionStr, isSyntax, t => removeHtmlTags(t, openingTag))
    )
  ) {
    const removeSyntaxInsideText = selectionStr.replace(contentRegex, '$1');

    doc.replaceSelection(appendHtmlTags(removeSyntaxInsideText, openingTag, closingTag), 'around');
  }

  const afterSelectStr = doc.getSelection();
  let size = ch;

  if (!selectionStr) {
    // If text was not selected, after replace text, move cursor
    // For example **|** => | (move cusor -symbolLenth)
    if (isSyntax(afterSelectStr)) {
      size += symbolLength;
    } else {
      size -= symbolLength;
    }
    doc.setCursor(line, size);
  }
};
