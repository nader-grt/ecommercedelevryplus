import authProvider from "../../core/providers/authProvider";

let refreshPromise: Promise<string | null> | null = null;

const API_REFRESH = "http://localhost:4000/api/refresh-token";

// ===============================
//  CHECK FORM DATA
// ===============================
function isFormData(body: any): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

// ===============================
//  BUILD OPTIONS (FIXED)
// ===============================
function buildOptions(
  options: RequestInit,
  token?: string | null
): RequestInit {
  const accessToken = token ?? authProvider.getAccessToken();

  const formData = isFormData(options.body);

  return {
    ...options,
    credentials: "include",
    headers: {
      ...(formData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
}

// ===============================
//  REFRESH TOKEN
// ===============================
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(API_REFRESH, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;

        const data = await res.json();

        authProvider.updateAccessToken(
          data.accessToken,
          data.user
        );

        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// ===============================
//  HTTP CLIENT (FINAL)
// ===============================
export async function httpclientService(
  url: string,
  options: RequestInit = {}
): Promise<{ json: any }> {
  try {
    let res = await fetch(url, buildOptions(options));

    // =========================
    //  HANDLE TOKEN EXPIRED
    // =========================
    if (res.status === 401) {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        authProvider.clear?.();
        window.location.href = "/login";
        throw new Error("Authentication required");
      }

      res = await fetch(url, buildOptions(options, newToken));
    }

    // =========================
    //  SAFE JSON PARSE
    // =========================
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    // =========================
    //  ERROR HANDLING
    // =========================
    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return { json: data };
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
}