interface APIUserDataDTO {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  email: string;
  photoURL?: string;
  shortcuts: string[];
  settings: string[];
}

export default APIUserDataDTO;
