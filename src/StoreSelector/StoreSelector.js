import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StoreList from '../StoreList';
import LocationField from '../LocationField';
import LocationButton from '../LocationButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Zoom from '@material-ui/core/Zoom';

import * as sltStoresApi from '../services/slt-stores';

const style = (theme) => {
	return {
		display: {
			display: 'inline-block',
			border: `1px solid ${theme.palette.grey[400]}`,
			borderRadius: 0,
			padding: '5px 8px',
			background: `${theme.palette.grey[100]}`
		},
		button: {
			borderRadius: 0,
			minHeight: theme.typography.pxToRem(theme.typography.fontSize),
			lineHeight: theme.typography.pxToRem(theme.typography.fontSize),
			boxShadow: theme.shadows[0],
			'&:active': {
				boxShadow: theme.shadows[0]
			}
		},
		fab: {
			position: 'absolute',
			bottom: `calc(100% + ${theme.spacing.unit * 2}px)`,
			right: theme.spacing.unit * 2
		}
	};
};

class StoreSelector extends React.Component {
	constructor() {
		super();
		this.state = {
			open: false,
			showMore: 1,
			scrollTop: 0
		};
		this.animateScrollRequest = null;
		this.handleShowMore = this.handleShowMore.bind(this);
		this.handleGoToTop = this.handleGoToTop.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.currentScrollElement = null;
	}
	handleShowMore(e) {
		this.setState({
			showMore: this.state.showMore + 1
		});
	}
	toggleOpen() {
		this.setState({ open: !this.state.open, showMore: 1 });
	}
	handleScroll(e) {
		this.currentScrollElement = e.target;
		const { scrollTop } = e.target;
		if (this.animateScrollRequest && scrollTop < 2) {
			global.cancelAnimationFrame(this.animateScrollRequest);
			e.target.scrollTop = 0;
		}
		this.setState({ scrollTop });
	}
	handleGoToTop() {
		const animate = () => {
			this.currentScrollElement.scrollTop += (0 - this.currentScrollElement.scrollTop) * 0.3;
			this.animateScrollRequest = global.requestAnimationFrame(animate);
		};
		animate();
	}
	render() {
		let { open, showMore, scrollTop } = this.state;
		let { selectedStore, classes } = this.props;

		const dialog = (
			<Dialog
				fullWidth
				maxWidth={'sm'}
				open={open}
				onClose={this.toggleOpen}
				onScroll={this.handleScroll}
			>
				<DialogTitle>Find A Location Near You</DialogTitle>

				<DialogContent>
					<LocationButton>Use My Location</LocationButton>
					<div>
						<LocationField />
					</div>

					<StoreList
						sortBy={'distance'}
						limit={10 * showMore}
						detailed={false}
						onItemSelected={this.toggleOpen}
					/>
					<Button
						fullWidth
						onClick={this.handleShowMore}
					>
						Show More
					</Button>
				</DialogContent>
				<DialogActions>
					<div style={{ position: 'relative' }}>
						<Button
							onClick={this.toggleOpen}
							color="primary"
						>
							Close
						</Button>
						<Zoom
							in={showMore > 1 && scrollTop > 600}
							unmountOnExit
						>
							<Button
								variant="fab"
								className={classes.fab}
								color="primary"
								onClick={this.handleGoToTop}
							>
								<ArrowUpwardIcon />
							</Button>
						</Zoom>
					</div>
				</DialogActions>
			</Dialog>
		);

		let display;

		if (selectedStore == null) {
			display = (
				<Paper
					elevation={0}
					className={classes.display}
				>
					<Typography>No location selected</Typography>
					<Button
						onClick={this.toggleOpen}
						className={classes.button}
					>
						Select Location
					</Button>
				</Paper>
			);
		} else {
			const location = selectedStore.location;
			display = (
				<Paper
					elevation={0}
					className={classes.display}
				>
					<Typography>Class Location:</Typography>
					<Typography>
						<strong>
							{location.address1}
							<br />
							{location.city}
							{', '}
							{location.state} {location.zip}
						</strong>
					</Typography>
					<Button
						onClick={this.toggleOpen}
						className={classes.button}
					>
						Change Location
					</Button>
				</Paper>
			);
		}

		return (
			<div>
				{display}
				{dialog}
			</div>
		);
	}
}

StoreSelector.propTypes = {
	selectedStore: PropTypes.object
};
StoreSelector.defaultProps = {};

const mapStateToProps = (state, props) => {
	return {
		...props,
		selectedStore: sltStoresApi.selectors.getSelectedItemObject(state)
	};
};

export default connect(mapStateToProps)(withStyles(style)(StoreSelector));
