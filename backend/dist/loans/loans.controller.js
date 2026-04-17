"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const loans_service_1 = require("./loans.service");
let LoansController = class LoansController {
    loansService;
    constructor(loansService) {
        this.loansService = loansService;
    }
    getLoans(request, status) {
        if (status && status !== 'pending' && status !== 'active') {
            throw new common_1.BadRequestException("Status must be either 'pending' or 'active'");
        }
        return this.loansService.getAllLoans(request.user.role, status);
    }
    getLoansByUser(userEmail, request) {
        return this.loansService.getLoansByUserEmail(userEmail, request.user.role);
    }
    getExpiredLoans(request) {
        return this.loansService.getExpiredLoans(request.user.role);
    }
    deleteLoan(loanId, request) {
        if (request.user.role !== role_enum_1.Role.SuperAdmin) {
            throw new common_1.ForbiddenException('Only superAdmin can delete loan records');
        }
        return this.loansService.deleteLoan(loanId);
    }
};
exports.LoansController = LoansController;
__decorate([
    (0, common_1.Get)('loans'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "getLoans", null);
__decorate([
    (0, common_1.Get)('loans/:userEmail/get'),
    __param(0, (0, common_1.Param)('userEmail')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "getLoansByUser", null);
__decorate([
    (0, common_1.Get)('loans/expired'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "getExpiredLoans", null);
__decorate([
    (0, common_1.Delete)('loan/:loanId/delete'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Param)('loanId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "deleteLoan", null);
exports.LoansController = LoansController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [loans_service_1.LoansService])
], LoansController);
//# sourceMappingURL=loans.controller.js.map