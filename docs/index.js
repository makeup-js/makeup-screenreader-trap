var screenreaderTrap = require('../index.js');

function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

nodeListToArray(document.querySelectorAll('.trap')).forEach(function (item) {
  item.addEventListener('click', function () {
    if (this.getAttribute('aria-pressed') === 'true') {
      screenreaderTrap.untrap(this);
    } else {
      screenreaderTrap.trap(this);
    }
  });

  item.addEventListener('screenreaderTrap', function (e) {
    console.log(this, e);
    this.innerText = 'Untrap';
    this.setAttribute('aria-pressed', 'true');
  });

  item.addEventListener('screenreaderUntrap', function (e) {
    console.log(this, e);
    this.innerText = 'Trap';
    this.setAttribute('aria-pressed', 'false');
  });
});

document.addEventListener('screenreaderTrap', function (e) {
  console.log(this, e);
});

document.addEventListener('screenreaderUntrap', function (e) {
  console.log(this, e);
});
