type LegalSection = {
  title: string;
  content: string;
};

type LegalContent = {
  termsTitle: string;
  privacyTitle: string;
  terms: LegalSection[];
  privacy: LegalSection[];
};
