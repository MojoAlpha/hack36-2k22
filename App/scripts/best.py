import json
import sys
from pprint import pprint
import subprocess
jdata = open("/home/warmachine/.config/electron-test/ProxyList.json")

data = json.load(jdata)

for pxy in data["todos"]:
  comm = f"http://{pxy['username']}:{pxy['password']}@{pxy['ip']}:{pxy['port']}"
  subprocess.run(["/home/warmachine/Desktop/hack36-2k22/App/scripts/wget_test.sh", comm], shell=True)
  
jdata.close()