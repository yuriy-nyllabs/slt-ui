import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { actions, selectors } from '../services/slt-class-times';

const panelStyles = () => ({
	root: {
		boxShadow: 'none',
		borderBottom: '1px solid #d2d2d2',
		backgroundColor: 'transparent',
		'&::before': {
			backgroundColor: 'transparent'
		}
	}
});

const Transition = (props) => <Slide
	direction="up"
	{...props}
/>;

const theme = createMuiTheme({});

const StyledExpansionPanel = withStyles(panelStyles)((props) => (
	<ExpansionPanel {...props}>{props.children}</ExpansionPanel>
));

const nowDate = new Date(Date.now());
const locale = 'en-us';
const monthOnly = {
	month: 'long'
};

const currentMonth = {
	long: nowDate.toLocaleString(locale, monthOnly),
	numeric: nowDate.getMonth()
};

const shootMeSomeFutureMonth = (howManyAhead) => ({
	long: new Date(nowDate.getFullYear(), nowDate.getMonth() + howManyAhead).toLocaleString(
		locale,
		monthOnly
	),
	numeric: nowDate.getMonth() + howManyAhead
});

const giveMeTheClassTimeNicely = (classData) => `
	${new Date(classData.classStartDate).toLocaleString(locale, {
		weekday: 'short',
		month: 'numeric',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})} - ${new Date(classData.classStopDate).toLocaleString(locale, {
	hour: 'numeric',
	minute: 'numeric'
})}`;

const nextMonth = shootMeSomeFutureMonth(1);
const doubleNextMonth = shootMeSomeFutureMonth(2);

class ClassDateTimePicker extends React.Component {
	state = {
		expanded: null,
		open: false
	};
	constructor() {
		super();
		if (global?.history?.state?.type === 'OPEN_DATE_TIME_PICKER') {
			// We hydrate with the old state.
			global.history.replaceState(null, 'ClassDateTimePicker');
		}
		global.addEventListener('popstate', (event) => {
			const state = event.state;

			if (state == null) {
				// Close dialog:
				this.setState({ open: false });
			} else if (state.type === 'OPEN_DATE_TIME_PICKER' && !this.state.open) {
				this.setState({ open: true });
				global.history.replaceState(state, 'ClassDateTimePicker');
			}
		});
	}
	componentDidMount() {
		this.setState({
			culinaryClassName: document.querySelector('h1.name')?.textContent || 'class'
		});
	}
	handleChange = (panel) => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false
		});
	};

	handleClickOpen() {
		if (global?.history) {
			global.history.pushState(
				{
					type: 'OPEN_DATE_TIME_PICKER',
					selection: this.props.selection
				},
				'ClassDateTimePicker'
			);
		}
		this.setState({
			open: true
		});
	}

	handleClose() {
		if (global?.history) {
			global.history.replaceState(null, 'ClassDateTimePicker');
		}
		this.setState({ open: false });
	}
	onEnter() {
		this.props.dispatch(actions.fetchClassTimes());
	}
	returnMonthData(month) {
		return this?.props?.classTimeData?.[month.numeric] ? (
			<RadioGroup
				aria-label="Classes"
				name="classes"
				className=""
				value={this.state.sku}
			>
				{this.props.classTimeData[month.numeric].map((culinaryClass, index) => (
					<FormControlLabel
						key={`${index}_${Date.now()}`}
						value={culinaryClass.sku}
						control={
							<Radio
								style={{
									color: '#333333'
								}}
								onChange={() => {
									this.setState({ sku: culinaryClass.sku });
									return document.location.replace(`/sku/${culinaryClass.sku}/`);
								}}
							/>
						}
						label={giveMeTheClassTimeNicely(culinaryClass)}
					/>
				))}
			</RadioGroup>
		) : (
			<Typography>No dates available.</Typography>
		);
	}
	render() {
		const { expanded } = this.state;

		return (
			<MuiThemeProvider theme={theme}>
				<Button
					onClick={this.handleClickOpen.bind(this)}
					style={{ padding: 0, textDecoration: 'underline', textTransform: 'none' }}
				>
					{this.props.children || 'Change Date'}
				</Button>
				<Dialog
					fullWidth={true}
					open={this.state.open}
					onClose={this.handleClose.bind(this)}
					onEnter={this.onEnter.bind(this)}
					PaperProps={{
						style: {}
					}}
					style={{
						overflow: 'overlay'
					}}
					scroll="paper"
					TransitionComponent={Transition}
					transitionDuration={400}
				>
					<DialogTitle
						style={{
							overflow: 'overlay'
						}}
					>
						Available dates for {this.state.culinaryClassName}:
					</DialogTitle>
					<DialogContent>
						<StyledExpansionPanel
							expanded={expanded === 'panel1'}
							onChange={this.handleChange('panel1')}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>{`${
									currentMonth.long
								} ${nowDate.getFullYear()}`}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								{this.returnMonthData(currentMonth)}
							</ExpansionPanelDetails>
						</StyledExpansionPanel>
						<StyledExpansionPanel
							expanded={expanded === 'panel2'}
							onChange={this.handleChange('panel2')}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>{`${
									nextMonth.long
								} ${nowDate.getFullYear()}`}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								{this.returnMonthData(nextMonth)}
							</ExpansionPanelDetails>
						</StyledExpansionPanel>
						<StyledExpansionPanel
							expanded={expanded === 'panel3'}
							onChange={this.handleChange('panel3')}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>{`${
									doubleNextMonth.long
								} ${nowDate.getFullYear()}`}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								{this.returnMonthData(doubleNextMonth)}
							</ExpansionPanelDetails>
						</StyledExpansionPanel>
					</DialogContent>
				</Dialog>
			</MuiThemeProvider>
		);
	}
}

ClassDateTimePicker.propTypes = {
	children: PropTypes.string,
	classTimeData: PropTypes.object,
	dispatch: PropTypes.func,
	selection: PropTypes.bool
};

ClassDateTimePicker.defaultProps = {};

export default connect((state, props) => ({
	...props,
	classTimeData: selectors.getClassTimeData ? selectors.getClassTimeData(state) : {}
}))(ClassDateTimePicker);
