const { run_shell_command } = require("./run_shell_command");
const path = require("path");

let proxy_id = [
  {
    ip: "172.31.100.27",
    port: "3128",
    login: "edcguest",
    password: "edcguest",
  },
  {
    ip: "172.31.100.14",
    port: "3128",
    login: "edcguest",
    password: "edcguest",
  },
  {
    ip: "172.31.100.29",
    port: "3128",
    login: "edcguest",
    password: "edcguest",
  },
];

// wget https://freetestdata.com/wp-content/uploads/2022/02/Free_Test_Data_15MB_MP4.mp4 -e use_proxy=yes -e https_proxy=http://edcguest:edcguest@172.31.100.27:3128
let best = null;

const getBestProxy = (proxy_list, best) => {
  let proxy_promise = [];
  for (let i = 0; i < proxy_list.length; ++i) {
    proxy_promise.push(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            run_shell_command(
              `${path.join(__dirname)}/wget_test.sh http://${
                proxy_list[i].login
              }:${proxy_list[i].password}@${proxy_list[i].ip}:${
                proxy_list[i].port
              }`
            )
          );
        }, 4000);
      })
    );
  }

  let mxspeed = 0;

  console.log(proxy_promise);

  Promise.all(proxy_promise)
    .then((values) => {
      console.log(values);
      for (let i = 0; i < values.length; ++i) {
        console.log(values[i]);
        if (values[i] === "") continue;
        let tmp = parseFloat(values[i]);
        if (values[i].search("MB") >= 0) tmp = tmp * 1000;

        if (best === null || mxspeed < tmp) {
          best = i;
          mxspeed = tmp;
        }
      }
      // return proxy_list[best];
      // best = i;
    })
    .catch((err) => console.log(err));

  // ans = await ans;
  // console.log("final ans:", ans);
};

getBestProxy(proxy_id, best);
