import React, { useState } from 'react';

function SensorIframe(props) {
	const [time, setTime] = useState(Date.now());
	const panelId = hashCode(props.id);
	const parentBoundingRect = props.listItemRef.current.getBoundingClientRect();
	// const sensor = useSelector(state => state.sensor)
	return (
		<iframe
			src={`http://localhost:3000/d-solo/All/all?orgId=1&refresh=25s&theme=light&kiosk&panelId=${panelId}`}
			width={parentBoundingRect.width - 30}
			height="300"
			title="grafana"
		></iframe>
	);
}
function hashCode(s) {
	return s.split('').reduce(function(a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
}
export default SensorIframe;
