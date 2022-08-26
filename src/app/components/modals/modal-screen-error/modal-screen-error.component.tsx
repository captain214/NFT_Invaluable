import { FC } from 'react';
import { GradientButton } from '../../gradient-button/gradient-button.component';

import './modal-screen-error.styles.scss';

interface IProps {
  onClose?: () => unknown;
}

export const ModalScreenError: FC<IProps> = (props) => {
  const { onClose } = props;
  const handleClose = () => onClose?.();

  return (
    <div className="modal-error">
      <p className="modal-error__title">Oops! Looks like something went wrong!</p>
      <p className="modal-error__subtitle">Please, try again</p>
      <GradientButton className="modal-error__btn" variant="contained" onClick={handleClose}>
        Close
      </GradientButton>
    </div>
  );
};
