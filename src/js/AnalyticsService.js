import _ from 'underscore'; // TODO: remove underscore
import ObjectUtil from '@component/common/src/util/ObjectUtil';
import ExperimentSDK from '@component/experiment';

import PageApp from 'pageApp';

const page = _.memoize(() => new Promise((resolve) => {
  resolve({ page_type: '' });
}));

const experiment = _.memoize(() => new Promise((resolve) => {
  ExperimentSDK.getFinalClientRecipes().then((recipes) => {
    resolve(recipes);
  });
}));

/* const product = _.memoize((pId) => {
  console.log('fetching productId: ', pId);
    return fetch(`https://www.macys.com/xapi/digital/v1/product/${pId}?size=small&clientId=PROS&_shoppingMode=SITE&_customerExperiment=NO_EXPERIMENT&_customerState=GUEST&currencyCode=USD&_regionCode=US`)
    .then((res) => {
      return res.json();
    });
}); */
const product = pId => (new Promise((resolve) => {
  resolve({
    product: {
      id: 2627277,
      uri: 'http://catalog.macys.com/productexp/v1/discoverproduct/1551',
      identifier: {
        productUrl: '/shop/product/calvin-klein-mens-slub-interlock-solid-polo-shirt?ID=2627277',
        productId: 12345,
      },
      messages: {
        error: [
          "We're sorry, you no longer qualify for this Bonus Gift. Please remove it before proceeding to checkout.",
          'Error message 2',
        ],
        info: [{
          lowAvailibilityMessage: 'We have only 1 item left',
        }],
      },
      detail: {
        name: "Calvin Klein Men's Slub Interlock Solid Polo Shirt",
        flags: {
          memberProduct: true,
          chanel: false,
          isNew: true,
          intlSuppressProduct: true,
          masterProduct: false,
        },
        reviewStatistics: {
          aggregate: {
            rating: 0,
            count: 0,
          },
        },
      },
      imagery: {
        additionalImageSource: [{
          filePath: '4/optimized/2648394_fpx.tif',
          name: '2648394.fpx',
          colorName: 'Bright Red',
          colorId: 2662387,
          showJumboSwatch: true,
        },
        {
          filePath: '6/optimized/3468186_fpx.tif',
          name: '3468186.fpx',
          showJumboSwatch: true,
        },
        {
          filePath: '7/optimized/3468187_fpx.tif',
          name: '3468187.fpx',
          showJumboSwatch: true,
        },
        {
          filePath: '7/optimized/2648397_fpx.tif',
          name: '2648397.fpx',
          showJumboSwatch: true,
        },
        {
          filePath: '6/optimized/2648396_fpx.tif',
          name: '2648396.fpx',
          showJumboSwatch: true,
        },
        ],
        primaryImage: {
          filePath: '4/optimized/2648394_fpx.tif',
          name: '2648394.fpx',
          colorName: 'Bright Red',
          colorId: 2662387,
          showJumboSwatch: true,
        },
      },
      availability: {
        active: true,
        archived: false,
        live: true,
        checkInStoreEligibility: true,
        visible: true,
        available: true,
      },
      traits: {
        colors: {
          urlTemplate: {
            swatch: 'https://slimages.macysassets.com/is/image/MCY/',
            product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
          },
          colorMap: [{
            id: 1103208,
            name: 'Abbott Indigo',
            normalName: 'Indigo',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3371858_fpx.tif',
              filePath: '8/optimized/3371858_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3682667_fpx.tif',
              },
              {
                filePath: '9/optimized/3682669_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '1/optimized/3682671_fpx.tif',
              },
              {
                filePath: '0/optimized/3682670_fpx.tif',
              },
              {
                filePath: '8/optimized/3682668_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3682667_fpx.tif',
                filePath: '7/optimized/3682667_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103209,
            name: 'Beach Tide',
            normalName: 'Tide',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3384895_fpx.tif',
              filePath: '5/optimized/3384895_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '2/optimized/3682652_fpx.tif',
              },
              {
                filePath: '3/optimized/3682653_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '3/optimized/2177363_fpx.tif',
              },
              {
                filePath: '4/optimized/2177364_fpx.tif',
              },
              {
                filePath: '6/optimized/2177366_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3682652.fpx',
                filePath: '2/optimized/3682652_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103210,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103216,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '4/optimized/2648394_fpx.tif',
                name: '2648394.fpx',
                colorName: 'Bright Red',
                colorId: 2662387,
                showJumboSwatch: true,
              },
              {
                filePath: '6/optimized/3468186_fpx.tif',
                name: '3468186.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '7/optimized/3468187_fpx.tif',
                name: '3468187.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '7/optimized/2648397_fpx.tif',
                name: '2648397.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '6/optimized/2648396_fpx.tif',
                name: '2648396.fpx',
                showJumboSwatch: true,
              },
              ],
              primaryImage: {
                filePath: '4/optimized/2648394_fpx.tif',
                name: '2648394.fpx',
                colorName: 'Bright Red',
                colorId: 2662387,
                showJumboSwatch: true,
              },
            },
          },
          {
            id: 1103211,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103212,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103213,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103214,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103215,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          {
            id: 1103217,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '7/optimized/3667217_fpx.tif',
              },
              {
                filePath: '1/optimized/3667221_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              {
                filePath: '0/optimized/3667220_fpx.tif',
              },
              {
                filePath: '9/optimized/3667219_fpx.tif',
              },
              {
                filePath: '8/optimized/3667218_fpx.tif',
              },
              {
                filePath: '2/optimized/8128552_fpx.tif',
              },
              ],
              primaryImage: {
                name: '3667217_fpx.tif',
                filePath: '7/optimized/3667217_fpx.tif',
                alt: '',
                width: '',
                height: '',
              },
            },
          },
          ],
          selectedColor: {
            id: 1103216,
            name: 'Outpost',
            normalName: 'Outpost',
            urlTemplate: {
              swatch: 'https://slimages.macysassets.com/is/image/MCY/swatches/',
              product: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY]&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            },
            hasMLT: true,
            swatchImage: {
              name: '3667252_fpx.tif',
              filePath: '2/optimized/3667252_fpx.tif',
              alt: '',
              width: '',
              height: '',
            },
            imagery: {
              additionalImageSource: [{
                filePath: '4/optimized/2648394_fpx.tif',
                name: '2648394.fpx',
                colorName: 'Bright Red',
                colorId: 2662387,
                showJumboSwatch: true,
              },
              {
                filePath: '6/optimized/3468186_fpx.tif',
                name: '3468186.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '7/optimized/3468187_fpx.tif',
                name: '3468187.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '7/optimized/2648397_fpx.tif',
                name: '2648397.fpx',
                showJumboSwatch: true,
              },
              {
                filePath: '6/optimized/2648396_fpx.tif',
                name: '2648396.fpx',
                showJumboSwatch: true,
              },
              ],
              primaryImage: {
                filePath: '4/optimized/3682652_fpx.tif',
                name: '3682652.fpx',
                colorName: 'Bright Red',
                colorId: 2662387,
                showJumboSwatch: true,
              },
            },
          },
          size: {
            selectedSize: {
              id: 1234567,
              name: '32M',
            },
          },
        },
      },
      pricing: {
        price: {
          priceType: {
            text: 'Limited-Time Special',
            onEdv: false,
            onSale: false,
            upcOnSale: false,
            upcOnEdv: false,
            memberProductOnSale: false,
            isMasterNonRanged: false,
            willBe: false,
          },
          policy: {
            text: '"Regular" and "Original" prices are offering prices that may not have resulted in actual sales, and some "Original" prices may not have been in effect during the past 180 days.',
            url: '/catalog/product/pricingpolicy.ognc?fpriceTypeId=24&daysInC=16909&ID=2627277',
          },
          tieredPrice: [{
            label: 'Orig [PRICE]',
            values: [{
              value: 69.5,
              formattedValue: '$69.50',
              type: 'regular',
            }],
          },
          {
            label: 'Now [PRICE]',
            values: [{
              value: 49.99,
              formattedValue: '$49.99',
              type: 'discount',
              percentOff: [
                50,
              ],
            }],
          },
          {
            label: 'Sale',
            values: [{
              value: 34.99,
              formattedValue: '$34.99',
              type: 'sale',
              percentOff: [
                20,
              ],
            }],
          },
          ],
        },
        currency: {
          currencyCode: 'GBP',
          currencySymbol: '£',
          currencyName: 'British Pound',
          exchangeRate: 0.735572,
          roundMethod: 2,
          countryCode: 'US',
          countryName: 'United States of America',
          frontLoadCoefficient: 1,
        },
        badges: [{
          walletEligible: null,
          checkoutDescription: 'Enjoy free shipping on your purchase of $50 or more!',
          description: 'Enjoy Free Shipping at $50!',
          promoId: '19860824',
          header: 'FREE SHIP AT $50',
          legalDisclaimer: 'TO GET FREE SHIPPING WITH $50 PURCHASE: Place $50 [TRUNCATED FOR THIS DOCUMENT...]',
          applicableToAllUpcs: 'true',
          promoCode: null,
          offer: 'OTHERS',
        },
        {
          walletEligible: null,
          checkoutDescription: "Receive a Macy's active water bottle with $50 select women's activewear purchase. Bonus applied at checkout. Offer ends Saturday, April 23rd.",
          description: "Free water bottle with $50 women's active purchase",
          promoId: '19860822',
          header: 'FREE GIFT WITH PURCHASE',
          legalDisclaimer: '',
          image: {
            filePath: '2/optimized/1153032_fpx.tif',
            urlTemplate: 'https://slimages.macysassets.com/is/image/MCY/products/[IMAGEFILEPATH]?bgc=255,255,255&wid=[WIDTH]&qlt=[QUALITY],0&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
          },
          applicableToAllUpcs: 'true',
          giftId: '2787019',
          promoCode: null,
          offer: 'BONUS_OFFER',
        },
        {
          walletEligible: null,
          checkoutDescription: "Receive a Macy's active water bottle with $50 select women's activewear purchase. Bonus applied at checkout. Offer ends Saturday, April 23rd.",
          description: "Free water bottle with $50 women's active purchase",
          promoId: '19860822',
          header: '$30 MAIL-IN REBATE',
          legalDisclaimer: '',
          IMAGE: '9/optimized/3520419_fpx',
          applicableToAllUpcs: 'true',
          giftId: '2787019',
          promoCode: null,
          offer: 'REBATE',
          popUp: {
            url: '/shop/media/popup/?popupFileName=/popupjsp/2017/1/793816.jsp',
            height: 400,
            width: 360,
          },
        },
        ],
      },
    },
  });
}));
const mcomQuickView = response => quickView('mcom', response);
const quickView = (response, brand) => {
  if (response) {
    const data = ObjectUtil.hasChildProperty(response, 'product.meta.analytics.data') ? response.product.meta.analytics.data : {};
    const detail = ObjectUtil.hasChildProperty(response, 'product.detail') ? response.product.detail : {};
    const flags = detail.flags || {};
    const utagData = {
      page_type: 'product quickview',
      event_name: data.eventName || 'product quickview',
      product_id: [data.productID || ''],
      product_name: [data.productName || ''],
      product_type: [data.productType || ''],
      product_original_price: [data.productOriginalPrice || ''],
      product_price: [data.productPrice || ''],
      is_big_ticket: [data.isBigTicket || 'false'],
      product_position: [response.currentProductPosition !== undefined ? response.currentProductPosition.toString() : ''],
      product_pricing_state: [data.productPricingState || ''],
      product_rating: [data.productRating || ''],
      product_reviews: [data.productReviews || ''],
      pdp_product_position: [response.index || ''],
      product_brand: [detail.brand || ''],
      zone: response.zone || '',
      choiceId: response.model || '',
      contentId: response.contentId || '',
    };
    if (brand === 'bcom') {
      const productUrl = ObjectUtil.hasChildProperty(response, 'product.identifier.productUrl') ? response.product.identifier.productUrl : '';
      const match = productUrl.match('CategoryID=([0-9]*)');
      let categoryId = match && match[1] ? match[1] : '';

      categoryId = flags.registrable && window.location.pathname.indexOf('/shop/wedding-registry/') !== -1 ? `BWEDD_${categoryId}` : categoryId;
      utagData.product_category_id = [categoryId];
      utagData.category_id = [response.product.identifier.topLevelCategoryID || ''];
      utagData.category_name = [response.product.detail.typeName || ''];
    } else {
      utagData.product_category_id = [ObjectUtil.getChildProperty(response, 'product.identifier.categoryId') || ''];
      utagData.product_category_name = [ObjectUtil.getChildProperty(response, 'product.detail.typeName') || ''];
      utagData.experimentation_ids = [response.selectedReceipe || ''];
    }
    if (response.isRecommendation) {
      utagData.event_name = 'recommendation link click';
      utagData.recommendation_position = response.currentProductPosition !== undefined ? response.currentProductPosition.toString() : '';
      utagData.recommendation_model = response.model || '';
      utagData.recommendation_zone = response.zone || '';
      utagData.recommendation_title = response.headerText || '';
      utagData.recommendation_content = response.content || {};
    }
    return utagData;
  }
};

const quickViewMcom = _.memoize(response => new Promise((resolve) => {
  resolve(quickView(response, 'mcom'));
}));
const quickViewBcom = _.memoize(response => new Promise((resolve) => {
  resolve(quickView(response, 'bcom'));
}));
export default {
  page: () => (page()),
  experiment: () => (experiment()),
  product: id => (product(id)),
  quickViewMcom,
};
