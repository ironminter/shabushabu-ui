import React from 'react';
import './Slogan.css';

import { useTranslation } from 'react-i18next';

function Slogan() {

    const { t } = useTranslation();

    return (
        <div className="slogan">
            <div className="text-logo">
                <div className="text-logo-text1">lt's Shabu Shabu time!</div>
                {/* <div className="text-logo-text2">.site</div> */}
            </div>
            {/* <div className="slogan-title">{t('park.earn')}<span className="slogan-title-name">&nbsp;nebula&nbsp;</span>{t('park.token')}</div> */}
        </div>
    );
}

export default Slogan;