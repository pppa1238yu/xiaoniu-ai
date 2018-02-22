#!/bash/sh

version=`grep version package.json|awk -F\" '{print $4}'`

main_css="main-$version.css"
main_js="main-$version.js"

cp build/main.js "build/$main_js"
cp build/main.css "build/$main_css"

prefix='\/static'

sed -i "s/main.css/$main_css/g" build/index.html
sed -i "s/main.js/$main_js/g" build/index.html

sed -i "s/href=\"/href=\"$prefix/g" build/index.html
sed -i "s/src=\"\//src=\"$prefix\//g" build/index.html

sed -i 's/remoteHost = ""/remoteHost = "127.0.0.1:5000"/g' src/app/utils/Constants.ts
sed -i 's/remoteHTTP = ""/remoteHTTP = "http:\/\/"/g' src/app/utils/Constants.ts
