import React from 'react';

const Output = (props) => {
	let { firstEmployeeId, secondEmployeeId, projects, days} = props.data;
	projects = projects.join(', ');
   return (
		<table>
			<thead>
				<tr>
					<td>Employee ID #1</td>
      			<td>Employee ID #2</td>
      			<td>Project ID</td>
      			<td>Days worked</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{firstEmployeeId}</td>
					<td>{secondEmployeeId}</td>
					<td>{projects}</td>
					<td>{days}</td>
				</tr>
			</tbody>
  		</table>
   );
}

export default Output;