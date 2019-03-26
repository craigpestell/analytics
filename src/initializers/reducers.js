//
// reducers
//
// Optionally you can include your reducer forming in one place as
// an initializer.
//
// In addition, if you want more modularity you can make an initializer
// per reducer. So if you were ever to kill the 'settings' module,
// you would only need to remove that initializer file.
//

import analytics from '../reducers/analytics';
import product from '../reducers/product';
// import settings from '@/modules/settings/state'
// import intro from '@/modules/intro/state'

const reducers = {
  analytics,
  product,
  // settings,
  // intro,
}

export default {
  name: 'reducers',
  reducers: reducers
}
