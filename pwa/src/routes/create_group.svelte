<style>

</style>

<script>
//TODO: if not got rights then GOTO /
  import { useDatabase } from '../helpers.js'
  import { Form, Input, Select, Choice } from 'sveltejs-forms'
  import * as yup from 'yup'
  import * as uuid from 'uuid/v4';
  let schema
  let initialValues

  const groups = useDatabase({name:"groups"})


  schema = yup.object().shape({
    group: yup.object().shape({
      location: yup.string().required()
    }),
  })
  initialValues = {}



  const handleSubmit = ({detail:{values,setSubmitting,resetForm}}) => { 
    groups.put({_id: uuid, location: "leeds"}).then((result) =>
    {
      console.log(result)
      setSubmitting(false)      
    }).catch(error => console.log(error))  
  }
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