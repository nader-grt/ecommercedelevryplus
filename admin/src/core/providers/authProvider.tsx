
let accessToken: string | any = null;
let user: any = null;

const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await res.json();
    accessToken = data.data.accessToken;
    user = data.data.user;

    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("user", JSON.stringify(user));

    return Promise.resolve();
  },

  logout: async () => {
    await fetch("http://localhost:4000/api/logout", { credentials: "include" });
    authProvider.clear();
    return Promise.resolve();
  },

  clear: () => {
    accessToken = null;
    user = null;
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
  },

  updateAccessToken: (token: string, userData?: any) => {
    accessToken = token;
    if (userData) user = userData;
    sessionStorage.setItem("accessToken", token);
    if (userData) sessionStorage.setItem("user", JSON.stringify(userData));
  },

  getAccessToken: () => accessToken ?? sessionStorage.getItem("accessToken"),

  getUser: () => user ?? JSON.parse(sessionStorage.getItem("user") || "null"),

  // checkAuth: async () => {
  //   const token = authProvider.getAccessToken();
  //   if (!token) return Promise.reject();

  //   // optional: get fresh user info from backend
  //   try {
  //     const res = await fetch("http://localhost:4000/api/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //       credentials: "include",
  //     });
  //     if (!res.ok) throw new Error("Unauthorized");
  //     const userData = await res.json();
  //     user = userData;
  //     return Promise.resolve();
  //   } catch {
  //     authProvider.clear();
  //     return Promise.reject();
  //   }
  // },

  checkAuth: async () => {
    const token = authProvider.getAccessToken();
  
    if (!token) return Promise.reject();
  
    try {
      const res = await fetch("http://localhost:4000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Unauthorized");
  
      const response = await res.json();
  
      user = response.data;
  
      sessionStorage.setItem("user", JSON.stringify(user));
  
      return Promise.resolve();
    } catch {
      authProvider.clear();
      return Promise.reject();
    }
  },
  checkError: (error: any) => {
    if (error.status === 401 || error.status === 403) {
      authProvider.clear();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // getPermissions: () => {
  //   const u = authProvider.getUser();
  //   return Promise.resolve(u?.role);
  // },

  getPermissions: () => {
    const u = authProvider.getUser();
  
    const scope =
      u?.role === "SUPERADMIN" && u?.companyId === null
        ? "PLATFORM"
        : "COMPANY";
  
    return Promise.resolve({
      role: u?.role,
      companyId: u?.companyId ?? null,
      scope,
    });
  },
};

export default authProvider;