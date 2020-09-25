import React, { useState, useEffect } from 'react';

import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import wallet from '../../tools/ethWallet';
import Unlock from '../../views/Unlock';

import './Header.css';
import logo from './../../assets/images/icon.png';

function Header() {

    const { t, i18n } = useTranslation();

    const [modalOpen, setModalOpen] = useState(false);
    const [myAddress, setMyAddress] = useState('');

    const upDateAddress = async () => {

        const dateAddress = wallet.getDefaultAddress();
        if (dateAddress.code !== 0) {
            return;
        }

        const address = dateAddress.data.substr(0, 6) + '...' + dateAddress.data.substr(38, 4)
        setMyAddress(address);
    }

    const connectionDisconnected = async () => {
        setMyAddress('');
    }

    const showWallet = () => {
        setModalOpen(true);
    }

    const hideWallet = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateAddress);
        wallet.eventEmitter.on(wallet.eventConstant.connection_disconnected, connectionDisconnected);

        upDateAddress();

        return () => {
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateAddress);
            wallet.eventEmitter.removeListener(wallet.eventConstant.connection_disconnected, connectionDisconnected);
        }
    }, []);

    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
    };

    return (
        <div>
            <header className="header">
                <div className="logo-box">
                    <Link to="/">
                        <div className="logo"><img src={logo} alt="logo" /></div>
                    </Link>
                </div>

                <ul className="nav">
                    <li className="nav-item">
                        <NavLink exact to="/">{t('header.home')}</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink exact to="/menu">{t('header.park')}</NavLink>
                    </li>

                </ul>

                <div className="header-right">
                    <div className="vollet-btn btn" onClick={showWallet}>{
                        myAddress === '' ? t('header.wallet') : myAddress
                    }</div>

                    <div className="lan-choose">
                        <div className="lan-text">{t('header.lan')}</div>
                        <div className="lan-en" onClick={() => changeLanguage('en')}> </div>
                        <div className="lan-cn" onClick={() => changeLanguage('zh')}> </div>
                    </div>
                </div>

            </header>

            <ul className="nav-mob">
                <li className="nav-item">
                    <NavLink exact to="/">{t('header.home')}</NavLink>
                </li>

                <li className="nav-item">
                    <NavLink exact to="/menu">{t('header.park')}</NavLink>
                </li>

            </ul>

            <Unlock modalOpen={modalOpen} closeModal={hideWallet} />
        </div>
    );
}

export default Header;