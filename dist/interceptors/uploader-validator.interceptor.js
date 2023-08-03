"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderValidatorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const uploader_constant_1 = require("../constants/uploader.constant");
const uploader_util_1 = require("../utils/uploader.util");
function UploaderValidatorInterceptor() {
    let Interceptor = class Interceptor {
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const acceptMimetype = req.headers[uploader_constant_1.UPLOADER_HEADERS.ACCEPT_MIME];
            const { file, files } = req;
            let arrFiles = [];
            if (file)
                arrFiles = [file];
            if (files) {
                arrFiles = Array.isArray(files) ? files : Object.values(files).flat();
            }
            await this.validateMime(arrFiles, [acceptMimetype].flat());
            return next.handle().pipe((0, rxjs_1.catchError)(async (err) => {
                await (0, uploader_util_1.removeFiles)(arrFiles);
                return (0, rxjs_1.throwError)(() => err);
            }));
        }
        async validateMime(files, acceptMimetype) {
            for (const file of files) {
                const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
                const { ext, mime } = await (0, file_type_1.fromBuffer)(buffer);
                if (!acceptMimetype.includes(mime)) {
                    await (0, uploader_util_1.removeFiles)(files);
                    throw new common_1.BadRequestException('Invalid original mime type');
                }
                const name = (0, path_1.basename)(file.filename, (0, path_1.extname)(file.filename));
                const filename = `${name}.${ext}`;
                const path = `${file.destination}/${filename}`;
                await (0, promises_1.rename)(file.path, path);
                file.mimetype = mime;
                file.filename = filename;
                file.path = path;
            }
        }
    };
    Interceptor = __decorate([
        (0, common_1.Injectable)()
    ], Interceptor);
    return (0, common_1.mixin)(Interceptor);
}
exports.UploaderValidatorInterceptor = UploaderValidatorInterceptor;
