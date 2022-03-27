# caretech
MicroPython 與 Arduino 的差異之一是它有檔案系統, 可以說是一個小型的作業系統, 應用程式只要上傳到檔案系統即可改變系統功能, 不需要燒錄韌體. MircoPython on ESP32 的檔案系統操作與 ESP8266 是一樣的。
<p>MicroPytho 系統下有兩個程式是 NodeMCU/ESP32 在一接上電源的時候就會馬上被執行的程式，依序是 boot.py 及 main.py，如果希望在開機時，就要執行的程式，可以寫在 main.py 中，
boot.py 執行一些系統設定，執行一次就結束，接著執行 main.py，通常將無限迴圈放在 main.py中。這樣 NodeMCU/ESP32 就可以不需要一直接在電腦上，由使用者按下執行按鈕，只需要接上電源就可以運作了。</p>
