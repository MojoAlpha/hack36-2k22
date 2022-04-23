const fs = require('fs');

const getConfiguration = (ip_addr, port, login, password) => {
    return `base {
    log_debug = off;
    log_info = off;
    log = "file:/var/log/redsocks";
    daemon = on;
    redirector = iptables;
}

redsocks {
    local_ip = 0.0.0.0;
    local_port = 12345;

    ip = ${ip_addr};
    port = ${port};
    
    login = "${login}";
    password = "${password}";

    type = http-relay;
}

T        local_ip = 0.0.0.0;
        local_port = 12346;

        ip = ${ip_addr};
        port = ${port};

        login = "${login}";
        password = "${password}";
    
        type = http-connect;
}`
}

const changeConfiguration = (ip_addr, port, login, password, file_path) => {
    const configuration = getConfiguration(ip_addr, port, login, password);
    fs.writeFile(file_path, configuration, (err) => {
        if (err) return console.error(err);
    })
    console.log('config set!!')
}

exports.module = {
    changeConfiguration
}