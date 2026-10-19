import { ResponseUserDto } from "../../dto/response-user.dto.js";
import { AuthTokens } from "./auth-tokens.type.js";

export type AuthData = {
    tokens: AuthTokens,
    userData: ResponseUserDto
}