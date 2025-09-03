import { Container } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import PageHeader from "../../../../components/pageHeader";
import PaySheetForm from "./paySheetForm";
import PayrollEmployeeForm from "./payrollEmployeeForm";

function PayRollForm() {
  const { source, id }: any = useParams();
  const location = useLocation()

  function camelToPascalWithSpace(inputString: string) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      const char = inputString[i];
      if (char === char.toUpperCase()) {
        result += " " + char;
      } else {
        result += char;
      }
    }
    return result.trim().charAt(0).toUpperCase() + result.slice(1);
  }

  return (
    <>
      <PageHeader
        firstPathLink='/usr/payroll/employees'
        firstPathText='Payroll Employees'
        secondPathLink={location.pathname}
        secondPathText={id === "create" ? "Create Employee" : 'Update Employee'}
        onSubmit={null}
        goBack={-1}
        title={
          id === "create"
            ? "Create" + `- ${camelToPascalWithSpace(source)}`
            : "Update" + `- ${camelToPascalWithSpace(source)}`
        }
      />

      <Container className="mt-2">
        <div className="adminTable-Box1">
          <div className="adminTable-Box2">
            <div className="white-card">
              <div>
                {source === "employees" ? (
                  <PayrollEmployeeForm id={id} />
                ) : source === "paysheet" ? (
                  <PaySheetForm id={id} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default PayRollForm;
