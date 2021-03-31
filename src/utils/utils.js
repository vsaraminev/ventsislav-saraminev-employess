import { DELIMITER } from './constants';
const utils = {};

utils.populateEmployees = (splitedLines) => {
   let employeeArr = [];
   for (const line of splitedLines) {
      let lineSplitted = line.split(DELIMITER);
      const employeeId = lineSplitted[0].trim();
      let workExperience = {}
      workExperience.projectId =lineSplitted[1].trim();
      workExperience.dateFrom = lineSplitted[2].trim();
      workExperience.dateTo = checkDateTo(lineSplitted[3]);
      let ifExists = employeeArr.find(employee => employee.employeeId === employeeId);
      if (ifExists) {
         let employee = employeeArr.filter(employee => employee.employeeId === employeeId);
         employee[0].workExperience.push(workExperience);
      } else {
         let currentEmployee = {};
         currentEmployee.employeeId = employeeId;
         currentEmployee.workExperience = [workExperience];
         employeeArr.push(currentEmployee);
      }
   }
   return employeeArr;
};

utils.findEmployeePair = (employees) => {
   let longestWorkPeriod = 0;
   let totalWorkDays = 0;
   for (let i = 0; i < employees.length; i++) {
      for (let j = i + 1; j < employees.length; j++) {
         let firstEmplyeeProjects = employees[i].workExperience;
         let secondEmployeeProjects = employees[j].workExperience;
         let sharedProjects = []
         firstEmplyeeProjects.filter(project => {
            let isSharedProject = secondEmployeeProjects.find(pr => pr.projectId === project.projectId)
            if(isSharedProject) {
               sharedProjects.push({
                  projectId: project.projectId,
                  firstEmpId: employees[i].employeeId,
                  firstEmpDateFrom: project.dateFrom,
                  firstEmpDateTo: project.dateTo,
                  secondEmp: employees[j].employeeId,
                  secondEmpDateFrom: isSharedProject.dateFrom,
                  secondEmpDateTo: isSharedProject.dateTo
               });
            }
           return "";
         });
         for (let i = 0; i < sharedProjects.length; i++) {
            totalWorkDays += utils.findTotalDaysWorkedTogether(sharedProjects[i], i);
         }
         if (totalWorkDays > longestWorkPeriod) {
            longestWorkPeriod = totalWorkDays;
            const projects = sharedProjects.map(pr => pr.projectId);
            let resultToOutput = {
               firstEmployeeId: employees[i].employeeId,
               secondEmployeeId: employees[j].employeeId,
               projects,
               days: longestWorkPeriod
            }
            return resultToOutput;
         }
      }
   }
};

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
};

utils.findTotalDaysWorkedTogether = (project, i) => {
   let daysTogether = 0;
   const firstEmployeeWorkDates = {
      dateFrom: new Date(project.firstEmpDateFrom).getTime(),
      dateTo: new Date(project.firstEmpDateTo).getTime(),
   }
   const secondEmployeeWorkDates = {
      dateFrom: new Date(project.secondEmpDateFrom).getTime(),
      dateTo: new Date(project.secondEmpDateTo).getTime(),
   }
   if (secondEmployeeWorkDates.dateTo < firstEmployeeWorkDates.dateFrom || firstEmployeeWorkDates.dateTo < secondEmployeeWorkDates.dateFrom) {
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
   }
   return daysTogether;
};

const daysCalc = (end, start) => {
   const endDate = new Date(end).getTime();
   const startDate = new Date(start).getTime();
   return Math.abs(parseInt((endDate - startDate) / (24 * 3600 * 1000)));
};

export default utils;
