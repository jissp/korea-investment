import { In, IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@common/types';
import { KeywordDto, KeywordType } from './keyword.types';
import { Keyword, KeywordGroup } from './entities';

@Injectable()
export class KeywordService {
    constructor(
        @InjectRepository(Keyword)
        private readonly keywordRepository: Repository<Keyword>,
        @InjectRepository(KeywordGroup)
        private readonly keywordGroupRepository: Repository<KeywordGroup>,
    ) {}

    /**
     * 키워드명으로 키워드 목록을 조회합니다.
     */
    public async getKeywordsByName(name: string) {
        return this.keywordRepository.findBy({
            name,
        });
    }

    /**
     * 모든 키워드를 조회합니다.
     */
    public async getKeywords(type?: KeywordType | KeywordType[]) {
        return this.keywordRepository.findBy({
            type:
                type !== undefined
                    ? In(Array.isArray(type) ? type : [type])
                    : undefined,
        });
    }

    /**
     * 키워드가 존재하는지 확인합니다.
     */
    public async existsKeyword({
        type,
        name,
        keywordGroupId,
    }: {
        type: KeywordType;
        name: string;
        keywordGroupId?: Nullable<number>;
    }) {
        return this.keywordRepository.existsBy({
            type,
            name,
            keywordGroupId: isNil(keywordGroupId) ? IsNull() : keywordGroupId,
        });
    }

    /**
     * 키워드를 추가합니다.
     */
    public async createKeyword(keyword: KeywordDto) {
        try {
            const entity = this.keywordRepository.create(keyword);

            return await this.keywordRepository.insert(entity);
        } catch (error) {
            // 중복일 경우 무시
            if (error.code === 'ER_DUP_ENTRY') {
                return;
            }
            throw error;
        }
    }

    /**
     * 키워드를 삭제합니다.
     */
    public async deleteKeywordByName({
        type,
        name,
        keywordGroupId,
    }: {
        type: KeywordType;
        name: string;
        keywordGroupId: Nullable<number>;
    }) {
        return this.keywordRepository.delete({
            type,
            name,
            keywordGroupId: isNil(keywordGroupId) ? IsNull() : keywordGroupId,
        });
    }

    /**
     * 키워드 그룹에 속한 키워드들을 조회합니다.
     */
    public async getKeywordsByGroupName(groupName: string) {
        const keywordGroup = await this.keywordGroupRepository.findOneBy({
            name: groupName,
        });
        if (!keywordGroup) {
            throw new Error('Keyword group not found');
        }

        return this.keywordRepository.findBy({
            keywordGroupId: keywordGroup.id,
        });
    }

    /**
     * 키워드 그룹에 속한 키워드들을 조회합니다.
     */
    public async getKeywordsByGroupId(groupId: number) {
        return this.keywordRepository.findBy({
            keywordGroupId: groupId,
        });
    }
}
