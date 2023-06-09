'use strict';

/**
 * loading service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::loading.loading');
