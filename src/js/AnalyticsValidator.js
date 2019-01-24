/**
 * AnalyticsValidator - Use in test suite per implementation to validate tags are firing
 */

import { validate, ParameterValidationError } from 'parameter-validator';

class AnalyticsValidator {
  constructor(options) {
    try {
      const { elements } = validate(options, ['elements']);
    } catch (error) {
      if (error instanceof ParameterValidationError) {
        console.log(error.message);
      }
    }
  }
}
