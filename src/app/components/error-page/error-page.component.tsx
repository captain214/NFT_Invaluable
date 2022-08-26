import React from 'react';

import './error-page.styles.css';
import './error-page.styles.layout.css';

import MuiAlert, { Color } from '@material-ui/lab/Alert';

type ErrorProps = {
  errorMsg: string;
  severity: Color;
};

export const ErrorPage: React.FunctionComponent<ErrorProps> = ({ errorMsg, severity }) => {
  return (
    <div className="error-page">
      <section className="error-page">
        <MuiAlert elevation={6} variant="filled" severity={severity}>
          Error loading collection: {errorMsg}
        </MuiAlert>
      </section>
    </div>
  );
};

export function isErrorType(error: unknown): error is Error {
  return error instanceof Error;
}
