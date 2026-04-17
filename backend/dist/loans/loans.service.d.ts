import { Role } from '../auth/role.enum';
import { Loan, LoanStatus } from './loans.types';
type SanitizedLoan = Omit<Loan, 'applicant'> & {
    applicant: Omit<Loan['applicant'], 'totalLoan'>;
};
export declare class LoansService {
    private loans;
    constructor();
    getAllLoans(role: Role, status?: LoanStatus): {
        loans: (Loan | SanitizedLoan)[];
    };
    getLoansByUserEmail(userEmail: string, role: Role): {
        loans: (Loan | SanitizedLoan)[];
    };
    getExpiredLoans(role: Role): {
        loans: (Loan | SanitizedLoan)[];
    };
    deleteLoan(loanId: string): {
        message: string;
        deletedLoanId: string;
    };
    private sanitizeLoanByRole;
    private parseDate;
}
export {};
