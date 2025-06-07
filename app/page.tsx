import LandingPageUI from './landing-page-ui';

// Define the props type for this page, reflecting Next.js 15 changes
interface HomePageProps {
  params: Promise<Record<string, string>>; // For app/page.tsx, Next.js provides an empty params object {}
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // searchParams can be optional
}

export default async function HomePage({ params: paramsPromise, searchParams: searchParamsPromise }: HomePageProps) {
  // Await the promises to get the actual values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _params = await paramsPromise;
  const searchParams = searchParamsPromise ? await searchParamsPromise : {}; // Handle optional searchParams
  const apiKey = process.env.SITE_MANAGER_API_KEY;
  const apiUrlBase = process.env.SITE_MANAGER_URL;
  let siteId: string | undefined = undefined;
  let clientId: string | undefined = undefined;

  // Helper to get single query param value
  const getQueryParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) {
      return param[0];
    }
    return param;
  };

  // Extract all query parameters
  const ap = getQueryParam(searchParams.ap);
  const url = getQueryParam(searchParams.url);
  const ssis = getQueryParam(searchParams.ssis);
  const clientMacAddressFromQuery = getQueryParam(searchParams.id); // This is the client's MAC address

  if (apiKey && apiUrlBase) {
    const sitesUrl = `${apiUrlBase}/v1/sites?pageSize=10`;
    try {
      console.log(`Fetching sites from: ${sitesUrl}`);
      const response = await fetch(sitesUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the response is an object with a 'data' array of sites
        // and each site has an 'id'. Adjust if the structure is different.
        if (data && data.data && data.data.length > 0) {
          const firstSite = data.data[0];
          siteId = firstSite.siteId; // Corrected: API response uses 'siteId'
          console.log('Successfully fetched site data. First site ID:', siteId);

          // Second API call: Get client details by MAC address (from clientMacAddressFromQuery prop)
          if (siteId && clientMacAddressFromQuery) {
            const clientDetailsUrl = `${apiUrlBase}/v1/sites/${siteId}/clients?filter=macAddress.eq('${clientMacAddressFromQuery}')`;
            console.log(`Fetching client details from: ${clientDetailsUrl}`);
            try {
              const clientResponse = await fetch(clientDetailsUrl, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'X-API-Key': apiKey,
                },
              });
              if (clientResponse.ok) {
                const clientData = await clientResponse.json();
                if (clientData && clientData.data && clientData.data.length > 0) {
                  const firstClient = clientData.data[0];
                  clientId = firstClient.id; // Assuming client ID is in 'id' field
                  console.log('Successfully fetched client details:', firstClient);
                  console.log('Client ID:', clientId);
                } else if (clientData && clientData.data && clientData.data.length === 0) {
                  console.log(`No client found with MAC address: ${clientMacAddressFromQuery}`);
                } else {
                  console.warn('Fetched client data, but the structure was not as expected or no client found:', clientData);
                }
              } else {
                console.error(`Failed to fetch client details. Status: ${clientResponse.status}`, await clientResponse.text());
              }
            } catch (clientError) {
              console.error('Error fetching client details:', clientError);
            }
          } else if (!clientMacAddressFromQuery) {
            console.log('Client MAC address (id parameter) not provided, skipping client details fetch.');
          }

        } else if (data && data.data && data.data.length === 0) {
          console.log('API call successful but no sites found.');
        } else {
          console.warn('Fetched site data, but the structure was not as expected:', data);
        }
      } else {
        console.error(`Failed to fetch sites. Status: ${response.status}`, await response.text());
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  } else {
    console.error('SITE_MANAGER_API_KEY or SITE_MANAGER_URL is not set in environment variables.');
  }


  return (
    <LandingPageUI 
      ap={ap}
      id={clientMacAddressFromQuery} // Pass client MAC as 'id' prop
      url={url}
      ssis={ssis}
      siteId={siteId}
      clientId={clientId}
    />
  );
}
