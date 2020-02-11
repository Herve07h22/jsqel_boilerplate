import React from 'react'
import {Crud } from '../crud/Crud'

const Opportunities = () => <Crud api="crm" ressource="opportunities" title="Opportunités d'affaires" 
                            uploadCSV="Importer un fichier CSV" exportCSV="Exporter les données" 
                            fields={[
                                {name:"label", label:"Libellé", position : "primary", type : "string"},
                                {name:"amount", label:"Montant", position : "primary", type : "float"},
                                {name:"created_at", label:"Date de création", position : "primary", type : "date", readonly:true},
                                {
                                    name:"probability", 
                                    label:"Probabilité", 
                                    position : "primary", 
                                    type :[
                                        {id:"sure", value:"Certain"}, 
                                        {id:"good", value:"Bonne"},
                                        {id:"hard", value:"Incertain"},
                                        {id:"testing", value:"Evaluation"},
                                    ] 
                                },
                            ]}
                            />

export default Opportunities

