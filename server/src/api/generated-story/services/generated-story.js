'use strict';
const axios = require("axios");

/**
 * generated-story service
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::generated-story.generated-story', ({ strapi }) => ({

	// Generate Story Content asynchroniously using ChatGPT & Midjourney
	async generateStoryContent(story) {
		// Generate authors string & prompt ChatGPT
		let authors = await strapi.service('api::generated-story.generated-story').buildStoryAuthorsString(story);
		let content = await strapi.service('api::generated-story.generated-story').promptGPT(story, authors);

		// GPT Failed
		if (!content) {
			story = await strapi.entityService.update('api::generated-story.generated-story', story.id, {
				data: {
					story_error: true
				}
			});
			return;
		}

		// Store GPT content
		story = await strapi.service('api::generated-story.generated-story').splitAndStoreGPTContent(story, content, authors);

		// Prompts Midjourney
		await strapi.service('api::midjourney-webhook.midjourney-webhook').promptMidjourney(story, content);
	},

	// Builds prompt for GPT API
	async promptGPT(story, authors) {
		var messages = [{
			role: 'user',
			content: `Tu es un auteur de livres pour enfants.
Nous allons écrire une histoire pour enfant :
- en : Français
- de : 4 à 6 ans
- sur le thème suivant : ${story.theme}
- en t'inspirant des auteurs suivants : ${authors}
- les héros de l'histoire sont : ${story.heroes}
- Style aventure : éducatif, découverte
L'histoire doit avoir un nom et se composer de 5 chapitres.
Chaque chapitre doit comporter au minimum 3 paragraphes de quelques phrases chacuns sans compter le prompt midjourney.
Adapte le style d'écriture en fonction des auteurs et de l'âge de l'enfant.
Tu peux ajouter des dialogues entre les personnages au sein de la narration.
Evite les répétitions de mots.
A la fin de chaque chapitre, tu vas générer un prompt Midjourney, une IA capable de produire du contenu visuel.
Voici un exemple de prompt Midjourney : "Illustration for children, 3D animation, vibrant colors, detailed textures, natural lights, {name} floating in his colorful balloon, surrounded by fluffy clouds and singing birds. {name} has luminous blonde hair, sparkling green eyes, and a friendly smile. --ar 4:4 --v 5.1"
Important : Les prompts Midjourney doivent être rédigés en anglais.
Précise systématiquement "Prompt Midjourney: Illustration for children, 3D animation, vibrant colors, detailed textures, natural lights," au début de chaque prompt.
Précise systématiquement "--ar 4:4 --v 5.1" à la fin de chaque prompt.
Invente des caractéristiques physiques précises pour chaque personnage de l'histoire :
- une couleur de peau
- une couleur des yeux
- une coupe de cheveux
- une longueur de cheveux
Précise les caractéristiques physiques des personnages dans chaque prompt Midjourney, même si ils ont déjà été évoqués dans les prompts précédents. Précise aussi l'âge et le sexe des personnages dans chaque prompt Midjourney, même si il a déjà été évoqué dans les prompts précédents.
Important : les personnages doivent avoir les mêmes caractéristiques physiques entre chaque chapitre, la couleur et la longueur des cheveux ne doivent pas changer.
N'inclus pas les mot "petite" et "perky" dans les prompts Midjourney.
Commence par "Titre de l'histoire :" au début.
Entoure le titre de l'histoire de balises <h1>
Entoure les titres de chapitres de balises <h2>
Entoure tout les autres paragraphes de balises <p>.
Pas d'espace entre les balises et les textes.`
		}];

		// Calls GPT API
		console.log("[SG] Calling GPT API for story " + story.id + ", theme : " + story.theme + ", heroes : " + story.heroes);
		return strapi.service('api::generated-story.generated-story').callGPTAPI(story, messages);
	},

	async buildStoryAuthorsString(string) {

		const entries = await strapi.entityService.findMany(
			"api::author.author",
			{
				filters: { name: { $notNull: true } },
				fields: ["id", "name"],
			}
		);

		if (entries.length >= 3) {

			let randomEntries = [...entries].sort(() => 0.5 - Math.random());
			randomEntries = randomEntries.slice(0, 5);

			return randomEntries.map(item => item.name).join(', ');
		}

		return "Gilbert Delahaye, Marcel Marlier, A.Saint-Exupery, Eric-Emmanuel Schmitt, Virginie Grimaldie";
	},

	// Triggers GPT3.5 API
	async callGPTAPI(story, messages) {
		// Defines options
		const options = {
			temperature: 0.5,
			max_tokens: 3000,
		};

		// Instianciate axios object
		const openai = axios.create({
			baseURL: 'https://api.openai.com/v1',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ` + process.env.OPENAI_API_KEY,
			},
		});

		// Handle request & response
		try {
			const response = await openai.post('/chat/completions', {
				model: options.model || 'gpt-3.5-turbo',
				messages,
				...options,
			});
			console.log("[SG] Received GPT response for story " + story.id);
			return response.data.choices[0].message.content;
		} catch (error) {
			console.log('[SG] Error ChatGPT API for story ' + story.id + ' :', error);
			return null;
		}
	},

	// Splits and stores GPT content in story object
	async splitAndStoreGPTContent(story, content, authors) {
		// Retrieve title from story
		let title = content.match('<h1>(.*?)<\/h1>')[1].replace("Titre de l'histoire: ", '');

		// Update Story object, wait to return
		story = await strapi.entityService.update('api::generated-story.generated-story', story.id, {
			data: {
				content_gpt: content,
				content_final: content.replace("Titre de l'histoire: ", ''),// TODO Retirer le titre du content (dans title[0]) quand le front affichera le title sur la page story
				authors: authors,
				title: title,
				gpt_ready_time: new Date(),
				gpt_generation_duration: await strapi.service('api::midjourney-webhook.midjourney-webhook').calculateGenerationDuration(story.createdAt),
				seo: { // Sets SEO component for sharing feature
					meta_title: title,
					meta_description: content.split('\n')[2].replace('<p>', '').replace('</p>', '').split(" ").slice(0, 10).join(" ") + "...",
					robots: false
				}
			}
		});



		return story;
	},
}));