import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Icon } from '../../components/Icons/Icon-Library';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';
// import PartialMatchFilter from './partialMatchFilter.jsx';
import selectInputFilter from './selectInputFilter';

const useStyles = makeStyles({
	cellStyle: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '20px',
	},
	headerStyle: {
		fontSize: '20px',
	},
});

const AgDashboard = () => {
	const classes = useStyles();
	const [gridApi, setGridApi] = useState(null);
	const sensors = useSelector((state) => state.sensors.devices);
	const [gridColumnApi, setGridColumnApi] = useState(null);

	const onGridReady = (params) => {
		setGridApi(params.api);
		setGridColumnApi(params.columnApi);
		params.api.sizeColumnsToFit();
	};

	const defaultColDef = {
		filter: true,
		sortable: true,
		cellClass: classes.cellStyle,
		headerClass: classes.headerStyle,
	};

	return (
		<div
			style={{ height: '80vh', width: '100%', marginTop: 15 }}
			className="ag-theme-alpine"
		>
			<AgGridReact
				// properties
				rowData={sensors}
				defaultColDef={defaultColDef}
				rowHeight={60}
				auto
				frameworkComponents={{ renderIcon, selectInputFilter }}
				// events
				onGridReady={onGridReady}
			>
				<AgGridColumn
					field="deviceType"
					headerName=""
					cellRenderer="renderIcon"
					maxWidth={60}
					cellStyle={{
						justifyContent: 'center',
					}}
				></AgGridColumn>
				<AgGridColumn
					field="roomId"
					filter="selectInputFilter"
				></AgGridColumn>
				<AgGridColumn field="deviceId"></AgGridColumn>
				<AgGridColumn field="deviceType"></AgGridColumn>
			</AgGridReact>
		</div>
	);
};
function renderIcon(params) {
	return <Icon icon={params.value} size="40px" />;
}
export default AgDashboard;
