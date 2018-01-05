import ApiHelper from "./api.js";

const tableQuerySelector = 'div#main-content > table.table > tbody';
const tableElement = document.querySelector(tableQuerySelector);

const editImageSrc = './images/edit.png';

/**
 * Initialize the table on the main view.
 */
export default async () => {
    const response = await ApiHelper.getAll();
    if (response === null) { return; }

    const { data: records } = response;

    await records.forEach(record => {
        tableElement.appendChild(buildTableEntry(record));
    });
};

/**
 * Create a table row from a record
 * 
 * @param { Object } record
 * @param { Number } record.baseId
 * @param { String } record.name
 * @param { String } record.type
 * @return { HTMLTableRowElement }   
 */
const buildTableEntry = (record) => {
    const row = document.createElement('tr');
    
    for(const prop of Object.values(record)) {
        const cell = document.createElement('td');

        cell.textContent = prop;

        row.appendChild(cell);
    }

    const editCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = editImageSrc;
    editCell.appendChild(img);
    row.appendChild(editCell);

    return row;
};

/**
 * Append the edit button to a table row
 * 
 * @param { HTMLTableRowElement } row 
 */
const appendEditButton = (row) => {
    const editCell = document.createElement('td');
    const img = document.createElement('img');
    
    img.src = editImageSrc;

    editCell.appendChild(img);
    row.appendChild(editCell);
};