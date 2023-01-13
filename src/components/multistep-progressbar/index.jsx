/* eslint-disable indent */
import { ProgressBar, Step } from "react-step-progress-bar";
import PropTypes from "prop-types";

import "react-step-progress-bar/styles.css";

const MultiStepProgressBar = ({ stepCount }) => {
    const stepPercentage = 100 / stepCount;
    return (
        <ProgressBar parent={stepPercentage}>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${accomplished ? "accomplished" : null
                            }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${accomplished ? "accomplished" : null
                            }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
        </ProgressBar>
    );
};

MultiStepProgressBar.propTypes = {
    stepCount: PropTypes.number,
};

export default MultiStepProgressBar;
