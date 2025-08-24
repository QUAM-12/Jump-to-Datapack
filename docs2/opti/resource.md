# 리소스
마인크래프트를 구성하는 요소를 최적화 하는 방법에 대해 설명합니다.

<br/>

# 선택자
선택자에 대한 내용은 [[00-3 선택자](00-3)]을 참고하십시오.

## 기본 선택자

<details>
   <summary>@e, @n</summary>

   플레이어 포함 다른 엔티티를 선택하는 `@e`, `@n`의 경우,
   해당 엔티티가 살아 있는지 확인합니다.
   
   따라서, `@e[type=player]`와 `@a` / `@n[type=player]`와 `@p`의 성능 차이가 발생합니다.

   ```java
   public boolean isAlive() {
      return !this.isRemoved();
   }


   @Override
   public final boolean isRemoved() {
      return this.removalReason != null;
   }
   ```
</details>

<br/>

## 인수