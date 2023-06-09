var strapi = require('@strapi/strapi');

strapi()
  .load()
  .then(async (strapiInstance) => {
    // ...Your custom code...
    console.log("hello !");
    // strapi.service('api::generated-story.generated-story').toto();

    // Explicitly destroy server and connections.
    strapiInstance.server.destroy();
    strapiInstance.stop(0);
  });