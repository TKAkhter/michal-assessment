import { JwtPayload } from "jwt-decode";
export interface JwtUserPayload extends JwtPayload {
  username: string;
  id: string;
  email: string;
  name: string;
}
