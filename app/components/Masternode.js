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
// eslint-disable-next-line no-unused-vars
import styles from './Masternode.module.css';

const locateZcashConf = () => {
  if (os.platform() === 'darwin') {
    return path.join(remote.app.getPath('appData'), 'Bzedge', 'bzedge.conf');
  }

  if (os.platform() === 'linux') {
    return path.join(remote.app.getPath('home'), '.bzedge', 'bzedge.conf');
  }

  return path.join(remote.app.getPath('appData'), 'Bzedge', 'bzedge.conf');
};

class MasternodeScreenState {
  loadingDone: boolean;

  rpcConfig: RPCConfig | null;

  getMNListRetryCount: number;

  constructor() {
    this.currentStatus = 'Loading...';
    this.loadingDone = false;
    this.getMNListRetryCount = 0;
    this.rpcConfig = null;
    this.mnlist = null;
  }
}

class MasternodeScreen extends Component<Props, MasternodeScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = new MasternodeScreenState();
  }

  componentDidMount() {
    (async () => {
      await this.loadZcashConf(true);
    })();
  }

  async loadZcashConf(createIfMissing: boolean) {
    // Load the RPC config from zcash.conf file
    const zcashLocation = locateZcashConf();
    let confValues;
    try {
      confValues = ini.parse(await fs.promises.readFile(zcashLocation, { encoding: 'utf-8' }));
    } catch (err) {
      if (createIfMissing) {
        console.log('Configuration file missing or unreadable');
        return;
      }

      console.log('There is a problem finding or using your configuration file');
      return;
    }

    // Get the username and password
    const rpcConfig = new RPCConfig();
    rpcConfig.username = confValues.rpcuser;
    rpcConfig.password = confValues.rpcpassword;

    if (!rpcConfig.username || !rpcConfig.password) {
      this.setState({});
      return;
    }

    const isTestnet = (confValues.testnet && confValues.testnet === '1') || false;
    const server = confValues.rpcbind || '127.0.0.1';
    const port = confValues.rpcport || (isTestnet ? '11980' : '1980');
    rpcConfig.url = `http://${server}:${port}`;

    this.setState({ rpcConfig });
    // And setup the next masternode list
    this.setupNextGetMNList();
  }

  zcashd: ChildProcessWithoutNullStreams | null = null;

  setupNextGetMNList() {
    setTimeout(() => this.getMNList(), 1000);
  }

  async getMNList() {
    const { rpcConfig, getMNListRetryCount } = this.state;

    // Try getting the info.
    try {
      const mnlist = await RPC.getMNListObject(rpcConfig);
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
            `<td><i class="fas fa-project-diagram" title=${x.txhash} /></td>` +
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

  render() {
    const { loadingDone } = this.state;

    // If still loading, show the status
    if (!loadingDone) {
      return (
        <div className={cstyles.center} style={{ height: '650px', overflowY: 'scroll' }}>
          <div className={[cstyles.xlarge, cstyles.padall, cstyles.center].join(' ')}>Masternodes</div>
          <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Version</th>
                <th>Address</th>
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

export default withRouter(MasternodeScreen);
