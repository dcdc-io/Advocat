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
        "name": "I am a GP(DEMO)",
        "fields": [
          {
              "label": "name",
              "name": "Full Name",
              "default": {"custom": "account.name"},
              "inputType": "TextField",
              "validation": [["string"], ["required"]]
          },
          {
            "label": "GMC Number",
            "name": "gmc",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required"]]
          },
          {
            "label": "video of you holding ID and saying this is for advocat.",
            "name": "video",
            "default": {},
            "inputType": "FileField",
            "validation": [["object"], ["required"]]
          },        
        ],
        "version": 1
      }
    )
  })