## 주소
> [[Jump-to-Datapack](https://quam-12.github.io/Jump-to-Datapack/)]



## 데이터 팩 자동 생성기
> [[generator](util/datapack_gen.py)]

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



## 서버 자동 생성기
> [[server](util/server/main.py)]

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



## 데이터 자동 생성기
> [[data_generator](util/data_generator.py)]

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