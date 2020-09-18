import React from 'react'
import { CSVLink } from 'react-csv'
import {Button} from 'react-bootstrap'

export const ExportReactCSV = ({csvData, fileName}) => {
    return (
        <Button bsStyle="success" className='exportbtn'>
            <CSVLink data={csvData} filename={fileName}>Export Results</CSVLink>
        </Button>
    )
}