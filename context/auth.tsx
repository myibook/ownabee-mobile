import * as WebBrowser from "expo-web-browser";
import * as React from "react";
// import * as AppleAuthentication from "expo-apple-authentication";
import { tokenCache } from "@/utils/cache";
import { BASE_URL } from "@/utils/constants";
// import { handleAppleAuthError } from "@/utils/handleAppleError";
import { setSignOutHandler } from "@/utils/axiosInstance";
import { AuthUser } from "@/utils/middleware";
import {
  AuthError,
  AuthRequestConfig,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as jose from "jose";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Context Setup
const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: () => {},
  signOut: () => {},
  // signInWithApple: () => {},
  signInWithAppleWebBrowser: () => Promise.resolve(),
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

//  Auth Configurations
const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const appleConfig: AuthRequestConfig = {
  clientId: "apple",
  scopes: ["name", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

const appleDiscovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/apple/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/apple/token`,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const [appleRequest, appleResponse, promptAppleAsync] = useAuthRequest(
    appleConfig,
    appleDiscovery
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);
  const isWeb = Platform.OS === "web";
  const refreshInProgressRef = React.useRef(false);

  //  Initial Auth Check
  React.useEffect(() => {
    restoreSession();
    setSignOutHandler(signOut);
  }, []);

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  React.useEffect(() => {
    handleAppleResponse();
  }, [appleResponse]);

  //  Restore tokens from cache
  const restoreSession = async () => {
    setIsLoading(true);
    try {
      const storedAccessToken = await tokenCache.getToken("accessToken");
      const storedRefreshToken = await tokenCache.getToken("refreshToken");

      if (storedAccessToken) {
        const decoded = jose.decodeJwt(storedAccessToken);
        const exp = (decoded as any).exp;
        const now = Math.floor(Date.now() / 1000);

        if (exp && exp > now) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken || null);
          setUser(decoded as AuthUser);
        } else if (storedRefreshToken) {
          await refreshAccessToken(storedRefreshToken);
        }
      } else if (storedRefreshToken) {
        await refreshAccessToken(storedRefreshToken);
      }
    } catch (e) {
      console.error("Error restoring session:", e);
    } finally {
      setIsLoading(false);
    }
  };

  //  Token Refresh
  const refreshAccessToken = async (tokenToUse?: string) => {
    if (refreshInProgressRef.current) return null;
    refreshInProgressRef.current = true;

    try {
      const currentToken = tokenToUse || refreshToken;
      if (!currentToken) {
        console.warn("No refresh token");
        return signOut();
      }

      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "native",
          refreshToken: currentToken,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) signOut();
        return null;
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await res.json();

      if (newAccessToken) {
        await tokenCache.saveToken("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        const decoded = jose.decodeJwt(newAccessToken);
        setUser(decoded as AuthUser);
      }

      if (newRefreshToken) {
        await tokenCache.saveToken("refreshToken", newRefreshToken);
        setRefreshToken(newRefreshToken);
      }

      return newAccessToken;
    } catch (err) {
      console.error("Refresh error:", err);
      signOut();
    } finally {
      refreshInProgressRef.current = false;
    }
  };

  // Handle tokens after login
  const handleNativeTokens = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    await tokenCache.saveToken("accessToken", accessToken);
    await tokenCache.saveToken("refreshToken", refreshToken);

    const decoded = jose.decodeJwt(accessToken);
    await fetch(`${BASE_URL}/api/user/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: decoded.email,
        name: decoded.name,
        sub: decoded.sub,
        picture: decoded.picture,
      }),
    });
    setUser(decoded as AuthUser);
  };

  // Google OAuth Response
  async function handleResponse() {
    if (response?.type === "success") {
      try {
        setIsLoading(true);
        const { accessToken, refreshToken } = response.params;
        if (!accessToken || !refreshToken) {
          throw new Error("Missing tokens in response");
        }
        await handleNativeTokens({ accessToken, refreshToken });
      } catch (e) {
        console.error("Error handling auth response:", e);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "cancel") {
      alert("Sign in cancelled");
    } else if (response?.type === "error") {
      setError(response.error ?? null);
    }
  }

  //  Apple OAuth Response
  const handleAppleResponse = async () => {
    if (appleResponse?.type === "success") {
      try {
        const { code } = appleResponse.params;
        const res = await exchangeCodeAsync(
          {
            clientId: "apple",
            code,
            redirectUri: makeRedirectUri(),
            extraParams: { platform: Platform.OS },
          },
          appleDiscovery
        );

        await handleNativeTokens({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken!,
        });
      } catch (e) {
        console.error("Apple auth error:", e);
      }
    } else if (appleResponse?.type === "cancel") {
      console.log("Apple sign-in cancelled");
    } else if (appleResponse?.type === "error") {
      console.log("Apple auth error");
    }
  };

  //  Protected API Fetch
  const fetchWithAuth = async (url: string, options: RequestInit) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return res;
  };

  //  Sign In
  const signIn = async () => {
    if (!request) return;
    try {
      await promptAsync();
    } catch (e) {
      console.log("SignIn error:", e);
    }
  };

  //Sign In with Apple
  const signInWithAppleWebBrowser = async () => {
    if (!appleRequest) return;
    try {
      await promptAppleAsync();
    } catch (e) {
      console.log("Apple sign-in error:", e);
    }
  };

  //Sign Out
  const signOut = async () => {
    await tokenCache.deleteToken("accessToken");
    await tokenCache.deleteToken("refreshToken");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signInWithAppleWebBrowser,
        isLoading,
        error,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//Hook for consuming context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
