<style type="text/scss" global>
  .sveltejs-forms {
    background-color: lightgray;
    display: inline-block;
    padding: 1rem;
    .field {
      margin-bottom: 1rem;
      &.error {
        input {
          border: 1px solid red;
        }
        .message {
          margin-top: 0.2rem;
          color: red;
          font-size: 0.8rem;
        }
      }
    }
  }
</style>
<script>
  import { useDatabase, signUp } from '../helpers.js'
  import { Form, Input, Select, Choice } from 'sveltejs-forms'
  import * as yup from 'yup'
  
  let isValid 
  let isSubmitting
  
  const users = useDatabase({name:""}).__remote
  const handleSubmit = ({detail:{values,setSubmitting,resetForm}}) => { 
    signUp(values.user.email, values.user.password).then((result) =>
    {
      console.log(result)
      setSubmitting(false)      
    })  
  }

  const handleReset = () => {

  }

  const schema = yup.object().shape({
    user: yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
      passwordConfirm: yup.string().required().oneOf([yup.ref('password')],null)
    }),
  })
  const initialValues = {}
</script>

<svelte:head>
	<title>register</title>
</svelte:head>

<h1>become an advocat.</h1>
<Form
  {schema}  
  {initialValues} 
  validateOnBlur={false} 
  validateOnChange={true} 
  on:submit={handleSubmit}
  let:isSubmitting
  let:isValid
>
  <Input label="email"            name="user.email"placeholder="e.g. user@example.com" />
  <Input label="password"         name="user.password" type="password" placeholder="Password" />
  <Input label="re-type password" name="user.passwordConfirm" type="password" placeholder="Password" />

  <!-- <Select name="language" options={langOptions} /> -->  
  <!-- <Choice name="os" options={osOptions} multiple /> -->
  <!-- <button type="reset">Reset</button> -->

  <button type="submit" disabled={isSubmitting}>Sign in</button>
  The form is valid: {isValid}
</Form>