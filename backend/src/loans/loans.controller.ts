import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LoansService } from './loans.service';
import type { LoanStatus } from './loans.types';

@Controller()
@UseGuards(RolesGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get('loans')
  getLoans(
    @Req() request: AuthenticatedRequest,
    @Query('status') status?: LoanStatus,
  ) {
    if (status && status !== 'pending' && status !== 'active') {
      throw new BadRequestException(
        "Status must be either 'pending' or 'active'",
      );
    }

    return this.loansService.getAllLoans(request.user.role, status);
  }

  @Get('loans/:userEmail/get')
  getLoansByUser(
    @Param('userEmail') userEmail: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.loansService.getLoansByUserEmail(userEmail, request.user.role);
  }

  @Get('loans/expired')
  getExpiredLoans(@Req() request: AuthenticatedRequest) {
    return this.loansService.getExpiredLoans(request.user.role);
  }

  @Delete('loan/:loanId/delete')
  @Roles(Role.SuperAdmin)
  deleteLoan(
    @Param('loanId') loanId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    if (request.user.role !== Role.SuperAdmin) {
      throw new ForbiddenException('Only superAdmin can delete loan records');
    }

    return this.loansService.deleteLoan(loanId);
  }
}
