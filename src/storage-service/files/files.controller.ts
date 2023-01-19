import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesDTO } from './files.dto';

@Controller('file')
export class FilesController {
  @Inject(FilesService)
  private readonly filesService: FilesService;

  @Get()
  async showAllFiles() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.filesService.showAll(),
    };
  }

  @Post()
  async createFiles(@Body() data: FilesDTO) {
    return {
      statusCode: HttpStatus.OK,
      message: 'File added successfully',
      data: await this.filesService.create(data),
    };
  }

  @Get(':id')
  async readFile(@Param('id') id: number) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.filesService.read(id),
    };
  }

  @Get('findByName/:name')
  async readFileByName(@Param('name') name: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.filesService.readByName(name),
    };
  }

  @Put(':id')
  async uppdateFile(
    @Param('id') id: number,
    @Body() data: Partial<FilesDTO>,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'File update successfully',
      data: await this.filesService.update(id, data),
    };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    await this.filesService.destroy(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'File deleted successfully',
    };
  }
}
