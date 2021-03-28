const LINE_SEPARATOR = /\r?\n/;
const DELIMITER = ',';
let allEmployees = []

const loadData = (event) => {
   let inputData = event.target;
   let reader = new FileReader();
   reader.onload = function () {
      let text = reader.result;
      let splitedLines = text.split(LINE_SEPARATOR);
      let allEmployees = populateEmployees(splitedLines);
      let employeesWorkedTogether = findEmployyesWorkedTogether(allEmployees);
      let sortedEmployeesWorkedTogether = employeesWorkedTogether.sort((a, b) => b.days - a.days);
      printOutputMessage(sortedEmployeesWorkedTogether);
   }
   reader.readAsText(inputData.files[0]);
};

class Employee {
   constructor(employeeId, projectId, dateFrom, dateTo) {
      this.employeeId = employeeId;
      this.projectId = projectId;
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
   }
}

const findEmployyesWorkedTogether = (allEmployees) => {
   let tempEmployeeArr = [];
   for (let i = 0; i < allEmployees.length; i++) {
      for (let j = i + 1; j < allEmployees.length; j++) {
         if (allEmployees[i].employeeId !== allEmployees[j].employeeId && allEmployees[i].projectId === allEmployees[j].projectId) {
            let daysTogether = 0;
            const firstEmployeeWorkDates = {
               dateFrom: new Date(allEmployees[i].dateFrom).getTime(),
               dateTo: new Date(allEmployees[i].dateTo).getTime(),
            }
            const secondEmployeeWorkDates = {
               dateFrom: new Date(allEmployees[j].dateFrom).getTime(),
               dateTo: new Date(allEmployees[j].dateTo).getTime(),
            }
            if (!isValidEmployeeInfo(firstEmployeeWorkDates, i) || !isValidEmployeeInfo(secondEmployeeWorkDates, i)) {
               return;
            }
            if (secondEmployeeWorkDates.dateTo < firstEmployeeWorkDates.dateFrom || firstEmployeeWorkDates.dateTo < secondEmployeeWorkDates.dateFrom) {
               break;
            } else {
               if (firstEmployeeWorkDates.dateFrom <= secondEmployeeWorkDates.dateFrom && secondEmployeeWorkDates.dateTo <= firstEmployeeWorkDates.dateTo) {
                  daysTogether = daysCalc(secondEmployeeWorkDates.dateTo, secondEmployeeWorkDates.dateFrom);
               } else if (firstEmployeeWorkDates.dateFrom >= secondEmployeeWorkDates.dateFrom && secondEmployeeWorkDates.dateTo >= firstEmployeeWorkDates.dateTo) {
                  daysTogether = daysCalc(firstEmployeeWorkDates.dateTo, firstEmployeeWorkDates.dateFrom);
               } else if (firstEmployeeWorkDates.dateFrom <= secondEmployeeWorkDates.dateFrom && firstEmployeeWorkDates.dateTo <= secondEmployeeWorkDates.dateTo) {
                  daysTogether = daysCalc(firstEmployeeWorkDates.dateTo, secondEmployeeWorkDates.dateFrom);
               } else if (secondEmployeeWorkDates.dateFrom <= firstEmployeeWorkDates.dateFrom && secondEmployeeWorkDates.dateTo <= firstEmployeeWorkDates.dateTo) {
                  daysTogether = daysCalc(secondEmployeeWorkDates.dateTo, firstEmployeeWorkDates.dateFrom);
               }
               if (daysTogether > 0) {
                  tempEmployeeArr.push({ first: allEmployees[i].employeeId, second: allEmployees[j].employeeId, projectId: allEmployees[i].projectId, days: daysTogether });
               }
            }
         }
      }
   }
   return tempEmployeeArr;
};

const isValidEmployeeInfo = (employee, line) => {
   if (isNaN(employee.dateFrom) || isNaN(employee.dateTo)) {
      $('.errorMessage').text(`There is a wrong date format in your file on line ${line + 1}. Please, correct it and upload the file again.`);
      $('table').hide();
      $('.errorMessage').show();
      return false;
   }
   if (employee.dateTo < employee.dateFrom) {
      $('.errorMessage').text(`The end date cannont be earlier than the start date. Check line ${line + 1}. Please, correct it and upload the file again.`);
      $('table').hide();
      $('.errorMessage').show();
      return false;
   }
   return true;
}

const populateEmployees = (splitedLines) => {
   let employeeArr = [];
   for (const line of splitedLines) {
      let lineSplitted = line.split(DELIMITER);
      const employeeId = lineSplitted[0].trim();
      const projectId = lineSplitted[1].trim();
      const dateFrom = lineSplitted[2].trim();
      let dateTo = checkDateTo(lineSplitted[3]);
      const currentEmployee = new Employee(employeeId, projectId, dateFrom, dateTo);
      employeeArr.push(currentEmployee);
   }
   return employeeArr;
}

const checkDateTo = (dateTo) => {
   if (dateTo.toLowerCase() === 'null') {
      let today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = String(today.getFullYear());
      today = year + '-' + month + '-' + day;
      return today;
   } else {
      return dateTo.trim();
   }
}

const daysCalc = (end, start) => {
   const endDate = new Date(end).getTime();
   const startDate = new Date(start).getTime();
   return Math.abs(parseInt((endDate - startDate) / (24 * 3600 * 1000)));
};

const printOutputMessage = (sortedEmployeesWorkedTogether) => {
   $('.errorMessage').hide();
   $('table').find('thead').text('');
   $('table').find('tbody').text('');
   $('table').find('thead').append(`<tr>
      <td>Employee ID #1</td>
      <td>Employee ID #2</td>
      <td>Project ID</td>
      <td>Days worked</td>
   </tr>`);
   $('table').find('tbody').append(`<tr>
   <td>${sortedEmployeesWorkedTogether[0].first}</td>
   <td>${sortedEmployeesWorkedTogether[0].second}</td>
   <td>${sortedEmployeesWorkedTogether[0].projectId}</td>
   <td>${sortedEmployeesWorkedTogether[0].days}</td>
</tr>`);
   $('table').show();
}

