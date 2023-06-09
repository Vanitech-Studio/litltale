// Import necessary packages
import React, { useState, useEffect, useRef } from 'react';
import ContentSection from '@/components/ContentSection'; // Custom React component
import { Player } from '@lottiefiles/react-lottie-player'; // Lottie Player for rendering animations
import { fetchAPI } from '@/utils/api'; // Utility function for fetching data from API
import DEFAULTPAGE_DATA from '@/utils/data/page.json'; // Default page data
import 'react-toastify/dist/ReactToastify.css'; // Styles for Toast notifications

import Link from 'next/link';
import Cookies from 'js-cookie';
import Text from '@/components/Text';
import Button from '@/components/Button';
import Grid from '@/components/Grid';
import GridItem from '@/components/GridItem';

import { useRouter } from 'next/router';

import useAuth from "@/utils/useAuth"
import { useForceUpdate } from 'framer-motion';

// Define the 'generating' component
export const Generating = ({ content }) => {

  const { auth, token } = useAuth();
  const [story_error, setStoryError] = useState(false);

  // Initialize story_id state
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const id = router.query.id;

  // Fetch created stories with id - fetchReadyStoryFromId
  useEffect(() => {
    const fetchReadyStory = async () => {
      try {
          const res = await fetchReadyStoryFromId(id);
          console.log("Instant fetch : ", res);
          if (res.attributes.story_ready) {
            router.push(`/story/${res.id}`);
          }
          if(res.attributes.story_error){
            setStoryError(true);
          } else {
            setStoryError(false);
          }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    fetchReadyStory();

  }, [id]);

  // Fetch created storie with id - fetchReadyStoryFromId - SetInterval
  useEffect(() => {
    const fetchReadyStory = async () => {
      try {
          const res = await fetchReadyStoryFromId(id);
          console.log("SetInterval fetch : ", res)
          if (res.attributes.story_ready) {
            router.push(`/story/${res.id}`);
          }
          if(res.attributes.story_error){
            setStoryError(true);
            return
          } else {
            setStoryError(false);
          }
      } catch (error) {
        return false;
      }
    };
  
    const intervalId = setInterval(fetchReadyStory, 3000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [id]);
  

  async function fetchReadyStoryFromId(story_id) {
    try {
      const res = await fetchAPI(`/generated-stories?filters[id][$eq]=${story_id}&fields[0]=story_ready&fields[1]=id&fields[2]=story_error`);
      if (!res.data || res.data.length === 0) {
        setStoryError(404)
      } else {
        setStoryError(false);
      }
      return res.data[0];
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch Featured Stories - fetchStories
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const stories = await fetchFeaturedStories();
        setStories(stories);
        //console.log(stories);
      } catch (error) {
        setError(error);
        //console.log(error);
      }
    };
  
    fetchStoryData();
  }, [])
  
  async function fetchFeaturedStories() {
    try {
      const res = await fetchAPI(`/featured-stories`);
      if (!res.data || res.data.length === 0) {
        throw new Error(`Unavailable featured stories ${story_id}...`);
      }
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Render the component
  return (    
    <>
    {!story_error ? 
    <>
      <ContentSection className={`${stories.length > 0 ? "min-h-[75vh]" : "min-h-[100vh]"} `} firstSection>
        <div className="flex items-center justify-center">
          <div className="max-w-screen-lg p-5">
              <div className="space-y-4">
                {/* Lottie Player for rendering animations */}
                <Player
                  src={content.loading_lottie_url}
                  style={{ height: '300px', width: '300px' }}
                  loop
                  autoplay
                  />
                <Text size="h3">{content.loading_text || "loading_text"}</Text>
                {content.explanation_text && <Text size="sm">{content.explanation_text}</Text>}
              </div>
          </div>
        </div>
      </ContentSection>
      {/** Users stories */}
      {stories.length > 0 && 
      <ContentSection className="py-0">
      <Text size={"h2"} className="text-white">{content.story_section_title || "Subtitle"}</Text>
      <Grid>
        {stories.map((story) => (
          <Link key={story.id} target="_blank" href={`/story/${story.id}`}>
            <GridItem 
            loading_text={content.card_loading_text}
            is_in_featured_section={true} 
            title={story.attributes.title || ""}
            backgroundimage={story.attributes.cover_url || ""}
            />
            </Link>
        ))}
      </Grid>
      </ContentSection>
      }
    </>
    :
    <ContentSection fullSize>
      <div className="flex items-center justify-center max-w-screen-lg h-screen mx-auto">
        <div className="flex align-center justify-center flex-col my-6">
          {/** Give feedback */}
          <Text className="text-center" size="sm">{story_error !== 404 && content.story_failure || content.story_notfound}</Text>
          <Button className="" label={content.button_new_story} link={"/generate"}/>
        </div>
      </div>
    </ContentSection>
    }
    </>
  );
};

export async function getServerSideProps(context) {
  // You can access the dynamic path parameter with context.params.id
  const id = context.params.id;
  
  const [pageData] = await Promise.all([
    fetchAPI('/loading', {
      populate: {
        seo: {
          populate: '*',
        },
      },
    }),
    // You can use the id for something here, if necessary
  ]);

  // Return the fetched data as props for the component
  return {
    props: {
      content: pageData?.data?.attributes || null,
      seo: pageData?.data?.attributes?.seo || DEFAULTPAGE_DATA.seo,
    },
  };
}
// Export the component as default export
export default Generating;
