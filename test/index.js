var screenreaderTrap = require('../index.js');
var util = require('../util.js');
var testData = require('./data.js');
var trapEl;
var trapNotified;
var untrapNotified;

function doBeforeAll(html) {
  document.querySelector('body').innerHTML = html;

  trapEl = document.querySelector('.trap');

  trapNotified = [];
  untrapNotified = [];

  trapEl.addEventListener('screenreaderTrap', function () {
    trapNotified.push(true);
  });

  trapEl.addEventListener('screenreaderUntrap', function () {
    untrapNotified.push(true);
  });
}

function getAriaHiddenElements() {
  return document.querySelectorAll('[aria-hidden]');
}

function getAriaHiddenTrueElements() {
  return document.querySelectorAll('[aria-hidden="true"]');
}

function getAriaHiddenFalseElements() {
  return document.querySelectorAll('[aria-hidden="false"]');
}

testData.forEach(function (data) {
  describe('makeup-screenreader-trap', function () {
    describe('util before trap is activated', function () {
      beforeAll(function () {
        doBeforeAll(data.html);
      });

      it('should find correct number of siblings', function () {
        expect(util.getSiblings(trapEl).length).toBe(data.numSiblings);
      });

      it('should find correct number of ancestors', function () {
        expect(util.getAncestors(trapEl).length).toBe(data.numAncestors);
      });

      it('should find correct number of siblings of ancestors', function () {
        expect(util.getSiblingsOfAncestors(trapEl).length).toBe(data.numSiblingsOfAncestors);
      });
    });

    describe('when trap is activated', function () {
      beforeAll(function () {
        doBeforeAll(data.html);
        screenreaderTrap.trap(trapEl);
      });

      it('should add aria-hidden=false to trapped element', function () {
        expect(trapEl.getAttribute('aria-hidden')).toBe('false');
      });

      it('should find correct number of elements with aria-hidden attribute', function () {
        expect(getAriaHiddenElements().length).toBe(data.numAriaHiddenAfterTrap);
      });

      it('should find correct number of elements with aria-hidden=true attribute', function () {
        expect(getAriaHiddenTrueElements().length).toBe(data.numAriaHiddenTrueAfterTrap);
      });

      it('should find correct number of elements with aria-hidden=false attribute', function () {
        expect(getAriaHiddenFalseElements().length).toBe(data.numAriaHiddenFalseAfterTrap);
      });

      it('should observe one trap event', function () {
        expect(trapNotified).toEqual([true]);
      });

      it('should not observe any untrap event', function () {
        expect(untrapNotified).toEqual([]);
      });
    });

    describe('when trap is deactivated', function () {
      beforeAll(function () {
        doBeforeAll(data.html);
        screenreaderTrap.untrap();
      });

      it('should find correct number of elements with aria-hidden attribute', function () {
        expect(getAriaHiddenElements().length).toBe(data.numAriaHiddenAfterUntrap);
      });

      it('should find correct number of elements with aria-hidden=true attribute', function () {
        expect(getAriaHiddenTrueElements().length).toBe(data.numAriaHiddenTrueAfterUntrap);
      });

      it('should find correct number of elements with aria-hidden=false attribute', function () {
        expect(getAriaHiddenFalseElements().length).toBe(data.numAriaHiddenFalseAfterUntrap);
      });

      it('should observe a single untrap event', function () {
        expect(untrapNotified).toEqual([true]);
      });

      it('should not observe any trap event', function () {
        expect(trapNotified).toEqual([]);
      });
    });
  });
});
