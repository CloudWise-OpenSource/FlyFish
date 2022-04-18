import os

#### init database
os.system(". ${CW_INSTALL_APP_DIR}/bash_profile && cd ${CW_INSTALL_APP_DIR}/${SERVICE_NAME}/changelog && NODE_ENV=docp ${CW_INSTALL_APP_DIR}/nodejs/bin/node scripts/initDatabase.js")
os.system(". ${CW_INSTALL_APP_DIR}/bash_profile && cd ${CW_INSTALL_APP_DIR}/${SERVICE_NAME}/changelog && NODE_ENV=docp ${CW_INSTALL_APP_DIR}/nodejs/bin/node scripts/updateIndex.js")

### init chrome-linux
CHROME_LINUX_DIR = "${CW_INSTALL_APP_DIR}/${SERVICE_NAME}/node_modules/puppeteer/.local-chromium/linux-901912"
NEW_CHROME_LINUX_DIR = "${CW_INSTALL_APP_DIR}/${SERVICE_NAME}/lib"
CHROME_LINUX_NAME = "chrome-linux"

os.system("sed -i -e 's#\${CW_INSTALL_CHROME_DIR}#%s#g' %s/%s/fonts/fonts.conf" % (CHROME_LINUX_DIR, NEW_CHROME_LINUX_DIR, CHROME_LINUX_NAME))
os.system("cd {} && rm -rf {} && mv {}/{} {}/{}".format(CHROME_LINUX_DIR, CHROME_LINUX_NAME, NEW_CHROME_LINUX_DIR, CHROME_LINUX_NAME, CHROME_LINUX_DIR, CHROME_LINUX_NAME))
