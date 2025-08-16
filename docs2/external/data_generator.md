# 마인크래프트 내부 데이터 보기
마인크래프트는 명령어/블록/아이템 등의 많은 데이터로 이루어져 있습니다.
이런 다양한 정보가 담긴 데이터를 생성할 수 있는 도구가 있습니다.

[[마인크래프트 18w01a](https://www.minecraft.net/en-us/article/minecraft-snapshot-18w01a)] 버전 이후로
모장은 내부 데이터 및 데이터 생성기를 공개했습니다.

<br/>

# server.jar 다운로드
[[piston-meta.mojang.com](https://piston-meta.mojang.com/mc/game/version_manifest.json)] 이곳에서 맞는 버전을 검색한 후, 원하는 버전을 검색합니다.

예를 들어, 1.21.8은 다음과 같이 구성되어 있습니다.
```json
{
   "id": "1.21.8",
   "type": "release",
   "url": "https://piston-meta.mojang.com/v1/packages/b282396af887031d2f5cdcb7cbccd547f6d0067e/1.21.8.json",
   "time": "2025-08-12T06:46:43+00:00",
   "releaseTime": "2025-07-17T12:04:02+00:00"
}
```

`url` 키에 있는 링크를 타고 들어간 후, `server.jar`를 검색합니다.

예를 들어, `1.21.8` 버전은 다음과 같이 구성되어 있습니다.
```json
"server": {
   "sha1": "6bce4ef400e4efaa63a13d5e6f6b500be969ef81",
   "size": 57555044,
   "url": "https://piston-data.mojang.com/v1/objects/6bce4ef400e4efaa63a13d5e6f6b500be969ef81/server.jar"
}
```

`url` 키에 있는 링크를 창에 입력하면 `server.jar`가 다운로드 됩니다.

<br/>

# server.jar 실행하기
terminal/cmd 창에서 `server.jar`가 있는 폴더로 이동합니다.
그리고 나서, 다음 명령어를 실행합니다.

```javascript
java -DbundlerMainClass=net.minecraft.data.Main -jar <server.jar 파일 경로> --all
```

`--all` 인수는 다음 값이 될 수 있습니다.
```javascript
--all: 모든 데이터를 생성합니다.
--dev: 개발자 도구를 생성합니다.
--help: 각 인수의 도움말을 표시합니다.

--input <String>: 입력할 폴더의 이름
--output <String>: 출력할 폴더의 이름

--reports: 데이터 보고서를 생성합니다.
--server: 서버 생성기를 생성합니다.
--validate: 입력을 검증합니다.
```

예를 들어, `test_data` 폴더를 생성하고 보고서 데이터만 생성하고 싶다면,
다음 명령어를 실행합니다.
```javascript
java -DbundlerMainClass=net.minecraft.data.Main -jar <server.jar 파일 경로> --reports --output test_data
```

<br/>

# 데이터 살펴보기
`--all` 인수로 설정 시, 4개의 폴더가 생성됩니다.
- `generated`: 실 데이터가 존재하는 곳
- `libraries`: import된 외부 라이브러리
- `logs`: 생성 로그
- `versions`: minecraft/versions/<버전> 경로에 있는 파일과 같음

## generated
- `data`: 데이터 팩의 기능으로 존재하는 모든 하위 폴더
- `reports`: 다양한 정보가 들어 있는 폴더

### reports
- `blocks.json`: 마인크래프트의 모든 블록에 대한
기본값, 정의, id, 상태 등이 나열되어 있습니다.

- `items.json`: 마인크래프트의 모든 아이템에 대한
이름, 소리, 기본값 등이 나열되어 있습니다.

- `commands.json`: 마인크래프트의 모든 명령어에 대한
인수, 파서 등이 나열되어 있습니다.

- `datapack.json`: 데이터 팩에서 사용할 수 있는 항목이 나열되어 있습니다.

- `packets.json`: 마인크래프트의 모든 패킷 프로토콜 id가 나열되어 있습니다.

- `registries.json`: 마인크래프트에서 거의 모든 시스템을 처리하기 위해 사용하는 것으로
   - 엔티티의 동작(`수영`, `걷기`)
   - 명령어 인수 유형(`double`, `int`)
   - 게임 이벤트(스컬크 감지체가 반응하는 `행동`들
   - 모든 사운드(크리퍼가 `터지거나`, 플레이어가 `상처`를 입는 등)
   - 청크(`ticket type`) 등이 나열되어 있습니다.

<br/>

자세한 내용은 [[Tutorial: Running the data generator](https://minecraft.wiki/w/Tutorial:Running_the_data_generator)]를 참고하십시오.