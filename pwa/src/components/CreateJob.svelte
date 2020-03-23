<script>
    import { useDatabase } from '../helpers.js'
    import sjcl from "sjcl"
    import { Form, Input, Select, Choice } from 'sveltejs-forms'
    import * as yup from "yup"
    import { Buffer } from 'buffer'

    export let form = null

    const jobs = useDatabase({name:"jobs"})
    const jobsKeys = useDatabase({name:"jobsKeys"})

    let urgency = 0

    let isSubmitting
    let isValid

    let details = {
        userId: "barry67",
        locations: [
            {
                name: "Barry",
                address: "100 Barry Lane, Leeds, LS61EY",
                tel: "07777777777",
                instructions: "leave behind bin"
            }
        ],
        steps: {
            1: "do stuff",
            2: "do more stuff",
            3: { goto: "locations:0" }
        }
    }

    let job = {
        description: "deliver toilet paper",
        postcodes: ["LS6", "WF7"],
        restrictions: [],
        details: details,
        dispatcherId: "dispatcher_guy69"
    }

    const handleSubmit = async ({detail:{
        values: job, setSubmitting, resetForm
    }}) => {
        job.version = "1.0.0"
        const detailsKey = Buffer.from(sjcl.random.randomWords(8)).toString("hex")
        const amendkey = Buffer.from(sjcl.random.randomWords(8)).toString("hex")
        // job details encryption
        details.amendKey = amendKey // amendKey
        job.details = sjcl.encrypt(detailsKey, JSON.stringify(details))
        await jobsKeys.post({ detailsKey })
        await jobs.post(job)
    }

    const schema = yup.object().shape({
        description: yup.string().required().min(5).max(150),

    })

    const initialValues = {}
</script>
<Form
  {schema}
  {initialValues} 
  validateOnBlur={false} 
  validateOnChange={true} 
  on:submit={handleSubmit}
  let:isSubmitting
  let:isValid
  bind:this={form}
>
    <Input label="Description" type="text" name="description" />
    <button type="submit" disabled={isSubmitting}>Save Job</button>
</Form>