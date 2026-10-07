import { Request } from 'express';

export const ReuqestUtils = {
    getSignedCookie: (request: Request, key: string): string | null => {
        const value = request.signedCookies[key];
        return typeof value === 'string' ? value : null;
    },
    getSingleParam: (request: Request, key: string): string | null => {
        let param = request.params[key];
        if (Array.isArray(param)) {
            param = param[0];
        }

        return param;
    },
};
