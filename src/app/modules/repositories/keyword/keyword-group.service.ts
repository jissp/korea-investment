import { In, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@common/types';
import { KeywordGroupDto } from './keyword.types';
import { Keyword, KeywordGroup } from './entities';

@Injectable()
export class KeywordGroupService {
    private readonly logger = new Logger(KeywordGroupService.name);

    constructor(
        @InjectRepository(KeywordGroup)
        private readonly keywordGroupRepository: Repository<KeywordGroup>,
    ) {}

    /**
     * 키워드 그룹이 존재하는지 확인합니다.
     */
    public async existsKeywordGroup(id: number) {
        return this.keywordGroupRepository.existsBy({
            id,
        });
    }

    /**
     * 키워드 그룹명이 존재하는지 확인합니다.
     */
    public async existsKeywordGroupByName(name: string) {
        return this.keywordGroupRepository.existsBy({
            name,
        });
    }

    /**
     * 키워드 그룹을 추가합니다.
     */
    public async createKeywordGroup(keywordGroup: KeywordGroupDto) {
        if (await this.existsKeywordGroupByName(keywordGroup.name)) {
            throw new Error('이미 존재하는 키워드 그룹입니다.');
        }

        const entity = this.keywordGroupRepository.create(keywordGroup);

        return this.keywordGroupRepository.insert(entity);
    }

    /**
     * 키워드 그룹을 삭제합니다.
     */
    public async deleteKeywordGroup(id: number) {
        const keywordGroup = await this.getKeywordGroup(id);
        if (!keywordGroup) {
            throw new Error('존재하지 않는 키워드 그룹입니다.');
        }

        return this.deleteGroupWithKeywords(keywordGroup);
    }

    /**
     * 키워드 그룹명으로 키워드 그룹을 삭제합니다.
     */
    public async deleteKeywordGroupByName(name: string) {
        const keywordGroup = await this.getKeywordGroupByName(name);
        if (!keywordGroup) {
            throw new Error('존재하지 않는 키워드 그룹입니다.');
        }

        return this.deleteGroupWithKeywords(keywordGroup);
    }

    /**
     * 키워드 그룹과 키워드 그룹에 속한 모든 키워드를 삭제합니다.
     * @param keywordGroup
     * @private
     */
    private deleteGroupWithKeywords(keywordGroup: KeywordGroup) {
        try {
            return this.keywordGroupRepository.manager.transaction(
                async (entityManager) => {
                    // 키워드 제거
                    await entityManager.delete(Keyword, {
                        keywordGroupId: keywordGroup.id,
                    });

                    // 키워드 그룹 제거
                    await entityManager.delete(KeywordGroup, {
                        id: keywordGroup.id,
                    });
                },
            );
        } catch (error) {
            this.logger.error(error);

            throw new Error('키워드 그룹 삭제 중 오류가 발생했습니다.');
        }
    }

    /**
     * 모든 키워드 그룹을 조회합니다.
     */
    public async getKeywordGroups() {
        return this.keywordGroupRepository.find();
    }

    /**
     * 키워드 그룹명으로 키워드 그룹을 조회합니다.
     */
    public async getKeywordGroup(id: number): Promise<Nullable<KeywordGroup>> {
        return this.keywordGroupRepository.findOneBy({
            id,
        });
    }

    /**
     * 키워드 그룹명으로 키워드 그룹을 조회합니다.
     */
    public async getKeywordGroupByIds(ids: number[]): Promise<KeywordGroup[]> {
        if (ids.length === 0) {
            return [];
        }

        return this.keywordGroupRepository.findBy({
            id: In(ids),
        });
    }

    /**
     * 키워드 그룹명으로 키워드 그룹을 조회합니다.
     */
    public async getKeywordGroupByName(
        name: string,
    ): Promise<Nullable<KeywordGroup>> {
        return this.keywordGroupRepository.findOneBy({
            name,
        });
    }
}
