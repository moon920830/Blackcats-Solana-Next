import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";

const ConfirmModal = ({ show, OkHandleModal, CancelHandleModal, title, content }) => (
    <Modal
        className="rn-popup-modal confirm-modal-wrapper"
        show={show}
        onHide={CancelHandleModal}
        centered
    >
        {show && (
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={CancelHandleModal}
            >
                <i className="feather-x" />
            </button>
        )}
        <Modal.Header className="m-0">
            <h5 className="modal-title">{title}</h5>
        </Modal.Header>
        <Modal.Body>
            <div className="confirm-form-box">
                <div className="bid-content text-center pb-4" dangerouslySetInnerHTML={{ __html: content }}>
                </div>
                <div className="bit-continue-button text-center">
                    <Button onClick={OkHandleModal}>
                        OK
                    </Button>
                    <Button
                        color="primary-alta"
                        className="ml--10"
                        onClick={CancelHandleModal}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

ConfirmModal.propTypes = {
    show: PropTypes.bool.isRequired,
    OkHandleModal: PropTypes.func.isRequired,
    CancelHandleModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};
export default ConfirmModal;
