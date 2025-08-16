# 마인크래프트 소스 코드 보기

<span style="color:red">[[라이선스](https://minecraft.wiki/w/Obfuscation_map#License)]에 따라 마인크래프트의 디컴파일은 허용되지만,
   코드를 공개하지 않는 것이 좋습니다.</span>

<br/>

마인크래프트는 [[Java(자바)](https://www.oracle.com/java/)]라는 프로그래밍 언어로 개발되었습니다.

`Mojang`은 공식적으로 소스 코드를 공개하지는 않기 때문에,
게임 파일을 디컴파일러를 이용해 직접 변환해야 합니다.

게임의 소스 코드는 `.java` 또는 `.class` 파일 형태로 되어 있으며,
이를 확인하려면 `Java`를 읽을 수 있는 프로그램 혹은 도구가 필요합니다.

<br/>

# JAR 디컴파일
가장 쉬운 방법은 MaxPixelStudios의 [[MinecraftDecompiler](https://github.com/MaxPixelStudios/MinecraftDecompiler/releases/latest)]를 사용하는 것입니다.
기본적인 사용법은 다음과 같습니다.

```javascript
java -jar MinecraftDecompiler.jar --version 1.21.8 --side CLIENT --decompile fernflower --decompiled-output 1.21.8 --regenerate-variable-names
```

- `CLIENT` 인수는 `SERVER`로 변경할 수 있습니다.

<br/>

# 코드 보기

[[IntelliJ](https://www.jetbrains.com/idea/)]나, [[Visual Studio Code](https://code.visualstudio.com/)]로 파일을 열어,
코드를 확인할 수 있습니다.
- Visual Studio Code는 별도의 확장이 필요합니다.