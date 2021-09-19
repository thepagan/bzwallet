/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ini from 'ini';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { remote } from 'electron';
import { RPCConfig } from './AppState';
import RPC from '../rpc';
import cstyles from './Common.module.css';

const locateZcashConf = () => {
  if (os.platform() === 'darwin') {
    return path.join(remote.app.getPath('appData'), 'Bzedge', 'bzedge.conf');
  }

  if (os.platform() === 'linux') {
    return path.join(remote.app.getPath('home'), '.bzedge', 'bzedge.conf');
  }

  return path.join(remote.app.getPath('appData'), 'Bzedge', 'bzedge.conf');
};

const locateMasternodeConf = () => {
  if (os.platform() === 'darwin') {
    return path.join(remote.app.getPath('appData'), 'Bzedge', 'masternode.conf');
  }

  if (os.platform() === 'linux') {
    return path.join(remote.app.getPath('home'), '.bzedge', 'masternode.conf');
  }

  return path.join(remote.app.getPath('appData'), 'Bzedge', 'masternode.conf');
};

const closeApp = () => {
  const w = remote.getCurrentWindow();
  w.close();
};

const writeMNConfFile = vars => {
  // Load the RPC config from zcash.conf file
  const MasternodeConfLocation = locateMasternodeConf();

  function byebye() {
    document.getElementById('Message').innerHTML = '';
  }
  // eslint-disable-next-line no-unused-vars
  try {
    fs.appendFileSync(MasternodeConfLocation, vars);
    const Message = document.getElementById('Message');
    Message.style = 'color: green';
    Message.innerHTML = 'Success';
    setTimeout(byebye, 1000);

    // this.componentDidMount();
    // let w = remote.getCurrentWindow();
    // w.close();
  } catch (err) {
    console.log('Died during write');
  }
};
const writeConfFileRestart = vars => {
  // Load the RPC config from zcash.conf file
  const MasternodeConfLocation = locateMasternodeConf();
  // eslint-disable-next-line no-unused-vars
  try {
    fs.appendFileSync(MasternodeConfLocation, vars);
    // LoadingScr  een.componentDidMount();
    setTimeout(closeApp(), 1000);
    // app.relaunch();
    // ipcRenderer.send('close-me');
    // process.exit(process.pid);
  } catch (err) {
    console.log('Died during write and restart');
  }
  console.log('After write');
  console.log('After const');
  console.log('After empty');
};

class MasternodeScriptsState {
  currentStatus: string;

  loadingDone: boolean;

  rpcConfig: RPCConfig | null;

  MasternodeConfig: MasternodeConfig | null;

  getMNListRetryCount: number;

  constructor() {
    this.currentStatus = 'Loading...';
    this.loadingDone = false;
    this.getMNListRetryCount = 0;
    this.rpcConfig = null;
    this.MasternodeConfig = null;
  }
}

class MasternodeScripts extends Component<Props, MasternodeScriptsState> {
  constructor(props: Props) {
    super(props);

    this.state = new MasternodeScriptsState();
  }

  componentDidMount() {
    (async () => {
      await this.loadZcashConf(true);
    })();
  }

  setupNextGetMasternodeConf() {
    setTimeout(() => this.getMasternodeConf(), 1000);
  }

  setupNextLoadMasternodeConf(vars) {
    setTimeout(() => this.loadMasternodeConf(vars), 1000);
  }

  setupStopDaemon() {
    setTimeout(() => this.getStopDaemon(), 10000);
  }

  setupNextGetMasternodeStart(vars) {
    this.getMasternodeStart(vars);
  }

  setupNextChangeConfig(vars) {
    this.ChangeConfig(vars);
  }

  async ClearConfig() {
    const MasternodeConfLocation = locateMasternodeConf();
    // eslint-disable-next-line no-unused-vars
    try {
      await this.getStopDaemon();
      fs.writeFileSync(MasternodeConfLocation, '');
      // LoadingScr  een.componentDidMount();
      // app.relaunch();
      // ipcRenderer.send('close-me');
      // process.exit(process.pid);
    } catch (err) {
      console.log('Died during clear');
    }
    console.log('After write');
    console.log('After const');
    console.log('After empty');
  }

  async ChangeConfig(vars) {
    try {
      // eslint-disable-next-line global-require
      const div = document.getElementById('mnchoice');
      let thecatch = document.getElementById('mnfilelist');
      let goaway = document.getElementById('errorcatch');
      // let buttonview = document.getElementById('addbutton');
      // let buttonview2 = document.getElementById('addbutton2');
      // buttonview2 = buttonview2.innerHTML = '';
      // buttonview = buttonview.innerHTML = '';
      goaway = goaway.innerHTML = '';
      thecatch = thecatch.innerHTML = '';
      const header = document.createElement('div');
      header.className = `${cstyles.xlarge}, ${cstyles.padall}, ${cstyles.center}`;
      header.innerHTML = 'Masternode Setup';
      header.id = 'title';
      div.appendChild(header);
      this.getStopDaemon();
      setTimeout(() => {
        const buttonchange1 = document.getElementById('saveonly');
        const buttonchange2 = document.getElementById('saverestart');
        buttonchange1.disabled = false;
        buttonchange2.disabled = false;
      }, 8000);
      const filelayout = ['alias', 'ip', 'privkey', 'txid', 'oidx'];
      console.log(filelayout.length);
      if (vars == null) {
        filelayout.forEach(x => {
          const Alias = document.createElement('input');
          Alias.type = 'text';
          Alias.className = cstyles.inputbox;
          Alias.id = x;
          Alias.rows = 1;
          Alias.cols = 5;
          Alias.placeholder = x;
          Alias.onchange = function(value) {
            const Magic = document.getElementById(x);
            Magic.values = value;
          };

          div.appendChild(Alias);
        });
        const Button = document.createElement('button');
        Button.className = cstyles.primarybutton;
        Button.textContent = 'Save and Close';
        Button.id = 'saverestart';
        // Button.disabled = true;
        Button.onclick = function() {
          let boxes = document.getElementById('alias').value;
          boxes += ' ';
          boxes += document.getElementById('ip').value;
          boxes += ' ';
          boxes += document.getElementById('privkey').value;
          boxes += ' ';
          boxes += document.getElementById('txid').value;
          boxes += ' ';
          boxes += document.getElementById('oidx').value;
          boxes += '\n';
          writeConfFileRestart(boxes);
        };
        div.appendChild(Button);
      } else {
        filelayout.forEach(x => {
          const Alias = document.createElement('input');
          Alias.type = 'text';
          Alias.className = cstyles.inputbox;
          Alias.id = x;
          Alias.rows = 1;
          Alias.cols = 5;
          Alias.placeholder = x;
          Alias.onchange = function(value) {
            const Magic = document.getElementById(x);
            Magic.values = value;
          };

          div.appendChild(Alias);
        });
        const Button2 = document.createElement('button');
        Button2.className = cstyles.primarybutton;
        Button2.textContent = 'Save and add another';
        Button2.id = 'saveonly';
        Button2.disabled = 'true';
        Button2.onclick = function() {
          let boxes = document.getElementById('alias').value;
          boxes += ' ';
          boxes += document.getElementById('ip').value;
          boxes += ' ';
          boxes += document.getElementById('privkey').value;
          boxes += ' ';
          boxes += document.getElementById('txid').value;
          boxes += ' ';
          boxes += document.getElementById('oidx').value;
          boxes += '\n';
          writeMNConfFile(boxes);
        };
        const Message = document.createElement('div');
        Message.id = 'Message';
        div.appendChild(Message);
        div.appendChild(Button2);
        const Button = document.createElement('button');
        Button.className = cstyles.primarybutton;
        Button.textContent = 'Save and Close';
        Button.id = 'saverestart';
        Button.disabled = 'true';
        Button.onclick = function() {
          let boxes = document.getElementById('alias').value;
          boxes += ' ';
          boxes += document.getElementById('ip').value;
          boxes += ' ';
          boxes += document.getElementById('privkey').value;
          boxes += ' ';
          boxes += document.getElementById('txid').value;
          boxes += ' ';
          boxes += document.getElementById('oidx').value;
          boxes += '\n';
          writeConfFileRestart(boxes);
        };
        div.appendChild(Button);
      }
    } catch (err) {
      console.log(err);
      this.loadZcashConf();
    }
  }

  async getMasternodeStart(vars) {
    const { rpcConfig } = this.state;
    // Try getting the info.
    try {
      const startoutput1 = await RPC.getMasternodeStartObject(vars, rpcConfig);
      console.log(startoutput1);
      alert(startoutput1.result);
    } catch (err) {
      // Not yet finished loading. So update the state, and setup the next refresh
      console.log("It's the Borg3, Captain.");
      this.setupNextGetMasternodeStart(vars);
    }
  }

  async loadZcashConf() {
    // Load the RPC config from zcash.conf file
    const zcashLocation = locateZcashConf();
    let confValues;
    try {
      confValues = ini.parse(await fs.promises.readFile(zcashLocation, { encoding: 'utf-8' }));
    } catch (err) {
      console.log('Error');
    }

    // Get the username and password
    const rpcConfig = new RPCConfig();
    rpcConfig.username = confValues.rpcuser;
    rpcConfig.password = confValues.rpcpassword;

    if (!rpcConfig.username || !rpcConfig.password) {
      return;
    }

    const isTestnet = (confValues.testnet && confValues.testnet === '1') || false;
    const server = confValues.rpcbind || '127.0.0.1';
    const port = confValues.rpcport || (isTestnet ? '11980' : '1980');
    rpcConfig.url = `http://${server}:${port}`;

    this.setState({ rpcConfig });
    this.loadMasternodeConf();
    // this.getMasternodeConf();
    // And setup the next masternode list
  }

  async loadMasternodeConf() {
    // Load the RPC config from zcash.conf file
    const MasternodeConfLocation = locateMasternodeConf();
    // eslint-disable-next-line no-unused-vars
    let confValues;
    try {
      confValues = ini.parse(await fs.promises.readFile(MasternodeConfLocation, { encoding: 'utf-8' }));
      if (Object.keys(confValues).length === 0) {
        throw new Error();
      }
      let mnfromfile = JSON.stringify(confValues);
      if (mnfromfile.indexOf(',') > -1) {
        mnfromfile = mnfromfile.split(',');
        mnfromfile[0] = mnfromfile[0].slice(2, -6);
        mnfromfile[mnfromfile.length - 1] = mnfromfile[1].slice(1, -7);
        const table = document.getElementById('mnfilelist');
        table.innerHTML = '';
        const wobble2 = document.createElement('div');
        wobble2.id = 'titlero';
        wobble2.className = [cstyles.tableheader, cstyles.well].join(' ');
        wobble2.innerHTML =
          '<span style="float:left,justify-content:center">Control Panel</span><span style="text-align: right">';
        table.appendChild(wobble2);
        const tablo = document.createElement('table');
        tablo.className = [cstyles.well].join(' ');
        tablo.style = 'width: 100%';
        tablo.id = 'tablo';
        table.appendChild(tablo);
        let tr = '';
        tr += `<thead><tr><th>Action</th><th>Alias</th><th>IP Address</th><th>Private Key</th><th>TX Hash</th><th>Output Index</th></tr></thead><tbody>`;
        mnfromfile.forEach(x => {
          const y = x.split(/[ ]+/);
          tr += `<tr>` + `<td style="width: 100%; padding: 5px;" id=${y[3]}>`;
          tr +=
            `</td>` +
            `<td>${y[0]}</td>` +
            `<td>${y[1]}</td>` +
            `<td><i class="fas fa-key" onclick="setClipboard('${y[2]}')" title="${y[2]}" /></td>` +
            `<td>${y[3]}</td>` +
            `<td>${y[4]}</td>`;
          tr += '</tr>';
          return y;
        });
        tablo.innerHTML += tr;
        const buttonspace = document.createElement('div');
        buttonspace.id = 'addbutton';
        buttonspace.className = cstyles.well;
        table.appendChild(buttonspace);
        const buttonspace2 = document.createElement('div');
        buttonspace2.id = 'addbutton2';
        buttonspace.className = cstyles.well;
        table.appendChild(buttonspace2);
        mnfromfile.forEach(x => {
          const y = x.split(/[ ]+/);
          const button = document.getElementById(y[3]);
          const Button = document.createElement('Button');
          // eslint-disable-next-line prefer-destructuring
          Button.id = y[0];
          Button.className = cstyles.primarybutton;
          Button.textContent = 'Start';
          Button.onclick = async () => {
            await this.getMasternodeStart(y[0]);
          };
          button.appendChild(Button);
          return y;
        });
        const button2 = document.getElementById('addbutton');
        const Button2 = document.createElement('Button');
        Button2.id = 'button1';
        Button2.className = cstyles.primarybutton;
        Button2.textContent = 'Add more';
        Button2.onclick = async () => {
          await this.ChangeConfig(1);
        };
        button2.appendChild(Button2);
        const button8 = document.getElementById('addbutton');
        const Button8 = document.createElement('Button');
        Button8.id = 'button8';
        Button8.className = cstyles.primarybutton;
        Button8.textContent = 'Clear File';
        Button8.onclick = async () => {
          await this.ClearConfig();
        };
        button8.appendChild(Button8);
      } else {
        mnfromfile = mnfromfile.slice(2, -7);
        const table = document.getElementById('mnfilelist');
        table.innerHTML = '';
        const wobble2 = document.createElement('div');
        wobble2.id = 'topper';
        wobble2.className = [cstyles.tableheader, cstyles.well].join(' ');
        wobble2.innerHTML = 'Control Panel';
        table.appendChild(wobble2);
        const tablo2 = document.createElement('table');
        tablo2.id = 'starter';
        tablo2.className = [cstyles.tableheader, cstyles.well].join(' ');
        table.appendChild(tablo2);
        let tr = '';
        const y = mnfromfile.split(/[ ]+/);
        tr += `<table><thead><tr><th>Action</th><th>Alias</th><th>IP Address</th><th>Private Key</th><th>TX Hash</th><th>Output Index</th></tr></thead><tbody>`;
        tr += `<tr>` + `<td id=${y[3]}>`;
        tr +=
          `</td>` +
          `<td>${y[0]}</td>` +
          `<td>${y[1]}</td>` +
          `<td><i class="fas fa-key" onclick="setClipboard('${y[2]}')" title="${y[2]}" /></td>` +
          `<td>${y[3]}</td>` +
          `<td>${y[4]}</td>`;
        tr += '</tr></tbody></table></div>';

        tablo2.innerHTML += tr;
        const buttonspace2 = document.createElement('div');
        buttonspace2.id = 'addbutton2';
        buttonspace2.className = cstyles.well;
        table.appendChild(buttonspace2);

        const button = document.getElementById(y[3]);
        const Button = document.createElement('Button');
        // eslint-disable-next-line prefer-destructuring
        Button.id = y[0];
        Button.className = cstyles.primarybutton;
        Button.textContent = 'Start';
        Button.onclick = async () => {
          await this.getMasternodeStart(y[0]);
        };
        button.appendChild(Button);
        const button3 = document.getElementById('addbutton2');
        const Button3 = document.createElement('Button');
        Button3.id = 'button2';
        Button3.className = cstyles.primarybutton;
        Button3.textContent = 'Add more';
        Button3.onclick = async () => {
          await this.ChangeConfig(1);
        };
        button3.appendChild(Button3);
        const button8 = document.getElementById('addbutton');
        const Button8 = document.createElement('Button');
        Button8.id = 'button8';
        Button8.className = cstyles.primarybutton;
        Button8.textContent = 'Clear File';
        Button8.onclick = async () => {
          await this.ClearConfig();
        };

        this.setupNextGetMasternodeConf();
      }
      this.setupNextGetMasternodeConf();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // console.log('Died at load conf need to append form value and reload');
      // eslint-disable-next-line global-require
      const button = document.getElementById('errorcatch');
      const div = document.createElement('div');
      div.className = `${[cstyles.xlarge, cstyles.padall, cstyles.center].join(' ')}`;
      div.innerHTML = 'Masternode Setup';
      div.style = 'margin-bottom: 24px';
      button.appendChild(div);
      const fill = document.createElement('div');
      fill.className = `${[cstyles.bright, cstyles.padbottomsmall].join(' ')}`;
      fill.innerHTML =
        'We were unable to parse your masternode.conf file because it either does not exist,<br />or becase it is empty. Please select how many you would like to proceed with setup:';
      button.appendChild(fill);
      let Button = document.createElement('Button');
      Button.id = 'one';
      Button.className = cstyles.primarybutton;
      Button.textContent = 'I have one to enter';
      Button.onclick = async () => {
        await this.ChangeConfig(null);
      };
      button.appendChild(Button);
      Button = document.createElement('Button');
      Button.id = 'two';
      Button.className = cstyles.primarybutton;
      Button.textContent = 'I have many to enter';
      Button.onclick = async () => {
        await this.ChangeConfig('1');
      };
      button.appendChild(Button);
    }
  }

  zcashd: ChildProcessWithoutNullStreams | null = null;

  async getStopDaemon() {
    const { rpcConfig } = this.state;

    // Try getting the info.
    try {
      const stopdaemon = await RPC.getStopDaemonObject(rpcConfig);
      console.log(stopdaemon);
    } catch (err) {
      console.log('Died in stop');
    }
  }

  async getMasternodeConf() {
    const { rpcConfig } = this.state;

    // Try getting the info.
    try {
      const masterlist = await RPC.getMasternodeConfObject(rpcConfig);
      const table = document.getElementById('mnconflist');
      table.innerHTML = '';
      let tr = '';
      const wobble = document.createElement('div');
      wobble.id = 'topper';
      wobble.className = [cstyles.well, cstyles.tableheader].join(' ');
      wobble.innerHTML = 'My Masternode Status';
      table.appendChild(wobble);
      const tablo = document.createElement('table');
      tablo.className = [cstyles.well].join(' ');
      tablo.style = 'width: 100%';
      tablo.id = 'tablo';
      table.appendChild(tablo);
      tr = '';
      tr += `
      <table className=${[cstyles.well].join(' ')} style="width: 100%">
      <thead>
      <tr>
        <th>Status</th>
        <th>Alias</th>
        <th>IP Address</th>
        <th>Private Key</th>
        <th>TX Hash</th>
        <th>Output Index</th>
      </tr>
    </thead>
    <tbody>`;
      masterlist.forEach(item => {
        tr +=
          '<tr>' +
          `<td style="padding: 5px">${item.status}</td>` +
          `<td>${item.alias}</td>` +
          `<td>${item.address}</td>` +
          `<td><i class="fas fa-key" onclick="setClipboard('${item.privateKey}')" title="${item.privateKey}" /></td>` +
          `<td>${item.txHash}</td>` +
          `<td>${item.outputIndex}</td>` +
          '</tr>';
      });
      masterlist.forEach(x => {
        const { alias } = x;
        if (document.getElementById(alias) == null) {
          const w = '1';
        } else if (x.status === 'ENABLED') {
          const button = document.getElementById(alias);
          button.disabled = true;
        } else {
          const w = '1';
        }
        tr += `</tbody></table>`;
        return x;
      });

      tablo.innerHTML += tr;
      return masterlist;
    } catch (err) {
      // Not yet finished loading. So update the state, and setup the next refresh
      console.log('Failure in getconf');
      // const inc = getMNListRetryCount + 1;
      // this.setState({ getMNListRetryCount: inc });
      // this.setupNextGetMasternodeConf();
    }
  }

  render() {
    const { loadingDone } = this.state;
    // If still loading, show the status

    if (!loadingDone) {
      return (
        <div id="master" className={cstyles.center} style={{ height: '650px', overflowY: 'scroll' }}>
          <div className={[cstyles.xlarge, cstyles.padall, cstyles.center].join(' ')}>Masternode Control</div>
          <div id="mnconflist" className={[cstyles.padall, cstyles.center].join(' ')} />
          <div
            id="mnfilelist"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
            className={[cstyles.padall, cstyles.center].join(' ')}
          />
          <div>
            <div id="errorcatch" className={[]} />
            <div id="mnchoice" className={[cstyles.padall, cstyles.center].join(' ')} />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(MasternodeScripts);
