// logger-plugin.js redux middleware
import Logger from '@component/common/src/util/Logger';

const logger = store => next => action => {
  if (action.type) {
    Logger.log(`Analytics-->dispatching:${JSON.stringify(action)}`);
    
  }
  let result = next(action)

  return result
}

export default logger