import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomesticIndex } from './domestic-index.entity';

@Injectable()
export class DomesticIndexService {
    constructor(
        @InjectRepository(DomesticIndex)
        private readonly repository: Repository<DomesticIndex>,
    ) {}

    public async getAll() {
        return this.repository.find();
    }
}
