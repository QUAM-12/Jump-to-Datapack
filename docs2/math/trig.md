# 삼각함수
주어진 값에 대해 `sin`, `cos`, `tan`로 변환된 값을 출력합니다.
- 단, 값은 모두 `scoreboard`로 주어집니다.

<br/>

# 원점과 엔티티
---
가장 간편하면서 널리 알려진 방법입니다.

- 비용: 엔티티 + 청크(최소 1개, 최대 4개)

## 구현
원점을 사용하므로 `0.0, 0.0, 0.0` 좌표를 항상 로드합니다.
스코어 보드를 사용하므로 필요한 점수판을 생성합니다.
```mcfunction
execute in minecraft:overworld run forceload add 0 0
execute in minecraft:overworld run forceload add 1 1
execute in minecraft:overworld run forceload add 1 -1
execute in minecraft:overworld run forceload add -1 1

scoreboard objectives add trig dummy
```

스코어 보드로 입력 값을 받습니다. (예: 30도)
```mcfunction
execute store result storage trig: input int 1 run scoreboard players set #input trig 30
```

매크로를 이용해 `rotated x 0`에 대입합니다.
```mcfunction
function trig:sin with storage trig:

trig:sin
   execute positioned 0. 0 0. rotated $(input) 0 positioned ^ ^ ^1 summon marker run ...
```

현재 위치에 엔티티를 소환합니다.
```mcfunction
trig:sin
   execute positioned 0. 0 0. rotated $(input) 0 positioned ^ ^ ^1 summon marker run function trig:entity

   tellraw @a {nbt:"output", storage:"trig:"}

> 이전 명령어


trig:entity
   data modify storage trig: output set from entity @s Pos[0]
   kill
```

다음 메시지가 출력됩니다.
```json
>>> -0.49997231364250183d

wolframalpha.com
>>> sin(30˚) = 0.5
```

`sin(30˚)` ≈ `0.5`
오차: `0.000027686357498`

<br/>

`Pos[0]`는 `sin`이며, `Pos[2]`는 `cos`입니다.

```json
>>> 0.866041362285614d

wolframalpha.com
>>> cos(30˚) = 0.86602540378443864676372317075293618347140262690519031402790348972596650845...
```

`cos(30˚)` ≈ `0.8660...`
소수점 이하 4자리까지 일치합니다.

<br/>

# 디스플레이 엔티티
---
디스플레이 엔티티의 `nbt`를 이용하는 방법입니다.

- [[Minecraft 1.19.4](https://www.minecraft.net/en-us/article/minecraft-java-edition-1-19-4)] 버전 이상
- 비용: 엔티티 + 청크(1개)

<br/>

디스플레이 엔티티는 `axis-angle`
즉, `{axis:[1, y, z], angle: D}`를 사원수 `[rx, ry, rz, rw]` 꼴로 변환하는데,

<img src="https://latex.codecogs.com/svg.image?\large r_x=1\cdot\sin\left(\frac{D}{2}\right)" style="vertical-align:middle; filter: invert(1)"/> 식을 사용합니다.

또한,
입력 값은 라디안이기 때문에, 도를 라디안으로 변경해야 합니다.

<img src="https://latex.codecogs.com/svg.image?\large 1^\circ = \frac{x\pi}{180} = 0.01745329252..." style="vertical-align:middle; filter: invert(1)"/>

최종적으로...
도를 라디안으로 변환한 후, 입력 값을 두 배 곱하면 `sin(x)`를 도출할 수 있습니다.

<img src="https://latex.codecogs.com/svg.image?\large 45^\circ \;\rightarrow\; \frac{45\pi}{180} \;\rightarrow\; \left(\frac{45\pi}{180}\right)\cdot 2 \;\rightarrow\; \sin\left(\frac{\left(\frac{45\pi}{180}\right)\cdot 2}{2}\right)" style="vertical-align:middle; filter: invert(1)" />

<br/>

## 구현
원점을 사용하므로 `0.0, 0.0, 0.0` 좌표를 항상 로드합니다.
스코어 보드를 사용하므로 필요한 점수판을 생성합니다.
```mcfunction
execute in minecraft:overworld run forceload add 0 0

execute in minecraft:overworld run summon text_display 0.0 16777216.0 0.0 {UUID:[I;-106152811,-744601267,-1448356193,472297496]}

data modify storage trig: axis-angle set value {axis: [1f,0f,0f], angle: 0f}

scoreboard objectives add trig dummy
```

스코어 보드로 입력 값을 받습니다. (예: 30도)
```mcfunction
execute store result storage trig: axis-angle.angle float 0.034906585039886 run scoreboard players set #input trig 30
```

디스플레이 엔티티에 적용합니다.
```mcfunction
data modify entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation set from storage trig: axis-angle

data modify storage trig: output set from entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation[0]

tellraw @a {nbt:"output", storage:"trig:"}
```

<br/>

`tan`는 <img src="https://latex.codecogs.com/svg.image?\large \frac{\sin(x)}{\cos(x)}" style="vertical-align:middle; filter: invert(1)"/> 식을 사용합니다.

따라서, 나눗셈을 구현해야 되는데, 이때 `transformation`(행렬)을 이용할 수 있습니다.

```javascript
// 3열의 3행(4x4)
float f = 1.0F / this.matrix.m33();
...
// 현재 translation 각 원소(x,y,z)에 f를 곱한 값을 저장합니다.
this.translation = this.matrix.getTranslation(new Vector3f()).mul(f);
```

4x4 행렬로 값을 넣습니다.
`[0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,-2]`

최종적으로...
1을 가장 마지막 원소로 나눈 뒤, 그 값을 translation[x]와 곱하면 나눗셈을 구현할 수 있습니다.

<img src="https://latex.codecogs.com/svg.image?\large \frac{1}{-2} \;\to\; 1 \times \left(\frac{1}{-2}\right) \;\to\; -\frac{1}{2} \;\to\; -0.5" style="vertical-align:middle; filter: invert(1)"/>

```mcfunction
execute store result storage trig: axis-angle.angle float 0.034906585039886 run scoreboard players set #input trig 30

data modify entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation set from storage trig: axis-angle

data modify storage trig: output set from entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation[0]

> 이전 명령어


data modify storage trig: matrix set value [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,1]

data modify storage trig: matrix[-1] set from entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation[-1]
data modify storage trig: matrix[-5] set from entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.right_rotation[0]

data modify entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation set from storage trig: matrix

data modify storage trig: output set from entity f9ac3c95-d39e-494d-a9ab-d69f1c26b018 transformation.translation[-1]

tellraw @a {nbt:"output", storage:"trig:"}
```