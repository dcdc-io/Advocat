require("./_migrate")("2020-04-01-0001", async ({ createDatabase, useDatabase }) => {

  /**************************************************/
  /*             START OF DEPLOYMENT                */
  /**************************************************/

  // create void-uk-covid-19-antibody-test
  const claim_templates = await useDatabase("claim_templates")
  await claim_templates.post(
    {
      "_id": "void-uk-covid-19-antibody-test",
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
          "validation": [["string"], ["required"]]
        },
        {
          "label": "Date",
          "name": "date",
          "default": "",
          "inputType": "DateField",
          "validation": [["string"], ["required"]]
        },
        {
          "label": "Photo",
          "name": "photo",
          "default": {},
          "inputType": "FileField",
          "validation": [["object"], ["required"]]
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
          "validation": [["string"], ["required"]]
        }
      ],
      "version": 1
    }
  )
})