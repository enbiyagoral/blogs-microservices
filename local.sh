#/bin/bash

for app in auth blogs comments aws categories notifications search
do
    ps aux | grep "npm run start:dev $app" | grep -v grep | awk '{print $2}' | xargs kill -9
    log_file="./$app.log"
    rm $log_file 2> /dev/null
    npm run start:dev $app >> $log_file &
done