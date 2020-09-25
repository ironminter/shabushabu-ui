import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Slogan from '../../components/Slogan/Slogan';

import { formatDecimalDigits } from '../../tools';

import wallet from '../../tools/ethWallet';

import './Home.css';
import conf from '../../tools/conf';

import Obtain from '../../components/Obtain/Obtain';
import DEARKaws from '../../assets/images/nht-1.svg';
import DEARAppleFace from '../../assets/images/nht-2.svg';
import DEARGirlimg from '../../assets/images/nht-3.svg';
import DEARAilen from '../../assets/images/nht-4.svg';

function Home() {

    const { t } = useTranslation();

    // poo1
    const [myUSDTNum, setMyUSDTNum] = useState(0);
    const [totalUSDTNum, setTotalUSDTNum] = useState(0);

    // poo2
    const [myBTFNum, setMyBTFum] = useState(0);
    const [totalBTFNum, setTotalBTFNum] = useState(0);

    // poo3
    const [myNBLNum, setMyNBLNum] = useState(0);
    const [totalNBLNum, setTotalNBLNum] = useState(0);

    // poo4
    const [myBETNum, setMyBETNum] = useState(0);
    const [totalBETNum, setTotalBETNum] = useState(0);


    const upDateNum = async () => {

        if (wallet.getDefaultAddress().code !== 0) {
            return;
        }

        const [
            resUSDTNum,
            resBTFNum,
            resNBLNum,
            resBETNum,
            resTotalUSDTNum,
            resTotalBTFNum,
            resTotalNBLNum,
            resTotalBETNum,
        ] = await Promise.all([
            wallet.getBalance(conf.poolInfos.pool1, wallet.getDefaultAddress().data, conf.marginInfos.pool1.decimals),
            wallet.getBalance(conf.poolInfos.pool2, wallet.getDefaultAddress().data, conf.marginInfos.pool2.decimals),
            wallet.getBalance(conf.poolInfos.pool3, wallet.getDefaultAddress().data),
            wallet.getBalance(conf.poolInfos.pool4, wallet.getDefaultAddress().data),

            wallet.getTotalSupply(conf.poolInfos.pool1, conf.marginInfos.pool1.decimals),
            wallet.getTotalSupply(conf.poolInfos.pool2,conf.marginInfos.pool2.decimals),
            wallet.getTotalSupply(conf.poolInfos.pool3),
            wallet.getTotalSupply(conf.poolInfos.pool4),
        ]);

        setMyUSDTNum(formatDecimalDigits(resUSDTNum.data));
        setTotalUSDTNum(formatDecimalDigits(resTotalUSDTNum.data));

        setMyBTFum(formatDecimalDigits(resBTFNum.data));
        setTotalBTFNum(formatDecimalDigits(resTotalBTFNum.data));

        setMyNBLNum(formatDecimalDigits(resNBLNum.data));
        setTotalNBLNum(formatDecimalDigits(resTotalNBLNum.data));

        setMyBETNum(formatDecimalDigits(resBETNum.data));
        setTotalBETNum(formatDecimalDigits(resTotalBETNum.data));

    }

    // 钱包断开
    const onWalletConnectionDisconnected = () => {
        setMyUSDTNum(0);
        setTotalUSDTNum(0);

        setMyBTFum(0);
        setTotalBTFNum(0);

        setMyNBLNum(0);
        setTotalNBLNum(0);

        setMyBETNum(0);
        setTotalBETNum(0);
    }

    useEffect(() => {
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateNum);
        wallet.eventEmitter.on(wallet.eventConstant.connection_disconnected, onWalletConnectionDisconnected);

        upDateNum();

        return () => {
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateNum);
            wallet.eventEmitter.removeListener(wallet.eventConstant.connection_disconnected, onWalletConnectionDisconnected);
        }
    }, []);

    return (
        <div className="home">
            <Slogan />
            <div className="tokenStakeItem-div">
                <Obtain icon={DEARKaws} statistics={t('home.statistical')} myStake={myUSDTNum} Pledge={t('home.Pledge')} subStake={totalUSDTNum} Totalpledge={t('home.Totalpledge')} />
                <Obtain icon={DEARAppleFace} statistics={t('home.statistical2')} myStake={myBTFNum} Pledge={t('home.Pledge')} subStake={totalBTFNum} Totalpledge={t('home.Totalpledge')} />
                <Obtain icon={DEARGirlimg} statistics={t('home.statistical3')} myStake={myNBLNum} Pledge={t('home.Pledge')} subStake={totalNBLNum} Totalpledge={t('home.Totalpledge')} />
                <Obtain icon={DEARAilen} statistics={t('home.statistical4')} myStake={myBETNum} Pledge={t('home.Pledge')} subStake={totalBETNum} Totalpledge={t('home.Totalpledge')} />
            </div>
            <Link to="/menu">
                <div className="goto-menu-btn btn">{t('home.see')}</div>
            </Link>
        </div>
    );
}

export default Home;