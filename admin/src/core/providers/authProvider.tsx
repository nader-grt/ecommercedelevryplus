

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
    // accessToken = data.data.accessToken;
    // user = data.data.user;

    console.log("LOGIN response:", data);

    accessToken = data.data.accessToken;
    user = data.data.user;

    console.log("LOGIN user:", user);

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

  // getAccessToken: () => accessToken ?? sessionStorage.getItem("accessToken"),

  // getUser: () => user ?? JSON.parse(sessionStorage.getItem("user") || "null"),

  getAccessToken: () => {
    const token = accessToken ?? sessionStorage.getItem("accessToken");

    console.log("authProvider.getAccessToken():", token);

    return token;
  },

  // getUser: () => {
  //   const currentUser =
  //     user ?? JSON.parse(sessionStorage.getItem("user") || "null");

  //   console.log("authProvider.getUser():", currentUser);

  //   return currentUser;
  // },

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

  // checkAuth: async () => {
  //   const token = authProvider.getAccessToken();

  //   if (!token) return Promise.reject();

  //   try {
  //     const res = await fetch("http://localhost:4000/api/me", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       credentials: "include",
  //     });

  //     if (!res.ok) throw new Error("Unauthorized");

  //     const response = await res.json();

  //     user = response.data;

  //     sessionStorage.setItem("user", JSON.stringify(user));

  //     return Promise.resolve();
  //   } catch {
  //     authProvider.clear();
  //     return Promise.reject();
  //   }
  // },

  getUser: () => {
    const currentUser =
      user ?? JSON.parse(sessionStorage.getItem("user") || "null");

    console.log("authProvider.getUser():", currentUser);

    return currentUser;
  },

  // checkAuth: async () => {
  //   const token = authProvider.getAccessToken();

  //   if (!token) {
  //     return Promise.reject();
  //   }

  //   try {
  //     const res = await fetch("http://localhost:4000/api/me", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       credentials: "include",
  //     });

  //     if (!res.ok) {
  //       throw new Error("Unauthorized");
  //     }

  //     const response = await res.json();

  //     console.log("checkAuth /api/me response:", response);

  //     user = response.data;

  //     console.log("checkAuth user:", user);

  //     sessionStorage.setItem("user", JSON.stringify(user));

  //     return Promise.resolve();
  //   } catch {
  //     authProvider.clear();
  //     return Promise.reject();
  //   }
  // },


  checkAuth: async () => {
    const token = authProvider.getAccessToken();
  
    if (!token) {
      return Promise.reject();
    }
  
    try {
      const res = await fetch("http://localhost:4000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
  
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
  
      const response = await res.json();
  
      console.log("checkAuth /api/me response:", response);
  
      user = response.data;
  
      console.log("checkAuth user:", user);
  
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

  // getPermissions: () => {
  //   const u = authProvider.getUser();

  //   const scope =
  //     u?.role === "SUPERADMIN" && u?.companyId === null
  //       ? "PLATFORM"
  //       : "COMPANY";

  //       console.log("React Admin permissions:", {
  //         role: u?.role,
  //         companyId: u?.companyId ?? null,
  //         scope,
  //       });

  //   return Promise.resolve({
  //     role: u?.role,
  //     companyId: u?.companyId ?? null,
  //     scope,
  //   });
  // },

  getPermissions: () => {
    const u = authProvider.getUser();

    const scope =
      u?.role === "SUPERADMIN" && u?.companyId == null ? "PLATFORM" : "COMPANY";

    const permissions = {
      role: u?.role,
      companyId: u?.companyId ?? null,
      scope,
    };

    console.log("React Admin permissions:", permissions);

    return Promise.resolve(permissions);
  },

  // canAccess: async ({
  //   action,
  //   resource,
  // }: CanAccessProps): Promise<boolean> => {
  //   const u = authProvider.getUser();
  
  //   console.log("React Admin canAccess:", {
  //     role: u?.role,
  //     companyId: u?.companyId ?? null,
  //     action,
  //     resource,
  //   });
  
  //   // SUPERADMIN / PLATFORM
  //   if (u?.role === "SUPERADMIN" && u?.companyId == null) {
  //     if (resource === "companies") {
  //       console.log(
  //         "canAccess companies → SUPERADMIN → ALLOWED ✅"
  //       );
  
  //       return true;
  //     }
  //   }
  
  //   // COMPANY USER
  //   if (u?.companyId != null) {
  //     if (resource === "companies") {
  //       console.log(
  //         "canAccess companies → COMPANY USER → DENIED ❌"
  //       );
  
  //       return false;
  //     }
  //   }
  
  //   // Temporary: allow other resources
  //   return true;
  // },

  canAccess: async <
  RecordType extends Record<string, any> = Record<string, any>
>({
  action,
  resource,
  record,
}: {
  action: string;
  resource: string;
  record?: RecordType;
}): Promise<boolean> => {
  const u = authProvider.getUser();

  console.log("React Admin canAccess:", {
    role: u?.role,
    companyId: u?.companyId ?? null,
    action,
    resource,
    record,
  });

  // SUPERADMIN = PLATFORM
  if (
    u?.role === "SUPERADMIN" &&
    u?.companyId == null
  ) {
    if (resource === "companies") {
      console.log(
        "canAccess companies → SUPERADMIN → ALLOWED ✅"
      );

      return true;
    }
  }

  // COMPANY USERS
  if (u?.companyId != null) {
    if (resource === "companies") {
      console.log(
        "canAccess companies → COMPANY USER → DENIED ❌"
      );

      return false;
    }
  }

  // TEMPORARY: allow other resources
  return true;
},
};

export default authProvider;
