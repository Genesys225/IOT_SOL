import React from 'react';

function SensorIframe(props) {
	// const sensor = useSelector(state => state.sensor)
	return (
		<iframe
			src="http://localhost:3000/d-solo/Dd24IjNGz/awsome?orgId=1&theme=light&panelId=6"
			width="450"
			height="200"
			frameborder="0"
			title="grafana"
		></iframe>
	);
}

export default SensorIframe;
