const qs = require('qs')

// This function returns the base URL of the Strapi API, using environment variables if available.
export function getStrapiURL(path = "") {
  return `${
    // If the environment variable NEXT_PUBLIC_STRAPI_API_URL is set, use it as the base URL.
    process.env.NEXT_PUBLIC_STRAPI_API_URL || 
    // If not, default to "http://127.0.0.1:1337".
    "http://127.0.0.1:1337"
  }${path}`;
}

/**
 * This function is a helper to make requests to Strapi API endpoints
 *
 * @param {string} path The path of the API route
 * @param {Object} urlParamsObject An object containing URL parameters which will be stringified
 * @param {Object} options An object containing options to be passed to fetch
 * @returns The response from the API call, parsed as JSON
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Default headers to be sent with each request
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      // Use the environment variable NEXT_PUBLIC_STRAPI_API_TOKEN as the Bearer token.
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    // Merge these headers with any other options passed in.
    ...options,
  };

  // Stringify the URL parameters.
  const queryString = qs.stringify(urlParamsObject);
  // Generate the request URL, adding any parameters as a query string if available.
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  let apiResponse;
  
  try {
    // Check if the request should be a POST.
    if (options.method && options.method.toUpperCase() === "POST") {
      // Make a POST request.
      apiResponse = await fetch(requestUrl, {
        ...mergedOptions,
        method: "POST",
        cache: 'no-store',
      });
      console.log(apiResponse);
    } else {
      // Make a GET request.
      apiResponse = await fetch(requestUrl, mergedOptions);
      //console.log("Api response: ", apiResponse.status);
    }

    // Check if the request was successful.
    if (!apiResponse.ok) {
      // If not, log the status text.
      console.error(apiResponse.statusText);
    }

    // Parse the response as JSON.
    const data = await apiResponse.json();
    // Log the response data to the console.
    //console.log(data);

    // Return the parsed data.
    return data;
  } catch (error) {
    // If an error occurred during the request, log it to the console.
    console.error('Failed to fetch API:', error);
  }
}
