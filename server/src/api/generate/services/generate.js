'use strict';

/**
 * generate service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::generate.generate');
