import LandingPageUI from './landing-page-ui';

export default async function HomePage() {
  // Paths for DOCX files
  const termsDocxPath = 'app/docs/EMC Guest Wi-Fi Acceptable Use Policy 2025.docx';
  const safeguardingDocxPath = 'app/docs/EMC Euxton Safeguarding Policy 2024.docx';

  let termsContentHtml = '';
  let safeguardingContentHtml = '';


  return (
    <LandingPageUI 
      termsContent={termsContentHtml} 
      safeguardingContent={safeguardingContentHtml} 
    />
  );
}
