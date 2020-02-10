import React from 'react'
import {Crud, choice} from '../crud/Crud'

const Opportunities = () => <Crud api="crm" ressource="opportunities" title="Opportunités d'affaires" 
                            fields={[
                                {name:"label", label:"Libellé", position : "primary", type : "string"},
                                {name:"amount", label:"Montant", position : "primary", type : "float"},
                                {
                                    name:"probability", 
                                    label:"Probabilité", 
                                    position : "primary", 
                                    type : choice([
                                        {id:"sure", value:"Certain"}, 
                                        {id:"good", value:"Certain"},
                                        {id:"hard", value:"Incertain"},
                                        {id:"testing", value:"Evaluation"},
                                    ]) 
                                },
                            ]}
                            />

export default Opportunities

