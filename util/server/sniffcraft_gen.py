# from main.py
# 스니크래프트 설치용 파이썬

import json
import os
import platform

import requests


def download(DIRECTORY, VERSION):
   system = platform.system().lower()
   if system == "darwin":
      system = "macos"
   
   file_name = f"sniffcraft-{system}-{VERSION}"

   # search
   url = f"https://github.com/adepierre/SniffCraft/releases/download/latest/{file_name}"

   os.makedirs(DIRECTORY, exist_ok=True)
   file_path = os.path.join(DIRECTORY, file_name)

   if os.path.exists(file_path):
      print("[WARNING] 스니크래프트가 이미 설치되어 있습니다.")
      return

   print(f"\n[INFO] 스니크래프트 다운로드 중...")
   try:
      with requests.get(url, stream=True) as r:
         r.raise_for_status()
         with open(file_path, "wb") as f:
               for chunk in r.iter_content(chunk_size=8192):
                  if chunk:
                     f.write(chunk)
      print(f"[INFO] 다운로드 완료: {file_path}")

   except requests.exceptions.HTTPError as e:
      print(f"[ERROR] 다운로드 실패: {e}")
      return None
   
   if platform.system().lower() == "darwin":
      os.chmod(file_path, 0o755)

   return file_path



def config(DIRECTORY):
   url = "https://raw.githubusercontent.com/adepierre/SniffCraft/refs/heads/master/conf/no_spam.json"
   os.makedirs(DIRECTORY, exist_ok=True)
   file_path = os.path.join(DIRECTORY, "conf.json")

   if os.path.exists(file_path):
      print("[WARNING] 설정 파일이 이미 있습니다.")
      return
   
   print(f"\n[INFO] 스니크래프트 설정 파일 다운로드 중...")

   # 파일 다운로드
   with requests.get(url, stream=True) as r:
      r.raise_for_status()
      with open(file_path, "wb") as f:
         for chunk in r.iter_content(chunk_size=8192):
               if chunk:
                  f.write(chunk)
   print(f"[INFO] 설정 파일 다운로드 완료: {file_path}")

   # conf.json 수정
   with open(file_path, "r", encoding="utf-8") as f:
      data = json.load(f)

   if "LogToTxtFile" in data:
      data["LogToTxtFile"] = False

   with open(file_path, "w", encoding="utf-8") as f:
      json.dump(data, f, indent=4, ensure_ascii=False)

   print("[INFO] LogToTxtFile 옵션을 false로 변경했습니다.")