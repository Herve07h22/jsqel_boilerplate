import React from 'react'
import {Crud } from '../crud/Crud'

const Leads = () => <Crud api="crm" ressource="leads" title="Prospects" 
                        uploadCSV="Importer un fichier CSV" exportCSV="Exporter les données" 
                        fields={[
                            {name:"email", label:"Email", position : "primary", type : "string"},
                            {name:"first_name", label:"Prénom", position : "primary", type : "string"},
                            {name:"last_name", label:"Nom", position : "primary", type : "string"},
                            {
                                name:"opportunity_id", 
                                label:"Opportunité", 
                                position : "primary", 
                                type : {key:"opportunity_id", ressource:"opportunities", field:"label"}
                            },
                        ]}
                        />

export default Leads
