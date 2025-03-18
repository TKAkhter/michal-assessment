import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const addDelay = async (delay: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((res) => setTimeout(res, delay));
};

export const sanitizeString = (str: string) => {
  // eslint-disable-next-line no-useless-escape
  const sanitizedString = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return sanitizedString.trim();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleToastError = (error: any) => {
  const { response } = error;
  if (response.data) {
    if (Array.isArray(response.data.issues)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data.issues.forEach((issue: any) => {
        toast.error(issue.message);
      });
    }
    toast.error(response.data.message);
  } else {
    toast.error(error.message);
  }
};

interface DecodedToken {
  exp: number; // Token expiration time in seconds since the epoch
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime;
  } catch (error) {
    console.error(error);
    return false;
  }
};
