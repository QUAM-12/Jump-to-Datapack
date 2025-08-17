# SniffCraft
마인크래프트는 클라이언트와 서버 간 통신에 
`TCP` 기반의 프로토콜을 사용합니다.

기본 포트는 `25565`이며, 연결은 `TCP` 소켓을 통해 연결되며,
바이트 수준의 수신/송신을 통해 이루어집니다.

이러한 일련의 과정을 "패킷을 주고 받는다" 라고 할 수 있습니다.
우선 클라이언트와 서버에 대해 알고 있어야 합니다.

<span style="font-size:150%">`클라이언트란`</span> 플레이어가 실행하는 게임 그 자체이자,
인게임에서는 렌더링 및 입력 처리를 담당하는 부분입니다.

<span style="font-size:150%">`서버란`</span> 실제 세계(월드)를 가지고 있으며,
게임의 전반적인 시스템과 규칙 처리를 담당하는 부분입니다.

<span style="font-size:150%">`서버`</span>의 종류는 크게 2개로 구분됩니다.
- 싱글 혹은 싱글 랜서버의 `Integrated` 서버
- 서버 구동기로 실행되는 `Dedicated` 서버

<br/>

기본적으로 디버그 화면에서는 수신/송신된 패킷의 개수를 확인할 수 있습니다.
<img src="assets/img/packet.png" height="256"/>

그러나, 어떤 패킷이 얼마큼 오갔는지 알 수는 없습니다.
이는 클라이언트-서버 사이에서 오가는 패킷을 빼와야 합니다.

[[SniffCraft](https://github.com/adepierre/SniffCraft)]는 클라이언트와 서버의 중간자 역할을 하여,
오가는 패킷을 기록하고 실시간으로 확인할 수 있습니다.

---

<br/>

# 사용법
- [[튜토리얼 영상](https://youtu.be/wXOD41jI_Rg?si=bACwjsmeYqALleRE)]

[[server.py](util/server/main.py)]를 사용법에 맞춰 실행하면,
`SniffCraft`가 있는 버전의 경우 서버와 함께 다운로드 됩니다.

그 다음, 서버 실행 파일로 서버를 열고
`SniffCraft`를 실행하면, 다음과 같은 창이 표시됩니다.
- 참고: `macOS`는 `.exe` 파일이 실행되지 않기에 터미널에서 실행해야 합니다.

![sniffcraft](assets/img/sniffcraft.png)

- Authenticated: 마인크래프트 계정으로 로그인 합니다.
- Server address: 실제 서버의 주소
- Local port: 연결할 주소의 포트

`Start` 버튼을 누른 후, `localhost:25555` 주소로 입장하면,
`Sesstions`에 입장 로그가 출력됩니다.

입장 후에는 패킷이 출력됩니다.

## 표시와 숨김
`Displayed packets`에 표시된 특정 패킷을 더블 클릭하여,
`Sessions`에 뜨지 않게 숨길 수 있습니다.

`Hidden packets`에 표시된 특정 패킷을 더블 클릭하여,
`Sessions`에 뜨게할 수 있습니다.

참고로 `Sessions` 창을 어지럽히는 패킷은 기본적으로 숨겨진 상태입니다.

## 표시 필터
- Handshake: 패킷 없음
- Status: 주로 핑과 관련
- Login: 서버 혹은 계정 로그인
- Play: 실제 인게임에서 송수신되는 패킷
- Configuration: 게임 외부 정보 관련

### 방향
- Server --> Client: 서버에서 클라이언트로 전송되는 패킷
- Client --> Server: 클라이언트에서 서버로 전송되는 패킷