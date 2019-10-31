const React = require('react');
const PropTypes = require('prop-types');
const { ModalsContainerProvider } = require('../ModalsContainerContext');

const Route = ({ children }) => {
    return (
        <div className={'route-container'}>
            <ModalsContainerProvider>
                <div className={'route-content'}>
                    {children}
                </div>
            </ModalsContainerProvider>
        </div>
    );
};

Route.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Route;
