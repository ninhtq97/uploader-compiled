"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderRequiredInterceptor = void 0;
const common_1 = require("@nestjs/common");
function UploaderRequiredInterceptor() {
    let Interceptor = class Interceptor {
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            if (!req.file && !req.files) {
                throw new common_1.BadRequestException('File not found');
            }
            return next.handle();
        }
    };
    Interceptor = __decorate([
        (0, common_1.Injectable)()
    ], Interceptor);
    return (0, common_1.mixin)(Interceptor);
}
exports.UploaderRequiredInterceptor = UploaderRequiredInterceptor;
