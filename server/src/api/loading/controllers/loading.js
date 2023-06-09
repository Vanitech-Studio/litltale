'use strict';

/**
 * loading controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::loading.loading');
