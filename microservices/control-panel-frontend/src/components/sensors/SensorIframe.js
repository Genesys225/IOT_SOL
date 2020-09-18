import { Box, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles({
	iframeWrap: {
		cursor: 'pointer',
	},
});

function SensorIframe(props) {
	const [iframeHover, setIframeHover] = useState(false);
	const classes = useStyles();
	const [time, setTime] = useState(Date.now());
	const panelId = hashCode(props.id);
	const parentBoundingRect = props.listItemRef.current.getBoundingClientRect();
	const timePeriod = props.timePeriod || '6h';

	function iframeClickHandler(event) {
		if (iframeHover) {
			event.preventDefault();
			console.log('Wow! Iframe Click!');
		}
	}
	useEffect(() => {
		window.addEventListener('blur', iframeClickHandler);
		return () => {
			window.removeEventListener('blur', iframeClickHandler);
		};
	}, [iframeHover]);

	const handleIFrameHover = () => {
		setIframeHover(true);
	};
	const handleIFrameOut = () => {
		document.activeElement.blur();
		window.top.focus();
		setIframeHover(false);
	};
	return (
		<div
			className={classes.iframeWrap}
			onClick={(event) => event.preventDefault()}
			onMouseOver={handleIFrameHover}
			onMouseOut={handleIFrameOut}
		>
			<iframe
				className={classes.iframeWrap}
				src={`http://localhost:3000/d-solo/All/all?orgId=1&refresh=25s&from=now-${timePeriod}&to=now&theme=light&kiosk&panelId=${panelId}`}
				width={parentBoundingRect.width - 30}
				height="300"
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
