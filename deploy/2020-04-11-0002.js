require("./_migrate")("2020-04-11-0002", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    const job_templates = await useDatabase("job_templates") 
    
    await job_templates.get("base-job").then( doc => {
      job_templates.put({
        "_id": "base-job",
        "_rev": doc._rev,
        "void": true,
        "name": false,
        "fields": [
          {
            "label": "Name",
            "name": "Name",
            "default": { "custom": "account.name" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 10
          },
          {
            "label": "Address Line 1",
            "name": "addressLine1",
            "default": { "custom": "account.addressLine1" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 20
          },
          {
            "label": "Address Line 2",
            "name": "addressLine2",
            "default": { "custom": "account.addressLine2" },
            "inputType": "TextField",
            "validation": [["string"]],
            "order": 30
          },
          {
            "label": "Town/City",
            "name": "townCity",
            "default": { "custom": "account.city" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 40
          },
          {
            "label": "Post/Zip Code",
            "name": "postZipCode",
            "default": { "custom": "account.postcode" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 50
          },
          {
            "label": "Phone Number",
            "name": "phoneNumber",
            "default": { "custom": "account.phoneNumber" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 60
          }
        ],
        "version": 1
      })
    })
})
