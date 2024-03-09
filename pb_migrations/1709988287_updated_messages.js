/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xzbnw45wjryxn01")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dg2rk1uc",
    "name": "text",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 500,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xzbnw45wjryxn01")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dg2rk1uc",
    "name": "text",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
