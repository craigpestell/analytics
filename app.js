/**
 * Entry point for running the application.
 * Must export an object with a start() method.
 *
 * Since this is a component, the entry point is only used for running it in isolation.
 * When consumed by a page or feature, the entry point will be defined by the consumer.
 */
import '@core/style-guide/src/scss/macys-base.scss';
import Component from './src/refactored-analytics';

const App = {
  start() {
    const component = new Component('#refactored-analytics-main', {
      opt: 'val'
    });
    // eslint-disable-next-line no-console
    console.log(component.view.model.toJSON());

    component.on('something:done', result => {
      // eslint-disable-next-line no-console
      console.log('result is', result);
    });

    component.doSomething();
  },
};

export default App;