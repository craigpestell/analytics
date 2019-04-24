import EventEmitter from 'events';
import View from './js/views/refactored-analytics';
import './scss/refactored-analytics.scss';

export default class Component extends EventEmitter {
  constructor(el, options) {
    super(); // calls EventEmitter's constructor
    this.view = new View({
      el,
    });

    if (options.opt === 'val') {
      // eslint-disable-next-line no-console
      console.log('opt is "val". render.');
      this.view.render();
    } else {
      // eslint-disable-next-line no-console
      console.log('opt is not "val". don\'t render.');
    }
  }

  doSomething() {
    // example of emitting an event that consumers can attach listeners to
    this.emit('something:done', 'foobar');
  }
}