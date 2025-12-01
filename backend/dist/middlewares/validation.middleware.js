"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const error_util_1 = require("../utils/error.util");
const validateRequest = (schema) => {
    return (req, _res, next) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const messages = error.details
                    .map((detail) => detail.message)
                    .join(", ");
                throw new error_util_1.AppError(messages, 400);
            }
            req.body = value;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.middleware.js.map