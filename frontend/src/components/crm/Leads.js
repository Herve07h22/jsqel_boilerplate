import React from "react";
import { Crud } from "../crud/Crud";

const Leads = () => (
  <Crud
    api="crm"
    ressource="leads"
    title="Prospects"
    exportCSV="Export data in a CSV file"
    fields={[
      { name: "email", label: "Email", position: "primary", type: "string" },
      { name: "first_name", label: "First name", position: "primary", type: "string" },
      { name: "last_name", label: "Last name", position: "primary", type: "string" },
      {
        name: "opportunity_id",
        label: "Opportunity",
        position: "primary",
        type: { key: "opportunity_id", ressource: "opportunities", field: "label" },
      },
    ]}
  />
);

export default Leads;
