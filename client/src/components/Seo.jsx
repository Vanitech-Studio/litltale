import Head from "next/head";
import { useRouter } from "next/router";
import { getStrapiMedia } from "@/utils/media";

export default function Seo({seo, sitename, author, twitterHandle}) {

    const router = useRouter();

    //console.log(seo)

    return (
        <Head>
            <meta charSet="UTF-8"/>
            <meta name="author" content={author}/>

            <meta name="og:title" content={seo?.metatitle  + " | " + sitename}/>
            <meta name="og:description" content={seo?.metadescription}/>
            <meta name="og:image" content={getStrapiMedia(seo?.shareimage)}/>
            <meta name="og:url" content={process.env.NEXT_PUBLIC_FRONT_URL + router.pathname}/>
                {seo?.metatitle && sitename ?
                    <title>{seo?.metatitle + " | " + sitename}</title>
                    :
                    <title>{sitename}</title>
                }
            <meta name="language" content="fr"/>
            <meta name="robots" content={seo?.robots ? "index, follow" : "nofollow"}/>

            {/* Page seo */}
            <meta name="description" content={seo?.metadescription}/>
            <meta name="keywords" content={seo?.keywords}/>       
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content={twitterHandle}/>
            <meta name="twitter:title" content={seo?.metatitle  + " | " + sitename}/>
            <meta name="twitter:description" content={seo?.metadescription}/>
            <meta name="twitter:image" content={getStrapiMedia(seo?.shareimage)}/>
        </Head>
    )
}
