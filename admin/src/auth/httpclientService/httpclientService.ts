import authProvider from "../../core/providers/authProvider";

let refreshPromise: Promise<string | null> | null = null;

const API_REFRESH = "http://localhost:4000/api/refresh-token";
/**
 * Build fetch options
 */
// function buildOptions(options: RequestInit, token?: string | null): RequestInit {
//   const accessToken = token ?? authProvider.getAccessToken();

//   return {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//     },
//   };
// }

function buildOptions(options: RequestInit, token?: string | null): RequestInit {
  const accessToken = token ?? authProvider.getAccessToken();

  const isFormData = options.body instanceof FormData;

  return {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
}

/**
 * Refresh Access Token
 */
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(API_REFRESH, {
      method: "POST",
      credentials: "include",
    
    })
      .then(async (res) => {
        if (!res.ok) return null;

        const data = await res.json();
       console.log("dataaaa  of user ",data.user)
        authProvider.updateAccessToken(data.accessToken, data.user);
        

        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/**
 * HTTP Client
 */
export async function httpclientService(
  url: string,
  options: RequestInit = {}
): Promise<{ json: any }> {
  try {
    let res = await fetch(url, buildOptions(options));

    // AccessToken expired
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
console.log("newwwwwwwww  ",newToken)
      // refresh failed → redirect login
      if (!newToken) {
        authProvider.clear?.();
        window.location.href = "/login";
        throw new Error("Authentication required");
      }

      // retry original request
      res = await fetch(url, buildOptions(options, newToken));
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return { json: data };
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
}