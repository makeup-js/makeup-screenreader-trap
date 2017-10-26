$_mod.def("/makeup-screenreader-trap$0.0.3/util", function(require, exports, module, __filename, __dirname) { 'use strict';

// filter function for ancestor elements

var filterAncestor = function filterAncestor(item) {
    return item.nodeType === 1 && item.tagName.toLowerCase() !== 'body' && item.tagName.toLowerCase() !== 'html';
};

// filter function for sibling elements
var filterSibling = function filterSibling(item) {
    return item.nodeType === 1 && item.tagName.toLowerCase() !== 'script';
};

// reducer to flatten arrays
var flattenArrays = function flattenArrays(a, b) {
    return a.concat(b);
};

// recursive function to get previous sibling nodes of given element
function getPreviousSiblings(el) {
    var siblings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var previousSibling = el.previousSibling;

    if (!previousSibling) {
        return siblings;
    }

    siblings.push(previousSibling);

    return getPreviousSiblings(previousSibling, siblings);
}

// recursive function to get next sibling nodes of given element
function getNextSiblings(el) {
    var siblings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var nextSibling = el.nextSibling;

    if (!nextSibling) {
        return siblings;
    }

    siblings.push(nextSibling);

    return getNextSiblings(nextSibling, siblings);
}

// returns all sibling element nodes of given element
function getSiblings(el) {
    var allSiblings = getPreviousSiblings(el).concat(getNextSiblings(el));

    return allSiblings.filter(filterSibling);
}

// recursive function to get all ancestor nodes of given element
function getAllAncestors(el) {
    var ancestors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var nextAncestor = el.parentNode;

    if (!nextAncestor) {
        return ancestors;
    }

    ancestors.push(nextAncestor);

    return getAllAncestors(nextAncestor, ancestors);
}

// get ancestor nodes of given element
function getAncestors(el) {
    return getAllAncestors(el).filter(filterAncestor);
}

// get siblings of ancestors (i.e. aunts and uncles) of given el
function getSiblingsOfAncestors(el) {
    return getAncestors(el).map(function (item) {
        return getSiblings(item);
    }).reduce(flattenArrays, []);
}

module.exports = {
    getSiblings: getSiblings,
    getAncestors: getAncestors,
    getSiblingsOfAncestors: getSiblingsOfAncestors
};

});
$_mod.def("/makeup-screenreader-trap$0.0.3/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var util = require('/makeup-screenreader-trap$0.0.3/util'/*'./util.js'*/);

// the main landmark
var mainEl = void 0;

// the element that will be trapped
var trappedEl = void 0;

// collection of elements that get 'dirtied' with aria-hidden attr
var dirtyObjects = void 0;

function prepareAttribute(el, dirtyValue) {
    return {
        el: el,
        cleanValue: el.getAttribute('aria-hidden'),
        dirtyValue: dirtyValue
    };
}

function dirtyAttribute(preparedObj) {
    preparedObj.el.setAttribute('aria-hidden', preparedObj.dirtyValue);
}

function cleanAttribute(preparedObj) {
    if (preparedObj.cleanValue) {
        preparedObj.el.setAttribute('aria-hidden', preparedObj.cleanValue);
    } else {
        preparedObj.el.removeAttribute('aria-hidden');
    }
}

function untrap() {
    if (trappedEl) {
        // restore 'dirtied' elements to their original state
        dirtyObjects.forEach(function (item) {
            return cleanAttribute(item);
        });

        dirtyObjects = [];

        // 're-enable' the main landmark
        if (mainEl) {
            mainEl.setAttribute('role', 'main');
        }

        // let observers know the screenreader is now untrapped
        var event = document.createEvent('Event');
        event.initEvent('screenreaderUntrap', false, true);
        trappedEl.dispatchEvent(event);

        trappedEl = null;
    }
}

function trap(el) {
    // ensure current trap is deactivated
    untrap();

    // update the trapped el reference
    trappedEl = el;

    // update the main landmark reference
    mainEl = document.querySelector('main, [role="main"]');

    // we must remove the main landmark to avoid issues on voiceover iOS
    if (mainEl) {
        mainEl.setAttribute('role', 'presentation');
    }

    // cache all ancestors, siblings & siblings of ancestors for trappedEl
    var ancestors = util.getAncestors(trappedEl);
    var siblings = util.getSiblings(trappedEl);
    var siblingsOfAncestors = util.getSiblingsOfAncestors(trappedEl);

    // prepare elements
    dirtyObjects = [prepareAttribute(trappedEl, 'false')].concat(ancestors.map(function (item) {
        return prepareAttribute(item, 'false');
    })).concat(siblings.map(function (item) {
        return prepareAttribute(item, 'true');
    })).concat(siblingsOfAncestors.map(function (item) {
        return prepareAttribute(item, 'true');
    }));

    // update DOM
    dirtyObjects.forEach(function (item) {
        return dirtyAttribute(item);
    });

    // let observers know the screenreader is now trapped
    var event = document.createEvent('Event');
    event.initEvent('screenreaderTrap', false, true);
    trappedEl.dispatchEvent(event);
}

module.exports = {
    trap: trap,
    untrap: untrap
};

});