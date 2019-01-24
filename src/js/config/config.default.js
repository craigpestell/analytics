module.exports = {
  tagMeta: [
    // default page view tag.
    {
      selector: 'html',
      events: { view: true },
      data: {
        page: () => (new Promise((resolve) => {
          resolve({ event_name: 'page view' });
        })),
      },
    },
    {
      selector: 'a[data-hl-productid]',
      events: { link: true },
      data: { link: e => (new Promise((resolve) => { resolve(e.target.closest('a[href]')); })) },
    },
    {
      selector: '.hl-name',
      events: { link: true },
      data: { productName: e => ({ name: e.target.innerHTML }) },
    },
  ],
};
