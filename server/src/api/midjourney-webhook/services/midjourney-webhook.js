'use strict';
const axios = require("axios");

let queue = [];
let isProcessing = false;

/**
 * generated-story service
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::midjourney-webhook.midjourney-webhook', ({ strapi }) => ({

    // Generate Story Content asynchroniously using ChatGPT & Midjourney
    async processMidjourneyCallback(requestBody) {
        let storyID = requestBody.ref.storyID;
        let paragraphID = requestBody.ref.paragraphID;

        // Retrieve Story content with storyID found in 'ref'
        let story = await strapi.entityService.findOne('api::generated-story.generated-story', storyID, {
            fields: ['id', 'content_final', 'content_gpt', 'story_ready', 'story_ready_time']
        });

        if (!story) {
            console.log("[SG] Story with id " + storyID + " does not exist");
            return;
        } else if ((story.story_ready)) {
            console.log("[SG] Story with id " + storyID + " is already generated");
            return;
        }

        // Reroot depending on webhook type
        if (requestBody.type === "imagine") {
            // Using button API to upgrade quality, waiting between 2 and 4 seconds before calling
            console.log("[SG] Calling Button API for story " + storyID + " paragraph " + paragraphID);
            strapi.service('api::midjourney-webhook.midjourney-webhook').callMidjourneyButtonAPI(story, paragraphID, requestBody.buttonMessageId);
        } else if (requestBody.type === "button") {
            // Final image storage
            console.log("[SG] Storing Midjourney image for story " + storyID + " paragraph " + paragraphID);
            strapi.service('api::midjourney-webhook.midjourney-webhook').storeImageInStory(story, paragraphID, requestBody.imageUrl);
        }

    },

    // Calling Midjourney API for each prompt
    async promptMidjourney(story, content) {
        // Splits prompts
        let prompts = await strapi.service('api::midjourney-webhook.midjourney-webhook').splitMidjourneyPrompts(content);

        // Pushing each request in queur
        for (let i = 0; i < prompts.length; i++) {
            console.log("[SG] Calling Midjourney API with prompt " + prompts[i]);
            await strapi.service('api::midjourney-webhook.midjourney-webhook').callMidjourneyImagineAPI(story, i + 1, prompts[i]);
            // Use this code when MJ is down
            // console.log("[SG] Skipping image for paragraph " + i + 1);
            // await strapi.service('api::midjourney-webhook.midjourney-webhook').storeImageInStory(story, i + 1, "");
        }
    },

    // Splits GPT content string into Midjourney-ready prompts
    async splitMidjourneyPrompts(content) {
        // Splits in paragraphs
        let paragraphs = content.split('\n');

        // Filters paragraphs to keep the ones we want
        let prompts = paragraphs
        .filter(paragraph => paragraph.startsWith('<p>Prompt Midjourney') || paragraph.startsWith('<p> Prompt Midjourney') || paragraph.startsWith('<P>Prompt Midjourney') || paragraph.startsWith('<P> Prompt Midjourney') || paragraph.startsWith('Prompt Midjourney'))
        .map(prompt => prompt.replace('Prompt Midjourney :', '').replace('Prompt Midjourney:', '').replace('<p>', '').replace('</p>', '').replace('<P>', '').replace('</P>', '').trim());
        return prompts;
    },

    // Processing queue for MJ API
    processMidjourneyQueue() {
        if (queue.length > 0 && !isProcessing) {
            isProcessing = true;
            let request = queue.shift();
            request()
                .then(() => {
                    setTimeout(function () {
                        isProcessing = false;
                        strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue()
                    }, 1100); // Wait 1.1 second before treating next request
                })
                .catch((error) => {
                    // console.error(error);
                    setTimeout(function () {
                        isProcessing = false;
                        strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue()
                    }, 300); // Wait 0.3 second before treating next request after error
                });
        }
    },

    // Triggers callMidjourneyImagineAPI
    async callMidjourneyImagineAPI(story, paragraphID, prompt) {
        queue.push(() => {
            let config = {
                method: 'post',
                url: 'https://api.thenextleg.io/v2/imagine',
                headers: {
                    'Authorization': 'Bearer ' + process.env.THENEXTLEG_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "msg": prompt,
                    "ref": { "storyID": story.id, "paragraphID": paragraphID }
                })
            };

            return axios(config)
                .then(function (response) {
                    // console.log("[SG] Received Midjourney Imagine API response for story " + story.id + ", paragraph " + paragraphID);
                    // console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    if (error.code === "ERR_BAD_REQUEST" && error.response.data.isNaughty) {
                        console.log("[SG] Naughty prompt, retrying without the word " + error.response.data.phrase);
                        // console.log("new prompt : " + prompt.replace(error.response.data.phrase, ''));
                        strapi.service('api::midjourney-webhook.midjourney-webhook').callMidjourneyImagineAPI(story, paragraphID, prompt.replace(error.response.data.phrase, ''));
                    } else {
                        console.log('[SG] Error Midjourney Imagine API :', error);
                        console.log("[SG] Storing default image for story " + story.id + " paragraph " + paragraphID);
                        strapi.service('api::midjourney-webhook.midjourney-webhook').storeImageInStory(story, paragraphID, "");
                        strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue();
                    }
                    throw error;
                });
        });
        strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue();
    },

    // Triggers Midjourney Button API
    async callMidjourneyButtonAPI(story, paragraphID, buttonMessageId) {
        queue.push(() => {
            let config = {
                method: 'post',
                url: 'https://api.thenextleg.io/v2/button',
                headers: {
                    'Authorization': 'Bearer ' + process.env.THENEXTLEG_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "button": "U" + (Math.floor(Math.random() * 4) + 1), // Randomly use U1, U2, U3, or U4
                    "buttonMessageId": buttonMessageId,
                    "ref": { "storyID": story.id, "paragraphID": paragraphID }
                })
            };

            return axios(config)
                .then(function (response) {
                    console.log("[SG] Received Midjourney Button API response for story " + story.id + ", paragraph " + paragraphID);
                    // console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log('[SG] Error Midjourney Button API :', error);
                    console.log("[SG] Storing default image for story " + story.id + " paragraph " + paragraphID);
                    strapi.service('api::midjourney-webhook.midjourney-webhook').storeImageInStory(story, paragraphID, "");
                    strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue();
                    throw error;
                });
        });
        strapi.service('api::midjourney-webhook.midjourney-webhook').processMidjourneyQueue();
    },

    // Image storage in story
    async storeImageInStory(story, paragraphID, imageUrl = "") {
        // Returns if image already in story, except for default one
        if ((story.content_final.includes(imageUrl) && imageUrl !== "")) {
            return;
        }

        // Refresh story
        story = await strapi.entityService.findOne('api::generated-story.generated-story', story.id, {
            fields: ['*'],
        });

        // Splits midjourney prompts
        let prompts = await strapi.service('api::midjourney-webhook.midjourney-webhook').splitMidjourneyPrompts(story.content_gpt);

        // Find related prompt and replace with image balise ready for frontend usage
        let content_final = story.content_final.replace(
            new RegExp("Prompt Midjourney\\s*:\\s*" + prompts[paragraphID - 1]), // There may be space between Prompt Modjourney and ':'
            (imageUrl) ? "<img class=\"h-auto max-w-full\" src=" + "\"" + imageUrl + "\"" + "alt=\"image description\">" : ""
        );

        // Update Story object with final content
        story = await strapi.entityService.update('api::generated-story.generated-story', story.id, {
            data: {
                content_final: content_final,
                // Next line stores imageUrl if defined & no story cover was already defined
                cover_url: (imageUrl && !story.cover_url) ? imageUrl : story.cover_url
            },
            populate: '*'
        });

        // Ready condition
        if (!content_final.includes("Prompt Midjourney")) {
            console.log("[SG] Story " + story.id + " ready !");
            strapi.service('api::midjourney-webhook.midjourney-webhook').triggerStoryReady(story);
        }
    },

    // Triggers any action that happens when story is ready like SEO, cover and user unlock
    async triggerStoryReady(story) {
        let defaultCover = "https://cdn.discordapp.com/attachments/1108318248858030121/1111636486824140830/RogerfHinton_Illustration_for_children_3D_animation_vibrant_col_de506b74-cfc2-437a-a397-48834c853b9c.png";
        let cover = !story.cover_url ? defaultCover : story.cover_url; // Stores default image if none was defined for the cover

        // Update Story object with final content
        story = await strapi.entityService.update('api::generated-story.generated-story', story.id, {
            data: {
                story_ready_time: new Date(),
                story_ready: true,
                total_generation_duration: await strapi.service('api::midjourney-webhook.midjourney-webhook').calculateGenerationDuration(story.createdAt),
                mj_generation_duration: await strapi.service('api::midjourney-webhook.midjourney-webhook').calculateGenerationDuration(story.gpt_ready_time),
                cover_url: cover,
                seo: { // Sets cover for sharing feature
                    share_image_url: cover
                }
            },
            populate: 'user'
        });

        // Unlock user generation
        await strapi.entityService.update('api::beta-user.beta-user', story.user.id, {
            data: {
                story_generation: false
            }
        });
    },

    // Returns de diff between now and given time, in string (ex : 3m42s)
    async calculateGenerationDuration(time) {
        // Time difference
        let diff = new Date() - new Date(time);

        // Convert time difference in minutes & seconds
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff / 1000) % 60);

        // Return time difference as a formated string
        return `${minutes}m${seconds}`;
    }
}));