import React from 'react';

// eslint-disable-next-line react/prop-types
const MNList = ({ data }) => {
  return (
    <>
      {data &&
        // eslint-disable-next-line react/prop-types
        data.map(d => {
          return (
            <tr key={d.rank}>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                {d.status}
              </td>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                {d.version}
              </td>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                {d.addr}
              </td>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                {d.lastseen}
              </td>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                <i className="fas fa-project-diagram" title={d.txhash} />
              </td>
              <td
                style={{
                  textalign: 'center'
                }}
              >
                {d.ip}
              </td>
            </tr>
          );
        })}
    </>
  );
};

export default MNList;
