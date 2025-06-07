import LandingPageUI from './landing-page-ui';

export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const getQueryParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) {
      return param[0];
    }
    return param;
  };

  return (
    <LandingPageUI 
      ap={getQueryParam(searchParams?.ap)}
      id={getQueryParam(searchParams?.id)}
      url={getQueryParam(searchParams?.url)}
      ssis={getQueryParam(searchParams?.ssis)}
    />
  );
}
