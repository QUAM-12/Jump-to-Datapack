# 기하학
마인크래프트의 위치, 방향에 대한 내용은 [[00-2 위치와 방향](00-2)]을 참고하십시오.

현실 혹은 여타 프로그래밍 환경과는 다르게
게임 내라는 특별한 환경이 주어지기 때문에 훨씬 복잡하게 동작합니다.

단순히 블록을 두는 것을 넘어, 좌표를 이동시키고
방향을 회전시키는 등 여러 기하학적인 표현이 가능합니다.

---

<br/>

# 반전
반전은 축을 뒤집는 기술입니다.

## 시선 전체 반전
```mcfunction
execute facing ^ ^ ^-1 run ...
```

<br/>

## y 축 기준 반전
```mcfunction
execute rotated ~180 ~ run ...
```

<br/>

## x 축 기준 반전
```mcfunction
execute rotated ~180 ~ facing ^ ^ ^-1 run ...
```

<br/>

## y_rotation x 축 기준 대칭 반전
```mcfunction
execute positioned 0. 0 0. positioned ^ ^ ^-1 positioned ~ ~ 0. positioned ^ ^ ^.5 facing 0. 0 0. run ...
```

- [[desmos](https://www.desmos.com/geometry/4i06eiflpo)] 시각적인 이해

<br/>

## y_rotation z 축 기준 대칭 반전
```mcfunction
execute positioned 0. 0 0. positioned ^ ^ ^-1 positioned 0. ~ ~ positioned ^ ^ ^.5 facing 0. 0 0. run ...
```

- [[desmos](https://www.desmos.com/geometry/atuoqgdp42)] 시각적인 이해

---

<br/>

# 변환
변환은 어떤 값을 다른 값으로 바꾸는 기술입니다.

## x_rotation -> y_rotation
`pitch`를 `yaw`로 변환합니다.
```mcfunction
execute rotated 0 ~ positioned 0.0 0.0 0.0 positioned ^ ^ ^-1 rotated ~180 ~ positioned ^ ^ ^1 rotated ~-90 ~ positioned ^ ^-1 ^ rotated ~180 ~ positioned ^ ^1 ^ facing 0.0 0.0 0.0 run ...
```

<br/>

## x_rotation / 2
`pitch`를 `2`로 나눕니다.
```mcfunction
execute positioned 0. 0 0. positioned ^ ^ ^-1 rotated ~ 0 positioned ^ ^ ^-1 facing 0. 0 0. run ...
```

- [[desmos](https://www.desmos.com/geometry/xnazgn2ivn)] 시각적인 이해

<br/>

## y_rotation / 2
`yaw`를 `2`로 나눕니다.
```mcfunction
execute positioned 0. 0 0. rotated ~ 0 positioned ^ ^ ^-1 positioned ~ ~ ~-1 facing 0. 0 0. run ...
```

- [[desmos](https://www.desmos.com/geometry/jzdvwpoesb)] 시각적인 이해

---

<br/>

# 응용

## 화면에 들어온 엔티티를 감지하기
현재 명령어를 실행시킨 엔티티를 기준으로
`target`의 화면 `60˚` 내에 들어오면 성공합니다.
```mcfunction
execute positioned as @s facing entity @e[tag=target] eyes positioned ^ ^ ^-1 rotated as @e[tag=target] positioned ^ ^ ^-1 if entity @s[distance=..1] run say a
```

- [[desmos](https://www.desmos.com/geometry/rwkkdsgmve)] 시각적인 이해

### rotation ≤ 60˚
첫 번째 각도와 두 번째 각도가 60도 이하인지 확인합니다.
```mcfunction
execute positioned ^ ^ ^-1 rotated as @n[tag=target] positioned ^ ^ ^1 if entity @s[distance=..1] run ...
```

- [[desmos](https://www.desmos.com/geometry/ndltr30hke)] 시각적인 이해

<br/>

## 목표에 서서히 수렴하는 시선각
```mcfunction
execute positioned ^ ^ ^-n facing entity @e[tag=target] run ...
```

- [[desmos](https://www.desmos.com/geometry/tlr834t8mg)] 시각적인 이해

<br/>

## 플레이어의 자세 감지
### 웅크리는 중
```mcfunction
execute anchored eyes as @a at @s positioned ^ ^ ^ positioned ~ ~-1.27 ~ if entity @s[distance=...0001] run ...
```

### 엎드리거나, 수영 중
```mcfunction
execute anchored eyes as @a at @s positioned ^ ^ ^ positioned ~ ~-.4 ~ if entity @s[distance=...0001] run ...
```

### 아무 행동도 하지 않음
```mcfunction
execute anchored eyes as @a at @s positioned ^ ^ ^ positioned ~ ~-1.62 ~ if entity @s[distance=...0001] run ...
```

<br/>

## 90˚ 방향으로 나누기
```mcfunction
execute positioned 0. 0 0. rotated ~45 0 positioned ^ ^ ^-.5 align xz facing -.5 0 -.5 rotated ~-45 ~ run ...
```

- [[desmos](https://www.desmos.com/geometry/egxc8ic8n5)]

<br/>

## 시야각 90도 내 존재 확인
```mcfunction
execute facing entity @e[tag=target] feet positioned ^ ^ ^3 rotated as @s positioned ^ ^ ^-4 if entity @s[distance=..5] run ...
```

- [[desmos](https://www.desmos.com/geometry/6ktadx8whb)]

<br/>

## 시야각 이등분
<img src="https://latex.codecogs.com/svg.image?\large \frac{\text{first} + \text{second}}{2}"
style="vertical-align:middle; filter: invert(1)"/>
```mcfunction
execute rotated as @e[tag=first] positioned ^ ^ ^-1 rotated as @e[tag=second] positioned ^ ^ ^-1 facing entity @s feet run ...
```

- [[desmos](https://www.desmos.com/geometry/imq0ga2tcz)]

<br/>

## 내분
내분은 선분 `AB`를 안쪽에서 어떤 비율 `m : n`으로 나눈 위치입니다.
- `A(0,0), B(4,0)`를 `1:1`로 내분 -> `P = (2,0)` (중점)
- `A(0,0), B(6,0)`를 `2:1`로 내분 -> `P = (4,0)`

```mcfunction
rotate @s facing entity @e[limit=1, tag=target]


# m = n -> 1 : 1
execute positioned ^(m + n)1000 ^ ^ facing entity @e[tag=target] feet positioned ^ ^ ^(1000 * m) rotated as @s positioned ^-(1000 * n) ^ ^ run ...


# m ≠ n -> 2 : 1
execute positioned ^3000 ^ ^ facing entity @e[tag=target] feet positioned ^ ^ ^2000 rotated as @s positioned ^-1000 ^ ^ run ...
```

<br/>

## 변화하는 축의 대칭
```mcfunction
# y 좌표 유지
execute rotated as @e[tag=target] positioned ^ ^ ^128 facing entity @e[tag=target] feet rotated ~ 0 positioned ^ ^ ^256 rotated as @e[tag=target] positioned ^ ^ ^128 run ...


# y 좌표 반전
execute rotated as @e[tag=target] positioned ^ ^ ^128 facing entity @e[tag=target] feet positioned ^ ^ ^256 rotated as @e[tag=target] positioned ^ ^ ^128 run ...
```