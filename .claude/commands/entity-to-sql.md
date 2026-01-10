---
name: entity-to-sql
description: Entity를 SQL문으로 변환할 때 사용합니다.
model: haiku
color: cyan
---

# 기본 구조

1. Entity 파일은 "src/app/modules/repositories" 디렉토리 내에 존재합니다.
    - "{entity}.entity.ts" 패턴을 가진 파일들이 이에 해당합니다.
2. 변환된 SQL문은 sql 디렉토리 내 "{entity}.sql" 파일에 저장합니다.

# 동작 방식

1. "$ARGUMENTS" 파일을 확인합니다.
2. Entity 파일의 구조를 확인하여 MySQL의 Create SQL 문으로 변환하고 저장합니다.
