import { Box, IconButton, makeStyles, useTheme } from '@material-ui/core';
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
	const {
		id,
		room,
		listItemRef,
		width,
		height,
		timePeriod: timePeriodProp,
		type,
		...boxProps
	} = props;
	const theme = useTheme();
	const [iframeHover, setIframeHover] = useState(false);
	const classes = useStyles();
	// const [time, setTime] = useState(Date.now());
	const panelId = id ? hashCode(id) : null;
	const roomId = room;
	let parentBoundingRect =
		listItemRef && listItemRef.current
			? listItemRef.current.getBoundingClientRect()
			: { width: width || '400px' };
	const timePeriod = timePeriodProp || '6h';

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
		if (listItemRef && listItemRef.current)
			parentBoundingRect = listItemRef.current;
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
		<Box
			className={classes.iframeWrap}
			onClick={(event) => event.preventDefault()}
			onMouseOver={handleIFrameHover}
			onMouseOut={handleIFrameOut}
			{...boxProps}
		>
			{type !== 'gauge' && (
				<IconButton
					color="primary"
					className={classes.overlayExpandGraph}
				>
					<FullscreenIcon />
				</IconButton>
			)}
			<iframe
				className={classes.iframeWrap}
				src={`http:${window.location.origin
					.replace('http:', '')
					.replace('https:', '')}/grafana/d${
					panelId ? '-solo/MainRoom' : '/' + roomId
				}/all?orgId=1&refresh=25s&from=now-${timePeriod}&to=now&theme=${
					theme.palette.type
				}&kiosk${panelId && `&panelId=${panelId}`}`}
				width={parentBoundingRect.width}
				height={height || '300'}
				frameBorder="0"
				title="grafana"
			></iframe>
		</Box>
	);
}
function hashCode(s) {
	return s.split('').reduce(function(a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
}
export default SensorIframe;
