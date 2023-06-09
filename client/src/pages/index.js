import React, { useState, useEffect } from 'react';

import ContentSection from "@/components/ContentSection";
import Text from '@/components/Text';
import Button from '@/components/Button';
import Input from "@/components/Input"

import Image from "next/image";
import { useRouter } from 'next/router';

import { fetchAPI } from "@/utils/api";
import DEFAULTPAGE_DATA from "@/utils/data/page.json";

import useAuth from '@/utils/useAuth';

import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Homepage = ( { content } ) => {
    const router = useRouter();
    const { auth, token } = useAuth();
    const [secret_code, setSecretCode] = useState('');

    useEffect(() => {    

      if(auth && token) {
        router.push(`/generate`)
      }
    }, [auth, token])

    // Function to fetch a code from the Strapi /beta-codes endpoint
    async function fetchCode() {
      const res = await fetchAPI(`/beta-users?filters[access_code][$eq]=${secret_code}`);

      // If no data is returned, set 'code' state to false and throw an error
      if (!res.data || res.data.length === 0) {
        throw new Error('Wrong beta access code.');
     } else {
        // Otherwise, return the code and set 'code' state to true
        return res.data[0].attributes.access_code;
     }
    }

    async function handleClick (e) {
      if(e){
        e.preventDefault();
      }
      // If the input is empty, show an error toast
      if(!secret_code){
        toast.error("Empty code", {
          theme: "dark"
        }); 
      } else { 
        // Fetch the code
        fetchCode().then((code) => {
          if (secret_code === code) {
            Cookies.set('accessToken', code);
            Cookies.set('auth', "true");
            // Redirect to the generate story page
            setTimeout(() => {
              router.push(`/generate`);
            }, 200); 
          }
          
        }).catch((error) => {
          // If an error occurs, show an error toast
          toast.error(error.message, {
            theme: "dark",
            autoClose: 3000,
            hideProgressBar: true,
          }); 
        });
      }
    }

  return (
      <ContentSection className="min-h-[100vh]" fullSize>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
          <div className="flex flex-col justify-start"> 
            <Text size="h1">{ content.welcome_text }</Text>
            <Text>{ content.explanation_text }</Text>
            <div className="d-block my-6">

                <Input
                width={"w-56 :w-36"}
                className="mr-3"
                type="password" 
                placeholder={ content.input_placeholder }
                onChange={(e) => setSecretCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleClick();
                  }
                }}/>
                <Button onClick={handleClick}  label={`${content.button_text}`} />             
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image className="rounded-md shadow-2xl w-full"
              src={
                (content.illustration_url.includes("cdn.discordapp.com") || content.illustration_url.includes("media.discordapp.net")) 
                ? content.illustration_url 
                : "https://cdn.discordapp.com/attachments/1108318248858030121/1111608391610142821/RogerfHinton_Illustration_for_children_3D_animation_vibrant_col_387c8de2-ade9-4c61-97ef-a7e5dd4bcaaf.png"
            }
              alt="My Image"
              width={500}
              height={500}
              objectFit={"cover"} />
          </div> 
        </div>
      </ContentSection>
  )
}

// This function fetches data from your API for static rendering of the page
export async function getStaticProps() {
  const [home, stories] = await Promise.all([
    fetchAPI("/homepage", { 
      populate: {
        seo: {
          populate: "*",
        },
        content: true,
        theme: {
          populate: "*"
        }
      }
    }),
  ]);

  // Pass the data to our page via props
  return { 
    props: {
      seo: home?.data?.attributes?.seo || DEFAULTPAGE_DATA.seo,
      content: home?.data?.attributes || null,
      stories: stories?.data || null,
      theme: home.data.attributes.theme || null
    },
    revalidate: 60
   };
}

export default Homepage;
