const schema = {
    "_id": "AntiBodyTest",
    /* this value indicates this schema is void and 
      as such signatures are flagged as inadmissable */
    "void": true, 
    "name": "Positive AntiBody Test",
    "fields": [
      {
        "label": "Serial Number",
        "name": "serialNumber",
        "inputType": "TextField",
        "validation": [["string"],["required"]]
      },
      {
        "label": "Date",
        "name": "date",
        "inputType": "DateField",
        "validation": [["string"],["required"]]
      },
      {
        "label": "Photo",
        "name": "photo",
        "inputType": "FileField",
        "validation": [["object"],["required"]]
      }
    ],
    "version": 1
  }