import { FC } from 'react';
import { GradientButton } from '../../gradient-button/gradient-button.component';

import './modal-screen-loading.styles.scss';
import { LoadingSpinnerRing } from '../../loading-spinner-ring/loading-spinner-ring.component';

interface IProps {
  title?: string;
  onCancel?: () => unknown;
}

export const ModalScreenLoading: FC<IProps> = (props) => {
  const { title = 'Loading', onCancel } = props;
  const handleCancel = () => onCancel?.();
  return (
    <div className="modal-loading">
      <LoadingSpinnerRing className="modal-loading__spinner" />
      <p className="modal-loading__title">{title}</p>
      <p className="modal-loading__subtitle">Setting up your transaction</p>
      <GradientButton className="modal-loading__cancel" variant="contained" onClick={handleCancel}>
        Cancel
      </GradientButton>
    </div>
  );
};
