# 점프 투 데이터 팩(Jump-to-Datapack)

<div align="center"><img src="assets/icon.png" height="128"/></div>

점프 투 데이터 팩(`Jump to Datapack`)은 코딩 입문서  
[[점프 투 자바](https://wikidocs.net/book/31)], [[점프 투 파이썬](https://wikidocs.net/book/1)]에서 영감을 받아,

데이터 팩을 쉽게 배우고 활용할 수 있도록 제작한 프로젝트입니다.  
외에도 데이터 팩/마인크래프트와 관련한 유용한 도구도 포함되어 있습니다.

## 주소
> [[Jump-to-Datapack](https://quam-12.github.io/Jump-to-Datapack/)]

<br/>

## 데이터 팩 자동 생성기
> [[generator.py](util/datapack_gen.py)]

### 사용법
1. `Releases`에서 `datapack_generator.zip` 파일 다운로드
2. 폴더로 이동 후, `datapack_gen.py`을 실행합니다.
3. 실행 후, 마인크래프트 버전 입력 창이 표시되면 릴리스 버전 중 하나를 입력합니다.
4. 잠시 기다리면 데이터 팩이 생성됩니다.

### 환경
- 필요한 pip
  ```bash
  pip install packaging
  ```

<br/>

## 서버 자동 생성기
> [[server.py](util/server/main.py)]

### 사용법
1. `Releases`에서 `server_generator.zip` 파일 다운로드
2. `./server` 폴더로 이동 후, `main.py`를 실행합니다.
3. 실행 후, 마인크래프트 버전 입력 창이 표시되면 마인크래프트 버전 중 하나를 입력합니다.
4. 잠시 후, 서버가 생성됩니다.

### 환경
- 필요한 pip
  ```bash
  pip install gzip
  pip install json
  pip install os
  pip install platform
  pip install requests
  pip install shutil
  pip install sniffcraft_gen
  pip install sys
  pip install time
  pip install zipfile
  pip install nbtlib
  ```

<br/>

## 데이터 자동 생성기
> [[data_generator.py](util/data_generator.py)]

### 사용법
1. `Releases`에서 `data_generator.zip` 파일 다운로드
2. 폴더로 이동 후, `data_generator.py`을 실행합니다.
3. 실행 후, 마인크래프트 버전 입력 창이 표시되면 마인크래프트 버전 중 하나를 입력합니다.
4. 잠시 기다리면 데이터가 생성됩니다.

### 환경
- 필요한 pip
  ```bash
  pip install os
  pip install subprocess
  pip install sys
  pip install requests
  ```