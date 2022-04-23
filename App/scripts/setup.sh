# stopping the redsocks service process
sudo systemctl stop redsocks.service

# resetting iptables to default and deleting REDSOCKS chain
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t nat -X
sudo iptables -t mangle -F
sudo iptables -t mangle -X

# setting up REDSOCKS forwarding chain
sudo iptables -t nat -N REDSOCKS
sudo iptables -t nat -A REDSOCKS -d 0.0.0.0/8 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 10.0.0.0/8 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 169.254.0.0/16 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 172.16.0.0/12 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 192.168.0.0/16 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 224.0.0.0/4 -j RETURN
sudo iptables -t nat -A REDSOCKS -d 240.0.0.0/4 -j RETURN

sudo iptables -t nat -A REDSOCKS -p tcp --dport 80 -j REDIRECT --to-ports 12346
sudo iptables -t nat -A REDSOCKS -p tcp --dport 443 -j REDIRECT --to-ports 12346
sudo iptables -t nat -A REDSOCKS -p tcp --dport 11371 -j REDIRECT --to-ports 12345

sudo iptables -t nat -A OUTPUT -p tcp -j REDSOCKS

sudo iptables -t nat -A PREROUTING -p tcp --dport 11371 -j REDSOCKS
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDSOCKS
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDSOCKS

sudo echo "base {
    log_debug = off;
    log_info = off;
    log = \"file:/var/log/redsocks\";
    daemon = on;
    redirector = iptables;
}

redsocks {
    local_ip = 0.0.0.0;
    local_port = 12345;

    ip = $1;
    port = $2;
    
    login = \"$3\";
    password = \"$4\";

    type = http-relay;
}

redsocks{
        local_ip = 0.0.0.0;
        local_port = 12346;

        ip = $1;
        port = $2;

        login = \"$3\";
        password = \"$4\";
    
        type = http-connect;
}" > /etc/redsocks.conf

sudo systemctl start redsocks.service