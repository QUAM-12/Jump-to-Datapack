# tick(틱)

마인크래프트는 `0.05`초마다 한 번 로직을 수행합니다.
틱이 종료되면, 곧바로 다음 틱으로 넘어갑니다.

매 틱마다 마인크래프트는 여러 작업을 수행합니다.
- 플레이어나 엔티티의 공격을 처리합니다.
- 몹을 생성하고 몹의 AI를 처리합니다.
- 엔티티의 위치와 움직임을 업데이트합니다.
- 작물을 자라게 합니다.
- 불이 번지게 합니다.

`/tick` 명령어를 이용해 현재 틱을 직접적으로 건드리지 않았다면, 항상 `20.0`으로 고정합니다.

틱은 크게 다음 순서로 작업을 처리합니다.

```mermaid
sequenceDiagram
   participant runServer
   participant MinecraftServer
   participant tickChildren
   participant ServerLevel
   participant Levels

   runServer->>runServer: 초기화
   runServer->>MinecraftServer: 틱 시작

   MinecraftServer->>MinecraftServer: 틱 수 증가

   MinecraftServer->>tickChildren: 모든 차원 순회
      tickChildren->>tickChildren: load.json 함수 실행
      tickChildren->>tickChildren: tick.json 함수 실행
      tickChildren->>tickChildren: 게임 내 시간 동기화(일출, 일몰)

      tickChildren->>ServerLevel: 각 차원마다

      tickChildren->>tickChildren: 네트워크, GUI 업데이트
      tickChildren->>tickChildren: 패킷 처리
      tickChildren->>tickChildren: 플레이어 정보 업데이트
      tickChildren->>tickChildren: 청크 관련 패킷 전송
   
         ServerLevel->>Levels: 월드 보더 업데이트
         ServerLevel->>Levels: 날씨 업데이트 (비, 비와 천둥, 플레이어 수면 비율)
         ServerLevel->>Levels: 하늘 밝기 업데이트
         ServerLevel->>Levels: schedule 함수 예약
         ServerLevel->>Levels: 블록 틱 예약
         ServerLevel->>Levels: 유체 틱 예약
         ServerLevel->>Levels: 습격 틱 예약
         ServerLevel->>Levels: 청크 틱 예약 (청크 언로드 등)
         ServerLevel->>Levels: 블록 이벤트 예약
         ServerLevel->>Entities: 엔티티 틱 예약 (엔더 드래곤, 디스폰 등)
            Entities->>ServerPlayer: tick 조건의 발전과제
            ServerLevel->>Entities: tick 조건의 인챈트
         ServerLevel->>Levels: 블록 엔티티 예약
   MinecraftServer->>runServer: 다음 틱을 예약
   runServer-->>runServer: 틱 완전 종료
```

---

<br/>

# 데이터 팩
데이터 팩은 크게 다음 순서로 작업을 처리합니다.

```mermaid
flowchart TD
1[플레이어가 직접 실행하는 명령어]
-->
2[#load에 등록한 함수]
-->
3[#tick에 등록한 함수]
-->
4[schedule 명령어로 실행한 함수]

4 --> command_block

subgraph command_block[명령 블록]
   5[레드스톤 필요 - 반복형 X] --> 6[항상 활성화 - 반복형 O]
end

subgraph tick_advancement[tick 발전과제]
   9[틱이 멈춰도 작동]
end

subgraph tick_enchantment[tick 인챈트]
   10[무언가에 탑승 중이면] --> 9
end

command_block
-->
tick_advancement
-->
tick_enchantment
```

## 참고
### 명령 블록
- `레드스톤 필요`, `항상 활성화` 조건은 순서에 아무런 영향을 끼치지 않습니다.
- 먼저 실행한 명령 블록을 기준으로 실행됩니다.
   - 단, 동시 실행 시, `반복형 항상 활성화`는
   `일반 레드스톤 필요 명령 블록`보다 나중에 실행됩니다.

### tick 발전과제
- 틱을 멈춰도 작동합니다.

### tick 인챈트
- 틱을 멈추면 작동하지 않습니다.
- 무언가에 탑승하고 있다면, 발전과제보다 먼저 실행됩니다.

---

<br/>

자세한 내용은 [[tick_order](https://gist.github.com/misode/77ee37217a69a3c74032679d8084d6c6)]를 참고하십시오.