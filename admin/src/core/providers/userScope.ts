import authProvider from "../providers/authProvider";

export const getCurrentUser = () => {
  return authProvider.getUser();
};

export const isPlatformUser = (): boolean => {
  const user = getCurrentUser();

  return (
    user?.role === "SUPERADMIN" &&
    user?.companyId === null
  );
};

export const isCompanyUser = (): boolean => {
  const user = getCurrentUser();

  return user?.companyId !== null;
};