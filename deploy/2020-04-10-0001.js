require("./_migrate")("2020-04-10-0001", async ({ createDatabase, useDatabase }) => {

  /**************************************************/
  /*             START OF DEPLOYMENT                */
  /**************************************************/

  const job_templates = await createDatabase("job_templates")
  const job_index = await createDatabase("job_index")

  await job_templates.putSecurity({
    readers: { roles: ["_public"] }
  })
  await job_index.putSecurity({
    writers: { roles: ["_public"] },
    readers: { roles: ["_public"] }
  })

  job_templates.put({
    "_id": "void-uk-shopping",
    "void": true,
    "icon": "shopping_cart",
    "name": "Shopping Cart Demo",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "void-uk-dog-walking",
    "void": true,
    "icon": "pets",
    "name": "Dog Walking",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "void-uk-verification",
    "void": true,
    "icon": "verified_user",
    "name": "ID Verification",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "void-uk-childcare",
    "void": true,
    "icon": "child_friendly",
    "name": "Child Care",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "void-uk-taxi",
    "void": true,
    "icon": "local_taxi",
    "name": "Taxi",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "void-uk-diy",
    "void": true,
    "icon": "build",
    "name": "DIY",
    "fields": [
      {
        "label": "What you want",
        "name": "Order",
        "default": "",
        "inputType": "TextField",
        "validation": [["string"], ["required"]],
        "order": 10
      }
    ],
    "version": 1
  })

  job_templates.put({
    "_id": "base-job",
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
        "validation": [["string"], ["required"]],
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
