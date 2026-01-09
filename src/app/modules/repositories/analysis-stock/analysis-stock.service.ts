import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalysisStockEntity } from './analysis-stock.entity';

@Injectable()
export class AnalysisStockService {
    constructor(
        @InjectRepository(AnalysisStockEntity)
        private readonly analysisStockRepository: Repository<AnalysisStockEntity>,
    ) {}
}
