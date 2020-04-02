  require("./_migrate")("2020-04-02-0001", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/
  
    // create void-uk-covid-19-antibody-test
    const claim_templates = await useDatabase("claim_templates")
    await claim_templates.post(
      {
        "_id": "void-uk-is-gp",
        /* this value indicates this schema is void and 
          as such signatures are flagged as inadmissable */
        "void": true,
        /* this value indicates you can only make one claim of this type */
        "unique": true,
        "name": "UK Registered GP (DEMO)",
        "fields": [
          {
              "label": "Full Name",
              "name": "name",
              "default": {"custom": "account.name"},
              "inputType": "TextField",
              "validation": [["string"], ["required"]],
              "order": 10
          },
          {
            "label": "GMC Number",
            "name": "gmc",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 20
          },
          {
            "label": "video of you holding ID and saying this is for advocat.",
            "name": "video",
            "default": {},
            "inputType": "FileField",
            "validation": [["object"], ["required"]],
            "order": 30
          },        
        ],
        "version": 1
      }
    )
    
    await claim_templates.get("void-uk-covid-19-antibody-test").then( doc => {
      return doc.put({
        "_id": "void-uk-covid-19-antibody-test",
        "_rev": doc._rev,
        /* this value indicates this schema is void and 
          as such signatures are flagged as inadmissable */
        "void": true,
        "name": "UK COVID-19 Antibody Test (DEMO)",
        "fields": [
          {
            "label": "Serial Number",
            "name": "serialNumber",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 10
          },
          {
            "label": "Date",
            "name": "date",
            "default": "",
            "inputType": "DateField",
            "validation": [["string"], ["required"]],
            "order": 20
          },
          {
            "label": "Photo",
            "name": "photo",
            "default": {},
            "inputType": "FileField",
            "validation": [["object"], ["required"]],
            "order": 30

          },
          {
            "label": "Outcome",
            "name": "outome",
            "default": "",
            "inputType": "SelectField",
            "values": [
              { "text": "Negative", "value": "negative" },
              { "text": "Positive", "value": "positive" },
              { "text": "Inconclusive", "value": "inconclusive" }
            ],
            "validation": [["string"], ["required"]],
            "order": 40
          }
        ],
        "version": 1
      })
    });
    
})