'use strict';

/**
 * generate router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::generate.generate');
