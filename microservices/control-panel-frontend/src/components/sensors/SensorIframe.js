import React from 'react';

function SensorIframe(props) {
	const panelId = hashCode(props.id)
	// const sensor = useSelector(state => state.sensor)
	return (
		<iframe
			src={`http://localhost:3000/d-solo/All/all?orgId=1&theme=light&panelId=${panelId}`}
			width="450"
			height="200"
			frameborder="0"
			title="grafana"
		></iframe>
	);
}
function hashCode(s){
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }
export default SensorIframe;
