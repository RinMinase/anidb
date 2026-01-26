import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import axios, { AxiosError } from "axios";

export const AuthenticatedUserContext = createContext<boolean | null>(null);

type Props = {
  currRoute: string;
  children: any;
};

const checkAuthApi = () => axios.get("/auth/user");

const AuthenticatedUser = (props: Props) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const commonURLs = ["/", "/register"];
      const isCommonRoute = commonURLs.includes(window.location.pathname);

      if (!isCommonRoute) {
        const {
          data: { data },
        } = await checkAuthApi();

        if (data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status === 403) {
          setIsAdmin(false);
        }
      }
    }
  };

  useEffect(() => {
    if (props.currRoute) checkAuth();
  }, [props.currRoute]);

  return (
    <AuthenticatedUserContext.Provider value={isAdmin}>
      {props.children}
    </AuthenticatedUserContext.Provider>
  );
};

export default AuthenticatedUser;
