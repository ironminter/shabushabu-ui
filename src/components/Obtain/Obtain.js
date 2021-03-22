import React from 'react';
import { useTranslation } from 'react-i18next';

import './Obtain.css';

function Obtain(props) {

  const { t } = useTranslation();

  const { myStake, subStake } = props;

  const percentage = (Math.floor(myStake / subStake * 10000) / 10000) * 100;

  return (
    <div className="tokenStakeItem">
      <div className="tokenStakeInfo">
        <div className="title">
          <span><img src={props.icon} /></span>
          {props.statistics}
        </div>
        <div className="myStake">{myStake || "0"}</div>
        <div className="subTitle">{props.Pledge}</div>
        <div className="myStake">
          <span>{subStake || "0"}</span>
          <span>{percentage || "00"} %</span>
        </div>
        <div className="subTitle">{props.Totalpledge}</div>
      </div>
    </div>
  );
}

export default Obtain;