let TrackingModel = Backbone.Model.extend({
  validate: function(attrs, options) {

    if (!attrs.event_name) {
      return "Must specify an event_name.";
    }
  }
});

TrackingModel.on("invalid", (model, error) => {
  console.log(`Error saving model: "${error}".`);
})

let TrackingDataModel = Backbone.Model.extend({
  /* validate: function(attrs, options) {

    if (!attrs.event_name) {
      return "Must specify an event_name.";
    }
  }*/
  parse: (response, options) => {
    console.log('parsing TrackingDataModel response:', response);
  }
});
TrackingDataModel.on("invalid", (model, error) => {
  console.log(`Error saving model: "${error}".`);
})

let ProductModel = TrackingDataModel.extend({
  validate: (attrs, options) {
    const required = ['product_name', 'product_category'];
    required.forEach((name) => {
      if(!attrs[name]) {
        return `Missing value for field '${name}'`;
      }
    });
  }
});

export ProductModel;
export default TrackingModel;
/* var one = new Chapter({
  title : "Chapter One: The Beginning"
});

one.on("invalid", function(model, error) {
  alert(model.get("title") + " " + error);
});

one.save({
  start: 15,
  end:   10
});*/