import { Drawer, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SensorIframe from '../sensors/SensorIframe';
const defaultDrawerWidth = 778;
const defaultDrawerHeight = 1000;
const minDrawerWidth = 400;
const maxDrawerWidth = 778;
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	drawer: {
		// @ts-ignore
		width: (props) => (props ? props.drawerWidth : defaultDrawerWidth),
		flexShrink: 0,
	},
	drawerPaper: {
		width: defaultDrawerWidth,
		overflow: 'hidden',
	},
	drawerContainer: {
		padding: '0 0 4px',
		position: 'relative',
		overflow: 'hidden',
	},
	dragger: {
		width: '5px',
		cursor: 'ew-resize',
		padding: '4px 0 0',
		borderTop: '1px solid #ddd',
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		zIndex: 100,
		backgroundColor: '#f4f7f9',
	},
}));
function RoomSummery() {
	const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);
	const [drawerHeight, setDrawerHeight] = useState(defaultDrawerHeight);

	const ref = useRef(null);
	const classes = useStyles({ drawerWidth });

	const handleMouseDown = (e) => {
		document.addEventListener('mouseup', handleMouseUp, true);
		document.addEventListener('mousemove', handleMouseMove, true);
	};

	const handleMouseUp = () => {
		document.removeEventListener('mouseup', handleMouseUp, true);
		document.removeEventListener('mousemove', handleMouseMove, true);
	};

	const handleMouseMove = useCallback((e) => {
		const newWidth = document.body.offsetWidth - e.clientX;
		console.log(e.clientX, document.body.offsetWidth - e.clientX);
		if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
			setDrawerWidth(newWidth);
		}
	}, []);

	useEffect(() => {
		if (ref.current && ref.current.getBoundingClientRect().height > 0) {
			console.log(ref.current.getBoundingClientRect().height);
			setDrawerHeight(ref.current.getBoundingClientRect().height);
		}
	}, [ref]);

	return (
		<>
			<Drawer
				ref={ref}
				className={classes.drawer}
				variant="permanent"
				anchor="right"
				PaperProps={{
					style: { width: drawerWidth, paddingLeft: '5px' },
				}}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div
					onMouseDown={(e) => handleMouseDown(e)}
					className={classes.dragger}
				/>
				<SensorIframe
					room={'All'}
					listItemRef={false}
					height={4860}
					width={drawerWidth - 10}
				/>
			</Drawer>
		</>
	);
}

export default RoomSummery;
