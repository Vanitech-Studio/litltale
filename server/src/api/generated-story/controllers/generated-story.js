'use strict';

/**
 * generated-story controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::generated-story.generated-story', ({ strapi }) => ({

    // Override create (POST)
    async create(ctx) {
        // Retrieve user with beta code
        let user = await strapi.entityService.findMany('api::beta-user.beta-user', {
            filters: { access_code: ctx.request.body.data.code },
            fields: ['*']
        });

        // Control user existence
        if (!(user = user[0])) {
            ctx.send({
                message: 'User not found'
            }, 401);
            return;
        }

        // Control user currently generating
        // Does not block generation if last one was 5+ minutes ago
        if (user.story_generation && new Date() < new Date(new Date(user.last_generation).getTime() + 5*60*1000)) {
            // console.log(user.last_generation);
            ctx.send({
                user_message: "Vous ne pouvez générer qu'une seule histoire à la fois."
            }, 400);
            return;
        }

        // Lock user generation
        user = await strapi.entityService.update('api::beta-user.beta-user', user.id, {
            data: {
                story_generation: true,
                last_generation: new Date()
            }
        });

        // Handle response
        const response = await super.create(ctx);

        // Update Story object with user reference
        let story = await strapi.entityService.update('api::generated-story.generated-story', response.data.id, {
            data: {
                user: user
            },
            populate: 'user'
        });

        // Call story generator
        const content = strapi.service('api::generated-story.generated-story').generateStoryContent(story);
        // Final response
        return response;
    },
}));