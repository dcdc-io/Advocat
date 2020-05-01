require("./_migrate")("2020-05-01-0001", async ({ createDatabase, useDatabase }) => {
    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/
  
    const claim_templates = await useDatabase("claim_templates")
    const job_templates = await useDatabase("job_templates")
  
    await claim_templates.get("void-uk-covid-19-antibody-test").then(({_id, _rev}) => claim_templates.put({
        _id, _rev,
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
            "validation": [["string"], ["required", "Serial Number is required"]],
            "order": 10
          },
          {
            "label": "Date test was taken",
            "name": "date",
            "default": "",
            "inputType": "DateField",
            "validation": [["string"], ["required", "Date is required"]],
            "order": 20
          },
          {
            "label": "clear photo or scan of your test",
            "name": "photo",
            "default": [],
            "inputType": "FileField",
            "validation": [["array"], ["required"],["min","1"],["max","4"]],
            "maxSize": 5242880,
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
              { "text": "IgM Positive", "value": "IgM" },
              { "text": "IgG Positive", "value": "IgG" },
              { "text": "IgM/IgG Positive", "value": "IgMIgG" },
              { "text": "Inconclusive", "value": "inconclusive" }
            ],
            "validation": [["string"], ["required", "Test result is required"]],
            "order": 40
          }
        ],
        "version": 2
    }))
    
    
    await job_templates.get("void-uk-shopping").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "shopping_cart",
        "name": "Shopping Cart Demo",
        "fields": [
          {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
          }
        ],
        "version": 2
    }))

    await job_templates.get("void-uk-dog-walking").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "pets",
        "name": "Dog Walking",
        "fields": [
            {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
            }
        ],
        "version": 2
    }))

    await job_templates.get("void-uk-verification").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "verified_user",
        "name": "ID Verification",
        "fields": [
            {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
            }
        ],
        "version": 2
    }))

    await job_templates.get("void-uk-childcare").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "child_friendly",
        "name": "Child Care",
        "fields": [
            {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
            }
        ],
        "version": 2
    }))

    await job_templates.get("void-uk-taxi").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "local_taxi",
        "name": "Taxi",
        "fields": [
            {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
            }
        ],
        "version": 2
    }))

    await job_templates.get("void-uk-diy").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "icon": "build",
        "name": "DIY",
        "fields": [
            {
            "label": "What you want",
            "name": "Order",
            "default": "",
            "inputType": "TextField",
            "validation": [["string"], ["required", "Details are required"]],
            "order": 10
            }
        ],
        "version": 2
    }))

    await job_templates.get("base-job").then(({_id, _rev}) => job_templates.put({
        _id, _rev,
        "void": true,
        "name": false,
        "fields": [
            {
            "label": "Name",
            "name": "Name",
            "default": { "custom": "account.name" },
            "inputType": "TextField",
            "validation": [["string"], ["required", "Name is required"]],
            "order": 10
            },
            {
            "label": "Address Line 1",
            "name": "addressLine1",
            "default": { "custom": "account.addressLine1" },
            "inputType": "TextField",
            "validation": [["string"], ["required", "Address is required"]],
            "order": 20
            },
            {
            "label": "Address Line 2",
            "name": "addressLine2",
            "default": { "custom": "account.addressLine2" },
            "inputType": "TextField",
            "validation": [["string"], ["required"]],
            "order": 30
            },
            {
            "label": "Town/City",
            "name": "townCity",
            "default": { "custom": "account.city" },
            "inputType": "TextField",
            "validation": [["string"], ["required", "Town/City is required"]],
            "order": 40
            },
            {
            "label": "Post/Zip Code",
            "name": "postZipCode",
            "default": { "custom": "account.postcode" },
            "inputType": "TextField",
            "validation": [["string"], ["required", "Postcode is required"]],
            "order": 50
            },
            {
            "label": "Phone Number",
            "name": "phoneNumber",
            "default": { "custom": "account.phoneNumber" },
            "inputType": "TextField",
            "validation": [["string"], ["required", "Phone Number is required"]],
            "order": 60
            }
        ],
        "version": 2
    }))
});