require("./_migrate")("2020-04-08-0001", async ({ createDatabase, useDatabase }) => {
  /**************************************************/
  /*             START OF DEPLOYMENT                */
  /**************************************************/

  const claim_templates = await useDatabase("claim_templates")

  console.log(claim_templates)
  await claim_templates.get("void-uk-covid-19-antibody-test").then( async doc => {
    await claim_templates.put({
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
          "label": "Date test was taken",
          "name": "date",
          "default": "",
          "inputType": "DateField",
          "validation": [["string"], ["required"]],
          "order": 20
        },
        {
          "label": "clear photo or scan of your test",
          "name": "photo",
          "default": [],
          "inputType": "FileField",
          "validation": [["array"], ["required"],["min","1"],["max","1"]],
          "maxSize": 1048576,
          "fileType": "image",
          "order": 30

        },
        {
          "label": "Outcome of testing",
          "name": "outcome",
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
