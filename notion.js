const {Client} = require('@notionhq/client')
const notion = new Client({auth: process.env.NOTION_API_KEY})

/**
{
  Description: { name: 'Description', type: 'rich_text', rich_text: {} },
  Type: { name: 'Type', type: 'select' },
  complite: { name: 'complite', type: 'checkbox' },
  Date: { name: 'Date', type: 'date' },
  Name: { name: 'Name', type: 'title' }
}
 * */

async function getProperties() {
    const database = await notion.databases.retrieve({database_id: process.env.NOTION_DATABASE_ID})
    return database.properties
}

async function getProperty(propertyKey){
    let result
    const properties = await getProperties()
    Object.keys(properties).forEach(key =>{
        const property = properties[key]
        if(property.id === propertyKey){
            result = property
        }
    })
    return result
}

async function getTypes(){
    const property = await getProperty(process.env.NOTION_TYPE_ID)
    return property.select.options
}

async function getDataBase() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
    });

    return response.results
}

async function getRows(){
    const DB = await getDataBase()

    return DB.map(row =>{
        return {
            id: row.id,
            title: row.properties['Name']['title'][0]['plain_text'],
            description: row.properties['Description']['rich_text'][0]['plain_text'],
            type: row.properties['Type']['select'].name,
            complete: row.properties['complete']['checkbox'],
            date: row.properties['Date']['date'].start,
        }
    })
}


async function creatRow(arg) {
    const {title, description, type, date} = arg

    return await notion.pages.create({
        parent: {
            type: 'database_id',
            database_id: process.env.NOTION_DATABASE_ID
        },
        properties: {
            [process.env.NOTION_NAME_ID]: {
                title: [
                    {
                        text: {
                            content: title
                        }
                    }
                ]
            },
            [process.env.NOTION_DATE_ID]: {
                date: {
                    start: date
                }
            },
            [process.env.NOTION_DESCRIPTION_ID]: {
                rich_text: [
                    {
                        text: {
                            content: description
                        }
                    }
                ]
            },
            [process.env.NOTION_TYPE_ID]: {
                select: {
                    name: type,
                }
            }
        }
    });
}



module.exports = {
    getTypes,
    getRows,
    creatRow
}
