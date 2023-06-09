import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { fetchAPI } from '@/utils/api';

import ContentSection from '@/components/ContentSection';
import StoryContent from '@/components/StoryContent';
import Button from '@/components/Button';
import Text from '@/components/Text';
import router from 'next/router';

export const Story = ({ content, seo, story }) => {
    
  const [canShare, setCanShare] = useState(true);
  const [url, setUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    setUrl(`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`);
    if(!navigator.share) {
      setCanShare(false);
    }
  }, []);
  
  const handleOnClick = () => {
    if(navigator.share) {
      navigator.share({
        title: seo.metatitle,
        text: seo.metadescription,
        url: url,
      })
      .catch(error => {
        console.error('Something went wrong sharing the story', error);
      });
    } else {
      setCanShare(false)
    }
  };

  return (
     <>
       {story ? 
        <ContentSection>
          <div className="min-h-screen">
              <StoryContent>
                <div dangerouslySetInnerHTML={{ __html: content?.content_final }} />
                <div className="d-block my-6">
                  {/** Share a Story */}
                  {canShare &&
                  <Button className={"mr-2"} label={story?.button_share_story || "Share"} onClick={handleOnClick}/>
                  }
                  {/** Give feedback */}
                  <Button className={"mr-2"} label={story?.button_feedback || "Feedback button"} target="_blank" link={story?.feedback_form_url}/>
                  {/** Give feedback */}
                  <Button label={story?.button_new_story || "Create a new story"} link={"/generate"}/>
                </div>
              </StoryContent>
          </div>
        </ContentSection>
       :      
         <ContentSection fullSize>
         <div className="flex items-center justify-center max-w-screen-lg h-screen mx-auto">
           <div className="flex align-center justify-center flex-col my-6">
             {/** Give feedback */}
             <Text size="sm">{story?.story_not_found || "Story not found"}</Text>
             <Button className="" label={story?.button_new_story || "Create a new story"} link={"/generate"}/>
           </div>
         </div>
       </ContentSection> 
     }
   </>
  );
};

export async function getStaticPaths() {
  const res = await fetchAPI(`/generated-stories`);
  const paths = res.data.map((story) => ({
    params: { id: story.id.toString() },
  }));

  // console.log(paths); 

  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const data = null;
  try {
    console.log(params);
    const storyId = params.id;
    console.log("storyID: ",storyId);

    const content = await fetchAPI(`/generated-stories?filters[id][$eq]=${storyId}&filters[story_ready][$eq]=true&fields[0]=content_final&populate[0]=seo`);
    const story = await fetchAPI(`/story`);

    return {
      props: {
        content: content?.data[0].attributes || '',
        story: story?.data?.attributes || '',
        seo: {
          metatitle: content?.data[0]?.attributes?.seo?.meta_title || false,
          metadescription: content?.data[0]?.attributes?.seo?.meta_description || false,
          shareimage: {
            data: {
              attributes: {
                url: content?.data[0]?.attributes?.seo?.share_image_url || "https://base-cms-git-storygpt-vanitech-studio.vercel.app/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F1108318248858030121%2F1111608391610142821%2FRogerfHinton_Illustration_for_children_3D_animation_vibrant_col_387c8de2-ade9-4c61-97ef-a7e5dd4bcaaf.png&w=640&q=75"
              }
            }
          },
          robots: false,
          keywords: "",
        }
      },
      revalidate: 1
    };
  } catch(err) {
    console.log(err);
    return {
      props: {
        data,
        seo: {
          metatitle: "404",
          metadescription: "404",
          shareimage: {
            data: {
              attributes: {
                url: "https://base-cms-git-storygpt-vanitech-studio.vercel.app/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F1108318248858030121%2F1111608391610142821%2FRogerfHinton_Illustration_for_children_3D_animation_vibrant_col_387c8de2-ade9-4c61-97ef-a7e5dd4bcaaf.png&w=640&q=75"
              }
            }
          },
          robots: false,
          keywords: "",
        }
      },
      revalidate: 1,
    }
  }
}

export default Story;