<style></style>
<script>
    import { useDatabase } from '../helpers.js'
    import { Form, Input, Select, Choice } from 'sveltejs-forms'
    import * as yup from 'yup'

    let isValid
    let isSubmitting
    
    const handleSubmit = ({detail:{values,setSubmitting,resetForm}}) => {
      console.log(values)
      setSubmitting(false)
      resetForm({
        user: { email: 'foo@bar.com' }
      })
    }

    const handleReset = () => {

    }

    const schema = yup.object().shape({
      user: yup.object().shape({
        email: yup.string().required().email()
      }),
      password: yup.string().required()
    })
  const langOptions = [
    { id: 'svelte', title: 'Svelte' },
    { id: 'react', title: 'React' },
    { id: 'angular', title: 'Angular' },
  ];

  const osOptions = [
    { id: 'macos', title: 'macOS' },
    { id: 'linux', title: 'Linux 🐧' },
    { id: 'windows', title: 'Windows' },
  ];

  const initialValues = {}
</script>

<svelte:head>
	<title>register</title>
</svelte:head>


<h1>this is a register page</h1>
<Form
  {schema}  
  {initialValues} 
  validateOnBlur={false} 
  validateOnChange={false} 
  on:submit={handleSubmit}
  on:reset={handleReset}
  let:isSubmitting
  let:isValid
>
  <Input name="user.email" label="Email" placeholder="e.g. user@example.com" />
  <Input name="password" type="password" placeholder="Password" />
  <Select name="language" options={langOptions} />
  <Choice name="os" options={osOptions} multiple />

  <button type="reset">Reset</button>
  <button type="submit" disabled={isSubmitting}>Sign in</button>
  The form is valid: {isValid}
</Form>