export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        fullName: string;
    }): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../users/user.model").IUser, {}, {}> & import("../users/user.model").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        tokens: {
            accessToken: any;
            refreshToken: any;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: any;
        refreshToken: any;
        user: import("../users/user.model").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    getUserById(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../users/user.model").IUser, {}, {}> & import("../users/user.model").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private generateTokens;
}
//# sourceMappingURL=auth.service.d.ts.map