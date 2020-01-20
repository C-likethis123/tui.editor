/**
 * @fileoverview Implements ui mode switch
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import UIController from './uicontroller';
import i18n from '../i18n';

const MARKDOWN = 'markdown';
const WYSIWYG = 'wysiwyg';

/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @param {jQuery} $rootElement - root jquery element
 * @param {string} initialType - initial type of editor
 */
class ModeSwitch extends UIController {
  /**
   * mode switch type
   * @property {string} MARKDOWN - Markdown
   * @property {string} WYSIWYG - WYSIWYG
   * @static
   * @ignore
   */
  static TYPE = {
    MARKDOWN,
    WYSIWYG
  };

  /**
   * mode switch buttons
   * @type {Object}
   * @private
   */
  _buttons = {};

  /**
   * current mode
   * @type {String}
   * @private
   */
  _type;

  /**
   * root element
   * @type {jQuery}
   * @private
   */
  _$rootElement;

  constructor($rootElement, initialType) {
    super({
      tagName: 'div',
      className: 'te-mode-switch'
    });

    this._render($rootElement);
    this._switchType(util.isExisty(initialType) ? initialType : MARKDOWN);
  }

  /**
   * is the switch tab bar shown
   * @returns {Boolean} - showing status
   */
  isShown() {
    return this._$rootElement.css('display') === 'block';
  }

  /**
   * show switch tab bar
   */
  show() {
    this._$rootElement.css('display', 'block');
  }

  /**
   * hide switch tab bar
   */
  hide() {
    this._$rootElement.css('display', 'none');
  }

  _render($rootElement) {
    this._buttons.$markdown = $(
      `<button class="te-switch-button markdown" type="button">${i18n.get('Markdown')}</button>`
    );
    this._buttons.$wysiwyg = $(
      `<button class="te-switch-button wysiwyg" type="button">${i18n.get('WYSIWYG')}</button>`
    );
    this.$el.append(this._buttons.$markdown);
    this.$el.append(this._buttons.$wysiwyg);

    if ($rootElement) {
      $rootElement.append(this.$el);
      this._$rootElement = $rootElement;
    }

    this.on('click .markdown', this._changeMarkdown.bind(this));
    this.on('click .wysiwyg', this._changeWysiwyg.bind(this));

    this.show();
  }

  _changeMarkdown() {
    this._switchType(MARKDOWN);
  }

  _changeWysiwyg() {
    this._switchType(WYSIWYG);
  }

  _setActiveButton(type) {
    this._buttons.$markdown.removeClass('active');
    this._buttons.$wysiwyg.removeClass('active');
    this._buttons[`$${type}`].addClass('active');
  }

  _switchType(type) {
    if (this._type === type) {
      return;
    }

    this._type = type;
    this._setActiveButton(type);
    this.trigger('modeSwitched', this._type);
  }
}

export default ModeSwitch;
