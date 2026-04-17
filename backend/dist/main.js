"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const morgan_1 = __importDefault(require("morgan"));
const app_module_1 = require("./app.module");
const global_error_filter_1 = require("./common/filters/global-error.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use((0, morgan_1.default)('dev'));
    app.useGlobalFilters(new global_error_filter_1.GlobalErrorFilter());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map