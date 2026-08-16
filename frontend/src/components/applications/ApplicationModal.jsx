import React from 'react';
import Modal from '../common/Modal';
import ApplicationForm from './ApplicationForm';

export const ApplicationModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const isEditing = Boolean(initialData?.id);
  const title = isEditing ? 'Edit Job Application' : 'Add New Application';

  const handleSuccess = () => {
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ApplicationForm
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default ApplicationModal;
