# 최소와 최대값 탐색
주어진 여러 값에 대해 최소 혹은 최대 값을 출력합니다.
- 단, 값은 모두 `scoreboard`로 주어집니다.

```javascript
console.log(Math.min(-1, -5, -10))
>>> -10


console.log(Math.max(1, 5, 10))
>>> 10
```

이와 같은 기능을 구현하는 것을 목표로 합니다.

<br/>

# 정렬 기준과 엔티티
---
가장 간편하면서 널리 알려진 방법입니다.

- 비용: 엔티티(최대 n개) + 청크(최소 1개)

## 구현
원점을 사용하므로 `0.0, 0.0, 0.0` 좌표를 항상 로드합니다.
스코어 보드를 사용하므로 필요한 점수판을 생성합니다.
```mcfunction
execute in minecraft:overworld run forceload add 0 0

scoreboard objectives add min_max dummy
```

스코어 보드로 입력 값을 받습니다.
```mcfunction
```

입력 값의 개수마다 엔티티를 소환합니다.
```mcfunction
summon minecraft:marker 0 0 0 {Tags:[min_max]}
summon minecraft:marker 0 0 0 {Tags:[min_max]}
summon minecraft:marker 0 0 0 {Tags:[min_max]}
summon minecraft:marker 0 0 0 {Tags:[min_max]}
```

엔티티의 y 좌표를 입력 값으로 설정합니다.
단, 엔티티의 y 좌표는 `20,000,000`을 넘길 수 없기에 `0.0000000004656612873077392578125`를 곱해서 저장합니다.
```mcfunction
execute in minecraft:overworld positioned 0 0 0 summon marker run function <entity>

# entity
   tag @s add min_max
   execute store result entity @s Pos[1] double .0000000004656612873077392578125 run scoreboard players get #a min_max
```