# 데이터 생성기

import os
import subprocess
import sys
import requests

VERSION = input("마인크래프트 버전: ")
DIRECTORY = f"{VERSION} data"

## manifest.json 생성
print("[INFO] 버전 정보를 가지고 오는 중...")
url = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
meta = requests.get(url).json()

versions = next((v for v in meta["versions"] if v["id"] == VERSION), None)
if not versions:
   print(f"[ERROR] minecraft {VERSION}을(를) 찾을 수 없습니다.")
   exit(1)

versions_json = requests.get(versions["url"]).json()
server_url = versions_json["downloads"]["server"]["url"]



#@ 프로그레스 바
def progress_bar(progress, total, bar_width=40):
   percent = progress / total
   filled_length = int(bar_width * percent)
   bar = '█' * filled_length + '-' * (bar_width - filled_length)
   sys.stdout.write(f"\r[ {bar} ] | {int(percent * 100)}%")
   sys.stdout.flush()

## server.jar 다운로드
os.makedirs(DIRECTORY, exist_ok=True)
jar_path = os.path.join(DIRECTORY, "server.jar")

print(f"\n[INFO] {VERSION} server.jar 서버 다운로드 중...")
with requests.get(server_url, stream=True) as r:
   r.raise_for_status()
   total_size = int(r.headers.get('Content-Length', 0))
   downloaded = 0
   chunk_size = 8192

   with open(jar_path, 'wb') as f:
      for chunk in r.iter_content(chunk_size=chunk_size):
         if chunk:
            f.write(chunk)
            downloaded += len(chunk)
            progress_bar(downloaded, total_size)
print(f"\n[INFO] {VERSION} server.jar 다운로드 완료")



## 데이터 생성
print("\n[INFO] 데이터 생성 중...\n")
subprocess.run([
    "java",
    "-DbundlerMainClass=net.minecraft.data.Main",
    "-jar", "server.jar",
    "--all"
], cwd=DIRECTORY)
print("\n[INFO] 데이터 생성 완료")