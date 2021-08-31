/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
// @flow
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import styles from './Masternode.module.css';
import cstyles from './Common.module.css';
import MNList from './MNList';

const Masternode = () => {
  const [MNListData, setListData] = useState([]);
  useEffect(() => {
    axios
      .get('https://blocks.getbze.com/ext/masternodes')
      .then(res => {
        setListData(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className={cstyles.center} style={{ height: '650px', overflowY: 'scroll' }}>
        <div className={[cstyles.xlarge, cstyles.padall, cstyles.center].join(' ')}>Masternodes</div>
        <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <th>Status</th>
          <th>Version</th>
          <th>Address</th>
          <th>Last Seen</th>
          <th>TxID</th>
          <th>IP</th>
          <MNList data={MNListData} />
        </table>
      </div>
    </>
  );
};

export default Masternode;
