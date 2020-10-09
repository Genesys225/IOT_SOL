import { IconButton, makeStyles, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
const useStyles = makeStyles({
	iframeWrap: {
		cursor: 'pointer',
		position: 'relative',
	},
	overlayExpandGraph: {
		position: 'absolute',
		background: 'transparent',
		top: 0,
		right: 0,
		zIndex: 1,
	},
});

function SensorIframe(props) {
	const theme = useTheme();
	const [iframeHover, setIframeHover] = useState(false);
	const classes = useStyles();
	// const [time, setTime] = useState(Date.now());
	const panelId = props.id ? hashCode(props.id) : null;
	const roomId = props.room;
	let parentBoundingRect = props.listItemRef && props.listItemRef.current
		? props.listItemRef.current.getBoundingClientRect()
		: { width: props.width || '400px' };
	const timePeriod = props.timePeriod || '6h';

	const iframeClickHandler = useCallback(
		function(event) {
			if (iframeHover) {
				event.preventDefault();
			}
		},
		[iframeHover]
	);
	useEffect(() => {
		window.addEventListener('blur', iframeClickHandler);
		if (props.listItemRef && props.listItemRef.current)
			parentBoundingRect = props.listItemRef.current;
		return () => {
			window.removeEventListener('blur', iframeClickHandler);
		};
	}, [iframeClickHandler, props]);

	const handleIFrameHover = () => {
		setIframeHover(true);
	};
	const handleIFrameOut = () => {
		setTimeout(() => {
			if (document.activeElement instanceof HTMLIFrameElement) {
				document.activeElement.blur();
				window.top.focus();
			}
		}, 0);
		setIframeHover(false);
	};
	return (
		<div
			className={classes.iframeWrap}
			onClick={(event) => event.preventDefault()}
			onMouseOver={handleIFrameHover}
			onMouseOut={handleIFrameOut}
		>
			<IconButton color="primary" className={classes.overlayExpandGraph}>
				<FullscreenIcon />
			</IconButton>
			<iframe
				className={classes.iframeWrap}
				src={`http://localhost:3000/d${
					panelId ? '-solo/MainRoom' : '/' + roomId
				}/all?orgId=1&refresh=25s&from=now-${timePeriod}&to=now&theme=${
					theme.palette.type
				}&kiosk${panelId && `&panelId=${panelId}`}`}
				width={parentBoundingRect.width}
				height={props.height || '300'}
				frameBorder="0"
				title="grafana"
			></iframe>
		</div>
	);
}
function hashCode(s) {
	return s.split('').reduce(function(a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
}
export default SensorIframe;
