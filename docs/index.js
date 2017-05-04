var screenreaderTrap = require('../index.js');

Array.prototype.slice.call(document.querySelectorAll('.trap')).forEach(function (item) {
  item.addEventListener('click', function () {
    if (this.getAttribute('aria-pressed') === 'true') {
      screenreaderTrap.untrap(this);
    } else {
      screenreaderTrap.trap(this);
    }
  });

  item.addEventListener('screenreaderTrap', function (e) {
    console.log(e);
    this.innerText = 'Untrap';
    this.setAttribute('aria-pressed', 'true');
  });

  item.addEventListener('screenreaderUntrap', function (e) {
    console.log(e);
    this.innerText = 'Trap';
    this.setAttribute('aria-pressed', 'false');
  });
});
