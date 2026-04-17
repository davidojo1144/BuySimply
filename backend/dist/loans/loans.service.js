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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const role_enum_1 = require("../auth/role.enum");
let LoansService = class LoansService {
    loans;
    constructor() {
        const raw = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'data', 'loans.json'), 'utf8');
        this.loans = JSON.parse(raw);
    }
    getAllLoans(role, status) {
        const filtered = status
            ? this.loans.filter((loan) => loan.status === status)
            : this.loans;
        return {
            loans: filtered.map((loan) => this.sanitizeLoanByRole(loan, role)),
        };
    }
    getLoansByUserEmail(userEmail, role) {
        const normalizedEmail = userEmail.trim().toLowerCase();
        const matches = this.loans.filter((loan) => loan.applicant.email.toLowerCase() === normalizedEmail);
        return {
            loans: matches.map((loan) => this.sanitizeLoanByRole(loan, role)),
        };
    }
    getExpiredLoans(role) {
        const now = new Date();
        const expired = this.loans.filter((loan) => this.parseDate(loan.maturityDate).getTime() < now.getTime());
        return {
            loans: expired.map((loan) => this.sanitizeLoanByRole(loan, role)),
        };
    }
    deleteLoan(loanId) {
        const currentLength = this.loans.length;
        this.loans = this.loans.filter((loan) => loan.id !== loanId);
        if (this.loans.length === currentLength) {
            throw new common_1.NotFoundException('Loan not found');
        }
        return {
            message: 'Loan deleted successfully',
            deletedLoanId: loanId,
        };
    }
    sanitizeLoanByRole(loan, role) {
        if (role === role_enum_1.Role.Admin || role === role_enum_1.Role.SuperAdmin) {
            return loan;
        }
        const safeApplicant = {
            name: loan.applicant.name,
            email: loan.applicant.email,
            telephone: loan.applicant.telephone,
        };
        return {
            ...loan,
            applicant: safeApplicant,
        };
    }
    parseDate(value) {
        return new Date(value.replace(' ', 'T'));
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoansService);
//# sourceMappingURL=loans.service.js.map