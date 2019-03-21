module.exports = {
  page: {
    options: {},
  },
  tagMeta: [
    {
      selector: 'html',
      events: { view: { event_name: 'test' } },
    },
    {
      selector: 'a, img, picture',
      events: {
        link: {},
        impression: {},
      },
      data: {
        generic: e => (new Promise((resolve) => {
          resolve({ data: 'some generic data' });
        })),
      },
    },
    /* {
        selector: '.hl-wrapper',
        events: {
          link: {allProducts: 'some data'}
        },
        data: {
          campaign: () => new Promise((resolve) => {resolve({'campaignData': {pull:'from',context: 'attrs'}})}),
          product: (e) => {
            console.log('fetch all products here');
            return new Promise((resolve) => {resolve('something')});
          }
        }
      }, */
    {
      selector: '[data-hl-productid]',
      events: {
        link: { extra_attr: 'product link event' },
      },
      data: {
        product: (e) => {
          const prodId = e.currentTarget.dataset.hlProductid;
          const url = `https://www.macys.com/xapi/discover/v1/product?productIds=${prodId}&id=3536&_application=SITE&_navigationType=BROWSE&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=271-11,291-21,311-20&currencyCode=USD&_customerState=GUEST&clientId=QV`;
          // return new Promise((resolve) => {resolve(fetch(url))});
          return new Promise((resolve) => { resolve({ product_id: prodId }); });
        },
      },
    },
  ],
};
