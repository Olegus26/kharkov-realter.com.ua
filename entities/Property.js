{
  "name": "Property",
    "type": "object",
      "properties": {
    "title": {
      "type": "string"
    },
    "price": {
      "type": "number"
    },
    "location": {
      "type": "string"
    },
    "type": {
      "type": "string",
        "enum": [
          "apartment",
          "house",
          "penthouse",
          "villa",
          "commercial"
        ]
    },
    "deal": {
      "type": "string",
        "enum": [
          "sale",
          "rent"
        ]
    },
    "area": {
      "type": "number"
    },
    "rooms": {
      "type": "number"
    },
    "floor": {
      "type": "number"
    },
    "floors_total": {
      "type": "number"
    },
    "description": {
      "type": "string"
    },
    "image_url": {
      "type": "string"
    },
    "images": {
      "type": "array",
        "items": {
        "type": "string"
      }
    },
    "featured": {
      "type": "boolean"
    },
    "new_building": {
      "type": "boolean"
    },
    "year_built": {
      "type": "number"
    }
  },
  "required": [
    "title",
    "price",
    "location",
    "type",
    "deal"
  ]
}