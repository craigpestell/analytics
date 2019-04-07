# 1. @component/analytics module

Welcome to Analytics, the module to orchestrate Web Analytics events tracking for mcom & bcom applications.

## 1.1. An introduction to Web Analytics

[According to wikipedia](https://en.wikipedia.org/w/index.php?title=Web_analytics):

> Web analytics is the measurement, collection, analysis and reporting of web data for purposes of understanding and optimizing web usage

Macy's & Bloomingdales currently use Adobe Analytics and Google Analytics depending on the application. Both analytics APIs are implemented via Tealium's [tag management system](https://en.wikipedia.org/wiki/Tag_management_system). We want to decouple our web analytics from third-party analytics - meaning decoupling our analytics API implemeentation from Tealium. Tealium's main strength is management of variable maps for third-party APIs (pixel trackers).

## 1.2. Why do we need this?

There are four key reasons we need to move to a new approach:

### 1.2.1. Difficult to maintain

The current tracking implementation is too complicated to add, edit and debug tracking events on a page.

### 1.2.2. Missed opportunities

With a configuration-based approach we can:

- see all tracked events per application in one place
- reduce code duplication & effort by centralizing logic (use one function to fetch product data and provide a path for all applications to use that function)
- provide aggregate real-time event-tracking data on an application (see if, when, and how many times an event is being triggered), allowing easier debugging
- reduce code & effort duplication, provide a better view of Analytics implementation

### 1.2.3. Performance

We need to take advantage of asynchronous libraries and defer CPU cycles to less affect the customer with code that hinders their experience.

Since this module decouples the analytics vendor libraries from the UI layer, we can safely remove Tealium at any point. This means we can deploy an application without the hundreds of scripts Tealium loads.

### 1.2.4. Organization / separation of business logic from UI code

With the current state of analytics, we cannot describe to stakeholders what events we have currently defined, and what attributes we send with those events. This module provides a pattern to create reusable events, and to organize them in a way we can present them to stakeholders.

## 1.3. Features

- Manage analytics vendors with ease: a plugin architecture allows granular configuration of event tracking destinations.
- Ability to list all events tracked on a page & how many times the event was triggered
- ability to publish configurations and share them across pages/features/components
- dataMap - each event can pass a dataMap: an object in which each property name represent data entities to be consumed by analytics, and the value is a promise which will resolve with the data. Currently each promise will have the event parameter passed in
- AnalyticsBehavior - a Marionette Behavior which can be implemented by a view. Implementing the Behavior will supplement the View with ui & event hashes for pre-defined events. This allows developers to have analytics events out-of-the-box for their Component or Feature
- configuration aggregation to page-level or a common module (easier maintenance)

---

## 1.4. How To's

### 1.4.1. How to bootstrap your application with currently configured Analytics events

Import the analytics module in your application's entry-point file. This will:

1. load the vendor analytics libraries (Tealium/Adobe)
2. read the analytics configurations from dependent features & components and create a 'store' of registered events, which developers can use to see if/when events are being triggered
3. attach event listeners for each user action configured to track.

src/app.js:

```javascript
import Analytics from '@component/analytics';
```

### 1.4.2. How to configure DOM event listeners

Import the Analytics Controller:

```javascript
import {AnalyticsController} from '@component/analytics';
```

Call the configure method, passing an object with a domEvents attribute containing an array of configuration objects for each 'set' of DOM elements you which to track events for.

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
- `dataMap` (Object)- a hashmap of functions which will each return a Promise which resolves with data associated with the hash.
  Hashes should match data model names, and the associated data returned from the fetch should have attributes that can be picked up by the event reducers (?)
  ```javascript
  dataMap: {
    page: () => (return PageApp.getMeta('analytics.page')),
    product: () => (new Promise((resolve) => resolve({product: {...}})))
  }
  ```

Each configuration can represent many DOM elements, as the DOM elements are defined by a CSS selector (`selector: 'html'` would match all DOM elements). The following example passes three configuration objects, where each configuration could match many elements.

```javascript
import ExpSdk from '@component/experiment';

// fetchClientSideRecipes returns a Promise.
const experiments = e => ExpSdk.fetchClientSideRecipes;

// a function to fetch the page data
// this could be replaced with a function that resolves with: resolve(PageApp.getMeta('analytics.page'));
const page = e =>
  new Promise(resolve => {
    resolve({
      page: {
        pageName: 'search - mens / undies',
      },
    });
  });

// A function to fetch data -> this can be refactored and reused across applications!
const product = e =>
  new Promise(resolve => {
    resolve({
      product: {
        productName: 'Ck Undies',
        categoryId: '654987',
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
        // here we're defining some custom data in the dataMap to send.
        exampleOneData: e =>
          new Promise(resolve => {
            id: resolve(e.currentTarget.dataset.id);
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
        product,
      },
    },
    {
      selector: '.example-three',
      events: {
        click: {},
      },
      dataMap: {
        page,
        // re-using the product Promise.
        product,
        // including experimentation
        experiments,

        // Since Promise results are cached, this fetch is only executed once
        // per 'context' -> the parameter values passed into the Promise function are used as a hash to resolve
        // cached results.  If we pass the current event as a parameter for a click event, each unique click event's
        // fetch will be correctly cached.
      },
    },
  ],
});
```

In the first example, all DOM elements with a class of `example-one` will track both 'view' and 'click' events, passing an object with the attribute exampleOneData, the value of which is the element being tracked (e.currentTarget).

In the second example, all DOM elements with a class of `example-two` wil track 'click' events, passing the results of the product() fetch: `{ product: { productName: 'Ck Undies', categoryId: '654987', } }`

The third example illustrates the reuse of example 2's fetch function, and passing multiple hashes in the dataMap.

The data returned by each would be as follows:

```javascript
// example-one:
{
    'example1data': { e.currentTarget } // we don't know what e.currentTarget is.
}

// example-two:
{
    'product': {
        'productName': 'Ck Undies',
        'categoryId': '654987',
    }
}

// example-three:
{
    'page': {
        'pageName': 'search - mens / undies',
    },
    'product': {
        'productName': 'Ck Undies',
        'categoryId': '654987',
    },
    'experiments': ['abc:123']
}

```

The data can be transformed before being sent to each Analytics library (Tealium/Adobe or Google Analytics) using Reducers.

### 1.4.3. Track other events, i.e. onSuccess / onFailure of an ajax call

In the onSuccess or onFailure callback handler register the event tracking:

```javascript
Analytics.track('my-event-on-success-name', someDataObject);
```

### 1.4.4. Using predefined e-commerce events

To keep our code-base as clean and minimal as we can, we have defined the industry standard e-commerce events and provided them for your application to use.

```javascript
// tracks the add-to-bag event, using magic to resolve the data passed to analytics.
Analytics.track('Analytics::ecommerce:add-to-bag');
```

### 1.4.5. Using AnalyticsBehavior in a Marionette View

Implementing the AnalyticsBehavior on your Marionette View will supplement that view with additional events and ui hashes. You may assign any of the css selectors defined there to trigger any of the predefined events.

Each Feature now comes scaffolded with a demo analytics page. This page is composed of a Marionette View which implements AnalyticsBehavior. You can look there for a live example.

---
