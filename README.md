# client-ps4
The PS4 controller sending info up to the dashee server

*Note, this only works on the PS4 controller using USB. Tested on 
MAC OSX only.*

Install the packages required

    npm install

To run

    node ps4.js
    
You can specify the host (default localhost) or port (default 2047) 
by using:

    node ps4.js --host 192.168.1.76 --port 1337