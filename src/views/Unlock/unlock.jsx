import React, { useState, useEffect } from "react";

import { Typography, Button, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

import { Web3ReactProvider, useWeb3React, } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import ethWallet from '../../tools/ethWallet';

const useStyles = makeStyles({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex',
    position: 'relative'
  },
  contentContainer: {
    margin: 'auto',
    textAlign: 'center',
    padding: '12px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  unlockCard: {
    padding: '24px'
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    padding: '15px',
  },
  connect: {
    width: '100%'
  },
  closeIcon: {
    position: 'absolute',
    right: '0px',
    top: '0px',
    cursor: 'pointer'
  }
});

export default function Unlock(props) {

  const [error, setError] = useState(null);
  const [metamaskLoading, setMetamaskLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  const classes = useStyles();
  const { closeModal } = props;
  const { t } = useTranslation();

  const occurError = (err) => {
    setLedgerLoading(false);
    setError(err);
    setMetamaskLoading(false);
  };

  const connectionConnected = () => {
    if (props.closeModal != null) {
      props.closeModal()
    }
  }

  const connectionDisconnected = () => {
    if (props.closeModal != null) {
      props.closeModal()
    }
  }

  const metamaskUnlocked = () => {
    setMetamaskLoading(false);
    if (props.closeModal != null) {
      props.closeModal()
    }
  }

  const ledgerUnlocked = () => {
    setLedgerLoading(false);
    if (props.closeModal != null) {
      props.closeModal()
    }
  }

  const cancelLedger = () => {
    setLedgerLoading(false);
  }

  const cancelMetamask = () => {
    setMetamaskLoading(false);
  }

  useEffect(() => {
    ethWallet.eventEmitter.on(ethWallet.eventConstant.wallet_connection, connectionConnected);
    ethWallet.eventEmitter.on(ethWallet.eventConstant.connection_disconnected, connectionDisconnected);
    ethWallet.eventEmitter.on(ethWallet.eventConstant.ERROR, occurError);

    return () => {
      ethWallet.eventEmitter.removeListener(ethWallet.eventConstant.wallet_connection, connectionConnected);
      ethWallet.eventEmitter.removeListener(ethWallet.eventConstant.connection_disconnected, connectionDisconnected);
      ethWallet.eventEmitter.removeListener(ethWallet.eventConstant.ERROR, occurError);
    }

  }, []);

  console.log('ethWallet.eventEmitter.removeListen',classes);

  return (
    <div className={classes.root}>
      <div className={classes.closeIcon} onClick={closeModal}><CloseIcon /></div>
      <div className={classes.contentContainer}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MyComponent closeModal={closeModal} t={t} />
        </Web3ReactProvider>
      </div>
    </div>
  )
}

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function onConnectionClicked(currentConnector, name, setActivatingConnector, activate) {
  const connectorsByName = ethWallet.store.connectorsByName;
  setActivatingConnector(currentConnector);
  activate(connectorsByName[name]);
}

function onDeactivateClicked(deactivate, connector) {
  if (deactivate) {
    deactivate()
  }
  if (connector && connector.close) {
    connector.close()
  }

  ethWallet.store.account = {};
  ethWallet.store.web3context = null;
  ethWallet.eventEmitter.emit(ethWallet.eventConstant.connection_disconnected)
}

function MyComponent(props) {

  const context = useWeb3React();

  const localContext = ethWallet.store.web3context;

  var localConnector = null;
  if (localContext) {
    localConnector = localContext.connector
  }

  const {
    connector,
    library,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;

  var connectorsByName = ethWallet.store.connectorsByName;

  const { closeModal, t } = props

  const [activatingConnector, setActivatingConnector] = React.useState();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  React.useEffect(() => {
    if (account && active && library) {
      ethWallet.store.account = { address: account };
      ethWallet.store.web3context = context;
      ethWallet.eventEmitter.emit(ethWallet.eventConstant.wallet_connection)
    }
  }, [account, active, closeModal, context, library]);

  const width = window.innerWidth

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: (width > 650 ? 'space-between' : 'center'), alignItems: 'center' }}>
      {Object.keys(connectorsByName).map(name => {
        const currentConnector = connectorsByName[name];
        const activating = currentConnector === activatingConnector;
        const connected = (currentConnector === connector || currentConnector === localConnector);
        const disabled =
          !!activatingConnector || !!error;

        var url;
        var display = name;
        if (name === 'MetaMask') {
          url = require('../../assets/icn-metamask.svg')
        } else if (name === 'WalletConnect') {
          url = require('../../assets/walletConnectIcon.svg')
        }

        return (
          <div key={name} style={{ padding: '12px 0px', display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E1E1E1',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '250px'
            }}
              variant='outlined'
              color='primary'
              onClick={() => {
                onConnectionClicked(currentConnector, name, setActivatingConnector, activate)
              }}
              disabled={disabled}>
              <Typography style={{
                margin: '0px 12px',
                color: 'rgb(1, 1, 1)',
                fontWeight: 500,
                fontSize: '1rem',
              }}
                variant={'h3'}>
                {display}
              </Typography>

              {(!activating && !connected) && <img style={
                {
                  position: 'absolute',
                  right: '20px',

                  width: '30px',
                  height: '30px'
                }
              } src={url} alt="" />}
              {activating && <CircularProgress size={15} style={{ marginRight: '10px' }} />}
              {(!activating && connected) && <div style={{ background: '#4caf50', borderRadius: '10px', width: '10px', height: '10px', marginRight: '10px' }}></div>}
            </Button>
          </div>
        )
      })}

      <div style={{ width: '252px', margin: '12px 0px' }}>
        <Button style={{
          padding: '12px',
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #E1E1E1',
          fontWeight: 500,
          minWidth: '250px'
        }}
          variant='outlined'
          color='primary'
          onClick={() => { onDeactivateClicked(deactivate, connector); }}>
          <Typography style={{
            marginLeft: '12px',
            fontWeight: '700',
            color: '#DC6BE5'
          }}
            variant={'h5'}
            color='primary'>
            {t('Unlock.Deactivate')}
          </Typography>
        </Button>
      </div>
    </div>
  )
}
