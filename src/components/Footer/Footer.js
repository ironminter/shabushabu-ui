import React from 'react';
import './Footer.css'
function Footer() {
    return (
        <div className='footer'>
            <div className='footer-box'>
                <a href='https://t.me/shabushabufinance' target='new_tab'>
                  <img className='external-logo' src={require('../../assets/images/telegram.svg')} />
                </a>
                <a href='https://mobile.twitter.com/shabufinance' target='new_tab'>
                  <img className='external-logo' src={require('../../assets/images/twitter.svg')} />
                </a>
                <a href='https://medium.com/@shabushabu' target='new_tab'>
                  <img className='external-logo' src={require('../../assets/images/medium.svg')} />
                </a>
                <a href='https://github.com/ironminter/shabushabu' target='new_tab'>
                  <img className='external-logo' src={require('../../assets/images/github.png')} />
                </a>
            </div>
        </div>
    );
}

export default Footer;
