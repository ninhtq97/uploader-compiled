"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFiles = exports.makeDes = exports.editFileName = exports.fileFilter = exports.convertPath = exports.readChunk = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const nanoid_1 = require("nanoid");
const path_1 = require("path");
async function readChunk(filePath, options) {
    const fileDescriptor = await (0, promises_1.open)(filePath, 'r');
    try {
        const result = await fileDescriptor.read(Object.assign({ buffer: Buffer.alloc(options.length) }, options));
        const bytesRead = result.bytesRead;
        let buffer = result.buffer;
        if (bytesRead < options.length) {
            buffer = buffer.subarray(0, bytesRead);
        }
        return buffer;
    }
    finally {
        await fileDescriptor.close();
    }
}
exports.readChunk = readChunk;
const convertPath = (path) => {
    const dirPath = (0, path_1.dirname)(path)
        .replace(/\W/g, '/')
        .split('/')
        .filter(Boolean)
        .join('/');
    const filename = (0, path_1.basename)(path);
    return `${dirPath}/${filename}`;
};
exports.convertPath = convertPath;
const fileFilter = (acceptMimetype) => (req, file, callback) => {
    if (!acceptMimetype || !acceptMimetype.includes(file.mimetype)) {
        return callback(new common_1.BadRequestException('Invalid mime type'), false);
    }
    callback(null, true);
};
exports.fileFilter = fileFilter;
const editFileName = (req, file, callback) => {
    const name = (0, nanoid_1.customAlphabet)(nanoid_1.urlAlphabet)();
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName = Array(6)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
exports.editFileName = editFileName;
const makeDes = (path) => {
    return async (req, file, cb) => {
        await (0, promises_1.mkdir)((0, path_1.resolve)((0, path_1.join)('.', path)), { recursive: true });
        cb(null, path);
    };
};
exports.makeDes = makeDes;
const removeFiles = async (files) => {
    for (const file of files)
        await (0, promises_1.unlink)(file.path);
    return true;
};
exports.removeFiles = removeFiles;
