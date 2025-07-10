import {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { useDispatch } from "react-redux";
import {
  getUsers,
  getUserRoles,
  setSelectedUser,
} from "../../../store/slices/userSlice";
import config from "../../../config/config";
import type { AppDispatch } from "../../../store/store";
import { StoredUserDTO } from "../TkAuthService";
import { User } from "../../../types/User";

interface AuthContextModel {
  user?: StoredUserDTO & {
    USER_ID?: string;
    NAME?: string;
    SURNAME?: string;
  };
  authenticate?: () => void;
  signout?: () => void;
}

const AuthContext = createContext<AuthContextModel>({
  user: undefined,
  authenticate: undefined,
  signout: undefined,
});

interface AuthProviderProps extends PropsWithChildren {
  urlBase?: string;
  pathPrefix?: string;
}

AuthProvider.defaultProps = {
  urlBase: config.api.user.baseUrl,
  pathPrefix: config.api.user.path,
};

const FIXED_USER_ID = "eb82d9b5-e2c5-4101-82a1-1f04e07177a1";

// Mnandant 4262f297-f0d6-43a1-8c0d-ecc6dd2ecf8d
// Admin eb82d9b5-e2c5-4101-82a1-1f04e07177a1

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextModel["user"]>(undefined);
  const dispatch = useDispatch<AppDispatch>();

  const authenticate = async () => {
    // Basis-User-Daten
    const userData: User = {
      USER_ID: FIXED_USER_ID,
      NAME: "Local",
      SURNAME: "User",
    };

    try {
      // Lade Nutzer-Daten aus Backend
      const users = await dispatch(getUsers({ user_id: userData.USER_ID })).unwrap();

      // Lade Rollen aus Backend
      const userRoles = await dispatch(getUserRoles({ user_id: userData.USER_ID })).unwrap();

      if (users && users.length > 0) {
        // Extrahiere Rolle, z.B. aus userRoles (angepasst an deine Datenstruktur)
        // Hier nehme ich als Beispiel die erste Rolle oder "user" als default
        const roleFromApi: string = (userRoles && userRoles.length > 0 && userRoles[0].ROLE) || "user";

        // Mappe User zu SelectedUser-Form inklusive Rolle aus Rollen-API
        const selectedUser = {
          USER_ID: users[0].USER_ID,
          NAME: users[0].NAME,
          SURNAME: users[0].SURNAME,
          ROLE: roleFromApi,
        };

        // Erzeuge storedUser inkl. Rolle + Nutzerdaten
        const storedUser: StoredUserDTO & {
          USER_ID?: string;
          NAME?: string;
          SURNAME?: string;
        } = {
          authenticated: true,
          role: roleFromApi,
          USER_ID: selectedUser.USER_ID,
          NAME: selectedUser.NAME,
          SURNAME: selectedUser.SURNAME,
        };

        // Setze Context-State
        setUser(storedUser);

        // Speichere ausgewählten Nutzer in Redux State
        dispatch(setSelectedUser(selectedUser));
      } else {
        // Falls keine User gefunden, setze default storedUser (optional)
        setUser({
          authenticated: false,
          role: "guest",
        });
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      // Fallback: setze user als nicht authentifiziert
      setUser({
        authenticated: false,
        role: "guest",
      });
    }
  };

  const signout = () => {
    setUser(undefined);
    dispatch(setSelectedUser(null)); // Clear selected user on signout
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authenticate, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext, type AuthContextModel };
