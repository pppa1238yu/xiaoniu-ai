#!/bash/sh

sed -i "s/127.0.0.1:5000//g" src/app/utils/Constants.ts
sed -i "s/http:\/\///g" src/app/utils/Constants.ts
