# @component/analytics

Welcome to Analytics, the module to orchestrate Web Analytics events tracking for mcom & bcom applications.

## What is Web Analytics?

[According to wikipedia](https://en.wikipedia.org/w/index.php?title=Web_analytics):

> Web analytics is the measurement, collection, analysis and reporting of web data for purposes of understanding and optimizing web usage

Macy's & Bloomingdales currently use Adobe Analytics and Google Analytics depending on the application. Both analytics APIs are implemented via Tealium's [tag management system](https://en.wikipedia.org/wiki/Tag_management_system). We want to decouple our web analytics from third-party analytics - meaning eventually loading our analytics APIs without Tealium.

## Why do we need this?

There are three key reasons we need to move to a new approach:

1. Difficult to maintain

   The current tracking implementation is too complicated to add, edit and debug tracking events on a page.

2. Missed opportunities

   With a configuration-based approach we can:

   - see all configured events for an application in one place
   - reduce code duplication & effort by centralizing logic (use one function to fetch product data and provide a path for all applications to use that function)
   - provide aggregate real-time event-tracking data on an application (see if, when, and how many times an event is being triggered), allowing easier debugging

3. Performance
   
4. Organization / separation of business logic from UI code

   With the current state of analytics, we cannot describe to stakeholders what events we have currently defined, and what attributes we send with those events.

**Features**

- **domEvents** - each component can configure and publish DOM event handlers
- dataMap - each event can pass a dataMap: an object in which each property name represent data entities to be consumed by analytics, and the value is a promise which will resolve with the data. Currently each promise will have the event parameter passed in.
- AnalyticsBehavior - a Marionette Behavior which can be implemented by a view. Implementing the Behavior will supplement the View with ui & event hashes for pre-defined events. This allows developers to have analytics events out-of-the-box for their Component or Feature

---

## How To:

### Bootstrap your application with currently configured Analytics events

Import the analytics module in your application's entry-point file. This will:

1. load the vendor analytics libraries (Tealium/Adobe)
2. read the analytics configurations from dependent features & components and create a 'store' of registered events, which developers can use to see if/when events are being triggered
3. attach event listeners for each user action configured to track.

src/app.js:

```javascript
import Analytics from '@component/analytics';
```
### Track DOM events

First, import the Analytics Controller:

```javascript
import {AnalyticsController} from '@component/analytics';
```

Then, call the configure method, passing an object with a domEvents attribute containing an array of configuration objects for each 'set' of DOM elements you which to track events for.

The `domEvents` configuration object can have the following attributes:

- `selector` (String) - a css selector that matches DOM elements to attach event tracking listeners for
- `selectorIsId` (bool) - if true, the `selector` attribute is an ID (ex: `<div id="my-element"></div>`)
- `events` (Object)- an object in which each attribute represents a DOM event to track (e.g. 'click', 'load', 'mouseover', etc) - the value is currently a placeholder, and may represent static data in the future.
  ```javascript
   events: {
       click: {},
       mouseover: {}
   }
  ```
- `dataMap` (Object)- a hashmap of functions which will each return a Promise which resolves with data associated with the hash
  ```javascript
  dataMap: {
    page: () => (return PageApp.getMeta('analytics.page')),
    product: () => (new Promise((resolve) => resolve({product: {...}})))
  }
  ```


Each configuration can represent many DOM elements, as the DOM elements are defined by a CSS selector (`selector: 'html'` would match all DOM elements).  The following example passes three configuration objects, where each configuration could match many elements. 

```javascript
// A function to fetch data -> this can be refactored and reused across applications!
const sampleDataFetch = e =>
  new Promise(resolve => {
    resolve({
      sample: {
        attr1: 'test data',
        attr2: 'test data 2',
      },
    });
  });

AnalyticsController.configure({
  domEvents: [
    {
      selector: '.example-one',
      events: {
        view: {},
        click: {},
      },
      dataMap: {
        example1data: e =>
          new Promise(resolve => {
            resolve(e.currentTarget);
          }),
      },
    },
    {
      selector: '.example-two',
      events: {
        click: {},
      },
      dataMap: {
        // Here we're using the predefined fetch function
        example2data: sampleDataFetch, 
      },
    },
    {
      selector: '.example-three',
      events: {
        click: {},
      },
      dataMap: {
        // passing some data exclusive to example-three...
        example3data: new Promise((resolve) => resolve({data: 'example 3 data'})), 
        alsoExample2data: sampleDataFetch ,
        // And passing the data from example-two!  Since Promise results are cached, this fetch is only executed once
        // per 'context' -> the parameter values passed into the Promise function are used as a hash to resolve 
        // cached results.  If we pass the current event as a parameter for a click event, each unique click event's
        // fetch will be correctly cached.
      },
    },
  ],
});
```
In the first example, all DOM elements with a class of `example-one` will track both 'view' and 'click' events, passing an object with the attribute example1data, the value of which is the element being tracked (e.currentTarget).

In the second example, all DOM elements with a class of `example-two` wil track 'click' events, passing an object with the attribute example2data, with a value of `{ 'sample': 'attr1': 'test data', 'attr2': 'test data 2'}`.

The third example illustrates the reuse of example 2's fetch function, and passing multiple hashes in the dataMap.
  
### Track other events, i.e. onSuccess / onFailure of an ajax call
In the onSuccess or onFailure callback handler register the event tracking:
```javascript
Analytics.track('my-event-on-success-name', someDataObject)
```
### Using predefined e-commerce events
To keep our code-base as clean and minimal as we can, we have defined the industry standard e-commerce events and provided them for your application to use.
```javascript
// tracks the add-to-bag event, using magic to resolve the data passed to analytics.
Analytics.track('Analytics::ecommerce:add-to-bag')
```

### Using AnalyticsBehaviorin a Marionette View
Implementing the AnalyticsBehavior on your Marionette View will supplement that view with additional events and ui hashes.  You may assign any of the css selectors defined there to trigger any of the predefined events.

Each Feature now comes scaffolded with a demo analytics page.  This page is composed of a Marionette View which implements AnalyticsBehavior. You can look there for a live example.

---
