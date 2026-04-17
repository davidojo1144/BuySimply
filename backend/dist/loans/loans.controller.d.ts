import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { LoansService } from './loans.service';
import type { LoanStatus } from './loans.types';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    getLoans(request: AuthenticatedRequest, status?: LoanStatus): {
        loans: (import("./loans.types").Loan | (Omit<import("./loans.types").Loan, "applicant"> & {
            applicant: Omit<import("./loans.types").Loan["applicant"], "totalLoan">;
        }))[];
    };
    getLoansByUser(userEmail: string, request: AuthenticatedRequest): {
        loans: (import("./loans.types").Loan | (Omit<import("./loans.types").Loan, "applicant"> & {
            applicant: Omit<import("./loans.types").Loan["applicant"], "totalLoan">;
        }))[];
    };
    getExpiredLoans(request: AuthenticatedRequest): {
        loans: (import("./loans.types").Loan | (Omit<import("./loans.types").Loan, "applicant"> & {
            applicant: Omit<import("./loans.types").Loan["applicant"], "totalLoan">;
        }))[];
    };
    deleteLoan(loanId: string, request: AuthenticatedRequest): {
        message: string;
        deletedLoanId: string;
    };
}
