'use strict';

/**
 * loading router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::loading.loading');
