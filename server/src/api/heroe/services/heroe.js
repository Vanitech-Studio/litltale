'use strict';

/**
 * heroe service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::heroe.heroe');
