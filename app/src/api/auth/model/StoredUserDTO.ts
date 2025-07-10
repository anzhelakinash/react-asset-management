import APIUserDataDTO from "./APIUserDataDTO";

interface StoredUserDTO {
  authenticated: boolean;
  role?: string;
  data?: APIUserDataDTO;
}

export default StoredUserDTO;
