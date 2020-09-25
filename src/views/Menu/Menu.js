import React, { useState, useEffect } from 'react';
import './Menu.css';

import { useTranslation } from 'react-i18next';
import conf from '../../tools/conf';

import Slogan from '../../components/Slogan/Slogan';
import ListItem from '../../components/ListItem/ListItem';

import cTime from '../../config/cTime.json';

function Menu() {
    const { t } = useTranslation();

    const [now, setNow] = useState(Date.parse(new Date()));

    useEffect(() => {

        function clock() {
            setNow(Date.parse(new Date()));
        }

        const timer = setInterval(clock, 1000);

        return () => {
            clearInterval(timer);
        }
    }, []);

    return (
        <div className="menu">

            <Slogan />

            <div className="menu-addr">
                {/* <div>{t('park.address')}: </div> */}
                {/* <a target="new_tab" href={"https://tronscan.org/#/token20/" + conf.bonusInfos.pool1}>{conf.bonusInfos.pool1}</a> */}
            </div>

            <div className="tokens-list">
                <ListItem cTime={cTime.usdt} title="ETH/USDT" now={now} poolName='pool1' />
                <ListItem cTime={cTime.tiger} title="KOBE/ETH" now={now} poolName='pool2' />
                <ListItem cTime={cTime.jst} title="KOBE/USDT" now={now} poolName='pool3' />
                <ListItem cTime={cTime.usdj} title="KOBE/AMPL" now={now} poolName='pool4' />
            </div>
        </div>
    );
}

export default Menu;