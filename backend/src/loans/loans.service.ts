import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Role } from '../auth/role.enum';
import { Loan, LoanStatus } from './loans.types';

type SanitizedLoan = Omit<Loan, 'applicant'> & {
  applicant: Omit<Loan['applicant'], 'totalLoan'>;
};

@Injectable()
export class LoansService {
  private loans: Loan[];

  constructor() {
    const raw = readFileSync(join(process.cwd(), 'data', 'loans.json'), 'utf8');
    this.loans = JSON.parse(raw) as Loan[];
  }

  getAllLoans(role: Role, status?: LoanStatus) {
    const filtered = status
      ? this.loans.filter((loan) => loan.status === status)
      : this.loans;

    return {
      loans: filtered.map((loan) => this.sanitizeLoanByRole(loan, role)),
    };
  }

  getLoansByUserEmail(userEmail: string, role: Role) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    const matches = this.loans.filter(
      (loan) => loan.applicant.email.toLowerCase() === normalizedEmail,
    );

    return {
      loans: matches.map((loan) => this.sanitizeLoanByRole(loan, role)),
    };
  }

  getExpiredLoans(role: Role) {
    const now = new Date();
    const expired = this.loans.filter(
      (loan) => this.parseDate(loan.maturityDate).getTime() < now.getTime(),
    );

    return {
      loans: expired.map((loan) => this.sanitizeLoanByRole(loan, role)),
    };
  }

  deleteLoan(loanId: string) {
    const currentLength = this.loans.length;
    this.loans = this.loans.filter((loan) => loan.id !== loanId);

    if (this.loans.length === currentLength) {
      throw new NotFoundException('Loan not found');
    }

    return {
      message: 'Loan deleted successfully',
      deletedLoanId: loanId,
    };
  }

  private sanitizeLoanByRole(loan: Loan, role: Role): Loan | SanitizedLoan {
    if (role === Role.Admin || role === Role.SuperAdmin) {
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

  private parseDate(value: string): Date {
    return new Date(value.replace(' ', 'T'));
  }
}
