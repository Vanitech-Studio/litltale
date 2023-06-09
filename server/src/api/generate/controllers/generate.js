'use strict';

/**
 * generate controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::generate.generate');
