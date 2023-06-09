'use strict';

/**
 * beta-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::beta-user.beta-user');
