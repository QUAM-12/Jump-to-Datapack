# 실행 시, 버전 입력 -> 서버 생성
# 버전에 맞는 스니크래프트 존재 시 -> 스니크래프트도 설치

# import
import gzip
import json
import os
import platform
import requests
import shutil
import sniffcraft_gen
import sys
import time
import zipfile
from nbtlib import tag


# constant
properties = {
   "enable-command-block": "true",
   "function-permission-level": "4",
   "gamemode": "creative",
   "online-mode": "false"
}



def ROOT_DIR(root):
   base = root.removesuffix(" Server")
   index = 1
   while True:
      new = f"{base}-{index} Server" if index > 1 else root
      if not os.path.exists(new):
         if index > 1:
            print(f"[INFO] '{root}' 디렉토리가 이미 존재합니다 → '{new}'로 생성합니다.")
         return new
      index += 1

VERSION = input("마인크래프트 버전: ").strip()
ROOT = f"JTD {VERSION} Server"
DIRECTORY = ROOT_DIR(ROOT)
print()



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

print(f"[INFO] {VERSION} server.jar 서버 다운로드 중...")
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



## server.properties 생성
properties_path = os.path.join(DIRECTORY, "server.properties")

with open(properties_path, "w", encoding="utf-8") as f:
   for key, value in properties.items():
      f.write(f"{key}={value}\n")
print("\n[INFO] server.properties 생성 완료")

#@ ==== eula.txt ====
with open(os.path.join(DIRECTORY, "eula.txt"), "w") as f:
   f.write("eula=true\n")
print("[INFO] eula.txt 생성 완료")



## 실행 파일 생성
# Windows
if platform.system() == "Windows":
   script_path = os.path.join(DIRECTORY, "start.bat")
   with open(script_path, "w") as f:
      f.write("@echo off\n")
      f.write("cd /d \"%~dp0\"\n")
      f.write("java -Xms2G -Xmx2G -jar server.jar nogui\n")
      f.write("pause\n")
   print("[INFO] Windows용 start.bat 생성 완료")

# macOS
elif platform.system() == "Darwin":
   script_path = os.path.join(DIRECTORY, "start.command")
   with open(script_path, "w") as f:
      f.write("#!/bin/bash\n")
      f.write('cd "$(dirname "$0")"\n')
      f.write("exec java -Xms2G -Xmx2G -jar server.jar nogui\n")
   os.chmod(script_path, 0o755)
   print("[INFO] macOS용 start.command 생성 완료")



#@ DataVersion
def get_data_version(jar_path):
   with zipfile.ZipFile(jar_path, 'r') as jar:
      with jar.open('version.json') as file:
         DataVersion = json.load(file)
         return DataVersion.get('world_version')

## 맵 생성
world_path = os.path.join(DIRECTORY, "world")
os.makedirs(world_path, exist_ok=True)

# 현재 시간
now = int(time.time() * 1000)

# 최상위
data = tag.Compound({
   "": tag.Compound({
      'Data': tag.Compound({
         'WanderingTraderSpawnChance': tag.Byte(0),
         'BorderCenterZ': tag.Double(0.0),
         'Difficulty': tag.Byte(1),
         'BorderSizeLerpTime': tag.Long(0),
         'raining': tag.Byte(0),
         'Time': tag.Long(0),
         'GameType': tag.Int(1),
         'ServerBrands': tag.List([tag.String('vanilla')]),
         'BorderCenterX': tag.Double(0.0),
         'BorderDamagePerBlock': tag.Double(0.2),
         'BorderWarningBlocks': tag.Double(5.0),
         'WorldGenSettings': tag.Compound({
            'bonus_chest': tag.Byte(0),
            'seed': tag.Long(0),
            'generate_features': tag.Byte(0),
            'dimensions': tag.Compound({
               'minecraft:overworld': tag.Compound({
                  'generator': tag.Compound({
                        'settings': tag.Compound({
                           'features': tag.Byte(1),
                           'biome': tag.String('minecraft:plains'),
                           'layers': tag.List([
                              tag.Compound({
                                    'block': tag.String('minecraft:quartz_block'),
                                    'height': tag.Int(1),
                              })
                              ]),
                              'structure_overrides': tag.List[tag.String]([]),
                              'lakes': tag.Byte(0),
                           }),
                           'type': tag.String('minecraft:flat'),
                        }),
                        'type': tag.String('minecraft:overworld'),
                  }),
                  'minecraft:the_nether': tag.Compound({
                        'generator': tag.Compound({
                           'settings': tag.String('minecraft:nether'),
                           'biome_source': tag.Compound({
                              'preset': tag.String('minecraft:nether'),
                              'type': tag.String('minecraft:multi_noise'),
                           }),
                           'type': tag.String('minecraft:noise'),
                        }),
                        'type': tag.String('minecraft:the_nether'),
                  }),
                  'minecraft:the_end': tag.Compound({
                        'generator': tag.Compound({
                           'settings': tag.String('minecraft:end'),
                           'biome_source': tag.Compound({
                              'type': tag.String('minecraft:the_end'),
                           }),
                           'type': tag.String('minecraft:noise'),
                        }),
                        'type': tag.String('minecraft:the_end'),
                  }),
               }),
            }),
            'DragonFight': tag.Compound({
               'NeedsStateScanning': tag.Byte(1),
               'Gateways': tag.List[tag.Int]([tag.Int(x) for x in [0,16,19,7,8,14,5,4,12,3,11,9,13,15,2,1,10,6,17,18]]),
               'DragonKilled': tag.Byte(0),
               'PreviouslyKilled': tag.Byte(0),
            }),
            'BorderSizeLerpTarget': tag.Double(59999968.0),
            'Version': tag.Compound({
               'Snapshot': tag.Byte(0),
               'Series': tag.String('main'),
               'Id': tag.Int(int(get_data_version(jar_path))),
               'Name': tag.String(VERSION),
            }),
            'DayTime': tag.Long(0),
            'initialized': tag.Byte(1),
            'WasModded': tag.Byte(0),
            'allowCommands': tag.Byte(1),
            'WanderingTraderSpawnDelay': tag.Int(24000),
            'CustomBossEvents': tag.Compound({}),
            'GameRules': tag.Compound({
               'globalSoundEvents': tag.String("false"),
               'tntExplosionDropDecay': tag.String("false"),
               'enderPearlsVanishOnDeath': tag.String("false"),
               'doFireTick': tag.String("false"),
               'maxCommandChainLength': tag.String("65536"),
               'doVinesSpread': tag.String("false"),
               'disableElytraMovementCheck': tag.String("false"),
               'lavaSourceConversion': tag.String("false"),
               'commandBlockOutput': tag.String("false"),
               'forgiveDeadPlayers': tag.String("false"),
               'playersNetherPortalCreativeDelay': tag.String("0"),
               'doMobSpawning': tag.String("false"),
               'maxEntityCramming': tag.String("2147483647"),
               'tntExplodes': tag.String("false"),
               'allowFireTicksAwayFromPlayer': tag.String("false"),
               'locatorBar': tag.String("true"),
               'universalAnger': tag.String("true"),
               'playersSleepingPercentage': tag.String("0"),
               'snowAccumulationHeight': tag.String("0"),
               'blockExplosionDropDecay': tag.String("false"),
               'doImmediateRespawn': tag.String("true"),
               'naturalRegeneration': tag.String("true"),
               'doMobLoot': tag.String("false"),
               'fallDamage': tag.String("false"),
               'doEntityDrops': tag.String("false"),
               'randomTickSpeed': tag.String("0"),
               'playersNetherPortalDefaultDelay': tag.String("0"),
               'spawnRadius': tag.String("0"),
               'freezeDamage': tag.String("false"),
               'sendCommandFeedback': tag.String("true"),
               'doWardenSpawning': tag.String("false"),
               'fireDamage': tag.String("false"),
               'reducedDebugInfo': tag.String("false"),
               'waterSourceConversion': tag.String("true"),
               'projectilesCanBreakBlocks': tag.String("true"),
               'announceAdvancements': tag.String("false"),
               'drowningDamage': tag.String("false"),
               'spawnChunkRadius': tag.String("0"),
               'disableRaids': tag.String("true"),
               'doWeatherCycle': tag.String("false"),
               'mobExplosionDropDecay': tag.String("false"),
               'doDaylightCycle': tag.String("false"),
               'showDeathMessages': tag.String("false"),
               'doTileDrops': tag.String("false"),
               'doInsomnia': tag.String("false"),
               'keepInventory': tag.String("true"),
               'disablePlayerMovementCheck': tag.String("true"),
               'doLimitedCrafting': tag.String("true"),
               'mobGriefing': tag.String("false"),
               'commandModificationBlockLimit': tag.String("2147483647"),
               'doTraderSpawning': tag.String("false"),
               'logAdminCommands': tag.String("false"),
               'spectatorsGenerateChunks': tag.String("true"),
               'doPatrolSpawning': tag.String("false"),
               'maxCommandForkCount': tag.String("65536"),
            }),
            'Player': tag.Compound({}),
            'SpawnY': tag.Int(0),
            'rainTime': tag.Int(0),
            'thunderTime': tag.Int(0),
            'SpawnZ': tag.Int(0),
            'hardcore': tag.Byte(0),
            'DifficultyLocked': tag.Byte(0),
            'SpawnX': tag.Int(0),
            'clearWeatherTime': tag.Int(0),
            'thundering': tag.Byte(0),
            'SpawnAngle': tag.Float(0.0),
            'version': tag.Int(19133),
            'BorderSafeZone': tag.Double(5.0),
            'LastPlayed': tag.Long(now),
            'BorderWarningTime': tag.Double(15.0),
            'ScheduledEvents': tag.List[tag.String]([]),
            'LevelName': tag.String("world"),
            'BorderSize': tag.Double(59999968.0),
            'DataVersion': tag.Int(int(get_data_version(jar_path))),
            'DataPacks': tag.Compound({
               'Enabled': tag.List[tag.String]([tag.String('vanilla')]),
               'Disabled': tag.List[tag.String]([tag.String('minecart_improvements'),tag.String('redstone_experiments'),tag.String('trade_rebalance'),]),
            }),
      })
   }),
})

level_path = os.path.join(world_path, "level.dat")
with gzip.open(level_path, 'wb') as f:
   data.write(f)
shutil.copyfile(level_path, os.path.join(world_path, "level.dat_old"))

print("\n[INFO] 맵 생성 완료")



## 스니크래프트 생성
if sniffcraft_gen.download(DIRECTORY, VERSION):
   print("[INFO] 스니크래프트 설치 완료")

# 스니크래프트 설정 파일 생성
if sniffcraft_gen.config(DIRECTORY):
   print("[INFO] 스니크래프트 설정 파일 생성 완료")