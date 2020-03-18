<style>

</style>

<script>
//TODO: if not got rights then GOTO /
  import { useDatabase } from '../helpers.js'
  import { Form, Input, Select, Choice } from 'sveltejs-forms'
  import * as yup from 'yup'
  let schema
  let initialValues
  let handleSubmit
  (async () => {
    const groups = useDatabase({name:"groups"})


    schema = yup.object().shape({
      group: yup.object().shape({
        location: yup.string().required()
      }),
    })
    initialValues = {}
    handleSubmit = async ({detail:{values,setSubmitting,resetForm}}) => {
      (await groups).put({"Location": groups.location})
    }
  } )()
</script>

<div>create advocat group</div>
<Form
  {schema}  
  {initialValues} 
  validateOnBlur={false} 
  validateOnChange={true} 
  on:submit={handleSubmit}
  let:isSubmitting
  let:isValid
>
  <Input label="location"     name="group.location"placeholder="e.g. Leeds Central" />
  <button type="submit" disabled={isSubmitting}>Create Group</button>

</Form>