# NodeDatashare
To execute this project use these commands, to install dependencies:
```npm i```
You can then execute:
```node server.js```
server.js is the final script that can format the logs coming.

To test the app you can use this:
```curl -X POST -H "Content-Type: application/json" -d '{"data":"event :android.app.admin…$SecurityEevent@332d050d\ttag   :210124\tdata  :1 Stats_Key_EC 10869\ttime  :04-16 17:27:18.955\tid    :1\nevent :aandroid.app.admin.SecurityLog$SecurityEvent@ed780761\ttag   :210005\tdata  :com.google.android.apps.turbo:aab 1713281240651 10156 27684 default:privapp:targetSdkVersion=31:complete e6d621f68507bf48c25a87b775c318f8896ba71149b2e1e2854affzfe38d7c0fb2\ttime  :04-16 17:29:20.696\tid    :5"}' https://localhost:8888/data```
