import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';

export default function PwaReloadPopup({onReload}) {
  return (
    <div className={clsx('alert', 'alert--secondary', styles.popup)}>
      <p>
        <Translate
          id="theme.PwaReloadPopup.info"
          description="The text for the popup shown when a new version is available">
          New version available
        </Translate>
      </p>
      <div className={styles.buttonContainer}>
        <button
          className="button button--primary"
          type="button"
          onClick={onReload}>
          <Translate
            id="theme.PwaReloadPopup.refreshButtonText"
            description="The text for the refresh button">
            Refresh
          </Translate>
        </button>
      </div>
    </div>
  );
}
