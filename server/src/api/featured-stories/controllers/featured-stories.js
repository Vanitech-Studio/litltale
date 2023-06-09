"use strict";

/**
 *  artwork controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::generated-story.generated-story", ({ strapi }) => {
  const numberOfEntries = 6;

  return {
    async random(ctx) {
      const entries = await strapi.entityService.findMany(
        "api::generated-story.generated-story",
        {
          filters: { featured: true, cover_url: { $notNull: true }, title: { $notNull: true } },
          fields: ["id", "title", "cover_url", "theme", "heroes", "story_ready", "featured"],
        }
      );

      let randomEntries = [...entries].sort(() => 0.5 - Math.random());
      randomEntries = randomEntries.slice(0, numberOfEntries);

      ctx.body = {
        "data": randomEntries.map(item => ({
          "id": item.id,
          "attributes": {
            "title": item.title,
            "cover_url": item.cover_url,
            "theme": item.theme,
            "heroes": item.heroes,
            "story_ready": item.story_ready,
            "featured": item.featured
          }
        }))
      };
    },
  };
});