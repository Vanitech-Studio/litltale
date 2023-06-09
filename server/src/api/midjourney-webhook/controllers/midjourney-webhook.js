'use strict';

/**
 * generated-story controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::midjourney-webhook.midjourney-webhook', ({ strapi }) => ({

  // Override create (POST)
  async create(ctx) {
    try {
      console.log("[SG] Webhook triggered");
      // Store request body in variable
      let requestBody = ctx.request.body;

      // Store webhook data in database
      const entry = await strapi.entityService.create('api::midjourney-webhook.midjourney-webhook', {
        data: {
          callback: JSON.stringify(requestBody),
        },
      });

      // Call Midjourney Service if webhook payload detected
      if (requestBody.type && requestBody.imageUrl && requestBody.ref.storyID) {
        const content = strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyCallback(requestBody);
      }

      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
}));
