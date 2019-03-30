import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Alert} from 'reactstrap';

const AppNotifications = ({error}) => (
    <Alert isOpen={!!error} className="mt-lg-n5">
        <div align="center">Service Unavailable, please refresh in a few minutes</div>
    </Alert>);

AppNotifications.propTypes = {
    error: PropTypes.object
};

const mapStateToProps = ({notifications: {unhandled: {error}}}) => ({
    error
});

export default connect(mapStateToProps, null)(AppNotifications);