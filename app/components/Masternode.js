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

class MasternodeState {
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

class Masternode extends Component<Props, MasternodeState> {
  constructor(props: Props) {
    super(props);

    this.state = new MasternodeState();
  }

  componentDidMount() {
    (async () => {
      await this.loadZcashConf(true);
    })();
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

    // And setup the next masternode list
    this.setupNextGetMNList();
    this.setupNextGetMasternodeConf();
  }

  zcashd: ChildProcessWithoutNullStreams | null = null;

  setupNextGetMNList() {
    setTimeout(() => this.getMNList(), 1000);
  }

  setupNextGetMasternodeConf() {
    setTimeout(() => this.getMasternodeConf(), 1000);
  }

  async getMNList() {
    const { rpcConfig, getMNListRetryCount } = this.state;

    // Try getting the info.
    try {
      const mnlist = await RPC.getMNListObject(rpcConfig);
      // eslint-disable-next-line func-names
      // eslint-disable-next-line global-require
      const dateFormat = require('dateformat');
      const table = document.getElementById('datas');
      table.innerHTML = '';
      let tr = '';
      mnlist.forEach(x => {
        tr += '<tr>';
        // eslint-disable-next-line no-constant-condition
        if (x.status === 'ENABLED') {
          tr +=
            // `<td>${x.rank}</td>` +
            `<td style="color: green">${x.status}</td>` +
            `<td>${x.version}</td>` +
            `<td>${x.addr}</td>` +
            `<td>${dateFormat(Date(x.lastseen), 'dd/mm/yy h:MM:ss TT')}</td>` +
            `<td><i class="fas fa-project-diagram" onclick="setClipboard('${x.txhash}')" title=${x.txhash} /></td>` +
            `<td>${x.ip}</td>`;
        } else {
          tr +=
            `<td>${x.rank}</td>` +
            `<td style="color: red">${x.status}</td>` +
            `<td>${x.version}</td>` +
            `<td>${x.addr}</td>` +
            `<td>${dateFormat(Date(x.lastseen), 'YYYY')}</td>` +
            `<td><i class="fas fa-project-diagram" title=${x.txhash} /></td>` +
            `<td>${x.ip}</td>`;
        }
        tr += '</tr>';
      });
      table.innerHTML += tr;
    } catch (err) {
      // Not yet finished loading. So update the state, and setup the next refresh
      console.log("It's the Borg, Captain.");
      const inc = getMNListRetryCount + 1;
      this.setState({ getMNListRetryCount: inc });
      this.setupNextGetMNList();
    }
  }

  async getMasternodeConf() {
    const { rpcConfig, getMNListRetryCount } = this.state;

    // Try getting the info.
    try {
      const masterlist = await RPC.getMasternodeConfObject(rpcConfig);
      const table = document.getElementById('mnconflist');
      table.innerHTML = '';
      let tr = '';
      masterlist.forEach(item => {
        tr +=
          '<tr>' +
          `<td>${item.status}</td>` +
          `<td>${item.alias}</td>` +
          `<td>${item.address}</td>` +
          `<td><i class="fas fa-key" onclick="setClipboard('${item.privateKey}')" title="${item.privateKey}" /></td>` +
          `<td><i class="fas fa-key" onclick="setClipboard('${item.txHash}')" title="${item.txHash}" /></td>` +
          `<td>${item.outputIndex}</td>` +
          '</tr>';
      });
      table.innerHTML += tr;
    } catch (err) {
      // Not yet finished loading. So update the state, and setup the next refresh
      console.log("It's the Klingons, Captain.");
      const inc = getMNListRetryCount + 1;
      this.setState({ getMNListRetryCount: inc });
      this.setupNextGetMNList();
    }
  }

  render() {
    const { loadingDone } = this.state;

    // If still loading, show the status
    if (!loadingDone) {
      return (
        <div className={cstyles.center} style={{ height: '650px', overflowY: 'scroll' }}>
          <div className={[cstyles.large, cstyles.padall, cstyles.center].join(' ')}>My Masternodes</div>
          <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
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
            <tbody id="mnconflist" />
          </table>
          <hr />
          <div className={[cstyles.large, cstyles.padall, cstyles.center].join(' ')}>All Masternodes</div>
          <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Version</th>
                <th>T Address</th>
                <th>Last Seen</th>
                <th>TXid</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody id="datas" />
          </table>
        </div>
      );
    }
  }
}

export default withRouter(Masternode);
