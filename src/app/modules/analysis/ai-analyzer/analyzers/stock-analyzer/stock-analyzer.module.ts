import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { AccountModule } from '@app/modules/repositories/account';
import {
    NewsPromptTransformer,
    TransformByInvestorHelper,
} from '@app/modules/analysis/ai-analyzer/common';
import { StockAnalyzerFlowType } from './stock-analyzer.types';
import { StockAnalyzerProcessor } from './stock-analyzer.processor';
import { StockAnalyzerAdapter } from './stock-analyzer.adapter';
import {
    RiggedStockIssuePromptTransformer,
    StockIssuePromptTransformer,
} from './transformers';

const flowTypes = [StockAnalyzerFlowType.Request];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentQuotationClientModule,
        StockModule,
        NewsRepositoryModule,
        AccountModule,
    ],
    providers: [
        TransformByInvestorHelper,
        NewsPromptTransformer,
        StockIssuePromptTransformer,
        RiggedStockIssuePromptTransformer,
        StockAnalyzerProcessor,
        StockAnalyzerAdapter,
        ...flowProviders,
    ],
    exports: [StockAnalyzerAdapter],
})
export class StockAnalyzerModule {}
