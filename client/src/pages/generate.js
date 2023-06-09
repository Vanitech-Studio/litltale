// Import necessary libraries and components
import React, { Fragment, useState, useEffect } from 'react';

import ContentSection from "@/components/ContentSection";
import Grid from '@/components/Grid';
import GridItem from '@/components/GridItem';
import Text from '@/components/Text';
import Button from '@/components/Button';
import Input from "@/components/Input"
import Link from "next/link";
import useAuth from '@/utils/useAuth';

import axios from 'axios';
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

// Import necessary functions and data
import { fetchAPI } from '@/utils/api';
import DEFAULTPAGE_DATA from '@/utils/data/page.json';

// Import router to handle redirects
import { useRouter } from 'next/router';

// Import libraries for managing cookies and showing toast notifications
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';

// Import the CSS for toast notifications
import 'react-toastify/dist/ReactToastify.css';
// Component for generating a story
export const GenerateStory = ({content, themes, heroes, global}) => {

  // Initialize state variables and hooks
  const router = useRouter();
  const [hero, setHero] = useState('');
  const [theme, setTheme] = useState('');
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);
  const { auth, token } = useAuth();
  
  useEffect(() => {    
    if(auth && token) {
      // Define a function to fetch stories and update state
      const fetchAndSetStories = () => {
        fetchStories(token)
          .then((res) => {
            setStories(res);
            console.log("stories: ", res);
          })
          .catch((error) => {
            toast.error(`Error fetching stories for user ${token}`, {
              theme: "dark",
              autoClose: 1000,
              hideProgressBar: true,
            });
          });
      };

      // Call the fetchAndSetStories function initially
      fetchAndSetStories();

      // Use setInterval to fetch stories every 5 seconds
      setInterval(fetchAndSetStories, 5000);
    }
  }, [auth, token])

  async function fetchStories(token) {
    const res = await fetchAPI(`/generated-stories?filters[user][access_code][$eq]=${token}&filters[$or][0][story_error][$null]=true&filters[$or][1][story_error][$eq]=false&sort=id:desc&fields[0]=title&fields[1]=cover_url&fields[2]=theme&fields[3]=heroes&fields[4]=story_ready`);
    if (!res.data || res.data.length === 0) {
      return Promise.reject(`Unavailable story for accessToken ${token}`);
    } else {
      return res.data;
    }
  }

  // Handler for randomizing the hero
  const RandomizeHero = () => {
    if(heroes.length > 0) {

      // Generate a random index between 0 and the length of the heroes array
      const randomIndex = Math.floor(Math.random() * heroes.length);
      
      // Extract the name of the hero corresponding to the random index
      const randomHeroName = heroes[randomIndex]?.attributes?.name || '';
      
      // Update the state with the name of the hero
      setHero(randomHeroName);

    } else {
      setHero('Tintin')
    }
  };

  // Handler for randomizing the theme
  const RandomizeTheme = () => {
    if(themes.length > 0) {

    // Generate a random index between 0 and the length of the themes array
    const randomIndex = Math.floor(Math.random() * themes.length);

    // Extract the name of the theme corresponding to the random index
    const randomThemeName = themes[randomIndex]?.attributes?.name || '';

    // Update the state with the name of the theme
    setTheme(randomThemeName);

    } else {    
      setTheme('The Antartica.')
     }
  };

  // Handler for the click on the "Validate" button
  const startStory = () => {
    // Check if the hero and theme are present
    if (hero && theme) {

      // Start the loading

      // Create a new promise for the request
      const storyPromise = axios.post(`/api/generated-stories`, {
        data: {
          // TODO SENDING CODE BETA
          heroes: hero,
          theme: theme,
          code: Cookies.get('accessToken'),
        }
      });

      // Use toast.promise to show a toast notification depending on the status of the promise
      toast.promise(
        storyPromise,
        {
          pending: 'Creating story.',
          success: 'Sending your story',
          finally: "Story sent."
        },
        {
          theme: 'dark',
          autoClose: 1000,
          hideProgressBar: true,
        }
      );

      // Handle the promise normally to set the state variables
      storyPromise
        .then((response) => {
          setStory(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error creating story:', error);
          if(error.response.status === 400 && error.response.data.user_message) {
            console.error("143: ", error.response.data.user_message)
            toast.error(error.response.data.user_message, {
              theme: 'dark',
              autoClose: 1000,
              hideProgressBar: true,
            });
          } 
          else if (error.response.status === 401) {
            console.error("145: ", error.message);
            router.push('/');
          }
          else {
            console.error("149: Une erreur est survenue.")
          }
        })
    } else {
      toast.error('Missing input.', {
        theme: 'dark',
      });
    }
  };

  useEffect(() => {
    // Check if the story is available
    if (story) {
      // Store the encrypted ID in a cookie
      Cookies.set('story_id', story.data.id);
      // Redirect to the generating page with the encoded encrypted ID
      router.push(`/generating/${story.data.id}`);
    }
  }, [story, router]);

  return (
    <>
        {/** Generation form */}
        <ContentSection className={`${stories.length > 0 ? "min-h-[75vh]" : "min-h-[100vh]"} `} firstSection={stories.length > 0} >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <div className="order-first md:order-first flex flex-col justify-start">
                  <Text size="h1">{content.explanation_title || "How to generate your story"}</Text>
                  <Text>{content.explanation_text}</Text>
              </div>
              <div className="order-last md:order-last d-block">
                <div className="flex flex-col mb-12">
                  <Text size={"sm"} className="mr-2">Theme</Text>
                  <div className="relative flex flex-row items-center justify-center">
                    <div className="relative d-block w-full">
                      <Input
                        placeholder={content.input_theme_placeholder}
                        width={"w-full"}
                        value={theme ? theme[0].toUpperCase() + theme.slice(1) : ''}
                        displayvalue={theme ? theme[0].toUpperCase() + theme.slice(1) : ''}
                        onChange={(e) => {
                          setTheme(e.target.value);
                        }}
                      />
                    </div>
                    <button onClick={RandomizeTheme} className="ml-2 text-4xl">
                      🎲
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mb-12">
                  <Text size={"sm"} className="mr-2">Heroes</Text>
                  <div className="relative flex flex-row items-center justify-center">
                    <Input
                      placeholder={content.input_heroes_placeholder}
                      width={"w-full"}
                      value={hero ? hero[0].toUpperCase() + hero.slice(1) : ''}
                      displayvalue={hero ? hero[0].toUpperCase() + hero.slice(1) : ''}
                      onChange={(e) => {
                        setHero(e.target.value);
                      }}
                    />
                    <button onClick={RandomizeHero} className="ml-2 text-4xl">
                      🎲
                    </button>
                  </div>
                </div>
                <Button onClick={startStory} label={`${content.button_text}`} />
              </div>
            </div>
        </ContentSection>

        {/** Users stories */}
        {stories.length > 0 && 
          <ContentSection>
              <Text size={"h2"} className="text-white">{content.story_section_title || "Subtitle"}</Text>
              <Grid>
                {stories.map((story) => (
                  <a style={!story.attributes.story_ready ? {pointerEvents: "none"} : null} href={`/story/${story.id}`} key={story.id} target="_blank" rel="noopener noreferrer" disabled={story.attributes.story_ready}  >
                    <GridItem
                    is_ready={story.attributes.story_ready}
                    is_loading_title={content.loading_story_title}
                    title={story.attributes.title}
                    backgroundimage={story.attributes.cover_url || content.loading_story_cover_url}
                    />
                    </a>
                ))}
              </Grid>
          </ContentSection>
        }
        <ContentSection className="pb-12">
          <Text size={"h2"} className="text-white">{global.attributes.support.support_section_title}</Text>
          <Grid>
            <a href={'/'} target="_blank" rel="noopener noreferrer">
              <GridItem
                is_support_item={true}
                title={global.attributes.support.support_card_title || "Support card title"}
                text={global.attributes.support.support_card_text || "Support card text"}
                backgroundimage={content.loading_story_cover_url}
              />
            </a>
          </Grid>             
        </ContentSection>
    </>
  );
};

// Function to fetch necessary data for the page
export async function getStaticProps() {
  const [pageData, heroesData, supportData] = await Promise.all([
    fetchAPI('/generate', {
      populate: {
        seo: {
          populate: '*',
        },
      },
    }),
    fetchAPI('/heroes', {
      populate: '*',
    }),
    fetchAPI('/themes', {
      populate: '*',
    }),
  ]);

  // Pass the data to our page via props
  return {
    props: {
      content: pageData?.data?.attributes || null,
      seo: pageData?.data?.attributes?.seo || DEFAULTPAGE_DATA.seo,
      heroes: heroesData?.data || null,
    },
    revalidate: 1
  };
}

export default GenerateStory;
