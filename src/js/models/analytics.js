import Backbone from 'backbone';

export default Backbone.Model.extend({
  initialize() {
    this.set('foo', 'bar');
  },
});
