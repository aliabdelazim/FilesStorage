import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilesEntity } from './files.entity';
import { FilesDTO } from './files.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private filesRepository: Repository<FilesEntity>,
  ) {}

  async showAll() {
    return await this.filesRepository.find();
  }

  async create(data: FilesDTO) {
    const file = this.filesRepository.create(data);
    await this.filesRepository.save(file);
    return file;
  }

  async read(id: number) {
    return await this.filesRepository
      .createQueryBuilder('file')
      .where('file.id = :id', { id: id })
      .getOne();
  }

  async readByName(name: string) {
    return await this.filesRepository
      .createQueryBuilder('file')
      .where('file.name = :name', { name: name })
      .getOne();
  }


  async update(id: number, data: Partial<FilesDTO>) {
    await this.filesRepository.update({ id }, data);
    return await this.filesRepository.findOne({ id });
  }

  async destroy(id: number) {
    await this.filesRepository.delete({ id });
    return { deleted: true };
  }
}
