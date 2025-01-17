import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { SubmissionService } from "./submission.service";
import { SubmissionEntity } from "./entity/submission.entity";
import { SubmissionCreateDTO } from "./dto/submission.dto.request";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContributionService } from "../contribution/contribution.service";
import { OpenAIUpdateSubmissionDTO } from "./dto/openai.update.submission.dto";
import { AuthGuard } from "../guard/auth.guard";



@ApiTags('submission')
@Controller('submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)  
export class SubmissionController {
  constructor(private submissionService: SubmissionService,private contributionService: ContributionService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get my submissions' })
  async getMySubmission(@Req() req: RequestWithUser): Promise<SubmissionEntity[]> {
    return this.submissionService.getSubmissionByUserId(req.user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Get all submissions' })
  async getAllSubmissions(): Promise<SubmissionEntity[]> {
    return this.submissionService.getAllSubmissions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by id' })
  async getSubmissionById(@Param('id') id: number): Promise<SubmissionEntity> {
    return this.submissionService.getSubmissionById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new submission' })
  async createSubmission(@Body() submission: SubmissionCreateDTO): Promise<SubmissionEntity> {
    this.contributionService.incrementContribution(submission.user);
    return this.submissionService.createSubmission(submission);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update submission' })
  async updateSubmission(
    @Body() submission: OpenAIUpdateSubmissionDTO
  ): Promise<SubmissionEntity> {
    return this.submissionService.updateSubmission(submission);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete submission' })
  async deleteSubmission(@Param('id') id: number): Promise<void> {
    return this.submissionService.deleteSubmission(id);
  }


}