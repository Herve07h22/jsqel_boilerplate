import React from "react";
import { Crud } from "../crud/Crud";

const Opportunities = () => (
  <Crud
    api="generic_crud" // see backend/endpoints/generic_crud.js
    ressource="opportunities"
    title="Opportunités d'affaires"
    fields={[
      { name: "label", label: "Name", position: "primary", type: "string" },
      { name: "amount", label: "Amount (€)", position: "primary", type: "float" },
      { name: "created_at", label: "Created at", position: "primary", type: "date", readonly: true },
      {
        name: "probability",
        label: "Probability",
        position: "primary",
        type: [
          { id: "sure", value: "Sure" },
          { id: "good", value: "Good" },
          { id: "hard", value: "Hard" },
          { id: "testing", value: "Test the market" },
        ],
      },
    ]}
  />
);

export default Opportunities;
