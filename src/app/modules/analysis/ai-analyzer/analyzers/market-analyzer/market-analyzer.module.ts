import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { MarketIndexModule } from '@app/modules/repositories/market-index';
import { StockModule } from '@app/modules/repositories/stock';
import { NewsModule } from '@app/modules/repositories/news';
import { NewsPromptTransformer } from '@app/modules/analysis/ai-analyzer/common';
import {
    GlobalIndexTransformer,
    GlobalMacroTransformer,
    IndexPromptTransformer,
} from './transformers';
import { MarketAnalyzerFlowType } from './market-analyzer.types';
import { MarketAnalyzerAdapter } from './market-analyzer.adapter';
import { MarketAnalyzerProcessor } from './market-analyzer.processor';

const flowTypes = [MarketAnalyzerFlowType.Request];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        GeminiCliModule,
        MarketIndexModule,
        StockModule,
        NewsModule,
    ],
    providers: [
        GlobalMacroTransformer,
        GlobalIndexTransformer,
        NewsPromptTransformer,
        IndexPromptTransformer,
        MarketAnalyzerProcessor,
        MarketAnalyzerAdapter,
        ...flowProviders,
    ],
    exports: [MarketAnalyzerAdapter],
})
export class MarketAnalyzerModule {}
