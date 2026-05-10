"""Creates sample SKILL.md files for local development."""
import os
from pathlib import Path

SKILLS_DIR = Path("~/skillhub/skills").expanduser()

SKILLS = {
    "pdf-extraction": """\
---
name: pdf-extraction
description: PDF 파일에서 텍스트와 표를 추출합니다. 다단 레이아웃, 스캔 PDF 모두 처리 가능합니다.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

PDF 파일에서 텍스트와 구조화된 데이터를 추출하는 스킬입니다.

## 트리거 조건

다음과 같은 사용자 요청에 활성화됩니다:
- PDF 파일에서 텍스트 추출
- PDF 표 데이터 파싱
- 스캔된 문서 OCR 처리
- PDF 내용 요약

## 기능

- 일반 PDF 텍스트 추출
- 표 구조 인식 및 CSV 변환
- 다단 레이아웃 처리
- 스캔 PDF (이미지 기반) OCR

## 사용 예시

```
"이 PDF에서 표를 뽑아서 엑셀로 만들어줘"
"계약서 PDF의 주요 조항을 요약해줘"
"스캔된 영수증에서 금액을 읽어줘"
```
""",
    "code-review": """\
---
name: code-review
description: 코드를 리뷰하고 버그, 보안 취약점, 개선 사항을 제안합니다. Python, TypeScript, Go 등 주요 언어 지원.
tags: [code, review, security, quality]
version: 1.2.0
icon: "🔍"
---

# Code Review Skill

코드 품질 향상을 위한 자동 리뷰 스킬입니다.

## 트리거 조건

- 코드 리뷰 요청
- 버그 발견 및 수정
- 보안 취약점 검사
- 성능 최적화 제안
- 코딩 컨벤션 체크

## 지원 언어

Python, TypeScript, JavaScript, Go, Rust, Java, C++
""",
    "data-analysis": """\
---
name: data-analysis
description: CSV, JSON, Excel 데이터를 분석하고 시각화 인사이트를 제공합니다. 통계 요약, 이상값 탐지 포함.
tags: [data, analysis, statistics, csv]
version: 0.9.0
icon: "📊"
---

# Data Analysis Skill

구조화된 데이터를 분석하고 인사이트를 제공하는 스킬입니다.

## 트리거 조건

- 데이터 분석 요청
- CSV/Excel 파일 처리
- 통계 요약 필요
- 이상값(outlier) 탐지
- 데이터 시각화 요청

## 기능

- 기술 통계량 (평균, 중앙값, 표준편차 등)
- 결측값 처리
- 상관관계 분석
- 이상값 탐지
""",
}


def main():
    for folder_name, content in SKILLS.items():
        skill_dir = SKILLS_DIR / folder_name
        skill_dir.mkdir(parents=True, exist_ok=True)
        skill_file = skill_dir / "SKILL.md"
        skill_file.write_text(content, encoding="utf-8")
        print(f"Created: {skill_file}")

    print(f"\nDone! {len(SKILLS)} skills seeded to {SKILLS_DIR}")


if __name__ == "__main__":
    main()
