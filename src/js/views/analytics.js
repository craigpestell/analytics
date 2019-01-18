import Backbone from 'backbone';
import Model from '../models/analytics';
import template from '../../templates/views/analytics.hbs';

export default Backbone.View.extend({
  el: '#analytics-main',

  events: {
    'click #test-click': 'notifyUser',
  },

  initialize() {
    this.model = new Model();
    this.model.set('abc', 'xyz');
  },

  render() {
    this.$el.html(template(this.model.toJSON()));
  },

  notifyUser() {
    // eslint-disable-next-line no-console
    console.log('click happened');

    // eslint-disable-next-line no-alert
    alert('it did the thing');
  },
});
